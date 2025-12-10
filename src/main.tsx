import { createRoot } from 'react-dom/client'
import { StrictMode, Suspense } from 'react'
import App from './App.tsx'
import './index.css'

// Performance optimization: Preload critical resources
const preloadCriticalResources = () => {
  // Preload critical fonts
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = '/fonts/inter.woff2'; // Add your font file if you have one
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);

  // Preload critical images
  const heroImage = new Image();
  heroImage.src = '/ofw-hero.jpg';

  // Add resource hints for better performance
  const dnsPrefetch1 = document.createElement('link');
  dnsPrefetch1.rel = 'dns-prefetch';
  dnsPrefetch1.href = '//fonts.googleapis.com';
  document.head.appendChild(dnsPrefetch1);

  const dnsPrefetch2 = document.createElement('link');
  dnsPrefetch2.rel = 'dns-prefetch';
  dnsPrefetch2.href = '//www.youtube.com';
  document.head.appendChild(dnsPrefetch2);
};

// Initialize performance optimizations
preloadCriticalResources();

// Register service worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const root = createRoot(document.getElementById("root")!);

// Wrap in StrictMode for development and Suspense for code splitting
root.render(
  <StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <App />
    </Suspense>
  </StrictMode>
);
