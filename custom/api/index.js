import Path from 'path';
import Serve from 'zero-router/src/Serve';
import Parser from 'zero-annotation';

Parser.read(__dirname, '**/*.js');
Parser.loadPlugin('zero-router');
Parser.loadPlugin('zero-jsonstorage');

Parser.initService();

/** @type {import('zero-router/src/ZeroRouter')} */
const router = Parser.getPlugin('service.router');
/** @type {import('zero-jsonstorage/src/JSONStorage')} */
const storage = Parser.getPlugin('service.storage.json');

storage.setConfig({
  path: Path.join(__dirname, '../../static/storage/data'),
  schema: Path.join(__dirname, 'schema/json'),
  debug: true,
});

export default (req, res) => {
  router.serve(new Serve(router, req, res));
};