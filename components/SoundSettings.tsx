'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { typewriterSounds } from '@/lib/typewriterSounds';

interface SoundSettingsProps {
  className?: string;
}

export const SoundSettings: React.FC<SoundSettingsProps> = ({ className = '' }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedEnabled = localStorage.getItem('typewriterSoundsEnabled');
    const savedVolume = localStorage.getItem('typewriterSoundsVolume');
    
    if (savedEnabled !== null) {
      setIsEnabled(savedEnabled === 'true');
    }
    
    if (savedVolume !== null) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      typewriterSounds.updateSettings({ volume: vol });
    }
  }, []);

  const toggleSounds = async () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    typewriterSounds.setEnabled(newEnabled);
    localStorage.setItem('typewriterSoundsEnabled', newEnabled.toString());
    
    // Play test sound when enabling
    if (newEnabled) {
      await typewriterSounds.playTypingSound();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    typewriterSounds.updateSettings({ volume: newVolume });
    localStorage.setItem('typewriterSoundsVolume', newVolume.toString());
  };

  const testSound = async () => {
    await typewriterSounds.playTypingSound();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={toggleSounds}
        className={`
          flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
          ${isEnabled 
            ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
            : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
          }
        `}
        title={isEnabled ? 'Disable typewriter sounds' : 'Enable typewriter sounds'}
      >
        {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {/* Settings Panel */}
      {showSettings && isEnabled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute bottom-10 right-0 bg-black/90 backdrop-blur-md border border-amber-600/30 rounded-lg p-3 min-w-[200px] z-50"
        >
          <div className="space-y-3">
            <h3 className="text-sm font-typewriter font-bold text-amber-100 tracking-wide">
              TYPEWRITER SOUNDS
            </h3>
            <p className="text-xs text-amber-300/70 font-typewriter tracking-wide">
              Authentic 1947 Typewriter Audio
            </p>
            
            {/* Volume Control */}
            <div>
              <label className="text-xs text-amber-300 font-typewriter tracking-wide block mb-1">
                VOLUME
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-amber-400 font-typewriter w-8">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>

            {/* Test Button */}
            <button
              onClick={testSound}
              className="w-full px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-200 rounded text-xs font-typewriter tracking-wide transition-colors duration-200"
            >
              TEST TYPEWRITER
            </button>
          </div>
        </motion.div>
      )}

      {/* Settings Toggle */}
      {isEnabled && (
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-600/20 hover:bg-amber-600/30 rounded-full flex items-center justify-center transition-colors duration-200"
          title="Sound settings"
        >
          <Settings className="w-2 h-2 text-amber-400" />
        </button>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #d4af37;
          cursor: pointer;
          border: 2px solid #8b4513;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #d4af37;
          cursor: pointer;
          border: 2px solid #8b4513;
        }
      `}</style>
    </div>
  );
};
