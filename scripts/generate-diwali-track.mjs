import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sampleRate = 22_050;
const tempo = 120;
const beatLength = 60 / tempo;
const beatCount = 32;
const duration = beatLength * beatCount;
const sampleCount = Math.ceil(sampleRate * duration);
const samples = new Float64Array(sampleCount);
const melody = [392, 523.25, 587.33, 659.25, 587.33, 523.25, 440, 392, 392, 523.25, 659.25, 783.99, 880, 783.99, 659.25, 587.33, 523.25, 659.25, 783.99, 880, 783.99, 659.25, 587.33, 523.25, 440, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 392];
const chords = [
  [130.81, 164.81, 196],
  [130.81, 174.61, 220],
  [98, 123.47, 146.83],
  [130.81, 164.81, 196],
  [110, 130.81, 164.81],
  [130.81, 174.61, 220],
  [98, 123.47, 146.83],
  [130.81, 164.81, 196],
];

function add(sampleIndex, value) {
  if (sampleIndex >= 0 && sampleIndex < samples.length) samples[sampleIndex] += value;
}

for (let index = 0; index < sampleCount; index += 1) {
  const time = index / sampleRate;
  const beat = Math.floor(time / beatLength);
  const beatTime = time - beat * beatLength;
  const chordIndex = Math.min(chords.length - 1, Math.floor(time / 2));
  const chordTime = time - chordIndex * 2;
  const blend = Math.min(1, chordTime / 0.22);
  let value = 0;

  for (const [noteIndex, frequency] of chords[chordIndex].entries()) {
    const chordGain = (noteIndex === 0 ? 0.065 : 0.038) * blend;
    value += chordGain * (Math.sin(2 * Math.PI * frequency * time) + 0.14 * Math.sin(4 * Math.PI * frequency * time));
  }

  const melodyEnvelope = Math.exp(-4.8 * beatTime) * Math.min(1, beatTime / 0.012);
  const melodyFrequency = melody[beat % melody.length];
  value += 0.2 * melodyEnvelope * Math.sin(2 * Math.PI * melodyFrequency * time);
  value += 0.045 * melodyEnvelope * Math.sin(2 * Math.PI * melodyFrequency * 2.72 * time);

  if (beat % 4 === 0) {
    const pulse = Math.exp(-24 * beatTime) * Math.min(1, beatTime / 0.006);
    value += 0.12 * pulse * Math.sin(2 * Math.PI * (92 - 24 * beatTime) * beatTime);
  }

  // Tiny loop-edge fade keeps the repeating instrumental smooth on mobile speakers.
  const edgeFade = Math.min(1, time / 0.045, (duration - time) / 0.045);
  add(index, value * Math.max(0, edgeFade));
}

let peak = 0;
for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
const scale = 0.82 / peak;
const wav = Buffer.alloc(44 + sampleCount * 2);
wav.write("RIFF", 0);
wav.writeUInt32LE(36 + sampleCount * 2, 4);
wav.write("WAVE", 8);
wav.write("fmt ", 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(sampleCount * 2, 40);

for (let index = 0; index < sampleCount; index += 1) {
  const sample = Math.max(-1, Math.min(1, samples[index] * scale));
  wav.writeInt16LE(Math.round(sample * 32767), 44 + index * 2);
}

const output = resolve(root, "public/audio/diwali-instrumental.wav");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, wav);
console.log(`Generated ${output} (${(wav.length / 1024).toFixed(0)} KB)`);
