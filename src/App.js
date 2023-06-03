import {  Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './component/Footer';
import LoginPage from './component/LoginPage';
import Registration from './component/Registration';
import Navbar from './component/NavBar';
import ProtectedRoutes from './component/ProtectedRoutes';
import { useState } from 'react';

function App() {
 

  return (
    <div className="App">
      <Navbar/>
      <Routes>
      <Route path="/x-workz/login" element={<LoginPage/>}/>
      <Route element={<ProtectedRoutes/>}>
        <Route path="/x-workz/register" element={<Registration/>}/>
      </Route>
    
    </Routes>    
      <Footer />
    </div>
  );
}

export default App;