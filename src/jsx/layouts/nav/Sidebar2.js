import React, { useState, useEffect } from "react";
import { HashRouter, Link } from "react-router-dom";
import logoSmall from "../../../images/logo.png";
import PerfectScrollbar from "react-perfect-scrollbar";

const SideMenu = () => {
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
        tittle: "Akun",
        to: "akun",
        icon: "bx-category-alt",
      },
      {
        tittle: "Mitra",
        to: "mitra",
        icon: "bx-shape-circle",
      },
      {
        tittle: "Group Produk",
        to: "group-produk",
        icon: "bx-cabinet",
      },
      {
        tittle: "Produk",
        to: "produk",
        icon: "bx-archive",
      },
      {
        tittle: "Gudang",
        to: "gudang",
        icon: "bx-building",
      },
      {
        tittle: "Aset",
        to: "aset",
        icon: "bx-car",
      },
    ],
    master_lainnya: [
      {
        tittle: "Satuan",
        to: "satuan",
        icon: "bx-barcode",
      },
      {
        tittle: "Departemen",
        to: "departemen",
        icon: "bx-globe-alt",
      },
      {
        tittle: "Project",
        to: "project",
        icon: "bx-poll",
      },
      {
        tittle: "Currency",
        to: "currency",
        icon: "bx-dollar-circle",
      },
      {
        tittle: "bank",
        to: "bank",
        icon: "bx-money-withdraw",
      },
      {
        tittle: "jenis pelanggan",
        to: "jenis-pelanggan",
        icon: "bx-street-view",
      },
      {
        tittle: "jenis pemasok",
        to: "jenis-pemasok",
        icon: "bx-user-voice",
      },
    ],
    lainnya: [
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
          <Link
            className={el.to === path.replace(patern, "") ? "active" : ""}
            to={el.to}
          >
            <i className={`bx ${el.icon}`}></i>
            <span className="sub-tittle">{el.tittle}</span>
          </Link>
        );
      });
      console.log(key);
      out.push(
        <div className="sidebar-menu">
          <div className={key === "dashboard" ? "menu-tittle first": "menu-tittle"}>
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
