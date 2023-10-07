import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
// import formatIdr from "../../../../utils/formatIdr";
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
// import ExcelExportHelper from "../../../components/ExportExcel/ExcelExportHelper";
import { MultiSelect } from "primereact/multiselect";
import formatIdr from "../../../../utils/formatIdr";
import { tr } from "../../../../data/tr";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const UmurHutang = ({ month, year, id }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [date, setDate] = useState(
    year && month ? new Date(year, month - 1, 1) : null
  );
  const [rawAP, setRawAP] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [selectSup, setSelectSup] = useState(null);
  const [ap, setAp] = useState(null);
  const [apAll, setApAll] = useState(null);
  const [total, setTotal] = useState(null);
  const [cp, setCp] = useState("");
  const chunkSize = 10;

  useEffect(() => {
    getAPCard(id);
  }, []);

  const getAPCard = async (sup_id) => {
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
          if (el.trx_dbcr === "k" && el?.pay_type === "P1") {
            // if (!el.lunas) {
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

        if (sup_id) {
          grouped?.forEach((el) => {
            if (el.sup_id?.id === Number(sup_id)) {
              setSelectSup([el]);
            }
          });
        }
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
        let val = [
          {
            sup: `${p.sup_id?.sup_name} \n (${p.sup_id?.sup_code})`,
            type: "header",
            value: {
              fk: "Trans Code",
              tgl: "Date",
              due: "Due Date",
              nota: "Payable",
              jt: "Before Due",
              day1: "7 Day",
              day2: "14 Day",
              day3: "30 Day",
              day4: "60 Day",
              older: "Older",
              rtr: "Payment",
              total: "Total",
              giro: "Giro",
            },
          },
        ];

        let t_hut = 0;
        let t_jt = 0;
        let t_day1 = 0;
        let t_day2 = 0;
        let t_day3 = 0;
        let t_day4 = 0;
        let t_older = 0;
        let t_pay = 0;

        ap?.forEach((ek) => {
          if (p?.sup_id?.id === ek.sup_id?.id) {
            let acq_amnh = 0;
            let dt = new Date(`${ek?.ord_date}Z`);
            let due = new Date(`${ek?.ord_due}Z`);
            let diff = (date - due) / (1000 * 60 * 60 * 24);

            if (dt <= date) {
              apAll.forEach((all) => {
                if (
                  (all?.ord_id && ek?.ord_id?.id === all.ord_id?.id) ||
                  (all?.sa_id && ek?.sa_id?.id === all.sa_id?.id) ||
                  (all?.kor_id && ek?.kor_id?.id === all.kor_id?.id)
                ) {
                  if (all?.trx_dbcr === "d" && all?.pay_type === "H4") {
                    acq_amnh += all?.acq_amnh;
                  }
                  if (all?.trx_dbcr === "d" && all?.pay_type === "P1") {
                    acq_amnh += all?.trx_amnh;
                  }
                }
              });

              val.push({
                sup: `${ek.sup_id?.sup_name} \n (${ek.sup_id?.sup_code})`,
                type: "item",
                value: {
                  fk: ek.trx_code,
                  tgl: formatDate(ek?.ord_date),
                  due: formatDate(ek?.ord_due),
                  nota: ` ${formatIdr(ek?.trx_amnh)}`,
                  jt:
                    diff <= 0
                      ? `${formatIdr(ek.trx_amnh - acq_amnh)}`
                      : formatIdr(0),
                  day1:
                    diff <= 7 && diff > 0
                      ? `${formatIdr(ek.trx_amnh - acq_amnh)}`
                      : formatIdr(0),
                  day2:
                    diff <= 14 && diff > 7
                      ? `${formatIdr(ek.trx_amnh - acq_amnh)}`
                      : formatIdr(0),
                  day3:
                    diff <= 30 && diff > 14
                      ? `${formatIdr(ek.trx_amnh - acq_amnh)}`
                      : formatIdr(0),
                  day4:
                    diff <= 60 && diff > 30
                      ? `${formatIdr(ek.trx_amnh - acq_amnh)}`
                      : formatIdr(0),
                  older:
                    diff > 60
                      ? `${formatIdr(ek.trx_amnh - acq_amnh)}`
                      : formatIdr(0),
                  rtr: `${formatIdr(acq_amnh)}`,
                  total: `${formatIdr(
                    ek.trx_dbcr === "k" ? ek.trx_amnh : ek.trx_amnh
                  )}`,
                  giro: `${formatIdr(0)}`,
                },
              });

              t_hut += ek.trx_amnh;
              t_jt += diff <= 0 ? ek.trx_amnh : 0;
              t_day1 += diff <= 7 && diff > 0 ? ek.trx_amnh - acq_amnh : 0;
              t_day2 += diff <= 14 && diff > 7 ? ek.trx_amnh - acq_amnh : 0;
              t_day3 += diff <= 30 && diff > 14 ? ek.trx_amnh - acq_amnh : 0;
              t_day4 += diff <= 60 && diff > 30 ? ek.trx_amnh - acq_amnh : 0;
              t_older += diff > 60 ? ek.trx_amnh - acq_amnh : 0;
              t_pay += acq_amnh;
            }
          }
        });

        val.push({
          // sup: `${ek.sup_id?.sup_name} (${ek.sup_id?.sup_code})`,
          type: "footer",
          value: {
            fk: "Total",
            tgl: "",
            due: "",
            nota: formatIdr(t_hut),
            jt: formatIdr(t_jt),
            day1: formatIdr(t_day1),
            day2: formatIdr(t_day2),
            day3: formatIdr(t_day3),
            day4: formatIdr(t_day4),
            older: formatIdr(t_older),
            rtr: formatIdr(t_pay),
            total: ``,
            giro: ``,
          },
        });

        data.push(val);
      });
    } else {
      if (date) {
        let grouped = supplier?.filter(
          (el, i) =>
            i === supplier.findIndex((ek) => el?.sup_id?.id === ek?.sup_id?.id)
        );

        grouped?.forEach((p) => {
          let t_jt = 0;
          let t_day1 = 0;
          let t_day2 = 0;
          let t_day3 = 0;
          let t_day4 = 0;
          let t_older = 0;
          let t_hut = 0;
          let t_pay = 0;

          let val = [
            {
              sup: `${p?.sup_id?.sup_name} \n (${p?.sup_id?.sup_code})`,
              type: "header",
              value: {
                fk: "Trans Code",
                tgl: "Date",
                due: "Due Date",
                nota: "Payable",
                jt: "Before Due",
                day1: "7 Day",
                day2: "14 Day",
                day3: "30 Day",
                day4: "60 Day",
                older: "Older",
                rtr: "Payment",
                total: "Total",
                giro: "Giro",
              },
            },
          ];

          ap?.forEach((ek) => {
            if (p?.sup_id?.id === ek?.sup_id?.id) {
              let acq_amnh = 0;

              let dt = new Date(`${ek?.ord_date}Z`);
              let due = new Date(`${ek?.ord_due}Z`);
              let diff = (date - due) / (1000 * 60 * 60 * 24);

              if (dt <= date) {
                apAll.forEach((all) => {
                  if (
                    (all?.ord_id && ek?.ord_id?.id === all.ord_id?.id) ||
                    (all?.sa_id && ek?.sa_id?.id === all.sa_id?.id) ||
                    (all?.kor_id && ek?.kor_id?.id === all.kor_id?.id)
                  ) {
                    if (all?.trx_dbcr === "d" && all?.pay_type === "H4") {
                      acq_amnh += all?.acq_amnh;
                    }
                    if (all?.trx_dbcr === "d" && all?.pay_type === "P1") {
                      acq_amnh += all?.trx_amnh;
                    }
                  }
                });

                val.push({
                  sup: `${ek.sup_id?.sup_name} \n (${ek.sup_id?.sup_code})`,
                  type: "item",
                  value: {
                    fk: ek.trx_code,
                    tgl: formatDate(ek?.ord_date),
                    due: formatDate(ek?.ord_due),
                    nota: ` ${formatIdr(ek?.trx_amnh)}`,
                    jt: diff <= 0 ? `${formatIdr(ek.trx_amnh)}` : formatIdr(0),
                    day1:
                      diff <= 7 && diff > 0
                        ? `${formatIdr(ek.trx_amnh - acq_amnh)}`
                        : formatIdr(0),
                    day2:
                      diff <= 14 && diff > 7
                        ? `${formatIdr(ek.trx_amnh - acq_amnh)}`
                        : formatIdr(0),
                    day3:
                      diff <= 30 && diff > 14
                        ? `${formatIdr(ek.trx_amnh - acq_amnh)}`
                        : formatIdr(0),
                    day4:
                      diff <= 60 && diff > 30
                        ? `${formatIdr(ek.trx_amnh - acq_amnh)}`
                        : formatIdr(0),
                    older:
                      diff > 60
                        ? `${formatIdr(ek.trx_amnh - acq_amnh)}`
                        : formatIdr(0),
                    rtr: `${formatIdr(acq_amnh)}`,
                    total: `${formatIdr(
                      ek.trx_dbcr === "k" ? ek.trx_amnh : ek.trx_amnh
                    )}`,
                    giro: `${formatIdr(0)}`,
                  },
                });

                t_hut += ek.trx_amnh;
                t_jt += diff <= 0 ? ek.trx_amnh - acq_amnh : 0;
                t_day1 += diff <= 7 && diff > 0 ? ek.trx_amnh - acq_amnh : 0;
                t_day2 += diff <= 14 && diff > 7 ? ek.trx_amnh - acq_amnh : 0;
                t_day3 += diff <= 30 && diff > 14 ? ek.trx_amnh - acq_amnh : 0;
                t_day4 += diff <= 60 && diff > 30 ? ek.trx_amnh - acq_amnh : 0;
                t_older += diff > 60 ? ek.trx_amnh - acq_amnh : 0;
                t_pay += acq_amnh;
              }
            }
          });

          val.push({
            // sup: `${ek.sup_id?.sup_name} (${ek.sup_id?.sup_code})`,
            type: "footer",
            value: {
              fk: "Total",
              tgl: "",
              due: "",
              nota: formatIdr(t_hut),
              jt: formatIdr(t_jt),
              day1: formatIdr(t_day1),
              day2: formatIdr(t_day2),
              day3: formatIdr(t_day3),
              day4: formatIdr(t_day4),
              older: formatIdr(t_older),
              rtr: formatIdr(t_pay),
              total: ``,
              giro: ``,
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
            title: "Age of Debt Details",
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
          {
            value: `${ek.value.nota}`,
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
            value: `${ek.value.rtr}`,
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
      ]);

      final.push({
        columns: [
          {
            title: `${el[0]?.sup}`,
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
    });

    if (excel) {
      return final;
    } else {
      let page = [];

      data?.forEach((element) => {
        element?.forEach((el) => {
          page.push(el);
        });
      });
      return page;
    }
  };

  const formatIdr = (value) => {
    return `Rp. ${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  // const formatIdr = (value) => {
  //   return `${value}`
  //     .replace(".", ",")
  //     .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  // };

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
              filename={`Age of Debt Details_export_${new Date().getTime()}`}
              sheetname="report"
            /> */}

            <ExcelFile
              filename={`Age of Debt Details_export_${new Date().getTime()}`}
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
                  tittle={"Age of Debt Details"}
                  subTittle={`Age of Debt Details as of ${formatDate(date)}`}
                  onComplete={(cp) => setCp(cp)}
                  page={idx + 1}
                  body={
                    <>
                      {val.map((v) => {
                        if (v.type === "header") {
                          return (
                            <>
                              <div className="header-report single">
                                {v.sup}
                              </div>
                              <div className="header-report row m-0">
                                <div style={{ width: "7vw" }}>{v.value.fk}</div>
                                <div style={{ width: "5vw" }}>
                                  {v.value.tgl}
                                </div>
                                <div style={{ width: "5vw" }}>
                                  {v.value.due}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.nota}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.jt}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.day1}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.day2}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.day3}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.day4}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.older}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.rtr}
                                </div>
                              </div>
                            </>
                          );
                        } else if (v.type === "item") {
                          return (
                            <>
                              <div className="item-report row m-0">
                                <div style={{ width: "7vw" }}>{v.value.fk}</div>
                                <div style={{ width: "5vw" }}>
                                  {v.value.tgl}
                                </div>
                                <div style={{ width: "5vw" }}>
                                  {v.value.due}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.nota}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.jt}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.day1}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.day2}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.day3}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.day4}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.older}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.rtr}
                                </div>
                              </div>
                            </>
                          );
                        } else if (v.type === "footer") {
                          return (
                            <>
                              <div className="footer-report row m-0 mb-4">
                                <div style={{ width: "7vw" }}>{v.value.fk}</div>
                                <div style={{ width: "5vw" }}>
                                  {v.value.tgl}
                                </div>
                                <div style={{ width: "5vw" }}>
                                  {v.value.due}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.nota}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.jt}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.day1}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.day2}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.day3}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.day4}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.older}
                                </div>
                                <div
                                  className="col text-right"
                                  // style={{ width: "10vw" }}
                                >
                                  {v.value.rtr}
                                </div>
                              </div>
                            </>
                          );
                        }
                      })}
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
                        tittle={"Age of Debt Details"}
                        subTittle={`Age of Debt Details as of ${formatDate(
                          date
                        )}`}
                        onComplete={(cp) => setCp(cp)}
                        page={idx + 1}
                        body={
                          <>
                            {val.map((v) => {
                              if (v.type === "header") {
                                return (
                                  <>
                                    <div className="header-report single">
                                      {v.sup}
                                    </div>
                                    <div className="header-report row m-0">
                                      <div style={{ width: "7vw" }}>
                                        {v.value.fk}
                                      </div>
                                      <div style={{ width: "5vw" }}>
                                        {v.value.tgl}
                                      </div>
                                      <div style={{ width: "5vw" }}>
                                        {v.value.due}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.nota}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.jt}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.day1}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.day2}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.day3}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.day4}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.older}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.rtr}
                                      </div>
                                    </div>
                                  </>
                                );
                              } else if (v.type === "item") {
                                return (
                                  <>
                                    <div className="item-report row m-0">
                                      <div style={{ width: "7vw" }}>
                                        {v.value.fk}
                                      </div>
                                      <div style={{ width: "5vw" }}>
                                        {v.value.tgl}
                                      </div>
                                      <div style={{ width: "5vw" }}>
                                        {v.value.due}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.nota}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.jt}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.day1}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.day2}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.day3}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.day4}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.older}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.rtr}
                                      </div>
                                    </div>
                                  </>
                                );
                              } else if (v.type === "footer") {
                                return (
                                  <>
                                    <div className="footer-report row m-0 mb-4">
                                      <div style={{ width: "7vw" }}>
                                        {v.value.fk}
                                      </div>
                                      <div style={{ width: "5vw" }}>
                                        {v.value.tgl}
                                      </div>
                                      <div style={{ width: "5vw" }}>
                                        {v.value.due}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.nota}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.jt}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.day1}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.day2}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.day3}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.day4}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.older}
                                      </div>
                                      <div
                                        className="col text-right"
                                        // style={{ width: "10vw" }}
                                      >
                                        {v.value.rtr}
                                      </div>
                                    </div>
                                  </>
                                );
                              }
                            })}
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

export default UmurHutang;
