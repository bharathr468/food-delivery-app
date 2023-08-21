import Logo from '@components/Logo';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Spin as Hamburger } from 'hamburger-react';
import getUsername from '@utils/username';

const links = [
	{ title: 'Home', href: '/' },
	{ title: 'Explore', href: '/explore' },
	{ title: 'Cart', href: '/cart' },
	{ title: 'Orders', href: '/orders' }
];

export default function Nav() {
	const [open, setOpen] = useState(false);
	const [loggedInAs, setLoggedInAs] = useState<null | string>(null);

	useEffect(() => {
		const username = getUsername();

		if (username) setLoggedInAs(username);
	}, []);

	return (
		<nav className='sticky top-0 z-50 before:border-b-2 before:-z-1 before:content-[""] before:absolute before:w-full before:h-full before:backdrop-blur-lg before:backdrop-brightness-25 before:bg-black/75 before:border-black'>
			<div className='relative text-white min-h-[96px] flex items-center justify-between px-4 p-2 mx-auto max-w-7xl sm:px-6 lg:px-8'>
				<div className='flex ml-2 items-center flex-1'>
					<Link href='/' className='flex items-center justify-center hover:text-primary'>
						<Logo size={48} />
						<span className='ml-4 font-bold text-lg'>FDA</span>
					</Link>
					<div className='hidden ml-10 space-x-8 md:block'>
						{links.map((item) => (
							<Link key={item.href} href={item.href} className='text-lg font-medium hover:text-primary'>
								{item.title}
							</Link>
						))}
					</div>
				</div>
				<div className='hidden mr-2 md:flex items-center justify-end md:justify-center'>
					{loggedInAs ? (
						<Link
							href='/profile'
							className='font-bold text-lg px-4 p-2 m-2 bg-dualtone hover:bg-dualtone/70 text-primary rounded-full'
						>{`Welcome, ${loggedInAs}!`}</Link>
					) : (
						['Login', 'Sign Up'].map((name) => {
							const href = name.toLowerCase().replaceAll(' ', '');
							return (
								<Link
									key={href}
									href={`/${href}`}
									className='font-bold text-lg px-4 p-2 m-2 bg-dualtone hover:bg-dualtone/70 text-primary rounded-md'
								>
									{name}
								</Link>
							);
						})
					)}
				</div>
				<div className='mr-2 md:hidden'>
					<button
						onClick={() => setOpen((o) => !o)}
						type='button'
						className='inline-flex items-center justify-center bg-dualtone hover:bg-dualtone/70 text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary'
					>
						<span className='sr-only'>Open main menu</span>
						<Hamburger rounded toggled={open} size={24} />
					</button>
				</div>
			</div>
			<div
				className={`md:hidden relative border-y-2 border-black backdrop-blur-lg backdrop-brightness-25 bg-black/60 ease-out duration-300 ${
					open ? 'translate-y-0' : 'h-0 -translate-y-[500px]'
				}`}
			>
				<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
					{links.map((item) => (
						<Link
							onClick={() => setOpen(false)}
							key={item.href}
							href={item.href}
							className='block px-3 py-2 text-base font-medium hover:text-primary rounded-md'
						>
							{item.title}
						</Link>
					))}
				</div>
				<div className='px-5 py-4 space-y-4'>
					{loggedInAs ? (
						<Link
							href='/profile'
							className='block w-full px-5 py-3 text-base font-bold text-center bg-dualtone hover:bg-dualtone/70 text-primary border border-transparent rounded-full shadow'
						>{`Logged in as ${loggedInAs}`}</Link>
					) : (
						['Login', 'Sign Up'].map((name) => {
							const href = name.toLowerCase().replaceAll(' ', '');
							return (
								<Link
									onClick={() => setOpen(false)}
									key={href}
									href={`/${href}`}
									className='block w-full px-5 py-3 text-base font-bold text-center bg-dualtone hover:bg-dualtone/70 text-primary border border-transparent rounded-md shadow'
								>
									{name}
								</Link>
							);
						})
					)}
				</div>
			</div>
		</nav>
	);
}
