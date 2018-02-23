const { isArray, isObject, isMerge, isGraphQL, mapObject } = require('./utils');

function expand(values, index, memo={}) {
  if (index in memo) {
    return memo[index];
  }

  const value = values[index];
  const recurse = (index => expand(values, index, memo));

  // GraphQL objects may be self-referential, so we special case them.
  if (isGraphQL(value)) {
    const expanded = {};
    memo[index] = expanded;
    return Object.assign(expanded, mapObject(value, recurse));
  }

  const expanded = isMerge(value) ? mapObject(merge(values, value), recurse)
                 : isArray(value) ? value.map(recurse)
                 : isObject(value) ? mapObject(value, recurse)
                 : values[index];

  memo[index] = expanded;
  return expanded;
}

function merge(values, indices) {
  const objects = indices[0].map(i => values[i]);
  objects.unshift({});
  return Object.assign.apply({}, objects);
}

module.exports = function uncrunch(values) {
  return expand(values, values.length - 1);
};
