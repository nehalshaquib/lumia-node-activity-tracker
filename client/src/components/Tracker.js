import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Tracker.css';

const Tracker = () => {
  const [nodeCount, setNodeCount] = useState('Loading...');
  const [pricePerNode, setPricePerNode] = useState('Loading...');
  const [leftAtThisPrice, setLeftAtThisPrice] = useState('Loading...');
  const [isSaleActive, setIsSaleActive] = useState('Loading...');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const nodeCountResponse = await axios.get('http://localhost:3001/api/nodeCount');
      setNodeCount(nodeCountResponse.data.nodeCount);

      const pricePerNodeResponse = await axios.get('http://localhost:3001/api/pricePerNode');
      setPricePerNode(`${pricePerNodeResponse.data.price} USDT`);
      setLeftAtThisPrice(pricePerNodeResponse.data.leftAtThisPrice);

      const isSaleActiveResponse = await axios.get('http://localhost:3001/api/isSaleActive');
      setIsSaleActive(isSaleActiveResponse.data.isSaleActive ? 'Active' : 'Inactive');
    } catch (error) {
      console.error('Error fetching data:', error);
      setNodeCount('Error fetching data');
      setPricePerNode('Error fetching data');
      setLeftAtThisPrice('Error fetching data');
      setIsSaleActive('Error fetching data');
    }
    setLoading(false);
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
      <footer>
        <button onClick={fetchData} disabled={loading}>
          Refresh
        </button>
      </footer>
    </div>
  );
};

export default Tracker;
