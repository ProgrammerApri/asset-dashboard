import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import SalesReport from "./Penjualan";
import { Link } from "react-router-dom";
import ReportSO from "./SalesOrder";
import OutstandingSalesOrder from "./OutstandingSalesOrder";
import ReportReturJual from "./ReturPenjualan";
import HistoryPaySale from "./HistoryPaySale";
import OutstandingSales from "./OutstandingPenjualan";

const LaporanPenjualan = (self) => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
      tittle: "Penjualan",
      icon: "bx-receipt",
      component: <SalesReport />,
    },
    {
      tittle: "Outstanding Penjualan",
      icon: "bx-receipt",
      component: <OutstandingSales />,
    },
    {
      tittle: "Sales Order",
      icon: "bx-receipt",
      component: <ReportSO />,
    },
    {
      tittle: "Outstanding Sales Order",
      icon: "bx-receipt",
      component: <OutstandingSalesOrder />,
    },
    {
      tittle: "Retur Penjualan",
      icon: "bx-receipt",
      component: <ReportReturJual />,
    },
    {
      tittle: "Histori Pembayaran Penjualan",
      icon: "bx-receipt",
      component: <HistoryPaySale />,
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
        <Link to={"/laporan/penjualan/" + el.tittle.toLowerCase().replaceAll(" ", "-")}>
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

export default LaporanPenjualan;
