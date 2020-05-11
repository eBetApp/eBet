// TYPEORM
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
// INTERNALS
import Bet from '../../database/models/Bet';
import BaseRepository from '../../database/repositories/BaseRepository';

class BetRepository extends BaseRepository<Bet> {
	private static _instance: BetRepository;

	public static get instance(): BetRepository {
		return this._instance || new BetRepository();
	}

	repository: Repository<Bet> = this.connection?.getRepository(Bet);

	async save(bet: Bet): Promise<Bet> {
		return await super.save(bet);
	}

	async create(bet: Bet): Promise<Bet> {
		return await super.create(bet);
	}

	async get(bet: Partial<Bet>): Promise<Bet | undefined> {
		return await this.repository.findOne({
			relations: ['user'],
			where: bet,
		});
	}

	async update(
		criteria: Partial<Bet>,
		partialEntity: Partial<Bet>,
	): Promise<UpdateResult> {
		return await super.update(criteria, partialEntity);
	}

	async delete(uuid: string): Promise<DeleteResult> {
		return await super.delete(uuid);
	}
}

export default BetRepository;
