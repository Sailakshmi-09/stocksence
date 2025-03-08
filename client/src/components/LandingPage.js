import React, { useState, useEffect } from 'react';
import "../styles/LandingPage.css";
import StockChart from './StockChart';

function LandingPage() {
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [searchSymbol, setSearchSymbol] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [displayedWatchlist, setDisplayedWatchlist] = useState([]);

  useEffect(() => {
    fetchTrendingStocks();
    fetchWatchlist();
  }, []);

  useEffect(() => {
    if (searchSymbol.trim() === '') {
      setDisplayedWatchlist(watchlist);
    } else {
      const filteredList = watchlist.filter(stock => 
        stock.symbol.toLowerCase().includes(searchSymbol.toLowerCase())
      );
      setDisplayedWatchlist(filteredList);
    }
  }, [searchSymbol, watchlist]);

  const fetchTrendingStocks = () => {
    const mockData = [
      { name: 'Apple, Inc.', symbol: 'AAPL', price: 182.02, change: -2.16 },
      { name: 'PayPal Holdings, Inc.', symbol: 'PYPL', price: 150.49, change: -0.25 },
      { name: 'Alphabet, Inc', symbol: 'GOOGL', price: 120.20, change: 2.41 },
      { name: 'Microsoft Corp.', symbol: 'MSFT', price: 229.20, change: 3.41 },
      { name: 'Johnson & Johnson', symbol: 'JNJ', price: 150.53, change: -0.32 },
      { name: 'Tesla, Inc.', symbol: 'TSLA', price: 18.49, change: -0.25 },
      { name: 'NIO Inc.', symbol: 'NIO', price: 10.18, change: 2.63 },
      { name: 'AMC Entertainment Holdings, Inc.', symbol: 'AMC', price: 2.68, change: 0.90 },
      { name: 'Nu Holdings Ltd.', symbol: 'NU', price: 7.165, change: 2.41 },
    ];
    setTrendingStocks(mockData);
  };

  const fetchWatchlist = () => {
    const mockData = [
      { name: 'Square I', symbol: 'SQ', stockType: 'Common Stock', price: 150.45 },
      { name: 'ATA Creativity Global', symbol: 'AACG', stockType: 'Depositary Receipt', price: 225.60 },
      { name: 'Armada Acquisition Corp. I', symbol: 'AACI', stockType: 'Common Stock', price: 180.75 },
      { name: 'Armada Acquisition Corp. I Unit', symbol: 'AACIU', stockType: 'Common Stock', price: 45.30 },
      { name: 'Armada Acquisition Corp. I', symbol: 'AACIW', stockType: 'Common Stock', price: 90.20 },
      { name: 'Advancit Acquisition Corp. I', symbol: 'AACOU', stockType: 'Common Stock', price: 135.45 },
      { name: 'NVIDIA Corp. I', symbol: 'NVDA', stockType: 'Common Stock', price: 300.45 },
    ];
    setWatchlist(mockData);
    setDisplayedWatchlist(mockData);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The filtering is now handled by the useEffect hook
  };

  const handleViewChart = (stock) => {
    setSelectedStock(stock);
  };

  const handleCloseChart = () => {
    setSelectedStock(null);
  };

  return (
    <div className="landing-page">
      <header>
        <h1 className='navbar-brand'>SB Stocks</h1>
        <nav>
          <a href="#">Home</a>
          <a href="/portfolio">Portfolio</a>
          <a href="/profile">Profile</a>
          <a href="/login">Logout</a>
        </nav>
      </header>
      
      <main>
        {selectedStock && (
          <div className="stock-chart-overlay">
            <StockChart 
              stock={selectedStock} 
              onClose={() => setSelectedStock(null)} 
              mode="landing"
            />
          </div>
        )}
        {selectedStock ? (
          <>
            <StockChart stock={selectedStock} />
            <button onClick={handleCloseChart} className="close-chart-btn">Close Chart</button>
          </>
        ) : (
          <>
            <section className="trending-stocks">
              <h2>Trending stocks</h2>
              {trendingStocks.map((stock, index) => (
                <div key={index} className="stock-item">
                  <div className="stock-name">{stock.name}</div>
                  <div className="stock-details">
                    <span className="symbol">{stock.symbol}</span>
                    <span className={`price ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                      ${stock.price.toFixed(2)} ({stock.change.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              ))}
            </section>

            <section className="watchlist">
              <h2>Watchlist</h2>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Enter Stock Symbol..."
                  value={searchSymbol}
                  onChange={(e) => setSearchSymbol(e.target.value)}
                />
                <button type="submit">Search</button>
              </form>
              {displayedWatchlist.map((stock, index) => (
                <div key={index} className="watchlist-item">
                  <div className="stock-exchange">NASDAQ</div>
                  <div className="stock-info">
                    <div className="stock-name">{stock.name}</div>
                    <div className="stock-details">
                      <span>Symbol: {stock.symbol}</span>
                      <span>Stock Type: {stock.stockType}</span>
                    </div>
                  </div>
                  <button className="view-chart" onClick={() => handleViewChart(stock)}>View Chart</button>
                </div>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default LandingPage;