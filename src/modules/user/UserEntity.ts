import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Role } from './consts'

@Entity({ name: 'users' })
export default class User {
  @ObjectIdColumn()
  _id: ObjectID

  @Column()
  username: string

  @Column()
  roles: Role[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date
}
