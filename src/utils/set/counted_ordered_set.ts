import { hash } from "./hash";
import { eq } from "./eq";
import { JSON } from "../../JSON";

export type CountedOrderedSet = ReturnType<typeof CountedOrderedSet>;

export function CountedOrderedSet() {
  const index: { [key: number]: [JSON, number][] } = {};
  const values: JSON[] = [];
  const counts: number[] = [];

  const add = (value: JSON): number => {
    const key = hash(value);
    const entry = index[key]?.find((x) => eq(x[0], value));

    if (entry != null) {
      const offset = entry[1];
      counts[offset] += 1;
      return offset;
    }

    const entries = index[key] || [];
    entries.push([value, values.length]);
    index[key] = entries;

    values.push(value);
    counts.push(1);
    return values.length - 1;
  };

  // We directly expose some of the internal data structures as an optimization
  // in the crunching code.
  return { add, values, counts };
}
