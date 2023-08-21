import { toast } from 'react-hot-toast';

export default async function fetcher(url: string, options: RequestInit = {}): Promise<any> {
	const isJson = (options.body as string)?.startsWith('{') && (options.body as string)?.endsWith('}');

	const fetchOptions = {
		...options
	};

	if (isJson) fetchOptions.headers = { ...options.headers, 'Content-Type': 'application/json' };

	const res = await global.fetch(url, fetchOptions);
	if (res.ok) {
		try {
			return { ...(await res.json()), ok: true };
		} catch {
			return { ok: true };
		}
	}

	const content = await res.text();

	if (content.length >= 5 && content.length <= 50) toast.error(content);
	else toast.error(`An error occurred, status code: ${res.status}`);
	return { ok: false };
}
