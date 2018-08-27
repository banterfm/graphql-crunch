const isArray = Array.isArray;

function isString(x) {
  return typeof(x) === 'string';
}

function isObject(value) {
  return (typeof value === 'object' && value !== null);
}

function isUndefined(value) {
  return value === undefined;
}

function mapObject(object, fn) {
  return Object.keys(object)
               .reduce((acc, key) => {
                 acc[key] = fn(object[key], key, object);
                 return acc;
               }, {});
}

function toKey(value) {
  // We know arrays will always only contain integers, so we can optimize
  // their serialization.
  return isArray(value) ? `[${value}]` :
         isString(value) ? `"${value}"` :
         isObject(value) ? JSON.stringify(value, Object.keys(value).sort()) :
         value;
}

module.exports = {isArray, isObject, isUndefined, mapObject, toKey};
