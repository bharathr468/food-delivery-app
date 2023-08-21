import type { NextApiRequest, NextApiResponse } from 'next';
import getSession from '@utils/session';
import Order from '@classes/Order';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') return res.status(405).end();

	const session = await getSession(req);
	if (!session) return res.status(401).end();

	const id = req.query.id;
	if (!id) return res.status(400).send('Missing order');

	const order = new Order(parseInt(id as string));

	try {
		res.json(await order.getDetails(session.userId));
	} catch (e: any) {
		res.status(400).send(e.message);
	}
}
