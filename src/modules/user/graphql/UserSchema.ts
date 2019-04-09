import { Field, ObjectType, ID } from 'type-graphql'

@ObjectType()
export default class UserSchema {
  @Field(type => ID)
  _id: string

  @Field()
  username: string

  @Field()
  createdAt: number

  @Field({ nullable: true })
  updatedAt?: number
}
