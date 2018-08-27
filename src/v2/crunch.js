const { isContainer
      , isReference
      , map
      , forEach
      , encode
      , decode
      , CountedOrderedSet
      } = require('./utils');

function flatten(data, set) {
  if (!isContainer(data)) {
    return encode(data);
  }

  const recurse = (data => flatten(data, set));
  const flattened = map(data, recurse);
  const position = set.add(flattened);
  return encode(position, {reference: true});
}

function compact({values, counts}) {
  forEach(values, container =>
    forEach(container, (value, key) => {
      const index = decode(value);

      if (!isReference(value) || counts[index] > 1) {
        return;
      }

      container[key] = values[index];
      values[index] = 0;
    })
  );
}

module.exports = function crunch(data) {
  if (!isContainer(data)) {
    return [encode(data)];
  }

  const set = CountedOrderedSet();
  flatten(data, set);
  compact(set);

  return set.values;
};
