const DatabaseError = require('../error/DatabaseError');
const DatabaseAction = require('./DatabaseAction');

module.exports = class DatabaseResult {

  /**
   * @param {import('knex').Knex.Transaction} transaction 
   */
  constructor(transaction) {
    this.transaction = transaction;
    this._actions = [];
    this._info = {};
    this._error = null;
    this._meta = {};
  }

  /** @returns {import('./DatabaseAction')} */
  get current() {
    return this._actions[this._actions.length - 1];
  }

  /**
   * @param {string} action 
   * @returns {import('./DatabaseAction')}
   */
  action(action) {
    const dba = new DatabaseAction(this, action);
    this._actions.push(dba);
    return dba;
  }

  metaAction(method, ...params) {
    this._meta.actions = this._meta.actions || [];
    this._meta.actions.push({ method, params });
    return this;
  }

  notify({ type = 'info', title, message, position = 'bottom-right' }) {
    return this.metaAction('notify', { type, title, message, position });
  }

  /**
   * @param {import('zero-router/src/Serve')} serve 
   */
  toServe(serve) {
    if (this._error instanceof DatabaseError) {
      serve._data = { error: this._error.stack.split('\n').map(v => v.trim()) };
      serve.RESPONSE.errorServiceUnavailable(this._error.message);
      serve._meta.error = {...this._meta.error, ...this._error.serve()};
      serve.send();
      return;
    } else if (this._error) {
      throw this._error;
    }

    for (const field in this._meta) {
      serve.meta(field, this._meta[field]);
    }

    const result = this._actions.pop().getServe();
    
    serve.json({ result, actions: this._actions.map(a => a.getServe()) });
  }

  info(key, value = undefined) {
    if (value === undefined) return this._info[key] || null;
    this._info[key] = value;
    return this;
  }

  isError() {
    if (this._error) return true;
    return false;
  }

}