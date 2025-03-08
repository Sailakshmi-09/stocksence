import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import StockChart from './components/StockChart';
import Portfolio from './components/Portfolio';
import AdminPanel from './components/AdminPage';
import Register from './components/Register'; // Import the Register component
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <div className="App">
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/home" element={<HomePage />} /> Change component to element */}
          <Route path="/profile" element={<ProfilePage />} /> {/* Change component to element */}
          <Route path="/stock/:symbol" element={<StockChart />} /> {/* Change component to element */}
          <Route path="/portfolio" element={<Portfolio />} /> {/* Change component to element */}
          <Route path="/admin" element={<AdminPanel />} /> {/* Change component to element */}
          <Route path="/register" element={<Register />} /> {/* Add Register route */}
          <Route path="/login" element={<Login />} />
          <Route path="/landing" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
