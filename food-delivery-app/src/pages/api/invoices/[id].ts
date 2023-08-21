import type { NextApiRequest, NextApiResponse } from 'next';
import getSession from '@utils/session';
import Invoice from '@classes/Invoice';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') return res.status(405).end();

	const session = await getSession(req);
	if (!session) return res.status(401).end();

	const id = req.query.id;
	if (!id) return res.status(400).send('Missing invoice');

	const invoice = new Invoice(parseInt(id as string));

	try {
		res.json(await invoice.getDetails(session.userId));
	} catch (e: any) {
		res.status(400).send(e.message);
	}
}
