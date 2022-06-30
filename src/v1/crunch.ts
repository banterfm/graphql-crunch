import { JSON } from "../JSON";
import { isContainer, map } from "../JSON";
import { CountedOrderedSet } from "../utils";

function flatten(data: JSON, set: CountedOrderedSet): number {
  const recurse = (data: JSON) => flatten(data, set);
  const flattened = isContainer(data) ? map(data, recurse) : data;
  return set.add(flattened);
}

export function crunch(data: JSON): JSON[] {
  const set = CountedOrderedSet();
  flatten(data, set);
  return set.values;
}
