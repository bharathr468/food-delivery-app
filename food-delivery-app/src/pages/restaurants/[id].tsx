import { RestaurantItem, DishItem } from '@api/search';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Card from '@components/Card';
import { CartItem } from '@pages/cart';
import { useRouter } from 'next/router';
import fetcher from '@utils/fetcher';
import usePersistentState from '@hooks/usePersistentState';
import Link from 'next/link';
import calculateDistance from '@utils/calculateDistance';
import useLocation from '@hooks/useLocation';
import OpenLocationCode from '@utils/plusCodes';

export type Restaurant = Omit<RestaurantItem, 'type'> & {
	menu: Omit<DishItem, 'type'>[];
};

const Restaurant: NextPage = () => {
	const [data, setData] = useState<Restaurant | null>(null);
	const [cart, setCart] = usePersistentState<CartItem[]>({ key: 'cart', initialData: [] });
	const router = useRouter();
	const { location } = useLocation();

	useEffect(() => {
		const id = router.query.id;
		if (!id) return;

		fetcher(`/api/restaurants/${id}`).then((data) => {
			const restaurantLocation = OpenLocationCode.decode(data.location);
			const dist = calculateDistance(
				{ lat: location?.lat ?? 0, lon: location?.lon ?? 0 },
				{ lat: restaurantLocation.latitudeCenter, lon: restaurantLocation.longitudeCenter }
			);

			setData({
				...data,
				distance: parseFloat(dist.toFixed(2))
			});

			const dish = window?.location?.search?.match(/\?dish\=(\d+)/)?.[1];
			if (!dish) return;

			const card = document.getElementById(`dish-${dish}`);
			if (!card) return;

			card.scrollIntoView({ behavior: 'smooth' });
			setTimeout(() => card.classList.add('!border-primary'), 300);
			setTimeout(() => card.classList.remove('!border-primary'), 6_000);
		});
	}, [router.query.dishId, router.query.id, location?.lat, location?.lon]);

	return (
		<>
			{data && cart && (
				<div className='flex flex-col'>
					<div className='relative mb-8 min-w-full max-w-full min-h-[40vh] max-h-[40vh]'>
						<Image
							fill
							src={data.image}
							alt={data.name}
							className='object-cover shadow rounded-lg border-4 border-primary'
						/>
					</div>
					<h1 className='text-primary font-bold text-4xl'>{data.name}</h1>
					<span className='font-medium text-md'>
						Cuisine: <span className='text-primary'>{data.cuisine}</span>
					</span>
					<span className='font-medium text-md'>
						Location:{' '}
						<Link href={`https://plus.codes/${data.location}`} target='_about' className='text-primary hover:underline'>
							{data.location}
						</Link>{' '}
						<span className='font-light'>({data.distance} km away from you)</span>
					</span>
					<p className='text-lg font-medium'>{data.about}</p>
					<span className='my-6 text-center text-3xl font-bold text-primary'>Menu</span>
					<div className='mb-4 grid justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
						{data.menu.map((d) => (
							<RestaurantMenuCard
								key={d.id}
								id={d.id}
								restaurantId={d.restaurantId}
								name={d.name}
								image={d.image}
								allergens={d.allergens}
								price={d.price}
								cart={cart}
								setData={setCart}
							/>
						))}
					</div>
				</div>
			)}
		</>
	);
};

export default Restaurant;

type RestaurantMenuCardProps = Restaurant['menu'][0] & {
	cart: CartItem[];
	href?: string;
	setData: (val: CartItem[] | ((prevState: CartItem[]) => CartItem[])) => void;
};

const RestaurantMenuCard = (props: RestaurantMenuCardProps) => {
	return (
		<div id={`dish-${props.id}`} className='inline-block max-w-fit relative rounded-md border-2 border-transparent'>
			<Card
				disableHoverEffects
				href={props.href}
				title={props.name}
				image={props.image}
				subText={`Price: ${props.price}`}
				text={`Allergens: ${props.allergens.length ? props.allergens.join(', ') : 'None'}`}
			/>
			<div className='absolute bottom-4 right-4 space-x-4'>
				{props.cart.some((i) => i.id === props.id) ? (
					<>
						{['+', '-'].map((c) => {
							return (
								<button
									key={c}
									onClick={() => {
										props.setData((items) => {
											const item = items!.find((i) => i.id === props.id)!;

											if (c === '+') item.quantity++;
											else item.quantity--;

											return [...items!.filter((i) => i.quantity > 0)];
										});
									}}
									className='bg-dualtone hover:bg-dualtone/70 text-primary rounded-full p-2 w-12 h-12 font-black text-xl'
								>
									{c}
								</button>
							);
						})}
						<span>{props.cart.find((i) => i.id === props.id)?.quantity ?? 0}</span>
					</>
				) : (
					<button
						onClick={() => {
							props.setData((items) => {
								return [...items!, { ...props, quantity: 1 }];
							});
						}}
						className='bg-dualtone hover:bg-dualtone/70 text-primary rounded-md p-2 px-4 font-bold text-xl'
					>
						Add
					</button>
				)}
			</div>
		</div>
	);
};
