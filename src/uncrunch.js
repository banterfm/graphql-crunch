const { isArray, isObject, isMerge, mapObject } = require('./utils');

function expand(values, index) {
  const value = values[index];

  const recurse = (index => expand(values, index));

  return isMerge(value) ? mapObject(merge(values, value), recurse)
       : isArray(value) ? value.map(recurse)
       : isObject(value) ? mapObject(value, recurse)
       : values[index];
}

function merge(values, indices) {
  const objects = indices[0].map(i => values[i]);
  objects.unshift({});
  return Object.assign.apply({}, objects);
}

module.exports = function uncrunch(values) {
  return expand(values, values.length - 1);
};
