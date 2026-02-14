'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { UploadCloud, Check, X, Calendar, Package, Loader2 } from 'lucide-react'

export default function StockPusher({ data, onClose }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pushing, setPushing] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  
  // Date State (Default Today)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
      try {
          const { data, error } = await supabase
            .from('products')
            .select('id, name')
            .eq('product_type', 'account')
            .order('name')
          
          if (error) throw error
          setProducts(data || [])
      } catch (err) {
          console.error('Error fetching products:', err)
          setError('Failed to load products from Admin.')
      } finally {
          setLoading(false)
      }
  }

  const handlePush = async () => {
      if (!selectedProduct) return
      setPushing(true)
      setError(null)

      try {
          // Prepare payload
          // We combine all relevant data into account_data JSON
          const accountData = {
              email: data.email,
              password: data.password,
              accountName: data.accountName,
              billingName: data.billingName,
              address: data.address,
              card: data.card,
              original_created_at: data.createdAt,
              template: data.template
          }

          // Construct Timestamp with current time but selected date
          const now = new Date()
          const [year, month, day] = date.split('-')
          now.setFullYear(year, month - 1, day)
          
          const payload = {
              product_id: selectedProduct,
              account_data: accountData,
              is_sold: false,
              created_at: now.toISOString()
          }

          const { error } = await supabase
            .from('account_stocks')
            .insert(payload)

          if (error) throw error

          setSuccess(true)
          
          // Close after 2 seconds
          setTimeout(() => {
              onClose()
          }, 2000)

      } catch (err) {
          console.error('Push error:', err)
          setError(err.message || 'Failed to push stock.')
      } finally {
          setPushing(false)
      }
  }

  if (success) {
      return (
          <div className="p-6 bg-green-50 rounded-xl flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Check className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-green-800">Stock Uploaded!</h3>
              <p className="text-green-600 text-sm">Account added to inventory.</p>
          </div>
      )
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4 animate-in slide-in-from-bottom-2">
       <div className="flex items-center justify-between mb-4">
           <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <UploadCloud className="w-4 h-4 text-blue-600" />
               Push to Admin Stock
           </h3>
       </div>

       {error && (
           <div className="mb-3 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100 flex items-center gap-2">
               <X className="w-3 h-3" />
               {error}
           </div>
       )}

       {loading ? (
           <div className="flex items-center justify-center py-4 text-slate-400 gap-2">
               <Loader2 className="w-4 h-4 animate-spin" />
               <span className="text-xs">Loading products...</span>
           </div>
       ) : (
           <div className="space-y-3">
               
               {/* Product Select */}
               <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">
                       Select Product
                   </label>
                   <div className="relative">
                       <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <select 
                          value={selectedProduct}
                          onChange={(e) => setSelectedProduct(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-slate-700"
                       >
                           <option value="">-- Choose Product --</option>
                           {products.map(p => (
                               <option key={p.id} value={p.id}>{p.name}</option>
                           ))}
                       </select>
                   </div>
               </div>

               {/* Date Picker */}
               <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">
                       Stock Date
                   </label>
                   <div className="relative">
                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-slate-700"
                       />
                   </div>
               </div>

               {/* Action Button */}
               <button 
                  onClick={handlePush}
                  disabled={!selectedProduct || pushing}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm"
               >
                   {pushing ? (
                       <Loader2 className="w-4 h-4 animate-spin" />
                   ) : (
                       <UploadCloud className="w-4 h-4" />
                   )}
                   {pushing ? 'Uploading...' : 'Push to Stock'}
               </button>

           </div>
       )}
    </div>
  )
}
