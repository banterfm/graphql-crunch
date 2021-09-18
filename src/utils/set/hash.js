const { isArray, isObject } = require("../containers");

const MAX_HASHCODE = Math.pow(2, 32);

// We assume first 256 bytes are sufficient for uniqueness.
const MAX_STRING_LEN = 256;

// These are random meaningless numbers
const NULL_HASHCODE = 2524388480;
const TRUE_HASHCODE = 1224992787;
const FALSE_HASHCODE = 875810931;

/**
 * Uses xorshift32 to map 32-bit numbers to 32-bit numbers with a pseudorandom
 * mapping.
 *
 * Returns an unsigned 32-bit number.
 */
function intHash(x) {
  x ^= x << 13;
  x ^= x >> 17;
  x ^= x << 5;
  return x + 2147483648;
}

/**
 * Returns a hashcode for JSON serializable objects.
 */
function hash(value) {
  if (value === null) {
    return NULL_HASHCODE;
  }

  if (value === true) {
    return TRUE_HASHCODE;
  }

  if (value === false) {
    return FALSE_HASHCODE;
  }

  if (typeof value === "number") {
    return intHash(value);
  }

  let code = 0;

  if (typeof value === "string") {
    const upper = Math.min(value.length, MAX_STRING_LEN);
    for (let i = 0; i < upper; i++) {
      code += intHash(i) ^ intHash(value.charCodeAt(i));
    }
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      code += intHash(i) ^ hash(value[i]);
    }
  } else {
    for (const key in value) {
      code += hash(key) ^ hash(value[key]);
    }
  }

  return code % MAX_HASHCODE;
}

module.exports = { hash };
