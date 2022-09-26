import React from "react";
import ReactApexChart from "react-apexcharts";
import { Divider } from 'primereact/divider';

export default function FinancialReport({ tittle, from, to, value }) {

  return (
    <div className="col-xl-3 col-md-6 col-sm-6">
      <div className="card">
        <div className="card-body p-4">
          <div className="flex justify-content-between m-0 align-items-center">
            <div className="col-8 p-0">
              <span className="fs-160 text-black font-w600 mb-0">{tittle}</span>
              <br />
              <span className="fs-14 font-italic">{from}</span>
              <Divider className="p-0 mr-4 m-0"/>
              <span className="fs-14 font-italic">{to}</span>
            </div>
            <span className="fs-24 text-black font-w600 mb-0">{value}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
