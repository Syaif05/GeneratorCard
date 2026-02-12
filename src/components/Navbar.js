'use client'

import Link from 'next/link'
import { CreditCard, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex items-center justify-between h-16">
             
             {/* Logo Section - Supports Image 'logo.png' in public folder or Fallback Text */}
             <Link href="/" className="flex items-center gap-2 group">
                 <div className="relative w-8 h-8 flex items-center justify-center">
                    {/* Try to load logo image, if fails styling handles it or we can stick to icon */}
                    <img 
                      src="/logo.png" 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex'; // Show icon if image fails
                      }}
                    />
                    <div className="hidden w-8 h-8 bg-blue-600 rounded-xl items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform" style={{display: 'none'}}> {/* Simple fix: hidden by default, shown by onError */}
                        <CreditCard className="w-5 h-5" />
                    </div>
                    {/* Default Icon if no logo (using standard approach without JS error handling complexity for now, assume user puts logo or we use text) */}
                 </div>
                 <span className="font-bold text-xl tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors">
                    Generator <span className="text-blue-600">Card</span>
                 </span>
             </Link>
             
             {/* Navigation Links */}
             <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50 overflow-x-auto">
                <Link href="/" className="px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-white rounded-full transition-all whitespace-nowrap">
                    Card
                </Link>
                <Link href="/address" className="px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-white rounded-full transition-all whitespace-nowrap">
                    Address
                </Link>
                <Link href="/cards" className="px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-white rounded-full transition-all whitespace-nowrap">
                    Gen CC
                </Link>
                <Link href="/gmail" className="px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-white rounded-full transition-all whitespace-nowrap">
                    Gmail
                </Link>
                <Link href="/templates" className="px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-white rounded-full transition-all whitespace-nowrap">
                    Templates
                </Link>
                <Link href="/history" className="px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-white rounded-full transition-all whitespace-nowrap">
                    History
                </Link>
             </div>
         </div>

         <div className="flex items-center gap-2">
             <Link href="/admin">
                <Tooltip text="Manage Database Source">
                    <div className="p-2.5 rounded-full hover:bg-slate-100 transition-colors text-slate-600 cursor-pointer">
                        <Settings2 className="w-5 h-5" />
                    </div>
                </Tooltip>
             </Link>
         </div>
      </div>
    </nav>
  )
}