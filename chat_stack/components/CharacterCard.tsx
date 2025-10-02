'use client';

import React from 'react';
import { Character } from '@/lib/types';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onClick: () => void;
  isAvailable?: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isSelected,
  onClick,
  isAvailable = true
}) => {
  const getCardStyles = () => {
    const baseClasses = 'border-2 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm';
    const hoverClasses = 'hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10';
    
    if (isSelected) {
      return `${baseClasses} ${hoverClasses} bg-gradient-to-r from-amber-900/30 to-amber-800/20 border-amber-400/60 shadow-lg shadow-amber-400/20 scale-[1.02]`;
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
      onClick={onClick}
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
          
          {/* Online indicator - Green for online status */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black/80 shadow-sm">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-60"></div>
          </div>
        </div>
        
        {/* Character Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-semibold truncate transition-colors duration-300 ${
            isSelected ? 'text-amber-100' : 'text-amber-200'
          }`}>
            {character.name}
          </h3>
          <p className={`text-sm truncate transition-colors duration-300 ${
            isSelected ? 'text-amber-200/90' : 'text-amber-300/70'
          }`}>
            {character.role}
          </p>
        </div>
        
        {/* Selection Indicator - Professional checkmark */}
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
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-amber-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};
