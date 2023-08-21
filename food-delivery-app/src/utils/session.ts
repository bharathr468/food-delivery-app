import prisma from '@prisma';
import type { NextApiRequest } from 'next';

export default async function getSession(req: NextApiRequest) {
	const token = req.cookies.token;
	if (!token) return null;

	const session = await prisma.sessions.findFirst({
		where: {
			token
		}
	});

	return session;
}
