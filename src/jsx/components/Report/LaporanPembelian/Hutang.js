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
import CustomDropdown from "../../CustomDropdown/CustomDropdown";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportHutang = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [date, setDate] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [selectSup, setSelectSup] = useState(null);

  useEffect(() => {
    getSupplier();
  }, []);

  const getAPCard = async () => {
    const config = {
      ...endpoints.apcard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSupplier = async () => {
    const config = {
      ...endpoints.supplier,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSupplier(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const jsonForExcel = () => {};

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-6 ml-0 mr-0 pl-0 pt-0">
          <Row className="mt-0">
            <div className="p-inputgroup col-6">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar" />
              </span>
              <Calendar
                value={date}
                id="range"
                onChange={(e) => {
                  console.log(e.value);
                  setDate(e.value);
                }}
                selectionMode="range"
                placeholder="Pilih Tanggal"
                readOnlyInput
              />
            </div>
            <div className="col-3">
              <CustomDropdown
                value={supplier && selectSup}
                option={supplier}
                onChange={(e) => {
                  setSelectSup(e);
                }}
                label={"[supplier.sup_name] ([supplier.sup_code])"}
                placeholder="Pilih Pemasok"
              />
            </div>
          </Row>
        </div>
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
                dataSet={report ? jsonForExcel(report) : null}
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
                {/* <Column
                  className="center-header"
                  header="Referensi"
                  style={{ minWidht: "10rem" }}
                  field={() => null}
                  body={() => null}
                /> */}
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
                  header="Saldo"
                  style={{ minWidht: "10rem" }}
                  field={() => null}
                  body={() => null}
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="m-0 d-none">
        <Card ref={printPage}>
          <Card.Body className="p-0">
            <CustomeWrapper
              tittle={"Laporan Hutang"}
              subTittle={"Laporan Hutang Periode dd/mm/yyyy - dd/mm/yyyy"}
              body={
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
              }
            />
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default ReportHutang;
