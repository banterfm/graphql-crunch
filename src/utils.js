const isArray = Array.isArray;

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
  return isObject(value) ? JSON.stringify(value, Object.keys(value).sort())
                         : JSON.stringify(value);
}

module.exports = {isArray, isObject, isUndefined, mapObject, toKey};
