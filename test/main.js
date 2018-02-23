const { crunch, uncrunch } = require('../src');

const baseCases = [
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
  ['complex object', [{a: true, b: [1, 2, 3]}, [1,2,3]], [true, 1, 2, 3, [1, 2, 3], {a: 0, b: 4}, [5, 4]]],
  ['non-joined graphql object', [{__typename: 'Foo', id: 5, name: 'Bar'}, {__typename: 'Foo', id: 5, address: 'Baz'}], ['Foo', 5, 'Bar', {__typename: 0, id: 1, name: 2}, 'Baz', {__typename: 0, id: 1, address: 4}, [3, 5]]],
];

const graphQLCases = [
  ['simple object', {__typename: 'Foo', id: 0}, ['Foo', 0, {__typename: 0, id: 1}], {__typename: 'Foo', id: 0}],
  ['joined object', {a: {__typename: 'Foo', id: 0, name: 'Foo'}, b: {__typename: 'Foo', id: 0, address: 'Bar'}}, ['Foo', 0, {__typename: 0, id: 1, name: 0, address: 3}, 'Bar', {a: 2, b: 2}], {a: {__typename: 'Foo', id: 0, name: 'Foo', address: 'Bar'}, b: {__typename: 'Foo', id: 0, name: 'Foo', address: 'Bar'}}],
  ['merged object', {a: {__typename: 'Foo', id: 0, name: 'Foo'}, b: {__typename: 'Foo', id: 0, name: 'Bar'}}, ['Foo', 0, {__typename: 0, id: 1, name: 0}, 'Bar', {name: 3}, [[2, 4]], {a: 2, b: 5}], {a: {__typename: 'Foo', id: 0, name: 'Foo'}, b: {__typename: 'Foo', id: 0, name: 'Bar'}}],
  ['joined and merged object', {a: {__typename: 'Foo', id: 0, name: 'Foo'}, b: {__typename: 'Foo', id: 0, name: 'Bar', address: 'Bar'}}, ['Foo', 0, {__typename: 0, id: 1, name: 0, address: 3}, 'Bar', {name: 3}, [[2, 4]], {a: 2, b: 5}], {a: {__typename: 'Foo', id: 0, name: 'Foo', address: 'Bar'}, b: {__typename: 'Foo', id: 0, name: 'Bar', address: 'Bar'}}],
];

baseCases.forEach(([description, uncrunched, crunched]) => {
  test(`Crunching ${description}.`, () => {
    expect(crunch(uncrunched)).toEqual(crunched);
  });
  test(`Uncrunching ${description}.`, () => {
    expect(uncrunch(crunched)).toEqual(uncrunched);
  });
});

graphQLCases.forEach(([description, uncrunched, crunched, roundTripped]) => {
  test(`Crunching GraphQL ${description}.`, () => {
    expect(crunch(uncrunched, {mergeGraphQL: true})).toEqual(crunched);
  });
  test(`Uncrunching GraphQL ${description}.`, () => {
    expect(uncrunch(crunched)).toEqual(roundTripped);
  });
});


test('Crunching self-referential object', () => {
  const obj = {__typename: 'Foo', id: 0, ref: {__typename: 'Foo', id: 0}};

  const crunched = crunch(obj, {mergeGraphQL: true});
  expect(crunched).toEqual(['Foo', 0, {__typename: 0, id: 1, ref: 2}]);

  const uncrunched = uncrunch(crunched);
  expect(uncrunched).toBe(uncrunched.ref);
});
