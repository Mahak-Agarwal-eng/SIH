const Web3 = require('web3');

// Ganache configuration
const GANACHE_URL = process.env.GANACHE_URL || 'http://localhost:7545';

// Contract ABI for CertificateRegistry (from Truffle build)
const CONTRACT_ABI = [
    {
        "inputs": [
            {"internalType": "bytes32", "name": "_hash", "type": "bytes32"},
            {"internalType": "string", "name": "_studentName", "type": "string"},
            {"internalType": "string", "name": "_rollNumber", "type": "string"},
            {"internalType": "string", "name": "_course", "type": "string"},
            {"internalType": "string", "name": "_institution", "type": "string"},
            {"internalType": "uint256", "name": "_yearOfPassing", "type": "uint256"}
        ],
        "name": "storeCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "bytes32", "name": "_hash", "type": "bytes32"}],
        "name": "verifyCertificate",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "bytes32", "name": "_hash", "type": "bytes32"}],
        "name": "getCertificate",
        "outputs": [
            {"internalType": "string", "name": "studentName", "type": "string"},
            {"internalType": "string", "name": "rollNumber", "type": "string"},
            {"internalType": "string", "name": "course", "type": "string"},
            {"internalType": "string", "name": "institution", "type": "string"},
            {"internalType": "uint256", "name": "yearOfPassing", "type": "uint256"},
            {"internalType": "bytes32", "name": "documentHash", "type": "bytes32"},
            {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
            {"internalType": "bool", "name": "isActive", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;
let adminAccount;

function initializeWeb3() {
    try {
        web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_URL));
        
        // Get admin account (first account from Ganache)
        const privateKey = process.env.ADMIN_PRIVATE_KEY || '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'; // Default Ganache private key
        adminAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(adminAccount);
        web3.eth.defaultAccount = adminAccount.address;
        
        // Initialize contract
        const contractAddress = process.env.CONTRACT_ADDRESS;
        if (!contractAddress) {
            throw new Error('CONTRACT_ADDRESS environment variable is required');
        }
        
        contract = new web3.eth.Contract(CONTRACT_ABI, contractAddress);
        
        console.log('Connected to Ganache:', GANACHE_URL);
        console.log('Admin account:', adminAccount.address);
        console.log('Contract address:', contractAddress);
        
        return true;
    } catch (error) {
        console.error('Failed to initialize Web3:', error);
        return false;
    }
}

async function storeCertificateOnChain(hashHex, ocrData) {
    try {
        if (!web3 || !contract) {
            if (!initializeWeb3()) {
                throw new Error('Failed to initialize Web3 connection');
            }
        }
        
        // Convert hash to bytes32 (pad with zeros if needed)
        const hashBytes32 = '0x' + hashHex.padStart(64, '0');
        
        // Store certificate data on blockchain
        const tx = await contract.methods.storeCertificate(
            hashBytes32,
            ocrData.studentName,
            ocrData.rollNumber,
            ocrData.course,
            ocrData.institution,
            ocrData.yearOfPassing
        ).send({
            from: adminAccount.address,
            gas: 500000
        });
        
        return {
            success: true,
            txHash: tx.transactionHash,
            blockNumber: tx.blockNumber,
            gasUsed: tx.gasUsed
        };
    } catch (error) {
        console.error('Error storing certificate on blockchain:', error);
        throw error;
    }
}

async function verifyCertificateFromChain(hashHex, uploadedOcrData) {
    try {
        if (!web3 || !contract) {
            if (!initializeWeb3()) {
                throw new Error('Failed to initialize Web3 connection');
            }
        }
        
        const hashBytes32 = '0x' + hashHex.padStart(64, '0');
        
        // Check if certificate exists and is active
        const isVerified = await contract.methods.verifyCertificate(hashBytes32).call();
        
        if (!isVerified) {
            return {
                isAuthentic: false,
                confidence: 0.0,
                details: 'Certificate not found on blockchain',
                forgedFields: [],
                blockchainData: null
            };
        }
        
        // Get certificate data from blockchain
        const blockchainData = await contract.methods.getCertificate(hashBytes32).call();
        
        // Compare OCR data with blockchain data
        const forgedFields = [];
        
        if (blockchainData.studentName !== uploadedOcrData.studentName) {
            forgedFields.push('studentName');
        }
        if (blockchainData.rollNumber !== uploadedOcrData.rollNumber) {
            forgedFields.push('rollNumber');
        }
        if (blockchainData.course !== uploadedOcrData.course) {
            forgedFields.push('course');
        }
        if (blockchainData.institution !== uploadedOcrData.institution) {
            forgedFields.push('institution');
        }
        if (Number(blockchainData.yearOfPassing) !== Number(uploadedOcrData.yearOfPassing)) {
            forgedFields.push('yearOfPassing');
        }
        
        if (forgedFields.length > 0) {
            return {
                isAuthentic: false,
                confidence: 0.3,
                details: `Forgery detected in fields: ${forgedFields.join(', ')}`,
                forgedFields,
                blockchainData: {
                    studentName: blockchainData.studentName,
                    rollNumber: blockchainData.rollNumber,
                    course: blockchainData.course,
                    institution: blockchainData.institution,
                    yearOfPassing: Number(blockchainData.yearOfPassing),
                    timestamp: Number(blockchainData.timestamp)
                }
            };
        }
        
        return {
            isAuthentic: true,
            confidence: 0.98,
            details: 'Certificate verified successfully against blockchain data',
            forgedFields: [],
            blockchainData: {
                studentName: blockchainData.studentName,
                rollNumber: blockchainData.rollNumber,
                course: blockchainData.course,
                institution: blockchainData.institution,
                yearOfPassing: Number(blockchainData.yearOfPassing),
                timestamp: Number(blockchainData.timestamp)
            }
        };
        
    } catch (error) {
        console.error('Error verifying certificate from blockchain:', error);
        return {
            isAuthentic: false,
            confidence: 0.0,
            details: 'Error accessing blockchain',
            forgedFields: [],
            blockchainData: null
        };
    }
}

// Initialize on module load
initializeWeb3();

module.exports = {
    storeCertificateOnChain,
    verifyCertificateFromChain,
    initializeWeb3
};