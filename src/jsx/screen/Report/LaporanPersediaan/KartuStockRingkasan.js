import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button, Card, Col, Row } from "react-bootstrap";

// import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
// import ExcelExportHelper from "../../../components/ExportExcel/ExcelExportHelper";
import { useDispatch, useSelector } from "react-redux";
import { SET_FILTDATE_KSRING } from "src/redux/actions";
import endpoints from "../../../../utils/endpoints";
import { MultiSelect } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";
import { ProgressSpinner } from "primereact/progressspinner";
import { Skeleton } from "primereact/skeleton";
import { ProgressBar } from "primereact/progressbar";
import { tr } from "../../../../data/tr";

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const KartuStockRingkasan = ({ month, year, kategory }) => {
  // const filtDate = useSelector((state) => state.filtDate.ksring);
  const dispatch = useDispatch();
  const [location, setLoc] = useState(null);
  const [prod, setProd] = useState(null);
  const [selectedLoc, setSelectedLoc] = useState([]);
  const [selectedPrd, setSelectedPrd] = useState([]);
  const [selectedGrup, setSelectedGrup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkValue, setCheckVal] = useState(false);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState(null);
  const [saldo_awal, setSaldoA] = useState(null);
  const [posting, setPosting] = useState(null);
  const [stcard, setStcard] = useState(null);
  const [invDdb, setInvDdb] = useState(null);
  const [grupProd, setGrupP] = useState(null);
  const [cp, setCp] = useState("");
  const [monthPost, setMonthPost] = useState(null);
  const [maxDate, setMaxDate] = useState(new Date().getMonth() + 1);
  const [maxYear, setMaxYear] = useState(new Date().getFullYear() + 1);
  const dummy = Array.from({ length: 10 });
  const chunkSize = checkValue ? 8 : 12;

  // const setFiltDate = (payload) => {
  //   dispatch({ type: SET_FILTDATE_KSRING, payload: payload });
  // };

  useEffect(() => {
    getSaldoA();
    getStcard();
    getInvDdb();
  }, []);

  const getStcard = async (isUpdate = false) => {
    setLoading(true);
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
    } catch (error) {}
    setLoading(false);
  };

  const getSaldoA = async () => {
    setLoading(true);
    const config = {
      ...endpoints.saldo_sa_inv,
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
    } catch (error) {}
    setLoading(false);
  };

  const getInvDdb = async (isUpdate = false) => {
    setLoading(true);
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
            setFiltDate(null);
            setMonthPost(date);
          }
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

    if (filtDate) {
      if (selectedLoc?.length && selectedGrup?.length && selectedPrd?.length) {
        let total_qty_awal = 0;
        let total_qty_md = 0;
        let total_qty_mk = 0;
        let total_amnt_aw = 0;
        let total_amnt_db = 0;
        let total_amnt_kr = 0;

        selectedLoc?.forEach((loc) => {
          selectedGrup?.forEach((grp) => {
            selectedPrd?.forEach((prd) => {
              groupedProd?.forEach((e) => {
                if (
                  loc?.loc_id?.id === e?.loc_id?.id &&
                  grp?.groupPro?.id === e?.prod_id?.group &&
                  prd?.prod_id?.id === e?.prod_id?.id
                ) {
                  let qty_awal = 0;
                  let qty_debit = 0;
                  let qty_kredit = 0;
                  let amnt_awal = 0;
                  let amnt_debit = 0;
                  let amnt_kredit = 0;

                  invDdb?.forEach((el) => {
                    if (
                      e?.prod_id?.id === el?.inv_code?.id &&
                      e?.loc_id?.id === el?.loc_code?.id &&
                      grp?.groupPro?.id === el?.inv_code?.group
                    ) {
                      if (
                        el?.sa &&
                        !el.from_closing
                        // el.inv_month <= filtDate.getMonth() + 1 &&
                        // el.inv_year === filtDate.getFullYear()
                      ) {
                        qty_awal += el.qty_awal;
                        amnt_awal += el.inv_awal;
                      }
                    }
                  });

                  krtst?.forEach((el) => {
                    let date = new Date(`${el.trx_date}Z`);
                    if (
                      prd?.prod_id?.id === el?.prod_id?.id &&
                      loc?.loc_id?.id === el?.loc_id?.id &&
                      filtDate.getFullYear() == date.getFullYear() &&
                      // date.getMonth() >= maxDate - 1 &&
                      date.getMonth() >= filtDate.getMonth()
                    ) {
                      qty_debit += el.trx_dbcr === "d" ? el.trx_qty : 0;
                      qty_kredit += el.trx_dbcr === "k" ? el.trx_qty : 0;
                      amnt_debit += el.trx_dbcr === "d" ? el.trx_hpok : 0;
                      amnt_kredit += el.trx_dbcr === "k" ? el.trx_hpok : 0;
                    }
                  });

                  data.push({
                    type: "item",
                    acco: `${e?.prod_id?.code}\n(${e?.prod_id?.name})`,
                    grupP: `${checkGrup(e?.prod_id?.group)?.groupPro?.name}`,
                    prod_id: e?.prod_id?.id,
                    loc_id: e?.loc_id?.id,
                    loc: `${e?.loc_id?.name}\n(${e?.loc_id?.code})`,
                    awal: qty_awal,
                    debe: qty_debit,
                    kred: qty_kredit,
                    blce: qty_awal + qty_debit - qty_kredit,
                    amnt_awal: amnt_awal,
                    amnt_deb: amnt_debit,
                    amnt_kredit: amnt_kredit,
                    amnt_akhir: amnt_awal + amnt_debit - amnt_kredit,
                  });

                  total_qty_awal += qty_awal;
                  total_qty_md += qty_debit;
                  total_qty_mk += qty_kredit;
                  total_amnt_aw += amnt_awal;
                  total_amnt_db += amnt_debit;
                  total_amnt_kr += amnt_kredit;
                }
              });
            });
          });
        });

        data.push({
          type: "footer",
          acco: tr[localStorage.getItem("language")].total_persediaan,
          prod_id: "",
          loc_id: "",
          loc: "",
          awal: total_qty_awal,
          debe: total_qty_md,
          kred: total_qty_mk,
          blce: total_qty_awal + total_qty_md - total_qty_mk,
          amnt_awal: total_amnt_aw,
          amnt_deb: total_amnt_db,
          amnt_kredit: total_amnt_kr,
          amnt_akhir: total_amnt_aw + total_amnt_db - total_amnt_kr,
        });
      } else if (selectedLoc?.length && selectedPrd?.length) {
        let total_qty_awal = 0;
        let total_qty_md = 0;
        let total_qty_mk = 0;
        let total_amnt_aw = 0;
        let total_amnt_db = 0;
        let total_amnt_kr = 0;

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
                let amnt_awal = 0;
                let amnt_debit = 0;
                let amnt_kredit = 0;

                invDdb?.forEach((el) => {
                  if (
                    prd?.prod_id?.id === el?.inv_code?.id &&
                    loc?.loc_id?.id === el?.loc_code?.id
                  ) {
                    if (
                      el?.sa &&
                      !el.from_closing
                      // el.inv_month <= filtDate.getMonth() + 1 &&
                      // (el.inv_year == filtDate.getFullYear() ||
                      //   el.inv_year <= filtDate.getFullYear())
                    ) {
                      qty_awal += el.qty_awal;
                      amnt_awal += el.inv_awal;
                    }
                  }
                });
                krtst?.forEach((el) => {
                  let date = new Date(`${el.trx_date}Z`);
                  if (
                    el?.prod_id?.id === prd?.prod_id?.id &&
                    el?.loc_id?.id === loc?.loc_id?.id &&
                    filtDate.getFullYear() === date.getFullYear() &&
                    // date.getMonth() >= maxDate &&
                    date.getMonth() >= filtDate.getMonth()
                  ) {
                    qty_debit += el.trx_dbcr === "d" ? el.trx_qty : 0;
                    qty_kredit += el.trx_dbcr === "k" ? el.trx_qty : 0;
                    amnt_debit += el.trx_dbcr === "d" ? el.trx_hpok : 0;
                    amnt_kredit += el.trx_dbcr === "k" ? el.trx_hpok : 0;
                  }
                });
                data.push({
                  type: "item",
                  acco: `${e?.prod_id?.code}\n(${e?.prod_id?.name})`,
                  grupP: `${checkGrup(e?.prod_id?.group)?.groupPro?.name}`,
                  prod_id: prd?.prod_id?.id,
                  loc_id: loc?.loc_id?.id,
                  loc: `${e?.loc_id?.name}\n(${e?.loc_id?.code})`,
                  awal: qty_awal,
                  debe: qty_debit,
                  kred: qty_kredit,
                  blce: qty_awal + qty_debit - qty_kredit,
                  amnt_awal: amnt_awal,
                  amnt_deb: amnt_debit,
                  amnt_kredit: amnt_kredit,
                  amnt_akhir: amnt_awal + amnt_debit - amnt_kredit,
                });

                total_qty_awal += qty_awal;
                total_qty_md += qty_debit;
                total_qty_mk += qty_kredit;
                total_amnt_aw += amnt_awal;
                total_amnt_db += amnt_debit;
                total_amnt_kr += amnt_kredit;
              }
            });
          });
        });

        data.push({
          type: "footer",
          acco: tr[localStorage.getItem("language")].total_persediaan,
          prod_id: "",
          loc_id: "",
          loc: "",
          awal: total_qty_awal,
          debe: total_qty_md,
          kred: total_qty_mk,
          blce: total_qty_awal + total_qty_md - total_qty_mk,
          amnt_awal: total_amnt_aw,
          amnt_deb: total_amnt_db,
          amnt_kredit: total_amnt_kr,
          amnt_akhir: total_amnt_aw + total_amnt_db - total_amnt_kr,
        });
      } else if (selectedLoc?.length && selectedGrup?.length) {
        let total_qty_awal = 0;
        let total_qty_md = 0;
        let total_qty_mk = 0;
        let total_amnt_aw = 0;
        let total_amnt_db = 0;
        let total_amnt_kr = 0;

        selectedLoc?.forEach((loc) => {
          selectedGrup?.forEach((grp) => {
            groupedProd?.forEach((e) => {
              if (
                loc?.loc_id?.id === e?.loc_id?.id &&
                grp?.groupPro?.id === e?.prod_id?.group
              ) {
                let qty_awal = 0;
                let qty_debit = 0;
                let qty_kredit = 0;
                let amnt_awal = 0;
                let amnt_debit = 0;
                let amnt_kredit = 0;

                invDdb?.forEach((el) => {
                  if (
                    e?.prod_id?.id === el?.inv_code?.id &&
                    e?.loc_id?.id === el?.loc_code?.id &&
                    grp.groupPro.id === el.inv_code?.group
                  ) {
                    if (
                      el?.sa &&
                      !el.from_closing
                      // el.inv_month <= filtDate.getMonth() + 1 &&
                      // (el.inv_year === filtDate.getFullYear() ||
                      //   el.inv_year <= filtDate.getFullYear())
                    ) {
                      qty_awal += el.qty_awal;
                      amnt_awal += el.inv_awal;
                    }
                  }
                });

                krtst?.forEach((el) => {
                  let date = new Date(`${el.trx_date}Z`);
                  if (
                    el?.prod_id?.id === e?.prod_id?.id &&
                    el?.loc_id?.id === loc?.loc_id?.id &&
                    el?.prod_id?.group === grp?.groupPro?.id &&
                    filtDate.getFullYear() === date.getFullYear() &&
                    // date.getMonth() >= maxDate - 1 &&
                    date.getMonth() >= filtDate.getMonth()
                  ) {
                    qty_debit += el.trx_dbcr === "d" ? el.trx_qty : 0;
                    qty_kredit += el.trx_dbcr === "k" ? el.trx_qty : 0;
                    amnt_debit += el.trx_dbcr === "d" ? el.trx_hpok : 0;
                    amnt_kredit += el.trx_dbcr === "k" ? el.trx_hpok : 0;
                  }
                });
                data.push({
                  type: "item",
                  acco: `${e?.prod_id?.code}\n(${e?.prod_id?.name})`,
                  grupP: `${checkGrup(e?.prod_id?.group)?.groupPro?.name}`,
                  prod_id: e?.prod_id?.id,
                  loc_id: e?.loc_id?.id,
                  loc: `${e?.loc_id?.name}\n(${e?.loc_id?.code})`,
                  awal: qty_awal,
                  debe: qty_debit,
                  kred: qty_kredit,
                  blce: qty_awal + qty_debit - qty_kredit,
                  amnt_awal: amnt_awal,
                  amnt_deb: amnt_debit,
                  amnt_kredit: amnt_kredit,
                  amnt_akhir: amnt_awal + amnt_debit - amnt_kredit,
                });

                total_qty_awal += qty_awal;
                total_qty_md += qty_debit;
                total_qty_mk += qty_kredit;
                total_amnt_aw += amnt_awal;
                total_amnt_db += amnt_debit;
                total_amnt_kr += amnt_kredit;
              }
            });
          });
        });

        data.push({
          type: "footer",
          acco: tr[localStorage.getItem("language")].total_persediaan,
          prod_id: "",
          loc_id: "",
          loc: "",
          awal: total_qty_awal,
          debe: total_qty_md,
          kred: total_qty_mk,
          blce: total_qty_awal + total_qty_md - total_qty_mk,
          amnt_awal: total_amnt_aw,
          amnt_deb: total_amnt_db,
          amnt_kredit: total_amnt_kr,
          amnt_akhir: total_amnt_aw + total_amnt_db - total_amnt_kr,
        });
      } else if (selectedPrd?.length && selectedGrup?.length) {
        let total_qty_awal = 0;
        let total_qty_md = 0;
        let total_qty_mk = 0;
        let total_amnt_aw = 0;
        let total_amnt_db = 0;
        let total_amnt_kr = 0;

        selectedPrd?.forEach((prd) => {
          selectedGrup?.forEach((grp) => {
            groupedProd?.forEach((e) => {
              if (
                prd?.prod_id?.id === e?.prod_id?.id &&
                grp?.groupPro?.id === e?.prod_id?.group
              ) {
                let qty_awal = 0;
                let qty_debit = 0;
                let qty_kredit = 0;
                let amnt_awal = 0;
                let amnt_debit = 0;
                let amnt_kredit = 0;

                invDdb?.forEach((el) => {
                  if (
                    e?.prod_id?.id === el?.inv_code?.id &&
                    e?.loc_id?.id === el?.loc_code?.id
                  ) {
                    if (
                      el?.sa &&
                      !el.from_closing
                      // (el.inv_month <= filtDate.getMonth() + 1 &&
                      //   el.inv_year === filtDate.getFullYear()) ||
                      // el.inv_year <= filtDate.getFullYear()
                    ) {
                      qty_awal += el.qty_awal;
                      amnt_awal += el.inv_awal;
                    }
                  }
                });
                krtst?.forEach((el) => {
                  let date = new Date(`${el.trx_date}Z`);
                  if (
                    el?.prod_id?.id === e?.prod_id?.id &&
                    el?.loc_id?.id === e?.loc_id?.id &&
                    filtDate.getFullYear() === date.getFullYear() &&
                    // date.getMonth() >= maxDate - 1 &&
                    date.getMonth() >= filtDate.getMonth()
                  ) {
                    qty_debit += el.trx_dbcr === "d" ? el.trx_qty : 0;
                    qty_kredit += el.trx_dbcr === "k" ? el.trx_qty : 0;
                    amnt_debit += el.trx_dbcr === "d" ? el.trx_hpok : 0;
                    amnt_kredit += el.trx_dbcr === "k" ? el.trx_hpok : 0;
                  }
                });
                data.push({
                  type: "item",
                  acco: `${e?.prod_id?.code}\n(${e?.prod_id?.name})`,
                  grupP: `${checkGrup(e.prod_id.group)?.groupPro?.name}`,
                  prod_id: e?.prod_id?.id,
                  loc_id: e?.loc_id?.id,
                  loc: `${e?.loc_id?.name}\n(${e?.loc_id?.code})`,
                  awal: qty_awal,
                  debe: qty_debit,
                  kred: qty_kredit,
                  blce: qty_awal + qty_debit - qty_kredit,
                  amnt_awal: amnt_awal,
                  amnt_deb: amnt_debit,
                  amnt_kredit: amnt_kredit,
                  amnt_akhir: amnt_awal + amnt_debit - amnt_kredit,
                });

                total_qty_awal += qty_awal;
                total_qty_md += qty_debit;
                total_qty_mk += qty_kredit;
                total_amnt_aw += amnt_awal;
                total_amnt_db += amnt_debit;
                total_amnt_kr += amnt_kredit;
              }
            });
          });
        });

        data.push({
          type: "footer",
          acco: tr[localStorage.getItem("language")].total_persediaan,
          prod_id: "",
          loc_id: "",
          loc: "",
          awal: total_qty_awal,
          debe: total_qty_md,
          kred: total_qty_mk,
          blce: total_qty_awal + total_qty_md - total_qty_mk,
          amnt_awal: total_amnt_aw,
          amnt_deb: total_amnt_db,
          amnt_kredit: total_amnt_kr,
          amnt_akhir: total_amnt_aw + total_amnt_db - total_amnt_kr,
        });
      } else if (selectedLoc?.length) {
        let total_qty_awal = 0;
        let total_qty_md = 0;
        let total_qty_mk = 0;
        let total_amnt_aw = 0;
        let total_amnt_db = 0;
        let total_amnt_kr = 0;

        selectedLoc?.forEach((loc) => {
          groupedProd?.forEach((e) => {
            if (loc?.loc_id?.id === e?.loc_id?.id) {
              let qty_awal = 0;
              let qty_debit = 0;
              let qty_kredit = 0;
              let amnt_awal = 0;
              let amnt_debit = 0;
              let amnt_kredit = 0;

              invDdb?.forEach((el) => {
                if (
                  e?.prod_id?.id === el?.inv_code?.id &&
                  e?.loc_id?.id === el?.loc_code?.id
                ) {
                  if (
                    el?.sa &&
                    !el.from_closing
                    // (el.inv_month <= filtDate.getMonth() + 1 &&
                    //   el.inv_year === filtDate.getFullYear()) ||
                    // el.inv_year <= filtDate.getFullYear()
                  ) {
                    qty_awal += el.qty_awal;
                    amnt_awal += el.inv_awal;
                  }
                }
              });
              krtst?.forEach((el) => {
                let date = new Date(`${el.trx_date}Z`);
                if (
                  el?.prod_id?.id === e?.prod_id?.id &&
                  el?.loc_id?.id === e?.loc_id?.id &&
                  filtDate.getFullYear() === date.getFullYear() &&
                  // date.getMonth() >= maxDate - 1 &&
                  date.getMonth() >= filtDate.getMonth()
                ) {
                  qty_debit += el.trx_dbcr === "d" ? el.trx_qty : 0;
                  qty_kredit += el.trx_dbcr === "k" ? el.trx_qty : 0;
                  amnt_debit += el.trx_dbcr === "d" ? el.trx_hpok : 0;
                  amnt_kredit += el.trx_dbcr === "k" ? el.trx_hpok : 0;
                }
              });
              data.push({
                type: "item",
                acco: `${e?.prod_id?.code}\n(${e?.prod_id?.name})`,
                grupP: `${checkGrup(e?.prod_id?.group)?.groupPro?.name}`,
                prod_id: e?.prod_id?.id,
                loc_id: e?.loc_id?.id,
                loc: `${e?.loc_id?.name}\n(${e?.loc_id?.code})`,
                awal: qty_awal,
                debe: qty_debit,
                kred: qty_kredit,
                blce: qty_awal + qty_debit - qty_kredit,
                amnt_awal: amnt_awal,
                amnt_deb: amnt_debit,
                amnt_kredit: amnt_kredit,
                amnt_akhir: amnt_awal + amnt_debit - amnt_kredit,
              });

              total_qty_awal += qty_awal;
              total_qty_md += qty_debit;
              total_qty_mk += qty_kredit;
              total_amnt_aw += amnt_awal;
              total_amnt_db += amnt_debit;
              total_amnt_kr += amnt_kredit;
            }
          });
        });

        data.push({
          type: "footer",
          acco: tr[localStorage.getItem("language")].total_persediaan,
          prod_id: "",
          loc_id: "",
          loc: "",
          awal: total_qty_awal,
          debe: total_qty_md,
          kred: total_qty_mk,
          blce: total_qty_awal + total_qty_md - total_qty_mk,
          amnt_awal: total_amnt_aw,
          amnt_deb: total_amnt_db,
          amnt_kredit: total_amnt_kr,
          amnt_akhir: total_amnt_aw + total_amnt_db - total_amnt_kr,
        });
      } else if (selectedPrd?.length) {
        let total_qty_awal = 0;
        let total_qty_md = 0;
        let total_qty_mk = 0;
        let total_amnt_aw = 0;
        let total_amnt_db = 0;
        let total_amnt_kr = 0;

        selectedPrd?.forEach((prd) => {
          groupedProd?.forEach((e) => {
            if (prd?.prod_id?.id === e?.prod_id?.id) {
              let qty_awal = 0;
              let qty_debit = 0;
              let qty_kredit = 0;
              let amnt_awal = 0;
              let amnt_debit = 0;
              let amnt_kredit = 0;

              invDdb?.forEach((el) => {
                if (
                  e?.prod_id?.id === el?.inv_code?.id &&
                  e?.loc_id?.id === el?.loc_code?.id
                ) {
                  if (
                    el?.sa &&
                    !el.from_closing
                    // el.inv_month <= filtDate.getMonth() + 1 &&
                    // el.inv_year <= filtDate.getFullYear()
                  ) {
                    qty_awal += el.qty_awal;
                    amnt_awal += el.inv_awal;
                  }
                }
              });
              krtst?.forEach((el) => {
                let date = new Date(`${el.trx_date}Z`);
                if (
                  el?.prod_id?.id === e?.prod_id?.id &&
                  el?.loc_id?.id === e?.loc_id?.id &&
                  filtDate.getFullYear() === date.getFullYear() &&
                  // date.getMonth() >= maxDate - 1 &&
                  date.getMonth() >= filtDate.getMonth()
                ) {
                  qty_debit += el.trx_dbcr === "d" ? el.trx_qty : 0;
                  qty_kredit += el.trx_dbcr === "k" ? el.trx_qty : 0;
                  amnt_debit += el.trx_dbcr === "d" ? el.trx_hpok : 0;
                  amnt_kredit += el.trx_dbcr === "k" ? el.trx_hpok : 0;
                }
              });
              data.push({
                type: "item",
                acco: `${e?.prod_id?.code}\n(${e?.prod_id?.name})`,
                grupP: `${checkGrup(e?.prod_id?.group)?.groupPro?.name}`,
                prod_id: e?.prod_id?.id,
                loc_id: e?.loc_id?.id,
                loc: `${e?.loc_id?.name}\n(${e?.loc_id?.code})`,
                awal: qty_awal,
                debe: qty_debit,
                kred: qty_kredit,
                blce: qty_awal + qty_debit - qty_kredit,
                amnt_awal: amnt_awal,
                amnt_deb: amnt_debit,
                amnt_kredit: amnt_kredit,
                amnt_akhir: amnt_awal + amnt_debit - amnt_kredit,
              });

              total_qty_awal += qty_awal;
              total_qty_md += qty_debit;
              total_qty_mk += qty_kredit;
              total_amnt_aw += amnt_awal;
              total_amnt_db += amnt_debit;
              total_amnt_kr += amnt_kredit;
            }
          });
        });

        data.push({
          type: "footer",
          acco: tr[localStorage.getItem("language")].total_persediaan,
          prod_id: "",
          loc_id: "",
          loc: "",
          awal: total_qty_awal,
          debe: total_qty_md,
          kred: total_qty_mk,
          blce: total_qty_awal + total_qty_md - total_qty_mk,
          amnt_awal: total_amnt_aw,
          amnt_deb: total_amnt_db,
          amnt_kredit: total_amnt_kr,
          amnt_akhir: total_amnt_aw + total_amnt_db - total_amnt_kr,
        });
      } else if (selectedGrup?.length) {
        let total_qty_awal = 0;
        let total_qty_md = 0;
        let total_qty_mk = 0;
        let total_amnt_aw = 0;
        let total_amnt_db = 0;
        let total_amnt_kr = 0;

        selectedGrup?.forEach((grp) => {
          groupedProd?.forEach((e) => {
            if (grp?.groupPro?.id === e?.prod_id?.group) {
              let qty_awal = 0;
              let qty_debit = 0;
              let qty_kredit = 0;
              let amnt_awal = 0;
              let amnt_debit = 0;
              let amnt_kredit = 0;

              invDdb?.forEach((el) => {
                if (
                  e?.prod_id?.id === el?.inv_code?.id &&
                  e?.loc_id.id === el?.loc_code?.id
                ) {
                  if (
                    el?.sa &&
                    !el.from_closing
                    // (el.inv_month <= filtDate.getMonth() + 1 &&
                    //   el.inv_year === filtDate.getFullYear()) ||
                    // el.inv_year <= filtDate.getFullYear()
                  ) {
                    qty_awal += el.qty_awal;
                    amnt_awal += el.inv_awal;
                  }
                }
              });
              krtst?.forEach((el) => {
                let date = new Date(`${el.trx_date}Z`);
                if (
                  el?.prod_id?.id === e?.prod_id?.id &&
                  el?.loc_id?.id === e?.loc_id?.id &&
                  filtDate.getFullYear() === date.getFullYear() &&
                  // date.getMonth() >= maxDate - 1 &&
                  date.getMonth() >= filtDate.getMonth()
                ) {
                  qty_debit += el.trx_dbcr === "d" ? el.trx_qty : 0;
                  qty_kredit += el.trx_dbcr === "k" ? el.trx_qty : 0;
                  amnt_debit += el.trx_dbcr === "d" ? el.trx_hpok : 0;
                  amnt_kredit += el.trx_dbcr === "k" ? el.trx_hpok : 0;
                }
              });
              data.push({
                acco: e?.prod_id ? `${e?.prod_id?.code}\n(${e?.prod_id?.name})` : "-",
                grupP: e?.prod_id ? `${checkGrup(e?.prod_id?.group)?.groupPro?.name}` : "-",
                prod_id: e?.prod_id?.id,
                loc_id: e?.loc_id?.id,
                loc: e?.loc_id ? `${e?.loc_id?.name}\n(${e?.loc_id?.code})` : "-",
                awal: qty_awal,
                debe: qty_debit,
                kred: qty_kredit,
                blce: qty_awal + qty_debit - qty_kredit,
                amnt_awal: amnt_awal,
                amnt_deb: amnt_debit,
                amnt_kredit: amnt_kredit,
                amnt_akhir: amnt_awal + amnt_debit - amnt_kredit,
              });

              total_qty_awal += qty_awal;
              total_qty_md += qty_debit;
              total_qty_mk += qty_kredit;
              total_amnt_aw += amnt_awal;
              total_amnt_db += amnt_debit;
              total_amnt_kr += amnt_kredit;
            }
          });
        });

        data.push({
          type: "footer",
          acco: tr[localStorage.getItem("language")].total_persediaan,
          prod_id: "",
          loc_id: "",
          loc: "",
          awal: total_qty_awal,
          debe: total_qty_md,
          kred: total_qty_mk,
          blce: total_qty_awal + total_qty_md - total_qty_mk,
          amnt_awal: total_amnt_aw,
          amnt_deb: total_amnt_db,
          amnt_kredit: total_amnt_kr,
          amnt_akhir: total_amnt_aw + total_amnt_db - total_amnt_kr,
        });
      } else {
        let total_qty_awal = 0;
        let total_qty_md = 0;
        let total_qty_mk = 0;
        let total_amnt_aw = 0;
        let total_amnt_db = 0;
        let total_amnt_kr = 0;
        let total_amnt_ak = 0;

        groupedProd?.forEach((e) => {
          let qty_awal = 0;
          let qty_debit = 0;
          let qty_kredit = 0;
          let amnt_awal = 0;
          let amnt_debit = 0;
          let amnt_kredit = 0;
          let amnt_akhir = 0;

          invDdb?.forEach((el) => {
            if (
              e?.prod_id?.id === el?.inv_code?.id &&
              e?.loc_id?.id === el?.loc_code?.id
            ) {
              if (
                el?.sa &&
                !el.from_closing
                // el.inv_month <= filtDate?.getMonth() + 1 &&
                // (el.inv_year === filtDate?.getFullYear() ||
                //   el.inv_year <= filtDate?.getFullYear())
              ) {
                qty_awal += el.qty_awal;
                amnt_awal += el.inv_awal;
                // amnt_akhir += el.inv_akhir;
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
              amnt_debit += el.trx_dbcr === "d" ? el.trx_hpok : 0;
              amnt_kredit += el.trx_dbcr === "k" ? el.trx_hpok : 0;
            }
          });
          data.push({
            type: "item",
            acco: e?.prod_id ? `${e?.prod_id?.code}\n(${e?.prod_id?.name})` : "-",
            grupP: e?.prod_id ? `${checkGrup(e?.prod_id?.group)?.groupPro?.name}` : "-",
            prod_id: e?.prod_id?.id,
            loc_id: e?.loc_id?.id,
            loc: e?.loc_id ? `${e?.loc_id?.name}\n(${e?.loc_id?.code})` : "-",
            awal: qty_awal,
            debe: qty_debit,
            kred: qty_kredit,
            blce: qty_awal + qty_debit - qty_kredit,
            amnt_awal: amnt_awal,
            amnt_deb: amnt_debit,
            amnt_kredit: amnt_kredit,
            amnt_akhir: amnt_awal + amnt_debit - amnt_kredit,
          });

          total_qty_awal += qty_awal;
          total_qty_md += qty_debit;
          total_qty_mk += qty_kredit;
          total_amnt_aw += amnt_awal;
          total_amnt_db += amnt_debit;
          total_amnt_kr += amnt_kredit;
        });

        data.push({
          type: "footer",
          acco: tr[localStorage.getItem("language")].total_persediaan,
          prod_id: "",
          loc_id: "",
          loc: "",
          awal: total_qty_awal,
          debe: total_qty_md,
          kred: total_qty_mk,
          blce: total_qty_awal + total_qty_md - total_qty_mk,
          amnt_awal: total_amnt_aw,
          amnt_deb: total_amnt_db,
          amnt_kredit: total_amnt_kr,
          amnt_akhir: total_amnt_aw + total_amnt_db - total_amnt_kr,
        });
      }
    }

    console.log("skhsgjsgfjsgfjs");
    console.log(data);

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
    data?.forEach((el) => {
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
          value: el.amnt_awal,
          style: {
            font: {
              sz: "14",
              bold: false,
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
          value: el.amnt_deb,
          style: {
            font: {
              sz: "14",
              bold: false,
            },
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
          value: el.amnt_kredit,
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
        {
          value: el.amnt_akhir,
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
          title: tr[localStorage.getItem("language")]["kd_prod"],
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
          title: tr[localStorage.getItem("language")]["g_prod"],
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
          title: tr[localStorage.getItem("language")]["loc_prod"],
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
          title: tr[localStorage.getItem("language")].qty_awal,
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
          title: tr[localStorage.getItem("language")].nilai_awal,
          width: { wch: 24 },
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
          title: tr[localStorage.getItem("language")].mutasi_deb,
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
          title: tr[localStorage.getItem("language")].debit_scor,
          width: { wch: 24 },
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
          title: tr[localStorage.getItem("language")].mutasi_kred,
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
          title: tr[localStorage.getItem("language")].cred_scor,
          width: { wch: 24 },
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
          title: tr[localStorage.getItem("language")].qty_ahir,
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
          title: tr[localStorage.getItem("language")].nilai_ahir,
          width: { wch: 24 },
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

    console.log("excel");
    console.log(item);

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

  const prodTemp = (option) => {
    return (
      <div>
        {option !== null
          ? `${option?.prod_id?.name} (${option?.prod_id?.code})`
          : ""}
      </div>
    );
  };

  const valProd = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option?.prod_id?.name} (${option?.prod_id?.code})`
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
          ? `${option?.loc_id?.name} (${option?.loc_id?.code})`
          : ""}
      </div>
    );
  };

  const valLoc = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option?.loc_id?.name} (${option?.loc_id?.code})`
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
                  setFiltDate(e.value);
                }}
                view="month"
                placeholder={tr[localStorage.getItem("language")].pilih_tgl}
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
                placeholder={tr[localStorage.getItem("language")].pilih_lokasi}
                optionLabel="loc_id.name"
                itemTemplate={locTemp}
                valueTemplate={valLoc}
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
                value={selectedPrd ?? null}
                options={prod}
                onChange={(e) => {
                  setSelectedPrd(e.value);
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
            <div className="col-2">
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
          {/* 
          {loading && (
            <ProgressSpinner
              style={{ width: "20px", height: "20px" }}
              strokeWidth="8"
              fill="transparent"
              animationDuration=".5s"
            />
          )} */}
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            {/* <ExcelExportHelper
              json={stcard ? jsonForExcel(stcard, true) : null}
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
      {loading ? (
        <Row className="m-0 justify-content-center">
          <ProgressSpinner
            className="center"
            style={{ width: "50px", height: "50px" }}
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration=".5s"
          />
        </Row>
      ) : (
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
                          responsiveLayout="none"
                          value={val}
                          showGridlines
                          dataKey="id"
                          rowHover
                          emptyMessage={
                            tr[localStorage.getItem("language")].data_kosong
                          }
                        >
                          <Column
                            className="header-center"
                            header={
                              tr[localStorage.getItem("language")].kd_prod
                            }
                            style={{ width: "10rem", whiteSpace: "pre-wrap" }}
                            // field={(e) => e?.acco}
                            body={(e) =>
                              loading ? (
                                <Skeleton />
                              ) : e.type === "item" &&
                                selectedLoc?.length &&
                                selectedPrd?.length ? (
                                <Link
                                  to={`/laporan/persediaan/kartu-stock-rincian/${btoa(
                                    `m'${filtDate?.getMonth() + 1}`
                                  )}/${btoa(
                                    `y'${filtDate?.getFullYear()}`
                                  )}/${btoa(
                                    btoa(
                                      JSON.stringify({
                                        loc: e.loc_id,
                                      })
                                    )
                                  )}/${btoa(
                                    btoa(
                                      JSON.stringify({
                                        prod: e.prod_id,
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
                            header={tr[localStorage.getItem("language")].g_prod}
                            style={{ width: "8rem" }}
                            field={(e) =>
                              loading ? (
                                <Skeleton />
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
                                  {e?.grupP}
                                </div>
                              )
                            }
                          />
                          <Column
                            // className="header-right text-right"
                            // hidden={selectedGrup?.length === 0}
                            header={
                              tr[localStorage.getItem("language")].loc_prod
                            }
                            style={{ width: "9rem", whiteSpace: "pre-wrap" }}
                            field={(e) =>
                              loading ? (
                                <Skeleton />
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
                                  {e?.loc}
                                </div>
                              )
                            }
                          />
                          <Column
                            className="header-right text-right"
                            header={
                              tr[localStorage.getItem("language")].qty_awal
                            }
                            style={{ width: "7rem" }}
                            field={(e) =>
                              loading ? (
                                <Skeleton />
                              ) : (
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
                              )
                            }
                          />
                          <Column
                            hidden={!checkValue}
                            className="header-right text-right"
                            header={
                              tr[localStorage.getItem("language")].nilai_awal
                            }
                            style={{ width: "10rem" }}
                            field={(e) =>
                              loading ? (
                                <Skeleton />
                              ) : (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold text-right mr-2"
                                      : e.type === "footer"
                                      ? "font-weight-bold text-right mr-2"
                                      : "text-right mr-2"
                                  }
                                >
                                  {formatIdr(e?.amnt_awal)}
                                </div>
                              )
                            }
                          />
                          <Column
                            className="header-right text-right"
                            header={
                              tr[localStorage.getItem("language")].mutasi_deb
                            }
                            style={{ width: "7rem" }}
                            field={(e) =>
                              loading ? (
                                <Skeleton />
                              ) : (
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
                              )
                            }
                          />

                          <Column
                            hidden={!checkValue}
                            className="header-right text-right"
                            header={
                              tr[localStorage.getItem("language")].debit_scor
                            }
                            style={{ width: "10rem" }}
                            field={(e) =>
                              loading ? (
                                <Skeleton />
                              ) : (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold text-right mr-2"
                                      : e.type === "footer"
                                      ? "font-weight-bold text-right mr-2"
                                      : "text-right mr-2"
                                  }
                                >
                                  {formatIdr(e?.amnt_deb)}
                                </div>
                              )
                            }
                          />
                          <Column
                            className="header-right text-right"
                            header={
                              tr[localStorage.getItem("language")].mutasi_kred
                            }
                            style={{ width: "7rem" }}
                            field={(e) =>
                              loading ? (
                                <Skeleton />
                              ) : (
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
                              )
                            }
                          />

                          <Column
                            hidden={!checkValue}
                            className="header-right text-right"
                            header={
                              tr[localStorage.getItem("language")].cred_scor
                            }
                            style={{ width: "10rem" }}
                            field={(e) =>
                              loading ? (
                                <Skeleton />
                              ) : (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold text-right mr-2"
                                      : e.type === "footer"
                                      ? "font-weight-bold text-right mr-2"
                                      : "text-right mr-2"
                                  }
                                >
                                  {formatIdr(e?.amnt_kredit)}
                                </div>
                              )
                            }
                          />
                          <Column
                            className="header-right text-right"
                            header={
                              tr[localStorage.getItem("language")].qty_ahir
                            }
                            style={{ width: "7rem" }}
                            field={(e) =>
                              loading ? (
                                <Skeleton />
                              ) : (
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
                              )
                            }
                          />
                          <Column
                            hidden={!checkValue}
                            className="header-right text-right"
                            header={
                              tr[localStorage.getItem("language")].nilai_ahir
                            }
                            style={{ width: "10rem" }}
                            field={(e) =>
                              loading ? (
                                <Skeleton />
                              ) : (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold text-right mr-2"
                                      : e.type === "footer"
                                      ? "font-weight-bold text-right mr-2"
                                      : "text-right mr-2"
                                  }
                                >
                                  {formatIdr(e?.amnt_akhir)}
                                </div>
                              )
                            }
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
      )}

      <Row className="m-0 justify-content-center d-none">
        <Card>
          <Card.Body className="p-0" ref={printPage}>
            {chunk(jsonForExcel(stcard) ?? [], chunkSize)?.map((val, idx) => {
              return (
                <Card className="ml-1 mr-1 mt-2">
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
                            emptyMessage={
                              tr[localStorage.getItem("language")].data_kosong
                            }
                          >
                            <Column
                              className="header-center"
                              header={
                                tr[localStorage.getItem("language")].kd_prod
                              }
                              style={{ width: "12rem", whiteSpace: "pre-wrap" }}
                              field={(e) => (
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
                              // className="header-right text-right"
                              // hidden={selectedGrup?.length === 0}
                              header={
                                tr[localStorage.getItem("language")].g_prod
                              }
                              style={{ width: "8rem" }}
                              field={(e) =>
                                loading ? (
                                  <Skeleton />
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
                                    {e?.grupP}
                                  </div>
                                )
                              }
                            />
                            <Column
                              // className="header-right text-right"
                              // hidden={selectedGrup?.length === 0}
                              header={
                                tr[localStorage.getItem("language")].loc_prod
                              }
                              style={{ width: "9rem", whiteSpace: "pre-wrap" }}
                              field={(e) =>
                                loading ? (
                                  <Skeleton />
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
                                    {e?.loc}
                                  </div>
                                )
                              }
                            />
                            <Column
                              className="header-right text-right"
                              header={
                                tr[localStorage.getItem("language")].qty_awal
                              }
                              style={{ width: "7rem" }}
                              field={(e) =>
                                loading ? (
                                  <Skeleton />
                                ) : (
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
                                )
                              }
                            />
                            <Column
                              hidden={!checkValue}
                              className="header-right text-right"
                              header={
                                tr[localStorage.getItem("language")].nilai_awal
                              }
                              style={{ width: "10rem" }}
                              field={(e) =>
                                loading ? (
                                  <Skeleton />
                                ) : (
                                  <div
                                    className={
                                      e.type === "header"
                                        ? "font-weight-bold text-right mr-2"
                                        : e.type === "footer"
                                        ? "font-weight-bold text-right mr-2"
                                        : "text-right mr-2"
                                    }
                                  >
                                    {formatIdr(e?.amnt_awal)}
                                  </div>
                                )
                              }
                            />
                            <Column
                              className="header-right text-right"
                              header={
                                tr[localStorage.getItem("language")].mutasi_deb
                              }
                              style={{ width: "7rem" }}
                              field={(e) =>
                                loading ? (
                                  <Skeleton />
                                ) : (
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
                                )
                              }
                            />

                            <Column
                              hidden={!checkValue}
                              className="header-right text-right"
                              header={
                                tr[localStorage.getItem("language")].debit_scor
                              }
                              style={{ width: "10rem" }}
                              field={(e) =>
                                loading ? (
                                  <Skeleton />
                                ) : (
                                  <div
                                    className={
                                      e.type === "header"
                                        ? "font-weight-bold text-right mr-2"
                                        : e.type === "footer"
                                        ? "font-weight-bold text-right mr-2"
                                        : "text-right mr-2"
                                    }
                                  >
                                    {formatIdr(e?.amnt_deb)}
                                  </div>
                                )
                              }
                            />
                            <Column
                              className="header-right text-right"
                              header={
                                tr[localStorage.getItem("language")].mutasi_kred
                              }
                              style={{ width: "7rem" }}
                              field={(e) =>
                                loading ? (
                                  <Skeleton />
                                ) : (
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
                                )
                              }
                            />

                            <Column
                              hidden={!checkValue}
                              className="header-right text-right"
                              header={
                                tr[localStorage.getItem("language")].cred_scor
                              }
                              style={{ width: "10rem" }}
                              field={(e) =>
                                loading ? (
                                  <Skeleton />
                                ) : (
                                  <div
                                    className={
                                      e.type === "header"
                                        ? "font-weight-bold text-right mr-2"
                                        : e.type === "footer"
                                        ? "font-weight-bold text-right mr-2"
                                        : "text-right mr-2"
                                    }
                                  >
                                    {formatIdr(e?.amnt_kredit)}
                                  </div>
                                )
                              }
                            />
                            <Column
                              className="header-right text-right"
                              header={
                                tr[localStorage.getItem("language")].qty_ahir
                              }
                              style={{ width: "7rem" }}
                              field={(e) =>
                                loading ? (
                                  <Skeleton />
                                ) : (
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
                                )
                              }
                            />
                            <Column
                              hidden={!checkValue}
                              className="header-right text-right"
                              header={
                                tr[localStorage.getItem("language")].nilai_ahir
                              }
                              style={{ width: "10rem" }}
                              field={(e) =>
                                loading ? (
                                  <Skeleton />
                                ) : (
                                  <div
                                    className={
                                      e.type === "header"
                                        ? "font-weight-bold text-right mr-2"
                                        : e.type === "footer"
                                        ? "font-weight-bold text-right mr-2"
                                        : "text-right mr-2"
                                    }
                                  >
                                    {formatIdr(e?.amnt_akhir)}
                                  </div>
                                )
                              }
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

export default KartuStockRingkasan;
