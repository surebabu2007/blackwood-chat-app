'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Code, 
  ExternalLink, 
  Copy, 
  Check, 
  FileText, 
  Globe, 
  Gamepad2, 
  Smartphone,
  Monitor,
  BookOpen,
  ChevronRight,
  Info
} from 'lucide-react';

export default function IntegrationPage() {
  const [copiedFiles, setCopiedFiles] = useState<Set<string>>(new Set());

  const integrationFiles = [
    {
      id: 'standalone-html',
      name: 'Standalone HTML Widget',
      description: 'Complete standalone widget with no dependencies - just copy and use!',
      file: '/standalone-widget.html',
      type: 'html',
      icon: Globe,
      platforms: ['Web', 'Web Games', 'Websites'],
      difficulty: 'Easy',
      color: 'bg-green-500'
    },
    {
      id: 'web-integration-js',
      name: 'Web Integration Library',
      description: 'JavaScript library for easy integration into web applications',
      file: '/web-integration.js',
      type: 'javascript',
      icon: Code,
      platforms: ['Web', 'Web Games', 'React', 'Vue', 'Angular'],
      difficulty: 'Easy',
      color: 'bg-blue-500'
    },
    {
      id: 'web-integration-css',
      name: 'Web Integration Styles',
      description: 'Comprehensive CSS with responsive design and themes',
      file: '/web-integration.css',
      type: 'css',
      icon: Code,
      platforms: ['Web', 'Web Games', 'Websites'],
      difficulty: 'Easy',
      color: 'bg-purple-500'
    },
    {
      id: 'unity-integration',
      name: 'Unity Integration Script',
      description: 'C# script for Unity games with full error handling and UI integration',
      file: '/unity-integration.cs',
      type: 'csharp',
      icon: Gamepad2,
      platforms: ['Unity', 'Unity WebGL', 'Unity Mobile'],
      difficulty: 'Medium',
      color: 'bg-orange-500'
    },
    {
      id: 'python-integration',
      name: 'Python Integration Module',
      description: 'Python module supporting Pygame, Kivy, Tkinter, and more',
      file: '/python-integration.py',
      type: 'python',
      icon: Code,
      platforms: ['Python', 'Pygame', 'Kivy', 'Tkinter'],
      difficulty: 'Medium',
      color: 'bg-yellow-500'
    },
    {
      id: 'renpy-integration',
      name: 'Ren\'Py Integration Script',
      description: 'Complete Ren\'Py 8.4 integration with save/load support',
      file: '/renpy-integration.rpy',
      type: 'renpy',
      icon: BookOpen,
      platforms: ['Ren\'Py', 'Visual Novels'],
      difficulty: 'Easy',
      color: 'bg-pink-500'
    }
  ];

  const documentationFiles = [
    {
      id: 'comprehensive-guide',
      name: 'Comprehensive Integration Guide',
      description: 'Complete step-by-step integration instructions for all platforms',
      file: '/COMPREHENSIVE_INTEGRATION_GUIDE.md',
      type: 'markdown',
      icon: BookOpen,
      platforms: ['All Platforms'],
      difficulty: 'All Levels',
      color: 'bg-indigo-500'
    },
    {
      id: 'integration-summary',
      name: 'Integration Summary',
      description: 'Quick overview of all integration options and edge cases addressed',
      file: '/WIDGET_INTEGRATION_SUMMARY.md',
      type: 'markdown',
      icon: Info,
      platforms: ['All Platforms'],
      difficulty: 'All Levels',
      color: 'bg-teal-500'
    }
  ];

  const copyToClipboard = async (filePath: string, fileId: string) => {
    try {
      const response = await fetch(filePath);
      const content = await response.text();
      await navigator.clipboard.writeText(content);
      
      setCopiedFiles(prev => {
        const newSet = new Set(prev);
        newSet.add(fileId);
        return newSet;
      });
      setTimeout(() => {
        setCopiedFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy file:', error);
    }
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const response = await fetch(filePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-900/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'Hard': return 'text-red-400 bg-red-900/20';
      default: return 'text-blue-400 bg-blue-900/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'html': return 'text-orange-400';
      case 'javascript': return 'text-yellow-400';
      case 'css': return 'text-blue-400';
      case 'csharp': return 'text-purple-400';
      case 'python': return 'text-green-400';
      case 'renpy': return 'text-pink-400';
      case 'markdown': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-black/70 backdrop-blur-md border-b border-amber-600/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-amber-100 mb-2">
                🕵️ Integration Files & Documentation
              </h1>
              <p className="text-amber-300/80">
                Complete integration solutions for Unity, Python, Web, Ren&apos;Py, and more
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              >
                Back to Game
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Start Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-600/30 rounded-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-amber-100 mb-4">🚀 Quick Start</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-black/40 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-amber-200 mb-2">Easiest: Standalone HTML</h3>
              <p className="text-amber-300/80 text-sm mb-3">Just copy the HTML file and open in browser</p>
              <a
                href="/standalone-widget.html"
                target="_blank"
                className="inline-flex items-center text-amber-400 hover:text-amber-300"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Standalone Widget
              </a>
            </div>
            <div className="bg-black/40 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-amber-200 mb-2">Web Games: JavaScript</h3>
              <p className="text-amber-300/80 text-sm mb-3">Include JS and CSS files in your web project</p>
              <a
                href="#web-integration"
                className="inline-flex items-center text-amber-400 hover:text-amber-300"
              >
                <ChevronRight className="w-4 h-4 mr-2" />
                View Web Integration
              </a>
            </div>
            <div className="bg-black/40 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-amber-200 mb-2">Unity Games: C# Script</h3>
              <p className="text-amber-300/80 text-sm mb-3">Add the C# script to your Unity project</p>
              <a
                href="#unity-integration"
                className="inline-flex items-center text-amber-400 hover:text-amber-300"
              >
                <ChevronRight className="w-4 h-4 mr-2" />
                View Unity Integration
              </a>
            </div>
          </div>
        </motion.div>

        {/* Integration Files Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 id="integration-files" className="text-2xl font-bold text-amber-100 mb-6">
            📁 Integration Files
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {integrationFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-sm border border-amber-600/20 rounded-lg p-6 hover:border-amber-600/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${file.color}`}>
                      <file.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-amber-100">{file.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(file.type)} bg-black/40`}>
                        {file.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(file.difficulty)}`}>
                    {file.difficulty}
                  </span>
                </div>

                <p className="text-amber-300/80 text-sm mb-4">{file.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-amber-200 mb-2">Supported Platforms:</h4>
                  <div className="flex flex-wrap gap-2">
                    {file.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="text-xs px-2 py-1 bg-amber-900/30 text-amber-300 rounded"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => copyToClipboard(file.file, file.id)}
                    className="flex items-center space-x-2 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-sm"
                  >
                    {copiedFiles.has(file.id) ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => downloadFile(file.file, file.name.replace(/\s+/g, '-').toLowerCase() + '.' + file.type)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>

                  <a
                    href={file.file}
                    target="_blank"
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Documentation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-amber-100 mb-6">
            📚 Documentation
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {documentationFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-sm border border-amber-600/20 rounded-lg p-6 hover:border-amber-600/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${file.color}`}>
                      <file.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-amber-100">{file.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(file.type)} bg-black/40`}>
                        {file.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(file.difficulty)}`}>
                    {file.difficulty}
                  </span>
                </div>

                <p className="text-amber-300/80 text-sm mb-4">{file.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-amber-200 mb-2">Platforms:</h4>
                  <div className="flex flex-wrap gap-2">
                    {file.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="text-xs px-2 py-1 bg-amber-900/30 text-amber-300 rounded"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <a
                    href={file.file}
                    target="_blank"
                    className="flex items-center space-x-2 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Read Documentation</span>
                  </a>

                  <button
                    onClick={() => downloadFile(file.file, file.name.replace(/\s+/g, '-').toLowerCase() + '.md')}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-600/30 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-amber-100 mb-6">✨ Features Included</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/40 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-amber-200 mb-2">🎨 Themes</h3>
              <p className="text-amber-300/80 text-sm">Sepia, Aged, Classic + custom themes</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-amber-200 mb-2">📱 Responsive</h3>
              <p className="text-amber-300/80 text-sm">Works on desktop, tablet, and mobile</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-amber-200 mb-2">🛡️ Error Handling</h3>
              <p className="text-amber-300/80 text-sm">Comprehensive error recovery and fallbacks</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-amber-200 mb-2">🔧 Customizable</h3>
              <p className="text-amber-300/80 text-sm">Easy to modify and extend</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}