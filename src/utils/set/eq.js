const { isArray, isObject } = require('../containers');

function eq(a, b) {
  let aIsArray = isArray(a);
  let bIsArray = isArray(b);
  if (aIsArray && bIsArray) {
    return arrayEq(a, b);
  }

  if (aIsArray || bIsArray) {
    return false;
  }

  if (isObject(a) && isObject(b)) {
    return objectEq(a, b);
  }

  return a === b;
}

function arrayEq(a, b) {
  if (a.length != b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (!eq(a[i], b[i])) {
      return false;
    }
  }

  return true;
}

function objectEq(a, b) {
  for (let key in a) {
    if (!(key in b)) {
      return false;
    }
  }

  for (let key in b) {
    if (!(key in a)) {
      return false;
    }
  }

  for (let key in a) {
    if (!eq(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

module.exports = { eq };
