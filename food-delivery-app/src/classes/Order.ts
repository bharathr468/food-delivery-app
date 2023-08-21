import prisma from '@prisma';
import { CartItem } from '@pages/cart';
import OpenLocationCode from '@utils/plusCodes';
import calculateDistance from '@utils/calculateDistance';

export interface IOrder {
	id: number;
	createdAt: Date;
	eta?: Date;
	status: string;
	items?: CartItem[];
}

export interface ILoc {
	lat: number;
	lon: number;
}

export default class Order {
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

		return { ...order, items };
	}

	static async getOrdersOfUser(userId: number) {
		const orders = await prisma.orders.findMany({
			where: {
				userId
			}
		});

		return { orders };
	}

	static async CreateOrder(items: CartItem[], location: ILoc, userId: number) {
		if (!location || !location.lat || !location.lon) throw new Error('Missing location');
		if (items?.length === 0) throw new Error('Missing items');

		const order = await prisma.orders.create({
			data: {
				status: 'pending',
				userId: userId,
				deliveryAddress: OpenLocationCode.encode(location.lat, location.lon)
			}
		});

		for (const item of items as CartItem[]) {
			await prisma.order_items.create({
				data: {
					quantity: item.quantity,
					dishId: item.id,
					orderId: order.id
				}
			});
		}

		this.processOrder(order.id, items, location);
		return { id: order.id };
	}

	static async processOrder(id: number, items: CartItem[], location: ILoc) {
		const eta = await this.calculateETA(items, location);
		await prisma.orders.update({
			where: { id },
			data: {
				status: 'processing',
				eta: new Date(Date.now() + eta * 1000)
			}
		});
		setTimeout(this.updateStatus, eta * 1000);
	}

	static async calculateETA(items: { id: number }[], location: ILoc) {
		const restaurants = (
			await prisma.dishes.findMany({
				where: {
					id: { in: items.map((i) => i.id) }
				},
				select: {
					restaurantId: true
				}
			})
		).map((d) => d.restaurantId);

		const locations = (
			await prisma.restaurants.findMany({
				where: {
					id: { in: restaurants }
				},
				select: {
					location: true
				}
			})
		).map((r) => r.location);

		const distances = locations.map((l) => {
			const resLocation = OpenLocationCode.decode(l);
			return calculateDistance(location, { lat: resLocation.latitudeCenter, lon: resLocation.longitudeCenter });
		});

		const TO_AND_FRO_FACTOR = 1.25;
		const SPEED = 60; // kmph

		return Math.round(((TO_AND_FRO_FACTOR * Math.max(...distances)) / SPEED) * 60 * 60); // in seconds
	}

	static async updateStatus() {
		const orders = await prisma.orders.findMany({
			where: {
				status: 'processing',
				eta: {
					lte: new Date()
				}
			}
		});

		for (const order of orders) {
			await prisma.orders.update({
				where: { id: order.id },
				data: {
					status: 'delivered',
					eta: null
				}
			});
		}
	}
}
