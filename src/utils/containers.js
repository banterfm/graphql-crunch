const isArray = Array.isArray;

const isObject = value => (typeof value === 'object' && value !== null && !(value instanceof Date));

const isContainer = value => isArray(value) || isObject(value);

function mapObject(object, fn) {
  const acc = {};
  for(let key in object) {
    acc[key] = fn(object[key], key, object);
  }
  return acc;
}

function forEachObject(object, fn) {
  for(let key in object) {
    fn(object[key], key, object);
  }
}

function map(container, fn) {
  return isArray(container) ? container.map(fn)
                            : mapObject(container, fn);
}

function forEach(container, fn) {
  return isArray(container) ? container.forEach(fn)
                            : forEachObject(container, fn);
}

module.exports = { isArray, isObject, isContainer, map, forEach };
