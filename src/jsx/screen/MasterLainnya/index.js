import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import Bank from "./Bank";
import Currency from "../Master/Currency";
import Divisi from "./Divisi";
import JenisPelanggan from "../Master/JenisPelanggan";
import JenisPemasok from "./JenisPemasok";
import Project from "./Project";
import Satuan from "./Satuan";
import PusatBiaya from "./PusatBiaya";
import RulesPay from "./RulesPay";
import Salesman from "./Salesman";
import Pajak from "../Master/Pajak";
import Jasa from "../Master/Jasa";
import { Link } from "react-router-dom";
import { tr } from "src/data/tr";
import DivisiDep from "./DivisiDep";

const MasterLainnya = (self) => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
      tittle: tr[localStorage.getItem("language")].sat,
      icon: "bx-barcode",
      component: <Satuan />,
    },
    {
      tittle: tr[localStorage.getItem("language")].div_prod,
      icon: "bx-scatter-chart",
      component: <Divisi />,
    },
    {
      tittle: tr[localStorage.getItem("language")].dep,
      icon: "bx-globe-alt",
      component: <PusatBiaya />,
    },
    {
      tittle: tr[localStorage.getItem("language")].divdep,
      icon: "bx-globe-alt",
      component: <DivisiDep />,
    },
    {
      tittle: tr[localStorage.getItem("language")].salesmn,
      icon: "bx-user",
      component: <Salesman />,
    },
    {
      tittle: tr[localStorage.getItem("language")].proj,
      icon: "bx-poll",
      component: <Project />,
    },
    {
      tittle: tr[localStorage.getItem("language")].currency,
      icon: "bx-dollar-circle",
      component: <Currency />,
    },
    {
      tittle: tr[localStorage.getItem("language")].syarat,
      icon: "bx-dollar-circle",
      component: <RulesPay />,
    },
    {
      tittle: "Aset",
      icon: "bx-car",
      component: <></>,
    },
    {
      tittle: tr[localStorage.getItem("language")].pajak,
      icon: "bx-equalizer",
      component: <Pajak />,
    },
    {
      tittle: tr[localStorage.getItem("language")].jasa,
      icon: "bx-run",
      component: <Jasa />,
    },
    {
      tittle: tr[localStorage.getItem("language")].pel_type,
      icon: "bx-street-view",
      component: <JenisPelanggan />,
    },
    {
      tittle: tr[localStorage.getItem("language")].pem_type,
      icon: "bx-user-voice",
      component: <JenisPemasok />,
    },
  ]);

  let id =
    subMenu.findIndex(
      (e) =>
        e.tittle?.toLowerCase() ===
        self?.match?.params?.active?.replaceAll("-", " ")
    ) < 0
      ? 0
      : subMenu.findIndex(
          (e) =>
            e.tittle?.toLowerCase() ===
            self?.match?.params?.active?.replaceAll("-", " ")
        );

  const renderSubMenu = () => {
    let menu = [];

    subMenu.forEach((el, i) => {
      menu.push(
        <Link
          to={"/master-lainnya/" + el.tittle?.toLowerCase().replaceAll(" ", "-")}
        >
          <Button
            className={`sub-menu mr-4 mb-4 ${id == i ? "act" : ""}`}
            role="button"
            data-toggle="dropdown"
          >
            <Row className="ml-0 mr-0 align-items-center">
              <div className="sub-icon">
                <i className={`bx ${el.icon}`}></i>
              </div>
              <span className="ml-3 mr-3">{el.tittle}</span>
            </Row>
          </Button>
        </Link>
      );
    });
    return menu;
  };

  return (
    <Row className="mb-0">
      <Col className="col-12 pb-0">{renderSubMenu()}</Col>
      <Col className="mb-0 pt-0">{subMenu[id].component}</Col>
    </Row>
  );
};

export default MasterLainnya;
