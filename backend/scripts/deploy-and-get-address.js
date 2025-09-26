const Web3 = require('web3');

async function getDeploymentInfo() {
    try {
        // Connect to Ganache
        const web3 = new Web3('http://localhost:7545');
        
        // Get the first account (admin account)
        const accounts = await web3.eth.getAccounts();
        const adminAccount = accounts[0];
        
        console.log('=== GANACHE ACCOUNT INFO ===');
        console.log('Admin Account Address:', adminAccount);
        console.log('Admin Private Key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d');
        console.log('');
        
        // Try to find deployed contract
        console.log('=== LOOKING FOR DEPLOYED CONTRACT ===');
        console.log('Please run: npx truffle migrate --network development');
        console.log('Then copy the contract address from the deployment output.');
        console.log('');
        
        // Check if contract is deployed
        const contractAddress = process.env.CONTRACT_ADDRESS;
        if (contractAddress) {
            console.log('=== CONTRACT INFO ===');
            console.log('Contract Address from .env:', contractAddress);
            
            // Try to call a method to verify contract is deployed
            try {
                const CONTRACT_ABI = [
                    {
                        "inputs": [],
                        "name": "getTotalCertificates",
                        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                        "stateMutability": "view",
                        "type": "function"
                    }
                ];
                
                const contract = new web3.eth.Contract(CONTRACT_ABI, contractAddress);
                const totalCerts = await contract.methods.getTotalCertificates().call();
                console.log('Contract is deployed and accessible!');
                console.log('Total certificates on chain:', totalCerts);
            } catch (err) {
                console.log('Contract not found at address:', contractAddress);
                console.log('Please check your CONTRACT_ADDRESS in .env file');
            }
        } else {
            console.log('No CONTRACT_ADDRESS found in .env file');
        }
        
        console.log('');
        console.log('=== YOUR .env FILE SHOULD CONTAIN ===');
        console.log('GANACHE_URL=http://localhost:7545');
        console.log('CONTRACT_ADDRESS=0x[YourDeployedContractAddress]');
        console.log('ADMIN_PRIVATE_KEY=0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d');
        console.log('MONGODB_URI=mongodb://localhost:27017/docuVeri');
        console.log('PORT=5000');
        console.log('HASH_ALGO=sha256');
        
    } catch (error) {
        console.error('Error:', error.message);
        console.log('Make sure Ganache is running on http://localhost:7545');
    }
}

getDeploymentInfo();
