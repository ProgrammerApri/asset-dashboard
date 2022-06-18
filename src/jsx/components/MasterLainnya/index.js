import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import Bank from "./Bank";
import Currency from "../Master/Currency";
import Divisi from "../Master/Divisi";
import JenisPelanggan from "../Master/JenisPelanggan";
import JenisPemasok from "../Master/JenisPemasok";
import Project from "./Project";
import Satuan from "./Satuan";
import PusatBiaya from "./PusatBiaya";
import RulesPay from "./RulesPay";
import Lokasi from "../Master/Lokasi";
import Salesman from "./Salesman";

const MasterLainnya = () => {
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
      tittle: "Bank",
      icon: "bx-money-withdraw",
      component: <Bank />,
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

  const renderSubMenu = () => {
    let menu = [];

    subMenu.forEach((el, i) => {
      menu.push(
        <Button
          className={`sub-menu mr-4 mb-4 ${active == i ? "act" : ""}`}
          role="button"
          onClick={() => {
            setActive(i);
          }}
          data-toggle="dropdown"
        >
          <Row className="ml-0 mr-0 align-items-center">
            <div className="sub-icon">
              <i className={`bx ${el.icon}`}></i>
            </div>
            <span className="ml-3 mr-3">{el.tittle}</span>
          </Row>
        </Button>
      );
    });
    return menu;
  };

  return (
    <Row className="mb-0">
      <Col className="col-12 pb-0">
        <div className="">{renderSubMenu()}</div>
      </Col>
      <Col className="pt-0">{subMenu[active].component}</Col>
    </Row>
  );
};

export default MasterLainnya;
