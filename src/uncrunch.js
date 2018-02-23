const { isArray, isObject, mapObject } = require('./utils');

module.exports = function uncrunch(values) {
  const expanded = [];
  const lookup = (i => expanded[i]);

  for(let i = 0; i < values.length; i++) {
    const value = values[i];
    expanded[i] = isArray(value) ? value.map(lookup)
                : isObject(value) ? mapObject(value, lookup)
                : value;
  }

  return expanded[expanded.length - 1];
};
