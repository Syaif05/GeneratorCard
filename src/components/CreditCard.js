import { useState } from 'react'
import { Check, Wifi, Lock } from 'lucide-react' // Import Lock icon
import Tooltip from './Tooltip'

const CardChip = () => (
  <div className="w-11 h-8 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-[4px] border border-yellow-500/50 relative overflow-hidden shadow-sm">
    <div className="absolute top-1/2 w-full h-[1px] bg-yellow-800/40"></div>
    <div className="absolute left-1/3 h-full w-[1px] bg-yellow-800/40"></div>
    <div className="absolute right-1/3 h-full w-[1px] bg-yellow-800/40"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-yellow-800/40 rounded-[2px]"></div>
  </div>
)

const VisaLogo = () => (
    <svg className="w-14 h-auto opacity-90" viewBox="0 0 100 32" fill="currentColor">
       <path d="M33.606 29.54l-3.83-22.957h-6.162l-6.78 16.353-2.85-14.856c-.537-2.126-2.15-4.228-5.328-5.594l.758.995c2.72.76 5.16 2.686 5.86 4.966l5.225 19.98h6.416l9.69-23.86h6.39L33.605 29.54zm23.23-22.614c-1.29-.537-3.33-.94-5.83-.94-6.442 0-10.976 3.425-11.026 8.35-.05 3.626 3.257 5.64 5.734 6.847 2.54 1.24 3.393 2.036 3.393 3.136 0 1.685-2.025 2.463-3.88 2.463-2.61 0-4.004-.39-6.126-1.34l-.854-.416-1.05 6.096c1.734.78 4.935 1.464 8.257 1.464 7.785 0 12.856-3.815 12.93-9.72.024-3.23-1.928-5.69-6.15-7.716-2.54-1.27-4.1-2.125-4.1-3.443 0-1.147 1.293-2.343 4.077-2.343 1.368 0 2.368.293 3.076.61l.366.17 1.148-5.658h.027zm10.74 22.614l5.69-22.957h-6.59l-4.76 17.525-2.028-10.154c-.708-2.612-2.833-5.273-5.325-7.37l9.814 22.956h3.198zm17.925 0l5.127-22.957h-6.244c-1.93 0-3.59.586-4.298 2.394l-12.21 28.53h6.638l1.318-3.662h8.082l.757 3.662h7.45l-6.62-7.967zm-5.713-14.71l2.296 11.048h-5.176l2.88-11.048z"/>
    </svg>
)

export default function CreditCard({ data, theme, index }) {
  const [copied, setCopied] = useState(null)

  const handleCopy = (text, field) => {
    const cleanText = field === 'number' ? text.replace(/\s/g, '') : text;
    navigator.clipboard.writeText(cleanText)
    setCopied(field)
    setTimeout(() => setCopied(null), 1500)
  }

  const formatCardNumber = (num) => {
    if(!num) return '#### #### #### ####';
    return num.toString().replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  const themes = {
    black: "bg-gradient-to-br from-slate-800 via-gray-900 to-black text-slate-100 border-slate-700",
    blue: "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-blue-50 border-blue-500",
    gold: "bg-gradient-to-br from-amber-500 via-yellow-600 to-yellow-800 text-yellow-50 border-yellow-500",
    platinum: "bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-white border-slate-300",
    green: "bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-900 text-emerald-50 border-emerald-500",
    red: "bg-gradient-to-br from-red-600 via-rose-700 to-pink-900 text-rose-50 border-red-500",
  }
  const currentTheme = themes[theme] || themes.black

  return (
    <div 
      className={`relative w-full aspect-[1.586/1] rounded-[20px] p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 ${currentTheme} border-t border-white/20 overflow-hidden shadow-lg animate-slide-up select-none`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Texture Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
         <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
             <path d="M0 100 C 30 10 60 10 100 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
         </svg>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Header: Chip (Kiri) & Wifi + Password (Kanan) */}
        <div className="flex justify-between items-start">
            <CardChip />
            
            <div className="flex flex-col items-end gap-1">
                {/* Contactless Icon */}
                <Wifi className="w-8 h-8 rotate-90 opacity-60" />
                
                {/* PASSWORD BOX (NEW) */}
                <Tooltip text="Copy Password">
                    <div 
                        onClick={() => handleCopy(data.password, 'password')}
                        className="bg-black/20 hover:bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono cursor-pointer flex items-center gap-1 transition-colors border border-white/10 group"
                    >
                        <Lock className="w-2.5 h-2.5 opacity-60" />
                        <span className="font-bold tracking-wide">{data.password}</span>
                        {copied === 'password' && <Check className="w-3 h-3 text-green-400 animate-in zoom-in" />}
                    </div>
                </Tooltip>
            </div>
        </div>

        {/* Number */}
        <div className="mt-2">
            <div className="text-[9px] uppercase tracking-widest opacity-60 mb-1 ml-1">Card Number</div>
            <Tooltip text="Copy Card Number (No Spaces)">
                <div 
                    onClick={() => handleCopy(data.number, 'number')}
                    className="font-ocr text-[21px] md:text-[23px] tracking-widest cursor-pointer flex items-center gap-2 hover:text-white hover:scale-[1.01] origin-left transition-transform whitespace-nowrap"
                    style={{textShadow: '0px 1px 2px rgba(0,0,0,0.3)'}}
                >
                    {formatCardNumber(data.number)} 
                    {copied === 'number' && <Check className="w-5 h-5 text-green-400 animate-in zoom-in" />}
                </div>
            </Tooltip>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end">
            <div className="flex-1 pr-4 min-w-0">
                {/* Exp Date */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="text-[6px] uppercase text-right leading-tight opacity-70">Valid<br/>Thru</div>
                    <Tooltip text="Copy Expiry Date">
                        <div onClick={() => handleCopy(data.exp, 'exp')} className="font-ocr text-lg cursor-pointer hover:text-white flex items-center gap-1">
                            {data.exp}
                            {copied === 'exp' && <Check className="w-3 h-3 text-green-400" />}
                        </div>
                    </Tooltip>
                </div>

                {/* Name */}
                <Tooltip text="Copy Full Name">
                    <div 
                        onClick={() => handleCopy(data.name, 'name')}
                        className="font-ocr text-sm uppercase tracking-wider w-full truncate cursor-pointer hover:text-white flex items-center gap-2"
                    >
                        {data.name}
                        {copied === 'name' && <Check className="w-3 h-3 text-green-400" />}
                    </div>
                </Tooltip>

                {/* Email */}
                <Tooltip text="Copy Email Address">
                    <div 
                        onClick={() => handleCopy(data.email, 'email')}
                        className="font-ocr text-[10px] lowercase tracking-wide w-full truncate cursor-pointer hover:text-white flex items-center gap-2 mt-1 opacity-75"
                    >
                        {data.email}
                        {copied === 'email' && <Check className="w-3 h-3 text-green-400" />}
                    </div>
                </Tooltip>
            </div>

            <div className="flex flex-col items-end gap-1">
                 <VisaLogo />
                 {/* CVV Box */}
                 <Tooltip text="Copy CVV Code">
                    <div onClick={() => handleCopy(data.cvv, 'cvv')} className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors border border-white/10">
                        <span className="text-[8px] uppercase opacity-70">CVV</span>
                        <span className="text-xs font-bold font-ocr">{data.cvv}</span>
                        {copied === 'cvv' && <Check className="w-3 h-3 text-green-400" />}
                    </div>
                 </Tooltip>
            </div>
        </div>
      </div>
    </div>
  )
}