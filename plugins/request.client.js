import UrlPattern from 'url-pattern';
import Reflection from 'pencl-kit/src/Util/Reflection';
import { Notification } from 'element-ui';

/**
 * @typedef {Object} T_FetchField
 * @property {string} name
 * @property {string} field
 */

/**
 * @typedef {Object} T_FetchOptions
 * @property {(string|T_FetchField)} select
 * @property {(Function|string)} method
 * @property {any[]} props
 */

class Request {

  static set axios(value) {
    this._request_axios = value;
  }

  static get axios() {
    return this._request_axios;
  }

  static get base() {
    return window.location.protocol + '//' + window.location.host + '/api/zero';
  }

  static async routes() {
    if (this._request_routes === undefined) {
      const response = await Request.axios.get(Request.base + '/_router/routes');
      this._request_routes = response.data.data.routes;
    }
    return this._request_routes;
  }

  static doFetchArray(data) {
    if (Array.isArray(data)) return data;
    if (!data) return [];
    const array = [];
    for (const index in data) array.push(data[index]);
    return array;
  }

  constructor(route) {
    this.route = route;
    this._params = {};
    this._query = {};
    this._onError = [];
    this._mount = null;
    /** @type {T_FetchOptions[]} */
    this._fetch = [];
  }

  clean() {
    this._params = {};
    this._query = {};
    return this;
  }

  params(params) {
    this._params = params;
    return this;
  }

  query(query) {
    this._query = query;
    return this;
  }

  onError(callback) {
    this._onError.push(callback);
    return this;
  }

  doFetch(result) {
    if (!result || this._fetch.length === 0) return result;
    let newResult = {};

    if (typeof this._mount === 'string') {
      newResult = Reflection.getDeep(result, this._mount, null);
    }
    
    for (const fetcher of this._fetch) {
      let key = 'standard';
      let data = result;

      if (typeof fetcher.select === 'string') {
        data = Reflection.getDeep(result, fetcher.select, null);
      } else if (typeof fetcher.select !== 'string') {
        key = fetcher.select.name;
        data = Reflection.getDeep(result, fetcher.select.field, null);
      }
      if (typeof fetcher.method === 'function') {
        newResult[key] = fetcher.method(data, ...fetcher.props);
      } else if (typeof fetcher.method === 'string') {
        newResult[key] = Request[fetcher.method](data, ...fetcher.props);
      } else {
        newResult[key] = data;
      }
    }
    if (this._fetch.length === 1 && typeof this._fetch[0].select === 'string') return newResult['standard'];
    return newResult;
  }

  mount(mount) {
    this._mount = mount;
    return this;
  }

  /**
   * 
   * @param {T_FetchOptions} fetcher 
   * @returns {this}
   */
  fetch(fetcher) {
    if (!fetcher.props) fetcher.props = [];
    this._fetch.push(fetcher);
    return this;
  }

  /**
   * @param {T_FetchField} select
   * @returns {this}
   */
  fetchArray(select = null) {
    return this.fetch({select, method: 'doFetchArray'});
  }

  checkError(result) {
    if (result.meta && result.meta.error) {
      if (this._onError.length === 0) {
        Notification.error({
          title: 'Error ' + (result.meta.error.title || result.meta.error.code),
          message: result.meta.error.message,
        });
      } else {
        this._onError.forEach(v => v({ result, request: this, noti: Notification }));
      }
      return true;
    }
    if (result.meta && result.meta.actions) {
      for (const action of result.meta.actions) {
        this[action.method](...action.params);
      }
    }
    return false;
  }

  notify(options) {
    Notification[options.type](options);
  }

  /**
   * @param {Object} query 
   * @param {(string|T_FetchField)} resultField
   * @returns {Object}
   */
  async get(query = null, resultField = null) {
    if (resultField) this.fetch({ select: resultField });
    if (query !== null) this.query(query);
    const result = (await Request.axios.get((await this.getUrl()).toString())).data;
    this.checkError(result);
    return this.doFetch(result);
  }

  /**
   * @param {Object} body
   * @param {(string|T_FetchField)} resultField
   * @returns {Object}
   */
  async post(body = {}, resultField = null) {
    if (resultField) this.fetch({ select: resultField });
    const result = (await Request.axios.post((await this.getUrl()).toString(), body)).data;
    this.checkError(result);
    return this.doFetch(result);
  }

  /**
   * @returns {URL}
   */
  async getUrl() {
    const route = (await Request.routes())[this.route];
    const pattern = new UrlPattern(route);
    const url = new URL(Request.base + pattern.stringify(this._params));
    
    for (const field in this._query) {
      if (typeof this._query[field] === 'object') {
        url.searchParams.set(field, JSON.stringify(this._query[field]));
      } else {
        url.searchParams.set(field, this._query[field]);
      }
    }
    return url;
  }

}

export default ({ $axios }, inject) => {
  Request.axios = $axios;
  const factory = (routeID, params = {}) => {
    return (new Request(routeID)).params(params);
  };
  factory.remote = (comp, result) => {
    if (result.remote) {
      for (const object of result.remote) {
        switch (object.type) {
          case 'notify':
            comp.$notify(object.data);
            break;
        }
        if (object.abort) return true;
      }
    }
    return false;
  };
  factory.fetchArray = Request.doFetchArray;
  inject('request', factory);
};