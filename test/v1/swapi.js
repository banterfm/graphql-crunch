const { readFileSync } = require('fs');
const { join } = require('path');
const { crunch, uncrunch } = require('../../src');

// JSON generated from: http://graphql.org/swapi-graphql/?query=%7B%0A%20%20allPeople%20%7B%0A%20%20%20%20people%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20birthYear%0A%20%20%20%20%20%20eyeColor%0A%20%20%20%20%20%20gender%0A%20%20%09%09hairColor%0A%20%20%20%20%20%20height%0A%20%20%20%20%20%20mass%0A%20%20%20%20%20%20skinColor%0A%20%20%20%20%20%20homeworld%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20population%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20filmConnection%20%7B%0A%20%20%20%20%20%20%20%20films%20%7B%0A%20%20%20%20%20%20%20%20%20%20title%0A%20%20%20%20%20%20%20%20%20%20characterConnection%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20characters%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20birthYear%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20eyeColor%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20gender%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20hairColor%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20height%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20mass%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20skinColor%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20homeworld%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20population%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&operationName=null
const path = join(__dirname, 'swapi.json');
const swapi = JSON.parse(readFileSync(path));

test(`Round-tripping SWAPI blob.`, () => {
  expect(uncrunch(crunch(swapi))).toEqual(swapi);
});
