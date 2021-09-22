const { readFileSync } = require("fs");
const { join } = require("path");
const { crunch, uncrunch } = require("../src");

const blobs = {
  "Large SWAPI": join(__dirname, "../../test/json/swapi.json"),
  "Small SWAPI": join(__dirname, "../../test/json/small.json"),
  Census: join(__dirname, "../../test/json/census.json"),
  Businesses: join(__dirname, "../../test/json/businesses.json"),
};

Object.keys(blobs).forEach((blob) =>
  test(`GraphQL 1.0 - Round-tripping ${blob} blob.`, () => {
    const content = JSON.parse(readFileSync(blobs[blob]));
    expect(uncrunch(crunch(content))).toEqual(content);
  })
);

Object.keys(blobs).forEach((blob) =>
  test(`GraphQL 2.0 - Round-tripping ${blob} blob.`, () => {
    const content = JSON.parse(readFileSync(blobs[blob]));
    expect(uncrunch(crunch(content, 2))).toEqual(content);
  })
);
