import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './component/Footer';
import LoginPage from './component/LoginPage';
import Registration from './component/Registration';
import Navbar from './component/NavBar';
import Home from './component/Home';
import { useState } from 'react';
import Team from './component/Team';

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
          <Route path="/x-workz/login" element={<LoginPage get={getState}/>} />
          {login ? (
           <Route path="/x-workz/register" element={<Registration />} />
           // <Route path="/x-workz/team" element={<Team/>} />
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