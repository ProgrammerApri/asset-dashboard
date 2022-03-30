import React, { Component } from "react";

/// Link
import { Link } from "react-router-dom";

/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";

/// Menu
import MetisMenu from "metismenujs";

///

import 'font-awesome/css/font-awesome.min.css';

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
      const path = window.location.pathname;

      /// Active menu
      let deshBoard = [
            "",
         ],

         app = [
            "app-profile",
            "app-calender",
            "email-compose",
            "email-inbox",
            "email-read",
            "ecom-product-grid",
            "ecom-product-list",
            "ecom-product-list",
            "ecom-product-order",
            "ecom-checkout",
            "ecom-invoice",
            "ecom-customers",
         ],
         charts = [
            "chart-flot",
            "chart-morris",
            "chart-chartjs",
            "chart-chartist",
            "chart-sparkline",
            "chart-peity",
         ],
         bootstrap = [
            "ui-accordion",
            "ui-badge",
            "ui-alert",
            "ui-button",
            "ui-modal",
            "ui-button-group",
            "ui-list-group",
            "ui-media-object",
            "ui-card",
            "ui-carousel",
            "ui-dropdown",
            "ui-popover",
            "ui-progressbar",
            "ui-tab",
            "ui-typography",
            "ui-pagination",
            "ui-grid",
         ],
         plugins = [
            "uc-select2",
            "uc-nestable",
            "uc-sweetalert",
            "uc-toastr",
            "uc-jqvmap",
            "uc-noui-slider",
         ],
         widget = ["widget"],
         forms = [
            "form-element",
            "form-wizard",
            "form-editor-summernote",
            "form-pickers",
            "form-validation-jquery",
         ],
         table = ["table-bootstrap-basic", "table-datatable-basic"];

      return (
         <div className="deznav">
            <PerfectScrollbar className="deznav-scroll">
               <MM className="metismenu" id="menu">
                  <li
                     className={`${
                        deshBoard.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="ai-icon"
                        to=""
                        aria-expanded="false"
                     >
                        <i className="flaticon-381-home"></i>
                        <span className="nav-text">Dashboard</span>
                     </Link>
                  </li>

               
                  
                  <li>
                     <Link
                        className="has-arrow ai-icon"
                        to="#"
                        aria-expanded="false"
                     >
                        <i className="fa fa-book"></i>
                        <span className="nav-text">Master</span>
                     </Link>
                     <ul aria-expanded="false">
                        <li>
                        <Link
                              className="has-arrow"
                              to="#"
                              aria-expanded="false"
                           >
                              GL
                           </Link>
                           <ul aria-expanded="false">
                              <li>
                                 <Link to="/pusat-biaya">Pusat Biaya</Link>
                              </li>
                              <li>
                                 <Link to="/produk">Produk</Link>
                              </li>
                              <li>
                                 <Link to="/perkiraan">Perkiraan</Link>
                              </li>
                              <li>
                                 <Link to="/setup-perkiraan">Setup Perkiraan Khusus</Link>
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
                        <Link
                              className="has-arrow"
                              to="#"
                              aria-expanded="false"
                           >
                              Pembelian
                           </Link>
                           <ul aria-expanded="false">
                              <li>
                                 <Link to="/jenis-pemasok">Jenis Pemasok</Link>
                              </li>
                              <li>
                                 <Link to="/pemasok">Pemasok</Link>
                              </li>
                              <li>
                                 <Link to="/syarat-pembayaran">Syarat Pembayaran</Link>
                              </li>
                           </ul>
                        </li>

                        <li>
                           <Link
                              className="has-arrow"
                              to="#"
                              aria-expanded="false"
                           >
                              Penjualan
                           </Link>
                           <ul aria-expanded="false">
                              <li>
                                 <Link to="/pelanggan">Pelanggan</Link>
                              </li>
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
                           <Link
                              className="has-arrow"
                              to="#"
                              aria-expanded="false"
                           >
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
                     </ul>
                  </li>

                  <li>
                     <Link
                        className="has-arrow ai-icon"
                        to="#"
                        aria-expanded="false"
                     >
                        <i className="fa fa-money"></i>
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
                           <Link
                              className="has-arrow"
                              to="#"
                              aria-expanded="false"
                           >
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
                        <i className="fa fa-money"></i>
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
                        <i className="fa fa-list"></i>
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
                           <Link
                              className="has-arrow"
                              to="#"
                              aria-expanded="false"
                           >
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
                        <i className="fa fa-book"></i>
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
                        <i className="fa fa-bank"></i>
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
                        app.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="has-arrow ai-icon"
                        to="#"
                        aria-expanded="false"
                     >
                        <i className="flaticon-381-television"></i>
                        <span className="nav-text">Apps</span>
                     </Link>
                     <ul aria-expanded="false">
                        <li>
                           <Link to="/app-profile">Profile</Link>
                        </li>
                        <li>
                           <Link
                              className="has-arrow"
                              to="#"
                              aria-expanded="false"
                           >
                              Email
                           </Link>
                           <ul aria-expanded="false">
                              <li>
                                 <Link to="/email-compose">Compose</Link>
                              </li>
                              <li>
                                 <Link to="/email-inbox">Inbox</Link>
                              </li>
                              <li>
                                 <Link to="/email-read">Read</Link>
                              </li>
                           </ul>
                        </li>
                        <li>
                           <Link to="/app-calender">Calendar</Link>
                        </li>
                        <li>
                           <Link
                              className="has-arrow"
                              to="#"
                              aria-expanded="false"
                           >
                              Shop
                           </Link>
                           <ul aria-expanded="false">
                              <li>
                                 <Link to="/ecom-product-grid">
                                    Product Grid
                                 </Link>
                              </li>
                              <li>
                                 <Link to="/ecom-product-list">
                                    Product List
                                 </Link>
                              </li>
                              <li>
                                 <Link to="/ecom-product-detail">
                                    Product Details
                                 </Link>
                              </li>
                              <li>
                                 <Link to="/ecom-product-order">Order</Link>
                              </li>
                              <li>
                                 <Link to="/ecom-checkout">Checkout</Link>
                              </li>
                              <li>
                                 <Link to="/ecom-invoice">Invoice</Link>
                              </li>
                              <li>
                                 <Link to="/ecom-customers">Customers</Link>
                              </li>
                           </ul>
                        </li>
                     </ul>
                  </li>

                  <li
                     className={`${
                        charts.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="has-arrow ai-icon"
                        to="#"
                        aria-expanded="false"
                     >
                        <i className="flaticon-381-controls-3"></i>
                        <span className="nav-text">Charts</span>
                     </Link>
                     <ul aria-expanded="false">
                        <li>
                           <Link to="/chart-rechart">RechartJs</Link>
                        </li>
                        <li>
                           <Link to="/chart-chartjs">Chartjs</Link>
                        </li>
                        <li>
                           <Link to="/chart-chartist">Chartist</Link>
                        </li>
                        <li>
                           <Link to="/chart-sparkline">Sparkline</Link>
                        </li>
                        <li>
                           <Link to="/chart-apexchart">Apexchart</Link>
                        </li>
                     </ul>
                  </li>

                  <li
                     className={`${
                        bootstrap.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="has-arrow ai-icon"
                        to="#"
                        aria-expanded="false"
                     >
                        <i className="flaticon-381-internet"></i>
                        <span className="nav-text">Bootstrap</span>
                     </Link>
                     <ul aria-expanded="false">
                        <li>
                           <Link to="/ui-accordion">Accordion</Link>
                        </li>
                        <li>
                           <Link to="/ui-alert">Alert</Link>
                        </li>
                        <li>
                           <Link to="/ui-badge">Badge</Link>
                        </li>
                        <li>
                           <Link to="/ui-button">Button</Link>
                        </li>
                        <li>
                           <Link to="/ui-modal">Modal</Link>
                        </li>
                        <li>
                           <Link to="/ui-button-group">Button Group</Link>
                        </li>
                        <li>
                           <Link to="/ui-list-group">List Group</Link>
                        </li>
                        <li>
                           <Link to="/ui-media-object">Media Object</Link>
                        </li>
                        <li>
                           <Link to="/ui-card">Cards</Link>
                        </li>
                        <li>
                           <Link to="/ui-carousel">Carousel</Link>
                        </li>
                        <li>
                           <Link to="/ui-dropdown">Dropdown</Link>
                        </li>
                        <li>
                           <Link to="/ui-popover">Popover</Link>
                        </li>
                        <li>
                           <Link to="/ui-progressbar">Progressbar</Link>
                        </li>
                        <li>
                           <Link to="/ui-tab">Tab</Link>
                        </li>
                        <li>
                           <Link to="/ui-typography">Typography</Link>
                        </li>
                        <li>
                           <Link to="/ui-pagination">Pagination</Link>
                        </li>
                        <li>
                           <Link to="/ui-grid">Grid</Link>
                        </li>
                     </ul>
                  </li>

                  <li
                     className={`${
                        plugins.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="has-arrow ai-icon"
                        to="#"
                        aria-expanded="false"
                     >
                        <i className="flaticon-381-heart"></i>
                        <span className="nav-text">Plugins</span>
                     </Link>
                     <ul aria-expanded="false">
                        <li>
                           <Link to="/uc-select2">Select 2</Link>
                        </li>
                        <li>
                           <Link to="/uc-nestable">Nestedable</Link>
                        </li>
                        <li>
                           <Link to="/uc-noui-slider">Noui Slider</Link>
                        </li>
                        <li>
                           <Link to="/uc-sweetalert">Sweet Alert</Link>
                        </li>
                        <li>
                           <Link to="/uc-toastr">Toastr</Link>
                        </li>
                        <li>
                           <Link to="/map-jqvmap">Jqv Map</Link>
                        </li>
                     </ul>
                  </li>

                  <li
                     className={`${
                        widget.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        to="widget-basic"
                        className="ai-icon"
                        aria-expanded="false"
                     >
                        <i className="flaticon-381-settings-2"></i>
                        <span className="nav-text">Widget</span>
                     </Link>
                  </li>

                  <li
                     className={`${
                        forms.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="has-arrow ai-icon"
                        to="#"
                        aria-expanded="false"
                     >
                        <i className="flaticon-381-notepad"></i>
                        <span className="nav-text forms">Forms</span>
                     </Link>
                     <ul aria-expanded="false">
                        <li>
                           <Link to="/form-element">Form Elements</Link>
                        </li>
                        <li>
                           <Link to="/form-wizard">Wizard</Link>
                        </li>
                        <li>
                           <Link to="/form-editor-summernote">Summernote</Link>
                        </li>
                        <li>
                           <Link to="form-pickers">Pickers</Link>
                        </li>
                        <li>
                           <Link to="form-validation-jquery">
                              Jquery Validate
                           </Link>
                        </li>
                     </ul>
                  </li>

                  <li
                     className={`${
                        table.includes(path.slice(1)) ? "mm-active" : ""
                     }`}
                  >
                     <Link
                        className="has-arrow ai-icon"
                        to="#"
                        aria-expanded="false"
                     >
                        <i className="flaticon-381-network"></i>
                        <span className="nav-text">Table</span>
                     </Link>
                     <ul aria-expanded="false">
                        <li>
                           <Link to="table-bootstrap-basic">Bootstrap</Link>
                        </li>
                        <li>
                           <Link to="table-datatable-basic">Datatable</Link>
                        </li>
                     </ul>
                  </li>
                  
                  <li>
                     <Link
                        className="has-arrow ai-icon"
                        to="#"
                        aria-expanded="false"
                     >
                        <i className="flaticon-381-layer-1"></i>
                        <span className="nav-text">Pages</span>
                     </Link>
                     <ul aria-expanded="false">
                        <li>
                           <Link to="/page-register">Register</Link>
                        </li>
                        <li>
                           <Link to="/page-login">Login</Link>
                        </li>
                        <li>
                           <Link
                              className="has-arrow"
                              to="#"
                              aria-expanded="false"
                           >
                              Error
                           </Link>
                           <ul aria-expanded="false">
                              <li>
                                 <Link to="/page-error-400">Error 400</Link>
                              </li>
                              <li>
                                 <Link to="/page-error-403">Error 403</Link>
                              </li>
                              <li>
                                 <Link to="/page-error-404">Error 404</Link>
                              </li>
                              <li>
                                 <Link to="/page-error-500">Error 500</Link>
                              </li>
                              <li>
                                 <Link to="/page-error-503">Error 503</Link>
                              </li>
                           </ul>
                        </li>
                        <li>
                           <Link to="/page-lock-screen">Lock Screen</Link>
                        </li>
                     </ul>
                  </li>
               </MM>

               <div className="copyright">
                  <p>
                     <strong>itungin.id Dashboard</strong> ©All Rights Reserved
                  </p>
               </div>
            </PerfectScrollbar>
         </div>
      );
   }
}

export default SideBar;
