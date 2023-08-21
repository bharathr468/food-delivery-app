import prisma from '@prisma';

export default class Invoice {
	id: number;

	constructor(id: number) {
		this.id = id;
	}

	async getDetails(userId: number) {
		const order = await prisma.orders.findUnique({ where: { id: this.id } });

		if (!order) throw new Error('Order not found');
		if (order.userId !== userId) throw new Error('Unauthorized');

		const items = await prisma.order_items.findMany({
			where: {
				orderId: order.id
			}
		});

		const user = await prisma.users.findFirst({
			where: {
				id: order.userId
			}
		});

		const dishItems = await prisma.dishes.findMany({
			where: {
				id: {
					in: items.map((item) => item.dishId)
				}
			}
		});

		return {
			user: {
				name: user!.username,
				email: user!.email,
				address: order.deliveryAddress
			},
			invoiceId: order.id,
			date: order.createdAt.toDateString(),
			taxRate: 1.5,
			products: items.map((item) => {
				const dishItem = dishItems.find((dish) => dish.id === item.dishId)!;
				return {
					quantity: item.quantity.toString(),
					name: dishItem.name,
					price: dishItem.price
				};
			})
		};
	}
}
