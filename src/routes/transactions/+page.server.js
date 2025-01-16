import { generateJWT } from '$lib/auth.js';
import { createTransactionsQuery } from '$lib/createQuery.js';
import { API_KEY, SECRET_KEY } from '$env/static/private';

const API_URL = 'https://api.bithumb.com';

async function fetchData(endpoint, options = {}) {
	const response = await fetch(`${API_URL}${endpoint}`, options);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
	}
	return response.json();
}

async function fetchTransactions() {
	const withdrawsQuery = createTransactionsQuery({
		limit: 100,
		page: 1,
		order_by: 'desc',
		state: 'DONE'
	});

	const jwt1 = await generateJWT(withdrawsQuery, API_KEY, SECRET_KEY);
	const withdrawsData = await fetchData(`/v1/withdraws/krw?${withdrawsQuery}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${jwt1}`,
			'Content-Type': 'application/json'
		}
	});

	const depositsQuery = createTransactionsQuery({
		limit: 100,
		page: 1,
		order_by: 'desc',
		state: 'ACCEPTED'
	});

	const jwt2 = await generateJWT(depositsQuery, API_KEY, SECRET_KEY);
	const depositsData = await fetchData(`/v1/deposits/krw?${depositsQuery}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${jwt2}`,
			'Content-Type': 'application/json'
		}
	});

	return { depositsData, withdrawsData };
}

/**
 * Load all orders across markets.
 * @returns {Promise<object>} - Combined orders data.
 */
export async function load() {
	try {
		let transactionsPromise = await fetchTransactions();

		return { data: transactionsPromise };
	} catch (error) {
		console.error('Error loading orders:', error);
		return { data: [], error: error.message };
	}
}
