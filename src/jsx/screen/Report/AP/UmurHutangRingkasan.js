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

import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Dropdown } from "primereact/dropdown";
// import { Link } from "@material-ui/core";
import { Link } from "react-router-dom";
// import ExcelExportHelper from "../../../components/ExportExcel/ExcelExportHelper";
import { MultiSelect } from "primereact/multiselect";
import formatIdr from "../../../../utils/formatIdr";
import { tr } from "../../../../data/tr";
// import formatIdr from "../../../../utils/formatIdr";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const UmurHutangRingkasan = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState(new Date());
  const [date, setDate] = useState(null);
  const [rawAP, setRawAP] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [selectSup, setSelectSup] = useState(null);
  const [ap, setAp] = useState(null);
  const [apAll, setApAll] = useState(null);
  const [total, setTotal] = useState(null);
  const [cp, setCp] = useState("");
  const chunkSize = 15;

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
        let filt = [];
        data.forEach((el) => {
          // if (!el.lunas) {
          if (el.trx_dbcr === "k" && el?.pay_type === "P1") {
            filt.push(el);
            // }
          }
        });
        setAp(filt);
        setApAll(data);

        let grouped = filt?.filter(
          (el, i) =>
            i === filt.findIndex((ek) => el?.sup_id?.id === ek?.sup_id?.id)
        );
        setSupplier(grouped);
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

    if (selectSup?.length) {
      selectSup.forEach((p) => {
        let amn = 0;
        let hut = 0;
        let t_jt = 0;
        let t_day1 = 0;
        let t_day2 = 0;
        let t_day3 = 0;
        let t_day4 = 0;
        let t_older = 0;
        let t_pay = 0;
        let sup = null;
        let sup_id = null;

        let val = [
          {
            sup: `${p.sup_id?.sup_name} (${p.sup_id?.sup_code})`,
            type: "header",
            value: {
              supp: tr[localStorage.getItem("language")].pemasok,
              hut: "Payable",
              jt: "Before Due ",
              day1: "7 Day",
              day2: "14 Day",
              day3: "30 Day",
              day4: "60 Day",
              older: "Older ",
              total: "Payment ",
            },
          },
        ];

        ap?.forEach((ek) => {
          console.log("ap", ap);
          if (p?.sup_id?.id === ek.sup_id?.id) {
            let acq_amnh = 0;
            let due = new Date(`${ek?.ord_due}Z`);
            let diff = (date - due) / (1000 * 60 * 60 * 24);
            apAll?.forEach((all) => {
              if (
                (all?.ord_id && ek?.ord_id?.id === all.ord_id?.id) ||
                (all?.sa_id && ek?.sa_id?.id === all.sa_id?.id) ||
                (all?.kor_id && ek?.kor_id?.id === all.kor_id?.id)
              ) {
                if (all?.trx_dbcr === "d" && all?.pay_type === "H4") {
                  acq_amnh += all?.acq_amnh;
                }
                if (all?.trx_dbcr === "d" && all?.pay_type === "P1") {
                  acq_amnh += all?.trx_amnh != null && all?.acq_amnh !== null
                    ? all?.acq_amnh
                    : all?.trx_amnh;
                }
              }
            });

            hut += ek?.trx_amnh;
            t_pay += acq_amnh;

            if (due <= filtDate) {
              // sup = `${ek.sup_id?.sup_name} (${ek.sup_id?.sup_code})`;
              sup_id = ek.sup_id?.id;
              amn += ek.trx_dbcr === "k" ? ek.trx_amnh : ek.trx_amnh;

              t_jt += diff <= 0 ? ek.trx_amnh - acq_amnh : 0;
              t_day1 += diff <= 7 && diff > 0 ? ek.trx_amnh - acq_amnh : 0;
              t_day2 += diff <= 14 && diff > 7 ? ek.trx_amnh - acq_amnh : 0;
              t_day3 += diff <= 30 && diff > 14 ? ek.trx_amnh - acq_amnh : 0;
              t_day4 += diff <= 60 && diff > 30 ? ek.trx_amnh - acq_amnh : 0;
              t_older += diff > 60 ? ek.trx_amnh - acq_amnh : 0;
            }
          }
        });

        val.push({
          sup: ``,
          type: "item",
          value: {
            supp: `${p.sup_id?.sup_name} (${p.sup_id?.sup_code})`,
            sup_id: sup_id,
            hut: `${formatIdr(hut)}`,
            jt: `${formatIdr(t_jt)}`,
            day1: `${formatIdr(t_day1)}`,
            day2: `${formatIdr(t_day2)}`,
            day3: `${formatIdr(t_day3)}`,
            day4: `${formatIdr(t_day4)}`,

            older: `${formatIdr(t_older)}`,

            total: `${formatIdr(t_pay)}`,
          },
        });

        data.push(val);
      });
    } else {
      let grouped = ap?.filter(
        (el, i) => i === ap.findIndex((ek) => el?.sup_id?.id === ek?.sup_id?.id)
      );

      if (date) {
        let total_hut = 0;
        let total_bd = 0;
        let total_d1 = 0;
        let total_d2 = 0;
        let total_d3 = 0;
        let total_d4 = 0;
        let total_old = 0;
        let total_pay = 0;

        grouped?.forEach((ek) => {
          let val = [
            {
              sup: ``,
              type: "header",
              value: {
                supp: tr[localStorage.getItem("language")].pemasok,
                hut: "Payable",
                jt: "Before Due ",
                day1: "7 Day",
                day2: "14 Day",
                day3: "30 Day",
                day4: "60 Day",
                older: "Older ",
                total: "Payment ",
              },
            },
          ];

          let amn = 0;
          let t_hut = 0;
          let t_jt = 0;
          let t_day1 = 0;
          let t_day2 = 0;
          let t_day3 = 0;
          let t_day4 = 0;
          let t_older = 0;
          let t_pay = 0;
          let sup = null;
          let sup_id = null;

          ap?.forEach((el) => {
            if (ek.sup_id?.id === el.sup_id?.id) {
              // if (p?.sup_id?.id === ek.sup_id?.id) {
              let acq_amnh = 0;
              let due = new Date(`${el?.ord_due}Z`);
              let diff = (date - due) / (1000 * 60 * 60 * 24);
              apAll?.forEach((all) => {
                if (
                  (all?.ord_id && el?.ord_id?.id === all.ord_id?.id) ||
                  (all?.sa_id && el?.sa_id?.id === all.sa_id?.id) ||
                  (all?.kor_id && el?.kor_id?.id === all.kor_id?.id)
                ) {
                  if (all?.trx_dbcr === "d" && all?.pay_type === "H4") {
                    acq_amnh += all?.acq_amnh;
                  }
                  if (all?.trx_dbcr === "d" && all?.pay_type === "P1") {
                    acq_amnh += all?.trx_amnh != null && all?.acq_amnh !== null
                      ? all?.acq_amnh
                      : all?.trx_amnh;
                  }
                }
              });

              t_hut += el?.trx_amnh;
              t_pay += acq_amnh;

              // if (due <= filtDate) {
              // sup = `${el.sup_id?.sup_name} (${el.sup_id?.sup_code})`;
              sup_id = el.sup_id?.id;
              amn += el.trx_dbcr === "k" ? el.trx_amnh : el.trx_amnh;

              t_jt += diff <= 0 ? el.trx_amnh : 0;
              t_day1 += diff <= 7 && diff > 0 ? el.trx_amnh - acq_amnh : 0;
              t_day2 += diff <= 14 && diff > 7 ? el.trx_amnh - acq_amnh : 0;
              t_day3 += diff <= 30 && diff > 14 ? el.trx_amnh - acq_amnh : 0;
              t_day4 += diff <= 60 && diff > 30 ? el.trx_amnh - acq_amnh : 0;
              t_older += diff > 60 ? el.trx_amnh - acq_amnh : 0;
              // }
            }
          });

          val.push({
            sup: ``,
            type: "item",
            value: {
              supp: `${ek.sup_id?.sup_name} (${ek.sup_id?.sup_code})`,
              sup_id: ek?.sup_id?.id,
              hut: `${formatIdr(t_hut)}`,
              jt: `${formatIdr(t_jt)}`,
              day1: `${formatIdr(t_day1)}`,
              day2: `${formatIdr(t_day2)}`,
              day3: `${formatIdr(t_day3)}`,
              day4: `${formatIdr(t_day4)}`,
              older: `${formatIdr(t_older)}`,
              total: `${formatIdr(t_pay)}`,
            },
          });
          data.push(val);
        });
      }
    }

    let final = [
      {
        columns: [
          {
            title: "Summary Debt Age",
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

    let item = [];
    data.forEach((ek) => {
      item.push([
        {
          value: `${ek[ek.length - 1].value.supp}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: `${ek[ek.length - 1].value.jt}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek[ek.length - 1].value.day1}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek[ek.length - 1].value.day2}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek[ek.length - 1].value.day3}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek[ek.length - 1].value.day4}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek[ek.length - 1].value.older}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },

        {
          value: `${ek[ek.length - 1].value.total}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
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
      {
        value: "",
        style: {
          font: { sz: "14", bold: false },
          alignment: { horizontal: "right", vertical: "center" },
        },
      },
      {
        value: "",
        style: {
          font: { sz: "14", bold: false },
          alignment: { horizontal: "right", vertical: "center" },
        },
      },

      {
        value: "",
        style: {
          font: { sz: "14", bold: false },
          alignment: { horizontal: "right", vertical: "center" },
        },
      },
      {
        value: "",
        style: {
          font: { sz: "14", bold: false },
          alignment: { horizontal: "right", vertical: "center" },
        },
      },
      {
        value: "",
        style: {
          font: { sz: "14", bold: false },
          alignment: { horizontal: "right", vertical: "center" },
        },
      },
      {
        value: "",
        style: {
          font: { sz: "14", bold: false },
          alignment: { horizontal: "right", vertical: "center" },
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
          title: tr[localStorage.getItem("language")].pemasok,
          width: { wch: 30 },
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
          title: "Before Due",
          width: { wch: 20 },
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
          title: "7 Day",
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
          title: "14 Day",
          width: { wch: 20 },
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
          title: "30 Day",
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
          title: "60 Day",
          width: { wch: 20 },
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
          title: "Older",
          width: { wch: 20 },
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
          title: "Total",
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
      ],
      data: item,
    });

    console.log(data);

    if (excel) {
      return final;
    } else {
      return data;
    }
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
                placeholder={tr[localStorage.getItem("language")].pilih_tgl}
                readOnlyInput
                dateFormat="dd-mm-yy"
              />
            </div>
            <div className="col-4">
              <MultiSelect
                value={selectSup ?? null}
                options={supplier}
                onChange={(e) => {
                  setSelectSup(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_sup}
                optionLabel="sup_id.sup_name"
                filter
                filterBy="sup_id.sup_name"
                showClear
                display="chip"
                className="w-full md:w-20rem"
                maxSelectedLabels={3}
              />
            </div>
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            {/* <ExcelExportHelper
              json={ap ? jsonForExcel(ap, true) : null}
              filename={`Summary Debt Age_export_${new Date().getTime()}`}
              sheetname="report"
            /> */}

            <ExcelFile
              filename={`Summary Debt Age_export_${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={ap ? jsonForExcel(ap, true) : null}
                name={"Report"}
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

  const formatIdr = (value) => {
    return `Rp. ${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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

      <Row className="ml-0 pt-0 justify-content-center">
        {chunk(jsonForExcel(ap, false) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card>
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  viewOnly
                  horizontal
                  tittle={"Summary Debt Age"}
                  subTittle={`Summary Debt Age as of ${formatDate(date)}`}
                  onComplete={(cp) => setCp(cp)}
                  page={idx + 1}
                  body={
                    <>
                      <DataTable
                        responsiveLayout="scroll"
                        value={val}
                        showGridlines
                        dataKey="id"
                        rowHover
                        emptyMessage={
                          tr[localStorage.getItem("language")].data_kosong
                        }
                      >
                        <Column
                          className="border-right border-left"
                          header={tr[localStorage.getItem("language")].pemasok}
                          style={{ width: "20rem" }}
                          field={(e) => e[e.length - 1]?.value?.supp}
                          body={(e) => (
                            <Link
                              to={`/laporan/ap/umur-hutang-rincian/${btoa(
                                `m'${filtDate?.getMonth() + 1}`
                              )}/${btoa(`y'${filtDate?.getFullYear()}`)}/${btoa(
                                btoa(
                                  JSON.stringify({
                                    id: e.value?.sup_id,
                                  })
                                )
                              )}`}
                            >
                              <td className="header-center">
                                {e[e.length - 1]?.value?.supp}
                              </td>
                            </Link>
                          )}
                        />
                        <Column
                          className="header-right text-right border-right"
                          header="Payable"
                          style={{ width: "10rem" }}
                          body={(e) => e[e.length - 1].value.hut}
                        />
                        <Column
                          className="header-right text-right border-right"
                          header="Before Due"
                          style={{ width: "10rem" }}
                          body={(e) => e[e.length - 1].value.jt}
                        />
                        <Column
                          className="header-right text-right border-right"
                          header="7 Day"
                          style={{ width: "10rem" }}
                          body={(e) => e[e.length - 1].value.day1}
                        />
                        <Column
                          className="header-right text-right border-right"
                          header="14 Day"
                          style={{ width: "10rem" }}
                          body={(e) => e[e.length - 1].value.day2}
                        />
                        <Column
                          className="header-right text-right border-right"
                          header="30 Day"
                          style={{ width: "10rem" }}
                          body={(e) => e[e.length - 1].value.day3}
                        />
                        <Column
                          className="header-right text-right border-right"
                          header="60 Day"
                          style={{ width: "10rem" }}
                          body={(e) => e[e.length - 1].value.day4}
                        />
                        <Column
                          className="header-right text-right border-right"
                          header="Older"
                          style={{ width: "10rem" }}
                          body={(e) => e[e.length - 1].value.older}
                        />

                        <Column
                          className="header-right text-right border-right"
                          header="Payment"
                          style={{ width: "10rem" }}
                          body={(e) => e[e.length - 1].value.total}
                        />
                      </DataTable>
                    </>
                  }
                />
              </Card.Body>
            </Card>
          );
        })}
      </Row>

      <Row className="ml-0 pt-0 justify-content-center d-none">
        <Card>
          <Card.Body className="p-0 m-0" ref={printPage}>
            {chunk(jsonForExcel(ap, false) ?? [], chunkSize)?.map(
              (val, idx) => {
                return (
                  <Card>
                    <Card.Body className="p-0 m-0">
                      <CustomeWrapper
                        horizontal
                        tittle={"Summary Debt Age"}
                        subTittle={`Summary Debt Age as of ${formatDate(date)}`}
                        onComplete={(cp) => setCp(cp)}
                        page={idx + 1}
                        body={
                          <>
                            <DataTable
                              responsiveLayout="scroll"
                              value={val}
                              showGridlines
                              dataKey="id"
                              rowHover
                              emptyMessage={
                                tr[localStorage.getItem("language")].data_kosong
                              }
                            >
                              <Column
                                className="border-right border-left"
                                header={
                                  tr[localStorage.getItem("language")].pemasok
                                }
                                style={{ width: "20rem" }}
                                body={(e) => e[e.length - 1]?.value?.supp}
                              />
                              <Column
                                className="header-right text-right border-right"
                                header="Before Due"
                                style={{ width: "10rem" }}
                                body={(e) => e[e.length - 1].value.jt}
                              />
                              <Column
                                className="header-right text-right border-right"
                                header="7 Day"
                                style={{ width: "10rem" }}
                                body={(e) => e[e.length - 1].value.day1}
                              />
                              <Column
                                className="header-right text-right border-right"
                                header="14 Day"
                                style={{ width: "10rem" }}
                                body={(e) => e[e.length - 1].value.day2}
                              />
                              <Column
                                className="header-right text-right border-right"
                                header="30 Day"
                                style={{ width: "10rem" }}
                                body={(e) => e[e.length - 1].value.day3}
                              />
                              <Column
                                className="header-right text-right border-right"
                                header="60 Day"
                                style={{ width: "10rem" }}
                                body={(e) => e[e.length - 1].value.day4}
                              />
                              <Column
                                className="header-right text-right border-right"
                                header="Older"
                                style={{ width: "10rem" }}
                                body={(e) => e[e.length - 1].value.older}
                              />

                              <Column
                                className="header-right text-right border-right"
                                header="Total"
                                style={{ width: "10rem" }}
                                body={(e) => e[e.length - 1].value.total}
                              />
                            </DataTable>
                          </>
                        }
                      />
                    </Card.Body>
                  </Card>
                );
              }
            )}
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default UmurHutangRingkasan;
