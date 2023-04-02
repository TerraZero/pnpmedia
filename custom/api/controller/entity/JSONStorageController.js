const Path = require('path');
const RedirectResponse = require('zero-router/src/Response/RedirectResponse');
const EntityBrowserResponse = require('../../response/EntityBrowserResponse');

/**
 * @controller (entity.storage.json)
 * @pattern (/entity/storage/json/:type)
 * @access (access)
 * @arg (@service.storage.json)
 */
module.exports = class ImageController {

  /**
   * @param {import('zero-jsonstorage/src/JSONStorage')} storage 
   */
  constructor(storage) {
    this.storage = storage;
  }

  /**
   * @param {import('zero-router/src/Serve')} serve 
   */
  access(serve) {
    if (this.storage.getSchema(serve.MATCH.type) === null) {
      return new EntityBrowserResponse(serve).addError('Unknown type', 'Not known storage type "' + serve.MATCH.type + '".');
    }
  }

  /**
   * @route (handlers)
   * @pattern (/handlers)
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  handlers(serve) {
    const schema = this.storage.getSchema(serve.MATCH.type);
    
    if (schema.ui && schema.ui.controller) {
      return new RedirectResponse(serve).setRoute(schema.ui.controller);
    }

    serve.json({
      handlers: {
        list: 'entity.storage.json.list',
        load: 'entity.storage.json.load',
        save: 'entity.storage.json.save',
        delete: 'entity.storage.json.delete',
      },
      type: serve.MATCH.type,
    });
  }

  /**
   * @route (list)
   * @pattern (/list(?*))
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  list(serve) {
    return new EntityBrowserResponse(serve).list(this.storage);
  }

  /**
   * @route (load)
   * @pattern (/load/:id)
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  load(serve) {
    const id = serve.int(serve.MATCH.id);
    serve.json({ id, entity: this.storage.load('image', id) });
  }

  /**
   * @route (save)
   * @pattern (/save(/:id))
   * @request (POST)
   * @param {import('zero-router/src/Serve')} serve 
   */
  async save(serve) {
    serve.set('type', serve.MATCH.type);
    serve.set('id', serve.int(serve.MATCH.id));

    const data = await serve.getJSON();
    return new EntityBrowserResponse(serve).save(this.storage, data);
  }

  /**
   * @route (delete)
   * @pattern (/delete/:id)
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve
   */
  async delete(serve) {
    const id = serve.int(serve.MATCH.id);

    this.storage.delete('image', id, true);
    serve.json({ op: 'delete', input: id });
  }

}