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

const data = {
  id: 0,
  ord_code: null,
  ord_date: null,
  faktur: null,
  po_id: null,
  dep_id: null,
  sup_id: null,
  top: null,
  due_date: null,
  split_inv: null,
  prod_disc: null,
  jasa_disc: null,
  total_disc: null,
  dprod: [],
  djasa: [],
};

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportGRA = () => {
  const [reportGra, setReportGra] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [date, setDate] = useState(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getOrd();
  }, []);

  const getOrd = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.ord_gra,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        setReportGra(data);
      }
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

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

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
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
                value={
                  loading
                    ? dummy
                    : reportGra
                    // ? jsonForExcel(reportGra, false)
                    // : null
                }
                header={renderHeader}
                showGridlines
                dataKey="id"
                rowHover
                emptyMessage="Data Tidak Ditemukan"
              >
                <Column
                  className="header-center body-center"
                  header="Referensi"
                  style={{ minWidht: "10rem" }}
                  field={(e) => e.ord_code}
                  body={loading && <Skeleton />}
                />
                <Column
                  className="header-center body-center"
                  header="Tanggal"
                  style={{ minWidht: "10rem" }}
                  field={(e) => formatDate(e.ord_date)}
                  body={loading && <Skeleton />}
                />
                <Column
                  className="header-center body-center"
                  header="Departemen"
                  style={{ minWidht: "10rem" }}
                  field={(e) => e.dep_id?.ccost_name}
                  body={loading && <Skeleton />}
                />
                <Column
                  className="header-center body-center"
                  header="Nomor"
                  style={{ minWidht: "10rem" }}
                  field={(e) => e.po_id?.po_code}
                  body={loading && <Skeleton />}
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
              <CustomeWrapper />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ReportGRA;
