import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../styles/StockChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StockChart({ stock, onClose, mode = 'portfolio' }) {
  const [quantity, setQuantity] = useState(0);
  const [productType, setProductType] = useState('Intraday');
  const [action, setAction] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const chartData = {
    labels: ['08:55:00', '09:05:00', '09:15:00', '09:25:00', '09:35:00', '09:45:00', '09:55:00', '10:05:00', '10:15:00'],
    datasets: [
      {
        label: 'Stock Price',
        data: [229.5, 229.2, 228.8, 228.0, 227.5, 227.0, 226.5, 226.0, 225.5],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${stock.symbol} ${stock.exchange}`
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const totalPrice = (quantity * stock.price).toFixed(2);

  const handleBuyClick = () => {
    setAction('buy');
  };

  const handleSellClick = () => {
    setAction('sell');
  };

  const handleActionSubmit = () => {
    if (quantity > 0 && productType) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  return (
    <div className="stock-chart">
      <h2 className="chart-title">{stock.symbol} {stock.exchange}</h2>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
      {mode === 'landing' && (
        <div className="trade-panel">
          <div className="trade-buttons">
            <button className="buy-button" onClick={handleBuyClick}>Buy @ ${stock.price}</button>
            <button className="sell-button" onClick={handleSellClick}>Sell @ ${stock.price}</button>
          </div>
          {action && (
            <div className="trade-form">
              <div className="form-group">
                <label>Product type</label>
                <select value={productType} onChange={(e) => setProductType(e.target.value)}>
                  <option>Intraday</option>
                  <option>Delivery</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" value={quantity} onChange={handleQuantityChange} />
              </div>
              <div className="form-group">
                <label>Total price</label>
                <input type="text" value={totalPrice} readOnly />
              </div>
              <div className="action-buttons">
                <button 
                  className={`${action}-now-button`} 
                  onClick={handleActionSubmit}
                  disabled={!quantity || !productType}
                >
                  {action === 'buy' ? 'Buy now' : 'Sell now'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <button className="close-chart-btn" onClick={onClose}>Close Chart</button>
      {showSuccessMessage && (
        <div className="success-message">
          {action === 'buy' ? 'Buy' : 'Sell'} order placed successfully!
        </div>
      )}
    </div>
  );
}

export default StockChart;