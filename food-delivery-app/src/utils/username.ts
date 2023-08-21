export default function getUsername() {
	const cookies = document.cookie.split(';').map((c) => c.trim());
	const username = cookies.find((cookie) => cookie.startsWith('username='))?.split('=')?.[1];

	return username;
}
