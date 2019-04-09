import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import * as mongoose from "mongoose";
import { ApolloServer, makeExecutableSchema } from "apollo-server";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import { mergeResolvers, mergeTypeDefs, mergeSchemas } from "graphql-toolkit";
import SegmentResolver from "./modules/segment/graphql/SegmentResolver";
import UserResolver from "./modules/user/graphql/UserResolver";
import { PORT, TYPEORM_HOST } from "./modules/common/consts";
import { authChecker } from "./modules/user/authChecker";
import { setUpAccounts, userTypeDefs } from "./modules/user/accounts";
import { setUpSegments } from "./modules/segment/setUp";

// middleware
import { MiddlewareFn } from 'type-graphql'
import { Context } from 'apollo-server-core'

// both these middlewares have issues:

// based on: https://typegraphql.ml/docs/middlewares.html#simple-middleware
export const LogAccess: MiddlewareFn<Context> = ({ context, info }, next) => {
  console.log(context)
  console.log(info)
  return next()
}

export const ResolveTime: MiddlewareFn = async ({ info }, next) => {
  const start = Date.now();
  await next();
  const resolveTime = Date.now() - start;
  console.log(`${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`);
};

createConnection()
  .then(async connection => {
    const connectionOptions = await getConnectionOptions();
    // console.log('connectionOptions', connectionOptions)

    const mongooseConnection = await mongoose.connect(
      `mongodb://${TYPEORM_HOST || "localhost"}:27017/${
        connectionOptions.database
      }`
    );

    const typeGraphqlResolvers = [SegmentResolver, UserResolver];

    const typeGraphqlSchema = await buildSchema({
      resolvers: typeGraphqlResolvers,
      container: Container,
      validate: false,
      emitSchemaFile: true,
      authChecker,
      globalMiddlewares: [LogAccess, ResolveTime]
    });

    const accountsGraphQL = setUpAccounts(mongooseConnection.connection);

    setUpSegments();

    const schema = makeExecutableSchema({
      typeDefs: mergeTypeDefs([userTypeDefs, accountsGraphQL.typeDefs]),
      resolvers: mergeResolvers([accountsGraphQL.resolvers]),
      schemaDirectives: {
        ...accountsGraphQL.schemaDirectives
      }
    });

    const server = new ApolloServer({
      schema: mergeSchemas({
        schemas: [schema, typeGraphqlSchema]
      }),
      context: accountsGraphQL.context,
      formatError: error => {
        console.error(error);
        return error;
      }
    });

    server.listen({ port: PORT }).then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    });
  })
  .catch(error => console.error(error));
