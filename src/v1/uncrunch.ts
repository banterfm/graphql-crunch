import { isContainer, JSON, map } from "../JSON";

export function uncrunch(values: JSON[]): JSON {
  const expanded: JSON[] = [];
  const lookup = (i: JSON): JSON => expanded[i as number]!;

  expanded.length = values.length; // Hint at array length for perf boost.
  for (let i = 0; i < values.length; i++) {
    const value = values[i]!;
    expanded[i] = isContainer(value) ? map(value, lookup) : value;
  }

  return expanded[expanded.length - 1]!;
}
