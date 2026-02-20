import { NextRequest, NextResponse } from 'next/server'
import { purchaseBillQueries } from '@/lib/database'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const billId = parseInt(id)
    
    if (isNaN(billId)) {
      return NextResponse.json(
        { error: 'Invalid bill ID' },
        { status: 400 }
      )
    }

    // Get the bill to be deleted for stock rollback
    const bill = purchaseBillQueries.getById(billId)
    if (!bill) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      )
    }

    // Delete the bill (this will also rollback stock)
    const result = purchaseBillQueries.delete(billId)
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Failed to delete bill' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting purchase bill:', error)
    return NextResponse.json(
      { error: 'Failed to delete purchase bill' },
      { status: 500 }
    )
  }
}
