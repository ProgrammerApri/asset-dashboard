import React from "react";
// import Login from "./screen/Login";

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
import Project from "./screen/MasterLainnya/Project/DataProject";
import Bank from "./screen/MasterLainnya/Bank/DataBank";
import JenisPemasok from "./screen/MasterLainnya/JenisPemasok/DataJenisPemasok";
import Salesman from "./screen/MasterLainnya/Salesman/DataSalesman";
import AreaPenjualan from "./screen/Master/AreaPenjualan";
import SubArea from "./screen/Master/SubArea/SubArea";
import Neraca from "./screen/Report/Neraca";
import Perusahaan from "./screen/Setup/Perusahaan";
import Currency from "./screen/Master/Currency";
import Lokasi from "./screen/Master/Lokasi/DataLokasi";
import RulesPay from "./screen/MasterLainnya/RulesPay/DataRulesPay";
import Setup from "./screen/Setup";
import Divisi from "./screen/MasterLainnya/Divisi/Divisi";
import PPN from "./screen/Master/Pajak/DataPajak";
import SetupKhusus from "./screen/Master/SetupKhusus";
import Mitra from "./screen/Mitra/Mitra";
import TransaksiPembelian from "./screen/Transaksi/TransaksiPembelian/TransaksiPembelian";
import GroupProduk from "./screen/Master/GroupProduk";
import Satuan from "./screen/MasterLainnya/Satuan";
import Master from "./screen/Master";
import MasterLainnya from "./screen/MasterLainnya";
import JenisPelanggan from "./screen/Master/JenisPelanggan";
import Pajak from "./screen/Master/Pajak/DataPajak";
import Jasa from "./screen/Master/Jasa/DataJasa";
import PusatBiaya from "./screen/MasterLainnya/PusatBiaya/DataPusatBiaya";
import Transaksi from "./screen/Transaksi";
import BankKas from "./screen/BankKas";
import TransaksiPersediaan from "./screen/TransaksiPersediaan";
import LaporanPembelian from "./screen/Report/LaporanPembelian";
import ReportGRA from "./screen/Report/LaporanPembelian/Gra";
import ReportJurnal from "./screen/Report/Jurnal";
import ReportKBB from "./screen/Report/KartuBB";
import Produksi from "./screen/Produksi";
import DataMesin from "./screen/Produksi/Mesin/DataMesin";

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
    


    // { url: "sub-pelanggan", component: SubCustomer },
    { url: "setup-perkiraan", component: SetupKhusus },
    { url: "satuan", component: Satuan },
    { url: "group-produk", component: GroupProduk },
    { url: "pajak", component: Pajak },
    { url: "jasa", component: Jasa },
    
    { url: "data-mesin", component:DataMesin },
    // Report
    { url: "neraca", component: Neraca },
    { url: "report", component: ReportGRA },

    // Setup
    { url: "setup", component: Setup },

    // Mitra
    { url: "mitra", component: Mitra },

    // Transaksi Pembelian
    { url: "transaksi", component: TransaksiPembelian },

    { url: "produksi", component: Produksi },
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
