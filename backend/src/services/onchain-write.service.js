const Web3 = require('web3');

function ensure0xHex32(hex) {
    let h = hex.toLowerCase();
    if (h.startsWith('0x')) h = h.slice(2);
    if (h.length !== 64) throw new Error('Hash must be 32 bytes (64 hex chars)');
    return '0x' + h;
}

function getWeb3WithSigner() {
    const providerUrl = process.env.WEB3_PROVIDER_URL;
    const privateKey = process.env.ADMIN_PRIVATE_KEY; // 0x-prefixed
    if (!providerUrl || !privateKey) {
        throw new Error('WEB3_PROVIDER_URL and ADMIN_PRIVATE_KEY are required');
    }
    const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    return { web3, account };
}

async function storeHashOnChain(hashHex) {
    const { web3, account } = getWeb3WithSigner();
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const abiStr = process.env.CONTRACT_ABI;
    const storeMethod = process.env.STORE_METHOD || 'storeHash'; // function(bytes32)
    if (!contractAddress || !abiStr) throw new Error('CONTRACT_ADDRESS and CONTRACT_ABI are required');
    const abi = JSON.parse(abiStr);
    const contract = new web3.eth.Contract(abi, contractAddress);

    const bytes32Hash = ensure0xHex32(hashHex);

    const gas = await contract.methods[storeMethod](bytes32Hash).estimateGas({ from: account.address });
    const tx = await contract.methods[storeMethod](bytes32Hash).send({ from: account.address, gas });
    return tx; // receipt
}

module.exports = { storeHashOnChain };



