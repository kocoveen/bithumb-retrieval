import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');
import crypto from 'crypto';

export async function generateJWT(query, accessKey, secretKey) {
	// Generate access token
	const alg = 'SHA512';
	const hash = crypto.createHash(alg);
	const queryHash = hash.update(query, 'utf-8').digest('hex');
	const payload = {
		access_key: accessKey,
		nonce: crypto.randomUUID(),
		timestamp: Date.now(),
		query_hash: queryHash,
		query_hash_alg: alg
	};
	const jwtToken = jwt.sign(payload, secretKey);

	return jwtToken;
}
