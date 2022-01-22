import { JSON, isObject } from "./JSON";
import * as v1 from "./v1";
import * as v2 from "./v2";

export type UnversionedCrunchedData = JSON[]; // v1.0 did not embed version numbers
export type VersionedCrunchedData = { version: number; crunched: JSON[] };
export type CrunchedData = UnversionedCrunchedData | VersionedCrunchedData;

export function isVersionedCrunchedData(
  data: CrunchedData
): data is VersionedCrunchedData {
  return isObject(data) && data.version != null;
}

export function crunch(data: JSON, version: number = 1): CrunchedData {
  if (version === 1) {
    return v1.crunch(data);
  }

  if (version === 2) {
    return { version, crunched: v2.crunch(data) };
  }

  // Unknown version numbers default to version 1.
  return v1.crunch(data);
}
