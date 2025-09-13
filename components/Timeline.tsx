'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import giantsData from '@/SoG.json'

interface Giant {
  name: string
  birth_year: number
  death_year: number | null
  fields: string[]
  contributions: string[]
  works: string[]
  wikipedia: string
}

export default function Timeline() {
  const [hoveredGiant, setHoveredGiant] = useState<Giant | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Calculate timeline range
  const minYear = Math.min(...giantsData.map(g => g.birth_year))
  const maxYear = new Date().getFullYear()
  const yearRange = maxYear - minYear

  // Group giants by overlapping lifespans to create stacked rows
  const rows: Giant[][] = []
  const giants = giantsData as Giant[]

  giants.forEach(giant => {
    let placed = false
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const canPlace = !row.some(g => {
        const gEnd = g.death_year || maxYear
        const giantEnd = giant.death_year || maxYear
        return !(giant.death_year && giant.death_year < g.birth_year ||
                 g.death_year && g.death_year < giant.birth_year)
      })

      if (canPlace) {
        row.push(giant)
        placed = true
        break
      }
    }

    if (!placed) {
      rows.push([giant])
    }
  })

  const getPosition = (year: number) => {
    return ((year - minYear) / yearRange) * 100
  }

  const handleMouseEnter = (giant: Giant, event: React.MouseEvent) => {
    setHoveredGiant(giant)
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    })
  }

  const handleMouseLeave = () => {
    setHoveredGiant(null)
  }

  const openWikipedia = (wikipedia: string) => {
    window.open(`https://en.wikipedia.org/wiki/${wikipedia}`, '_blank')
  }

  // Color mapping for different fields
  const getFieldColor = (fields: string[]) => {
    if (fields.includes('physics')) return '#3c6e71'
    if (fields.includes('mathematics')) return '#284b63'
    if (fields.includes('computer science')) return '#353535'
    if (fields.includes('philosophy')) return '#3c6e71'
    if (fields.includes('psychology') || fields.includes('psychiatry')) return '#284b63'
    if (fields.includes('literature')) return '#353535'
    return '#3c6e71'
  }

  return (
    <div className="w-full bg-surface rounded-xl border-2 border-primary p-6">
      <h3 className="text-2xl font-bold mb-6 text-gradient text-center">
        Standing on the Shoulders of Giants
      </h3>

      <div className="relative overflow-x-auto overflow-y-visible pb-4">
        <div className="min-w-[1200px]">
          {/* Year markers */}
          <div className="relative h-8 mb-4 border-b border-primary/30">
            {[1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2024].map(year => (
              <div
                key={year}
                className="absolute text-xs text-primary"
                style={{ left: `${getPosition(year)}%`, transform: 'translateX(-50%)' }}
              >
                {year}
              </div>
            ))}
          </div>

          {/* Timeline rows */}
          <div className="space-y-2">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative h-8">
                {row.map(giant => {
                  const startPos = getPosition(giant.birth_year)
                  const endPos = getPosition(giant.death_year || maxYear)
                  const width = endPos - startPos
                  const color = getFieldColor(giant.fields)

                  return (
                    <div
                      key={giant.name}
                      className="absolute h-6 rounded-full cursor-pointer transition-all hover:h-8 hover:z-10 hover:shadow-lg"
                      style={{
                        left: `${startPos}%`,
                        width: `${width}%`,
                        backgroundColor: color,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                      onMouseEnter={(e) => handleMouseEnter(giant, e)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => openWikipedia(giant.wikipedia)}
                    >
                      <div className="px-2 text-white text-xs truncate leading-6">
                        {giant.name}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#3c6e71' }}></div>
              <span>Physics / Philosophy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#284b63' }}></div>
              <span>Mathematics / Psychology</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#353535' }}></div>
              <span>Computer Science / Literature</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredGiant && (
        <div
          className="fixed z-50 bg-background/95 backdrop-blur-sm border-2 border-primary rounded-lg p-4 shadow-xl max-w-sm pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 10,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-bold text-primary">{hoveredGiant.name}</h4>
            <ExternalLink className="w-3 h-3 text-primary/50" />
          </div>

          <p className="text-xs mb-2">
            {hoveredGiant.birth_year} - {hoveredGiant.death_year || 'Present'}
          </p>

          <div className="text-xs space-y-1">
            <p>
              <span className="font-semibold">Fields:</span> {hoveredGiant.fields.join(', ')}
            </p>

            {hoveredGiant.contributions.length > 0 && (
              <p>
                <span className="font-semibold">Key Contributions:</span> {hoveredGiant.contributions.slice(0, 2).join(', ')}
              </p>
            )}

            {hoveredGiant.works.length > 0 && (
              <p>
                <span className="font-semibold">Notable Works:</span> {hoveredGiant.works[0]}
              </p>
            )}
          </div>

          <p className="text-xs mt-2 text-primary/70">Click to view Wikipedia page</p>
        </div>
      )}
    </div>
  )
}