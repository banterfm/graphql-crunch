# graphql-crunch

[![NPM version](http://img.shields.io/npm/v/graphql-crunch.svg?style=flat-square)](https://www.npmjs.org/package/graphql-crunch)

Optimizes JSON responses by minimizing duplication and improving
compressibility.

On [Banter.fm](https://banter.fm), we see a 76% reduction in raw JSON size and
a 30% reduction in gzip'd size. This leads to reduced transfer time and faster
JSON parsing on mobile.

* [Client support](#client-support)
* [Installation](#installation)
* [How does it work?](#how-does-it-work)
* [Motivation](#motivation)
* [Example](#example)
  * [Small Example](#small-example)
  * [Large Example](#large-example)
* [Usage](#usage)
  * [Server-side](#server-side)
  * [Client-side](#client-side)

## Client support

`graphql-crunch` is client agnostic and can be used anywhere that sends or
receives JSON. We provide examples for integration with
[`apollo-client`](https://github.com/apollographql/apollo-client) as we use
this in a GraphQL environment.

## Installation

This library is distributed on `npm`. In order to add it as a dependency,
run the following command:

``` sh
$ npm install graphql-crunch --save
```

or with [Yarn](https://yarnpkg.com):

``` sh
$ yarn add graphql-crunch
```

## How does it work?

We flatten the object hierarchy into an array using a post-order traversal of
the object graph. As we traverse we efficiently check if we've come across a
value before, including arrays and objects, and replace it with a reference to
it's earlier occurence if we've seen it. Values are only ever present in the
array once.

### Note: Crunching and uncrunching is an entirely lossless process. The final payload exactly matches the original.

## Motivation

Large JSON blobs can be slow to parse on some mobile platforms, especially
older Android phones, so we set out to improve that. At the same time we also
wound up making the payloads more amenable to gzip compression too. GraphQL and
REST-ful API responses tend to have a lot of duplication leading to huge
payload sizes.

## Example

In these examples, we use the [SWAPI GraphQL
demo](http://graphql.org/swapi-graphql).

### Small Example

Using this
[query](http://graphql.org/swapi-graphql/?query=%7B%0A%20%20allPeople(first%3A%202)%20%7B%0A%20%20%20%20people%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20gender%0A%20%20%20%20%20%20filmConnection(first%3A%202)%20%7B%0A%20%20%20%20%20%20%20%20films%20%7B%0A%20%20%20%20%20%20%20%20%20%20title%0A%20%20%20%20%20%20%20%20%20%20characterConnection(first%3A%202)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20characters%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20gender%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&operationName=null)
we'll fetch the first 2 people and their first 2 films and the first 2
characters in each of those films. We limit the connections to the first two
items to keep the payload small:

```graphql
  {
    allPeople(first: 2) {
      people {
        name
        gender
        filmConnection(first: 2) {
          films {
            title
            characterConnection(first: 2) {
              characters {
                name
                gender
              }
            }
          }
        }
      }
    }
  }
```

We get this response:

```json
{
  "data": {
    "allPeople": {
      "people": [
        {
          "name": "Luke Skywalker",
          "gender": "male",
          "filmConnection": {
            "films": [
              {
                "title": "A New Hope",
                "characterConnection": {
                  "characters": [
                    {
                      "name": "Luke Skywalker",
                      "gender": "male"
                    },
                    {
                      "name": "C-3PO",
                      "gender": "n/a"
                    }
                  ]
                }
              },
              {
                "title": "The Empire Strikes Back",
                "characterConnection": {
                  "characters": [
                    {
                      "name": "Luke Skywalker",
                      "gender": "male"
                    },
                    {
                      "name": "C-3PO",
                      "gender": "n/a"
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          "name": "C-3PO",
          "gender": "n/a",
          "filmConnection": {
            "films": [
              {
                "title": "A New Hope",
                "characterConnection": {
                  "characters": [
                    {
                      "name": "Luke Skywalker",
                      "gender": "male"
                    },
                    {
                      "name": "C-3PO",
                      "gender": "n/a"
                    }
                  ]
                }
              },
              {
                "title": "The Empire Strikes Back",
                "characterConnection": {
                  "characters": [
                    {
                      "name": "Luke Skywalker",
                      "gender": "male"
                    },
                    {
                      "name": "C-3PO",
                      "gender": "n/a"
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```

After we crunch it, we get:

```json
{
  "data": [
    "male",
    "Luke Skywalker",
    { "gender": 0, "name": 1 },
    "n/a",
    "C-3PO",
    { "gender": 3, "name": 4 },
    [ 2, 5 ],
    { "characters": 6 },
    "A New Hope",
    { "characterConnection": 7, "title": 8 },
    "The Empire Strikes Back",
    { "characterConnection": 7, "title": 10 },
    [ 9, 11 ],
    { "films": 12 },
    { "filmConnection": 13, "gender": 0, "name": 1 },
    { "filmConnection": 13, "gender": 3, "name": 4 },
    [ 14, 15 ],
    { "people": 16 },
    { "allPeople": 17 }
  ]
}
```

The transformed payload is substantially smaller. After converting both
payloads to JSON (with formatting removed), the transformed payload is 49%
fewer bytes.

When the client receives this, we simply uncrunch it and get back the exact
original version for the client to handle.

### Large Example

In real-world scenarios, we'll generally want more attributes from our models,
as well as connections that have more than two items in them. Here's a [query](http://graphql.org/swapi-graphql/?query=%7B%0A%20%20allPeople%20%7B%0A%20%20%20%20people%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20birthYear%0A%20%20%20%20%20%20eyeColor%0A%20%20%20%20%20%20gender%0A%20%20%09%09hairColor%0A%20%20%20%20%20%20height%0A%20%20%20%20%20%20mass%0A%20%20%20%20%20%20skinColor%0A%20%20%20%20%20%20homeworld%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20population%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20filmConnection%20%7B%0A%20%20%20%20%20%20%20%20films%20%7B%0A%20%20%20%20%20%20%20%20%20%20title%0A%20%20%20%20%20%20%20%20%20%20characterConnection%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20characters%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20birthYear%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20eyeColor%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20gender%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20hairColor%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20height%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20mass%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20skinColor%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20homeworld%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20population%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&operationName=null)
similar to the one above except we don't limit the size of the connections and
we request a standard set of selections on `Person` objects.

```graphql
{
  allPeople {
    people {
      name
      birthYear
      eyeColor
      gender
      hairColor
      height
      mass
      skinColor
      homeworld {
        name
        population
      }
      filmConnection {
        films {
          title
          characterConnection {
            characters {
              name
              birthYear
              eyeColor
              gender
              hairColor
              height
              mass
              skinColor
              homeworld {
                name
                population
              }
            }
          }
        }
      }
    }
  }
}
```

The resulting response from this query is roughly 1MB of JSON (989,946 bytes),
but with tons of duplication. Here is how crunching impacts the payload size:

|                      | Raw       | Crunched | Improvement |
|----------------------|-----------|----------|-------------|
| Size                 | 989,946B  | 28,220B  | 97.1%       |
| GZip'd Size          | 22,240B   | 5,069B   | 77.2%       |

This is an admittedly extreme result, but highlights the potential for
crunching payloads with large amounts of duplication.

## Usage

### Server-side

With [`apollo-server`](https://github.com/apollographql/apollo-server) you
can supply a custom `formatResponse` function. We use this to crunch the `data`
field of the `response` before sending it over the wire.

```js
import express from 'express';
import { graphqlExpress } from 'apollo-server-express';
import { crunch } from 'graphql-crunch';

const SERVICE_PORT = 3000;

const app = express();

app.use('/graphql', graphqlExpress(() => {
  return {
    formatResponse: (response) => {
      if (response.data && !response.data.__schema) {
        response.data = crunch(response.data);
      }

      return response;
    }
  };
}));

app.listen(SERVICE_PORT);
```

To maintain compatibility with clients that aren't expecting crunched payloads,
we recommend conditioning the crunch on a query param, like so:

```js
app.use('/graphql', graphqlExpress((request) => {
  return {
    formatResponse: (response) => {
      if(request.query.crunch && response.data && !response.data.__schema) {
        response.data = crunch(response.data);
      }

      return response;
    }
  };
}));
```

Now only clients that opt-in to crunched payloads via the `?crunch` query
parameter will receive them.

### Client-side

On the client, we uncrunch the server response before the GraphQL client
processes it.

With [`apollo-client`](https://github.com/apollographql/apollo-client), use a
[`link`](https://www.apollographql.com/docs/react/reference/index.html#types)
configuration to setup an
[afterware](https://www.apollographql.com/docs/react/basics/network-layer.html#linkAfterware),
e.g.

```js
import { ApolloClient } from 'apollo-client';
import { ApolloLink, concat } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { uncrunch } from 'graphql-crunch';

const http = new HttpLink({
  credentials: 'include',
  uri: '/api'
});

const uncruncher = new ApolloLink((operation, forward) =>
  forward(operation)
    .map((response) => {
      response.data = uncrunch(response.data);
      return response;
    });
);

const client = new ApolloClient({link: concat(uncruncher, http)});
```
