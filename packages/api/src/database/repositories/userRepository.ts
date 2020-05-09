// TYPEORM
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
// INTERNALS
import User from '../../database/models/User';
import BaseRepository from '../../database/repositories/BaseRepository';

class UserRepository extends BaseRepository<User> {
	private static _instance: UserRepository;

	public static get instance(): UserRepository {
		return this._instance || new UserRepository();
	}

	repository: Repository<User> = this.connection?.getRepository(User);

	async save(user: User): Promise<User> {
		return await super.save(user);
	}

	async create(user: User): Promise<User> {
		return await super.create(user);
	}

	async get(user: Partial<User>): Promise<User | undefined> {
		return await super.get(user);
	}

	async update(
		criteria: Partial<User>,
		partialEntity: Partial<User>,
	): Promise<UpdateResult> {
		return await super.update(criteria, partialEntity);
	}

	async delete(uuid: string): Promise<DeleteResult> {
		return await super.delete(uuid);
	}
}

export default UserRepository;
