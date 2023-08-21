import fetcher from '@utils/fetcher';
import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const InvoicePage: NextPage = () => {
	const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (!router.query.id) return;
		fetcher(`/api/invoices/${router.query.id}`).then(setInvoice);
	}, [router.query.id]);

	return (
		<div>
			<div className='flex flex-col items-center'>
				{invoice ? (
					<Invoice props={invoice} />
				) : (
					<span className='font-2xl text-primary font-bold'>Loading Invoice ...</span>
				)}
			</div>
		</div>
	);
};

export default InvoicePage;

interface InvoiceDetails {
	user: {
		name: string;
		email: string;
		address: string;
	};
	invoiceId: number;
	date: string;
	taxRate: number;
	products: {
		quantity: string;
		name: string;
		price: number;
	}[];
}

const Invoice = ({ props: { user, invoiceId, date, taxRate, products } }: { props: InvoiceDetails }) => {
	const subtotal = products.reduce((acc, product) => acc + product.price * parseInt(product.quantity), 0);
	const tax = subtotal * (taxRate / 100);
	const total = subtotal + tax;

	return (
		<div className='max-w-lg mx-auto my-8 bg-white text-black shadow-md rounded-md overflow-hidden'>
			<div className='p-4 border-b'>
				<h2 className='text-xl font-semibold'>{`Invoice #${invoiceId}`}</h2>
				<p>{`Date: ${date}`}</p>
			</div>
			<div className='p-4 border-b'>
				<div className='flex justify-between mb-2'>
					<p className='font-semibold'>{user.name}</p>
					<p>{`Invoice #${invoiceId}`}</p>
				</div>
				<p>{user.email}</p>
				<p>{user.address}</p>
			</div>
			<div className='p-4'>
				<table className='w-full text-left'>
					<thead>
						<tr>
							<th className='py-2'>#</th>
							<th className='py-2'>Product</th>
							<th className='py-2'>Price</th>
							<th className='py-2'>Quantity</th>
							<th className='py-2'>Total</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product, index) => (
							<tr key={index}>
								<td className='py-2'>{index + 1}</td>
								<td className='py-2'>{product.name}</td>
								<td className='py-2'>{`₹${product.price.toFixed(2)}`}</td>
								<td className='py-2'>{product.quantity}</td>
								<td className='py-2'>{`₹${(product.price * parseInt(product.quantity)).toFixed(2)}`}</td>
							</tr>
						))}
					</tbody>
				</table>
				<div className='mt-4'>
					<div className='flex justify-between'>
						<p>Subtotal:</p>
						<p>{`₹${subtotal.toFixed(2)}`}</p>
					</div>
					<div className='flex justify-between'>
						<p>Tax ({taxRate}%):</p>
						<p>{`₹${tax.toFixed(2)}`}</p>
					</div>
					<div className='flex justify-between font-semibold'>
						<p>Total:</p>
						<p>{`₹${total.toFixed(2)}`}</p>
					</div>
				</div>
			</div>
		</div>
	);
};
