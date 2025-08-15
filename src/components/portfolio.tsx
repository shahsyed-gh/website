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
      { icon: <img src={blogIcon} alt="Blog" className="w-4 h-4 grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />, href: '/blog' },
    { icon: <img src={linkedinIcon} alt="LinkedIn" className="w-4 h-4 grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />, href: 'https://linkedin.com/in/shahsyedmba' },
    { icon: <img src={instagramIcon} alt="Instagram" className="w-4 h-4 grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />, href: 'https://instagram.com/engineeringpm' },
    { icon: <img src={emailIcon} alt="Email" className="w-4 h-4 grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />, href: 'mailto:shah@shahsyed.com' },
    { icon: <img src={twitterIcon} alt="Twitter" className="w-4 h-4 grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />, href: 'https://twitter.com/pmengineer' },
    { icon: <img src={blueskyIcon} alt="Website" className="w-4 h-4 grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />, href: 'https://bsky.app/profile/engineeringpm.bsky.social' },
    { icon: <img src={tiktokIcon} alt="TikTok" className="w-4 h-4 grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />, href: 'https://tiktok.com/@engineeringpm' },
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
      position: 'Product Engineer',
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
      position: 'Product Engineer',
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
      challenge: 'Utilize my PM skills to create a website with analytics and a blog system while updating my overall design. ' +
          'I am not a designer by trade so I leveraged AI to help come up with a new theme while focusing on the analytics.',
      approach: 'I am in the process of uploading a youtube video to explain exactly what I did! Stay tuned!',
      result: 'Launched a comprehensive analytics based portfolio that tracks user visits, sees how people are engaging with my website, so that I can grow my personal brand.',
      imageUrl: 'portfolio.png'
    }
  ],
  companies: [
    // { name: 'Gap', logo: <img src="logos/gap.png" alt="Gap Inc." className="h-12 w-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300" /> },
    { name: 'JPMorgan', logo: <img src="logos/jpmorgan.jpg" alt="JPMorgan Chase" className="h-12 w-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300" /> },
    { name: 'Priceline', logo: <img src="logos/priceline.jpg" alt="Priceline" className="h-12 w-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300" /> },
    { name: 'TD', logo: <img src="logos/td.jpg" alt="TD Bank" className="h-12 w-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300" /> },
    { name: 'Ryerson', logo: <img src="logos/ryerson.jpg" alt="Ryerson University" className="h-12 w-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300" /> }
  ],
  showAnimatedBackground: false,
};

const DemoOne = () => {
  return <LocalPortfolio {...customPortfolioData} />;
};

export { DemoOne };