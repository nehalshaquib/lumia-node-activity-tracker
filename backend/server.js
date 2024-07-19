// backend/server.js

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

const web3 = new Web3(new Web3.providers.HttpProvider(`https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`));

// Load contract ABI from JSON file
const contractAbiPath = path.resolve(__dirname, 'abi/contractAbi.json');
const contractAbi = JSON.parse(fs.readFileSync(contractAbiPath, 'utf8'));

const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

// Enable CORS for all routes
app.use(cors());

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
