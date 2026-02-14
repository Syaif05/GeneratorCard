'use client'

import { useState, useEffect } from 'react'
import { Trash2, ExternalLink, Calendar, CreditCard, Mail, X, Copy, Check, User, MapPin } from 'lucide-react'
import StockPusher from '@/components/StockPusher'

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('identity_history') || '[]')
    setHistory(data)
  }, [])

  const deleteItem = (id, e) => {
      e?.stopPropagation() // Prevent modal open
      if (confirm('Are you sure you want to delete this item?')) {
          const newData = history.filter(item => item.id !== id)
          setHistory(newData)
          localStorage.setItem('identity_history', JSON.stringify(newData))
          if (selectedItem?.id === id) setSelectedItem(null)
      }
  }

  const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', { 
          day: 'numeric', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
      })
  }

  const copyToClipboard = (text, key) => {
      navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 1500)
  }

  const DetailRow = ({ label, value, id }) => (
      <div 
         onClick={() => copyToClipboard(value, id)}
         className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer group border border-transparent hover:border-slate-200 transition-all mb-2"
      >
          <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</div>
              <div className="font-mono text-slate-800 text-sm break-all">{value}</div>
          </div>
          <button className="text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all">
              {copied === id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
      </div>
  )

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-28 pb-12 px-4 sm:px-6"> 
       <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
              <div>
                 <h1 className="text-3xl font-bold text-slate-900">History</h1>
                 <p className="text-slate-500 text-sm mt-1">Manage your saved identities.</p>
              </div>
              <span className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                  {history.length} Saved
              </span>
          </div>

          {history.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ExternalLink className="w-6 h-6 text-slate-300" />
                  </div>
                  <h3 className="text-slate-900 font-semibold mb-1">No History Yet</h3>
                  <p className="text-slate-400 text-sm">Generate a template to start saving.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {history.map((item) => (
                      <div 
                         key={item.id} 
                         onClick={() => setSelectedItem(item)}
                         className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group relative overflow-hidden"
                      >
                          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink className="w-4 h-4 text-slate-400" />
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                               <span className="w-2 h-2 rounded-full bg-green-500"></span>
                               <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{item.template}</span>
                          </div>

                          <div className="space-y-3 mb-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                      <Mail className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <div className="text-xs text-slate-400">Email</div>
                                      <div className="text-sm font-semibold text-slate-800 truncate">{item.email}</div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                      <CreditCard className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <div className="text-xs text-slate-400">Card</div>
                                      <div className="text-sm font-semibold text-slate-800 font-mono">
                                          {item.card.pan.slice(0, 4)} ... {item.card.pan.slice(-4)}
                                      </div>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                              <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(item.createdAt).toLocaleDateString()}
                              </div>
                              <button 
                                onClick={(e) => deleteItem(item.id, e)}
                                className="hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                              >
                                  <Trash2 className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {/* DETAIL POPUP MODAL */}
          {selectedItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-up">
                      
                      {/* Modal Header */}
                      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900">{selectedItem.template}</h2>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                  <Calendar className="w-3 h-3" />
                                  Generated on {formatDate(selectedItem.createdAt)}
                              </p>
                          </div>
                          <button 
                            onClick={() => setSelectedItem(null)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                          >
                              <X className="w-5 h-5 text-slate-600" />
                          </button>
                      </div>

                      {/* Modal Content */}
                      <div className="p-6 space-y-6">
                          
                          {/* Section: Account */}
                          <div>
                              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                                  <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                                      <User className="w-4 h-4" />
                                  </div>
                                  Account Details
                              </h3>
                              <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
                                  <DetailRow label="Email" value={selectedItem.email} id="modal_email" />
                                  <DetailRow label="Password" value={selectedItem.password} id="modal_pass" />
                                  <DetailRow label="Account Name" value={selectedItem.accountName} id="modal_name" />
                              </div>
                          </div>

                          {/* Section: Payment */}
                          <div>
                              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                                  <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                                      <CreditCard className="w-4 h-4" />
                                  </div>
                                  Payment Method
                              </h3>
                              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner mb-2">
                                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Full Copy String</div>
                                  <div className="font-mono text-sm text-slate-800 break-all select-all">
                                      {selectedItem.card.fullString}
                                  </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
                                      <DetailRow label="Card Number" value={selectedItem.card.pan} id="modal_pan" />
                                  </div>
                                  <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
                                      <DetailRow label="Date" value={selectedItem.card.combinedDate} id="modal_date" />
                                      <DetailRow label="CVV" value={selectedItem.card.cvv} id="modal_cvv" />
                                  </div>
                              </div>
                          </div>

                          {/* Section: Address */}
                          <div>
                              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                                  <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                                      <MapPin className="w-4 h-4" />
                                  </div>
                                  Billing Address
                              </h3>
                              <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                  <div className="md:col-span-2">
                                      <DetailRow label="Billing Name" value={selectedItem.billingName} id="modal_billname" />
                                  </div>
                                  <DetailRow label="Address" value={selectedItem.address.street} id="modal_addr" />
                                  <DetailRow label="City" value={selectedItem.address.city} id="modal_city" />
                                  <DetailRow label="Region" value={`${selectedItem.address.province}, ${selectedItem.address.country}`} id="modal_region" />
                                  <DetailRow label="Zip Code" value={selectedItem.address.zip} id="modal_zip" />
                              </div>
                          </div>



                          {/* Stock Pusher Integration */}
                          <div className="border-t border-slate-100 pt-4">
                              <StockPusher 
                                  data={selectedItem} 
                                  onClose={() => setSelectedItem(null)} 
                              />
                          </div>

                      </div>

                      {/* Modal Footer */}
                      <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between">
                          <button 
                            onClick={() => deleteItem(selectedItem.id)}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
                          >
                              <Trash2 className="w-4 h-4" />
                              Delete Identity
                          </button>
                          <button 
                             onClick={() => setSelectedItem(null)}
                             className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-bold text-sm transition-colors"
                          >
                             Close
                          </button>
                      </div>

                  </div>
              </div>
          )}
       </div>
    </main>
  )
}
