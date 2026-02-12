export default function Tooltip({ text, children }) {
  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <div className="absolute bottom-full mb-2 hidden group-hover:block w-max px-3 py-1.5 bg-slate-800 text-white text-[11px] font-medium rounded-lg shadow-xl backdrop-blur-sm transition-all z-50 animate-in fade-in zoom-in duration-200">
        {text}
        {/* Panah Kecil Bawah */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  )
}