import { readFileSync } from "fs";
import { join } from "path";
import { crunch, uncrunch } from "../src";

const blobs: { [key: string]: string } = {
  "Large SWAPI": join(__dirname, "../../test/json/swapi.json"),
  "Small SWAPI": join(__dirname, "../../test/json/small.json"),
  Census: join(__dirname, "../../test/json/census.json"),
  Businesses: join(__dirname, "../../test/json/businesses.json"),
};

Object.keys(blobs).forEach((blobName) =>
  test(`GraphQL 1.0 - Round-tripping ${blobName} blob.`, () => {
    const blobPath = blobs[blobName]!;
    const content = JSON.parse(readFileSync(blobPath).toString());
    expect(uncrunch(crunch(content))).toEqual(content);
  })
);

Object.keys(blobs).forEach((blobName) =>
  test(`GraphQL 2.0 - Round-tripping ${blobName} blob.`, () => {
    const blobPath = blobs[blobName]!;
    const content = JSON.parse(readFileSync(blobPath).toString());
    expect(uncrunch(crunch(content, 2))).toEqual(content);
  })
);
