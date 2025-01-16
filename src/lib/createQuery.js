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
export function createOrderQuery(params) {
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

export function createTransactionsQuery(params) {
	const { limit, page, order_by, state } = params;

	let query = `limit=${limit}&page=${page}&order_by=${order_by}&state=${state}`;

	// if (uuids && uuids.length > 0) {
	// 	const uuid_query = uuids.map((uuid) => `uuids[]=${encodeURIComponent(uuid)}`).join('&');
	// 	query += '&' + uuid_query;
	// }

	return query;
}
