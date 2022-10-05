import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import KartuStock from "./KartuStock";
import KartuStock_ringkasan from "./KartuStock_ringkasan";
import MutasiStock from "./MutasiStock";
import PembelianPerProduk from "../LaporanPembelian/PembelianPerProduk";
import ReportGRA from "../LaporanPembelian/Gra";

const LaporanPersediaan = (self) => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
      tittle: "Mutasi Antar Lokasi",
      icon: "bx-spreadsheet",
      component: <MutasiStock />,
    },
    {
      tittle: "Kartu Stock Ringkasan",
      icon: "bx-spreadsheet",
      component: <KartuStock_ringkasan />,
    },
    {
      tittle: "Kartu Stock Rincian",
      icon: "bx-spreadsheet",
      component: <KartuStock />,
    },
    {
      tittle: "Pembelian Per Produk",
      icon: "bx-receipt",
      component: <PembelianPerProduk />,
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
        <Link to={"/laporan/persediaan/" + el.tittle.toLowerCase().replaceAll(" ", "-")}>
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

export default LaporanPersediaan;
