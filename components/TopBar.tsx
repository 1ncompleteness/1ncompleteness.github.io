'use client'

import { useEffect } from 'react'

interface TopBarProps {
  currentPage: number
  totalPages: number
  scrollToPage: (pageIndex: number) => void
}

export default function TopBar({ currentPage, totalPages, scrollToPage }: TopBarProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPage > 0) {
        scrollToPage(currentPage - 1)
      } else if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
        scrollToPage(currentPage + 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalPages, scrollToPage])

  return (
    <div className="relative w-full py-4 sm:py-6 md:py-8 bg-transparent">
      {/* Navigation Dots - centered at top */}
      <div className="flex justify-center gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToPage(i)}
            className={`h-2 rounded-full transition-all ${
              i === currentPage ? 'w-8 bg-primary' : 'w-2 bg-surface hover:bg-primary/50'
            }`}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows - positioned fixed on viewport */}
      {currentPage > 0 && (
        <button
          onClick={() => scrollToPage(currentPage - 1)}
          className="fixed left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 z-[60] p-2 sm:p-2.5 md:p-3 rounded-full bg-surface/80 backdrop-blur-sm hover:bg-primary transition-all group"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {currentPage < totalPages - 1 && (
        <button
          onClick={() => scrollToPage(currentPage + 1)}
          className="fixed right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-[60] p-2 sm:p-2.5 md:p-3 rounded-full bg-surface/80 backdrop-blur-sm hover:bg-primary transition-all group"
          aria-label="Next page"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}