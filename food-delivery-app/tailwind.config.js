module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/utils/**/*.{js,ts,jsx,tsx}'
	],
	blocklist: ['shadow'],
	theme: {
		extend: {
			colors: {
				slate: '#121212',
				primary: '#FE5001',
				dualtone: '#5B1D00'
			},
			animation: {
				text: 'text 3s ease infinite'
			},
			keyframes: {
				text: {
					'0%, 100%': {
						'background-size': '200% 200%',
						'background-position': 'left center'
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'right center'
					}
				}
			}
		}
	}
};
