import React, { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }
  
    try {
        const response = await axios.post('api/users', {
          name,
          email,
          password
        });
  
        if (response.status === 201) {
          // Registration successful
          navigate('/login'); // Redirect to login page
        } else {
          setError(response.data.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Registration error:', error);
        setError(error.response?.data?.message || 'An error occurred during registration');
      } finally {
        setIsLoading(false);
      }
    };

  const handleFacebookLogin = () => {
    // Implement Facebook login logic
    window.location.href = 'https://www.facebook.com/login';
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic
    window.location.href = 'https://www.google.com';
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <div className="register-card">
          <h2>Signup</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Create Password:</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Confirm Password:</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="register-btn" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <p className="login-link">
            Already have an account? <span onClick={() => navigate('/login')} className="register-link">Login</span>
          </p>
          <div className="social-buttons">
            <button className="social-btn facebook" onClick={handleFacebookLogin}>
              Login with Facebook
            </button>
            <button className="social-btn google" onClick={handleGoogleLogin}>
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
