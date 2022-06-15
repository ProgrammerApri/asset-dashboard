import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";

import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import CustomeWrapper from "../../CustomeWrapper/CustomeWrapper";
import { Divider } from "@material-ui/core";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportGRA = () => {
  const [reportGra, setReportGra] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [date, setDate] = useState(null);

  const jsonForExcel = () => {};

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-3 ml-0 mr-0 pl-0">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-calendar" />
            </span>
            <Calendar
              value={date}
              id="range"
              onChange={(e) => setDate(e.value)}
              selectionMode="range"
              placeholder="Pilih Tanggal"
              readOnlyInput
            />
          </div>
        </div>
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`report_export_${new Date().getTime()}`}
              element={
                <Button variant="primary" onClick={() => {}}>
                  EXCEL
                  <span className="btn-icon-right">
                    <i class="bx bx-table"></i>
                  </span>
                </Button>
              }
            >
              <ExcelSheet
                dataSet={reportGra ? jsonForExcel(reportGra) : null}
                name="Report"
              />
            </ExcelFile>
          </div>
          <ReactToPrint
            trigger={() => {
              return (
                <Button variant="primary" onClick={() => {}}>
                  PDF{" "}
                  <span className="btn-icon-right">
                    <i class="bx bxs-file-pdf"></i>
                  </span>
                </Button>
              );
            }}
            content={() => printPage.current}
          />
        </Row>
      </div>
    );
  };

  return (
    <>
      {/* <Toast ref={toast} /> */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={null}
                header={renderHeader}
                showGridlines
                dataKey="id"
                rowHover
                emptyMessage="Data Tidak Ditemukan"
              >
                <Column
                  className="center-header"
                  header="Referensi"
                  style={{ minWidht: "10rem" }}
                  field={() => null}
                  body={() => null}
                />
                <Column
                  className="header-center"
                  header="Tanggal"
                  style={{ minWidht: "10rem" }}
                  field={() => null}
                  body={() => null}
                />
                <Column
                  className="header-center"
                  header="Departemen"
                  style={{ minWidht: "10rem" }}
                  field={() => null}
                  body={() => null}
                />
                <Column
                  className="header-center"
                  header="Nomor"
                  style={{ minWidht: "10rem" }}
                  field={() => null}
                  body={() => null}
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="d-none">
        <Col>
          <Card ref={printPage}>
            <Card.Body>
              <div className="page">
                <div className="subpage">
                  <h3 className="center">
                    <b>Laporan</b>
                  </h3>
                  <h5 className="mt-2">Transaksi Pembelian</h5>
                  <div className="mt-5">
                    <DataTable
                      responsiveLayout="scroll"
                      value={null}
                      showGridlines
                      dataKey="id"
                      rowHover
                      emptyMessage="Data Tidak Ditemukan"
                    >
                      <Column
                        className="center-header"
                        header="Referensi"
                        style={{ minWidht: "10rem" }}
                        field={() => null}
                        body={() => null}
                      />
                      <Column
                        className="header-center"
                        header="Tanggal"
                        style={{ minWidht: "10rem" }}
                        field={() => null}
                        body={() => null}
                      />
                      <Column
                        className="header-center"
                        header="Departemen"
                        style={{ minWidht: "10rem" }}
                        field={() => null}
                        body={() => null}
                      />
                      <Column
                        className="header-center"
                        header="Nomor"
                        style={{ minWidht: "10rem" }}
                        field={() => null}
                        body={() => null}
                      />
                    </DataTable>
                  </div>
                </div>
                <Divider></Divider>
                <div className="ml-2">
                  <span className="fs-12">Halaman : 1</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ReportGRA;
