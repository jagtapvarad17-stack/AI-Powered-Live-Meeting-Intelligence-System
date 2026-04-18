/**
 * pipeline.js
 * Ties together: AudioRecorder → Transcriber → TaskDetector → Summarizer
 * Emits events consumed by the Express backend which forwards to Electron IPC.
 */
const { EventEmitter } = require('events');
const recorder  = require('./audioRecorder');
const { transcribeChunk } = require('./transcriber');
const { extractTasks }    = require('./taskDetector');
const { generateSummary } = require('./summarizer');

class MeetingPipeline extends EventEmitter {
  constructor() {
    super();
    this.fullTranscript = '';
    this.isRunning = false;
    this._summaryTimer = null;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.fullTranscript = '';

    recorder.on('audioChunk', async (chunk) => {
      const text = await transcribeChunk(chunk);
      if (!text) return;

      // Split into sentences
      const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
      this.fullTranscript += ' ' + text;

      // Emit each sentence with detected tasks
      for (const sentence of sentences) {
        const tasks = extractTasks(sentence);

        this.emit('transcript', {
          text: sentence.trim(),
          timestamp: new Date().toISOString(),
        });

        for (const task of tasks) {
          this.emit('task', task);
        }
      }
    });

    recorder.on('error', (err) => this.emit('error', err));

    // Rolling summary every 30 seconds
    this._summaryTimer = setInterval(async () => {
      if (!this.fullTranscript.trim()) return;
      const summary = await generateSummary(this.fullTranscript);
      this.emit('summary', { text: summary, timestamp: new Date().toISOString() });
    }, 30000);

    recorder.start();
    console.log('[Pipeline] started');
  }

  async stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this._summaryTimer);
    recorder.removeAllListeners('audioChunk');
    recorder.stop();

    // Final summary
    const summary = await generateSummary(this.fullTranscript);
    this.emit('summary', { text: summary, timestamp: new Date().toISOString(), isFinal: true });
    console.log('[Pipeline] stopped');

    return {
      transcript: this.fullTranscript.trim(),
      summary,
    };
  }

  getTranscript() {
    return this.fullTranscript;
  }
}

module.exports = new MeetingPipeline();
