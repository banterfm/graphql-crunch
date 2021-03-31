const { crunch, uncrunch } = require('../../src');

const baseCases = [
  ['null primitive', null, {version: 2, crunched: [null]}],
  ['number primitive', 0, {version: 2, crunched: [1]}],
  ['boolean primitive', true, {version: 2, crunched: [true]}],
  ['string primitive', "string", {version: 2, crunched: ["string"]}],
  ['empty array', [], {version: 2, crunched: [[]]}],
  ['single-item array', [null], {version: 2, crunched: [[null]]}],
  ['multi-primitive all distinct array', [null, 0, true, "string"], {version: 2, crunched: [[null, 1, true, "string"]]}],
  ['multi-primitive repeated array', [true, true, true, true], {version: 2, crunched: [[true, true, true, true]]}],
  ['one-level nested array', [[1,2,3]], {version: 2, crunched: [0, [[3, 5, 7]]]}],
  ['two-level nested array', [[[1,2,3]]], {version: 2, crunched: [0, 0, [[[3, 5, 7]]]]}],
  ['empty object', {}, {version: 2, crunched: [{}]}],
  ['single-item object', {a: null}, {version: 2, crunched: [{a: null}]}],
  ['multi-item all distinct object', {a: null, b: 0, c: true, d: "string"}, {version: 2, crunched: [{a: null, b: 1, c: true, d: "string"}]}],
  ['multi-item repeated object', {a: null, b: null, c: null, d: null}, {version: 2, crunched: [{a: null, b: null, c: null, d: null}]}],
  ['complex array', [{a: true, b: [1, 2, 3]}, [1,2,3]], {version: 2, crunched: [[3, 5, 7], 0, [{a: true, b: 0}, 0]]}],
  ['complex object', {a: true, b: [1, 2, 3], c: {a: true, b: [1,2,3]}}, {version: 2, crunched: [[3, 5, 7], 0, {a: true, b: 0, c: {a: true, b: 0}}]}],
  ['empty object/array', {a: {}, b: []}, {version: 2, crunched: [0, 0, {a: {}, b: []}]}],
  ['date', {a: new Date("2021-03-31T18:34:09.000Z")}, {version: 2, crunched: [{a: new Date("2021-03-31T18:34:09.000Z")}]}],
];

baseCases.forEach(([description, uncrunched, crunched]) => {
  test(`Crunching ${description}.`, () => {
    expect(crunch(uncrunched, 2)).toEqual(crunched);
  });
  test(`Uncrunching ${description}.`, () => {
    expect(uncrunch(crunched)).toEqual(uncrunched);
  });
});
