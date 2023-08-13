import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { request } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { SET_CURRENT_ODR, SET_PRODUCT } from "src/redux/actions";
import DataSupplier from "src/jsx/screen/Mitra/Pemasok/DataPemasok";
import DataRulesPay from "src/jsx/screen/MasterLainnya/RulesPay/DataRulesPay";
import DataProduk from "src/jsx/screen/Master/Produk/DataProduk";
import DataJasa from "src/jsx/screen/Master/Jasa/DataJasa";
import DataSatuan from "src/jsx/screen/MasterLainnya/Satuan/DataSatuan";
import { SelectButton } from "primereact/selectbutton";

import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import PesananPO from "../PO/PesananPembelian";
import DataLokasi from "src/jsx/screen/Master/Lokasi/DataLokasi";
import DataPusatBiaya from "src/jsx/screen/MasterLainnya/PusatBiaya/DataPusatBiaya";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import endpoints from "../../../../../utils/endpoints";
import { tr } from "../../../../../data/tr";
import { InputTextarea } from "primereact/inputtextarea";
import DataProject from "src/jsx/screen/MasterLainnya/Project/DataProject";

const defError = {
  code: false,
  date: false,
  // noDoc: false,
  // docDate: false,
  sup: false,
  // rul: false,
  prod: [
    {
      id: false,
      lok: false,
      jum: false,
      prc: false,
    },
  ],
  jasa: [
    {
      id: false,
      jum: false,
    },
  ],
};

const InputOrder = ({ onCancel, onSuccess }) => {
  const order = useSelector((state) => state.order.current);
  const [dept, setDept] = useState(null);
  const [project, setProj] = useState(null);
  const [po, setPO] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [supplier, setSupplier] = useState(null);
  const [rulesPay, setRulesPay] = useState(null);
  const [pajak, setPajak] = useState(null);
  const product = useSelector((state) => state.product.list);
  const [jasa, setJasa] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [currency, setCur] = useState(null);
  const [setup, setSetup] = useState(null);
  const [grupP, setGrupP] = useState(null);
  const [apCard, setApCard] = useState(null);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showRulesPay, setShowRulesPay] = useState(false);
  const [showDept, setShowDept] = useState(false);
  const [showProj, setShowProj] = useState(false);
  const [showProduk, setShowProduk] = useState(false);
  const [showJasa, setShowJasa] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [showLok, setShowLok] = useState(false);
  const isEdit = useSelector((state) => state.order.editOdr);
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const [isRp, setRp] = useState(true);
  const [isRpJasa, setRpJasa] = useState(true);
  const [error, setError] = useState(defError);
  const dispatch = useDispatch();
  const [accor, setAccor] = useState({
    produk: true,
    jasa: false,
  });

  const invoice = [
    { name: "Invoice", sts: true },
    { name: "Non Invoice", sts: false },
  ];

  const faktur = [
    { name: "Faktur", sts: true },
    { name: "Non Faktur", sts: false },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getSupplier();
    getRulesPay();
    getDept();
    getProj();
    getProduct(order.ns);
    getJasa();
    getSatuan();
    getPjk();
    getPO();
    getLoc();
    getCur();
    getSetup();
    getApCard();
  }, []);

  const editODR = async () => {
    const config = {
      ...endpoints.editODR,
      endpoint: endpoints.editODR.endpoint + order.id,
      // data: { ...order, doc_date: currentDate(order.doc_date) },
      data: { ...order, po_id: order?.po_id?.id ?? null },
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        onSuccess();
      }
    } catch (error) {
      setTimeout(() => {
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
          life: 3000,
        });
      }, 500);
    }
  };

  const addODR = async () => {
    const config = {
      ...endpoints.addODR,
      data: order,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: `Kode ${order.ord_code} Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Gagal Memperbarui Data",
            life: 3000,
          });
        }, 500);
      }
    }
  };

  const getPO = async () => {
    const config = {
      ...endpoints.po,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((elem) => {
          if (isEdit) {
            let prod = [];
            elem.pprod.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
              prod.push({
                ...el,
                r_remain: el.remain,
              });

              let temp = [...order.dprod];
              order.dprod.forEach((e, i) => {
                if (el.id === e.pprod_id) {
                  temp[i].req = el.order;
                  temp[i].r_remain = el.remain + e.order;
                  temp[i].remain = el.remain;
                  updateORD({ ...order, dprod: temp });
                }
              });
            });
            elem.pprod = prod;

            let jasa = [];
            elem.pjasa.forEach((element) => {
              element.jasa_id = element.jasa_id.id;
              element.unit_id = element.unit_id.id ?? null;
              jasa.push({
                ...element,
                r_order: element.order,
              });

              let temp = [...order.djasa];
              order.djasa.forEach((e, i) => {
                if (element.id == e.pjasa_id) {
                  temp[i].order = element.order;
                  updateORD({ ...order, djasa: temp });
                }
              });
            });
            elem.pjasa = jasa;
            filt.push(elem);
          } else {
            if (elem.status !== 2) {
              let prod = [];
              elem.pprod.forEach((el) => {
                if (el.remain > 0) {
                  el.prod_id = el.prod_id.id;
                  el.unit_id = el.unit_id.id;
                  prod.push({
                    ...el,
                    r_remain: el.remain,
                    req: el.order,
                    // order: 0,
                    // price: 0,
                    // disc: 0,
                    // nett_price: 0,
                    // total: 0,
                  });
                }
              });
              elem.pprod = prod;
              let jasa = [];
              elem.pjasa.forEach((element) => {
                // if (element.remain > 0) {
                element.jasa_id = element.jasa_id.id;
                element.unit_id = element.unit_id.id ?? null;
                jasa.push({
                  ...element,
                  r_order: element.order,
                });
                // }
              });
              elem.pjasa = jasa;
              filt.push(elem);
            }
          }
        });
        setPO(filt);
      }
    } catch (error) {}
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
      }
    } catch (error) {}
  };

  const getRulesPay = async () => {
    const config = {
      ...endpoints.rules_pay,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        setRulesPay(data);
      }
    } catch (error) {}
  };

  const getDept = async () => {
    const config = {
      ...endpoints.pusatBiaya,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setDept(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProj = async () => {
    const config = {
      ...endpoints.project,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setProj(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProduct = async (ns) => {
    const config = {
      ...endpoints.product,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        // let filt = [];
        // data.forEach((element) => {
        //   if (element.group.stok === true) {
        //     filt.push(element);
        //   }
        // });

        dispatch({
          type: SET_PRODUCT,
          payload: data.filter((v) =>
            v?.group?.stock ? v?.group?.stok === !ns : true
          ),
        });

        getGrupP();
      }
    } catch (error) {}
  };

  const getGrupP = async () => {
    const config = {
      ...endpoints.groupPro,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setGrupP(data);
      }
    } catch (error) {}
  };

  const getJasa = async () => {
    const config = {
      ...endpoints.jasa,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setJasa(data);
      }
    } catch (error) {}
  };

  const getSatuan = async () => {
    const config = {
      ...endpoints.getSatuan,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSatuan(data);
      }
    } catch (error) {}
  };

  const getPjk = async () => {
    const config = {
      ...endpoints.pajak,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setPajak(data);
      }
    } catch (error) {}
  };

  const getCur = async () => {
    const config = {
      ...endpoints.currency,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCur(data);
      }
    } catch (error) {}
  };

  const getLoc = async () => {
    const config = {
      ...endpoints.lokasi,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setLokasi(data);
      }
    } catch (error) {}
  };

  const getSetup = async () => {
    const config = {
      ...endpoints.getCompany,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSetup(data);
      }
    } catch (error) {}
  };

  const getApCard = async () => {
    const config = {
      ...endpoints.apcard,
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        // let filt = [];
        // data?.forEach((element) => {
        //   if (element.trx_type == "DP") {
        //     filt.push(element);
        //   }
        // });
        setApCard(data);
      }
    } catch (error) {}
  };

  const checkUnit = (value) => {
    let selected = {};
    satuan?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkProd = (value) => {
    let selected = {};
    product?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkJasa = (value) => {
    let selected = {};
    jasa?.forEach((element) => {
      if (value === element.jasa.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkSupp = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element.supplier.id) {
        selected = element;
      }
    });
    return selected;
  };

  const checkPO = (value) => {
    let selected = {};
    po?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkDept = (value) => {
    let selected = {};
    dept?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkProj = (value) => {
    let selected = {};
    project?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkpjk = (value) => {
    let selected = {};
    pajak?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkCur = (value) => {
    let selected = {};
    currency?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkLoc = (value) => {
    let selected = {};
    lokasi?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checRulPay = (value) => {
    let selected = {};
    rulesPay?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editODR();
      } else {
        setUpdate(true);
        addODR();
      }
    }
  };

  const updateORD = (e) => {
    dispatch({
      type: SET_CURRENT_ODR,
      payload: e,
    });
  };

  const getSubTotalBarang = () => {
    let total = 0;
    order?.dprod?.forEach((el) => {
      // if (checkSupp(order.sup_id)?.supplier?.sup_curren !== null) {
      //   if (el.nett_price && el.nett_price > 0) {
      //     total += parseInt(el.nett_price);
      //   } else {
      //     total += el.total_fc - (el.total_fc * el.disc) / 100;
      //   }
      // } else {
      if (el.nett_price && el.nett_price > 0) {
        total += parseInt(el.nett_price);
      } else {
        total += el.total - (el.total * el.disc) / 100;
      }
      // }
    });

    return total;
  };

  const getSubTotalJasa = () => {
    let total = 0;
    order?.djasa?.forEach((el) => {
      // if (
      //   checkSupp(order.sup_id)?.supplier?.sup_curren !== null ||
      //   checkSupp(el.sup_id)?.supplier?.sup_curren
      // ) {
      //   total += el.total_fc - (el.total_fc * el.disc) / 100;
      // } else {
      total += el.total - (el.total * el.disc) / 100;
      // }
    });

    return total;
  };

  const getUangMuka = () => {
    let dp = 0;

    apCard?.forEach((element) => {
      if (order?.po_id === element.po_id?.id && element.trx_type === "DP") {
        dp += element.trx_amnh;
      }
      console.log("======apcard");
      console.log(element.trx_amnh);
    });

    return dp;
  };

  const ppn = () => {
    let nil = 0;
    pajak?.forEach((elem) => {
      if (checkSupp(order.sup_id)?.supplier?.sup_ppn === elem.id) {
        nil = elem.nilai;
      }
    });

    return nil;
  };

  const curConv = () => {
    let cur = 0;
    currency?.forEach((elem) => {
      if (checkSupp(order.sup_id)?.supplier?.sup_curren === elem.id) {
        cur = elem.rate;
      }
    });

    return cur;
  };

  const formatIdr = (value) => {
    return `${value.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const currentDate = (date) => {
    let now = new Date();
    let newDate = new Date(
      date?.getFullYear(),
      date?.getMonth(),
      date?.getDate(),
      now?.getHours(),
      now?.getMinutes(),
      now?.getSeconds(),
      now?.getMilliseconds()
    );
    return newDate.toISOString();
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !order.ord_code || order.ord_code === "",
      date: !order.ord_date || order.ord_date === "",
      // noDoc: !order.no_doc || order.no_doc === "",
      // docDate: !order.doc_date || order.doc_date === "",
      sup: !order.sup_id,
      // rul: !order.top,
      prod: [],
      jasa: [],
    };

    let acc_prd = null;
    let acc_gprd = null;
    order?.dprod.forEach((element, i) => {
      if (i > 0) {
        if (
          element.prod_id ||
          element.location ||
          element.order ||
          element.price
        ) {
          errors.prod.splice(i, 1, {
            id: !element.prod_id,
            lok: element.location === null,
            jum:
              !element.order || element.order === "" || element.order === "0",
            prc:
              !element.price || element.price === "" || element.price === "0",
          });
        }
      } else {
        console.log("LOCATION=====", element.location === null);
        errors.prod.splice(i, 1, {
          id: !element.prod_id,
          lok: element.location === null,
          jum: !element.order || element.order === "" || element.order === "0",
          prc: !element.price || element.price === "" || element.price === "0",
        });
        console.log("Errors=====", errors.prod);
      }

      grupP?.forEach((el) => {
        if (checkProd(element?.prod_id)?.group?.id === el?.groupPro?.id) {
          if (el.groupPro?.stok) {
            if (el.groupPro.wip) {
              acc_prd = el.groupPro.acc_wip;
            } else {
              acc_prd = el.groupPro.acc_sto;
            }
          } else {
            acc_prd = el.groupPro?.biaya;
          }
        }
      });
    });

    console.log("Error=====", errors);

    order?.djasa.forEach((element, i) => {
      if (i > 0) {
        if (element.jasa_id || element.order || element.price) {
          errors.jasa[i] = {
            id: !element.jasa_id,
            jum:
              !element.order || element.order === "" || element.order === "0",
            prc:
              !element.price || element.price === "" || element.price === "0",
          };
        }
      } else {
        errors.jasa[i] = {
          id: !element.jasa_id,
          jum: !element.order || element.order === "" || element.order === "0",
          prc: !element.price || element.price === "" || element.price === "0",
        };
      }
    });

    if (
      order.dprod[0]?.prod_id !== null &&
      !errors.prod[0]?.id &&
      !errors.prod[0]?.lok &&
      !errors.prod[0]?.jum &&
      !errors.prod[0]?.prc
    ) {
      errors.jasa?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    if (errors.jasa.length > 0) {
      if (
        order.djasa[0]?.jasa_id !== null &&
        !errors.jasa[0]?.id &&
        !errors.jasa[0]?.jum &&
        !errors.jasa[0]?.prc
      ) {
        errors.prod?.forEach((e) => {
          for (var key in e) {
            e[key] = false;
          }
        });
      }
    }

    let validProduct = 0;
    let validJasa = false;
    errors.prod?.forEach((el) => {
      let totalKey = 0;
      let validKey = 0;
      for (var k in el) {
        totalKey++;
        validKey += !el[k] ? 1 : 0;
      }
      if (totalKey == validKey) {
        validProduct += 1;
      }
    });
    if (!validProduct) {
      errors.jasa.forEach((el) => {
        for (var k in el) {
          validJasa = !el[k];
        }
      });
    }

    let acc_ap = checkSupp(order?.sup_id)?.supplier?.sup_hutang !== null;

    if (!acc_ap) {
      toast.current.show({
        severity: "error",
        summary: "Tidak Dapat Menyimpan Data",
        detail: `Akun Distribusi Gl Supplier Belum Diisi`,
        life: 6000,
      });
    }

    if (acc_prd === null) {
      toast.current.show({
        severity: "error",
        summary: "Tidak Dapat Menyimpan Data",
        detail: `Akun Distribusi GL Produk Belum Diisi`,
        life: 6000,
      });

      //   errors?.prod.forEach((element, i) => {
      //     if (order.prod[i]?.acc_prd === null) {
      //       element.id = true;
      //     }
      // console.log("=============");
      // console.log(order.prod[i].prod_id);
      //   });
    }

    let acc_err = acc_prd !== null;

    valid =
      !errors.code &&
      !errors.date &&
      !errors.sup &&
      acc_ap &&
      // !errors.rul &&
      (validProduct === order.dprod.length || validJasa) &&
      acc_err;

    setError(errors);
    console.log("======err=======");
    console.log(validProduct);

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });
    }

    return valid;
  };

  const body = () => {
    let date = new Date(setup?.year_co, setup?.cutoff - 1, 31);
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-3">
            <PrimeInput
              label={tr[localStorage.getItem("language")].kd_pur}
              value={order.ord_code}
              onChange={(e) => {
                updateORD({ ...order, ord_code: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].masuk}
              error={error?.code}
            />
          </div>

          <div className="col-2">
            <PrimeCalendar
              label={tr[localStorage.getItem("language")].tgl}
              value={new Date(`${order.ord_date}Z`)}
              onChange={(e) => {
                let result = null;
                if (order.top) {
                  result = new Date(e.value);
                  result.setDate(
                    result.getDate() + checRulPay(order?.top)?.day
                  );
                  console.log(result);
                }
                updateORD({ ...order, ord_date: e.value, due_date: result });

                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].pilih_tgl}
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.date}
              minDate={date}
            />
          </div>

          <div className="col-3">
            <PrimeInput
              label={tr[localStorage.getItem("language")].no_doc}
              value={order.no_doc}
              onChange={(e) => {
                updateORD({ ...order, no_doc: e.target.value });
                // let newError = error;
                // newError.noDoc = false;
                // setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].masuk}
              // error={error?.noDoc}
            />
          </div>

          <div className="col-2">
            <PrimeCalendar
              label={tr[localStorage.getItem("language")].tgl_doc}
              value={new Date(`${order.doc_date}Z`)}
              onChange={(e) => {
                updateORD({ ...order, doc_date: e.value });
                // let newError = error;
                // newError.docDate = false;
                // setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].pilih_tgl}
              showIcon
              dateFormat="dd-mm-yy"
              // error={error?.docDate}
              // minDate={date}
            />
          </div>

          <div className="col-12 mt-3">
            <span className="fs-14">
              <b>{tr[localStorage.getItem("language")].ord_pur}</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].kd_ord}
            </label>
            <div className="p-inputgroup"></div>

            {isEdit ? (
              <PrimeInput
                value={order?.po_id?.po_code}
                placeholder={tr[localStorage.getItem("language")].kd_ord}
                disabled
              />
            ) : (
              <PrimeDropdown
                value={order.po_id !== null && checkPO(order.po_id)}
                options={po}
                onChange={(e) => {
                  let uang_muka = 0;
                  let result = new Date(`${order.ord_date}Z`);
                  result.setDate(
                    result.getDate() + checRulPay(e.value?.top?.id)?.day
                  );

                  updateORD({
                    ...order,
                    po_id: e.value?.id ?? null,
                    ns: e.value?.ns ?? false,
                    top: e.value?.top?.id ?? null,
                    due_date: result ?? null,
                    sup_id: e.value?.sup_id?.id ?? null,
                    dep_id: e.value?.preq_id?.req_dep?.id ?? null,
                    split_inv: e.value?.split_inv ?? false,
                    same_sup: e.value?.same_sup ?? false,
                    note: e.value?.note ?? null,
                    dprod: e.value?.id
                      ? e.value?.pprod.map((v) => {
                          let newError = error;
                          newError.prod = [];
                          newError.prod.push({
                            id: false,
                            lok: false,
                            jum: false,
                            prc: false,
                          });
                          setError(newError);
                          return {
                            ...v,
                            req: v.order,
                            order: null,
                            // remain: v?.order - v?.order,
                            total: 0,
                            total_fc: 0,
                            location: null,
                          };
                        })
                      : [
                          {
                            prod_id: null,
                            unit_id: null,
                            request: null,
                            order: null,
                            remain: null,
                            price: null,
                            disc: null,
                            nett_price: null,
                            total_fc: 0,
                            total: null,
                            location: null,
                          },
                        ],
                    djasa: e.value?.id
                      ? e.value?.pjasa.map((v) => {
                          return {
                            ...v,
                            total_fc:
                              checkSupp(v.sup_id)?.supplier?.sup_curren !== 0
                                ? v.order * v.price
                                : 0,
                          };
                        })
                      : [
                          {
                            jasa_id: null,
                            sup_id: null,
                            unit_id: null,
                            order: null,
                            price: null,
                            disc: null,
                            total_fc: null,
                            total: null,
                          },
                        ],
                  });
                  if (!e.value?.id) {
                    let newError = error;
                    newError.prod = [
                      {
                        id: false,
                        lok: false,
                        jum: false,
                        prc: false,
                      },
                    ];
                    setError(newError);
                  }
                  getProduct(e.value?.ns);
                  console.log(error);
                }}
                placeholder={tr[localStorage.getItem("language")].kd_ord}
                optionLabel="po_code"
                filter
                filterBy="po_code"
                showClear={order.po_id}
              />
            )}
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].dep}
            </label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={order.dep_id !== null ? checkDept(order.dep_id) : null}
              option={dept}
              onChange={(e) => {
                updateORD({ ...order, dep_id: e.id });
              }}
              placeholder={tr[localStorage.getItem("language")].dep}
              detail
              onDetail={() => setShowDept(true)}
              label={"[ccost_code] ([ccost_name])"}
              disabled={order && order.po_id !== null}
            />
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].proj}
            </label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={order.proj_id !== null ? checkProj(order.proj_id) : null}
              option={project}
              onChange={(e) => {
                updateORD({ ...order, proj_id: e.id });
              }}
              placeholder={tr[localStorage.getItem("language")].masuk}
              detail
              onDetail={() => setShowProj(true)}
              label={"[proj_code] ([proj_name])"}
            />
          </div>

          <div className="col-3 mt-0">
            {/* <span className="fs-14">
              <b>Informasi Supplier</b>
            </span> */}
            {/* <Divider className="mt-1"></Divider> */}
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].supplier}
            </label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={order.sup_id !== null ? checkSupp(order.sup_id) : null}
              option={supplier}
              onChange={(e) => {
                updateORD({
                  ...order,
                  sup_id: e.supplier.id,
                  dprod: order.dprod.map((v) => ({
                    ...v,
                    price: null,
                    total_fc: 0,
                    total: 0,
                  })),
                  djasa: order.djasa.map((v) => ({
                    ...v,
                    sup_id: order.same_sup === true ? e.supplier.id : v.sup_id,
                    price: null,
                    total_fc: 0,
                    total: 0,
                  })),
                });
                let newError = error;
                newError.sup = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].pilih}
              detail
              onDetail={() => setShowSupplier(true)}
              label={"[supplier.sup_name]"}
              disabled={order && order.po_id !== null}
              errorMessage="Supplier Belum Dipilih"
              error={error?.sup}
            />
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].alamat}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={
                  order.sup_id !== null &&
                  checkSupp(order.sup_id)?.supplier?.sup_address !== null
                    ? checkSupp(order.sup_id)?.supplier?.sup_address
                    : ""
                }
                placeholder={tr[localStorage.getItem("language")].alamat}
                disabled
              />
            </div>
          </div>

          <div className="col-2">
            <PrimeInput
              label={tr[localStorage.getItem("language")].telp}
              // isNumber
              value={
                order.sup_id !== null &&
                checkSupp(order.sup_id)?.supplier?.sup_telp1 !== null
                  ? checkSupp(order.sup_id)?.supplier?.sup_telp1
                  : ""
              }
              placeholder={tr[localStorage.getItem("language")].telp}
              disabled
            />
          </div>

          <div className="col-2">
            <label className="text-label">
              {tr[localStorage.getItem("language")].pajak}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={
                  order.sup_id !== null &&
                  checkSupp(order.sup_id)?.supplier?.sup_ppn !== null
                    ? checkpjk(checkSupp(order.sup_id)?.supplier?.sup_ppn).name
                    : ""
                }
                placeholder={tr[localStorage.getItem("language")].pajak}
                disabled
              />
            </div>
          </div>

          <div className="col-2">
            <label className="text-label">
              {tr[localStorage.getItem("language")].currency}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={
                  order.sup_id !== null
                    ? checkSupp(order.sup_id)?.supplier?.sup_curren !== null
                      ? checkCur(checkSupp(order.sup_id)?.supplier?.sup_curren)
                          .code
                      : "IDR"
                    : ""
                }
                placeholder={tr[localStorage.getItem("language")].currency}
                disabled
              />
            </div>
          </div>

          <div className="col-12 mt-3">
            <span className="fs-14">
              <b>{tr[localStorage.getItem("language")].bayar}</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div>

          <div className="col-2">
            <label className="text-label">
              {tr[localStorage.getItem("language")].syarat}
            </label>
            <div className="p-inputgroup mt-2"></div>
            <CustomDropdown
              value={order.top !== null ? checRulPay(order.top) : null}
              option={rulesPay}
              onChange={(e) => {
                let result = new Date(`${order.ord_date}Z`);
                result.setDate(result.getDate() + e.day);
                console.log(result);

                updateORD({ ...order, top: e.id, due_date: result });
                let newError = error;
                newError.rul = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].pilih}
              detail
              onDetail={() => setShowRulesPay(true)}
              label={"[name] ([day] Hari)"}
              errorMessage="Syarat Pembayaran Belum Dipilih"
              error={error?.rul}
              disabled={order && order.po_id !== null}
            />
          </div>

          <div className="col-2">
            <label className="text-label">
              {tr[localStorage.getItem("language")].due}
            </label>
            <div className="p-inputgroup mt-2">
              <Calendar
                value={new Date(`${order.due_date}Z`)}
                onChange={(e) => {}}
                placeholder={tr[localStorage.getItem("language")].due}
                disabled
                dateFormat="dd-mm-yy"
              />
            </div>
          </div>

          <div className="mt-4 ml-2" hidden>
            <label className="text-label"></label>
            <div className="p-inputgroup">
              <SelectButton
                value={
                  order.faktur !== null && order.faktur !== ""
                    ? order.faktur === true
                      ? { name: "Faktur", sts: true }
                      : { name: "Non Faktur", sts: false }
                    : null
                }
                options={faktur}
                onChange={(e) => {
                  console.log(e.value);
                  updateORD({
                    ...order,
                    faktur: e.value.sts,
                  });
                }}
                optionLabel="name"
              />
            </div>
          </div>

          {/* {!order?.faktur ? ( */}
          <div className="mt-4 ml-4">
            <label className="text-label"></label>
            <div className="p-inputgroup">
              <SelectButton
                value={
                  order.invoice !== null && order.invoice !== ""
                    ? order.invoice === true
                      ? { name: "Invoice", sts: true }
                      : { name: "Non Invoice", sts: false }
                    : null
                }
                options={invoice}
                onChange={(e) => {
                  console.log(e.value);
                  updateORD({
                    ...order,
                    invoice: e.value.sts,
                    faktur: e.value.sts === false ? false : true,
                  });
                }}
                optionLabel="name"
              />
            </div>
          </div>
          {/* ) : (
            <></>
          )} */}

          {/* {order?.po_id !== null ? (
            <>
              <div className="d-flex col-12 align-items-center mt-4">
                <label className="ml-0 mt-4">{"Non Stock"}</label>
                <InputSwitch
                  className="ml-4 mt-4"
                  checked={order && order.ns}
                  onChange={(e) => {
                    // updatePo({ ...po, ns: e.target.value });
                  }}
                  disabled
                />
              </div>
            </>
          ) : (
            <></>
          )} */}
        </Row>

        <CustomAccordion
          tittle={tr[localStorage.getItem("language")].prod}
          defaultActive={true}
          active={accor.produk}
          onClick={() => {
            setAccor({
              ...accor,
              produk: !accor.produk,
            });
          }}
          key={1}
          body={
            <Row>
              <div className="col-12">
                <DataTable
                  responsiveLayout="scroll"
                  value={order.dprod?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      // order: v?.order ?? 0,
                      // price: v?.price ?? 0,
                      // disc: v?.disc ?? 0,
                      // total: v?.total ?? 0,
                    };
                  })}
                  className="display w-150 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    header={tr[localStorage.getItem("language")].prod}
                    className="align-text-top"
                    style={{
                      minWidth: "15rem",
                    }}
                    field={""}
                    body={(e) => (
                      <CustomDropdown
                        value={e.prod_id && checkProd(e.prod_id)}
                        option={product}
                        onChange={(u) => {
                          // looping satuan
                          let sat = [];
                          satuan.forEach((element) => {
                            if (element?.id === u?.unit?.id) {
                              sat.push(element);
                            } else {
                              if (element.u_from?.id === u?.unit?.id) {
                                sat.push(element);
                              }
                            }
                          });
                          // setSatuan(sat);

                          let temp = [...order.dprod];
                          temp[e.index].prod_id = u?.id;
                          temp[e.index].unit_id = u?.unit?.id;
                          updateORD({ ...order, dprod: temp });

                          let newError = error;
                          newError.prod[e.index].id = false;
                          setError(newError);
                        }}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowProduk(true);
                        }}
                        label={"[name] ([code])"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        disabled={order.po_id !== null && !isEdit}
                        errorMessage="Produk Belum Dipilih"
                        error={error?.prod[e.index]?.id}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].satuan}
                    className="align-text-top"
                    style={{
                      minWidth: "7rem",
                    }}
                    field={""}
                    body={(e) => (
                      <CustomDropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        onChange={(u) => {
                          let temp = [...order.dprod];
                          temp[e.index].unit_id = u.id;
                          updateORD({ ...order, dprod: temp });
                        }}
                        option={satuan}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowSatuan(true);
                        }}
                        label={"[name]"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        disabled={order.po_id !== null && !isEdit}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].gudang}
                    className="align-text-top"
                    style={{
                      minWidth: "7rem",
                    }}
                    field={""}
                    body={(e) => (
                      <CustomDropdown
                        value={e.location && checkLoc(e.location)}
                        onChange={(u) => {
                          let temp = [...order.dprod];
                          temp[e.index].location = u.id;
                          updateORD({ ...order, dprod: temp });

                          let newError = error;
                          newError.prod[e.index].lok = false;
                          newError.prod.push({ lok: false });
                          setError(newError);
                        }}
                        option={lokasi}
                        label={"[name]"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowLok(true);
                        }}
                        errorMessage="Lokasi Belum Dipilih"
                        error={error?.prod[e.index]?.lok}
                      />
                    )}
                  />

                  <Column
                    hidden={order?.po_id == null}
                    header={tr[localStorage.getItem("language")].ord}
                    className="align-text-top"
                    style={{
                      minWidth: "7rem",
                    }}
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        prc
                        value={e.req && e.req}
                        onChange={(u) => {
                          let temp = [...order.dprod];
                          temp[e.index].req = u.target.value;
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].qty}
                    className="align-text-top"
                    style={{
                      minWidth: "7rem",
                    }}
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        prc
                        value={e.order && e.order}
                        onChange={(u) => {
                          let temp = [...order.dprod];
                          if (order?.po_id) {
                            let val =
                              u.value > e.r_remain ? e.r_remain : u.value;
                            let result =
                              temp[e.index].order - val + temp[e.index].remain;
                            temp[e.index].order = val;

                            temp[e.index].order = Number(u.value);

                            if (
                              order.sup_id !== null &&
                              checkSupp(order.sup_id)?.supplier?.sup_curren !==
                                null
                            ) {
                              temp[e.index].total_fc =
                                temp[e.index].order * temp[e.index].price;

                              temp[e.index].total =
                                temp[e.index].total_fc * curConv();

                              if (temp[e.index].order > e.req) {
                                temp[e.index].order = e.req;
                              }
                              temp[e.index].total_fc =
                                temp[e.index].order * temp[e.index].price;
                            } else {
                              temp[e.index].total =
                                temp[e.index].order * temp[e.index].price;

                              if (temp[e.index].order > e.req) {
                                temp[e.index].order = e.req;
                                temp[e.index].total =
                                  temp[e.index].order * temp[e.index].price;
                              }
                            }

                            temp[e.index].remain = result;
                          } else {
                            temp[e.index].order = Number(u.value);

                            if (
                              order.sup_id !== null &&
                              checkSupp(order.sup_id)?.supplier?.sup_curren !==
                                null
                            ) {
                              temp[e.index].total_fc =
                                temp[e.index].order * temp[e.index].price;

                              temp[e.index].total =
                                temp[e.index].total_fc * curConv();
                            } else {
                              temp[e.index].total =
                                temp[e.index].order * temp[e.index].price;
                            }
                          }

                          updateORD({
                            ...order,
                            dprod: temp,
                            total_b: getSubTotalBarang() + getSubTotalJasa(),
                            total_bayar:
                              getSubTotalBarang() +
                              getSubTotalJasa() +
                              ((getSubTotalBarang() + getSubTotalJasa()) *
                                ppn()) /
                                100,
                          });

                          let newError = error;
                          newError.prod[e.index].jum = false;
                          newError.prod.push({ jum: false });
                          setError(newError);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        // disabled={order && order.po_id !== null}
                        error={error?.prod[e.index]?.jum}
                      />
                    )}
                  />

                  <Column
                    hidden={order?.po_id == null}
                    header={tr[localStorage.getItem("language")].sisa}
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "7rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <PrimeNumber
                          prc
                          value={e.remain ? e.remain : ""}
                          placeholder="0"
                          type="number"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].price}
                    className="align-text-top"
                    style={{
                      minWidth: "10rem",
                    }}
                    field={""}
                    body={(e) =>
                      order.sup_id !== null &&
                      checkSupp(order.sup_id)?.supplier?.sup_curren !== null ? (
                        <PrimeNumber
                          price
                          value={e.price && e.price}
                          onChange={(u) => {
                            let temp = [...order.dprod];
                            temp[e.index].price = u?.value;
                            if (
                              order.sup_id !== null &&
                              checkSupp(order.sup_id)?.supplier?.sup_curren !==
                                null
                            ) {
                              temp[e.index].total_fc =
                                temp[e.index].order * temp[e.index].price;

                              temp[e.index].total =
                                temp[e.index].total_fc * curConv();

                              temp[e.index].idr = u?.value * curConv();
                            } else {
                              temp[e.index].total =
                                temp[e.index].order * temp[e.index].price;
                            }

                            updateORD({
                              ...order,
                              dprod: temp,
                              total_b: getSubTotalBarang() + getSubTotalJasa(),
                              total_bayar:
                                getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  ppn()) /
                                  100,
                            });

                            let newError = error;
                            newError.prod[e.index].prc = false;
                            setError(newError);
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
                          disabled={!isEdit && order.po_id !== null}
                          error={error?.prod[e.index]?.prc}
                        />
                      ) : (
                        <PrimeNumber
                          price
                          value={e.price && e.price}
                          onChange={(u) => {
                            let temp = [...order.dprod];
                            temp[e.index].price = u.value;
                            if (
                              order.sup_id !== null &&
                              checkSupp(order.sup_id)?.supplier?.sup_curren !==
                                null
                            ) {
                              temp[e.index].total_fc =
                                temp[e.index].order * temp[e.index].price;

                              temp[e.index].total =
                                temp[e.index].total_fc * curConv();
                            } else {
                              temp[e.index].total =
                                temp[e.index].order * temp[e.index].price;
                            }

                            updateORD({
                              ...order,
                              dprod: temp,
                              total_b: getSubTotalBarang() + getSubTotalJasa(),
                              total_bayar:
                                getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  ppn()) /
                                  100,
                            });

                            let newError = error;
                            newError.prod[e.index].prc = false;
                            setError(newError);
                          }}
                          placeholder="0"
                          type="number"
                          mode="decimal"
                          min={0}
                          disabled={!isEdit && order.po_id !== null}
                          error={error?.prod[e.index]?.prc}
                        />
                      )
                    }
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].disc}
                    className="align-text-top"
                    style={{
                      minWidth: "10rem",
                    }}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.disc && e.disc}
                          onChange={(u) => {
                            let temp = [...order.dprod];
                            temp[e.index].disc = u.target.value;
                            updateORD({ ...order, dprod: temp });
                            console.log(temp);
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
                          // disabled={order && order.po_id !== null}
                        />
                        <span className="p-inputgroup-addon">%</span>
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].net_prc}
                    className="align-text-top"
                    style={{
                      minWidth: "10rem",
                    }}
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.nett_price && e.nett_price}
                        onChange={(u) => {
                          let temp = [...order.dprod];
                          temp[e.index].nett_price = u.value;
                          updateORD({ ...order, dprod: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        // disabled={order && order.po_id !== null}
                      />
                    )}
                  />

                  <Column
                    hidden={
                      order?.sup_id == null ||
                      checkSupp(order?.sup_id)?.supplier?.sup_curren === null
                    }
                    header={`${
                      tr[localStorage.getItem("language")].price
                    } (IDR)`}
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "7rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <PrimeNumber
                          price
                          value={e.idr ? e.idr : ""}
                          placeholder="0"
                          type="number"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    hidden={
                      order.sup_id == null ||
                      checkSupp(order.sup_id)?.supplier?.sup_curren === null
                    }
                    header="FC"
                    className="align-text-top"
                    style={{
                      minWidth: "7rem",
                    }}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={
                            e.nett_price && e.nett_price !== 0
                              ? e.nett_price
                              : e.total_fc - (e.total_fc * e.disc) / 100
                          }
                          onChange={(u) => {}}
                          placeholder="0"
                          type="number"
                          min={0}
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].total}
                    className="align-text-top"
                    style={{
                      minWidth: "8rem",
                    }}
                    body={(e) => (
                      <label className="text-nowrap">
                        <b>
                          Rp.{" "}
                          {formatIdr(
                            e.nett_price && e.nett_price !== 0
                              ? e.nett_price
                              : e.total - (e.total * e.disc) / 100
                          )}
                        </b>
                      </label>
                    )}
                  />

                  <Column
                    header=""
                    className="align-text-top"
                    style={{
                      minWidth: "2rem",
                    }}
                    field={""}
                    body={(e) =>
                      e.index === order.dprod.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.prod.push({
                              id: false,
                              lok: false,
                              jum: false,
                              prc: false,
                            });
                            setError(newError);

                            updateORD({
                              ...order,
                              dprod: [
                                ...order.dprod,
                                {
                                  id: 0,
                                  prod_id: null,
                                  unit_id: null,
                                  request: null,
                                  order: null,
                                  remain: null,
                                  price: null,
                                  disc: null,
                                  nett_price: null,
                                  total_fc: 0,
                                  total: null,
                                },
                              ],
                            });
                          }}
                          className="btn btn-primary shadow btn-xs sharp"
                          hidden={order.po_id !== null}
                        >
                          <i className="fa fa-plus"></i>
                        </Link>
                      ) : (
                        <Link
                          onClick={() => {
                            let temp = [...order.dprod];
                            temp.splice(e.index, 1);
                            updateORD({ ...order, dprod: temp });
                          }}
                          className="btn btn-danger shadow btn-xs sharp"
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      )
                    }
                  />
                </DataTable>
              </div>
              <div className="col-12 d-flex justify-content-end">
                <Link
                  onClick={() => {
                    let newError = error;
                    newError.prod.push({ jum: false, prc: false });
                    setError(newError);

                    updateORD({
                      ...order,
                      dprod: [
                        ...order.dprod,
                        {
                          id: 0,
                          prod_id: null,
                          unit_id: null,
                          request: null,
                          order: null,
                          remain: null,
                          price: null,
                          disc: null,
                          nett_price: null,
                          total_fc: 0,
                          total: null,
                        },
                      ],
                    });
                  }}
                  className="btn btn-primary shadow btn-s sharp ml- mt-3"
                  hidden={order.po_id}
                >
                  <span className="align-middle mx-1">
                    <i className="fa fa-plus"></i>{" "}
                    {tr[localStorage.getItem("language")].tambh}
                  </span>
                </Link>
              </div>
            </Row>
          }
        />

        <div className="d-flex col-12 align-items-center mt-5">
          <label className="ml-0 mt-1">{"Supplier Sama Dengan Produk"}</label>
          <InputSwitch
            className="ml-4"
            checked={order.same_sup}
            onChange={(e) => {
              updateORD({
                ...order,
                same_sup: e.target.value,
                djasa: order.djasa.map((v) => ({
                  ...v,
                  sup_id: e.target.value === true ? order.sup_id : null,
                  price: "",
                  total_fc: 0,
                  total: 0,
                })),
              });
              // console.log("==============" + order.sup_id);
            }}
            disabled={order.po_id !== null}
          />
        </div>

        <CustomAccordion
          tittle={tr[localStorage.getItem("language")].jasa}
          defaultActive={false}
          active={accor.jasa}
          onClick={() => {
            setAccor({
              ...accor,
              jasa: !accor.jasa,
            });
          }}
          key={1}
          body={
            <Row>
              <div className="col-12">
                <DataTable
                  responsiveLayout="scroll"
                  value={order.djasa?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      // order: v?.order ?? 0,
                      // price: v?.price ?? 0,
                      disc: v?.disc ?? 0,
                      total: v?.total ?? 0,
                    };
                  })}
                  className="display w-170 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    header={tr[localStorage.getItem("language")].supplier}
                    className="align-text-top"
                    style={{
                      minWidth: "10rem",
                    }}
                    field={""}
                    body={(e) => (
                      <CustomDropdown
                        value={e.sup_id && checkSupp(e.sup_id)}
                        option={supplier}
                        onChange={(u) => {
                          console.log(e.value);
                          let temp = [...order.djasa];
                          temp[e.index].sup_id = u.supplier.id;
                          temp[e.index].price = "";
                          temp[e.index].total_fc = 0;
                          temp[e.index].total = 0;
                          updateORD({ ...order, djasa: temp });
                        }}
                        label={"[supplier.sup_name] ([supplier.sup_code])"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        detail
                        onDetail={() => setShowSupplier(true)}
                        disabled={
                          order.po_id !== null || order.same_sup === true
                        }
                      />
                    )}
                  />

                  <Column
                    hidden={order.same_sup}
                    header={tr[localStorage.getItem("language")].currency}
                    className="align-text-top"
                    style={{
                      minWidth: "8rem",
                    }}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={
                            checkSupp(e.sup_id)?.supplier?.sup_curren !== null
                              ? checkCur(
                                  checkSupp(e.sup_id)?.supplier?.sup_curren
                                )?.code
                              : "IDR"
                          }
                          onChange={(u) => {}}
                          placeholder={
                            tr[localStorage.getItem("language")].currency
                          }
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].jasa}
                    className="align-text-top"
                    style={{
                      minWidth: "12rem",
                    }}
                    field={""}
                    body={(e) => (
                      <CustomDropdown
                        value={e.jasa_id && checkJasa(e.jasa_id)}
                        option={jasa}
                        onChange={(u) => {
                          console.log(e.value);
                          let temp = [...order.djasa];
                          temp[e.index].jasa_id = u.jasa.id;
                          updateORD({ ...order, djasa: temp });
                          let newError = error;
                          newError.jasa[e.index].id = false;
                          setError(newError);
                        }}
                        label={"[jasa.name] ([jasa.code])"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowJasa(true);
                        }}
                        disabled={order && order.po_id !== null}
                        errorMessage="Jasa Belum Dipilih"
                        error={error?.jasa[e.index]?.id}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].satuan}
                    className="align-text-top"
                    style={{
                      minWidth: "7rem",
                    }}
                    field={""}
                    body={(e) => (
                      <CustomDropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        option={satuan}
                        onChange={(u) => {
                          console.log(e.value);
                          let temp = [...order.djasa];
                          temp[e.index].unit_id = u.id;
                          updateORD({ ...order, djasa: temp });
                        }}
                        label={"[name]"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowSatuan(true);
                        }}
                        disabled={order && order.po_id !== null}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].qty}
                    className="align-text-top"
                    style={{
                      minWidth: "7rem",
                    }}
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        value={e.order && e.order}
                        onChange={(u) => {
                          let temp = [...order.djasa];
                          temp[e.index].order = Number(u.target.value);
                          if (order.same_sup) {
                            if (
                              checkSupp(order.sup_id)?.supplier?.sup_curren !==
                              null
                            ) {
                              temp[e.index].total_fc =
                                temp[e.index].order * temp[e.index].price;

                              temp[e.index].total =
                                temp[e.index].total_fc * curConv();
                            } else {
                              temp[e.index].total =
                                temp[e.index].order * temp[e.index].price;
                            }
                          } else {
                            if (
                              checkSupp(e.sup_id)?.supplier?.sup_curren !== null
                            ) {
                              temp[e.index].total_fc =
                                temp[e.index].order * temp[e.index].price;

                              temp[e.index].total =
                                temp[e.index].total_fc *
                                checkCur(
                                  checkSupp(e.sup_id)?.supplier?.sup_curren
                                )?.rate;
                            } else {
                              temp[e.index].total =
                                temp[e.index].order * temp[e.index].price;
                            }
                          }

                          updateORD({
                            ...order,
                            djasa: temp,
                            total_b: getSubTotalBarang() + getSubTotalJasa(),
                            total_bayar:
                              getSubTotalBarang() +
                              getSubTotalJasa() +
                              ((getSubTotalBarang() + getSubTotalJasa()) *
                                ppn()) /
                                100,
                          });

                          let newError = error;
                          newError.jasa[e.index].jum = false;
                          setError(newError);
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled={order && order.po_id !== null}
                        error={error?.jasa[e.index]?.jum}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].price}
                    className="align-text-top"
                    style={{
                      minWidth: "10rem",
                    }}
                    field={""}
                    body={(e) =>
                      checkSupp(order.sup_id)?.supplier?.sup_curren !== null ? (
                        <PrimeNumber
                          value={e.price && e.price}
                          onChange={(u) => {
                            let temp = [...order.djasa];
                            temp[e.index].price = Number(u.target.value);
                            if (order.same_sup) {
                              if (
                                checkSupp(order.sup_id)?.supplier
                                  ?.sup_curren !== null
                              ) {
                                temp[e.index].total_fc =
                                  temp[e.index].order * temp[e.index].price;

                                temp[e.index].total =
                                  temp[e.index].total_fc * curConv();
                              } else {
                                temp[e.index].total =
                                  temp[e.index].order * temp[e.index].price;
                              }
                            } else {
                              if (
                                checkSupp(e.sup_id)?.supplier?.sup_curren !==
                                null
                              ) {
                                temp[e.index].total_fc =
                                  temp[e.index].order * temp[e.index].price;

                                temp[e.index].total =
                                  temp[e.index].total_fc *
                                  checkCur(
                                    checkSupp(e.sup_id)?.supplier?.sup_curren
                                  )?.rate;
                              } else {
                                temp[e.index].total =
                                  temp[e.index].order * temp[e.index].price;
                              }
                            }

                            updateORD({
                              ...order,
                              djasa: temp,
                              total_b: getSubTotalBarang() + getSubTotalJasa(),
                              total_bayar:
                                getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  ppn()) /
                                  100,
                            });

                            let newError = error;
                            newError.jasa[e.index].prc = false;
                            setError(newError);
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
                          error={error?.jasa[e.index]?.prc}
                          disabled={order && order.po_id !== null}
                        />
                      ) : (
                        <PrimeNumber
                          price
                          value={e.price && e.price}
                          onChange={(u) => {
                            let temp = [...order.djasa];
                            temp[e.index].price = u.value;
                            if (order.same_sup) {
                              if (
                                checkSupp(order.sup_id)?.supplier
                                  ?.sup_curren !== null
                              ) {
                                temp[e.index].total_fc =
                                  temp[e.index].order * temp[e.index].price;

                                temp[e.index].total =
                                  temp[e.index].total_fc * curConv();
                              } else {
                                temp[e.index].total =
                                  temp[e.index].order * temp[e.index].price;
                              }
                            } else {
                              if (
                                checkSupp(e.sup_id)?.supplier?.sup_curren !==
                                null
                              ) {
                                temp[e.index].total_fc =
                                  temp[e.index].order * temp[e.index].price;

                                temp[e.index].total =
                                  temp[e.index].total_fc * curConv();
                              } else {
                                temp[e.index].total =
                                  temp[e.index].order * temp[e.index].price;
                              }
                            }

                            updateORD({
                              ...order,
                              djasa: temp,
                              total_b: getSubTotalBarang() + getSubTotalJasa(),
                              total_bayar:
                                getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  ppn()) /
                                  100,
                            });

                            let newError = error;
                            newError.jasa[e.index].prc = false;
                            setError(newError);
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
                          error={error?.jasa[e.index]?.prc}
                          disabled={order && order.po_id !== null}
                        />
                      )
                    }
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].disc}
                    className="align-text-top"
                    style={{
                      minWidth: "10rem",
                    }}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.disc && e.disc}
                          onChange={(u) => {
                            let temp = [...order.djasa];
                            temp[e.index].disc = u.target.value;
                            updateORD({ ...order, djasa: temp });
                            console.log(temp);
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
                          disabled={order && order.po_id !== null}
                        />
                        <span className="p-inputgroup-addon">%</span>
                      </div>
                    )}
                  />

                  <Column
                    header="FC"
                    className="align-text-top"
                    style={{
                      minWidth: "7rem",
                    }}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.total_fc - (e.total_fc * e.disc) / 100}
                          onChange={(u) => {}}
                          placeholder="0"
                          type="number"
                          min={0}
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].total}
                    className="align-text-top"
                    body={(e) => (
                      <label className="text-nowrap">
                        <b>
                          Rp. {formatIdr(e.total - (e.total * e.disc) / 100)}
                        </b>
                      </label>
                    )}
                  />

                  <Column
                    header=""
                    className="align-text-top"
                    field={""}
                    body={(e) =>
                      e.index === order.djasa?.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.jasa.push({
                              id: false,
                              jum: false,
                              prc: false,
                            });
                            setError(newError);

                            updateORD({
                              ...order,
                              djasa: [
                                ...order.djasa,
                                {
                                  id: 0,
                                  jasa_id: null,
                                  sup_id: null,
                                  unit_id: null,
                                  order: null,
                                  price: null,
                                  disc: null,
                                  total_fc: null,
                                  total: null,
                                },
                              ],
                            });
                          }}
                          className="btn btn-primary shadow btn-xs sharp"
                          disabled={order && order.po_id !== null}
                        >
                          <i className="fa fa-plus"></i>
                        </Link>
                      ) : (
                        <Link
                          onClick={() => {
                            let temp = [...order.djasa];
                            temp.splice(e.index, 1);
                            updateORD({ ...order, djasa: temp });
                          }}
                          className="btn btn-danger shadow btn-xs sharp"
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      )
                    }
                  />
                </DataTable>
              </div>
              <div className="col-12 d-flex justify-content-end">
                <Link
                  onClick={() => {
                    let newError = error;
                    newError.jasa.push({
                      id: false,
                      jum: false,
                      prc: false,
                    });
                    setError(newError);

                    updateORD({
                      ...order,
                      djasa: [
                        ...order.djasa,
                        {
                          id: 0,
                          jasa_id: null,
                          sup_id: null,
                          unit_id: null,
                          order: null,
                          price: null,
                          disc: null,
                          total_fc: null,
                          total: null,
                        },
                      ],
                    });
                  }}
                  className="btn btn-primary shadow btn-s sharp ml- mt-3"
                  disabled={order && order.po_id !== null}
                >
                  <span className="align-middle mx-1">
                    <i className="fa fa-plus"></i>{" "}
                    {tr[localStorage.getItem("language")].tambh}
                  </span>
                </Link>
              </div>
            </Row>
          }
        />

        <div className="row ml-0 mr-0 mb-0 mt-6 justify-content-between">
          <div className="col-6 pl-0">
            <label className="text-label">Note</label>
            <div className="p-inputgroup">
              <InputTextarea
                placeholder="Catatan"
                value={order.note}
                onChange={(e) => {
                  updateORD({ ...order, note: e.target.value });
                }}
              />
            </div>
            <div className="row mt-4">
              {order.djasa?.length > 0 && order.dprod?.length > 0 && (
                <div className="d-flex col-12 align-items-center">
                  <label className="mt-1">{"Pisah Faktur"}</label>
                  <InputSwitch
                    className="ml-4"
                    checked={order.split_inv}
                    onChange={(e) => {
                      if (e.value) {
                        updateORD({
                          ...order,
                          split_inv: e.value,
                          total_disc: null,
                        });
                      } else {
                        updateORD({
                          ...order,
                          split_inv: e.value,
                          prod_disc: null,
                          jasa_disc: null,
                        });
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="row justify-content-right col-6">
            <div className="col-6">
              <label className="text-label">
                {order.split_inv
                  ? tr[localStorage.getItem("language")].ttl_barang
                  : tr[localStorage.getItem("language")].sub_ttl}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {order.split_inv ? (
                  checkSupp(order.sup_id)?.supplier?.sup_curren !== null ? (
                    <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                  ) : (
                    <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                  )
                ) : checkSupp(order.sup_id)?.supplier?.sup_curren !== null ? (
                  <b>
                    {" "}
                    Rp. {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                  </b>
                ) : (
                  <b>
                    Rp. {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                  </b>
                )}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {order.split_inv ? "DPP Barang" : "DPP"}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {order.split_inv ? (
                  checkSupp(order.sup_id)?.supplier?.sup_curren !== null ? (
                    <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                  ) : (
                    <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                  )
                ) : checkSupp(order.sup_id)?.supplier?.sup_curren !== null ? (
                  <b>
                    Rp. {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                  </b>
                ) : (
                  <b>
                    Rp. {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                  </b>
                )}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {order.split_inv
                  ? `${
                      tr[localStorage.getItem("language")].pjk_barang
                    } ${ppn()}%`
                  : tr[localStorage.getItem("language")].pajak}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {order.split_inv ? (
                  checkSupp(order.sup_id)?.supplier?.sup_curren !== null ? (
                    <b>Rp. {formatIdr((getSubTotalBarang() * ppn()) / 100)}</b>
                  ) : (
                    <b>Rp. {formatIdr((getSubTotalBarang() * ppn()) / 100)}</b>
                  )
                ) : checkSupp(order.sup_id)?.supplier?.sup_curren !== null ? (
                  <b>
                    Rp.
                    {formatIdr(
                      ((getSubTotalBarang() + getSubTotalJasa()) * ppn()) / 100
                    )}
                  </b>
                ) : (
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      ((getSubTotalBarang() + getSubTotalJasa()) * ppn()) / 100
                    )}
                  </b>
                )}
              </label>
            </div>

            <div className="col-6 mt-3">
              <label className="text-label">
                {tr[localStorage.getItem("language")].disc_tambh}
              </label>
            </div>

            <div className="col-6">
              <div className="p-inputgroup">
                <PButton
                  label="Rp."
                  className={`${isRp ? "" : "p-button-outlined"}`}
                  onClick={() => setRp(true)}
                />
                <InputText
                  value={
                    order.split_inv
                      ? isRp
                        ? (getSubTotalBarang() * order.prod_disc) / 100
                        : order.prod_disc
                      : isRp
                      ? ((getSubTotalBarang() + getSubTotalJasa()) *
                          order.total_disc) /
                        100
                      : order.total_disc
                  }
                  placeholder={tr[localStorage.getItem("language")].disc}
                  type="number"
                  min={0}
                  onChange={(e) => {
                    if (order.split_inv) {
                      let disc = 0;
                      if (isRp) {
                        disc = (e.target.value / getSubTotalBarang()) * 100;
                      } else {
                        disc = e.target.value;
                      }
                      updateORD({ ...order, prod_disc: disc });
                    } else {
                      let disc = 0;
                      if (isRp) {
                        disc =
                          (e.target.value /
                            (getSubTotalBarang() + getSubTotalJasa())) *
                          100;
                      } else {
                        disc = e.target.value;
                      }
                      updateORD({ ...order, total_disc: disc });
                    }
                  }}
                />
                <PButton
                  className={`${isRp ? "p-button-outlined" : ""}`}
                  onClick={() => setRp(false)}
                >
                  {" "}
                  <b>%</b>{" "}
                </PButton>
              </div>
            </div>

            <div className="col-12">
              <Divider className="ml-12"></Divider>
            </div>

            <div className="col-6">
              <label className="text-label fs-14">
                <b>{`${tr[localStorage.getItem("language")].total} ${
                  tr[localStorage.getItem("language")].bayar
                }`}</b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label fs-14">
                {order.split_inv ? (
                  checkSupp(order.sup_id)?.supplier?.sup_curren !== null ? (
                    <b>
                      Rp.
                      {formatIdr(
                        getSubTotalBarang() +
                          (getSubTotalBarang() * ppn()) / 100
                      )}
                    </b>
                  ) : (
                    <b>
                      Rp.{" "}
                      {formatIdr(
                        getSubTotalBarang() +
                          (getSubTotalBarang() * ppn()) / 100
                      )}
                    </b>
                  )
                ) : checkSupp(order.sup_id)?.supplier?.sup_curren !== null ? (
                  <b>
                    Rp.
                    {formatIdr(
                      getSubTotalBarang() +
                        getSubTotalJasa() +
                        ((getSubTotalBarang() + getSubTotalJasa()) * ppn()) /
                          100
                    )}
                  </b>
                ) : (
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      getSubTotalBarang() +
                        getSubTotalJasa() +
                        ((getSubTotalBarang() + getSubTotalJasa()) * ppn()) /
                          100
                    )}
                  </b>
                )}
              </label>
            </div>

            <div className="col-12">
              <Divider className="ml-12"></Divider>
            </div>

            <div className="col-6 mt-0">
              <label className="text-label">{"Uang Muka"}</label>
            </div>

            <div className="col-6">
              <label className="text-label fs-14">
                <b>Rp. {formatIdr(getUangMuka())}</b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label fs-14">
                <b>{"Sisa Pembayaran"}</b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label fs-14">
                <b>
                  Rp.{" "}
                  {formatIdr(
                    getSubTotalBarang() +
                      getSubTotalJasa() +
                      ((getSubTotalBarang() + getSubTotalJasa()) * ppn()) /
                        100 -
                      getUangMuka()
                  )}
                </b>
              </label>
            </div>

            {order?.split_inv ? (
              <>
                {/* <div className="row justify-content-right col-12 mt-4"> */}
                <div className="col-6 mt-4">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].ttl_jasa}
                  </label>
                </div>

                <div className="col-6 mt-4">
                  <label className="text-label">
                    <b>Rp. {formatIdr(getSubTotalJasa())}</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label">DPP Jasa</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Rp. {formatIdr(getSubTotalJasa())}</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label">{`${
                    tr[localStorage.getItem("language")].pjk_jasa
                  } (2%)`}</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Rp. {formatIdr((getSubTotalJasa() * 2) / 100)}</b>
                  </label>
                </div>

                <div className="col-6 mt-3">
                  <label className="text-label">
                    {tr[localStorage.getItem("language")].disc_tambh}
                  </label>
                </div>

                <div className="col-6">
                  <div className="p-inputgroup">
                    <PButton
                      label="Rp."
                      className={`${isRpJasa ? "" : "p-button-outlined"}`}
                      onClick={() => setRpJasa(true)}
                    />
                    <InputText
                      value={
                        isRpJasa
                          ? (getSubTotalJasa() * order.jasa_disc) / 100
                          : order.jasa_disc
                      }
                      placeholder={tr[localStorage.getItem("language")].disc}
                      type="number"
                      min={0}
                      onChange={(e) => {
                        let disc = 0;
                        if (isRpJasa) {
                          disc = (e.target.value / getSubTotalJasa()) * 100;
                        } else {
                          disc = e.target.value;
                        }
                        updateORD({ ...order, jasa_disc: disc });
                      }}
                    />
                    <PButton
                      className={`${isRpJasa ? "p-button-outlined" : ""}`}
                      onClick={() => setRpJasa(false)}
                    >
                      {" "}
                      <b>%</b>{" "}
                    </PButton>
                  </div>
                </div>

                <div className="col-12">
                  <Divider className="ml-12"></Divider>
                </div>

                <div className="col-6">
                  <label className="text-label fs-14">
                    <b>{`${tr[localStorage.getItem("language")].total} ${
                      tr[localStorage.getItem("language")].bayar
                    }`}</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label fs-14">
                    <b>
                      Rp.{" "}
                      {formatIdr(
                        getSubTotalJasa() + (getSubTotalJasa() * 2) / 100
                      )}
                    </b>
                  </label>
                </div>

                <div className="col-12">
                  <Divider className="ml-12"></Divider>
                </div>
                {/* </div> */}
              </>
            ) : null}
          </div>
        </div>
      </>
    );
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div>
          <PButton
            label="Batal"
            onClick={onCancel}
            className="p-button-text btn-primary"
          />
          <PButton
            label="Simpan"
            icon="pi pi-check"
            onClick={onSubmit}
            autoFocus
            loading={update}
            disabled={setup?.cutoff === null}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Row>
        <Col className="pt-0">
          <Card>
            <Card.Body>
              {/* {header()} */}
              {body()}
              {footer()}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <DataRulesPay
        data={rulesPay}
        loading={false}
        popUp={true}
        show={showRulesPay}
        onHide={() => {
          setShowRulesPay(false);
        }}
        onInput={(e) => {
          setShowRulesPay(!e);
        }}
        onSuccessInput={(e) => {
          getRulesPay();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowRulesPay(false);
            updateORD({ ...order, top: e.data.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataPusatBiaya
        data={dept}
        loading={false}
        popUp={true}
        show={showDept}
        onHide={() => {
          setShowDept(false);
        }}
        onInput={(e) => {
          setShowDept(!e);
        }}
        onSuccessInput={(e) => {
          getDept();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowDept(false);
            updateORD({ ...order, dep_id: e.data.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataProject
        data={project}
        loading={false}
        popUp={true}
        show={showProj}
        onHide={() => {
          setShowProj(false);
        }}
        onInput={(e) => {
          setShowProj(!e);
        }}
        onSuccessInput={(e) => {
          getProj();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowProj(false);
            updateORD({ ...order, proj_id: e.data.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataSupplier
        data={supplier}
        loading={false}
        popUp={true}
        show={showSupplier}
        onHide={() => {
          setShowSupplier(false);
        }}
        onInput={(e) => {
          setShowSupplier(!e);
        }}
        onSuccessInput={(e) => {
          getSupplier();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSupplier(false);
            let temp = [...order.djasa];
            temp[currentIndex].sup_id = e.data.supplier.id;
            updateORD({ ...order, sup_id: e.data.supplier.id, djasa: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataProduk
        data={product}
        loading={false}
        popUp={true}
        show={showProduk}
        onHide={() => {
          setShowProduk(false);
        }}
        onInput={(e) => {
          setShowProduk(!e);
        }}
        onSuccessInput={(e) => {
          getProduct();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowProduk(false);
            let sat = [];
            satuan.forEach((element) => {
              if (element.id === e.data.unit.id) {
                sat.push(element);
              } else {
                if (element.u_from?.id === e.data.unit.id) {
                  sat.push(element);
                }
              }
            });
            setSatuan(sat);

            let temp = [...order.dprod];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;
            updateORD({ ...order, dprod: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataJasa
        data={jasa}
        loading={false}
        popUp={true}
        show={showJasa}
        onHide={() => {
          setShowJasa(false);
        }}
        onInput={(e) => {
          setShowJasa(!e);
        }}
        onSuccessInput={(e) => {
          getJasa();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowJasa(false);
            let temp = [...order.djasa];
            temp[currentIndex].jasa_id = e.data.jasa.id;
            updateORD({ ...order, djasa: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataSatuan
        data={satuan}
        loading={false}
        popUp={true}
        show={showSatuan}
        onHide={() => {
          setShowSatuan(false);
        }}
        onInput={(e) => {
          setShowSatuan(!e);
        }}
        onSuccessInput={(e) => {
          getSatuan();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSatuan(false);
            let temp = [...order.dprod];
            temp[currentIndex].unit_id = e.data.id;

            let tempj = [...order.djasa];
            tempj[currentIndex].unit_id = e.data.id;
            updateORD({ ...order, dprod: temp, djasa: tempj });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataLokasi
        data={lokasi}
        loading={false}
        popUp={true}
        show={showLok}
        onHide={() => {
          setShowLok(false);
        }}
        onInput={(e) => {
          setShowLok(!e);
        }}
        onSuccessInput={(e) => {
          getSatuan();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowLok(false);
            let temp = [...order.dprod];
            temp[currentIndex].location = e.data.id;
            updateORD({ ...order, dprod: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />
    </>
  );
};

export default InputOrder;
