/**
 * Minimal EventSource polyfill for Node.js (used in Electron main process).
 * Parses text/event-stream responses from the backend SSE endpoint.
 */
const http  = require('http');
const https = require('https');
const { EventEmitter } = require('events');

class EventSource extends EventEmitter {
  constructor(url) {
    super();
    this._url = url;
    this._connect();
  }

  _connect() {
    const lib = this._url.startsWith('https') ? https : http;
    const req = lib.get(this._url, (res) => {
      let buf = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        buf += chunk;
        const parts = buf.split('\n\n');
        buf = parts.pop(); // keep incomplete chunk
        for (const block of parts) {
          const eventMatch = block.match(/^event: (.+)$/m);
          const dataMatch  = block.match(/^data: (.+)$/m);
          if (dataMatch) {
            const eventType = eventMatch ? eventMatch[1] : 'message';
            const evt = { data: dataMatch[1], type: eventType };
            this.emit(eventType, evt);
          }
        }
      });
      res.on('end', () => this._reconnect());
      res.on('error', () => this._reconnect());
    });
    req.on('error', () => this._reconnect());
  }

  _reconnect() {
    setTimeout(() => this._connect(), 3000);
  }

  addEventListener(event, cb) {
    this.on(event, cb);
  }
}

module.exports = EventSource;
