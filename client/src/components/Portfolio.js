import React, { useState } from 'react';
import '../styles/Portfolio.css';
import StockChart from './StockChart';

function Portfolio() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);

  const portfolioStocks = [
    { exchange: 'NASDAQ', name: 'Apple Inc', symbol: 'AAPL', shares: 10, price: 150.25, totalValue: 1502.50 },
    { exchange: 'NASDAQ', name: 'Microsoft', symbol: 'MSFT', shares: 5, price: 300.50, totalValue: 1502.50 },
    { exchange: 'NASDAQ', name: 'Amazon', symbol: 'AMZN', shares: 2, price: 3300.75, totalValue: 6601.50 },
    { exchange: 'NASDAQ', name: 'Tesla', symbol: 'TSLA', shares: 8, price: 700.30, totalValue: 5602.40 },
    { exchange: 'NYSE', name: 'Coca-Cola', symbol: 'KO', shares: 20, price: 55.40, totalValue: 1108.00 },
    { exchange: 'NYSE', name: 'Disney', symbol: 'DIS', shares: 15, price: 180.75, totalValue: 2711.25 },
    { exchange: 'NASDAQ', name: 'Netflix', symbol: 'NFLX', shares: 3, price: 550.60, totalValue: 1651.80 },
    { exchange: 'NYSE', name: 'Johnson & Johnson', symbol: 'JNJ', shares: 12, price: 165.20, totalValue: 1982.40 },
  ];

  const filteredStocks = portfolioStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewChart = (stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="portfolio">
       <header>
        <h1 className='navbar-brand'>SB Stocks</h1>
        <nav>
          <a href="/landing">Home</a>
          <a href="/portfolio">Portfolio</a>
          <a href="/profile">Profile</a>
          <a href="/login">Logout</a>
        </nav>
      </header>
      <h1>My Portfolio</h1>
      <input
        type="text"
        placeholder="Search stocks by symbol"
        className="search-input"
        value={searchTerm}
        onChange={handleSearch}
      />
      <table className="portfolio-table">
        <thead>
          <tr>
            <th>Exchange</th>
            <th>Stock Name</th>
            <th>Symbol</th>
            <th>Shares</th>
            <th>Stock Price</th>
            <th>Total Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStocks.map((stock, index) => (
            <tr key={index}>
              <td>{stock.exchange}</td>
              <td>{stock.name}</td>
              <td>{stock.symbol}</td>
              <td>{stock.shares}</td>
              <td>${stock.price.toFixed(2)}</td>
              <td>${stock.totalValue.toFixed(2)}</td>
              <td>
                <button className="view-chart" onClick={() => handleViewChart(stock)}>
                  View Chart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedStock && (
        <div className="stock-chart-overlay">
          <StockChart 
            stock={selectedStock} 
            onClose={() => setSelectedStock(null)} 
            mode="portfolio"
          />
        </div>
      )}
    </div>
  );
}

export default Portfolio;