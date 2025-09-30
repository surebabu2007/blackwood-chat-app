import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PerformanceMonitor } from '@/components/PerformanceMonitor'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blackwood Manor - Interactive Investigation',
  description: 'An immersive interactive chatbot experience for the Blackwood Manor murder mystery',
  keywords: ['murder mystery', 'interactive fiction', 'chatbot', 'investigation'],
  authors: [{ name: 'Blackwood Manor Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-blackwood-900 text-white min-h-screen`}>
        <div className="min-h-screen bg-gradient-to-br from-blackwood-900 via-blackwood-800 to-blackwood-900">
          {children}
          <PerformanceMonitor />
        </div>
      </body>
    </html>
  )
}
