import { isReference, decode } from "../utils";
import { isContainer, map, JSON } from "../JSON";

function expand(data: JSON, expanded: JSON[]): JSON {
  const recurse = (data: JSON) => expand(data, expanded);

  if (isReference(data)) {
    return expanded[decode(data)]!;
  }

  if (isContainer(data)) {
    return map(data, recurse);
  }

  return decode(data);
}

export function uncrunch(values: JSON[]): JSON {
  const expanded: JSON[] = [];
  expanded.length = values.length; // Hint at array length for perf boost.

  for (let i = 0; i < values.length; i++) {
    expanded[i] = expand(values[i]!, expanded);
  }

  return expanded[expanded.length - 1]!;
}
