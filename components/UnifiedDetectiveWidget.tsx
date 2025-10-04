'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Character } from '@/lib/types';
import { characters } from '@/lib/characters';
import { IndividualCharacterWidget } from './IndividualCharacterWidget';
import { VintageChatWidget } from './VintageChatWidget';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Minimize2,
  Maximize2,
  X,
  ChevronDown,
  ChevronUp,
  Zap,
  Shield,
  Heart,
  AlertCircle,
  Clock,
  User
} from 'lucide-react';

interface UnifiedDetectiveWidgetProps {
  apiKey?: string;
  agentId?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'sepia' | 'aged' | 'classic';
  enableVoice?: boolean;
  enableFileUpload?: boolean;
  showCharacterSelector?: boolean;
  defaultCharacter?: string;
  onCharacterSelect?: (character: Character) => void;
  onMessageSent?: (message: string, characterId: string) => void;
  onMessageReceived?: (message: string, characterId: string) => void;
  className?: string;
}

interface WidgetConfig {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme: 'sepia' | 'aged' | 'classic';
  enableVoice: boolean;
  enableFileUpload: boolean;
  showCharacterSelector: boolean;
  isMinimized: boolean;
  selectedCharacter?: Character;
}

export const UnifiedDetectiveWidget: React.FC<UnifiedDetectiveWidgetProps> = ({
  apiKey,
  agentId,
  position = 'bottom-right',
  theme = 'sepia',
  enableVoice = true,
  enableFileUpload = false,
  showCharacterSelector = true,
  defaultCharacter,
  onCharacterSelect,
  onMessageSent,
  onMessageReceived,
  className = ''
}) => {
  const [config, setConfig] = useState<WidgetConfig>({
    position,
    theme,
    enableVoice,
    enableFileUpload,
    showCharacterSelector,
    isMinimized: false,
    selectedCharacter: defaultCharacter ? characters.find(c => c.id === defaultCharacter) : undefined
  });
  
  const [activeWidgets, setActiveWidgets] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastActivity, setLastActivity] = useState(new Date());
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, characterId: string, timestamp: Date}>>([]);

  // ElevenLabs API Integration
  const [elevenLabsConfig, setElevenLabsConfig] = useState<any>(null);

  const loadElevenLabsConfig = async () => {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}/widget`, {
        headers: {
          'xi-api-key': apiKey || '',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setElevenLabsConfig(data.widget_config);
      }
    } catch (error) {
      console.error('Failed to load ElevenLabs configuration:', error);
    }
  };

  useEffect(() => {
    // Load ElevenLabs widget configuration if API key and agent ID are provided
    if (apiKey && agentId) {
      loadElevenLabsConfig();
    }
  }, [apiKey, agentId, loadElevenLabsConfig]);

  const toggleWidget = (characterId: string) => {
    const newActiveWidgets = new Set(activeWidgets);
    if (newActiveWidgets.has(characterId)) {
      newActiveWidgets.delete(characterId);
    } else {
      newActiveWidgets.add(characterId);
    }
    setActiveWidgets(newActiveWidgets);
  };

  const closeWidget = (characterId: string) => {
    const newActiveWidgets = new Set(activeWidgets);
    newActiveWidgets.delete(characterId);
    setActiveWidgets(newActiveWidgets);
  };

  const updateConfig = (newConfig: Partial<WidgetConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleCharacterSelect = (character: Character) => {
    updateConfig({ selectedCharacter: character });
    onCharacterSelect?.(character);
    setActiveWidgets(new Set([character.id]));
  };

  const getPositionClasses = () => {
    switch (config.position) {
      case 'bottom-right':
        return 'fixed bottom-4 right-4';
      case 'bottom-left':
        return 'fixed bottom-4 left-4';
      case 'top-right':
        return 'fixed top-4 right-4';
      case 'top-left':
        return 'fixed top-4 left-4';
      default:
        return 'fixed bottom-4 right-4';
    }
  };

  const getThemeClasses = () => {
    switch (config.theme) {
      case 'sepia':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'aged':
        return 'bg-yellow-50 border-yellow-300 text-yellow-900';
      case 'classic':
        return 'bg-gray-50 border-gray-300 text-gray-900';
      default:
        return 'bg-amber-50 border-amber-200 text-amber-900';
    }
  };

  const positionClasses = getPositionClasses();
  const themeClasses = getThemeClasses();

  if (config.isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`${positionClasses} z-50`}
      >
        <div 
          className={`${themeClasses} border-2 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 vintage-paper`}
          onClick={() => updateConfig({ isMinimized: false })}
        >
          <div className="p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif font-semibold text-sm">Detective Hub</h3>
              <p className="text-xs opacity-75">
                {activeWidgets.size} active investigation{activeWidgets.size !== 1 ? 's' : ''}
              </p>
            </div>
            <Maximize2 className="w-5 h-5" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`${positionClasses} z-50`}>
      {/* Main Widget Container */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className={`${themeClasses} border-2 rounded-lg shadow-xl vintage-paper`}
        style={{ width: '420px', maxHeight: '600px' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-100 to-amber-200 border-b-2 border-amber-300 p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="detective-title text-amber-900">Detective Investigation Hub</h3>
                <p className="detective-caption text-amber-700">Choose your suspect to interrogate</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 rounded hover:bg-amber-300 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateConfig({ isMinimized: true })}
                className="p-1 rounded hover:bg-amber-300 transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Character Selection */}
        {config.showCharacterSelector && (
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 gap-3">
              {characters.map((character) => (
                <motion.div
                  key={character.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: characters.indexOf(character) * 0.1 }}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-300 hover:shadow-md ${
                    activeWidgets.has(character.id) 
                      ? 'border-amber-400 bg-amber-100' 
                      : 'border-amber-200 bg-white hover:border-amber-300'
                  }`}
                  onClick={() => handleCharacterSelect(character)}
                >
                  <div className="flex items-center space-x-3">
                    {/* Character Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400">
                        <img 
                          src={character.avatar} 
                          alt={character.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextSibling = e.currentTarget.nextElementSibling as HTMLElement; if (nextSibling) nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold">
                          {character.name.charAt(0)}
                        </div>
                      </div>
                      
                      {/* Status Indicator */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500" />
                    </div>

                    {/* Character Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="detective-title text-amber-900">
                          {character.name}
                        </h4>
                        {getEmotionalStateIcon(character.currentEmotionalState)}
                      </div>
                      <p className="detective-caption text-amber-700 mb-1">{character.role}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${
                          character.trustLevel >= 70 ? 'text-green-600' :
                          character.trustLevel >= 40 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          Trust: {character.trustLevel}%
                        </span>
                        <span className="text-xs text-amber-600">
                          {character.revealedSecrets.length} secrets revealed
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col items-center">
                      <MessageSquare className={`w-5 h-5 ${
                        activeWidgets.has(character.id) ? 'text-amber-700' : 'text-amber-500'
                      }`} />
                      {activeWidgets.has(character.id) && (
                        <span className="text-xs text-amber-700 mt-1">Active</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-amber-200 p-4"
            >
              <h4 className="font-serif font-semibold text-amber-900 mb-3">Widget Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-amber-700 mb-1 block">Theme</label>
                  <select 
                    value={config.theme}
                    onChange={(e) => updateConfig({ theme: e.target.value as any })}
                    className="w-full p-2 border border-amber-300 rounded text-sm"
                  >
                    <option value="sepia">Sepia</option>
                    <option value="aged">Aged</option>
                    <option value="classic">Classic</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-amber-700">Voice Enabled</span>
                  <input 
                    type="checkbox" 
                    checked={config.enableVoice}
                    onChange={(e) => updateConfig({ enableVoice: e.target.checked })}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-amber-700">File Upload</span>
                  <input 
                    type="checkbox" 
                    checked={config.enableFileUpload}
                    onChange={(e) => updateConfig({ enableFileUpload: e.target.checked })}
                    className="rounded"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="bg-amber-100 border-t border-amber-200 p-3 rounded-b-lg">
          <div className="flex items-center justify-between text-xs text-amber-700">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <span>Last activity: {lastActivity.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
          </div>
        </div>
      </motion.div>

      {/* Individual Character Widgets */}
      <AnimatePresence>
        {Array.from(activeWidgets).map((characterId) => {
          const character = characters.find(c => c.id === characterId);
          if (!character) return null;

          return (
            <IndividualCharacterWidget
              key={characterId}
              character={character}
              position={config.position}
              size="medium"
              showStatus={true}
              enableNotifications={true}
              onClose={() => closeWidget(characterId)}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Helper function to get emotional state icon
const getEmotionalStateIcon = (state: string) => {
  switch (state) {
    case 'defensive':
      return <Shield className="w-4 h-4 text-yellow-600" />;
    case 'aggressive':
      return <Zap className="w-4 h-4 text-red-600" />;
    case 'vulnerable':
      return <Heart className="w-4 h-4 text-pink-600" />;
    case 'manipulative':
      return <AlertCircle className="w-4 h-4 text-orange-600" />;
    default:
      return <User className="w-4 h-4 text-blue-600" />;
  }
};
