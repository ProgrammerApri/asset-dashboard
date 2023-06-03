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
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import { el } from "date-fns/locale";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";

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
  const [cp, setCp] = useState("");
  const chunkSize = 4;

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
              if (el.ord_id?.id === ek.ord_id?.id) {
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

  const jsonForExcel = (ap, excel = false) => {
    let data = [];

    ap?.forEach((el) => {
      let val = [
        {
          sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
          type: "header",
          value: {
            fk: "Invoice",
            tgl: "Date",
            jt: "Before Due",
            day1: "7 Day",
            day2: "14 Day",
            day3: "30 Day",
            day4: "60 Day",
            older: "Older",
            // nota: "Debit",
            // rtr: "Retur",
            total: "Total",
            // giro: "Giro",
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
        let diff = (date - due) / (1000 * 60 * 60 * 24);

        val.push({
          sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
          type: "item",
          value: {
            fk: ek.trx_code,
            tgl: formatDate(ek.ord_date),
            jt: diff <= 0 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
            day1: diff <= 7 && diff > 0 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
            day2:
              diff <= 14 && diff > 7 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
            day3:
              diff <= 30 && diff > 14 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
            day4:
              diff <= 60 && diff > 30 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
            older: diff > 60 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
            // nota: `Rp. ${formatIdr(0)}`,
            // rtr: `Rp. ${formatIdr(0)}`,
            total: `Rp. ${formatIdr(ek.trx_amnh)}`,
            // giro: `Rp. ${formatIdr(0)}`,
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
          tgl: "",
          jt: `Rp. ${formatIdr(t_jt)}`,
          day1: `Rp. ${formatIdr(t_day1)}`,
          day2: `Rp. ${formatIdr(t_day2)}`,
          day3: `Rp. ${formatIdr(t_day3)}`,
          day4: `Rp. ${formatIdr(t_day4)}`,
          older: `Rp. ${formatIdr(t_older)}`,
          // nota: "",
          // rtr: "",
          total: `Rp. ${formatIdr(amn)}`,
        },
      });
      data.push(val);
    });

    let final = [
      {
        columns: [
          {
            title: "Debt Age Details",
            width: { wch: 20 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
        ],
        data: [
          [
            {
              value: cp,
              style: {
                font: { sz: "14", bold: false },
                alignment: { horizontal: "left", vertical: "center" },
              },
            },
          ],
        ],
      },
      {
        columns: [
          {
            title: `Periode ${formatDate(date)}`,
            width: { wch: 20 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
        ],
        data: [[]],
      },
    ];

    data.forEach((el) => {
      let item = [];
      el.forEach((ek) => {
        item.push([
          {
            value: `${ek.value.fk}`,
            style: {
              font: {
                sz: "14",
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek.value.tgl}`,
            style: {
              font: {
                sz: "14",
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek.value.jt}`,
            style: {
              font: {
                sz: "14",
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: `${ek.value.day1}`,
            style: {
              font: {
                sz: "14",
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: `${ek.value.day2}`,
            style: {
              font: {
                sz: "14",
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: `${ek.value.day3}`,
            style: {
              font: {
                sz: "14",
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: `${ek.value.day4}`,
            style: {
              font: {
                sz: "14",
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          // {
          //   value: `${ek.value.nota}`,
          //   style: {
          //     font: {
          //       sz: "14",
          //       bold:
          //         ek.type === "header" || ek.type === "footer" ? true : false,
          //     },
          //     alignment: { horizontal: "right", vertical: "center" },
          //   },
          // },
          // {
          //   value: `${ek.value.rtr}`,
          //   style: {
          //     font: {
          //       sz: "14",
          //       bold:
          //         ek.type === "header" || ek.type === "footer" ? true : false,
          //     },
          //     alignment: { horizontal: "right", vertical: "center" },
          //   },
          // },
          {
            value: `${ek.value.total}`,
            style: {
              font: {
                sz: "14",
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
        ]);
      });

      item.push([
        {
          value: "",
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
       
      ]);

      final.push({
        columns: [
          {
            title: `${el[0].sup}`,
            width: { wch: 20 },
            style: {
              font: { sz: "14", bold: false },
              alignment: { horizontal: "left", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 15 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "left", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 15 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "left", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 15 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "left", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 15 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "right", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 15 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "right", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 15 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "right", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 15 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "right", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 15 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "right", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
        ],
        data: item,
      });
    });

    if (excel) {
      return final;
    } else {
      return data;
    }
  };

  const formatIdr = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-6 ml-0 mr-0 pl-0 pt-0">
          <Row className="mt-0">
            <div className="p-inputgroup col-4">
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
                dateFormat="dd-mm-yy"
              />
            </div>
            {/* <div className="col-4">
              <CustomDropdown
                value={supplier && selectSup}
                option={supplier}
                onChange={(e) => {
                  setSelectSup(e);
                }}
                label={"[supplier.sup_name] ([supplier.sup_code])"}
                placeholder="Pilih Pemasok"
              />
            </div> */}
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`due_date_payable_${formatDate(new Date())
                .replace("-", "")
                .replace("-", "")}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={ap ? jsonForExcel(ap, true) : null}
                name="Report"
              />
            </ExcelFile>
          </div>
          <ReactToPrint
            trigger={() => {
              return (
                <PrimeSingleButton
                  label="PDF"
                  icon={<i class="pi pi-file-pdf px-2"></i>}
                />
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
            <Card.Body>{renderHeader()}</Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="ml-0 pt-0 justify-content-center" ref={printPage}>
        {chunk(jsonForExcel(ap, false) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card>
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  tittle={"Debt Age Details"}
                  subTittle={`Debt Age Details as of ${formatDate(date)}`}
                  onComplete={(cp) => setCp(cp)}
                  body={
                    <>
                      {val.map((v) => {
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
                              className="header-center border-right border-left"
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
                              className="header-center border-right"
                              header=""
                              style={{ width: "13rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold"
                                      : ""
                                  }
                                >
                                  {e.value.tgl}
                                </div>
                              )}
                            />
                            <Column
                              className="header-center border-right"
                              header=""
                              style={{ width: "13rem" }}
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
                              className="header-center border-right"
                              header=""
                              style={{ width: "13rem" }}
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
                              className="header-center border-right"
                              header=""
                              style={{ width: "11rem" }}
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
                              className="header-center border-right"
                              header=""
                              style={{ width: "13rem" }}
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
                              className="header-center border-right"
                              header=""
                              style={{ width: "13rem" }}
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
                              className="header-center border-right"
                              header=""
                              style={{ width: "13rem" }}
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
                            {/* <Column
                              className="header-center border-right"
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
                              className="header-center border-right"
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
                            /> */}
                            <Column
                              className="header-center border-right"
                              header=""
                              style={{ width: "13rem" }}
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
                            {/* <Column
                              className="header-center border-right"
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
                            /> */}
                          </DataTable>
                        );
                      })}
                    </>
                  }
                />
              </Card.Body>
            </Card>
          );
        })}
      </Row>

      <Row className="m-0 d-none">
        <Card ref={printPage}>
          <Card.Body className="p-0">
            <CustomeWrapper
              tittle={"Debt Age Details"}
              subTittle={`Debt Age Details as of ${formatDate(date)}`}
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
                          className="header-center border-right border-left"
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
                          className="header-center border-right"
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
                          className="header-center border-right"
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
                          className="header-center border-right"
                          header=""
                          style={{ minWidht: "11rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header border-right"
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
                          className="header-center border-right"
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
                          className="header-center border-right"
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
                          className="header-center border-right"
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
                          className="header-center border-right"
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
                          className="header-center border-right"
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
                          className="header-center border-right"
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
                          className="header-center border-right"
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
