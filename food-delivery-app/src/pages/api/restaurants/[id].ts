import type { NextApiRequest, NextApiResponse } from 'next';
import Restaurant from '@classes/Restaurant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') return res.status(405).end();

	const id = req.query.id as string;
	if (!id) return res.status(400).end();

	const restaurant = new Restaurant(parseInt(id));

	try {
		res.json(await restaurant.getDetails());
	} catch (e: any) {
		res.status(400).send(e.message);
	}
}
