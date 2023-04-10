import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import ReportGRA from "./Gra";
import ReportRP from "./RequestPurchase";
import ReportPO from "./PurchaseOrder";
import { Link } from "react-router-dom";
import OutstandingPO from "./OutstandingPO";
import OutstandingRP from "./OutstandingRP";
import OutstandingGRA from "./OutstandingGRA";
import ReportReturBeli from "./ReturPembelian";
import HistoryPayOrder from "./HistoryPayOrd";
import PembelianPerProduk from "./PembelianPerProduk";
import Pnl from "./Pnl";

const LaporanPembelian = (self) => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
      tittle: "Pembelian",
      icon: "bx-receipt",
      component: <ReportGRA />,
    },
    {
      tittle: "Permintaan Pembelian (RP)",
      icon: "bx-receipt",
      component: <ReportRP />,
    },
    {
      tittle: "Pesanan Pembelian (PO)",
      icon: "bx-receipt",
      component: <ReportPO />,
    },

    {
      tittle: "Outstanding RP",
      icon: "bx-receipt",
      component: <OutstandingRP />,
    },
    {
      tittle: "Outstanding PO",
      icon: "bx-receipt",
      component: <OutstandingPO />,
    },
    {
      tittle: "Outstanding Pembelian",
      icon: "bx-receipt",
      component: <OutstandingGRA />,
    },
    {
      tittle: "Retur Pembelian",
      icon: "bx-receipt",
      component: <ReportReturBeli />,
    },
    {
      tittle: "Laba Rugi",
      icon: "bx-spreadsheet",
      component: <Pnl />,
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

export default LaporanPembelian;
