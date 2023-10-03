import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";

// import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import { Dropdown } from "primereact/dropdown";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
// import ExcelExportHelper from "../../../components/ExportExcel/ExcelExportHelper";
import { Link } from "react-router-dom";
import formatIdr from "../../../../utils/formatIdr";
import { MultiSelect } from "primereact/multiselect";
import { tr } from "src/data/tr";
import { ProgressSpinner } from "primereact/progressspinner";

const data = {};

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const KartuStock = ({ month, year, locat, produ }) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [location, setLoc] = useState(null);
  const [selectedProduct, setSelected] = useState(null);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [selectedGrup, setSelectedGrup] = useState(null);
  const [comp, setComp] = useState(null);
  const [invDdb, setInvDdb] = useState(null);
  const [stCard, setStCard] = useState(null);
  const [grupProd, setGrupP] = useState(null);
  const printPage = useRef(null);
  // const [filtersDate, setFiltersDate] = useState([
  //   month && year ? new Date(year, month - 1, 1) : new Date(),
  //   month && year ? new Date(year, month - 1, 1) : new Date(),
  // ]);
  const [filtDate, setFiltDate] = useState(
    year && month ? new Date(year, month - 1, 1) : null
  );
  const chunkSize = 14;
  const [cp, setCp] = useState("");

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getSt(locat);
    getInvDdb();
    getComp();
  }, []);

  const getMonthlyDates = (start, count) => {
    var result = [];
    var temp;
    var year = start.getFullYear();
    var month = start.getMonth();
    var startDay = start.getDate();
    for (var i = 0; i < count; i++) {
      temp = new Date(year, month + i, startDay);
      if (temp.getDate() != startDay) temp.setDate(0);
      result.push(temp);
    }
    return result;
  };

  const getComp = async () => {
    const config = {
      ...endpoints.getCompany,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setComp(data);
      }
    } catch (error) {}
  };

  const getInvDdb = async () => {
    const config = {
      ...endpoints.posting,
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data?.forEach((element) => {
          if (!element?.from_closing) {
            filt.push(element);
          }
        });
        setInvDdb(filt);
        let month = [];
        let date = [];
        data
          .map((v) => !v.from_closing && v)
          .forEach((ej) => {
            // if (
            //   filtDate?.getFullYear() === ej?.inv_year &&
            //   filtDate?.getMonth() + 1 >= ej?.inv_month
            // ) {
            date.push(new Date(ej.inv_year, ej.inv_month - 1));
            // month.push(ej.inv_month);
            // }
          });

        // if (date.length) {
        //   // setMaxDate(Math.max(...month));
        //   setMaxDate(new Date(Math.max(...date)).getMonth() + 1);
        //   if (!filtDate) {
        //     setFiltDate(new Date());
        //     setMonthPost(date);
        //   }
        // }
      }
    } catch (error) {}
  };

  const getSt = async (id, lo) => {
    setLoading(true);
    const config = {
      ...endpoints.st_card,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setStCard(data);
        let grouped = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.prod_id?.id === ek?.prod_id?.id)
        );
        let grouploc = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.loc_id?.id === ek?.loc_id?.id)
        );
        setProduct(grouped);
        setLoc(grouploc);

        getGrupProd(data);

        if (lo) {
          grouploc?.forEach((elem) => {
            if (elem?.loc_id?.id === Number(lo)) {
              selectedLoc([elem]);
            }
          });
        }
        if (produ) {
          grouped?.forEach((el) => {
            if (el.prod_id?.id === Number(produ)) {
              setSelected([el]);
            }
          });
        }
      }
    } catch (error) {}
    setLoading(false);
  };

  const getGrupProd = async (stcard) => {
    const config = {
      ...endpoints.groupPro,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data?.forEach((element) => {
          stcard?.forEach((elem) => {
            if (element?.groupPro?.id === elem?.prod_id?.group) {
              filt.push(element);
            }
          });
        });

        let grouped = filt?.filter(
          (el, i) =>
            i === filt?.findIndex((ek) => el?.groupPro?.id === ek?.groupPro?.id)
        );

        setGrupP(grouped);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const jsonForExcel = (stCard, excel = false) => {
    let data = [];
    let month = [];

    stCard?.forEach((ej) => {
      if (
        filtDate?.getFullYear() === ej.trx_date &&
        filtDate?.getMonth() + 1 >= ej.trx_date
      ) {
        month.push(ej.trx_date);
      }
    });

    if (selectedProduct && selectedLoc) {
      selectedProduct?.forEach((prd) => {
        selectedLoc?.forEach((loc) => {
          let saldo = 0;
          let qty_awal = 0;
          let deb = 0;
          let kre = 0;

          let trn = [
            {
              type: "header",
              value: {
                trx_code: tr[localStorage.getItem("language")].kd_tran,
                trx_date: tr[localStorage.getItem("language")].tgl,
                trx_type: tr[localStorage.getItem("language")].jns_tran,
                lok: tr[localStorage.getItem("language")].lokasi,
                trx_debit: tr[localStorage.getItem("language")].mutasi_deb,
                trx_kredit: tr[localStorage.getItem("language")].mutasi_kred,
                sld: "Saldo",
              },
            },
          ];

          invDdb?.forEach((elem) => {
            if (
              prd.prod_id.id === elem.inv_code.id &&
              loc.loc_id.id === elem.loc_code.id
            ) {
              if (
                elem?.sa &&
                !elem?.from_closing
                // elem.inv_month <= filtDate?.getMonth() + 1 &&
                // (elem.inv_year == filtDate?.getFullYear() ||
                //   elem.inv_year <= filtDate?.getFullYear())
              ) {
                qty_awal += elem.qty_awal;
                // amnt_akhir += el.inv_akhir;
              }
            }
          });

          stCard?.forEach((stc) => {
            if (prd?.prod_id?.id === stc?.prod_id?.id) {
              if (loc?.loc_id?.id === stc?.loc_id?.id) {
                let dt = new Date(`${stc?.trx_date}Z`);
                if (dt.getMonth() <= filtDate?.getMonth()) {
                  if (dt.getFullYear() === filtDate?.getFullYear()) {
                    if (stc.trx_dbcr === "d") {
                      saldo += stc.trx_qty;
                    } else {
                      saldo -= stc.trx_qty;
                    }
                  }
                }
              }
            }
          });

          let sa = qty_awal;
          let t_deb = 0;
          let t_kre = 0;
          let st = 0;

          stCard?.forEach((el) => {
            if (prd?.prod_id?.id === el?.prod_id?.id) {
              if (loc?.loc_id?.id === el?.loc_id?.id) {
                let dt = new Date(`${el?.trx_date}Z`);
                if (dt.getFullYear() === filtDate?.getFullYear()) {
                  if (dt.getMonth() <= filtDate?.getMonth()) {
                    deb = el.trx_dbcr === "d" ? el.trx_qty : 0;
                    kre = el.trx_dbcr === "k" ? el.trx_qty : 0;

                    // if (el.trx_dbcr === "d") {
                    sa += deb - kre;
                    // } else {
                    //   sa += t_kre - t_deb;
                    // }

                    st += el.trx_hpok ?? 0;

                    if (deb === 0 && kre === 0) {
                      trn.push({});
                    } else {
                      trn.push({
                        type: "item",
                        value: {
                          trx_code: el.trx_code,
                          trx_date: formatDate(el.trx_date),
                          trx_type:
                            el.trx_type === "BL"
                              ? "Pembelian"
                              : el.trx_type === "JL"
                              ? "Penjualan"
                              : el.trx_type === "MK"
                              ? "Mutasi Kredit"
                              : el.trx_type === "MD"
                              ? "Mutasi Debet"
                              : el.trx_type === "SA"
                              ? "Saldo Awal"
                              : el.trx_type === "HRV"
                              ? "Panen"
                              : el.trx_type,
                          lok: `${el.loc_id?.name}`,
                          trx_debit: formatTh(deb),
                          // el.trx_dbcr === "d" ? formatTh(el.trx_qty) : 0,
                          trx_kredit: formatTh(kre),
                          // el.trx_dbcr === "k" ? formatTh(el.trx_qty) : 0,
                          sld: formatTh(sa),
                        },
                      });
                    }

                    t_deb += deb;
                    t_kre += kre;
                  }
                }
              }
            }
          });

          trn.push({
            type: "footer",
            value: {
              trx_code: "Total",
              trx_date: "",
              trx_type: "",
              lok: "",
              trx_debit: formatTh(t_deb),
              trx_kredit: formatTh(t_kre),
              sld: "",
            },
          });

          data.push({
            header: [
              {
                prod:
                  prd === null
                    ? "-"
                    : `${prd?.prod_id?.code} (${prd?.prod_id?.name})`,
                prod_id: prd?.prod_id?.id,
                nom: prd === null ? "-" : st,
                sld: prd === null ? "-" : formatTh(qty_awal),
                akhir: prd === null ? "-" : formatTh(sa),
                // sld: selectedProduct === null ? "-" : `${t_deb - t_kre}`,
              },
            ],

            trn: trn,
          });
        });
      });
    } else if (selectedGrup?.length && selectedLoc?.length) {
      selectedGrup?.forEach((grp) => {
        selectedLoc?.forEach((loc) => {
          let grouped_product = stCard?.filter(
            (el, i) =>
              i ===
              stCard?.findIndex(
                (ek) =>
                  el?.prod_id?.id === ek?.prod_id?.id &&
                  grp?.groupPro?.id === ek?.prod_id?.group &&
                  loc?.loc_id.id === ek?.loc_id.id
              )
          );

          grouped_product?.forEach((v) => {
            let saldo = 0;
            let qty_awal = 0;

            invDdb?.forEach((elem) => {
              if (
                v.prod_id?.id === elem?.inv_code?.id &&
                grp.groupPro?.id === elem.inv_code?.group &&
                loc.loc_id.id === elem.loc_code?.id
              ) {
                if (
                  elem?.sa &&
                  elem?.from_closing
                  // elem.inv_month <= filtDate?.getMonth() + 1 &&
                  // (elem.inv_year == filtDate?.getFullYear() ||
                  //   elem.inv_year <= filtDate?.getFullYear())
                ) {
                  qty_awal += elem.qty_awal;
                  // amnt_akhir += el.inv_akhir;
                }
              }
            });

            let trn = [
              {
                type: "header",
                value: {
                  trx_code: tr[localStorage.getItem("language")].kd_tran,
                  trx_date: tr[localStorage.getItem("language")].tgl,
                  trx_type: tr[localStorage.getItem("language")].jns_tran,
                  lok: tr[localStorage.getItem("language")].lokasi,
                  trx_debit: tr[localStorage.getItem("language")].mutasi_deb,
                  trx_kredit: tr[localStorage.getItem("language")].mutasi_kred,
                  sld: "Saldo",
                },
              },
            ];

            stCard?.forEach((stc) => {
              if (v?.prod_id?.id === stc?.prod_id?.id) {
                if (loc?.loc_id?.id === stc?.loc_id?.id) {
                  let dt = new Date(`${stc?.trx_date}Z`);
                  if (dt.getFullYear() === filtDate?.getFullYear()) {
                    if (dt.getMonth() <= filtDate?.getMonth()) {
                      if (stc.trx_dbcr === "d") {
                        saldo += stc.trx_qty;
                      } else {
                        saldo -= stc.trx_qty;
                      }
                    }
                  }
                }
              }
            });

            let deb = 0;
            let kre = 0;
            let t_deb = 0;
            let t_kre = 0;
            let sa = qty_awal;
            let st = 0;

            stCard?.forEach((el) => {
              if (v?.prod_id?.id === el.prod_id?.id) {
                if (grp?.groupPro?.id === el?.prod_id?.group) {
                  if (loc?.loc_id?.id === el?.loc_id?.id) {
                    let dt = new Date(`${el?.trx_date}Z`);
                    if (dt.getFullYear() === filtDate?.getFullYear()) {
                      if (dt.getMonth() <= filtDate?.getMonth()) {
                        deb = el.trx_dbcr === "d" ? el.trx_qty : 0;
                        kre = el.trx_dbcr === "k" ? el.trx_qty : 0;

                        // if (el.trx_dbcr === "d") {
                        sa += deb - kre;
                        // } else {
                        //   sa += t_kre - t_deb;
                        // }
                        st += el.trx_hpok ?? 0;

                        if (deb === 0 && kre === 0) {
                          trn.push({});
                        } else {
                          trn.push({
                            type: "item",
                            value: {
                              trx_code: el.trx_code,
                              trx_date: formatDate(el.trx_date),
                              trx_type:
                                el.trx_type === "BL"
                                  ? "Pembelian"
                                  : el.trx_type === "JL"
                                  ? "Penjualan"
                                  : el.trx_type === "MK"
                                  ? "Mutasi Kredit"
                                  : el.trx_type === "MD"
                                  ? "Mutasi Debet"
                                  : el.trx_type === "SA"
                                  ? "Saldo Awal"
                                  : el.trx_type === "HRV"
                                  ? "Panen"
                                  : el.trx_type,
                              lok: `${el.loc_id?.name}`,
                              trx_debit: formatTh(deb),
                              // el.trx_dbcr === "d" ? formatTh(el.trx_qty) : 0,
                              trx_kredit: formatTh(kre),
                              // el.trx_dbcr === "k" ? formatTh(el.trx_qty) : 0,
                              sld: formatTh(sa),
                            },
                          });
                        }

                        t_deb += deb;
                        t_kre += kre;
                      }
                    }
                  }
                }
              }
            });

            trn.push({
              type: "footer",
              value: {
                trx_code: "Total",
                trx_date: "",
                trx_type: "",
                lok: "",
                trx_debit: formatTh(t_deb),
                trx_kredit: formatTh(t_kre),
                sld: formatTh(sa),
              },
            });

            data.push({
              header: [
                {
                  prod:
                    v === null
                      ? "-"
                      : `${v?.prod_id?.code} (${v?.prod_id?.name})`,
                  prod_id: v?.prod_id?.id,
                  nom: v === null ? "-" : st,
                  sld: v === null ? "-" : formatTh(qty_awal),
                  akhir: v === null ? "-" : formatTh(sa),
                  // sld: selectedProduct === null ? "-" : `${t_deb - t_kre}`,
                },
              ],

              trn: trn,
            });
          });
        });
      });
    }
    // else{
    //   selectedProduct?.forEach((prd) => {
    //     let saldo = 0;

    //     let trn = [
    //       {
    //         type: "header",
    //         value: {
    //           trx_code: tr[localStorage.getItem("language")].kd_tran,
    //           trx_date: tr[localStorage.getItem("language")].tgl,
    //           trx_type: tr[localStorage.getItem("language")].jns_tran,
    //           lok: tr[localStorage.getItem("language")].lokasi,
    //           trx_debit: tr[localStorage.getItem("language")].mutasi_deb,
    //           trx_kredit: tr[localStorage.getItem("language")].mutasi_kred,
    //           sld: "Saldo",
    //         },
    //       },
    //     ];

    //     let t_deb = 0;
    //     let t_kre = 0;
    //     let sa = 0;
    //     let st = 0;
    //     stCard?.forEach((el) => {
    //       if (prd?.prod_id?.id === el?.prod_id?.id) {
    //         // if (selectedLoc?.loc_id?.id === el?.loc_id?.id) {
    //         let dt = new Date(`${el?.trx_date}Z`);
    //         if (dt.getFullYear() === filtDate?.getFullYear()) {
    //           if (dt.getMonth() <= filtDate?.getMonth()) {
    //             if (el.trx_dbcr === "d") {
    //               saldo += el.trx_qty;
    //             } else {
    //               saldo -= el.trx_qty;
    //             }
    //             trn.push({
    //               type: "item",
    //               value: {
    //                 trx_code: el.trx_code,
    //                 trx_date: formatDate(el.trx_date),
    //                 trx_type:
    //                   el.trx_type === "BL"
    //                     ? "Pembelian"
    //                     : el.trx_type === "JL"
    //                     ? "Penjualan"
    //                     : el.trx_type === "MK"
    //                     ? "Mutasi Kredit"
    //                     : el.trx_type === "MD"
    //                     ? "Mutasi Debet"
    //                     : el.trx_type === "SA"
    //                     ?  tr[localStorage.getItem("language")].due
    //                     : el.trx_type === "HRV"
    //                     ? "Panen"
    //                     : el.trx_type,
    //                 lok: `${el.loc_id?.name}`,
    //                 trx_debit: el.trx_dbcr === "d" ? formatTh(el.trx_qty) : 0,
    //                 trx_kredit: el.trx_dbcr === "k" ? formatTh(el.trx_qty) : 0,
    //                 sld: formatTh(saldo),
    //               },
    //             });

    //             t_deb += el.trx_dbcr === "d" ? el.trx_qty : 0;
    //             t_kre += el.trx_dbcr === "k" ? el.trx_qty : 0;
    //             sa = t_deb ?? "-";
    //             st += 0;
    //           }

    //           // }
    //         }
    //       }
    //     });

    //     trn.push({
    //       type: "footer",
    //       value: {
    //         trx_code: "Total",
    //         trx_date: "",
    //         trx_type: "",
    //         lok: "",
    //         trx_debit: formatTh(t_deb),
    //         trx_kredit: formatTh(t_kre),
    //         sld: "",
    //       },
    //     });

    //     data.push({
    //       header: [
    //         {
    //           prod:
    //             prd === null
    //               ? "-"
    //               : `${prd?.prod_id?.code} (${prd?.prod_id?.name})`,
    //           prod_id: prd?.prod_id?.id,
    //           nom: prd === null ? "-" : st,
    //           sld: prd === null ? "-" : formatTh(sa),
    //           // sld: selectedProduct === null ? "-" : `${t_deb - t_kre}`,
    //         },
    //       ],

    //       trn: trn,
    //     });
    //   });
    // }

    // data?.forEach((element) => {
    //   element?.trn.forEach((el) => {
    //   });
    //     console.log("length");
    //     console.log(element);
    // });

    let item = [];

    let final = [
      {
        columns: [
          {
            title: "Stock Card Report",
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
            title: `Per ${formatMonth(filtDate)}`,
            width: { wch: 30 },
            style: {
              font: { sz: "14", bold: false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
        ],
        data: [[]],
      },
    ];

    data?.forEach((element) => {
      item.push([
        {
          value: "",
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
      ]);

      item.push([
        {
          value: tr[localStorage.getItem("language")].prod,
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          value: "",
          width: { wch: 15 },
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          value: "",
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          value: "",
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          value: "",
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          value: tr[localStorage.getItem("language")].sldo_awal,
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "right", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          value: tr[localStorage.getItem("language")].sldo_ahir,
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "right", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
      ]);

      element?.header?.forEach((el) => {
        item.push([
          {
            value: el.prod,
            style: {
              font: {
                sz: "14",
                bold: false,
              },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: "",
            style: {
              font: {
                sz: "14",
                bold: false,
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: "",
            style: {
              font: {
                sz: "14",
                bold: false,
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: "",
            style: {
              font: {
                sz: "14",
                bold: false,
              },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: "",
            style: {
              font: {
                sz: "14",
                bold: false,
              },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: el?.sld,
            style: {
              font: {
                sz: "14",
                bold: false,
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: el.akhir,
            style: {
              font: {
                sz: "14",
                bold: false,
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
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
      ]);

      item.push([
        {
          value: tr[localStorage.getItem("language")].det_tran,
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          value: "",
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          value: "",
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          value: "",
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          value: "",
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          value: "",
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          value: "",
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
      ]);

      element?.trn?.forEach((ek) => {
        item.push([
          {
            value: ek?.value?.trx_code,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },

              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: ek?.value?.trx_date,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "center", vertical: "center" },
            },
          },
          {
            value: ek?.value?.trx_type,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: ek?.value?.lok,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: ek?.value?.trx_debit,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: ek?.value?.trx_kredit,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: ek?.value?.sld,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
        ]);
      });
    });

    final.push({
      columns: [],
      data: item,
    });

    if (excel) {
      return final;
    } else {
      let page = [];
      let page2 = [];
      data?.forEach((el) => {
        el?.header.forEach((elem) => {
          // page.push(elem);
          el?.trn.forEach((element) => {
            page2.push({ ...element, head: elem });
          });
        });
      });
      console.log("page", page2);
      return page2;
    }
  };

  const prodTemp = (option) => {
    return (
      <div>
        {option !== null
          ? `${option?.prod_id.name} (${option?.prod_id.code})`
          : ""}
      </div>
    );
  };

  const valProd = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option?.prod_id.name} (${option?.prod_id.code})`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const locTemp = (option) => {
    return (
      <div>
        {option !== null
          ? `${option?.loc_id.name} (${option?.loc_id.code})`
          : ""}
      </div>
    );
  };

  const valLoc = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option?.loc_id.name} (${option?.loc_id.code})`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-10 ml-0 mr-0 pl-0">
          <Row className="m-0">
            <div className="col-3 mr-0 mt-2 p-0">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-calendar" />
                </span>
                <Calendar
                  value={filtDate}
                  onChange={(e) => {
                    setFiltDate(e.value);
                  }}
                  view="month"
                  placeholder={tr[localStorage.getItem("language")].pilih_tgl}
                  readOnlyInput
                  dateFormat="MM yy"
                />
              </div>
            </div>
            {/* <div className={loading ? "col-2" : "col-0"}></div> */}
            <div className="p-inputgroup col-3">
              <MultiSelect
                value={selectedLoc ?? null}
                options={location}
                onChange={(e) => {
                  setSelectedLoc(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_lokasi}
                optionLabel="loc_id.name"
                itemTemplate={locTemp}
                valueTemplate={valLoc}
                showClear
                filterBy="loc_id.name"
                filter
                display="chip"
                // className="w-full md:w-17rem"
                maxSelectedLabels={3}
              />
            </div>
            <div className="p-inputgroup col-2">
              <MultiSelect
                value={selectedGrup ?? null}
                options={grupProd}
                onChange={(e) => {
                  setSelectedGrup(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_gprod}
                optionLabel="groupPro.name"
                showClear
                filterBy="groupPro.name"
                filter
                display="chip"
                // className="w-full md:w-16rem"
                maxSelectedLabels={3}
              />
            </div>
            <div className="p-inputgroup col-3">
              <MultiSelect
                value={selectedProduct ?? null}
                options={product}
                onChange={(e) => {
                  console.log("====");
                  console.log(e.value);
                  setSelected(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_prod}
                optionLabel="prod_id.name"
                itemTemplate={prodTemp}
                valueTemplate={valProd}
                showClear
                filterBy="prod_id.name"
                filter
                display="chip"
                // className="w-full md:w-20rem"
                maxSelectedLabels={3}
              />
            </div>
            {loading && (
              <div className="mt-4">
                <ProgressSpinner
                  style={{ width: "20px", height: "20px" }}
                  strokeWidth="8"
                  fill="transparent"
                  animationDuration=".5s"
                />
              </div>
            )}
          </Row>
        </div>
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            {/* <ExcelExportHelper
              json={stCard ? jsonForExcel(stCard, true) : null}
              filename={`stock_card_detail_report_export_${new Date().getTime()}`}
              sheetname="report"
            /> */}
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

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const formatMonth = (date) => {
    const m = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    if (typeof date === "string") {
      var d = new Date(`${date}Z`),
        month = d.getMonth(),
        year = d.getFullYear();
    } else {
      var d = new Date(date),
        month = d.getMonth(),
        year = d.getFullYear();
    }

    return [m[month], year].join(" ");
  };

  const formatTh = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const chunk = (arr, size) =>
    arr?.reduce(
      (acc, e, i) => (
        i % size ? acc[acc?.length - 1].push(e) : acc.push([e]), acc
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
        {chunk(jsonForExcel(stCard) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0">
                <CustomeWrapper
                  viewOnly
                  horizontal
                  tittle={"Stock Card Details Report"}
                  subTittle={`Stock Card Details Report Per ${formatMonth(
                    filtDate
                  )}`}
                  onComplete={(cp) => setCp(cp)}
                  page={idx + 1}
                  body={
                    <>
                      {val?.map((v) => {
                        if (v?.type == "header") {
                          return (
                            <>
                              <div className="header-report single row m-0 mt-5">
                                <div className="col-3">{"Product"}</div>
                                <div className="col-2">{""}</div>
                                <div className="col-2">{""}</div>
                                <div className="col-1">{""}</div>
                                <div className="col-1">{""}</div>
                                <div className="col-3 text-right">
                                  {"Beginning Balance"}
                                </div>
                                {/* <div className="col-2 text-right">
                                  {"Saldo Akhir"}
                                </div> */}
                              </div>

                              <div className="item-report row m-0">
                                <div className="col-3">{v?.head.prod}</div>
                                <div className="col-2">{""}</div>
                                <div className="col-2">{""}</div>
                                <div className="col-1">{""}</div>
                                <div className="col-1">{""}</div>
                                <div className="col-3 text-right">
                                  {v?.head.sld}
                                </div>
                                {/* <div className="col-2 text-right">
                                  {v?.head?.akhir}
                                </div> */}
                              </div>

                              <div className="header-report single row m-0">
                                <div className="col-2">{v.value.trx_code}</div>
                                <div className="col-2">{v.value.trx_date}</div>
                                <div className="col-1">{v.value.trx_type}</div>
                                <div className="col-2">{v.value.lok}</div>
                                <div className="col-2 text-right">
                                  {v.value.trx_debit}
                                </div>
                                <div className="col-2 text-right">
                                  {v.value.trx_kredit}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.sld}
                                </div>
                              </div>
                            </>
                          );
                        } else if (v.type === "item") {
                          return (
                            <>
                              <div className="item-report row m-0">
                                <div className="col-2">{v.value.trx_code}</div>
                                <div className="col-2">{v.value.trx_date}</div>
                                <div className="col-1">{v.value.trx_type}</div>
                                <div className="col-2">{v.value.lok}</div>
                                <div className="col-2 text-right">
                                  {v.value.trx_debit}
                                </div>
                                <div className="col-2 text-right">
                                  {v.value.trx_kredit}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.sld}
                                </div>
                              </div>
                            </>
                          );
                        } else if (v?.type === "footer") {
                          return (
                            <>
                              <div className="footer-report row m-0">
                                <div className="col-2">{v.value.trx_code}</div>
                                <div className="col-2">{v.value.trx_date}</div>
                                <div className="col-1">{v.value.trx_type}</div>
                                <div className="col-2">{v.value.lok}</div>
                                <div className="col-2 text-right">
                                  {v.value.trx_debit}
                                </div>
                                <div className="col-2 text-right">
                                  {v.value.trx_kredit}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.sld}
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
    </>
  );
};

export default KartuStock;
