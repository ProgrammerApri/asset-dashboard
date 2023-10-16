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
import { Link } from "react-router-dom";
// import ExcelExportHelper from "../../../components/ExportExcel/ExcelExportHelper";
import { MultiSelect } from "primereact/multiselect";
import { CardHeader } from "@material-ui/core";
import endpoints from "../../../../utils/endpoints";
import { tr } from "../../../../data/tr";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportPiutangRingkasan = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [acc, setAcc] = useState(null);
  const [saldoAr, setSaldoAr] = useState(null);
  const [selectedCus, setSelected] = useState(null);
  const [selectedAcc, setSelectedAcc] = useState([]);
  const [ar, setAr] = useState(null);
  const [total, setTotal] = useState(null);
  const [cp, setCp] = useState("");
  const chunkSize = 13;

  useEffect(() => {
    getARCard();
    // getAcc();
    getSaldoAr();
  }, []);

  const getARCard = async (cus) => {
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

        setAr(data);
        setTotal(total);

        let grouped = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.cus_id?.id === ek?.cus_id?.id)
        );
        setCustomer(grouped);
        getAcc(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAcc = async (cus) => {
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
          cus?.forEach((el) => {
            if (elem.account?.id === el.cus_id?.cus_gl) {
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

  const getSaldoAr = async (cus) => {
    const config = {
      ...endpoints.saldo_sa_ar,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        setSaldoAr(data);
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

  const checkAcc = (value) => {
    let selected = {};
    acc?.forEach((element) => {
      if (value === element?.account?.id) {
        selected = element;
      }
    });

    return selected;
  };

  const jsonForExcel = (ar, excel = false) => {
    let data = [];

    // if (selectedCus?.length && selectedAcc?.length) {
    //   let total_nd = 0;
    //   let total_nk = 0;
    //   let sisa = 0;
    //   selectedCus.forEach((cus) => {
    //     selectedAcc.forEach((sel) => {
    //       ar?.forEach((el) => {
    //         if (
    //           cus?.cus_id?.id === el.customer?.id &&
    //           sel?.account?.id === el?.customer?.cus_gl
    //         ) {
    //           let amn = 0;
    //           let acq = 0;
    //           let trx_amnh = 0;
    //           let acq_amnh = 0;
    //           let dp = 0;
    //           let sld_efektif = 0;
    //           let type = null;

    //           el.ar.forEach((ek) => {
    //             let filt = new Date(`${ek?.trx_date}Z`);
    //             console.log(filt);
    //             if (cus?.cus_id?.id === ek?.cus_id?.id) {
    //               if (filt <= filtDate) {
    //                 if (ek.trx_dbcr === "D") {
    //                   trx_amnh += ek.trx_amnh ?? 0;
    //                 } else {
    //                   if (ek.trx_type === "SA") {
    //                     acq_amnh += ek.trx_amnh ?? 0;
    //                   } else {
    //                     acq_amnh += ek.acq_amnh ?? 0;
    //                   }
    //                 }

    //                 if (ek.trx_dbcr === "K" && ek.trx_type === "DP") {
    //                   dp += ek.trx_amnh;
    //                 }

    //                 if (ek.trx_dbcr === "K" && ek.trx_type === "SA") {
    //                   sld_efektif += ek.trx_amnh;
    //                 }

    //                 saldoAr?.forEach((element) => {
    //                   if (
    //                     ek?.trx_code === element?.code &&
    //                     ek?.sa_id?.id === element?.id
    //                   ) {
    //                     type =
    //                       element.type === "JL"
    //                         ? "Jual"
    //                         : element?.type === "ND"
    //                         ? "Nota Debet"
    //                         : element.type === "NK"
    //                         ? "Nota Kredit"
    //                         : "Uang Muka";
    //                   }
    //                 });
    //               }
    //             }
    //           });
    //           sisa = trx_amnh > 0 ? trx_amnh - (acq_amnh + dp) : 0;
    //           acq = acq_amnh + dp;

    //           data.push({
    //             cus: `${el.customer.cus_name} (${el.customer.cus_code})`,
    //             type: "item",
    //             value: {
    //               ref: `${el.customer.cus_name} (${el.customer.cus_code})`,
    //               cus_id: el.customer?.id,
    //               SE: `${checkAcc(el.customer?.cus_gl)?.account?.acc_code} - ${
    //                 checkAcc(el.customer?.cus_gl)?.account?.acc_name
    //               }`,
    //               type: type,
    //               NB: `Rp. ${formatIdr(trx_amnh)}`,
    //               PB: `Rp. ${formatIdr(acq_amnh)}`,
    //               SB: `Rp. ${
    //                 trx_amnh > 0
    //                   ? formatIdr(acq >= trx_amnh ? 0 : sisa)
    //                   : formatIdr(acq)
    //               }`,
    //             },
    //           });

    //           total_nd += trx_amnh;
    //           total_nk += acq;
    //         }
    //       });
    //     });
    //   });

    //   data.push({
    //     type: "footer",
    //     value: {
    //       ref: tr[localStorage.getItem("language")]["ttl_piutang"],
    //       SE: "",
    //       NB: `Rp. ${formatIdr(total_nd)}`,
    //       PB: `Rp. ${formatIdr(total_nk)}`,
    //       SB: `Rp. ${
    //         total_nd > 0 ? formatIdr(total_nd - total_nk) : formatIdr(total_nk)
    //       }`,
    //     },
    //   });
    // } else
    if (selectedCus?.length) {
      let total_nd = 0;
      let total_nk = 0;
      let sisa = 0;
      selectedCus?.forEach((p) => {
        let amn = 0;
        let acq = 0;
        let trx_amnh = 0;
        let acq_amnh = 0;
        let dp = 0;
        let sld_efektif = 0;
        let type = null;

        ar?.forEach((ek) => {
          if (p?.cus_id?.id === ek?.cus_id?.id) {
            let filt = new Date(`${ek?.trx_date}Z`);
            if (filt <= filtDate) {
              if (ek.trx_dbcr === "D" && ek?.pay_type === "P1") {
                trx_amnh += ek.trx_amnh ?? 0;
              }
              if (ek.trx_dbcr === "K" && ek?.pay_type === "J4") {
                // if (el.trx_type === "SA") {
                //   acq_amnh += el.trx_amnh;
                // } else {
                acq_amnh += ek.acq_amnh ?? 0;
                // }
              }

              if (ek.trx_dbcr === "K" && ek?.pay_type === "P1") {
                acq_amnh += ek.trx_amnh ?? 0;
              }

              if (ek.trx_dbcr === "K" && ek.trx_type === "DP") {
                dp += ek.trx_amnh;
              }

              if (ek.trx_dbcr === "K" && ek.trx_type === "SA") {
                sld_efektif += ek.trx_amnh;
              }

              saldoAr?.forEach((element) => {
                if (
                  ek?.trx_code === element?.code &&
                  ek?.sa_id?.id === element?.id
                ) {
                  type =
                    element.type === "JL"
                      ? "Jual"
                      : element?.type === "ND"
                      ? "Nota Debet"
                      : element.type === "NK"
                      ? "Nota Kredit"
                      : "Uang Muka";
                }
              });
            }
          }
          // }
        });

        data.push({
          cus: `${p?.cus_id?.cus_name} (${p?.cus_id?.cus_code})`,
          type: "item",
          value: {
            ref: `${p?.cus_id?.cus_name} (${p?.cus_id?.cus_code})`,
            cus_id: p?.cus_id?.id,
            SE: `${checkAcc(p.cus_id?.cus_gl)?.account?.acc_code} - ${
              checkAcc(p.cus_id?.cus_gl)?.account?.acc_name
            }`,
            type: type,
            NB: `Rp. ${formatIdr(trx_amnh)}`,
            PB: `Rp. ${formatIdr(acq_amnh)}`,
            SB: `Rp. ${
              trx_amnh > 0
                ? formatIdr(acq_amnh >= trx_amnh ? 0 : trx_amnh - acq_amnh)
                : formatIdr(acq_amnh)
            }`,
          },
        });

        total_nk += trx_amnh;
        total_nd += acq_amnh;
        sisa += trx_amnh - acq_amnh;
      });

      data.push({
        // cus: `${el.customer.cus_name} (${el.customer.cus_code})`,
        type: "footer",
        value: {
          ref: tr[localStorage.getItem("language")]["ttl_piutang"],
          SE: "",
          NB: `Rp. ${formatIdr(total_nk)}`,
          PB: `Rp. ${formatIdr(total_nd)}`,
          SB: `Rp. ${total_nd > 0 ? formatIdr(sisa) : formatIdr(total_nk)}`,
        },
      });
    } else if (selectedAcc?.length) {
      let total_nd = 0;
      let total_nk = 0;
      selectedAcc.forEach((sel) => {
        ar?.forEach((el) => {
          if (sel?.account?.id === el?.cus_id?.cus_gl) {
            let amn = 0;
            let acq = 0;
            let trx_amnh = 0;
            let acq_amnh = 0;
            let dp = 0;
            let sisa = 0;
            let sld_efektif = 0;
            let type = null;

            // el?.ar?.forEach((ek) => {
              let filt = new Date(`${el?.trx_date}Z`);
              console.log(filt);
              if (filt <= filtDate) {
                // if (p?.cus_id?.id === ek?.cus_id?.id) {
                if (el.trx_dbcr === "D") {
                  trx_amnh += el.trx_amnh ?? 0;
                } else {
                  if (el.trx_type === "SA") {
                    acq_amnh += el.trx_amnh;
                  } else {
                    acq_amnh += el.acq_amnh ?? 0;
                  }
                }

                if (el.trx_dbcr === "K" && el.trx_type === "DP") {
                  dp += el.trx_amnh;
                }

                saldoAr?.forEach((element) => {
                  if (
                    el?.trx_code === element?.code &&
                    el?.sa_id?.id === element?.id
                  ) {
                    type =
                      element.type === "JL"
                        ? "Jual"
                        : element?.type === "ND"
                        ? "Nota Debet"
                        : element.type === "NK"
                        ? "Nota Kredit"
                        : "Uang Muka";
                  }
                });
              }
            // });
            sisa = trx_amnh > 0 ? trx_amnh - (acq_amnh + dp) : 0;
            acq = acq_amnh + dp;

            data.push({
              cus: `${el?.cus_id?.cus_name} (${el?.cus_id?.cus_code})`,
              type: "item",
              value: {
                ref: `${el?.cus_id?.cus_name} (${el?.cus_id?.cus_code})`,
                cus_id: el?.cus_id?.id,
                SE: `${checkAcc(el?.cus_id?.cus_gl)?.account?.acc_code} - ${
                  checkAcc(el?.cus_id?.cus_gl)?.account?.acc_name
                }`,
                type: type,
                NB: `Rp. ${formatIdr(trx_amnh)}`,
                PB: `Rp. ${formatIdr(acq_amnh)}`,
                SB: `Rp. ${
                  trx_amnh > 0
                    ? formatIdr(acq_amnh >= trx_amnh ? 0 : sisa)
                    : formatIdr(acq_amnh)
                }`,
              },
            });

            total_nd += trx_amnh;
            total_nk += acq_amnh;
          }
        });
      });

      data.push({
        type: "footer",
        value: {
          ref: tr[localStorage.getItem("language")]["ttl_piutang"],
          SE: "",
          NB: `Rp. ${formatIdr(total_nd)}`,
          PB: `Rp. ${formatIdr(total_nk)}`,
          SB: `Rp. ${
            total_nd > 0 ? formatIdr(total_nd - total_nk) : formatIdr(total_nk)
          }`,
        },
      });
    } else {
      let total_nd = 0;
      let total_nk = 0;
      let sisa = 0;

      if (filtDate) {
        customer?.forEach((cus) => {
          let amn = 0;
          let acq = 0;
          let trx_amnh = 0;
          let acq_amnh = 0;
          let dp = 0;
          let sld_efektif = 0;
          let type = null;
          ar?.forEach((el) => {
            if (cus?.cus_id?.id === el?.cus_id?.id) {
              let filt = new Date(`${el?.trx_date}Z`);
              if (filt <= filtDate) {
                if (el.trx_dbcr === "D" && el?.pay_type === "P1") {
                  trx_amnh += el.trx_amnh ?? 0;
                }

                if (el.trx_dbcr === "K" && el?.pay_type === "J4") {
                  // if (el.trx_type === "SA") {
                  //   acq_amnh += el.trx_amnh;
                  // } else {
                  acq_amnh += el.acq_amnh ?? 0;
                  // }
                }

                if (el.trx_dbcr === "K" && el?.pay_type === "P1") {
                  acq_amnh += el.trx_amnh ?? 0;
                }

                if (el.trx_dbcr === "K" && el.trx_type === "DP") {
                  dp += el.trx_amnh;
                }

                if (el.trx_dbcr === "K" && el.trx_type === "SA") {
                  sld_efektif += el.trx_amnh;
                }

                type =
                  el?.trx_type === "JL"
                    ? "Penjualan"
                    : el?.trx_type === "SA"
                    ? "Saldo Awal"
                    : el?.trx_type === "KOR"
                    ? "Koreksi Pitang"
                    : el?.trx_type;

                // saldoAr?.forEach((element) => {
                //   if (
                //     el?.trx_code === element?.code &&
                //     el?.sa_id?.id === element?.id
                //   ) {
                //     type =
                //       element.type === "JL"
                //         ? "Jual"
                //         : element?.type === "ND"
                //         ? "Nota Debet"
                //         : element.type === "NK"
                //         ? "Nota Kredit"
                //         : "Uang Muka";
                //   }
                //   console.log("===type");
                //   console.log(element);
                // });
              }

              // sisa =
              //   trx_amnh > 0
              //     ? trx_amnh - (acq_amnh + dp)
              //     : trx_amnh === 0
              //     ? acq_amnh
              //     : 0;
              acq = acq_amnh + dp;
            }
          });

          data.push({
            cus: `${cus?.cus_id?.cus_name} \n (${cus?.cus_id?.cus_code})`,
            type: "item",
            value: {
              ref: `${cus?.cus_id?.cus_name} \n (${cus?.cus_id?.cus_code})`,
              cus_id: cus?.cus_id?.id,
              SE: `${checkAcc(cus?.cus_id?.cus_gl)?.account?.acc_code} - ${
                checkAcc(cus?.cus_id?.cus_gl)?.account?.acc_name
              }`,
              type: type,
              NB: `Rp. ${formatIdr(trx_amnh)}`,
              PB: `Rp. ${formatIdr(acq_amnh)}`,
              SB: `Rp. ${
                trx_amnh > 0
                  ? formatIdr(acq_amnh >= trx_amnh ? 0 : trx_amnh - acq_amnh)
                  : formatIdr(acq_amnh)
              }`,
            },
          });
          total_nd += trx_amnh;
          total_nk += acq_amnh;
          sisa += trx_amnh - acq_amnh;
        });

        data.push({
          type: "footer",
          value: {
            ref: tr[localStorage.getItem("language")]["ttl_piutang"],
            SE: "",
            NB: `Rp. ${formatIdr(total_nd)}`,
            PB: `Rp. ${formatIdr(total_nk)}`,
            SB: `Rp. ${
              total_nd > 0
                ? formatIdr(total_nd - total_nk)
                : formatIdr(total_nk)
            }`,
          },
        });
      }
    }

    let final = [
      {
        columns: [
          {
            title: "Summary Accounts Receivable Balance",
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
          value: `${ek.value.ref}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: `${ek.value.SE}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: `${ek.value.type}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: `${ek.value.NB}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek.value.PB}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek.value.SB}`,
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
          title: "Account Distribution",
          width: { wch: 25 },
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
          title: "Transaction type",
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
          title: tr[localStorage.getItem("language")].nilai,
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
          title: tr[localStorage.getItem("language")].bayar,
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
          title: tr[localStorage.getItem("language")].sisa_bayar,
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
      ],
      data: item,
    });

    // console.log(final);

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

  const glTemplate = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.account.acc_code} - ${option.account.acc_name}`
          : ""}
      </div>
    );
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
            <div className="p-inputgroup col-3">
              <MultiSelect
                value={selectedCus ?? null}
                options={customer}
                onChange={(e) => {
                  setSelected(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_cus}
                optionLabel="cus_id.cus_name"
                filter
                filterBy="cus_id.cus_name"
                showClear
                display="chip"
                // className="w-full md:w-22rem"
                maxSelectedLabels={3}
              />
            </div>
            <div className="p-inputgroup col-3">
              <MultiSelect
                value={selectedAcc ?? null}
                options={acc}
                onChange={(e) => {
                  setSelectedAcc(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_acc}
                optionLabel="account.acc_name"
                showClear
                filterBy="account.acc_name"
                filter
                itemTemplate={glTemplate}
                display="chip"
                // className="md:w-22rem"
                maxSelectedLabels={3}
              />
            </div>
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            {/* <ExcelExportHelper
              json={ar ? jsonForExcel(ar, true) : null}
              filename={`Accounts_Receivable_Summary_Balance_export_${new Date().getTime()}`}
              sheetname="report"
            /> */}

            <ExcelFile
              filename={`Accounts_Receivable_Summary_Balance_export_${new Date().getTime()}`}
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

      <Row className="m-0 justify-content-center">
        {chunk(jsonForExcel(ar) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  viewOnly
                  horizontal
                  tittle={"Summary Accounts Receivable Balance"}
                  subTittle={`Summary Accounts Receivable Balance as ${formatDate(
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
                        // className="header-white report"
                        emptyMessage={
                          tr[localStorage.getItem("language")].data_kosong
                        }
                      >
                        <Column
                          header="Customer"
                          style={{ minWidth: "15rem" }}
                          // field={(e) => e[e.length - 1]?.value?.ref}
                          body={(e) =>
                            e?.type === "item" ? (
                              <Link
                                to={`/laporan/ar/saldo-piutang-rincian/${btoa(
                                  `m'${filtDate?.getMonth() + 1}`
                                )}/${btoa(
                                  `y'${filtDate.getFullYear()}`
                                )}/${btoa(
                                  btoa(
                                    JSON.stringify({ cus_id: e.value.cus_id })
                                  )
                                )}`}
                              >
                                <div
                                  // style={{ whiteSpace: "pre-wrap" }}
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold"
                                      : e.type === "footer"
                                      ? "font-weight-bold"
                                      : ""
                                  }
                                >
                                  {e.value.ref}
                                </div>
                              </Link>
                            ) : (
                              <div
                                className={
                                  e.type === "header"
                                    ? "font-weight-bold"
                                    : e.type === "footer"
                                    ? "font-weight-bold"
                                    : ""
                                }
                              >
                                {e.value.ref}
                              </div>
                            )
                          }
                        />
                        <Column
                          // className="header"
                          header="Account Distribution"
                          style={{ minWidth: "7rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold"
                                  : e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.SE}
                            </div>
                          )}
                        />
                        {/* <Column
                          // className="header"
                          header={
                            tr[localStorage.getItem("language")].type_trans
                          }
                          style={{ minWidth: "7rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold"
                                  : e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.type}
                            </div>
                          )}
                        /> */}
                        <Column
                          className="header-right text-right"
                          header={
                            tr[localStorage.getItem("language")].debit_scor
                          }
                          style={{ minWidth: "7rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {e.value.NB}
                            </div>
                          )}
                        />
                        <Column
                          className="header-right text-right"
                          header={
                            tr[localStorage.getItem("language")].cred_scor
                          }
                          style={{ minWidth: "7rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {e.value.PB}
                            </div>
                          )}
                        />
                        <Column
                          className="header-right text-right"
                          header={tr[localStorage.getItem("language")].sisa}
                          style={{ minWidth: "7rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {e.value.SB}
                            </div>
                          )}
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

      <Row className="m-0 justify-content-center d-none">
        <Card>
          <Card.Body className="p-0 m-0" ref={printPage}>
            {chunk(jsonForExcel(ar) ?? [], chunkSize)?.map((val, idx) => {
              return (
                <Card className="ml-1 mr-1 mt-2">
                  <Card.Body className="p-0 m-0">
                    <CustomeWrapper
                      tittle={"Summary Accounts Receivable Balance"}
                      subTittle={`Summary Accounts Receivable Balance as ${formatDate(
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
                            emptyMessage={
                              tr[localStorage.getItem("language")].data_kosong
                            }
                          >
                            <Column
                              header="Customer"
                              style={{ minWidth: "7rem" }}
                              // field={(e) => e[e.length - 1]?.value?.ref}
                              body={(e) => (
                                <div
                                  style={{ whiteSpace: "pre-wrap" }}
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold"
                                      : e.type === "footer"
                                      ? "font-weight-bold"
                                      : ""
                                  }
                                >
                                  {e.value.ref}
                                </div>
                              )}
                            />
                            <Column
                              // className="header"
                              header="Account Distribution"
                              style={{ minWidth: "7rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold"
                                      : e.type === "footer"
                                      ? "font-weight-bold"
                                      : ""
                                  }
                                >
                                  {e.value.SE}
                                </div>
                              )}
                            />
                            <Column
                              // className="header"
                              header={
                                tr[localStorage.getItem("language")].type_trans
                              }
                              style={{ minWidth: "7rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold"
                                      : e.type === "footer"
                                      ? "font-weight-bold"
                                      : ""
                                  }
                                >
                                  {e.value.type}
                                </div>
                              )}
                            />
                            <Column
                              className="header-right text-right"
                              header={
                                tr[localStorage.getItem("language")].debit_scor
                              }
                              style={{ minWidth: "7rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold text-right mr-2"
                                      : e.type === "footer"
                                      ? "font-weight-bold text-right mr-2"
                                      : "text-right mr-2"
                                  }
                                >
                                  {e.value.NB}
                                </div>
                              )}
                            />
                            <Column
                              className="header-right text-right"
                              header={
                                tr[localStorage.getItem("language")].cred_scor
                              }
                              style={{ minWidth: "7rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold text-right mr-2"
                                      : e.type === "footer"
                                      ? "font-weight-bold text-right mr-2"
                                      : "text-right mr-2"
                                  }
                                >
                                  {e.value.PB}
                                </div>
                              )}
                            />
                            <Column
                              className="header-right text-right"
                              header={tr[localStorage.getItem("language")].sisa}
                              style={{ minWidth: "7rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold text-right mr-2"
                                      : e.type === "footer"
                                      ? "font-weight-bold text-right mr-2"
                                      : "text-right mr-2"
                                  }
                                >
                                  {e.value.SB}
                                </div>
                              )}
                            />
                          </DataTable>
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

export default ReportPiutangRingkasan;
