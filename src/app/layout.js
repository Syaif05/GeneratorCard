import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Generator Card - Simulator',
  description: 'Generate Credit Cards, Addresses, and Identities',
  icons: {
    icon: '/logo.png', // Use the custom logo as the favicon
    shortcut: '/logo.png',
    apple: '/logo.png',
  }
}

import Navbar from '../components/Navbar'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}