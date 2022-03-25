import React, { Component, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const ProductionStat = ({series}) => {
  const [isShown, setIsShown] = useState(false);

  const options = {
    chart: {
      height: 350,
      type: "line",
      toolbar: {
        show: false,
      },
      foreColor: 'var(--text-color)'
    },
    dataLabels: {
      enabled: false,
    },

    stroke: {
      width: [4, 4, 4, 4],
      colors: ["#C046D3", "#1EA7C5", "#FF9432", "#6D6F53"],
      curve: 'smooth',
    },
    legend: {
      show: false,
    },
    xaxis: {
      type: "text",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    colors: ["#C046D3", "#1EA7C5", "#FF9432", "#6D6F53"],

    markers: {
      size: [6, 6, 6, 6],
      strokeWidth: [4, 4, 4, 4],
      strokeColors: ["#C046D3", "#1EA7C5", "#FF9432", "#6D6F53"],
      border: 0,
      colors: ["#fff", "#fff", "#fff", "#fff"],
      hover: {
        size: 10,
      },
    },
    yaxis: {
      title: {
        text: "",
      },
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [500]);

  return isShown ? (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={380}
      />
    </div>
  ) : null;
};

export default ProductionStat;
