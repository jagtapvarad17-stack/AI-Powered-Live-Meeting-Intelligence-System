/**
 * transcriber.js
 * Sends WAV audio buffers to OpenAI Whisper API and returns transcript text.
 * Falls back to mock if OPENAI_API_KEY is not set.
 */
const { OpenAI } = require('openai');
const { Readable } = require('stream');
const FormData = require('form-data');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const MOCK_MODE = !process.env.OPENAI_API_KEY;
if (MOCK_MODE) console.warn('[Transcriber] No OPENAI_API_KEY – running in MOCK mode');

const openai = MOCK_MODE ? null : new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Write WAV header + raw PCM so Whisper accepts it
function buildWav(pcmBuffer, sampleRate = 16000, channels = 1, bitDepth = 16) {
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);          // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * bitDepth / 8, 28);
  header.writeUInt16LE(channels * bitDepth / 8, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcmBuffer]);
}

// Mock sentences for demo
const MOCK_PHRASES = [
  "Let's discuss the Q3 roadmap and finalize the deliverables.",
  "John will handle the backend API integration by Friday.",
  "I will prepare the design mockups before tomorrow's standup.",
  "Assign the testing phase to the QA team.",
  "We need to resolve the latency issues in the EU cluster.",
  "Sarah will coordinate with the marketing team.",
  "Action item: update the product documentation this week.",
];
let mockIdx = 0;

async function transcribeChunk(audioBuffer) {
  if (MOCK_MODE) {
    // cycle through mock phrases for demo
    await new Promise(r => setTimeout(r, 800)); // simulate latency
    const text = MOCK_PHRASES[mockIdx % MOCK_PHRASES.length];
    mockIdx++;
    return text;
  }

  try {
    const wav = buildWav(audioBuffer);
    const readable = Readable.from(wav);
    readable.path = 'audio.wav'; // Whisper needs a filename hint

    const response = await openai.audio.transcriptions.create({
      file: readable,
      model: 'whisper-1',
      language: 'en',
    });
    return response.text || '';
  } catch (err) {
    console.error('[Transcriber] error:', err.message);
    return '';
  }
}

module.exports = { transcribeChunk };
