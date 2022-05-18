import React, { Fragment, useState } from "react";
import Header from "./Header";
import SideMenu from "./Sidebar2";

const JobieNav = ({ title }) => {
  const [toggle, setToggle] = useState("");
  const [isDark, setDark] = useState(false);
  const onClick = (name) => setToggle(toggle === name ? "" : name);
  return (
    <Fragment>
      {/* <NavHader isDark={isDark} /> */}
      {/* <SideBar /> */}
      <SideMenu/>
      <Header
        onNote={() => onClick("chatbox")}
        onNotification={() => onClick("notification")}
        onProfile={() => onClick("profile")}
        toggle={toggle}
        title={title}
        onBox={() => onClick("box")}
        onDark={(dark) => {
          console.log(dark);
          setDark(!dark);
        }}
      />
    </Fragment>
  );
};

export default JobieNav;
