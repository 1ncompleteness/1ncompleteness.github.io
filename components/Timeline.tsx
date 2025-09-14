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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate timeline range
  const minYear = Math.min(...giantsData.map(g => g.birth_year))
  const maxYear = new Date().getFullYear()
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

  // Sort giants by birth year for vertical timeline
  const giants = giantsWithImages.length > 0 ? giantsWithImages : (giantsData as GiantWithImage[])
  const sortedGiants = [...giants].sort((a, b) => a.birth_year - b.birth_year)

  const getYPosition = (year: number) => {
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

      // Draw X-axis (Giants)
      ctx.beginPath()
      ctx.moveTo(40, canvas.height - 40)
      ctx.lineTo(canvas.width - 20, canvas.height - 40)
      ctx.stroke()

      // Draw Y-axis (Time)
      ctx.beginPath()
      ctx.moveTo(40, 20)
      ctx.lineTo(40, canvas.height - 40)
      ctx.stroke()

      // Reset line width for other elements
      ctx.lineWidth = 1

      // Draw axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.font = '10px monospace'

      // Y-axis labels (years) - now on vertical axis
      const years = [1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2024]
      years.forEach(year => {
        const y = canvas.height - 40 - ((year - minYear) / yearRange) * (canvas.height - 60)
        ctx.fillText(year.toString(), 5, y + 3)

        // Draw tick marks
        ctx.beginPath()
        ctx.moveTo(40, y)
        ctx.lineTo(35, y)
        ctx.stroke()
      })


      ctx.setLineDash([])
      ctx.lineWidth = 1

      // Axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '12px monospace'
      ctx.fillText('Giants', canvas.width / 2 - 20, canvas.height - 5)

      // Display current date and time with seconds
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
      ctx.font = '14px monospace'
      ctx.fillText(timeString, canvas.width - 200, canvas.height - 10)

      ctx.save()
      ctx.translate(10, canvas.height / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText('Time', -15, 0)
      ctx.restore()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [sortedGiants.length, minYear, yearRange, currentTime])

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      {/* Canvas for Euclidean space background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Timeline content */}
      <div className="relative z-10 p-8 h-full overflow-auto bg-transparent">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-white">
          Standing on the Shoulders of Giants
        </h2>

        {/* Legend with all unique fields */}
        <div className="flex flex-wrap gap-3 text-xs text-white/70 justify-center mb-6">
          {Object.entries(fieldColors).slice(0, 8).map(([field, color]) => (
            <div key={field} className="flex items-center gap-2">
              <div className="w-8 h-1" style={{ backgroundColor: color }}></div>
              <span className="capitalize">{field}</span>
            </div>
          ))}
        </div>

        <div className="relative min-h-[900px]" style={{ paddingLeft: '50px', paddingRight: '30px', paddingBottom: '50px', paddingTop: '30px' }}>
          {/* Timeline with vertical lines for each giant */}
          <div className="relative h-full">
            {sortedGiants.map((giant, index) => {
              const xPosition = (index / Math.max(sortedGiants.length - 1, 1)) * 100
              const startY = getYPosition(giant.birth_year)
              const endY = getYPosition(giant.death_year || maxYear)
              const height = endY - startY
              const colorStyle = getGiantColor(giant.fields)
              const isGradient = colorStyle.includes('gradient')

              return (
                <div
                  key={giant.name}
                  className="absolute"
                  style={{
                    left: `${xPosition}%`,
                    bottom: `${startY}%`,
                    height: `${height}%`,
                    width: '3px'
                  }}
                >
                  {/* Profile picture at the bottom (birth) */}
                  {giant.imageUrl && (
                    <div
                      className="absolute -left-3 -bottom-4 w-8 h-8 rounded-full overflow-hidden border-2 border-white/50 cursor-pointer hover:scale-110 transition-transform z-30"
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
                      bottom: 0,
                      height: '100%',
                      width: '3px',
                      left: '0',
                      background: isGradient ? colorStyle : undefined,
                      backgroundColor: !isGradient ? colorStyle : undefined,
                      boxShadow: hoveredGiant?.name === giant.name
                        ? `0 0 12px ${isGradient ? 'rgba(255,255,255,0.8)' : colorStyle}`
                        : 'none',
                      filter: hoveredGiant?.name === giant.name ? 'brightness(1.3)' : 'none'
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