import { MiddlewareFn } from 'type-graphql'
import { Context } from 'apollo-server-core'

// // based on: https://typegraphql.ml/docs/middlewares.html#simple-middleware
// export const LogAccess: MiddlewareFn<Context> = ({ context, info }, next) => {
//   console.log(context)
//   console.log(info)
//   return next()
// }

export const ResolveTime: MiddlewareFn = async ({ info }, next) => {
  const start = Date.now();
  await next();
  const resolveTime = Date.now() - start;
  console.log(`${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`);
};