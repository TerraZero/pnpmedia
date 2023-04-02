const RemoteResponse = require('./RemoteResponse');

module.exports = class EntityBrowserResponse extends RemoteResponse {

  async execute() {
    switch (this.op) {
      case 'list':
        this.doList();
        break;
    }
    this.op = 'value';
    return await super.execute();
  }

  /**
   * @param {import('zero-jsonstorage/src/JSONStorage')} storage 
   * @returns {this}
   */
  list(storage) {
    this.storage = storage;
    this.op = 'list';
    return this;
  }

  doList() {
    const type = this.serve.get('type') || this.serve.MATCH.type;
    const query = this.serve.getUrl().query;
    const limit = this.serve.int(query.limit, 10);
    const page = this.serve.int(query.page, 0);
    let filters = this.serve.object((query.filters || '').toLowerCase());
    let and = this.serve.bool(query.and, true);
    if (typeof filters === 'string') {
      filters = {
        search: filters,
      };
      and = false;
    }

    if (filters.search !== undefined) {
      const schema = this.storage.getSchema(type);
      for (const field in schema.properties) {
        if (filters[field] !== undefined) continue;
        filters[field] = filters.search;
      }
      delete filters.search;
    }

    const entities = this.storage.search(type, e => {
      return this.filter(e, (a, b) => (a + '').toLowerCase().includes(b), filters, and);
    }).map(e => e.data);

    this.output({
      op: 'list',
      pager: { filters, limit, page, total: entities.length },
      list: entities.slice(limit * page, limit * page + limit),
      status: 'ok',
    });
  }

  /**
   * @param {import('zero-jsonstorage/src/JSONEntity')} entity 
   * @param {CallableFunction} match 
   * @param {Object<string, string>} filters 
   * @param {boolean} and 
   * @returns {boolean}
   */
  filter(entity, match, filters, and = false) {
    for (const filter in filters) {
      const result = match(entity.get(filter), filters[filter]);
      if (and && !result) return false;
      if (!and && result) return true;
    }
    return and;
  }

  /**
   * @param {import('zero-jsonstorage/src/JSONStorage')} storage 
   * @param {Object} data
   * @returns {import('zero-router/src/Serve')} 
   */
  save(storage, data) {
    const type = this.serve.get('type');
    const schema = storage.getSchema(type);
    let entity = this.serve.get('entity') || {};

    if (this.serve.get('id')) {
      entity = storage.load(type, this.serve.get('id'));
    }
    
    for (const field in schema.properties) {
      if (this.serve.get('id') && schema.properties[field].ui && schema.properties[field].ui.disabled) continue;
      entity[field] = data[field];
    }

    storage.save(type, entity);
    this.addNotify('Saved entity ' + entity.id, 'Saved entity "' + entity.name || entity.id + '".', 'success');
    return this.output({ op: 'save', type, entity, status: 'ok' });
  }

}