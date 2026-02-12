'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Trash2, Edit2, Save, X, ChevronLeft, ChevronRight, Search } from 'lucide-react'

export default function Admin() {
  // Upload State
  const [category, setCategory] = useState('name_gender')
  const [customCategory, setCustomCategory] = useState('') 
  const [rawText, setRawText] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // Data Table State
  const [dbData, setDbData] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterCategory, setFilterCategory] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  // FETCH DATA
  const fetchData = async () => {
    setLoadingData(true)
    try {
        const res = await fetch(`/api/admin?page=${page}&limit=10&category=${filterCategory}`)
        const result = await res.json()
        if (result.success) {
            setDbData(result.data)
            setTotalPages(result.meta.last_page)
        }
    } catch (e) {
        console.error(e)
    }
    setLoadingData(false)
  }

  useEffect(() => {
    fetchData()
  }, [page, filterCategory])

  // ACTIONS
  const handleUpload = async () => {
    setIsUploading(true)
    const finalCategory = category === 'custom' ? customCategory.toLowerCase().replace(/\s/g, '_') : category
    const items = rawText.split('\n')
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: finalCategory, items })
      })
      const result = await res.json()
      if (result.success) {
        setUploadStatus(`Success! Added ${result.count} items.`)
        setRawText('')
        fetchData() // Refresh table
      } else {
        setUploadStatus(`Error: ${result.error}`)
      }
    } catch (error) {
      setUploadStatus('Upload failed.')
    }
    setIsUploading(false)
  }

  const handleDelete = async (id) => {
    if(!confirm('Delete this item?')) return
    await fetch('/api/admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    fetchData()
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditValue(item.value)
  }

  const saveEdit = async (id) => {
    await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value: editValue })
    })
    setEditingId(null)
    fetchData()
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Generator
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: UPLOAD FORM */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="font-bold text-lg mb-4">Inject Data</h2>
                    
                    <div className="mb-4">
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Column</label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        >
                            <option value="name_gender">Name & Gender</option>
                            <option value="email">Email Domain</option>
                            <option value="card">Credit Card (Pipe |)</option>
                            <option value="custom">+ Custom</option>
                        </select>
                        {category === 'custom' && (
                            <input 
                                type="text"
                                placeholder="new_column_name"
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                className="w-full mt-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-sm"
                            />
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Data (1 per line)</label>
                        <textarea
                            rows="6"
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            placeholder={category === 'card' ? "Num|MM|YYYY|CVV" : "Value"}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-green-600 font-medium truncate max-w-[120px]">{uploadStatus}</span>
                        <button
                            onClick={handleUpload}
                            disabled={isUploading || !rawText}
                            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50"
                        >
                            {isUploading ? '...' : 'Inject'}
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT: DATA TABLE */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                        <h2 className="font-bold text-lg">Database Records</h2>
                        <select 
                            value={filterCategory}
                            onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
                            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        >
                            <option value="all">All Categories</option>
                            <option value="name_gender">Name & Gender</option>
                            <option value="email">Email</option>
                            <option value="card">Card</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-100 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 w-24">Category</th>
                                    <th className="px-4 py-3">Value</th>
                                    <th className="px-4 py-3 w-24 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loadingData ? (
                                    <tr><td colSpan="3" className="p-4 text-center text-slate-400">Loading...</td></tr>
                                ) : dbData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-xs text-slate-500 uppercase font-mono">{item.category}</td>
                                        <td className="px-4 py-3">
                                            {editingId === item.id ? (
                                                <input 
                                                    type="text" 
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-full px-2 py-1 border border-indigo-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                                                />
                                            ) : (
                                                <span className="font-medium text-slate-700 font-mono text-xs">{item.value}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {editingId === item.id ? (
                                                <div className="flex justify-end gap-1">
                                                    <button onClick={() => saveEdit(item.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Save className="w-4 h-4"/></button>
                                                    <button onClick={() => setEditingId(null)} className="p-1 text-red-600 hover:bg-red-50 rounded"><X className="w-4 h-4"/></button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-1">
                                                    <button onClick={() => startEdit(item)} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Edit2 className="w-4 h-4"/></button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
                        >
                            <ChevronLeft className="w-5 h-5"/>
                        </button>
                        <span className="text-xs font-medium text-slate-600">Page {page} of {totalPages}</span>
                        <button 
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
                        >
                            <ChevronRight className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  )
}