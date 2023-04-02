/**
 * @controller (v2.database)
 * @pattern (/v2/database)
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
   * @route (data)
   * @pattern (/data(/))
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  async data(serve) {
    const files = await this.database.loadByProps('file', []);
    serve.json(files.map(v => {
      if (v.info) {
        v.info = JSON.parse(v.info);
      } else {
        v.info = {};
      }
      return v;
    }));
  }

}