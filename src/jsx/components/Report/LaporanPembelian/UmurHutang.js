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

const UmurHutang = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [date, setDate] = useState(new Date());
  const [rawAP, setRawAP] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [selectSup, setSelectSup] = useState(null);
  const [ap, setAp] = useState(null);
  const [total, setTotal] = useState(null);

  useEffect(() => {
    getSupplier();
  }, []);

  const getAPCard = async (spl) => {
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
        let sup = [];
        let total = 0;
        spl.forEach((element) => {
          element.ap = [];
          data.forEach((el) => {
            if (el.trx_type === "LP" && el.pay_type === "P1") {
              if (element.supplier.id === el.sup_id.id) {
                element.ap.push({ ...el, trx_amnh: 0, acq_amnh: 0 });
              }
            }
          });
          element.ap.forEach((el) => {
            data.forEach((ek) => {
              if (el.ord_id.id === ek.ord_id.id) {
                el.trx_amnh = ek?.trx_amnh ?? 0;
                el.acq_amnh += ek?.acq_amnh ?? 0;
              }
            });
            total += el?.trx_amnh ?? 0 - el?.acq_amnh ?? 0;
          });
          if (element.ap.length > 0) {
            sup.push(element);
          }
        });
        setAp(sup);
        setRawAP(data);
        setTotal(total);
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
        getAPCard(data);
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

  const jsonForExcel = (ap) => {
    let data = [];

    ap?.forEach((el) => {
      let val = [
        {
          sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
          type: "header",
          value: {
            fk: "No. Faktur",
            jt: "Sebelum Jatuh Tempo",
            day1: "7 Hari",
            day2: "14 Hari",
            day3: "30 Hari",
            day4: "60 Hari",
            older: "Older",
            nota: "Nota Debit",
            rtr: "Retur",
            total: "Total",
            giro: "Giro",
          },
        },
      ];
      let amn = 0;
      let t_jt = 0;
      let t_day1 = 0;
      let t_day2 = 0;
      let t_day3 = 0;
      let t_day4 = 0;
      let t_older = 0;
      el.ap.forEach((ek) => {
        let due = new Date(`${ek?.ord_due}Z`);
        let diff = (date - due)/(1000 * 60 * 60 * 24);
        console.log(`${ek.ord_id.fk_code} ${diff} hari`);
        // val.push({
        //   sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
        //   type: "item",
        //   value: {
        //     fk: ek.ord_id.fk_code,
        //     jt: `Rp. ${formatIdr(diff <= 0 ? ek.trx_amnh : 0)}`,
        //     day1: `Rp. ${formatIdr(diff <= 7 && diff > 0 ? ek.trx_amnh : 0)}`,
        //     day2: `Rp. ${formatIdr(diff <= 14 && diff > 7 ? ek.trx_amnh : 0)}`,
        //     day3: `Rp. ${formatIdr(diff <= 30 && diff > 14 ? ek.trx_amnh : 0)}`,
        //     day4: `Rp. ${formatIdr(diff <= 60 && diff > 30 ? ek.trx_amnh : 0)}`,
        //     older: `Rp. ${formatIdr(diff > 60 ? ek.trx_amnh : 0)}`,
        //     nota: `Rp. ${formatIdr(0)}`,
        //     rtr: `Rp. ${formatIdr(0)}`,
        //     total: `Rp. ${formatIdr(ek.trx_amnh)}`,
        //     giro: `Rp. ${formatIdr(0)}`,
        //   },
        // });

        val.push({
          sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
          type: "item",
          value: {
            fk: ek.ord_id.fk_code,
            jt: diff <= 0 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
            day1: diff <= 7 && diff > 0 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
            day2: diff <= 14 && diff > 7 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
            day3: diff <= 30 && diff > 14 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
            day4: diff <= 60 && diff > 30 ? `Rp. ${formatIdr(ek.trx_amnh) }` : "-",
            older: diff > 60 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
            nota: `Rp. ${formatIdr(0)}`,
            rtr: `Rp. ${formatIdr(0)}`,
            total: `Rp. ${formatIdr(ek.trx_amnh)}`,
            giro: `Rp. ${formatIdr(0)}`,
          },
        });
        amn += ek.trx_amnh;
        t_jt += diff <= 0 ? ek.trx_amnh : 0;
        t_day1 += diff <= 7 && diff > 0 ? ek.trx_amnh : 0;
        t_day2 += diff <= 14 && diff > 7 ? ek.trx_amnh : 0;
        t_day3 += diff <= 30 && diff > 14 ? ek.trx_amnh : 0;
        t_day4 += diff <= 30 && diff > 14 ? ek.trx_amnh : 0;
        t_older += diff > 60 ? ek.trx_amnh : 0;
      });
      val.push({
        sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
        type: "footer",
        value: {
          fk: "Total",
          jt: `Rp. ${formatIdr(t_jt)}`,
          day1: `Rp. ${formatIdr(t_day1)}`,
          day2: `Rp. ${formatIdr(t_day2)}`,
          day3: `Rp. ${formatIdr(t_day3)}`,
          day4: `Rp. ${formatIdr(t_day4)}`,
          older: `Rp. ${formatIdr(t_older)}`,
          nota: "",
          rtr: "",
          total: `Rp. ${formatIdr(amn)}`,
        },
      });
      data.push(val);
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
                value={date}
                onChange={(e) => {
                  console.log(e.value);
                  setDate(e.value);
                }}
                placeholder="Pilih Tanggal"
                readOnlyInput
              />
            </div>
            <div className="col-4">
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
              {renderHeader()}
              {jsonForExcel(ap, false)?.map((v) => {
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
                        e.props.value ? e.props?.value[0]?.sup : null
                      }
                      style={{ width: "11rem" }}
                      body={(e) => (
                        <div
                          className={
                            e.type === "header" || e.type === "footer"
                              ? "font-weight-bold"
                              : ""
                          }
                        >
                          {e.value.fk}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "13rem" }}
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
                          {e.value.jt}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "13rem" }}
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
                          {e.value.day1}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "11rem" }}
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
                          {e.value.day2}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "13rem" }}
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
                          {e.value.day3}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "13rem" }}
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
                          {e.value.day4}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "13rem" }}
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
                          {e.value.older}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "13rem" }}
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
                          {e.value.nota}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "13rem" }}
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
                          {e.value.rtr}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "13rem" }}
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
                          {e.value.total}
                        </div>
                      )}
                    />
                    <Column
                      className="header-center"
                      header=""
                      style={{ minWidht: "13rem" }}
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
                          {e.value.giro}
                        </div>
                      )}
                    />
                  </DataTable>
                );
              })}
              {/* <Row className="m-0 mt-5">
                <div className="font-weight-bold col-6">Total Hutang</div>
                <div className="col-6 text-right font-weight-bold">
                  Rp. {formatIdr(total)}
                </div>
              </Row> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="m-0 d-none">
        <Card ref={printPage}>
          <Card.Body className="p-0">
            <CustomeWrapper
              tittle={"Laporan Umur Hutang"}
              subTittle={"Laporan Umur Hutang Periode dd/mm/yyyy - dd/mm/yyyy"}
              body={
                <>
                  {jsonForExcel(ap, false)?.map((v) => {
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
                            e.props.value ? e.props?.value[0]?.sup : null
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
                              {e.value.fk}
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
                              {e.value.day1}
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
                              {e.value.day2}
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
                              {e.value.day3}
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
                              {e.value.day4}
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
                              {e.value.older}
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
                              {e.value.nota}
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
                              {e.value.rtr}
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
                              {e.value.total}
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
                              {e.value.giro}
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

export default UmurHutang;
