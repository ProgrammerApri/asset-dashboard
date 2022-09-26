import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import { Chart } from 'primereact/chart';

import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductionStat from "../../components/charts/apexcharts/Line4";
import { useDispatch, useSelector } from "react-redux";
import { endpoints, request } from "src/utils";
import { SET_DASHBOARD_DATA } from "src/redux/actions";
import CircleProgressWhite from "../../components/CircleProgress/CircleProgressWhite";
import CustomCardAssets from "src/jsx/components/CustomCardChart/CustomCardAssets";
import CustomCardBank from "src/jsx/components/CustomCardChart/CustomCardBank";
import { Messages } from 'primereact/messages';

const ApexLine4 = loadable(() =>
  pMinDelay(import("../../components/charts/apexcharts/Line4"), 500)
);
const ApexNagetivePosative = loadable(() =>
  pMinDelay(import("../../components/charts/apexcharts/NagetivePositive2"), 500)
);

const Home = () => {
  const dispatch = useDispatch();
  const dash = useSelector((state) => state.dash.dashboard);
  const msgs1 = useRef(null);

  useEffect(() => {
    getDashboardInfo();
    msgs1.current.show([
      {
        severity: "warn",
        summary: "",
        detail: "Warning Stock Product PD-0001 Menipis",
        sticky: true,
      },
    ]);
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
        <CustomCardAssets
          labels={["Assets", "Kewajiban", "Modal"]}
          icons={[
            <i class="bx bxs-rocket"></i>,
            <i class="bx bxs-error-circle"></i>,
            <i class="bx bxs-wallet"></i>,
          ]}
          colors={["#FF9432", "#1EA7C5", "#FF0000"]}
          values={[dash?.assets, dash?.kewajiban, dash?.modal] ?? [0, 0, 0]}
          trends={dash?.neraca?.trends ?? [0, 0, 0]}
          compact
        />
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
        <CustomCardBank
          tittle={"20 Sales"}
          subTittle={"CUSTOMER 1"}
          saldo={500000}
        />
        <CustomCardBank
          tittle={"20 Sales"}
          subTittle={"CUSTOMER 1"}
          saldo={500000}
        />
        <CustomCardBank
          tittle={"20 Sales"}
          subTittle={"CUSTOMER 1"}
          saldo={500000}
        />
        <CustomCardBank
          tittle={"20 Sales"}
          subTittle={"CUSTOMER 1"}
          saldo={500000}
        />
        <CustomCardBank
          tittle={"20 Sales"}
          subTittle={"CUSTOMER 1"}
          saldo={500000}
        />
        <CustomCardAssets
          labels={[
            "Daily Sales",
            "Monthly Sales",
            "Sales Last Month vs Current",
          ]}
          icons={[
            <i class="bx bxs-rocket"></i>,
            <i class="bx bxs-error-circle"></i>,
            <i class="bx bxs-wallet"></i>,
          ]}
          colors={["#FF9432", "#1EA7C5", "#FF0000"]}
          values={[0, 0, 0]}
          trends={[0, 0, 0]}
          compact
        />
        <div className="col-xl-6 col-xxl-8">
          <div className="card">
            <div className="card-header flex-wrap pb-0 border-0">
              <div className="mr-auto pr-3 mb-2">
                <h4 className="text-black fs-20">Sales Order</h4>
                <p className="fs-13 mb-2 mb-sm-0 text-black">
                  Hari ini - besok
                </p>
              </div>
            </div>
            <div className="card-body pt-3"></div>
          </div>
        </div>
        <CustomCardAssets
          labels={[
            "Daily Purchase",
            "Monthly Purchase",
            "Purchase Last Month vs Current",
          ]}
          icons={[
            <i class="bx bxs-rocket"></i>,
            <i class="bx bxs-error-circle"></i>,
            <i class="bx bxs-wallet"></i>,
          ]}
          colors={["#FF9432", "#1EA7C5", "#FF0000"]}
          values={[0, 0, 0]}
          trends={[0, 0, 0]}
          compact
        />
        <div className="col-12 pt-0">
        <Messages ref={msgs1} />
        </div>
        
        <CustomCardBank
          tittle={"Raw Material"}
          subTittle={"RM-0001"}
          saldo={50}
          idr={false}
        />
        <CustomCardBank
          tittle={"Raw Material"}
          subTittle={"RM-0001"}
          saldo={50}
          idr={false}
        />
        <CustomCardBank
          tittle={"Raw Material"}
          subTittle={"RM-0001"}
          saldo={50}
          idr={false}
        />
        <CustomCardBank
          tittle={"Raw Material"}
          subTittle={"RM-0001"}
          saldo={50}
          idr={false}
        />
        <CustomCardBank
          tittle={"Raw Material"}
          subTittle={"RM-0001"}
          saldo={50}
          idr={false}
        />
        <div className="col-xl-6 col-xxl-8">
          <div className="card">
            <div className="card-header flex-wrap pb-0 border-0">
              <div className="mr-auto pr-3 mb-2">
                <h4 className="text-black fs-20">Sales Order</h4>
                <p className="fs-13 mb-2 mb-sm-0 text-black">
                  Hari ini - besok (Kondisi Stock)
                </p>
              </div>
            </div>
            <div className="card-body pt-3"></div>
          </div>
        </div>
        <div className="col-xl-6 col-xxl-8">
          <div className="card">
            <div className="card-header flex-wrap pb-0 border-0">
              <div className="mr-auto pr-3 mb-2">
                <h4 className="text-black fs-20">Produk Terlaris</h4>
                <p className="fs-13 mb-2 mb-sm-0 text-black">Minimal Stock</p>
              </div>
            </div>
            <div className="card-body pt-3"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
