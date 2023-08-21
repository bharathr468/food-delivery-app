import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@prisma';
import calculateDistance from '@utils/calculateDistance';
import OpenLocationCode from '@utils/plusCodes';

export interface RestaurantItem {
	id: number;
	image: string;
	type: 'restaurant';
	about: string;
	name: string;
	location: string;
	cuisine: string;
	distance?: number;
}

export interface DishItem {
	id: number;
	image: string;
	restaurantId: number;
	type: 'dish';
	name: string;
	allergens: string[];
	price: number;
}

export type SearchItem = RestaurantItem | DishItem;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') return res.status(405).end();
	const query = req.query.q as string;
	const lat = req.query.lat as string;
	const lon = req.query.lon as string;

	const results: SearchItem[] = [];

	const dishes = await prisma.dishes.findMany({
		where: { name: { contains: query } },
		take: 10
	});
	const restaurants = await prisma.restaurants.findMany({
		where: { OR: [{ cuisine: { contains: query } }, { name: { contains: query } }] },
		take: 10
	});

	for (const dish of dishes) {
		results.push({
			...dish,
			type: 'dish',
			allergens: dish.allergens.split(',').filter((a) => a)
		});
	}

	for (const restaurant of restaurants) {
		const restaurantLocation = OpenLocationCode.decode(restaurant.location);
		const dist = calculateDistance(
			{ lat: parseFloat(lat), lon: parseFloat(lon) },
			{ lat: restaurantLocation.latitudeCenter, lon: restaurantLocation.longitudeCenter }
		);

		results.push({
			...restaurant,
			type: 'restaurant',
			distance: parseFloat(dist.toFixed(2))
		});
	}

	res.status(200).json({ results });
}
