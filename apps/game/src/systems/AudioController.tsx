/**
 * AudioManager — procedural ambient audio using Web Audio API.
 *
 * Generates all sounds via oscillators and noise (no audio files).
 * Lightweight: one AudioContext, shared across the game lifecycle.
 * Mount <AudioController /> once in the scene to activate.
 *
 * Audio zones are driven by worldStore (weather, time) and player position.
 */

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useWorldStore } from "../store/worldStore";
import { playerPos } from "../store/playerPosStore";

/* ── Audio context singleton ── */

let _ctx: AudioContext | null = null;
let _initialized = false;

function getCtx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

/* ── Noise buffer (shared) ── */

let _noiseBuffer: AudioBuffer | null = null;

function getNoiseBuffer(ctx: AudioContext, size = 4096): AudioBuffer {
  if (_noiseBuffer) return _noiseBuffer;
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  _noiseBuffer = buf;
  return buf;
}

/* ── Wind ambient ── */

class WindSound {
  private src: AudioBufferSourceNode | null = null;
  private gain: GainNode;
  private filter: BiquadFilterNode;
  private ctx: AudioContext;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.gain = ctx.createGain();
    this.gain.gain.value = 0;
    this.gain.connect(ctx.destination);

    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 400;
    this.filter.Q.value = 1;
    this.filter.connect(this.gain);

    this.start();
  }

  private start() {
    const buf = getNoiseBuffer(this.ctx);
    this.src = this.ctx.createBufferSource();
    this.src.buffer = buf;
    this.src.loop = true;
    this.src.connect(this.filter);
    this.src.start();
  }

  setIntensity(v: number) {
    // v is 0..1 mapped to wind strength
    this.gain.gain.linearRampToValueAtTime(v * 0.08, this.ctx.currentTime + 1);
    this.filter.frequency.linearRampToValueAtTime(200 + v * 600, this.ctx.currentTime + 1);
  }

  stop() {
    this.src?.stop();
    this.src?.disconnect();
    this.gain.disconnect();
    this.filter.disconnect();
  }
}

/* ── Rain ambient ── */

class RainSound {
  private gain: GainNode;
  private filter: BiquadFilterNode;
  private ctx: AudioContext;
  private srcs: AudioBufferSourceNode[] = [];

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.gain = ctx.createGain();
    this.gain.gain.value = 0;
    this.gain.connect(ctx.destination);

    this.filter = ctx.createBiquadFilter();
    this.filter.type = "highpass";
    this.filter.frequency.value = 800;
    this.filter.Q.value = 0.5;
    this.filter.connect(this.gain);

    // Two detuned noise layers for fullness
    for (let i = 0; i < 2; i++) {
      const src = ctx.createBufferSource();
      src.buffer = getNoiseBuffer(ctx);
      src.loop = true;
      src.detune.value = i * 3 - 1.5;
      src.connect(this.filter);
      src.start();
      this.srcs.push(src);
    }
  }

  setIntensity(v: number) {
    this.gain.gain.linearRampToValueAtTime(v * 0.06, this.ctx.currentTime + 0.5);
    this.filter.frequency.linearRampToValueAtTime(600 + v * 1200, this.ctx.currentTime + 0.5);
  }

  stop() {
    this.srcs.forEach((s) => { s.stop(); s.disconnect(); });
    this.gain.disconnect();
    this.filter.disconnect();
  }
}

/* ── Thunder rumble ── */

class ThunderSound {
  private ctx: AudioContext;
  private osc: OscillatorNode | null = null;
  private gain: GainNode;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.gain = ctx.createGain();
    this.gain.gain.value = 0;
    this.gain.connect(ctx.destination);
  }

  strike() {
    // Short low-frequency rumble
    this.osc = this.ctx.createOscillator();
    this.osc.type = "sawtooth";
    this.osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    this.osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.5);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.15, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

    this.osc.connect(g);
    g.connect(this.ctx.destination);
    this.osc.start();
    this.osc.stop(this.ctx.currentTime + 0.5);

    // Secondary rumble
    const osc2 = this.ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(50, this.ctx.currentTime + 0.3);
    osc2.frequency.exponentialRampToValueAtTime(15, this.ctx.currentTime + 1.2);
    const g2 = this.ctx.createGain();
    g2.gain.setValueAtTime(0.08, this.ctx.currentTime + 0.3);
    g2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
    osc2.connect(g2);
    g2.connect(this.ctx.destination);
    osc2.start(this.ctx.currentTime + 0.3);
    osc2.stop(this.ctx.currentTime + 1.2);
  }

  stop() {
    this.osc?.stop();
    this.osc?.disconnect();
    this.gain.disconnect();
  }
}

/* ── Footstep ── */

function playFootstep(ctx: AudioContext, surface: string) {
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(surface === "stone" ? 120 : 80, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.04, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.connect(g);
  g.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

/* ── District Ambient Soundscapes ── */

class DistrictSoundscape {
  private ctx: AudioContext;
  private harborOsc: OscillatorNode | null = null;
  private harborGain: GainNode;
  private marketGain: GainNode;
  private marketFilter: BiquadFilterNode;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;

    // Harbor ocean wave swell
    this.harborGain = ctx.createGain();
    this.harborGain.gain.value = 0;
    this.harborGain.connect(ctx.destination);

    this.harborOsc = ctx.createOscillator();
    this.harborOsc.type = "sine";
    this.harborOsc.frequency.value = 0.2; // 0.2 Hz wave cycle
    this.harborOsc.connect(this.harborGain);
    this.harborOsc.start();

    // Market crowd murmur filter
    this.marketGain = ctx.createGain();
    this.marketGain.gain.value = 0;
    this.marketGain.connect(ctx.destination);

    this.marketFilter = ctx.createBiquadFilter();
    this.marketFilter.type = "bandpass";
    this.marketFilter.frequency.value = 500;
    this.marketFilter.Q.value = 3;
    this.marketFilter.connect(this.marketGain);
  }

  update(playerPos: { x: number; z: number }) {
    // Harbor district check: z > 30
    const harborDist = Math.max(0, 1 - Math.hypot(playerPos.x - 0, playerPos.z - 40) / 45);
    this.harborGain.gain.setTargetAtTime(harborDist * 0.04, this.ctx.currentTime, 1);

    // Market district check: x~22, z~6
    const marketDist = Math.max(0, 1 - Math.hypot(playerPos.x - 22, playerPos.z - 6) / 30);
    this.marketGain.gain.setTargetAtTime(marketDist * 0.03, this.ctx.currentTime, 1);
  }

  stop() {
    this.harborOsc?.stop();
    this.harborOsc?.disconnect();
    this.harborGain.disconnect();
    this.marketGain.disconnect();
    this.marketFilter.disconnect();
  }
}

/* ── Controller component ── */

/**
 * AudioController — mounts ambient audio processing. One instance in the scene.
 * Starts muted; user interaction (click) unmutes.
 */
export function AudioController({ enabled = true }: { enabled?: boolean }) {
  const soundsRef = useRef<{
    wind: WindSound | null;
    rain: RainSound | null;
    thunder: ThunderSound | null;
    district: DistrictSoundscape | null;
  }>({ wind: null, rain: null, thunder: null, district: null });
  const stepAccRef = useRef(0);
  const thunderTimerRef = useRef(0);

  // Init on mount
  useEffect(() => {
    if (!enabled) return;
    const ctx = getCtx();
    const wind = new WindSound(ctx);
    const rain = new RainSound(ctx);
    const thunder = new ThunderSound(ctx);
    const district = new DistrictSoundscape(ctx);
    soundsRef.current = { wind, rain, thunder, district };

    return () => {
      wind.stop();
      rain.stop();
      thunder.stop();
      district.stop();
    };
  }, [enabled]);

  // Frame tick: update ambient levels, footstep detection
  useFrame((_, dt) => {
    if (!enabled) return;
    const weather = useWorldStore.getState().weather;
    const { wind, rain, thunder, district } = soundsRef.current;
    if (!wind || !rain || !thunder) return;

    // Wind from weather state
    const windAmt = weather.rainIntensity > 0.5 ? 0.6 + weather.rainIntensity * 0.4 : weather.cloudCover * 0.5;
    wind.setIntensity(windAmt);

    // Rain
    rain.setIntensity(weather.rainIntensity);

    // District soundscape based on player position
    const pp = playerPos.get();
    if (district && pp) {
      district.update({ x: pp.x, z: pp.z });
    }

    // Thunder
    if (weather.lightningFreq > 0) {
      thunderTimerRef.current -= dt;
      if (thunderTimerRef.current <= 0) {
        thunderTimerRef.current = 60 / weather.lightningFreq * (2 + Math.random() * 5);
        thunder.strike();
      }
    }

    // Footsteps
    stepAccRef.current += dt;
    if (stepAccRef.current > 0.45) {
      stepAccRef.current = 0;
      const surface = "stone";
      playFootstep(getCtx(), surface);
    }
  });

  return null;
}
