// ORM
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Unique,
	OneToMany,
} from 'typeorm';
import { Length, IsNotEmpty, IsEmail, IsDateString } from 'class-validator';
// ENCRYPT
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
// INTERNALS
import S3 from '../../services/s3Service';
import IStorageService from '../../services/IStorageService';
import Bet from './Bet';

@Entity()
@Unique(['email'])
export default class User implements IUser {
	@PrimaryGeneratedColumn('uuid')
	uuid!: string;

	@Column('text')
	@IsNotEmpty()
	nickname!: string;

	@Column('text')
	@IsNotEmpty()
	@IsEmail()
	email!: string;

	@Column('text')
	@IsNotEmpty()
	@IsDateString()
	birthdate!: Date; // EN COURS : accepted value -> 2019-10-09T10:36:40.791Z

	@Column('text')
	@Length(4, 20)
	@IsNotEmpty()
	password!: string;

	@Column('text', { nullable: true })
	avatar?: string;

	@Column('text', { nullable: true })
	customerId?: string;

	@Column('text', { nullable: true })
	accountId?: string;

	@OneToMany(
		type => Bet,
		bet => bet.user,
		{ onDelete: 'CASCADE' },
	)
	bets!: Bet[];

	static hashPassword(user: User): void {
		user.password = bcrypt.hashSync(user.password, 8);
	}

	static checkIfUnencryptedPasswordIsValid(
		user: User,
		unencryptedPassword: string,
	): boolean {
		return bcrypt.compareSync(unencryptedPassword, user.password);
	}

	static get storageService(): IStorageService {
		return S3;
	}

	static tokenBelongsToUser(token: string, uuid: string): boolean {
		const userFromJwt = this.getUserFromToken(token);
		if (userFromJwt === undefined) return false;
		return userFromJwt.uuid == uuid;
	}

	static getUserFromToken(token: string): User | undefined {
		try {
			return jwt.verify(token, String(process.env.SECRET)) as User;
		} catch (e) {
			return undefined;
		}
	}
}
