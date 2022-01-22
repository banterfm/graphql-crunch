import { isObject, JSON, JSONContainer, JSONObject } from "./JSON";

type JSONIterator<Container extends JSONContainer> = (
  value: JSON,
  key: Container extends JSONObject ? string : number,
  container: Container
) => void;

function forEachObject(object: JSONObject, fn: JSONIterator<JSONObject>): void {
  for (let key in object) {
    fn(object[key]!, key, object);
  }
}

export function forEach<Container extends JSONContainer>(
  container: Container,
  fn: JSONIterator<Container>
) {
  if (isObject(container)) {
    return forEachObject(container, fn as JSONIterator<JSONObject>);
  }

  return container.forEach(fn as JSONIterator<JSON[]>);
}
