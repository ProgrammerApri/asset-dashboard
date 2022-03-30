import React, { useEffect, useState } from "react";

/// React router dom
import { Link } from "react-router-dom";

/// images
import logo from "../../../images/logo-large.png";
// import logoText from "../../../images/udang-text.png";
// import logoTextWhite from "../../../images/udang-text-white.png";

const NavHader = ({isDark = false}) => {
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    console.log(isDark);
  }, []);

  return (
    <div className="nav-header">
      <Link to="/" className="brand-logo">
        <img className="logo-abbr" src={logo} alt="" />
        {/* <img
          className="logo-compact"
          src={isDark ? logoTextWhite : logoText}
          alt=""
        />
        <img
          className="brand-title"
          src={isDark ? logoTextWhite : logoText}
          alt=""
        /> */}
      </Link>

      <div className="nav-control" onClick={() => setToggle(!toggle)}>
        <div className={`hamburger ${toggle ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
