import { useEffect } from 'react';
import { SITE_CONFIG } from './seoConfig';

type SeoProps = {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noindex?: boolean;
};

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1200';

function setMeta(name: string, content: string, prop = false) {
  const attr = prop ? 'property' : 'name';
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function removeMeta(name: string, prop = false) {
  const attr = prop ? 'property' : 'name';
  const el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (el) {
    el.remove();
  }
}

export function useSeo({
  title,
  description,
  canonical,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  noindex,
}: SeoProps) {
  useEffect(() => {
    document.title = title;
    setMeta('description', description);

    if (keywords) {
      setMeta('keywords', keywords);
    }

    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    const canonicalUrl = `${SITE_CONFIG.domain}${canonical}`;
    setCanonical(canonicalUrl);

    setMeta('og:title', ogTitle ?? title, true);
    setMeta('og:description', ogDescription ?? description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:image', ogImage ?? DEFAULT_IMAGE, true);
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', SITE_CONFIG.siteName, true);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', twitterTitle ?? ogTitle ?? title);
    setMeta('twitter:description', twitterDescription ?? ogDescription ?? description);
    setMeta('twitter:image', twitterImage ?? ogImage ?? DEFAULT_IMAGE);
  }, [title, description, canonical, keywords, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, twitterImage, noindex]);
}
