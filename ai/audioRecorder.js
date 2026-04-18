/**
 * audioRecorder.js
 * Captures mic audio using SoX via the `mic` npm package.
 * Emits 'data' chunks ready for transcription.
 */
const mic = require('mic');
const { EventEmitter } = require('events');

class AudioRecorder extends EventEmitter {
  constructor() {
    super();
    this.micInstance = null;
    this.micStream = null;
    this.isRecording = false;
    this.buffer = [];
    this.CHUNK_MS = 3000; // send chunk every 3s
    this._flushTimer = null;
  }

  start() {
    if (this.isRecording) return;

    this.micInstance = mic({
      rate: '16000',
      channels: '1',
      debug: false,
      exitOnSilence: 0,
      fileType: 'wav',
      encoding: 'signed-integer',
    });

    this.micStream = this.micInstance.getAudioStream();
    this.isRecording = true;
    this.buffer = [];

    this.micStream.on('data', (chunk) => {
      this.buffer.push(chunk);
    });

    this.micStream.on('error', (err) => {
      console.error('[AudioRecorder] stream error:', err);
      this.emit('error', err);
    });

    try {
      this.micInstance.start();
    } catch (err) {
      console.error('[AudioRecorder] Failed to start mic:', err);
      this.emit('error', err);
      return;
    }

    // Flush buffer every CHUNK_MS ms → emit for transcription
    this._flushTimer = setInterval(() => {
      if (this.buffer.length > 0) {
        const combined = Buffer.concat(this.buffer);
        this.buffer = [];
        this.emit('audioChunk', combined);
      }
    }, this.CHUNK_MS);

    console.log('[AudioRecorder] started');
  }

  stop() {
    if (!this.isRecording) return;
    clearInterval(this._flushTimer);
    this._flushTimer = null;
    if (this.micInstance) this.micInstance.stop();
    this.isRecording = false;
    this.buffer = [];
    console.log('[AudioRecorder] stopped');
    this.emit('stopped');
  }
}

module.exports = new AudioRecorder();
