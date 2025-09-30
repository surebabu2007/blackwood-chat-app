'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center space-y-2 ${className}`}
    >
      <Loader2 className={`${sizeClasses[size]} text-blue-500 animate-spin`} />
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-400"
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
};

export const ChatLoadingSpinner: React.FC<{ characterName?: string }> = ({ characterName }) => (
  <div className="flex items-center space-x-2 p-4">
    <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
      <div className="h-3 bg-gray-700 rounded animate-pulse w-3/4"></div>
    </div>
  </div>
);
