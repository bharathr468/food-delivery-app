import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function populateMockData() {
	await prisma.users.create({
		data: {
			username: 'Admin',
			email: 'root',
			password: 'root'
		}
	});

	const r1 = await prisma.restaurants.create({
		data: {
			name: 'Restaurant foo',
			image: 'https://cdn.pixabay.com/photo/2018/07/14/15/27/cafe-3537801_960_720.jpg',
			about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			location: '7M52379F+6Q',
			cuisine: 'Italian'
		}
	});

	const r2 = await prisma.restaurants.create({
		data: {
			name: 'Restaurant bar',
			image: 'https://cdn.pixabay.com/photo/2016/11/18/14/05/brick-wall-1834784__340.jpg',
			about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			location: '7M522725+HJ',
			cuisine: 'Mexican'
		}
	});

	await prisma.dishes.create({
		data: {
			name: 'Dish foo',
			image: 'https://cdn.pixabay.com/photo/2017/10/15/11/41/sushi-2853382__340.jpg',
			allergens: 'gluten,nuts',
			price: 5,
			restaurantId: r1.id
		}
	});

	await prisma.dishes.create({
		data: {
			name: 'Dish bar',
			image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/abstract-1238247__340.jpg',
			allergens: '',
			price: 10,
			restaurantId: r2.id
		}
	});
}

populateMockData();
