const isArray = Array.isArray;

function isObject(value) {
  return (typeof value === 'object' && value !== null);
}

function isString(value) {
  return (typeof value === 'string');
}

function isEmpty(object) {
  return Object.keys(object).length === 0;
}

function isGraphQL(value) {
  return isObject(value) &&
         value['__typename'] != null &&
         value['id'] != null;
}

function isMerge(value) {
  return isArray(value) && isArray(value[0]);
}

function reduceObject(object, fn) {
  return Object.keys(object)
               .sort() // Make traversal order deterministic
               .reduce(fn, {});
}

function mapObject(object, fn) {
  return reduceObject(object, (acc, key) => {
    acc[key] = fn(object[key], key, object);
    return acc;
  });
}

function filterObject(object, fn) {
  return reduceObject(object, (acc, key) => {
    if (fn(object[key], key, object)) {
      acc[key] = object[key];
    }
    return acc;
  });
}

function toKey(value, graphql) {
  return isMerge(value) ? `<${value}>`
       : isArray(value) ? `[${value}]`
       : isString(value) ? `"${value}"`
       : (graphql && isGraphQL(value)) ? `{{${value.__typename}}{${value.id}}}`
       : isObject(value) ? `{${Object.keys(value)
                                     .sort()
                                     .map(key => [key, value[key]])}}`
       : `${value}`;
}

module.exports = {isArray, isMerge, isObject, isGraphQL, isEmpty, mapObject, filterObject, toKey};
