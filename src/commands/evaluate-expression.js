const EvaluateExpression = {
  $sub(context, values) {
    if (!values || !Array.isArray(values) || values.length !== 2) {
      throw new Error(
        "$sub requires an array of two expressions, got:",
        values
      );
    }
    const actualValues = values.map(val => evaluate(context, val));
    return actualValues[0] - actualValues[1];
  }
};

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
  return operands
    .map(val => evaluate(context, val))
    .reduce((a, b) => a + b, evaluate(context, operator));
}

export default evaluate;
