# TypeGraphQL Bug Reproduction

Relevant code is in `src/index.ts`.

Run:

```sh
yarn
sudo mongod # or however you start mongo on your machine
yarn watch
```

Go to http://localhost:4000/ and enter the following query:

```gql
query {
  segments {
    name
  }
}
```

Both the `LogAccess` and `ResolveTime` middlewares taken from the docs are broken.

`LogAccess` has an issue with `next` is not defined. `ResolveTime` throws an error to do with `bind`.
