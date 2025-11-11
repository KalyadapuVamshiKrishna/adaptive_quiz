/**
 * Sound Effects Utility
 * 
 * Provides programmatic sound generation using Web Audio API.
 * All sounds are generated in-memory without requiring external files.
 */

/**
 * Creates and initializes an AudioContext instance
 * Handles browser compatibility and user interaction requirements
 */
const getAudioContext = (() => {
  let audioContext: AudioContext | null = null;
  
  return () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
  };
})();

/**
 * Plays a success sound effect
 * Uses ascending frequency sweep for positive feedback
 */
export const playSuccessSound = () => {
  try {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Configure sound parameters
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Ascending tone: 400Hz → 800Hz
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
    
    // Fade out envelope
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    console.warn('Failed to play success sound:', error);
  }
};

/**
 * Plays an error sound effect
 * Uses descending frequency sweep for negative feedback
 */
export const playErrorSound = () => {
  try {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Descending tone: 300Hz → 150Hz
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.15);
    
    // Fade out envelope
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.25);
  } catch (error) {
    console.warn('Failed to play error sound:', error);
  }
};

/**
 * Plays a warning sound effect
 * Used for timer alerts (e.g., 10 seconds remaining)
 */
export const playWarningSound = () => {
  try {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Pulsing tone at 600Hz
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    
    // Quick pulse envelope
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    console.warn('Failed to play warning sound:', error);
  }
};

/**
 * Plays a timeout sound effect
 * Uses low, sustained tone for time expiration
 */
export const playTimeoutSound = () => {
  try {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Low sustained tone: 200Hz
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    
    // Sustained envelope
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  } catch (error) {
    console.warn('Failed to play timeout sound:', error);
  }
};

/**
 * Plays a soft click sound
 * Used for UI interactions like button clicks
 */
export const playClickSound = () => {
  try {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Short high-frequency click
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    
    // Very short envelope
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  } catch (error) {
    console.warn('Failed to play click sound:', error);
  }
};
