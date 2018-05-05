const { isArray
      , isObject
      , isUndefined
      , mapObject
      , filterObject
      , toKey
      } = require('./utils');

function flatten(data, index, values) {
  const recurse = (data => flatten(data, index, values));
  const flattened = isArray(data) ? data.map(recurse)
                  : isObject(data) ? mapObject(data, recurse)
                  : data;
  return insert(flattened, index, values);
}

function insert(value, index, values) {
  const key = toKey(value);

  if (!index.has(key)) {
    index.set(key, values.length);
    values.push(value);
    return values.length - 1;
  }

  return index.get(key);
}

module.exports = function crunch(data) {
  if (isUndefined(data)) {
    return [];
  }
  const index = new Map();
  const values = [];
  flatten(data, index, values);
  return values;
};
