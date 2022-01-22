import { isArray, isObject, JSON, JSONObject } from "../../JSON";

export function eq(a: JSON, b: JSON): boolean {
  return a === b
    ? true
    : isArray(a) && isArray(b)
    ? arrayEq(a, b)
    : isObject(a) && isObject(b)
    ? objectEq(a, b)
    : false;
}

function arrayEq(a: JSON[], b: JSON[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a !== b && !eq(a[i]!, b[i]!)) {
      return false;
    }
  }

  return true;
}

function objectEq(a: JSONObject, b: JSONObject): boolean {
  let aKeysLen = 0;

  for (let key in a) {
    aKeysLen += 1;

    if (!(key in b)) {
      return false;
    }

    if (!eq(a[key]!, b[key]!)) {
      return false;
    }
  }

  const bKeys = Object.keys(b);
  return bKeys.length === aKeysLen;
}
