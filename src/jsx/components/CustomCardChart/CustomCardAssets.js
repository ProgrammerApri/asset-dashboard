import React from "react";
import ReactApexChart from "react-apexcharts";
import { Badge, Row } from "react-bootstrap";

export default function CustomCardAssets({
  labels,
  values,
  colors,
  trends,
  icons,
  compact = false
}) {
  const formatIdr = (value) => {
    if (value < 0) {
      return `(Rp. ${`${value})`
      .replace(".", ",")
      .replace("-", "")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
    }
    return `Rp. ${`${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  };

  const formatCompactIdr = (value) => {
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
      { value: 1e3, symbol: " K" },
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
    <div className="col-xl-3 col-xxl-4 col-md-6 d-flex align-content-stretch flex-wrap">
      {labels.map((v, i) => {
        return (
          <div className="col-12 p-0">
            <div className="card">
              <div className="card-body p-3">
                <div className="row justify-content-between m-0 align-items-center h-100">
                  <div
                    className="card-logo"
                    style={{
                      color: `${colors[i]}`,
                      backgroundColor: `${colors[i]}20`,
                    }}
                  >
                    {icons[i]}
                  </div>
                  <div className="col-12 p-0 mt-2">
                    <span className="fs-12 mb-0">{v}</span>
                  </div>
                  <div className="col-12 p-0">
                    <Row className="m-0 justify-content-between">
                      <span className="fs-18 text-black font-w600 mb-0">
                        {compact ? formatCompactIdr(values[i]) : formatIdr(values[i])}
                      </span>
                      <div
                        className="flex align-items-center trends"
                        style={{
                          color:
                            trends[i] > 0
                              ? "#3BC378"
                              : trends[i] < 0
                              ? "#FF483C"
                              : "#7E7E7E",
                          backgroundColor:
                            trends[i] > 0
                              ? "#3BC37820"
                              : trends[i] < 0
                              ? "#FF483C20"
                              : "#7E7E7E20",
                        }}
                      >
                        {trends[i] > 0 ? (
                          <i class="bx bx-caret-up mr-1"></i>
                        ) : trends[i] < 0 ? (
                          <i class="bx bx-caret-down mr-1"></i>
                        ) : (
                          <i class="bx bx-stop mr-1"></i>
                        )}
                        <span className="fs-12">{`${trends[i].toFixed(2)}`}%</span>
                      </div>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
