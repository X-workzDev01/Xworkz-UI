import React from 'react';

const Logout = () => {
  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', false);
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <div>
      <h1>Logout</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
