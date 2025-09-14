'use client'

import { motion } from 'framer-motion'
import { Mail, BookOpen, Code, Briefcase, Brain, Sparkles, Zap } from 'lucide-react'
import { Github } from 'lucide-react'
import { Linkedin } from 'lucide-react'
import profileData from '@/data.json'
import Timeline from '@/components/Timeline'
import TopBar from '@/components/TopBar'
import { useRef, useState } from 'react'

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 4

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


  // Categories for interests with icons
  const interestCategories = [
    {
      title: "Research Interests",
      icon: <Brain className="w-5 h-5" />,
      items: profileData.research.interests.primary
    },
    {
      title: "Skills & Experiences",
      icon: <Zap className="w-5 h-5" />,
      items: profileData.skills_experiences
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
    <main className="flex flex-col h-screen overflow-hidden relative">
      {/* TopBar Navigation Component - Takes its own space */}
      <TopBar currentPage={currentPage} totalPages={totalPages} scrollToPage={scrollToPage} />

      {/* Horizontal Scrolling Container - Fills remaining space */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar"
      >
        {/* Page 1: Hero & About */}
        <section className="min-w-full h-full snap-start relative overflow-hidden">
          <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-entelligent-gradient opacity-30 pointer-events-none"></div>

          <div className="relative z-10 h-full flex items-center justify-center p-8">
            <div className="text-center px-4 sm:px-6 md:px-8 max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 font-sf-pro"
            >
              <span style={{ color: '#ffffff' }}>{profileData.personal.name.display}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl mb-2"
            >
              {profileData.personal.identity.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 italic text-primary"
            >
              "{profileData.personal.identity.philosophy}"
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center space-x-4 sm:space-x-6 mb-8 sm:mb-12"
            >
              <a
                href={profileData.personal.contact.social.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 bg-transparent border border-primary/30 rounded-full hover:bg-primary hover:scale-110 transition-all"
              >
                <Github className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href={profileData.personal.contact.social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 bg-transparent border border-primary/30 rounded-full hover:bg-primary hover:scale-110 transition-all"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href={`mailto:${profileData.personal.contact.email}`}
                className="p-2 sm:p-3 bg-transparent border border-primary/30 rounded-full hover:bg-primary hover:scale-110 transition-all"
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left"
            >
              <div className="bg-transparent p-3 sm:p-4 rounded-xl border border-primary">
                <h3 className="text-base sm:text-lg font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Education
                </h3>
                <p className="text-xs sm:text-sm">B.S. Computer Science, Math Minor, 2026 Class</p>
                <p className="text-xs text-primary mt-1">Associate's Degree in Software Engineering</p>
              </div>

              <div className="bg-transparent p-3 sm:p-4 rounded-xl border border-primary">
                <h3 className="text-base sm:text-lg font-semibold mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Entelligent
                </h3>
                <p className="text-xs sm:text-sm">Co-Founder, Research and Development (R&D)</p>
                <a href={profileData.entrepreneurship.company.deployments.production[1].url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-xs text-primary hover:underline">
                  Visit Entelligent →
                </a>
              </div>
            </motion.div>
            </div>
          </div>
        </section>

        {/* Page 2: Skills & Experiences */}
        <section className="min-w-full h-full snap-start relative overflow-hidden">
          <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-entelligent-gradient opacity-30 pointer-events-none"></div>
          <div className="relative z-10 h-full p-8 overflow-y-auto">
            <div className="px-4 max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-white">{profileData.experiences.section_titles.main}</h2>

            {/* Experiences section moved to top */}
            <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {profileData.experiences.section_titles.experiences}
              </h3>
              <div className="space-y-3">
                {profileData.experiences.items.map((exp: any, index: number) => (
                  <div key={index}>
                    <p className="text-sm sm:text-base font-semibold">{exp.title}</p>
                    <p className="text-xs sm:text-sm text-primary">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills section - Languages */}
            <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{profileData.experiences.section_titles.languages}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Primary</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.languages.programming.primary.slice(0, 3).map((lang: string, idx: number) => (
                      <span key={lang} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${45 + idx * 30}deg, #3c6e71, #284b63)` }}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">System</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.languages.programming.primary.slice(3).map((lang: string, idx: number) => (
                      <span key={lang} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${90 + idx * 30}deg, #284b63, #353535)` }}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Scripting</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.languages.programming.scripting?.slice(0, 3).map((lang: string, idx: number) => (
                      <span key={lang} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${135 + idx * 30}deg, #353535, #3c6e71)` }}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Machine Learning section */}
            <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{profileData.experiences.section_titles.ml_ai}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Core</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.ml_ai.core?.map((fw: string, idx: number) => (
                      <span key={fw} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${20 + idx * 25}deg, #3c6e71, #284b63)` }}>
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">NLP</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.ml_ai.specialized?.nlp?.map((nlp: string, idx: number) => (
                      <span key={nlp} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${60 + idx * 40}deg, #284b63, #353535)` }}>
                        {nlp}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Graph & Visualization</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.ml_ai.specialized?.graph?.map((graph: string, idx: number) => (
                      <span key={graph} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${100 + idx * 60}deg, #353535, #3c6e71)` }}>
                        {graph}
                      </span>
                    ))}
                    {profileData.technical_skills.frameworks.ml_ai.specialized?.visualization?.map((viz: string, idx: number) => (
                      <span key={viz} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${160 + idx * 60}deg, #353535, #3c6e71)` }}>
                        {viz}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Databases section */}
            <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{profileData.experiences.section_titles.databases}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Relational</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.databases.relational?.map((db: string, idx: number) => (
                      <span key={db} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${30 + idx * 35}deg, #3c6e71, #284b63)` }}>
                        {db}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Graph & Vector</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.databases.graph?.map((db: string, idx: number) => (
                      <span key={db} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${80 + idx * 50}deg, #284b63, #353535)` }}>
                        {db}
                      </span>
                    ))}
                    {profileData.technical_skills.frameworks.databases.vector?.map((db: string, idx: number) => (
                      <span key={db} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${130 + idx * 50}deg, #284b63, #353535)` }}>
                        {db}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">NoSQL</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.databases.nosql?.map((db: string, idx: number) => (
                      <span key={db} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${180 + idx * 45}deg, #353535, #3c6e71)` }}>
                        {db}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{profileData.experiences.section_titles.full_stack}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">{profileData.experiences.section_titles.frontend}</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.web.frontend.frameworks.map((fw: string, idx: number) => (
                      <span key={fw} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${15 + idx * 45}deg, #3c6e71, #284b63)` }}>
                        {fw}
                      </span>
                    ))}
                    {profileData.technical_skills.frameworks.web.frontend.http_clients?.map((client: string, idx: number) => (
                      <span key={client} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${60 + idx * 30}deg, #284b63, #3c6e71)` }}>
                        {client}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">{profileData.experiences.section_titles.backend}</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.web.backend.apis.map((api: string, idx: number) => (
                      <span key={api} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${45 + idx * 60}deg, #284b63, #353535)` }}>
                        {api}
                      </span>
                    ))}
                    {profileData.technical_skills.frameworks.web.backend.nodejs?.map((node: string, idx: number) => (
                      <span key={node} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${90 + idx * 60}deg, #353535, #284b63)` }}>
                        {node}
                      </span>
                    ))}
                    {profileData.technical_skills.frameworks.web.backend.authentication?.map((auth: string, idx: number) => (
                      <span key={auth} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${120 + idx * 40}deg, #3c6e71, #353535)` }}>
                        {auth}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">{profileData.experiences.section_titles.devops}</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.devops?.containerization?.map((container: string, idx: number) => (
                      <span key={container} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${25 + idx * 50}deg, #353535, #3c6e71)` }}>
                        {container}
                      </span>
                    ))}
                    {profileData.technical_skills.frameworks.devops?.cloud?.map((cloud: string, idx: number) => (
                      <span key={cloud} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${75 + idx * 35}deg, #3c6e71, #284b63)` }}>
                        {cloud}
                      </span>
                    ))}
                    {profileData.technical_skills.frameworks.devops?.ci_cd?.map((ci: string, idx: number) => (
                      <span key={ci} className="px-3 py-1 text-white rounded-full text-xs"
                        style={{ background: `linear-gradient(${180 + idx * 45}deg, #284b63, #353535)` }}>
                        {ci}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Page 3: Interests & Contact */}
        <section className="min-w-full h-full snap-start relative overflow-hidden">
          <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-entelligent-gradient opacity-30 pointer-events-none"></div>
          <div className="relative z-10 h-full p-8 overflow-y-auto">
            <div className="px-4 max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-white">Interests & Passions</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {interestCategories.map((category, idx) => (
                <div key={idx} className="bg-transparent p-3 sm:p-4 rounded-xl border-2 border-primary">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item: string, i: number) => (
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

            <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center">Visions of the Future Past</h3>
              <p className="text-center mb-4">
                <span className="text-gradient" style={{ textDecoration: 'line-through', textDecorationColor: '#3c6e71', textDecorationThickness: '2px' }}>Small</span> Talk Only About:
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto p-3 sm:p-4 scrollbar-thin scrollbar-thumb-primary scrollbar-track-surface">
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
                  href={`mailto:${profileData.personal.contact.email}`}
                  className="px-6 py-3 bg-entelligent text-white rounded-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Email Me
                </a>
                <a
                  href={profileData.personal.contact.social.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-transparent border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                >
                  <Linkedin className="w-5 h-5" />
                  Connect
                </a>
              </div>
              <p className="text-sm">© 2025 {profileData.personal.name.display}</p>
            </div>
            </div>
          </div>
        </section>

        {/* Page 4: Shoulders of Giants Timeline */}
        <section className="min-w-full h-full snap-start relative overflow-hidden">
          <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-entelligent-gradient opacity-30 pointer-events-none"></div>
          <div className="relative z-10 h-full">
            <Timeline />
          </div>
        </section>
      </div>
    </main>
  )
}
