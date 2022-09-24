import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Memorial from "./Memorial";
import Persediaan from "./Persediaan/Persediaan";
import TransaksiPembelian from "./TransaksiPembelian/TransaksiPembelian";
import TransaksiPenjualan from "./TransaksiPenjualan/TransaksiPenjualan";

const Transaksi = (self) => {
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
    {
      tittle: "Persediaan",
      icon: "bx-receipt",
      component: <Persediaan />,
    },
    {
      tittle: "Memorial",
      icon: "bx-receipt",
      component: <Memorial />,
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
        <Link to={"/transaksi/" + el.tittle.toLowerCase().replaceAll(" ", "-")}>
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

export default Transaksi;
