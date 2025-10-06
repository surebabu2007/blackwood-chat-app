/**
 * Character Status Management System
 * Manages offline/online status for characters based on user behavior
 */

import { AbuseDetectionSystem } from './abuseDetection';

export interface CharacterStatus {
  characterId: string;
  isOnline: boolean;
  offlineUntil?: Date;
  offlineReason?: string;
  lastOfflineMessage?: string;
  cooldownDuration: number; // in seconds
}

export interface OfflineEvent {
  characterId: string;
  timestamp: Date;
  reason: string;
  duration: number; // in seconds
  message: string;
}

export class CharacterStatusManager {
  private static characterStatuses: Map<string, CharacterStatus> = new Map();
  private static offlineEvents: OfflineEvent[] = [];

  /**
   * Initialize character status
   */
  static initializeCharacter(characterId: string): void {
    if (!this.characterStatuses.has(characterId)) {
      this.characterStatuses.set(characterId, {
        characterId,
        isOnline: true,
        cooldownDuration: 40 // 40 seconds cooldown
      });
    }
  }

  /**
   * Check if character is online
   */
  static isCharacterOnline(characterId: string): boolean {
    const status = this.characterStatuses.get(characterId);
    if (!status) {
      this.initializeCharacter(characterId);
      return true;
    }

    // Check if offline period has expired
    if (status.offlineUntil && new Date() >= status.offlineUntil) {
      this.setCharacterOnline(characterId);
      return true;
    }

    return status.isOnline;
  }

  /**
   * Set character offline
   */
  static setCharacterOffline(
    characterId: string, 
    reason: string, 
    message: string,
    duration: number = 40
  ): void {
    const status = this.characterStatuses.get(characterId);
    if (!status) {
      this.initializeCharacter(characterId);
    }

    const offlineUntil = new Date(Date.now() + duration * 1000);
    
    this.characterStatuses.set(characterId, {
      characterId,
      isOnline: false,
      offlineUntil,
      offlineReason: reason,
      lastOfflineMessage: message,
      cooldownDuration: duration
    });

    // Record offline event
    this.offlineEvents.push({
      characterId,
      timestamp: new Date(),
      reason,
      duration,
      message
    });

    // Keep only last 50 events
    if (this.offlineEvents.length > 50) {
      this.offlineEvents = this.offlineEvents.slice(-50);
    }
  }

  /**
   * Set character online
   */
  static setCharacterOnline(characterId: string): void {
    const status = this.characterStatuses.get(characterId);
    if (!status) return;

    this.characterStatuses.set(characterId, {
      ...status,
      isOnline: true,
      offlineUntil: undefined,
      offlineReason: undefined,
      lastOfflineMessage: undefined
    });
  }

  /**
   * Get character status
   */
  static getCharacterStatus(characterId: string): CharacterStatus | null {
    return this.characterStatuses.get(characterId) || null;
  }

  /**
   * Get time remaining until character comes back online
   */
  static getTimeUntilOnline(characterId: string): number {
    const status = this.characterStatuses.get(characterId);
    if (!status || !status.offlineUntil || status.isOnline) {
      return 0;
    }

    const now = new Date();
    const remaining = Math.max(0, status.offlineUntil.getTime() - now.getTime());
    return Math.ceil(remaining / 1000); // Return seconds
  }

  /**
   * Get offline events for a character
   */
  static getOfflineEvents(characterId: string): OfflineEvent[] {
    return this.offlineEvents.filter(event => event.characterId === characterId);
  }

  /**
   * Get all offline events
   */
  static getAllOfflineEvents(): OfflineEvent[] {
    return [...this.offlineEvents];
  }

  /**
   * Check if character should be put offline based on message
   */
  static shouldPutOffline(characterId: string, message: string): {
    shouldOffline: boolean;
    reason?: string;
    message?: string;
    duration?: number;
  } {
    
    const detection = AbuseDetectionSystem.detectAbuse(message);
    
    if (detection.isAbusive || detection.isIrrelevant) {
      let duration = 40; // Default 40 seconds
      
      // Adjust duration based on severity
      if (detection.severity === 'high') {
        duration = 60; // 60 seconds for high severity
      } else if (detection.severity === 'medium') {
        duration = 45; // 45 seconds for medium severity
      }

      return {
        shouldOffline: true,
        reason: detection.reason,
        message: detection.suggestedResponse || 'Character is offended and needs a moment.',
        duration
      };
    }

    return { shouldOffline: false };
  }

  /**
   * Get status message for UI display
   */
  static getStatusMessage(characterId: string): string {
    const status = this.characterStatuses.get(characterId);
    if (!status) return 'Cooperating';

    if (status.isOnline) {
      return 'Cooperating';
    }

    const timeRemaining = this.getTimeUntilOnline(characterId);
    if (timeRemaining > 0) {
      return `Not cooperating (${timeRemaining}s)`;
    }

    return 'Cooperating';
  }

  /**
   * Get status color for UI display
   */
  static getStatusColor(characterId: string): string {
    const status = this.characterStatuses.get(characterId);
    if (!status) return 'green';

    if (status.isOnline) {
      return 'green';
    }

    const timeRemaining = this.getTimeUntilOnline(characterId);
    if (timeRemaining > 0) {
      return 'red';
    }

    return 'green';
  }

  /**
   * Reset all character statuses (for testing or reset)
   */
  static resetAllStatuses(): void {
    this.characterStatuses.clear();
    this.offlineEvents = [];
  }

  /**
   * Get offline reason for display
   */
  static getOfflineReason(characterId: string): string {
    const status = this.characterStatuses.get(characterId);
    if (!status || status.isOnline) return '';

    return status.offlineReason || 'Character is temporarily unavailable';
  }

  /**
   * Check if character is in cooldown period
   */
  static isInCooldown(characterId: string): boolean {
    const status = this.characterStatuses.get(characterId);
    if (!status) return false;

    return !status.isOnline && status.offlineUntil !== undefined && new Date() < status.offlineUntil;
  }

  /**
   * Get cooldown progress (0-1)
   */
  static getCooldownProgress(characterId: string): number {
    const status = this.characterStatuses.get(characterId);
    if (!status || !status.offlineUntil || status.isOnline) return 0;

    const now = new Date();
    const total = status.cooldownDuration * 1000;
    const elapsed = now.getTime() - (status.offlineUntil.getTime() - total);
    
    return Math.min(1, Math.max(0, elapsed / total));
  }
}
