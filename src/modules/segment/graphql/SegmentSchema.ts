import { Field, ObjectType, ID } from 'type-graphql'

@ObjectType()
export default class SegmentSchema {
  @Field(type => ID)
  _id: string

  @Field()
  createdAt?: Date

  @Field({ nullable: true })
  updatedAt?: Date

  @Field()
  name: string

  @Field({ nullable: true })
  parentSegmentId?: string
}
