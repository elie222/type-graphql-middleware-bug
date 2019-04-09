import { getMongoRepository } from 'typeorm'
import { Service } from 'typedi'
import User from './UserEntity'

@Service()
export class UserService {
  private repository = getMongoRepository(User)

  async findOne(_id: string) {
    return this.repository.findOne(_id)
  }

  async all() {
    return this.repository.find()
  }

  async create(entity: any) {
    return this.repository.save(entity)
  }

  async remove(_id: string) {
    let entityToRemove = await this.repository.findOne(_id)
    await this.repository.remove(entityToRemove)
  }
}
