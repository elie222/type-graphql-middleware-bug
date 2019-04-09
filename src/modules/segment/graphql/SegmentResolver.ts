import { Service } from 'typedi'
import {
  Arg,
  Resolver,
  Query,
  Mutation,
  InputType,
  Field,
  Ctx,
  Authorized,
  FieldResolver,
  Root,
  ResolverInterface,
} from 'type-graphql'
import { Context } from 'apollo-server-core'
import SegmentSchema from './SegmentSchema'
import { SegmentService } from '../SegmentService'
import { Role } from '../../user/consts'

@Service()
@Resolver(of => SegmentSchema)
// implements ResolverInterface<SegmentSchema>
export default class SegmentResolver {
  constructor(private readonly service: SegmentService) {}

  @Query(returns => SegmentSchema, { nullable: true })
  async segment(@Arg('_id') _id: string) {
    const doc = await this.service.findOne(_id)

    return doc
  }

  @Query(returns => [SegmentSchema])
  async segments() {
    const all = await this.service.find()

    return all
  }

  @Authorized(Role.ADMIN)
  @Mutation(returns => SegmentSchema)
  async createSegment(
    @Arg('data', type => CreateSegmentInput) data: CreateSegmentInput,
    @Ctx() ctx: Context
  ) {
    const res = await this.service.create(data)

    return res
  }

  @Authorized(Role.ADMIN)
  @Mutation(returns => SegmentSchema)
  async updateSegment(
    @Arg('_id', type => String) _id: string,
    @Arg('data', type => UpdateSegmentInput) data: UpdateSegmentInput,
    @Ctx() ctx: Context
  ) {
    const res = await this.service.update(_id, data)

    return this.service.findOne(_id)
  }

  @Authorized(Role.ADMIN)
  @Mutation(returns => Boolean)
  async deleteSegment(@Arg('_id', type => String) _id: string, @Ctx() ctx: Context) {
    await this.service.remove(_id)

    return true
  }

  // @FieldResolver(returns => [SegmentSchema], { nullable: true })
  // childSegments(@Root() segment: SegmentSchema) {
  //   return this.service.find({
  //     parentSegmentId: segment.parentSegmentId,
  //   })
  // }
}

@InputType()
class CreateSegmentInput implements Partial<SegmentSchema> {
  @Field()
  name: string

  @Field({ nullable: true })
  parentSegmentId: string
}

@InputType()
class UpdateSegmentInput implements Partial<SegmentSchema> {
  @Field()
  name?: string

  @Field({ nullable: true })
  parentSegmentId?: string
}
