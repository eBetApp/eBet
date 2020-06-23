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

	@ManyToOne(
		type => User,
		user => user.bets,
	)
	user!: User;

	@Column('int')
	amount!: number;

	@Column('bool')
	ended!: boolean;

	@Column('int')
	idMatch!: number;

	@Column('int')
	idTournament!: number;

	@Column('int')
	idTeamBet!: number;

	@Column('int')
	idWinner!: number;

	@Column('text')
	game!: string;

	@Column('text')
	team1!: string;

	@Column('int')
	idTeam1!: number;

	@Column('text')
	team2!: string;

	@Column('int')
	idTeam2!: number;
}
