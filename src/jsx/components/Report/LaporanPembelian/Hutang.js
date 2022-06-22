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

const ReportHutang = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState(new Date());
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
      // let sel = `${el.supplier.sup_name} (${el.supplier.sup_code})`;
      // console.log(sel);
      // if (selectSup === sel) {
        let val = [
          {
            sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
            type: "header",
            value: {
              ref: "Kode Faktur",
              date: "Tanggal Faktur",
              jt: "J/T",
              value: "Total Hutang",
              lns: "Total dilunasi",
              sisa: "Sisa Hutang",
            },
          },
        ];
        let amn = 0;
        let acq = 0;
        el.ap.forEach((ek) => {
          let dt = new Date(`${ek.ord_id.fk_date}Z`);
          if (dt <= filtDate) {
            val.push({
              sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
              type: "item",
              value: {
                ref: ek.ord_id.fk_code,
                date: formatDate(ek.ord_id.fk_date),
                jt: ek.ord_due ? formatDate(ek.ord_due) : "-",
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
          sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
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
                onChange={(e) => {
                  console.log(e.value);
                  setFiltDate(e.value);
                }}
                // selectionMode="range"
                placeholder="Pilih Tanggal"
                dateFormat="dd-mm-yy"
              />
            </div>
            <div className="col-4">
              <CustomDropdown
                value={supplier && selectSup}
                option={supplier}
                onChange={(e) => {
                  // console.log(e);
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
                dataSet={ap ? jsonForExcel(ap) : null}
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
                <div className="font-weight-bold col-6">Total Hutang</div>
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
              tittle={"Laporan Hutang"}
              subTittle={"Laporan Hutang Periode"}
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

export default ReportHutang;
