import Character from "../models/character/character";

/**
 * The request to change a character's value.
 * @typedef {Object} ApplyCharacterChangeRequest
 * @property {Character} character
 * The character to modify.
 * @property {string} name
 * The flat name of the property to modify.
 * @property {any} value
 * The new value of the property.
 * @property {boolean} invert
 * If true, apply the value in reverse. If numeric, it will be subtracted
 * rather than added. Otherwise return true if value is falsy and null
 * if value is truthy.
 * This option is useful for status effects - apply changes normally when the
 * status effect is added and then invert them when it is removed.
 */

/**
 * @typedef {Object} ApplyCharacterChangeResponse
 * @property {Character} character
 * The modified version of the requested character.
 * @property {Object<string,boolean>} statusChanges
 * A collection of additional property changes that were made.
 * (This may be later rolled into the status change system.)
 */

class ApplyCharacterChange {
  invert(value) {
    if (typeof value === "number") {
      return -value;
    }
    return value ? null : true;
  }

  /**
   * Changes a character.
   * @param {ApplyCharacterChangeRequest} request
   * The information about the character and the change to make.
   * @returns {ApplyCharacterChangeResponse}
   */
  run(request) {
    const { character, name, value: inputValue, invert } = request;
    const response = { statusChanges: {} };
    let newCharacterData = { ...character.data };
    const value = invert ? this.invert(inputValue) : inputValue;

    switch (name) {
      // Numeric values
      case "need-to-pee":
      case "need-to-poo":
      case "humiliation":
      case "horniness":
      case "pee-incontinence":
      case "poo-incontinence":
      case "wetting-counter":
      case "soiling-counter":
        newCharacterData.values[name] += value;
        break;
      case "need-for-bathroom":
        newCharacterData.values["need-to-pee"] += value;
        newCharacterData.values["need-to-poo"] += value / 2;
        break;
      // Clothing
      case "panties":
      case "trousers":
      case "skirt":
        response.statusChanges[name] = value;
        if (value === null) {
          delete newCharacterData.clothes[name];
        } else {
          newCharacterData.clothes[name] = value;
        }
        break;
      // Special cases
      case "urination":
        newCharacterData.values["need-to-pee"] = 0;
        response.statusChanges[name] = true;
        if (newCharacterData.clothes.panties) {
          response.statusChanges["wet-panties"] = true;
          newCharacterData.status["wet-panties"] = true;
          newCharacterData.values["wetting-counter"]++;
        }
        break;
      case "defecation":
        newCharacterData.values["need-to-poo"] = 0;
        response.statusChanges[name] = true;
        if (newCharacterData.clothes.panties) {
          response.statusChanges["soiled-panties"] = true;
          newCharacterData.status["soiled-panties"] = true;
          newCharacterData.values["soiling-counter"]++;
        }
        break;
      default:
        response.statusChanges[name] = value;
        if (typeof value === "boolean") {
          if (value === true) {
            newCharacterData.status[name] = true;
          } else if (value === false) {
            delete newCharacterData.status[name];
          }
        } else {
          console.error(`Name not supported: ${name}`);
        }
    }
    response.character = new Character(newCharacterData);
    return response;
  }
}

export default ApplyCharacterChange;
