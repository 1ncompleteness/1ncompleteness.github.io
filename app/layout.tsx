import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Behrouz Barati B - Computer Science, Mathematics, and Software Engineering',
  description: 'Computer Science, Math Minor, Software Engineering student and co-founder. Interested in Applied Machine Learning, NLP, Game Theory, Robust Optimization, Knowledge Graphs, Game Theory, Algebric Geometry. Exploring geometric deep learning.',
  authors: [{ name: 'Behrouz Barati B' }],
  keywords: ['AI', 'Machine Learning', 'NLP', 'Research', 'Entrepreneur', 'Computer Science'],
  openGraph: {
    title: 'Behrouz Barati B',
    description: 'Student of Math, CS, and Software Engineering. Co-Founder of Entelligent.',
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
      <body className={`${inter.className} text-foreground antialiased relative`}>
        <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none"></div>
        <div className="fixed inset-0 bg-entelligent-gradient opacity-30 pointer-events-none"></div>
        {children}
      </body>
    </html>
  )
}