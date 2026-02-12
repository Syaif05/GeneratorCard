import GmailGenerator from '../../components/GmailGenerator'

export const metadata = {
  title: 'Gmail Dot Trick Generator - Simulator',
  description: 'Generate thousands of Gmail aliases using the dot trick.',
}

export default function GmailPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] pt-28 pb-12 px-4 sm:px-6"> 
       <div className="max-w-7xl mx-auto">
          <GmailGenerator />
       </div>
    </main>
  )
}
