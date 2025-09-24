const Web3 = require('web3');

// Environment-driven configuration to work with your deployed contract
// Required: WEB3_PROVIDER_URL (e.g., Infura/Alchemy), and either:
// 1) CONTRACT_ADDRESS + CONTRACT_ABI + EXISTS_METHOD  (preferred)
//    - EXISTS_METHOD should be a view/pure function that takes bytes32 hash and returns bool
// OR
// 2) CONTRACT_ADDRESS + (EVENT_SIGNATURE or TOPIC0) + EVENT_INDEXED_ARG_POSITION (1..3) + FROM_BLOCK
//    - EVENT_SIGNATURE example: CertificateStored(bytes32)
//    - TOPIC0 can be precomputed keccak of the signature; if not provided, we compute from signature

function ensure0xHex32(hex) {
	let h = hex.toLowerCase();
	if (h.startsWith('0x')) h = h.slice(2);
	if (h.length !== 64) {
		throw new Error('Hash must be 32 bytes (64 hex chars)');
	}
	return '0x' + h;
}

async function verifyOnChainHash(hashHex) {
	const providerUrl = process.env.WEB3_PROVIDER_URL;
	const contractAddress = process.env.CONTRACT_ADDRESS;
	if (!providerUrl || !contractAddress) {
		throw new Error('WEB3_PROVIDER_URL and CONTRACT_ADDRESS are required for ONCHAIN_MODE');
	}

	const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
	const hashBytes32 = ensure0xHex32(hashHex);

	const abi = safeJsonParse(process.env.CONTRACT_ABI);
	const existsMethod = process.env.EXISTS_METHOD;

	if (abi && existsMethod) {
		const contract = new web3.eth.Contract(abi, contractAddress);
		const exists = await contract.methods[existsMethod](hashBytes32).call();
		return {
			isAuthentic: !!exists,
			confidence: exists ? 0.99 : 0.8,
			details: exists ? 'On-chain record found via view method.' : 'No on-chain record found via view method.',
			chainRecord: exists ? { contractAddress } : null
		};
	}

	// Fallback: scan logs for event with indexed hash
	const eventSignature = process.env.EVENT_SIGNATURE;
	let topic0 = process.env.TOPIC0;
	if (!topic0) {
		if (!eventSignature) throw new Error('Provide EVENT_SIGNATURE or TOPIC0 for log scanning');
		topic0 = web3.utils.sha3(eventSignature);
	}
	const pos = Number(process.env.EVENT_INDEXED_ARG_POSITION || 1); // 1..3
	const fromBlock = process.env.FROM_BLOCK || '0x0';

	const topics = [topic0, null, null, null];
	topics[pos] = hashBytes32;

	const logs = await web3.eth.getPastLogs({
		fromBlock,
		toBlock: 'latest',
		address: contractAddress,
		topics
	});

	if (!logs || logs.length === 0) {
		return {
			isAuthentic: false,
			confidence: 0.8,
			details: 'No on-chain log found for provided hash.',
			chainRecord: null
		};
	}

	const match = logs[0];
	return {
		isAuthentic: true,
		confidence: 0.99,
		details: 'On-chain log found for provided hash.',
		chainRecord: {
			contractAddress,
			blockNumber: match.blockNumber,
			txHash: match.transactionHash,
			logIndex: match.logIndex
		}
	};
}

function safeJsonParse(str) {
	try { return str ? JSON.parse(str) : null; } catch { return null; }
}

module.exports = {
	verifyOnChainHash
};


