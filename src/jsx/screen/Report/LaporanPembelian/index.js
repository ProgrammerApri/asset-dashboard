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
import ReportRP from "./RequestPurchase";
import ReportPO from "./PurchaseOrder";
import { Link } from "react-router-dom";
import ReportHutangRingkasan from "./HutangRingkasan";
import ReportPiutangRingkasan from "./PiutangRingkasan";
import OutstandingPO from "./OutstandingPO";
import OutstandingRP from "./OutstandingRP";
import UmurHutangRingkasan from "./UmurHutangRingkasan";
import UmurPiutangRingkasan from "./UmurPiutangRingkasan";

const LaporanPembelian = (self) => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
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
      tittle: "Pembelian",
      icon: "bx-receipt",
      component: <ReportGRA />,
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
      tittle: "Penjualan",
      icon: "bx-receipt",
      component: <SalesReport />,
    },
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
        <Link to={"/laporan/" + el.tittle.toLowerCase().replaceAll(" ", "-")}>
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
