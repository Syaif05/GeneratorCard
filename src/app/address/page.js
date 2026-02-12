import AddressGenerator from '../../components/AddressGenerator'

export const metadata = {
  title: 'Address Generator - Simulator',
  description: 'Generate realistic address and identity profiles based on real locations.',
}

export default function AddressPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6">
       <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                 Address <span className="text-blue-600">Simulator</span>
              </h1>
              <p className="text-slate-500 max-w-2xl mx-auto">
                  Generate realistic user profiles with valid addresses, coordinates, and local phone numbers based on real-world geography (Google Maps simulator).
              </p>
          </div>
          
          <AddressGenerator />
       </div>
    </main>
  )
}
