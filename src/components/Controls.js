import { Users, Palette, RefreshCw, Zap } from 'lucide-react'
import Tooltip from './Tooltip'

export default function Controls({ count, setCount, nameLength, setNameLength, theme, setTheme, loading, onGenerate }) {
  
  const ColorDot = ({ color, active, onClick }) => {
     const bgColors = {
        black: 'bg-slate-900', blue: 'bg-blue-600', gold: 'bg-yellow-500', 
        platinum: 'bg-slate-400', green: 'bg-emerald-600', red: 'bg-rose-600'
     }
     return (
        <button 
            onClick={onClick}
            className={`w-7 h-7 rounded-full transition-all duration-300 ${bgColors[color]} ${
                active ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-40 hover:opacity-100'
            }`}
        />
     )
  }

  return (
    <div className="sticky top-24 z-40 max-w-4xl mx-auto px-4 mb-12 animate-slide-up" style={{animationDelay: '100ms'}}>
         <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-3 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-200/50">
            
            {/* 1. Count Selector */}
            <div className="flex items-center gap-3 bg-slate-100/50 p-1.5 rounded-xl">
                {[1, 3, 6, 9].map(num => (
                    <Tooltip key={num} text={`Generate ${num} cards`}>
                        <button
                        onClick={() => setCount(num)}
                        className={`w-10 h-9 rounded-lg text-sm font-bold transition-all ${
                            count === num ? 'bg-white text-black shadow-sm ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'
                        }`}
                        >
                        {num}
                        </button>
                    </Tooltip>
                ))}
            </div>

            <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

            {/* 2. Name Length */}
            <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-slate-400"/>
                <div className="flex gap-1 bg-slate-100/50 p-1.5 rounded-xl">
                    {[1, 2, 3].map(len => (
                        <Tooltip key={len} text={`${len} Word${len > 1 ? 's' : ''} Name`}>
                            <button 
                                onClick={() => setNameLength(len)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    nameLength === len ? 'bg-white shadow-sm text-black ring-1 ring-black/5' : 'text-slate-400 hover:bg-white/50'
                                }`}
                            >
                                {len} Word
                            </button>
                        </Tooltip>
                    ))}
                </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

            {/* 3. Theme Picker */}
            <div className="flex items-center gap-3">
                 <Palette className="w-4 h-4 text-slate-400"/>
                 <div className="flex gap-2">
                    {['black', 'blue', 'red', 'green', 'gold', 'platinum'].map(c => (
                        <Tooltip key={c} text={`${c.charAt(0).toUpperCase() + c.slice(1)} Theme`}>
                            <div>
                                <ColorDot color={c} active={theme === c} onClick={() => setTheme(c)}/>
                            </div>
                        </Tooltip>
                    ))}
                 </div>
            </div>

            {/* 4. Action Button */}
            <Tooltip text="Click to generate new identities">
                <button 
                    onClick={onGenerate}
                    disabled={loading}
                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:scale-100"
                >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400"/>}
                    Generate
                </button>
            </Tooltip>
         </div>
      </div>
  )
}