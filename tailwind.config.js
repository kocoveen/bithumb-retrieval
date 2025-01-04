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

	plugins: [typography, forms, containerQueries, require('flyonui'), require('flyonui/plugin')]
};
