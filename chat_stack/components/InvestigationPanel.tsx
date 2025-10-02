'use client';

import React, { useState } from 'react';
import { InvestigationState, GameState } from '@/lib/types';
import { victoriaBlackwood } from '@/lib/victimData';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Users, 
  FileText, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp,
  Eye,
  EyeOff,
  User
} from 'lucide-react';

interface InvestigationPanelProps {
  investigationState: InvestigationState;
  gameState: GameState;
  onAddNote: (note: string) => void;
  onUpdateProgress: (progress: number) => void;
}

export const InvestigationPanel: React.FC<InvestigationPanelProps> = ({
  investigationState,
  gameState,
  onAddNote,
  onUpdateProgress
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showSpoilers, setShowSpoilers] = useState(false);

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote('');
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'text-red-400';
    if (progress < 50) return 'text-yellow-400';
    if (progress < 75) return 'text-blue-400';
    return 'text-green-400';
  };

  const getProgressLabel = (progress: number) => {
    if (progress < 25) return 'Just Started';
    if (progress < 50) return 'Getting Clues';
    if (progress < 75) return 'Making Connections';
    return 'Almost There';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-blackwood-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Investigation Panel
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Progress Overview */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Case Progress</span>
          <span className={`text-sm font-medium ${getProgressColor(gameState.investigationProgress)}`}>
            {gameState.investigationProgress}% - {getProgressLabel(gameState.investigationProgress)}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${gameState.investigationProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Evidence Collected */}
            <div>
              <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Evidence Collected ({investigationState.evidenceCollected.length})
              </h4>
              <div className="space-y-1">
                {investigationState.evidenceCollected.length > 0 ? (
                  investigationState.evidenceCollected.map((evidence, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-gray-300 bg-gray-700/50 rounded px-2 py-1"
                    >
                      • {evidence}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">No evidence collected yet</p>
                )}
              </div>
            </div>

            {/* Suspects Interviewed */}
            <div>
              <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Suspects Interviewed ({investigationState.suspectsInterviewed.length})
              </h4>
              <div className="space-y-1">
                {investigationState.suspectsInterviewed.length > 0 ? (
                  investigationState.suspectsInterviewed.map((suspect, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-gray-300 bg-gray-700/50 rounded px-2 py-1"
                    >
                      • {suspect}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">No suspects interviewed yet</p>
                )}
              </div>
            </div>

            {/* Relationship Scores */}
            <div>
              <h4 className="text-sm font-medium text-white mb-2">
                Relationship Scores
              </h4>
              <div className="space-y-1">
                {Object.entries(investigationState.relationshipScores).length > 0 ? (
                  Object.entries(investigationState.relationshipScores).map(([name, score]) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="text-xs text-gray-300">{name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-700 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${
                              score > 50 ? 'bg-green-500' : score > 0 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.abs(score)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8">{score}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">No relationships established yet</p>
                )}
              </div>
            </div>

            {/* Victim Information */}
            <div>
              <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Victim Profile
              </h4>
              <div className="space-y-2 text-xs text-gray-300">
                <div><strong>Name:</strong> {victoriaBlackwood.name}</div>
                <div><strong>Age:</strong> {victoriaBlackwood.age} (at death)</div>
                <div><strong>Occupation:</strong> {victoriaBlackwood.occupation}</div>
                <div><strong>Description:</strong> {victoriaBlackwood.description}</div>
                <div className="mt-2">
                  <strong>Known Secrets:</strong>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {victoriaBlackwood.secrets.slice(0, 3).map((secret, index) => (
                      <li key={index}>{secret}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Investigation Notes */}
            <div>
              <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                Investigation Notes ({investigationState.investigationNotes.length})
              </h4>
              
              {/* Add new note */}
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add investigation note..."
                  className="flex-1 text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>

              {/* Notes list */}
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {investigationState.investigationNotes.length > 0 ? (
                  investigationState.investigationNotes.map((note, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-gray-300 bg-gray-700/50 rounded px-2 py-1"
                    >
                      • {note}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">No notes yet</p>
                )}
              </div>
            </div>

            {/* Spoiler Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <span className="text-xs text-gray-400">Show spoilers</span>
              <button
                onClick={() => setShowSpoilers(!showSpoilers)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {showSpoilers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Spoiler Content */}
            {showSpoilers && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-gray-400 bg-gray-900/50 rounded p-2"
              >
                <p><strong>True Killer:</strong> {gameState.trueKiller || 'Unknown'}</p>
                <p><strong>Case Solved:</strong> {gameState.caseSolved ? 'Yes' : 'No'}</p>
                <p><strong>Current Location:</strong> {gameState.currentLocation}</p>
                <p><strong>Time of Day:</strong> {gameState.timeOfDay}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
