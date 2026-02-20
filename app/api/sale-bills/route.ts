import { NextRequest, NextResponse } from 'next/server';
import { saleBillQueries } from '@/lib/database';

// GET all sale bills
export async function GET() {
  try {
    const bills = saleBillQueries.getAll();
    return NextResponse.json({ success: true, data: bills });
  } catch (error) {
    console.error('Error fetching sale bills:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sale bills' },
      { status: 500 }
    );
  }
}

// POST new sale bill with multiple items
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      shop_name,
      mobile_number,
      items,
      amount_paid = 0,
      repayment_date,
      bill_date = new Date().toISOString().split('T')[0],
      labour_charges = 0,
      weighing_charges = 0
    } = body;

    // Validation
    if (!shop_name || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: shop_name and at least one item' },
        { status: 400 }
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.crop_name || !item.quantity || !item.rate) {
        return NextResponse.json(
          { success: false, error: 'Each item must have crop_name, quantity, and rate' },
          { status: 400 }
        );
      }
      if (item.quantity <= 0 || item.rate <= 0) {
        return NextResponse.json(
          { success: false, error: 'Quantity and rate must be positive numbers' },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const processedItems = items.map(item => ({
      crop_name: item.crop_name.trim(),
      quantity: Number(item.quantity),
      rate: Number(item.rate),
      total: Number(item.quantity) * Number(item.rate)
    }));

    const itemsTotal = processedItems.reduce((sum, item) => sum + item.total, 0);
    const labourCharges = Number(labour_charges) || 0;
    const weighingCharges = Number(weighing_charges) || 0;
    // Subtract charges from items total
    const grandTotal = itemsTotal - labourCharges - weighingCharges;
    const amountRemaining = grandTotal - amount_paid;

    const result = saleBillQueries.create({
      shop_name: shop_name.trim(),
      mobile_number: mobile_number || '',
      total_amount: grandTotal,
      amount_paid: Number(amount_paid),
      amount_remaining: amountRemaining,
      repayment_date: amountRemaining > 0 ? repayment_date : null,
      bill_date,
      labour_charges: labourCharges,
      weighing_charges: weighingCharges,
      items: processedItems
    });

    return NextResponse.json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        shop_name: shop_name.trim(),
        items: processedItems,
        total_amount: itemsTotal,
        amount_paid: Number(amount_paid),
        amount_remaining: amountRemaining,
        repayment_date: amountRemaining > 0 ? repayment_date : null,
        bill_date,
        labour_charges: labourCharges,
        weighing_charges: weighingCharges,
        grand_total: grandTotal
      }
    });
  } catch (error) {
    console.error('Error creating sale bill:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create sale bill' },
      { status: 500 }
    );
  }
}
