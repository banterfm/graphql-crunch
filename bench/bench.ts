import { join } from "path";
import { readFileSync } from "fs";
import { gzipSync } from "zlib";
import { crunch, uncrunch } from "../src";
import { JSON } from "../src/JSON";
import { encode, decode } from "msgpack-lite";

// transit-js does not provide types
const { writer, reader }: { writer: any; reader: any } =
  require("transit-js") as any;

const tWriter = writer("json");
const tReader = reader("json");

const dataDir = join(__dirname, "../../bench/json/");

const blobs = {
  // From https://gist.githubusercontent.com/stevekrenzel/8553b5cc5462164bc9ac5b2897978405/raw/f07292666eb621a2d29dc8cee0c78a4ddb3bbadd/swapi.json
  "Large SWAPI": join(dataDir, "./large.json"),

  // From https://gist.githubusercontent.com/stevekrenzel/88c16d8655d25bed7c1b61f1750eb362/raw/4c4b7806ba51afa479224011f8138ef1346f08f6/swapi.json
  "Small SWAPI": join(dataDir, "./small.json"),

  // From https://catalog.data.gov/dataset/2010-census-populations-by-zip-code/resource/74f7a51d-36ae-4a28-9345-d8e07321f2e4
  Census: join(dataDir, "./census.json"),

  // From https://data.oregon.gov/api/views/i8h7-mn6v/rows.json
  Businesses: join(dataDir, "./businesses.json"),
};

const encoders = {
  JSON: {
    encode: (data: JSON) => JSON.stringify(data),
    decode: (data: string) => JSON.parse(data),
  },

  MsgPack: {
    encode: (data: JSON) => encode(data),
    decode: (data: string) => decode(Buffer.from(data)),
  },

  Transit: {
    encode: (data: JSON) => tWriter.write(data),
    decode: (data: string) => tReader.read(data),
  },

  "Crunch 1.0": {
    encode: (data: JSON) => JSON.stringify(crunch(data)),
    decode: (data: string) => uncrunch(JSON.parse(data)),
  },

  "Crunch 2.0": {
    encode: (data: JSON) => JSON.stringify(crunch(data, 2)),
    decode: (data: string) => uncrunch(JSON.parse(data)),
  },
};

function timeFn(
  fn: (payload: string) => void,
  payload: string,
  iterations: number
) {
  const start = new Date();
  for (let i = 0; i < iterations; i++) {
    fn(payload);
  }
  const finished = new Date();
  return finished.getTime() - start.getTime();
}

const iterations = 100;

console.log("Running... (this will take a minute)");
for (let key in blobs) {
  const blobPath = (blobs as any)[key];
  const payload = JSON.parse(readFileSync(blobPath).toString());
  const result: { [key: string]: { [key: string]: number } } = {};

  for (let key in encoders) {
    const { encode, decode } = (encoders as any)[key];
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
