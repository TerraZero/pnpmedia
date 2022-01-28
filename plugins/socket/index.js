import Client from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const promises = {};
export default class Socket {

  static create(point, definition) {
    return (new Socket(point)).bind(definition);
  }

  static instance(url = null) {
    if (this._instance_socket === undefined) {
      this._instance_socket = new Client(url);
    }
    return this._instance_socket;
  }

  constructor(point, subject = {}, url = null) {
    if (url === null) {
      url = window.location.protocol + "//" + window.location.host.split(':')[0] + ':3001';
    }
    console.log('socket', url);
    this.socket = Socket.instance(url);
    this.point = point;

    this.listeners = {};
    this.subject = subject;
    this.preMethods = {};
    this.errorHandler = null;
    this._proxy = {};

    this.socket.on('info', ({ id }) => {
      this.socket.emit('info:response', { id, point });
    });
    this.socket.on('call', async ({client, uuid, point, method, params}) => {
      if (this.point === point && typeof this.subject[method] === 'function') {
        const response = await this.subject[method](...params);
        this.socket.emit('call:response', {client, uuid, point, status: 'ok', response});
      } else {
        this.socket.emit('call:response', {client, uuid, point, status: 'error', response: 'Undefined method "' + method + '"'});
      }
    });
    this.socket.on('call:response', async ({ uuid, status, response }) => {
      if (typeof promises[uuid] !== 'undefined') {
        if (status === 'error') {
          if (this.errorHandler !== null) {
            response = await this.errorHandler(response);
            promises[uuid].resolve(response);
          } else {
            promises[uuid].reject(response);
          }
        } else {
          promises[uuid].resolve(response);
        }
        delete promises[uuid];
      }
    });
    this.socket.on('event', ({ event, params }) => {
      if (this.listeners[event]) {
        for (const listener of this.listeners[event]) {
          listener(...params);
        }
      }
    });
    this.socket.on('socket:error', ({ error, note }) => {
      console.error(note);
      console.log(error);
    });
  }

  proxy(point) {
    if (this._proxy[point] === undefined) {
      this._proxy[point] = new Proxy(this, {
        get: (target, prop, receiver) => {
          return async (...params) => {
            return await this.call(point, prop, ...params);
          };
        },
      });
    }
    return this._proxy[point];
  }

  addMethod(name, callback) {
    this.subject[name] = callback.bind(this.subject);
    return this;
  }

  call(point, method, ...params) {
    return new Promise((resolve, reject) => {
      const uuid = uuidv4();
      promises[uuid] = {resolve, reject};
      this.socket.emit('call', { uuid, point, method, params });
    });
  }

  on(event, listener) {
    if (!Array.isArray(this.listeners[event])) this.listeners[event] = [];
    this.listeners[event].push(listener);
    return this;
  }

  trigger(event, ...params) {
    this.socket.emit('event', { event, params });
  }

  bind(definition) {
    let mount = async () => {};
    if (typeof definition.mounted === 'function') {
      mount = definition.mounted;
    }
    this.preMethods = definition.methods || {};
    const that = this;
    definition.mounted = async function(...params) {
      that.mount(this);
      await mount.bind(this)(...params);
    };
    if (typeof definition.socketError === 'function') {
      this.errorHandler = definition.socketError;
      delete definition.socketError;
    }
    
    return definition;
  }

  mount(vue) {
    vue.socket = this;
    if (this.errorHandler !== null) {
      this.errorHandler = this.errorHandler.bind(vue);
    }
    for (const field in this.preMethods) {
      this.subject[field] = vue[field];
    }
  }

}