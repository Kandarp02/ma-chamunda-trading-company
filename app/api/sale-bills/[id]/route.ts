import { NextRequest, NextResponse } from 'next/server'
import { saleBillQueries } from '@/lib/database'

export async function PATCH(
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

    // Get the bill first to check if it exists
    const bill = await saleBillQueries.getById(billId)
    if (!bill) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      )
    }

    // Mark bill as paid
    const updatedBill = await saleBillQueries.markAsPaid(billId)

    return NextResponse.json({ success: true, bill: updatedBill })
  } catch (error) {
    console.error('Error marking sale bill as paid:', error)
    return NextResponse.json(
      { error: 'Failed to mark bill as paid' },
      { status: 500 }
    )
  }
}

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
