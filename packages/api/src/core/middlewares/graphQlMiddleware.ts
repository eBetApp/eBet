// SERVER
import { Application } from 'express';
// GRAPHQL
import { ApolloServer } from 'apollo-server-express';
import { buildContext } from 'graphql-passport';
import { typeDefs } from '../../controllers/graphQl/typeDefs';
import { resolvers } from '../../controllers/graphQl/resolvers';
// INTERNALS
import User from '../../database/models/User';

const graphQlMiddleware = (app: Application): void => {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req, res }) => buildContext({ req, res, User }),
	});
	server.applyMiddleware({ app });
};

export default graphQlMiddleware;
