'use client'
import { useState } from 'react'
import { downloadCSV, downloadJSON } from '../lib/utils'
import { Sparkles, Download, Layers } from 'lucide-react'

// Import Komponen Modular
import Navbar from '../components/Navbar'
import Controls from '../components/Controls'
import CreditCard from '../components/CreditCard'

export default function Home() {
  const [count, setCount] = useState(3)
  const [nameLength, setNameLength] = useState(2)
  const [theme, setTheme] = useState('black')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: parseInt(count), nameLength: parseInt(nameLength) })
      })
      const result = await res.json()
      if (result.success) setData(result.data)
    } catch (error) {
      alert('Error generating data')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen pb-20 bg-[#f5f5f7] selection:bg-yellow-200 selection:text-yellow-900 font-sans text-slate-900">
      
      {/* Navbar moved to layout.js */}

      <div className="pt-32 pb-8 max-w-5xl mx-auto px-6 text-center animate-slide-up">
         <h1 className="text-5xl font-black tracking-tight mb-4">
            Generate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Realistic</span> Identities.
         </h1>
         <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Professional dummy data with ISO-standard credit card designs. <br/>
            <span className="text-sm opacity-70">(Data is simulated and safe for testing)</span>
         </p>
      </div>

      {/* Bagian Controls dipisah ke komponen sendiri */}
      <Controls 
        count={count} setCount={setCount}
        nameLength={nameLength} setNameLength={setNameLength}
        theme={theme} setTheme={setTheme}
        loading={loading} onGenerate={handleGenerate}
      />

      {/* Result Grid */}
      <div className="max-w-7xl mx-auto px-6">
         {data.length > 0 && (
            <div className="mb-6 flex justify-end gap-3 animate-slide-up">
                 <button onClick={() => downloadCSV(data)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                    <Download className="w-4 h-4"/> CSV
                 </button>
                 <button onClick={() => downloadJSON(data)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                    <Download className="w-4 h-4"/> JSON
                 </button>
            </div>
         )}
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {data.map((row, i) => (
                <CreditCard key={row.id} data={row} theme={theme} index={i} />
            ))}
         </div>

         {/* Empty State */}
         {data.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-24 opacity-40">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                    <Layers className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-400 font-medium">Ready to generate.</p>
            </div>
         )}
      </div>
    </main>
  )
}