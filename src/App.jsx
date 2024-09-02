import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginRegister from './components/LoginRegister';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Home from './components/Home';
import SideNav from './components/SideNav';
import { logout, isAuthenticated, getUserInfo } from './services/Api';
import './App.css';

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuth) {
      fetchUserInfo();
    }
  }, [isAuth]);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = await getUserInfo(token);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      handleLogout();
    }
  };

  const handleLogin = async (loginData) => {
    setIsAuth(true);
    localStorage.setItem('authToken', loginData.token);
    await fetchUserInfo();
  };

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        {isAuth && <SideNav onLogout={handleLogout} />}
        <div className="content">
          <Routes>
            <Route 
              path="/" 
              element={
                isAuth ? 
                  <Navigate to="/home" /> : 
                  <LoginRegister onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/home" 
              element={
                isAuth ? 
                  <Home user={user} /> : 
                  <Navigate to="/" />
              } 
            />
            <Route 
              path="/profile" 
              element={
                isAuth ? 
                  <Profile user={user} onLogout={handleLogout} /> : 
                  <Navigate to="/" />
              } 
            />
            <Route 
              path="/chat" 
              element={
                isAuth ? 
                  <Chat user={user} /> : 
                  <Navigate to="/" />
              } 
            />
          </Routes>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;