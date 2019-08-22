const EvaluateExpression = {
  /**
   * Subtract the second value from the first. Assumes both evaluate to numbers.
   * @param {any} context
   * @param {any[]} values
   * @returns {number}
   */
  $sub(context, values) {
    if (!values || !Array.isArray(values) || values.length !== 2) {
      throw new Error(
        `$sub requires an array of two expressions, got: ${values}`
      );
    }
    const actualValues = values.map(val => evaluate(context, val));
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
   * @param {any[]} values
   */
  $max(context, values) {
    if (!values || !Array.isArray(values)) {
      throw new Error(`$max requires an array of expressions, got: ${values}`);
    }
    const actualValues = values.map(val => evaluate(context, val));
    return actualValues.reduce((sum, val, index) => {
      if (typeof val !== "number") {
        throw new Error(
          `$max requires all expressions evaluate to a number, got at index ${index}: ${val}`
        );
      }
      return sum + val;
    }, 0);
  }
};

/**
 * Evaluates an expression object to a number.
 * @param {any} context
 * The character flatData.
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
function evaluate(context, expression) {
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
    return operatorFunc(context, operands);
  }
  const firstVal = evaluate(context, operator);
  if (!typeof firstVal === "number") {
    throw new Error(
      `$sum requires all expressions evaluate to a number, got at index 0: ${firstVal}`
    );
  }
  return operands
    .map(val => evaluate(context, val))
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
