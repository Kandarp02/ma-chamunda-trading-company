'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StockManagement from '@/components/admin/StockManagement'
import BillGeneration from '@/components/admin/BillGeneration'
import ReportsSection from '@/components/admin/ReportsSection'
import AdminAuthWrapper from '@/components/admin/AdminAuthWrapper'
import { stockAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { LogOut, Shield } from 'lucide-react'

interface CropStock {
  id: number
  crop_name: string
  quantity: number
  last_updated: string
}

export default function Dashboard() {
  const [stocks, setStocks] = useState<CropStock[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleLogout = () => {
    // Clear auth cookie
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    
    router.push('/login')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stocksData = await stockAPI.getAll()
        setStocks(stocksData || [])
      } catch (error) {
        console.error('Error fetching stocks:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Admin Panel...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminAuthWrapper>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Admin Panel</h1>
              <p className="text-muted-foreground">Manage your crop inventory, generate bills, and export reports</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="stock" className="w-full">
            <TabsList className="flex flex-col sm:flex-row w-full gap-2 mb-8 h-auto p-1">
              <TabsTrigger value="stock">Stock Management</TabsTrigger>
              <TabsTrigger value="bills">Bill Generation</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="stock" className="space-y-4">
              <StockManagement stocks={stocks} setStocks={setStocks} />
            </TabsContent>

            <TabsContent value="bills" className="space-y-4">
              <BillGeneration stocks={stocks} setStocks={setStocks} />
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <ReportsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminAuthWrapper>
  )
}
