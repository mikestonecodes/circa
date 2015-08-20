export class Transport {
  constructor() {
      this.socket = typeof io !== "undefined" ? io.socket : null;
  }

  on(url,cb) {
    if (!this.socket) return;
    this.socket.on(url, cb);
  }
  off(url) {
    if (!this.socket) return;
    this.socket.off(url);
  }
  get(url,data, cb) {
    if (typeof data === 'function')
      cb = data;
    if (!this.socket) return;
    this.socket.get(url, cb);
  }
  post(url,data, cb) {
    if (!this.socket) return;
    this.socket.post(url, data, cb);
  }
  put(url,data, cb) {
    if (!this.socket) return;
    this.socket.put(url, data, cb);
  }
  delete(url, cb) {
    if (!this.socket || !url) return;
    this.socket.delete(url, {}, cb);
  }
}