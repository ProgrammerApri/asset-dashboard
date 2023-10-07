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
import { SET_FILTDATE_HUT } from "../../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import endpoints from "../../../../utils/endpoints";
import { tr } from "../../../../data/tr";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportHutangRingkasan = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const printPage = useRef(null);
  const filtDate = useSelector((state) => state.filtDate.hut);
  // const [filtDate, setFiltDate] = useState(new Date());
  const [supplier, setSupplier] = useState(null);
  const [selectedSup, setSelected] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState([]);
  const [apFilt, setApFilt] = useState(null);
  const [ap, setAp] = useState(null);
  const [acc, setAcc] = useState(null);
  const [allacc, setAllAcc] = useState(null);
  const [saldoAp, setSaldoAp] = useState(null);
  const [total, setTotal] = useState(null);
  const [cp, setCp] = useState("");
  const setFiltDate = (payload) => {
    dispatch({ type: SET_FILTDATE_HUT, payload: payload });
  };
  const chunkSize = 18;

  useEffect(() => {
    getAPCard();
    getSaldoAp();
  }, []);

  const getAPCard = async () => {
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
        data?.forEach((el) => {
          if (el.trx_dbcr === "k" && el.pay_type === "P1") {
            // if (!el.lunas) {
            filt.push(el);
            // }
          }
        });

        setApFilt(filt);
        setAp(data);

        let grouped = filt?.filter(
          (el, i) =>
            i === filt.findIndex((ek) => el?.sup_id?.id === ek?.sup_id?.id)
        );
        setSupplier(grouped);

        getAcc(data);

        // if (sup_id) {
        //   grouped?.forEach((el) => {
        //     if (el.sup_id?.id === Number(sup_id)) {
        //       setSelectSup([el]);
        //     }
        //   });
        // }
        console.log("=======ref", filt);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSaldoAp = async (sup) => {
    const config = {
      ...endpoints.saldo_sa_ap,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        setSaldoAp(data);
      }
    } catch (error) {}
  };
  const getAcc = async (sup) => {
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
          sup?.forEach((el) => {
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
        setAllAcc(data);
        console.log("dataaaa", sup);
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
    allacc?.forEach((element) => {
      if (value === element?.account.id) {
        selected = element;
      }
    });

    return selected;
  };

  // const myJson = JSON.stringify(ap);
  // localStorage.setItem("testJson", myJson);
  // // console.log("Json", myJson);

  const jsonForExcel = (ap, excel = false) => {
    let data = [];

    let groupedAp = apFilt?.filter(
      (el, i) =>
        i === apFilt.findIndex((ek) => el?.sup_id?.id === ek?.sup_id?.id)
    );

    if (selectedSup?.length && selectedAcc?.length) {
      let total_nd = 0;
      let total_nk = 0;

      selectedSup?.forEach((p) => {
        selectedAcc?.forEach((acc) => {
          groupedAp?.forEach((ek) => {
            let dt = null;
            let amn = 0;
            let acq = 0;
            let trx_amnh = 0;
            let acq_amnh = 0;
            let sa = 0;
            let sisa = 0;
            let sld_efektif = 0;
            let type = null;

            dt = new Date(`${ek.ord_date}Z`);
            type = ek?.trx_type === "LP" ? "Beli" : ek?.trx_type;
            // trx_amnh += ek?.trx_amnh;

            if (dt <= filtDate) {
              if (
                p?.sup_id?.id === ek.sup_id?.id &&
                acc?.account?.id === ek?.sup_id?.sup_hutang
              ) {
                apFilt?.forEach((ej) => {
                  if (p?.sup_id?.id === ej.sup_id?.id) {
                    trx_amnh += ej?.trx_amnh;
                  }
                });

                ap?.forEach((el) => {
                  if (ek?.sup_id?.id === el?.sup_id?.id && !ek?.lunas) {
                    if (el.trx_dbcr == "d") {
                      if (el.trx_type === "SA") {
                        acq_amnh += el.trx_amnh;
                      } else {
                        acq_amnh += el.acq_amnh;
                      }
                    }

                    if (el.trx_dbcr == "d" && el.trx_type == "DP") {
                      sa += el.trx_amnh;
                    }

                    if (el.trx_dbcr == "d" && el.trx_type == "SA") {
                      sld_efektif += el.trx_amnh;
                    }

                    saldoAp?.forEach((element) => {
                      if (
                        el?.trx_code === element?.code &&
                        el?.sa_id?.id === element?.id
                      ) {
                        type =
                          element.type === "BL"
                            ? "Beli"
                            : element?.type === "ND"
                            ? "Nota Debet"
                            : element.type === "NK"
                            ? "Nota Kredit"
                            : "Uang Muka";
                      }
                    });
                  }
                });

                sisa = trx_amnh > 0 ? trx_amnh - (acq_amnh + sa) : 0;
                acq = acq_amnh + sa;

                data.push({
                  type: "item",
                  value: {
                    ref: `${ek.sup_id?.sup_code} - ${ek.sup_id?.sup_name} `,
                    sup_id: ek.sup_id?.id,
                    SE: `${
                      checkAcc(ek.sup_id?.sup_hutang)?.account?.acc_code
                    } - ${checkAcc(ek.sup_id?.sup_hutang)?.account?.acc_name}`,
                    typ: type,
                    value: `Rp. ${formatIdr(trx_amnh)}`,
                    lns: `Rp. ${formatIdr(acq)}`,
                    sisa: `Rp. ${formatIdr(acq >= trx_amnh ? 0 : sisa)}`,
                  },
                });

                total_nd += trx_amnh;
                total_nk += acq_amnh;
              }
            }

            console.log("============");
            console.log(checkAcc(ek.sup_id?.sup_hutang)?.account?.acc_code);
          });

          data.push({
            type: "footer",
            value: {
              ref: tr[localStorage.getItem("language")]["ttl_hutang"],
              SE: "",
              typ: "",
              value: `Rp. ${formatIdr(total_nd)}`,
              lns: `Rp. ${formatIdr(total_nk)}`,
              sisa: `Rp. ${formatIdr(total_nd - total_nk)}`,
            },
          });
        });
      });

      data.push({
        type: "footer",
        value: {
          ref: tr[localStorage.getItem("language")]["ttl_hutang"],
          SE: "",
          typ: "",
          value: `Rp. ${formatIdr(total_nd)}`,
          lns: `Rp. ${formatIdr(total_nk)}`,
          sisa: `Rp. ${formatIdr(total_nd - total_nk)}`,
        },
      });
    } else if (selectedSup?.length) {
      let total_nd = 0;
      let total_nk = 0;
      let sisa = 0;

      selectedSup?.forEach((p) => {
        let amn = 0;
        let acq = 0;
        let trx_amnh = 0;
        let acq_amnh = 0;
        let sa = 0;
        let sld_efektif = 0;
        let type = null;

        ap?.forEach((ek) => {
          if (p?.sup_id?.id === ek.sup_id?.id) {
            let dt = new Date(`${ek.ord_date}Z`);

            type = ek?.trx_type === "LP" ? "Beli" : ek?.trx_type;

            if (dt <= filtDate) {
              if (ek?.trx_dbcr === "k" && ek?.pay_type === "P1") {
                trx_amnh += ek?.trx_amnh;
              }

              if (ek?.trx_dbcr === "d" && ek?.pay_type === "H4") {
                // if (el.trx_dbcr == "d") {
                // if (el.trx_type === "SA") {
                //   acq_amnh += el.trx_amnh;
                // } else {
                acq_amnh += ek.acq_amnh;
                // }
              }

              if (ek?.trx_dbcr === "d" && ek?.pay_type === "P1") {
                acq_amnh += ek.trx_amnh;
              }

              if (ek.trx_dbcr == "d" && ek.trx_type == "DP") {
                sa += ek.trx_amnh;
              }

              if (ek.trx_dbcr == "d" && ek.trx_type == "SA") {
                sld_efektif += ek.trx_amnh;
              }

              saldoAp?.forEach((element) => {
                if (
                  ek?.trx_code === element?.code &&
                  ek?.sa_id?.id === element?.id
                ) {
                  type =
                    element.type === "BL"
                      ? "Beli"
                      : element?.type === "ND"
                      ? "Nota Debet"
                      : element.type === "NK"
                      ? "Nota Kredit"
                      : "Uang Muka";
                }
              });
            }
          }
        });

        data.push({
          type: "item",
          value: {
            ref: `${p.sup_id?.sup_code} - ${p.sup_id?.sup_name} `,
            sup_id: p.sup_id?.id,
            SE: `${checkAcc(p.sup_id?.sup_hutang)?.account?.acc_code} - ${
              checkAcc(p.sup_id?.sup_hutang)?.account?.acc_name
            }`,
            typ: type,
            value: `Rp. ${formatIdr(trx_amnh)}`,
            lns: `Rp. ${formatIdr(acq_amnh)}`,
            sisa: `Rp. ${
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
          ref: tr[localStorage.getItem("language")]["ttl_hutang"],
          SE: "",
          typ: "",
          value: `Rp. ${formatIdr(total_nd)}`,
          lns: `Rp. ${formatIdr(total_nk)}`,
          sisa: `Rp. ${total_nd > 0 ? formatIdr(sisa) : formatIdr(total_nk)}`,
        },
      });
    } else if (selectedAcc?.length) {
      let total_nd = 0;
      let total_nk = 0;

      selectedAcc?.forEach((acc) => {
        groupedAp?.forEach((ek) => {
          let dt = null;
          let amn = 0;
          let acq = 0;
          let trx_amnh = 0;
          let acq_amnh = 0;
          let sa = 0;
          let sisa = 0;
          let sld_efektif = 0;
          let type = null;

          dt = new Date(`${ek.ord_date}Z`);
          type = ek?.trx_type === "LP" ? "Beli" : ek?.trx_type;
          // trx_amnh += ek?.trx_amnh;

          if (dt <= filtDate) {
            if (acc?.account?.id === ek.sup_id?.sup_hutang) {
              apFilt?.forEach((ej) => {
                if (ek?.sup_id?.id === ej.sup_id?.id) {
                  trx_amnh += ej?.trx_amnh;
                }
              });

              ap?.forEach((el) => {
                if (ek?.sup_id?.id === el?.sup_id?.id) {
                  if (el.trx_dbcr == "d") {
                    if (el.trx_type === "SA") {
                      acq_amnh += el.trx_amnh;
                    } else {
                      acq_amnh += el.acq_amnh;
                    }
                  }

                  if (el.trx_dbcr == "d" && el.trx_type == "DP") {
                    sa += el.trx_amnh;
                  }

                  if (el.trx_dbcr == "d" && el.trx_type == "SA") {
                    sld_efektif += el.trx_amnh;
                  }

                  saldoAp?.forEach((element) => {
                    if (
                      el?.trx_code === element?.code &&
                      el?.sa_id?.id === element?.id
                    ) {
                      type =
                        element.type === "BL"
                          ? "Beli"
                          : element?.type === "ND"
                          ? "Nota Debet"
                          : element.type === "NK"
                          ? "Nota Kredit"
                          : "Uang Muka";
                    }
                  });
                }
              });

              sisa = trx_amnh > 0 ? trx_amnh - (acq_amnh + sa) : 0;
              acq = acq_amnh + sa;

              data.push({
                type: "item",
                value: {
                  ref: `${ek.sup_id?.sup_code} - ${ek.sup_id?.sup_name} `,
                  sup_id: ek.sup_id?.id,
                  SE: `${
                    checkAcc(ek.sup_id?.sup_hutang)?.account?.acc_code
                  } - ${checkAcc(ek.sup_id?.sup_hutang)?.account?.acc_name}`,
                  typ: type,
                  value: `Rp. ${formatIdr(trx_amnh)}`,
                  lns: `Rp. ${formatIdr(acq)}`,
                  sisa: `Rp. ${formatIdr(acq >= trx_amnh ? 0 : sisa)}`,
                },
              });

              total_nd += trx_amnh;
              total_nk += acq_amnh;
            }
          }
        });

        data.push({
          type: "footer",
          value: {
            ref: tr[localStorage.getItem("language")]["ttl_hutang"],
            SE: "",
            typ: "",
            value: `Rp. ${formatIdr(total_nd)}`,
            lns: `Rp. ${formatIdr(total_nk)}`,
            sisa: `Rp. ${formatIdr(total_nd - total_nk)}`,
          },
        });
      });
    } else {
      let total_nd = 0;
      let total_nk = 0;
      let sisa = 0;

      if (filtDate) {
        supplier?.forEach((sup) => {
          let amn = 0;
          let acq = 0;
          let trx_amnh = 0;
          let acq_amnh = 0;
          let dp = 0;
          let sld_efektif = 0;
          let type = null;

          ap?.forEach((el) => {
            if (sup?.sup_id?.id === el?.sup_id?.id) {
              let filt = new Date(`${el?.ord_date}Z`);
              if (filt <= filtDate) {
                if (el.trx_dbcr === "k" && el?.pay_type === "P1") {
                  trx_amnh += el.trx_amnh ?? 0;
                }

                if (el.trx_dbcr === "d" && el?.pay_type === "H4") {
                  // if (el.trx_type === "SA") {
                  //   acq_amnh += el.trx_amnh;
                  // } else {
                  acq_amnh += el.acq_amnh ?? 0;
                  // }
                }

                if (el.trx_dbcr === "d" && el?.pay_type === "P1") {
                  acq_amnh += el.trx_amnh ?? 0;
                }

                if (el.trx_dbcr === "d" && el.trx_type === "DP") {
                  dp += el.trx_amnh;
                }

                if (el.trx_dbcr === "d" && el.trx_type === "SA") {
                  sld_efektif += el.trx_amnh;
                }
              }

              acq = acq_amnh + dp;
            }

            console.log("appppp");
            console.log(el);
          });

          data.push({
            type: "item",
            value: {
              ref: `${sup?.sup_id?.sup_code} - ${sup?.sup_id?.sup_name} `,
              sup_id: sup?.sup_id?.id,
              SE: `${checkAcc(sup?.sup_id?.sup_hutang)?.account?.acc_code} - ${
                checkAcc(sup?.sup_id?.sup_hutang)?.account?.acc_name
              }`,
              typ: type,
              value: `Rp. ${formatIdr(trx_amnh)}`,
              lns: `Rp. ${formatIdr(acq_amnh)}`,
              sisa: `Rp. ${
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
            ref: tr[localStorage.getItem("language")]["ttl_hutang"],
            SE: "",
            typ: "",
            value: `Rp. ${formatIdr(total_nd)}`,
            lns: `Rp. ${formatIdr(total_nk)}`,
            sisa: `Rp. ${total_nd > 0 ? formatIdr(sisa) : formatIdr(total_nk)}`,
          },
        });
      }
    }

    let final = [
      {
        columns: [
          {
            title: "Accounts Payable Summary",
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

    let item = [];
    data.forEach((ek) => {
      item.push([
        {
          value: `${ek[ek.length - 1]?.value.ref}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },

        {
          value: `${ek[ek.length - 1]?.value.SE}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },

        {
          value: `${ek[ek.length - 1]?.value.typ}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },

        {
          value: `${ek[ek.length - 1]?.value.value}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },

        {
          value: `${ek[ek.length - 1]?.value.lns}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek[ek.length - 1]?.value.sisa}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" ? true : false,
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
          title: tr[localStorage.getItem("language")].nm_sup,
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
          title: "Transaction Type",
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
          title: tr[localStorage.getItem("language")].bayar,
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
          title: "Sisa",
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
        <div className="col-8 ml-0 mr-0 pl-0 pt-0">
          <Row className="mt-0">
            <div className="p-inputgroup col-3">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar" />
              </span>
              <Calendar
                value={filtDate}
                onChange={(e) => {
                  console.log(e.value);
                  setFiltDate(e.value);
                }}
                // selectionMode="range"
                placeholder={tr[localStorage.getItem("language")].pilih_tgl}
                dateFormat="dd-mm-yy"
              />
            </div>
            <div className="p-inputgroup col-3">
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
              filename={`Accounts_Payable_Summary_export_${new Date().getTime()}`}
              sheetname="report"
            /> */}

            <ExcelFile
              filename={`Accounts_Payable_Summary_export_${new Date().getTime()}`}
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
        {chunk(jsonForExcel(ap) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  viewOnly
                  horizontal
                  tittle={"Accounts Payable Summary"}
                  subTittle={`Accounts Payable Summary as ${
                    filtDate ? formatDate(filtDate) : "-"
                  }`}
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
                          header={tr[localStorage.getItem("language")].nm_sup}
                          style={{ width: "20rem" }}
                          field={(e) => e?.value?.ref}
                          body={(e) =>
                            e.type === "item" ? (
                              <Link
                                to={`/laporan/ap/saldo-hutang-rincian/${btoa(
                                  `m'${filtDate?.getMonth() + 1}`
                                )}/${btoa(
                                  `y'${filtDate?.getFullYear()}`
                                )}/${btoa(
                                  btoa(
                                    JSON.stringify({
                                      sup_id: e.value?.sup_id,
                                    })
                                  )
                                )}`}
                              >
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
                          // className="header-right text-r"
                          header="Account Distribution"
                          style={{ width: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold"
                                  : e.type === "footer"
                                  ? "font-weight-bold"
                                  : "text-left"
                              }
                            >
                              {e.value.SE}
                            </div>
                          )}
                        />

                        {/* <Column
                          // className="header-right text-r"
                          header="Trans Type"
                          style={{ width: "8rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold"
                                  : e.type === "footer"
                                  ? "font-weight-bold"
                                  : "text-left"
                              }
                            >
                              {e.value.typ}
                            </div>
                          )}
                        /> */}

                        <Column
                          className="header-right text-right"
                          header={
                            tr[localStorage.getItem("language")].cred_scor
                          }
                          style={{ width: "10rem" }}
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
                              {e.value.value}
                            </div>
                          )}
                        />
                        <Column
                          className="header-right text-right"
                          header={
                            tr[localStorage.getItem("language")].debit_scor
                          }
                          style={{ width: "10rem" }}
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
                              {e.value.lns}
                            </div>
                          )}
                        />
                        <Column
                          className="header-right text-right"
                          header={tr[localStorage.getItem("language")].sisa}
                          style={{ width: "10rem" }}
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
                              {e.value.sisa}
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
        <Card className="ml-1 mr-1 mt-2">
          <Card.Body className="p-0 m-0" ref={printPage}>
            {chunk(jsonForExcel(ap) ?? [], chunkSize)?.map((val, idx) => {
              return (
                <Card className="ml-1 mr-1 mt-2">
                  <Card.Body className="p-0 m-0">
                    <CustomeWrapper
                      tittle={"Accounts Payable Summary"}
                      subTittle={`Accounts Payable Summary as ${
                        filtDate ? formatDate(filtDate) : "-"
                      }`}
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
                              header={
                                tr[localStorage.getItem("language")].nm_sup
                              }
                              style={{ width: "20rem" }}
                              field={(e) => e?.value?.ref}
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
                                  {e.value.ref}
                                </div>
                              )}
                            />

                            <Column
                              // className="header-right text-r"
                              header="Account Distribution"
                              style={{ width: "10rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold"
                                      : e.type === "footer"
                                      ? "font-weight-bold"
                                      : "text-left"
                                  }
                                >
                                  {e.value.SE}
                                </div>
                              )}
                            />

                            <Column
                              // className="header-right text-r"
                              header="Trans Type"
                              style={{ width: "8rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold"
                                      : e.type === "footer"
                                      ? "font-weight-bold"
                                      : "text-left"
                                  }
                                >
                                  {e.value.typ}
                                </div>
                              )}
                            />

                            <Column
                              className="header-right text-right"
                              header="Nilai Kredit"
                              style={{ width: "10rem" }}
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
                                  {e.value.value}
                                </div>
                              )}
                            />
                            <Column
                              className="header-right text-right"
                              header="Nilai Debet"
                              style={{ width: "10rem" }}
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
                                  {e.value.lns}
                                </div>
                              )}
                            />
                            <Column
                              className="header-right text-right"
                              header="Sisa"
                              style={{ width: "10rem" }}
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
                                  {e.value.sisa}
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

export default ReportHutangRingkasan;
