import React from "react";
import ReactApexChart from "react-apexcharts";

export default function CustomCardChart({ tittle, subTittle, series }) {
  const isIncreasing = (arr) => {
    let n = arr.length
    if (arr[0] <= arr[1] && arr[n - 2] <= arr[n - 1])
      return true;
    // If the first two and the last two elements
    // of the array are in decreasing order
    else if (arr[0] >= arr[1] && arr[n - 2] >= arr[n - 1])
      return false;
    // If the first two elements of the array are in
    // increasing order and the last two elements
    // of the array are in decreasing order
    else if (arr[0] <= arr[1] && arr[n - 2] >= arr[n - 1])
      return false;
    // If the first two elements of the array are in
    // decreasing order and the last two elements
    // of the array are in increasing order
    else return true;
  };

  return (
    <div className="col-xl-2-5 col-md-6 col-sm-6">
      <div className="card">
        <div className="card-body p-4">
          <div className="flex justify-content-between m-0">
            <div className="col-6 p-0">
              <span className="fs-160 text-black font-w600 mb-0">{tittle}</span>
              <br />
              <span className="fs-14">{subTittle}</span>
            </div>
            <ReactApexChart
              options={{
                chart: {
                  sparkline: {
                    enabled: true,
                  },
                  //   dropShadow: {
                  //     enabled: true,
                  //     top: 1,
                  //     left: 1,
                  //     blur: 2,
                  //     opacity: 0.2,
                  //   },
                },
                stroke: {
                  curve: "smooth",
                },
                markers: {
                  size: 0,
                },
                grid: {
                  padding: {
                    top: 20,
                    bottom: 10,
                    left: 10,
                    right: 5,
                  },
                },
                colors: [
                  `${isIncreasing(series[0].data) ? "#26A79B" : "#F16461"}`,
                ],
                tooltip: {
                  x: {
                    show: false,
                  },
                  y: {
                    title: {
                      formatter: function formatter(val) {
                        return "";
                      },
                    },
                  },
                },
              }}
              series={series}
              type="line"
              height={80}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
