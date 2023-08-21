import { NextPage } from 'next';
import Card from '@components/Card';
import { DishItem } from '@api/search';
import Link from 'next/link';
import usePersistentState from '@hooks/usePersistentState';

export type CartItem = Omit<DishItem, 'type'> & {
	quantity: number;
};

const Cart: NextPage = () => {
	const [data, setData] = usePersistentState<CartItem[]>({ key: 'cart', initialData: [] });

	return (
		<div className='flex flex-col items-center justify-center m-4'>
			<div className='flex flex-col items-center'>
				<span className='font-extrabold text-4xl text-primary'>My Cart</span>
			</div>
			<div className='mt-8 grid justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
				{data && data.length ? (
					data.map((d) => <CartItemCard key={d.id} setData={setData} {...d} />)
				) : data ? (
					<span className='font-2xl font-bold'>Cart is empty</span>
				) : (
					<></>
				)}
			</div>
			<Link className='mt-4 text-primary font-medium text-xl hover:underline text-center' href='/checkout'>
				Ready to checkout?
			</Link>
		</div>
	);
};

export default Cart;

type CardItemCardProps = CartItem & {
	setData: (val: CartItem[] | ((prevState: CartItem[]) => CartItem[])) => void;
};

const CartItemCard = (props: CardItemCardProps) => {
	return (
		<div className='relative'>
			<Card
				disableHoverEffects
				title={props.name}
				image={props.image}
				subText={`Price: ${props.price * props.quantity}, Qty: ${props.quantity}`}
				text={props.allergens.length ? `Allergens: ${props.allergens}` : 'No allergens'}
			/>
			<div className='absolute bottom-4 right-4 space-x-4'>
				{['+', '-'].map((c) => {
					return (
						<button
							key={c}
							onClick={() => {
								props.setData((items) => {
									const item = items!.find((i) => i.id === props.id)!;

									if (item.quantity === 1 && c === '-') {
										const response = confirm(`Do you want to remove ${item.name} from your cart?`);
										if (!response) return items;
									}

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
			</div>
		</div>
	);
};
