class Character {
  constructor({
    name = "Sample Character",
    stats = { STR: 11, DEX: 11, INT: 11, WIS: 11 },
    values = {
      "need-to-pee": 300,
      "need-to-poo": 300,
      humiliation: 0,
      horniness: 0,
      "pee-incontinence": 0,
      "poo-incontinence": 0
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

  /**
   * @param {string} name
   * @param {any} value
   * @param {any[]} events
   * An array of events that occur during the application process.
   * @returns {Character}
   */
  apply(name, value, events) {
    const newCharacter = new Character(this.data);
    switch (name) {
      // Numeric values
      case "need-to-pee":
      case "need-to-poo":
      case "humiliation":
      case "horniness":
        newCharacter.data.values[name] += value;
        break;
      case "need-for-bathroom":
        newCharacter.data.values["need-to-pee"] += value;
        newCharacter.data.values["need-to-poo"] += value / 2;
        break;
      // Clothing
      case "panties":
      case "trousers":
      case "skirt":
        events.push({ event: "apply-other", name, value });
        if (value === null) {
          delete newCharacter.data.clothes[name];
        } else {
          newCharacter.data.clothes[name] = value;
        }
        break;
      // Special cases
      case "urination":
        newCharacter.data.values["need-to-pee"] = 0;
        if (newCharacter.data.clothes.panties) {
          this.apply("wet-panties", true, events);
        }
        break;
      case "defecation":
        newCharacter.data.values["need-to-poo"] = 0;
        if (newCharacter.data.clothes.panties) {
          this.apply("soiled-panties", true, events);
        }
        break;
      default:
        events.push({ event: "apply-other", name, value });
        if (typeof value === "boolean") {
          if (value === true) {
            newCharacter.data.status[name] = true;
          } else if (value === false) {
            delete newCharacter.data.status[name];
          }
        } else {
          console.error(`Name not supported: ${name}`);
        }
    }

    return newCharacter;
  }

  toString() {
    return [
      `Name: ${this.data.name}`,
      `Stats: ${JSON.stringify(this.data.stats)}`,
      `Need to pee: ${this.data.values["need-to-pee"]}\tNeed to poo: ${
        this.data.values["need-to-poo"]
      }\tHorniness:${this.data.values.horniness}`,
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
