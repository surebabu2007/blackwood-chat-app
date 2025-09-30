'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: number;
  apiResponseTime: number;
  bundleSize: number;
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    memoryUsage: 0,
    apiResponseTime: 0,
    bundleSize: 0
  });

  useEffect(() => {
    // Measure page load time
    const loadTime = performance.now();
    setMetrics(prev => ({ ...prev, loadTime }));

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({ 
        ...prev, 
        memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
      }));
    }

    // Monitor bundle size
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('_next/static')) {
        totalSize += 100; // Approximate size in KB
      }
    });
    setMetrics(prev => ({ ...prev, bundleSize: totalSize }));

    // Log performance issues
    if (loadTime > 3000) {
      console.warn('⚠️ Slow page load:', loadTime + 'ms');
    }
    if (metrics.memoryUsage > 100) {
      console.warn('⚠️ High memory usage:', metrics.memoryUsage + 'MB');
    }
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="font-bold mb-1">Performance Monitor</div>
      <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
      <div>Bundle: {metrics.bundleSize}KB</div>
      <div>API: {metrics.apiResponseTime}ms</div>
    </div>
  );
};
