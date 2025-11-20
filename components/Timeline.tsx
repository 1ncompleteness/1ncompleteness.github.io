'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import giantsData from '@/SoG.json'
import timelineConfig from '@/timeline-config.json'

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
  const [giantsWithImages, setGiantsWithImages] = useState<GiantWithImage[]>([])
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [visiblePeriod, setVisiblePeriod] = useState('Ancient Period')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Timeline range starting from -900
  const minYear = -900
  const currentYear = new Date().getFullYear()
  const maxYear = currentYear // No padding - use current year as max
  const yearRange = maxYear - minYear

  // Define time periods for display - memoized to prevent infinite loop
  const timePeriods = useMemo(() => [
    { start: -900, end: -500, label: 'Ancient Era' },
    { start: -500, end: 0, label: 'Classical Antiquity' },
    { start: 0, end: 1000, label: 'Medieval Period' },
    { start: 1000, end: 1500, label: 'Renaissance' },
    { start: 1500, end: 1900, label: 'Early Modern Era' },
    { start: 1900, end: maxYear, label: 'Modern Era' }
  ], [maxYear])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Get field colors from configuration
  const fieldColors: Record<string, string> = timelineConfig.fieldColors

  // Initialize current time on client side only
  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

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
    // Non-linear scale: give more space to crowded modern eras
    // Cap year to not exceed maxYear
    const cappedYear = Math.min(year, maxYear)

    // Define era boundaries with allocated vertical space percentages
    const eras = [
      { start: -900, end: -500, percent: 15 },    // Ancient Era: 400 years
      { start: -500, end: 0, percent: 15 },       // Classical: 500 years
      { start: 0, end: 1000, percent: 20 },       // Medieval: 1000 years
      { start: 1000, end: 1500, percent: 15 },    // Renaissance: 500 years
      { start: 1500, end: 1900, percent: 15 },    // Early Modern: 400 years
      { start: 1900, end: maxYear, percent: 20 }  // Modern: ~125 years (more space for density)
    ]

    let cumulativePercent = 0
    for (const era of eras) {
      if (cappedYear >= era.start && cappedYear <= era.end) {
        // Position within this era
        const eraProgress = (cappedYear - era.start) / (era.end - era.start)
        const positionInEra = eraProgress * era.percent
        return cumulativePercent + positionInEra
      }
      cumulativePercent += era.percent
    }

    return 100 // Fallback
  }

  const handleMouseEnter = (giant: GiantWithImage) => {
    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
      tooltipTimeoutRef.current = null
    }

    setHoveredGiant(giant)
  }

  const handleMouseLeave = () => {
    // Add a small delay before hiding tooltip
    tooltipTimeoutRef.current = setTimeout(() => {
      setHoveredGiant(null)
    }, 100)
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
      // Use fixed height for the scrollable area - scaled up 4x to prevent icon overlap
      const scrollableHeight = 10000
      canvas.width = window.innerWidth
      canvas.height = scrollableHeight

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
      const graphLeft = 60  // Reduced for tighter left spacing
      const graphRight = canvas.width - 30  // Reduced for tighter right spacing

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

      // Y-axis labels - minimum 10-year spacing between consecutive labels
      const giantYears = sortedGiants.map(g => g.birth_year)
      const importantYears = [-900, -500, 0, 500, 1000, 1500, 2000, currentYear]

      // Combine and sort all potential years
      const allYears = [...new Set([...giantYears, ...importantYears])].sort((a, b) => a - b)

      // Filter to ensure minimum 10-year spacing, prioritizing important years
      const years: number[] = []
      let lastYear = -Infinity

      for (const year of allYears) {
        // Always include important years if they're 10+ years from last, or include next available year
        if (year - lastYear >= 10 || importantYears.includes(year) && years.length === 0) {
          years.push(year)
          lastYear = year
        }
      }



      years.forEach(year => {
        // Position labels in graph area using the same scaling as getYPosition
        const yPercent = getYPosition(year) / 100
        const y = graphTop + yPercent * (graphBottom - graphTop)


        ctx.fillText(year.toString(), graphLeft - 45, y + 3)

        // Draw tick marks
        ctx.beginPath()
        ctx.moveTo(graphLeft, y)
        ctx.lineTo(graphLeft - 5, y)
        ctx.stroke()
      })

      // Draw minor tick marks for intermediate years (every 50 years for ancient, every 10 for modern)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 0.5
      // Ancient and medieval period minor ticks (every 50 years)
      for (let year = minYear; year <= 1500; year += 50) {
        if (!years.includes(year)) {
          const yPercent = getYPosition(year) / 100
          const y = graphTop + yPercent * (graphBottom - graphTop)
          ctx.beginPath()
          ctx.moveTo(graphLeft, y)
          ctx.lineTo(graphLeft - 3, y)
          ctx.stroke()
        }
      }
      // Modern period minor ticks (every 10 years)
      for (let year = 1510; year <= maxYear; year += 10) {
        if (!years.includes(year)) {
          const yPercent = getYPosition(year) / 100
          const y = graphTop + yPercent * (graphBottom - graphTop)
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
        if (year % 100 === 0 || year === 1 || year === currentYear) {
          const yPercent = getYPosition(year) / 100
          const y = graphTop + yPercent * (graphBottom - graphTop)
          ctx.beginPath()
          ctx.moveTo(graphLeft, y)
          ctx.lineTo(graphRight, y)
          ctx.stroke()
        }
      })

      ctx.setLineDash([])
      ctx.lineWidth = 1

      // Axis labels removed - year values are sufficient
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [sortedGiants.length, currentTime, minYear, yearRange])

  return (
    <div className="w-full h-full relative">
      {/* Timeline content */}
      <div className="relative z-10 px-8 py-4 h-full overflow-y-auto bg-transparent" ref={timelineRef}>
        {/* Canvas for Euclidean space background - now inside scrollable area */}
        <canvas
          ref={canvasRef}
          className="absolute left-0 top-0 pointer-events-none"
          style={{ zIndex: 0, width: '100%', height: '10000px' }}
        />
        {/* Fixed header */}
        <div className="sticky top-0 z-[100] pb-4 flex justify-center" ref={containerRef}>
          <div className="w-fit px-6 rounded-lg" style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, #20262B 33%, #20262B 100%)'
          }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center text-white font-lmodern">
            Standing on the Shoulders of Giants
          </h2>

          {/* Dynamic period indicator */}
          <div className="text-center mb-2">
            <span className="text-lg text-white/80 font-semibold">
              {visiblePeriod}
            </span>
          </div>

          {/* Period progress bar */}
          <div className="flex justify-center gap-2 mb-2">
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

          {/* Current date and time display */}
          <div className="text-center mb-2">
            <span className="text-sm text-white/60 font-mono">
              {currentTime ? currentTime.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              }) : ''}
            </span>
          </div>

          {/* Legend with field colors */}
          <div className="flex flex-wrap gap-3 text-xs text-white/70 justify-center mb-4">
            {Object.entries(fieldColors).slice(0, 8).map(([field, color]) => (
              <div key={field} className="flex items-center gap-2">
                <div className="w-8 h-1" style={{ backgroundColor: color }}></div>
                <span className="capitalize">{field}</span>
              </div>
            ))}
          </div>

          {/* Tooltip display area - Fixed position below legend */}
          <div className="relative h-0 mb-4">
            <AnimatePresence mode="wait">
              {hoveredGiant && (
                <motion.div
                  key={hoveredGiant.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-1/2 top-0 -translate-x-1/2 z-[110] bg-black/95 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-sm shadow-2xl w-[400px]"
                  onMouseEnter={() => {
                    // Clear timeout to keep tooltip open
                    if (tooltipTimeoutRef.current) {
                      clearTimeout(tooltipTimeoutRef.current)
                      tooltipTimeoutRef.current = null
                    }
                  }}
                  onMouseLeave={handleMouseLeave}
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </div>
        </div>

        {/* Container that matches canvas coordinate system exactly */}
        <div className="absolute" style={{ top: '100px', height: '9850px', left: '60px', width: 'calc(100% - 90px)' }}>
          {/* Timeline with vertical lines for each giant */}
          <div className="relative w-full h-full">
            {sortedGiants.map((giant, index) => {
              // Left-to-right ordering with 70% reduced margins (1.5% left, 3% right)
              const xPosition = (index / Math.max(sortedGiants.length - 1, 1)) * 95.5 + 1.5

              // Get raw Y position percentage
              const startYRaw = getYPosition(giant.birth_year)
              // For living giants, use current year without decimal part
              const endYRaw = getYPosition(giant.death_year || currentYear)


              // Use raw percentages directly
              const startY = startYRaw
              const endY = endYRaw
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
                      className="absolute -left-2 -top-3 w-8 h-8 rounded-full overflow-hidden border-2 border-white/70 cursor-pointer hover:scale-125 hover:z-[90] transition-all z-30 shadow-lg"
                      onClick={() => openWikipedia(giant.wikipedia)}
                      onMouseEnter={() => handleMouseEnter(giant)}
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
                    className="absolute cursor-pointer transition-all hover:z-[40]"
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
                    onMouseEnter={() => handleMouseEnter(giant)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => openWikipedia(giant.wikipedia)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}