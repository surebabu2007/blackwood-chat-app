'use client';

import React, { useState, useEffect } from 'react';
import { Character } from '@/lib/types';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Lock, Clock } from 'lucide-react';
import { CharacterStatusManager } from '@/lib/characterStatus';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onClick: () => void;
  isAvailable?: boolean;
  availabilityInfo?: {
    characterId: string;
    isAvailable: boolean;
    reason?: string;
    requiredProgress?: number;
    availableLocations?: string[];
    trustRequirement?: number;
  };
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isSelected,
  onClick,
  isAvailable = true,
  availabilityInfo
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [offlineReason, setOfflineReason] = useState('');

  // Update online status every second
  useEffect(() => {
    const updateStatus = () => {
      const online = CharacterStatusManager.isCharacterOnline(character.id);
      const timeLeft = CharacterStatusManager.getTimeUntilOnline(character.id);
      const reason = CharacterStatusManager.getOfflineReason(character.id);
      
      setIsOnline(online);
      setTimeRemaining(timeLeft);
      setOfflineReason(reason);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [character.id]);
  const getCardStyles = () => {
    const baseClasses = 'border-2 rounded-xl transition-all duration-300 backdrop-blur-sm';
    const hoverClasses = (isAvailable && isOnline) ? 'hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer' : 'cursor-not-allowed opacity-60';
    
    if (isSelected) {
      return `${baseClasses} ${hoverClasses} bg-gradient-to-r from-amber-900/30 to-amber-800/20 border-amber-400/60 shadow-lg shadow-amber-400/20 scale-[1.02]`;
    }
    
    if (!isAvailable) {
      return `${baseClasses} bg-black/50 border-gray-600/30`;
    }

    if (!isOnline) {
      return `${baseClasses} bg-red-900/20 border-red-600/30 opacity-70`;
    }
    
    return `${baseClasses} ${hoverClasses} bg-black/70 border-amber-600/30 hover:border-amber-500/50`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: isSelected ? 1.02 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`character-card relative p-4 ${getCardStyles()}`}
      onClick={(isAvailable && isOnline) ? onClick : undefined}
    >
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className={`w-12 h-12 rounded-full overflow-hidden border-2 shadow-lg transition-all duration-300 ${
            isSelected ? 'border-amber-400/60 shadow-amber-400/20' : 'border-white/20'
          }`}>
            <img 
              src={character.avatar} 
              alt={character.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to emoji if image fails to load
                e.currentTarget.style.display = 'none';
                const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextSibling) nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-gray-600 flex items-center justify-center text-xl" style={{display: 'none'}}>
              {character.avatar.includes('/images/') ? '👤' : character.avatar}
            </div>
          </div>
          
          {/* Online/Offline indicator */}
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black/80 shadow-sm ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {isOnline ? (
              <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-60"></div>
            ) : (
              <div className="absolute inset-0 bg-red-400 rounded-full animate-pulse opacity-60"></div>
            )}
          </div>
        </div>
        
        {/* Character Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className={`text-sm sm:text-base font-typewriter font-bold transition-colors duration-300 tracking-wide leading-tight ${
            isSelected ? 'text-amber-100' : 'text-amber-200'
          }`}>
            <span className="block sm:inline">{character.name.toUpperCase()}</span>
          </h3>
          <p className={`text-xs sm:text-sm transition-colors duration-300 font-typewriter tracking-wide leading-tight mt-0.5 ${
            isSelected ? 'text-amber-200/90' : 'text-amber-300/70'
          }`}>
            {character.role}
          </p>
          {/* Status text */}
          {!isOnline && timeRemaining > 0 && (
            <p className="text-xs font-typewriter text-red-400 mt-1">
              Not cooperating ({timeRemaining}s)
            </p>
          )}
        </div>
        
        {/* Selection/Availability Indicator */}
        <div className="flex-shrink-0 flex items-center justify-center">
          {isSelected ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center justify-center w-6 h-6 bg-amber-400/20 rounded-full border border-amber-400/40"
            >
              <CheckCircle className="w-4 h-4 text-amber-400" />
            </motion.div>
          ) : !isAvailable ? (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center w-6 h-6 bg-transparent rounded-full border border-gray-600/30"
              title={availabilityInfo?.reason || 'Character not available'}
            >
              {availabilityInfo?.requiredProgress ? (
                <Clock className="w-3 h-3 text-gray-600/50" />
              ) : (
                <Lock className="w-3 h-3 text-gray-600/50" />
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center w-6 h-6 bg-transparent rounded-full border border-amber-600/30 hover:border-amber-500/50 transition-colors duration-300"
            >
              <Circle className="w-3 h-3 text-amber-600/50" />
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Selection indicator bar */}
      {isSelected && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-b-xl"
        />
      )}
      
      {/* Hover effect overlay */}
      {isAvailable && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-amber-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      
      {/* Offline tooltip */}
      {!isOnline && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-black/90 border border-red-600/30 rounded-lg text-xs text-gray-300 whitespace-nowrap z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="text-red-400 font-semibold">Not Cooperating</div>
          <div className="text-gray-300 mt-1">{offlineReason}</div>
          {timeRemaining > 0 && (
            <div className="text-amber-400 mt-1">
              Will cooperate again in {timeRemaining} seconds
            </div>
          )}
        </div>
      )}
      
      {/* Availability tooltip */}
      {!isAvailable && availabilityInfo && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-black/90 border border-gray-600/30 rounded-lg text-xs text-gray-300 whitespace-nowrap z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {availabilityInfo.reason}
          {availabilityInfo.requiredProgress && (
            <div className="text-amber-400 mt-1">
              Requires {availabilityInfo.requiredProgress}% progress
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
