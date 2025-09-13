'use client'

import { useState, useEffect, useRef } from 'react'
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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
    if (fields.includes('physics')) return 'rgba(60, 110, 113, 0.8)'
    if (fields.includes('mathematics')) return 'rgba(40, 75, 99, 0.8)'
    if (fields.includes('computer science')) return 'rgba(53, 53, 53, 0.8)'
    if (fields.includes('philosophy')) return 'rgba(60, 110, 113, 0.8)'
    if (fields.includes('psychology') || fields.includes('psychiatry')) return 'rgba(40, 75, 99, 0.8)'
    if (fields.includes('literature')) return 'rgba(53, 53, 53, 0.8)'
    return 'rgba(60, 110, 113, 0.8)'
  }

  // Draw Euclidean axes
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set axis color
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1

      // Draw X-axis (time)
      ctx.beginPath()
      ctx.moveTo(40, canvas.height - 40)
      ctx.lineTo(canvas.width - 20, canvas.height - 40)
      ctx.stroke()

      // Draw Y-axis
      ctx.beginPath()
      ctx.moveTo(40, 20)
      ctx.lineTo(40, canvas.height - 40)
      ctx.stroke()

      // Draw axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.font = '10px monospace'

      // X-axis labels (years)
      const years = [1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2024]
      years.forEach(year => {
        const x = 40 + ((year - minYear) / yearRange) * (canvas.width - 60)
        ctx.fillText(year.toString(), x - 15, canvas.height - 25)

        // Draw tick marks
        ctx.beginPath()
        ctx.moveTo(x, canvas.height - 40)
        ctx.lineTo(x, canvas.height - 35)
        ctx.stroke()
      })

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.setLineDash([2, 4])

      // Vertical grid lines
      years.forEach(year => {
        const x = 40 + ((year - minYear) / yearRange) * (canvas.width - 60)
        ctx.beginPath()
        ctx.moveTo(x, 20)
        ctx.lineTo(x, canvas.height - 40)
        ctx.stroke()
      })

      // Horizontal grid lines
      const numRows = rows.length
      for (let i = 0; i <= numRows; i++) {
        const y = 40 + (i / numRows) * (canvas.height - 80)
        ctx.beginPath()
        ctx.moveTo(40, y)
        ctx.lineTo(canvas.width - 20, y)
        ctx.stroke()
      }

      ctx.setLineDash([])

      // Axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '12px monospace'
      ctx.fillText('Time', canvas.width / 2 - 15, canvas.height - 5)

      ctx.save()
      ctx.translate(10, canvas.height / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText('Giants', -20, 0)
      ctx.restore()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [rows.length, minYear, yearRange])

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      {/* Canvas for Euclidean space background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Timeline content */}
      <div className="relative z-10 p-8 h-full overflow-auto">
        <h3 className="text-2xl font-bold mb-8 text-white text-center">
          Standing on the Shoulders of Giants
        </h3>

        <div className="relative min-h-[600px]" style={{ paddingLeft: '50px', paddingRight: '30px', paddingBottom: '50px', paddingTop: '30px' }}>
          {/* Timeline rows with thin lines */}
          <div className="relative h-full">
            {rows.map((row, rowIndex) => {
              const yPosition = 30 + (rowIndex / rows.length) * 500
              return (
                <div key={rowIndex} className="absolute w-full" style={{ top: `${yPosition}px` }}>
                  {row.map(giant => {
                    const startPos = getPosition(giant.birth_year)
                    const endPos = getPosition(giant.death_year || maxYear)
                    const width = endPos - startPos
                    const color = getFieldColor(giant.fields)

                    return (
                      <div
                        key={giant.name}
                        className="absolute cursor-pointer transition-all hover:z-20"
                        style={{
                          left: `${startPos}%`,
                          width: `${width}%`,
                          height: '2px',
                          backgroundColor: color,
                          boxShadow: hoveredGiant?.name === giant.name ? `0 0 8px ${color}` : 'none'
                        }}
                        onMouseEnter={(e) => handleMouseEnter(giant, e)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => openWikipedia(giant.wikipedia)}
                      >
                        {/* Name label on hover */}
                        {hoveredGiant?.name === giant.name && (
                          <div className="absolute -top-5 left-0 text-xs text-white whitespace-nowrap px-1 bg-black/50 rounded">
                            {giant.name}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="absolute bottom-0 left-12 flex flex-wrap gap-4 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5" style={{ backgroundColor: 'rgba(60, 110, 113, 0.8)' }}></div>
              <span>Physics / Philosophy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5" style={{ backgroundColor: 'rgba(40, 75, 99, 0.8)' }}></div>
              <span>Mathematics / Psychology</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5" style={{ backgroundColor: 'rgba(53, 53, 53, 0.8)' }}></div>
              <span>Computer Science / Literature</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredGiant && (
        <div
          className="fixed z-50 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-xl max-w-sm pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 10,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-bold text-white">{hoveredGiant.name}</h4>
            <ExternalLink className="w-3 h-3 text-white/50" />
          </div>

          <p className="text-xs mb-2 text-white/70">
            {hoveredGiant.birth_year} - {hoveredGiant.death_year || 'Present'}
          </p>

          <div className="text-xs space-y-1 text-white/60">
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

          <p className="text-xs mt-2 text-white/50">Click to view Wikipedia page</p>
        </div>
      )}
    </div>
  )
}