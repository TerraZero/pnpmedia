/**
 * @service (access)
 */
module.exports = class ControllerAccess {

  /**
   * @param {import('zero-router/src/Serve')} serve 
   */
   prepare(serve) {
    const prepare = serve.get('prepare') || [];
    prepare.push('first');
    serve.set('prepare', prepare);
  }

  /**
   * @param {import('zero-router/src/Serve')} serve 
   */
   second(serve) {
    const prepare = serve.get('prepare') || [];
    prepare.push('second');
    serve.set('prepare', prepare);
  }

  /**
   * @param {import('zero-router/src/Serve')} serve 
   */
  GET(serve) {
    return serve.isGET() || 'Only GET-request permitted.';
  }

  /**
   * @param {import('zero-router/src/Serve')} serve 
   */
  POST(serve) {
    return serve.isPOST() || 'Only POST-request permitted.';
  }

}