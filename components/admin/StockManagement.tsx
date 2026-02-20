'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Trash2, Plus } from 'lucide-react'
import { stockAPI } from '@/lib/api'

interface CropStock {
  id: number
  crop_name: string
  quantity: number
  last_updated: string
}

interface StockManagementProps {
  stocks: CropStock[]
  setStocks: (stocks: CropStock[]) => void
}

export default function StockManagement({ stocks, setStocks }: StockManagementProps) {
  const [formData, setFormData] = useState({
    crop_name: '',
    quantity: '',
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter stocks by search query (case-insensitive)
  const filteredStocks = stocks.filter(stock => 
    stock.crop_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.crop_name || !formData.quantity) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      if (editingId) {
        // Update existing stock
        const updatedStock = await stockAPI.update(editingId, {
          crop_name: formData.crop_name,
          quantity: Number(formData.quantity)
        })
        setStocks(stocks.map(stock => 
          stock.id === editingId ? updatedStock : stock
        ))
      } else {
        // Create new stock
        const newStock = await stockAPI.create({
          crop_name: formData.crop_name,
          quantity: Number(formData.quantity)
        })
        setStocks([...stocks, newStock])
      }
      setFormData({ crop_name: '', quantity: '' })
      setEditingId(null)
    } catch (error) {
      console.error('Error saving stock:', error)
      alert(error instanceof Error ? error.message : 'Failed to save stock')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (stock: CropStock) => {
    setFormData({
      crop_name: stock.crop_name,
      quantity: stock.quantity.toString()
    })
    setEditingId(stock.id)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this stock item?')) {
      return
    }

    setLoading(true)
    try {
      await stockAPI.delete(id)
      setStocks(stocks.filter(stock => stock.id !== id))
    } catch (error) {
      console.error('Error deleting stock:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete stock')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ crop_name: '', quantity: '' })
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border border-border">
        <h2 className="text-2xl font-semibold text-card-foreground mb-6">Add/Update Stock</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Crop Name *</label>
            <Input
              type="text"
              name="crop_name"
              value={formData.crop_name}
              onChange={handleInputChange}
              placeholder="e.g., Rice"
              className="border border-input bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Quantity *</label>
            <Input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="e.g., 500"
              className="border border-input bg-background text-foreground"
              required
              min="0"
            />
          </div>

          <div className="flex items-end gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : (editingId ? 'Update Stock' : 'Add Stock')}
            </Button>
            {editingId && (
              <Button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-muted text-muted-foreground hover:bg-muted/80"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Current Stock</h3>
        
        {/* Search Input */}
        <div className="relative w-full md:w-1/2">
          <Input
            type="text"
            placeholder="Search by crop name (e.g., Rice, rice, RiCe)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-2 border-primary/50 bg-background text-foreground w-full pl-10 pr-4 py-2 rounded-lg shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-foreground">Crop Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-foreground">Quantity</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-secondary-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map(stock => (
                <tr key={stock.id} className="border-b border-border hover:bg-secondary/30">
                  <td className="px-4 py-3 text-card-foreground">{stock.crop_name}</td>
                  <td className="px-4 py-3 text-card-foreground">{stock.quantity}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(stock)}
                        className="px-3 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded transition"
                        title="Edit"
                      >
                        Update Stock
                      </button>
                      <button
                        onClick={() => handleDelete(stock.id)}
                        className="p-2 hover:bg-destructive/10 rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStocks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No stocks found matching your search.' : 'No stocks added yet. Add your first crop!'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
