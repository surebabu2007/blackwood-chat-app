'use client';

import React from 'react';
import { Character } from '@/lib/types';
import { CharacterCard } from './CharacterCard';
import { motion } from 'framer-motion';
import { CharacterAvailabilityManager } from '@/lib/characterAvailability';
import { useChatStore } from '@/lib/store';

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
  const { gameState } = useChatStore();
  
  const getCharacterAvailability = (character: Character) => {
    // All characters are available from the start for natural 1947 interactions
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

  const getCharacterAvailabilityInfo = (character: Character) => {
    return CharacterAvailabilityManager.getCharacterAvailability(
      character.id, 
      investigationProgress, 
      gameState.currentLocation
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/85 backdrop-blur-md border-b border-amber-600/20 p-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 px-2">
          <h2 className="text-lg font-typewriter font-bold text-amber-100 tracking-wide">
            INTERROGATION SUBJECTS
          </h2>
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
                  isAvailable={isAvailable}
                  availabilityInfo={getCharacterAvailabilityInfo(character)}
                />
                
              </motion.div>
            );
          })}
        </div>
        
        {/* Investigation progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2 font-typewriter tracking-wide">
            <span>INVESTIGATION PROGRESS</span>
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
