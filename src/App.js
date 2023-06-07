import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './component/Footer';
import LoginPage from './component/LoginPage';
import Registration from './component/Registration';
import Navbar from './component/NavBar';
import ProtectedRoutes from './component/ProtectedRoutes';
import { useState } from 'react';
import { AuthContextProovider } from './component/AuthContext';
import Home from './component/Home';

function App() {


  return (
    <div className="App">
      <AuthContextProovider>
        <Navbar />
        <Routes>
        <Route path="/x-workz" element={<Home/>} ></Route>
          <Route path="/x-workz/login" element={<ProtectedRoutes accessBy="non-authenticated"><LoginPage /></ProtectedRoutes>}/>
          <Route path="/x-workz/register" element={<ProtectedRoutes accessBy="authenticated"><Registration /></ProtectedRoutes>}>
          </Route>
        </Routes>
        <Footer />
        </AuthContextProovider>

    </div>
  );
}

export default App;