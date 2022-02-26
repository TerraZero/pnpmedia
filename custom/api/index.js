import Serve from 'zero-router/src/Serve';
import Router from 'zero-router/src/ZeroRouter';

const router = new Router();

router.parser.read(__dirname, '**/*.js');
router.parser.initService();
console.log(router.manager.get('test'));

export default function (req, res, next) {
  router.serve(new Serve(req, res));
}