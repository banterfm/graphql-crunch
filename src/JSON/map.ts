import { isObject, JSON, JSONContainer, JSONObject } from "./JSON";

type JSONMapper<Container extends JSONContainer> = (
  value: JSON,
  key: Container extends JSON[] ? number : string,
  container: Container
) => JSON;

function mapObject(object: JSONObject, fn: JSONMapper<JSONObject>): JSONObject {
  const acc: JSONObject = {};
  for (let key in object) {
    const value = object[key]!; // The ! is because we know the key exists, but typescript doesn't.
    acc[key] = fn(value, key, object);
  }
  return acc;
}

export function map<Container extends JSONContainer>(
  container: Container,
  fn: JSONMapper<Container>
): Container {
  if (isObject(container)) {
    return mapObject(container, fn as JSONMapper<JSONObject>) as Container;
  }

  return container.map(fn as JSONMapper<JSON[]>) as Container;
}
