import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Footer from "./component/Footer";
import LoginPage from "./component/LoginPage";
import React, { useState } from "react";
import Dashboard from "./component/Dashboard";
import { Urlconstant } from "./constant/Urlconstant";

function App() {
  const [login, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const checkAuth = () => {
    if (!login) {
      navigate(Urlconstant.navigate + "login");
    }
  };

  React.useEffect(() => {
    checkAuth();
  });

  const getState = (userState) => {
    setLoggedIn(userState);
  };

  return (
    <>
      <div className="App">
        <Routes>
          <Route
            path={Urlconstant.navigate + "login"}
            element={<LoginPage get={getState} />}
          />

          {login ? (
            <React.Fragment>
              <Route
                path={Urlconstant.navigate + "*"}
                element={<Dashboard isLoggedIn={login} />}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Route
                path={Urlconstant.navigate + "login"}
                element={<LoginPage />}
              />
            </React.Fragment>
          )}
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
