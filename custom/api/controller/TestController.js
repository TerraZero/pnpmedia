
/**
 * @controller (test)
 * @pattern (/test/:backend)
 * @access (access)
 * @prepare (@service.access:second)
 */
module.exports = class TestController {

  /**
   * @param {import('zero-router/src/Serve')} serve 
   */
  access(serve) {
    return serve.MATCH.backend === 'back' || 'Only backend "back" allowed.';
  }

  /**
   * @route (test)
   * @pattern (/:value(/*))
   * @prepare (@service.access:second)
   * @prepare (@service.access:prepare)
   * @access (@service.access:GET)
   * @param {import('zero-router/src/Serve')} serve 
   */
  test(serve) {
    serve.json({
      url: serve.url(),
      match: serve.MATCH,
      query: serve.getUrl(),
      prepare: serve.get('prepare'),
    });
  }

}