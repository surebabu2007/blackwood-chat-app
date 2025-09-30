'use client';

import React from 'react';
import { Character } from '@/lib/types';
import { motion } from 'framer-motion';

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
  const colorClasses = {
    james: 'border-james-500 bg-james-900/20 hover:bg-james-800/30',
    marcus: 'border-marcus-500 bg-marcus-900/20 hover:bg-marcus-800/30',
    elena: 'border-elena-500 bg-elena-900/20 hover:bg-elena-800/30',
    lily: 'border-lily-500 bg-lily-900/20 hover:bg-lily-800/30',
    thompson: 'border-thompson-500 bg-thompson-900/20 hover:bg-thompson-800/30',
    victoria: 'border-victoria-500 bg-victoria-900/20 hover:bg-victoria-800/30'
  };

  const selectedClasses = isSelected ? 'ring-2 ring-white/50 scale-105' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        character-card relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
        ${colorClasses[character.color as keyof typeof colorClasses]}
        ${selectedClasses}
        hover:scale-[1.02] hover:shadow-lg hover:border-white/30
      `}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
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
          
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-blackwood-800"></div>
        </div>
        
        {/* Character Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate">
            {character.name}
          </h3>
          <p className="text-sm text-gray-300 truncate">
            {character.role}
          </p>
        </div>
        
        {/* Status Indicator */}
        <div className="flex-shrink-0">
          <div className={`w-3 h-3 rounded-full ${
            isSelected ? 'bg-blue-500' : 'bg-gray-500'
          }`}></div>
        </div>
      </div>
      
      
    </motion.div>
  );
};
