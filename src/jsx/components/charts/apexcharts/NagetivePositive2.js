import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";

class ApexNagetivePosative extends React.Component {
  constructor(props) {
    super(props);

    const formatIdr = (value) => {
      return `${value}`
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    };

    this.state = {
      series: [
        {
          name: "AR",
          data: props.ar,
        },
        {
          name: "AP",
          data: props.ap,
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 320,
          stacked: true,
          toolbar: {
            show: false,
          },
          sparkline: {
            //enabled: true
          },
          backgroundBarRadius: 5,
          offsetX: -10,
        },
        plotOptions: {
          bar: {
            columnWidth: "30%",
            endingShape: "rounded",
            colors: {
              backgroundBarColors: [
                "rgba(0,0,0,0)",
                "rgba(0,0,0,0)",
                "rgba(0,0,0,0)",
                "rgba(0,0,0,0)",
                "rgba(0,0,0,0)",
                "rgba(0,0,0,0)",
                "rgba(0,0,0,0)",
                "rgba(0,0,0,0)",
                "rgba(0,0,0,0)",
                "rgba(0,0,0,0)",
              ],
              backgroundBarOpacity: 1,
              backgroundBarRadius: 5,
              opacity: 0,
            },
          },
          distributed: true,
        },
        colors: ["#6EC51E", "#FF285C"],

        grid: {
          show: true,
        },
        legend: {
          show: false,
        },
        fill: {
          opacity: 1,
        },
        dataLabels: {
          enabled: false,
          colors: ["#6EC51E", "#FF285C"],
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 1,
            opacity: 1,
          },
        },
        xaxis: {
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
          labels: {
            style: {
              colors: "#787878",
              fontSize: "13px",
              fontFamily: "Poppins",
              fontWeight: 400,
            },
          },
          crosshairs: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
        tooltip: {
          x: {
            show: true,
          },
          y: {
            formatter: function (
              value,
              { series, seriesIndex, dataPointIndex, w }
            ) {
               if (series[seriesIndex][dataPointIndex] < 0) {
                  return `-Rp. ${formatIdr(Math.abs(series[seriesIndex][dataPointIndex]))}`
               }
               return `Rp. ${formatIdr(series[seriesIndex][dataPointIndex])}`
            },
          },
          followCursor: true,
        },
        yaxis: {
          labels: {
            style: {
              colors: "#787878",
              fontSize: "13px",
              fontFamily: "Poppins",
              fontWeight: 400,
            },
            formatter: function (value) {
               return `${formatIdr(value)}`;
             }
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={320}
        />
      </div>
    );
  }
}

export default ApexNagetivePosative;
