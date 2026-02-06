/**
 * QQUIZ PRODIGY - Sound System
 * Système audio complet pour une expérience immersive
 * Sons générés par Web Audio API (pas de fichiers externes)
 */

class SoundSystem {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    this.enabled = localStorage.getItem('qquiz_sound_enabled') !== 'false';
    const savedVolume = localStorage.getItem('qquiz_sound_volume');
    if (savedVolume) this.volume = parseFloat(savedVolume);
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('qquiz_sound_enabled', String(enabled));
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('qquiz_sound_volume', String(this.volume));
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getVolume(): number {
    return this.volume;
  }

  // Son de bonne réponse - accord majeur ascendant
  playCorrect() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(this.volume * 0.3, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.35);
    });
  }

  // Son de mauvaise réponse - accord mineur descendant
  playWrong() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(200, now + 0.3);
    gain.gain.setValueAtTime(this.volume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  // Son de tick du timer
  playTick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(this.volume * 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Son d'urgence du timer (dernières 3 secondes)
  playTimerUrgent() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(this.volume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Son de level up - fanfare ascendante
  playLevelUp() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const notes = [523.25, 587.33, 659.25, 783.99, 1046.5]; // C5 D5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(this.volume * 0.25, now + i * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.45);
    });
  }

  // Son de combo
  playCombo(comboLevel: number) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const baseFreq = 440 + comboLevel * 100;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, now + 0.15);
    gain.gain.setValueAtTime(this.volume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Son de clic sur bouton
  playClick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(this.volume * 0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Son de victoire - fanfare complète
  playVictory() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const melody = [
      { freq: 523.25, time: 0, dur: 0.15 },
      { freq: 659.25, time: 0.15, dur: 0.15 },
      { freq: 783.99, time: 0.3, dur: 0.15 },
      { freq: 1046.5, time: 0.45, dur: 0.4 },
      { freq: 783.99, time: 0.65, dur: 0.15 },
      { freq: 1046.5, time: 0.8, dur: 0.5 },
    ];

    melody.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, now + note.time);
      gain.gain.setValueAtTime(0, now + note.time);
      gain.gain.linearRampToValueAtTime(this.volume * 0.25, now + note.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + note.time);
      osc.stop(now + note.time + note.dur + 0.05);
    });
  }

  // Son de défaite
  playDefeat() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const notes = [392, 349.23, 329.63, 261.63]; // G4 F4 E4 C4
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.2);
      gain.gain.setValueAtTime(0, now + i * 0.2);
      gain.gain.linearRampToValueAtTime(this.volume * 0.2, now + i * 0.2 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.2);
      osc.stop(now + i * 0.2 + 0.4);
    });
  }

  // Son de countdown (3, 2, 1, GO!)
  playCountdown(number: number) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const freq = number === 0 ? 1046.5 : 440; // GO! = high pitch
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = number === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(this.volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (number === 0 ? 0.5 : 0.2));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (number === 0 ? 0.55 : 0.25));
  }

  // Son de notification
  playNotification() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    [880, 1108.73].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(this.volume * 0.15, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.25);
    });
  }

  // Son de sélection de catégorie
  playSelect() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.linearRampToValueAtTime(700, now + 0.1);
    gain.gain.setValueAtTime(this.volume * 0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Son de XP gagné (petit ding)
  playXP() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    gain.gain.setValueAtTime(this.volume * 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Son de badge débloqué
  playBadgeUnlocked() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const notes = [523.25, 783.99, 1046.5, 1318.5]; // C5 G5 C6 E6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(this.volume * 0.2, now + i * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.55);
    });
  }
}

// Singleton
export const soundSystem = new SoundSystem();
export default soundSystem;
