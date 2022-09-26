import React from "react";
import ReactApexChart from "react-apexcharts";

export default function CustomCardBank({ tittle, subTittle, saldo, idr = true }) {
  const formatIdr = (value) => {
    if (value < 0) {
      return `(Rp. ${`${nFormatter(Math.abs(value), 2)})`
        .replace(".", ",")
        .replace("-", "")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
    }
    return `Rp. ${`${nFormatter(Math.abs(value), 2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  };

  const nFormatter = (num, digits) => {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "K" },
      { value: 1e6, symbol: " Jt" },
      { value: 1e9, symbol: " M" },
      { value: 1e12, symbol: " T" },
      { value: 1e15, symbol: " P" },
      { value: 1e18, symbol: " E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

  
  return (
    <div className="col-xl-2-5 col-md-6 col-sm-6">
      <div className="card">
        <div className="card-body p-4">
          <div className="flex justify-content-between m-0 align-items-center">
            <div className="col-7 p-0">
              <span className="fs-14 text-black font-w600 mb-0">{subTittle}</span>
              <br />
              <span className="fs-14">{tittle}</span>
            </div>
            <span className="fs-160 text-black font-w600 mb-0">
              {idr ? formatIdr(saldo) : saldo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
