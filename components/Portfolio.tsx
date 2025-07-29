"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Calendar, MapPin, Mail, Phone, Download, Star, Users, Award, Code, Palette, Zap } from 'lucide-react';

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
  category: 'frontend' | 'backend' | 'design' | 'tools';
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
    touchAction: 'none' as const,
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
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-4 flex gap-2"
            >
              {project.liveUrl && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live
                </motion.button>
              )}
              {project.githubUrl && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium"
                >
                  <Github className="w-4 h-4" />
                  Code
                </motion.button>
              )}
            </motion.div>
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
          <p className="text-xs text-muted-foreground capitalize">{skill.category}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Proficiency</span>
          <span className="text-foreground font-medium">{skill.level}%</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2">
          <motion.div
            className={cn("h-2 rounded-full", getCategoryColor(skill.category).replace('text-', 'bg-'))}
            initial={{ width: 0 }}
            animate={{ width: isVisible ? `${skill.level}%` : 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
};

// Main Portfolio Component
const Portfolio: React.FC<PortfolioProps> = ({
  name = "John Doe",
  title = "Full Stack Developer",
  bio = "Passionate developer with 5+ years of experience creating beautiful and functional web applications. I love turning complex problems into simple, elegant solutions.",
  avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  projects = [],
  skills = [],
  experience = [],
  contact = {
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    website: "johndoe.dev"
  },
  theme = 'dark'
}) => {
  const [activeSection, setActiveSection] = useState('about');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'web', 'mobile', 'design', 'other'];
  
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const stats = [
    { label: 'Projects Completed', value: projects.length.toString(), icon: <Code className="w-5 h-5" /> },
    { label: 'Years Experience', value: '5+', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Happy Clients', value: '50+', icon: <Users className="w-5 h-5" /> },
    { label: 'Awards Won', value: '12', icon: <Award className="w-5 h-5" /> }
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
              className="flex items-center gap-3"
            >
              <img 
                src={avatar} 
                alt={name}
                className="w-10 h-10 rounded-full object-cover border-2 border-border"
              />
              <div>
                <h1 className="font-bold text-foreground">{name}</h1>
                <p className="text-sm text-muted-foreground">{title}</p>
              </div>
            </motion.div>

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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Resume
            </motion.button>
          </div>
        </div>
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
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                      Hi, Im{' '}
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
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveSection('projects')}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      View My Work
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveSection('contact')}
                      className="px-6 py-3 border border-border hover:bg-muted/50 text-foreground rounded-lg font-medium transition-colors"
                    >
                      Get In Touch
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative"
                >
                  <SpotlightCard className="p-8">
                    <img 
                      src={avatar} 
                      alt={name}
                      className="w-full max-w-md mx-auto rounded-2xl object-cover"
                    />
                  </SpotlightCard>
                </motion.div>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
              >
                {stats.map((stat, index) => (
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
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Featured Projects
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Here are some of my recent projects that showcase my skills and experience.
                </p>
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
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
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
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Skills & Expertise
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Technologies and tools I work with to bring ideas to life.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
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
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Work Experience
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  My professional journey and the companies Ive worked with.
                </p>
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
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Lets Work Together
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Have a project in mind? Id love to hear about it and discuss how we can bring your ideas to life.
                </p>
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
                            className="p-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                          >
                            <Github className="w-5 h-5 text-muted-foreground" />
                          </a>
                        )}
                        {contact.linkedin && (
                          <a 
                            href={`https://${contact.linkedin}`}
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
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Message
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground resize-none"
                          placeholder="Tell me about your project..."
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Send Message
                      </motion.button>
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
    title: 'E-commerce Platform',
    description: 'A modern e-commerce platform built with Next.js, featuring real-time inventory management, payment processing, and admin dashboard.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    tags: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
    category: 'web',
    featured: true,
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    year: '2024'
  },
  {
    id: '2',
    title: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication, transaction history, and budget tracking features.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
    tags: ['React Native', 'Node.js', 'MongoDB'],
    category: 'mobile',
    liveUrl: 'https://example.com',
    year: '2024'
  },
  {
    id: '3',
    title: 'Brand Identity Design',
    description: 'Complete brand identity design for a tech startup, including logo, color palette, typography, and brand guidelines.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    tags: ['Figma', 'Illustrator', 'Branding'],
    category: 'design',
    year: '2023'
  },
  {
    id: '4',
    title: 'Task Management Dashboard',
    description: 'Collaborative task management dashboard with real-time updates, team collaboration, and project tracking.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    tags: ['React', 'Socket.io', 'Express'],
    category: 'web',
    githubUrl: 'https://github.com',
    year: '2023'
  },
  {
    id: '5',
    title: 'AI Content Generator',
    description: 'AI-powered content generation tool that helps marketers create engaging copy for social media and blogs.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    tags: ['Python', 'OpenAI', 'FastAPI'],
    category: 'other',
    featured: true,
    liveUrl: 'https://example.com',
    year: '2024'
  },
  {
    id: '6',
    title: 'Fitness Tracking App',
    description: 'Cross-platform fitness app with workout tracking, nutrition logging, and social features for motivation.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    tags: ['Flutter', 'Firebase', 'Dart'],
    category: 'mobile',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    year: '2023'
  }
];

const defaultSkills: Skill[] = [
  { name: 'React', level: 95, category: 'frontend', icon: <Code className="w-5 h-5" /> },
  { name: 'TypeScript', level: 90, category: 'frontend', icon: <Code className="w-5 h-5" /> },
  { name: 'Next.js', level: 88, category: 'frontend', icon: <Code className="w-5 h-5" /> },
  { name: 'Node.js', level: 85, category: 'backend', icon: <Zap className="w-5 h-5" /> },
  { name: 'Python', level: 80, category: 'backend', icon: <Zap className="w-5 h-5" /> },
  { name: 'PostgreSQL', level: 75, category: 'backend', icon: <Zap className="w-5 h-5" /> },
  { name: 'Figma', level: 92, category: 'design', icon: <Palette className="w-5 h-5" /> },
  { name: 'Adobe Creative Suite', level: 85, category: 'design', icon: <Palette className="w-5 h-5" /> },
  { name: 'Git', level: 90, category: 'tools', icon: <Code className="w-5 h-5" /> }
];

const defaultExperience: Experience[] = [
  {
    company: 'TechCorp Inc.',
    position: 'Senior Full Stack Developer',
    duration: '2022 - Present',
    description: 'Lead development of enterprise web applications using React, Node.js, and cloud technologies. Mentored junior developers and collaborated with cross-functional teams to deliver high-quality software solutions.',
    location: 'San Francisco, CA'
  },
  {
    company: 'StartupXYZ',
    position: 'Frontend Developer',
    duration: '2020 - 2022',
    description: 'Developed responsive web applications and mobile apps using React and React Native. Worked closely with designers to implement pixel-perfect UI components and improved application performance by 40%.',
    location: 'Remote'
  },
  {
    company: 'Digital Agency',
    position: 'Web Developer',
    duration: '2019 - 2020',
    description: 'Built custom websites and web applications for various clients. Specialized in WordPress development, custom PHP solutions, and modern JavaScript frameworks.',
    location: 'New York, NY'
  }
];

export default function PortfolioDemo() {
  return (
    <Portfolio
      name="Alex Johnson"
      title="Full Stack Developer & UI/UX Designer"
      bio="I'm a passionate developer with 5+ years of experience creating beautiful and functional digital experiences. I specialize in modern web technologies and love turning complex problems into simple, elegant solutions."
      avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
      projects={defaultProjects}
      skills={defaultSkills}
      experience={defaultExperience}
      contact={{
        email: "alex@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/alexjohnson",
        github: "github.com/alexjohnson",
        website: "alexjohnson.dev"
      }}
      theme="dark"
    />
  );
}
