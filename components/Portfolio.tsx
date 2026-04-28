"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, MapPin, Mail, Phone, Download, Star, Award, Code, Palette, Zap, Menu, X } from 'lucide-react';
import Image from 'next/image';

// Utility function for class names
function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: 'web' | 'mobile' | 'design' | 'other';
  featured?: boolean;
  liveUrl?: string;
  githubUrl?: string;
  year: string;
}

interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'design' | 'tools' | 'fullstack';
  icon?: React.ReactNode;
}

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
  location: string;
}

interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

interface PortfolioProps {
  name?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  projects?: Project[];
  skills?: Skill[];
  experience?: Experience[];
  contact?: ContactInfo;
  theme?: 'light' | 'dark';
}

// Spotlight Card Component
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'blue'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
      }
    };

    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, []);

  const glowColorMap = {
    blue: { base: 220, spread: 200 },
    purple: { base: 280, spread: 300 },
    green: { base: 120, spread: 200 },
    red: { base: 0, spread: 200 },
    orange: { base: 30, spread: 200 }
  };

  const { base, spread } = glowColorMap[glowColor];

  const getInlineStyles = () => ({
    '--base': base,
    '--spread': spread,
    '--radius': '14',
    '--border': '2',
    '--backdrop': 'hsl(0 0% 60% / 0.12)',
    '--backup-border': 'var(--backdrop)',
    '--size': '200',
    '--outer': '1',
    '--border-size': 'calc(var(--border, 2) * 1px)',
    '--spotlight-size': 'calc(var(--size, 150) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
    )`,
    backgroundColor: 'var(--backdrop, transparent)',
    backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
    backgroundPosition: '50% 50%',
    backgroundAttachment: 'fixed',
    border: 'var(--border-size) solid var(--backup-border)',
    position: 'relative' as const,
    touchAction: 'manipulation' as const,
  });

  const beforeAfterStyles = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-attachment: fixed;
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }
    
    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
      );
      filter: brightness(2);
    }
    
    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
      );
    }
    
    [data-glow] [data-glow] {
      position: absolute;
      inset: 0;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: calc(var(--radius) * 1px);
      border-width: calc(var(--border-size) * 20);
      filter: blur(calc(var(--border-size) * 10));
      background: none;
      pointer-events: none;
      border: none;
    }
    
    [data-glow] > [data-glow]::before {
      inset: -10px;
      border-width: 10px;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        data-glow
        style={getInlineStyles()}
        className={cn(
          'rounded-2xl relative grid shadow-[0_1rem_2rem_-1rem_black] p-6 backdrop-blur-[5px]',
          className
        )}
      >
        <div data-glow></div>
        {children}
      </div>
    </>
  );
};

// Project Card Component
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <SpotlightCard 
      className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      glowColor={project.featured ? 'purple' : 'blue'}
    >
      <div 
        className="relative overflow-hidden rounded-lg mb-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image 
          src={project.image} 
          alt={project.title}
          width={600} 
          height={400} 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <AnimatePresence>
          {isHovered && (
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', gap: '8px' }}>
              {project.liveUrl && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live
                  </a>
                </motion.div>
              )}
              {project.githubUrl && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium"
                  >
                    <Github className="w-4 h-4" />
                    Code
                  </a>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>

        {project.featured && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full text-yellow-400 text-xs font-medium">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <span className="text-xs text-muted-foreground">{project.year}</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-md">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
};

// Skill Card Component
const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'frontend': return 'text-blue-400';
      case 'backend': return 'text-green-400';
      case 'fullstack': return 'text-cyan-400';
      case 'design': return 'text-purple-400';
      case 'tools': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div ref={ref} className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 hover:bg-card/70 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        {skill.icon && (
          <div className={cn("w-8 h-8 flex items-center justify-center", getCategoryColor(skill.category))}>
            {skill.icon}
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{skill.name}</h4>
          <p className="text-xs text-muted-foreground capitalize">
            {skill.category === 'fullstack' ? 'Frontend & Backend' : skill.category}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Proficiency</span>
          <span className="text-foreground font-medium">{skill.level}%</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isVisible ? `${skill.level}%` : 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ height: '100%' }}
          >
            <div className={cn("h-full rounded-full", getCategoryColor(skill.category).replace('text-', 'bg-'))} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Main Portfolio Component
const Portfolio: React.FC<PortfolioProps> = ({
  name = "Basel Dayeh",
  title = "Front End Mobile Application Developer",
  bio = "Junior Mobile Developer bridging the gap between elegant UI/UX design and robust functionality. Proficient in Flutter, Firebase, and Figma. Looking to apply my Computer Science foundation and passion for usercentric development to deliver seamless digital experiences within a dynamic tech environment.",
  avatar = "/baseldayeh.jpg",
  projects = [],
  skills = [],
  experience = [],
  contact = {
    email: "baseldayeh@gmail.com",
    phone: "+962776664217",
    location: "Amman, Jordan",
    linkedin: "linkedin.com/in/basel-dayeh/",
    github: "github.com/baseldayeh",
    website: "baseldayeh.com"
  },
  theme = 'dark'
}) => {
  const [activeSection, setActiveSection] = useState('about');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = ['all', 'web', 'mobile', 'design', 'other'];
  
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const stats = [
    { label: 'Projects Completed', value: '4', icon: <Code className="w-5 h-5" /> },
    { label: 'Technologies & Tools', value: '25+', icon: <Zap className="w-5 h-5" /> },
    { label: 'Bootcamps & Internships', value: '2+', icon: <Award className="w-5 h-5" /> },
    { label: 'UI/UX Screens', value: '50+', icon: <Palette className="w-5 h-5" /> }
  ];

  return (
    <div className={cn("min-h-screen bg-background text-foreground", theme === 'dark' ? 'dark' : '')}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3">
                <Image 
                  src={avatar} 
                  alt={name}
                  width={40} 
                  height={40} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-border"
                />
                <div className="hidden sm:block">
                  <h1 className="font-bold text-foreground leading-tight">{name}</h1>
                  <p className="text-xs text-muted-foreground">{title}</p>
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {['about', 'projects', 'skills', 'experience', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={cn(
                    "text-sm font-medium transition-colors capitalize",
                    activeSection === section 
                      ? "text-blue-400" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {section}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="/BaselDayeh.pdf"
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Resume
                  </a>
                </motion.div>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="p-2 md:hidden text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="md:hidden border-t border-border bg-background">
                <div className="flex flex-col p-6 gap-4">
                  {['about', 'projects', 'skills', 'experience', 'contact'].map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        setActiveSection(section);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "text-lg font-medium transition-colors capitalize text-left",
                        activeSection === section 
                          ? "text-blue-400" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {section}
                    </button>
                  ))}
                  <div className="pt-4 border-t border-border">
                    <a
                      href="/BaselDayeh.pdf"
                      download
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="pt-20">
        {/* Hero Section */}
        {activeSection === 'about' && (
          <section className="min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                        Hi, I&apos;m{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                          {name.split(' ')[0]}
                        </span>
                      </h1>
                      <h2 className="text-xl md:text-2xl text-muted-foreground font-light">
                        {title}
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                        {bio}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => setActiveSection('projects')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors w-full"
                      >
                        View My Work
                      </button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => setActiveSection('contact')}
                        className="px-6 py-3 border border-border hover:bg-muted/50 text-foreground rounded-lg font-medium transition-colors w-full"
                      >
                        Get In Touch
                      </button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="relative">
                    <SpotlightCard className="p-8">
                      <Image 
                        src={avatar} 
                        alt={name}
                        width={400} 
                        height={400} 
                        className="w-full max-w-md mx-auto rounded-2xl object-cover"
                      />
                    </SpotlightCard>
                  </div>
                </motion.div>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center space-y-2">
                      <div className="flex items-center justify-center text-blue-400 mb-2">
                        {stat.icon}
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <section className="min-h-screen px-6 py-20">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Featured Projects
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Here are some of my recent projects that showcase my skills and experience.
                  </p>
                </div>
              </motion.div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Projects Grid */}
              <motion.div
                layout
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {filteredProjects.map((project) => (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProjectCard project={project} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <section className="min-h-screen px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Skills & Expertise
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Technologies and tools I work with to bring ideas to life.
                  </p>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SkillCard skill={skill} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {activeSection === 'experience' && (
          <section className="min-h-screen px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Work Experience
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    My professional journey and the companies I&apos;ve worked with.
                  </p>
                </div>
              </motion.div>

              <div className="space-y-8">
                {experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <SpotlightCard className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground">
                            {exp.position}
                          </h3>
                          <p className="text-blue-400 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{exp.duration}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {exp.location}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {exp.description}
                      </p>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <section className="min-h-screen px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Let&apos;s Work Together
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Have a project in mind? I&apos;d love to hear about it and discuss how we can bring your ideas to life.
                  </p>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <SpotlightCard className="p-6 h-full">
                    <h3 className="text-xl font-semibold text-foreground mb-6">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <span className="text-muted-foreground">{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-blue-400" />
                          <span className="text-muted-foreground">{contact.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-blue-400" />
                        <span className="text-muted-foreground">{contact.location}</span>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="font-medium text-foreground mb-4">Find me online</h4>
                      <div className="flex gap-4">
                        {contact.github && (
                          <a 
                            href={`https://${contact.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                          >
                            <Github className="w-5 h-5 text-muted-foreground" />
                          </a>
                        )}
                        {contact.linkedin && (
                          <a 
                            href={`https://${contact.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-5 h-5 text-muted-foreground" />
                          </a>
                        )}
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <SpotlightCard className="p-6 h-full">
                    <h3 className="text-xl font-semibold text-foreground mb-6">
                      Send a Message
                    </h3>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const name = formData.get('name');
                        const email = formData.get('email');
                        const message = formData.get('message');
                        window.location.href = `mailto:baseldayeh@gmail.com?subject=Portfolio Message from ${name}&body=From: ${name} (${email})%0D%0A%0D%0A${message}`;
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Name
                        </label>
                        <input
                          name="name"
                          type="text"
                          required
                          className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <input
                          name="email"
                          type="email"
                          required
                          className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Message
                        </label>
                        <textarea
                          name="message"
                          rows={4}
                          required
                          className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground resize-none"
                          placeholder="Tell me about your project..."
                        />
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          type="submit"
                          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Send Message
                        </button>
                      </motion.div>
                    </form>
                  </SpotlightCard>
                </motion.div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// Default data for demo
const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'Pro Order | Mobile Ordering System',
    description: 'A cross-platform mobile application designed to streamline the customer experience. This pre-order app allows users to browse menus, customize their orders, and pay in advance, effectively eliminating wait times.',
    image: '/proOrder.png',
    tags: ['Flutter', 'Dart', 'Firebase', 'Mobile'],
    category: 'mobile',
    featured: true,
    githubUrl: 'https://github.com/baseldayeh/pro_order',
    year: '2026'
  },
  {
    id: '2',
    title: 'Dashboard Admin | Pro Order Management',
    description: 'Built an admin dashboard to streamline product and order management. Integrated real-time sync between the mobile app and dashboard for efficient inventory control and order processing.',
    image: '/proOrder.png',
    tags: ['Flutter', 'Firebase', 'Real-time Sync', 'Admin'],
    category: 'mobile',
    featured: true,
    githubUrl: 'https://github.com/baseldayeh/dashboard_admin',
    year: '2026'
  },
  {
    id: '3',
    title: 'JU-Scooter | Campus Electric Scooter Rental App',
    description: 'Developed a mobile app enabling students to easily locate and rent campus electric scooters. Designed high-fidelity UI prototypes in Figma and built a responsive frontend architecture using Flutter.',
    image: '/app_icon.png',
    tags: ['Flutter', 'Figma', 'Mobile Development', 'UI/UX'],
    category: 'mobile',
    featured: true,
    githubUrl: 'https://github.com/baseldayeh/ju-scooter',
    year: '2025'
  },
  {
    id: '4',
    title: 'Modern Mobile UI/UX Design | Figma Showcase',
    description: 'Complete Figma UI/UX design project for a modern mobile application. This curated showcase features extensive screen layouts and user flows, interactive high-fidelity prototypes, comprehensive iconography sets, and cohesive component libraries, highlighting a user-centric design approach.',
    image: '/app_icon.png',
    tags: ['Figma', 'UI/UX', 'Prototyping', 'Design System'],
    category: 'design',
    featured: true,
    liveUrl: 'https://www.figma.com/design/kCxY95qLjB9Dlq4g7WT1Wa/project?node-id=703-3826&p=f&t=fomF5Ai7GErNxCbS-0',
    year: '2025'
  }
];

const defaultSkills: Skill[] = [
  { name: 'C++', level: 85, category: 'backend', icon: <Zap className="w-5 h-5" /> },
  { name: 'Flutter', level: 85, category: 'frontend', icon: <Code className="w-5 h-5" /> },
  { name: 'Firebase', level: 80, category: 'backend', icon: <Zap className="w-5 h-5" /> },
  { name: 'HTML5', level: 98, category: 'frontend', icon: <Code className="w-5 h-5" /> },
  { name: 'CSS', level: 90, category: 'frontend', icon: <Code className="w-5 h-5" /> },
  { name: 'JavaScript', level: 85, category: 'fullstack', icon: <Code className="w-5 h-5" /> },
  { name: 'Figma', level: 92, category: 'design', icon: <Palette className="w-5 h-5" /> },
  { name: 'Dart', level: 87, category: 'fullstack', icon: <Code className="w-5 h-5" /> },
  { name: 'Git', level: 90, category: 'tools', icon: <Code className="w-5 h-5" /> }
];

const defaultExperience: Experience[] = [
  {
    company: 'Dot Jordan',
    position: 'Flutter Development Intern',
    duration: 'Dec 2025 – Apr 2026',
    description: 'Developed scalable mobile applications utilizing Flutter, Dart, Firebase, and REST API integrations. Streamlined application deployment by implementing CI/CD pipelines for automated delivery.',
    location: 'Amman, Jordan'
  },
  {
    company: 'Classera',
    position: 'Front-end Web Development Intern',
    duration: 'Apr 2025 – Jul 2025',
    description: 'Developed a responsive Admin Dashboard using HTML, CSS, and Js for data management. Built clean and efficient front-end interfaces for internal web-based management systems.',
    location: 'Amman, Jordan'
  }
];

export default function PortfolioDemo() {
  return (
    <Portfolio
      name="Basel Dayeh"
      title="Front End Mobile Application Developer"
      bio="Junior Mobile Developer bridging the gap between elegant UI/UX design and robust functionality. Proficient in Flutter, Firebase, and Figma. Looking to apply my Computer Science foundation and passion for usercentric development to deliver seamless digital experiences within a dynamic tech environment."
      avatar="/baseldayeh.jpg"
      projects={defaultProjects}
      skills={defaultSkills}
      experience={defaultExperience}
      contact={{
        email: "baseldayeh@gmail.com",
        phone: "+962776664217",
        location: "Amman, Jordan",
        linkedin: "linkedin.com/in/basel-dayeh/",
        github: "github.com/baseldayeh",
        website: "baseldayeh.com"
      }}
      theme="dark"
    />
  );
}
