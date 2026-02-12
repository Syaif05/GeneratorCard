import Link from 'next/link'
import { Sparkles, Bot, ArrowRight, Wallet } from 'lucide-react'

export const metadata = {
  title: 'Identity Templates - Simulator',
  description: 'One-click identity generation for specific services.',
}

export default function TemplatesPage() {
  const templates = [
    {
      id: 'chatgpt',
      name: 'ChatGPT Pro (1 Month)',
      description: 'Generates specific Korean address, card with BIN 625814260, and optimized data for ChatGPT Pro trial.',
      icon: Bot,
      color: 'bg-green-100 text-green-600',
      link: '/templates/chatgpt'
    },
    // Future templates can be added here
  ]

  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-28 pb-12 px-4 sm:px-6"> 
       <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                 Identity <span className="text-blue-600">Templates</span>
              </h1>
              <p className="text-slate-500 max-w-2xl mx-auto">
                  Pre-configured generators for specific use cases. One click to get everything you need.
              </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((t) => (
                  <Link href={t.link} key={t.id} className="group block h-full">
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full transition-all hover:shadow-md hover:border-blue-300 hover:-translate-y-1 relative overflow-hidden">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${t.color}`}>
                              <t.icon className="w-6 h-6" />
                          </div>
                          
                          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {t.name}
                          </h3>
                          
                          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                              {t.description}
                          </p>
                          
                          <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                              Use Template <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                      </div>
                  </Link>
              ))}
          </div>
       </div>
    </main>
  )
}
