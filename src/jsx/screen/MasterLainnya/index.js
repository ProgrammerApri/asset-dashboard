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

const MasterLainnya = (self) => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
      tittle: "Satuan",
      icon: "bx-barcode",
      component: <Satuan />,
    },
    {
      tittle: "Divisi",
      icon: "bx-scatter-chart",
      component: <Divisi />,
    },
    {
      tittle: "Departemen",
      icon: "bx-globe-alt",
      component: <PusatBiaya />,
    },
    {
      tittle: "Salesman",
      icon: "bx-user",
      component: <Salesman />,
    },
    {
      tittle: "Project",
      icon: "bx-poll",
      component: <Project />,
    },
    {
      tittle: "Currency",
      icon: "bx-dollar-circle",
      component: <Currency />,
    },
    {
      tittle: "Syarat Pembayaran",
      icon: "bx-dollar-circle",
      component: <RulesPay />,
    },
    {
      tittle: "Aset",
      icon: "bx-car",
      component: <></>,
    },
    {
      tittle: "Pajak",
      icon: "bx-equalizer",
      component: <Pajak />,
    },
    {
      tittle: "Jasa",
      icon: "bx-run",
      component: <Jasa />,
    },
    {
      tittle: "jenis pelanggan",
      icon: "bx-street-view",
      component: <JenisPelanggan />,
    },
    {
      tittle: "jenis pemasok",
      icon: "bx-user-voice",
      component: <JenisPemasok />,
    },
  ]);

  let id =
    subMenu.findIndex(
      (e) =>
        e.tittle.toLowerCase() ===
        self?.match?.params?.active?.replaceAll("-", " ")
    ) < 0
      ? 0
      : subMenu.findIndex(
          (e) =>
            e.tittle.toLowerCase() ===
            self?.match?.params?.active?.replaceAll("-", " ")
        );

  const renderSubMenu = () => {
    let menu = [];

    subMenu.forEach((el, i) => {
      menu.push(
        <Link to={"/master-lainnya/" + el.tittle.toLowerCase().replaceAll(" ", "-")}>
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
