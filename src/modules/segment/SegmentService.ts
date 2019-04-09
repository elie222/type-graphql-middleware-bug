import { getMongoRepository } from 'typeorm'
import { Service } from 'typedi'
import Segment from './SegmentEntity'
import { ObjectId } from 'bson'
import { toObjectId } from '../common/mongo'

@Service()
export class SegmentService {
  private repository = getMongoRepository(Segment)

  async findOne(_id: string) {
    return this.repository.findOne(_id)
  }

  async find(options?: any) {
    return this.repository.find(options)
  }

  async update(_id: string | ObjectId, entity: Partial<Segment>) {
    return this.repository.findOneAndUpdate({ _id: toObjectId(_id) }, { $set: entity })
  }

  async create(entity: Partial<Segment>) {
    return this.repository.save(entity)
  }

  async remove(_id: string) {
    let entityToRemove = await this.repository.findOne(_id)
    await this.repository.remove(entityToRemove)
  }
}
