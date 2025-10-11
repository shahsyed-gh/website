import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import calendarIcon from '@/assets/icons/calendar.png';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

// Extend window type for ZCal
declare global {
  interface Window {
    ZCal?: {
      reload: () => void;
    };
  }
}

// --- TYPE DEFINITIONS FOR PROPS ---
interface NavLink { label: string; href: string; }
interface SocialLink { icon: React.ReactNode; href: string; }
interface StatusInfo { availability: string; localTime: string; city: string; }
interface WorkExperience { 
  company: string; 
  position: string; 
  duration: string; 
  location: string; 
  description: string;
  icon: React.ReactNode;
}
interface Project {
  title: string;
  category: string;
  challenge: string;
  approach: string;
  result: string;
  imageUrl?: string;
  videoUrl?: string;
}
interface Company {
  name: string;
  logo: React.ReactNode;
}

export interface LocalPortfolioProps {
  logo?: { initials: React.ReactNode; name: React.ReactNode; };
  statusInfo?: StatusInfo;
  socialLinks?: SocialLink[];
  navLinks?: NavLink[];
  hero?: { 
    title: React.ReactNode; 
    subtitle: React.ReactNode; 
    description: React.ReactNode;
    imageUrl?: string;
  };
  ctaButton?: { label: string; onClick?: () => void; };
  workExperience?: WorkExperience[];
  projects?: Project[];
  companies?: Company[];
  showAnimatedBackground?: boolean;
}

// --- INTERNAL ANIMATED BACKGROUND COMPONENT ---
const AuroraBackground: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '0';
        renderer.domElement.style.display = 'block';
        currentMount.appendChild(renderer.domElement);
        const material = new THREE.ShaderMaterial({
            uniforms: { iTime: { value: 0 }, iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) } },
            vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
            fragmentShader: `
                uniform float iTime; uniform vec2 iResolution;
                #define NUM_OCTAVES 3
                float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
                float noise(vec2 p){ vec2 ip=floor(p);vec2 u=fract(p);u=u*u*(3.0-2.0*u);float res=mix(mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);return res*res; }
                float fbm(vec2 x) { float v=0.0;float a=0.3;vec2 shift=vec2(100);mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.50));for(int i=0;i<NUM_OCTAVES;++i){v+=a*noise(x);x=rot*x*2.0+shift;a*=0.4;}return v;}
                void main() {
                    vec2 p=((gl_FragCoord.xy)-iResolution.xy*0.5)/iResolution.y*mat2(6.,-4.,4.,6.);vec4 o=vec4(0.);float f=2.+fbm(p+vec2(iTime*5.,0.))*.5;
                    for(float i=0.;i++<35.;){vec2 v=p+cos(i*i+(iTime+p.x*.08)*.025+i*vec2(13.,11.))*3.5;float tailNoise=fbm(v+vec2(iTime*.5,i))*.3*(1.-(i/35.));vec4 auroraColors=vec4(.1+.3*sin(i*.2+iTime*.4),.3+.5*cos(i*.3+iTime*.5),.7+.3*sin(i*.4+iTime*.3),1.);vec4 currentContribution=auroraColors*exp(sin(i*i+iTime*.8))/length(max(v,vec2(v.x*f*.015,v.y*1.5)));float thinnessFactor=smoothstep(0.,1.,i/35.)*.6;o+=currentContribution*(1.+tailNoise*.8)*thinnessFactor;}
                    o=tanh(pow(o/100.,vec4(1.6)));gl_FragColor=o*1.5;
                }`
        });
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        let animationFrameId: number;
        const animate = () => { animationFrameId = requestAnimationFrame(animate); material.uniforms.iTime.value += 0.016; renderer.render(scene, camera); };
        const handleResize = () => { renderer.setSize(window.innerWidth, window.innerHeight); material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight); };
        window.addEventListener('resize', handleResize);
        animate();
        return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', handleResize); if (currentMount.contains(renderer.domElement)) currentMount.removeChild(renderer.domElement); renderer.dispose(); material.dispose(); geometry.dispose(); };
    }, []);
    return <div ref={mountRef} />;
};

// --- HOOK FOR LOCAL TIME ---
function useLocalTime(timeZone: string) {
  const [localTime, setLocalTime] = useState('');
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      setLocalTime(
        new Intl.DateTimeFormat('en-US', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone
        }).format(now)
      );
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);
  return localTime;
}

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// --- DEFAULT DATA ---
const defaultData = {
  logo: { initials: 'SS', name: '' },
  statusInfo: { availability: 'Available for hire', localTime: '', city: 'Columbus, OH' },
  socialLinks: [
    { icon: '📧', href: 'mailto:shah@shahsyed.com' },
  ],
  navLinks: [{ label: 'Shah Syed', href: '#about' }],
  hero: {
    title: '',
    subtitle: '',
    description: "",
    imageUrl: ''
  },
  ctaButton: { label: 'Schedule a Call', onClick: undefined },
  workExperience: [],
  projects: [],
  companies: []
};

// --- SCROLL OBSERVER COMPONENT ---
const ScrollObserver: React.FC<{ children: React.ReactNode; variants?: object; className?: string }> = ({ 
  children, 
  variants = fadeInUp, 
  className = "" 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- MAIN CUSTOMIZABLE PORTFOLIO COMPONENT ---
const LocalPortfolio: React.FC<LocalPortfolioProps> = ({
  logo = defaultData.logo,
  statusInfo = defaultData.statusInfo,
  socialLinks = defaultData.socialLinks,
  navLinks = defaultData.navLinks,
  hero = defaultData.hero,
  ctaButton = defaultData.ctaButton,
  workExperience = defaultData.workExperience,
  projects = defaultData.projects,
  companies = defaultData.companies,
  showAnimatedBackground = false,
}) => {
  const { theme, setTheme } = useTheme();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isShahSyedDomain, setIsShahSyedDomain] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  
  // --- DYNAMIC LOCAL TIME ---
  const localTime = useLocalTime('America/New_York');

  // --- FOOTER VISIBILITY DETECTION ---
  const footerRef = useRef<HTMLElement>(null);
  const isFooterInView = useInView(footerRef, { threshold: 0.1 });

  // --- DOMAIN DETECTION ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsShahSyedDomain(window.location.hostname === 'shahsyed.com' || window.location.hostname === 'www.shahsyed.com');
    }
  }, []);

  // --- HEADER VISIBILITY BASED ON FOOTER ---
  useEffect(() => {
    setIsHeaderVisible(!isFooterInView);
  }, [isFooterInView]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const openCalendar = () => {
    setIsCalendarOpen(true);
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
    
    // Clean up zcal script and widget when modal closes
    setTimeout(() => {
      const existingScript = document.querySelector('script[src="https://static.zcal.co/embed/v1/embed.js"]');
      if (existingScript) {
        existingScript.remove();
      }
      // Reset window.ZCal
      if (window.ZCal) {
        delete window.ZCal;
      }
    }, 100);
  };

  // Load zcal script when modal opens
  useEffect(() => {
    if (isCalendarOpen) {
      setTimeout(() => {
        // Clean up any existing widget content first
        const widget = document.querySelector('.zcal-inline-widget');
        if (widget) {
          widget.innerHTML = '<a href="https://zcal.co/i/isDyAOcm">30 Minute Meeting - Schedule a meeting</a>';
        }
        
        // Remove existing script if present
        const existingScript = document.querySelector('script[src="https://static.zcal.co/embed/v1/embed.js"]');
        if (existingScript) {
          existingScript.remove();
        }
        
        // Create fresh script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://static.zcal.co/embed/v1/embed.js';
        document.head.appendChild(script);
      }, 100);
    }
  }, [isCalendarOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showAnimatedBackground && <AuroraBackground />}
      <div className="relative">
        {/* Header with Status and Social Links */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: isHeaderVisible ? 0 : -100, 
            opacity: isHeaderVisible ? 1 : 0 
          }}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="sticky top-0 z-50 w-full px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border"
        >
          <div className="max-w-7xl mx-auto">
            {/* Mobile Layout - Stacked and Centered */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center space-y-4 md:hidden"
            >
              <div className="flex items-center justify-between w-full">
                <motion.div variants={fadeInUp} className="flex items-center space-x-2">
                  <motion.button 
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <img 
                      src="/logo.svg" 
                      alt="PM Logo" 
                      className="w-full h-full object-cover dark:grayscale dark:hover:grayscale-0 transition-all duration-300"
                    />
                  </motion.button>
                  <span className="text-lg font-medium">{logo.name}</span>
                </motion.div>
                <motion.div variants={fadeInUp} className="flex items-center space-x-1">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                  <span className="text-sm font-medium text-foreground">Available</span>
                </motion.div>
              </div>
              
              <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
                {socialLinks.map((link, index) => (
                  <motion.a 
                    key={index} 
                    href={link.href}
                    whileTap={{ scale: 0.95 }}
                    className="w-[42px] h-[42px] bg-gray-400 dark:bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 dark:hover:bg-gray-500 hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <span className="text-sm">{link.icon}</span>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Desktop Layout - Original */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="hidden md:flex justify-between items-center"
            >
              <motion.div variants={slideInLeft} className="flex items-center space-x-2">
                <motion.button 
                  onClick={toggleTheme}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <img 
                    src="/logo.svg" 
                    alt="PM Logo" 
                    className="w-full h-full object-cover dark:grayscale dark:hover:grayscale-0 transition-all duration-300"
                  />
                </motion.button>
                <span className="text-lg font-medium">{logo.name}</span>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="flex items-center space-x-8 text-sm">
                {!isShahSyedDomain && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">AVAILABILITY</span>
                    <div className="flex items-center space-x-1">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-2 h-2 bg-green-500 rounded-full"
                      />
                      <span className="font-medium text-foreground">{statusInfo.availability}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">LOCAL TIME</span>
                  <span className="font-medium text-foreground w-24 text-center">{localTime}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">CITY</span>
                  <span className="font-medium text-foreground">{statusInfo.city}</span>
                </div>
              </motion.div>

              <motion.div variants={slideInRight} className="flex items-center space-x-4">
                {socialLinks.map((link, index) => (
                  <motion.a 
                    key={index} 
                    href={link.href}
                    whileTap={{ scale: 0.95 }}
                    className="w-[42px] h-[42px] bg-gray-400 dark:bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 dark:hover:bg-gray-500 hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <span className="text-sm">{link.icon}</span>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.header>

        {/* Navigation */}
        <motion.nav 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="w-full px-6 py-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center">
              {navLinks.map((link, index) => (
                <motion.a 
                  key={link.label} 
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                  whileHover={{ y: -2 }}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <main className="w-full px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mb-16"
            >
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
                {/* Text Content */}
                <motion.div 
                  variants={slideInLeft}
                  className="text-center xl:text-left"
                >
                  <motion.h1 
                    variants={fadeInUp}
                    className="text-6xl md:text-8xl lg:text-9xl xl:text-7xl font-bold leading-[0.9] mb-8 tracking-tight"
                  >
                    {hero.title}
                    <br />
                    <span className="text-muted-foreground">{hero.subtitle}</span>
                    <motion.span 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.2, duration: 0.8, type: "spring", bounce: 0.6 }}
                      className="text-orange-500"
                    >
                      .
                    </motion.span>
                  </motion.h1>
                </motion.div>
                
                {/* Profile Image */}
                {hero.imageUrl && (
                  <motion.div 
                    variants={slideInRight}
                    className="flex justify-center xl:justify-end"
                  >
                    <div className="flex flex-col items-center space-y-8">
                      <motion.div 
                        variants={fadeInScale}
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        {...floatingAnimation}
                        className="w-80 h-80 xl:w-96 xl:h-96 overflow-hidden rounded-full group cursor-pointer"
                      >
                        <img 
                          src={hero.imageUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                        />
                      </motion.div>
                      <motion.button 
                        onClick={openCalendar}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-foreground text-background px-8 py-4 rounded-full font-medium hover:bg-foreground/90 transition-colors inline-flex items-center space-x-2"
                      >
                        <motion.img 
                          src={calendarIcon} 
                          alt="Calendar" 
                          className="w-5 h-5 invert dark:invert-0"
                          animate={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        />
                        <span>{ctaButton.label}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>

              <motion.p 
                variants={fadeInUp}
                className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-4xl mx-auto mt-16"
              >
                {hero.description}
              </motion.p>
            </motion.div>

            {/* Current Projects Section */}
            <ScrollObserver variants={fadeInUp} className="mb-20 pt-20 border-t border-border">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Here are
                <br />
                my <span className="text-muted-foreground">current</span>
                <br />
                projects<motion.span 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring", bounce: 0.6 }}
                  className="text-orange-500"
                >
                  .
                </motion.span>
              </h2>
            </ScrollObserver>

            {/* Projects Section with Timeline */}
            {projects && projects.length > 0 && (
              <div className="mb-20 relative">
                {/* Timeline Line - Hidden on mobile, visible on lg+ */}
                <motion.div 
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                  style={{ originY: 0 }}
                  className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-border h-full"
                />
                
                {projects.map((project, index) => {
                  const isEven = index % 2 === 0;
                  
                  const TimelineDot = (
                    <motion.div 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.8 + index * 0.2, duration: 0.6, type: "spring", bounce: 0.6 }}
                      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-background border-4 border-orange-500 rounded-full shadow-lg z-10"
                      style={{ marginLeft: '-11px' }}
                    />
                  );

                  // Helper function to convert YouTube URLs to embeddable format
                  const getEmbedUrl = (url: string) => {
                    // Handle YouTube clip URLs
                    if (url.includes('youtube.com/clip/')) {
                      const clipId = url.split('/').pop();
                      return `https://www.youtube.com/embed/${clipId}`;
                    }
                    // Handle regular YouTube URLs
                    if (url.includes('youtube.com/watch?v=')) {
                      const videoId = url.split('v=')[1]?.split('&')[0];
                      return `https://www.youtube.com/embed/${videoId}`;
                    }
                    // Handle youtu.be URLs
                    if (url.includes('youtu.be/')) {
                      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
                      return `https://www.youtube.com/embed/${videoId}`;
                    }
                    // Return original URL if no conversion needed
                    return url;
                  };

                  const ImageColumn = (
                    <div className="relative">
                      {project.videoUrl ? (
                        <div className="w-full aspect-[16/9] bg-muted rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <iframe
                            src={getEmbedUrl(project.videoUrl)}
                            title="YouTube video player"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          />
                        </div>
                      ) : project.imageUrl ? (
                        <div className="w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <img 
                            src={project.imageUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                      ) : null}
                    </div>
                  );

                  const DetailsColumn = (
                    <div className="space-y-6 p-8 bg-background/50 backdrop-blur-sm rounded-lg border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-orange-500/20 relative overflow-hidden">
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10">
                        <div>
                          <h2 className="text-4xl md:text-5xl font-bold mb-2 text-foreground">
                              <span className="text-muted-foreground">{project.title}</span>
                              <span className="text-orange-500">.</span>
                          </h2>
                          <p className="text-orange-500 text-lg font-medium">{project.category}</p>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-bold mb-3 text-foreground flex items-center gap-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                              Challenge
                            </h3>
                            <p className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-orange-500/20">
                              {project.challenge}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-xl font-bold mb-3 text-foreground flex items-center gap-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                              Customer Obsessed Approach
                            </h3>
                            <p className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-orange-500/20">
                              {project.approach}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-xl font-bold mb-3 text-foreground flex items-center gap-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                              Result
                            </h3>
                            <p className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-orange-500/20">
                              {project.result}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );

                  return (
                    <ScrollObserver 
                      key={index} 
                      variants={staggerContainer}
                      className="mb-20 relative"
                    >
                      {/* Timeline dot - only show on lg+ screens */}
                      <div className="hidden lg:block">
                        {TimelineDot}
                      </div>
                      
                      <motion.div 
                        variants={staggerContainer}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12 lg:mb-0"
                      >
                        {isEven ? (
                          <>
                            <motion.div 
                              variants={slideInLeft}
                              className={`${isEven ? 'lg:pr-16' : 'lg:pl-16'}`}
                            >
                              {ImageColumn}
                            </motion.div>
                            <motion.div 
                              variants={slideInRight}
                              className={`${isEven ? 'lg:pl-16' : 'lg:pr-16'}`}
                            >
                              {DetailsColumn}
                            </motion.div>
                          </>
                        ) : (
                          <>
                            <motion.div 
                              variants={slideInRight}
                              className={`${isEven ? 'lg:pr-16' : 'lg:pl-16'} lg:order-2`}
                            >
                              {ImageColumn}
                            </motion.div>
                            <motion.div 
                              variants={slideInLeft}
                              className={`${isEven ? 'lg:pl-16' : 'lg:pr-16'} lg:order-1`}
                            >
                              {DetailsColumn}
                            </motion.div>
                          </>
                        )}
                      </motion.div>
                    </ScrollObserver>
                  );
                })}
              </div>
            )}

              {/* Work Experience Section */}
              {workExperience && workExperience.length > 0 && (
                <ScrollObserver 
                  variants={staggerContainer}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 pt-20 border-t border-border"
                >
                  {/* Left Column - Heading and Description */}
                  <motion.div variants={slideInLeft}>
                    <h2 className="text-5xl md:text-6xl font-bold mb-8 text-foreground">Work
                      <span className="text-muted-foreground"> Experience</span>
                      <motion.span 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, duration: 0.8, type: "spring", bounce: 0.6 }}
                        className="text-orange-500"
                      >
                        .
                      </motion.span>
                    </h2>
                  </motion.div>

                  {/* Right Column - Experience Entries with Timeline */}
                  <motion.div variants={slideInRight} className="relative space-y-12">
                    {/* Timeline Line - Hidden on mobile, visible on sm+ */}
                    <div className="hidden sm:block absolute left-5 top-5 bottom-0 w-0.5 bg-border"></div>

                    {workExperience.map((experience, index) => (
                      <motion.div 
                        key={index} 
                        variants={fadeInUp}
                        className="relative"
                      >
                        <div className="flex items-start space-x-6">
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            className="flex-shrink-0 relative z-20 flex items-center mt-4"
                          >
                            {experience.icon}
                          </motion.div>
                          <motion.div 
                            whileHover={{ y: -2 }}
                            className="flex-grow bg-background/50 backdrop-blur-sm rounded-lg border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-orange-500/20 p-6 relative overflow-hidden"
                          >
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative z-10">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                                <h3 className="text-xl font-bold text-foreground">
                                  {experience.company}
                                  <span className="text-muted-foreground block text-lg font-semibold mt-1">{experience.position}</span>
                                </h3>
                              </div>

                              <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                  </svg>
                                  <span>{experience.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                                    <path d="M8 2v4"></path>
                                    <path d="M16 2v4"></path>
                                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                    <path d="M3 10h18"></path>
                                  </svg>
                                  <span>{experience.duration}</span>
                                </div>
                              </div>

                              <p className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-orange-500/20">
                                {experience.description}
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </ScrollObserver>
              )}

            {/* Previously Worked At Section */}
            {companies && companies.length > 0 && (
              <ScrollObserver
                variants={staggerContainer}
                className="mb-20 pt-20 border-t border-border"
              >
                <div className="text-center mb-16">
                  <motion.h2
                    variants={fadeInUp}
                    className="text-5xl md:text-6xl font-bold mb-16 text-foreground"
                  >
                    Previously <span className="text-muted-foreground">Worked At</span>
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5, duration: 0.8, type: "spring", bounce: 0.6 }}
                      className="text-orange-500"
                    >
                      .
                    </motion.span>
                  </motion.h2>

                  <motion.div
                    variants={staggerContainer}
                    className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center max-w-5xl mx-auto"
                  >
                    {companies.map((company, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInScale}
                        whileHover={{ scale: 1.1, y: -5 }}
                        className="flex items-center justify-center p-4"
                      >
                        {company.logo}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </ScrollObserver>
            )}
              <div className="mb-20 pt-20 border-t border-border"></div>
          </div>

          {/* Footer */}
          <footer ref={footerRef} className="w-full px-6 py-12 bg-background text-foreground">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16">
                <div className="mb-8 lg:mb-0">
                  <h2 className="text-5xl md:text-6xl font-bold mb-4">
                    Let's work <span className="text-muted-foreground">together</span>
                    <span className="text-orange-500">.</span>
                  </h2>
                </div>
                
                <div className="flex items-center">
                  <a href="mailto:shah@shahsyed.com" className="group bg-foreground text-background px-8 py-4 rounded-full font-medium hover:bg-foreground/90 transition-colors inline-flex items-center space-x-2">
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </a>
                </div>
              </div>

              <div className="border-t border-border pt-8">
                {/* Mobile Layout - Stacked and Centered */}
                <div className="flex flex-col items-center space-y-4 md:hidden text-sm text-muted-foreground">
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
                    <div className="text-center">
                      <span className="uppercase tracking-wide block">VERSION</span>
                      <div className="font-medium text-foreground">© 2025 Shah Syed. All rights reserved.</div>
                    </div>
                    <div className="text-center">
                      <span className="uppercase tracking-wide block">LOCAL TIME</span>
                      <div className="font-medium text-foreground">{localTime}</div>
                    </div>
                    <div className="text-center">
                      <span className="uppercase tracking-wide block">CITY</span>
                      <div className="font-medium text-foreground">{statusInfo.city}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {socialLinks.map((link, index) => (
                      <a key={index} href={link.href} className="w-[42px] h-[42px] bg-gray-400 dark:bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 dark:hover:bg-gray-500 hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 group">
                        <span className="text-sm">{link.icon}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Desktop Layout - Original */}
                <div className="hidden md:flex flex-col lg:flex-row justify-between items-start lg:items-center text-sm text-muted-foreground">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 mb-8 lg:mb-0">
                    <div className="mb-4 lg:mb-0">
                      <span className="text-xs uppercase tracking-wide">VERSION</span>
                      <div className="font-medium text-foreground">© 2025 Shah Syed. All rights reserved.</div>
                    </div>
                    <div className="mb-4 lg:mb-0">
                      <span className="text-xs uppercase tracking-wide">LOCAL TIME</span>
                      <div className="font-medium text-foreground w-24">{localTime}</div>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wide">CITY</span>
                      <div className="font-medium text-foreground">{statusInfo.city}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {socialLinks.map((link, index) => (
                      <a key={index} href={link.href} className="w-[42px] h-[42px] bg-gray-400 dark:bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 dark:hover:bg-gray-500 hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 group">
                        <span className="text-sm">{link.icon}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Calendar Modal */}
      <Dialog open={isCalendarOpen} onOpenChange={(open) => {
        if (!open) {
          closeCalendar();
        }
      }}>
        <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule a Meeting</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="zcal-inline-widget">
              <a href="https://zcal.co/i/isDyAOcm">30 Minute Meeting - Schedule a meeting</a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { LocalPortfolio };