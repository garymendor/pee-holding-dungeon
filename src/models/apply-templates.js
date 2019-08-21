import pickBy from "lodash/pickBy";
import isEmpty from "lodash/isEmpty";
import merge from "lodash/merge";

/**
 * Returns a copy of the input data where all values are checked for a
 * `template` string property. If present, the value will be merged with
 * the value from the template key (and the template key removed). This will
 * be repeated until all `template` references are resolved.
 *
 * `_.merge` is used to combine the objects.
 * @param {Object<string,any>} data
 */
function applyTemplates(data) {
  const templateValues = pickBy(data, value => value.template);
  if (isEmpty(templateValues)) {
    return data;
  }

  for (const key in templateValues) {
    const { template, ...values } = templateValues[key];
    // Not so performant, may be worth finding a deepClone out there
    const baseValues = JSON.parse(JSON.stringify(data[template]));
    merge(baseValues, values);
    templateValues[key] = baseValues;
  }

  const newData = { ...data, ...templateValues };
  return applyTemplates(newData);
}

// console.debug(
//   applyTemplates({
//     foo: { fred: ["wilma", "pebbles"], barney: "betty" },
//     bar: { template: "foo", fred: [, , "dino"], tall: true },
//     baz: { template: "bar", barney: "bamm-bamm", tall: false }
//   })
// );

export default applyTemplates;
