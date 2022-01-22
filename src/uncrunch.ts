import { CrunchedData, isVersionedCrunchedData } from "./crunch";
import { JSON } from "./JSON";
import * as v1 from "./v1";
import * as v2 from "./v2";

export function uncrunch(data: CrunchedData): JSON {
  if (!isVersionedCrunchedData(data)) {
    return v1.uncrunch(data);
  }

  if (data.version === 2) {
    return v2.uncrunch(data.crunched);
  }

  throw new Error(`Unsupported version ${data.version}`);
}
