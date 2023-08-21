import type { HTMLInputTypeAttribute } from 'react';

interface InputProps {
	value: string;
	setValue: (value: string) => void;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	placeholder?: string;
	type?: HTMLInputTypeAttribute;
	iconBG?: boolean;
	fullyRounded?: boolean;
}

const Input = (props: InputProps) => {
	return (
		<div className='flex flex-row'>
			{props.leftIcon && (
				<div
					className={`flex items-center justify-center w-10 h-10 border-2 border-r-0 border-primary/40 peer-focus:border-primary text-white ${
						props.fullyRounded ? 'rounded-l-full' : 'rounded-l-md'
					} ${props.iconBG ? 'bg-primary' : 'bg-zinc-900'}`}
				>
					{props.leftIcon}
				</div>
			)}
			<input
				value={props.value}
				onChange={(e) => props.setValue(e.target.value)}
				onKeyDown={(e) => {
					let nextInput: HTMLInputElement | null = null;

					if (e.key == 'ArrowUp') {
						e.preventDefault();
						nextInput = getNextInput(e.target as HTMLInputElement, 'up');
					} else if (e.key == 'ArrowDown') {
						e.preventDefault();
						nextInput = getNextInput(e.target as HTMLInputElement, 'down');
					} else if (e.key === 'Enter') {
						e.preventDefault();
						nextInput = getNextInput(e.target as HTMLInputElement, 'down');

						if (!nextInput) {
							document.getElementById('submit')?.click();
						}
					}

					(nextInput as HTMLInputElement)?.focus();
				}}
				placeholder={props.placeholder}
				type={props.type}
				className={`px-4 py-2 h-10 text-white/70 bg-zinc-900 focus:outline-none peer border-2 border-primary/40 focus:border-primary ${
					props.fullyRounded ? 'rounded-full' : 'rounded-md'
				} ${props.leftIcon && '!rounded-l-none border-l-0'} ${props.rightIcon && '!rounded-r-none border-r-0'}`}
			/>
			{props.rightIcon && (
				<div
					className={`flex items-center justify-center w-10 h-10 border-2 border-l-0 border-primary/40 peer-focus:border-primary text-white ${
						props.fullyRounded ? 'rounded-r-full' : 'rounded-r-md'
					} ${props.iconBG ? 'bg-primary' : 'bg-zinc-900'}`}
				>
					{props.rightIcon}
				</div>
			)}
		</div>
	);
};

export default Input;

const getNextInput = (input: HTMLInputElement, dir = 'down'): HTMLInputElement | null => {
	const inputs = Array.from(document.querySelectorAll('input'));
	const index = inputs.indexOf(input);

	return (inputs[index + (dir === 'down' ? 1 : -1)] as HTMLInputElement) ?? null;
};
