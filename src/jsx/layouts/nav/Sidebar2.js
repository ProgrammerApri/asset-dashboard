import React, { useState, useEffect } from "react";
import { HashRouter, Link } from "react-router-dom";
import logoSmall from "../../../images/logo.png";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Button } from "react-bootstrap";
import { Tooltip } from "primereact/tooltip";
import { useSelector } from "react-redux";

const SideMenu = () => {
  const wrapper = document.querySelector("#main-wrapper");
  const body = document.querySelector("body");
  const [isMini, setMini] = useState(false);
  const accessMenu = useSelector((state) => state.profile.profile?.menu);
  const [menu, setMenu] = useState(null);

  const path = window.location.href;
  const origin = window.location.origin;
  const patern = origin + "/#/";

  useEffect(() => {
    setMenu({
      dashboard: accessMenu
        ?.filter((v) => v.category === 1 && v.view)
        .map((v) => ({
          tittle: v.name,
          to: v.route_name,
          icon: v.icon_file,
        })),
      master: accessMenu
        ?.filter((v) => v.category === 2 && v.view)
        .map((v) => ({
          tittle: v.name,
          to: v.route_name,
          icon: v.icon_file,
        })),
      transaksi: accessMenu
        ?.filter((v) => v.category === 3 && v.view)
        .map((v) => ({
          tittle: v.name,
          to: v.route_name,
          icon: v.icon_file,
        })),
      Laporan: accessMenu
        ?.filter((v) => v.category === 4 && v.view)
        .map((v) => ({
          tittle: v.name,
          to: v.route_name,
          icon: v.icon_file,
        })),
      lainnya: accessMenu
        ?.filter((v) => v.category === 5 && v.view)
        .map((v) => ({
          tittle: v.name,
          to: v.route_name,
          icon: v.icon_file,
        })),
    });
  }, []);

  
  const renderSidebar = () => {
    let out = [];
    if (menu) {
      for (var key of Object.keys(menu)) {
        let sub = [];
          menu[key]?.forEach((el, i) => {
            sub.push(
              <>
                <Link
                  className={`menu-${key}-${i} ${
                    el.to ===
                    `${
                      path.replace(patern, "").includes("/")
                        ? path
                            .replace(patern, "")
                            .substring(0, path.replace(patern, "").indexOf("/"))
                        : path.replace(patern, "")
                    }`
                      ? "active"
                      : ""
                  }`}
                  to={"/" + el.to}
                >
                  <i className={`${el.icon}`}></i>
                  <span className="sub-tittle">{el.tittle}</span>
                </Link>
                {isMini || body.getAttribute("data-sidebar-style") == "mini" ? (
                  <Tooltip target={`.menu-${key}-${i}`} content={el.tittle} />
                ) : (
                  <></>
                )}
              </>
            );
          });
        // console.log(key);
        if (menu[key]?.length) {
          out.push(
            <div className="sidebar-menu">
              <div
                className={
                  key === "dashboard" ? "menu-tittle first" : "menu-tittle"
                }
              >
                {key.includes("_") ? key.replace("_", " ") : key}
              </div>
              <div className="menu-sub">
                <li>{sub}</li>
              </div>
            </div>
          );
        }
      }
    }

    return out;
  };

  return (
    <>
      <HashRouter basename="/">
        <div className="sidebar">
          <div className="sidebar-header">
            <Link to={""}>
              <div className="sidebar-logo">
                <img className="logo" src={logoSmall} alt="" />
              </div>
              <span>itungin.id</span>
            </Link>
            <Link
              className="smini"
              onClick={() => {
                if (isMini) {
                  wrapper.classList.remove("menu-toggle");
                } else {
                  wrapper.classList.add("menu-toggle");
                }
                setMini(!isMini);
              }}
            >
              <div>
                <i className="mt-1 bx bx-expand-horizontal"></i>
              </div>
            </Link>
          </div>
          <PerfectScrollbar className="scroll">
            {renderSidebar()}
          </PerfectScrollbar>
          {/* <div className="sidebar-footer">
            <p>
              <strong>itungin.id Dashboard</strong> ©All Rights Reserved
            </p>
          </div> */}
        </div>
      </HashRouter>
    </>
  );
};

export default SideMenu;
