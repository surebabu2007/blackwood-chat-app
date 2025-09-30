'use client';

import React from 'react';
import { Character } from '@/lib/types';
import { CharacterCard } from './CharacterCard';
import { motion } from 'framer-motion';

interface CharacterSelectorProps {
  characters: Character[];
  selectedCharacter: Character | null;
  onCharacterSelect: (character: Character) => void;
  investigationProgress: number;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  selectedCharacter,
  onCharacterSelect,
  investigationProgress
}) => {
  const getCharacterAvailability = (character: Character) => {
    // All characters are always available for investigation
    return true;
  };

  const getCharacterStatus = (character: Character) => {
    if (!getCharacterAvailability(character)) {
      return 'locked';
    }
    if (character.id === selectedCharacter?.id) {
      return 'selected';
    }
    return 'available';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blackwood-800/50 backdrop-blur-sm border-b border-gray-700 p-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            Interview Suspects
          </h2>
          <div className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
            All Available
          </div>
        </div>
        
        <div className="space-y-3 px-2">
          {characters.map((character) => {
            const status = getCharacterStatus(character);
            const isAvailable = getCharacterAvailability(character);
            
            return (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: characters.indexOf(character) * 0.1 }}
              >
                <CharacterCard
                  character={character}
                  isSelected={status === 'selected'}
                  onClick={() => onCharacterSelect(character)}
                  isAvailable={true}
                />
                
              </motion.div>
            );
          })}
        </div>
        
        {/* Investigation progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Investigation Progress</span>
            <span>{investigationProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${investigationProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
