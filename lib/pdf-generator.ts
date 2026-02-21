import jsPDF from 'jspdf';
import { LOGO_BASE64 } from './logo-data';

export interface BillItem {
  crop_name: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface PurchaseBillData {
  id: number;
  farmer_name: string;
  mobile_number?: string;
  total_amount: number;
  amount_paid: number;
  amount_remaining: number;
  repayment_date?: string;
  bill_date: string;
  labour_charges: number;
  weighing_charges: number;
  items: BillItem[];
  created_at: string;
}

export interface SaleBillData {
  id: number;
  shop_name: string;
  mobile_number?: string;
  total_amount: number;
  amount_paid: number;
  amount_remaining: number;
  repayment_date?: string;
  bill_date: string;
  labour_charges: number;
  weighing_charges: number;
  items: BillItem[];
  created_at: string;
}

export class PDFGenerator {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    // Set better font encoding for proper character rendering
    this.doc.setFont('helvetica');
    this.doc.setFontSize(10);
  }

  private encodeText(text: string): string {
    // Handle undefined/null values safely
    if (text === undefined || text === null) {
      return '';
    }
    // Replace rupee symbol with Rs. before encoding
    return text.toString()
      .replace(/₹/g, 'Rs.') // Replace rupee symbol with Rs.
      .replace(/[^ -~]/g, '') // Remove other non-ASCII characters
      .trim();
  }

  private addPageBorder() {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const pageHeight = this.doc.internal.pageSize.getHeight();
    const margin = 10;
    
    // Simple page border around entire page
    this.doc.setLineWidth(1);
    this.doc.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2), 'S');
  }

  private addLogo(centerX: number) {
    try {
      // Add logo image directly from embedded base64 - 20x20mm at center
      this.doc.addImage(LOGO_BASE64, 'PNG', centerX - 10, 12, 20, 20);
    } catch (error) {
      // Fallback: draw placeholder if logo fails to load
      this.doc.setDrawColor(0);
      this.doc.setLineWidth(1);
      this.doc.circle(centerX, 22, 10, 'S');
      this.doc.circle(centerX, 19, 3, 'S');
      this.doc.setLineWidth(0.5);
      this.doc.ellipse(centerX, 26, 5, 2.5, 'S');
    }
  }

  private async addHeader() {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
    
    // Add logo image
    this.addLogo(centerX);
    
    // Company Name
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    const companyName = this.encodeText('MA CHAMUNDA TRADING COMPANY');
    this.doc.text(companyName, centerX, 40, { align: 'center' });
    
    // Address
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    const address = this.encodeText('Pimpri, Maharashtra, India');
    this.doc.text(address, centerX, 46, { align: 'center' });
    
    // Contact
    this.doc.setFont('helvetica', 'bold');
    const contact = this.encodeText('Phone: +91 7709294093 | Email: tradingmachamunda@gmail.com');
    this.doc.text(contact, centerX, 51, { align: 'center' });
    
    // Receipt Title
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    const receiptTitle = this.encodeText('Receipt');
    this.doc.text(receiptTitle, centerX, 60, { align: 'center' });
    
    // Line under title
    this.doc.setLineWidth(0.5);
    this.doc.line(15, 64, pageWidth - 15, 64);
    
    return 68;
  }

  private async addHeaderForNewPage() {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
    
    // Add logo image
    this.addLogo(centerX);
    
    // Company Name
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    const companyName = this.encodeText('MA CHAMUNDA TRADING COMPANY');
    this.doc.text(companyName, centerX, 40, { align: 'center' });
    
    // Address
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    const address = this.encodeText('Pimpri, Maharashtra, India');
    this.doc.text(address, centerX, 46, { align: 'center' });
    
    // Contact
    this.doc.setFont('helvetica', 'bold');
    const contact = this.encodeText('Phone: +91 7709294093 | Email: tradingmachamunda@gmail.com');
    this.doc.text(contact, centerX, 51, { align: 'center' });
    
    // Receipt Title (continued)
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    const receiptTitle = this.encodeText('Receipt (Continued)');
    this.doc.text(receiptTitle, centerX, 60, { align: 'center' });
    
    // Line under title
    this.doc.setLineWidth(0.5);
    this.doc.line(15, 64, pageWidth - 15, 64);
    
    return 68;
  }

  private addBillInfo(bill: PurchaseBillData | SaleBillData, billType: 'PURCHASE' | 'SALE', startY: number) {
    const margin = 15;
    let currentY = startY;
    
    // Empty section - customer name and bill date moved elsewhere
    currentY += 10;
    
    return currentY;
  }

  private drawTableRow(x: number, y: number, width: number, height: number, columns: string[], alignments: ('left' | 'center' | 'right')[], isHeader: boolean = false) {
    const colCount = columns.length;
    const colWidth = width / colCount;
    
    // Draw row border
    this.doc.setLineWidth(0.5);
    this.doc.rect(x, y, width, height, 'S');
    
    // Draw vertical lines for columns
    for (let i = 1; i < colCount; i++) {
      const lineX = x + (colWidth * i);
      this.doc.line(lineX, y, lineX, y + height);
    }
    
    // Draw text
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
    
    columns.forEach((text, index) => {
      const colX = x + (colWidth * index);
      const textX = colX + (colWidth / 2);
      const textY = y + (height / 2) + 2.5;
      
      // Ensure text is properly encoded
      const cleanText = this.encodeText(text);
      
      if (alignments[index] === 'left') {
        this.doc.text(cleanText, colX + 3, textY);
      } else if (alignments[index] === 'center') {
        this.doc.text(cleanText, textX, textY, { align: 'center' });
      } else {
        this.doc.text(cleanText, colX + colWidth - 3, textY, { align: 'right' });
      }
    });
  }

  private async addItemsTable(items: BillItem[], startY: number, bill: PurchaseBillData | SaleBillData, billType: 'PURCHASE' | 'SALE'): Promise<number> {
    // Safety check for undefined items
    if (!items || !Array.isArray(items)) {
      console.error('Items is undefined or not an array:', items);
      items = [];
    }
    
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const pageHeight = this.doc.internal.pageSize.getHeight();
    const margin = 15;
    const tableWidth = pageWidth - (margin * 2);
    const rowHeight = 8;
    const borderMargin = 10;
    const footerHeight = 20; // Space needed for footer inside border
    
    let currentY = startY;
    let itemsProcessed = 0;
    let isFirstPage = true;
    
    // Process items in batches to fit on pages
    while (itemsProcessed < items.length) {
      const availableSpace = pageHeight - currentY - borderMargin - footerHeight;
      const maxRows = Math.floor(availableSpace / rowHeight);
      const remainingItems = items.length - itemsProcessed;
      const itemsToProcess = Math.min(maxRows - 1, remainingItems); // -1 for header
      
      // Add table header on each new page
      if (itemsProcessed === 0 || currentY < 50) {
        if (!isFirstPage) {
          // New page (not first) - add page border and continued header
          this.addPageBorder();
          await this.addHeaderForNewPage();
          currentY = 68;
          
          // Add continued notice
          this.doc.setFontSize(10);
          this.doc.setFont('helvetica', 'italic');
          const continuedText = this.encodeText('(Continued from previous page)');
          this.doc.text(continuedText, pageWidth / 2, currentY, { align: 'center' });
          currentY += 15;
        }
        
        isFirstPage = false;
        
        // Add table header row
        this.doc.setFillColor(240, 240, 240);
        this.doc.rect(15, currentY, tableWidth, rowHeight, 'FD');
        
        // Use Rs. instead of rupee symbol for PDF compatibility
        const headers = ['Item', 'Qty', 'Unit', 'Price (Rs.)', 'Total (Rs.)'];
        const cleanHeaders = headers.map(h => this.encodeText(h));
        
        this.drawTableRow(
          15, 
          currentY, 
          tableWidth, 
          rowHeight, 
          cleanHeaders,
          ['left', 'center', 'center', 'center', 'center'],
          true
        );
        currentY += rowHeight;
      }
      
      // Add items that fit on current page
      for (let i = 0; i < itemsToProcess && itemsProcessed < items.length; i++) {
        const item = items[itemsProcessed];
        
        this.doc.setFillColor(255, 255, 255);
        this.doc.rect(15, currentY, tableWidth, rowHeight, 'FD');
        
        // Clean and format text properly - convert to numbers first to handle string values from DB
        const cleanCropName = this.encodeText(item.crop_name);
        const cleanQuantity = this.encodeText(String(item.quantity));
        const rate = Number(item.rate) || 0;
        const total = Number(item.total) || 0;
        const cleanRate = this.encodeText(`Rs.${rate.toFixed(2)}`);
        const cleanTotal = this.encodeText(`Rs.${total.toFixed(2)}`);
        
        this.drawTableRow(
          15, 
          currentY, 
          tableWidth, 
          rowHeight,
          [cleanCropName, cleanQuantity, 'kg', cleanRate, cleanTotal],
          ['left', 'center', 'center', 'right', 'right'],
          false
        );
        currentY += rowHeight;
        itemsProcessed++;
      }
      
      // Check if we need a new page
      if (itemsProcessed < items.length) {
        this.addFooter();
        this.doc.addPage();
        currentY = 20; // Start fresh on new page
      }
    }
    
    return currentY;
  }

  private addSummaryTable(bill: PurchaseBillData | SaleBillData, startY: number) {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const pageHeight = this.doc.internal.pageSize.getHeight();
    const margin = 15;
    const tableWidth = pageWidth - (margin * 2);
    const rowHeight = 8;
    const borderMargin = 10;
    const footerHeight = 20; // Space needed for footer inside border
    
    // Convert values to numbers (they may come as strings from database)
    const labourCharges = Number(bill.labour_charges) || 0;
    const weighingCharges = Number(bill.weighing_charges) || 0;
    const amountPaid = Number(bill.amount_paid) || 0;
    const amountRemaining = Number(bill.amount_remaining) || 0;
    
    // Calculate items total
    const itemsTotal = bill.items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    // Subtract charges from items total to get grand total
    const totalAmount = itemsTotal - labourCharges - weighingCharges;
    
    const repaymentDate = bill.repayment_date 
      ? this.formatDate(bill.repayment_date) 
      : 'N/A';
    
    let currentY = startY;
    
    // Check if we have space for summary
    const requiredSpace = 6 * rowHeight + 20; // 6 rows + signature space
    const availableSpace = pageHeight - currentY - borderMargin - footerHeight;
    
    if (availableSpace < requiredSpace) {
      this.addFooter();
      this.doc.addPage();
      this.addPageBorder();
      currentY = 20;
    }
    
    const summaryRows = [
      { label: 'Labour Charges (Rs.)', value: `Rs.${labourCharges.toFixed(2)}` },
      { label: 'Weighing Charges (Rs.)', value: `Rs.${weighingCharges.toFixed(2)}` },
      { label: 'Total Amount (Rs.)', value: `Rs.${totalAmount.toFixed(2)}` },
      { label: 'Amount Paid (Rs.)', value: `Rs.${amountPaid.toFixed(2)}` },
      { label: 'Amount Remaining (Rs.)', value: `Rs.${amountRemaining.toFixed(2)}` },
      { label: 'Repayment Due Date:', value: repaymentDate }
    ];
    
    summaryRows.forEach((row, index) => {
      // Alternate row colors
      if (index % 2 === 0) {
        this.doc.setFillColor(245, 245, 245);
      } else {
        this.doc.setFillColor(250, 250, 250);
      }
      
      this.doc.rect(15, currentY, tableWidth, rowHeight, 'FD');
      
      // Draw border
      this.doc.setLineWidth(0.5);
      this.doc.rect(15, currentY, tableWidth, rowHeight, 'S');
      
      // Draw vertical separator in middle
      const midX = 15 + (tableWidth * 0.6);
      this.doc.line(midX, currentY, midX, currentY + rowHeight);
      
      // Draw text with proper encoding
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      const cleanLabel = this.encodeText(row.label);
      const cleanValue = this.encodeText(row.value);
      
      this.doc.text(cleanLabel, 20, currentY + 5);
      this.doc.text(cleanValue, 15 + tableWidth - 5, currentY + 5, { align: 'right' });
      
      currentY += rowHeight;
    });
    
    return currentY + 5;
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-GB', options);
  }

  private addFooter() {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const pageHeight = this.doc.internal.pageSize.getHeight();
    const borderMargin = 10;
    
    // Add footer at bottom of current page, inside the border
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    
    // Software developer credit
    const creditText = this.encodeText('Software Developed by Kandarp Patil');
    this.doc.text(creditText, pageWidth / 2, pageHeight - borderMargin - 8, { align: 'center' });
    
    // Contact information
    const contactText = this.encodeText('Contact: 7249743220');
    this.doc.text(contactText, pageWidth / 2, pageHeight - borderMargin - 4, { align: 'center' });
    
    // Add page number
    const pageNumber = this.doc.getCurrentPageInfo().pageNumber;
    const pageText = this.encodeText(`Page ${pageNumber}`);
    this.doc.text(pageText, pageWidth - borderMargin - 5, pageHeight - borderMargin - 4, { align: 'right' });
  }

  private async addSignatureAndFooter(startY: number) {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const margin = 15;
    let currentY = startY;
    
    // Check if we have space for signature
    const pageHeight = this.doc.internal.pageSize.getHeight();
    const borderMargin = 10;
    const footerHeight = 20; // Space needed for footer inside border
    const availableSpace = pageHeight - currentY - borderMargin - footerHeight;
    
    if (availableSpace < 40) {
      // Not enough space, add new page
      this.addFooter();
      this.doc.addPage();
      this.addPageBorder();
      await this.addHeaderForNewPage(); // Add header to new page
      currentY = 68;
    }
    
    // Signature line
    this.doc.setLineWidth(0.5);
    this.doc.line(20, currentY, 85, currentY);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    const signatureText = this.encodeText('Authorized Signature');
    this.doc.text(signatureText, 20, currentY + 5);
    
    currentY += 25;
    
    // Thank you message
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    const thankYouText = this.encodeText('Thank you for doing business with us!');
    this.doc.text(thankYouText, pageWidth / 2, currentY, { align: 'center' });
    
    // Add footer to the last page
    this.addFooter();
  }

  async generatePurchaseBill(bill: PurchaseBillData): Promise<string> {
    // Safety check for bill items
    if (!bill.items || !Array.isArray(bill.items)) {
      console.error('Bill items is undefined, setting to empty array');
      bill.items = [];
    }
    
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // First page: Add border and full header
    this.addPageBorder();
    await this.addHeader();
    
    // Add customer info on first page
    let currentY = 68; // After header
    
    // Customer Name
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    const cleanCustomerName = this.encodeText(bill.farmer_name);
    this.doc.text(`Customer Name: ${cleanCustomerName}`, 15, currentY);
    currentY += 15;
    
    // Mobile Number
    if (bill.mobile_number) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      const cleanMobile = this.encodeText(`Mobile: ${bill.mobile_number}`);
      this.doc.text(cleanMobile, 15, currentY);
      currentY += 15;
    }
    
    // Bill Date
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    const cleanBillDate = this.encodeText(bill.bill_date);
    this.doc.text(`Bill Date: ${cleanBillDate}`, 15, currentY);
    currentY += 20;
    
    // Add items table starting from currentY
    const tableY = await this.addItemsTable(bill.items, currentY, bill, 'PURCHASE');
    const summaryY = this.addSummaryTable(bill, tableY);
    await this.addSignatureAndFooter(summaryY);

    return this.doc.output('datauristring');
  }

  async generateSaleBill(bill: SaleBillData): Promise<string> {
    // Safety check for bill items
    if (!bill.items || !Array.isArray(bill.items)) {
      console.error('Bill items is undefined, setting to empty array');
      bill.items = [];
    }
    
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // First page: Add border and full header
    this.addPageBorder();
    await this.addHeader();
    
    // Add customer info on first page
    let currentY = 68; // After header
    
    // Shop Name
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    const cleanShopName = this.encodeText(bill.shop_name);
    this.doc.text(`Shop Name: ${cleanShopName}`, 15, currentY);
    currentY += 15;
    
    // Mobile Number
    if (bill.mobile_number) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      const cleanMobile = this.encodeText(`Mobile: ${bill.mobile_number}`);
      this.doc.text(cleanMobile, 15, currentY);
      currentY += 15;
    }
    
    // Bill Date
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    const cleanBillDate = this.encodeText(bill.bill_date);
    this.doc.text(`Bill Date: ${cleanBillDate}`, 15, currentY);
    currentY += 20;
    
    // Add items table starting from currentY
    const tableY = await this.addItemsTable(bill.items, currentY, bill, 'SALE');
    const summaryY = this.addSummaryTable(bill, tableY);
    await this.addSignatureAndFooter(summaryY);

    return this.doc.output('datauristring');
  }
}

export const pdfGenerator = new PDFGenerator();
