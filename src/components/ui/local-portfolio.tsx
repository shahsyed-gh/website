import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import calendarIcon from '@/assets/icons/calendar.png';

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
  
  // --- DYNAMIC LOCAL TIME ---
  const localTime = useLocalTime('America/New_York');

  // --- DOMAIN DETECTION ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsShahSyedDomain(window.location.hostname === 'shahsyed.com');
    }
  }, []);

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
        <header className="sticky top-0 z-50 w-full px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Layout - Stacked and Centered */}
            <div className="flex flex-col items-center space-y-4 md:hidden">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={toggleTheme}
                    className="w-8 h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <img 
                      src="/logo.svg" 
                      alt="PM Logo" 
                      className="w-full h-full object-cover dark:grayscale dark:hover:grayscale-0 transition-all duration-300"
                    />
                  </button>
                  <span className="text-lg font-medium">{logo.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">Available</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                {socialLinks.map((link, index) => (
                  <a key={index} href={link.href} className="w-8 h-8 bg-gray-400 dark:bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 dark:hover:bg-gray-500 transition-colors">
                    <span className="text-sm">{link.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Desktop Layout - Original */}
            <div className="hidden md:flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleTheme}
                  className="w-8 h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <img 
                    src="/logo.svg" 
                    alt="PM Logo" 
                    className="w-full h-full object-cover dark:grayscale dark:hover:grayscale-0 transition-all duration-300"
                  />
                </button>
                <span className="text-lg font-medium">{logo.name}</span>
              </div>
              
              <div className="flex items-center space-x-8 text-sm">
                {!isShahSyedDomain && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">AVAILABILITY</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
              </div>

              <div className="flex items-center space-x-4">
                {socialLinks.map((link, index) => (
                  <a key={index} href={link.href} className="w-8 h-8 bg-gray-400 dark:bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 dark:hover:bg-gray-500 transition-colors">
                    <span className="text-sm">{link.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="w-full px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">{link.label}</a>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="w-full px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="mb-16">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
                {/* Text Content */}
                <div className="text-center xl:text-left">
                  <h1 className="text-6xl md:text-8xl lg:text-9xl xl:text-7xl font-bold leading-[0.9] mb-8 tracking-tight">
                    {hero.title}
                    <br />
                    <span className="text-muted-foreground">{hero.subtitle}</span>
                    <span className="text-orange-500">.</span>
                  </h1>
                </div>
                
                {/* Profile Image */}
                {hero.imageUrl && (
                  <div className="flex justify-center xl:justify-end">
                    <div className="flex flex-col items-center space-y-8">
                      <div className="w-80 h-80 xl:w-96 xl:h-96 overflow-hidden rounded-full group cursor-pointer">
                        <img 
                          src={hero.imageUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                        />
                      </div>
                      <button 
                        onClick={openCalendar} 
                        className="bg-foreground text-background px-8 py-4 rounded-full font-medium hover:bg-foreground/90 transition-colors inline-flex items-center space-x-2"
                      >
                        <img src={calendarIcon} alt="Calendar" className="w-5 h-5 invert dark:invert-0" />
                        <span>{ctaButton.label}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-4xl mx-auto mt-16">
                {hero.description}
              </p>
            </div>

            {/* Work Experience Section */}
            {workExperience && workExperience.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 pt-20 border-t border-border">
                {/* Left Column - Heading and Description */}
                <div>
                  <h2 className="text-5xl md:text-6xl font-bold mb-8 text-foreground">Work
                      <span className="text-muted-foreground"> Experience</span>
                    <span className="text-orange-500">.</span>
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">

                  </p>
                </div>

                {/* Right Column - Experience Entries */}
                <div className="space-y-12">
                  {workExperience.map((experience, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {experience.icon}
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <h3 className="text-xl font-bold text-foreground">
                              {experience.company}
                                <span className="text-muted-foreground"><br/>{experience.position}</span>
                            </h3>
                          </div>
                          <div className="text-muted-foreground text-sm mb-4">
                            {experience.duration} - {experience.location}
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {experience.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Side Projects Section */}
            <div className="mb-20 pt-20 border-t border-border">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Here are
                <br />
                my <span className="text-muted-foreground">side</span>
                <br />
                projects<span className="text-orange-500">.</span>
              </h2>
            </div>

            {/* Projects Section */}
            {projects && projects.length > 0 && (
              <div className="mb-20">
                {projects.map((project, index) => {
                  const isEven = index % 2 === 0;
                  
                  const ImageColumn = (
                    <div>
                      {project.imageUrl && (
                        <div className="w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={project.imageUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  );

                  const DetailsColumn = (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-5xl md:text-6xl font-bold mb-2 text-foreground">
                            <span className="text-muted-foreground"> {project.title}</span>
                            <span className="text-orange-500">.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg">{project.category}</p>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-4 text-foreground">Challenge</h3>
                        <p className="text-muted-foreground leading-relaxed mb-8">
                          {project.challenge}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-4 text-foreground">Customer Obsessed Approach</h3>
                        <p className="text-muted-foreground leading-relaxed mb-8">
                          {project.approach}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-4 text-foreground">Result</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {project.result}
                        </p>
                      </div>
                    </div>
                  );

                  return (
                    <div key={index} className="mb-20">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20 pt-20 border-t border-border">
                        {isEven ? (
                          <>
                            {ImageColumn}
                            {DetailsColumn}
                          </>
                        ) : (
                          <>
                            {DetailsColumn}
                            {ImageColumn}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Previously Worked At Section */}
            {companies && companies.length > 0 && (
              <div className="mb-20 pt-20 border-t border-border">
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-6xl font-bold mb-16 text-foreground">
                    Previously <span className="text-muted-foreground">Worked At</span>
                    <span className="text-orange-500">.</span>
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center max-w-5xl mx-auto">
                    {companies.map((company, index) => (
                      <div key={index} className="flex items-center justify-center p-4">
                        {company.logo}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
              <div className="mb-20 pt-20 border-t border-border"></div>
          </div>

          {/* Footer */}
          <footer className="w-full px-6 py-12 bg-background text-foreground">
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
                      <a key={index} href={link.href} className="w-8 h-8 bg-gray-400 dark:bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 dark:hover:bg-gray-500 transition-colors">
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
                      <a key={index} href={link.href} className="w-8 h-8 bg-gray-400 dark:bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 dark:hover:bg-gray-500 transition-colors">
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