'use client';

import React, { useState } from 'react';
import { Character } from '@/lib/types';
import { VintageChatWidget } from './VintageChatWidget';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  User, 
  AlertCircle,
  Clock,
  Heart,
  Shield,
  Zap
} from 'lucide-react';

interface IndividualCharacterWidgetProps {
  character: Character;
  onClose?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  showStatus?: boolean;
  enableNotifications?: boolean;
}

export const IndividualCharacterWidget: React.FC<IndividualCharacterWidgetProps> = ({
  character,
  onClose,
  position = 'bottom-right',
  size = 'medium',
  showStatus = true,
  enableNotifications = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSeen, setLastSeen] = useState(new Date());
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const getCharacterTheme = () => {
    switch (character.color) {
      case 'james':
        return 'sepia';
      case 'marcus':
        return 'aged';
      case 'elena':
        return 'classic';
      case 'lily':
        return 'sepia';
      case 'thompson':
        return 'aged';
      default:
        return 'sepia';
    }
  };

  const getCharacterAccentColor = () => {
    switch (character.color) {
      case 'james':
        return 'from-yellow-400 to-yellow-600';
      case 'marcus':
        return 'from-blue-400 to-blue-600';
      case 'elena':
        return 'from-red-400 to-red-600';
      case 'lily':
        return 'from-green-400 to-green-600';
      case 'thompson':
        return 'from-gray-400 to-gray-600';
      default:
        return 'from-amber-400 to-amber-600';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
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

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return { width: '320px', height: '400px' };
      case 'medium':
        return { width: '400px', height: '500px' };
      case 'large':
        return { width: '480px', height: '600px' };
      default:
        return { width: '400px', height: '500px' };
    }
  };

  const positionClasses = getPositionClasses();
  const sizeClasses = getSizeClasses();
  const theme = getCharacterTheme();
  const accentGradient = getCharacterAccentColor();

  const getEmotionalStateIcon = () => {
    switch (character.currentEmotionalState) {
      case 'defensive':
        return <Shield className="w-3 h-3 text-yellow-600" />;
      case 'aggressive':
        return <Zap className="w-3 h-3 text-red-600" />;
      case 'vulnerable':
        return <Heart className="w-3 h-3 text-pink-600" />;
      case 'manipulative':
        return <AlertCircle className="w-3 h-3 text-orange-600" />;
      default:
        return <User className="w-3 h-3 text-blue-600" />;
    }
  };

  const getTrustLevelColor = () => {
    if (character.trustLevel >= 70) return 'text-green-600';
    if (character.trustLevel >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        className={`${positionClasses} z-50`}
      >
        <div 
          className="relative cursor-pointer group"
          onClick={() => setIsExpanded(true)}
        >
          {/* Main Character Card */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 vintage-paper transform hover:scale-105">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                {/* Character Avatar */}
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full overflow-hidden border-3 border-amber-400 bg-gradient-to-br ${accentGradient}`}>
                    <img 
                      src={character.avatar} 
                      alt={character.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextSibling) nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-current flex items-center justify-center text-white text-lg">
                      {character.name.charAt(0)}
                    </div>
                  </div>
                  
                  {/* Online Status */}
                  {showStatus && (
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-amber-50 ${
                      isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  )}
                  
                  {/* Unread Count */}
                  {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </div>

                {/* Character Info */}
                <div className="flex-1">
                  <h3 className="detective-title text-amber-900 text-sm">
                    {character.name}
                  </h3>
                  <p className="detective-caption text-amber-700 mb-1">
                    {character.role}
                  </p>
                  
                  {/* Status Indicators */}
                  <div className="flex items-center space-x-2">
                    {getEmotionalStateIcon()}
                    <span className={`text-xs font-medium ${getTrustLevelColor()}`}>
                      Trust: {character.trustLevel}%
                    </span>
                  </div>
                </div>

                {/* Chat Icon */}
                <div className="flex flex-col items-center">
                  <MessageSquare className="w-6 h-6 text-amber-700 group-hover:text-amber-800 transition-colors" />
                  {isTyping && (
                    <div className="flex space-x-1 mt-1">
                      <div className="w-1 h-1 bg-amber-600 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Status */}
              <div className="mt-3 pt-2 border-t border-amber-300">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-amber-700">
                    <Clock className="w-3 h-3" />
                    <span>
                      Last seen: {lastSeen.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    character.currentEmotionalState === 'neutral' 
                      ? 'bg-green-100 text-green-800' 
                      : character.currentEmotionalState === 'defensive'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {character.currentEmotionalState}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vintage Decorative Elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-amber-200 rounded-full opacity-50"></div>
          <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-amber-300 rounded-full opacity-30"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 20 }}
      className={`${positionClasses} z-50`}
      style={sizeClasses}
    >
      <VintageChatWidget
        character={character}
        isMinimized={false}
        onMinimize={() => setIsExpanded(false)}
        onClose={onClose}
        position={position}
        theme={theme}
        showHeader={true}
        enableVoice={true}
        enableFileUpload={false}
        maxHeight={sizeClasses.height}
        width={sizeClasses.width}
        className="vintage-character-widget"
      />
    </motion.div>
  );
};
