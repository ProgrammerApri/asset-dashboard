import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReportPiutangRingkasan from "./PiutangRingkasan";
import ReportPiutang from "./Piutang";
import UmurPiutangRingkasan from "./UmurPiutangRingkasan";
import UmurPiutang from "./UmurPiutang";

const LaporanAr = (self) => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
      tittle: "Saldo Piutang Ringkasan",
      icon: "bx-money",
      component: <ReportPiutangRingkasan />,
    },
    {
      tittle: "Saldo Piutang Rincian",
      icon: "bx-money",
      component: <ReportPiutang />,
    },
    {
      tittle: "Umur Piutang Ringkasan",
      icon: "bx-calendar-x",
      component: <UmurPiutangRingkasan />,
    },
    {
      tittle: "Umur Piutang Rincian",
      icon: "bx-calendar-x",
      component: <UmurPiutang />,
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
        <Link
          to={
            "/laporan/pembelian/" + el.tittle.toLowerCase().replaceAll(" ", "-")
          }
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

export default LaporanAr;
