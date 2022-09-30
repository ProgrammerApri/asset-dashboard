import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReportHutang from "./Hutang";
import ReportHutangRingkasan from "./HutangRingkasan";
import UmurHutangRingkasan from "./UmurHutangRingkasan";
import UmurHutang from "./UmurHutang";
import HistoryPayOrder from "./HistoryPayOrd";

const LaporanAp = (self) => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
      tittle: "Saldo Hutang Ringkasan",
      icon: "bx-money",
      component: <ReportHutangRingkasan />,
    },
    {
      tittle: "Saldo Hutang Rincian",
      icon: "bx-money",
      component: <ReportHutang />,
    },
    {
      tittle: "Umur Hutang Ringkasan",
      icon: "bx-calendar-x",
      component: <UmurHutangRingkasan />,
    },
    {
      tittle: "Umur Hutang Rincian",
      icon: "bx-calendar-x",
      component: <UmurHutang />,
    },
    {
      tittle: "Histori Pembayaran Pembelian",
      icon: "bx-receipt",
      component: <HistoryPayOrder />,
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
          to={"/laporan/ap/" + el.tittle.toLowerCase().replaceAll(" ", "-")}
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

export default LaporanAp;
