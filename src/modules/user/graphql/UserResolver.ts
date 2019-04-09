import { Service } from 'typedi'
import { Arg, Resolver, Query, Authorized, Mutation, Field, InputType, ID } from 'type-graphql'
import UserSchema from './UserSchema'
import { UserService } from '../UserService'
import { Role } from '../consts'
import { accountsPassword } from '../accounts'

@Service()
@Resolver(UserSchema)
export default class UserResolver {
  constructor(private readonly service: UserService) {}

  @Query(returns => [UserSchema])
  @Authorized(Role.ADMIN)
  async users() {
    const all = await this.service.all()

    return all
  }

  // this overrides accounts js `createUser` function
  @Mutation(returns => ID)
  async createUser(@Arg('user', returns => AdminCreateUserInput) user: AdminCreateUserInput) {
    const users = await this.service.all()

    // if we already have a user in the system, disable sign up using this method.
    if (users.length) {
      throw new Error(
        'Please use adminCreateUser to create a new user. Regular sign up is disabled.'
      )
    }

    // create admin super user

    const createdUserId = await accountsPassword.createUser({
      ...user,
      // give super user all roles
      roles: [Role.SUPER_USER, Role.ADMIN, Role.READ_ONLY],
    })

    return createdUserId
  }

  @Mutation(returns => UserSchema)
  @Authorized(Role.ADMIN)
  async adminCreateUser(@Arg('user', returns => AdminCreateUserInput) user: AdminCreateUserInput) {
    console.log('user', user)

    const createdUserId = await accountsPassword.createUser(user)

    const createdUser = await this.service.findOne(createdUserId)

    console.log('createdUser', createdUser)

    return createdUser
  }
}

@InputType()
class AdminCreateUserInput implements Partial<UserSchema> {
  @Field(type => String)
  username: string

  @Field(type => String)
  email: string

  @Field(type => String)
  password: string

  @Field(type => String)
  firstName: string

  @Field(type => String)
  lastName: string

  @Field(type => String, { nullable: true })
  phone?: string

  @Field(type => Boolean, { defaultValue: false })
  auditor: boolean

  @Field(type => [String], { defaultValue: [Role.READ_ONLY] })
  roles: Role[]
}
