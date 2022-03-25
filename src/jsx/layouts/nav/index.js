import React, { Fragment, useState } from "react";
import SideBar from "./SideBar";
import NavHader from "./NavHader";
import Header from "./Header";
import ChatBox from "../ChatBox";

const JobieNav = ({ title }) => {
  const [toggle, setToggle] = useState("");
  const [isDark, setDark] = useState(true);
  const onClick = (name) => setToggle(toggle === name ? "" : name);
  return (
    <Fragment>
      <NavHader isDark={isDark} />
      <SideBar />
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
      <ChatBox onClick={() => onClick("chatbox")} toggle={toggle} />
    </Fragment>
  );
};

export default JobieNav;
