import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
	title: string;
	image: string;
	subText: string;
	text: string;
	href?: string;
	disableHoverEffects?: boolean;
}

const Card = (props: CardProps) => {
	const card = (
		<div
			className={`inline-flex flex-row items-center p-2 m-2 min-w-[20rem] max-w-[20rem] shadow border-2 border-black rounded-lg bg-black/70 ${
				!props.disableHoverEffects && 'hover:border-primary hover:scale-105'
			}`}
		>
			<div className='relative min-h-[12rem] min-w-[6rem]'>
				<Image fill src={props.image} alt={'Image of restaurant/dish'} className='object-cover rounded-lg' />
			</div>
			<div className='flex flex-col min-h-[12rem] w-full justify-start p-4 leading-normal'>
				<div className='flex flex-row mb-2 justify-between items-center'>
					<h5 className='text-2xl text-left font-bold tracking-tight text-primary'>{props.title}</h5>
					<span className='text-sm text-right text-white/90'>{props.subText}</span>
				</div>
				<p className='mb-3 font-normal text-white/90'>{props.text}</p>
			</div>
		</div>
	);

	if (props.href) return <Link href={props.href}>{card}</Link>;
	else return card;
};

export default Card;

export const LoadingCard = () => {
	return (
		<div className='flex flex-row p-2 m-2 min-w-[20rem] max-w-[20rem] items-center border-2 border-black rounded-lg shadow bg-black/20'>
			<div className='relative h-48 w-24 bg-zinc-400 animate-pulse rounded-lg' />
			<div className='flex flex-col justify-around p-4 w-full h-full'>
				<div className='flex flex-row mb-2 justify-around items-center'>
					<span className='h-6 w-24 rounded-lg bg-zinc-500 animate-pulse' />
					<span className='h-6 w-12 rounded-lg bg-zinc-600 animate-pulse' />
				</div>
				<span className='mb-3 font-normal bg-zinc-500 animate-pulse rounded-lg w-full h-12' />
			</div>
		</div>
	);
};
