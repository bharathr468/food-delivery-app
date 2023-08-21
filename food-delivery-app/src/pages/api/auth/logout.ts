import prisma from '@prisma';
import getSession from '@utils/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') return res.status(405).end();

	const session = await getSession(req);

	if (session) {
		await prisma.sessions.delete({
			where: {
				id: session.id
			}
		});
	}

	res.setHeader('Set-Cookie', [`token=; Path=/; HttpOnly; Secure`, `username=; Path=/; Secure`]).status(204).end();
}
