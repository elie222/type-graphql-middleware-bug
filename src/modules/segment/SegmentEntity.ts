import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export default class Segment {
  @ObjectIdColumn()
  _id: ObjectID

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date

  @Column()
  name: string

  // this can be `null` if it's a root segment
  @Column({ nullable: true })
  parentSegmentId: string
}
