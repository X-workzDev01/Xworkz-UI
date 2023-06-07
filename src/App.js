import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './component/Footer';
import LoginPage from './component/LoginPage';
import Registration from './component/Registration';
import Navbar from './component/NavBar';
import Home from './component/Home';
import { useEffect, useState } from 'react';
import { Logout } from '@mui/icons-material';

function App() {
  const [login, setLoggedIn] = useState(false);

  const getState=(userState)=>{
    setLoggedIn(userState);
  }

  return (
    <>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/x-workz" element={<Home />} ></Route>
          <Route path="/x-workz/login" element={<LoginPage get={getState}/>} />
          {login ? (
            <Route path="/x-workz/register" element={<Registration />} />
          ) : (
            <Route path="/x-workz" element={<Home />} ></Route>
          )}

        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;