import { NextPage } from 'next';
import { CartItem } from '@pages/cart';
import usePersistentState from '@hooks/usePersistentState';
import fetcher from '@utils/fetcher';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import useLocation from '@hooks/useLocation';
import { ILoc } from '@classes/Order';
import getUsername from '@utils/username';

const Checkout: NextPage = () => {
	const [data, _] = usePersistentState<CartItem[]>({ key: 'cart', initialData: [] });
	const router = useRouter();
	const { location } = useLocation();

	return (
		<div>
			<div className='flex flex-col space-y-4 items-center'>
				<span className='font-extrabold text-4xl text-primary'>Checkout</span>
			</div>
			<div className='flex flex-col items-center'>
				<div className='mt-8 flex flex-col justify-items-center'>
					{data && data.length ? (
						data.map((d) => (
							<div key={d.id}>
								{d.name} x <span className='text-primary'>{d.quantity}</span>
							</div>
						))
					) : data ? (
						<span className='font-2xl text-primary font-bold'>No items found</span>
					) : (
						<span className='font-2xl text-primary font-bold'>Loading...</span>
					)}
				</div>
				<span className='text-lg'>
					Total amount:{' '}
					<span className='text-primary'>{data?.map((d) => d.price * d.quantity)?.reduce((a, b) => a + b, 0)}</span>
				</span>
				<button
					onClick={async () => {
						const username = getUsername();
						if (!username) return router.push('/login');

						if (!(await confirmOrder(data ?? [], location!))) return;
						setTimeout(() => router.push('/orders'), 500);
					}}
					className='p-2 px-4 m-2 font-bold bg-dualtone hover:bg-dualtone/70 text-primary rounded-md'
				>
					Confirm order
				</button>
			</div>
		</div>
	);
};

export default Checkout;

const confirmOrder = async (items: CartItem[], location: ILoc) => {
	const order = await fetcher('/api/orders', { method: 'POST', body: JSON.stringify({ items, location }) });
	if (!order?.id) return;

	toast.success(`Order confirmed! [ID = ${order.id}]`);
	return order.id;
};
