'use client';

import React, { useState } from 'react';
import { UnifiedDetectiveWidget } from '@/components/UnifiedDetectiveWidget';
import { IndividualCharacterWidget } from '@/components/IndividualCharacterWidget';
import { VintageChatWidget } from '@/components/VintageChatWidget';
import { characters } from '@/lib/characters';
import { Character } from '@/lib/types';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Monitor, 
  Smartphone, 
  Code, 
  Download,
  Copy,
  Check
} from 'lucide-react';

export default function WidgetDemoPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [widgetType, setWidgetType] = useState<'unified' | 'individual' | 'single'>('unified');
  const [theme, setTheme] = useState<'sepia' | 'aged' | 'classic'>('sepia');
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isInterrogationMode, setIsInterrogationMode] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIntegrationCode = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detective Chat Widget Integration</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/framer-motion@10/dist/framer-motion.js"></script>
    <script src="${baseUrl}/widget-bundle.js"></script>
    <link href="${baseUrl}/widget-styles.css" rel="stylesheet">
</head>
<body>
    <div id="detective-widget-root"></div>
    
    <script>
        const { UnifiedDetectiveWidget } = DetectiveWidget;
        
        ReactDOM.render(
            React.createElement(UnifiedDetectiveWidget, {
                position: '${position}',
                theme: '${theme}',
                enableVoice: true,
                enableFileUpload: false,
                showCharacterSelector: true,
                isInterrogationMode: ${isInterrogationMode},
                onCharacterSelect: (character) => {
                    console.log('Character selected:', character.name);
                },
                onMessageSent: (message, characterId) => {
                    console.log('Message sent:', message, 'to', characterId);
                },
                onMessageReceived: (message, characterId) => {
                    console.log('Message received:', message, 'from', characterId);
                }
            }),
            document.getElementById('detective-widget-root')
        );
    </script>
</body>
</html>`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-200 to-yellow-200 border-b-2 border-amber-400 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl detective-title text-amber-900 mb-2 vintage-text-shadow">
            🕵️ Detective Chat Widget Demo
          </h1>
          <p className="detective-body text-amber-800 text-lg">
            Vintage-themed chat widgets for your detective mystery games and web applications
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Controls Panel */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6 mb-8 vintage-paper">
          <h2 className="text-2xl detective-title text-amber-900 mb-6">Widget Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Widget Type */}
            <div>
              <label className="block detective-label text-amber-700 mb-2">Widget Type</label>
              <select 
                value={widgetType}
                onChange={(e) => setWidgetType(e.target.value as any)}
                className="w-full p-3 border-2 border-amber-300 rounded-lg vintage-input"
              >
                <option value="unified">Unified Hub</option>
                <option value="individual">Individual Character</option>
                <option value="single">Single Chat</option>
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className="block detective-label text-amber-700 mb-2">Theme</label>
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full p-3 border-2 border-amber-300 rounded-lg vintage-input"
              >
                <option value="sepia">Sepia</option>
                <option value="aged">Aged Paper</option>
                <option value="classic">Classic Detective</option>
              </select>
            </div>

            {/* Position */}
            <div>
              <label className="block detective-label text-amber-700 mb-2">Position</label>
              <select 
                value={position}
                onChange={(e) => setPosition(e.target.value as any)}
                className="w-full p-3 border-2 border-amber-300 rounded-lg vintage-input"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
              </select>
            </div>

            {/* Character Selection */}
            {widgetType === 'individual' && (
              <div>
                <label className="block detective-label text-amber-700 mb-2">Character</label>
                <select 
                  value={selectedCharacter?.id || ''}
                  onChange={(e) => {
                    const char = characters.find(c => c.id === e.target.value);
                    setSelectedCharacter(char || null);
                  }}
                  className="w-full p-3 border-2 border-amber-300 rounded-lg vintage-input"
                >
                  <option value="">Select Character</option>
                  {characters.map(char => (
                    <option key={char.id} value={char.id}>{char.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Interrogation Mode Toggle */}
          <div className="mb-6 p-4 border border-amber-300 rounded-lg bg-amber-50 shadow-inner">
            <label className="block detective-label text-amber-700 mb-2">Interrogation Mode</label>
            <div className="flex items-center space-x-4">
              <div
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                  isInterrogationMode ? 'bg-red-600' : 'bg-gray-300'
                }`}
                onClick={() => setIsInterrogationMode(!isInterrogationMode)}
              >
                <span className="sr-only">Enable Interrogation Mode</span>
                <motion.span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isInterrogationMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
              <div>
                <p className="detective-caption text-amber-600">
                  {isInterrogationMode ? 'Interrogation Mode: Intense questioning mode active' : 'Standard Mode: Normal conversation'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={() => setShowCode(!showCode)}
              className="vintage-button px-6 py-3 rounded-lg text-amber-900 font-medium flex items-center space-x-2"
            >
              <Code className="w-5 h-5" />
              <span>{showCode ? 'Hide' : 'Show'} Integration Code</span>
            </button>
            
            <button
              onClick={() => copyToClipboard(getIntegrationCode())}
              className="vintage-button px-6 py-3 rounded-lg text-amber-900 font-medium flex items-center space-x-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Integration Code */}
        {showCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gray-900 rounded-lg shadow-lg border-2 border-amber-300 p-6 mb-8"
          >
            <h3 className="text-xl font-serif font-bold text-amber-200 mb-4">Integration Code</h3>
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{getIntegrationCode()}</code>
            </pre>
          </motion.div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6 vintage-card">
            <Settings className="w-8 h-8 text-amber-600 mb-3" />
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-2">Customizable</h3>
            <p className="text-amber-700">
              Fully customizable themes, positions, and character selection options
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6 vintage-card">
            <Monitor className="w-8 h-8 text-amber-600 mb-3" />
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-2">Responsive</h3>
            <p className="text-amber-700">
              Works perfectly on desktop, tablet, and mobile devices
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6 vintage-card">
            <Palette className="w-8 h-8 text-amber-600 mb-3" />
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-2">Vintage Theme</h3>
            <p className="text-amber-700">
              Beautiful vintage detective aesthetic with sepia tones and aged paper effects
            </p>
          </div>
        </div>

        {/* Widget Preview Area */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6 vintage-paper">
          <h2 className="text-2xl font-serif font-bold text-amber-900 mb-6">Live Preview</h2>
          <div className="relative h-96 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-200 p-4">
            <p className="text-center text-amber-700 mt-32">
              Widget will appear in the {position} corner
            </p>
          </div>
        </div>
      </div>

      {/* Widget Instances */}
      {widgetType === 'unified' && (
        <UnifiedDetectiveWidget
          position={position}
          theme={theme}
          enableVoice={true}
          enableFileUpload={false}
          showCharacterSelector={true}
          onCharacterSelect={(character) => {
            console.log('Character selected:', character.name);
          }}
          onMessageSent={(message, characterId) => {
            console.log('Message sent:', message, 'to', characterId);
          }}
          onMessageReceived={(message, characterId) => {
            console.log('Message received:', message, 'from', characterId);
          }}
        />
      )}

      {widgetType === 'individual' && selectedCharacter && (
        <IndividualCharacterWidget
          character={selectedCharacter}
          position={position}
          size="medium"
          showStatus={true}
          enableNotifications={true}
        />
      )}

      {widgetType === 'single' && (
        <VintageChatWidget
          position={position}
          theme={theme}
          showHeader={true}
          enableVoice={true}
          enableFileUpload={false}
          maxHeight="500px"
          width="400px"
          isInterrogationMode={isInterrogationMode}
        />
      )}
    </div>
  );
}
