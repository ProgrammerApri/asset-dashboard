import React, { Component } from "react";

/// Link
import { HashRouter, Link } from "react-router-dom";

/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";

/// Menu
import MetisMenu from "metismenujs";

///

import "font-awesome/css/font-awesome.min.css";

class MM extends Component {
  componentDidMount() {
    this.$el = this.el;
    this.mm = new MetisMenu(this.$el);
  }
  componentWillUnmount() {
    this.mm("dispose");
  }
  render() {
    return (
      <div className="mm-wrapper">
        <ul className="metismenu" ref={(el) => (this.el = el)}>
          {this.props.children}
        </ul>
      </div>
    );
  }
}

class SideBar extends Component {
  /// Open menu
  componentDidMount() {
    // sidebar open/close
    var btn = document.querySelector(".nav-control");
    var aaa = document.querySelector("#main-wrapper");

    function toggleFunc() {
      return aaa.classList.toggle("menu-toggle");
    }

    btn.addEventListener("click", toggleFunc);
  }
  render() {
    /// Path
    const path = window.location.href;
    const origin = window.location.origin;
    const patern = origin + "/#/";

    /// Active menu
    let deshBoard = [""];
    let setup = ["setup"];
    let master = [
      "klasifikasi",
      "kategori",
      "akun",
      "pusat-biaya",
      "project",
      "curenncy",
      "bank",
      "syarat-pembayaran",
      "salesman",
      "jenis-pelanggan",
      "jenis-pemasok",
      "area-penjualan",
      "sub-area",
      "lokasi",
      "satuan",
    ];
    let report = ["neraca"];
    let mitra = ["mitra"];
    let transaksi = ["transaksi"];

    return (
      <HashRouter basename="/">
        <div className="deznav">
          <PerfectScrollbar className="deznav-scroll">
            <MM className="metismenu" id="menu">
              <li
                className={`${
                  deshBoard.includes(path.replace(patern, ""))
                    ? "mm-active"
                    : ""
                }`}
              >
                <Link className="ai-icon" to="" aria-expanded="false">
                  <i class="bx bxs-dashboard"></i>
                  <span className="nav-text">Dashboard</span>
                </Link>
              </li>

              <li
                className={`${
                  master.includes(path.replace(patern, "")) ? "mm-active" : ""
                }`}
              >
                <Link
                  className="has-arrow ai-icon"
                  to="#"
                  aria-expanded="false"
                >
                  <i class="bx bxs-data"></i>
                  <span className="nav-text">Master</span>
                </Link>
                <ul aria-expanded="false">
                  <li>
                    <Link className="has-arrow" to="#" aria-expanded="false">
                      GL
                    </Link>
                    <ul aria-expanded="false">
                      <li>
                        <Link to="/pusat-biaya">Pusat Biaya</Link>
                      </li>
                      <li>
                        <Link to="/project">Project</Link>
                      </li>
                      <li>
                        <Link to="/perkiraan">Perkiraan</Link>
                      </li>
                      <li>
                        <Link to="/setup-perkiraan">
                          Setup Perkiraan Khusus
                        </Link>
                      </li>
                      <li>
                        <Link to="/currency">Currency</Link>
                      </li>
                      <li>
                        <Link to="/bank">Bank</Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link className="has-arrow" to="#" aria-expanded="false">
                      Pembelian
                    </Link>
                    <ul aria-expanded="false">
                      <li>
                        <Link to="/jenis-pemasok">Jenis Pemasok</Link>
                      </li>
                      <li>{/* <Link to="/pemasok">Pemasok</Link> */}</li>
                      <li>
                        <Link to="/syarat-pembayaran">Syarat Pembayaran</Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link className="has-arrow" to="#" aria-expanded="false">
                      Penjualan
                    </Link>
                    <ul aria-expanded="false">
                      <li>{/* <Link to="/pelanggan">Pelanggan</Link> */}</li>
                      <li>
                        <Link to="/area-penjualan">Area Penjualan</Link>
                      </li>
                      <li>
                        <Link to="/sub-area">Sub Area Penjualan</Link>
                      </li>
                      <li>
                        <Link to="/salesman">Salesman</Link>
                      </li>
                      <li>
                        <Link to="/jenis-pelanggan">Jenis Pelanggan</Link>
                      </li>
                      <li>
                        <Link to="/sub-pelanggan">Sub Pelanggan</Link>
                      </li>
                      <li>
                        <Link to="/diskon">Diskon</Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link className="has-arrow" to="#" aria-expanded="false">
                      Barang
                    </Link>
                    <ul aria-expanded="false">
                      <li>
                        <Link to="/lokasi">Lokasi</Link>
                      </li>
                      <li>
                        <Link to="/grup-barang">Grup Barang</Link>
                      </li>
                      <li>
                        <Link to="/barang">Barang</Link>
                      </li>
                      <li>
                        <Link to="/non-stok">Non Stock</Link>
                      </li>
                      <li>
                        <Link to="/satuan">Satuan</Link>
                      </li>
                      <li>
                        <Link to="/divisi">Divisi</Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link to="/klasifikasi">Klasifikasi Akun</Link>
                  </li>
                  <li>
                    <Link to="/kategori">Kategori Akun</Link>
                  </li>
                  <li>
                    <Link to="/akun">Akun</Link>
                  </li>
                </ul>
              </li>

              <li
                className={`${
                  mitra.includes(path.replace(patern, "")) ? "mm-active" : ""
                }`}
              >
                <Link className="ai-icon" to="/mitra" aria-expanded="false">
                  <i class="bx bxs-group"></i>
                  <span className="nav-text">Mitra</span>
                </Link>
              </li>

              <li
                className={`${
                  transaksi.includes(path.replace(patern, "")) ? "mm-active" : ""
                }`}
              >
                <Link className="ai-icon" to="/transaksi" aria-expanded="false">
                  <i class="bx bxs-badge-dollar"></i>
                  <span className="nav-text">Transaksi Pembelian</span>
                </Link>
              </li>

              <li>
                <Link
                  className="has-arrow ai-icon"
                  to="#"
                  aria-expanded="false"
                >
                  <i class="bx bxs-shopping-bags"></i>
                  <span className="nav-text">Pembelian</span>
                </Link>
                <ul aria-expanded="false">
                  <li>
                    <Link to="/permintaan">Permintaan Pembelian (RP)</Link>
                  </li>
                  <li>
                    <Link to="/pesanan">Pesanan Pembelian (PO)</Link>
                  </li>
                  <li>
                    <Link className="has-arrow" to="#" aria-expanded="false">
                      Faktur Pembelian (GRA)
                    </Link>
                    <ul aria-expanded="false">
                      <li>
                        <Link to="/po">Berdasarkan PO</Link>
                      </li>
                      <li>
                        <Link to="/non-pesanan">Non Pemesanan</Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link to="/retur">Retur Pembelian</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link
                  className="has-arrow ai-icon"
                  to="#"
                  aria-expanded="false"
                >
                  <i class="bx bx-money"></i>
                  <span className="nav-text">Penjualan</span>
                </Link>
                <ul aria-expanded="false">
                  <li>
                    <Link to="/pesanan-penjualan">Pesanan Penjualan</Link>
                  </li>
                  <li>
                    <Link to="/faktur-penjualan">Faktur Penjualan</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link
                  className="has-arrow ai-icon"
                  to="#"
                  aria-expanded="false"
                >
                  <i class="bx bxs-box"></i>
                  <span className="nav-text">Barang</span>
                </Link>
                <ul aria-expanded="false">
                  <li>
                    <Link to="/stock">Stock Opname</Link>
                  </li>
                  <li>
                    <Link to="/pemakaian">Pemakaian Bahan</Link>
                  </li>
                  <li>
                    <Link to="/koreksi-persediaan">Koreksi Persediaan</Link>
                  </li>
                  <li>
                    <Link to="/hasil-jadi">Hasil Jadi</Link>
                  </li>
                  <li>
                    <Link className="has-arrow" to="#" aria-expanded="false">
                      Mutasi Antar Lokasi
                    </Link>
                    <ul aria-expanded="false">
                      <li>
                        <Link to="/mutasi-keluar">Mutasi Keluar</Link>
                      </li>
                      <li>
                        <Link to="/mutasi-masuk">Mutasi Masuk</Link>
                      </li>
                      <li>
                        <Link to="/surat-jalan">Surat Jalan</Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link to="/cek-kartu">Cek Kartu Stock</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link
                  className="has-arrow ai-icon"
                  to="#"
                  aria-expanded="false"
                >
                  <i class="bx bxs-layer"></i>
                  <span className="nav-text">General Ledger</span>
                </Link>
                <ul aria-expanded="false">
                  <li>
                    <Link to="/posting">Posting</Link>
                  </li>
                  <li>
                    <Link to="/memorial">Memorial</Link>
                  </li>
                  <li>
                    <Link to="/jurnal">Jurnal Transksi</Link>
                  </li>
                  <li>
                    <Link to="/pab">PAB</Link>
                  </li>
                  <li>
                    <Link to="/pat">PAT</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link
                  className="has-arrow ai-icon"
                  to="#"
                  aria-expanded="false"
                >
                  <i class="bx bxs-bank"></i>
                  <span className="nav-text">Kas & Bank</span>
                </Link>
                <ul aria-expanded="false">
                  <li>
                    <Link to="/out">Out</Link>
                  </li>
                  <li>
                    <Link to="/in">In</Link>
                  </li>
                </ul>
              </li>
              <li
                className={`${
                  report.includes(path.replace(patern, "")) ? "mm-active" : ""
                }`}
              >
                <Link
                  className="has-arrow ai-icon"
                  to="#"
                  aria-expanded="false"
                >
                  <i class="bx bxs-report"></i>
                  <span className="nav-text">Laporan</span>
                </Link>
                <ul aria-expanded="false">
                  <li>
                    <Link to="/neraca">Neraca</Link>
                  </li>
                </ul>
              </li>
              <li
                className={`${
                  setup.includes(path.replace(patern, "")) ? "mm-active" : ""
                }`}
              >
                <Link className="ai-icon" to="/setup" aria-expanded="false">
                  <i class="bx bxs-buildings"></i>
                  <span className="nav-text">Setup</span>
                </Link>
              </li>
            </MM>

            <div className="copyright">
              <p>
                <strong>itungin.id Dashboard</strong> ©All Rights Reserved
              </p>
            </div>
          </PerfectScrollbar>
        </div>
      </HashRouter>
    );
  }
}

export default SideBar;
