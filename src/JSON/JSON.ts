// This `JSON` type def is really JSON-ish.
// We include Dates in our JSON definition due to popular demand.
// Lots of users blindly pass Dates back up through their API.

export type JSON = null | boolean | number | string | Date | JSONContainer;

export type JSONContainer = JSON[] | JSONObject;
export type JSONObject = { [key: string]: JSON };

export function isArray(value: JSON): value is JSON[] {
  return Array.isArray(value);
}

export function isObject(value: JSON): value is JSONObject {
  if (value === null) {
    return false;
  }

  if (typeof value !== "object") {
    return false;
  }

  if (isArray(value)) {
    return false;
  }

  if (value instanceof Date) {
    return false;
  }

  return true;
}

export function isContainer(value: JSON): value is JSONContainer {
  return isArray(value) || isObject(value);
}
