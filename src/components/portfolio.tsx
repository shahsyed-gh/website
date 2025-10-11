import { LocalPortfolio, LocalPortfolioProps } from "@/components/ui/local-portfolio";
import blogIcon from "@/assets/icons/blog.png";
import linkedinIcon from "@/assets/icons/linkedin.png";
import instagramIcon from "@/assets/icons/instagram.png";
import emailIcon from "@/assets/icons/email.png";
import twitterIcon from "@/assets/icons/twitter.png";
import blueskyIcon from "@/assets/icons/bluesky.png";
import tiktokIcon from "@/assets/icons/tiktok.png";

const customPortfolioData: LocalPortfolioProps = {
  logo: {
    initials: 'SS',
    name: '',
  },
  statusInfo: {
    availability: 'Available for hire',
    localTime: '00:00:00',
    city: 'Columbus, Ohio'
  },
  socialLinks: [
    { icon: <img src={blogIcon} alt="Blog" className="w-[21px] h-[21px] grayscale group-hover:grayscale-0 transition-all duration-300 dark:invert" />, href: '/blog' },
    { icon: <img src={linkedinIcon} alt="LinkedIn" className="w-[21px] h-[21px] grayscale group-hover:grayscale-0 transition-all duration-300 dark:invert" />, href: 'https://linkedin.com/in/shahsyedmba' },
    { icon: <svg className="w-[21px] h-[21px] grayscale group-hover:grayscale-0 transition-all duration-300 dark:invert group-hover:!text-red-600 dark:group-hover:!invert-0" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, href: 'https://youtube.com/@engineeringpm' },
    { icon: <img src={instagramIcon} alt="Instagram" className="w-[21px] h-[21px] grayscale group-hover:grayscale-0 transition-all duration-300 dark:invert" />, href: 'https://instagram.com/engineeringpm' },
    { icon: <img src={tiktokIcon} alt="TikTok" className="w-[21px] h-[21px] grayscale group-hover:grayscale-0 transition-all duration-300 dark:invert" />, href: 'https://tiktok.com/@engineeringpm' },
      // { icon: <img src={twitterIcon} alt="Twitter" className="w-[21px] h-[21px] grayscale group-hover:grayscale-0 transition-all duration-300 dark:invert" />, href: 'https://twitter.com/pmengineer' },
    { icon: <img src={blueskyIcon} alt="BlueSky" className="w-[21px] h-[21px] grayscale group-hover:grayscale-0 transition-all duration-300 dark:invert" />, href: 'https://bsky.app/profile/engineeringpm.com' },
    { icon: <img src={emailIcon} alt="Email" className="w-[21px] h-[21px] grayscale group-hover:grayscale-0 transition-all duration-300 dark:invert" />, href: 'mailto:shah@shahsyed.com' }
  ],
  navLinks: [
    { label: 'Shah Syed', href: '#about' },
  ],
  hero: {
    title: 'Product Manager',
    subtitle: 'driving growth through data-driven decisions',
    description: "I'm a technical product manager with 10+ years of experience building and scaling digital products. I specialize in turning complex business challenges into user-centric solutions that drive measurable growth. " +
        "From 0->1 product launches to optimizing mature platforms, I combine analytical rigor with customer empathy to deliver products that users love and businesses depend on.",
    imageUrl: '/headhsot.jpg'
  },
  ctaButton: {
    label: 'Schedule a Meeting',
    onClick: () => alert('Scheduling a meeting...'),
  },
  workExperience: [
    {
      company: 'Gap Inc.',
      position: 'Staff Software Engineer',
      duration: '2024 - Present',
      location: 'Columbus, OH',
      description: 'Gap Inc., a house of iconic brands, is the largest specialty apparel company in America. Its Old Navy, ' +
          'Gap, Banana Republic, and Athleta brands offer clothing, accessories, and lifestyle products for men, women ' +
          'and children. Since 1969, Gap Inc. has created products and experiences that shape culture, while doing right' +
          ' by employees, communities and the planet. Gap Inc. products are available worldwide through company-operated' +
          ' stores, franchise stores, and e-commerce sites. Fiscal year 2023 net sales were $14.9 billion. ' +
          'For more information, please visit www.gapinc.com',
      icon: <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white"><img src="/logos/gap.png" alt="Gap Inc." className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" /></div>
    },
    {
      company: 'JPMorgan Chase',
      position: 'Lead Software Engineer',
      duration: '2023 - 2024',
      location: 'Columbus, OH',
      description: 'With a history tracing its roots to 1799 in New York City, JPMorganChase is one of the world\'s oldest,' +
          ' largest, and best-known financial institutions—carrying forth the innovative spirit of our heritage firms in ' +
          'global operations across 100 markets.With a history tracing its roots to 1799 in New York City, JPMorganChase ' +
          'is one of the world\'s oldest, largest, and best-known financial institutions—carrying forth the innovative ' +
          'spirit of our heritage firms in global operations across 100 markets.',
      icon: <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white"><img src="/logos/jpmorgan.jpg" alt="JPMorgan Chase" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" /></div>
    },
    {
      company: 'Priceline',
      position: 'Senior Software Engineer',
      duration: '2019 - 2023',
      location: 'Toronto, ON',
      description: 'Priceline, part of Booking Holdings Inc., has been a leader in online travel for over 25 years. ' +
          'Through our innovative technology, we make travel affordable and accessible for all, helping millions of ' +
          'travelers each year experience the moments that matter most. Whether it’s a much-needed getaway, wedding, ' +
          'reunion, graduation, or rooting on a favorite team—those are the moments that nobody should miss out on.',
      icon: <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white"><img src="/logos/priceline.jpg" alt="Priceline" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" /></div>
    }
  ],
  projects: [
    {
      title: 'shahsyed.com',
      category: 'Portfolio Website',
      challenge: 'Applied product requirements gathering and user experience optimization to redesign my portfolio with' +
          ' integrated analytics tracking and content management, using data-driven design decisions and stakeholder ' +
          'feedback to improve site performance and user engagement metrics.',
      approach: 'The process began by creating a comprehensive PRD using established templates (like Lenny\'s newsletter one-pager) that clearly defined the product vision and user needs before jumping into development.\n' +
          '\n' +
          'AI-powered development tools were used to rapidly prototype and test the portfolio, focusing on responsive design across devices (desktop, tablet, mobile) to ensure optimal user experience regardless of platform.\n' +
          '\n',
      result: 'Launched a comprehensive analytics based portfolio using AI that tracks user visits, sees how people are engaging with my website, so that I can grow my personal brand.',
      videoUrl: 'https://www.youtube.com/embed/6Gfdp26yVoU?si=AQJEy8U8Y3dPYmCD'
    },
    {
      title: 'SocialSpark',
      category: 'Social Media Marketing Tool',
      challenge: 'Conducted market research and defined MVP requirements for a social media automation platform, ' +
          'prioritizing core user workflows for AI content generation and multi-platform distribution. ' +
          'Led product discovery to identify key integration points across YouTube, Instagram, TikTok, Twitter, and ' +
          'Bluesky, focusing on scalable content management and cross-posting functionality.',
      approach: 'I am in the process of uploading a YouTube video to explain exactly what I did! Stay tuned!',
      result: 'Developed a prototype that integrates with major social media platforms, enabling users to automate ' +
          'content creation and distribution using AI, significantly reducing time spent on social media management.',
      imageUrl: 'projects/proj-zap.png'
    }
  ],
  companies: [
    // { name: 'Gap', logo: <img src="logos/gap.png" alt="Gap Inc." className="h-12 w-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300" /> },
    { name: 'JPMorgan', logo: <img src="logos/jpmorgan.jpg" alt="JPMorgan Chase" className="h-12 w-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300" /> },
    { name: 'Priceline', logo: <img src="logos/priceline.jpg" alt="Priceline" className="h-12 w-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300" /> },
    { name: 'TD', logo: <img src="logos/td.jpg" alt="TD Bank" className="h-12 w-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300" /> },
    { name: 'Nielsen', logo: <img src="logos/nielsen.jpg" alt="Nielsen" className="h-12 w-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300" /> },
    { name: 'Ryerson', logo: <img src="logos/ryerson.jpg" alt="Ryerson University" className="h-12 w-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300" /> }
  ],
  showAnimatedBackground: false,
};

const DemoOne = () => {
  return <LocalPortfolio {...customPortfolioData} />;
};

export { DemoOne };