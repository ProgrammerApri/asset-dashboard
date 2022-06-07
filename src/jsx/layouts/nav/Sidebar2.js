import React, { useState, useEffect } from "react";
import { HashRouter, Link } from "react-router-dom";
import logoSmall from "../../../images/logo.png";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Button } from "react-bootstrap";
import { Tooltip } from "primereact/tooltip";

const SideMenu = () => {
  const wrapper = document.querySelector("#main-wrapper");
  const body = document.querySelector("body");
  const [isMini, setMini] = useState(false);
  const [menu, setMenu] = useState({
    dashboard: [
      {
        tittle: "Dashboard",
        to: "",
        icon: "bx-layout",
      },
    ],
    master: [
      {
        tittle: "Master",
        to: "master",
        icon: "bx-data",
      },
      {
        tittle: "Master Lainnya",
        to: "master-lainnya",
        icon: "bx-hdd",
      },
    ],
    transaksi: [
      {
        tittle: "Transaksi",
        to: "transaksi",
        icon: "bx-barcode",
      },
      {
        tittle: "Bank & Kas",
        to: "bank-&-kas",
        icon: "bx-barcode",
      },
      {
        tittle: "Persediaan",
        to: "transaksi-persediaan",
        icon: "bx-barcode",
      },
    ],
    lainnya: [
      {
        tittle: "Klasifikasi",
        to: "klasifikasi",
        icon: "bx-list-minus",
      },
      {
        tittle: "Kategori",
        to: "kategori",
        icon: "bx-task",
      },
      {
        tittle: "Area Penjualan",
        to: "area-penjualan",
        icon: "bx-map-pin",
      },
      {
        tittle: "setup",
        to: "setup",
        icon: "bx-rename",
      },
    ],
  });

  const path = window.location.href;
  const origin = window.location.origin;
  const patern = origin + "/#/";

  useEffect(() => {}, []);

  const renderSidebar = () => {
    let out = [];
    for (var key of Object.keys(menu)) {
      let sub = [];
      menu[key].forEach((el, i) => {
        sub.push(
          <>
            <Link
              className={`menu-${key}-${i} ${
                el.to === path.replace(patern, "") ? "active" : ""
              }`}
              to={el.to}
            >
              <i className={`bx ${el.icon}`}></i>
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
      console.log(key);
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
          <div className="sidebar-footer">
            <p>
              <strong>itungin.id Dashboard</strong> ©All Rights Reserved
            </p>
          </div>
        </div>
      </HashRouter>
    </>
  );
};

export default SideMenu;
