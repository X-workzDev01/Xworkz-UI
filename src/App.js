import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './component/Footer';
import NavBar from './component/NavBar';
import LoginPage from './component/LoginPage';
import Registration from './component/Registration';

function App() {
  return (
    <div className="App"> 
    <NavBar/>
    <Routes>
      <Route path="login" element={<LoginPage/>}/>
      <Route path="registration" element={<Registration/>}/>
    </Routes>    
  
    <Footer/>
    </div>
  );
}

export default App;
