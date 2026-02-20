'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Download, FileSpreadsheet } from 'lucide-react'

export default function ReportsSection() {
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    month: '',
    date: ''
  })
  const [loading, setLoading] = useState<'purchase' | 'sale' | null>(null)

  // Generate array of years (current year and 5 years back)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, i) => (currentYear - i).toString())
  
  // Months array
  const months = [
    { value: '', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]

  const handleDownload = async (type: 'purchase' | 'sale') => {
    setLoading(type)
    try {
      // Build query params
      const params = new URLSearchParams()
      if (filters.year) params.append('year', filters.year)
      if (filters.month) params.append('month', filters.month)
      if (filters.date) params.append('date', filters.date)

      const endpoint = type === 'purchase' ? '/api/reports/purchase' : '/api/reports/sales'
      const response = await fetch(`${endpoint}?${params.toString()}`)

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || `Failed to download ${type} report`)
        return
      }

      // Get filename from Content-Disposition header or generate default
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `${type}-report-${filters.year}.xlsx`
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/)
        if (match) filename = match[1]
      }

      // Download the file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error(`Error downloading ${type} report:`, error)
      alert(`Failed to download ${type} report`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Filter Section */}
      <Card className="p-6 bg-card border border-border">
        <h2 className="text-xl font-semibold text-card-foreground mb-6 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-primary" />
          Report Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Year *
            </label>
            <select
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value, month: '', date: '' }))}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Month (Optional)
            </label>
            <select
              value={filters.month}
              onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value, date: '' }))}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Specific Date (Optional)
            </label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value, month: '' }))}
              className="border border-input bg-background text-foreground"
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          * Year is required. Select specific month or date for filtered results.
        </p>
      </Card>

      {/* Download Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Purchase Report Download */}
        <Card className="p-6 bg-amber-50 border-2 border-amber-400">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Purchase Report</h3>
          <p className="text-sm text-amber-700 mb-4">
            Download all purchase bills from farmers with complete details
          </p>
          <Button
            onClick={() => handleDownload('purchase')}
            disabled={loading !== null}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            {loading === 'purchase' ? 'Generating...' : 'Download Purchase Report'}
          </Button>
        </Card>

        {/* Sales Report Download */}
        <Card className="p-6 bg-amber-50 border-2 border-amber-400">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Sales Report</h3>
          <p className="text-sm text-amber-700 mb-4">
            Download all sales bills to shops with complete details
          </p>
          <Button
            onClick={() => handleDownload('sale')}
            disabled={loading !== null}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            {loading === 'sale' ? 'Generating...' : 'Download Sales Report'}
          </Button>
        </Card>
      </div>

    </div>
  )
}
