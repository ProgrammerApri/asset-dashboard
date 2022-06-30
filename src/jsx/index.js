import React from "react";
// import Login from "./components/Login";

/// React router dom
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  HashRouter,
} from "react-router-dom";

/// Css
import "./index.css";
import "./chart.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";

/// Deshboard
import Home from "./screen/Dashboard/Home";

/// Klasifikasi
import KlasifikasiAkun from "./screen/Master/KlasifikasiAkun";

import Login from "./Login";
import { withResizeDetector } from "react-resize-detector";
import KategoriAkun from "./screen/Master/KategoriAkun";
import Akun from "./screen/Master/Akun/DataAkun";
import Project from "./components/MasterLainnya/Project/DataProject";
import Bank from "./components/MasterLainnya/Bank/DataBank";
import JenisPemasok from "./components/MasterLainnya/JenisPemasok/DataJenisPemasok";
import Salesman from "./components/MasterLainnya/Salesman/DataSalesman";
import AreaPenjualan from "./screen/Master/AreaPenjualan";
import SubArea from "./screen/Master/SubArea/SubArea";
import Neraca from "./components/Report/Neraca";
import Perusahaan from "./components/Setup/Perusahaan";
import Currency from "./screen/Master/Currency";
import Lokasi from "./screen/Master/Lokasi/DataLokasi";
import RulesPay from "./components/MasterLainnya/RulesPay/DataRulesPay";
import Setup from "./components/Setup";
import Divisi from "./components/MasterLainnya/Divisi/Divisi";
import PPN from "./screen/Master/Pajak/DataPajak";
import SubCustomer from "./screen/Master/SubCustomer";
import SetupKhusus from "./screen/Master/SetupKhusus";
import Mitra from "./components/Mitra/Mitra";
import TransaksiPembelian from "./components/Transaksi/TransaksiPembelian/TransaksiPembelian";
import GroupProduk from "./screen/Master/GroupProduk";
import Satuan from "./components/MasterLainnya/Satuan";
import Master from "./screen/Master";
import MasterLainnya from "./components/MasterLainnya";
import JenisPelanggan from "./screen/Master/JenisPelanggan";
import Pajak from "./screen/Master/Pajak/DataPajak";
import Jasa from "./screen/Master/Jasa/DataJasa";
import PusatBiaya from "./components/MasterLainnya/PusatBiaya/DataPusatBiaya";
import Transaksi from "./components/Transaksi";
import BankKas from "./screen/BankKas";
import TransaksiPersediaan from "./components/TransaksiPersediaan";
import LaporanPembelian from "./components/Report/LaporanPembelian";
import ReportGRA from "./components/Report/LaporanPembelian/Gra";
import ReportJurnal from "./components/Report/Jurnal";
import ReportKBB from "./components/Report/KartuBB";

const Markup = ({ width }) => {
  const routes = [
    /// Deshborad
    { url: "", component: Home },

    // Login
    { url: "login", component: Login },

    { url: "master", component: Master },
    { url: "master-lainnya", component: MasterLainnya },
    { url: "transaksi", component: Transaksi },
    { url: "bank-&-kas", component: BankKas },
    { url: "transaksi-persediaan", component: TransaksiPersediaan },
    { url: "laporan", component: LaporanPembelian },
    { url: "jurnal", component: ReportJurnal },
    { url: "kartu-buku-besar", component: ReportKBB },

    /// Klasifikasi
    { url: "klasifikasi", component: KlasifikasiAkun },
    { url: "kategori", component: KategoriAkun },
    { url: "akun", component: Akun },
    { url: "pusat-biaya", component: PusatBiaya },
    { url: "project", component: Project },
    { url: "bank", component: Bank },
    { url: "jenis-pelanggan", component: JenisPelanggan },
    { url: "jenis-pemasok", component: JenisPemasok },
    { url: "salesman", component: Salesman },
    { url: "area-penjualan", component: AreaPenjualan },
    { url: "sub-area", component: SubArea },
    { url: "currency", component: Currency },
    { url: "lokasi", component: Lokasi },
    { url: "syarat-pembayaran", component: RulesPay },
    { url: "divisi", component: Divisi },
    { url: "non-stok", component: PPN },
    { url: "sub-pelanggan", component: SubCustomer },
    { url: "setup-perkiraan", component: SetupKhusus },
    { url: "satuan", component: Satuan },
    { url: "group-produk", component: GroupProduk },
    { url: "pajak", component: Pajak },
    { url: "jasa", component: Jasa },


    // Report
    { url: "neraca", component: Neraca },
    { url: "report", component: ReportGRA },

    // Setup
    { url: "setup", component: Setup },

    // Mitra
    { url: "mitra", component: Mitra },

    // Transaksi Pembelian
    { url: "transaksi", component: TransaksiPembelian },
  ];

  const body = document.querySelector("body");

  width >= 1300
    ? body.setAttribute("data-sidebar-style", "full")
    : width <= 1299 && width >= 767
    ? body.setAttribute("data-sidebar-style", "mini")
    : body.setAttribute("data-sidebar-style", "overlay");

  return (
    <Router>
      <div id="main-wrapper" className="show">
        <Nav />

        <div className="content-body">
          <div className="container-fluid">
            <HashRouter basename="/">
              <Switch>
                {routes.map((data, i) => (
                  <Route
                    key={i}
                    exact
                    path={`/${data.url}`}
                    component={data.component}
                  />
                ))}
              </Switch>
            </HashRouter>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default withResizeDetector(Markup);
