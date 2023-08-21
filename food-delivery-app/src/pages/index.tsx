import type { NextPage } from 'next';
import { cuisines } from '@pages/explore';
import Image from 'next/image';
import Link from 'next/link';

const Home: NextPage = () => {
	return (
		<div className='flex flex-col p-4 justify-center items-center'>
			<span className='font-extrabold p-2 m-2 text-6xl md:text-7xl lg:text-8xl text-transparent bg-clip-text animate-text bg-gradient-to-l from-[#f9bc2c] from-0% via-[#FE5001] via-20% to-[#e9295c] to-80%'>
				What food are you craving today?
			</span>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
				{cuisines.map((cuisine) => {
					return (
						<Link
							href={`/explore?cuisine=${cuisine.title.toLowerCase()}`}
							key={cuisine.title.toLowerCase()}
							className='flex flex-row justify-center items-center p-4 m-4 shadow bg-black/70 rounded-md cursor-pointer border-2 border-black hover:border-primary hover:scale-105'
						>
							<Image src={`/icons/${cuisine.icon}.svg`} alt={cuisine.title} width={256} height={256} />
							<div className='flex flex-col justify-between ml-4'>
								<span className='font-bold text-lg text-primary'>{cuisine.title}</span>
								<span className='font-medium text-base'>{cuisine.description}</span>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default Home;
