const Reflection = require('pencl-kit/src/Util/Reflection');
const DatabaseError = require('../error/DatabaseError');

/**
 * @controller (database)
 * @pattern (/database)
 * @arg (@service.database)
 */
module.exports = class DatabaseController {

  /**
   * @param {import('../Database')} database 
   */
  constructor(database) {
    this.database = database;
  }

  /**
   * @route (schemas)
   * @pattern (/schemas/:type(/:name))
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  async schemas(serve) {
    if (serve.MATCH.name) {
      serve.json({
        schema: this.database.getSchema(serve.MATCH.type, serve.MATCH.name),
      });
    } else {
      serve.json({
        schemas: this.database.getSchema(serve.MATCH.type),
      });
    }
  }

  /**
   * @route (row.save)
   * @pattern (/row/save/:table(/))
   * @request (POST)
   * @param {import('zero-router/src/Serve')} serve 
   */
  async rowSave(serve) {
    const result = await this.database.saveRow(serve.MATCH.table, await serve.getJSON());
    
    result.toServe(serve);
  }

  /**
   * @route (row.delete)
   * @pattern (/row/delete/:table(/))
   * @request (POST)
   * @param {import('zero-router/src/Serve')} serve 
   */
  async rowDelete(serve) {
    const result = await this.database.deleteRow(serve.MATCH.table, await serve.getJSON());

    result.toServe(serve);
  }

  /**
   * @route (query)
   * @pattern (/query/:table(?*))
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  async query(serve) {
    const con = await this.database.connection();
    const GET = serve.getUrl().query;
    const response = {
      pager: {
        limit: 10,
        offset: 0,
        page: 0,
      },
      sort: [],
      filters: [],
    };

    if (this.database.getTableFieldSchema(serve.MATCH.table, 'weight')) {
      response.sort.push(['weight', 'asc']);
    } else if (this.database.getTableFieldSchema(serve.MATCH.table, 'refDelta')) {
      response.sort.push(['refDelta', 'asc']);
    }
    if (this.database.getTableFieldSchema(serve.MATCH.table, 'id')) {
      response.sort.push(['id', 'asc']);
    }

    if (GET) {
      const GETDATA = {};
      for (const name in GET) {
        Reflection.setDeep(GETDATA, name, GET[name]);
      }

      if (GET.limit) response.pager.limit = serve.int(GET.limit);
      if (GET.offset) response.pager.offset = serve.int(GET.offset);
      if (GET.page) response.pager.page = serve.int(GET.page);
      if (GET.total) {
        const count = await con.select().table(serve.MATCH.table).count('* AS id');

        response.pager.total = count[0].id;
      }
      if (GET.schema) {
        response.schema = this.database.getSchema('table', serve.MATCH.table);
      }
      if (GET.sort) {
        const sort = serve.object(GET.sort);
        if (typeof sort === 'string') {
          response.sort = [[sort, 'asc']];
        } else {
          response.sort = sort.map((v) => {
            if (typeof v === 'string') {
              v = [v, 'asc'];
            } else if (v.length === 1) {
              v.push('asc');
            }
            return v;
          });
        }
      }
      if (GETDATA.filter) {
        for (const field in GETDATA.filter) {
          const value = serve.object(GETDATA.filter[field]);

          if (Array.isArray(value)) {
            response.filters.push([field, ...value]);
          } else {
            response.filters.push([field, '=', value]);
          }
        }
      }
    }

    response.pager.query = {
      limit: response.pager.limit,
      offset: response.pager.page * response.pager.limit + response.pager.offset,
    };

    const query = con.select()
      .table(serve.MATCH.table)
      .limit(response.pager.query.limit)
      .offset(response.pager.query.offset);

    if (response.sort.length) {
      query.orderBy(response.sort.map((v) => {
        return { column: v[0], order: v[1] };
      }));
    }

    if (response.filters.length) {
      for (const filter of response.filters) {
        switch (filter[1]) {
          case 'in':
            query.whereIn(filter[0], filter[2]);
            break;
          case 'not in': 
            query.whereNotIn(filter[0], filter[2]);
            break;
          case 'not':
            const notFilter = JSON.parse(JSON.stringify(filter));
            const column = notFilter.shift();
            notFilter.shift(); 
            query.whereNot(column, ...notFilter);
            break;
          case 'null':
            query.whereNull(filter[0]);
            break;
          case 'not null':
            query.whereNotNull(filter[0]);
            break;
          case 'exists':
            query.whereExists(filter[0]);
            break;
          case 'not exists':
            query.whereNotExists(filter[0]);
            break;
          default:
            query.where(...filter);
            break;
        }
      }
    }

    response.result = await query;
    
    serve.json(response);
  }

  /**
   * @route (load)
   * @pattern (/load/:entity/:id(/)(?*))
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  async load(serve) {
    const options = { deep: 0 };
    if (serve.getUrl().query.deep) {
      options.deep = serve.int(serve.getUrl().query.deep);
    }
    (await this.database.load(serve.MATCH.entity, serve.MATCH.id, options)).toServe(serve);
  }

  /**
   * @route (save)
   * @pattern (/save(/))
   * @request (POST)
   * @param {import('zero-router/src/Serve')} serve 
   */
  async save(serve) {
    (await this.database.save(await serve.getJSON())).toServe(serve);
  }

  /**
   * @route (delete)
   * @pattern (/delete/:entity/:id)
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  async delete(serve) {
    (await this.database.delete(serve.MATCH.entity, serve.MATCH.id)).toServe(serve);
  }

  /**
   * @route (update)
   * @pattern (/update/:table)
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  async updateTable(serve) {
    serve.json({
      result: await this.database.updateTable(serve.MATCH.table),
    });
  }

  /**
   * @route (entity.display)
   * @pattern (/entity/display/:entity(/)(?*))
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  async entityDisplay(serve) {
    /** @type {import('../Database').T_EntitySchema} */
    const schema = this.database.getSchema('entity', serve.MATCH.entity);
    /** @type {import('../Database').T_TableSchema} */
    const entityTable = this.database.getSchema('table', schema.table);
    const page = serve.getUrl().query.page || 0;
    const list = schema.ui && schema.ui.list || ['id'];
    const con = await this.database.connection();

    const idSelect = this.database.fetchField('id', await con.select('id')
      .from(entityTable.table)
      .orderBy('weight', 'asc')
      .offset(page * 10)
      .limit(10));
    
    const count = await con.select().table(entityTable.table).count('* AS id');

    const pager = {
      offset: page * 10,
      page: page,
      limit: 10,
      total: count[0].id,
    };

    const querydata = {
      table: this.database.as(entityTable.table, schema.entity),
      fields: [],
      joins: [],
      conditions: [['whereIn', schema.entity + '.id', idSelect]],
      order: [schema.entity + '.id', 'asc'],
    };
    const ui = {};
    for (const index of list) {
      let found = null;
      const split = index.split('.');
      const field = schema.fields[split[0]];

      if (field) {
        ui[split[0]] = { label: field.label };
        if (split.length === 2) {
          /** @type {import('../Database').T_TableSchema} */
          const table = this.database.getSchema('table', field.table);
          ui[split[0]] = { label: table.fields.find(v => v.name === split[1]).ui.label };
          switch (table.type) {
            case 'field':
              querydata.joins.push({
                field: schema.entity + '__' + split[0], 
                table: table.table, 
                on: [
                  [schema.entity + '.id', '=', schema.entity + '__' + split[0] + '.ref'],
                  [schema.entity + '__' + split[0] + '.refField', [split[0]]],
                  [schema.entity + '__' + split[0] + '.refType', [schema.entity]],
                ],
              });
              querydata.fields.push([schema.entity + '__' + split[0] + '.' + split[1], split[0]]);
              break;
          }
        } else {
          querydata.fields.push([schema.entity + '.' + split[0], split[0]]);
        }
      } else if (found = entityTable.fields.find(v => v.name === split[0])) {
        querydata.fields.push([schema.entity + '.' + split[0], split[0]]);
        ui[split[0]] = { label: found.ui.label };
      } else if (['id', 'weight'].includes(split[0])) {
        querydata.fields.push([schema.entity + '.' + split[0], split[0]]);
        ui[split[0]] = { label: split[0] };
      } else {
        throw new DatabaseError('Can not resolve list field "' + index + '"');
      }
    }

    const result = this.database.fetchGroup('id', await this.database.execute(querydata));

    serve.json({ pager, result, ui });
  }

  /**
   * @route (test)
   * @pattern (/test)
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  async test(serve) {
    const cha = (await this.database.save({
      entity_type: 'character',
      weight: 0,
      name: 'Cool',
      id: 11,
      fields: {
        value: {
          value: 'Value 1 - Up',
        },
        names: [
          {
            value: 'Name 1 - Up',
          },
          {
            value: 'Name 2 - Up',
          },
        ],
        file: {
          _entity: {
            id: 9,
            name: 'Logo Test - Up',
            path: 'https://pixlr.com/images/best-photo-editor-cover.png',
            weight: 0,
            entity_type: 'file',
          },
        },
      },
    }));
    
    serve.json({
      cha,
    });
  }

}