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
import { Dropdown } from "primereact/dropdown";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const UmurPiutangRingkasan = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [date, setDate] = useState(new Date());
  const [customer, setCustomer] = useState(null);
  const [selectCus, setSelectCus] = useState(null);
  const [ar, setAr] = useState(null);
  const [total, setTotal] = useState(null);
  const [cp, setCp] = useState("");
  const chunkSize = 5;

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

        let grouped = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.cus_id?.id === ek?.cus_id?.id)
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

    if (selectCus) {
      ar?.forEach((el) => {
        if (selectCus?.cus_id?.id === el.customer?.id) {
          let val = [
            // {
            //   cus: "Stock",
            //   type: "header",
            //   value: {
            //     ref: "Code Customer",
            //     cuss: "Customer",
            //     jt: "Before Due",
            //     day1: "7(HC)/(FC)",
            //     day2: "14 (HC)/(FC)",
            //     day3: "30 (HC)/(FC)",
            //     day4: "60 (HC)/(FC)",
            //     older: "Older (HC)/(FC)",
            //     nota: "Nota Debit",
            //     rtr: "Retur",
            //     total: "Total (HC)/(FC)",
            //     giro: "Giro (HC)/(FC)",
            //   },
            // },
          ];
          let amn = 0;
          let t_jtx = 0;
          let t_day1x = 0;
          let t_day2x = 0;
          let t_day3x = 0;
          let t_day4x = 0;
          let t_olderx = 0;
          el.ar.forEach((ek) => {
            let due = new Date(`${ek?.trx_due}Z`);
            let diff = (date - due) / (1000 * 60 * 60 * 24);
            val.push({
              cus:  `${el.customer.cus_name} (${el.customer.cus_code})`,
              type: "item",
              value: {
                ref: `${el.customer.cus_code}`,
                cuss: `${el.customer.cus_name}`,
                jt: `Rp. ${formatIdr(t_jtx)}`,
                day1:
                  diff <= 7 && diff > 0 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
                day2:
                  diff <= 14 && diff > 7
                    ? `Rp. ${formatIdr(ek.trx_amnh)}`
                    : "-",
                day3:
                  diff <= 30 && diff > 14
                    ? `Rp. ${formatIdr(ek.trx_amnh)}`
                    : "-",
                day4:
                  diff <= 60 && diff > 30
                    ? `Rp. ${formatIdr(ek.trx_amnh)}`
                    : "-",
                older: diff > 60 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
                nota: `Rp. ${formatIdr(0)}`,
                rtr: `Rp. ${formatIdr(0)}`,
                total: `Rp. ${formatIdr(ek.trx_amnh)}`,
                giro: `Rp. ${formatIdr(0)}`,
              },
            });
            amn += ek.trx_amnh;
            t_jtx += diff <= 0 ? ek.trx_amnh : 0;
            t_day1x += diff <= 7 && diff > 0 ? ek.trx_amnh : 0;
            t_day2x += diff <= 14 && diff > 7 ? ek.trx_amnh : 0;
            t_day3x += diff <= 30 && diff > 14 ? ek.trx_amnh : 0;
            t_day4x += diff <= 60 && diff > 30 ? ek.trx_amnh : 0;
            t_olderx += diff > 60 ? ek.trx_amnh : 0;
          });
          // val.push({
          //   cus: `${el.customer.cus_name} (${el.customer.cus_code})`,
          //   type: "footer",
          //   value: {
          //     ref: "Total",
          //     cuss: "",
          //     jt: `Rp. ${formatIdr(t_jtx)}`,
          //     day1: `Rp. ${formatIdr(t_day1x)}`,
          //     day2: `Rp. ${formatIdr(t_day2x)}`,
          //     day3: `Rp. ${formatIdr(t_day3x)}`,
          //     day4: `Rp. ${formatIdr(t_day4x)}`,
          //     older: `Rp. ${formatIdr(t_olderx)}`,
          //     nota: "",
          //     rtr: "",
          //     total: `Rp. ${formatIdr(amn)}`,
          //   },
          // });
          data.push(val);
        }
      });
    } else {
      ar?.forEach((el) => {
        let val = [
          // {
          //   cus: "",
          //   type: "header",
          //   value: {
          //     ref: "Code",
          //     cuss: "Customer",
          //     jt: "Before Due",
          //     day1: "7(HC)/(FC)",
          //     day2: "14 (HC)/(FC)",
          //     day3: "30 (HC)/(FC)",
          //     day4: "60 (HC)/(FC)",
          //     older: "Older (HC)/(FC)",
          //     nota: "Nota Debit",
          //     rtr: "Retur",
          //     total: "Total (HC)/(FC)",
          //     giro: "Giro (HC)/(FC)",
          //   },
          // },
        ];
        let amn = 0;
        let t_jt = 0;
        let t_day1 = 0;
        let t_day2 = 0;
        let t_day3 = 0;
        let t_day4 = 0;
        let t_older = 0;
        el.ar.forEach((ek) => {
          let due = new Date(`${ek?.trx_due}Z`);
          let diff = (date - due) / (1000 * 60 * 60 * 24);

          t_jt += diff <= 0 ? ek.trx_amnh : 0;
          t_day1 += diff <= 7 && diff > 0 ? ek.trx_amnh : 0;
          t_day2 += diff <= 14 && diff > 7 ? ek.trx_amnh : 0;
          t_day3 += diff <= 30 && diff > 14 ? ek.trx_amnh : 0;
          t_day4 += diff <= 60 && diff > 30 ? ek.trx_amnh : 0;
          t_older += diff > 60 ? ek.trx_amnh : 0;

          val.push({
            cus: "Stock",
            type: "item",
            value: {
              ref: el.customer.cus_code,
              cuss: el.customer.cus_name,
              jt: `Rp. ${formatIdr(t_jt)}`,
              day1: `Rp. ${formatIdr(t_day1)}`,
              day2: `Rp. ${formatIdr(t_day2)}`,
              day3: `Rp. ${formatIdr(t_day3)}`,
              day4: `Rp. ${formatIdr(t_day4)}`,
              older: `Rp. ${formatIdr(t_older)}`,
              nota: `Rp. ${formatIdr(0)}`,
              rtr: `Rp. ${formatIdr(0)}`,
              total: `Rp. ${formatIdr(ek.trx_amnh)}`,
              giro: `Rp. ${formatIdr(0)}`,
            },
          });
          amn += ek.trx_amnh;
        });
        val.push({
          cus: `${el.customer.cus_name} (${el.customer.cus_code})`,
          type: "footer",
          value: {
            // ref: el.customer.cus_code,
            cuss: ` ${el.customer.cus_code} - ${el.customer.cus_name} - ${el.customer.cus_code}`,
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
    }

    let final = [
      {
        columns: [
          {
            title: "age of accounts receivable summary",
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
            value: `${ek.value.ref}`,
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
            value: `${ek.value.cuss}`,
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
            title: `${el[0].cus}`,
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
    console.log("=====hjhjhjhjhh=");
    console.log(data);

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
            <div className="col-4">
              <Dropdown
                value={selectCus ?? null}
                options={customer}
                onChange={(e) => {
                  setSelectCus(e.value);
                }}
                placeholder="Pilih Customer"
                optionLabel="cus_id.cus_name"
                filter
                filterBy="cus_id.cus_name"
                showClear
              />
            </div>
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`due_date_receivable_${formatDate(new Date())
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
                dataSet={ar ? jsonForExcel(ar, true) : null}
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
        {chunk(jsonForExcel(ar, false) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card>
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  horizontal
                  tittle={"age of accounts receivable summary"}
                  subTittle={`age of accounts receivable summary as of ${formatDate(
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
                            emptyMessage="Data Tidak Ditemukan"
                          >
                            <Column
                              className="header-center border-right"
                              header="Customer"
                              style={{ widht: "10rem" }}
                              body={(e) => e[e.length-1]?.value.cuss}
                            />
                            <Column
                              className="header-center border-right"
                              header="Before Due                              "
                              style={{ widht: "10rem" }}
                              body={(e) => e[e.length-1].value.jt}
                            />
                            <Column
                              className="header-center border-right"
                              header="7 Day"
                              style={{ widht: "10rem" }}
                              body={(e) => e[e.length-1].value.day1}
                            />
                            <Column
                              className="header-center border-right"
                              header="14 Day"
                              style={{ widht: "10rem" }}
                              body={(e) => e[e.length-1].value.day2}
                            />
                            <Column
                              className="header-center border-right"
                              header="30 Day"
                              style={{ widht: "10rem" }}
                              body={(e) => e[e.length-1].value.day3}
                            />
                            <Column
                              className="header-center border-right"
                              header="60 Day"
                              style={{ widht: "10rem" }}
                              body={(e) => e[e.length-1].value.day4}
                            />

                            <Column
                              className="header-center border-right"
                              header="Older "
                              style={{ widht: "10rem" }}
                              body={(e) => e[e.length-1].value.older}
                            />
                            <Column
                              className="header-center border-right"
                              header="Total "
                              style={{ widht: "10rem" }}
                              body={(e) => e[e.length-1].value.total}
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

    </>
  );
};

export default UmurPiutangRingkasan;
