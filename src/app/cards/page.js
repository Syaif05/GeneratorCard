import BulkGenerator from '../../components/BulkGenerator'

export const metadata = {
  title: 'Bulk Card Generator (CC Gen) - Simulator',
  description: 'Generate valid credit card numbers for testing using Luhn algorithm.',
}

export default function CardsPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-28 pb-12 px-4 sm:px-6"> 
       <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                 Bulk <span className="text-blue-600">Card Generator</span>
              </h1>
              <p className="text-slate-500 max-w-2xl mx-auto">
                  Generate valid credit card numbers using the Luhn checksum algorithm. 
              </p>
          </div>
          
          <BulkGenerator />
       </div>
    </main>
  )
}
