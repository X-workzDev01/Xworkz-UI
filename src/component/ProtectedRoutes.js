import React from 'react'
import { Outlet } from 'react-router-dom';
import LoginPage from './LoginPage';

const useAuth=(props)=>{

    const user={loggedIn:true};
    return user && user.loggedIn;
}

function  ProtectedRoutes(props){
  const isAuth =useAuth();
  return isAuth ? <Outlet/> :<LoginPage/>;
}

export default ProtectedRoutes;
