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

const ReportPiutangRingkasan = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState(new Date());
  const [customer, setCustomer] = useState(null);
  const [selectedCus, setSelected] = useState(null);
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

    if (selectedCus) {
      ar?.forEach((el) => {
        if (selectedCus?.cus_id?.id === el.customer?.id) {
          let val = [
            {
              cus: `${el.customer.cus_name} (${el.customer.cus_code})`,
              type: "header",
              value: {
                ref: "Code",
                NB: "Nilai Bukti",
                PB: "Pembayaran",
                SB: "Sisa Bayar",
                SE: "Saldo Efektif ",
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
                  ref: `${el.customer.cus_name} (${el.customer.cus_code})`,
                  NB: `Rp. ${formatIdr(ek.trx_amnh)}`,
                  PB: `Rp. ${formatIdr(ek.acq_amnh)}`,
                  SB: `Rp. ${formatIdr(ek.trx_amnh - ek.acq_amnh)}`,
                  SE: `Rp. ${formatIdr(ek.trx_amnh - ek.acq_amnh)}`,
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
              NB: `Rp. ${formatIdr(amn)}`,
              PB: `Rp. ${formatIdr(acq)}`,
              SB: `Rp. ${formatIdr(amn - acq)}`,
              SE: `Rp. ${formatIdr(amn - acq)}`,
            },
          });

          data.push(val);
        }
      });
    } else {
      ar?.forEach((el) => {
        let val = [
          {
            cus: `${el.customer.cus_name} (${el.customer.cus_code})`,
            type: "header",
            value: {
              ref: "Code",
              PB: "Pembayaran ",
              SB: "Sisa Bayar ",
              SE: "Saldo Efektif ",
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
                ref: `${el.customer.cus_code}`,
                NB: `Rp. ${formatIdr(ek.acq_amnh)}`,
                PB: `Rp. ${formatIdr(ek.acq_amnh)}`,
                SB: `Rp. ${formatIdr(ek.acq_amnh)}`,

                SE: `Rp. ${formatIdr(ek.trx_amnh - ek.acq_amnh)}`,
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
            ref: `${el.customer.cus_code} - ${el.customer.cus_name} `,

            NB: `Rp. ${formatIdr(amn)}`,
            PB: `Rp. ${formatIdr(acq)}`,
            SB: `Rp. ${formatIdr(amn - acq)}`,
            SE: `Rp. ${formatIdr(amn - acq)}`,
          },
        });
        data.push(val);
      });
    }

    let final = [
      {
        columns: [
          {
            title: "Accounts Receivable Summary",
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
            title: `Period ${formatDate(filtDate)}`,
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
        ],
        data: [[]],
      },
    ];

    let item = [];
    data.forEach((ek) => {
      item.push([
        {
          value: `${ek[ek.length - 1].value.ref}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: `${ek[ek.length - 1].value.NB}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek[ek.length - 1].value.PB}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek[ek.length - 1].value.SB}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },

        {
          value: `${ek[ek.length - 1].value.SE}`,
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
    ]);

    final.push({
      columns: [
        {
          title: "Customer",
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
          title: "Nilai Bukti",
          width: { wch: 17 },
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
          title: "Pembayaran",
          width: { wch: 17 },
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
          title: "Sisa Bayar",
          width: { wch: 17 },
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
          title: "Saldo Efektif",
          width: { wch: 25 },
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
            <div className="col-4">
              <Dropdown
                value={selectedCus ?? null}
                options={customer}
                onChange={(e) => {
                  setSelected(e.value);
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
              filename={`receivable_report_summary_export_${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={ar ? jsonForExcel(ar, true) : null}
                name="report"
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

  const renderFooter = () => {
    return (
      <Row className="m-0 mt-0">
        <div className="text-left font-weight-bold col-6">Total Hutang</div>
        <div className="col-6 text-right font-weight-bold">
          Rp. {formatIdr(total)}
        </div>
      </Row>
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

      <Row className="m-0 justify-content-center" ref={printPage}>
        {chunk(jsonForExcel(ar) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  tittle={"Accounts Receivable Summary"}
                  subTittle={`Accounts Receivable Summary as ${formatDate(
                    filtDate
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
                          header="Customer"
                          style={{ width: "15rem" }}
                          body={(e) => e[e.length - 1].value.ref}
                        />
                        <Column
                          className="header-right text-right"
                          header="Nilai Bukti"
                          style={{ minWidht: "7rem" }}
                          body={(e) => e[e.length - 1].value.NB}
                        />
                        <Column
                          className="header-right text-right"
                          header="Pembayaran"
                          style={{ minWidht: "7rem" }}
                          body={(e) => e[e.length - 1].value.PB}
                        />
                        <Column
                          className="header-right text-right"
                          header="Sisa Bayar"
                          style={{ minWidht: "7rem" }}
                          body={(e) => e[e.length - 1].value.SB}
                        />
                        <Column
                          className="header-right text-right"
                          header="Saldo Efektif"
                          style={{ minWidht: "7rem" }}
                          body={(e) => e[e.length - 1].value.SE}
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

export default ReportPiutangRingkasan;
