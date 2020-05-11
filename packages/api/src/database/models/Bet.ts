// ORM
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Unique,
	ManyToOne,
} from 'typeorm';
import { Length, IsNotEmpty, IsEmail } from 'class-validator';
// ENCRYPT
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
// INTERNALS
import S3 from '../../services/s3Service';
import IStorageService from '../../services/IStorageService';
import User from './User';

@Entity()
export default class Bet implements IBet {
	@PrimaryGeneratedColumn('uuid')
	uuid!: string;

	@Column('text')
	@IsNotEmpty()
	name!: string;

	@ManyToOne(
		type => User,
		user => user.bets,
	)
	user!: User;
}
