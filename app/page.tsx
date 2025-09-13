'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, BookOpen, Code, Briefcase, Brain, Sparkles, Zap } from 'lucide-react'
import profileData from '@/data.json'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 3

  const scrollToPage = (pageIndex: number) => {
    if (scrollContainerRef.current) {
      const pageWidth = window.innerWidth
      scrollContainerRef.current.scrollTo({
        left: pageWidth * pageIndex,
        behavior: 'smooth'
      })
      setCurrentPage(pageIndex)
    }
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft
      const pageWidth = window.innerWidth
      const newPage = Math.round(scrollLeft / pageWidth)
      setCurrentPage(newPage)
    }
  }

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
  }, [currentPage])

  // Categories for interests with icons
  const interestCategories = [
    {
      title: "Research Interests",
      icon: <Brain className="w-5 h-5" />,
      items: profileData.research.interests.primary
    },
    {
      title: "Skills & Experience",
      icon: <Zap className="w-5 h-5" />,
      items: profileData.skills_experience
    },
    {
      title: "Teaching & Sports",
      icon: <Sparkles className="w-5 h-5" />,
      items: [
        ...Object.values(profileData.academic_service.tutoring.subjects).flat(),
        ...profileData.academic_service.sports_esports
      ]
    }
  ]

  return (
    <main className="relative h-screen overflow-hidden bg-background">
      {/* Navigation Dots */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
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

      {/* Navigation Arrows */}
      {currentPage > 0 && (
        <button
          onClick={() => scrollToPage(currentPage - 1)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-surface/80 backdrop-blur-sm border border-border hover:bg-primary hover:border-primary transition-all group"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {currentPage < totalPages - 1 && (
        <button
          onClick={() => scrollToPage(currentPage + 1)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-surface/80 backdrop-blur-sm border border-border hover:bg-primary hover:border-primary transition-all group"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Horizontal Scrolling Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar"
      >
        {/* Page 1: Hero & About */}
        <section className="min-w-full h-full snap-start flex items-center justify-center relative">
          <div className="absolute inset-0 bg-grid opacity-20"></div>
          <div className="absolute inset-0 bg-entelligent-gradient opacity-30"></div>

          <div className="relative z-10 text-center px-4 max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-bold mb-4 font-sf-pro"
            >
              <span className="text-gradient">{profileData.personal.name.display}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl md:text-2xl mb-2"
            >
              {profileData.personal.identity.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg mb-8 italic text-primary"
            >
              "{profileData.personal.identity.philosophy}"
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center space-x-6 mb-12"
            >
              <a
                href={profileData.personal.contact.social.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-surface rounded-full hover:bg-primary hover:scale-110 transition-all"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href={profileData.personal.contact.social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-surface rounded-full hover:bg-primary hover:scale-110 transition-all"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="mailto:b3h@me.com"
                className="p-3 bg-surface rounded-full hover:bg-primary hover:scale-110 transition-all"
              >
                <Mail className="w-6 h-6" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid md:grid-cols-2 gap-4 text-left"
            >
              <div className="bg-surface/80 backdrop-blur-sm p-4 rounded-xl border border-primary">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Education
                </h3>
                <p className="text-sm">B.S. Computer Science (Math Minor)</p>
                <p className="text-xs text-primary mt-1">Associate in Software Engineering</p>
              </div>

              <div className="bg-surface/80 backdrop-blur-sm p-4 rounded-xl border border-primary">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Entelligent
                </h3>
                <p className="text-sm">Co-Founder</p>
                <a href={profileData.entrepreneurship.company.deployments.production[1].url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-xs text-primary hover:underline">
                  Visit entelligent.ai →
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Page 2: Skills & Experience */}
        <section className="min-w-full h-full snap-start flex items-center justify-center px-4">
          <div className="max-w-6xl w-full">
            <h2 className="text-4xl font-bold mb-8 text-gradient text-center">Skills & Experience</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-surface p-6 rounded-xl border-2 border-primary">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.technical_skills.languages.programming.primary.map((lang: string) => (
                    <span key={lang} className="px-3 py-1 bg-primary/20 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-surface p-6 rounded-xl border-2 border-primary">
                <h3 className="text-xl font-semibold mb-4">ML/AI Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.technical_skills.frameworks.ml_dl.core.slice(0, 5).map((fw: string) => (
                    <span key={fw} className="px-3 py-1 bg-primary/20 rounded-full text-sm">
                      {fw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-surface p-6 rounded-xl border-2 border-primary">
                <h3 className="text-xl font-semibold mb-4">Databases</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.technical_skills.frameworks.databases.graph.map((db: string) => (
                    <span key={db} className="px-3 py-1 bg-primary/20 rounded-full text-sm">
                      {db}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-xl border-2 border-primary mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Professional Experience
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">Research and Development (R&D)</p>
                  <p className="text-sm text-primary">Multi-Agent Geometric Learning • Medical AI Diagnostics</p>
                </div>
                <div>
                  <p className="font-semibold">Software as a Service (SaaS)</p>
                  <p className="text-sm text-primary">Entelligent Co-Founder • Knowledge Base Systems</p>
                </div>
                <div>
                  <p className="font-semibold">Network & Security Systems Administrator</p>
                  <p className="text-sm text-primary">Infrastructure Management • Security Implementation</p>
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-xl border-2 border-primary">
              <h3 className="text-lg font-semibold mb-4">Full Stack Development & DevOps</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Frontend</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.web.frontend.frameworks.map((fw: string) => (
                      <span key={fw} className="px-2 py-1 bg-entelligent-gradient text-white rounded text-xs">
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Backend</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.web.backend.apis.map((api: string) => (
                      <span key={api} className="px-2 py-1 bg-entelligent-gradient text-white rounded text-xs">
                        {api}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">DevOps</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.tools.deployment.map((tool: string) => (
                      <span key={tool} className="px-2 py-1 bg-entelligent-gradient text-white rounded text-xs">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Page 3: Interests & Contact */}
        <section className="min-w-full h-full snap-start flex items-center justify-center px-4">
          <div className="max-w-6xl w-full">
            <h2 className="text-4xl font-bold mb-8 text-gradient text-center">Interests & Passions</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {interestCategories.map((category, idx) => (
                <div key={idx} className="bg-surface p-4 rounded-xl border-2 border-primary">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.items.slice(0, 6).map((item: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full bg-entelligent-gradient text-white"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface p-6 rounded-xl border-2 border-primary mb-8">
              <h3 className="text-lg font-semibold mb-4 text-center">Visions of the Future Past</h3>
              <p className="text-center mb-4">
                <span className="text-gradient" style={{ textDecoration: 'line-through', textDecorationColor: '#3c6e71', textDecorationThickness: '2px' }}>Small</span> Talk Only About:
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-h-96 overflow-y-auto p-4">
                {profileData.passionate_interests.map((interest: string, idx: number) => {
                  const angle = (idx * 10) % 360;
                  const colors = [
                    `linear-gradient(${angle}deg, #3c6e71, #284b63)`,
                    `linear-gradient(${angle}deg, #284b63, #353535)`,
                    `linear-gradient(${angle}deg, #353535, #3c6e71)`,
                    `linear-gradient(${angle}deg, #3c6e71, #353535)`,
                    `linear-gradient(${angle}deg, #284b63, #3c6e71)`,
                    `linear-gradient(${angle}deg, #353535, #284b63)`
                  ];
                  return (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs rounded-full transition-all hover:scale-105"
                      style={{
                        background: colors[idx % colors.length],
                        color: 'white'
                      }}
                    >
                      {interest}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="text-center">
              <div className="flex justify-center gap-4 mb-6">
                <a
                  href="mailto:b3h@me.com"
                  className="px-6 py-3 bg-entelligent text-white rounded-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Email Me
                </a>
                <a
                  href={profileData.personal.contact.social.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-surface border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                >
                  <Linkedin className="w-5 h-5" />
                  Connect
                </a>
              </div>
              <p className="text-sm">© 2025 {profileData.personal.name.display}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}