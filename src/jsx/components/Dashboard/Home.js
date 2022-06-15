import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// import { Chart } from 'primereact/chart';

import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import menu03 from "../../../images/menus/3.png";
import menu02 from "../../../images/menus/2.png";
import menu01 from "../../../images/menus/1.png";

import testimonial from "../../../images/testimonial/1.jpg";
import testimonial2 from "../../../images/testimonial/2.jpg";
import testimonial3 from "../../../images/testimonial/3.jpg";

import { Dropdown, Tab, Nav, Button } from "react-bootstrap";
import CircleProgress from "../CircleProgress/circleProgress";

import ApexRadialBar from "../charts/apexcharts/RadialBar";
import ProductionStat from "../charts/apexcharts/Line4";
import { useDispatch, useSelector } from "react-redux";
import { endpoints, request } from "src/utils";
import { SET_DASHBOARD_DATA } from "src/redux/actions";

// import Ext from "../../layouts/Ext";

const ApexLine4 = loadable(() =>
  pMinDelay(import("../charts/apexcharts/Line4"), 500)
);
const ApexNagetivePosative = loadable(() =>
  pMinDelay(import("../charts/apexcharts/NagetivePositive2"), 500)
);

const Home = () => {
  const dispatch = useDispatch();
  const dash = useSelector((state) => state.dash.dashboard);

  useEffect(() => {
    getDashboardInfo();
  }, []);

  const getDashboardInfo = async () => {
    const config = {
      ...endpoints.dashboard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        dispatch({
          type: SET_DASHBOARD_DATA,
          payload: data,
        });
      }
    } catch (error) {}
  };

  function SampleNextArrow(props) {
    const { onClick } = props;
    return (
      <div className="owl-next" onClick={onClick} style={{ zIndex: 99 }}>
        <i className="fa fa-caret-right" />
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
      <div
        className="owl-prev disabled"
        onClick={onClick}
        style={{ zIndex: 99 }}
      >
        <i className="fa fa-caret-left" />
      </div>
    );
  }

  const settings = {
    focusOnSelect: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1599,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  return (
    <>
      <div className="row">
        <div className="col-xl col-md-6 col-sm-6">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="fs-160 text-black font-w600 mb-0">{dash.out_pur}</h2>
              <span className="fs-14">Outstanding Purchase</span>
            </div>
          </div>
        </div>
        <div className="col-xl col-md-6 col-sm-6">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="fs-24 text-black font-w600 mb-0">Rp. {formatIdr(dash.ap)}</h2>
              <span className="fs-14">Account Payable</span>
            </div>
          </div>
        </div>

        <div className="col-xl col-md-6 col-sm-6">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="fs-24 text-black font-w600 mb-0">{dash.out_sls}</h2>
              <span className="fs-14">Outstanding Sales</span>
            </div>
          </div>
        </div>

        <div className="col-xl col-md-6 col-sm-6">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="fs-24 text-black font-w600 mb-0">Rp. {formatIdr(dash.ar)}</h2>
              <span className="fs-14">Account Receivable</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-9 col-xxl-8">
          <div className="card">
            <div className="card-header flex-wrap pb-0 border-0">
              <div className="mr-auto pr-3 mb-2">
                <h4 className="text-black fs-20">Statistik</h4>
                <p className="fs-13 mb-2 mb-sm-0 text-black">
                  Statistik Pembelian - Penjualan
                </p>
              </div>
              <div className="d-flex mr-3 mr-sm-2 mb-2">
                <svg
                  className="mr-0 mt-1"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="10" r="7" fill="#FF9432" />
                </svg>
                <div>
                  <span className="fs-12 text-black">Pembelian</span>
                </div>
              </div>
              <div className="d-flex mr-3 mr-sm-2 mb-2">
                <svg
                  className="mr-0 mt-1"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="10" r="7" fill="#1EA7C5" />
                </svg>
                <div>
                  <span className="fs-12 text-black">Penjualan</span>
                </div>
              </div>
            </div>
            <div className="card-body pt-3">
              <ProductionStat
                series={[
                  {
                    name: "Penjualan",
                    data: dash.sls_list,
                  },
                  {
                    name: "Pembelian",
                    data: dash.pur_list,
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-4 col-md-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h4 className="text-black fs-20 mb-0">Status Panen</h4>
            </div>
            <div className="card-body text-center">
              <ApexRadialBar series={80} />
              <p className="fs-14">
                Status panen kolam A1-6 adalah Parsial ke 4
              </p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-4 col-md-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h4 className="text-black fs-20 mb-0">Duration Worked</h4>
            </div>
            <div className="card-body">
              <div className="media align-items-center border border-warning rounded p-3 mb-md-4 mb-3">
                <div className="d-inline-block mr-3 position-relative donut-chart-sale2">
                  <svg className="peity" height={70} width={70}>
                    <path
                      d="M 35 0 A 35 35 0 1 1 0 35.00000000000001 L 8 35 A 27 27 0 1 0 35 8"
                      data-value={6}
                      fill="rgb(255, 148, 50)"
                    />
                    <path
                      d="M 0 35.00000000000001 A 35 35 0 0 1 34.99999999999999 0 L 34.99999999999999 8 A 27 27 0 0 0 8 35"
                      data-value={2}
                      fill="rgba(255, 255, 255, 1)"
                    />
                  </svg>

                  <small className="text-primary">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip6)">
                        <path
                          d="M0.988926 17.074C0.328245 17.2006 -0.104616 17.8385 0.0219518 18.4992C0.133331 19.0814 0.644663 19.4864 1.21675 19.4864C1.29269 19.4864 1.37116 19.4788 1.4471 19.4636L6.45917 18.5017C6.74521 18.446 7.00087 18.2916 7.18313 18.0638L9.33478 15.3502L8.6159 14.9832C8.08432 14.7148 7.71471 14.2288 7.58815 13.639L5.55801 16.1982L0.988926 17.074Z"
                          fill="#FF9432"
                        />
                        <path
                          d="M18.84 6.493C20.3135 6.493 21.508 5.29848 21.508 3.82496C21.508 2.35144 20.3135 1.15692 18.84 1.15692C17.3664 1.15692 16.1719 2.35144 16.1719 3.82496C16.1719 5.29848 17.3664 6.493 18.84 6.493Z"
                          fill="#FF9432"
                        />
                        <path
                          d="M13.0179 3.15671C12.7369 2.86813 12.4762 2.75422 12.1902 2.75422C12.0863 2.75422 11.9826 2.76941 11.8712 2.79472L7.292 3.88067C6.65917 4.03002 6.26934 4.66539 6.41869 5.29569C6.54779 5.8374 7.02874 6.20192 7.56286 6.20192C7.65401 6.20192 7.74511 6.19179 7.83627 6.16901L11.7371 5.24507C11.9902 5.52605 13.2584 6.90057 13.4888 7.14358C11.8763 8.86996 10.2638 10.5938 8.65134 12.3202C8.62602 12.3481 8.60326 12.3759 8.58046 12.4037C8.10963 13.0036 8.25394 13.9453 8.96272 14.3022L13.9064 16.826L11.3396 20.985C10.9878 21.5571 11.165 22.3063 11.737 22.6607C11.937 22.7848 12.1572 22.843 12.3749 22.843C12.7825 22.843 13.1824 22.638 13.4128 22.2658L16.6732 16.9829C16.8529 16.6918 16.901 16.34 16.8073 16.0134C16.7137 15.6843 16.4884 15.411 16.1821 15.2565L12.8331 13.5529L16.3542 9.7863L19.0122 12.0392C19.2324 12.2265 19.5032 12.3176 19.7716 12.3176C20.0601 12.3176 20.3487 12.2113 20.574 12.0038L23.6242 9.16106C24.1002 8.71808 24.128 7.97386 23.685 7.49797C23.4521 7.24989 23.1382 7.12333 22.8243 7.12333C22.5383 7.12333 22.2497 7.22711 22.0244 7.43721L19.7412 9.56101C19.7386 9.56354 14.0178 4.1819 13.0179 3.15671Z"
                          fill="#FF9432"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip6">
                          <rect width={24} height={24} fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </small>
                </div>
                <div>
                  <h4 className="fs-18 text-black mb-0">Running</h4>
                  <span className="fs-14 text-warning">52 hours, 2min</span>
                </div>
              </div>
              <div className="media align-items-center border border-info rounded p-3 mb-md-4 mb-3">
                <div className="d-inline-block mr-3 position-relative donut-chart-sale2">
                  <svg className="peity" height="70" width="70">
                    <path
                      d="M 35 0 A 35 35 0 0 1 70 35 L 62 35 A 27 27 0 0 0 35 8"
                      data-value="2"
                      fill="rgb(30, 167, 197)"
                    ></path>
                    <path
                      d="M 70 35 A 35 35 0 1 1 34.99999999999999 0 L 34.99999999999999 8 A 27 27 0 1 0 62 35"
                      data-value="6"
                      fill="rgba(255, 255, 255, 1)"
                    ></path>
                  </svg>
                  <small className="text-primary">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.8586 5.22596L5.87121 10.5542C5.50758 11.0845 5.64394 11.8068 6.17172 12.1679L11.1945 15.6098V18.9558C11.1945 19.5921 11.6995 20.125 12.3359 20.1376C12.9874 20.1477 13.5177 19.6249 13.5177 18.976V15.0012C13.5177 14.6174 13.3283 14.2588 13.0126 14.0442L9.79041 11.8346L12.5025 8.95833L13.8914 12.1225C14.0758 12.5442 14.4949 12.8169 14.9546 12.8169H19.1844C19.8207 12.8169 20.3536 12.3119 20.3662 11.6755C20.3763 11.024 19.8536 10.4937 19.2046 10.4937H15.7172C15.2576 9.44821 14.7677 8.41285 14.3409 7.35225C14.1237 6.81689 14.0025 6.58457 13.6036 6.21588C13.5227 6.14013 12.9596 5.62498 12.4571 5.16538C11.995 4.74616 11.2828 4.77394 10.8586 5.22596Z"
                        fill="#1EA7C5"
                      />
                      <path
                        d="M15.6162 5.80678C17.0861 5.80678 18.2778 4.61514 18.2778 3.14517C18.2778 1.6752 17.0861 0.483551 15.6162 0.483551C14.1462 0.483551 12.9545 1.6752 12.9545 3.14517C12.9545 4.61514 14.1462 5.80678 15.6162 5.80678Z"
                        fill="#1EA7C5"
                      />
                      <path
                        d="M4.89899 23.5164C7.60463 23.5164 9.79798 21.323 9.79798 18.6174C9.79798 15.9117 7.60463 13.7184 4.89899 13.7184C2.19335 13.7184 0 15.9117 0 18.6174C0 21.323 2.19335 23.5164 4.89899 23.5164Z"
                        fill="#1EA7C5"
                      />
                      <path
                        d="M19.101 23.5164C21.8066 23.5164 24 21.323 24 18.6174C24 15.9117 21.8066 13.7184 19.101 13.7184C16.3954 13.7184 14.202 15.9117 14.202 18.6174C14.202 21.323 16.3954 23.5164 19.101 23.5164Z"
                        fill="#1EA7C5"
                      />
                    </svg>
                  </small>
                </div>
                <div>
                  <h4 className="fs-18 text-black mb-0">Cycling</h4>
                  <span className="fs-14 text-info">23 hours, 45min</span>
                </div>
              </div>
              <div className="media align-items-center border border-secondary rounded p-3">
                <div className="d-inline-block mr-3 position-relative donut-chart-sale2">
                  <svg className="peity" height={70} width={70}>
                    <path
                      d="M 35 0 A 35 35 0 0 1 69.46827135542728 28.922313781657436 L 61.58980933132962 30.31149920299288 A 27 27 0 0 0 35 8"
                      data-value={2}
                      fill="rgb(192, 70, 211)"
                    />
                    <path
                      d="M 69.46827135542728 28.922313781657436 A 35 35 0 1 1 34.99999999999999 0 L 34.99999999999999 8 A 27 27 0 1 0 61.58980933132962 30.31149920299288"
                      data-value={7}
                      fill="rgba(255, 255, 255, 1)"
                    />
                  </svg>

                  <small className="text-primary">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip7)">
                        <path
                          d="M11.9997 5.9999C13.6566 5.9999 14.9997 4.65677 14.9997 2.99995C14.9997 1.34312 13.6566 0 11.9997 0C10.3429 0 8.9998 1.34312 8.9998 2.99995C8.9998 4.65677 10.3429 5.9999 11.9997 5.9999Z"
                          fill="#C046D3"
                        />
                        <path
                          d="M17.8305 21.8297L14.1361 23.2153L15.9733 23.9042C16.764 24.1978 17.6171 23.791 17.9046 23.0261C18.0577 22.618 18.0124 22.1905 17.8305 21.8297Z"
                          fill="#C046D3"
                        />
                        <path
                          d="M5.02677 16.5949C4.25263 16.3078 3.3869 16.6974 3.09543 17.473C2.80467 18.2486 3.19799 19.1128 3.97354 19.4043L5.5918 20.0111L9.86412 18.4088L5.02677 16.5949Z"
                          fill="#C046D3"
                        />
                        <path
                          d="M20.9045 17.473C20.613 16.6974 19.7473 16.3078 18.9732 16.5949L6.97345 21.0948C6.19781 21.3863 5.80453 22.2505 6.0953 23.0262C6.38278 23.7908 7.23572 24.198 8.02664 23.9043L20.0264 19.4044C20.8021 19.1129 21.1953 18.2487 20.9045 17.473Z"
                          fill="#C046D3"
                        />
                        <path
                          d="M22.4998 11.9998H18.9271L16.3417 6.82899C16.073 6.29213 15.5265 5.98627 14.9632 5.99991L11.9997 5.9999L9.03663 5.99991C8.47343 5.98627 7.92757 6.29217 7.65828 6.82899L5.07289 11.9998H1.50022C0.671898 11.9998 0.000274658 12.6714 0.000274658 13.4997C0.000274658 14.328 0.671898 14.9997 1.50022 14.9997H6.00012C6.56848 14.9997 7.08776 14.6789 7.34187 14.1706L9.00002 10.8543V16.483L11.9999 17.6079L14.9999 16.4827V10.8543L16.6581 14.1706C16.9122 14.6789 17.4315 14.9997 17.9998 14.9997H22.4997C23.328 14.9997 23.9997 14.328 23.9997 13.4997C23.9997 12.6714 23.3281 11.9998 22.4998 11.9998Z"
                          fill="#C046D3"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip7">
                          <rect width={24} height={24} fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </small>
                </div>
                <div>
                  <h4 className="fs-18 text-black mb-0">Yoga</h4>
                  <span className="fs-14 text-secondary">16 hours, 2min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-9 col-xxl-8">
          <div className="card">
            <div className="card-header d-sm-flex d-block pb-0 border-0">
              <div className="mr-auto pr-3">
                <h4 className="text-black fs-20">Calories Chart</h4>
                <p className="fs-13 mb-0 text-black">
                  Lorem ipsum dolor sit amet, consectetur
                </p>
              </div>
              <Dropdown className="dropdown mt-sm-0 mt-3">
                <Dropdown.Toggle
                  as="button"
                  variant=""
                  className="btn rounded border border-light dropdown-toggle"
                >
                  Kolam A
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                  <Dropdown.Item>Kolam B</Dropdown.Item>
                  <Dropdown.Item>Kolam C</Dropdown.Item>
                  <Dropdown.Item>Kolam D</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="card-body">
              <ApexNagetivePosative />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
