const Https = require('https');
const Http = require('http');
const FS = require('fs');
const Path = require('path');
const EntityBrowserResponse = require('../../response/EntityBrowserResponse');

/**
 * @controller (image)
 * @pattern (/entity/image)
 * @prepare (prepare)
 * @arg (@service.storage.json)
 */
module.exports = class ImageController {

  /**
   * @param {import('zero-jsonstorage/src/JSONStorage')} storage 
   */
  constructor(storage) {
    this.storage = storage;
    this._data = null;
    this.filepath = Path.join(__dirname, '../../../../static/api/file');
  }

  /**
   * @param {import('zero-router/src/Serve')} serve 
   */
  prepare(serve) {
    serve.set('type', 'image');
  }

  download(file, url) {
    const urlo = new URL(url);
    let api = Http;
    if (urlo.protocol === 'https:') {
      api = Https;
    }

    return new Promise((resolve) => {
      const stream = FS.createWriteStream(file);
      api.get(url, (response) => {
        response.pipe(stream);
        stream.on('finish', () => {
          stream.close(resolve);  // close() is async, call cb after close completes.
        });
      });
    });
  }

  getFilename(filename, url) {
    const ext = Path.extname((new URL(url)).pathname);
    let file = null;
    let sub = 0;
    do {
      file = Path.join(this.filepath, filename + (sub === 0 ? '' : '-' + sub) + ext);
      sub++;
    } while (FS.existsSync(file));
    return file;
  }

  addFile(data) {
    data.id = ++this.data.id;
    this.data.items.push(data);
    FS.writeFileSync(this.datapath, JSON.stringify(this.data, null, '  '));
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
    const response = new EntityBrowserResponse(serve);
    serve.set('id', serve.int(serve.MATCH.id));

    const data = await serve.getJSON();

    if (!serve.get('id')) {
      if (!data.file || !data.url) {
        return response.addError('Required field', 'The fields "file" and "url" are required.');
      }
      const file = this.getFilename(data.file, data.url);

      await this.download(file, data.url);

      const basename = Path.basename(file);

      data.file = basename.substring(0, basename.length - Path.extname(basename).length);
      data.path = '/api/file/' + basename;
    }

    return response.save(this.storage, data);
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

  /**
   * @route (handlers)
   * @pattern (/handlers)
   * @request (GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  handlers(serve) {
    serve.json({
      handlers: {
        list: 'entity.storage.json.list',
        load: 'image.load',
        save: 'image.save',
        delete: 'image.delete',
      },
      type: serve.MATCH.type,
    });
  }

}