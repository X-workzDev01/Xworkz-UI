import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import AuthContext from './AuthContext';

const ProtectedRoutes=({children,accessBy})=>{
  const {user} =useContext(AuthContext);
  if(accessBy === "non-authenticated"){
    if(!user){
      return children;
    }
  }else if(accessBy === "authenticated"){
    if(user){
      return children;
    }
  }
 return <Navigate to="/x-workz/login"></Navigate>
};

export default ProtectedRoutes;
