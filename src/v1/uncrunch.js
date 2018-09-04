const { isContainer, map } = require('../utils');

module.exports = function uncrunch(values) {
  const expanded = [];
  const lookup = (i => expanded[i]);

  expanded.length = values.length; // Hint at array length for perf boost.
  for(let i = 0; i < values.length; i++) {
    const value = values[i];
    expanded[i] = isContainer(value) ? map(value, lookup) : value;
  }

  return expanded[expanded.length - 1];
};
