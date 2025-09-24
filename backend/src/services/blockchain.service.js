const crypto = require('crypto');

// Mock Ethereum-like registry. In a real system this would be on-chain.
// Map of certificateHash -> on-chain metadata
const MOCK_REGISTRY = new Map([
	[
		// Example pre-registered certificate hash (replace with your demo hash if needed)
		'9d5e3ecdeb2c9e6e3b3b2b5c0a0a9c5b7e2c1a9d0f8a7b6c5d4e3f2a1b0c9d8e',
		{
			certificateId: 'JH-UNI-2021-0001',
			issuer: 'Jharkhand State University',
			issuedAt: 1622505600,
			blockNumber: 1234567,
			txHash: '0xmocktxhash00000000000000000000000000000000000000000000000000000001',
			studentName: 'Asha Kumari',
			rollNumber: 'JH2021CS001',
			course: 'B.Tech Computer Science',
			institution: 'Jharkhand State University'
		}
	],
	[
		'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		{
			certificateId: 'JH-UNI-2020-0042',
			issuer: 'Ranchi Institute of Technology',
			issuedAt: 1590969600,
			blockNumber: 987654,
			txHash: '0xmocktxhash00000000000000000000000000000000000000000000000000000042',
			studentName: 'Rahul Verma',
			rollNumber: 'RIT2020EE042',
			course: 'B.E. Electrical Engineering',
			institution: 'Ranchi Institute of Technology'
		}
	]
]);

function sha256Hex(buffer) {
	return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function verifyCertificateHash(certificateBuffer) {
	const hash = sha256Hex(certificateBuffer);
	const chainRecord = MOCK_REGISTRY.get(hash);

	if (!chainRecord) {
		return {
			isAuthentic: false,
			confidence: 0.75,
			details: 'Hash not found on registry. Possible forgery or unregistered legacy document.',
			certificateHash: hash,
			chainRecord: null
		};
	}

	return {
		isAuthentic: true,
		confidence: 0.98,
		details: 'Certificate hash found on registry and metadata matches expected format.',
		certificateHash: hash,
		chainRecord
	};
}

module.exports = {
	verifyCertificateHash
};



