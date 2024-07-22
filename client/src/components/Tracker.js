import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Tracker.css';

const API_BASE_URL = 'http://52.87.206.86:3001';

const Tracker = () => {
  const [nodeCount, setNodeCount] = useState('Loading...');
  const [pricePerNode, setPricePerNode] = useState('Loading...');
  const [leftAtThisPrice, setLeftAtThisPrice] = useState('Loading...');
  const [isSaleActive, setIsSaleActive] = useState('Loading...');
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState({
    nodePurchaseContract: { address: '', usdt: 'Loading...', matic: 'Loading...' },
    lumiaAddress: { address: '', usdt: 'Loading...', matic: 'Loading...' },
    partnerAddress: { address: '', usdt: 'Loading...', matic: 'Loading...' },
    providerAddress: { address: '', usdt: 'Loading...', matic: 'Loading...' }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const nodeCountResponse = await axios.get(`${API_BASE_URL}/api/nodeCount`);
      setNodeCount(nodeCountResponse.data.nodeCount);

      const pricePerNodeResponse = await axios.get(`${API_BASE_URL}/api/pricePerNode`);
      setPricePerNode(`${pricePerNodeResponse.data.price} USDT`);
      setLeftAtThisPrice(pricePerNodeResponse.data.leftAtThisPrice);

      const isSaleActiveResponse = await axios.get(`${API_BASE_URL}/api/isSaleActive`);
      setIsSaleActive(isSaleActiveResponse.data.isSaleActive ? 'Active' : 'Inactive');

      const nodePurchaseContractBalanceResponse = await axios.get(`${API_BASE_URL}/api/nodePurchaseContractBalance`);
      const lumiaAddressBalanceResponse = await axios.get(`${API_BASE_URL}/api/lumiaAddressBalance`);
      const partnerAddressBalanceResponse = await axios.get(`${API_BASE_URL}/api/partnerAddressBalance`);
      const providerAddressBalanceResponse = await axios.get(`${API_BASE_URL}/api/providerAddressBalance`);

      setBalances({
        nodePurchaseContract: {
          address: nodePurchaseContractBalanceResponse.data.address,
          usdt: formatBalance(nodePurchaseContractBalanceResponse.data.usdtBalance, 'USDT'),
          matic: formatBalance(nodePurchaseContractBalanceResponse.data.maticBalance, 'MATIC')
        },
        lumiaAddress: {
          address: lumiaAddressBalanceResponse.data.address,
          usdt: formatBalance(lumiaAddressBalanceResponse.data.usdtBalance, 'USDT'),
          matic: formatBalance(lumiaAddressBalanceResponse.data.maticBalance, 'MATIC')
        },
        partnerAddress: {
          address: partnerAddressBalanceResponse.data.address,
          usdt: formatBalance(partnerAddressBalanceResponse.data.usdtBalance, 'USDT'),
          matic: formatBalance(partnerAddressBalanceResponse.data.maticBalance, 'MATIC')
        },
        providerAddress: {
          address: providerAddressBalanceResponse.data.address,
          usdt: formatBalance(providerAddressBalanceResponse.data.usdtBalance, 'USDT'),
          matic: formatBalance(providerAddressBalanceResponse.data.maticBalance, 'MATIC')
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setNodeCount('Error fetching data');
      setPricePerNode('Error fetching data');
      setLeftAtThisPrice('Error fetching data');
      setIsSaleActive('Error fetching data');
    }
    setLoading(false);
  };

  const formatBalance = (balance, unit) => {
    return `${parseFloat(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      {loading && <div className="spinner-overlay"><div className="spinner"></div></div>}
      <header>
        <h1>Lumia Node Sales Activity Tracker</h1>
      </header>
      <main>
        <div className="card">
          <h2>Node Count</h2>
          <p>{nodeCount}</p>
        </div>
        <div className="card">
          <h2>Price Per Node</h2>
          <p>{pricePerNode}</p>
        </div>
        <div className="card">
          <h2>Nodes Left at This Price</h2>
          <p>{leftAtThisPrice}</p>
        </div>
        <div className="card">
          <h2>Sale Status</h2>
          <p>{isSaleActive}</p>
        </div>
      </main>
      <div className="table-container">
        <h2>Contract Balances</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>USDT Balance</th>
              <th>MATIC Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Node Purchase Contract</td>
              <td>{balances.nodePurchaseContract.address}</td>
              <td>{balances.nodePurchaseContract.usdt}</td>
              <td>{balances.nodePurchaseContract.matic}</td>
            </tr>
            <tr>
              <td>Lumia Address</td>
              <td>{balances.lumiaAddress.address}</td>
              <td>{balances.lumiaAddress.usdt}</td>
              <td>{balances.lumiaAddress.matic}</td>
            </tr>
            <tr>
              <td>Partner Address</td>
              <td>{balances.partnerAddress.address}</td>
              <td>{balances.partnerAddress.usdt}</td>
              <td>{balances.partnerAddress.matic}</td>
            </tr>
            <tr>
              <td>Provider Address</td>
              <td>{balances.providerAddress.address}</td>
              <td>{balances.providerAddress.usdt}</td>
              <td>{balances.providerAddress.matic}</td>
            </tr>
            <tr>
              <td>Random Address(Different in every transaction)</td>
              <td>NA</td>
              <td>NA</td>
              <td>NA</td>
            </tr>
          </tbody>
        </table>
      </div>
      <footer>
        <button onClick={fetchData} disabled={loading}>
          Refresh
        </button>
      </footer>
    </div>
  );
};

export default Tracker;
