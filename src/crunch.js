const { isArray
      , isObject
      , isGraphQL
      , isEmpty
      , mapObject
      , filterObject
      , toKey
      } = require('./utils');

function flatten(data, context) {
  const recurse = (data => flatten(data, context));
  const flattened = isArray(data) ? data.map(recurse)
                  : isObject(data) ? mapObject(data, recurse)
                  : data;
  return insert(flattened, context);
}

function insert(value, context) {
  const {index, values, mergeGraphQL} = context;
  const key = toKey(value, mergeGraphQL);

  // Merge this graphQL object if that's enabled and we've seen it already.
  if (mergeGraphQL === true && isGraphQL(value) && index.has(key)) {
    return merge(key, value, context);
  }

  // Insert the value if we haven't seen it.
  if (!index.has(key)) {
    index.set(key, values.length);
    values.push(value);
    return values.length - 1;
  }

  // Return the existing index of the value if we've already seen it.
  return index.get(key);
}

function merge(key, value, context) {
  const {index, values} = context;
  const offset = index.get(key);
  const existing = values[offset];

  // Merge in keys that aren't present in `existing`
  const isMissing = ((_, key) => existing[key] === undefined);
  const missing = filterObject(value, isMissing);
  Object.assign(existing, missing);

  // Find any fields that have different values
  const isDifferent = ((val, key) => existing[key] !== val);
  const differences = filterObject(value, isDifferent);

  // If all fields match, return the existing object
  if (isEmpty(differences)) {
    return offset;
  }

  // If all fields don't match, return a merge object
  const secondary = insert(differences, context);
  return insert([[offset, secondary]], context);
}

module.exports = function crunch(data, options={mergeGraphQL: false}) {
  const index = new Map();
  const values = [];
  const context = {index, values, mergeGraphQL: options.mergeGraphQL};
  flatten(data, context);
  return values;
};
