const { isArray, isObject, forEach } = require('./containers');

// Note: `hash` will only be called with arrays or objects.
function hash(value) {
  return isArray(value) ? JSON.stringify(value) :
         JSON.stringify(value, Object.keys(value).sort());
}

function CountedOrderedSet() {
  const index = {};
  const values = [];
  const counts = [];

  const add = value => {
    const key = hash(value);

    if (!(key in index)) {
      index[key] = values.length;
      values.push(value);
      counts.push(1);
      return values.length - 1;
    }

    const offset = index[key];
    counts[offset] += 1;
    return offset;
  };

  // We directly expose some of the internal data structures as an optimization
  // in the crunching code.
  return { add, values, counts };
}

module.exports = { CountedOrderedSet };
