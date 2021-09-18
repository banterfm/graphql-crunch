// We overload ints to be both integers and references. We use an encoding
// scheme to differentiate. (Even numbers are refs, odds are ints)

const isReference = (value) => Number.isInteger(value) && value % 2 === 0;

function encode(value, { reference } = { reference: false }) {
  return Number.isInteger(value) === false
    ? value
    : reference === true
    ? value * 2
    : value * 2 + 1;
}

function decode(value) {
  return Number.isInteger(value) === false
    ? value
    : value % 2 === 0
    ? value / 2
    : (value - 1) / 2;
}

module.exports = { isReference, encode, decode };
