import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Footer from './component/Footer';
import LoginPage from './component/LoginPage';
import Navbar from './component/NavBar';
import React, { useState } from 'react';

// Import the Dashboard component
import Dashboard from './component/Dashboard';

function App() {
  const [login, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const checkAuth = () => {
    if (!login) {
      navigate('/x-workz/login'); // Redirect to login if not logged in
    }
  };

  React.useEffect(()=> {
    checkAuth();
  })

  const getState = (userState) => {
    setLoggedIn(userState);
  }

  return (
    <>
      <div className="App">
      
      
        <Routes>
         

          {/* Login route */}
          <Route path="/x-workz/login" element={<LoginPage get={getState} />} />

          {login ? (
            // Show sidebar and protected routes after successful login
            <React.Fragment>

              <Route path="/x-workz/*" element={<Dashboard isLoggedIn={login} />} />

         
            </React.Fragment>
          ) : (
            // Show only the login page when not logged in
            <React.Fragment>

              <Route path="/x-workz/login" element={<LoginPage />} />

       
            </React.Fragment>
          )}
        </Routes>
        </div>
       
     
      <Footer />
    </>
  );
}

export default App;
