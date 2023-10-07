import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
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
// import ExcelExportHelper from "../../../components/ExportExcel/ExcelExportHelper";
import { MultiSelect } from "primereact/multiselect";
import endpoints from "../../../../utils/endpoints";
import { tr } from "../../../../data/tr";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportPiutang = ({ month, year, cus_id }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState(
    year && month ? new Date(year, month - 1, 31) : null
  );
  const [customer, setCustomer] = useState(null);
  const [acc, setAcc] = useState(null);
  const [selectedCus, setSelected] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState([]);
  const [ar, setAr] = useState(null);
  const [total, setTotal] = useState(null);
  const [cp, setCp] = useState("");
  const chunkSize = 20;
  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getARCard(cus_id);
  }, []);

  const getARCard = async (id) => {
    const config = {
      ...endpoints.arcard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      // console.log(response);
      if (response.status) {
        const { data } = response;
        let trx_amnh = 0;
        let acq_amnh = 0;
        let total = 0;
        data.forEach((el) => {
          // if (el.lunas == false) {
          if (el.trx_dbcr === "D" && el?.pay_type === "P1") {
            trx_amnh += el?.trx_amnh ?? 0;
          }

          if (el.trx_dbcr === "K" && el.pay_type !== "J4") {
            acq_amnh += el?.trx_amnh ?? 0;
          }

          if (el?.trx_dbcr === "K" && el?.pay_type === "J4") {
            acq_amnh += el?.acq_amnh ?? 0;
          }
          // }
        });
        total += trx_amnh - acq_amnh ?? 0;

        setAr(data);
        setTotal(total);

        let grouped = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.cus_id?.id === ek?.cus_id?.id)
        );
        setCustomer(grouped);
        getAcc(data);

        if (id) {
          grouped?.forEach((elem) => {
            if (elem?.cus_id?.id === Number(id)) {
              setSelected([elem]);
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAcc = async (ar) => {
    const config = {
      ...endpoints.account,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data?.forEach((elem) => {
          ar?.forEach((el) => {
            if (elem.account?.id === el.cus_id?.cus_gl) {
              filt.push(elem);
            }
          });
        });

        let grouped = filt?.filter(
          (el, i) =>
            i === filt.findIndex((ek) => el?.account?.id === ek?.account?.id)
        );
        setAcc(grouped);
        // console.log("=======");
        // console.log(filt);
      }
    } catch (error) {}
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

    if (selectedCus?.length && selectedAcc?.length) {
      selectedCus?.forEach((cus) => {
        selectedAcc?.forEach((sel) => {
          ar?.forEach((ek) => {
            if (
              ek.cus_id?.id === cus?.cus_id?.id &&
              ek.cus_id?.cus_gl === sel?.account?.id
            ) {
              let amn = 0;
              let acq = 0;
              let val = [
                {
                  cus: `${cus.cus_id?.cus_name} \n (${cus.cus_id?.cus_code})`,
                  type: "header",
                  value: {
                    ref: "Kode Transaksi",
                    date: "Tanggal Transaksi",
                    jt: "Tanggal J/T",
                    type: "Tipe Trans",
                    value: "Nominal Piutang",
                    lns: "Penerimaan",
                    // sisa: `${formatIdr(0)}`,
                  },
                },
              ];
              // el.ar.forEach((ek) => {
              let filt = new Date(`${ek?.trx_date}Z`);
              if (filt <= filtDate) {
                val.push({
                  cus: `${ek.cus_id?.cus_name} (${ek.cus_id?.cus_code})`,
                  type: "item",
                  value: {
                    ref: ek.trx_code,
                    date: formatDate(ek.trx_date),
                    jt:
                      ek.trx_due && ek?.pay_type !== "J4"
                        ? formatDate(ek.trx_due)
                        : "-",
                    type:
                      ek?.pay_type === "P1"
                        ? ek?.trx_type === "JL"
                          ? "Penjualan"
                          : ek?.trx_type === "SA"
                          ? "Saldo Awal"
                          : ek?.trx_type === "KOR"
                          ? "Koreksi Piutang"
                          : ek?.trx_type == "DP"
                          ? "Uang Muka"
                          : ek?.trx_type
                        : "Penerimaan",
                    value: `${formatIdr(
                      ek.trx_dbcr === "D" ? ek.trx_amnh : 0
                    )}`,
                    lns: `${formatIdr(
                      ek.trx_dbcr === "K" && ek.pay_type !== "J4"
                        ? ek.trx_amnh
                        : ek.trx_dbcr === "K" && ek.pay_type === "J4"
                        ? ek.acq_amnh
                        : 0
                    )}`,
                  },
                });

                amn += ek.trx_dbcr === "D" ? ek.trx_amnh : 0;
                acq +=
                  ek.trx_dbcr === "K" && ek.pay_type !== "J4"
                    ? ek.trx_amnh
                    : ek.trx_dbcr === "K" && ek.pay_type === "J4"
                    ? ek.acq_amnh
                    : 0;
              }
              // });
              val.push({
                sup: ``,
                type: "footer",
                value: {
                  ref: "Total",
                  date: "",
                  jt: "",
                  type: "",
                  value: `${formatIdr(amn)}`,
                  lns: `${formatIdr(acq)}`,
                  // sisa: "",
                },
              });
              data.push(val);
            }
          });
        });
      });
    } else if (selectedCus?.length) {
      selectedCus?.forEach((p) => {
        console.log("p", p);
        let amn = 0;
        let acq = 0;
        let val = [
          {
            cus: `${p.cus_id?.cus_name} \n (${p.cus_id?.cus_code})`,
            type: "header",
            value: {
              ref: "Kode Transaksi",
              date: "Tanggal Transaksi",
              jt: "Tanggal J/T",
              type: "Tipe Trans",
              value: "Nominal Piutang",
              lns: "Penerimaan",
              // sisa: `${formatIdr(0)}`,
            },
          },
        ];
        ar?.forEach((ek) => {
          if (ek.cus_id?.id === p?.cus_id?.id) {
            // el.ar.forEach((ek) => {
            let filt = new Date(`${ek?.trx_date}Z`);
            if (filt <= filtDate) {
              val.push({
                cus: `${ek.cus_id?.cus_name} (${ek.cus_id?.cus_code})`,
                type: "item",
                value: {
                  ref: ek.trx_code,
                  date: formatDate(ek.trx_date),
                  jt:
                    ek.trx_due && ek?.pay_type !== "J4"
                      ? formatDate(ek.trx_due)
                      : "-",
                  type:
                    ek?.pay_type === "P1"
                      ? ek?.trx_type === "JL"
                        ? "Penjualan"
                        : ek?.trx_type === "SA"
                        ? "Saldo Awal"
                        : ek?.trx_type === "KOR"
                        ? "Koreksi Piutang"
                        : ek?.trx_type == "DP"
                        ? "Uang Muka"
                        : ek?.trx_type
                      : "Penerimaan",
                  value: `${formatIdr(ek.trx_dbcr === "D" ? ek.trx_amnh : 0)}`,
                  lns: `${formatIdr(
                    ek.trx_dbcr === "K" && ek.pay_type !== "J4"
                      ? ek.trx_amnh
                      : ek.trx_dbcr === "K" && ek.pay_type === "J4"
                      ? ek.acq_amnh
                      : 0
                  )}`,
                },
              });

              amn += ek.trx_dbcr === "D" ? ek.trx_amnh : 0;
              acq +=
                ek.trx_dbcr === "K" && ek.pay_type !== "J4"
                  ? ek.trx_amnh
                  : ek.trx_dbcr === "K" && ek.pay_type === "J4"
                  ? ek.acq_amnh
                  : 0;
            }
            // });
          }
        });
        val.push({
          sup: ``,
          type: "footer",
          value: {
            ref: "Total",
            date: "",
            jt: "",
            type: "",
            value: `${formatIdr(amn)}`,
            lns: `${formatIdr(acq)}`,
            // sisa: "",
          },
        });

        val.push({
          sup: ``,
          type: "footer",
          value: {
            ref: "Sisa",
            date: "",
            jt: "",
            type: "",
            value: "",
            lns: `${formatIdr(amn - acq)}`,
            // sisa: "",
          },
        });

        data.push(val);

        // data.push({
        //   header: [
        //     {
        //       cus:
        //         p === null
        //           ? "-"
        //           : `${p.cus_id?.cus_name} \n (${p.cus_id?.cus_code})`,
        //       sisa: p === null ? "-" : `${formatIdr(amn - acq)}`,
        //     },
        //   ],

        //   val: val,
        // });
        // });
      });
    } else if (selectedAcc?.length) {
      selectedAcc?.forEach((sel) => {
        ar?.forEach((ek) => {
          if (ek.cus_id?.cus_gl === sel?.account?.id) {
            let amn = 0;
            let acq = 0;
            let val = [
              {
                cus: `${ek.cus_id?.cus_name} \n (${ek.cus_id?.cus_code})`,
                type: "header",
                value: {
                  ref: "Kode Transaksi",
                  date: "Tanggal Transaksi",
                  jt: "Tanggal J/T",
                  type: "Tipe Trans",
                  value: "Nominal Piutang",
                  lns: "Penerimaan",
                  // sisa: `${formatIdr(0)}`,
                },
              },
            ];
            // el.ar.forEach((ek) => {
            let filt = new Date(`${ek?.trx_date}Z`);
            if (filt <= filtDate) {
              val.push({
                cus: `${ek.cus_id?.cus_name} (${ek.cus_id?.cus_code})`,
                type: "item",
                value: {
                  ref: ek.trx_code,
                  date: formatDate(ek.trx_date),
                  jt:
                    ek.trx_due && ek?.pay_type !== "J4"
                      ? formatDate(ek.trx_due)
                      : "-",
                  type:
                    ek?.pay_type === "P1"
                      ? ek?.trx_type === "JL"
                        ? "Penjualan"
                        : ek?.trx_type === "SA"
                        ? "Saldo Awal"
                        : ek?.trx_type === "KOR"
                        ? "Koreksi Piutang"
                        : ek?.trx_type == "DP"
                        ? "Uang Muka"
                        : ek?.trx_type
                      : "Penerimaan",
                  value: `${formatIdr(ek.trx_dbcr === "D" ? ek.trx_amnh : 0)}`,
                  lns: `${formatIdr(
                    ek.trx_dbcr === "K" && ek.pay_type !== "J4"
                      ? ek.trx_amnh
                      : ek.trx_dbcr === "K" && ek.pay_type === "J4"
                      ? ek.acq_amnh
                      : 0
                  )}`,
                },
              });

              amn += ek.trx_dbcr === "D" ? ek.trx_amnh : 0;
              acq +=
                ek.trx_dbcr === "K" && ek.pay_type !== "J4"
                  ? ek.trx_amnh
                  : ek.trx_dbcr === "K" && ek.pay_type === "J4"
                  ? ek.acq_amnh
                  : 0;
            }
            // });
            val.push({
              sup: ``,
              type: "footer",
              value: {
                ref: "Total",
                date: "",
                jt: "",
                type: "",
                value: `${formatIdr(amn)}`,
                lns: `${formatIdr(acq)}`,
                // sisa: "",
              },
            });
            data.push(val);
          }
        });
      });
    }
    // else {
    //   if (filtDate) {
    //     ar?.forEach((ek) => {
    //       let amn = 0;
    //       let acq = 0;
    //       let val = [
    //         {
    //           cus: `${ek.cus_id?.cus_name} \n (${ek.cus_id?.cus_code})`,
    //           type: "header",
    //           value: {
    //             ref: tr[localStorage.getItem("language")].kd_trans,
    //             date: tr[localStorage.getItem("language")].tgl_tran,
    //             jt: "Due Date",
    //             value: "Receivable",
    //             lns: "Payment",
    //             // sisa: `${formatIdr(0)}`,
    //           },
    //         },
    //       ];
    //       // el.ar.forEach((ek) => {
    //       let filt = new Date(`${ek?.trx_date}Z`);
    //       if (filt <= filtDate) {
    //         val.push({
    //           cus: `${ek.cus_id?.cus_name} (${ek.cus_id?.cus_code})`,
    //           type: "item",
    //           value: {
    //             ref: ek.trx_code,
    //             date: formatDate(ek.trx_date),
    //             jt: ek.trx_due ? formatDate(ek.trx_due) : "-",
    //             value: `${formatIdr(ek.trx_dbcr === "D" ? ek.trx_amnh : 0)}`,
    //             lns: `${formatIdr(
    //               ek.trx_dbcr === "K" && ek.trx_type !== "JL"
    //                 ? ek.trx_amnh
    //                 : ek.trx_dbcr === "K" && ek.trx_type === "JL"
    //                 ? ek.acq_amnh
    //                 : 0
    //             )}`,
    //           },
    //         });

    //         amn += ek.trx_dbcr === "D" ? ek.trx_amnh : 0;
    //         acq +=
    //           ek.trx_dbcr === "K" && ek.trx_type !== "JL"
    //             ? ek.trx_amnh
    //             : ek.trx_dbcr === "K" && ek.trx_type === "JL"
    //             ? ek.acq_amnh
    //             : 0;
    //       }
    //       // });
    //       val.push({
    //         sup: ``,
    //         type: "footer",
    //         value: {
    //           ref: "Total",
    //           date: "",
    //           jt: "",
    //           value: `${formatIdr(amn)}`,
    //           lns: `${formatIdr(acq)}`,
    //           // sisa: "",
    //         },
    //       });
    //       data.push(val);
    //     });
    //   }
    // }

    let final = [
      {
        columns: [
          {
            title: "Accounts Receivable Balance Details",
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

    data.forEach((el) => {
      let item = [];
      data?.forEach((ek) => {
        item.push([
          {
            value: `${ek?.value?.ref}`,
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
            value: `${ek?.value?.date}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek?.value?.jt}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek?.value?.value}`,
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
            value: `${ek?.value?.lns}`,
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
            value: `${ek?.value?.sisa}`,
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
            title: `${el?.cus}`,
            width: { wch: 30 },
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
            width: { wch: 17 },
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
            width: { wch: 17 },
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
          {
            title: "",
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
          {
            title: "",
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

  const glTemplate = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.account.acc_name} - ${option.account.acc_code}`
          : ""}
      </div>
    );
  };

  const valTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.account.acc_name} - ${option.account.acc_code}`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-10 ml-0 mr-0 pl-0 pt-0">
          <Row className="mt-0">
            <div className="p-inputgroup col-2">
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
                placeholder={tr[localStorage.getItem("language")].pilih_tgl}
                readOnlyInput
                dateFormat="dd-mm-yy"
              />
            </div>

            <div className="p-inputgroup col-3 ml-0">
              <MultiSelect
                value={selectedCus ?? null}
                options={customer}
                onChange={(e) => {
                  setSelected(e.value);
                  // console.log("===========");
                  // console.log(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_cus}
                optionLabel="cus_id.cus_name"
                showClear
                filterBy="cus_id.cus_name"
                filter
                display="chip"
                // className="w-full md:w-22rem"
                maxSelectedLabels={3}
              />
            </div>
            <div className="p-inputgroup col-3 ml-0">
              <MultiSelect
                value={selectedAcc ?? null}
                options={acc}
                onChange={(e) => {
                  setSelectedAcc(e.value);
                  // console.log("===========");
                  // console.log(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_acc}
                optionLabel="account.acc_name"
                showClear
                filterBy="account.acc_name"
                filter
                itemTemplate={glTemplate}
                display="chip"
                // className="w-full md:w-22rem"
                maxSelectedLabels={3}
              />
            </div>
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelSheet
              json={ar ? jsonForExcel(ar, true) : null}
              filename={`receivable_report_export_${new Date().getTime()}`}
              sheetname="report"
            />
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
        <div className="text-left font-weight-bold col-6">
          {tr[localStorage.getItem("language")].ttl_piutang}
        </div>
        <div className="col-6 text-right font-weight-bold">
          {formatIdr(total < 0 ? 0 : total)}
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
                  viewOnly
                  horizontal
                  tittle={"Balance Receivable Details"}
                  subTittle={`Balance Receivable Details Report as ${formatDate(
                    filtDate
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
                                {v.cus}
                                {/* <div className="col-3">{"Customer"}</div>
                                <div className="col-2">{""}</div>
                                <div className="col-2">{""}</div>
                                <div className="col-1">{""}</div>
                                <div className="col-2 text-right">{""}</div>
                                <div className="col-2 text-right">
                                  {"Sisa Piutang"}
                                </div> */}
                              </div>

                              {/* <div className="item-report row m-0">
                                <div className="col-3">{v.head.cus}</div>
                                <div className="col-2">{""}</div>
                                <div className="col-2">{""}</div>
                                <div className="col-1">{""}</div>
                                <div className="col-2 text-right">{""}</div>
                                <div className="col-2 text-right">
                                  {v.head.sisa}
                                </div>
                              </div> */}

                              <div className="header-report row m-0">
                                <div className="col-3">{v.value.ref}</div>
                                <div className="col-2">{v.value.date}</div>
                                <div className="col-2">{v.value.jt}</div>
                                <div className="col-1">{v.value.type}</div>
                                <div className="col-2 text-right">
                                  {v.value.value}
                                </div>
                                <div className="col-2 text-right">
                                  {v.value.lns}
                                </div>
                              </div>
                            </>
                          );
                        } else if (v.type === "item") {
                          return (
                            <>
                              <div className="item-report row m-0">
                                <div className="col-3">{v.value.ref}</div>
                                <div className="col-2">{v.value.date}</div>
                                <div className="col-2">{v.value.jt}</div>
                                <div className="col-1">{v.value.type}</div>
                                <div className="col-2 text-right">
                                  {v.value.value}
                                </div>
                                <div className="col-2 text-right">
                                  {v.value.lns}
                                </div>
                              </div>
                            </>
                          );
                        } else if (v.type === "footer") {
                          return (
                            <>
                              <div className="footer-report row m-0 mb-4">
                                <div className="col-3">{v.value.ref}</div>
                                <div className="col-2">{v.value.date}</div>
                                <div className="col-2">{v.value.jt}</div>
                                <div className="col-1">{v.value.type}</div>
                                <div className="col-2 text-right">
                                  {v.value.value}
                                </div>
                                <div className="col-2 text-right">
                                  {v.value.lns}
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

      <Row>
        <Col>
          <Card>
            <Card.Body>{renderFooter()}</Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="m-0 justify-content-center d-none">
        <Card>
          <Card.Body className="p-0" ref={printPage}>
            {chunk(jsonForExcel(ar) ?? [], chunkSize)?.map((val, idx) => {
              return (
                <Card className="ml-1 mr-1 mt-2">
                  <Card.Body className="p-0 m-0">
                    <CustomeWrapper
                      horizontal
                      tittle={"Balance Receivable Details"}
                      subTittle={`Balance Receivable Details Report as ${formatDate(
                        filtDate
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
                                    {v.cus}
                                  </div>
                                  <div className="header-report row m-0">
                                    <div className="col-4">{v.value.ref}</div>
                                    <div className="col-2">{v.value.date}</div>
                                    <div className="col-2">{v.value.jt}</div>
                                    <div className="col-2 text-right">
                                      {v.value.value}
                                    </div>
                                    <div className="col-2 text-right">
                                      {v.value.lns}
                                    </div>
                                  </div>
                                </>
                              );
                            } else if (v.type === "item") {
                              return (
                                <>
                                  <div className="item-report row m-0">
                                    <div className="col-4">{v.value.ref}</div>
                                    <div className="col-2">{v.value.date}</div>
                                    <div className="col-2">{v.value.jt}</div>
                                    <div className="col-2 text-right">
                                      {v.value.value}
                                    </div>
                                    <div className="col-2 text-right">
                                      {v.value.lns}
                                    </div>
                                  </div>
                                </>
                              );
                            } else if (v.type === "footer") {
                              return (
                                <>
                                  <div className="footer-report row m-0 mb-5">
                                    <div className="col-4">{v.value.ref}</div>
                                    <div className="col-2">{v.value.date}</div>
                                    <div className="col-2">{v.value.jt}</div>
                                    <div className="col-2 text-right">
                                      {v.value.value}
                                    </div>
                                    <div className="col-2 text-right">
                                      {v.value.lns}
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
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default ReportPiutang;
