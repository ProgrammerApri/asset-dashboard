import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button, Card, Col, Row } from "react-bootstrap";
import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import endpoints from "../../../../utils/endpoints";
import { MultiSelect } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";
// import ExcelExportHelper from "src/jsx/components/ExportExcel/ExcelExportHelper";

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const KartuStockRingkasan = ({ month, year, kategory }) => {
  const [location, setLoc] = useState(null);
  const [prod, setProd] = useState(null);
  const [selectedLoc, setSelectedLoc] = useState([]);
  const [selectedPrd, setSelectedPrd] = useState([]);
  const [selectedGrup, setSelectedGrup] = useState([]);
  const [checkValue, setCheckVal] = useState(false);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState(null);
  const [saldo_awal, setSaldoA] = useState(null);
  const [selectCus, setSelectCus] = useState(null);
  const [posting, setPosting] = useState(null);
  const [stcard, setStcard] = useState(null);
  const [invDdb, setInvDdb] = useState(null);
  const [grupProd, setGrupP] = useState(null);
  const [cp, setCp] = useState("");
  const [monthPost, setMonthPost] = useState(null);
  const [maxDate, setMaxDate] = useState(new Date().getMonth() + 1);
  const [maxYear, setMaxYear] = useState(new Date().getFullYear() + 1);
  const chunkSize = 15;

  useEffect(() => {
    // getSaldoA();
    getStcard();
    // getInvDdb();
  }, []);

  const getStcard = async () => {
    const config = {
      ...endpoints.st_card,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        let grouploc = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.loc_id?.id === ek?.loc_id?.id)
        );

        let groupprd = data?.filter(
          (el, i) =>
            i === data?.findIndex((ek) => el?.prod_id?.id === ek?.prod_id?.id)
        );

        setLoc(grouploc);
        setProd(groupprd);

        setStcard(data);
        getGrupProd(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSaldoA = async () => {
    const config = {
      ...endpoints.saldo_awal,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        setSaldoA(data);
      }
    } catch (error) {
      console.log(error);
    }
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
        setInvDdb(data);
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

        if (date.length) {
          // setMaxDate(Math.max(...month));
          setMaxDate(new Date(Math.max(...date)).getMonth() + 1);
          if (!filtDate) {
            setFiltDate(new Date());
            setMonthPost(date);
          }
        }
      }
    } catch (error) {}
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
        // console.log("========");
        // console.log(filt);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) => {
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

  const checkGrup = (value) => {
    let selected = {};
    grupProd?.forEach((element) => {
      if (value === element?.groupPro.id) {
        selected = element;
      }
    });

    return selected;
  };

  const jsonForExcel = (krtst, excel = false) => {
    let data = [];

    let groupedProd = krtst?.filter(
      (el, i) =>
        i ===
        krtst.findIndex(
          (ek) =>
            el?.prod_id?.id === ek?.prod_id?.id &&
            el?.loc_id?.id === ek?.loc_id?.id
        )
    );

    if (selectedLoc?.length && selectedPrd?.length) {
      let total_qty_awal = 0;
      let total_qty_md = 0;
      let total_qty_mk = 0;
      let total_amnt = 0;

      selectedLoc?.forEach((loc) => {
        selectedPrd.forEach((prd) => {
          groupedProd?.forEach((e) => {
            if (
              loc?.loc_id?.id === e?.loc_id?.id &&
              prd?.prod_id?.id === e?.prod_id?.id
            ) {
              let qty_awal = 0;
              let qty_debit = 0;
              let qty_kredit = 0;
              let amnt_akhir = 0;

              invDdb?.forEach((el) => {
                if (
                  e.prod_id.id === el.inv_code.id &&
                  e.loc_id.id === el.loc_code.id
                ) {
                  if (
                    (el.inv_month <= filtDate.getMonth() + 1 &&
                      el.inv_year == filtDate.getFullYear()) ||
                    el.inv_year <= filtDate.getFullYear()
                  ) {
                    qty_awal += el.qty_awal;
                    amnt_akhir += el.inv_akhir;
                  }
                }
              });
              krtst?.forEach((el) => {
                let date = new Date(`${el.trx_date}Z`);
                if (
                  el.prod_id.id === e.prod_id.id &&
                  el?.loc_id?.id === e?.loc_id?.id &&
                  filtDate.getFullYear() === date.getFullYear() &&
                  // date.getMonth() >= maxDate &&
                  date.getMonth() <= filtDate.getMonth()
                ) {
                  qty_debit += el.trx_dbcr === "d" ? el.trx_qty : 0;
                  qty_kredit += el.trx_dbcr === "k" ? el.trx_qty : 0;
                }
              });
              data.push({
                acco: `${e.prod_id.code} (${e.prod_id.name})`,
                grupP: `${checkGrup(e.prod_id.group)?.groupPro?.name}`,
                prod_id: e.prod_id.id,
                loc_id: e.loc_id.id,
                loc: `${e.loc_id.name} (${e.loc_id.code})`,
                awal: qty_awal,
                debe: qty_debit,
                kred: qty_kredit,
                blce: qty_awal + qty_debit - qty_kredit,
                amnt: amnt_akhir,
              });

              total_qty_awal += qty_awal;
              total_qty_md += qty_debit;
              total_qty_mk += qty_kredit;
              total_amnt += amnt_akhir;
            }
          });
        });
      });

      data.push({
        type: "footer",
        acco: "Total Persediaan",
        prod_id: "",
        loc_id: "",
        loc: "",
        awal: total_qty_awal,
        debe: total_qty_md,
        kred: total_qty_mk,
        blce: total_qty_awal + total_qty_md - total_qty_mk,
        amnt: total_amnt,
      });
    } else if (selectedLoc?.length) {
      let total_qty_awal = 0;
      let total_qty_md = 0;
      let total_qty_mk = 0;
      let total_amnt = 0;

      selectedLoc?.forEach((loc) => {
        groupedProd?.forEach((e) => {
          if (loc?.loc_id?.id === e?.loc_id?.id) {
            let qty_awal = 0;
            let qty_debit = 0;
            let qty_kredit = 0;
            let amnt_akhir = 0;

            invDdb?.forEach((el) => {
              if (
                e.prod_id.id === el.inv_code.id &&
                e.loc_id.id === el.loc_code.id
              ) {
                if (
                  (el.inv_month <= filtDate.getMonth() + 1 &&
                    el.inv_year === filtDate.getFullYear()) ||
                  el.inv_year <= filtDate.getFullYear()
                ) {
                  qty_awal += el.qty_awal;
                  amnt_akhir += el.inv_akhir;
                }
              }
            });
            krtst?.forEach((el) => {
              let date = new Date(`${el.trx_date}Z`);
              if (
                el.prod_id.id === e.prod_id.id &&
                el?.loc_id?.id === e?.loc_id?.id &&
                filtDate.getFullYear() === date.getFullYear() &&
                // date.getMonth() >= maxDate - 1 &&
                date.getMonth() <= filtDate.getMonth()
              ) {
                qty_debit += el.trx_dbcr === "d" ? el.trx_qty : 0;
                qty_kredit += el.trx_dbcr === "k" ? el.trx_qty : 0;
              }
            });
            data.push({
              acco: `${e.prod_id.code} (${e.prod_id.name})`,
              grupP: `${checkGrup(e.prod_id.group)?.groupPro?.name}`,
              prod_id: e.prod_id.id,
              loc_id: e.loc_id.id,
              loc: `${e.loc_id.name} (${e.loc_id.code})`,
              awal: qty_awal,
              debe: qty_debit,
              kred: qty_kredit,
              blce: qty_awal + qty_debit - qty_kredit,
              amnt: amnt_akhir,
            });

            total_qty_awal += qty_awal;
            total_qty_md += qty_debit;
            total_qty_mk += qty_kredit;
            total_amnt += amnt_akhir;
          }
        });
      });

      data.push({
        type: "footer",
        acco: "Total Persediaan",
        prod_id: "",
        loc_id: "",
        loc: "",
        awal: total_qty_awal,
        debe: total_qty_md,
        kred: total_qty_mk,
        blce: total_qty_awal + total_qty_md - total_qty_mk,
        amnt: total_amnt,
      });
    } else if (selectedPrd?.length) {
      let total_qty_awal = 0;
      let total_qty_md = 0;
      let total_qty_mk = 0;
      let total_amnt = 0;

      selectedPrd?.forEach((prd) => {
        groupedProd?.forEach((e) => {
          if (prd?.prod_id?.id === e?.prod_id?.id) {
            let qty_awal = 0;
            let qty_debit = 0;
            let qty_kredit = 0;
            let amnt_akhir = 0;

            invDdb?.forEach((el) => {
              if (
                e.prod_id.id === el.inv_code.id &&
                e.loc_id.id === el.loc_code.id
              ) {
                if (
                  el.inv_month <= filtDate.getMonth() + 1 &&
                  el.inv_year <= filtDate.getFullYear()
                ) {
                  qty_awal += el.qty_awal;
                  amnt_akhir += el.inv_akhir;
                }
              }
            });
            krtst?.forEach((el) => {
              let date = new Date(`${el.trx_date}Z`);
              if (
                el.prod_id.id === e.prod_id.id &&
                el?.loc_id?.id === e?.loc_id?.id &&
                filtDate.getFullYear() === date.getFullYear() &&
                // date.getMonth() >= maxDate - 1 &&
                date.getMonth() <= filtDate.getMonth()
              ) {
                qty_debit += el.trx_dbcr === "d" ? el.trx_qty : 0;
                qty_kredit += el.trx_dbcr === "k" ? el.trx_qty : 0;
              }
            });
            data.push({
              acco: `${e.prod_id.code} (${e.prod_id.name})`,
              grupP: `${checkGrup(e.prod_id.group)?.groupPro?.name}`,
              prod_id: e.prod_id.id,
              loc_id: e.loc_id.id,
              loc: `${e.loc_id.name} (${e.loc_id.code})`,
              awal: qty_awal,
              debe: qty_debit,
              kred: qty_kredit,
              blce: qty_awal + qty_debit - qty_kredit,
              amnt: amnt_akhir,
            });

            total_qty_awal += qty_awal;
            total_qty_md += qty_debit;
            total_qty_mk += qty_kredit;
            total_amnt += amnt_akhir;
          }
        });
      });

      data.push({
        type: "footer",
        acco: "Total Persediaan",
        prod_id: "",
        loc_id: "",
        loc: "",
        awal: total_qty_awal,
        debe: total_qty_md,
        kred: total_qty_mk,
        blce: total_qty_awal + total_qty_md - total_qty_mk,
        amnt: total_amnt,
      });
    } else if (selectedGrup?.length) {
      let total_qty_awal = 0;
      let total_qty_md = 0;
      let total_qty_mk = 0;
      let total_amnt = 0;

      selectedGrup?.forEach((grp) => {
        groupedProd?.forEach((e) => {
          if (grp?.groupPro?.id === e?.prod_id?.group) {
            let qty_awal = 0;
            let qty_debit = 0;
            let qty_kredit = 0;
            let amnt_akhir = 0;

            invDdb?.forEach((el) => {
              if (
                e.prod_id.id === el.inv_code.id &&
                e.loc_id.id === el.loc_code.id
              ) {
                if (
                  el.inv_month <= filtDate.getMonth() + 1 &&
                  el.inv_year <= filtDate.getFullYear()
                ) {
                  qty_awal += el.qty_awal;
                  amnt_akhir += el.inv_akhir;
                }
              }
            });
            krtst?.forEach((el) => {
              let date = new Date(`${el.trx_date}Z`);
              if (
                el.prod_id.id === e.prod_id.id &&
                el?.loc_id?.id === e?.loc_id?.id &&
                filtDate.getFullYear() === date.getFullYear() &&
                // date.getMonth() >= maxDate - 1 &&
                date.getMonth() <= filtDate.getMonth()
              ) {
                qty_debit += el.trx_dbcr === "d" ? el.trx_qty : 0;
                qty_kredit += el.trx_dbcr === "k" ? el.trx_qty : 0;
              }
            });
            data.push({
              acco: `${e.prod_id.code} (${e.prod_id.name})`,
              grupP: `${checkGrup(e.prod_id.group)?.groupPro?.name}`,
              prod_id: e.prod_id.id,
              loc_id: e.loc_id.id,
              loc: `${e.loc_id.name} (${e.loc_id.code})`,
              awal: qty_awal,
              debe: qty_debit,
              kred: qty_kredit,
              blce: qty_awal + qty_debit - qty_kredit,
              amnt: amnt_akhir,
            });

            total_qty_awal += qty_awal;
            total_qty_md += qty_debit;
            total_qty_mk += qty_kredit;
            total_amnt += amnt_akhir;
          }
        });
      });

      data.push({
        type: "footer",
        acco: "Total Persediaan",
        prod_id: "",
        loc_id: "",
        loc: "",
        awal: total_qty_awal,
        debe: total_qty_md,
        kred: total_qty_mk,
        blce: total_qty_awal + total_qty_md - total_qty_mk,
        amnt: total_amnt,
      });
    } else {
      let total_qty_awal = 0;
      let total_qty_md = 0;
      let total_qty_mk = 0;
      let total_amnt = 0;

      groupedProd?.forEach((e) => {
        let qty_awal = 0;
        let qty_debit = 0;
        let qty_kredit = 0;
        let amnt_akhir = 0;

        invDdb?.forEach((el) => {
          if (
            e.prod_id.id === el.inv_code.id &&
            e.loc_id.id === el.loc_code.id
          ) {
            if (
              (el.inv_month <= filtDate?.getMonth() + 1 &&
                el.inv_year === filtDate?.getFullYear()) ||
              el.inv_year <= filtDate?.getFullYear()
            ) {
              qty_awal += el.qty_awal;
              amnt_akhir += el.inv_akhir;
            }
          }
        });
        krtst?.forEach((el) => {
          let date = new Date(`${el.trx_date}Z`);
          if (
            el?.prod_id?.id === e?.prod_id?.id &&
            el?.loc_id?.id === e?.loc_id?.id &&
            filtDate?.getFullYear() === date.getFullYear() &&
            // date.getMonth() >= maxDate - 1 &&
            date.getMonth() <= filtDate.getMonth()
          ) {
            qty_debit += el.trx_dbcr === "d" ? el.trx_qty : 0;
            qty_kredit += el.trx_dbcr === "k" ? el.trx_qty : 0;
          }
        });
        data.push({
          type: "item",
          acco: `${e?.prod_id?.code} (${e?.prod_id?.name})`,
          grupP: `${checkGrup(e?.prod_id?.group)?.groupPro?.name}`,
          prod_id: e?.prod_id?.id,
          loc_id: e?.loc_id?.id,
          loc: `${e?.loc_id?.name} (${e?.loc_id?.code})`,
          awal: qty_awal,
          debe: qty_debit,
          kred: qty_kredit,
          blce: qty_awal + qty_debit - qty_kredit,
          amnt: amnt_akhir,
        });

        total_qty_awal += qty_awal;
        total_qty_md += qty_debit;
        total_qty_mk += qty_kredit;
        total_amnt += amnt_akhir;
      });

      data.push({
        type: "footer",
        acco: "Total Persediaan",
        prod_id: "",
        loc_id: "",
        loc: "",
        awal: total_qty_awal,
        debe: total_qty_md,
        kred: total_qty_mk,
        blce: total_qty_awal + total_qty_md - total_qty_mk,
        amnt: total_amnt,
      });
    }

    let final = [
      {
        columns: [
          {
            title: "Stock Card Summary Report",
            width: { wch: 40 },
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
            title: `Period ${formatDate(filtDate)}`,
            width: { wch: 40 },
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
    data.forEach((el) => {
      item.push([
        {
          value: el.acco,
          style: {
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: el.grupP,
          style: {
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: el.loc,
          style: {
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: el.awal,
          style: {
            font: {
              sz: "14",
              bold: el.type === "header" || el.type === "footer" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: el.debe,
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: el.kred,
          style: {
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: el.blce,
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

    final.push({
      columns: [
        {
          title: "Kode Produk",
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
          title: "Grup Produk",
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
          title: "Gudang Produk",
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
          title: "Saldo Awal",
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
          title: "Mutasi Debit",
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
          title: "Mutasi Kredit",
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
          title: "Saldo Akhir",
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

    if (excel) {
      return final;
    } else {
      return data;
    }
  };

  const formatIdr = (value) => {
    if (value < 0) {
      return `-Rp. ${`${value?.toFixed(2)}`
        .replace("-", "")
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
    }
    return `Rp. ${`${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  };

  const formatNumber = (value) => {
    if (value < 0) {
      return `-${`${value?.toFixed(2)}`
        .replace("-", "")
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
    }
    return `${`${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
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
                  setFiltDate(e.value);
                }}
                view="month"
                placeholder="Pilih Tanggal"
                // readOnlyInput
                dateFormat="MM yy"
                // maxDate={new Date(maxYear, maxDate - 1, 1)}
              />
            </div>
            <div className="p-inputgroup col-3">
              <MultiSelect
                value={selectedLoc ?? null}
                options={location}
                onChange={(e) => {
                  setSelectedLoc(e.value);
                }}
                placeholder="Pilih Lokasi"
                optionLabel="loc_id.name"
                showClear
                filterBy="loc_id.name"
                filter
                display="chip"
                // className="w-full md:w-15rem"
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
                placeholder="Pilih Group Product"
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
                value={selectedPrd ?? null}
                options={prod}
                onChange={(e) => {
                  setSelectedPrd(e.value);
                }}
                placeholder="Pilih Product"
                optionLabel="prod_id.name"
                showClear
                filterBy="prod_id.name"
                filter
                display="chip"
                // className="w-full md:w-20rem"
                maxSelectedLabels={3}
              />
            </div>
            <div className="col-2" hidden>
              <label className="text-label text-black mt-3 fs-13">
                Show Value
              </label>
              <Checkbox
                className="mb-1 ml-2"
                inputId="binary"
                checked={checkValue ?? false}
                onChange={(e) => {
                  setCheckVal(e.checked);
                }}
              />
            </div>
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            {/* <ExcelExportHelper
              json={posting ? jsonForExcel(posting, true) : null}
              filename={`stock_card_summary_report_export_${new Date().getTime()}`}
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

      {/* {filtDate ? ( */}
      <Row className="m-0 justify-content-center">
        {chunk(jsonForExcel(stcard) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0">
                <CustomeWrapper
                  horizontal
                  tittle={"Stock Card Summary Report"}
                  subTittle={`Stock Card Summary Report per ${formatDate(
                    filtDate
                  )}`}
                  onComplete={(cp) => setCp(cp)}
                  page={idx + 1}
                  viewOnly
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
                          className="header-center"
                          header="Kode Produk"
                          style={{ minWidht: "20rem" }}
                          field={(e) => e?.acco}
                          body={(e) =>
                            e.type === "item" ? (
                              <Link
                                to={`/laporan/persediaan/kartu-stock-rincian/${btoa(
                                  `m'${filtDate?.getMonth() + 1}`
                                )}/${btoa(
                                  `y'${filtDate?.getFullYear()}`
                                )}/${btoa(
                                  btoa(
                                    JSON.stringify({
                                      prod_id: e.prod_id,
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
                                  {e.acco}
                                </div>
                              </Link>
                            ) : (
                              <div
                                className={
                                  e.type === "header"
                                    ? "font-weight-bold"
                                    : e.type === "footer"
                                    ? "font-weight-bold "
                                    : ""
                                }
                              >
                                {e.acco}
                              </div>
                            )
                          }
                        />
                        <Column
                          // className="header-right text-right"
                          // hidden={selectedGrup?.length === 0}
                          header="Grup Produk"
                          style={{ minWidht: "8rem" }}
                          field={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold"
                                  : e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e?.grupP}
                            </div>
                          )}
                        />
                        <Column
                          // className="header-right text-right"
                          // hidden={selectedGrup?.length === 0}
                          header="Gudang Produk"
                          style={{ minWidht: "8rem" }}
                          field={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold"
                                  : e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e?.loc}
                            </div>
                          )}
                        />
                        <Column
                          className="header-right"
                          header="Qty Awal"
                          style={{ minWidht: "8rem" }}
                          field={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {formatNumber(e?.awal)}
                            </div>
                          )}
                        />
                        <Column
                          className="header-right"
                          header="Mutasi Debit"
                          style={{ minWidht: "10rem" }}
                          field={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {formatNumber(e?.debe)}
                            </div>
                          )}
                        />
                        <Column
                          className="header-right text-right"
                          header="Mutasi Kredit"
                          style={{ minWidht: "10rem" }}
                          field={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {formatNumber(e?.kred)}
                            </div>
                          )}
                        />
                        <Column
                          className="header-right text-right"
                          header="Qty Akhir"
                          style={{ minWidht: "10rem" }}
                          field={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {formatNumber(e?.blce)}
                            </div>
                          )}
                        />
                        <Column
                          hidden={!checkValue}
                          className="header-right text-right"
                          header="Nilai"
                          style={{ minWidht: "10rem" }}
                          field={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {formatIdr(e?.amnt)}
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
        {chunk(jsonForExcel(stcard) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2" ref={printPage}>
              <Card.Body className="p-0">
                <CustomeWrapper
                  tittle={"Stock Card Summary Report"}
                  subTittle={`Stock Card Summary Report per ${formatDate(
                    filtDate
                  )}`}
                  onComplete={(cp) => setCp(cp)}
                  page={idx + 1}
                  horizontal
                  // viewOnly
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
                          className="header-center"
                          header="Kode Produk"
                          style={{ width: "25rem" }}
                          field={(e) => e?.acco}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold"
                                  : e.type === "footer"
                                  ? "font-weight-bold "
                                  : ""
                              }
                            >
                              {e.acco}
                            </div>
                          )}
                        />
                        <Column
                          className="header-right text-right"
                          header="Qty Awal"
                          style={{ minWidht: "8rem" }}
                          field={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {formatNumber(e?.awal)}
                            </div>
                          )}
                        />
                        <Column
                          className="header-right text-right"
                          header="Mutasi Debit"
                          style={{ minWidht: "10rem" }}
                          field={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {formatNumber(e?.debe)}
                            </div>
                          )}
                        />
                        <Column
                          className="header-right text-right"
                          header="Mutasi Kredit"
                          style={{ minWidht: "10rem" }}
                          field={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {formatNumber(e?.kred)}
                            </div>
                          )}
                        />
                        <Column
                          className="header-right text-right"
                          header="Qty Akhir"
                          style={{ minWidht: "10rem" }}
                          field={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {formatNumber(e?.blce)}
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
    </>
  );
};

export default KartuStockRingkasan;
