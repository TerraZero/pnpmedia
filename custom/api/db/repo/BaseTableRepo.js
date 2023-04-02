/**
 * @typedef {Object} T_TableRepoInfo
 * @property {Object} schemas
 * @property {import('../Database').T_TableSchema} schemas.table
 * @property {import('../result/DatabaseResult')} result
 */

module.exports = class BaseTableRepo {

  /**
   * @param {string} action
   * @param {Object} data 
   * @param {T_TableRepoInfo} info 
   */
  async hookPreprocess(action, data, info) { }

  /**
   * @param {string} action
   * @param {Object} data 
   * @param {T_TableRepoInfo} info 
   */
  async hookPostprocess(action, data, info) { }

  /**
   * @param {string} action
   * @param {Object} data 
   * @param {T_TableRepoInfo} info 
   */
  async hookFinish(action, data, info) { }

}