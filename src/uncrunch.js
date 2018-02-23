const { isArray, isObject, mapObject } = require('./utils');

module.exports = function uncrunch(values) {
  const expanded = [];
  const lookup = (i => expanded[i]);

  values.forEach(value =>
    expanded.push(isArray(value) ? value.map(lookup)
                 :isObject(value) ? mapObject(value, lookup)
                 :value)
  );

  return expanded[expanded.length - 1];
};
