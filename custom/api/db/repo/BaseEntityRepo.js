/**
 * @typedef {Object} T_EntityRepoInfo
 * @property {Object} schemas
 * @property {Object} schemas.entity
 * @property {import('../Database').T_TableSchema} schemas.table
 * @property {import('../DatabaseResult')} result
 */

module.exports = class BaseEntityRepo {

  /**
   * @param {string} action
   * @param {Object} data 
   * @param {T_EntityRepoInfo} info 
   */
  async hookPreprocess(action, data, info) { }

  /**
   * @param {string} action
   * @param {Object} data 
   * @param {T_EntityRepoInfo} info 
   */
  async hookPostprocess(action, data, info) { }

  /**
   * @param {string} action
   * @param {Object} data 
   * @param {T_EntityRepoInfo} info 
   */
  async hookFinish(action, data, info) { }

}