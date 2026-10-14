/**
 * GERE SZABADSÁGON - Web Audio API Lo-Fi & Ambient Engine
 * Pure synthesized royalty-free lo-fi beats, jazz chords, tape flutter & ambient soundscapes.
 */

class LoFiAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    
    // Master & Sound Volumes (Soft, cozy lo-fi background level)
    this.masterVolume = 0.35;
    this.musicVolume = 0.75;
    this.isMuted = false;
    this.previousVolume = 0.35;

    // Default Lo-Fi Track
    this.tracks = [
      {
        title: "Late Night Code & Chill",
        artist: "Gere szabadságon • Lo-Fi Beats",
        bpm: 74,
        scale: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88],
        chords: [
          [261.63, 329.63, 392.00, 493.88], // Cmaj7
          [220.00, 261.63, 329.63, 392.00], // Am7
          [293.66, 349.23, 440.00, 523.25], // Dm7
          [196.00, 246.94, 293.66, 349.23, 440.00] // G9
        ],
        bass: [130.81, 110.00, 146.83, 98.00]
      }
    ];

    this.timerId = null;
    this.currentStep = 0;
    this.stepInterval = null;
  }

  initContext() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Music bus
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

  }

  // Tape Flutter & Rhodes-like Lo-Fi Keyboard Note
  playPianoNote(freq, time, duration = 1.4, velocity = 0.5) {
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const noteGain = this.ctx.createGain();

    // Electric Piano style: Sine + Triangle with slight warm detune
    osc1.type = "sine";
    osc2.type = "triangle";

    // Tape wow/flutter LFO
    const flutterLFO = this.ctx.createOscillator();
    const flutterGain = this.ctx.createGain();
    flutterLFO.frequency.setValueAtTime(3.8 + Math.random() * 0.8, time);
    flutterGain.gain.setValueAtTime(1.8, time); // detune in Hz
    flutterLFO.connect(flutterGain);
    flutterGain.connect(osc1.frequency);
    flutterGain.connect(osc2.frequency);
    flutterLFO.start(time);
    flutterLFO.stop(time + duration);

    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.002, time);

    // Warm Lowpass Filter (Lo-Fi characteristic cut at 900-1400 Hz)
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1100, time);
    filter.frequency.exponentialRampToValueAtTime(700, time + duration);

    // Velocity & Decay Envelope
    const attack = 0.02;
    const decay = duration * 0.9;
    noteGain.gain.setValueAtTime(0.001, time);
    noteGain.gain.linearRampToValueAtTime(velocity * 0.22, time + attack);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + attack + decay);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.musicGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  }

  // Warm Sub-bass
  playBassNote(freq, time, duration = 1.8) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(220, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.28, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Soft Lo-Fi Kick Drum
  playKick(time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(115, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.15);

    gain.gain.setValueAtTime(0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.28);
  }

  // Soft Rimshot / Lo-Fi Snare
  playSnare(time) {
    if (!this.ctx) return;
    // White noise burst
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.03));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.28, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(time);
  }

  // Brushed Hi-Hat with Lo-Fi Swing
  playHiHat(time) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.012));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(6500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(time);
  }

  // Beat & Chord Sequence Loop
  scheduleBeat() {
    if (!this.isPlaying || !this.ctx) return;

    const track = this.tracks[this.currentTrackIndex];
    const beatDuration = 60 / track.bpm;
    const now = this.ctx.currentTime;

    const bar = Math.floor(this.currentStep / 4) % track.chords.length;
    const beatInBar = this.currentStep % 4;

    // Trigger chords on beat 0 and subtle chord variation on beat 2.5
    if (beatInBar === 0) {
      const chord = track.chords[bar];
      const bassFreq = track.bass[bar];
      
      // Play bass note
      this.playBassNote(bassFreq, now, beatDuration * 3.8);

      // Play chord notes with slight humanized arpeggio
      chord.forEach((freq, idx) => {
        const humanDelay = idx * 0.024 + (Math.random() * 0.008);
        this.playPianoNote(freq, now + humanDelay, beatDuration * 3.6, 0.55);
      });
    }

    // Drum Pattern:
    // Beat 0: Kick
    // Beat 1: Snare / Rimshot
    // Beat 2: Subtle Kick (syncopated)
    // Beat 3: Snare
    if (beatInBar === 0) {
      this.playKick(now);
      this.playHiHat(now);
    } else if (beatInBar === 1) {
      this.playSnare(now);
      this.playHiHat(now);
    } else if (beatInBar === 2) {
      if (Math.random() > 0.3) this.playKick(now + beatDuration * 0.48); // Swing kick
      this.playHiHat(now);
    } else if (beatInBar === 3) {
      this.playSnare(now);
      this.playHiHat(now);
      if (Math.random() > 0.4) this.playHiHat(now + beatDuration * 0.52); // Swing extra hat
    }

    this.currentStep++;
    this.stepTimeout = setTimeout(() => {
      this.scheduleBeat();
    }, beatDuration * 1000);
  }


  // ==========================================
  // PUBLIC CONTROLS
  // ==========================================
  async start() {
    this.initContext();
    if (this.ctx && this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch (err) {
        // Autoplay blocked by browser policy until user gesture
        return false;
      }
    }
    if (this.ctx && this.ctx.state === "running") {
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.scheduleBeat();
      }
      return true;
    }
    return false;
  }

  isAudioRunning() {
    return !!(this.ctx && this.ctx.state === "running" && this.isPlaying);
  }

  stop() {
    this.isPlaying = false;
    clearTimeout(this.stepTimeout);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.currentStep = 0;
    return this.getCurrentTrack();
  }

  prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.currentStep = 0;
    return this.getCurrentTrack();
  }

  getCurrentTrack() {
    return this.tracks[this.currentTrackIndex];
  }

  setMasterVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterVolume > 0) {
      this.isMuted = false;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.previousVolume = this.masterVolume > 0 ? this.masterVolume : 0.7;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    } else {
      const restore = this.previousVolume > 0 ? this.previousVolume : 0.7;
      this.masterVolume = restore;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(restore, this.ctx.currentTime);
      }
    }
    return this.isMuted;
  }

}

// Global instance
window.lofiAudio = new LoFiAudioEngine();
