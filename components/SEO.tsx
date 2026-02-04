
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords, ogImage, ogType = 'website' }) => {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = description;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    // Update Meta Keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        const meta = document.createElement('meta');
        meta.name = "keywords";
        meta.content = keywords;
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
    }

    // Update OG tags
    const updateOgTag = (property: string, content: string) => {
      const tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) tag.setAttribute('content', content);
    };

    updateOgTag('og:title', title);
    updateOgTag('og:description', description);
    updateOgTag('og:type', ogType);
    if (ogImage) updateOgTag('og:image', ogImage);

    // Update Twitter tags
    const updateTwitterTag = (name: string, content: string) => {
      const tag = document.querySelector(`meta[name="${name}"]`);
      if (tag) tag.setAttribute('content', content);
    };

    updateTwitterTag('twitter:title', title);
    updateTwitterTag('twitter:description', description);
    if (ogImage) updateTwitterTag('twitter:image', ogImage);

  }, [title, description, keywords, ogImage, ogType]);

  return null;
};

export default SEO;
