'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';

interface NetworkStatusProps {
  onNetworkChange?: (isOnline: boolean) => void;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ onNetworkChange }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>('good');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionQuality('good');
      onNetworkChange?.(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionQuality('offline');
      onNetworkChange?.(false);
    };

    // Check initial online status
    setIsOnline(navigator.onLine);
    onNetworkChange?.(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Test connection quality periodically
    const testConnection = async () => {
      if (navigator.onLine) {
        try {
          const start = performance.now();
          await fetch('https://api-relay.applied-ai.zynga.com/v0/health', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
          });
          const end = performance.now();
          const latency = end - start;
          
          if (latency < 500) {
            setConnectionQuality('good');
          } else {
            setConnectionQuality('poor');
          }
        } catch (error) {
          setConnectionQuality('poor');
        }
      }
    };

    const interval = setInterval(testConnection, 30000); // Test every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [onNetworkChange]);

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-400';
    if (connectionQuality === 'poor') return 'text-yellow-400';
    return 'text-green-400';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    if (connectionQuality === 'poor') return <AlertTriangle className="w-4 h-4" />;
    return <Wifi className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (connectionQuality === 'poor') return 'Poor Connection';
    return 'Online';
  };

  if (!showDetails && isOnline && connectionQuality === 'good') {
    return null; // Don't show when everything is working well
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-16 right-4 z-50 bg-black/50 backdrop-blur-md border border-amber-600/30 rounded-lg p-2 shadow-lg"
    >
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'} ${connectionQuality === 'poor' ? 'bg-yellow-400' : ''}`}>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-amber-400 hover:text-amber-300 text-xs"
        >
          {showDetails ? 'Hide' : 'Details'}
        </button>
      </div>
      
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 pt-2 border-t border-amber-600/20"
        >
          <div className="text-xs text-amber-300 space-y-1">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={getStatusColor()}>{getStatusText()}</span>
            </div>
            <div className="flex justify-between">
              <span>Browser:</span>
              <span className="text-amber-200">{navigator.onLine ? 'Online' : 'Offline'}</span>
            </div>
            {!isOnline && (
              <div className="text-red-300 text-xs mt-1">
                Check your internet connection
              </div>
            )}
            {connectionQuality === 'poor' && (
              <div className="text-yellow-300 text-xs mt-1">
                Slow connection detected
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
