import { encodeJWT, createJWTSignatureMessage, joseAlgorithmHS256 } from '@oslojs/jwt';
import crypto from 'crypto';

/**
 * Generates an access token using Oslo JWT
 * @param {string} query - The query string to hash
 * @param {string} accessKey - The access key
 * @param {string} secretKey - The secret key for signing the JWT
 * @returns {Promise<{jwtToken: string, config: {headers: {Authorization: string}}}>}
 */
export async function generateAccessToken(query, accessKey, secretKey) {
	const alg = 'SHA512';
	const hash = crypto.createHash(alg);
	const queryHash = hash.update(query, 'utf-8').digest('hex');

	// header
	const headerJSON = JSON.stringify({
		alg: joseAlgorithmHS256,
		typ: 'JWT'
	});

	//payload
	const payloadJSON = JSON.stringify({
		access_key: accessKey,
		nonce: crypto.randomUUID(),
		timestamp: Date.now(),
		query_hash: queryHash,
		query_hash_alg: alg
	});

	// Convert secretKey to CryptoKey
	const encoder = new TextEncoder();
	const keyData = encoder.encode(secretKey);
	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		keyData,
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);

	// signature
	const signatureBuffer = await crypto.subtle.sign(
		'HMAC',
		cryptoKey,
		createJWTSignatureMessage(headerJSON, payloadJSON)
	);

	const jwtToken = encodeJWT(headerJSON, payloadJSON, new Uint8Array(signatureBuffer));

	const config = {
		headers: {
			Authorization: `Bearer ${jwtToken}`
		}
	};

	return { jwtToken, config };
}
