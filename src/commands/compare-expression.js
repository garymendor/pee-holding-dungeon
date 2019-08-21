class CompareExpression {
  static $gt(actualValue, conditionArgs) {
    return actualValue > conditionArgs;
  }

  static run(actualValue, condition) {
    if (typeof condition !== "object") {
      if (!actualValue) {
        return !condition;
      }
      return actualValue === condition;
    }
    // Implicit AND on conditions
    for (const operator in condition) {
      if (!CompareExpression[operator](actualValue, condition[operator])) {
        return false;
      }
    }
    return true;
  }
}

export default CompareExpression.run;
