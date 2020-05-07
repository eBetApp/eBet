import { Request } from 'express'

export const getTokenFromHeader = (req: Request): string | undefined =>
	req.headers?.authorization?.replace('Bearer ', '')
