'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Download, FileText, Trash2, X } from 'lucide-react'
import { stockAPI, purchaseBillAPI, saleBillAPI } from '@/lib/api'
import { pdfGenerator, PurchaseBillData, SaleBillData } from '@/lib/pdf-generator'
import { validateIndianMobileNumber, formatMobileNumberForInput } from '@/lib/mobile-validation'

// Hide number input spinners
const hideNumberArrowsStyles = `
  /* Hide number input spinners for Chrome, Safari, Edge, Opera */
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Hide number input spinners for Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
`

interface CropStock {
  id: number
  crop_name: string
  quantity: number
}

interface BillItem {
  crop_name: string
  quantity: string
  rate: string
  total: number
}

interface BillGenerationProps {
  stocks: CropStock[]
  setStocks: React.Dispatch<React.SetStateAction<CropStock[]>>
}

export default function BillGeneration({ stocks, setStocks }: BillGenerationProps) {
  const [billType, setBillType] = useState<'purchase' | 'sale'>('purchase')
  const [loading, setLoading] = useState(false)
  const [purchaseBills, setPurchaseBills] = useState<PurchaseBillData[]>([])
  const [saleBills, setSaleBills] = useState<SaleBillData[]>([])
  const [purchaseSearchQuery, setPurchaseSearchQuery] = useState('')
  const [saleSearchQuery, setSaleSearchQuery] = useState('')

  // Filter purchase bills by farmer name or bill ID (case-insensitive)
  const filteredPurchaseBills = purchaseBills.filter(bill => {
    const searchLower = purchaseSearchQuery.toLowerCase()
    const farmerNameMatch = bill.farmer_name?.toLowerCase().includes(searchLower) || false
    const billIdMatch = `p${bill.id}`.includes(searchLower) || bill.id?.toString().includes(searchLower) || false
    return farmerNameMatch || billIdMatch
  })

  // Filter sale bills by shop name or bill ID (case-insensitive)
  const filteredSaleBills = saleBills.filter(bill => {
    const searchLower = saleSearchQuery.toLowerCase()
    const shopNameMatch = bill.shop_name?.toLowerCase().includes(searchLower) || false
    const billIdMatch = `s${bill.id}`.includes(searchLower) || bill.id?.toString().includes(searchLower) || false
    return shopNameMatch || billIdMatch
  })

  // Helper function to check if repayment date has passed
  const isRepaymentDatePassed = (repaymentDate: string | null, remainingAmount: number) => {
    if (!repaymentDate || remainingAmount <= 0) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(repaymentDate)
    return dueDate < today
  }
  const [purchaseForm, setPurchaseForm] = useState({
    farmer_name: '',
    mobile_number: '',
    items: [{ crop_name: '', quantity: '', rate: '', total: 0 }] as BillItem[],
    amount_paid: '',
    repayment_date: '',
    bill_date: new Date().toISOString().split('T')[0],
    labour_charges: '',
    weighing_charges: ''
  })

  // Form validation errors
  const [purchaseFormErrors, setPurchaseFormErrors] = useState({
    farmer_name: '',
    mobile_number: '',
    items: '',
    amount_paid: '',
    repayment_date: '',
    labour_charges: '',
    weighing_charges: '',
    bill_date: ''
  })

  // Form states for sale bill
  const [saleForm, setSaleForm] = useState({
    shop_name: '',
    mobile_number: '',
    items: [{ crop_name: '', quantity: '', rate: '', total: 0 }] as BillItem[],
    amount_paid: '',
    repayment_date: '',
    bill_date: new Date().toISOString().split('T')[0],
    labour_charges: '',
    weighing_charges: ''
  })

  // Form validation errors
  const [saleFormErrors, setSaleFormErrors] = useState({
    shop_name: '',
    mobile_number: '',
    items: '',
    amount_paid: '',
    repayment_date: '',
    labour_charges: '',
    weighing_charges: '',
    bill_date: ''
  })

  // Calculate item total
  const calculateItemTotal = (quantity: string, rate: string) => {
    const qty = Number(quantity) || 0
    const rt = Number(rate) || 0
    return qty * rt
  }

  // Calculate items total
  const calculateItemsTotal = (items: BillItem[]) => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item.quantity, item.rate), 0)
  }

  // Calculate grand total
  const calculateGrandTotal = (items: BillItem[], labour: string, weighing: string) => {
    const itemsTotal = calculateItemsTotal(items)
    const labourCharges = Number(labour) || 0
    const weighingCharges = Number(weighing) || 0
    return (itemsTotal - labourCharges - weighingCharges).toFixed(2)
  }

  // Calculate remaining
  const calculateRemaining = (total: string, paid: string) => {
    const totalAmount = Number(total) || 0
    const amountPaid = Number(paid) || 0
    const remaining = totalAmount - amountPaid
    return remaining > 0 ? remaining.toFixed(2) : '0.00'
  }

  // Add new item
  const addItem = (formType: 'purchase' | 'sale') => {
    if (formType === 'purchase') {
      setPurchaseForm(prev => ({
        ...prev,
        items: [...prev.items, { crop_name: '', quantity: '', rate: '', total: 0 }]
      }))
    } else {
      setSaleForm(prev => ({
        ...prev,
        items: [...prev.items, { crop_name: '', quantity: '', rate: '', total: 0 }]
      }))
    }
  }

  // Remove item
  const removeItem = (formType: 'purchase' | 'sale', index: number) => {
    if (formType === 'purchase') {
      if (purchaseForm.items.length <= 1) return
      setPurchaseForm(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }))
    } else {
      if (saleForm.items.length <= 1) return
      setSaleForm(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }))
    }
  }

  // Update item
  const updateItem = (formType: 'purchase' | 'sale', index: number, field: keyof BillItem, value: string) => {
    if (formType === 'purchase') {
      setPurchaseForm(prev => {
        const newItems = [...prev.items]
        newItems[index] = { ...newItems[index], [field]: value }
        if (field === 'quantity' || field === 'rate') {
          newItems[index].total = calculateItemTotal(newItems[index].quantity, newItems[index].rate)
        }
        return { ...prev, items: newItems }
      })
    } else {
      setSaleForm(prev => {
        const newItems = [...prev.items]
        newItems[index] = { ...newItems[index], [field]: value }
        if (field === 'quantity' || field === 'rate') {
          newItems[index].total = calculateItemTotal(newItems[index].quantity, newItems[index].rate)
        }
        return { ...prev, items: newItems }
      })
    }
  }

  // Validation functions
  const validatePurchaseForm = () => {
    const errors = {
      farmer_name: '',
      mobile_number: '',
      items: '',
      amount_paid: '',
      repayment_date: '',
      labour_charges: '',
      weighing_charges: '',
      bill_date: ''
    }

    // Validate farmer name
    if (!purchaseForm.farmer_name.trim()) {
      errors.farmer_name = 'Farmer name is required'
    }

    // Validate mobile number (required)
    if (!purchaseForm.mobile_number.trim()) {
      errors.mobile_number = 'Mobile number is required'
    } else {
      const validation = validateIndianMobileNumber(purchaseForm.mobile_number)
      if (!validation.isValid) {
        errors.mobile_number = validation.error || 'Invalid mobile number'
      }
    }

    // Validate items
    if (purchaseForm.items.length === 0) {
      errors.items = 'At least one item is required'
    } else {
      const hasInvalidItem = purchaseForm.items.some(item => 
        !item.crop_name || !item.quantity || !item.rate || 
        Number(item.quantity) <= 0 || Number(item.rate) <= 0
      )
      if (hasInvalidItem) {
        errors.items = 'All items must have valid crop name, quantity, and rate'
      }
    }

    // Validate amounts
    if (!purchaseForm.amount_paid.trim()) {
      errors.amount_paid = 'Amount paid is required'
    } else if (isNaN(Number(purchaseForm.amount_paid))) {
      errors.amount_paid = 'Amount paid must be a valid number'
    } else if (Number(purchaseForm.amount_paid) < 0) {
      errors.amount_paid = 'Amount paid cannot be negative'
    }

    // Validate labour charges
    if (!purchaseForm.labour_charges.trim()) {
      errors.labour_charges = 'Labour charges is required'
    } else if (isNaN(Number(purchaseForm.labour_charges))) {
      errors.labour_charges = 'Labour charges must be a valid number'
    } else if (Number(purchaseForm.labour_charges) < 0) {
      errors.labour_charges = 'Labour charges cannot be negative'
    }

    // Validate weighing charges
    if (!purchaseForm.weighing_charges.trim()) {
      errors.weighing_charges = 'Weighing charges is required'
    } else if (isNaN(Number(purchaseForm.weighing_charges))) {
      errors.weighing_charges = 'Weighing charges must be a valid number'
    } else if (Number(purchaseForm.weighing_charges) < 0) {
      errors.weighing_charges = 'Weighing charges cannot be negative'
    }

    // Validate bill date
    if (!purchaseForm.bill_date.trim()) {
      errors.bill_date = 'Bill date is required'
    }

    // Validate amount paid doesn't exceed grand total
    const grandTotal = Number(calculateGrandTotal(purchaseForm.items, purchaseForm.labour_charges, purchaseForm.weighing_charges))
    const amountPaid = Number(purchaseForm.amount_paid) || 0
    if (amountPaid > grandTotal) {
      errors.amount_paid = `Amount paid cannot exceed total amount (₹${grandTotal})`
    }

    setPurchaseFormErrors(errors)
    return !Object.values(errors).some(error => error !== '')
  }

  const validateSaleForm = () => {
    const errors = {
      shop_name: '',
      mobile_number: '',
      items: '',
      amount_paid: '',
      repayment_date: '',
      labour_charges: '',
      weighing_charges: '',
      bill_date: ''
    }

    // Validate shop name
    if (!saleForm.shop_name.trim()) {
      errors.shop_name = 'Shop name is required'
    }

    // Validate mobile number (required)
    if (!saleForm.mobile_number.trim()) {
      errors.mobile_number = 'Mobile number is required'
    } else {
      const validation = validateIndianMobileNumber(saleForm.mobile_number)
      if (!validation.isValid) {
        errors.mobile_number = validation.error || 'Invalid mobile number'
      }
    }

    // Validate items
    if (saleForm.items.length === 0) {
      errors.items = 'At least one item is required'
    } else {
      const hasInvalidItem = saleForm.items.some(item => 
        !item.crop_name || !item.quantity || !item.rate || 
        Number(item.quantity) <= 0 || Number(item.rate) <= 0
      )
      if (hasInvalidItem) {
        errors.items = 'All items must have valid crop name, quantity, and rate'
      }
      
      // Validate stock availability for sales
      const hasInsufficientStock = saleForm.items.some(item => {
        if (!item.crop_name || !item.quantity) return false
        const stock = stocks.find(s => s.crop_name === item.crop_name)
        if (!stock) return true // No stock found
        return Number(item.quantity) > stock.quantity
      })
      if (hasInsufficientStock) {
        errors.items = 'Sale quantity cannot exceed available stock'
      }
    }

    // Validate amounts
    if (!saleForm.amount_paid.trim()) {
      errors.amount_paid = 'Amount paid is required'
    } else if (isNaN(Number(saleForm.amount_paid))) {
      errors.amount_paid = 'Amount paid must be a valid number'
    } else if (Number(saleForm.amount_paid) < 0) {
      errors.amount_paid = 'Amount paid cannot be negative'
    }

    // Validate labour charges
    if (!saleForm.labour_charges.trim()) {
      errors.labour_charges = 'Labour charges is required'
    } else if (isNaN(Number(saleForm.labour_charges))) {
      errors.labour_charges = 'Labour charges must be a valid number'
    } else if (Number(saleForm.labour_charges) < 0) {
      errors.labour_charges = 'Labour charges cannot be negative'
    }

    // Validate weighing charges
    if (!saleForm.weighing_charges.trim()) {
      errors.weighing_charges = 'Weighing charges is required'
    } else if (isNaN(Number(saleForm.weighing_charges))) {
      errors.weighing_charges = 'Weighing charges must be a valid number'
    } else if (Number(saleForm.weighing_charges) < 0) {
      errors.weighing_charges = 'Weighing charges cannot be negative'
    }

    // Validate bill date
    if (!saleForm.bill_date.trim()) {
      errors.bill_date = 'Bill date is required'
    }

    // Validate amount paid doesn't exceed grand total
    const grandTotal = Number(calculateGrandTotal(saleForm.items, saleForm.labour_charges, saleForm.weighing_charges))
    const amountPaid = Number(saleForm.amount_paid) || 0
    if (amountPaid > grandTotal) {
      errors.amount_paid = `Amount paid cannot exceed total amount (₹${grandTotal})`
    }

    // Validate repayment date
    const remaining = grandTotal - amountPaid

    if (remaining > 0) {
      if (!saleForm.repayment_date) {
        errors.repayment_date = 'Repayment date is required when amount is remaining'
      } else {
        const repaymentDate = new Date(saleForm.repayment_date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (repaymentDate < today) {
          errors.repayment_date = 'Repayment date cannot be in the past'
        }
      }
    }

    setSaleFormErrors(errors)
    return !Object.values(errors).some(error => error !== '')
  }

  // Fetch bills on mount
  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    try {
      const [pBills, sBills] = await Promise.all([
        purchaseBillAPI.getAll(),
        saleBillAPI.getAll()
      ])
      setPurchaseBills(pBills || [])
      setSaleBills(sBills || [])
    } catch (error) {
      console.error('Error fetching bills:', error)
    }
  }

  // Form submission handlers
  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePurchaseForm()) {
      return
    }

    setLoading(true)
    try {
      const grandTotal = Number(calculateGrandTotal(purchaseForm.items, purchaseForm.labour_charges, purchaseForm.weighing_charges))
      const amountPaid = Number(purchaseForm.amount_paid) || 0
      const remaining = grandTotal - amountPaid

      await purchaseBillAPI.create({
        farmer_name: purchaseForm.farmer_name,
        mobile_number: purchaseForm.mobile_number,
        items: purchaseForm.items.map(item => ({
          crop_name: item.crop_name,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
          total: calculateItemTotal(item.quantity, item.rate)
        })),
        total_amount: Number(grandTotal),
        amount_paid: amountPaid,
        repayment_date: remaining > 0 ? purchaseForm.repayment_date : null,
        bill_date: purchaseForm.bill_date,
        labour_charges: Number(purchaseForm.labour_charges),
        weighing_charges: Number(purchaseForm.weighing_charges)
      })

      // Reset form
      setPurchaseForm({
        farmer_name: '',
        mobile_number: '',
        items: [{ crop_name: '', quantity: '', rate: '', total: 0 }],
        amount_paid: '',
        repayment_date: '',
        bill_date: new Date().toISOString().split('T')[0],
        labour_charges: '',
        weighing_charges: ''
      })

      // Refresh bills and stocks
      await fetchBills()
      const updatedStocks = await stockAPI.getAll()
      setStocks(updatedStocks)

      alert('Purchase bill created successfully!')
    } catch (error) {
      console.error('Error creating purchase bill:', error)
      alert('Failed to create purchase bill')
    } finally {
      setLoading(false)
    }
  }

  const handleSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateSaleForm()) {
      return
    }

    setLoading(true)
    try {
      const grandTotal = Number(calculateGrandTotal(saleForm.items, saleForm.labour_charges, saleForm.weighing_charges))
      const amountPaid = Number(saleForm.amount_paid) || 0
      const remaining = grandTotal - amountPaid

      await saleBillAPI.create({
        shop_name: saleForm.shop_name,
        mobile_number: saleForm.mobile_number,
        items: saleForm.items.map(item => ({
          crop_name: item.crop_name,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
          total: calculateItemTotal(item.quantity, item.rate)
        })),
        total_amount: Number(grandTotal),
        amount_paid: amountPaid,
        repayment_date: remaining > 0 ? saleForm.repayment_date : null,
        bill_date: saleForm.bill_date,
        labour_charges: Number(saleForm.labour_charges),
        weighing_charges: Number(saleForm.weighing_charges)
      })

      // Reset form
      setSaleForm({
        shop_name: '',
        mobile_number: '',
        items: [{ crop_name: '', quantity: '', rate: '', total: 0 }],
        amount_paid: '',
        repayment_date: '',
        bill_date: new Date().toISOString().split('T')[0],
        labour_charges: '',
        weighing_charges: ''
      })

      // Refresh bills and stocks
      await fetchBills()
      const updatedStocks = await stockAPI.getAll()
      setStocks(updatedStocks)

      alert('Sale bill created successfully!')
    } catch (error) {
      console.error('Error creating sale bill:', error)
      alert('Failed to create sale bill')
    } finally {
      setLoading(false)
    }
  }

  // Delete bill handlers
  const handleDeletePurchaseBill = async (billId: number) => {
    if (!confirm('Are you sure you want to delete this purchase bill?')) {
      return
    }

    try {
      await purchaseBillAPI.delete(billId)
      setPurchaseBills(purchaseBills.filter(bill => bill.id !== billId))
      const updatedStocks = await stockAPI.getAll()
      setStocks(updatedStocks)
    } catch (error) {
      console.error('Error deleting purchase bill:', error)
      alert('Failed to delete purchase bill')
    }
  }

  const handleDeleteSaleBill = async (billId: number) => {
    if (!confirm('Are you sure you want to delete this sale bill?')) {
      return
    }

    try {
      await saleBillAPI.delete(billId)
      setSaleBills(saleBills.filter(bill => bill.id !== billId))
      const updatedStocks = await stockAPI.getAll()
      setStocks(updatedStocks)
    } catch (error) {
      console.error('Error deleting sale bill:', error)
      alert('Failed to delete sale bill')
    }
  }

  // PDF generation handlers
  const generatePurchasePDF = async (bill: PurchaseBillData) => {
    try {
      const pdfData = await pdfGenerator.generatePurchaseBill(bill)
      const link = document.createElement('a')
      link.href = pdfData
      link.download = `Purchase_Bill_P${bill.id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error generating purchase PDF:', error)
      alert('Failed to generate PDF. Please try again or disable browser extensions.')
    }
  }

  const generateSalePDF = async (bill: SaleBillData) => {
    try {
      const pdfData = await pdfGenerator.generateSaleBill(bill)
      const link = document.createElement('a')
      link.href = pdfData
      link.download = `Sale_Bill_S${bill.id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error generating sale PDF:', error)
      alert('Failed to generate PDF. Please try again or disable browser extensions.')
    }
  }

  const currentForm = billType === 'purchase' ? purchaseForm : saleForm
  const handleSubmit = billType === 'purchase' ? handlePurchaseSubmit : handleSaleSubmit

  // Calculate values for display
  const itemsTotal = calculateItemsTotal(currentForm.items)
  const grandTotal = calculateGrandTotal(currentForm.items, currentForm.labour_charges, currentForm.weighing_charges)
  const remainingAmount = calculateRemaining(grandTotal, currentForm.amount_paid)

  return (
    <div className="space-y-6">
      <style>{hideNumberArrowsStyles}</style>
      <Card className="p-6 bg-card border border-border">
        <h2 className="text-2xl font-semibold text-card-foreground mb-6">Bill Generation</h2>
        
        {/* Bill Type Toggle */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setBillType('purchase')}
            variant={billType === 'purchase' ? 'default' : 'outline'}
            className="flex-1"
          >
            Farmer Purchase Bill
          </Button>
          <Button
            onClick={() => setBillType('sale')}
            variant={billType === 'sale' ? 'default' : 'outline'}
            className="flex-1"
          >
            Shop Sale Bill
          </Button>
        </div>

        {/* Bill Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Information */}
          <div className="bg-secondary/30 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Step 1: Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Farmer/Shop Name */}
              {billType === 'purchase' ? (
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Farmer Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={purchaseForm.farmer_name}
                    onChange={(e) => setPurchaseForm(prev => ({ ...prev, farmer_name: e.target.value }))}
                    placeholder="Enter farmer name"
                    className={`border ${purchaseFormErrors.farmer_name ? 'border-red-500' : 'border-input'} bg-background text-foreground`}
                  />
                  {purchaseFormErrors.farmer_name && (
                    <p className="text-red-500 text-sm mt-1">{purchaseFormErrors.farmer_name}</p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={saleForm.shop_name}
                    onChange={(e) => setSaleForm(prev => ({ ...prev, shop_name: e.target.value }))}
                    placeholder="Enter shop name"
                    className={`border ${saleFormErrors.shop_name ? 'border-red-500' : 'border-input'} bg-background text-foreground`}
                  />
                  {saleFormErrors.shop_name && (
                    <p className="text-red-500 text-sm mt-1">{saleFormErrors.shop_name}</p>
                  )}
                </div>
              )}

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  value={billType === 'purchase' ? purchaseForm.mobile_number : saleForm.mobile_number}
                  onChange={(e) => {
                    const formattedValue = formatMobileNumberForInput(e.target.value)
                    if (billType === 'purchase') {
                      setPurchaseForm(prev => ({ ...prev, mobile_number: formattedValue }))
                    } else {
                      setSaleForm(prev => ({ ...prev, mobile_number: formattedValue }))
                    }
                  }}
                  placeholder="Enter 10-digit mobile number"
                  className={`border ${billType === 'purchase' ? (purchaseFormErrors.mobile_number ? 'border-red-500' : 'border-input') : (saleFormErrors.mobile_number ? 'border-red-500' : 'border-input')} bg-background text-foreground`}
                  maxLength={10}
                />
                {(billType === 'purchase' ? purchaseFormErrors.mobile_number : saleFormErrors.mobile_number) && (
                  <p className="text-red-500 text-sm mt-1">{billType === 'purchase' ? purchaseFormErrors.mobile_number : saleFormErrors.mobile_number}</p>
                )}
              </div>

              {/* Bill Date */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Bill Date
                </label>
                <Input
                  type="date"
                  value={currentForm.bill_date}
                  readOnly
                  className="border border-input bg-muted text-foreground cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Items */}
          <div className="bg-secondary/30 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-card-foreground">Step 2: Items</h3>
              <Button
                type="button"
                onClick={() => addItem(billType)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>
            
            {(billType === 'purchase' ? purchaseFormErrors.items : saleFormErrors.items) && (
              <p className="text-red-500 text-sm">{billType === 'purchase' ? purchaseFormErrors.items : saleFormErrors.items}</p>
            )}

            {/* Items List */}
            <div className="space-y-4">
              {currentForm.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-background rounded-lg border border-border">
                  {/* Crop Name */}
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Crop <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={item.crop_name}
                      onChange={(e) => updateItem(billType, index, 'crop_name', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="">Select Crop</option>
                      {stocks.map(stock => (
                        <option key={stock.id} value={stock.crop_name}>
                          {stock.crop_name} (Available: {stock.quantity})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Quantity <span className="text-red-500">*</span>
                      {billType === 'sale' && item.crop_name && (
                        <span className="text-xs text-muted-foreground ml-2">
                          (Available: {stocks.find(s => s.crop_name === item.crop_name)?.quantity || 0})
                        </span>
                      )}
                    </label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(billType, index, 'quantity', e.target.value)}
                      placeholder="Enter quantity"
                      className="border border-input bg-background text-foreground"
                    />
                  </div>

                  {/* Rate */}
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Rate (₹) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(billType, index, 'rate', e.target.value)}
                      placeholder="Enter rate"
                      className="border border-input bg-background text-foreground"
                    />
                  </div>

                  {/* Total & Remove */}
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Total
                      </label>
                      <div className="px-3 py-2 border border-input rounded-md bg-muted text-foreground font-semibold">
                        ₹{item.total.toFixed(2)}
                      </div>
                    </div>
                    {currentForm.items.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeItem(billType, index)}
                        variant="destructive"
                        size="sm"
                        className="mb-0"
                      />
                    )}
                  </div>
                </div>
              ))}
              </div>
          </div>

          {/* Step 3: Additional Charges */}
          <div className="bg-secondary/30 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Step 3: Additional Charges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Labour Charges (₹) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={currentForm.labour_charges}
                  onChange={(e) => {
                    if (billType === 'purchase') {
                      setPurchaseForm(prev => ({ ...prev, labour_charges: e.target.value }))
                    } else {
                      setSaleForm(prev => ({ ...prev, labour_charges: e.target.value }))
                    }
                  }}
                  placeholder="Enter labour charges"
                  className={`border ${billType === 'purchase' ? (purchaseFormErrors.labour_charges ? 'border-red-500' : 'border-input') : (saleFormErrors.labour_charges ? 'border-red-500' : 'border-input')} bg-background text-foreground`}
                />
                {(billType === 'purchase' ? purchaseFormErrors.labour_charges : saleFormErrors.labour_charges) && (
                  <p className="text-red-500 text-sm mt-1">{billType === 'purchase' ? purchaseFormErrors.labour_charges : saleFormErrors.labour_charges}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Weighing Charges (₹) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={currentForm.weighing_charges}
                  onChange={(e) => {
                    if (billType === 'purchase') {
                      setPurchaseForm(prev => ({ ...prev, weighing_charges: e.target.value }))
                    } else {
                      setSaleForm(prev => ({ ...prev, weighing_charges: e.target.value }))
                    }
                  }}
                  placeholder="Enter weighing charges"
                  className={`border ${billType === 'purchase' ? (purchaseFormErrors.weighing_charges ? 'border-red-500' : 'border-input') : (saleFormErrors.weighing_charges ? 'border-red-500' : 'border-input')} bg-background text-foreground`}
                />
                {(billType === 'purchase' ? purchaseFormErrors.weighing_charges : saleFormErrors.weighing_charges) && (
                  <p className="text-red-500 text-sm mt-1">{billType === 'purchase' ? purchaseFormErrors.weighing_charges : saleFormErrors.weighing_charges}</p>
                )}
              </div>
            </div>
          </div>

          {/* Step 4: Payment Details */}
          <div className="bg-secondary/30 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Step 4: Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Amount Paid (₹) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={currentForm.amount_paid}
                  onChange={(e) => {
                    if (billType === 'purchase') {
                      setPurchaseForm(prev => ({ ...prev, amount_paid: e.target.value }))
                    } else {
                      setSaleForm(prev => ({ ...prev, amount_paid: e.target.value }))
                    }
                  }}
                  placeholder="Enter amount paid"
                  className={`border ${billType === 'purchase' ? (purchaseFormErrors.amount_paid ? 'border-red-500' : 'border-input') : (saleFormErrors.amount_paid ? 'border-red-500' : 'border-input')} bg-background text-foreground`}
                />
                {(billType === 'purchase' ? purchaseFormErrors.amount_paid : saleFormErrors.amount_paid) && (
                  <p className="text-red-500 text-sm mt-1">{billType === 'purchase' ? purchaseFormErrors.amount_paid : saleFormErrors.amount_paid}</p>
                )}
              </div>

              {/* Repayment Date - Only show if remaining amount > 0 */}
              {Number(remainingAmount) > 0 && (
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Repayment Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={currentForm.repayment_date}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                    onChange={(e) => {
                      if (billType === 'purchase') {
                        setPurchaseForm(prev => ({ ...prev, repayment_date: e.target.value }))
                      } else {
                        setSaleForm(prev => ({ ...prev, repayment_date: e.target.value }))
                      }
                    }}
                    className={`border ${billType === 'purchase' ? (purchaseFormErrors.repayment_date ? 'border-red-500' : 'border-input') : (saleFormErrors.repayment_date ? 'border-red-500' : 'border-input')} bg-background text-foreground`}
                  />
                  {(billType === 'purchase' ? purchaseFormErrors.repayment_date : saleFormErrors.repayment_date) && (
                    <p className="text-red-500 text-sm mt-1">{billType === 'purchase' ? purchaseFormErrors.repayment_date : saleFormErrors.repayment_date}</p>
                  )}
                </div>
              )}
            </div>

            {/* Total and Remaining Display */}
            <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 space-y-2">
              <div className="text-xl font-bold text-amber-700">
                Grand Total: ₹{grandTotal}
              </div>
              <div className="text-lg font-bold text-amber-700">
                Amount Paid: ₹{Number(currentForm.amount_paid || 0).toFixed(2)}
              </div>
              <div className="text-lg font-bold text-amber-700">
                Remaining: ₹{remainingAmount}
              </div>
              {Number(remainingAmount) <= 0 && (
                <p className="text-green-600 text-sm">Amount fully paid - No repayment needed</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? 'Creating Bill...' : 'Create Bill'}
          </Button>
        </form>
      </Card>

      {/* Bills List */}
      <Card className="p-6 bg-card border border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-card-foreground">
              {billType === 'purchase' ? 'Purchase Bills' : 'Sale Bills'}
            </h3>
          </div>
          
          {/* Search Input */}
          <div className="relative w-full md:w-1/2">
            <Input
              type="text"
              placeholder={billType === 'purchase' 
                ? "Search by farmer name or bill ID (e.g., P1, John)..." 
                : "Search by shop name or bill ID (e.g., S1, Shop)..."}
              value={billType === 'purchase' ? purchaseSearchQuery : saleSearchQuery}
              onChange={(e) => {
                if (billType === 'purchase') {
                  setPurchaseSearchQuery(e.target.value)
                } else {
                  setSaleSearchQuery(e.target.value)
                }
              }}
              className="border-2 border-primary/50 bg-background text-foreground w-full pl-10 pr-4 py-2 rounded-lg shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {(billType === 'purchase' ? filteredPurchaseBills : filteredSaleBills).length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {(billType === 'purchase' ? purchaseSearchQuery : saleSearchQuery) 
              ? `No ${billType} bills found matching your search.` 
              : `No ${billType} bills created yet.`}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-card-foreground font-semibold">Bill #</th>
                  <th className="text-left py-3 px-4 text-card-foreground font-semibold">
                    {billType === 'purchase' ? 'Farmer Name' : 'Shop Name'}
                  </th>
                  <th className="text-left py-3 px-4 text-card-foreground font-semibold">Items</th>
                  <th className="text-left py-3 px-4 text-card-foreground font-semibold">Items Total</th>
                  <th className="text-left py-3 px-4 text-card-foreground font-semibold">Charges</th>
                  <th className="text-left py-3 px-4 text-card-foreground font-semibold">Grand Total</th>
                  <th className="text-left py-3 px-4 text-card-foreground font-semibold">Paid</th>
                  <th className="text-left py-3 px-4 text-card-foreground font-semibold">Remaining</th>
                  <th className="text-left py-3 px-4 text-card-foreground font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-card-foreground font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(billType === 'purchase' ? filteredPurchaseBills : filteredSaleBills).map((bill: any) => (
                  <tr key={bill.id} className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">
                      {billType === 'purchase' ? `P${bill.id}` : `S${bill.id}`}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {billType === 'purchase' ? bill.farmer_name : bill.shop_name}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {bill.items?.length || 1} item(s)
                    </td>
                    <td className="py-3 px-4 text-amber-700 font-bold">
                      ₹{(() => {
                        const grandTotal = Number(bill.total_amount) || 0
                        const labour = Number(bill.labour_charges) || 0
                        const weighing = Number(bill.weighing_charges) || 0
                        // Items total = grand total + charges (reverse calculation)
                        return (grandTotal + labour + weighing).toFixed(2)
                      })()}
                    </td>
                    <td className="py-3 px-4 text-amber-600">
                      ₹{(() => {
                        const labour = Number(bill.labour_charges) || 0
                        const weighing = Number(bill.weighing_charges) || 0
                        return (labour + weighing).toFixed(2)
                      })()}
                    </td>
                    <td className="py-3 px-4 text-amber-700 font-bold">
                      ₹{bill.total_amount !== undefined && bill.total_amount !== null ? Number(bill.total_amount).toFixed(2) : '0.00'}
                    </td>
                    <td className="py-3 px-4 text-amber-700 font-bold">
                      ₹{bill.amount_paid !== undefined && bill.amount_paid !== null ? Number(bill.amount_paid).toFixed(2) : '0.00'}
                    </td>
                    <td className="py-3 px-4 text-amber-700 font-bold">
                      ₹{(() => {
                        const total = Number(bill.total_amount) || 0
                        const paid = Number(bill.amount_paid) || 0
                        return (total - paid).toFixed(2)
                      })()}
                    </td>
                    <td className="py-3 px-4">
                      {(() => {
                        const total = Number(bill.total_amount) || 0
                        const paid = Number(bill.amount_paid) || 0
                        const remaining = total - paid
                        const isOverdue = isRepaymentDatePassed(bill.repayment_date, remaining)
                        if (isOverdue) {
                          return (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded text-xs font-bold">
                              ⚠ OVERDUE
                            </div>
                          )
                        }
                        if (remaining > 0 && bill.repayment_date) {
                          return (
                            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-2 py-1 rounded text-xs">
                              Due: {new Date(bill.repayment_date).toLocaleDateString('en-IN')}
                            </div>
                          )
                        }
                        return (
                          <div className="bg-green-100 border border-green-400 text-green-700 px-2 py-1 rounded text-xs">
                            Paid
                          </div>
                        )
                      })()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => billType === 'purchase' 
                            ? generatePurchasePDF(bill as PurchaseBillData) 
                            : generateSalePDF(bill as SaleBillData)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => billType === 'purchase' 
                            ? handleDeletePurchaseBill(bill.id) 
                            : handleDeleteSaleBill(bill.id)}
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
