const { crunch, uncrunch } = require('../src');

const baseCases = [
  ['undefined', undefined, []],
  ['null primitive', null, [null]],
  ['number primitive', 0, [0]],
  ['boolean primitive', true, [true]],
  ['string primitive', "string", ["string"]],
  ['empty array', [], [[]]],
  ['single-item array', [null], [null, [0]]],
  ['multi-primitive all distinct array', [null, 0, true, "string"], [null, 0, true, "string", [0, 1, 2, 3]]],
  ['multi-primitive repeated array', [true, true, true, true], [true, [0, 0, 0, 0]]],
  ['one-level nested array', [[1,2,3]], [1, 2, 3, [0, 1, 2], [3]]],
  ['two-level nested array', [[[1,2,3]]], [1, 2, 3, [0, 1, 2], [3], [4]]],
  ['empty object', {}, [{}]],
  ['single-item object', {a: null}, [null, {a: 0}]],
  ['multi-item all distinct object', {a: null, b: 0, c: true, d: "string"}, [null, 0, true, "string", {a: 0, b: 1, c: 2, d: 3}]],
  ['multi-item repeated object', {a: true, b: true, c: true, d: true}, [true, {a: 0, b: 0, c: 0, d: 0}]],
  ['complex array', [{a: true, b: [1, 2, 3]}, [1,2,3]], [true, 1, 2, 3, [1, 2, 3], {a: 0, b: 4}, [5, 4]]],
  ['complex object', {a: true, b: [1, 2, 3], c: {a: true, b: [1,2,3]}}, [true, 1, 2, 3, [1, 2, 3], {a: 0, b: 4}, {a: 0, b: 4, c: 5}]],
];

baseCases.forEach(([description, uncrunched, crunched]) => {
  test(`Crunching ${description}.`, () => {
    expect(crunch(uncrunched)).toEqual(crunched);
  });
  test(`Uncrunching ${description}.`, () => {
    expect(uncrunch(crunched)).toEqual(uncrunched);
  });
});

