import React from 'react';
import Navbar from './Navbar';
import '../styles/HomePage.css';
import { useNavigate } from 'react-router-dom';


function HomePage() {
  const navigate = useNavigate();
  return (
    <>
    <Navbar />
    <div className="home-page">
  
      <div className="main-content">
        <div className="main-section">
          <h1>invest smart, play your part with SB Stocks</h1>
          <p>Join the world's most intuitive stock trading platform. Real-time data, powerful tools, and expert insights to maximize your trading potential.</p>
          <div className="cta-buttons">
            <button className="cta-button primary" onClick={() => navigate('/register')}>Start Trading Today</button>
            <button onClick={() => navigate('/register')}// fixed button onclick syntax
            >Start Trading</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default HomePage;