import fetcher from '@utils/fetcher';
import { NextPage } from 'next';
import router from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const Logout: NextPage = () => {
	useEffect(() => {
		fetcher('/api/auth/logout').then(() => {
			toast.success('Successfully logged out!');
			router.push('/').then(() => router.reload());
		});
	}, []);

	return <div className='mx-auto my-auto'>Logging out ...</div>;
};

export default Logout;
