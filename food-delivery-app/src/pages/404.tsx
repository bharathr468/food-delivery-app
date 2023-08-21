import { NextPage } from 'next';
import Link from 'next/link';

const NotFound: NextPage = () => {
	return (
		<div>
			<div className='flex flex-col items-center'>
				<h1 className='font-bold text-primary text-9xl'>404</h1>
				<h6 className='mb-2 text-2xl font-bold text-center text-white md:text-3xl'>Oops! Page not found</h6>
				<p className='mb-8 text-center text-white/75 md:text-lg'>The page you’re looking for doesn’t exist.</p>
				<Link href='/' className='px-6 py-2 text-md font-bold rounded-md text-slate bg-primary hover:bg-primary/70'>
					Go home
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
