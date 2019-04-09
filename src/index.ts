import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import SegmentResolver from "./modules/segment/graphql/SegmentResolver";

// middleware
import { MiddlewareFn } from "type-graphql";
import { Context } from "apollo-server-core";

// both these middlewares have issues:

// based on: https://typegraphql.ml/docs/middlewares.html#simple-middleware
export const LogAccess: MiddlewareFn<Context> = ({ context, info }, next) => {
  console.log(context);
  console.log(info);
  return next();
};

export const ResolveTime: MiddlewareFn = async ({ info }, next) => {
  const start = Date.now();
  await next();
  const resolveTime = Date.now() - start;
  console.log(`${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`);
};

const typeGraphqlResolvers = [SegmentResolver];

buildSchema({
  resolvers: typeGraphqlResolvers,
  container: Container,
  validate: false,
  emitSchemaFile: true,
  globalMiddlewares: [LogAccess, ResolveTime]
}).then(typeGraphqlSchema => {
  const server = new ApolloServer({
    schema: typeGraphqlSchema,
    formatError: error => {
      console.error(error);
      return error;
    }
  });

  server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
