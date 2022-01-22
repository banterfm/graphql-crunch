import { uncrunch } from "../src";

test(`Uncrunching an unknown version throws an error`, () => {
  expect(() => uncrunch({ version: 3, crunched: [] })).toThrowError(
    /Unsupported version/
  );
});
