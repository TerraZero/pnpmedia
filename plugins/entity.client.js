import Reflection from 'pencl-kit/src/Util/Reflection';

class EntityPropSchema {

  constructor(client, entity, prop, schema) {
    this.client = client;
    this.entity = entity;
    this.prop = prop;
    this.schema = schema;
  }

  get type() {
    return this.schema.type;
  }

  get isArray() {
    return this.type === 'array';
  }

  get isRef() {
    if (this.isArray) {
      return this.schema.items.$ref !== undefined;
    } else {
      return this.schema.$ref !== undefined;
    }
  }

  getRefType() {
    if (this.isArray) {
      return this.schema.items.$ref.split('/').pop();
    } else {
      return this.schema.$ref.split('/').pop();
    }
  }

  /**
   * @returns {EntitySchema}
   */
  getRef() {
    return this.client.getSchema(this.getRefType());
  }

  getUI(key) {
    let ui = Reflection.getDeep(this.schema, 'ui.' + key);
    if (ui === null && this.isRef) {
      ui = this.getRef().getUI(key);
    }
    return ui;
  }

}

class EntitySchema {

  constructor(client, schema) {
    this.client = client;
    this.schema = schema;
    this._prop_cache = {};
  }

  get props() {
    return this.schema.properties;
  }

  getProp(prop) {
    if (this._prop_cache[prop] === undefined) {
      this._prop_cache[prop] = new EntityPropSchema(this.client, this, prop, this.props[prop]);
    }
    return this._prop_cache[prop];
  }

  getUI(key) {
    return Reflection.getDeep(this.schema, 'ui.' + key);
  }

}

class EntityClient {

  constructor(request) {
    this.request = request;
    this._schemas = null;
    this._schemas_cache = {};
  }

  async schemas() {
    if (this._schemas === null) {
      this._schemas = await this.request('storage.json.defs').get({}, 'data.defs');
    } 
    return this._schemas;
  }

  getSchemas() {
    const schemas = [];
    for (const schema in this._schemas) {
      schemas.push(schema);
    }
    return schemas;
  }

  /**
   * @param {string} type 
   * @returns {EntitySchema}
   */
  getSchema(type) {
    if (this._schemas_cache[type] === undefined) {
      this._schemas_cache[type] = new EntitySchema(this, this._schemas[type]);
    }
    return this._schemas_cache[type];
  }

}

export default ({ $request }, inject) => {
  inject('entity', new EntityClient($request));
}