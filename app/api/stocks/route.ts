import { NextRequest, NextResponse } from 'next/server';
import { stockQueries } from '@/lib/database';

// GET all crop stocks
export async function GET() {
  try {
    const stocks = stockQueries.getAll();
    return NextResponse.json({ success: true, data: stocks });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stocks' },
      { status: 500 }
    );
  }
}

// POST new crop stock
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { crop_name, quantity } = body;

    // Validation
    if (!crop_name || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be a positive number' },
        { status: 400 }
      );
    }

    // Check if stock exists to get the ID for updates
    const existingStock = stockQueries.getByName(crop_name.trim()) as { id: number; quantity: number } | undefined;
    
    const result = stockQueries.upsertStock(crop_name.trim(), Number(quantity));

    // Return the correct ID (existing for update, new for insert)
    const stockId = existingStock ? existingStock.id : result.lastInsertRowid;
    const newQuantity = existingStock ? existingStock.quantity + Number(quantity) : Number(quantity);

    return NextResponse.json({
      success: true,
      data: {
        id: stockId,
        crop_name: crop_name.trim(),
        quantity: newQuantity,
        last_updated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating stock:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create stock' },
      { status: 500 }
    );
  }
}
