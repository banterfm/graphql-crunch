const { join } = require("path");
const { readFileSync } = require("fs");
const { gzipSync } = require("zlib");
const { crunch, uncrunch } = require("../src");
const transit = require("transit-js");
const msgpack = require("msgpack-lite");

const tWriter = transit.writer("json");
const tReader = transit.reader("json");

const blobs = {
  // From https://gist.githubusercontent.com/stevekrenzel/8553b5cc5462164bc9ac5b2897978405/raw/f07292666eb621a2d29dc8cee0c78a4ddb3bbadd/swapi.json
  "Large SWAPI": join(__dirname, "./json/large.json"),

  // From https://gist.githubusercontent.com/stevekrenzel/88c16d8655d25bed7c1b61f1750eb362/raw/4c4b7806ba51afa479224011f8138ef1346f08f6/swapi.json
  "Small SWAPI": join(__dirname, "./json/small.json"),

  // From https://catalog.data.gov/dataset/2010-census-populations-by-zip-code/resource/74f7a51d-36ae-4a28-9345-d8e07321f2e4
  Census: join(__dirname, "./json/census.json"),

  // From https://data.oregon.gov/api/views/i8h7-mn6v/rows.json
  Businesses: join(__dirname, "./json/businesses.json"),

  //"Banter Feed": join(__dirname, './json/feed.json'),
};

const encoders = {
  JSON: {
    encode: (data) => JSON.stringify(data),
    decode: (data) => JSON.parse(data),
  },

  MsgPack: {
    encode: (data) => msgpack.encode(data),
    decode: (data) => msgpack.decode(data),
  },

  Transit: {
    encode: (data) => tWriter.write(data),
    decode: (data) => tReader.read(data),
  },

  "Crunch 1.0": {
    encode: (data) => JSON.stringify(crunch(data)),
    decode: (data) => uncrunch(JSON.parse(data)),
  },

  "Crunch 2.0": {
    encode: (data) => JSON.stringify(crunch(data, 2)),
    decode: (data) => uncrunch(JSON.parse(data)),
  },
};

function timeFn(fn, payload, iterations) {
  const start = new Date();
  for (let i = 0; i < iterations; i++) {
    fn(payload);
  }
  const finished = new Date();
  return finished - start;
}

const iterations = 100;

console.log("Running... (this will take a minute)");
const results = {};
for (let key in blobs) {
  const payload = JSON.parse(readFileSync(blobs[key]));
  const result = {};

  for (let key in encoders) {
    const { encode, decode } = encoders[key];
    const serialized = encode(payload);
    const zipped = gzipSync(serialized);

    result[key] = {
      "Raw (bytes)": serialized.length,
      "GZip'd (bytes)": zipped.length,
      "Serialized (ms)": timeFn(encode, payload, iterations),
      "Deserialized (ms)": timeFn(decode, serialized, iterations),
    };
  }

  console.log("");
  console.log(`${key}`);
  console.table(result);
}
