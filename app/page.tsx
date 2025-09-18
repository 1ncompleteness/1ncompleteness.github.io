'use client'

import { motion } from 'framer-motion'
import { Mail, BookOpen, Code, Briefcase, Sparkles, Zap, GraduationCap, FileText, FlaskConical, Activity, Music, Github, Linkedin } from 'lucide-react'
import profileData from '@/data.json'
import Timeline from '@/components/Timeline'
import TopBar from '@/components/TopBar'
import { useRef, useState } from 'react'

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 5

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


  // Helper function to generate search URL (Wikipedia or Google fallback)
  const getSearchUrl = (item: string) => {
    // Special mappings for items that need specific Wikipedia pages
    const wikipediaMappings: { [key: string]: string } = {
      // Research Interests
      "NLP (Natural Language Processing)": "Natural_language_processing",
      "LLMs (Large Language Models)": "Large_language_model",
      "MAS (Multi-Agent Systems)": "Multi-agent_system",
      "RAG (Retrieval-Augmented Generation) Systems": "Retrieval-augmented_generation",
      "ZSL (Zero-Shot Learning)": "Zero-shot_learning",
      "tACS (Transcranial Alternating Current Stimulation)": "Transcranial_alternating_current_stimulation",
      "tDCS (Transcranial Direct Current Stimulation)": "Transcranial_direct-current_stimulation",
      "TMS (Transcranial Magnetic Stimulation)": "Transcranial_magnetic_stimulation",
      "Formal Systems": "Formal_system",
      "Formal Methods": "Formal_methods",
      "Multimodal Agents": "Multimodal_learning",
      "Computational Neuroscience": "Computational_neuroscience",
      "Embedding Models": "Word_embedding",
      "Applied Machine Learning": "Machine_learning",
      "Knowledge Graphs": "Knowledge_graph",
      "Game Theory": "Game_theory",
      "Robust Optimization": "Robust_optimization",
      "Knowledge Base Systems": "Knowledge_base",
      "Algebraic Geometry": "Algebraic_geometry",
      // Sports & Esports
      "FIDE ~2000 ELO Norm": "FIDE_titles",
      "Basketball Assistant Coach": "Coach_(basketball)",
      "Basketball Instructor": "Basketball",
      "Basketball Pro League": "List_of_basketball_leagues",
      "Basketball State Championship": "High_school_basketball",
      "Chess Coach": "Chess",
      "Chess Instructor": "Chess",
      "Baroque Period": "Baroque_music",
      "Romantic Era": "Romantic_music",
      "Modern Classical": "Contemporary_classical_music",
      "Alternative Rock": "Alternative_rock",
      "Progressive Metal": "Progressive_metal",
      "Assassin's Creed": "Assassin%27s_Creed",
      "Beyond Two Souls": "Beyond:_Two_Souls",
      "Counter Strike": "Counter-Strike",
      "Cyberpunk 2077": "Cyberpunk_2077",
      "Dark Souls": "Dark_Souls",
      "Devil May Cry": "Devil_May_Cry",
      "Dota 2": "Dota_2",
      "Dragon Age": "Dragon_Age",
      "Elden Ring": "Elden_Ring",
      "God of War": "God_of_War_(franchise)",
      "Guitar Hero": "Guitar_Hero",
      "Half-Life": "Half-Life_(series)",
      "Heavy Rain": "Heavy_Rain",
      "Max Payne": "Max_Payne",
      "Mortal Kombat": "Mortal_Kombat",
      "NBA 2K": "NBA_2K",
      "Red Dead Redemption": "Red_Dead_Redemption",
      "Rust": "Rust_(video_game)",
      "The Last of Us": "The_Last_of_Us",
      "The Legend of Zelda": "The_Legend_of_Zelda",
      "The Witcher": "The_Witcher_(video_game_series)",
      "World of Warcraft": "World_of_Warcraft"
    }

    // Items that don't have Wikipedia pages - use Google search instead
    const googleSearchOnly: string[] = [
      "Basketball Assistant Coach",
      "Basketball Instructor",
      "Chess Coach",
      "Chess Instructor",
      "Multimodal Agents", // Actually doesn't have a direct Wikipedia page
      "Embedding Models" // Redirects to Word embedding but might be better as Google search
    ]

    // If item should use Google search or has no Wikipedia mapping
    if (googleSearchOnly.includes(item)) {
      return `https://www.google.com/search?q=${encodeURIComponent(item)}`
    }

    // Check if there's a specific Wikipedia mapping, otherwise use the item name with underscores
    const wikiPage = wikipediaMappings[item] || item.replace(/ /g, '_')
    return `https://en.wikipedia.org/wiki/${wikiPage}`
  }

  // Categories for interests with icons
  const interestCategories = [
    {
      title: "Art & Music",
      icon: <Music className="w-5 h-5" />,
      items: [
        "Alternative Rock", "Ambient", "Art Rock", "Baroque Period", "Blues",
        "Chamber Music", "Classical Music", "Dark Ambient", "Electronic",
        "Experimental", "Gothic Rock", "Grunge", "Heavy Metal", "Impressionism",
        "Indie Rock", "Industrial", "Jazz", "Medieval Music", "Modern Classical",
        "Neo-Classical", "Opera", "Orchestral", "Post-Punk",
        "Post-Rock", "Progressive Metal", "Progressive Rock", "Psychedelic Rock",
        "Renaissance Music", "Romantic Era", "Soundtrack",
        "Space Rock", "Symphonic Metal", "Trip Hop"
      ].sort()
    },
    {
      title: "Sports & Esports",
      icon: <Sparkles className="w-5 h-5" />,
      items: [
        "Chess","FIDE ~2000 ELO Norm", "Basketball", "Basketball Pro League", "Basketball State Championship",
        "Armored Core", "Assassin's Creed","Beyond Two Souls", "BioShock", "Bloodborne", "Borderlands", 
        "Counter Strike", "Cyberpunk 2077",
        "Dark Souls", "Devil May Cry", "Dota 2", "Dragon Age", "Elden Ring",
        "FarCry", "EA Sports FIFA", "God of War",
        "Guitar Hero", "Hades", "Half-Life", "Heavy Rain", "Max Payne",
        "Mortal Kombat", "NBA 2K", "Red Dead Redemption", "Rust",
        "Sekiro", "The Last of Us", "The Witcher",
        "Uncharted", "World of Warcraft"
      ].sort()
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
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-primary flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Education
                </h3>
                <p className="text-xs sm:text-sm">B.S. Computer Science, Math Minor, 2026 Class</p>
                <p className="text-xs text-primary mt-1">Associate's Degree in Software Engineering</p>
              </div>

              <div className="bg-transparent p-3 sm:p-4 rounded-xl border border-primary">
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-primary flex items-center gap-2">
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

        {/* Page 2: Research, Publications & Courses */}
        <section className="min-w-full h-full snap-start relative overflow-hidden">
          <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-entelligent-gradient opacity-30 pointer-events-none"></div>
          <div className="relative z-10 h-full p-8 overflow-y-auto">
            <div className="px-4 max-w-6xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-white">
                Research & Academia
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Research Interests - merged with ML Focus */}
                <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary flex items-center gap-2">
                    <FlaskConical className="w-5 h-5" />
                    Research Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      // Collect all interests from data.json
                      const allInterests = [
                        ...profileData.research.interests.primary,
                        ...profileData.research.interests.detailed.machine_learning.subfields.nlp.areas.slice(0, 2),
                        profileData.research.interests.detailed.machine_learning.subfields.game_theory.focus
                      ];

                      // Remove duplicates (case-insensitive)
                      const uniqueInterests = Array.from(new Set(
                        allInterests.map(interest => interest.toLowerCase())
                      )).map(lowerInterest =>
                        allInterests.find(original => original.toLowerCase() === lowerInterest) || lowerInterest
                      );

                      // Sort based on your profile focus
                      const sortedInterests = uniqueInterests.sort((a, b) => {
                        const priority: Record<string, number> = {
                          "applied machine learning": 1,
                          "nlp (natural language processing)": 2,
                          "natural language processing": 2,
                          "llms (large language models)": 3,
                          "large language models": 3,
                          "knowledge graphs": 4,
                          "game theory": 5,
                          "robust optimization": 6,
                          "algebraic geometry": 7,
                          "mas (multi-agent systems)": 8,
                          "multi-agent systems": 8,
                          "multimodal agents": 9,
                          "knowledge base systems": 10,
                          "rag (retrieval-augmented generation) systems": 11,
                          "rag systems": 11,
                          "embedding models": 12,
                          "formal systems": 13,
                          "formal methods": 14,
                          "zsl (zero-shot learning)": 15,
                          "computational neuroscience": 16,
                          "consciousness": 17,
                          "cosmology": 18,
                          "tacs (transcranial alternating current stimulation)": 19,
                          "tdcs (transcranial direct current stimulation)": 20,
                          "tms (transcranial magnetic stimulation)": 21
                        };

                        const aPriority = priority[a.toLowerCase()] || 99;
                        const bPriority = priority[b.toLowerCase()] || 99;

                        return aPriority - bPriority;
                      });

                      return sortedInterests.map((interest: string, index: number) => {
                        // Format with proper acronyms and title case
                        let formatted = interest;

                        // Map to proper acronym format
                        const acronymMappings: Record<string, string> = {
                          "natural language processing": "NLP (Natural Language Processing)",
                          "large language models": "LLMs (Large Language Models)",
                          "multi-agent systems": "MAS (Multi-Agent Systems)",
                          "rag systems": "RAG (Retrieval-Augmented Generation) Systems",
                          "zsl (zero-shot learning)": "ZSL (Zero-Shot Learning)",
                          "tacs (transcranial alternating current stimulation)": "tACS (Transcranial Alternating Current Stimulation)",
                          "tdcs (transcranial direct current stimulation)": "tDCS (Transcranial Direct Current Stimulation)",
                          "tms (transcranial magnetic stimulation)": "TMS (Transcranial Magnetic Stimulation)"
                        };

                        const lowerInterest = interest.toLowerCase();
                        if (acronymMappings[lowerInterest]) {
                          formatted = acronymMappings[lowerInterest];
                        } else if (!interest.includes('(')) {
                          // Title case if not already formatted with acronym
                          formatted = interest.split(' ').map((word: string) =>
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                          ).join(' ');
                        }

                        return (
                          <a
                            key={index}
                            href={getSearchUrl(formatted)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 text-xs rounded-full bg-entelligent-gradient text-white hover:opacity-80 transition-opacity"
                          >
                            {formatted}
                          </a>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Research Publications - 4 items */}
                <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Research & Publications
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {/* Alzheimer's Paper with Preprint */}
                    <div className="border-l-2 border-primary/50 pl-3 py-1">
                      <h4 className="text-sm sm:text-base font-semibold text-white">
                        {profileData.research.projects.publications.medical_ai.alzheimers.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-white/60">
                        UCI DARWIN Dataset • {profileData.research.projects.publications.medical_ai.alzheimers.venue} • {profileData.research.projects.publications.medical_ai.alzheimers.status}
                      </p>
                      <p className="text-xs sm:text-sm text-white/60">
                        XGBoost Baseline with Cross-Validation
                      </p>
                      <div className="flex gap-4">
                        <a
                          href={profileData.research.projects.publications.medical_ai.alzheimers.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-primary hover:underline"
                        >
                          View Preprint →
                        </a>
                        <a
                          href="https://archive.ics.uci.edu/dataset/732/darwin"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-primary hover:underline"
                        >
                          View Dataset →
                        </a>
                      </div>
                    </div>

                    {/* Parkinson's Research */}
                    <div className="border-l-2 border-primary/50 pl-3 py-1">
                      <h4 className="text-sm sm:text-base font-semibold text-white">
                        {profileData.research.projects.publications.medical_ai.parkinsons.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-white/60">
                        UCI Parkinson's Dataset • {profileData.research.projects.publications.medical_ai.parkinsons.status}
                      </p>
                      <p className="text-xs sm:text-sm text-white/60">
                        Gradient Boosting Baseline
                      </p>
                      <a
                        href="https://archive.ics.uci.edu/dataset/174/parkinsons"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-primary hover:underline"
                      >
                        View Dataset →
                      </a>
                    </div>

                    {/* Multi-Agent Geometric Project */}
                    <div className="border-l-2 border-primary/50 pl-3 py-1">
                      <h4 className="text-sm sm:text-base font-semibold text-white">
                        {profileData.research.projects.active.multi_agent_geometric.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-white/60">
                        Game Theory • Geometric Spaces • {profileData.research.projects.active.multi_agent_geometric.status}
                      </p>
                      <p className="text-xs sm:text-sm text-white/60">
                        Memory-equipped agents on manifolds
                      </p>
                    </div>

                    {/* Knowledge Graph Systems */}
                    <div className="border-l-2 border-primary/50 pl-3 py-1">
                      <h4 className="text-sm sm:text-base font-semibold text-white">
                        Knowledge Graph & Base Systems
                      </h4>
                      <p className="text-xs sm:text-sm text-white/60">
                        Graph Neural Networks • Embeddings • exploratory
                      </p>
                      <p className="text-xs sm:text-sm text-white/60">
                        Entity linking and relation extraction
                      </p>
                    </div>
                  </div>
                </div>

                {/* Courses Taken - All Combined */}
                <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary md:col-span-2">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Courses
                  </h3>
                  <div className="space-y-4">
                    {/* Current Enrollment */}
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-primary mb-2">Current Enrollment (Spring 2025)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {profileData.education.courses_taken.current_enrollment.map((course: any, index: number) => (
                          <div key={`current-${course.code}-${course.name}-${index}`} className="border-l-2 border-primary/50 pl-2 py-1">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <span className="text-xs font-semibold text-white">{course.code}</span>
                                <p className="text-xs text-white/60">{course.name}</p>
                              </div>
                              <span className="text-xs text-yellow-400 ml-1">In Progress</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Completed Courses */}
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-primary mb-2">Completed Courses</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Computer Science */}
                        <div>
                          <h5 className="text-xs sm:text-sm font-semibold text-primary/80 mb-2">Computer Science</h5>
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {profileData.education.courses_taken.computer_science.map((course: any, index: number) => (
                              <div key={`cs-${course.code}-${course.name}-${index}`} className="border-b border-white/10 pb-1">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <span className="text-xs font-semibold text-white">{course.code}</span>
                                    <p className="text-xs text-white/60">{course.name}</p>
                                    {course.term && <p className="text-xs text-white/40">{course.term}</p>}
                                  </div>
                                  <span className="text-xs font-bold text-primary ml-1">{course.grade}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Mathematics */}
                        <div>
                          <h5 className="text-xs sm:text-sm font-semibold text-primary/80 mb-2">Mathematics</h5>
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {profileData.education.courses_taken.mathematics.map((course: any, index: number) => (
                              <div key={`math-${course.code}-${course.name}-${index}`} className="border-b border-white/10 pb-1">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <span className="text-xs font-semibold text-white">{course.code}</span>
                                    <p className="text-xs text-white/60">{course.name}</p>
                                    {course.term && <p className="text-xs text-white/40">{course.term}</p>}
                                  </div>
                                  <span className="text-xs font-bold text-primary ml-1">{course.grade}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Physics */}
                        <div>
                          <h5 className="text-xs sm:text-sm font-semibold text-primary/80 mb-2">Physics</h5>
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {profileData.education.courses_taken.physics.map((course: any, index: number) => (
                              <div key={`phys-${course.code}-${course.name}-${index}`} className="border-b border-white/10 pb-1">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <span className="text-xs font-semibold text-white">{course.code}</span>
                                    <p className="text-xs text-white/60">{course.name}</p>
                                    {course.term && <p className="text-xs text-white/40">{course.term}</p>}
                                  </div>
                                  <span className="text-xs font-bold text-primary ml-1">{course.grade}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* General Education */}
                        <div>
                          <h5 className="text-xs sm:text-sm font-semibold text-primary/80 mb-2">General Education</h5>
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {profileData.education.courses_taken.general_education?.map((course: any, index: number) => (
                              <div key={`ge-${course.code}-${course.name}-${index}`} className="border-b border-white/10 pb-1">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <span className="text-xs font-semibold text-white">{course.code}</span>
                                    <p className="text-xs text-white/60">{course.name}</p>
                                    {course.term && <p className="text-xs text-white/40">{course.term}</p>}
                                  </div>
                                  <span className="text-xs font-bold text-primary ml-1">{course.grade}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Page 3: Skills & Experiences */}
        <section className="min-w-full h-full snap-start relative overflow-hidden">
          <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-entelligent-gradient opacity-30 pointer-events-none"></div>
          <div className="relative z-10 h-full p-8 overflow-y-auto">
            <div className="px-4 max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-white">{profileData.experiences.section_titles.main}</h2>

            {/* Experiences and Teaching sections side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  {profileData.experiences.section_titles.experiences}
                </h3>
                <div className="space-y-3">
                  {profileData.experiences.items.map((exp: any, index: number) => (
                    <div key={`exp-${exp.title}-${exp.organization}-${index}`}>
                      <p className="text-sm sm:text-base font-semibold">{exp.title}</p>
                      <p className="text-xs sm:text-sm text-primary">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Teaching
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[...Object.values(profileData.academic_service.tutoring.subjects).flat(),
                    "Basketball Assistant Coach", "Basketball Instructor", "Chess Coach", "Chess Instructor"
                  ].map((subject: any, idx: number) => (
                    <a
                      key={`teach-${subject}-${idx}`}
                      href={getSearchUrl(subject)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                      style={{ background: `linear-gradient(${45 + idx * 30}deg, #3c6e71, #284b63)` }}>
                      {subject}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills section - Languages */}
            <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary flex items-center gap-2">
                <Code className="w-5 h-5" />
                {profileData.experiences.section_titles.languages}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Primary</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.languages.programming.primary.slice(0, 3).map((lang: string, idx: number) => (
                      <a
                        key={lang}
                        href={getSearchUrl(lang)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${45 + idx * 30}deg, #3c6e71, #284b63)` }}>
                        {lang}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">System</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.languages.programming.primary.slice(3).map((lang: string, idx: number) => (
                      <a
                        key={lang}
                        href={getSearchUrl(lang)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${90 + idx * 30}deg, #284b63, #353535)` }}>
                        {lang}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Scripting</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.languages.programming.scripting?.slice(0, 3).map((lang: string, idx: number) => (
                      <a
                        key={lang}
                        href={getSearchUrl(lang)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${135 + idx * 30}deg, #353535, #3c6e71)` }}>
                        {lang}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Machine Learning section */}
            <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {profileData.experiences.section_titles.ml_ai}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Core</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.ml_ai.core?.map((fw: string, idx: number) => (
                      <a
                        key={fw}
                        href={getSearchUrl(fw)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${20 + idx * 25}deg, #3c6e71, #284b63)` }}>
                        {fw}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">NLP</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.ml_ai.specialized?.nlp?.map((nlp: string, idx: number) => (
                      <a
                        key={nlp}
                        href={getSearchUrl(nlp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${60 + idx * 40}deg, #284b63, #353535)` }}>
                        {nlp}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Graph & Visualization</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.ml_ai.specialized?.graph?.map((graph: string, idx: number) => (
                      <a
                        key={graph}
                        href={getSearchUrl(graph)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${100 + idx * 60}deg, #353535, #3c6e71)` }}>
                        {graph}
                      </a>
                    ))}
                    {profileData.technical_skills.frameworks.ml_ai.specialized?.visualization?.map((viz: string, idx: number) => (
                      <a
                        key={viz}
                        href={getSearchUrl(viz)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${160 + idx * 60}deg, #353535, #3c6e71)` }}>
                        {viz}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Databases section */}
            <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                {profileData.experiences.section_titles.databases}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Relational</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.databases.relational?.map((db: string, idx: number) => (
                      <a
                        key={db}
                        href={getSearchUrl(db)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${30 + idx * 35}deg, #3c6e71, #284b63)` }}>
                        {db}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Graph & Vector</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.databases.graph?.map((db: string, idx: number) => (
                      <a
                        key={db}
                        href={getSearchUrl(db)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${80 + idx * 50}deg, #284b63, #353535)` }}>
                        {db}
                      </a>
                    ))}
                    {profileData.technical_skills.frameworks.databases.vector?.map((db: string, idx: number) => (
                      <a
                        key={db}
                        href={getSearchUrl(db)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${130 + idx * 50}deg, #284b63, #353535)` }}>
                        {db}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">NoSQL</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.databases.nosql?.map((db: string, idx: number) => (
                      <a
                        key={db}
                        href={getSearchUrl(db)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${180 + idx * 45}deg, #353535, #3c6e71)` }}>
                        {db}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>


            <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary flex items-center gap-2">
                <Code className="w-5 h-5" />
                {profileData.experiences.section_titles.full_stack}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">{profileData.experiences.section_titles.frontend}</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.web.frontend.frameworks.map((fw: string, idx: number) => (
                      <a
                        key={fw}
                        href={getSearchUrl(fw)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${15 + idx * 45}deg, #3c6e71, #284b63)` }}>
                        {fw}
                      </a>
                    ))}
                    {profileData.technical_skills.frameworks.web.frontend.http_clients?.map((client: string, idx: number) => (
                      <a
                        key={client}
                        href={getSearchUrl(client)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${60 + idx * 30}deg, #284b63, #3c6e71)` }}>
                        {client}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">{profileData.experiences.section_titles.backend}</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.web.backend.apis.map((api: string, idx: number) => (
                      <a
                        key={api}
                        href={getSearchUrl(api)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${45 + idx * 60}deg, #284b63, #353535)` }}>
                        {api}
                      </a>
                    ))}
                    {profileData.technical_skills.frameworks.web.backend.nodejs?.map((node: string, idx: number) => (
                      <a
                        key={node}
                        href={getSearchUrl(node)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${90 + idx * 60}deg, #353535, #284b63)` }}>
                        {node}
                      </a>
                    ))}
                    {profileData.technical_skills.frameworks.web.backend.authentication?.map((auth: string, idx: number) => (
                      <a
                        key={auth}
                        href={getSearchUrl(auth)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${120 + idx * 40}deg, #3c6e71, #353535)` }}>
                        {auth}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">{profileData.experiences.section_titles.devops}</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.technical_skills.frameworks.devops?.containerization?.map((container: string, idx: number) => (
                      <a
                        key={container}
                        href={getSearchUrl(container)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${25 + idx * 50}deg, #353535, #3c6e71)` }}>
                        {container}
                      </a>
                    ))}
                    {profileData.technical_skills.frameworks.devops?.cloud?.map((cloud: string, idx: number) => (
                      <a
                        key={cloud}
                        href={getSearchUrl(cloud)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${75 + idx * 35}deg, #3c6e71, #284b63)` }}>
                        {cloud}
                      </a>
                    ))}
                    {profileData.technical_skills.frameworks.devops?.ci_cd?.map((ci: string, idx: number) => (
                      <a
                        key={ci}
                        href={getSearchUrl(ci)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-white rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: `linear-gradient(${180 + idx * 45}deg, #284b63, #353535)` }}>
                        {ci}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Page 4: Interests & Contact */}
        <section className="min-w-full h-full snap-start relative overflow-hidden">
          <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-entelligent-gradient opacity-30 pointer-events-none"></div>
          <div className="relative z-10 h-full p-8 overflow-y-auto">
            <div className="px-4 max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-white">Interests & Passions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {interestCategories.map((category, idx) => (
                <div key={`category-${category.title}-${idx}`} className="bg-transparent p-3 sm:p-4 rounded-xl border-2 border-primary">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-primary flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item: string, i: number) => (
                      <a
                        key={`${category.title}-${item}-${i}`}
                        href={getSearchUrl(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-xs rounded-full bg-entelligent-gradient text-white hover:scale-105 transition-transform cursor-pointer"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-transparent p-4 sm:p-6 rounded-xl border-2 border-primary mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center text-primary">Visions of the Future Past</h3>
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
                    <a
                      key={idx}
                      href={getSearchUrl(interest)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs rounded-full transition-all hover:scale-105 hover:opacity-80"
                      style={{
                        background: colors[idx % colors.length],
                        color: 'white'
                      }}
                    >
                      {interest}
                    </a>
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
                <a
                  href="https://open.spotify.com/user/12100413470?si=f0f77136f72f4cef"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-transparent border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                >
                  <Music className="w-5 h-5" />
                  Spotify
                </a>
              </div>
              <p className="text-sm">© 2025 {profileData.personal.name.display}</p>
            </div>
            </div>
          </div>
        </section>

        {/* Page 5: Shoulders of Giants Timeline */}
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
