// We overload ints to be both integers and references. We use an encoding
// scheme to differentiate. (Even numbers are refs, odds are ints)

export type Referenece = number;

export function isReference(value: any): value is Referenece {
  return Number.isInteger(value) && value % 2 === 0;
}

export function encode(
  value: any,
  { reference } = { reference: false }
): number {
  if (Number.isInteger(value) === false) {
    return value;
  }

  if (reference) {
    return value * 2;
  }

  return value * 2 + 1;
}

export function decode<T>(value: T): T {
  if (Number.isInteger(value) === false) {
    return value;
  }

  const integer = value as unknown as number;

  if (integer % 2 === 0) {
    return (integer / 2) as unknown as T;
  }

  return ((integer - 1) / 2) as unknown as T;
}
