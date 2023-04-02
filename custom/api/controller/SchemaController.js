/**
 * @controller (storage.json)
 * @pattern (/_storage/json)
 * @arg (@service.storage.json)
 */
module.exports = class SchemaController {

  /**
   * @param {import('zero-jsonstorage/src/JSONStorage')} storage 
   */
  constructor(storage) {
    this.storage = storage;
  }

  /**
   * @route (schema)
   * @pattern (/schema/:type)
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  schema(serve) {
    const schema = this.storage.getSchema(serve.MATCH.type);
    schema.$defs = this.storage.getDefsSchema();
    serve.json({
      type: serve.MATCH.type,
      schema: schema,
    });
  }

  /**
   * @route (defs)
   * @pattern (/defs)
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  defs(serve) {
    serve.json({
      defs: this.storage.getDefsSchema(),
    });
  }

}