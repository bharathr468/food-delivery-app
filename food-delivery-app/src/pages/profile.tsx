import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Profile: NextPage = () => {
	const [loggedInAs, setLoggedInAs] = useState<null | string>(null);
	const router = useRouter();

	useEffect(() => {
		const cookies = document.cookie.split(';').map((c) => c.trim());
		const username = cookies.find((cookie) => cookie.startsWith('username='))?.split('=')?.[1];

		if (username) setLoggedInAs(username);
		else {
			toast.error('You must be logged in to view this page!');
			router.push('/login');
		}
	}, [router]);

	return (
		<div>
			<div className='flex flex-col items-center'>
				<h6 className='mb-6 text-4xl font-bold text-center text-primary md:text-3xl'>Welcome {loggedInAs}!</h6>
				<div className='flex flex-row space-x-4'>
					<Link
						href='/orders'
						className='px-6 py-2 text-md font-bold rounded-md text-slate bg-primary hover:bg-primary/70'
					>
						Track your orders
					</Link>
					<Link
						href='/logout'
						className='px-6 py-2 text-md font-bold rounded-md text-slate bg-primary hover:bg-primary/70'
					>
						Log out
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Profile;
