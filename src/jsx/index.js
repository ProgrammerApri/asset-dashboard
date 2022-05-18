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
import Home from "./components/Dashboard/Home";

/// Klasifikasi
import KlasifikasiAkun from "./components/Master/KlasifikasiAkun";

import Login from "./Login";
import { withResizeDetector } from "react-resize-detector";
import KategoriAkun from "./components/Master/KategoriAkun";
import Akun from "./components/Master/Akun";
import Project from "./components/Master/Project";
import Bank from "./components/Master/Bank";
import JenisPemasok from "./components/Master/JenisPemasok";
import Salesman from "./components/Master/Salesman";
import AreaPenjualan from "./components/Master/AreaPenjualan";
import SubArea from "./components/Master/SubArea";
import Neraca from "./components/Report/Neraca";
import Perusahaan from "./components/Setup/Perusahaan";
import Currency from "./components/Master/Currency";
import Lokasi from "./components/Master/Lokasi";
import RulesPay from "./components/Master/RulesPay";
import Setup from "./components/Setup";
import Divisi from "./components/Master/Divisi";
import PPN from "./components/Master/Pajak";
import SubCustomer from "./components/Master/SubCustomer";
import SetupKhusus from "./components/Master/SetupKhusus";
import Mitra from "./components/Mitra/Mitra";
import TransaksiPembelian from "./components/TransaksiPembelian/TransaksiPembelian";
import Produk from "./components/Master/Produk";
import GroupProduk from "./components/Master/GroupProduk";
import Satuan from "./components/Satuan";
import Master from "./components/Master";
import MasterLainnya from "./components/MasterLainnya";
import JenisPelanggan from "./components/Master/JenisPelanggan";
import Pajak from "./components/Master/Pajak";
import Jasa from "./components/Master/Jasa";
import PusatBiaya from "./components/MasterLainnya/PusatBiaya/DataPusatBiaya";

const Markup = ({ width }) => {
  const routes = [
    /// Deshborad
    { url: "", component: Home },

    // Login
    { url: "login", component: Login },

    { url: "master", component: Master },
    { url: "master-lainnya", component: MasterLainnya },
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
    { url: "produk", component: Produk },
    { url: "group-produk", component: GroupProduk },
    { url: "pajak", component: Pajak },
    { url: "jasa", component: Jasa },


    // Report
    { url: "neraca", component: Neraca },

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
