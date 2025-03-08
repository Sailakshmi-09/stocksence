import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Admin credentials
  const adminCredentials = {
    email: 'admin@example.com',
    password: 'admin'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/users/login', {
        email,
        password
      });


      console.log('Server response:', response.data); // Add this line for debugging

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/landing');
      } else {
        setError('Login successful, but no token received');
        console.error('Response data:', response.data);
      }

    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    window.location.href="https://www.facebook.com/login";
  };

  const handleGoogleLogin = () => {
    window.location.href="https://www.google.com";
  };

  return (
    <>
    <Navbar />
    <div className="login-container">
      <div className="login-card">
        <h2>Sign In With</h2>
        <div className="social-buttons">
          <button className="social-btn facebook" onClick={handleFacebookLogin}>
            <i className="fab fa-facebook-f"></i> Facebook
          </button>
          <button className="social-btn google" onClick={handleGoogleLogin}>
            <i className="fab fa-google"></i> Google
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="signin-btn" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="register-link">
          Not a member? <span onClick={() => navigate('/register')}>Sign up now</span>
        </p>
      </div>
    </div>
    </>
  );
}

export default Login;
