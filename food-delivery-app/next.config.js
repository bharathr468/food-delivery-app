/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['cdn.pixabay.com', 'images.unsplash.com']
	}
};

const staticDeployment = {
	output: 'export',
	distDir: 'out',
	images: {
		unoptimized: true
	}
};

module.exports = process.env.STATIC_DEPLOY ? { ...staticDeployment, ...nextConfig } : nextConfig;
