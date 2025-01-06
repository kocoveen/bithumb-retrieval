import { generateJWT } from '$lib/auth.js';
import { createOrderQuery } from '$lib/createQuery.js';
import { API_KEY, SECRET_KEY } from '$env/static/private';

/** @type {import('../../../.svelte-kit/types/src/routes').PageServerLoad} */
export async function load() {
	const apiUrl = `https://api.bithumb.com`;

	// 쿼리 만들기 (원하는 param JSON 형태로)
	const query = createOrderQuery({
		// market: 'KRW-XRP',
		limit: 100,
		page: 1,
		order_by: 'desc',
		// uuids: ['C0106000032400700021', 'C0106000043000097801']
		states: ['wait', 'done', 'cancel']
	});

	// 토큰 생성
	const jwtToken = await generateJWT(query, API_KEY, SECRET_KEY);

	// return { jwtToken, apiUrl, query };

	// 응답
	const response = await fetch(`${apiUrl}/v1/orders?${query}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${jwtToken}`,
			'Content-Type': 'application/json'
		}
	});

	const data = await response.json();
	return { data };
}
