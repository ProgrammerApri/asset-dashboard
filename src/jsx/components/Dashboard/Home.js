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
import CircleProgressWhite from "../CircleProgress/CircleProgressWhite";

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
              <h2 className="fs-160 text-black font-w600 mb-0">
                {dash.out_pur}
              </h2>
              <span className="fs-14">Outstanding Purchase</span>
            </div>
          </div>
        </div>
        <div className="col-xl col-md-6 col-sm-6">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="fs-24 text-black font-w600 mb-0">
                Rp. {formatIdr(dash.ap)}
              </h2>
              <span className="fs-14">Account Payable</span>
            </div>
          </div>
        </div>

        <div className="col-xl col-md-6 col-sm-6">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="fs-24 text-black font-w600 mb-0">
                {dash.out_sls}
              </h2>
              <span className="fs-14">Outstanding Sales</span>
            </div>
          </div>
        </div>

        <div className="col-xl col-md-6 col-sm-6">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="fs-24 text-black font-w600 mb-0">
                Rp. {formatIdr(dash.ar)}
              </h2>
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
                    name: "Pembelian",
                    data: dash.pur_list,
                  },
                  {
                    name: "Penjualan",
                    data: dash.sls_list,
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-4 col-md-6">
          <div className="card">
            <div className="card-header border-0 pb-0">
              <h4 className="text-black fs-20 mb-0">Neraca</h4>
            </div>
            <div className="card-body">
              <div className="media align-items-center border border-warning rounded p-3 mb-md-4 mb-3">
                <CircleProgressWhite
                  percent={30}
                  colors={"#F2D182"}
                  icon={<i class="bx bxs-factory"></i>}
                />
                <div>
                  <h4 className="fs-18 text-black mb-0">Assets</h4>
                  <span className="fs-14 text-warning">Rp. 350.000.000</span>
                </div>
              </div>
              <div className="media align-items-center border border-info rounded p-3 mb-md-4 mb-3">
                <CircleProgressWhite
                  percent={30}
                  colors={"#1EA7C5"}
                  icon={<i class="bx bxs-error"></i>}
                />
                <div>
                  <h4 className="fs-18 text-black mb-0">Kewajiban</h4>
                  <span className="fs-14 text-info">Rp. 3.000.000</span>
                </div>
              </div>
              <div className="media align-items-center border border-danger rounded p-3 mb-md-4 mb-3">
                <CircleProgressWhite
                  percent={30}
                  colors={"#ff285c"}
                  icon={<i class="bx bxs-zap"></i>}
                />
                <div>
                  <h4 className="fs-18 text-black mb-0">Modal</h4>
                  <span className="fs-14 text-danger">Rp. 3.000.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-12 col-xxl-12">
          <div className="card">
            <div className="card-header d-sm-flex d-block pb-0 border-0">
              <div className="mr-auto pr-3">
                <h4 className="text-black fs-20">AR/AP</h4>
                <p className="fs-13 mb-0 text-black">Grafik AR / AP</p>
              </div>
              {/* <Dropdown className="dropdown mt-sm-0 mt-3">
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
              </Dropdown> */}
            </div>
            <div className="card-body">
              <ApexNagetivePosative
                ar={dash?.ar_list}
                ap={dash?.ap_list?.map((v) => {
                  if (v > 0) {
                    return 0 - v;
                  } else {
                    return v;
                  }
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
