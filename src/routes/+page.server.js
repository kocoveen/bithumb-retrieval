import { generateAccessToken } from '$lib/auth.js';
import { createQuery } from '$lib/createQuery.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const query = createQuery();
	const accessKey = 'your_access_key';
	const secretKey = 'your_secret_key';

	const { jwtToken, config } = await generateAccessToken(query, accessKey, secretKey);

	return {
		jwtToken,
		config
	};
}
