import { useEffect, useState } from 'react';

interface Props<T> {
	key: string;
	initialData: T;
}

export default function usePersistentState<T>(props: Props<T>) {
	const [state, set] = useState<T>(props.initialData);

	useEffect(() => {
		const saved = localStorage.getItem(props.key);
		if (saved) set(JSON.parse(saved));
	}, [props.key]);

	const setState = (mutate: ((data: T) => T) | T) => {
		if (typeof mutate === 'function') {
			const evaluated = (mutate as Function)(state);
			set(evaluated);
			localStorage.setItem(props.key, JSON.stringify(evaluated));
		} else {
			set(mutate);
			localStorage.setItem(props.key, JSON.stringify(mutate));
		}
	};

	return [state, setState] as const;
}
