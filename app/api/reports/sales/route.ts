import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { getDatabase } from '@/lib/database';

// Helper to format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Helper to format datetime in Indian format with 12-hour time
function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Helper to get month name
function getMonthName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
}

// GET sale bills for Excel export
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const date = searchParams.get('date');

    console.log('Sales report request:', { year, month, date });

    let db;
    try {
      db = getDatabase();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Build query based on filters
    let query = `
      SELECT 
        sb.id as bill_id,
        sb.bill_date,
        sb.shop_name,
        sb.mobile_number,
        sb.total_amount,
        sb.amount_paid,
        sb.amount_remaining,
        sb.repayment_date,
        sb.labour_charges,
        sb.weighing_charges,
        sb.created_at,
        sbi.crop_name,
        sbi.quantity,
        sbi.rate,
        sbi.total as item_total
      FROM SaleBills sb
      LEFT JOIN SaleBillItems sbi ON sb.id = sbi.bill_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    if (date) {
      // Specific date filter
      query += ` AND sb.bill_date = ?`;
      params.push(date);
    } else if (year && month) {
      // Year + month filter
      query += ` AND strftime('%Y', sb.bill_date) = ? AND strftime('%m', sb.bill_date) = ?`;
      params.push(year, month.padStart(2, '0'));
    } else if (year) {
      // Year only filter
      query += ` AND strftime('%Y', sb.bill_date) = ?`;
      params.push(year);
    }
    
    query += ` ORDER BY sb.bill_date ASC, sb.id ASC`;
    
    const rows = db.prepare(query).all(...params);
    
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No sale bills found for the selected period' },
        { status: 404 }
      );
    }
    
    // Group data by bill_id (one row per bill)
    const billsMap = new Map();
    
    rows.forEach((row: any) => {
      if (!billsMap.has(row.bill_id)) {
        billsMap.set(row.bill_id, {
          bill_id: row.bill_id,
          bill_date: row.bill_date,
          shop_name: row.shop_name,
          mobile_number: row.mobile_number,
          total_amount: row.total_amount,
          amount_paid: row.amount_paid,
          amount_remaining: row.amount_remaining,
          repayment_date: row.repayment_date,
          labour_charges: row.labour_charges,
          weighing_charges: row.weighing_charges,
          created_at: row.created_at,
          items: []
        });
      }
      
      // Add item to the bill
      if (row.crop_name) {
        billsMap.get(row.bill_id).items.push({
          crop_name: row.crop_name,
          quantity: row.quantity,
          rate: row.rate,
          item_total: row.item_total
        });
      }
    });
    
    // Group bills by month for Excel formatting
    const groupedData: { [key: string]: any[] } = {};
    
    billsMap.forEach((bill) => {
      const monthKey = getMonthName(bill.bill_date);
      if (!groupedData[monthKey]) {
        groupedData[monthKey] = [];
      }
      
      // Combine all items into a single formatted string with proper spacing
      const itemsText = bill.items.map((item: any) => 
        `${item.crop_name} – Qty: ${item.quantity}, Rate: ₹${item.rate}, Amount: ₹${item.item_total}`
      ).join('\n\n'); // Add double line breaks between items for better spacing
      
      // Calculate subtotal (sum of all items)
      const subtotal = bill.items.reduce((sum: number, item: any) => sum + item.item_total, 0);
      
      groupedData[monthKey].push({
        'Date': formatDate(bill.bill_date),
        'Bill Number': `S${bill.bill_id}`,
        'Bill Type': 'Sale',
        'Shop Name': bill.shop_name,
        'Mobile Number': bill.mobile_number && bill.mobile_number.trim() ? bill.mobile_number : '-',
        'Items Sold': itemsText,
        'Subtotal (₹)': subtotal,
        'Labour Charge (₹)': bill.labour_charges || 0,
        'Weighing Charge (₹)': bill.weighing_charges || 0,
        'Total Bill Amount (₹)': bill.total_amount,
        'Amount Received (₹)': bill.amount_paid,
        'Remaining (₹)': bill.amount_remaining,
        'Repayment Date': bill.repayment_date ? formatDate(bill.repayment_date) : '-',
        'Bill Created At': formatDate(bill.created_at),
      });
    });
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Build worksheet data with month headers
    const wsData: any[] = [];
    const monthKeys = Object.keys(groupedData).sort();
    
    monthKeys.forEach(monthKey => {
      // Add month header row
      wsData.push({});
      wsData.push({ 'Date': `===== ${monthKey} =====` });
      
      // Add bills for this month
      groupedData[monthKey].forEach((bill, index) => {
        wsData.push(bill);
        
        // Add 2 empty rows after each bill except the last one in the month
        if (index < groupedData[monthKey].length - 1) {
          wsData.push({});
          wsData.push({});
        }
      });
      
      // Add extra spacing between months
      wsData.push({});
      wsData.push({});
    });
    
    const ws = XLSX.utils.json_to_sheet(wsData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 12 },  // Date
      { wch: 12 },  // Bill Number
      { wch: 12 },  // Bill Type
      { wch: 20 },  // Shop Name
      { wch: 15 },  // Mobile Number
      { wch: 45 },  // Items Sold (wider for multi-line content with spacing)
      { wch: 12 },  // Subtotal
      { wch: 15 },  // Labour Charge
      { wch: 16 },  // Weighing Charge
      { wch: 18 },  // Total Bill Amount
      { wch: 16 },  // Amount Received
      { wch: 12 },  // Remaining
      { wch: 14 },  // Repayment Date
      { wch: 16 },  // Bill Created At
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
    
    // Generate filename based on filters
    let filename = 'sales-report';
    if (year) filename += `-${year}`;
    if (month) filename += `-${month.padStart(2, '0')}`;
    if (date) filename += `-${date}`;
    filename += '.xlsx';
    
    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
    
  } catch (error) {
    console.error('Error generating sales report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate sales report' },
      { status: 500 }
    );
  }
}
