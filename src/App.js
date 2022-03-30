import React, { Fragment } from "react";

// Components
import Markup from "./jsx";
import Login from "./jsx/Login";

/// Style
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";


const App = () => {
  const token = localStorage.getItem("token");
  return (
    <Fragment>
       {token ? (<Markup/>) : (<Login/>)}
    </Fragment>
  );
};

export default App;
