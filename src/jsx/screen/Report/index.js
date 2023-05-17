import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function GroupReport() {
  const [subMenu, setSubMenu] = useState([
    {
      tittle: "General Ledger",
      icon: "bx-archive",
      total: 8,
      to: "gl",
    },
    {
      tittle: "AR",
      icon: "bx-archive",
      total: 5,
      to: "ar",
    },

    {
      tittle: "Laporan Penjualan",
      icon: "bx-archive",
      total: 5,
      to: "penjualan",
    },

    {
      tittle: "AP",
      icon: "bx-archive",
      total: 5,
      to: "ap",
    },

    {
      tittle: "Laporan Pembelian",
      icon: "bx-archive",
      total: 8,
      to: "pembelian",
    },
    {
      tittle: "Laporan Persediaan",
      icon: "bx-archive",
      total: 4,
      to: "persediaan",
    },

    {
      tittle: "Laporan Produksi",
      icon: "bx-archive",
      total: 4,
      to: "produksi",
    },
  ]);

  const renderSubMenu = () => {
    let menu = [];

    subMenu.forEach((el, i) => {
      menu.push(
        <Link to={"/laporan/" + el.to}>
          <Button
            className={`group-menu mr-4 mb-4 ${i === 0 ? "act" : ""}`}
            role="button"
            data-toggle="dropdown"
          >
            <Row className="ml-0 mr-0">
              <div className="group-icon">
                <i className={`bx ${el.icon}`}></i>
              </div>
              <span className="col-12 text-left p-0 mt-5 fs-14">
                {el.tittle}
              </span>
              <span className="group-subtitle col-12 text-left p-0 fs-12">{`${el.total} Reports`}</span>
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
    </Row>
  );
}
