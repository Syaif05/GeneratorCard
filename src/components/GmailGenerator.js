'use client'

import { useState } from 'react'
import { generateGmailDotTrick, downloadTxt } from '../lib/gmail-generator'
import { Copy, Check, Zap, Download, Mail, AlertCircle } from 'lucide-react'

export default function GmailGenerator() {
  const [email, setEmail] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = () => {
    setError('')
    setResults([])
    
    if (!email || !email.includes('@')) {
        setError('Please enter a valid email address.')
        return
    }

    const [username] = email.split('@')
    const cleanUser = username.replace(/\./g, '')
    
    if (cleanUser.length > 15) {
        setError('Username too long (max 15 chars). Exponential combinations would crash the browser.')
        return
    }

    setLoading(true)
    
    // Allow UI to update before heavy calculation
    setTimeout(() => {
        try {
            const combos = generateGmailDotTrick(email)
            setResults(combos)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, 100)
  }

  const handleCopy = () => {
    if (results.length === 0) return
    const text = results.join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
     if (results.length === 0) return
     const text = results.join('\n')
     downloadTxt(text, `gmail_aliases_${Date.now()}.txt`)
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8">
      
      {/* Input Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
         <div className="inline-flex items-center justify-center p-3 bg-red-50 text-red-600 rounded-xl mb-4">
            <Mail className="w-8 h-8" />
         </div>
         <h2 className="text-2xl font-bold text-slate-900 mb-2">Gmail Dot Trick</h2>
         <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Generate thousands of valid aliases by inserting dots.
            <br/>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-400 mt-2 inline-block">
                Example: user@gmail -&gt; u.ser@gmail, us.er@gmail...
            </span>
         </p>
         
         <div className="max-w-lg mx-auto space-y-4">
             <div className="relative">
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email (e.g. akunpcsendiri@gmail.com)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-lg"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
             </div>
             
             {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg text-sm text-left">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
             )}

             <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? (
                    'Generating...'
                ) : (
                    <>
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Generate Aliases
                    </>
                )}
            </button>
         </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-slide-up">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                      <Check className="w-5 h-5 text-green-500" />
                      Success! Generated {results.length.toLocaleString()} aliases.
                  </div>
                  <div className="flex gap-2">
                      <button 
                         onClick={handleCopy}
                         className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                         {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                         {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button 
                         onClick={handleDownload}
                         className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                         <Download className="w-4 h-4" />
                         Save .TXT
                      </button>
                  </div>
              </div>
              
              <div className="p-0">
                  <textarea 
                      readOnly
                      value={results.join('\n')}
                      className="w-full h-[400px] bg-white p-6 outline-none resize-none font-mono text-sm text-slate-600 leading-relaxed custom-scrollbar"
                  />
              </div>
          </div>
      )}

    </div>
  )
}
