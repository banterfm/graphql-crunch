import { forEach, isContainer, map, JSON, JSONContainer } from "../JSON";
import { isReference, encode, decode, CountedOrderedSet } from "../utils";

function flatten(data: JSON, set: CountedOrderedSet): JSON {
  if (!isContainer(data)) {
    return encode(data);
  }

  const recurse = (data: JSON) => flatten(data, set);
  const flattened = map(data, recurse);
  const position = set.add(flattened);
  return encode(position, { reference: true });
}

// Any values that are only used once are hoisted into their container
// and zeroed out.
function compact(set: CountedOrderedSet): void {
  const { values, counts } = set;
  values.forEach((container) => {
    forEach(container as JSONContainer, (value: JSON, key: string | number) => {
      if (!isReference(value)) {
        return;
      }

      const index = decode(value);
      const count = counts[index];
      if (count != null && count > 1) {
        return;
      }

      // Typescript doesn't know if this is an object or array
      // but `forEach` ensures safety here for us
      (container as any)[key] = values[index]!;
      values[index] = 0 as unknown as JSONContainer;
    });
  });
}

export function crunch(data: JSON): JSON[] {
  if (!isContainer(data)) {
    return [encode(data)];
  }

  const set = CountedOrderedSet();
  flatten(data, set);
  compact(set);

  return set.values;
}
