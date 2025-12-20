import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
}

export const useSEO = ({
  title = 'Diary of an OFW - Real Stories, Real Solutions for Filipino Workers Abroad',
  description = 'Join thousands of OFWs sharing real stories, practical tips, and support. Listen to inspiring podcasts, read expert blogs on financial planning, homesickness, and career growth.',
  keywords = 'OFW, Overseas Filipino Workers, OFW stories, Filipino abroad, OFW podcast',
  image = 'https://diaryofanofw.com/src/assets/hero-image.jpg',
  url = 'https://diaryofanofw.com',
  type = 'website'
}: SEOProps = {}) => {
  useEffect(() => {
    // Update title
    document.title = title

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attr}="${name}"]`)
      
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attr, name)
        document.head.appendChild(element)
      }
      
      element.setAttribute('content', content)
    }

    // Standard meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)

    // Open Graph tags
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', image, true)
    updateMetaTag('og:url', url, true)
    updateMetaTag('og:type', type, true)

    // Twitter tags
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)
    updateMetaTag('twitter:url', url)

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [title, description, keywords, image, url, type])
}