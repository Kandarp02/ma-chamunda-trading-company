import { NextRequest, NextResponse } from 'next/server'
import { saleBillQueries } from '@/lib/database'

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
    const bill = await saleBillQueries.getById(billId)
    if (!bill) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      )
    }

    // Delete the bill (this will also rollback stock)
    await saleBillQueries.delete(billId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sale bill:', error)
    return NextResponse.json(
      { error: 'Failed to delete sale bill' },
      { status: 500 }
    )
  }
}
