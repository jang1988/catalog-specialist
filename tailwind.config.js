/** @type {import('tailwindcss').Config} */
export default {
	content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			colors: {
				primary: '#030014',
				secondary: '#151312',
				greener: '#138352',
				bluer: '#4d6bfe',
				light: {
					100: '#D6C6FF',
					200: '#A8B5DB',
					300: '#9CA4AB',
				},
				dark: {
					100: '#221f3d',
					200: '#0f0d23',
				},
				accent: '#AB8DFF',
			},
		},
	},
	plugins: [],
};
