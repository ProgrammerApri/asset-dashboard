import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import TransaksiPembelian from "./TransaksiPembelian/TransaksiPembelian";
import TransaksiPenjualan from "./TransaksiPenjualan/TransaksiPenjualan";

const Transaksi = () => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
      tittle: "Transaksi Pembelian",
      icon: "bx-receipt",
      component: <TransaksiPembelian />,
    },
    {
        tittle: "Transaksi Penjualan",
        icon: "bx-receipt",
        component: <TransaksiPenjualan />,
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

export default Transaksi;
