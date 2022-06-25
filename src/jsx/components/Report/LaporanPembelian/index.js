import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import ReportGRA from "./Gra";
import ReportJurnal from "../Jurnal";
import ReportHutang from "./Hutang";
import ReportPiutang from "./Piutang";
import UmurPiutang from "./UmurPiutang";
import UmurHutang from "./UmurHutang";
import Neraca from "../Neraca";
import Pnl from "./Pnl";
import ReportKBB from "../KartuBB";

const LaporanPembelian = () => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
      tittle: "Pembelian",
      icon: "bx-receipt",
      component: <ReportGRA />,
    },
    {
      tittle: "Saldo Hutang",
      icon: "bx-money",
      component: <ReportHutang />,
    },
    {
      tittle: "Umur Hutang",
      icon: "bx-calendar-x",
      component: <UmurHutang />,
    },
    {
      tittle: "Saldo Piutang",
      icon: "bx-money",
      component: <ReportPiutang />,
    },
    {
      tittle: "Umur Piutang",
      icon: "bx-calendar-x",
      component: <UmurPiutang />,
    },
    {
      tittle: "Jurnal",
      icon: "bx-spreadsheet",
      component: <ReportJurnal />,
    },
    {
      tittle: "Neraca",
      icon: "bx-spreadsheet",
      component: <Neraca />,
    },
    {
      tittle: "Laba Rugi",
      icon: "bx-spreadsheet",
      component: <Pnl />,
    },
    {
      tittle: "Kartu Buku Besar",
      icon: "bx-spreadsheet",
      component: <ReportKBB />,
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

export default LaporanPembelian;
