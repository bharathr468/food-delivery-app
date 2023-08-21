import { ILoc } from '@classes/Order';

export default function calculateDistance(location1: ILoc, location2: ILoc) {
	const { lat: lat1, lon: lon1 } = location1;
	const { lat: lat2, lon: lon2 } = location2;

	const RADIUS = 6371; // Radius of the earth in km
	const latDiff = deg2rad(lat2 - lat1);
	const LonDiff = deg2rad(lon2 - lon1);
	const a =
		Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(LonDiff / 2) * Math.sin(LonDiff / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return RADIUS * c;
}

const deg2rad = (deg: number) => {
	return deg * (Math.PI / 180);
};
