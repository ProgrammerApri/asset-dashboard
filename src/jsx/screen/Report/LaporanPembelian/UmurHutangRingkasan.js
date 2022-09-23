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

const UmurHutangRingkasan = () => {
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
  const chunkSize = 2;

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

        let grouped = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.sup_id?.id === ek?.sup_id?.id)
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

    if (selectSup) {
      ap?.forEach((el) => {
        if (selectSup?.sup_id?.id === el.supplier?.id) {
          let val = [
            {
              sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
              type: "header",
              value: {
                supp: "Supplier",
                jt: "Before Due ",
                day1: "7 Day",
                day2: "14 Day",
                day3: "30 Day",
                day4: "60 Day",
                older: "Older ",
                total: "Total ",
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
                supp: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
                jt: diff <= 0 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
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
               
                total: `Rp. ${formatIdr(ek.trx_amnh)}`,
              },
            });
            amn += ek.trx_amnh;
            t_jt += diff <= 0 ? ek.trx_amnh : 0;
            t_day1 += diff <= 7 && diff > 0 ? ek.trx_amnh : 0;
            t_day2 += diff <= 14 && diff > 7 ? ek.trx_amnh : 0;
            t_day3 += diff <= 30 && diff > 14 ? ek.trx_amnh : 0;
            t_day4 += diff <= 60 && diff > 30 ? ek.trx_amnh : 0;
            t_older += diff > 60 ? ek.trx_amnh : 0;
          });
          val.push({
            sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
            type: "footer",
            value: {
              supp: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
              jt: `Rp. ${formatIdr(t_jt)}`,
              day1: `Rp. ${formatIdr(t_day1)}`,
              day2: `Rp. ${formatIdr(t_day2)}`,
              day3: `Rp. ${formatIdr(t_day3)}`,
              day4: `Rp. ${formatIdr(t_day4)}`,
              older: `Rp. ${formatIdr(t_older)}`,
             
              total: `Rp. ${formatIdr(amn)}`,
            },
          });
          data.push(val);
        }
      });
    } else {
      ap?.forEach((el) => {
        let val = [
          {
            sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
            type: "header",
            value: {
              supp: "Supplier",
              jt: "Before Due ",
              day1: "7 Day",
              day2: "14 Day",
              day3: "30 Day",
              day4: "60 Day",
              older: "Older",

              total: "Total ",
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
              // fk: el.supplier.sup_code,
              supp: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
              jt: diff <= 0 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
              day1:
                diff <= 7 && diff > 0 ? `Rp. ${formatIdr(ek.trx_amnh)}` : "-",
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
          t_day4 += diff <= 60 && diff > 30 ? ek.trx_amnh : 0;
          t_older += diff > 60 ? ek.trx_amnh : 0;
        });
        val.push({
          sup: `${el.supplier.sup_code} - ${el.supplier.sup_name}`,
          type: "footer",
          value: {
            supp: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
            jt: `Rp. ${formatIdr(t_jt)}`,
            day1: `Rp. ${formatIdr(t_day1)}`,
            day2: `Rp. ${formatIdr(t_day2)}`,
            day3: `Rp. ${formatIdr(t_day3)}`,
            day4: `Rp. ${formatIdr(t_day4)}`,
            older: `Rp. ${formatIdr(t_older)}`,
           
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
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek[ek.length - 1].value.jt}`,
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
            value: `${ek[ek.length - 1].value.day1}`,
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
            value: `${ek[ek.length - 1].value.day2}`,
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
            value: `${ek[ek.length - 1].value.day3}`,
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
            value: `${ek[ek.length - 1].value.day4}`,
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
            value: `${ek[ek.length - 1].value.older}`,
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
            value: `${ek[ek.length - 1].value.total}`,
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
            title: "Supplier",
            width: { wch: 20 },
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
            title: "7 Day",
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
            title: "14 Day",
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
            title: "30 Day",
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
            title: "60 Day",
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
            title: "Older",
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
            title: "Total",
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
                value={selectSup ?? null}
                options={supplier}
                onChange={(e) => {
                  setSelectSup(e.value);
                }}
                placeholder="Pilih Supplier"
                optionLabel="sup_id.sup_name"
                filter
                filterBy="sup_id.sup_name"
                showClear
              />
            </div>
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
                        emptyMessage="Data Tidak Ditemukan"
                      >
                        {/* <Column
                          className="header-center border-right border-left"
                          header={"Invoice"}
                          style={{ width: "11rem" }}
                          body={(e) => e[e.length-1].fk}
                        /> */}
                        <Column
                          className="header-center border-right border-left"
                          header={"Supplier"}
                          style={{ width: "15rem" }}
                          body={(e) => e[e.length - 1].sup}
                        />
                        <Column
                          className="header-center border-right"
                          header="Before Due"
                          style={{ widht: "10rem" }}
                          body={(e) => e[e.length - 1].value.jt}
                        />
                        <Column
                          className="header-center border-right"
                          header="7 Day"
                          style={{ widht: "10rem" }}
                          body={(e) => e[e.length - 1].value.day1}
                        />
                        <Column
                          className="header-center border-right"
                          header="14 Day"
                          style={{ widht: "10rem" }}
                          body={(e) => e[e.length - 1].value.day2}
                        />
                        <Column
                          className="header-center border-right"
                          header="30 Day"
                          style={{ widht: "10rem" }}
                          body={(e) => e[e.length - 1].value.day3}
                        />
                        <Column
                          className="header-center border-right"
                          header="60 Day"
                          style={{ widht: "10rem" }}
                          body={(e) => e[e.length - 1].value.day4}
                        />
                        <Column
                          className="header-center border-right"
                          header="Older"
                          style={{ widht: "10rem" }}
                          body={(e) => e[e.length - 1].value.older}
                        />

                        <Column
                          className="header-center border-right"
                          header="Total"
                          style={{ widht: "10rem" }}
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
    </>
  );
};

export default UmurHutangRingkasan;
