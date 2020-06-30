require('dotenv').config();

const neededValues = [
	'DB_DEV_URL',
	'DB_DEV_SSL',
	'SECRET',
	'MAIL_KEY',
	'MAIL_DOMAIN',
	'AWS_S3_SECRET_ACCESS_KEY',
	'AWS_S3_ACCESS_KEY_ID',
	'AWS_S3_REGION',
	'AWS_S3_BUCKET',
	'STRIPE_KEY',
	'PORT',
	'HOST',
	'PANDA_SCORE_API',
];

const missingValues = neededValues.filter(
	(v: string): boolean => !process.env[v],
);

if (missingValues.length > 0) {
	throw `INCORRECT .env file!! Missing values: [${missingValues.join('/')}]`;
}
