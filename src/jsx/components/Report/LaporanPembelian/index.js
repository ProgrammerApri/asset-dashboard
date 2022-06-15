import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import ReportGRA from "./Gra";
import ReportJurnal from "./Jurnal";
import ReportSaldo from "./Saldo";

const LaporanPembelian = () => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
      tittle: "GRA",
      icon: "bx-receipt",
      component: <ReportGRA />,
    },
    {
      tittle: "Jurnal",
      icon: "bx-detail",
      component: <ReportJurnal />,
    },
    {
      tittle: "Saldo",
      icon: "bx-money",
      component: <ReportSaldo />,
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
