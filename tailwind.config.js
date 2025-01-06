import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** use 'require' in ES6 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flyonui/dist/js/*.js'],

	theme: {
		extend: {}
	},

	// flyonui: {
	// 	themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "soft"]
	// 	darkTheme: 'dark', // name of one of the included themes for dark mode
	// 	base: true, // applies background color and foreground color for root element by default
	// 	styled: true, // include FlyonUI colors and design decisions for all components
	// 	utils: true, // adds responsive and modifier utility classes
	// 	vendors: true, // default is false when true add customize css for apexChart, editor.js, flatpickr, fullcalendar, notyf, raty-js
	// 	themeRoot: ':root' // The element that receives theme color CSS variables
	// },

	plugins: [typography, forms, containerQueries, require('flyonui'), require('flyonui/plugin')]
};
