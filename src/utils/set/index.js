const { hash } = require("./hash");
const { eq } = require("./eq");

function CountedOrderedSet() {
  const index = {};
  const values = [];
  const counts = [];

  const add = (value) => {
    const key = hash(value);
    const entries = index[key];
    const entry = entries?.find((x) => eq(x[0], value));

    if (entry != null) {
      const offset = entry[1];
      counts[offset] += 1;
      return offset;
    }

    index[key] = index[key] || [];
    index[key].push([value, values.length]);
    values.push(value);
    counts.push(1);
    return values.length - 1;
  };

  // We directly expose some of the internal data structures as an optimization
  // in the crunching code.
  return { add, values, counts };
}

module.exports = { CountedOrderedSet };
