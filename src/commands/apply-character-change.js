import Character, {
  DEFAULT_CLOTHING_TYPES
} from "../models/character/character";
import evaluateExpression from "./evaluate-expression";

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
    const evaluatedValue = evaluateExpression(
      character.flatData,
      name,
      inputValue
    );
    const value = invert ? this.invert(evaluatedValue) : evaluatedValue;

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
      case "shirt":
      case "panties":
      case "trousers":
      case "skirt":
        response.statusChanges[name] = !!value;
        if (value === null) {
          delete newCharacterData.clothes[name];
          delete newCharacterData.clothingTypes[name];
        } else {
          newCharacterData.clothes[name] = !!value;
          if (value) {
            newCharacterData.clothingTypes[name] =
              typeof value === "string" ? value : DEFAULT_CLOTHING_TYPES[name];
          }
        }
        break;
      // Special cases
      case "urination":
        // Peeing, with a wetting accident if panties are on
        newCharacterData.values["need-to-pee"] = 0;
        response.statusChanges[name] = true;
        if (newCharacterData.clothes.panties) {
          response.statusChanges["wet-panties"] = true;
          newCharacterData.status["wet-panties"] = true;
          newCharacterData.values["wetting-counter"]++;
        }
        break;
      case "urination-nopan":
        // Peeing with panties pulled down.
        newCharacterData.values["need-to-pee"] = 0;
        response.statusChanges["urination"] = true;
        break;
      case "defecation":
        // Pooping, with a wetting accident if panties are on
        newCharacterData.values["need-to-poo"] = 0;
        response.statusChanges[name] = true;
        if (newCharacterData.clothes.panties) {
          response.statusChanges["soiled-panties"] = true;
          newCharacterData.status["soiled-panties"] = true;
          newCharacterData.values["soiling-counter"]++;
        }
        break;
      case "defecation-nopan":
        // Pooping with panties pulled down.
        newCharacterData.values["need-to-poo"] = 0;
        response.statusChanges["defecation"] = true;
        break;
      // Sleep gives you a chance to roll saving throws against all status effects with a save.
      // TODO: Implement this in run-effect-result.
      case "sleep":
      // Climax represents an orgasm. Most events that trigger climax will take care of reducing horniness.
      case "climax":
        response.statusChanges[name] = value;
        break;
      default:
        response.statusChanges[name] = value;
        if (typeof value === "boolean" || value === null) {
          if (value === true) {
            newCharacterData.status[name] = true;
          } else {
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
