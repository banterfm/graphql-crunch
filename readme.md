# graphql-crunch

[![NPM version](http://img.shields.io/npm/v/graphql-crunch.svg?style=flat-square)](https://www.npmjs.org/package/graphql-crunch)

Optimizes GraphQL responses by minimizing duplication and improving
compressibility.

On [Banter.fm](https://banter.fm), we see a 76% reduction in raw JSON size and
a 30% reduction in gzip'd size. This leads to reduced transfer time and faster
JSON parsing on mobile.

* [Client support](#client-support)
* [Installation](#installation)
* [How does it work?](#how-does-it-work)
* [Motivation](#motivation)
* [Example](#example)
* [Usage](#usage)
  * [Server-side](#server-side)
  * [Client-side](#client-side)

## Client support

`graphql-crunch` is client agnostic, though we provide examples for
[`apollo-client`](https://github.com/apollographql/apollo-client).

The library removes duplication in any JSON data structure, so can benefit
non-graphql payloads as well. Objects that have a `__typename` and
`id` field will (optionally) be handled specially to further reduce
duplication.

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

We flatten the object hierarchy into an array using a post-order traversal
of the object graph. As we traverse, if we come across a value that we've seen
before, including arrays and objects, we replace it with a reference to it's earlier
occurence in the traversal. Values are only ever present in the array once.

If the `mergeGraphQL` option is set to `true` (default is `false`), we will
also merge fields from GraphQL objects when possible to do so. Meaning that
we'll combine:

``` json
  [{"__typename": "User", "id": 5, "name": "Robert"},
   {"__typename": "User", "id": 5, "age": 20}]
```

into:

``` json
  [{"__typename": "User", "id": 5, "name": "Robert", "age": 20},
   {"__typename": "User", "id": 5, "name": "Robert", "age": 20}]
```

This allows us to perform further optimizations for reducing payload size.

Note: If two graphql objects have the same shape, but have fields with the same
name and different values, one object will not override the values in another.
For example:

``` json
  [{"__typename": "User", "id": 5, "name": "Robert", "age": 20},
   {"__typename": "User", "id": 5, "name": "Barbara"}]
```

will uncrunch into:

``` json
  [{"__typename": "User", "id": 5, "name": "Robert", "age": 20},
   {"__typename": "User", "id": 5, "name": "Barbara", "age": 20}]
```

## Motivation

Large JSON blobs can be slow to parse on some mobile platforms, especially
older Android phones, so we set out to improve that. At the same time we also
wound up making the payloads more amenable to gzip compression too. GraphQL
responses tend to have a lot of duplication leading to huge payload sizes.

There are other projects that exist to reduce the size of GraphQL responses but
they only handle very specific use cases and the net impact on our payloads was
minimal. This is why we created a general purpose JSON normalization library
with special optimizations for GraphQL.

## Example

In this example, we use the [SWAPI GraphQL demo](http://graphql.org/swapi-graphql).

Using this [query](http://graphql.org/swapi-graphql/?query=%7B%0A%20%20allPeople(first%3A%202)%20%7B%0A%20%20%20%20people%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20gender%0A%20%20%20%20%20%20filmConnection(first%3A%202)%20%7B%0A%20%20%20%20%20%20%20%20films%20%7B%0A%20%20%20%20%20%20%20%20%20%20title%0A%20%20%20%20%20%20%20%20%20%20characterConnection(first%3A%202)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20characters%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20gender%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&operationName=null):

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

As you can see, the transformed payload is substantially smaller.
When the client receives this, we simply uncrunch it and get back the original
expanded version for the client to handle.

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
        reponse.data = crunch(response.data);
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
app.use('/graphql', graphqlExpress(() => {
  return {
    formatResponse: (response) => {
      if(request.query.crunch && response.data && !response.data.__schema) {
        reponse.data = crunch(response.data);
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
