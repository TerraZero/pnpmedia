const ZeroResponse = require('zero-router/src/ZeroResponse');

module.exports = class RemoteResponse extends ZeroResponse {

  /**
   * @param {import('zero-router/src/Serve')} serve 
   */
  constructor(serve) {
    super(serve);
    this.op = 'value';
    this.value = {
      status: 'ok',
    };
  }

  async execute() {
    switch (this.op) {
      case 'value':
        return this.serve.json(this.value);
    }
  }

  output(object) {
    for (const field in object) {
      this.value[field] = object[field];
    }
    return this;
  }

  addRemote(type, data, abort = false) {
    this.value.remote = this.value.remote || [];
    this.value.remote.push({ type, data, abort });
    return this;
  }

  addError(title, message) {
    this.status = 'error';
    return this.addRemote('notify', { type: 'error', title, message }, true);
  }

  addNotify(title, message, type = 'info', duration = 4500) {
    return this.addRemote('notify', { type, title, message, duration }, false);
  }

}