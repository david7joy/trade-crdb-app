import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Cart from './components/Cart/Cart';
import About from './components/About/About';
import Stockstats from './components/StockStats/Stockstats';
import Stockchart from './components/StockChart/Stockchart';
import Buyprice from './components/StockChart/Buyprice';
import axios from 'axios';
import './App.css';

function App() {

  const [data, setData] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');

  /* Backend connect */
  useEffect(() => {
    axios.get('http://localhost:5000/api/data')
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (selectedStock) {
      const selectedData = data.find(item => item.symbol === selectedStock);
      if (selectedData) {
        setCurrentPrice(selectedData.current_price);
      }
    }
  }, [selectedStock, data]);

  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };

  return (
    <Router>
      <div className="app-container">
        <div className="header">
            <Header />
        </div>
        <div className="chart">
          <Buyprice className="price-box" currentPrice={currentPrice}/>
          <Stockchart />
        </div>
        <div className="app-box cart">
          <Cart 
            data={data} 
            selectedStock={selectedStock} 
            currentPrice={currentPrice} 
            onStockChange={handleStockChange} 
          />
        </div>
        <div className="about">
          <About />
        </div>
        <div className="stats">
          <Stockstats />
        </div>
      </div>
    </Router>
  );
}

export default App;
