import { useEffect } from 'react';

interface MetaOptions {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export const useMeta = (options: MetaOptions) => {
  useEffect(() => {
    const {
      title,
      description,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterImage,
    } = options;

    // Store original values to restore later
    const originalTitle = document.title;
    const originalDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const originalOgTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
    const originalOgDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
    const originalOgImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta description
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }

    // Update Open Graph title
    if (ogTitle) {
      const metaOgTitle = document.querySelector('meta[property="og:title"]');
      if (metaOgTitle) {
        metaOgTitle.setAttribute('content', ogTitle);
      }
    }

    // Update Open Graph description
    if (ogDescription) {
      const metaOgDescription = document.querySelector('meta[property="og:description"]');
      if (metaOgDescription) {
        metaOgDescription.setAttribute('content', ogDescription);
      }
    }

    // Update Twitter title (use og:title if no specific twitter:title exists)
    if (twitterTitle || ogTitle) {
      let metaTwitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (!metaTwitterTitle) {
        metaTwitterTitle = document.createElement('meta');
        metaTwitterTitle.setAttribute('name', 'twitter:title');
        document.head.appendChild(metaTwitterTitle);
      }
      metaTwitterTitle.setAttribute('content', twitterTitle || ogTitle || '');
    }

    // Update Twitter description (use og:description if no specific twitter:description exists)
    if (twitterDescription || ogDescription) {
      let metaTwitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (!metaTwitterDescription) {
        metaTwitterDescription = document.createElement('meta');
        metaTwitterDescription.setAttribute('name', 'twitter:description');
        document.head.appendChild(metaTwitterDescription);
      }
      metaTwitterDescription.setAttribute('content', twitterDescription || ogDescription || '');
    }

    // Update Open Graph image
    if (ogImage) {
      const metaOgImage = document.querySelector('meta[property="og:image"]');
      if (metaOgImage) {
        metaOgImage.setAttribute('content', ogImage);
      }
    }

    // Update Twitter image (use og:image if no specific twitter:image exists)
    if (twitterImage || ogImage) {
      let metaTwitterImage = document.querySelector('meta[name="twitter:image"]');
      if (!metaTwitterImage) {
        metaTwitterImage = document.createElement('meta');
        metaTwitterImage.setAttribute('name', 'twitter:image');
        document.head.appendChild(metaTwitterImage);
      }
      metaTwitterImage.setAttribute('content', twitterImage || ogImage || '');
    }

    // Cleanup function to restore original values
    return () => {
      document.title = originalTitle;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', originalDescription);
      }

      const metaOgTitle = document.querySelector('meta[property="og:title"]');
      if (metaOgTitle) {
        metaOgTitle.setAttribute('content', originalOgTitle);
      }

      const metaOgDescription = document.querySelector('meta[property="og:description"]');
      if (metaOgDescription) {
        metaOgDescription.setAttribute('content', originalOgDescription);
      }

      const metaOgImage = document.querySelector('meta[property="og:image"]');
      if (metaOgImage) {
        metaOgImage.setAttribute('content', originalOgImage);
      }

      // Remove Twitter-specific meta tags we may have added
      const metaTwitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (metaTwitterTitle) {
        metaTwitterTitle.remove();
      }

      const metaTwitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (metaTwitterDescription) {
        metaTwitterDescription.remove();
      }

      const metaTwitterImage = document.querySelector('meta[name="twitter:image"]');
      if (metaTwitterImage) {
        metaTwitterImage.remove();
      }
    };
  }, [options]);
};