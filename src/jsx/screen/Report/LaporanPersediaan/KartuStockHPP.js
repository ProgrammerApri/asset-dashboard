import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";

// import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import { Dropdown } from "primereact/dropdown";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
// import ExcelExportHelper from "../../../components/ExportExcel/ExcelExportHelper";
import { MultiSelect } from "primereact/multiselect";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SET_FILTDATE_KSSAL } from "src/redux/actions";
import { tr } from "../../../../data/tr";

const data = {
  id: 0,
  ord_code: null,
  ord_date: null,
  faktur: null,
  po_id: null,
  dep_id: null,
  sup_id: null,
  top: null,
  due_date: null,
  split_inv: null,
  prod_disc: null,
  jasa_disc: null,
  total_disc: null,
  dprod: [],
  djasa: [],
};

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const KartuStockHPP = ({ month, year, prodId }) => {
  const [product, setProduct] = useState(null);
  const [productOption, setProductOption] = useState(null);
  const [location, setLoc] = useState(null);
  const [selectedProduct, setSelected] = useState([]);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [selectedGrup, setSelectedGrup] = useState([]);
  const [grupProd, setGrupP] = useState(null);
  const [stCard, setStCard] = useState(null);
  const [batch, setBtc] = useState(null);
  const printPage = useRef(null);
  const [invDdb, setInvDdb] = useState(null);
  // const [filtDate, setFiltDate] = useState(
  //   year && month ? new Date(year, month - 1, 1) : new Date()
  // );

  const filtDate = useSelector((state) => state.filtDate.kssal);
  const dispatch = useDispatch();
  const [maxDate, setMaxDate] = useState(new Date().getMonth() + 1);
  const chunkSize = 7;
  const [cp, setCp] = useState("");

  const setFiltDate = (payload) => {
    dispatch({ type: SET_FILTDATE_KSSAL, payload: payload });
  };

  useEffect(() => {
    getSt();
    getInvDdb(prodId);
  }, []);

  const getSt = async () => {
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
        getBtc();
      }
    } catch (error) {}
  };

  const getInvDdb = async (id) => {
    const config = {
      ...endpoints.posting,
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        const { data } = response;
        setInvDdb(data);
        // let month = [];
        let date = [];
        data
          .map((v) => !v.from_closing && v)
          .forEach((ej) => {
            // if (
            //   filtDate.getFullYear() === ej.inv_year &&
            //   filtDate.getMonth() + 1 >= ej.inv_month
            // ) {
            date.push(new Date(ej.inv_year, ej.inv_month - 1));
            // }
          });
        let grouped = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.inv_code?.id === ek?.inv_code?.id)
        );
        let grouploc = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.loc_code?.id === ek?.loc_code?.id)
        );
        setProduct(grouped);
        setLoc(grouploc);

        getGrupProd(data);

        setMaxDate(new Date(Math.max(...date)).getMonth() + 1);
        if (!year && !month) {
          if (!filtDate) {
            setFiltDate(new Date(new Date(Math.max(...date))));
          }
        } else {
          setFiltDate(new Date(year, month, -1, 1));
        }

        if (prodId) {
          grouped?.forEach((elem) => {
            if (elem?.inv_code?.id === prodId) {
              setSelected([elem]);
            }
          });
        }

        // console.log("grouprdddddddddd", setFiltDate(new Date()));
      }
    } catch (error) {}
  };

  const getGrupProd = async (invDdb) => {
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
          invDdb?.forEach((elem) => {
            if (element?.groupPro?.id === elem?.inv_code?.group) {
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

  const getBtc = async () => {
    const config = {
      ...endpoints.batch,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setBtc(data);
      }
    } catch (error) {}
  };

  const jsonForExcel = (stCard, excel = false) => {
    let data = [];
    let v = [];
    let grouped_product = [];
    let month = [];

    invDdb?.forEach((ej) => {
      if (
        filtDate?.getFullYear() === ej.inv_year &&
        filtDate?.getMonth() + 1 >= ej.inv_month
      ) {
        month.push(ej.inv_month);
      }
    });
    if (selectedLoc && selectedProduct?.length) {
      selectedProduct?.forEach((p) => {
        let grouped_product = invDdb?.filter(
          (el, i) =>
            i ===
            invDdb?.findIndex(
              (ek) =>
                el?.inv_code?.id === ek?.inv_code?.id &&
                p?.inv_code?.id === ek?.inv_code?.id &&
                selectedLoc?.loc_code.id === ek?.loc_code.id
            )
        );
        // console.log(grouped_product);
        grouped_product.forEach((v) => {
          let trn = [
            {
              type: "header",
              value: {
                trx_code: tr[localStorage.getItem("language")]["kd_tran"],
                trx_date:tr[localStorage.getItem("language")]["tgl"],
                // trx_type: tr[localStorage.getItem("language")].jns_tran,
                in_qty: "Qty",
                in_cost: "Cost",
                in_amnt: "Amount",
                out_qty: "Qty",
                out_cost: "Cost",
                out_amnt: "Amount",
                b_qty: "Qty",
                b_cost: "Cost",
                b_amnt: "amount",
              },
            },
          ];

          let sa = 0;
          let st = 0;
          let qty_awal = 0;

          let qty_k = 0;
          let qty_d = 0;
          let bl_k = 0;
          let bl_d = 0;
          let hpp = 0;
          let hpp_awal = 0;
          let qty = 0;
          let produkk = 0;
          let sts_b = false;

          invDdb?.forEach((ek) => {
            if (ek.inv_year === filtDate.getFullYear()) {
              if (ek.inv_month === Math.max(...month)) {
                if (
                  v?.inv_code?.id === ek.inv_code.id &&
                  p?.inv_code?.id === ek?.inv_code?.id &&
                  selectedLoc?.loc_code?.id === ek?.loc_code?.id
                ) {
                  if (ek.qty_awal > 0 && ek.hpp > 0) {
                    sa += ek.inv_awal;
                    qty_awal += ek.qty_awal;

                    trn.push({
                      type: "item",
                      value: {
                        trx_code: tr[localStorage.getItem("language")]["ttl_uangmuka"],
                        trx_date: "",
                        in_qty: "",
                        in_cost: "",
                        in_amnt: "",
                        out_qty: "",
                        out_cost: "",
                        out_amnt: "",
                        b_qty: formatTh(ek?.qty_awal) ?? 0,
                        b_cost: ek.hpp ? `${formatIdr(ek.hpp)}` : 0,
                        b_amnt: ek.inv_awal ? `${formatIdr(ek.inv_awal)}` : 0,
                      },
                    });

                    bl_d += ek.inv_awal;
                    qty_d += ek.qty_awal;
                    hpp = ek.hpp;
                    hpp_awal = ek.inv_awal;
                    qty = ek.qty_awal;
                    // produkk =
                  }
                }
              }
            }
          });
          stCard?.forEach((el) => {
            batch?.forEach((element) => {
              if (el.trx_code === element.bcode) {
                sts_b = element.pb;
              }
            });
            if (v?.inv_code?.id === el?.prod_id?.id) {
              let dt = new Date(`${el?.trx_date}Z`);
              if (dt.getFullYear() === filtDate.getFullYear()) {
                if (dt.getMonth() + 1 === Math.max(...month)) {
                  if (el.trx_dbcr === "d") {
                    qty_d += el.trx_qty;
                    bl_d += el.trx_hpok;
                  } else {
                    qty_k += el.trx_qty;
                  }

                  if (el.trx_dbcr === "d") {
                    hpp = bl_d / (qty_d - qty_k);
                  } else {
                    bl_k += el.trx_qty * hpp;
                  }

                  trn.push({
                    type: "item",
                    value: {
                      trx_code: el.trx_code,
                      trx_date: formatDate(el.trx_date),
                      in_qty: el.trx_dbcr === "d" ? formatTh(el.trx_qty) : 0,
                      in_cost:
                        el.trx_dbcr === "d"
                          ? el.trx_hpok && el.trx_qty
                            ? `${formatIdr(el.trx_hpok / el.trx_qty)}`
                            : 0
                          : 0,
                      in_amnt:
                        el.trx_dbcr === "d"
                          ? el.trx_hpok
                            ? `${formatIdr(el.trx_hpok)}`
                            : 0
                          : 0,
                      out_qty: el.trx_dbcr === "k" ? formatTh(el.trx_qty) : 0,
                      out_cost:
                        el.trx_dbcr === "k" && el.trx_type === "PJ"
                          ? el.trx_sprice
                            ? `${formatIdr(el.trx_sprice)}`
                            : 0
                          : el.trx_dbcr === "k" && el.trx_hpok
                          ? `${formatIdr(el.trx_hpok / el.trx_qty)}`
                          : 0,
                      out_amnt:
                        el.trx_dbcr === "k" && el.trx_hpok
                          ? `${formatIdr(el.trx_hpok)}`
                          : 0,
                      b_qty: formatTh(qty_d - qty_k),
                      b_cost: hpp > 0 ? `${formatIdr(hpp)}` : 0,
                      b_amnt: `${formatIdr(bl_d - bl_k)}`,
                      trx_type: el.trx_type,
                      sts: sts_b,
                    },
                  });
                }
              }
            }
          });

          data.push({
            header: [
              {
                prod:
                  (selectedProduct !== v) === null
                    ? "-"
                    : `${v?.inv_code?.code} (${v?.inv_code?.name})`,
                // nom: v === null ? "-" : qty,
                // sld: v === null ? "-" : formatIdr(hpp_awal),
              },
            ],

            trn: trn,
          });
        });
      });
    } else if (selectedLoc && selectedGrup?.length) {
      selectedGrup?.forEach((grp) => {
        let grouped_product = invDdb?.filter(
          (el, i) =>
            i ===
            invDdb?.findIndex(
              (ek) =>
                el?.inv_code?.id === ek?.inv_code?.id &&
                grp?.groupPro?.id === ek?.inv_code?.group &&
                selectedLoc?.loc_code.id === ek?.loc_code.id
            )
        );
        // console.log(grouped_product);
        grouped_product.forEach((v) => {
          let trn = [
            {
              type: "header",
              value: {
                trx_code: tr[localStorage.getItem("language")]["kd_tran"],
                trx_date:tr[localStorage.getItem("language")]["tgl"],
                // trx_type: tr[localStorage.getItem("language")].jns_tran,
                in_qty: "Qty",
                in_cost: "Cost",
                in_amnt: "Amount",
                out_qty: "Qty",
                out_cost: "Cost",
                out_amnt: "Amount",
                b_qty: "Qty",
                b_cost: "Cost",
                b_amnt: "amount",
              },
            },
          ];

          let sa = 0;
          let st = 0;
          let qty_awal = 0;

          let qty_k = 0;
          let qty_d = 0;
          let bl_k = 0;
          let bl_d = 0;
          let hpp = 0;
          let hpp_awal = 0;
          let qty = 0;
          let produkk = 0;
          let sts_b = false;

          invDdb?.forEach((ek) => {
            if (ek.inv_year === filtDate.getFullYear()) {
              if (ek.inv_month === Math.max(...month)) {
                if (
                  v?.inv_code?.id === ek.inv_code.id &&
                  grp?.groupPro?.id === ek?.inv_code?.group &&
                  selectedLoc?.loc_code?.id === ek?.loc_code?.id
                ) {
                  if (ek.qty_awal > 0 && ek.hpp > 0) {
                    sa += ek.inv_awal;
                    qty_awal += ek.qty_awal;

                    trn.push({
                      type: "item",
                      value: {
                        trx_code: tr[localStorage.getItem("language")]["ttl_uangmuka"],
                        trx_date: "",
                        in_qty: "",
                        in_cost: "",
                        in_amnt: "",
                        out_qty: "",
                        out_cost: "",
                        out_amnt: "",
                        b_qty: formatTh(ek?.qty_awal) ?? 0,
                        b_cost: ek.hpp ? `${formatIdr(ek.hpp)}` : 0,
                        b_amnt: ek.inv_awal ? `${formatIdr(ek.inv_awal)}` : 0,
                      },
                    });

                    bl_d += ek.inv_awal;
                    qty_d += ek.qty_awal;
                    hpp = ek.hpp;
                    hpp_awal = ek.inv_awal;
                    qty = ek.qty_awal;
                    // produkk =
                  }
                }
              }
            }
          });
          stCard?.forEach((el) => {
            batch?.forEach((element) => {
              if (el.trx_code === element.bcode) {
                sts_b = element.pb;
              }
            });
            if (v?.inv_code?.id === el?.prod_id?.id) {
              let dt = new Date(`${el?.trx_date}Z`);
              if (dt.getFullYear() === filtDate.getFullYear()) {
                if (dt.getMonth() + 1 === Math.max(...month)) {
                  if (el.trx_dbcr === "d") {
                    qty_d += el.trx_qty;
                    bl_d += el.trx_hpok;
                  } else {
                    qty_k += el.trx_qty;
                  }

                  if (el.trx_dbcr === "d") {
                    hpp = bl_d / (qty_d - qty_k);
                  } else {
                    bl_k += el.trx_qty * hpp;
                  }

                  trn.push({
                    type: "item",
                    value: {
                      trx_code: el.trx_code,
                      trx_date: formatDate(el.trx_date),
                      in_qty: el.trx_dbcr === "d" ? formatTh(el.trx_qty) : 0,
                      in_cost:
                        el.trx_dbcr === "d"
                          ? el.trx_hpok && el.trx_qty
                            ? `${formatIdr(el.trx_hpok / el.trx_qty)}`
                            : 0
                          : 0,
                      in_amnt:
                        el.trx_dbcr === "d"
                          ? el.trx_hpok
                            ? `${formatIdr(el.trx_hpok)}`
                            : 0
                          : 0,
                      out_qty: el.trx_dbcr === "k" ? formatTh(el.trx_qty) : 0,
                      out_cost:
                        el.trx_dbcr === "k" && el.trx_type === "PJ"
                          ? el.trx_sprice
                            ? `${formatIdr(el.trx_sprice)}`
                            : 0
                          : el.trx_dbcr === "k" && el.trx_hpok
                          ? `${formatIdr(el.trx_hpok / el.trx_qty)}`
                          : 0,
                      out_amnt:
                        el.trx_dbcr === "k" && el.trx_hpok
                          ? `${formatIdr(el.trx_hpok)}`
                          : 0,
                      b_qty: formatTh(qty_d - qty_k),
                      b_cost: hpp > 0 ? `${formatIdr(hpp)}` : 0,
                      b_amnt: `${formatIdr(bl_d - bl_k)}`,
                      trx_type: el.trx_type,
                      sts: sts_b,
                    },
                  });
                }
              }
            }
          });

          data.push({
            header: [
              {
                prod:
                  (selectedProduct !== v) === null
                    ? "-"
                    : `${v?.inv_code?.code} (${v?.inv_code?.name})`,
                // nom: v === null ? "-" : qty,
                // sld: v === null ? "-" : formatIdr(hpp_awal),
              },
            ],

            trn: trn,
          });
        });
      });
    } else if (selectedProduct?.length) {
      selectedProduct?.forEach((p) => {
        let grouped_product = invDdb?.filter(
          (el, i) =>
            i ===
            invDdb?.findIndex(
              (ek) =>
                el?.inv_code?.id === ek?.inv_code?.id &&
                p?.inv_code?.id === ek?.inv_code?.id
            )
        );

        // console.log(grouped_product);
        grouped_product.forEach((v) => {
          let trn = [
            {
              type: "header",
              value: {
                trx_code:tr[localStorage.getItem("language")]["kd_tran"],
                trx_date:tr[localStorage.getItem("language")]["tgl"],
                // trx_type: tr[localStorage.getItem("language")].jns_tran,
                in_qty: "Qty",
                in_cost: "Cost",
                in_amnt: "Amount",
                out_qty: "Qty",
                out_cost: "Cost",
                out_amnt: "Amount",
                b_qty: "Qty",
                b_cost: "Cost",
                b_amnt: "amount",
              },
            },
          ];

          let sa = 0;
          let st = 0;
          let qty_awal = 0;

          let qty_k = 0;
          let qty_d = 0;
          let bl_k = 0;
          let bl_d = 0;
          let hpp = 0;
          let hpp_awal = 0;
          let qty = 0;
          let produkk = 0;
          let sts_b = false;

          invDdb?.forEach((ek) => {
            if (ek.inv_year === filtDate?.getFullYear()) {
              if (ek.inv_month === Math.max(...month)) {
                if (
                  v?.inv_code?.id === ek.inv_code.id &&
                  p?.inv_code?.id === ek?.inv_code?.id
                  // selectedProduct?.inv_code?.id === ek?.inv_code?.id
                ) {
                  if (ek.qty_awal > 0 && ek.hpp > 0) {
                    sa += ek.inv_awal;
                    qty_awal += ek.qty_awal;

                    trn.push({
                      type: "item",
                      value: {
                        trx_code: tr[localStorage.getItem("language")]["ttl_uangmuka"],
                        trx_date: "",
                        in_qty: "",
                        in_cost: "",
                        in_amnt: "",
                        out_qty: "",
                        out_cost: "",
                        out_amnt: "",
                        b_qty: formatTh(ek?.qty_awal) ?? 0,
                        b_cost: ek.hpp ? `${formatIdr(ek.hpp)}` : 0,
                        b_amnt: ek.inv_awal ? `${formatIdr(ek.inv_awal)}` : 0,
                      },
                    });

                    bl_d += ek.inv_awal;
                    qty_d += ek.qty_awal;
                    hpp = ek.hpp;
                    hpp_awal = ek.inv_awal;
                    qty = ek.qty_awal;
                    // produkk =
                  }
                }
              }
            }
          });
          stCard?.forEach((el) => {
            batch?.forEach((element) => {
              if (el.trx_code === element.bcode) {
                sts_b = element.pb;
              }
            });
            if (v?.inv_code?.id === el?.prod_id?.id) {
              let dt = new Date(`${el?.trx_date}Z`);
              if (dt?.getFullYear() === filtDate?.getFullYear()) {
                if (dt.getMonth() + 1 === Math.max(...month)) {
                  if (el.trx_dbcr === "d") {
                    qty_d += el.trx_qty;
                    bl_d += el.trx_hpok;
                  } else {
                    qty_k += el.trx_qty;
                  }

                  if (el.trx_dbcr === "d") {
                    hpp = bl_d / (qty_d - qty_k);
                  } else {
                    bl_k += el.trx_qty * hpp;
                  }

                  trn.push({
                    type: "item",
                    value: {
                      trx_code: el.trx_code,
                      trx_date: formatDate(el.trx_date),
                      in_qty: el.trx_dbcr === "d" ? formatTh(el.trx_qty) : 0,
                      in_cost:
                        el.trx_dbcr === "d"
                          ? el.trx_hpok && el.trx_qty
                            ? `${formatIdr(el.trx_hpok / el.trx_qty)}`
                            : 0
                          : 0,
                      in_amnt:
                        el.trx_dbcr === "d"
                          ? el.trx_hpok
                            ? `${formatIdr(el.trx_hpok)}`
                            : 0
                          : 0,
                      out_qty: el.trx_dbcr === "k" ? formatTh(el.trx_qty) : 0,
                      out_cost:
                        el.trx_dbcr === "k" && el.trx_type === "PJ"
                          ? el.trx_sprice
                            ? `${formatIdr(el.trx_sprice)}`
                            : 0
                          : el.trx_dbcr === "k" && el.trx_hpok
                          ? `${formatIdr(el.trx_hpok / el.trx_qty)}`
                          : 0,
                      out_amnt:
                        el.trx_dbcr === "k" && el.trx_hpok
                          ? `${formatIdr(el.trx_hpok)}`
                          : 0,
                      b_qty: formatTh(qty_d - qty_k),
                      b_cost: hpp > 0 ? `${formatIdr(hpp)}` : 0,
                      b_amnt: `${formatIdr(bl_d - bl_k)}`,
                      trx_type: el.trx_type,
                      sts: sts_b,
                    },
                  });
                }
              }
            }
          });

          data.push({
            header: [
              {
                prod:
                  (selectedProduct !== v) === null
                    ? "-"
                    : `${v?.inv_code?.code} (${v?.inv_code?.name})`,
                // nom: v === null ? "-" : qty,
                // sld: v === null ? "-" : formatIdr(hpp_awal),
              },
            ],

            trn: trn,
          });
        });
      });
    } else if (selectedLoc) {
      let grouped_product = invDdb?.filter(
        (el, i) =>
          i ===
          invDdb?.findIndex(
            (ek) =>
              el?.inv_code?.id === ek?.inv_code?.id &&
              selectedLoc.loc_code.id === ek.loc_code.id
          )
      );

      // console.log(grouped_product);
      grouped_product.forEach((v) => {
        let trn = [
          {
            type: "header",
            value: {
              trx_code: tr[localStorage.getItem("language")]["kd_tran"],
              trx_date: tr[localStorage.getItem("language")]["tgl"],
              // trx_type: tr[localStorage.getItem("language")].jns_tran,
              in_qty: "Qty",
              in_cost: "Cost",
              in_amnt: "Amount",
              out_qty: "Qty",
              out_cost: "Cost",
              out_amnt: "Amount",
              b_qty: "Qty",
              b_cost: "Cost",
              b_amnt: "amount",
            },
          },
        ];

        let sa = 0;
        let st = 0;
        let qty_awal = 0;

        let qty_k = 0;
        let qty_d = 0;
        let bl_k = 0;
        let bl_d = 0;
        let hpp = 0;
        let hpp_awal = 0;
        let qty = 0;
        // let lok =0;
        let produkk = 0;
        let sts_b = false;

        invDdb?.forEach((ek) => {
          if (ek.inv_year === filtDate?.getFullYear()) {
            if (ek.inv_month === Math.max(...month)) {
              if (
                v?.inv_code?.id === ek.inv_code.id &&
                selectedLoc.loc_code.id === ek.loc_code.id
              ) {
                if (ek.qty_awal > 0 && ek.hpp > 0) {
                  sa += ek.inv_awal;
                  qty_awal += ek.qty_awal;

                  trn.push({
                    type: "item",
                    value: {
                      trx_code: tr[localStorage.getItem("language")]["ttl_uangmuka"],
                      trx_date: "",
                      in_qty: "",
                      in_cost: "",
                      in_amnt: "",
                      out_qty: "",
                      out_cost: "",
                      out_amnt: "",
                      b_qty: formatTh(ek?.qty_awal) ?? 0,
                      b_cost: ek.hpp ? `${formatIdr(ek.hpp)}` : 0,
                      b_amnt: ek.inv_awal ? `${formatIdr(ek.inv_awal)}` : 0,
                    },
                  });

                  bl_d += ek.inv_awal;
                  qty_d += ek.qty_awal;
                  hpp = ek.hpp;
                  hpp_awal = ek.inv_awal;
                  qty = ek.qty_awal;
                  // produkk =
                  // lok= loc_code?.name;
                }
              }
            }
          }
        });

        stCard?.forEach((el) => {
          batch?.forEach((element) => {
            if (el.trx_code === element.bcode) {
              sts_b = element.pb;
            }
          });

          if (
            v?.inv_code?.id === el?.prod_id?.id &&
            selectedLoc.loc_code.id === el.loc_id.id
          ) {
            let dt = new Date(`${el?.trx_date}Z`);
            if (dt.getFullYear() === filtDate?.getFullYear()) {
              if (dt.getMonth() + 1 === Math.max(...month)) {
                if (el.trx_dbcr === "d") {
                  qty_d += el.trx_qty;
                  bl_d += el.trx_hpok;
                } else {
                  qty_k += el.trx_qty;
                }

                if (el.trx_dbcr === "d") {
                  hpp = bl_d / (qty_d - qty_k);
                } else {
                  bl_k += el.trx_qty * hpp;
                }

                trn.push({
                  type: "item",
                  value: {
                    trx_code: el.trx_code,
                    trx_date: formatDate(el.trx_date),
                    in_qty: el.trx_dbcr === "d" ? formatTh(el.trx_qty) : 0,
                    in_cost:
                      el.trx_dbcr === "d"
                        ? el.trx_hpok && el.trx_qty
                          ? `${formatIdr(el.trx_hpok / el.trx_qty)}`
                          : 0
                        : 0,
                    in_amnt:
                      el.trx_dbcr === "d"
                        ? el.trx_hpok
                          ? `${formatIdr(el.trx_hpok)}`
                          : 0
                        : 0,
                    out_qty: el.trx_dbcr === "k" ? formatTh(el.trx_qty) : 0,
                    out_cost:
                      el.trx_dbcr === "k" && el.trx_type === "PJ"
                        ? el.trx_sprice
                          ? `${formatIdr(el.trx_sprice)}`
                          : 0
                        : el.trx_dbcr === "k" && el.trx_hpok
                        ? `${formatIdr(el.trx_hpok / el.trx_qty)}`
                        : 0,
                    out_amnt:
                      el.trx_dbcr === "k" && el.trx_hpok
                        ? `${formatIdr(el.trx_hpok)}`
                        : 0,
                    b_qty: formatTh(qty_d - qty_k),
                    b_cost: hpp > 0 ? `${formatIdr(hpp)}` : 0,
                    b_amnt: `${formatIdr(bl_d - bl_k)}`,
                    trx_type: el.trx_type,
                    sts: sts_b,
                  },
                });
              }
            }
          }
        });

        data.push({
          header: [
            {
              prod:
                (selectedProduct === v) === null
                  ? "-"
                  : `${v?.inv_code?.code} (${v?.inv_code?.name})`,
              // nom: v === null ? "-" : qty,
              // sld: v === null ? "-" : formatIdr(hpp_awal),
            },
          ],

          trn: trn,
        });
      });
    } else if (selectedGrup?.length) {
      selectedGrup?.forEach((grp) => {
        let grouped_product = invDdb?.filter(
          (el, i) =>
            i ===
            invDdb?.findIndex(
              (ek) =>
                el?.inv_code?.id === ek?.inv_code?.id &&
                grp.groupPro.id === ek.inv_code?.group
            )
        );

        // console.log(grouped_product);
        grouped_product.forEach((v) => {
          let trn = [
            {
              type: "header",
              value: {
                trx_code: "Kode Trans",
                trx_date: tr[localStorage.getItem("language")].tgl,
                // trx_type: tr[localStorage.getItem("language")].jns_tran,
                in_qty: "Qty",
                in_cost: "Cost",
                in_amnt: "Amount",
                out_qty: "Qty",
                out_cost: "Cost",
                out_amnt: "Amount",
                b_qty: "Qty",
                b_cost: "Cost",
                b_amnt: "amount",
              },
            },
          ];

          let sa = 0;
          let st = 0;
          let qty_awal = 0;

          let qty_k = 0;
          let qty_d = 0;
          let bl_k = 0;
          let bl_d = 0;
          let hpp = 0;
          let hpp_awal = 0;
          let qty = 0;
          // let lok =0;
          let produkk = 0;
          let sts_b = false;

          invDdb?.forEach((ek) => {
            if (ek.inv_year === filtDate?.getFullYear()) {
              if (ek.inv_month === Math.max(...month)) {
                if (
                  v?.inv_code?.id === ek.inv_code.id &&
                  grp.groupPro?.id === ek.inv_code.group
                ) {
                  if (ek.qty_awal > 0 && ek.hpp > 0) {
                    sa += ek.inv_awal;
                    qty_awal += ek.qty_awal;

                    trn.push({
                      type: "item",
                      value: {
                        trx_code: tr[localStorage.getItem("language")]["ttl_uangmuka"],
                        trx_date: "",
                        in_qty: "",
                        in_cost: "",
                        in_amnt: "",
                        out_qty: "",
                        out_cost: "",
                        out_amnt: "",
                        b_qty: formatTh(ek?.qty_awal) ?? 0,
                        b_cost: ek.hpp ? `${formatIdr(ek.hpp)}` : 0,
                        b_amnt: ek.inv_awal ? `${formatIdr(ek.inv_awal)}` : 0,
                      },
                    });

                    bl_d += ek.inv_awal;
                    qty_d += ek.qty_awal;
                    hpp = ek.hpp;
                    hpp_awal = ek.inv_awal;
                    qty = ek.qty_awal;
                    // produkk =
                    // lok= loc_code?.name;
                  }
                }
              }
            }
          });

          stCard?.forEach((el) => {
            batch?.forEach((element) => {
              if (el.trx_code === element.bcode) {
                sts_b = element.pb;
              }
            });

            if (
              v?.inv_code?.id === el?.prod_id?.id &&
              grp.groupPro?.id === el.prod_id?.group
            ) {
              let dt = new Date(`${el?.trx_date}Z`);
              if (dt.getFullYear() === filtDate?.getFullYear()) {
                if (dt.getMonth() + 1 === Math.max(...month)) {
                  if (el.trx_dbcr === "d") {
                    qty_d += el.trx_qty;
                    bl_d += el.trx_hpok;
                  } else {
                    qty_k += el.trx_qty;
                  }

                  if (el.trx_dbcr === "d") {
                    hpp = bl_d / (qty_d - qty_k);
                  } else {
                    bl_k += el.trx_qty * hpp;
                  }

                  trn.push({
                    type: "item",
                    value: {
                      trx_code: el.trx_code,
                      trx_date: formatDate(el.trx_date),
                      in_qty: el.trx_dbcr === "d" ? formatTh(el.trx_qty) : 0,
                      in_cost:
                        el.trx_dbcr === "d"
                          ? el.trx_hpok && el.trx_qty
                            ? `${formatIdr(el.trx_hpok / el.trx_qty)}`
                            : 0
                          : 0,
                      in_amnt:
                        el.trx_dbcr === "d"
                          ? el.trx_hpok
                            ? `${formatIdr(el.trx_hpok)}`
                            : 0
                          : 0,
                      out_qty: el.trx_dbcr === "k" ? formatTh(el.trx_qty) : 0,
                      out_cost:
                        el.trx_dbcr === "k" && el.trx_type === "PJ"
                          ? el.trx_sprice
                            ? `${formatIdr(el.trx_sprice)}`
                            : 0
                          : el.trx_dbcr === "k" && el.trx_hpok
                          ? `${formatIdr(el.trx_hpok / el.trx_qty)}`
                          : 0,
                      out_amnt:
                        el.trx_dbcr === "k" && el.trx_hpok
                          ? `${formatIdr(el.trx_hpok)}`
                          : 0,
                      b_qty: formatTh(qty_d - qty_k),
                      b_cost: hpp > 0 ? `${formatIdr(hpp)}` : 0,
                      b_amnt: `${formatIdr(bl_d - bl_k)}`,
                      trx_type: el.trx_type,
                      sts: sts_b,
                    },
                  });
                }
              }
            }
          });

          data.push({
            header: [
              {
                prod:
                  (selectedProduct === v) === null
                    ? "-"
                    : `${v?.inv_code?.code} (${v?.inv_code?.name})`,
                // nom: v === null ? "-" : qty,
                // sld: v === null ? "-" : formatIdr(hpp_awal),
              },
            ],

            trn: trn,
          });
        });
      });
    }
    let item = [];
    let posting = [];
    let final = [
      {
        columns: [
          {
            title: "Inventory Balance Card Report",
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
            title: `Per ${formatDt(filtDate)}`,
            width: { wch: 30 },
            style: {
              font: { sz: "14", bold: false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
        ],
        data: [
          [
            {
              value: `Lokasi  :  ${selectedLoc?.loc_code?.name}`,
              style: {
                font: { sz: "14", bold: false },
                alignment: { horizontal: "left", vertical: "center" },
              },
            },
          ],
        ],
      },
    ];

    data?.forEach((ep) => {});
    final.push({
      columns: [
        {
          title: "",
          width: { wch: 40 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              // fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          title: "",
          width: { wch: 15 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "center", vertical: "center" },
            fill: {
              paternType: "solid",
              // fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          title: "",
          width: { wch: 20 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "right", vertical: "center" },
            fill: {
              paternType: "solid",
              // fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          title: "",
          width: { wch: 20 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "right", vertical: "center" },
            fill: {
              paternType: "solid",
              // fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          title: "",
          width: { wch: 20 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "right", vertical: "center" },
            fill: {
              paternType: "solid",
              // fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          title: "",
          width: { wch: 20 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "right", vertical: "center" },
            fill: {
              paternType: "solid",
              // fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          title: "",
          width: { wch: 20 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "right", vertical: "center" },
            fill: {
              paternType: "solid",
              // fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          title: "",
          width: { wch: 20 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "right", vertical: "center" },
            fill: {
              paternType: "solid",
              // fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          title: "",
          width: { wch: 20 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "right", vertical: "center" },
            fill: {
              paternType: "solid",
              // fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          title: "",
          width: { wch: 20 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "center", vertical: "center" },
            fill: {
              paternType: "solid",
              // fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          title: "",
          width: { wch: 20 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "center", vertical: "center" },
            fill: {
              paternType: "solid",
              // fgColor: { rgb: "F3F3F3" },
            },
          },
        },
      ],
      data: item,
    });
    data?.forEach((ep) => {
      item?.push([
        {
          value: ep?.header[0]?.prod,
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
              bold: ep.type === "header" || ep.type === "footer" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: "",
          style: {
            font: {
              sz: "14",
              bold: ep.type === "header" || ep.type === "footer" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: "",
          style: {
            font: {
              sz: "14",
              bold: ep.type === "footer" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: "",
          style: {
            font: {
              sz: "14",
              bold: ep.type === "header" || ep.type === "footer" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: "",
          style: {
            font: {
              sz: "14",
              bold: ep.type === "header" || ep.type === "footer" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: "",
          style: {
            font: {
              sz: "14",
              bold: ep.type === "header" || ep.type === "footer" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
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
          value: "IN",
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "center", vertical: "center" },
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
          value: "OUT",
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "center", vertical: "center" },
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
          value: "BALANCE",
          style: {
            height: { wch: 18 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "center", vertical: "center" },
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

      ep?.trn?.forEach((ek) => {
        item.push([
          {
            value: ek?.value.trx_code,
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
            value: ek?.value.in_qty,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "center", vertical: "center" },
            },
          },
          {
            value: ek?.value.in_cost,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "center", vertical: "center" },
            },
          },
          {
            value: ek?.value.in_amnt,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "center", vertical: "center" },
            },
          },
          {
            value: ek?.value.out_qty,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "center", vertical: "center" },
            },
          },
          {
            value: ek?.value.out_cost,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "center", vertical: "center" },
            },
          },
          {
            value: ek?.value.out_amnt,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "center", vertical: "center" },
            },
          },
          {
            value: ek?.value.b_qty,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "center", vertical: "center" },
            },
          },
          {
            value: ek?.value.b_cost,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "center", vertical: "center" },
            },
          },
          {
            value: ek?.value.b_amnt,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "center", vertical: "center" },
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
    });

    if (excel) {
      return final;
    } else {
      let page = [];
      data?.forEach((element) => {
        element?.header?.forEach((el) => {
          element?.trn.forEach((elem) => {
            page.push({ ...elem, head: el });
          });
        });
      });
      console.log("pageee");
      console.log(page);
      return page;
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-10 ml-0 mr-0 pl-0">
          <Row className="m-0">
            <div className="col-3 mr-3 p-0 mt-2">
              <div className="p-inputgroup">
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
                  readOnlyInput
                  dateFormat="MM yy"
                  maxDate={new Date(new Date().getFullYear(), maxDate - 1, 1)}
                />
              </div>
            </div>
            <div className="mt-2">
              <Dropdown
                value={selectedLoc ?? null}
                options={location}
                onChange={(e) => {
                  let groupedOption = invDdb?.filter(
                    (el) => e?.value?.loc_code?.id === el?.loc_code?.id
                  );

                  let grouped = groupedOption?.filter(
                    (el, i) =>
                      i ===
                      groupedOption.findIndex(
                        (ek) => el?.inv_code?.id === ek?.inv_code?.id
                      )
                  );

                  // setProductOption(grouped);
                  setSelectedLoc(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_lokasi}
                optionLabel="loc_code.name"
                showClear
              />
            </div>

            <div className="p-inputgroup col-2">
              <MultiSelect
                value={selectedGrup ?? null}
                options={grupProd}
                onChange={(e) => {
                  setSelectedGrup(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_g_prod}
                optionLabel="groupPro.name"
                showClear
                filterBy="groupPro.name"
                filter
                display="chip"
                // className="w-full md:w-16rem"
                maxSelectedLabels={3}
              />
            </div>

            <div className="p-inputgroup col-3 mt-0">
              <MultiSelect
                value={selectedProduct ?? null}
                options={product}
                onChange={(e) => {
                  setSelected(e.value);
                  console.log("grouped_product", e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_prod}
                optionLabel="inv_code.name"
                showClear
                filterBy="inv_code.name"
                filter
                // className="w-full md:w-20rem"
                display="chip"
                maxSelectedLabels={3}
              />
            </div>
          </Row>
        </div>
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            {/* <ExcelExportHelper
              json={stCard ? jsonForExcel(stCard, true) : null}
              filename={`Inventory_Balance_Card_report_export_${new Date().getTime()}`}
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

  const formatDt = (date) => {
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

  const formatTh = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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
        {chunk(jsonForExcel(stCard) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0">
                <CustomeWrapper
                  viewOnly
                  horizontal
                  tittle={"Inventory Balance Card"}
                  subTittle={`Inventory Balance Card Report per ${formatDt(
                    filtDate
                  )}`}
                  subTittle2={
                    <div className="font-weight-bold">
                      {" "}
                      Lokasi : {selectedLoc
                        ? selectedLoc?.loc_code?.name
                        : "-"}{" "}
                    </div>
                  }
                  onComplete={(cp) => setCp(cp)}
                  page={idx + 1}
                  body={
                    <>
                      {val?.map((v) => {
                        if (v?.type == "header") {
                          return (
                            <>
                              <div className="font-weight-bold text-left mt-4 mb-2">
                                {v.head?.prod}
                              </div>

                              <div className="header-report single row m-0">
                                <div className="col-3 text-center">
                                  {tr[localStorage.getItem("language")].det_tran}
                                </div>
                                <div className="col-3 text-center">{"IN"}</div>
                                <div className="col-3 text-center">{"OUT"}</div>
                                <div className="col-3 text-center">
                                  {"BALANCE"}
                                </div>
                              </div>

                              <div className="header-report row m-0">
                                <div className="col-1">{v.value.trx_code}</div>
                                <div className="col-1">{v.value.trx_date}</div>
                                <div className="col-1 text-right">
                                  {v.value.in_qty}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.in_cost}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.in_amnt}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.out_qty}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.out_cost}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.out_amnt}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.b_qty}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.b_cost}
                                </div>
                                <div className="col-2 text-right">
                                  {v.value.b_amnt}
                                </div>
                              </div>
                            </>
                          );
                        } else if (v.type === "item") {
                          return (
                            <>
                              <div className="item-report row m-0">
                                {(v?.value.trx_type === "PJ" ||
                                  v?.value.trx_type === "PR") &&
                                v.value.sts == true ? (
                                  <Link
                                    to={`/laporan/produksi/pembebanan-detail/${btoa(
                                      `m'${filtDate.getMonth() + 1}`
                                    )}/${btoa(
                                      `y'${filtDate.getFullYear()}`
                                    )}/${btoa(
                                      btoa(
                                        JSON.stringify({
                                          trx: v.value?.trx_code,
                                        })
                                      )
                                    )}`}
                                  >
                                    <div className="col-1">
                                      {v.value.trx_code}
                                      <Badge variant="info light ml-3">
                                        <i className="bx bx-plus text-info mr-1 mt-1"></i>
                                        Pembebanan
                                      </Badge>
                                    </div>
                                  </Link>
                                ) : (
                                  <div className="col-1">
                                    {v.value.trx_code}
                                  </div>
                                )}
                                <div className="col-1">{v.value.trx_date}</div>
                                <div className="col-1 text-right">
                                  {v.value.in_qty}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.in_cost}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.in_amnt}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.out_qty}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.out_cost}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.out_amnt}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.b_qty}
                                </div>
                                <div className="col-1 text-right">
                                  {v.value.b_cost}
                                </div>
                                <div className="col-2 text-right">
                                  {v.value.b_amnt}
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
        <Card>
          <Card.Body className="p-0" ref={printPage}>
            {chunk(jsonForExcel(stCard) ?? [], chunkSize)?.map((val, idx) => {
              return (
                <Card className="ml-1 mr-1 mt-2">
                  <Card.Body className="p-0">
                    <CustomeWrapper
                      horizontal
                      tittle={"Inventory Balance Card"}
                      subTittle={`Inventory Balance Card Report per ${formatDt(
                        filtDate
                      )}`}
                      subTittle2={
                        <div className="font-weight-bold">
                          {" "}
                          Lokasi :{" "}
                          {selectedLoc ? selectedLoc?.loc_code?.name : "-"}{" "}
                        </div>
                      }
                      onComplete={(cp) => setCp(cp)}
                      page={idx + 1}
                      body={
                        <>
                          {val?.map((v) => {
                            if (v?.type == "header") {
                              return (
                                <>
                                  <div className="font-weight-bold text-left mt-4 mb-2">
                                    {v.head?.prod}
                                  </div>

                                  <div className="header-report single row m-0">
                                    <div className="col-3 text-center">
                                      {tr[localStorage.getItem("language")].det_tran}
                                    </div>
                                    <div className="col-3 text-center">
                                      {"IN"}
                                    </div>
                                    <div className="col-3 text-center">
                                      {"OUT"}
                                    </div>
                                    <div className="col-3 text-center">
                                      {"BALANCE"}
                                    </div>
                                  </div>

                                  <div className="header-report row m-0">
                                    <div className="col-1">
                                      {v.value.trx_code}
                                    </div>
                                    <div className="col-1">
                                      {v.value.trx_date}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.in_qty}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.in_cost}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.in_amnt}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.out_qty}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.out_cost}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.out_amnt}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.b_qty}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.b_cost}
                                    </div>
                                    <div className="col-2 text-right">
                                      {v.value.b_amnt}
                                    </div>
                                  </div>
                                </>
                              );
                            } else if (v.type === "item") {
                              return (
                                <>
                                  <div className="item-report row m-0">
                                    <div className="col-1">
                                      {v.value.trx_code}
                                    </div>
                                    <div className="col-1">
                                      {v.value.trx_date}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.in_qty}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.in_cost}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.in_amnt}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.out_qty}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.out_cost}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.out_amnt}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.b_qty}
                                    </div>
                                    <div className="col-1 text-right">
                                      {v.value.b_cost}
                                    </div>
                                    <div className="col-2 text-right">
                                      {v.value.b_amnt}
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

export default KartuStockHPP;
