'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCw, Save, Check, Copy, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { generateCreditCard } from '../../../lib/cc-generator'
import { generateGmailDotTrick } from '../../../lib/gmail-generator'

// Real Address Data (Gangwon-do)
const gangwonAddresses = [
    { city: 'Chuncheon-si', zip: '24239', street: 'Jungang-ro 1-gil 15' },
    { city: 'Chuncheon-si', zip: '24347', street: 'Sakju-ro 77-gil 22' },
    { city: 'Wonju-si', zip: '26417', street: 'Seowon-daero 121-gil 45' },
    { city: 'Wonju-si', zip: '26456', street: 'Dangu-ro 170' },
    { city: 'Gangneung-si', zip: '25535', street: 'Saimdang-ro 107-gil 30' },
    { city: 'Gangneung-si', zip: '25458', street: 'Yulgok-ro 2868' },
    { city: 'Sokcho-si', zip: '24823', street: 'Jungang-ro 147-gil 16' },
    { city: 'Donghae-si', zip: '25752', street: 'Cheongok-ro 88' },
    { city: 'Samcheok-si', zip: '25932', street: 'Jungang-ro 296' },
    { city: 'Taebaek-si', zip: '26034', street: 'Taebaek-ro 1024' }
]

const koreanNames = [
    'Kim Min-jun (김민준)', 'Lee Seo-jun (이서준)', 'Park Ji-hu (박지후)', 
    'Choi Ye-jun (최예준)', 'Jung Do-yun (정도윤)', 'Kang Ha-jun (강하준)',
    'Yoon Woo-jin (윤우진)', 'Jang Si-woo (장시우)', 'Lim Ju-won (임주원)',
    'Han Ji-ho (한지호)', 'Kim Seo-yeon (김서연)', 'Lee Soo-ah (이수아)',
    'Park Seo-yun (박서윤)', 'Choi Ji-a (최지아)', 'Jung Ha-eun (정하은)'
]

const latinNames = [
    'Alex Jordan', 'Michael Chen', 'Sarah Smith', 'David Kim', 'Emily Davis', 
    'James Wilson', 'Jessica Brown', 'Daniel Lee', 'Olivia Taylor', 'Robert Martin'
]

export default function ChatGPTTemplate() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(null)
  
  // Input State
  const [manualEmail, setManualEmail] = useState('otakaljabar@gmail.com')
  const [emailStatus, setEmailStatus] = useState(null) // null, 'generated', 'exhausted'

  const generateIdentity = async () => {
    setLoading(true)
    setSaved(false)
    setEmailStatus(null)

    // Simulate Delay
    await new Promise(r => setTimeout(r, 600))

    // 1. EMAIL LOGIC (Dot Trick & History Check)
    let email = ''
    const history = JSON.parse(localStorage.getItem('identity_history') || '[]')
    const usedEmails = new Set(history.map(item => item.email))

    let baseEmail = manualEmail.trim()
    if (!baseEmail || !baseEmail.includes('@')) {
        // Fallback Random base if empty
        const randomBase = `user${Math.floor(Math.random() * 9999)}@gmail.com`
        baseEmail = randomBase
    }

    try {
        // Generate ALL possible dot aliases
        const allAliases = generateGmailDotTrick(baseEmail)
        
        // Filter out used ones
        const availableAliases = allAliases.filter(alias => !usedEmails.has(alias))
        
        if (availableAliases.length > 0) {
            // Pick Random valid alias
            email = availableAliases[Math.floor(Math.random() * availableAliases.length)]
            setEmailStatus('generated')
        } else {
            // Warning: All dot combos used
            email = baseEmail // Fallback to original
            setEmailStatus('exhausted')
        }

    } catch (e) {
        console.error("Dot trick error:", e)
        email = baseEmail
    }

    // 3. NAMES (Separate Account vs Billing)
    const accountName = latinNames[Math.floor(Math.random() * latinNames.length)]
    const billingName = koreanNames[Math.floor(Math.random() * koreanNames.length)]

    // 2. PASSWORD (New Logic: FirstName + 4 random)
    const firstName = accountName.split(' ')[0]
    const chars = "0123456789!@#$%^&*?"
    let suffix = ""
    for (let i = 0; i < 4; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    const password = `${firstName}${suffix}`

    // 4. CARD (BIN 625814260)
    const bin = '625814260'
    const fullDate = new Date()
    const randYear = Math.floor(Math.random() * 5) + 26 // YY format: 26, 27, 28...
    const yearStr = randYear.toString()
    const month = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0')
    const cvv = (Math.floor(Math.random() * 900) + 100).toString()
    
    // Generate PAN
    const [cardString] = generateCreditCard(bin, 1) // Returns ["PAN|MM|YYYY|CVV"]
    const pan = cardString.split('|')[0]
    
    // Combined Date
    const combinedDate = `${month}/${yearStr}`

    // 5. ADDRESS (Real Gangwon-do)
    const addr = gangwonAddresses[Math.floor(Math.random() * gangwonAddresses.length)]
    
    setData({
        email,
        password,
        accountName,
        billingName,
        card: {
            pan,
            month,
            year: yearStr,
            combinedDate,
            cvv,
            fullString: `${pan}|${month}|${yearStr}|${cvv}`
        },
        address: {
            country: 'South Korea',
            province: 'Gangwon-do (강원도)', // Locked
            city: addr.city,
            street: addr.street,
            zip: addr.zip
        },
        createdAt: new Date().toISOString()
    })
    
    setLoading(false)
  }

  // Generate on first load if no manual email, or wait for user?
  // Usually templates auto-generate. Let's auto-generate with random base first time.
  useEffect(() => {
      generateIdentity()
  }, []) // Empty dependency array = run once on mount

  const handleSave = () => {
      if (!data) return
      
      const existing = JSON.parse(localStorage.getItem('identity_history') || '[]')
      const newItem = {
          ...data,
          id: Date.now(),
          template: 'ChatGPT Pro 1Bulan',
          status: 'Active'
      }
      localStorage.setItem('identity_history', JSON.stringify([newItem, ...existing]))
      setSaved(true)
  }

  const copyToClipboard = (text, key) => {
      navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 1500)
  }

  const DataRow = ({ label, value, copyValue, id, locked }) => (
      <div 
        onClick={() => !locked && copyToClipboard(copyValue || value, id)}
        className={`flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl transition-all group
            ${locked ? 'opacity-80 cursor-default bg-slate-50' : 'hover:bg-slate-50 cursor-pointer hover:border-blue-200'}`}
      >
          <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
              <div className={`font-medium font-mono text-sm sm:text-base break-all ${locked ? 'text-slate-500' : 'text-slate-800'}`}>
                  {value}
              </div>
          </div>
          {!locked && (
            <button className="text-slate-300 group-hover:text-blue-500 transition-colors">
                {copied === id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
      </div>
  )

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-28 pb-12 px-4 sm:px-6"> 
       <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                  <Link href="/templates" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
                      <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </Link>
                  <div>
                      <h1 className="text-2xl font-bold text-slate-900">ChatGPT Pro</h1>
                      <p className="text-sm text-slate-500">Template Generator</p>
                  </div>
              </div>

              {/* Config Area */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 w-full">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                          Manual Email Base (Optional)
                      </label>
                      <input 
                          type="email" 
                          value={manualEmail} 
                          onChange={(e) => setManualEmail(e.target.value)}
                          placeholder="e.g. myemail@gmail.com (Auto Dot Trick)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all font-mono"
                      />
                  </div>
                  <button 
                    onClick={generateIdentity}
                    disabled={loading}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70 font-semibold text-sm h-[42px] mt-auto"
                  >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      {loading ? 'Generating...' : 'Regenerate Identity'}
                  </button>
              </div>
          </div>

          {/* Content */}
          {data && (
              <div className="space-y-6 animate-slide-up">
                  
                  {/* Status Messages */}
                  {emailStatus === 'exhausted' && (
                      <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm flex items-center gap-2 border border-yellow-200">
                          <AlertTriangle className="w-4 h-4" />
                          Warning: All dot trick combinations for this email have been used in History. Using original.
                      </div>
                  )}

                  {/* Account Info */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 font-bold text-slate-700 text-sm uppercase tracking-wide">
                          Account Information
                      </div>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <DataRow label="Email Address (Dot Trick)" value={data.email} id="email" />
                          <DataRow label="Password" value={data.password} id="password" />
                          <div className="md:col-span-2">
                             <DataRow label="Account Name (Latin)" value={data.accountName} id="acc_name" />
                          </div>
                      </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 font-bold text-slate-700 text-sm uppercase tracking-wide flex justify-between">
                          <span>Payment Method</span>
                          <span className="text-xs text-slate-400">BIN: 625814260</span>
                      </div>
                      <div className="p-4 space-y-4">
                          <DataRow 
                            label="One-Click Copy (Pipe Separated)" 
                            value={data.card.fullString} 
                            id="card_full" 
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <DataRow label="Card Number" value={data.card.pan} id="pan" />
                              <DataRow label="Date (MM/YY)" value={data.card.combinedDate} id="date" />
                              <DataRow label="CVV" value={data.card.cvv} id="cvv" />
                          </div>
                      </div>
                  </div>

                  {/* Billing Address */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 font-bold text-slate-700 text-sm uppercase tracking-wide border-l-4 border-l-blue-500">
                          Billing Address (South Korea)
                      </div>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                             <DataRow label="Billing Name (Korean)" value={data.billingName} id="bill_name" />
                          </div>
                          <DataRow label="Country" value={data.address.country} locked={true} />
                          <DataRow label="Province / State" value={data.address.province} locked={true} />
                          <DataRow label="City" value={data.address.city} id="city" />
                          <DataRow label="Street Address" value={data.address.street} id="street" />
                          <DataRow label="Zip Code" value={data.address.zip} id="zip" />
                      </div>
                  </div>
                  
                  {/* Action */}
                  <div className="flex justify-end pt-4 pb-12">
                      {saved ? (
                          <button disabled className="flex items-center gap-2 px-8 py-4 bg-green-50 text-green-600 border border-green-200 rounded-xl font-bold cursor-default w-full md:w-auto justify-center">
                              <Check className="w-5 h-5" />
                              Saved to History
                          </button>
                      ) : (
                          <button 
                            onClick={handleSave}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 font-bold transition-all active:scale-[0.98] w-full md:w-auto"
                          >
                              <Save className="w-5 h-5" />
                              Activate & Save History
                          </button>
                      )}
                  </div>

              </div>
          )}
       </div>
    </main>
  )
}
