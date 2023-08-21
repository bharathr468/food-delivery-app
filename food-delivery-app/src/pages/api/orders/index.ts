import type { NextApiRequest, NextApiResponse } from 'next';
import getSession from '@utils/session';
import Order from '@classes/Order';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession(req);
	if (!session) return res.status(401).end();

	if (req.method === 'GET') {
		res.json(await Order.getOrdersOfUser(session.userId));
	} else if (req.method === 'POST') {
		res.json(await Order.CreateOrder(req.body.items, req.body.location, session.userId));
	} else res.status(405).end();
}
