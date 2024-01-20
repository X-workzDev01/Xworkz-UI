import React, { useState } from "react";
import PageList from "./PageList";

function View() {
  const [login, setLoggedIn] = useState(false);

  const getState = (userState) => {
    setLoggedIn(userState);
  };

  return (
    <div>
      <PageList get={getState} />
    </div>
  );
}

export default View;
