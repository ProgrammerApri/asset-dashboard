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
// import CustomeWrapper from "../../CustomeWrapper/CustomeWrapper";
// import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import { el } from "date-fns/locale";
import CustomeWrapper from "../CustomeWrapper/CustomeWrapper";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportKBB = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState(new Date());
  const [customer, setCustomer] = useState(null);
  const [selectCus, setSelectCus] = useState(null);
  const [account, setAcc] = useState(null);
  const [trans, setTrans] = useState(null);
  const [total, setTotal] = useState(null);
  const chunkSize = 27;

  useEffect(() => {
    getAcc();
  }, []);

  const getTrans = async (acc) => {
    const config = {
      ...endpoints.trans,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        // let acc = [];
        // acc.forEach((element) => {
        //   element.trans = [];
        //   data.forEach((el) => {
        //     if (element.account.id === el.acc_id.id) {
        //       element.trans.push({ ...el, trx_amnh: 0, acq_amnh: 0 });
        //     }
        //   });
        //   element.trans.forEach((el) => {
        //     data.forEach((ek) => {
        //       if (el.id === ek.id) {
        //         el.trx_amnh = ek?.trx_amnh ?? 0;
        //         el.acq_amnh += ek?.acq_amnh ?? 0;
        //       }
        //     });
        //   });
        //   if (element.trans.length > 0) {
        //     acc.push(element);
        //   }
        // });
        setTrans(data);
        // jsonForExcel(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAcc = async () => {
    const config = {
      ...endpoints.account,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((el) => {
          if (el.account.dou_type === "D") {
            filt.push(el);
          }
        });
        setAcc(filt);
        getTrans(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const jsonForExcel = (account) => {
    let data = [];

    account?.forEach((el) => {
      let dt = [];
      let db = 0;
      let kr = 0;
      trans?.forEach((element) => {
        if (element?.acc_id.id === el?.account.id) {
          db += element.trx_dbcr === "D" ? element.trx_amnt : 0;
          kr += element.trx_dbcr === "K" ? element.trx_amnt : 0;
          dt = new Date(`${element?.trx_date}Z`);
        }
      });
      if (dt <= filtDate) {
        data.push({
          acco: `${el.account.acc_name} (${el.account.acc_code})`,
          slda: `Rp. ${formatIdr(0)}`,
          debe: `Rp. ${formatIdr(db)}`,
          kred: `Rp. ${formatIdr(kr)}`,
          blce: `Rp. ${formatIdr(db + kr)}`,
        });
      }
    });
    console.log(data);

    return data;
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

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
                value={filtDate}
                id="range"
                onChange={(e) => {
                  console.log(e.value);
                  setFiltDate(e.value);
                }}
                // selectionMode="range"
                placeholder="Pilih Tanggal"
                readOnlyInput
                dateFormat="dd-mm-yy"
              />
            </div>
            <div className="col-4">
              {/* <CustomDropdown
                value={customer && selectCus}
                option={customer}
                onChange={(e) => {
                  setSelectCus(e);
                }}
                label={"[customer.cus_name] ([customer.cus_code])"}
                placeholder="Pilih Pelanggan"
              /> */}
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
                dataSet={account ? jsonForExcel(account) : null}
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

  const chunk = (arr, size) =>
    arr.reduce(
      (acc, e, i) => (
        i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc
      ),
      []
    );

  return (
    <>
      {/* <Toast ref={toast} /> */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              {renderHeader()}
              {/* <DataTable
                responsiveLayout="scroll"
                value={jsonForExcel(account)}
                showGridlines
                dataKey="id"
                rowHover
                emptyMessage="Data Tidak Ditemukan"
              >
                <Column
                  className="header-center"
                  header="Account"
                  style={{ width: "20rem" }}
                  field={(e) => e?.acco}
                />
                <Column
                  className="header-center text-right"
                  header="Begining Balance"
                  style={{ minWidht: "8rem" }}
                  field={(e) => e?.slda}
                />
                <Column
                  className="header-center text-right"
                  header="Debit"
                  style={{ minWidht: "8rem" }}
                  field={(e) => e?.debe}
                />
                <Column
                  className="header-center text-right"
                  header="Credit"
                  style={{ minWidht: "10rem" }}
                  field={(e) => e?.kred}
                />
                <Column
                  className="header-center text-right"
                  header="Balance"
                  style={{ minWidht: "10rem" }}
                  field={(e) => e?.blce}
                />
              </DataTable> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* <Row className="m-0 d-none">
        <Card ref={printPage}>
          <Card.Body className="p-0">
            <CustomeWrapper
              tittle={"Kartu Buku Besar"}
              subTittle={`Laporan Kartu Buku Besar Per ${formatDate(filtDate)}`}
              body={
                <>
                  <DataTable
                    responsiveLayout="scroll"
                    value={jsonForExcel(account)}
                    showGridlines
                    dataKey="id"
                    rowHover
                    emptyMessage="Data Tidak Ditemukan"
                  >
                    <Column
                      className="header-center"
                      header="Akun"
                      style={{ width: "20rem" }}
                      field={(e) => e?.acco}
                    />
                    <Column
                      className="header-center text-right"
                      header="Saldo Awal"
                      style={{ minWidht: "8rem" }}
                      field={(e) => e?.slda}
                    />
                    <Column
                      className="header-center text-right"
                      header="Mutasi Debit"
                      style={{ minWidht: "8rem" }}
                      field={(e) => e?.debe}
                    />
                    <Column
                      className="header-center text-right"
                      header="Mutasi Kredit"
                      style={{ minWidht: "10rem" }}
                      field={(e) => e?.kred}
                    />
                    <Column
                      className="header-center text-right"
                      header="Balance"
                      style={{ minWidht: "10rem" }}
                      field={(e) => e?.blce}
                    />
                  </DataTable>
                </>
              }
            />
          </Card.Body>
        </Card>
      </Row> */}

      <Row className="m-0 justify-content-center" ref={printPage}>
        {chunk(jsonForExcel(account) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0">
                <CustomeWrapper
                  tittle={"General Ledger Card"}
                  subTittle={`General Ledger Card as of ${formatDate(
                    filtDate
                  )}`}
                  page={idx + 1}
                  body={
                    <>
                      {/* {val.map((v) => { */}
                        {/* return ( */}
                          <DataTable
                            responsiveLayout="scroll"
                            value={val}
                            showGridlines
                            dataKey="id"
                            rowHover
                            emptyMessage="Data Tidak Ditemukan"
                          >
                            <Column
                              className="header-center"
                              header="Akun"
                              style={{ width: "20rem" }}
                              field={(e) => e?.acco}
                            />
                            <Column
                              className="header-center text-right"
                              header="Saldo Awal"
                              style={{ minWidht: "8rem" }}
                              field={(e) => e?.slda}
                            />
                            <Column
                              className="header-center text-right"
                              header="Mutasi Debit"
                              style={{ minWidht: "8rem" }}
                              field={(e) => e?.debe}
                            />
                            <Column
                              className="header-center text-right"
                              header="Mutasi Kredit"
                              style={{ minWidht: "10rem" }}
                              field={(e) => e?.kred}
                            />
                            <Column
                              className="header-center text-right"
                              header="Balance"
                              style={{ minWidht: "10rem" }}
                              field={(e) => e?.blce}
                            />
                          </DataTable>
                        {/* );
                       })} */}
                    </>
                  }
                />
              </Card.Body>
            </Card>
          );
        })}
      </Row>
    </>
  );
};

export default ReportKBB;
