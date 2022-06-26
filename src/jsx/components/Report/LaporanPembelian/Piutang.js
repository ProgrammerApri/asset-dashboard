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
import { el } from "date-fns/locale";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportPiutang = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState(new Date());
  const [customer, setCustomer] = useState(null);
  const [selectCus, setSelectCus] = useState(null);
  const [ar, setAr] = useState(null);
  const [total, setTotal] = useState(null);

  useEffect(() => {
    getCustomer();
  }, []);

  const getARCard = async (plg) => {
    const config = {
      ...endpoints.arcard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let pel = [];
        let total = 0;
        plg.forEach((element) => {
          element.ar = [];
          data.forEach((el) => {
            if (el.trx_type === "JL" && el.pay_type === "P1") {
              if (element.customer.id === el.cus_id.id) {
                element.ar.push({ ...el, trx_amnh: 0, acq_amnh: 0 });
              }
            }
          });
          element.ar.forEach((el) => {
            data.forEach((ek) => {
              if (el.id === ek.id) {
                el.trx_amnh = ek?.trx_amnh ?? 0;
                el.acq_amnh += ek?.acq_amnh ?? 0;
              }
            });
            total += el?.trx_amnh ?? 0 - el?.acq_amnh ?? 0;
          });
          if (element.ar.length > 0) {
            pel.push(element);
          }
        });
        setAr(pel);
        setTotal(total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCustomer = async () => {
    const config = {
      ...endpoints.customer,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCustomer(data);
        getARCard(data);
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

  const jsonForExcel = (ar) => {
    let data = [];

    ar?.forEach((el) => {
      // let selC = `${el.customer.cus_name} (${el.customer.cus_code})`;
      // if (selectCus === selC) {
      let val = [
        {
          cus: `${el.customer.cus_name} (${el.customer.cus_code})`,
          type: "header",
          value: {
            ref: "Code",
            date: "Date",
            jt: "Due Date",
            value: "Receivable",
            lns: "Total Paid",
            sisa: "Remain",
          },
        },
      ];
      let amn = 0;
      let acq = 0;
      el.ar.forEach((ek) => {
        let filt = new Date(`${ek?.trx_date}Z`);
        console.log(filt);
        if (filt <= filtDate) {
          val.push({
            cus: `${el.customer.cus_name} (${el.customer.cus_code})`,
            type: "item",
            value: {
              ref: ek.trx_code,
              date: formatDate(ek.trx_date),
              jt: ek.trx_due ? formatDate(ek.trx_due) : "-",
              value: `Rp. ${formatIdr(ek.trx_amnh)}`,
              lns: `Rp. ${formatIdr(ek.acq_amnh)}`,
              sisa: `Rp. ${formatIdr(ek.trx_amnh - ek.acq_amnh)}`,
            },
          });
          amn += ek.trx_amnh;
          acq += ek.acq_amnh;
        }
      });
      val.push({
        cus: `${el.customer.cus_name} (${el.customer.cus_code})`,
        type: "footer",
        value: {
          ref: "Total",
          date: "",
          jt: "",
          value: `Rp. ${formatIdr(amn)}`,
          lns: `Rp. ${formatIdr(acq)}`,
          sisa: `Rp. ${formatIdr(amn - acq)}`,
        },
      });
      data.push(val);
      // }
    });

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
            {/* <div className="col-4">
              <CustomDropdown
                value={customer && selectCus}
                option={customer}
                onChange={(e) => {
                  setSelectCus(e);
                }}
                label={"[customer.cus_name] ([customer.cus_code])"}
                placeholder="Pilih Pelanggan"
              />
            </div> */}
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
              {renderHeader()}
              {jsonForExcel(ar, false)?.map((v) => {
                return (
                  <DataTable
                    responsiveLayout="scroll"
                    value={v}
                    showGridlines
                    dataKey="id"
                    rowHover
                    emptyMessage="Data Tidak Ditemukan"
                  >
                    <Column
                      className="header-center"
                      header={(e) =>
                        e.props.value ? e.props?.value[0]?.cus : null
                      }
                      style={{ width: "15rem" }}
                      body={(e) => (
                        <div
                          className={
                            e.type === "header" || e.type === "footer"
                              ? "font-weight-bold"
                              : ""
                          }
                        >
                          {e.value.ref}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "10rem" }}
                      body={(e) => (
                        <div
                          className={e.type === "header" && "font-weight-bold"}
                        >
                          {e.value.date}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "10rem" }}
                      body={(e) => (
                        <div
                          className={e.type === "header" && "font-weight-bold"}
                        >
                          {e.value.jt}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "10rem" }}
                      body={(e) => (
                        <div
                          className={
                            e.type === "header"
                              ? "font-weight-bold text-right"
                              : e.type === "footer"
                              ? "font-weight-bold text-right"
                              : "text-right"
                          }
                        >
                          {e.value.value}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "10rem" }}
                      body={(e) => (
                        <div
                          className={
                            e.type === "header"
                              ? "font-weight-bold text-right"
                              : e.type === "footer"
                              ? "font-weight-bold text-right"
                              : "text-right"
                          }
                        >
                          {e.value.lns}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "10rem" }}
                      body={(e) => (
                        <div
                          className={
                            e.type === "header"
                              ? "font-weight-bold text-right"
                              : e.type === "footer"
                              ? "font-weight-bold text-right"
                              : "text-right"
                          }
                        >
                          {e.value.sisa}
                        </div>
                      )}
                    />
                  </DataTable>
                );
              })}
              <Row className="m-0 mt-5">
                <div className="font-weight-bold col-6">
                  Total Saldo Piutang
                </div>
                <div className="col-6 text-right font-weight-bold">
                  Rp. {formatIdr(total)}
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="m-0 d-none">
        <Card ref={printPage}>
          <Card.Body className="p-0">
            <CustomeWrapper
              tittle={"Receivable Report"}
              subTittle={`Receivable Report as of ${formatDate(filtDate)}`}
              body={
                <>
                  {jsonForExcel(ar, false)?.map((v) => {
                    return (
                      <DataTable
                        responsiveLayout="scroll"
                        value={v}
                        showGridlines
                        dataKey="id"
                        rowHover
                        emptyMessage="Data Tidak Ditemukan"
                      >
                        <Column
                          className="header-center"
                          header={(e) =>
                            e.props.value ? e.props?.value[0]?.cus : null
                          }
                          style={{ width: "15rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.ref}
                            </div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header=""
                          style={{ minWidht: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" && "font-weight-bold"
                              }
                            >
                              {e.value.date}
                            </div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header=""
                          style={{ minWidht: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" && "font-weight-bold"
                              }
                            >
                              {e.value.jt}
                            </div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header=""
                          style={{ minWidht: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right"
                                  : "text-right"
                              }
                            >
                              {e.value.value}
                            </div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header=""
                          style={{ minWidht: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right"
                                  : "text-right"
                              }
                            >
                              {e.value.lns}
                            </div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header=""
                          style={{ minWidht: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right"
                                  : "text-right"
                              }
                            >
                              {e.value.sisa}
                            </div>
                          )}
                        />
                      </DataTable>
                    );
                  })}
                  <Row className="m-0 mt-5">
                    <div className="text-left font-weight-bold col-6">
                      Total Hutang
                    </div>
                    <div className="col-6 text-right font-weight-bold">
                      Rp. {formatIdr(total)}
                    </div>
                  </Row>
                </>
              }
            />
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default ReportPiutang;
