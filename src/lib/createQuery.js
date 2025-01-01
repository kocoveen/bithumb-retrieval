// createQuery.js

/**
 * Creates a query string for the Bithumb API
 * @param {Object} params - The parameters for the query
 * @param {string} params.market - The market (e.g., 'KRW-XRP')
 * @param {number} params.limit - The limit of results
 * @param {number} params.page - The page number
 * @param {string} params.order_by - The order of results ('asc' or 'desc')
 * @param {string[]} [params.uuids] - Optional array of UUIDs
 * @param {string[]} [params.states] - Optional array of states
 * @returns {string} The formatted query string
 */
export function createQuery(params) {
	const { market, limit, page, order_by, uuids, states } = params;

	let query = `market=${market}&limit=${limit}&page=${page}&order_by=${order_by}`;

	if (uuids && uuids.length > 0) {
		const uuid_query = uuids.map((uuid) => `uuids[]=${encodeURIComponent(uuid)}`).join('&');
		query += '&' + uuid_query;
	}

	if (states && states.length > 0) {
		const state_query = states.map((state) => `states[]=${encodeURIComponent(state)}`).join('&');
		query += '&' + state_query;
	}

	return query;
}

// Example usage
const apiUrl = 'https://api.bithumb.com';
const params = {
	market: 'KRW-XRP',
	limit: 100,
	page: 1,
	order_by: 'desc',
	uuids: [],
	states: ['wait', 'done', 'cancel']
};

const query = createQuery(params);
console.log(`${apiUrl}?${query}`);

// Export the function for use in other files
module.exports = createQuery;
