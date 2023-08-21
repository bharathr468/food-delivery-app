import prisma from '@prisma';
import { randomBytes } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).end();

	const { username, email, password } = req.body;
	if (!username || !email || !password) return res.status(404).send('Missing credentials');

	const { ok, error } = vailidateCredentials(username, email, password);
	if (!ok) return res.status(400).send(error);

	const user = await prisma.users.create({
		data: {
			username,
			email,
			password
		}
	});

	const session = await prisma.sessions.create({
		data: {
			userId: user.id,
			token: randomBytes(128).toString('hex')
		}
	});

	res
		.setHeader('Set-Cookie', [
			`token=${session.token}; Path=/; HttpOnly; Secure; Max-Age=${MAX_AGE}`,
			`username=${user.username}; Path=/; Secure; Max-Age=${MAX_AGE}`
		])
		.status(204)
		.end();
}

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function vailidateCredentials(username: string, email: string, password: string): { ok: boolean; error?: string } {
	if (username.length < 3) return { ok: false, error: 'Username is too short' };
	if (username.length > 32) return { ok: false, error: 'Username is too long' };

	if (email.length < 3) return { ok: false, error: 'Email is too short' };
	if (email.length > 32) return { ok: false, error: 'Email is too long' };
	if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) === false) return { ok: false, error: 'Email is invalid' };

	if (password.length < 5) return { ok: false, error: 'Password is too short' };
	if (password.length > 32) return { ok: false, error: 'Password is too long' };

	return { ok: true };
}
