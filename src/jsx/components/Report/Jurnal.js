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
import CustomeWrapper from "../CustomeWrapper/CustomeWrapper";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportJurnal = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [date, setDate] = useState([new Date(), new Date()]);
  const [trans, setTrans] = useState(null);
  const chunkSize = 4;

  useEffect(() => {
    var d = new Date();
    d.setDate(d.getDate() - 7);
    setDate([d, new Date()])
    getTrans();
  }, []);

  const getTrans = async () => {
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
        setTrans(data);
        // jsonForExcel(data);
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

    return [day, month, year].join("/");
  };

  const jsonForExcel = (trans, excel = false) => {
    let data = [];
    let grouped = trans?.filter(
      (el, i) => i === trans.findIndex((ek) => el?.trx_code === ek?.trx_code)
    );
    let new_trans = [];
    grouped?.forEach((el) => {
      let trx_date = new Date(`${el?.trx_date}Z`)
      if (trx_date >= date[0] && trx_date <= date[1]) {
        let trx = [];
        trans?.forEach((ek) => {
          if (el.trx_code === ek.trx_code) {
            trx.push(ek);
          }
        });
        new_trans.push({
          trx_code: el.trx_code,
          trx_date: formatDate(el.trx_date),
          trx: trx,
        });
      }
    });

    console.log(new_trans);

    new_trans.forEach((el) => {
      let val = [
        {
          trx_code: `(${el.trx_code})  ${el.trx_date}`,
          type: "header",
          value: {
            acc: "Account",
            debit: "Mutasi Debit",
            kredit: "Mutasi Kredit",
            desc: "Deskripsi",
          },
        },
      ];
      let k = 0;
      let d = 0;
      el.trx.forEach((ek) => {
        val.push({
          trx_code: `(${el.trx_code}) ${el.trx_date}`,
          type: "item",
          value: {
            acc: `(${ek?.acc_id?.acc_code}) ${ek?.acc_id?.acc_name}`,
            debit: ek.trx_dbcr === "D" ? `Rp. ${formatIdr(ek.trx_amnt)}` : 0,
            kredit: ek.trx_dbcr === "K" ? `Rp. ${formatIdr(ek.trx_amnt)}` : 0,
            desc: ek.trx_desc,
          },
        });
        k += ek.trx_dbcr === "K" ? ek.trx_amnt : 0;
        d += ek.trx_dbcr === "D" ? ek.trx_amnt : 0;
      });
      val.push({
        trx_code: `(${el.trx_code}) ${el.trx_date}`,
        type: "footer",
        value: {
          acc: "Total",
          debit: `Rp. ${formatIdr(d)}`,
          kredit: `Rp. ${formatIdr(k)}`,
          desc: "",
        },
      });
      data.push(val);
    });

    let final = [{
      columns: [
        {
          title: `Period ${formatDate(date[0])} to ${formatDate(date[1])}`,
          width: { wch: 35 },
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          title: "",
          width: { wch: 15 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          title: "",
          width: { wch: 30 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          title: "",
          width: { wch: 40 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
      ],
      data: [[]],
    }];
    data.forEach((el) => {
      let item = [];
      el.forEach((ek) => {
        item.push([
          {
            value: `${ek.value.acc}`,
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
            value: `${ek.value.debit}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek.value.kredit}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek.value.desc}`,
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
        {
          value: "",
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: "",
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: "",
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
      ]);

      final.push({
        columns: [
          {
            title: `${el[0].trx_code}`,
            width: { wch: 35 },
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
              alignment: { horizontal: "right", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 30 },
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
            width: { wch: 40 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "left", vertical: "center" },
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
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between mb-3">
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
              filename={`journal_report_export_${new Date().getTime()}`}
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
                dataSet={trans ? jsonForExcel(trans, true) : null}
                name="Jurnal Report"
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
          <Card className="mb-3">
            <Card.Body>{renderHeader()}</Card.Body>
          </Card>
        </Col>
      </Row>

      <>
        <Row className="m-0 justify-content-center" ref={printPage}>
          {chunk(jsonForExcel(trans) ?? [], chunkSize)?.map((val, idx) => {
            return (
              <Card className="ml-1 mr-1 mt-2">
                <Card.Body className="p-0">
                  <CustomeWrapper
                    tittle={"Transaction Journal"}
                    subTittle={`Transaction Journal for Period ${formatDate(date[0])} to ${formatDate(date[1])}`}
                    page={idx + 1}
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
                                className="header-center"
                                header={(e) =>
                                  e.props.value
                                    ? e.props?.value[0]?.trx_code
                                    : null
                                }
                                style={{ width: "20rem" }}
                                body={(e) => (
                                  <div
                                    className={
                                      e.type == "header" || e.type == "footer"
                                        ? "font-weight-bold"
                                        : ""
                                    }
                                  >
                                    {e.value.acc}
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
                                      e.type == "header"
                                        ? "font-weight-bold text-right"
                                        : e.type == "footer"
                                        ? "font-weight-bold text-right"
                                        : "text-right"
                                    }
                                  >
                                    {e.value.debit}
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
                                      e.type == "header"
                                        ? "font-weight-bold text-right"
                                        : e.type == "footer"
                                        ? "font-weight-bold text-right"
                                        : "text-right"
                                    }
                                  >
                                    {e.value.kredit}
                                  </div>
                                )}
                              />
                              <Column
                                className="header-center"
                                header=""
                                style={{ width: "20rem" }}
                                body={(e) => (
                                  <div
                                    className={
                                      e.type === "header" || e.type === "footer"
                                        ? "font-weight-bold"
                                        : ""
                                    }
                                  >
                                    {e.value.desc}
                                  </div>
                                )}
                              />
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
      </>
    </>
  );
};

export default ReportJurnal;
