export const accurateDiff = (due: number, isPast = false) => {
	const diff = isPast ? Date.now() - due * 1000 : due * 1000 - Date.now();
	const days = Math.floor(diff / 1000 / 60 / 60 / 24);
	const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
	const minutes = Math.floor(diff / 1000 / 60) % 60;

	let res = '';

	if (minutes > 0) res = `${minutes}m ${res}`;
	if (hours > 0) res = `${hours}h ${res}`;
	if (days > 0) res = `${days}d ${res}`;

	return res.trim();
};
