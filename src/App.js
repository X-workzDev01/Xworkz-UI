import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './component/Footer';
import LoginPage from './component/LoginPage';
import Registration from './component/Registration';
import Navbar from './component/NavBar';
import React, { useState } from 'react';
import View from './viewdata/View';
import DisplayData from './viewdata/DisplayData';
import Search from './viewdata/Search';

function App() {
  const [login, setLoggedIn] = useState(false);

  const getState = (userState) => {
    setLoggedIn(userState);
  }

  return (
    <>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/x-workz/login" element={<LoginPage get={getState} />} />
          <Route path="/x-workz/register" element={<Registration />} />
          <Route path="/x-workz/view" element={<View />} />
          <Route path="/x-workz/display" element={<DisplayData />} />
          <Route path="/x-workz/search" element={<Search />} />
          {login ? (
            //protected routes
            <React.Fragment>
              <Route path="/x-workz/register" element={<Registration />} />
              <Route path="/x-workz/view" element={<View />} />
              <Route path="/x-workz/display" element={<DisplayData />} />
              <Route path="/x-workz/search" element={<Search />} />
            </React.Fragment>
            // 
            // <Route path="/x-workz/team" element={<Team/>} />


          ) : (
            <Route path="/x-workz/login" element={<LoginPage />} ></Route>
          )}
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;