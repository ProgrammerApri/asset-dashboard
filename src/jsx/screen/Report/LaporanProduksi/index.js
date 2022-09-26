import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import KartuWIP from "./KartuWIP";
import RencanaPemakaianBB from "./RencanaPemakaianBB";
import PemasukanDB from "./PemasukanDB";
import PengeluaranBDP from "./PengeluaranBDP";

const LaporanProduksi = (self) => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
        tittle: "Pemakaian Bahan",
        icon: "bx-spreadsheet",
        component: <KartuWIP />,
      },
      {
        tittle: "Rencana Pemakaian BB",
        icon: "bx-spreadsheet",
        component: <RencanaPemakaianBB />,
      },
      {
        tittle: "Pemasukan Barang",
        icon: "bx-spreadsheet",
        component: <PemasukanDB />,
      },
      {
        tittle: "Pengeluaran Barang",
        icon: "bx-spreadsheet",
        component: <PengeluaranBDP />,
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
        <Link to={"/laporan/produksi/" + el.tittle.toLowerCase().replaceAll(" ", "-")}>
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

export default LaporanProduksi;
