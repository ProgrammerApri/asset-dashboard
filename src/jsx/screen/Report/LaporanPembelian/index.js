import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import ReportGRA from "./Gra";
import ReportJurnal from "../Jurnal";
import ReportHutang from "./Hutang";
import ReportPiutang from "./Piutang";
import UmurPiutang from "./UmurPiutang";
import UmurHutang from "./UmurHutang";
import Neraca from "../Neraca";
import Pnl from "./Pnl";
import ReportKBB from "../KartuBB";
import SalesReport from "./Penjualan";
import NeracaPerbandingan from "../NeracaPerbandingan";
import KartuStock from "../KartuStock";
import KartuWIP from "../KartuWIP";
import RencanaPemakaianBB from "../RencanaPemakaianBB";
import PemasukanBDP from "./PengeluaranBDP";
import PengeluaranBDP from "./PengeluaranBDP";
import PemasukanDB from "./PemasukanDB";

const LaporanPembelian = () => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
      tittle: "Pembelian",
      icon: "bx-receipt",
      component: <ReportGRA />,
    },
    {
      tittle: "Penjualan",
      icon: "bx-receipt",
      component: <SalesReport />,
    },
    {
      tittle: "Saldo Hutang",
      icon: "bx-money",
      component: <ReportHutang />,
    },
    {
      tittle: "Umur Hutang",
      icon: "bx-calendar-x",
      component: <UmurHutang />,
    },
    {
      tittle: "Saldo Piutang",
      icon: "bx-money",
      component: <ReportPiutang />,
    },
    {
      tittle: "Umur Piutang",
      icon: "bx-calendar-x",
      component: <UmurPiutang />,
    },
    {
      tittle: "Jurnal",
      icon: "bx-spreadsheet",
      component: <ReportJurnal />,
    },
    {
      tittle: "Neraca",
      icon: "bx-spreadsheet",
      component: <Neraca />,
    },
    {
      tittle: "Neraca Perbandingan",
      icon: "bx-spreadsheet",
      component: <NeracaPerbandingan />,
    },
    {
      tittle: "Laba Rugi",
      icon: "bx-spreadsheet",
      component: <Pnl />,
    },
    {
      tittle: "Kartu Buku Besar",
      icon: "bx-spreadsheet",
      component: <ReportKBB />,
    },
    {
      tittle: "Kartu Stock",
      icon: "bx-spreadsheet",
      component: <KartuStock />,
    },
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
      tittle: "Pengeluaran Barang DP",
      icon: "bx-spreadsheet",
      component: <PengeluaranBDP />,
    },
    {
      tittle: "Pemasukan Barang DP",
      icon: "bx-spreadsheet",
      component: <PemasukanDB />,
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
