import Client from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

/**
 * @typedef {Object} T_SocketHandleContext
 * @property {string} client
 * @property {string} uuid
 * @property {string} method
 * @property {Array} params
 * @property {Object} subject
 * @property {Socket} socket
 */

/**
 * @callback C_Handle
 * @param {T_SocketHandleContext} context
 */

/**
 * @callback C_HandleBase
 * @param {string} handle
 * @param {T_SocketHandleContext} context
 */

/**
 * @typedef {Object} T_SocketConfig
 * @property {string} point
 * @property {string} url
 * @property {string[]} data
 * @property {Object} handle
 * @property {C_HandleBase} handle.on
 * @property {C_Handle} handle.onCall
 * @property {C_Handle} handle.onError
 * @property {Object<string, function>} on
 */

/**
 * @typedef {Object} T_SocketDefinition
 * @property {T_SocketConfig} socket
 */

const promises = {};
export default class Socket {

  /**
   * @param {T_SocketDefinition} definition 
   * @returns {import('vue').Component}
   */
  static create(definition) {
    const config = definition.socket;
    delete definition.socket;
    return (new Socket(config)).mount(definition, config);
  }

  static instance(url = null) {
    if (this._instance_socket === undefined) {
      this._instance_socket = new Client(url);
    }
    return this._instance_socket;
  }

  /**
   * @param {T_SocketConfig} config 
   */
  constructor(config = {}) {
    this.config = config;
    this.config.handle = this.config.handle || {};

    if (!this.config.url) {
      // this.config.url = window.location.protocol + '//' + window.location.host.split(':').shift() + ':3001';
      // this.config.url = window.location.protocol + '//' + window.location.host + '/api/socket';
      this.config.url = window.location.protocol + '//' + window.location.host;
    }

    if (!this.config.point) throw new Error('Please set a socket.point value.');

    this.subject = {};
    this.listeners = {};
    this._proxy = {};
    this.socket = Socket.instance(this.config.url);

    if (this.config.on) {
      for (const event in this.config.on) {
        this.on(event, this.config.on[event]);
      }
    }

    this.socket.on('info', ({ id }) => {
      this.socket.emit('info:response', { id, point: this.config.point });
    });
    this.socket.on('call', async ({client, uuid, point, method, params}) => {
      if (this.config.point === point) {
        let response = null;
        if (this.hasHandle('onCall')) {
          response = await this.handle('onCall', null, {client, uuid, method, params, subject: this.subject, socket: this});
        } else if (typeof this.subject[method] === 'function') {
          response = await this.subject[method](...params);
        } else {
          this.socket.emit('call:response', {client, uuid, point, status: 'error', response: 'Undefined method "' + method + '"'});
        }
        this.socket.emit('call:response', {client, uuid, status: 'ok', response});
      }
    });
    this.socket.on('call:response', async ({ uuid, status, response }) => {
      if (typeof promises[uuid] !== 'undefined') {
        if (status === 'error') {
          if (this.hasHandle('onError')) {
            response = await this.handle('onError', null, { uuid, status, response });
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
      this.doTrigger(event, ...params);
    });
    this.socket.on('socket:error', ({ error, note }) => {
      console.error(note);
      console.log(error);
    });
  }

  /**
   * @param {(string|string[])} event 
   * @param  {...any} params 
   */
  doTrigger(event, ...params) {
    if (!Array.isArray(event)) event = [event];
    for (const name of event) {
      if (this.listeners[name]) {
        for (const listener of this.listeners[name]) {
          listener.apply(this.subject, params);
        }
      }
    }
  }

  hasHandle(handler, bubble = true) {
    return typeof this.config.handle[handler] === 'function' || bubble && typeof this.config.handle.on === 'function';
  } 

  async handle(handler, subject = null, context) {
    if (typeof this.config.handle[handler] === 'function') {
      return await this.config.handle[handler].call(subject || this.subject, context);
    } else if (typeof this.config.handle.on === 'function') {
      return await this.config.handle.on.call(subject || this.subject, handler, context);
    }
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

  call(point, method, ...params) {
    console.log('CALL', point, method);
    return new Promise((resolve, reject) => {
      const uuid = uuidv4();
      promises[uuid] = {resolve, reject};
      this.socket.emit('call', { uuid, point, method, params });
    });
  }

  /**
   * @param {(string|string[])} file 
   * @param {(object|null)} value 
   */
  data(file, value = null) {
    if (!Array.isArray(file)) file = [file];
    for (const name of file) {
      this.socket.emit('data', { file: name, value });
    }
  }

  on(event, listener) {
    if (!Array.isArray(this.listeners[event])) this.listeners[event] = [];
    this.listeners[event].push(listener);
    return this;
  }

  /**
   * @param {(string|string[])} event 
   * @param  {...any} params 
   */
  trigger(event, ...params) {
    this.socket.emit('event', { event, params });
  }

  /**
   * @param {import('vue').Component} definition 
   * @param {T_SocketConfig} config
   */
  mount(definition, config = {}) {
    const that = this;
    const mounted = definition.mounted ?? (() => {});

    definition.mounted = async function(...params) {
      that.subject = this;
      this.socket = that;
      await mounted.apply(this, params);
    };

    if (Array.isArray(config.data)) this.data(config.data);

    return definition;
  }

}