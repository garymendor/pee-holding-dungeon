const EvaluateExpression = {
  $or(context, key, values) {
    if (!values || !Array.isArray(values) || values.length === 0) {
      throw new Error(`$max requires an array of expressions, got: ${values}`);
    }
    const actualValues = values.map(val => evaluate(context, key, val));
    return actualValues.reduce((sum, val) => sum || val, false);
  },

  /**
   * Subtract the second value from the first. Assumes both evaluate to numbers.
   * @param {any} context
   * @param {string} key
   * @param {any[]} values
   * @returns {number}
   */
  $sub(context, key, values) {
    if (!values || !Array.isArray(values) || values.length !== 2) {
      throw new Error(
        `$sub requires an array of two expressions, got: ${values}`
      );
    }
    const actualValues = values.map(val => evaluate(context, key, val));
    if (!(typeof actualValues[0] === "number")) {
      throw new Error(
        `$sub requires the first expression evaluate to a number, got: ${JSON.stringify(
          actualValues[0]
        )}`
      );
    }
    if (!(typeof actualValues[1] === "number")) {
      throw new Error(
        `$sub requires the first expression evaluate to a number, got: ${JSON.stringify(
          actualValues[1]
        )}`
      );
    }
    return actualValues[0] - actualValues[1];
  },
  /**
   * Returns the maximum of all supplied values. Assumes all inputs evaluate to numbers.
   * @param {any} context
   * @param {string} key
   * @param {any[]} values
   */
  $max(context, key, values) {
    if (!values || !Array.isArray(values) || values.length === 0) {
      throw new Error(`$max requires an array of expressions, got: ${values}`);
    }
    const actualValues = values.map(val => evaluate(context, key, val));
    const response = actualValues.reduce((sum, val, index) => {
      if (typeof val !== "number") {
        throw new Error(
          `$max requires all expressions evaluate to a number, got at index ${index}: ${val}`
        );
      }
      return sum > val ? sum : val;
    }, actualValues[0]);
    return response;
  },
  /**
   * Returns the minimum of all supplied values. Assumes all inputs evaluate to numbers.
   * @param {any} context
   * @param {string} key
   * @param {any[]} values
   */
  $min(context, key, values) {
    if (!values || !Array.isArray(values) || values.length === 0) {
      throw new Error(`$min requires an array of expressions, got: ${values}`);
    }
    const actualValues = values.map(val => evaluate(context, key, val));
    const response = actualValues.reduce((sum, val, index) => {
      if (typeof val !== "number") {
        throw new Error(
          `$min requires all expressions evaluate to a number, got at index ${index}: ${val}`
        );
      }
      return sum < val ? sum : val;
    }, actualValues[0]);
    return response;
  },
  /**
   * Takes two arguments: a value to add to a stat and a minimum value for the stat.
   * Returns either the first argument or the amount that will set the stat to the
   * minimum value.
   * @param {any} context
   * @param {string} key
   * @param {any[]} values
   */
  $floor(context, key, values) {
    if (!values || !Array.isArray(values) || values.length !== 2) {
      throw new Error(
        `$floor requires an array of two expressions, got: ${values}`
      );
    }
    const [addValue, floor] = values.map(val => evaluate(context, key, val));
    const newValue = context[key] + addValue;
    return newValue >= floor ? addValue : floor - context[key];
  }
};

/**
 * Evaluates an expression object to a number.
 * @param {any} context
 * The character flatData.
 * @param {string} key
 * The key of the value being manipulated.
 * @param {any} expression
 * An object containing an expression:
 * * If it is a string, and it starts with `"$"`, return the literal string following
 *   the `$` sign. For all other strings, return the context value for that string.
 * * If it is an array, treat it as an operation. The first element of the array
 *   is the operation to perform, and the rest are the operands. If the first element
 *   of the array isn't one of the valid operands, it will be interpreted as an expression
 *   and the values of the array will be added together.
 * * Otherwise, return the original object.
 * @returns {any}
 */
function evaluate(context, key, expression) {
  if (typeof expression === "string") {
    if (expression.startsWith("$")) {
      return expression.substring(1);
    }
    return context[expression];
  }
  if (!Array.isArray(expression)) {
    return expression;
  }
  if (expression.length === 0) {
    throw new Error("Expression array with 0 elements");
  }
  const [operator, ...operands] = expression;
  const operatorFunc = EvaluateExpression[operator];
  if (operatorFunc) {
    return operatorFunc(context, key, operands);
  }
  const firstVal = evaluate(context, key, operator);
  if (!typeof firstVal === "number") {
    throw new Error(
      `$sum requires all expressions evaluate to a number, got at index 0: ${firstVal}`
    );
  }
  return operands
    .map(val => evaluate(context, key, val))
    .reduce((sum, val, index) => {
      if (typeof val !== "number") {
        throw new Error(
          `$sum requires all expressions evaluate to a number, got at index ${index +
            1}: ${val}`
        );
      }
      return sum + val;
    }, firstVal);
}

export default evaluate;
