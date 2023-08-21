import prisma from '@prisma';

export default class Restaurant {
	id: number;

	constructor(id: number) {
		this.id = id;
	}

	async getDetails() {
		const restaurant = await prisma.restaurants.findUnique({
			where: {
				id: this.id
			}
		});

		if (!restaurant) throw new Error('Restaurant not found');

		const menu = (
			await prisma.dishes.findMany({
				where: {
					restaurantId: this.id
				}
			})
		).map((dish) => ({ ...dish, allergens: dish.allergens.split(',') }));

		return { ...restaurant, menu };
	}
}
