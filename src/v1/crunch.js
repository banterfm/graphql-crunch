const { isArray
      , isObject
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

  if (!(key in index)) {
    index[key] = values.length;
    values.push(value);
    return values.length - 1;
  }

  return index[key];
}

module.exports = function crunch(data) {
  const index = {};
  const values = [];
  flatten(data, index, values);
  return values;
};
