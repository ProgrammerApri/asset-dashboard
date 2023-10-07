import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
import formatIdr from "../../../../utils/formatIdr";
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

const ReportHutang = ({ month, year, sup_id }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState(
    year && month ? new Date(year, month - 1, 1) : null
  );
  const [supplier, setSupplier] = useState(null);
  const [acc, setAcc] = useState(null);
  const [selectedSup, setSelected] = useState(null);
  const [selectedAcc, setSelectedAcc] = useState([]);
  const [ap, setAp] = useState(null);
  const [total, setTotal] = useState(null);
  const [cp, setCp] = useState("");
  const chunkSize = 20;

  useEffect(() => {
    getAPCard(sup_id);
  }, []);

  const getAPCard = async (id) => {
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
        let trx_amnh = 0;
        let acq_amnh = 0;
        let total = 0;
        data?.forEach((el) => {
          if (el.lunas === false) {
            if (el.trx_dbcr === "k" && el?.pay_type === "P1") {
              trx_amnh += el?.trx_amnh ?? 0;
            } else {
              if (el.pay_type !== "H4" && el?.trx_dbcr === "d") {
                acq_amnh += el?.trx_amnh ?? 0;
              }
              if (el.pay_type === "H4" && el?.trx_dbcr === "d") {
                acq_amnh += el?.acq_amnh ?? 0;
              }
            }
          }
        });

        total = trx_amnh - acq_amnh ?? 0;

        setAp(data);
        setTotal(total);

        let grouped = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.sup_id?.id === ek?.sup_id?.id)
        );
        setSupplier(grouped);
        getAcc(data);

        if (id) {
          grouped?.forEach((el) => {
            if (el?.sup_id?.id === Number(id)) {
              setSelected([el]);
            }
          });
        }

        console.log(grouped);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAcc = async (ap) => {
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
          ap?.forEach((el) => {
            if (elem.account?.id === el.sup_id?.sup_hutang) {
              filt.push(elem);
            }
            // console.log("============");
            // console.log(element);
          });
        });

        let grouped = filt?.filter(
          (el, i) =>
            i === filt.findIndex((ek) => el?.account?.id === ek?.account?.id)
        );
        setAcc(grouped);
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

  const jsonForExcel = (ap, excel = false) => {
    let data = [];

    if (selectedSup?.length) {
    }

    if (selectedSup?.length && selectedAcc?.length) {
      selectedSup?.forEach((sup) => {
        selectedAcc?.forEach((p) => {
          let amn = 0;
          let acq = 0;
          let val = [
            {
              sup: `${sup?.sup_id?.sup_name} (${sup?.sup_id?.sup_code})`,
              type: "header",
              value: {
                ref: "Transaction Code",
                date: "Transaction Date",
                type: "Transaction Type",
                jt: "Due Date",
                value: "Payable",
                lns: "Payment",
                // sisa: `${formatIdr(0)}`,
              },
            },
          ];

          ap?.forEach((ek) => {
            if (
              sup?.sup_id?.id === ek.sup_id?.id &&
              p?.account?.id === ek?.sup_id?.sup_hutang
            ) {
              let dt = new Date(`${ek.ord_date}Z`);
              if (dt <= filtDate) {
                console.log("ap", ap);

                val.push({
                  sup: `${ek?.sup_id?.sup_name} (${ek?.sup_id?.sup_code})`,
                  type: "item",
                  value: {
                    ref: ek.trx_code,
                    date:
                      ek.pay_type === "H4"
                        ? formatDate(ek.acq_date)
                        : formatDate(ek.ord_date),
                    type:
                      ek?.pay_type === "P1"
                        ? ek?.trx_type === "LP"
                          ? "Pembelian"
                          : ek?.trx_type === "SA"
                          ? "Saldo Awal"
                          : ek?.trx_type === "KOR"
                          ? "Koreksi Hutang"
                          : ek?.trx_type === "DP"
                          ? "Uang Muka"
                          : ek?.trx_type
                        : ek?.trx_type === "SA"
                        ? "Pelunasan Saldo"
                        : ek?.trx_type === "KOR"
                        ? "Pelunasan Koreksi"
                        : ek?.trx_type,
                    jt: ek.ord_due ? formatDate(ek.ord_due) : "-",
                    value: `${formatIdr(
                      ek.trx_dbcr === "k" ? ek.trx_amnh : 0
                    )}`,
                    lns: `${formatIdr(
                      ek.trx_dbcr === "d" && ek.pay_type === "H4"
                        ? ek.acq_amnh
                        : ek.trx_dbcr === "d" && ek.pay_type != "H4"
                        ? ek.trx_amnh
                        : 0
                    )}`,
                    // sisa: `${formatIdr(0)}`,
                  },
                });
                amn += ek.trx_dbcr === "k" ? ek.trx_amnh : 0;
                acq +=
                  ek.trx_dbcr === "d" && ek.pay_type === "H4"
                    ? ek.acq_amnh
                    : ek.trx_dbcr === "d" && ek.pay_type != "H4"
                    ? ek.trx_amnh
                    : 0;
              }
            }
          });
          val.push({
            sup: ``,
            type: "footer",
            value: {
              ref: "Total",
              date: "",
              jt: "",
              value: `${formatIdr(amn)}`,
              lns: `${formatIdr(acq)}`,
              // sisa: "",
            },
          });
          data.push(val);
        });
      });
    } else if (selectedSup?.length) {
      selectedSup?.forEach((p) => {
        let amn = 0;
        let acq = 0;
        let val = [
          {
            sup: `${p?.sup_id?.sup_name} (${p?.sup_id?.sup_code})`,
            type: "header",
            value: {
              ref: "Transaction Code",
              date: "Transaction Date",
              type: "Transaction Type",
              jt: "Due Date",
              value: "Payable",
              lns: "Payment",
              // sisa: `${formatIdr(0)}`,
            },
          },
        ];
        ap?.forEach((ek) => {
          if (p?.sup_id?.id === ek.sup_id?.id) {
            let dt = new Date(`${ek.ord_date}Z`);
            if (dt <= filtDate) {
              console.log("ap", ap);

              val.push({
                sup: `${ek?.sup_id?.sup_name} (${ek?.sup_id?.sup_code})`,
                type: "item",
                value: {
                  ref: ek.trx_code,
                  date:
                    ek.pay_type === "H4"
                      ? formatDate(ek.acq_date)
                      : formatDate(ek.ord_date),
                  jt: ek.ord_due ? formatDate(ek.ord_due) : "-",
                  type:
                    ek?.pay_type === "P1"
                      ? ek?.trx_type === "LP"
                        ? "Pembelian"
                        : ek?.trx_type === "SA"
                        ? "Saldo Awal"
                        : ek?.trx_type === "KOR"
                        ? "Koreksi Hutang"
                        : ek?.trx_type === "DP"
                        ? "Uang Muka"
                        : ek?.trx_type
                      : ek?.trx_type === "SA"
                      ? "Pelunasan Saldo"
                      : ek?.trx_type === "KOR"
                      ? "Pelunasan Koreksi"
                      : ek?.trx_type,
                  value: `${formatIdr(ek.trx_dbcr === "k" ? ek.trx_amnh : 0)}`,
                  lns: `${formatIdr(
                    ek.trx_dbcr === "d" && ek.pay_type === "H4"
                      ? ek.acq_amnh
                      : ek.trx_dbcr === "d" && ek.pay_type != "H4"
                      ? ek.trx_amnh
                      : 0
                  )}`,
                  // sisa: `${formatIdr(0)}`,
                },
              });
              amn += ek.trx_dbcr === "k" ? ek.trx_amnh : 0;
              acq +=
                ek.trx_dbcr === "d" && ek.pay_type === "H4"
                  ? ek.acq_amnh
                  : ek.trx_dbcr === "d" && ek.pay_type != "H4"
                  ? ek.trx_amnh
                  : 0;
            }
          }
        });
        val.push({
          sup: ``,
          type: "footer",
          value: {
            ref: "Total",
            date: "",
            jt: "",
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
            value: "",
            lns: `${formatIdr(amn - acq)}`,
            // sisa: "",
          },
        });
        data.push(val);
      });
    } else if (selectedAcc?.length) {
      selectedAcc?.forEach((p) => {
        ap?.forEach((ek) => {
          let amn = 0;
          let acq = 0;
          let val = [
            {
              sup: `${ek?.sup_id?.sup_name} (${ek?.sup_id?.sup_code})`,
              type: "header",
              value: {
                ref: "Transaction Code",
                date: "Transaction Date",
                type: "Transaction Type",
                jt: "Due Date",
                value: "Payable",
                lns: "Payment",
                // sisa: `${formatIdr(0)}`,
              },
            },
          ];
          if (p?.account?.id === ek.sup_id?.sup_hutang) {
            let trx_amnh = 0;
            let acq_amnh = 0;
            let sisa = 0;
            let dt = new Date(`${ek.ord_date}Z`);
            if (dt <= filtDate) {
              console.log("ap", ap);

              val.push({
                sup: `${ek?.sup_id?.sup_name} (${ek?.sup_id?.sup_code})`,
                type: "item",
                value: {
                  ref: ek.trx_code,
                  date:
                    ek.pay_type === "H4"
                      ? formatDate(ek.acq_date)
                      : formatDate(ek.ord_date),
                  type:
                    ek?.pay_type === "P1"
                      ? ek?.trx_type === "LP"
                        ? "Pembelian"
                        : ek?.trx_type === "SA"
                        ? "Saldo Awal"
                        : ek?.trx_type === "KOR"
                        ? "Koreksi Hutang"
                        : ek?.trx_type === "DP"
                        ? "Uang Muka"
                        : ek?.trx_type
                      : ek?.trx_type === "SA"
                      ? "Pelunasan Saldo"
                      : ek?.trx_type === "KOR"
                      ? "Pelunasan Koreksi"
                      : ek?.trx_type,
                  jt: ek.ord_due ? formatDate(ek.ord_due) : "-",
                  value: `${formatIdr(ek.trx_dbcr === "k" ? ek.trx_amnh : 0)}`,
                  lns: `${formatIdr(
                    ek.trx_dbcr === "d" && ek.trx_type === "LP"
                      ? ek.acq_amnh
                      : ek.trx_dbcr === "d" && ek.trx_type != "LP"
                      ? ek.trx_amnh
                      : 0
                  )}`,
                  // sisa: `${formatIdr(0)}`,
                },
              });
              amn += ek.trx_dbcr === "k" ? ek.trx_amnh : 0;
              acq +=
                ek.trx_dbcr === "d" && ek.trx_type === "LP"
                  ? ek.acq_amnh
                  : ek.trx_dbcr === "d" && ek.trx_type !== "LP"
                  ? ek.trx_amnh
                  : 0;
            }
          }
          val.push({
            sup: ``,
            type: "footer",
            value: {
              ref: "Total",
              date: "",
              type: "",
              jt: "",
              value: `${formatIdr(amn)}`,
              lns: `${formatIdr(acq)}`,
              // sisa: "",
            },
          });
          data.push(val);
        });
      });
    }
    // else {
    //   ap?.forEach((ek) => {
    //     let dt = new Date(`${ek.ord_date}Z`);
    //     if (dt <= filtDate) {
    //       let amn = 0;
    //       let acq = 0;
    //       let val = [
    //         {
    //           sup: `${ek?.sup_id?.sup_name} (${ek?.sup_id?.sup_code})`,
    //           type: "header",
    //           value: {
    //             ref: "Transaction Code",
    //             date: "Transaction Date",
    //             jt: "Due Date",
    //             value: "Payable",
    //             lns: "Payment",
    //             // sisa: `${formatIdr(0)}`,
    //           },
    //         },
    //       ];

    //       val.push({
    //         sup: `${ek?.sup_id?.sup_name} (${ek?.sup_id?.sup_code})`,
    //         type: "item",
    //         value: {
    //           ref: ek.trx_code,
    //           date:
    //             ek.trx_type === "LP" && ek.trx_dbcr === "d"
    //               ? formatDate(ek.acq_date)
    //               : formatDate(ek.ord_date),
    //           jt: ek.ord_due ? formatDate(ek.ord_due) : "-",
    //           value: `${formatIdr(ek.trx_dbcr === "k" ? ek.trx_amnh : 0)}`,
    //           lns: `${formatIdr(
    //             ek.trx_dbcr === "d" && ek.trx_type === "LP"
    //               ? ek.acq_amnh
    //               : ek.trx_dbcr === "d" && ek.trx_type != "LP"
    //               ? ek.trx_amnh
    //               : 0
    //           )}`,
    //           // sisa: `${formatIdr(0)}`,
    //         },
    //       });
    //       amn += ek.trx_dbcr === "k" ? ek.trx_amnh : 0;
    //       acq +=
    //         ek.trx_dbcr === "d" && ek.trx_type === "LP"
    //           ? ek.acq_amnh
    //           : ek.trx_dbcr === "d" && ek.trx_type !== "LP"
    //           ? ek.trx_amnh
    //           : 0;

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
    //     }
    //   });
    // }

    console.log("=====tes");
    console.log(data);

    let final = [
      {
        columns: [
          {
            title: "Balance Payable Details",
            width: { wch: 30 },
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
            title: `Periode ${formatDate(filtDate)}`,
            width: { wch: 30 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
        ],
        data: [[]],
      },
    ];

    data?.forEach((el) => {
      let item = [];
      el?.forEach((ek) => {
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
            value: `${ek.value.date}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek.value.jt}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek.value.value}`,
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
            value: `${ek.value.lns}`,
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
            title: `${el[0].sup}`,
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
          // {
          //   title: "",
          //   width: { wch: 30 },
          //   style: {
          //     font: { sz: "14", bold: true },
          //     alignment: { horizontal: "right", vertical: "center" },
          //     fill: {
          //       paternType: "solid",
          //       fgColor: { rgb: "F3F3F3" },
          //     },
          //   },
          // },
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

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-8 ml-0 mr-0 pl-0 pt-0">
          <Row className="mt-0">
            <div className="p-inputgroup col-3">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar" />
              </span>
              <Calendar
                value={filtDate}
                onChange={(e) => {
                  setFiltDate(e.value);
                }}
                // selectionMode="range"
                placeholder={tr[localStorage.getItem("language")].pilih_tgl}
                dateFormat="dd-mm-yy"
              />
            </div>
            <div className="p-inputgroup col-4">
              <MultiSelect
                value={selectedSup ?? null}
                options={supplier}
                onChange={(e) => {
                  setSelected(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_sup}
                optionLabel="sup_id.sup_name"
                filter
                filterBy="sup_id.sup_name"
                showClear
                display="chip"
                // className="w-full md:w-20rem"
                maxSelectedLabels={3}
              />
            </div>
            <div className="p-inputgroup col-3">
              <MultiSelect
                value={selectedAcc ?? null}
                options={acc}
                onChange={(e) => {
                  console.log("=========", e.value);
                  setSelectedAcc(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_acc}
                optionLabel="account.acc_name"
                itemTemplate={glTemplate}
                filter
                filterBy="account.acc_name"
                showClear
                display="chip"
                // className="w-full md:w-20rem"
                maxSelectedLabels={3}
              />
            </div>
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            {/* <ExcelExportHelper
              json={ap ? jsonForExcel(ap, true) : null}
              filename={`Balance_Payable_Details${new Date().getTime()}`}
              sheetname="report"
            /> */}

            <ExcelFile
              filename={`Balance_Payable_Details${new Date().getTime()}`}
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

  const renderFooter = () => {
    return (
      <Row className="m-0 mt-0">
        <div className="text-left font-weight-bold col-6">
          {tr[localStorage.getItem("language")].ttl_hutang}
        </div>
        <div className="col-6 text-right font-weight-bold">
          {formatIdr(total < 0 ? 0 : total)}
        </div>
      </Row>
    );
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
          ? `${option.account.acc_code} - ${option.account.acc_name}`
          : ""}
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

      <Row className="m-0 justify-content-center">
        {chunk(jsonForExcel(ap) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  horizontal
                  viewOnly
                  tittle={"Balance Payable Details"}
                  subTittle={`Balance Payable Details Report as ${formatDate(
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
                                {v.sup}
                              </div>
                              <div className="header-report row m-0">
                                <div className="col-2">{v.value.ref}</div>
                                <div className="col-2">{v.value.date}</div>
                                <div className="col-2">{v.value.type}</div>
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
                                <div className="col-2">{v.value.ref}</div>
                                <div className="col-2">{v.value.date}</div>
                                <div className="col-2">{v.value.type}</div>
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
                              <div className="footer-report row m-0 mb-4">
                                <div className="col-2">{v.value.ref}</div>
                                <div className="col-2">{v.value.date}</div>
                                <div className="col-2">{v.value.type}</div>
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
      </Row>

      <Row className="m-0 justify-content-center d-none">
        <Card className="ml-1 mr-1 mt-2">
          <Card.Body className="p-0 m-0" ref={printPage}>
            {chunk(jsonForExcel(ap) ?? [], chunkSize)?.map((val, idx) => {
              return (
                <Card className="ml-1 mr-1 mt-2">
                  <Card.Body className="p-0 m-0">
                    <CustomeWrapper
                      tittle={"Balance Payable Details"}
                      subTittle={`Balance Payable Details Report as ${formatDate(
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
                                    {v.sup}
                                  </div>
                                  <div className="header-report row m-0">
                                    <div className="col-2">{v.value.ref}</div>
                                    <div className="col-2">{v.value.date}</div>
                                    <div className="col-2">{v.value.type}</div>
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
                                    <div className="col-2">{v.value.ref}</div>
                                    <div className="col-2">{v.value.date}</div>
                                    <div className="col-2">{v.value.type}</div>
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
                                    <div className="col-2">{v.value.ref}</div>
                                    <div className="col-2">{v.value.date}</div>
                                    <div className="col-2">{v.value.type}</div>
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

      <Row>
        <Col>
          <Card>
            <Card.Body>{renderFooter()}</Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ReportHutang;
