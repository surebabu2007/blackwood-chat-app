'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bug, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface DebugInfo {
  timestamp: string;
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DebugInfo[] = [];

    // Test 1: Basic connectivity
    try {
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      });
      
      results.push({
        timestamp: new Date().toISOString(),
        test: 'Basic Internet Connectivity',
        status: response.ok ? 'success' : 'error',
        message: response.ok ? 'Internet connection working' : 'Internet connection failed',
        details: `Status: ${response.status}`
      });
    } catch (error) {
      results.push({
        timestamp: new Date().toISOString(),
        test: 'Basic Internet Connectivity',
        status: 'error',
        message: 'No internet connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: API endpoint connectivity
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('https://api-relay.applied-ai.zynga.com/v0/chat/low_level_converse', {
        method: 'HEAD',
        mode: 'cors',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      results.push({
        timestamp: new Date().toISOString(),
        test: 'API Endpoint Reachability',
        status: response.ok ? 'success' : 'warning',
        message: response.ok ? 'API endpoint reachable' : 'API endpoint unreachable',
        details: `Status: ${response.status}`
      });
    } catch (error) {
      results.push({
        timestamp: new Date().toISOString(),
        test: 'API Endpoint Reachability',
        status: 'error',
        message: 'API endpoint not reachable',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 3: Browser capabilities
    const hasFetch = typeof fetch !== 'undefined';
    const hasAbortController = typeof AbortController !== 'undefined';
    const hasLocalStorage = typeof localStorage !== 'undefined';
    
    results.push({
      timestamp: new Date().toISOString(),
      test: 'Browser Capabilities',
      status: hasFetch && hasAbortController && hasLocalStorage ? 'success' : 'warning',
      message: 'Browser compatibility check',
      details: `Fetch: ${hasFetch}, AbortController: ${hasAbortController}, LocalStorage: ${hasLocalStorage}`
    });

    // Test 4: Environment variables
    const hasApiUrl = !!process.env.NEXT_PUBLIC_API_BASE_URL;
    const hasApiToken = !!process.env.NEXT_PUBLIC_API_TOKEN;
    
    results.push({
      timestamp: new Date().toISOString(),
      test: 'Environment Configuration',
      status: hasApiUrl && hasApiToken ? 'success' : 'warning',
      message: 'Environment variables check',
      details: `API URL: ${hasApiUrl ? 'Set' : 'Missing'}, API Token: ${hasApiToken ? 'Set' : 'Missing'}`
    });

    setDebugInfo(results);
    setIsRunning(false);
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      runDiagnostics();
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Debug Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-amber-600/30 rounded-full p-3 hover:bg-black/90 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bug className="w-5 h-5 text-amber-400" />
      </motion.button>

      {/* Debug Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 z-50 bg-black/90 backdrop-blur-md border border-amber-600/30 rounded-lg p-4 shadow-lg max-w-md"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-amber-100">Debug Panel</h3>
            <div className="flex space-x-2">
              <button
                onClick={runDiagnostics}
                disabled={isRunning}
                className="text-amber-400 hover:text-amber-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-amber-400 hover:text-amber-300"
              >
                ×
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {debugInfo.map((info, index) => (
              <div key={index} className="border-b border-amber-600/20 pb-2 last:border-b-0">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(info.status)}
                  <span className="text-xs font-medium text-amber-200">
                    {info.test}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${getStatusColor(info.status)}`}>
                  {info.message}
                </p>
                {info.details && (
                  <p className="text-xs text-amber-400/70 mt-1">
                    {info.details}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-amber-600/20">
            <p className="text-xs text-amber-400/70">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
};
