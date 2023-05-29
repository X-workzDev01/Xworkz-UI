import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './component/Footer';
import LoginPage from './component/LoginPage';
import Registration from './component/Registration';
import Navbar from './component/NavBar';

function App() {
  return (
    <div className="App"> 
    <Navbar/>
    <Routes>
    <Route path="" element={<LoginPage/>}/>
      <Route path="login" element={<LoginPage/>}/>
      <Route path="register" element={<Registration/>}/>
    </Routes>    
    <Footer/>
    </div>
  );
}

export default App;