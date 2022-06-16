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
      width: [4, 4],
      colors: ["#FF9432", "#1EA7C5"],
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
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ],
    },
    colors: ["#FF9432", "#1EA7C5"],
    tooltip: {
      x : {
        show:true,
      },
      y: {
        formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
          // console.log(seriesIndex);
          return `Rp. ${formatIdr(series[seriesIndex][dataPointIndex])}`
        }
      },
      followCursor: true,
    },
    markers: {
      size: [6, 6],
      strokeWidth: [4, 4],
      strokeColors: ["#FF9432", "#1EA7C5"],
      border: 0,
      colors: ["#fff", "#fff"],
      hover: {
        size: 10,
      },
    },
    yaxis: {
      title: {
        text: "",
      },
      labels: {
        formatter: function (value) {
          return `${formatIdr(value)}`;
        }
      }
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [500]);

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

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
