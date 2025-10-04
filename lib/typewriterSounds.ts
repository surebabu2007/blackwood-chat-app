/**
 * Advanced Typewriter Sound System
 * Generates realistic typewriter sounds using Web Audio API
 */

export class TypewriterSoundSystem {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isEnabled: boolean = true;
  private volume: number = 0.3;
  private pitch: number = 1.0;

  constructor(options: { enabled?: boolean; volume?: number; pitch?: number } = {}) {
    this.isEnabled = options.enabled ?? true;
    this.volume = options.volume ?? 0.3;
    this.pitch = options.pitch ?? 1.0;
  }

  private async initAudioContext(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.volume;
    }

    // Resume audio context if suspended (required for user interaction)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Play a typing sound for each character - Authentic 1947 typewriter
   */
  async playTypingSound(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await this.initAudioContext();
      if (!this.audioContext || !this.gainNode) return;

      const now = this.audioContext.currentTime;
      
      // Create the main typewriter strike sound (key hitting paper)
      const mainOscillator = this.audioContext.createOscillator();
      const mainGain = this.audioContext.createGain();
      mainOscillator.connect(mainGain);
      mainGain.connect(this.gainNode);

      // Low frequency thud (key mechanism hitting paper)
      mainOscillator.frequency.value = 120 * this.pitch + Math.random() * 20;
      mainOscillator.type = 'square';
      
      const duration = 0.08 + Math.random() * 0.02;
      const mainVolume = this.volume * (0.8 + Math.random() * 0.2);
      
      // Sharp attack, quick decay
      mainGain.gain.setValueAtTime(0, now);
      mainGain.gain.linearRampToValueAtTime(mainVolume, now + 0.001);
      mainGain.gain.exponentialRampToValueAtTime(mainVolume * 0.1, now + 0.01);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      mainOscillator.start(now);
      mainOscillator.stop(now + duration);

      // Create the mechanical click sound (typebar mechanism)
      const clickOscillator = this.audioContext.createOscillator();
      const clickGain = this.audioContext.createGain();
      clickOscillator.connect(clickGain);
      clickGain.connect(this.gainNode);

      // Higher frequency click
      clickOscillator.frequency.value = 800 * this.pitch + Math.random() * 100;
      clickOscillator.type = 'triangle';
      
      const clickDuration = 0.02 + Math.random() * 0.01;
      const clickVolume = this.volume * 0.3 * (0.7 + Math.random() * 0.3);
      
      // Very sharp click
      clickGain.gain.setValueAtTime(0, now + 0.005); // Slightly delayed
      clickGain.gain.linearRampToValueAtTime(clickVolume, now + 0.006);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.005 + clickDuration);

      clickOscillator.start(now + 0.005);
      clickOscillator.stop(now + 0.005 + clickDuration);

      // Create paper rustle sound (very subtle)
      const paperOscillator = this.audioContext.createOscillator();
      const paperGain = this.audioContext.createGain();
      const paperFilter = this.audioContext.createBiquadFilter();
      
      paperOscillator.connect(paperFilter);
      paperFilter.connect(paperGain);
      paperGain.connect(this.gainNode);

      // Very low frequency rustle
      paperOscillator.frequency.value = 40 * this.pitch + Math.random() * 10;
      paperOscillator.type = 'sawtooth';
      paperFilter.type = 'lowpass';
      paperFilter.frequency.value = 200;
      
      const paperDuration = 0.15;
      const paperVolume = this.volume * 0.1 * (0.5 + Math.random() * 0.5);
      
      // Gentle paper rustle
      paperGain.gain.setValueAtTime(0, now + 0.01);
      paperGain.gain.linearRampToValueAtTime(paperVolume, now + 0.02);
      paperGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01 + paperDuration);

      paperOscillator.start(now + 0.01);
      paperOscillator.stop(now + 0.01 + paperDuration);

      // Clean up
      [mainOscillator, clickOscillator, paperOscillator].forEach(osc => {
        osc.onended = () => {
          osc.disconnect();
        };
      });

    } catch (error) {
      console.warn('Failed to play typing sound:', error);
    }
  }

  /**
   * Play carriage return sound (for new lines/messages) - Authentic 1947 carriage return
   */
  async playCarriageReturnSound(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await this.initAudioContext();
      if (!this.audioContext || !this.gainNode) return;

      const now = this.audioContext.currentTime;
      
      // Create the main carriage return mechanism sound
      const mainOscillator = this.audioContext.createOscillator();
      const mainGain = this.audioContext.createGain();
      mainOscillator.connect(mainGain);
      mainGain.connect(this.gainNode);

      // Deep mechanical sound of carriage mechanism
      mainOscillator.frequency.value = 80 * this.pitch;
      mainOscillator.type = 'sawtooth';
      
      const duration = 0.15;
      const mainVolume = this.volume * 0.7;
      
      // Gradual build-up and release (carriage moving)
      mainGain.gain.setValueAtTime(0, now);
      mainGain.gain.linearRampToValueAtTime(mainVolume, now + 0.02);
      mainGain.gain.setValueAtTime(mainVolume, now + 0.08);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      mainOscillator.start(now);
      mainOscillator.stop(now + duration);

      // Create the bell ding sound (end of line bell)
      const bellOscillator = this.audioContext.createOscillator();
      const bellGain = this.audioContext.createGain();
      const bellFilter = this.audioContext.createBiquadFilter();
      
      bellOscillator.connect(bellFilter);
      bellFilter.connect(bellGain);
      bellGain.connect(this.gainNode);

      // Bell frequency
      bellOscillator.frequency.value = 600 * this.pitch;
      bellOscillator.type = 'sine';
      bellFilter.type = 'bandpass';
      bellFilter.frequency.value = 600;
      bellFilter.Q.value = 2;
      
      const bellDuration = 0.08;
      const bellVolume = this.volume * 0.5;
      
      // Bell envelope (quick ding)
      bellGain.gain.setValueAtTime(0, now + 0.1);
      bellGain.gain.linearRampToValueAtTime(bellVolume, now + 0.11);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1 + bellDuration);

      bellOscillator.start(now + 0.1);
      bellOscillator.stop(now + 0.1 + bellDuration);

      // Create paper advance sound (subtle)
      const paperOscillator = this.audioContext.createOscillator();
      const paperGain = this.audioContext.createGain();
      
      paperOscillator.connect(paperGain);
      paperGain.connect(this.gainNode);

      // Paper rustle during carriage return
      paperOscillator.frequency.value = 60 * this.pitch;
      paperOscillator.type = 'sawtooth';
      
      const paperDuration = 0.12;
      const paperVolume = this.volume * 0.15;
      
      paperGain.gain.setValueAtTime(0, now + 0.05);
      paperGain.gain.linearRampToValueAtTime(paperVolume, now + 0.07);
      paperGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05 + paperDuration);

      paperOscillator.start(now + 0.05);
      paperOscillator.stop(now + 0.05 + paperDuration);

      // Clean up
      [mainOscillator, bellOscillator, paperOscillator].forEach(osc => {
        osc.onended = () => {
          osc.disconnect();
        };
      });

    } catch (error) {
      console.warn('Failed to play carriage return sound:', error);
    }
  }

  /**
   * Play bell sound (for system notifications) - Authentic 1947 typewriter bell
   */
  async playBellSound(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await this.initAudioContext();
      if (!this.audioContext || !this.gainNode) return;

      const now = this.audioContext.currentTime;
      
      // Create the main bell sound (typewriter margin bell)
      const bellOscillator = this.audioContext.createOscillator();
      const bellGain = this.audioContext.createGain();
      const bellFilter = this.audioContext.createBiquadFilter();
      
      bellOscillator.connect(bellFilter);
      bellFilter.connect(bellGain);
      bellGain.connect(this.gainNode);

      // Bell frequency (authentic typewriter bell)
      bellOscillator.frequency.value = 800 * this.pitch;
      bellOscillator.type = 'sine';
      bellFilter.type = 'bandpass';
      bellFilter.frequency.value = 800;
      bellFilter.Q.value = 1.5;
      
      const duration = 0.2;
      const bellVolume = this.volume * 0.6;
      
      // Bell envelope (quick strike, gentle decay)
      bellGain.gain.setValueAtTime(0, now);
      bellGain.gain.linearRampToValueAtTime(bellVolume, now + 0.002);
      bellGain.gain.exponentialRampToValueAtTime(bellVolume * 0.3, now + 0.05);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      bellOscillator.start(now);
      bellOscillator.stop(now + duration);

      // Create subtle harmonic for richer bell sound
      const harmonicOscillator = this.audioContext.createOscillator();
      const harmonicGain = this.audioContext.createGain();
      
      harmonicOscillator.connect(harmonicGain);
      harmonicGain.connect(this.gainNode);

      // Harmonic frequency
      harmonicOscillator.frequency.value = 1600 * this.pitch;
      harmonicOscillator.type = 'sine';
      
      const harmonicDuration = 0.15;
      const harmonicVolume = this.volume * 0.2;
      
      // Subtle harmonic
      harmonicGain.gain.setValueAtTime(0, now);
      harmonicGain.gain.linearRampToValueAtTime(harmonicVolume, now + 0.003);
      harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + harmonicDuration);

      harmonicOscillator.start(now);
      harmonicOscillator.stop(now + harmonicDuration);

      // Clean up
      [bellOscillator, harmonicOscillator].forEach(osc => {
        osc.onended = () => {
          osc.disconnect();
        };
      });

    } catch (error) {
      console.warn('Failed to play bell sound:', error);
    }
  }

  /**
   * Play error sound (for offline characters) - Typewriter jam/error sound
   */
  async playErrorSound(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await this.initAudioContext();
      if (!this.audioContext || !this.gainNode) return;

      const now = this.audioContext.currentTime;
      
      // Create the main error sound (typewriter jam)
      const mainOscillator = this.audioContext.createOscillator();
      const mainGain = this.audioContext.createGain();
      const mainFilter = this.audioContext.createBiquadFilter();
      
      mainOscillator.connect(mainFilter);
      mainFilter.connect(mainGain);
      mainGain.connect(this.gainNode);

      // Low frequency rumble (mechanical jam)
      mainOscillator.frequency.value = 150 * this.pitch;
      mainOscillator.type = 'sawtooth';
      mainFilter.type = 'lowpass';
      mainFilter.frequency.value = 300;
      
      const duration = 0.3;
      const mainVolume = this.volume * 0.8;
      
      // Error envelope (sharp attack, sustained, quick decay)
      mainGain.gain.setValueAtTime(0, now);
      mainGain.gain.linearRampToValueAtTime(mainVolume, now + 0.01);
      mainGain.gain.setValueAtTime(mainVolume, now + 0.15);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      mainOscillator.start(now);
      mainOscillator.stop(now + duration);

      // Create metallic clunk sound (key jam)
      const clunkOscillator = this.audioContext.createOscillator();
      const clunkGain = this.audioContext.createGain();
      
      clunkOscillator.connect(clunkGain);
      clunkGain.connect(this.gainNode);

      // Metallic clunk frequency
      clunkOscillator.frequency.value = 400 * this.pitch;
      clunkOscillator.type = 'square';
      
      const clunkDuration = 0.08;
      const clunkVolume = this.volume * 0.6;
      
      // Sharp clunk
      clunkGain.gain.setValueAtTime(0, now + 0.05);
      clunkGain.gain.linearRampToValueAtTime(clunkVolume, now + 0.06);
      clunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05 + clunkDuration);

      clunkOscillator.start(now + 0.05);
      clunkOscillator.stop(now + 0.05 + clunkDuration);

      // Clean up
      [mainOscillator, clunkOscillator].forEach(osc => {
        osc.onended = () => {
          osc.disconnect();
        };
      });

    } catch (error) {
      console.warn('Failed to play error sound:', error);
    }
  }

  /**
   * Update settings
   */
  updateSettings(options: { enabled?: boolean; volume?: number; pitch?: number }): void {
    this.isEnabled = options.enabled ?? this.isEnabled;
    this.volume = options.volume ?? this.volume;
    this.pitch = options.pitch ?? this.pitch;
    
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }

  /**
   * Enable/disable sounds
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Clean up audio context
   */
  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.gainNode = null;
    }
  }
}

// Global instance
export const typewriterSounds = new TypewriterSoundSystem({
  enabled: true,
  volume: 0.3,
  pitch: 1.0
});
