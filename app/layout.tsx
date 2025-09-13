import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Behrouz Barati B - AI/ML Researcher & Entrepreneur',
  description: 'Computer Science researcher and entrepreneur specializing in machine learning, natural language processing, and geometric deep learning.',
  authors: [{ name: 'Behrouz Barati B' }],
  keywords: ['AI', 'Machine Learning', 'NLP', 'Research', 'Entrepreneur', 'Computer Science'],
  openGraph: {
    title: 'Behrouz Barati B',
    description: 'AI/ML Researcher & Entrepreneur',
    url: 'https://1ncompleteness.github.io',
    siteName: 'Behrouz Barati B Portfolio',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  )
}