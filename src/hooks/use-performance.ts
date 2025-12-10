import { useEffect, useState } from 'react';

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    domContentLoaded: 0,
    firstPaint: 0,
    largestContentfulPaint: 0,
  });

  useEffect(() => {
    // Monitor page load performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({
            ...prev,
            largestContentfulPaint: entry.startTime,
          }));
        }
      }
    });

    // Observe LCP
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observation not supported');
    }

    // Get navigation timing
    if (performance.timing) {
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;

      setMetrics(prev => ({
        ...prev,
        loadTime,
        domContentLoaded,
      }));
    }

    // Get paint timing
    if (performance.getEntriesByType) {
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-paint') {
          setMetrics(prev => ({
            ...prev,
            firstPaint: entry.startTime,
          }));
        }
      });
    }

    return () => observer.disconnect();
  }, []);

  return metrics;
};

// Web Vitals tracking
export const useWebVitals = () => {
  useEffect(() => {
    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observation not supported');
    }

    // FID (First Input Delay)
    const handleFirstInput = (entry: any) => {
      console.log('FID:', entry.processingStart - entry.startTime);
    };

    if ('PerformanceEventTiming' in window) {
      const inputObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          handleFirstInput(entry);
        }
      });

      try {
        inputObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observation not supported');
      }
    }

    return () => {
      observer.disconnect();
    };
  }, []);
};