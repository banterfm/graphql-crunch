// For now, this just covers lines that aren't exercised in the other tests

import { eq } from "../src/utils/set/eq";

test(`Tests different length arrays`, () =>
  expect(eq([1, 2, 3], [1, 2, 3, 4])).toEqual(false));

test(`Tests different arrays of same length`, () =>
  expect(eq([1, 2, 3], [1, 2, 4])).toEqual(false));

test(`Tests first object as a superset`, () =>
  expect(eq({ foo: 1, bar: 2 }, { foo: 1 })).toEqual(false));

test(`Tests second object as a superset`, () =>
  expect(eq({ foo: 1 }, { foo: 1, bar: 2 })).toEqual(false));

test(`Tests different objects of same shape`, () =>
  expect(eq({ foo: 1 }, { foo: 2 })).toEqual(false));
