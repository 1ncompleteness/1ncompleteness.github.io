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

interface GiantWithImage extends Giant {
  imageUrl?: string
}

export default function Timeline() {
  const [hoveredGiant, setHoveredGiant] = useState<GiantWithImage | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [giantsWithImages, setGiantsWithImages] = useState<GiantWithImage[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [scrollPosition, setScrollPosition] = useState(0)
  const [visiblePeriod, setVisiblePeriod] = useState('Ancient Period')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Define time periods for display
  const timePeriods = [
    { start: -1000, end: 0, label: 'Ancient Period' },
    { start: 0, end: 1000, label: 'Classical to Medieval' },
    { start: 1000, end: 2025, label: 'Modern Era' }
  ]

  // Full timeline range for continuous scroll
  const minYear = -1000
  const maxYear = 2025
  const yearRange = maxYear - minYear

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Define distinct colors for each field
  const fieldColors: Record<string, string> = {
    'physics': '#00D9FF',           // Cyan
    'mathematics': '#FF6B6B',       // Coral
    'computer science': '#4ECDC4',  // Teal
    'philosophy': '#95E77E',        // Light Green
    'psychology': '#FFD93D',        // Yellow
    'psychiatry': '#FFA500',        // Orange
    'literature': '#B19CD9',        // Lavender
    'astronomy': '#FF69B4',         // Hot Pink
    'computing': '#00CED1',         // Dark Turquoise
    'logic': '#FF1493',             // Deep Pink
    'epistemology': '#32CD32',      // Lime Green
    'education': '#FF8C00',         // Dark Orange
    'philology': '#9370DB',         // Medium Purple
    'physiology': '#20B2AA',        // Light Sea Green
    'psychotherapy': '#FFB6C1',     // Light Pink
    'psychoanalysis': '#DDA0DD',    // Plum
    'cryptanalysis': '#00FA9A',     // Medium Spring Green
    'electrical engineering': '#FF4500', // Orange Red
    'artificial intelligence': '#1E90FF', // Dodger Blue
    'ai ethics': '#FF69B4',         // Hot Pink
    'economics': '#FFD700',         // Gold
    'linguistics': '#8A2BE2',        // Blue Violet
    'cognitive science': '#00BFFF', // Deep Sky Blue
    'neuroscience': '#FF00FF',      // Magenta
    'behaviorism': '#7FFF00',       // Chartreuse
    'philosophy of mind': '#DC143C', // Crimson
    'philosophy of language': '#4B0082' // Indigo
  }

  // Fetch Wikipedia images for giants
  useEffect(() => {
    const fetchImages = async () => {
      const giantsWithImageUrls = await Promise.all(
        giantsData.map(async (giant: Giant) => {
          try {
            // Use Wikipedia API to get the main image
            const response = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(giant.wikipedia)}`
            )
            if (response.ok) {
              const data = await response.json()
              return {
                ...giant,
                imageUrl: data.thumbnail?.source || data.originalimage?.source
              } as GiantWithImage
            }
          } catch (error) {
            console.error(`Failed to fetch image for ${giant.name}:`, error)
          }
          return giant as GiantWithImage
        })
      )
      setGiantsWithImages(giantsWithImageUrls)
    }

    fetchImages()
  }, [])

  // Handle continuous scroll and update visible period
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return

      const scrollTop = timelineRef.current.scrollTop
      const scrollHeight = timelineRef.current.scrollHeight - timelineRef.current.clientHeight
      const scrollPercentage = scrollTop / scrollHeight

      setScrollPosition(scrollPercentage)

      // Determine which period is currently visible based on scroll position
      const visibleYear = minYear + (scrollPercentage * yearRange)

      let currentPeriodLabel = 'Ancient Period'
      for (const period of timePeriods) {
        if (visibleYear >= period.start && visibleYear <= period.end) {
          currentPeriodLabel = period.label
          break
        }
      }

      setVisiblePeriod(currentPeriodLabel)
    }

    const container = timelineRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      handleScroll() // Initial call
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [minYear, yearRange, timePeriods])

  // Sort giants for full timeline (no filtering needed for continuous scroll)
  const giants = giantsWithImages.length > 0 ? giantsWithImages : (giantsData as GiantWithImage[])
  const sortedGiants = [...giants].sort((a, b) => a.birth_year - b.birth_year)

  const getYPosition = (year: number) => {
    // Top-left origin: older dates at top (0%), current time at bottom (100%)
    return ((year - minYear) / yearRange) * 100
  }

  const handleMouseEnter = (giant: GiantWithImage, event: React.MouseEvent) => {
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

  // Get color or gradient for a giant based on their fields
  const getGiantColor = (fields: string[]) => {
    const colors = fields
      .map(field => fieldColors[field.toLowerCase()] || '#808080')
      .filter((color, index, self) => self.indexOf(color) === index) // Remove duplicates

    if (colors.length === 1) {
      return colors[0]
    } else if (colors.length === 2) {
      return `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)`
    } else {
      // Create multi-color gradient
      const stops = colors.map((color, i) =>
        `${color} ${(i * 100) / (colors.length - 1)}%`
      ).join(', ')
      return `linear-gradient(90deg, ${stops})`
    }
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

      // Clear area between axes (no grid pattern)

      // Set axis color (make them more prominent)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 2

      // Calculate graph area position (below title and legend)
      const graphTop = 100 // Space for title and legend
      const graphBottom = canvas.height - 50
      const graphLeft = 70
      const graphRight = canvas.width - 40

      // Draw Y-axis (Time)
      ctx.beginPath()
      ctx.moveTo(graphLeft, graphTop)
      ctx.lineTo(graphLeft, graphBottom)
      ctx.stroke()

      // Reset line width for other elements
      ctx.lineWidth = 1

      // Draw axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.font = '10px monospace'

      // Y-axis labels (years) - full timeline
      const years = []
      // Ancient period
      for (let year = -1000; year <= 0; year += 100) {
        years.push(year)
      }
      // Classical to Medieval
      for (let year = 100; year <= 900; year += 100) {
        years.push(year)
      }
      // Early Modern
      for (let year = 1000; year <= 1400; year += 100) {
        years.push(year)
      }
      // Modern period - more detail
      for (let year = 1500; year <= 2025; year += 50) {
        years.push(year)
      }

      years.forEach(year => {
        // Position labels in graph area
        const y = graphTop + ((year - minYear) / yearRange) * (graphBottom - graphTop)
        ctx.fillText(year.toString(), graphLeft - 35, y + 3)

        // Draw tick marks
        ctx.beginPath()
        ctx.moveTo(graphLeft, y)
        ctx.lineTo(graphLeft - 5, y)
        ctx.stroke()
      })

      // Draw minor tick marks for centuries and decades
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 0.5
      // Minor ticks for centuries in ancient period
      for (let year = -400; year <= 1400; year += 50) {
        if (!years.includes(year) && year <= 1400) {
          const y = graphTop + ((year - minYear) / yearRange) * (graphBottom - graphTop)
          ctx.beginPath()
          ctx.moveTo(graphLeft, y)
          ctx.lineTo(graphLeft - 3, y)
          ctx.stroke()
        }
      }
      // Minor ticks for modern period
      for (let year = 1500; year <= 2025; year += 10) {
        if (!years.includes(year)) {
          const y = graphTop + ((year - minYear) / yearRange) * (graphBottom - graphTop)
          ctx.beginPath()
          ctx.moveTo(graphLeft, y)
          ctx.lineTo(graphLeft - 3, y)
          ctx.stroke()
        }
      }

      // Draw horizontal grid lines for major years
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 0.5
      ctx.setLineDash([5, 5])
      years.forEach(year => {
        // Grid lines for centuries and major milestones
        if (year % 100 === 0 || year === 1 || year === 2025) {
          const y = graphTop + ((year - minYear) / yearRange) * (graphBottom - graphTop)
          ctx.beginPath()
          ctx.moveTo(graphLeft, y)
          ctx.lineTo(graphRight, y)
          ctx.stroke()
        }
      })

      ctx.setLineDash([])
      ctx.lineWidth = 1

      // Axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '12px monospace'

      // Display current date and time at 2025 position on Y-axis
      const timeString = currentTime.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.font = '12px monospace'
      // Position at 2025 on the Y-axis
      const year2025Y = graphTop + ((2025 - minYear) / yearRange) * (graphBottom - graphTop)
      ctx.fillText(timeString, graphLeft + 10, year2025Y)

      ctx.save()
      ctx.translate(15, (graphTop + graphBottom) / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText('Time', -15, 0)
      ctx.restore()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [sortedGiants.length, currentTime, minYear, yearRange])

  return (
    <div className="w-full h-full relative">
      {/* Canvas for Euclidean space background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Timeline content */}
      <div className="relative z-10 px-8 py-4 h-full overflow-y-auto bg-transparent" ref={timelineRef}>
        {/* Fixed header */}
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm pb-4" ref={containerRef}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center text-white">
            Standing on the Shoulders of Giants
          </h2>

          {/* Dynamic period indicator */}
          <div className="text-center mb-2">
            <span className="text-lg text-white/80 font-semibold">
              {visiblePeriod}
            </span>
          </div>

          {/* Period progress bar */}
          <div className="flex justify-center gap-2 mb-4">
            {timePeriods.map((period, index) => {
              const periodStart = (period.start - minYear) / yearRange
              const periodEnd = (period.end - minYear) / yearRange
              const isActive = scrollPosition >= periodStart && scrollPosition <= periodEnd

              return (
                <div
                  key={index}
                  className={`h-1 transition-all ${
                    isActive ? 'bg-white w-12' : 'bg-white/30 w-8'
                  }`}
                  onClick={() => {
                    // Scroll to period start
                    if (timelineRef.current) {
                      const targetScroll = periodStart * (timelineRef.current.scrollHeight - timelineRef.current.clientHeight)
                      timelineRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' })
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                />
              )
            })}
          </div>
        </div>

        {/* Legend with all unique fields */}
        <div className="flex flex-wrap gap-3 text-xs text-white/70 justify-center mb-4">
          {Object.entries(fieldColors).slice(0, 8).map(([field, color]) => (
            <div key={field} className="flex items-center gap-2">
              <div className="w-8 h-1" style={{ backgroundColor: color }}></div>
              <span className="capitalize">{field}</span>
            </div>
          ))}
        </div>

        <div className="relative" style={{ paddingLeft: '80px', paddingRight: '60px', paddingBottom: '80px', paddingTop: '20px', minHeight: '3000px' }}>
          {/* Timeline with vertical lines for each giant */}
          <div className="relative w-full" style={{ height: '3000px' }}>
            {sortedGiants.map((giant, index) => {
              // Spread giants across more of the width for better visibility
              const xPosition = (index / Math.max(sortedGiants.length - 1, 1)) * 95 + 2.5
              const startY = getYPosition(giant.birth_year)
              const currentYearDecimal = currentTime.getFullYear() + currentTime.getMonth() / 12 + currentTime.getDate() / 365
              const endY = getYPosition(giant.death_year || currentYearDecimal)
              const height = endY - startY
              const colorStyle = getGiantColor(giant.fields)
              const isGradient = colorStyle.includes('gradient')

              return (
                <div
                  key={giant.name}
                  className="absolute"
                  style={{
                    left: `${xPosition}%`,
                    top: `${startY}%`,
                    height: `${Math.max(Math.abs(height), 3)}%`, // Minimum height to exceed icon
                    width: '12px'
                  }}
                >
                  {/* Profile picture at birth year position */}
                  {giant.imageUrl && (
                    <div
                      className="absolute -left-3 -top-3 w-9 h-9 rounded-full overflow-hidden border-2 border-white/70 cursor-pointer hover:scale-125 transition-transform z-30 shadow-lg"
                      onClick={() => openWikipedia(giant.wikipedia)}
                      onMouseEnter={(e) => handleMouseEnter(giant, e)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img
                        src={giant.imageUrl}
                        alt={giant.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  {/* Timeline line (vertical) */}
                  <div
                    className="absolute cursor-pointer transition-all hover:z-20"
                    style={{
                      top: 0,
                      height: '100%',
                      width: '12px',
                      left: '0',
                      background: isGradient ? colorStyle : undefined,
                      backgroundColor: !isGradient ? colorStyle : undefined,
                      opacity: 0.9,
                      boxShadow: hoveredGiant?.name === giant.name
                        ? `0 0 20px ${isGradient ? 'rgba(255,255,255,0.9)' : colorStyle}, 0 0 40px ${isGradient ? 'rgba(255,255,255,0.5)' : colorStyle}`
                        : `0 2px 8px rgba(0,0,0,0.3)`,
                      filter: hoveredGiant?.name === giant.name ? 'brightness(1.5)' : 'brightness(1.1)'
                    }}
                    onMouseEnter={(e) => handleMouseEnter(giant, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => openWikipedia(giant.wikipedia)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredGiant && (
        <div
          className="fixed z-50 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-sm pointer-events-none"
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