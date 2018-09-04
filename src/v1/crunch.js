const { isContainer, map, CountedOrderedSet } = require('../utils');

function flatten(data, set) {
  const recurse = (data => flatten(data, set));
  const flattened = isContainer(data) ? map(data, recurse) : data;
  return set.add(flattened);
}

module.exports = function crunch(data) {
  const set = CountedOrderedSet();
  flatten(data, set);
  return set.values;
};
