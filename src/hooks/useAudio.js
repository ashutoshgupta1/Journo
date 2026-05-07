import { useCallback, useRef, useState } from 'react';
import { tracks } from '../lib/constants.js';

function audioContext() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  return Ctx ? new Ctx() : null;
}

export function useAudio() {
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);
  const tickerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0.35);
  const [trackIndex, setTrackIndex] = useState(0);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = audioContext();
    if (ctxRef.current?.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const stopMusic = useCallback((fade = 0.8) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    nodesRef.current.forEach((node) => {
      if (node.gain) {
        node.gain.setValueAtTime(node.gain.value, ctx.currentTime);
        node.gain.linearRampToValueAtTime(0, ctx.currentTime + fade);
      }
      try {
        node.stop?.(ctx.currentTime + fade + 0.05);
      } catch {}
    });
    nodesRef.current = [];
  }, []);

  const buildPad = useCallback((ctx, track) => {
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 2.5);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1800;
    lp.Q.value = 0.8;

    const third = track.mode === 'minor' ? 1.1892 : 1.2599;
    [track.key * 0.5, track.key, track.key * third, track.key * 1.4983].forEach((frequency, index) => {
      [-2.5, 2.5].forEach((detune) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = ['sine', 'triangle', 'sine', 'triangle'][index];
        osc.frequency.value = frequency;
        osc.detune.value = detune + (Math.random() - 0.5) * 1.5;
        gain.gain.value = [0.25, 0.18, 0.14, 0.11][index];
        osc.connect(gain);
        gain.connect(lp);
        osc.start();
        nodesRef.current.push(osc);
      });
    });

    lp.connect(master);
    master.connect(ctx.destination);
    nodesRef.current.push(master);
  }, []);

  const startMusic = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    stopMusic(0.3);
    window.setTimeout(() => buildPad(ctx, tracks[trackIndex]), 350);
    setIsPlaying(true);
    window.clearInterval(tickerRef.current);
    tickerRef.current = window.setInterval(() => {
      setProgress((current) => {
        const next = current >= 0.995 ? 0 : current + 1 / 180;
        if (next === 0) {
          setTrackIndex((index) => (index + 1) % tracks.length);
        }
        return next;
      });
    }, 1000);
  }, [buildPad, getCtx, stopMusic, trackIndex]);

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      stopMusic();
      window.clearInterval(tickerRef.current);
    } else {
      startMusic();
    }
  }, [isPlaying, startMusic, stopMusic]);

  const playClick = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const time = ctx.currentTime;
    const master = ctx.createGain();
    const tick = ctx.createOscillator();
    const gain = ctx.createGain();
    master.gain.setValueAtTime(0.18, time);
    tick.type = 'square';
    tick.frequency.setValueAtTime(1600, time);
    tick.frequency.exponentialRampToValueAtTime(700, time + 0.014);
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(1, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
    tick.connect(gain);
    gain.connect(master);
    master.connect(ctx.destination);
    tick.start(time);
    tick.stop(time + 0.04);
  }, [getCtx]);

  const playPageFlip = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const time = ctx.currentTime;
    const master = ctx.createGain();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.42, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      const p = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.sin(p * Math.PI) * (1 - p * 0.35);
    }
    const source = ctx.createBufferSource();
    const lowpass = ctx.createBiquadFilter();
    source.buffer = buffer;
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(3200, time);
    lowpass.frequency.exponentialRampToValueAtTime(900, time + 0.38);
    master.gain.setValueAtTime(0.18, time);
    master.gain.exponentialRampToValueAtTime(0.001, time + 0.42);
    source.connect(lowpass);
    lowpass.connect(master);
    master.connect(ctx.destination);
    source.start(time);
    source.stop(time + 0.42);
  }, [getCtx]);

  return {
    isPlaying,
    playClick,
    playPageFlip,
    progress,
    setProgress,
    trackName: tracks[trackIndex].name,
    toggleMusic,
  };
}
