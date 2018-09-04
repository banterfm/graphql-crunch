const { isContainer, isReference, map, decode } = require('../utils');

function expand(data, expanded) {
  const recurse = (data => expand(data, expanded));

  return isReference(data) ? expanded[decode(data)] :
         isContainer(data) ? map(data, recurse) :
         decode(data);
}

module.exports = function uncrunch(values) {
  const expanded = [];
  expanded.length = values.length; // Hint at array length for perf boost.

  for(let i = 0; i < values.length; i++) {
    expanded[i] = expand(values[i], expanded);
  }

  return expanded[expanded.length - 1];
};
