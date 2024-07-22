const express = require('express');
const { Web3 } = require('web3');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const USDT_TOKEN_ADDRESS = process.env.USDT_TOKEN_ADDRESS;
const LUMIA_ADDRESS = process.env.LUMIA_ADDRESS;
const PARTNER_ADDRESS = process.env.PARTNER_ADDRESS;
const PROVIDER_ADDRESS = process.env.PROVIDER_ADDRESS;

const web3 = new Web3(new Web3.providers.HttpProvider(`https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`));

// Load contract ABI from JSON file
const contractAbiPath = path.resolve(__dirname, 'abi/contractAbi.json');
const contractAbi = JSON.parse(fs.readFileSync(contractAbiPath, 'utf8'));

const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

// Load USDT token ABI
const usdtAbiPath = path.resolve(__dirname, 'abi/usdtAbi.json'); // Assuming you have the USDT ABI file
const usdtAbi = JSON.parse(fs.readFileSync(usdtAbiPath, 'utf8'));

const usdtContract = new web3.eth.Contract(usdtAbi, USDT_TOKEN_ADDRESS);

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins (You can specify your frontend URL here for better security)
  methods: ['GET', 'POST'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
}));

app.get('/api/nodeCount', async (req, res) => {
  try {
    const nodeCount = await contract.methods.nodeCount().call();
    res.json({ nodeCount: nodeCount.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch node count' });
  }
});

app.get('/api/pricePerNode', async (req, res) => {
  try {
    const priceData = await contract.methods.pricePerNode().call();
    const priceInUSDT = (BigInt(priceData.price) / 1_000_000n).toString();  // Convert to USDT
    res.json({ price: priceInUSDT, leftAtThisPrice: priceData.leftAtThisPrice.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price per node' });
  }
});

app.get('/api/isSaleActive', async (req, res) => {
  try {
    const isSaleActive = await contract.methods.isSaleActive().call();
    res.json({ isSaleActive });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sale status' });
  }
});

// Fetch USDT balance for a given address
async function getUSDTBalance(address) {
  const balance = await usdtContract.methods.balanceOf(address).call();
  return (BigInt(balance) / 1_000_000n).toString();  // Convert to USDT
}

// Fetch MATIC balance for a given address
async function getMATICBalance(address) {
  const balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance, 'ether');  // Convert to MATIC
}

app.get('/api/nodePurchaseContractBalance', async (req, res) => {
  try {
    const usdtBalance = await getUSDTBalance(CONTRACT_ADDRESS);
    const maticBalance = await getMATICBalance(CONTRACT_ADDRESS);
    res.json({ address: CONTRACT_ADDRESS, usdtBalance, maticBalance });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch balances for address ${CONTRACT_ADDRESS}` });
  }
});

app.get('/api/lumiaAddressBalance', async (req, res) => {
  try {
    const usdtBalance = await getUSDTBalance(LUMIA_ADDRESS);
    const maticBalance = await getMATICBalance(LUMIA_ADDRESS);
    res.json({ address: LUMIA_ADDRESS, usdtBalance, maticBalance });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch balances for address ${LUMIA_ADDRESS}` });
  }
});

app.get('/api/partnerAddressBalance', async (req, res) => {
  try {
    const usdtBalance = await getUSDTBalance(PARTNER_ADDRESS);
    const maticBalance = await getMATICBalance(PARTNER_ADDRESS);
    res.json({ address: PARTNER_ADDRESS, usdtBalance, maticBalance });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch balances for address ${PARTNER_ADDRESS}` });
  }
});

app.get('/api/providerAddressBalance', async (req, res) => {
  try {
    const usdtBalance = await getUSDTBalance(PROVIDER_ADDRESS);
    const maticBalance = await getMATICBalance(PROVIDER_ADDRESS);
    res.json({ address: PROVIDER_ADDRESS, usdtBalance, maticBalance });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch balances for address ${PROVIDER_ADDRESS}` });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
