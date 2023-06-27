import React, { Suspense, useEffect, useState } from "react";
// import Login from "./screen/Login";

/// React router dom
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  HashRouter,
} from "react-router-dom";
import { withResizeDetector } from "react-resize-detector";
import { endpoints, request } from "src/utils";
import { useDispatch } from "react-redux";
import { SET_CURRENT_PROFILE } from "src/redux/actions";
import { ProgressBar } from "primereact/progressbar";
import { ProgressSpinner } from "primereact/progressspinner";

/// Css
import "./index.css";
import "./chart.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
import ProduksiInv from "./screen/ProduksiInv";

/// Deshboard
const Home = React.lazy(() => import("./screen/Dashboard/Home"));
const KlasifikasiAkun = React.lazy(() =>
  import("./screen/Master/KlasifikasiAkun")
);
const Login = React.lazy(() => import("./Login"));
const KategoriAkun = React.lazy(() => import("./screen/Master/KategoriAkun"));
const Akun = React.lazy(() => import("./screen/Master/Akun/DataAkun"));
const Project = React.lazy(() =>
  import("./screen/MasterLainnya/Project/DataProject")
);
const Bank = React.lazy(() => import("./screen/MasterLainnya/Bank/DataBank"));
const JenisPemasok = React.lazy(() =>
  import("./screen/MasterLainnya/JenisPemasok/DataJenisPemasok")
);
const Salesman = React.lazy(() =>
  import("./screen/MasterLainnya/Salesman/DataSalesman")
);
const AreaPenjualan = React.lazy(() => import("./screen/Master/AreaPenjualan"));
const SubArea = React.lazy(() => import("./screen/Master/SubArea/SubArea"));
const Currency = React.lazy(() => import("./screen/Master/Currency"));
const Lokasi = React.lazy(() => import("./screen/Master/Lokasi/DataLokasi"));
const RulesPay = React.lazy(() =>
  import("./screen/MasterLainnya/RulesPay/DataRulesPay")
);
const Setup = React.lazy(() => import("./screen/Setup"));
const Divisi = React.lazy(() => import("./screen/MasterLainnya/Divisi/Divisi"));
const PPN = React.lazy(() => import("./screen/Master/Pajak/DataPajak"));
const SetupKhusus = React.lazy(() => import("./screen/Master/SetupKhusus"));
const Mitra = React.lazy(() => import("./screen/Mitra/Mitra"));
const TransaksiPembelian = React.lazy(() =>
  import("./screen/Transaksi/TransaksiPembelian/TransaksiPembelian")
);
const Budgeting = React.lazy(() => import("./screen/Budgeting/Budget"));

const GroupProduk = React.lazy(() => import("./screen/Master/GroupProduk"));
const Satuan = React.lazy(() => import("./screen/MasterLainnya/Satuan"));
const Master = React.lazy(() => import("./screen/Master"));
const MasterLainnya = React.lazy(() => import("./screen/MasterLainnya"));
const JenisPelanggan = React.lazy(() =>
  import("./screen/Master/JenisPelanggan")
);
const Pajak = React.lazy(() => import("./screen/Master/Pajak/DataPajak"));
const Jasa = React.lazy(() => import("./screen/Master/Jasa/DataJasa"));
const PusatBiaya = React.lazy(() =>
  import("./screen/MasterLainnya/PusatBiaya/DataPusatBiaya")
);
const Transaksi = React.lazy(() => import("./screen/Transaksi"));
const BankKas = React.lazy(() => import("./screen/BankKas"));
const TransaksiPersediaan = React.lazy(() =>
  import("./screen/TransaksiPersediaan")
);
const LaporanPembelian = React.lazy(() =>
  import("./screen/Report/LaporanPembelian")
);
const ReportGRA = React.lazy(() =>
  import("./screen/Report/LaporanPembelian/Gra")
);
const Produksi = React.lazy(() => import("./screen/Produksi"));
const DataMesin = React.lazy(() => import("./screen/Produksi/Mesin/DataMesin"));
const GroupReport = React.lazy(() => import("./screen/Report"));
const LaporanPenjualan = React.lazy(() =>
  import("./screen/Report/LaporanPenjualan")
);
const LaporanProduksi = React.lazy(() =>
  import("./screen/Report/LaporanProduksi")
);
const LaporanAr = React.lazy(() => import("./screen/Report/AR"));
const LaporanAp = React.lazy(() => import("./screen/Report/AP"));
const LaporanNeraca = React.lazy(() => import("./screen/Report/Neraca"));
const Persediaan = React.lazy(() =>
  import("./screen/Transaksi/Persediaan/Persediaan")
);
const LaporanPersediaan = React.lazy(() =>
  import("./screen/Report/LaporanPersediaan")
);
const SaldoAwal = React.lazy(() => import("./screen/SaldoAwal"));
const Posting = React.lazy(() => import("./screen/Posting/PostingGl"));
const SaldoAkhir = React.lazy(() =>
  import("./screen/Transaksi/SaldoAkhir/SaldoAkhir")
);

const Markup = ({ width }) => {
  const routes = [
    /// Deshborad
    { url: "", component: Home },

    // Login
    { url: "login", component: Login },

    { url: "master", component: Master },
    { url: "master/:active", component: Master },
    { url: "master-lainnya", component: MasterLainnya },
    { url: "master-lainnya/:active", component: MasterLainnya },
    { url: "transaksi", component: Transaksi },
    { url: "transaksi/:active", component: Transaksi },
    { url: "bank-&-kas", component: BankKas },
    { url: "transaksi-persediaan", component: TransaksiPersediaan },

    { url: "laporan/pembelian", component: LaporanPembelian },
    { url: "laporan/pembelian/:active", component: LaporanPembelian },
    { url: "laporan/penjualan", component: LaporanPenjualan },
    { url: "laporan/penjualan/:active", component: LaporanPenjualan },
    { url: "laporan/produksi", component: LaporanProduksi },
    { url: "laporan/produksi/:active", component: LaporanProduksi },
    { url: "laporan/ar", component: LaporanAr },
    { url: "laporan/ar/:active", component: LaporanAr },
    { url: "laporan/ap", component: LaporanAp },
    { url: "laporan/ap/:active", component: LaporanAp },
    { url: "laporan/gl", component: LaporanNeraca },
    { url: "laporan/gl/:active", component: LaporanNeraca },
    { url: "laporan/persediaan", component: LaporanPersediaan },
    { url: "laporan/persediaan/:active", component: LaporanPersediaan },
    { url: "laporan", component: GroupReport },

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

    { url: "data-mesin", component: DataMesin },

    // Setup
    { url: "setup", component: Setup },

    // Mitra
    { url: "mitra", component: Mitra },

    // Transaksi Pembelian
    { url: "transaksi", component: TransaksiPembelian },

    { url: "produksi", component: Produksi },

    { url: "direct-produksi", component: ProduksiInv },
    { url: "direct-produksi/:active", component: ProduksiInv },

    { url: "saldo-awal", component: SaldoAwal },
    { url: "saldo-awal/:active", component: SaldoAwal },

    { url: "budget", component: Budgeting },
    { url: "budget/:active", component: Budgeting },

    { url: "saldo-akhir", component: SaldoAkhir },
    { url: "saldo-akhir/:active", component: SaldoAkhir },

    { url: "posting", component: Posting },
    { url: "posting/:active", component: Posting },
  ];

  const body = document.querySelector("body");

  width >= 1300
    ? body.setAttribute("data-sidebar-style", "full")
    : width <= 1299 && width >= 767
    ? body.setAttribute("data-sidebar-style", "mini")
    : body.setAttribute("data-sidebar-style", "overlay");

  
  const interfaceType = "normal"

  body.setAttribute("data-interface-type", interfaceType)


  const [comp, setComp] = useState(null);

  useEffect(() => {
    // getProfile();
    getAccess();
  }, []);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  // const getProfile = async () => {
  //   const config = {
  //     ...endpoints.getProfile,
  //     data: {},
  //   };
  //   let response = null;
  //   try {
  //     response = await request(null, config);
  //     if (response.status) {
  //       const { data } = response;
  //       dispatch({ type: SET_CURRENT_PROFILE, payload: data });
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };

  const getComp = async () => {
    const config = {
      ...endpoints.getCompany,
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        const { data } = response;
        setComp(data);
        getAccess();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getAccess = async () => {
    const config = {
      ...endpoints.getAccess,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        const { data } = response;
        dispatch({ type: SET_CURRENT_PROFILE, payload: data });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return loading ? (
    <ProgressBar mode="indeterminate" style={{ height: "6px" }} />
  ) : (
    <Router>
      <div id="main-wrapper" className="show">
        {interfaceType !== 'frame' ? <Nav /> :<></>}

        <div className="content-body">
          <div className="container-fluid">
            <Suspense
              fallback={
                <div
                  className="flex align-items-center"
                  style={{ height: "50rem" }}
                >
                  <ProgressSpinner
                    style={{ width: "50px", height: "50px" }}
                    strokeWidth="8"
                    fill="var(--surface-ground)"
                    animationDuration=".5s"
                  />
                </div>
              }
            >
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
            </Suspense>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default withResizeDetector(Markup);
