import axios from "axios";
import jwtDecode from "jwt-decode";
import { createContext, useContext, useState } from "react";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProovider=({children})=>{
    const [user, setUser] = useState(()=>{
        if(localStorage.getItem("xworkz")){
            let tokenData = JSON.parse(localStorage.getItem("xworkz"))
            let accessToken = jwtDecode(tokenData.access_token);
            return accessToken;
        }
        return null;
    });
    const login =async(email,password)=>{ 
    const loginresponse = await axios.post(`http://localhost:8080/otp?email=${email}&otp=${password}`, {
        headers: {
          'spreadsheetId': '1p3G4et36vkzSDs3W63cj6qnUFEWljLos2HHXIZd78Gg'
        }
      });
      
    let accessToken= jwtDecode(loginresponse.data.access_token);
    console.log(accessToken);
      setUser(accessToken);
      localStorage.setItem("xworkz",JSON.stringify(loginresponse.data));
      Navigate("/x-workz/register")
    }
    return <AuthContext.Provider value={{login,user}}>
        {children}
    </AuthContext.Provider>
}

export default AuthContext;