const { readFileSync } = require('fs');
const { join } = require('path');
const { crunch, uncrunch } = require('../../src');

const blobs = {
  "Large SWAPI": join(__dirname, './json/swapi.json'),
  "Small SWAPI": join(__dirname, './json/small.json'),
  "Census": join(__dirname, './json/census.json'),
  "Businesses": join(__dirname, './json/businesses.json'),
}


Object.keys(blobs).forEach(blob =>
  test(`Round-tripping ${blob} blob.`, () => {
    const content = JSON.parse(readFileSync(blobs[blob]));
    expect(uncrunch(crunch(content,2))).toEqual(content);
  })
);
