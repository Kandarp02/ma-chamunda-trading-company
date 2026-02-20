import { NextRequest, NextResponse } from 'next/server';
import { stockQueries } from '@/lib/database';

// GET single stock by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid stock ID' },
        { status: 400 }
      );
    }

    const stock = await stockQueries.getById(id);
    if (!stock) {
      return NextResponse.json(
        { success: false, error: 'Stock not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: stock });
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock' },
      { status: 500 }
    );
  }
}

// PUT update stock
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid stock ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { crop_name, quantity } = body;

    // Validation
    if (!crop_name || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields', received: { crop_name, quantity } },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be a positive number' },
        { status: 400 }
      );
    }

    // Check if stock exists
    const existingStock = await stockQueries.getById(id);
    if (!existingStock) {
      return NextResponse.json(
        { success: false, error: 'Stock not found' },
        { status: 404 }
      );
    }

    const result = await stockQueries.update(id, Number(quantity));

    return NextResponse.json({
      success: true,
      data: {
        id,
        crop_name: crop_name.trim(),
        quantity: Number(quantity)
      }
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update stock' },
      { status: 500 }
    );
  }
}

// DELETE stock
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid stock ID' },
        { status: 400 }
      );
    }

    // Check if stock exists
    const existingStock = await stockQueries.getById(id);
    if (!existingStock) {
      return NextResponse.json(
        { success: false, error: 'Stock not found' },
        { status: 404 }
      );
    }

    await stockQueries.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Stock deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting stock:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete stock' },
      { status: 500 }
    );
  }
}
