class Character {
  constructor({
    name = "Sample Character",
    stats = { STR: 11, DEX: 11, INT: 11, WIS: 11 },
    values = {
      "need-to-pee": 0,
      "need-to-poo": 0,
      humiliation: 0,
      horniness: 0,
      "pee-incontinence": 0,
      "poo-incontinence": 0,
      "wetting-counter": 0,
      "soiling-counter": 0
    },
    status = {},
    clothes = { skirt: true, panties: true }
  }) {
    this.data = {
      name,
      stats,
      values,
      status,
      clothes,
      savingThrows: {
        ...stats,
        Force: Math.max(stats.STR, stats.DEX),
        Healing: Math.max(stats.STR, stats.INT),
        Willpower: Math.max(stats.STR, stats.WIS),
        Puzzle: Math.max(stats.DEX, stats.INT),
        Uncurse: Math.max(stats.DEX, stats.WIS),
        Holy: Math.max(stats.INT, stats.WIS)
      }
    };
    this.flatData = {
      ...this.data.stats,
      ...this.data.values,
      ...this.data.status,
      ...this.data.clothes,
      ...this.data.savingThrows
    };
  }

  /**
   * Gets the specified stat value.
   *
   * @param {string} name
   * @returns {any}
   */
  get(name) {
    return this.flatData[name];
  }

  toString() {
    return [
      `Name: ${this.data.name}`,
      `Stats: ${JSON.stringify(this.data.stats)}`,
      `Need to pee: ${this.data.values["need-to-pee"]}\tNeed to poo: ${
        this.data.values["need-to-poo"]
      }\tHorniness:${this.data.values.horniness}`,
      `Pee weakness: ${this.data.values["pee-incontinence"]}\tPoo weakness: ${
        this.data.values["poo-incontinence"]
      }`,
      `Wet times: ${this.data.values["wetting-counter"]}\tSoiled times: ${
        this.data.values["soiling-counter"]
      }`,
      `Humiliation: ${this.data.values.humiliation}`,
      `Clothes: ${Object.keys(this.data.clothes).filter(
        clothes => this.data.clothes[clothes]
      )}`,
      `Status effects: ${Object.keys(this.data.status).filter(
        status => this.data.status[status]
      )}`
    ].join("\r\n");
  }
}

export default Character;
