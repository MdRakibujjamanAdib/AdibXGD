import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ExternalLink,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  ChevronsUpDown,
} from 'lucide-react';
import PortfolioLayout from '../components/layout/PortfolioLayout';
import SEO from '../components/SEO';
import { StudioLottieIcon } from '../components/ui/StudioAnimatedIcons';

// Default portrait photo for Adib (normal mode)
const NORMAL_MODE_PHOTO = '/MdRakibujamanAdib.jpg?v=3';
const NORMAL_MODE_LABEL = 'Md Rakibujjaman Adib';

// Section photo collections from public/images - TIED STRICTLY TO CATEGORIES
const SECTION_MEDIA: Record<string, { label: string; defaultImg: string; images: string[] }> = {
  awards: {
    label: 'Honours & Awards',
    defaultImg: encodeURI('/images/Honours & Awards.jpg'),
    images: [
      encodeURI('/images/Honours & Awards.jpg'),
      encodeURI('/images/Honours & Awards (2).jpg'),
      encodeURI('/images/Honours & Awards (3).jpg'),
      encodeURI('/images/Honours & Awards (4).jpg'),
      encodeURI('/images/Honours & Awards (5).jpg'),
    ],
  },
  experience: {
    label: 'Work Experience',
    defaultImg: encodeURI('/images/Work Experience.jpg'),
    images: [
      encodeURI('/images/Work Experience.jpg'),
      encodeURI('/images/Work Experience (2).jpg'),
      encodeURI('/images/Work Experience (3).jpg'),
      encodeURI('/images/Work Experience.png'),
    ],
  },
  education: {
    label: 'Education',
    defaultImg: encodeURI('/images/Education & Academic Training.jpg'),
    images: [
      encodeURI('/images/Education & Academic Training.jpg'),
      encodeURI('/images/Education & Academic Training (2).jpg'),
    ],
  },
  projects: {
    label: 'Key Initiatives & Projects',
    defaultImg: encodeURI('/images/Key Initiatives & Projects.jpg'),
    images: [
      encodeURI('/images/Key Initiatives & Projects.jpg'),
      encodeURI('/images/Key Initiatives & Projects (2).jpg'),
      encodeURI('/images/Key Initiatives & Projects (3).jpg'),
    ],
  },
  volunteering: {
    label: 'Volunteering & Leadership',
    defaultImg: encodeURI('/images/Volunteering & Leadership.jpg'),
    images: [
      encodeURI('/images/Volunteering & Leadership.jpg'),
      encodeURI('/images/Volunteering & Leadership (2).jpg'),
    ],
  },
};

export default function About() {
  // Main sections: collapsed by default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    awards: false,
    experience: false,
    education: false,
    projects: false,
    volunteering: false,
    skills: false,
  });

  // Active showcase image and category label on the left sticky screen
  const [activeImage, setActiveImage] = useState<string>(NORMAL_MODE_PHOTO);
  const [activeLabel, setActiveLabel] = useState<string>(NORMAL_MODE_LABEL);
  const [activeGallery, setActiveGallery] = useState<string[]>([]);
  const [slideIndex, setSlideIndex] = useState<number>(0);

  // Auto-slideshow cycling through photos of the active category
  useEffect(() => {
    if (activeGallery.length <= 1) {
      setSlideIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setSlideIndex(prev => {
        const next = (prev + 1) % activeGallery.length;
        setActiveImage(activeGallery[next]);
        return next;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [activeGallery]);

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isAllOpen = Object.values(openSections).every(Boolean);

  const toggleAllSections = () => {
    const nextState = !isAllOpen;
    setOpenSections({
      awards: nextState,
      experience: nextState,
      education: nextState,
      projects: nextState,
      volunteering: nextState,
      skills: nextState,
    });
  };

  // Hover triggers for category showcase (Capabilities uses default photo)
  const handleHoverSection = (sectionKey: string) => {
    if (sectionKey === 'skills') {
      handleLeaveAll();
      return;
    }
    const media = SECTION_MEDIA[sectionKey];
    if (media) {
      setActiveImage(media.defaultImg);
      setActiveLabel(media.label);
      setActiveGallery(media.images);
      setSlideIndex(0);
    }
  };

  // Revert back to Adib's normal portrait photo and name
  const handleLeaveAll = () => {
    setActiveImage(NORMAL_MODE_PHOTO);
    setActiveLabel(NORMAL_MODE_LABEL);
    setActiveGallery([]);
    setSlideIndex(0);
  };

  // =========================================================================
  // DATA COLLECTIONS (Clean - Zero Slop Badges, Zero Emojis)
  // =========================================================================

  const awards = [
    {
      title: 'Champion - AI Expo, Project Development',
      date: '21/08/2025',
      dept: 'Dept. of Multimedia & Creative Technology (MCT), DIU',
      desc: 'Recognized for innovative AI-driven creative application architecture and real-time generation systems.',
      isGold: true,
      link: 'https://daffodilvarsity.edu.bd/events-detail/406',
    },
    {
      title: 'Champion - Byte Battle Programming Contest',
      date: '02/08/2025',
      dept: 'Dept. of Information Technology & Management (ITM), DIU',
      desc: 'Top finish in competitive programming, algorithmic optimization, and data structures.',
      isGold: true,
      link: 'https://daffodilvarsity.edu.bd/events-detail/406',
    },
    {
      title: 'Champion – Pixel to Program: MCT Programming Contest',
      date: '12/12/2024',
      dept: 'Dept. of Multimedia & Creative Technology (MCT), DIU',
      desc: 'First place bridging software logic with interactive computer graphics and digital design.',
      isGold: true,
      link: 'https://daffodilvarsity.edu.bd/events-detail/413',
    },
    {
      title: '1st Runner-up - AI Fest 2025 Project Showcase',
      date: '01/12/2025',
      dept: 'Dept. of Computing & Information System (CIS), DIU',
      desc: 'Full-stack AI creative platform showcasing multimodal generation tools.',
      isGold: false,
      link: 'https://daffodilvarsity.edu.bd/events-detail/451',
    },
    {
      title: '1st Runner-up - AI Prompt to Blueprint Challenge',
      date: '21/08/2025',
      dept: 'Dept. of Multimedia & Creative Technology (MCT), DIU',
      desc: 'Advanced generative prompt engineering, system design, and blueprint synthesis.',
      isGold: false,
      link: 'https://daffodilvarsity.edu.bd/events-detail/406',
    },
    {
      title: '1st Runner-up - BrainMagneto IT Case Competition',
      date: '05/08/2025',
      dept: 'Dept. of Information Technology & Management (ITM), DIU',
      desc: 'IT project management strategy, scalable roadmapping, and agile execution.',
      isGold: false,
      link: 'https://daffodilvarsity.edu.bd/events-detail/435',
    },
  ];

  const workExperiences = [
    {
      role: 'Erasmus+ Game Developer',
      company: '038GAMES, Windesheim UAS',
      location: 'Zwolle, Netherlands',
      period: '01/09/2026 – 25/01/2027',
      website: 'https://038games.nl/',
      points: [
        "Internship within Erasmus+ exchange semester at Windesheim's own game studio, working on a real client project.",
        'Develop and implement gameplay systems and mechanics in Unity (C#).',
        'Collaborate within a multidisciplinary team of developers, designers, and creative technologist roles.',
        'Translate creative concepts into functional gameplay, give technical input, and maintain game code and architecture.',
      ],
    },
    {
      role: 'Graphic Designer & Creative Lead',
      company: 'Self-employed Studio',
      location: 'Dhaka, Bangladesh & Global',
      period: '01/03/2024 – 20/08/2026',
      website: 'https://adibx.me',
      points: [
        'Created branding, digital assets, and commercial graphics for international clients across Europe and Asia.',
        'Managed graphic production for a UK-based e-commerce and on-demand printing client.',
        'Prepared scalable visual assets for both digital and print platforms with strict design systems.',
        'Ensured designs maintain consistent branding, high fidelity, and production quality.',
      ],
    },
    {
      role: 'Game Security Operations & Community Lead',
      company: 'GARENA FREE FIRE',
      location: 'Delhi, India & Regional',
      period: '14/11/2020 – 22/01/2024',
      website: 'https://ff.garena.com/',
      points: [
        'Conducted game client integrity analysis and security vulnerability triage with Garena engineering teams.',
        'Supported the detection and moderation of unauthorized exploits across Bangladesh, India, and Nepal.',
        'Managed Free Fire community platforms and player communications in Bangladesh with 100k+ engagement.',
        'Supported localization through in-game translation, copywriting, and coordinated community meetups.',
      ],
    },
  ];

  const educations = [
    {
      degree: 'BSc in Multimedia & Creative Technology',
      institution: 'Daffodil International University',
      location: 'Birulia, Bangladesh',
      period: '12/01/2024 – Current',
      grade: 'Bachelor of Science',
      desc: "Bachelor's program bridging programming logic with digital design, game mechanics, and 3D CGI.",
      coursework: 'Web Engineering, Computer Graphics, Game Design, 3D Asset Creation, and UI/UX Design.',
      link: 'https://daffodilvarsity.edu.bd/',
    },
    {
      degree: 'Erasmus+ ICM, Game Studio',
      institution: 'Windesheim University of Applied Sciences',
      location: 'Zwolle, Netherlands',
      period: '25/08/2026 – 25/01/2027',
      grade: 'European Fellowship',
      desc: 'Elective ICT semester, working on real client projects in serious gaming in a multidisciplinary team.',
      coursework: 'Unity 3D Engine, C#, Serious Gaming, Player Engagement Heuristics, Interaction Architecture.',
      link: 'https://www.windesheim.nl/',
    },
  ];

  const projectsList = [
    {
      title: 'MCT Labs AI',
      role: 'Founder & Full-Stack Architect',
      period: '10/02/2025 – 15/03/2025',
      link: 'https://mctlabs.vercel.app/',
      points: [
        'Founded and built a full-stack AI creative platform integrating chat, image, video, and 3D generation.',
        'Built a prompt-to-code website builder with real-time HTML, CSS, and JavaScript preview, enabling complete website generation and editing through natural language.',
        'Launched the platform as a department-level beta initiative for the Department of MCT at DIU.',
      ],
    },
    {
      title: 'GREEN D',
      role: 'Co-Founder & Lead Designer',
      period: '07/10/2025 – 30/11/2025',
      link: 'https://greend.vercel.app/',
      points: [
        'Developed an IoT-based smart home platform integrating real-time environmental data and automated control of high-energy devices.',
        'Built three carbon-tracking modules covering household energy, food emissions, and transportation.',
        'Integrated OCR, location services, IoT automation, and AI analytics into a single end-to-end sustainability platform.',
      ],
    },
  ];

  const volunteeringList = [
    {
      title: 'ITM Summit 2026',
      role: 'Lead Designer',
      dept: 'Department of Information Technology & Management (ITM), DIU',
      date: '29/07/2026 – 01/08/2026',
      link: 'https://daffodilvarsity.edu.bd/events-detail/558',
    },
    {
      title: 'Industry Academia Lecture Series (Season 17)',
      role: 'IT Lead',
      dept: 'Daffodil International University (DIU)',
      date: '21/07/2026',
      link: 'https://daffodilvarsity.edu.bd/events-detail/558',
    },
    {
      title: 'ITM Summit 2025',
      role: 'Lead Designer & Web Developer',
      dept: 'Department of Information Technology & Management (ITM), DIU',
      date: '30/07/2025 – 02/08/2025',
      link: 'https://daffodilvarsity.edu.bd/events-detail/434',
    },
  ];

  const skillDomains = [
    {
      title: 'Creative Technology & Engineering',
      tag: 'Unity 3D, C#, Web, AI & IoT',
      skills: [
        'Game Development',
        'Web Development',
        'AI Prompt Engineering',
        'Internet of Things (IoT)',
        'Unity 3D & VR',
        'C# / C',
        'HTML5 / CSS3 / JavaScript',
        'React & Modern Web',
      ],
    },
    {
      title: 'Design, 3D & CGI',
      tag: 'V-Ray, Corona, Maya & Motion',
      skills: [
        '3D Animation',
        '3D Modeling',
        'Motion Graphics',
        'Graphic Design',
        'Video Editing',
        'Adobe Photoshop',
        'Adobe Illustrator',
        'Adobe After Effects',
        'Autodesk 3ds Max',
        'Autodesk Maya',
        'Chaos V-Ray',
        'Chaos Corona',
        'ZBrush',
        'DaVinci Resolve',
      ],
    },
    {
      title: 'Community & Strategic Leadership',
      tag: 'Event Direction & Operations',
      skills: [
        'Social Media Management',
        'Community Management',
        'Content Strategy',
        'Technical Documentation',
        'Event Leadership',
      ],
    },
  ];

  return (
    <>
      <SEO
        title="About"
        description="Learn about Md Rakibujjaman Adib, Erasmus+ Game Developer, 3-time Champion, and Co-Founder of GREEN D."
      />

      <PortfolioLayout
        pageLabel={activeLabel}
        showcaseChildren={
          <div className="relative w-full h-full overflow-hidden select-none bg-[var(--vb-bg)]">
            {/* Direct simultaneous opacity crossfade eliminates any black fade dip */}
            <AnimatePresence initial={false}>
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={activeLabel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </AnimatePresence>

            {/* Slideshow progress dots when cycling category photos */}
            {activeGallery.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 z-20">
                {activeGallery.map((_, dotIdx) => (
                  <span
                    key={dotIdx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      dotIdx === slideIndex % activeGallery.length
                        ? 'w-5 bg-[#e62e05]'
                        : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        }
      >
        {/* ========================================================
            MAIN BIOGRAPHY HERO CARD (Clean - Zero Slop Badges)
           ======================================================== */}
        <section
          className="vb-card p-6 md:p-10 relative overflow-hidden"
          aria-label="About Adib"
          onMouseEnter={handleLeaveAll}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--vb-text)] mb-6 leading-[1.15]">
            About Me
          </h1>

          <div className="text-base md:text-lg text-[var(--vb-text-muted)] space-y-5 leading-relaxed font-sans mb-8">
            <p>
              I’m <strong className="text-[var(--vb-text)]">Md Rakibujjaman Adib</strong>, a Creative Technologist and <strong className="text-[var(--vb-text)]">Erasmus+ Scholar</strong> with hands-on international experience across Europe and Asia, working with global teams and clients in game development, graphic design, and digital innovation.
            </p>
            <p>
              From collaborating on real-world game development projects in the Netherlands to delivering creative solutions for international clients, I combine technical expertise with a global perspective. My work spans AI-powered applications, software development, and interactive digital experiences.
            </p>
            <p>
              I thrive in multicultural environments, turning ambitious ideas into practical solutions and bringing creativity, adaptability, and problem-solving to every collaboration.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[var(--vb-border)]">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--vb-border)] bg-[var(--vb-card-inset)] text-[var(--vb-text)] font-semibold text-sm hover:border-[var(--vb-text)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Chat Now</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>

        {/* ========================================================
            WHY WORK WITH ME? (4 Animated Icons Grid)
           ======================================================== */}
        <section
          onMouseEnter={handleLeaveAll}
        >
          <div className="vb-section-heading">
            <h2>Why Work With Me?</h2>
            <span className="text-[#e62e05] font-bold text-lg select-none" aria-hidden="true">&darr;</span>
          </div>

          <div className="vb-feature-grid">
            <div className="vb-feature-card">
              <StudioLottieIcon name="loop" />
              <h3>Agile &amp; Rapid Sprints</h3>
              <p>Scale effortlessly with high-velocity turnaround, clean modular Unity architecture, and rapid prototyping.</p>
            </div>

            <div className="vb-feature-card">
              <StudioLottieIcon name="brush" />
              <h3>Photorealistic 3D &amp; CGI</h3>
              <p>Endless visual fidelity with Chaos V-Ray, Corona, and Maya for physical lighting, shaders, and cinematic renders.</p>
            </div>

            <div className="vb-feature-card">
              <StudioLottieIcon name="board" />
              <h3>Transparent Collaboration</h3>
              <p>Get a dedicated workflow for all your project requests, milestone reviews, and active technical updates.</p>
            </div>

            <div className="vb-feature-card">
              <StudioLottieIcon name="trophy" />
              <h3>International Recognition</h3>
              <p>Proven global perspective shaped by an Erasmus+ scholarship in the Netherlands, cross-border client collaborations, and 6 podium finishes across programming, AI, and digital innovation.</p>
            </div>
          </div>
        </section>

        {/* Global Expand / Collapse Control */}
        <div className="flex items-center justify-end px-1 pt-1 pb-1" onMouseEnter={handleLeaveAll}>
          <button
            type="button"
            onClick={toggleAllSections}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e62e05] hover:underline cursor-pointer"
          >
            <ChevronsUpDown size={14} />
            <span>{isAllOpen ? 'Collapse All Sections' : 'Expand All Sections'}</span>
          </button>
        </div>

        {/* ========================================================
            MAIN SECTION 1: HONOURS & AWARDS
            (Arrow beside title shown on hover • Category photo sync)
           ======================================================== */}
        <section
          className="vb-section-accordion"
          onMouseEnter={() => handleHoverSection('awards')}
          onMouseLeave={handleLeaveAll}
        >
          <button
            type="button"
            className="vb-section-trigger group"
            aria-expanded={openSections.awards}
            onClick={() => toggleSection('awards')}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <h2 className="vb-section-trigger-title">
                Honours &amp; Awards
              </h2>
              <span className="vb-section-trigger-title-arrow" aria-hidden="true">
                <ArrowRight size={17} />
              </span>
            </div>

            <div className="vb-section-trigger-meta">
              <span className="vb-section-trigger-tag">
                6 Podium Finishes
              </span>
              <div className="vb-section-trigger-chevron">
                <ChevronDown size={16} />
              </div>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {openSections.awards && (
              <motion.div
                key="awards-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="vb-award-grid pt-1">
                  {awards.map((award, idx) => (
                    <div
                      key={idx}
                      className="vb-award-card"
                    >
                      <div>
                        {/* Clean header: Date */}
                        <div className="flex items-center justify-between gap-2 mb-2 text-xs font-mono text-[var(--vb-text-muted)]">
                          <span>{award.date}</span>
                        </div>

                        <h3 className="text-lg font-bold text-[var(--vb-text)] mb-1 leading-snug">
                          {award.title}
                        </h3>
                        <p className="text-xs font-mono text-[#e62e05] mb-2">{award.dept}</p>
                        <p className="text-sm text-[var(--vb-text-muted)] leading-relaxed">{award.desc}</p>
                      </div>

                      <div className="pt-3 border-t border-[var(--vb-border)] flex items-center justify-end">
                        <a
                          href={award.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--vb-text)] hover:text-[#e62e05] transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          <span>View Record</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ========================================================
            MAIN SECTION 2: WORK EXPERIENCE
            (Arrow beside title shown on hover • Category photo sync)
           ======================================================== */}
        <section
          className="vb-section-accordion"
          onMouseEnter={() => handleHoverSection('experience')}
          onMouseLeave={handleLeaveAll}
        >
          <button
            type="button"
            className="vb-section-trigger group"
            aria-expanded={openSections.experience}
            onClick={() => toggleSection('experience')}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <h2 className="vb-section-trigger-title">
                Work Experience
              </h2>
              <span className="vb-section-trigger-title-arrow" aria-hidden="true">
                <ArrowRight size={17} />
              </span>
            </div>

            <div className="vb-section-trigger-meta">
              <span className="vb-section-trigger-tag">
                3 Key Roles
              </span>
              <div className="vb-section-trigger-chevron">
                <ChevronDown size={16} />
              </div>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {openSections.experience && (
              <motion.div
                key="experience-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="vb-timeline-grid pt-1">
                  {workExperiences.map((exp, idx) => (
                    <div
                      key={idx}
                      className="vb-timeline-card"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-mono text-[#e62e05]">{exp.period}</span>
                          <h3 className="text-lg font-bold text-[var(--vb-text)] mt-0.5">{exp.role}</h3>
                          <p className="text-sm font-semibold text-[var(--vb-text-muted)]">{exp.company} &bull; {exp.location}</p>
                        </div>
                        <a
                          href={exp.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--vb-border)] text-[var(--vb-text)] hover:border-[#e62e05] hover:text-[#e62e05] transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          <span>Visit Website</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>

                      <ul className="space-y-1.5 text-sm text-[var(--vb-text-muted)] leading-relaxed mt-2">
                        {exp.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <span className="text-[#e62e05] mt-1 shrink-0">&bull;</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ========================================================
            MAIN SECTION 3: EDUCATION & ACADEMIC TRAINING
            (Arrow beside title shown on hover • Category photo sync)
           ======================================================== */}
        <section
          className="vb-section-accordion"
          onMouseEnter={() => handleHoverSection('education')}
          onMouseLeave={handleLeaveAll}
        >
          <button
            type="button"
            className="vb-section-trigger group"
            aria-expanded={openSections.education}
            onClick={() => toggleSection('education')}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <h2 className="vb-section-trigger-title">
                Education &amp; Academic Training
              </h2>
              <span className="vb-section-trigger-title-arrow" aria-hidden="true">
                <ArrowRight size={17} />
              </span>
            </div>

            <div className="vb-section-trigger-meta">
              <span className="vb-section-trigger-tag">
                BSc &amp; Fellowship
              </span>
              <div className="vb-section-trigger-chevron">
                <ChevronDown size={16} />
              </div>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {openSections.education && (
              <motion.div
                key="education-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="vb-timeline-grid pt-1">
                  {educations.map((edu, idx) => (
                    <div
                      key={idx}
                      className="vb-timeline-card"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-mono text-[#e62e05]">{edu.period}</span>
                          <h3 className="text-lg font-bold text-[var(--vb-text)] mt-0.5">{edu.degree}</h3>
                          <p className="text-sm font-semibold text-[var(--vb-text-muted)]">{edu.institution} &bull; {edu.location}</p>
                        </div>
                        <a
                          href={edu.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--vb-border)] text-[var(--vb-text)] hover:border-[#e62e05] hover:text-[#e62e05] transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          <span>Official Portal</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>

                      <p className="text-xs font-mono text-[var(--vb-text-muted)] mt-1">{edu.grade}</p>
                      <p className="text-sm text-[var(--vb-text-muted)] leading-relaxed mt-2">{edu.desc}</p>
                      <p className="text-xs text-[var(--vb-text-muted)] leading-relaxed mt-1">
                        <strong className="text-[var(--vb-text)]">Key Focus:</strong> {edu.coursework}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ========================================================
            MAIN SECTION 4: KEY INITIATIVES & PROJECTS
            (Arrow beside title shown on hover • Category photo sync)
           ======================================================== */}
        <section
          className="vb-section-accordion"
          onMouseEnter={() => handleHoverSection('projects')}
          onMouseLeave={handleLeaveAll}
        >
          <button
            type="button"
            className="vb-section-trigger group"
            aria-expanded={openSections.projects}
            onClick={() => toggleSection('projects')}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <h2 className="vb-section-trigger-title">
                Key Initiatives &amp; Projects
              </h2>
              <span className="vb-section-trigger-title-arrow" aria-hidden="true">
                <ArrowRight size={17} />
              </span>
            </div>

            <div className="vb-section-trigger-meta">
              <span className="vb-section-trigger-tag">
                2 Ventures
              </span>
              <div className="vb-section-trigger-chevron">
                <ChevronDown size={16} />
              </div>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {openSections.projects && (
              <motion.div
                key="projects-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="vb-award-grid pt-1">
                  {projectsList.map((proj, idx) => (
                    <div
                      key={idx}
                      className="vb-award-card"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-mono text-[#e62e05]">{proj.period}</span>
                          <span className="text-xs font-mono text-[var(--vb-text-muted)] font-bold">{proj.role}</span>
                        </div>
                        <h3 className="text-lg font-bold text-[var(--vb-text)] mb-3">{proj.title}</h3>
                        <ul className="space-y-1.5 text-sm text-[var(--vb-text-muted)] leading-relaxed mb-4">
                          {proj.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2">
                              <span className="text-[#e62e05] mt-1 shrink-0">&bull;</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-[var(--vb-border)] flex items-center justify-end">
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--vb-text)] hover:text-[#e62e05] transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          <span>Live Platform</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ========================================================
            MAIN SECTION 5: VOLUNTEERING & LEADERSHIP
            (Arrow beside title shown on hover • Category photo sync)
           ======================================================== */}
        <section
          className="vb-section-accordion"
          onMouseEnter={() => handleHoverSection('volunteering')}
          onMouseLeave={handleLeaveAll}
        >
          <button
            type="button"
            className="vb-section-trigger group"
            aria-expanded={openSections.volunteering}
            onClick={() => toggleSection('volunteering')}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <h2 className="vb-section-trigger-title">
                Volunteering &amp; Leadership
              </h2>
              <span className="vb-section-trigger-title-arrow" aria-hidden="true">
                <ArrowRight size={17} />
              </span>
            </div>

            <div className="vb-section-trigger-meta">
              <span className="vb-section-trigger-tag">
                3 Initiatives
              </span>
              <div className="vb-section-trigger-chevron">
                <ChevronDown size={16} />
              </div>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {openSections.volunteering && (
              <motion.div
                key="volunteering-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="vb-award-grid pt-1">
                  {volunteeringList.map((vol, idx) => (
                    <div
                      key={idx}
                      className="vb-award-card"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-mono text-[#e62e05]">{vol.date}</span>
                          <span className="text-xs font-mono text-[var(--vb-text-muted)] font-bold">{vol.role}</span>
                        </div>
                        <h3 className="text-lg font-bold text-[var(--vb-text)] mb-1">{vol.title}</h3>
                        <p className="text-xs text-[var(--vb-text-muted)] font-mono mb-4">{vol.dept}</p>
                      </div>

                      <div className="pt-3 border-t border-[var(--vb-border)] flex items-center justify-end">
                        <a
                          href={vol.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--vb-text)] hover:text-[#e62e05] transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          <span>Event Portal</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ========================================================
            MAIN SECTION 6: CAPABILITIES & TOOLS
            (Default photo strictly preserved • Zero dedicated photos)
           ======================================================== */}
        <section
          className="vb-section-accordion"
          onMouseEnter={handleLeaveAll}
          onMouseLeave={handleLeaveAll}
        >
          <button
            type="button"
            className="vb-section-trigger group"
            aria-expanded={openSections.skills}
            onClick={() => toggleSection('skills')}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <h2 className="vb-section-trigger-title">
                Capabilities &amp; Tools
              </h2>
              <span className="vb-section-trigger-title-arrow" aria-hidden="true">
                <ArrowRight size={17} />
              </span>
            </div>

            <div className="vb-section-trigger-meta">
              <span className="vb-section-trigger-tag">
                3 Domains
              </span>
              <div className="vb-section-trigger-chevron">
                <ChevronDown size={16} />
              </div>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {openSections.skills && (
              <motion.div
                key="skills-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {skillDomains.map((dom, idx) => (
                    <div
                      key={idx}
                      className="bg-[var(--vb-panel)] p-5 rounded-xl border border-[var(--vb-border)] flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-base font-bold text-[var(--vb-text)] mb-1">{dom.title}</h3>
                        <p className="text-xs font-mono text-[#e62e05] mb-4">{dom.tag}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {dom.skills.map(skill => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded text-xs font-medium bg-[var(--vb-card-inset)] border border-[var(--vb-border)] text-[var(--vb-text)]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </PortfolioLayout>
    </>
  );
}
