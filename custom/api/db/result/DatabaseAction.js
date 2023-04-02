module.exports = class DatabaseAction {

  /**
   * @param {import('./DatabaseResult')} result 
   * @param {string} action
   */
  constructor(result, action) {
    this.result = result;

    this._action = action;
    this._data = {};
  }

  error(error) {
    this.result._error = error;
    return this;
  }

  data(object) {
    this._data = object;
    return this.result;
  }

  info(key, value = undefined) {
    this.result.info(key, value);
    return this;
  }

  getServe() {
    return {
      action: this._action,
      data: this._data,
    };
  }

}