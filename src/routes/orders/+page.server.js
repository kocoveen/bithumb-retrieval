import { generateJWT } from '$lib/auth.js';
import { createOrderQuery } from '$lib/createQuery.js';
import { API_KEY, SECRET_KEY } from '$env/static/private';

const API_URL = 'https://api.bithumb.com';

/**
 * Fetch data from the given endpoint with specified options.
 * @param {string} endpoint - API endpoint (relative to API_URL).
 * @param {object} options - Fetch options (method, headers, etc.).
 * @returns {Promise<any>} - Parsed JSON response.
 */
async function fetchData(endpoint, options = {}) {
	const response = await fetch(`${API_URL}${endpoint}`, options);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
	}
	return response.json();
}

/**
 * Fetch market data from the API.
 * @returns {Promise<Array>} - List of market codes.
 */
async function fetchMarketCodes() {
	const data = await fetchData('/v1/market/all', {
		method: 'GET',
		headers: { accept: 'application/json' }
	});
	return data;
}

/**
 * Fetch orders for a specific market.
 * @param {string} market - Market code.
 * @returns {Promise<Array>} - List of orders.
 */
async function fetchOrdersForMarket(market) {
	const query = createOrderQuery({
		market,
		limit: 100,
		page: 1,
		order_by: 'desc',
		states: ['wait', 'done', 'cancel']
	});

	const jwtToken = await generateJWT(query, API_KEY, SECRET_KEY);

	const data = await fetchData(`/v1/orders?${query}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${jwtToken}`,
			'Content-Type': 'application/json'
		}
	});
	return data;
}

/**
 * Load all orders across markets.
 * @returns {Promise<object>} - Combined orders data.
 */
export async function load() {
	try {
		const markets = await fetchMarketCodes();

		// Process orders for all markets in parallel
		const allOrders = await Promise.all(
			markets.map((market) => fetchOrdersForMarket(market.market))
		);

		// Flatten and combine all orders
		const combinedOrders = allOrders.flat();

		return { data: combinedOrders };
	} catch (error) {
		console.error('Error loading orders:', error);
		return { data: [], error: error.message };
	}
}
