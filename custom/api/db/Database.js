const Knex = require('knex');
const Glob = require('glob');
const Path = require('path');

const DatabaseResult = require('./result/DatabaseResult');
const DBFieldError = require('./error/DBFieldError');

/**
 * @typedef {Object} T_TableFieldSchema
 * @property {string} type
 * @property {string} name
 * @property {Array} [params]
 * @property {Object} [ui]
 * @property {string} [ui.label]
 * @property {string} [ui.description]
 * @property {string} [ui.type]
 * @property {Object<string, string>} [ui.options]
 */

/**
 * @typedef {Object} T_TableSchema
 * @property {string} table
 * @property {string} type
 * @property {string} [default_value]
 * @property {Object} [reference]
 * @property {string} reference.entity_type
 * @property {Object<string, string>} reference.match
 * @property {T_TableFieldSchema[]} fields
 */

/**
 * @typedef {Object} T_EntityFieldSchema
 * @property {string} table
 * @property {string} label
 * @property {int} [length]
 */

/**
 * @typedef {Object} T_EntitySchema
 * @property {string} entity
 * @property {string} label
 * @property {string} table
 * @property {Object<string, T_EntityFieldSchema>} fields
 * @property {Object} [ui]
 * @property {string[]} [ui.list]
 */

/**
 * @typedef {Object} T_DatabaseConfig
 * @property {Object} knex
 * @property {string} knex.client
 * @property {Object} knex.connection
 * @property {string} knex.connection.filename
 * @property {Object} schemas
 * @property {string} schemas.table
 * @property {string} schemas.entity
 */

/**
 * @typedef {Object} T_Entity
 * @property {string} entity_type
 * @property {int} id
 * @property {int} weight
 * @property {Array} fields
 */

/**
 * @service (database)
 * @arg (@parser)
 */
module.exports = class Database {

  /**
   * @plugin_creator
   * @param {import('zero-annotation')} parser
   * @returns {Database}
   */
  static create(parser) {
    return new Database(parser, {
      knex: {
        client: 'better-sqlite3',
        connection: {
          filename: Path.join(__dirname, 'data.sqlite'),
        },
        useNullAsDefault: true,
      },
      schemas: {
        table: 'schemas/**/*.table.json',
        entity: 'schemas/**/*.entity.json',
      },
    });
  }

  static filterProps(data, props = [], white = false) {
    if (data === null) return null;
    const value = {};
    for (const prop in data) {
      if (white && !props.includes(prop) || !white && props.includes(prop)) continue;
      value[prop] = data[prop];
    }
    return value;
  }

  static buildMatch(query, match) {
    for (const key in match) {
      query = query.where(key, '=', match[key]);
    }
    return query;
  }

  static mapData(target, mapping, values) {
    for (const field in mapping) {
      target[mapping[field]] = values[field];
    }
    return target;
  }

  /**
   * @param {import('zero-annotation')} parser
   * @param {T_DatabaseConfig} config
   */
  constructor(parser, config) {
    this._parser = parser;
    this._config = config;
    this._connection = null;
    this._schemas = {
      table: {},
      entity: {},
    };
    this._loaded = false;
  }

  /** @returns {T_DatabaseConfig} */
  get config() {
    return this._config;
  }

  /** @returns {Knex.Knex} */
  async connection() {
    if (this._connection === null) {
      this.prepareConnection();
      this._connection = Knex(this._config.knex);
      await this.execConnection();
    }
    return this._connection;
  }

  as(field, alias) {
    const as = {};
    as[alias] = field;
    return as;
  }

  prepareConnection() {
    if (this._loaded) return;
    if (this.config.schemas && this.config.schemas.table) {
      for (const file of Glob.sync(this.config.schemas.table, { cwd: __dirname, absolute: true })) {
        this.addSchemaFile('table', file);
      }
    }
    if (this.config.schemas && this.config.schemas.entity) {
      for (const file of Glob.sync(this.config.schemas.entity, { cwd: __dirname, absolute: true })) {
        this.addSchemaFile('entity', file);
      }
    }
    this._loaded = true;
  }

  async execConnection() {
    for (const table in this._schemas.table) {
      await this.execTableSchema(this._schemas.table[table]);
    }
    return this;
  }

  /**
   * @param {string} type 
   * @param {string} name 
   * @returns  {(T_TableSchema|T_EntitySchema)}
   */
  getSchema(type, name = null) {
    if (!this._loaded) this.prepareConnection();
    if (name === null) return this._schemas[type];
    return this._schemas[type][name] || null;
  }

  hasConnection() {
    return this._connection !== null;
  }

  /**
   * @param {string} type
   * @param {string} path 
   * @returns {this}
   */
  addSchemaFile(type, path) {
    this.addSchema(type, require(path));
    return this;
  }

  /**
   * @param {string} type
   * @param {T_TableSchema} schema
   * @returns {this}
   */
  addSchema(type, schema) {
    this._schemas[type][schema[type]] = schema;
    if (type === 'table' && this.hasConnection()) this.execTableSchema(schema);
    return this;
  }

  /**
   * @param {T_TableSchema} schema
   * @returns {this}
   */
  async execTableSchema(schema) {
    if (!await this._connection.schema.hasTable(schema.table)) {
      await this._connection.schema.createTable(schema.table, (table) => {
        switch (schema.type) {
          case 'base':
            table.increments().primary();
            table.integer('weight').notNullable().defaultTo(0);
            break;
          case 'field':
            table.string('refType').notNullable();
            table.string('refField').notNullable();
            table.integer('ref').notNullable();
            table.integer('refDelta').notNullable();
            table.primary(['refType', 'refField', 'ref', 'refDelta']);
            break;
        }
        for (const field of schema.fields) {
          this.addSchemaTableField(table, field);
        }
      });
    }
    return Promise.resolve(this);
  }

  addSchemaTableField(table, field) {
    let table_field = table[field.type](field.name);

    if (Array.isArray(field.params)) {
      for (const param of field.params) {
        let method = param;

        if (Array.isArray(param)) {
          method = param.shift();
        }

        if (Array.isArray(param) && param.length) {
          table_field = table_field[method](...param);
        } else {
          table_field = table_field[method]();
        }
      }
    }
    return table_field;
  }

  async updateTable(table) {
    const schema = this.getSchema('table', table);
    const con = await this.connection();

    const columns = await con.raw('PRAGMA table_info(' + schema.table + ');');

    const addFields = schema.fields.filter(v => {
      return columns.find(f => f.name === v.name) === undefined;
    });
    const dropFields = columns.filter(v => {
      return schema.fields.find(f => f.name === v.name) === undefined && !['id', 'weight', 'refType', 'refField', 'ref', 'refDelta'].includes(v.name);
    });

    await con.schema.alterTable(schema.table, (table) => {
      for (const column of dropFields) {
        table.dropColumn(column.name);
      }
      for (const field of addFields) {
        this.addSchemaTableField(table, field);
      }
    });

    return {
      schema,
      drop: dropFields.map(v => v.name),
      add: addFields.map(v => v.name),
    };
  }

  getTableFieldSchema(table, field) {
    const schema = this.getSchema('table', table);
    return schema.fields.find(v => v.name === field);
  }

  /**
   * @param {string} type 
   * @param {string} repo 
   * @returns {import('zero-annotation/src/PluginCollection')}
   */
  getRepo(type, repo) {
    return this._parser.getCollection('service', { tag: type + '.repo.' + repo });
  }

  async loadByProps(table, props) {
    const con = await this.connection();
    const schema = this.getSchema('table', table);

    let query = con.select().from(schema.table);
    for (const index in props) {
      query = query.where(index, '=', props[index]);
    }
    return await query;
  }

  /**
   * @param {Object} row 
   * @param {T_TableSchema} schema 
   */
  prepareRow(row, schema) {
    const newRow = {};
    const notNullable = [];

    if (schema.type === 'base') {
      notNullable.push(['weight', 'Weight']);
    } else if (schema.type === 'field') {
      notNullable.push(['ref', 'Ref ID']);
      notNullable.push(['refType', 'Ref Type']);
      notNullable.push(['refField', 'Ref Field']);
      notNullable.push(['refDelta', 'Ref Delta']);
    }

    for (const field of schema.fields) if (field.params && field.params.includes('notNullable')) {
      notNullable.push([field.name, (field.ui ? field.ui : {}).label || field.name]);
    }

    for (const index in row) {
      if (!index.startsWith('_')) newRow[index] = row[index];
      let found = null;
      if ((found = notNullable.find(v => v[0] === index)) && (row[index] === '' || row[index] === null || row[index] === undefined)) {
        throw new DBFieldError('The field "' + found[1] + '" can not be empty.', 'Error not empty', found[0]);
      }
    }

    return newRow;
  }

  /**
   * @param {string} table 
   * @param {Object} row
   * @param {DatabaseResult} result
   * @returns {DatabaseResult}
   */
  async saveRow(table, row, result = null) {
    let _result = result;
    
    if (_result === null) {
      const transaction = await (await this.connection()).transaction();
      _result = new DatabaseResult(transaction);
    }

    try {
      const repo = this.getRepo('table', table);
      const schema = this.getSchema('table', table);

      _result.info('schema.table', schema);

      await repo.asyncCall('hookPreprocess', 'save', row, { result: _result });

      let rowResult = null;

      row = this.prepareRow(row, schema);
      
      if (schema.type === 'base') {
        rowResult = await _result.transaction.insert(row)
          .returning('id')
          .into(schema.table)
          .onConflict('id')
          .merge();
      } else if (schema.type === 'field') {
        rowResult = await _result.transaction.insert(row)
          .returning(['ref', 'refType', 'refField', 'refDelta'])
          .into(schema.table)
          .onConflict(['ref', 'refType', 'refField', 'refDelta'])
          .merge();
      }

      await repo.asyncCall('hookPostprocess', 'save', row, { result: _result });

      if (result === null) {
        await _result.transaction.commit();
        await repo.asyncCall('hookFinish', 'save', row, { result: _result });

        return _result
          .action('row.save.commit')
          .data({ ...rowResult[0], table, row });
      }

      return _result
        .action('row.save.prepare')
        .data({ ...rowResult[0], table, row });
    } catch (error) {
      await _result.transaction.rollback();

      return _result
        .action('row.save.rollback')
        .error(error)
        .data({ table, row });
    }
  }

  /**
   * @param {string} table 
   * @param {Object} row
   * @param {DatabaseResult} result
   * @returns {DatabaseResult}
   */
  async deleteRow(table, row, result = null) {
    let _result = result;
    if (_result === null) {
      const transaction = await (await this.connection()).transaction();
      _result = new DatabaseResult(transaction);
    }

    try {
      const repo = this.getRepo('table', table);
      const schema = this.getSchema('table', table);
      let found = 0;

      _result.info('schema.table', schema);
      await repo.asyncCall('hookPreprocess', 'delete', row, { result: _result });

      if (schema.type === 'base') {
        found = await _result.transaction(schema.table)
          .where('id', '=', row.id)
          .delete();
      } else if (schema.type === 'field') {
        let query = _result.transaction(schema.table)
          .where('ref', '=', row.ref)
          .andWhere('refType', '=', row.refType)
          .andWhere('refField', '=', row.refField);

        if (row.refDelta) query.andWhere('refDelta', '=', row.refDelta);
          
        found = await query.delete();
      }

      await repo.asyncCall('hookPostprocess', 'delete', row, { result: _result });

      if (result === null) {
        await _result.transaction.commit();
        await repo.asyncCall('hookFinish', 'delete', row, { result: _result });

        return _result
          .action('row.delete.commit')
          .data({ table, row, found });
      }

      return _result
        .action('row.delete.prepare')
        .data({ table, row, found });
    } catch (error) {
      await _result.transaction.rollback();

      return _result
        .action('row.delete.rollback')
        .error(error)
        .data({ table, row });
    }
  }

  /**
   * @param {string} entity_type 
   * @param {int} id 
   * @param {Object} options
   * @param {DatabaseResult} result
   * @returns {DatabaseResult}
   */
  async load(entity_type, id, options = { deep: 0 }, result = null) {
    options.step = options.step || 0;
    let _result = result;
    if (_result === null) {
      const transaction = await (await this.connection()).transaction();
      _result = new DatabaseResult(transaction);
    }

    try {
      const schema = this.getSchema('entity', entity_type);
      const baseTable = this.getSchema('table', schema.table);
      const repo = this.getRepo('entity', entity_type);
      
      let loaded = await _result.transaction.select().from(baseTable.table).where('id', '=', id);
      if (loaded.length === 0) return _result
        .action('entity.load.nocontent')
        .data({
          entity_type,
          id,
        });
      loaded = loaded.shift();
      loaded.fields = {};

      for (const field in schema.fields) {
        const fieldSchema = schema.fields[field];
        const fieldTable = this.getSchema('table', fieldSchema.table);

        const fieldResult = await _result.transaction.select().from(fieldTable.table)
          .where('refType', '=', entity_type)
          .andWhere('refField', '=', field)
          .andWhere('ref', '=', id)
          .orderBy('refDelta');

        if (fieldResult.length === 0) {
          loaded.fields[field] = fieldSchema.length === 1 ? null : [];
        } else {
          const fieldValues = [];
          for (const result of fieldResult) {
            const fieldValue = Database.filterProps(result, ['refType', 'refField', 'ref', 'refDelta']);

            if (fieldTable.reference && (options.deep > options.step || options.deep === -1)) {
              const _options = JSON.parse(JSON.stringify(options));
              _options.step + 1;
              const fieldEntity = await this.load(fieldValue[fieldTable.reference.entity_type], fieldValue[fieldTable.reference.match.id], _options, _result);
              if (_result.isError()) return _result;
              if (fieldEntity.current._action === 'entity.load.nocontent') {
                fieldValue._entity = '[deleted]';
              } else {
                fieldValue._entity = fieldEntity.current._data.entity;
              }
            }

            fieldValues.push(fieldValue);
          }
          if (fieldSchema.length === 1) {
            loaded.fields[field] = fieldValues.shift();
          } else {
            loaded.fields[field] = fieldValues;
          }
        }
      }

      loaded.entity_type = entity_type;

      await repo.asyncCall('hookPostprocess', 'load', loaded, { result: _result });

      if (result === null) {
        await _result.transaction.commit();

        await repo.asyncCall('hookFinish', 'load', loaded, { result: _result });

        return _result
          .action('entity.load.commit')
          .data({
            entity_type,
            id,
            entity: loaded,
          });
      }
      return _result
        .action('entity.load.prepare')
        .data({
          entity_type,
          id,
          entity: loaded,
        });
    } catch (error) {
      await _result.transaction.rollback();

      return _result
        .action('entity.load.rollback')
        .error(error)
        .data({ entity_type, id });
    }
  }

  /**
   * @param {T_Entity} entity 
   * @param {DatabaseResult} result
   * @returns {DatabaseResult}
   */
  async save(entity, result = null) {
    let _result = result;
    if (_result === null) {
      const transaction = await (await this.connection()).transaction();
      _result = new DatabaseResult(transaction);
    }

    try {
      const schema = this.getSchema('entity', entity.entity_type);
      const baseTable = this.getSchema('table', schema.table);
      const repo = this.getRepo('entity', entity.entity_type);

      _result.info('schema.entity', schema);
    
      await repo.asyncCall('hookPreprocess', 'save', entity, { result: _result });

      await this.saveRow(baseTable.table, Database.filterProps(entity, ['fields', 'entity_type']), _result);
      if (_result.isError()) return _result;
      const id = _result.current._data.id;

      for (const field in schema.fields) {
        const fieldSchema = schema.fields[field];
        const fieldTable = this.getSchema('table', fieldSchema.table);

        _result.info('schema.table', schema);

        await this.deleteRow(fieldTable.table, { ref: id, refType: entity.entity_type, refField: field }, _result);
        if (_result.isError()) return _result;

        if (entity.fields === undefined || entity.fields[field] === undefined || entity.fields[field] === null) continue;

        let fieldValues = entity.fields[field];

        if (fieldSchema.length === 1) {
          fieldValues = [fieldValues];
        }

        // update inline entity
        if (fieldTable.reference) {
          for (const index in fieldValues) {
            if (fieldValues[index] && fieldValues[index]._entity) {
              const entity = fieldValues[index]._entity;

              if (entity === '[deleted]') continue;
              await this.save(entity, _result);
              if (_result.isError()) return _result;

              entity.id = _result.current._data.id;
              fieldValues[index] = {};
              fieldValues[index][fieldTable.reference.entity_type] = entity.entity_type;
              Database.mapData(fieldValues[index], fieldTable.reference.match, entity);
            }
          }
        }

        fieldValues = fieldValues.map((v, delta) => {
          v.ref = id;
          v.refType = entity.entity_type;
          v.refField = field;
          v.refDelta = delta;

          return v;
        });
        
        if (Array.isArray(fieldValues)) {
          for (const fieldValue of fieldValues) await this.saveRow(fieldTable.table, fieldValue, _result);
        } else {
          await this.saveRow(fieldTable.table, fieldValues, _result);
        }
        if (_result.isError()) return _result;
      }

      await repo.asyncCall('hookPostprocess', 'save', entity, { result: _result });

      if (result === null) {
        await _result.transaction.commit();

        await repo.asyncCall('hookFinish', 'save', entity, { result: _result });

        return _result
          .action('entity.save.commit')
          .data({
            id,
            entity_type: entity.entity_type,
          });
      }
      return _result
        .action('entity.save.prepare')
        .data({
          id,
          entity_type: entity.entity_type,
        });
    } catch (error) {
      await _result.transaction.rollback();

      return _result
        .action('entity.save.rollback')
        .error(error)
        .data(entity);
    }
  }

  /**
   * @param {string} entity_type
   * @param {int} id
   * @param {DatabaseResult} result 
   */
  async delete(entity_type, id, result = null) {
    let _result = result;
    if (_result === null) {
      const transaction = await (await this.connection()).transaction();
      _result = new DatabaseResult(transaction);
    }

    try {
      const schema = this.getSchema('entity', entity_type);
      const baseTable = this.getSchema('table', schema.table);
      const repo = this.getRepo('entity', entity_type);

      _result.info('schema.entity', schema);

      await repo.asyncCall('hookPreprocess', 'delete', { entity_type, id }, { result: _result });

      for (const field in schema.fields) {
        const fieldSchema = schema.fields[field];
        const fieldTable = this.getSchema('table', fieldSchema.table);

        _result.info('schema.table', fieldTable);

        await this.deleteRow(fieldTable.table, { ref: id, refType: entity_type, refField: field }, _result);
        if (_result.isError()) return _result;
      }

      await repo.asyncCall('hookPostprocess', 'delete', { entity_type, id }, { result: _result });

      await this.deleteRow(baseTable.table, { entity_type, id }, _result);
      if (_result.isError()) return _result;

      let found = _result.current._data.found;

      if (result === null) {
        await _result.transaction.commit();

        await repo.asyncCall('hookFinish', 'delete', { entity_type, id }, { result: _result });

        return _result
          .action('entity.delete.commit')
          .data({ entity_type, id, found });
      }

      return _result
        .action('entity.delete.prepare')
        .data({ entity_type, id, found });
    } catch (error) {
      await _result.transaction.rollback();

      return _result
        .action('entity.delete.rollback')
        .error(error)
        .data({ entity_type, id });
    }
  }

  async execute(querydata) {
    const select = (await this.connection()).select(...querydata.fields.map(v => v[0] + ' AS ' + v[1]));

    select.from(querydata.table);
    for (const join of querydata.joins) {
      select.leftJoin(this.as(join.table, join.field), function() {
        for (const on of join.on) {
          if (on.length === 2) {
            this.onIn(...on);
          } else {
            this.on(...on);
          }
        }
      });
    }
    for (const condition of querydata.conditions) {
      select[condition[0]](...condition.slice(1));
    }
    select.orderBy(...querydata.order);
    return await select;
  }

  /**
   * @param {string} field 
   * @param {Object<string, string>[]} result 
   */
  fetchGroup(field, result) {
    const fetched = {};

    for (const item of result) {
      if (fetched[item[field]] === undefined) {
        fetched[item[field]] = item;
      } else {
        for (const index in item) {
          if (Array.isArray(fetched[item[field]][index])) {
            if (!fetched[item[field]][index].includes(item[index])) fetched[item[field]][index].push(item[index]);
          } else if (fetched[item[field]][index] !== item[index]) {
            fetched[item[field]][index] = [fetched[item[field]][index], item[index]];
          }
        }
      }
    }
    return fetched;
  }

  /**
   * @param {string} field 
   * @param {Object<string, string>[]} result 
   */
  fetchField(field, result) {
    const fetched = [];

    for (const item of result) {
      fetched.push(item[field]);
    }
    return fetched;
  }

}