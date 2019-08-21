import RunResult from "./run-result";

/**
 * @typedef {import('./execute-event').ExecuteEventData} ExecuteEventData
 * @typedef {import('../models/result/result-collection').default} ResultCollection
 * @typedef {ExecuteEventData & {results:ResultCollection}} RunResultCollectionData
 */

class RunResultCollection {
  /**
   * @param {RunResultCollectionData} data
   */
  constructor(data) {
    /**
     * @type {RunResultCollectionData}
     */
    this.data = data;
  }

  /**
   * Runs the command.
   * @returns {Promise<import('./execute-event').ExecuteEventData>}
   */
  async run() {
    const { results, ...baseData } = this.data;
    let newData = { ...baseData, continue: true };
    for (const result of results.items()) {
      newData = await new RunResult({
        ...newData,
        result
      }).run();
      if (!newData.continue) {
        return newData;
      }
    }
    return newData;
  }
}

export default RunResultCollection;
