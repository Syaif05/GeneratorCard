'use client'

import { useState } from 'react'
import { generateCreditCard } from '../lib/cc-generator'
import { Copy, Check, Zap, Terminal, CreditCard, Layers } from 'lucide-react'

export default function BulkGenerator() {
  const [bin, setBin] = useState('')
  const [month, setMonth] = useState('Random')
  const [year, setYear] = useState('Random')
  const [cvv, setCvv] = useState('')
  const [quantity, setQuantity] = useState(10)
  const [results, setResults] = useState('')
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    if (!bin || bin.length < 6) {
        alert("Please enter a valid BIN (min 6 digits)")
        return
    }
    
    setIsGenerating(true)
    
    setTimeout(() => {
        const cards = generateCreditCard(bin, quantity, month, year, cvv)
        setResults(cards.join('\n'))
        setIsGenerating(false)
    }, 500)
  }

  const handleCopy = () => {
    if (!results) return
    navigator.clipboard.writeText(results)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const years = Array.from({length: 10}, (_, i) => new Date().getFullYear() + i)

  return (
    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
      {/* Left Panel: Configuration */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
         <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Layers className="w-5 h-5" />
            </div>
            Generator Config
         </h2>
         
         <div className="space-y-6">
            {/* BIN Input */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Target BIN</label>
                <div className="relative">
                    <input 
                        type="text" 
                        value={bin}
                        onChange={(e) => setBin(e.target.value.replace(/\D/g, ''))}
                        placeholder="Ex: 453986" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono text-lg tracking-wider"
                        maxLength={16}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <CreditCard className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Date Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">EXP Month</label>
                   <div className="relative">
                       <select 
                          value={month}
                          onChange={(e) => setMonth(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer font-mono"
                       >
                            <option value="Random">Random</option>
                            {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0')).map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                       </select>
                   </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">EXP Year</label>
                   <div className="relative">
                       <select 
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer font-mono"
                       >
                            <option value="Random">Random</option>
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                       </select>
                   </div>
                </div>
            </div>

            {/* CVV & Quantity */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">CVV / CVC</label>
                    <input 
                        type="text" 
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="Random"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all font-mono"
                        maxLength={4}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Quantity</label>
                    <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)} 
                        min={1}
                        max={100}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all font-mono"
                    />
                </div>
            </div>

            {/* Generate Button */}
            <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <Zap className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Processing...' : 'Generate Cards'}
            </button>
         </div>
      </div>

      {/* Right Panel: Output */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full min-h-[420px]">
         {/* Output Header */}
         <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-2 text-slate-700 font-semibold">
                 <Terminal className="w-5 h-5 text-slate-400" />
                 Generated Output
             </div>
             <span className="text-xs font-mono bg-slate-200 text-slate-600 px-2 py-1 rounded">
                Format: PIPE (|)
             </span>
         </div>

         {/* Text Area */}
         <div className="flex-1 relative bg-slate-900">
            <textarea 
                readOnly
                value={results}
                className="w-full h-full bg-transparent text-green-400 font-mono text-sm p-6 resize-none outline-none scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent leading-relaxed"
                placeholder="Results will appear here..."
            />
            {!results && (
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                    <Layers className="w-24 h-24 text-white" />
                </div>
            )}
         </div>

         {/* Copy Button */}
         <div className="p-4 border-t border-slate-100 bg-white">
             <button 
                onClick={handleCopy}
                disabled={!results}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                    ${copied 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
             >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied Successfully' : 'Copy Result'}
             </button>
         </div>
      </div>

    </div>
  )
}
