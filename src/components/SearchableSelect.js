'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

export default function SearchableSelect({ 
    options = [], 
    value, 
    onChange, 
    placeholder = "Select...", 
    disabled = false,
    labelProp = "name",
    valueProp = "code",
    iconProp = "flag"
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("")
    const wrapperRef = useRef(null)
    const inputRef = useRef(null)

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])
    
    // Focus input on open
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        } else {
             setSearch("") // Reset search on close
        }
    }, [isOpen])

    const filteredOptions = options.filter(opt => 
        opt[labelProp].toLowerCase().includes(search.toLowerCase())
    )

    const selectedOption = options.find(opt => opt[valueProp] === value)

    const handleSelect = (option) => {
        onChange(option[valueProp])
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={wrapperRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full p-2.5 rounded-lg border bg-slate-50 text-sm flex items-center justify-between transition-all outline-none focus:ring-2
                    ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 cursor-pointer'}
                `}
            >
                <span className={`truncate ${!selectedOption ? 'text-slate-400' : 'text-slate-700'}`}>
                    {selectedOption ? (
                        <span className="flex items-center gap-2">
                             {selectedOption[iconProp] && <span>{selectedOption[iconProp]}</span>}
                             {selectedOption[labelProp]}
                        </span>
                    ) : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {/* Search Input */}
                    <div className="p-2 border-b border-slate-100 bg-slate-50 sticky top-0">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-9 pr-8 py-1.5 text-sm bg-white border border-slate-200 rounded-md outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            />
                            {search && (
                                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt[valueProp]} // Might not be unique if valueProp is not unique, be careful
                                    onClick={() => handleSelect(opt)}
                                    className={`px-3 py-2.5 text-sm cursor-pointer hover:bg-blue-50 flex items-center gap-2 transition-colors
                                        ${value === opt[valueProp] ? 'bg-blue-50/50 text-blue-600 font-medium' : 'text-slate-700'}
                                    `}
                                >
                                    {opt[iconProp] && <span>{opt[iconProp]}</span>}
                                    {opt[labelProp]}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-6 text-center text-xs text-slate-400">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
