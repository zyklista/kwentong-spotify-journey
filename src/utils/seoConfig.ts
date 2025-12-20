export const seoConfig = {
  siteName: 'Diary of an OFW',
  siteUrl: 'https://diaryofanofw.com',
  defaultTitle: 'Diary of an OFW - Real Stories, Real Solutions for Filipino Workers Abroad',
  defaultDescription: 'Join thousands of OFWs sharing real stories, practical tips, and support. Listen to inspiring podcasts, read expert blogs on financial planning, homesickness, and career growth.',
  defaultImage: 'https://diaryofanofw.com/src/assets/hero-image.jpg',
  twitterHandle: '@diaryofanofw',
  facebookAppId: '',
  
  // Keywords for different page types
  keywords: {
    home: 'OFW, Overseas Filipino Workers, OFW stories, Filipino abroad, OFW podcast, OFW community, OFW support, working abroad Philippines',
    blog: 'OFW blog, OFW tips, OFW advice, Filipino expat tips, working abroad guide',
    podcast: 'OFW podcast, Filipino podcast, OFW interviews, overseas worker stories',
    survey: 'OFW feedback, OFW survey, Filipino worker experience',
  },
  
  // Social media links
  social: {
    facebook: 'https://www.facebook.com/diaryofanofw',
    instagram: 'https://www.instagram.com/diaryofanofw',
    youtube: 'https://www.youtube.com/@diaryofanofw',
    spotify: 'https://open.spotify.com/show/xyz',
  }
}

// Helper function to generate page-specific SEO tags
export const generateSEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords,
}: {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  keywords?: string
}) => {
  const seo = {
    title: title || seoConfig.defaultTitle,
    description: description || seoConfig.defaultDescription,
    image: image || seoConfig.defaultImage,
    url: url || seoConfig.siteUrl,
    type,
    keywords: keywords || seoConfig.keywords.home,
  }
  
  return seo
}