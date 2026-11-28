// Web Audio API study audio synthesis:
// Brown noise, 40Hz binaural beats, and warm lo-fi ambient chords.
// Zero external asset dependencies — immune to CORS or broken CDN URLs.

let audioCtx = null;
let activeNodes = [];
let masterGain = null;
let activeGainMultiplier = 0.42;
let lofiTimerId = null;

function getAudioContext() {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function createMasterBus(ctx, volume, gainMultiplier) {
  activeGainMultiplier = gainMultiplier;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume * activeGainMultiplier, ctx.currentTime);

  // Soft limiter prevents clipping even at 100% slider while keeping audio clearly audible
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-6, ctx.currentTime);
  compressor.knee.setValueAtTime(12, ctx.currentTime);
  compressor.ratio.setValueAtTime(4, ctx.currentTime);
  compressor.attack.setValueAtTime(0.01, ctx.currentTime);
  compressor.release.setValueAtTime(0.15, ctx.currentTime);

  gain.connect(compressor);
  compressor.connect(ctx.destination);

  masterGain = gain;
  activeNodes.push(gain, compressor);
  return gain;
}

function stopAllNodes() {
  if (lofiTimerId) {
    clearInterval(lofiTimerId);
    lofiTimerId = null;
  }

  activeNodes.forEach((node) => {
    try {
      node.stop?.();
      node.disconnect?.();
    } catch {
      // Ignore already stopped Web Audio nodes
    }
  });
  activeNodes = [];
  masterGain = null;
}

/**
 * Generates warm brown noise using Web Audio API.
 * Tuned with gentle low-mid presence so it stays clearly audible on laptop speakers.
 */
function startBrownNoise(volume = 0.75) {
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + 0.045 * white) / 1.045;
    lastOut = data[i];
    data[i] *= 2.4;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(620, ctx.currentTime);

  const bus = createMasterBus(ctx, volume, 0.42);
  source.connect(filter);
  filter.connect(bus);
  source.start();

  activeNodes.push(source, filter);
}

/**
 * Generates 40Hz binaural beats.
 * Left ear: 200Hz carrier, Right ear: 240Hz carrier → 40Hz beat perceived.
 * 40Hz gamma is associated with focused attention (Thut et al., 2012).
 */
function startBinauralBeats(volume = 0.75) {
  const ctx = getAudioContext();
  const merger = ctx.createChannelMerger(2);
  const bus = createMasterBus(ctx, volume, 0.28);

  const leftOsc = ctx.createOscillator();
  leftOsc.frequency.setValueAtTime(200, ctx.currentTime);
  leftOsc.type = 'sine';

  const leftGain = ctx.createGain();
  leftGain.gain.setValueAtTime(0.7, ctx.currentTime);
  leftOsc.connect(leftGain);
  leftGain.connect(merger, 0, 0);

  const rightOsc = ctx.createOscillator();
  rightOsc.frequency.setValueAtTime(240, ctx.currentTime);
  rightOsc.type = 'sine';

  const rightGain = ctx.createGain();
  rightGain.gain.setValueAtTime(0.7, ctx.currentTime);
  rightOsc.connect(rightGain);
  rightGain.connect(merger, 0, 1);

  merger.connect(bus);

  leftOsc.start();
  rightOsc.start();

  activeNodes.push(leftOsc, rightOsc, leftGain, rightGain, merger);
}

/**
 * Synthesizes a mellow lo-fi chill chord progression (Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
 * passed through a warm low-pass filter, plus a soft root bass note.
 */
function startLofiSynth(volume = 0.75) {
  const ctx = getAudioContext();
  const bus = createMasterBus(ctx, volume, 0.85);

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(1050, ctx.currentTime);
  lowpass.Q.setValueAtTime(0.65, ctx.currentTime);

  lowpass.connect(bus);
  activeNodes.push(lowpass);

  // Warm lo-fi seventh chord voicings in Hz
  const chords = [
    [174.61, 220.0, 261.63, 329.63], // Fmaj7
    [164.81, 196.0, 246.94, 293.66], // Em7
    [146.83, 174.61, 220.0, 261.63], // Dm7
    [130.81, 164.81, 196.0, 246.94], // Cmaj7
  ];
  let chordIdx = 0;
  const beatSeconds = 3.2;

  const scheduleChord = () => {
    if (!audioCtx || audioCtx.state === 'closed') return;
    const now = ctx.currentTime;
    const notes = chords[chordIdx % chords.length];
    chordIdx += 1;

    // Warm chord voices
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((idx % 2 === 0 ? 1 : -1) * 5, now);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, now);
      env.gain.exponentialRampToValueAtTime(0.75 / notes.length, now + 0.35);
      env.gain.exponentialRampToValueAtTime(0.55 / notes.length, now + beatSeconds - 0.5);
      env.gain.exponentialRampToValueAtTime(0.0001, now + beatSeconds);

      osc.connect(env);
      env.connect(lowpass);
      osc.start(now);
      osc.stop(now + beatSeconds + 0.05);
    });

    // Subtle warm bass root note for fullness
    const bassOsc = ctx.createOscillator();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(notes[0] * 0.5, now);

    const bassEnv = ctx.createGain();
    bassEnv.gain.setValueAtTime(0.0001, now);
    bassEnv.gain.exponentialRampToValueAtTime(0.28, now + 0.25);
    bassEnv.gain.exponentialRampToValueAtTime(0.18, now + beatSeconds - 0.45);
    bassEnv.gain.exponentialRampToValueAtTime(0.0001, now + beatSeconds);

    bassOsc.connect(bassEnv);
    bassEnv.connect(lowpass);
    bassOsc.start(now);
    bassOsc.stop(now + beatSeconds + 0.05);
  };

  scheduleChord();
  lofiTimerId = setInterval(scheduleChord, beatSeconds * 1000);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Starts the appropriate audio for the given music type.
 * @param {'brown_noise'|'binaural'|'lofi'|'off'} type
 * @param {number} volume - 0 to 1
 */
export function startMusic(type, volume = 0.75) {
  stopMusic();

  if (type === 'off' || !type) return;

  if (type === 'brown_noise') {
    startBrownNoise(volume);
  } else if (type === 'binaural') {
    startBinauralBeats(volume);
  } else if (type === 'lofi') {
    startLofiSynth(volume);
  }
}

/**
 * Stops all active study audio cleanly.
 */
export function stopMusic() {
  stopAllNodes();

  if (audioCtx && audioCtx.state !== 'closed') {
    audioCtx.suspend().catch(() => {});
  }
}

/**
 * Updates the master volume of running audio (0 to 1).
 */
export function setMusicVolume(volume) {
  const clamped = Math.max(0, Math.min(1, volume));
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(
      clamped * activeGainMultiplier,
      audioCtx.currentTime
    );
  }
}

export const MUSIC_LABELS = {
  off: 'No music',
  brown_noise: 'Brown noise',
  lofi: 'Lo-fi ambient chords',
  binaural: 'Binaural beats (use headphones)',
};
