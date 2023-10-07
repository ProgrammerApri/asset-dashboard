import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Card, Col, Row } from "react-bootstrap";

import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Dropdown } from "primereact/dropdown";
import { Link } from "react-router-dom";
// import ExcelExportHelper from "../../../components/ExportExcel/ExcelExportHelper";
import { MultiSelect } from "primereact/multiselect";
import { tr } from "../../../../data/tr";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const UmurPiutangRingkasan = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [date, setDate] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [selectCus, setSelectCus] = useState(null);
  const [ar, setAr] = useState(null);
  const [arAll, setArAll] = useState(null);
  const [total, setTotal] = useState(null);
  const [cp, setCp] = useState("");
  const chunkSize = 10;

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
        let filt = [];
        let filt_acq = [];
        data.forEach((el) => {
          if (el.trx_dbcr === "D" && el.pay_type === "P1") {
            // if (el.lunas === false) {
            filt.push(el);
            // }
          }

          if (
            (el?.trx_dbcr === "K" && el?.pay_type === "J4") ||
            el?.pay_type === "P1"
          ) {
            filt_acq?.push(el);
          }
        });

        setAr(filt);
        setArAll(data);

        let grouped = filt?.filter(
          (el, i) =>
            i === filt.findIndex((ek) => el?.cus_id?.id === ek?.cus_id?.id)
        );
        setCustomer(grouped);
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

  const jsonForExcel = (ar, excel = false) => {
    let data = [];

    if (selectCus?.length) {
      selectCus.forEach((p) => {
        let amn = 0;
        let t_piut = 0;
        let t_jtx = 0;
        let t_day1x = 0;
        let t_day2x = 0;
        let t_day3x = 0;
        let t_day4x = 0;
        let t_olderx = 0;
        let receive = 0;
        let cus = null;

        let val = [
          {
            cus: `${p.cus_id?.cus_name} (${p.cus_id?.cus_code})`,
            type: "header",
            value: {
              cuss: "Customer",
              piut: "Receivable",
              jt: "Before Due",
              day1: "7 Day",
              day2: "14 Day",
              day3: "30 Day",
              day4: "60 Day",
              older: "Older",
              total: "Received ",
            },
          },
        ];

        ar?.forEach((ek) => {
          if (p?.cus_id?.id === ek.cus_id?.id) {
            let acq_amnh = 0;
            let due = new Date(`${ek?.trx_due}Z`);
            let diff = (date - due) / (1000 * 60 * 60 * 24);

            amn += ek.trx_dbcr === "D" ? ek.trx_amnh : ek.trx_amnh;

            arAll?.forEach((all) => {
              if (
                (all?.bkt_id && ek?.bkt_id?.id === all.bkt_id?.id) ||
                (all?.sa_id && ek?.sa_id?.id === all.sa_id?.id) ||
                (all?.kor_id && ek?.kor_id?.id === all.kor_id?.id)
              ) {
                if (all?.trx_dbcr === "K" && all?.pay_type === "J4") {
                  acq_amnh += all?.acq_amnh;
                }
                if (all?.trx_dbcr === "K" && all?.pay_type === "P1") {
                  acq_amnh +=
                    all?.trx_amnh != null && all?.acq_amnh !== null
                      ? all?.acq_amnh
                      : all?.trx_amnh;
                }
              }
            });

            t_piut += ek?.trx_amnh;

            t_jtx +=
              diff <= 0 ? (ek.trx_dbcr === "D" ? ek.trx_amnh : ek.trx_amnh) : 0;
            t_day1x +=
              diff <= 7 && diff > 0
                ? ek.trx_dbcr === "D"
                  ? ek.trx_amnh
                  : ek.trx_amnh
                : 0;
            t_day2x +=
              diff <= 14 && diff > 7
                ? ek.trx_dbcr === "D"
                  ? ek.trx_amnh
                  : ek.trx_amnh
                : 0;
            t_day3x +=
              diff <= 30 && diff > 14
                ? ek.trx_dbcr === "D"
                  ? ek.trx_amnh
                  : ek.trx_amnh
                : 0;
            t_day4x +=
              diff <= 60 && diff > 30
                ? ek.trx_dbcr === "D"
                  ? ek.trx_amnh
                  : ek.trx_amnh
                : 0;
            t_olderx +=
              diff > 60 ? (ek.trx_dbcr === "D" ? ek.trx_amnh : ek.trx_amnh) : 0;

            receive += acq_amnh;
          }
        });

        val.push({
          cus: cus,
          type: "item",
          value: {
            cuss: `${p.cus_id?.cus_name} (${p.cus_id?.cus_code})`,
            piut: `Rp. ${formatIdr(t_piut)}`,
            jt: `Rp. ${formatIdr(t_jtx)}`,
            day1: `Rp. ${formatIdr(t_day1x)}`,
            day2: `Rp. ${formatIdr(t_day2x)}`,
            day3: `Rp. ${formatIdr(t_day3x)}`,
            day4: `Rp. ${formatIdr(t_day4x)}`,

            older: `Rp. ${formatIdr(t_olderx)}`,

            total: `Rp. ${formatIdr(receive ?? 0)}`,
          },
        });
        data.push(val);
      });
    } else {
      let grouped = ar?.filter(
        (el, i) => i === ar?.findIndex((ek) => el.cus_id?.id == ek.cus_id?.id)
      );

      if (date) {
        grouped?.forEach((el) => {
          let val = [
            {
              // cus: `${p.cus_id?.cus_name} (${p.cus_id?.cus_code})`,
              type: "header",
              value: {
                cuss: "Customer",
                piut: "Receivable",
                jt: "Before Due",
                day1: "7 Day",
                day2: "14 Day",
                day3: "30 Day",
                day4: "60 Day",
                older: "Older",
                total: "Received ",
              },
            },
          ];

          let amn = 0;
          let t_piut = 0;
          let t_jtx = 0;
          let t_day1x = 0;
          let t_day2x = 0;
          let t_day3x = 0;
          let t_day4x = 0;
          let t_olderx = 0;
          let receive = 0;
          let cus = null;

          ar?.forEach((ek) => {
            if (el?.cus_id?.id === ek?.cus_id?.id) {
              let acq_amnh = 0;
              let due = new Date(`${ek?.trx_due}Z`);
              let diff = (date - due) / (1000 * 60 * 60 * 24);
              if (due <= date) {
                amn += ek.trx_dbcr === "D" ? ek.trx_amnh : ek.trx_amnh;

                arAll.forEach((all) => {
                  if (
                    (all?.bkt_id && ek?.bkt_id?.id === all.bkt_id?.id) ||
                    (all?.sa_id && ek?.sa_id?.id === all.sa_id?.id) ||
                    (all?.kor_id && ek?.kor_id?.id === all.kor_id?.id)
                  ) {
                    if (all?.trx_dbcr === "K" && all?.pay_type === "J4") {
                      acq_amnh += all?.acq_amnh;
                    }
                    if (all?.trx_dbcr === "K" && all?.pay_type === "P1") {
                      acq_amnh +=
                        all?.trx_amnh != null && all?.acq_amnh !== null
                          ? all?.acq_amnh
                          : all?.trx_amnh;
                    }
                  }
                });

                t_piut += ek?.trx_amnh;
                t_jtx +=
                  diff <= 0
                    ? ek.trx_dbcr === "D"
                      ? ek.trx_amnh - acq_amnh
                      : ek.trx_amnh
                    : 0;
                t_day1x +=
                  diff <= 7 && diff > 0
                    ? ek.trx_dbcr === "D"
                      ? ek.trx_amnh - acq_amnh
                      : ek.trx_amnh
                    : 0;
                t_day2x +=
                  diff <= 14 && diff > 7
                    ? ek.trx_dbcr === "D"
                      ? ek.trx_amnh - acq_amnh
                      : ek.trx_amnh
                    : 0;
                t_day3x +=
                  diff <= 30 && diff > 14
                    ? ek.trx_dbcr === "D"
                      ? ek.trx_amnh - acq_amnh
                      : ek.trx_amnh
                    : 0;
                t_day4x +=
                  diff <= 60 && diff > 30
                    ? ek.trx_dbcr === "D"
                      ? ek.trx_amnh - acq_amnh
                      : ek.trx_amnh
                    : 0;
                t_olderx +=
                  diff > 60
                    ? ek.trx_dbcr === "D"
                      ? ek.trx_amnh - acq_amnh
                      : ek.trx_amnh
                    : 0;
                receive += acq_amnh;
              }
            }
          });

          val.push({
            cus: cus,
            type: "item",
            value: {
              cuss: `${el.cus_id?.cus_name} (${el.cus_id?.cus_code})`,
              piut: `Rp. ${formatIdr(t_piut)}`,
              jt: `Rp. ${formatIdr(t_jtx)}`,
              day1: `Rp. ${formatIdr(t_day1x)}`,
              day2: `Rp. ${formatIdr(t_day2x)}`,
              day3: `Rp. ${formatIdr(t_day3x)}`,
              day4: `Rp. ${formatIdr(t_day4x)}`,

              older: `Rp. ${formatIdr(t_olderx)}`,

              total: `Rp. ${formatIdr(receive ?? 0)}`,
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
            title: "Receivable Aging Summary",
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
          value: `${ek[ek.length - 1].value.cuss}`,
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
    ]);

    final.push({
      columns: [
        {
          title: "Customer",
          width: { wch: 45 },
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
      ],
      data: item,
    });

    console.log("data", data);
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
                placeholder={tr[localStorage.getItem("language")].pilih_tgl}
                readOnlyInput
                dateFormat="dd-mm-yy"
              />
            </div>
            <div className="col-4">
              <MultiSelect
                value={selectCus ?? null}
                options={customer}
                onChange={(e) => {
                  setSelectCus(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_cus}
                optionLabel="cus_id.cus_name"
                filter
                filterBy="cus_id.cus_name"
                showClear
                display="chip"
                className="w-full md:w-22rem"
                maxSelectedLabels={3}
              />
            </div>
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            {/* <ExcelExportHelper
              json={ar ? jsonForExcel(ar, true) : null}
              filename={`Receivable_Aging_Summary_${formatDate(new Date())
                .replace("-", "")
                .replace("-", "")}`}
              sheetname="report"
            /> */}

            <ExcelFile
              filename={`Age_Receivable_Summary_${formatDate(
                new Date()
              ).replace("/", "")}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={ar ? jsonForExcel(ar, true) : null}
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
      <Row>
        <Col>
          <Card>
            <Card.Body>{renderHeader()}</Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="ml-0 pt-0 justify-content-center">
        {chunk(jsonForExcel(ar, false) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card>
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  viewOnly
                  horizontal
                  tittle={"Receivable Aging Summary"}
                  subTittle={`Receivable Aging Summary as of ${formatDate(
                    date
                  )}`}
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
                          header="Customer"
                          style={{ widht: "10rem" }}
                          field={(e) => e[e.length - 1]?.value?.cuss}
                          body={(e) => (
                            <Link
                              to={`/laporan/kartu-buku-besar-rincian/${btoa(
                                `m'${date.getMonth() + 1}`
                              )}/${btoa(`y'${date.getFullYear()}`)}/${btoa(
                                `kat'${e.kat}`
                              )}/${btoa(
                                btoa(JSON.stringify({ acc_id: e.acc_id }))
                              )}`}
                            >
                              <td className="header-center">
                                {e[e.length - 1]?.value?.cuss}
                              </td>
                            </Link>
                          )}
                        />
                        <Column
                          className="header-right text-right border-right"
                          header="Before Due                              "
                          style={{ minWidth: "10rem" }}
                          body={(e) => e[e.length - 1]?.value?.jt}
                        />
                        <Column
                          className="header-right text-right border-right"
                          header="7 Day"
                          style={{ minWidth: "10rem" }}
                          body={(e) => e[e.length - 1]?.value?.day1}
                        />
                        <Column
                          className="header-right text-right border-right"
                          header="14 Day"
                          style={{ minWidth: "10rem" }}
                          body={(e) => e[e.length - 1]?.value.day2}
                        />
                        <Column
                          className="header-right text-right border-right"
                          header="30 Day"
                          style={{ minWidth: "10rem" }}
                          body={(e) => e[e.length - 1]?.value?.day3}
                        />
                        <Column
                          className="header-right text-right border-right"
                          header="60 Day"
                          style={{ minWidth: "10rem" }}
                          body={(e) => e[e.length - 1]?.value?.day4}
                        />
                        <Column
                          className="header-right text-right border-right"
                          header="Older "
                          style={{ minWidth: "10rem" }}
                          body={(e) => e[e.length - 1]?.value?.older}
                        />
                        <Column
                          className="header-right text-right border-right"
                          header="Received "
                          style={{ minWidth: "10rem" }}
                          body={(e) => e[e.length - 1]?.value?.total}
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
            {chunk(jsonForExcel(ar, false) ?? [], chunkSize)?.map(
              (val, idx) => {
                return (
                  <Card>
                    <Card.Body className="p-0 m-0">
                      <CustomeWrapper
                        horizontal
                        tittle={"Receivable Aging Summary"}
                        subTittle={`Receivable Aging Summary as of ${formatDate(
                          date
                        )}`}
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
                                header="Customer"
                                style={{ widht: "10rem" }}
                                body={(e) => e[e.length - 1]?.value?.cuss}
                              />
                              <Column
                                className="header-right text-right border-right"
                                header="Receivable"
                                style={{ minWidth: "10rem" }}
                                body={(e) => e[e.length - 1]?.value?.jt}
                              />
                              <Column
                                className="header-right text-right border-right"
                                header="Before Due"
                                style={{ minWidth: "10rem" }}
                                body={(e) => e[e.length - 1]?.value?.jt}
                              />
                              <Column
                                className="header-right text-right border-right"
                                header="7 Day"
                                style={{ minWidth: "10rem" }}
                                body={(e) => e[e.length - 1]?.value?.day1}
                              />
                              <Column
                                className="header-right text-right border-right"
                                header="14 Day"
                                style={{ minWidth: "10rem" }}
                                body={(e) => e[e.length - 1]?.value.day2}
                              />
                              <Column
                                className="header-right text-right border-right"
                                header="30 Day"
                                style={{ minWidth: "10rem" }}
                                body={(e) => e[e.length - 1]?.value?.day3}
                              />
                              <Column
                                className="header-right text-right border-right"
                                header="60 Day"
                                style={{ minWidth: "10rem" }}
                                body={(e) => e[e.length - 1]?.value?.day4}
                              />
                              <Column
                                className="header-right text-right border-right"
                                header="Older "
                                style={{ minWidth: "10rem" }}
                                body={(e) => e[e.length - 1]?.value?.older}
                              />
                              <Column
                                className="header-right text-right border-right"
                                header="Received "
                                style={{ minWidth: "10rem" }}
                                body={(e) => e[e.length - 1]?.value?.total}
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

export default UmurPiutangRingkasan;
