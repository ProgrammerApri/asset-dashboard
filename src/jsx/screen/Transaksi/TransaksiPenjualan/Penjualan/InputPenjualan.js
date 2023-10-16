import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Card, Col } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_SL } from "src/redux/actions";
import DataSupplier from "../../../Mitra/Pemasok/DataPemasok";
import DataRulesPay from "src/jsx/screen/MasterLainnya/RulesPay/DataRulesPay";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { el, fil } from "date-fns/locale";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataCustomer from "src/jsx/screen/Mitra/Pelanggan/DataCustomer";
import DataSatuan from "src/jsx/screen/MasterLainnya/Satuan/DataSatuan";
import DataProduk from "src/jsx/screen/Master/Produk/DataProduk";
import DataJasa from "src/jsx/screen/Master/Jasa/DataJasa";
import DataSalesman from "src/jsx/screen/MasterLainnya/Salesman/DataSalesman";
import DataLokasi from "src/jsx/screen/Master/Lokasi/DataLokasi";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { Dropdown } from "primereact/dropdown";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { tr } from "src/data/tr";
import { SelectButton } from "primereact/selectbutton";

const defError = {
  code: false,
  date: false,
  doc_cd: false,
  doc_date: false,
  pel: false,
  rul: false,
  sls: false,
  sub: false,
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
      prc: false,
    },
  ],
};

const surjal = [
  { name: "Invoice", kode: 1 },
  { name: "Invoice + Faktur", kode: 2 },
];

const InputPenjualan = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sale = useSelector((state) => state.sl.current);
  const isEdit = useSelector((state) => state.sl.editSL);
  const dispatch = useDispatch();
  const [isRp, setRp] = useState(true);
  const [isRjjasa, setRjjasa] = useState(true);
  const [comp, setComp] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [project, setProject] = useState(null);
  const [subCus, setSubCus] = useState(null);
  const [numb, setNumb] = useState(true);
  const [rulesPay, setRulesPay] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [salesman, setSalesman] = useState(null);
  const [so, setSO] = useState(null);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showSalesman, setShowSalesman] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showProj, setShowProj] = useState(false);
  const [showSubCus, setShowSub] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [showProduk, setShowProduk] = useState(false);
  const [showJasa, setShowJasa] = useState(false);
  const [showRulesPay, setShowRulesPay] = useState(false);
  const [showLokasi, setShowLok] = useState(false);
  const [product, setProduct] = useState(null);
  const [jasa, setJasa] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [lokasi, setLoc] = useState(null);
  const [rak, setRak] = useState(null);
  const [setup, setSetup] = useState(null);
  const [sto, setSto] = useState(null);
  const [currency, setCurr] = useState(null);
  const [arCard, setAr] = useState(null);
  const [state, setState] = useState(0);
  const [display, setDisplay] = useState(false);
  const [error, setError] = useState(defError);
  const [accor, setAccor] = useState({
    produk: true,
    jasa: false,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getComp();
    getCustomer();
    getProject();
    getSubCus();
    getSupplier();
    getRulesPay();
    getPpn();
    getCur();
    getStatus();
    getSO();
    getProduct();
    getJasa();
    getSatuan();
    getLoct();
    getSalesman();
    getStoLoc();
    getSetup();
    getArCard();
    getRak();
  }, []);

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !sale.ord_code || sale.ord_code === "",
      date: !sale.ord_date || sale.ord_date === "",
      // doc_cd: !sale.no_doc || sale.no_doc === "",
      // doc_date: !sale.doc_date || sale.doc_date === "",
      pel: !sale.pel_id,
      rul: !sale.top,
      // sls: !sale.slsm_id,
      sub: sale.sub_addr ? !sale.sub_id : false,
      prod: [],
      jasa: [],
    };

    let ord = 0;
    let sto = 0;
    let acc_prd = 0;

    sale?.jprod.forEach((element, i) => {
      if (i > 0) {
        if (
          element.prod_id ||
          element.location ||
          element.order ||
          element.price
        ) {
          errors.prod[i] = {
            id: !element.prod_id,
            lok: !element.location,
            prc:
              !element.price || element.price === "" || element.price === "0",
            jum:
              !element.order || element.order === "" || element.order === "0",
          };
        }
      } else {
        errors.prod[i] = {
          id: !element.prod_id,
          lok: !element.location,
          prc: !element.price || element.price === "" || element.price === "0",
          jum: !element.order || element.order === "" || element.order === "0",
        };
      }

      ord += element.order;
      sto += element.stock;
    });

    sale?.jjasa.forEach((element, i) => {
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
      !errors.prod[0].id &&
      !errors.prod[0].jum &&
      !errors.prod[0].lok &&
      !errors.prod[0].prc
    ) {
      errors.jasa?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    if (!errors.jasa[0]?.id && !errors.jasa[0]?.jum && !errors.jasa[0]?.prc) {
      errors.prod?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    setState(ord > sto);
    if (ord > sto && setup.over_stock) {
      toast.current.show({
        severity: "warn",
        summary: "Warning !!",
        detail: tr[localStorage.getItem("language")].info_sto,
        // sticky: true,
        life: 3000,
      });
      errors?.prod.forEach((el) => {
        el.jum = true;
      });
    } else if (ord > sto && setup.over_stock === true) {
      errors.prod.forEach((el) => {
        el.jum = true;
      });
    }

    //  console.log("=============");
    //   console.log(sale);
    let acc = null;
    if (sale?.sub_addr) {
      acc = checkCus(sale?.sub_cus)?.customer?.cus_gl;
    } else {
      acc = checkCus(sale?.pel_id)?.customer?.cus_gl;
    }

    let acc_ar = acc !== null;

    if (!acc_ar) {
      toast.current.show({
        severity: "error",
        summary: "Tidak Dapat Menyimpan Data",
        detail: `Akun Gl Customer Belum Diisi`,
        life: 6000,
      });
    }

    let validProduct = false;
    let validJasa = false;
    errors.prod?.forEach((el) => {
      for (var k in el) {
        if (k === "jum" && setup.over_stock) {
          validProduct = true;
        } else {
          validProduct = !el[k];
        }
      }
    });
    if (!validProduct) {
      errors.jasa.forEach((el) => {
        for (var k in el) {
          validJasa = !el[k];
        }
      });
    }

    valid =
      !errors.code &&
      !errors.date &&
      // !errors.doc_cd &&
      // !errors.doc_date &&
      !errors.pel &&
      !errors.rul &&
      // !errors.sls &&
      !errors.sub &&
      (validProduct || validJasa) &&
      acc_ar;

    setError(errors);

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });
    }

    return valid;
  };

  const getStatus = async () => {
    const config = {
      ...endpoints.status_sale,
      data: {},
    };

    console.log("Data sebelum request:", config.data);

    let response = null;
    try {
      response = await request(null, config);
      console.log("Response:", response);
      if (response.status) {
        const { data } = response;

        setNumb(data);
      }
    } catch (error) {
      setNumb(false);
      console.error("Error:", error);
    }
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

  const getCustomer = async () => {
    const config = {
      ...endpoints.customer,
      data: {},
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((elem) => {
          if (elem.customer.sub_cus === false) {
            filt.push(elem);
          }
        });

        filt?.forEach((el) => {
          el.displayName = `${el?.customer?.cus_name} (${el?.customer?.cus_code})`;
        });

        setCustomer(filt);
      }
    } catch (error) {}
  };

  const getProject = async () => {
    const config = {
      ...endpoints.project,
      data: {},
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;

        setProject(data);
      }
    } catch (error) {}
  };

  const getSubCus = async () => {
    const config = {
      ...endpoints.customer,
      data: {},
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((elem) => {
          if (elem.customer.sub_cus === true) {
            filt.push(elem);
          }
        });

        setSubCus(filt);
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

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;

        setRulesPay(data);
      }
    } catch (error) {}
  };

  const getPpn = async () => {
    const config = {
      ...endpoints.pajak,
      data: {},
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;

        setPpn(data);
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

      if (response.status) {
        const { data } = response;

        setCurr(data);
      }
    } catch (error) {}
  };

  const getSalesman = async () => {
    const config = {
      ...endpoints.salesman,
      data: {},
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;

        setSalesman(data);
      }
    } catch (error) {}
  };

  const getSO = async () => {
    const config = {
      ...endpoints.so,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((elem) => {
          if (isEdit) {
            let prod = [];
            elem.sprod.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
              prod.push({
                ...el,
                r_remain: el.remain,
              });

              let temp = [...sale.jprod];
              sale.jprod.forEach((e, i) => {
                if (el.id === e.sprod_id) {
                  temp[i].req = el.order;
                  temp[i].r_remain = el.remain + e.order;
                  temp[i].remain = el.remain;
                  updateSL({ ...sale, jprod: temp });
                }
              });
            });
            elem.sprod = prod;

            let jasa = [];
            elem.sjasa.forEach((element) => {
              element.jasa_id = element.jasa_id.id;
              element.unit_id = element.unit_id.id;
              jasa.push({
                ...element,
                r_order: element.order,
              });

              let temp = [...sale.jjasa];
              sale.jjasa.forEach((e, i) => {
                if (el.id === e.sjasa_id) {
                  temp[i].order = el.order;
                  updateSL({ ...sale, jjasa: temp });
                }
              });
            });
            elem.sjasa = jasa;
            filt.push(elem);
          } else {
            if (elem.status !== 2) {
              let prod = [];
              elem.sprod.forEach((el) => {
                if (el.remain > 0) {
                  el.prod_id = el.prod_id.id;
                  el.unit_id = el.unit_id.id;
                  prod.push({
                    ...el,
                    r_remain: el.remain,
                    req: el.order,
                  });
                }
              });
              elem.sprod = prod;

              let jasa = [];
              elem.sjasa.forEach((element) => {
                // if (element.remain > 0) {
                element.jasa_id = element.jasa_id.id;
                element.unit_id = element.unit_id.id;
                jasa.push({
                  ...element,
                  r_order: element.order,
                });
                // }
              });
              elem.sjasa = jasa;
              filt.push(elem);
            }
          }
        });
        setSO(filt);
      }
    } catch (error) {}
  };

  const getProduct = async () => {
    const config = {
      ...endpoints.product,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setProduct(data);
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

      if (response.status) {
        const { data } = response;
        setSatuan(data);
      }
    } catch (error) {}
  };

  const getLoct = async () => {
    const config = {
      ...endpoints.lokasi,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setLoc(data);
      }
    } catch (error) {}
  };

  const getRak = async () => {
    const config = {
      ...endpoints.getRak,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setRak(data);
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

      if (response.status) {
        const { data } = response;
        setSetup(data);
      }
    } catch (error) {}
  };

  const getStoLoc = async (id, e) => {
    const config = {
      ...endpoints.sto,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setSto(data);
      }
    } catch (error) {}
  };

  const getArCard = async (id, e) => {
    const config = {
      ...endpoints.arcard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setAr(data);
      }
    } catch (error) {}
  };

  const editSale = async () => {
    const config = {
      ...endpoints.editSales,
      endpoint: endpoints.editSales.endpoint + sale.id,
      data: { ...sale, so_id: sale?.so_id?.id ?? null },
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        onSuccess();
      }
    } catch (error) {
      setTimeout(() => {
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: tr[localStorage.getItem("language")].gagal,
          detail: tr[localStorage.getItem("language")].pesan_gagal,
          life: 3000,
        });
      }, 500);
    }
  };

  const addSale = async () => {
    const config = {
      ...endpoints.addSale,
      data: sale,
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        onSuccess();
      }
    } catch (error) {
      if (error.status === 400) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: tr[localStorage.getItem("language")].gagal,
            detail: `Kode ${sale.ord_code} Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: tr[localStorage.getItem("language")].gagal,
            detail: tr[localStorage.getItem("language")].pesan_gagal,
            life: 3000,
          });
        }, 500);
      }
    }
  };

  const checkSO = (value) => {
    let selected = {};
    so?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkPpn = (value) => {
    let selected = {};
    ppn?.forEach((element) => {
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

  const checkSales = (value) => {
    let selected = {};
    salesman?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkCus = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer.id) {
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

  const checkSubCus = (value) => {
    let selected = {};
    subCus?.forEach((element) => {
      if (value === element.customer.id) {
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

  const checkRulesP = (value) => {
    let selected = {};
    rulesPay?.forEach((element) => {
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

  const checkUnit = (value) => {
    let selected = {};
    satuan?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkjasa = (value) => {
    let selected = {};
    jasa?.forEach((element) => {
      if (value === element.jasa.id) {
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

  const checkRak = (value) => {
    let selected = {};
    rak?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const onSubmit = () => {
    if (isValid()) {
      if (state) {
        setDisplay(true);
      } else {
        if (isEdit) {
          setUpdate(true);
          editSale();
        } else {
          setUpdate(true);
          addSale();
        }
      }
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
    return newDate?.toISOString();
  };

  const updateSL = (e) => {
    dispatch({
      type: SET_CURRENT_SL,
      payload: e,
    });
  };

  const getSubTotalBarang = () => {
    let total = 0;
    sale?.jprod?.forEach((el) => {
      if (el.nett_price && el.nett_price > 0) {
        total += parseInt(el.nett_price);
      } else {
        total += el.total - (el.total * el.disc) / 100;
      }
    });

    return total;
  };

  const getSubTotalJasa = () => {
    let total = 0;
    sale?.jjasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return total;
  };

  const getUangMuka = () => {
    let dp = 0;
    arCard?.forEach((element) => {
      if (sale?.so_id === element.so_id?.id && element.trx_type === "DP") {
        dp += element.trx_amnh;
      }
    });

    return dp;
  };

  const pjk = (value) => {
    let nil = 0;
    ppn?.forEach((elem) => {
      if (checkCus(sale?.pel_id)?.customer?.cus_pjk === elem.id) {
        nil = elem.nilai;
      }
    });

    return nil;
  };

  const curConv = () => {
    let cur = 0;
    currency?.forEach((elem) => {
      if (checkCus(sale.pel_id)?.customer?.cus_curren === elem.id) {
        cur = elem.rate;
      }
    });

    return cur;
  };

  const curConvSup = () => {
    let cur_sup = 0;
    sale?.jjasa.forEach((element) => {
      currency?.forEach((elem) => {
        if (checkSupp(element.sup_id)?.supplier?.sup_curren === elem.id) {
          cur_sup = elem.rate;
        }
      });
    });

    return cur_sup;
  };

  const formatIdr = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const soTemplate = (option) => {
    return (
      <div>
        {option !== null ? `${option.so_code} - ${option.pel_id.cus_name}` : ""}
      </div>
    );
  };

  const valTemp = (option, props) => {
    if (option) {
      return <div>{option !== null ? `${option.so_code}` : ""}</div>;
    }

    return <span>{props.placeholder}</span>;
  };

  const body = () => {
    let date = new Date(comp?.year_co, comp?.cutoff - 1, 31);
    let code = null;
    let rate = 0;

    currency?.forEach((element) => {
      if (checkCus(sale.pel_id)?.customer?.cus_curren === element?.id) {
        code = element.code;
        rate = element.rate;
      }
    });
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />
        <Row className="mb-4">
          <div className="col-2">
            <PrimeInput
              label={tr[localStorage.getItem("language")].kd_sale}
              value={sale.ord_code}
              onChange={(e) => {
                updateSL({ ...sale, ord_code: e.target.value });

                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].masuk}
              error={error?.code}
              disabled={numb}
            />
          </div>

          <div className="col-2">
            <PrimeCalendar
              label={tr[localStorage.getItem("language")].tgl}
              value={new Date(`${sale.ord_date}Z`)}
              onChange={(e) => {
                let result = null;
                if (sale.top) {
                  result = new Date(e.value);
                  result.setDate(
                    result.getDate() + checkRulesP(sale?.top)?.day
                  );
                }
                updateSL({
                  ...sale,
                  ord_date: e.value,
                  due_date: result,
                });

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

          <div className="col-2">
            <PrimeInput
              label={tr[localStorage.getItem("language")].no_doc}
              value={sale.no_doc}
              onChange={(e) => {
                updateSL({ ...sale, no_doc: e.target.value });

                let newError = error;
                newError.doc_cd = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].masuk}
              // error={error?.doc_cd}
            />
          </div>

          <div className="col-2">
            <PrimeCalendar
              label={tr[localStorage.getItem("language")].tgl_doc}
              value={new Date(`${sale.doc_date}Z`)}
              onChange={(e) => {
                updateSL({
                  ...sale,
                  doc_date: e.value,
                });

                let newError = error;
                newError.doc_date = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].pilih_tgl}
              showIcon
              dateFormat="dd-mm-yy"
              // error={error?.doc_date}
            />
          </div>

          <div className="col-12 mt-3">
            <span className="fs-14">
              <b>{`${tr[localStorage.getItem("language")].info} ${
                tr[localStorage.getItem("language")].ord
              }`}</b>
            </span>
            <Divider className="mt-2"></Divider>
          </div>

          <div className="col-3">
            {isEdit ? (
              <PrimeInput
                label={tr[localStorage.getItem("language")].kd_so}
                value={sale?.so_id?.so_code}
                placeholder={tr[localStorage.getItem("language")].kd_so}
                disabled
              />
            ) : (
              <PrimeDropdown
                label={tr[localStorage.getItem("language")].kd_so}
                value={sale.so_id && checkSO(sale.so_id)}
                options={so}
                onChange={(e) => {
                  let result = new Date(`${sale.ord_date}Z`);
                  result.setDate(
                    result.getDate() + checkRulesP(e.value.top?.id)?.day
                  );

                  e.value.sprod?.forEach((element) => {
                    element.stock = 0;
                    sto?.forEach((elem) => {
                      if (
                        element.location === elem.loc_id &&
                        element.prod_id === elem.id
                      ) {
                        element.stock = elem.stock;
                      }
                    });
                  });

                  getRak();

                  updateSL({
                    ...sale,
                    so_id: e?.value?.id ?? null,
                    due_date: result,
                    top: e.value.top.id ?? null,
                    pel_id: e.value.pel_id?.id ?? null,
                    sub_addr: e.value.sub_addr ?? null,
                    sub_id: e.value.sub_id?.id ?? null,
                    jprod: e.value.sprod.map((v) => {
                      return {
                        ...v,
                        req: v.order,
                        order: 0,
                        total: 0,
                        total_fc: 0,
                      };
                    }),
                    jjasa: e.value.sjasa.map((v) => {
                      return {
                        ...v,
                        order: v.qty,
                        unit_id: null,
                        total: 0,
                        total_fc:
                          checkSupp(v.sup_id)?.supplier?.sup_curren !== null
                            ? v.qty * v.price
                            : 0,
                      };
                    }),
                  });
                  let newError = error;
                  newError.pel = false;
                  newError.rul = false;

                  newError.prod.push({
                    id: false,
                    lok: false,
                    jum: true,
                    prc: false,
                  });

                  let ejasa = [];
                  e?.sjasa?.forEach((el) => {
                    ejasa.push({
                      id: false,
                      // jum: false,
                      prc: false,
                    });
                  });
                  newError.jasa = ejasa;

                  setError(newError);
                }}
                optionLabel={"[so_code] ([pel_id.cus_name])"}
                placeholder={tr[localStorage.getItem("language")].pilih}
                filter
                filterBy="so_code"
                itemTemplate={soTemplate}
                valueTemplate={valTemp}
              />
            )}
          </div>

          <div className="col-9"></div>

          <div className="col-12 mt-3">
            <span className="fs-14">
              <b>Pelanggan</b>
            </span>
            <Divider className="mt-2"></Divider>
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].customer}
            </label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={sale.pel_id !== null ? checkCus(sale.pel_id) : null}
              option={customer}
              onChange={(e) => {
                updateSL({ ...sale, pel_id: e.customer.id });

                let newError = error;
                newError.pel = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].pilih}
              detail
              onDetail={() => setShowCustomer(true)}
              label={"[displayName]"}
              errorMessage="Pelanggan Belum Dipilih"
              error={error?.pel}
              disabled={sale && sale.so_id}
            />
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].proj}
            </label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={sale.proj_id !== null ? checkProj(sale.proj_id) : null}
              option={project}
              onChange={(e) => {
                updateSL({ ...sale, proj_id: e.id });
              }}
              placeholder={tr[localStorage.getItem("language")].pilih}
              detail
              onDetail={() => setShowProj(true)}
              label={"[proj_name]"}
            />
          </div>

          <div className="col-6"></div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].alamat}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={
                  sale.pel_id !== null
                    ? checkCus(sale.pel_id)?.customer?.cus_address
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
              isNumber
              value={
                sale.pel_id !== null
                  ? checkCus(sale.pel_id)?.customer?.cus_telp1
                  : ""
              }
              placeholder={tr[localStorage.getItem("language")].telp}
              disabled
            />
          </div>

          <div className="col-2">
            <label className="text-label">
              {tr[localStorage.getItem("language")].type_pjk}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={
                  sale.pel_id !== null
                    ? checkPpn(checkCus(sale.pel_id)?.pajak?.id).name
                    : null
                }
                placeholder={tr[localStorage.getItem("language")].type_pjk}
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
                  checkCus(sale.pel_id)?.customer?.cus_curren !== null
                    ? checkCur(checkCus(sale.pel_id)?.customer?.cus_curren).code
                    : "IDR"
                }
                onChange={(e) => {}}
                placeholder={tr[localStorage.getItem("language")].currency}
                disabled
              />
            </div>
          </div>

          <div className="col-12 mt-3">
            <span className="fs-14">
              <b>{`${tr[localStorage.getItem("language")].info} ${
                tr[localStorage.getItem("language")].bayar
              }`}</b>
            </span>
            {/* </div>
          <div className="col-12"> */}
            <Divider className="mt-2"></Divider>
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].syarat}
            </label>
            <div className="p-inputgroup mt-0"></div>
            <CustomDropdown
              value={sale.top !== null ? checkRulesP(sale.top) : null}
              option={rulesPay}
              onChange={(e) => {
                let result = new Date(`${sale.ord_date}Z`);
                result.setDate(result.getDate() + e.day);

                updateSL({ ...sale, top: e.id, due_date: result });

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
              // disabled={sale && sale.so_id}
            />
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].due}
            </label>
            <div className="p-inputgroup mt-0">
              <Calendar
                value={new Date(`${sale?.due_date}Z`)}
                onChange={(e) => {}}
                placeholder={tr[localStorage.getItem("language")].due}
                disabled
                dateFormat="dd-mm-yy"
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].salesmn}
            </label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={sale.slsm_id && checkSales(sale.slsm_id)}
              option={salesman}
              onChange={(e) => {
                updateSL({ ...sale, slsm_id: e.id });

                let newError = error;
                newError.sls = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].pilih}
              onDetail={() => setShowSalesman(true)}
              label={"[sales_name]"}
              // errorMessage="Salesman Belum Dipilih"
              // error={error?.sls}
            />
          </div>

          <div className="col-3 mt-2" hidden>
            <label className="text-label"></label>
            <div className="p-inputgroup">
              <SelectButton
                value={
                  sale?.surat_jalan !== null && sale?.surat_jalan !== ""
                    ? sale?.surat_jalan === 1
                      ? { name: "Invoice", kode: 1 }
                      : { name: "Invoice + Faktur", kode: 2 }
                    : null
                }
                options={surjal}
                onChange={(e) => {
                  console.log(e.value);
                  updateSL({
                    ...sale,
                    surat_jalan: e.value.kode,
                  });
                }}
                optionLabel="name"
              />
            </div>
          </div>

          <div className="d-flex col-12 align-items-center mt-4">
            <label className="ml-0 mt-1 fs-12">
              <b>{tr[localStorage.getItem("language")].kirim_sub}</b>
            </label>
            <InputSwitch
              className="ml-4"
              checked={sale.sub_addr}
              onChange={(e) => {
                updateSL({ ...sale, sub_addr: e.target.value });
              }}
              // disabled={sale && sale.so_id}
            />
          </div>

          {sale.sub_addr === true && (
            <>
              <div className="col-4">
                <label className="text-black fs-14">
                  {tr[localStorage.getItem("language")].pel_sub}
                </label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={sale.sub_id ? checkSubCus(sale.sub_id) : null}
                  option={subCus}
                  onChange={(e) => {
                    updateSL({ ...sale, sub_id: e.customer.id });

                    let newError = error;
                    newError.sub = false;
                    setError(newError);
                  }}
                  placeholder={tr[localStorage.getItem("language")].pilih}
                  label={"[customer.cus_name]"}
                  detail
                  onDetail={() => setShowSub(true)}
                  errorMessage="Sub Pelanggan Belum Dipilih"
                  error={error?.sub}
                  disabled={sale && sale.so_id}
                />
              </div>

              <div className="col-4">
                <label className="text-black fs-14">
                  {tr[localStorage.getItem("language")].alamat}
                </label>
                <div className="p-inputgroup mt-1">
                  <InputText
                    value={
                      sale.sub_id !== null
                        ? checkSubCus(sale.sub_id)?.customer?.cus_address
                        : ""
                    }
                    placeholder={tr[localStorage.getItem("language")].alamat}
                    disabled
                  />
                </div>
              </div>

              <div className="col-4">
                <label className="text-black fs-14">
                  {tr[localStorage.getItem("language")].cp}
                </label>
                <div className="p-inputgroup mt-1">
                  <InputText
                    value={
                      sale.sub_id !== null
                        ? checkSubCus(sale.sub_id)?.customer?.cus_telp1
                        : ""
                    }
                    placeholder={tr[localStorage.getItem("language")].cp}
                    disabled
                  />
                </div>
              </div>
            </>
          )}
        </Row>

        <CustomAccordion
          tittle={`${tr[localStorage.getItem("language")].ord} ${
            tr[localStorage.getItem("language")].prod
          }`}
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
                  value={sale?.jprod.map((v, i) => {
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
                    field={""}
                    style={{
                      minWidth: "20rem",
                    }}
                    body={(e) => (
                      <CustomDropdown
                        value={e.prod_id && checkProd(e.prod_id)}
                        option={product}
                        onChange={(u) => {
                          let sat = [];
                          let st = 0;
                          satuan.forEach((element) => {
                            if (element.id === u.unit.id) {
                              sat.push(element);
                            } else {
                              if (element.u_from?.id === u.unit.id) {
                                sat.push(element);
                              }
                            }
                          });

                          sto?.forEach((elem) => {
                            if (
                              elem.id === u.id &&
                              elem.loc_id === sale?.jprod[e.index].location
                            ) {
                              st = elem.stock;
                            }
                          });

                          let temp = [...sale.jprod];
                          temp[e.index].prod_id = u.id;
                          temp[e.index].unit_id = u.unit?.id;
                          temp[e.index].konv_qty = 0;
                          temp[e.index].unit_konv =
                            checkUnit(temp[e.index].unit_id)?.u_from !== null
                              ? checkUnit(temp[e.index].unit_id)?.u_from?.name
                              : checkUnit(temp[e.index].unit_id)?.name;

                          temp[e.index].stock = st;
                          updateSL({ ...sale, jprod: temp });

                          let newError = error;
                          newError.prod[e.index].id = false;
                          setError(newError);
                        }}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        label={"[name] ([code])"}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowProduk(true);
                        }}
                        errorMessage="Produk Belum Dipilih"
                        error={error?.prod[e.index]?.id}
                        disabled={sale && sale.so_id}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].gudang}
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <CustomDropdown
                        value={e.location && checkLoc(e.location)}
                        onChange={(u) => {
                          let st = 0;

                          sto?.forEach((element) => {
                            if (
                              element.loc_id === u.id &&
                              element.id === sale?.jprod[e.index].prod_id
                            ) {
                              st = element.stock;
                            }
                          });

                          let temp = [...sale.jprod];
                          temp[e.index].location = u.id;
                          temp[e.index].stock = st;
                          updateSL({ ...sale, jprod: temp });

                          let newError = error;
                          newError.prod[e.index].lok = false;
                          setError(newError);
                        }}
                        option={lokasi}
                        label={"[name] ([code])"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowLok(true);
                        }}
                        errorMessage="Lokasi Belum Dipilih"
                        error={error?.prod[e.index]?.lok}
                        disabled={sale && sale.so_id}
                      />
                    )}
                  />

                  <Column
                    hidden
                    header={"Rak Aktif"}
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "6rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputSwitch
                          className="ml-0"
                          checked={e.rak_aktif ?? false}
                          onChange={(u) => {
                            let temp = [...sale.jprod];
                            temp[e.index].rak_aktif = u?.value;
                            temp[e.index].rak_id = null;
                            updateSL({ ...sale, jprod: temp });
                          }}
                          disabled={sale?.so_id || e?.location == null}
                        />
                      </div>
                    )}
                  />

                  <Column
                    hidden={!setup?.rak_option}
                    header={"Rak"}
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.rak_id && checkRak(e.rak_id)}
                        onChange={(u) => {
                          // let st = 0;

                          // sto?.forEach((element) => {
                          //   if (
                          //     element.loc_id === u.id &&
                          //     element.id === sale?.jprod[e.index].prod_id
                          //   ) {
                          //     st = element.stock;
                          //   }
                          // });

                          let temp = [...sale.jprod];
                          temp[e.index].rak_id = u?.value?.id ?? null;
                          // temp[e.index].stock = st;
                          updateSL({ ...sale, jprod: temp });

                          // let newError = error;
                          // newError.prod[e.index].lok = false;
                          // setError(newError);
                        }}
                        options={rak.filter(
                          (el) => el?.lokasi_rak == e.location
                        )}
                        optionLabel={"rak_name"}
                        filter
                        filterBy={"rak_name"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        showClear
                        // disabled={sale.so_id || !e.rak_aktif}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].stok}
                    className="align-text-top"
                    style={{
                      minWidth: "7rem",
                    }}
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e?.stock ?? 0}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled
                      />
                    )}
                  />

                  <Column
                    hidden={sale.so_id === null}
                    header={tr[localStorage.getItem("language")].ord}
                    className="align-text-top"
                    style={{
                      minWidth: "8rem",
                    }}
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.req && e.req}
                        onChange={(u) => {
                          let temp = [...sale.jprod];
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
                      minWidth: "8rem",
                    }}
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.order && e.order}
                        onChange={(u) => {
                          let temp = [...sale.jprod];
                          console.log("qty_unit");
                          console.log(checkUnit(temp[e.index].unit_id)?.qty);
                          if (sale.so_id) {
                            let val =
                              u.value > e.r_remain ? e.r_remain : u?.value;
                            let result =
                              temp[e.index].order - val + temp[e.index].remain;
                            temp[e.index].order = val;

                            temp[e.index].order = u?.value;
                            temp[e.index].konv_qty =
                              u?.value * checkUnit(temp[e.index].unit_id)?.qty;

                            if (
                              sale.pel_id &&
                              checkCus(sale.pel_id)?.customer?.cus_curren !==
                                null
                            ) {
                              if (
                                checkUnit(temp[e.index].unit_id)?.u_from !==
                                null
                              ) {
                                temp[e.index].total_fc =
                                  temp[e.index].konv_qty * temp[e.index].price;

                                temp[e.index].total =
                                  temp[e.index].total_fc * curConv();
                              } else {
                                temp[e.index].total_fc =
                                  temp[e.index].order * temp[e.index].price;

                                temp[e.index].total =
                                  temp[e.index].total_fc * curConv();
                              }
                            } else {
                              if (
                                checkUnit(temp[e.index].unit_id)?.u_from !==
                                null
                              ) {
                                temp[e.index].total =
                                  temp[e.index].order * temp[e.index].price;
                              } else {
                                temp[e.index].total =
                                  temp[e.index].order * temp[e.index].price;
                              }
                            }

                            temp[e.index].remain = result;

                            if (temp[e.index].order > e.req) {
                              temp[e.index].order = e.req;
                              temp[e.index].total =
                                temp[e.index].order * temp[e.index].price;
                            }
                          } else {
                            temp[e.index].order = u?.value;
                            temp[e.index].konv_qty =
                              u.value * checkUnit(temp[e.index].unit_id)?.qty;

                            if (
                              sale.pel_id &&
                              checkCus(sale.pel_id)?.customer?.cus_curren !==
                                null
                            ) {
                              if (
                                checkUnit(temp[e.index].unit_id)?.u_from !==
                                null
                              ) {
                                temp[e.index].total_fc =
                                  temp[e.index].konv_qty * temp[e.index].price;

                                temp[e.index].total =
                                  temp[e.index].total_fc * curConv();
                              } else {
                                temp[e.index].total_fc =
                                  temp[e.index].konv_qty * temp[e.index].price;

                                temp[e.index].total =
                                  temp[e.index].total_fc * curConv();
                              }
                            } else {
                              if (
                                checkUnit(temp[e.index].unit_id)?.u_from !==
                                null
                              ) {
                                temp[e.index].total =
                                  temp[e.index].konv_qty * temp[e.index].price;
                              } else {
                                temp[e.index].total =
                                  temp[e.index].konv_qty * temp[e.index].price;
                              }
                            }
                          }

                          if (
                            temp[e.index].konv_qty >
                            checkProd(e?.prod_id)?.stock
                          ) {
                            temp[e.index].konv_qty = checkProd(
                              e?.prod_id
                            )?.stock;
                          }
                          updateSL({
                            ...sale,
                            jprod: temp,
                            total_b: getSubTotalBarang() + getSubTotalJasa(),
                            total_bayar:
                              getSubTotalBarang() +
                              getSubTotalJasa() +
                              ((getSubTotalBarang() + getSubTotalJasa()) *
                                pjk()) /
                                100,
                          });

                          let newError = error;
                          newError.prod[e.index].jum = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        error={error?.prod[e.index]?.jum}
                        errorMessage={
                          state
                            ? tr[localStorage.getItem("language")].info_sto
                            : null
                        }
                        // disabled={sale && sale.so_id}
                      />
                    )}
                  />

                  <Column
                    hidden
                    header={tr[localStorage.getItem("language")].sisa}
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "7rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.remain ? e.remain : ""}
                        placeholder="0"
                        type="number"
                        disabled
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].sat}
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <CustomDropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        onChange={(t) => {
                          let temp = [...sale.jprod];
                          temp[e.index].unit_id = t.id;
                          temp[e.index].konv_qty = temp[e.index].order * t?.qty;
                          temp[e.index].unit_konv =
                            t?.u_from !== null ? t?.u_from?.name : t?.name;
                          temp[e.index].price = null;
                          temp[e.index].total = null;
                          updateSL({ ...sale, jprod: temp });
                        }}
                        option={satuan}
                        label={"[name]"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowSatuan(true);
                        }}
                        disabled={sale && sale.so_id}
                      />
                    )}
                  />

                  <Column
                    header={"Konversi Qty"}
                    className="align-text-top"
                    style={{
                      minWidth: "8rem",
                    }}
                    field={""}
                    body={(e) => (
                      <>
                        <label className="ml-1">{`${formatIdr(
                          e?.konv_qty ?? 0
                        )} (${e?.unit_konv ?? ""})`}</label>
                      </>
                    )}
                  />

                  <Column
                    header={
                      sale?.pel_id
                        ? checkCus(sale.pel_id)?.customer?.cus_curren !== null
                          ? `${
                              tr[localStorage.getItem("language")].price
                            } (${code})`
                          : `${
                              tr[localStorage.getItem("language")].price
                            } (IDR)`
                        : `${tr[localStorage.getItem("language")].price} (IDR)`
                    }
                    className="align-text-top"
                    style={{
                      minWidth: "13rem",
                    }}
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.price && e.price}
                        onChange={(u) => {
                          let temp = [...sale.jprod];

                          temp[e.index].price = u.value;

                          if (
                            sale.pel_id &&
                            checkCus(sale.pel_id)?.customer?.cus_curren !== null
                          ) {
                            if (
                              checkUnit(temp[e.index].unit_id)?.u_from !== null
                            ) {
                              temp[e.index].total_fc =
                                temp[e.index].order * temp[e.index].price;

                              temp[e.index].total =
                                temp[e.index].total_fc * curConv();

                              // temp[e.index].rate_cur = curConv();
                            } else {
                              temp[e.index].total_fc =
                                temp[e.index].order * temp[e.index].price;

                              temp[e.index].total =
                                temp[e.index].total_fc * curConv();

                              // temp[e.index].rate_cur = curConv();
                            }

                            temp[e.index].price_idr =
                              temp[e.index].price * curConv();
                          } else {
                            if (
                              checkUnit(temp[e.index].unit_id)?.u_from !== null
                            ) {
                              temp[e.index].total =
                                temp[e.index].konv_qty * temp[e.index].price;
                            } else {
                              temp[e.index].total =
                                temp[e.index].konv_qty * temp[e.index].price;
                            }
                          }

                          updateSL({
                            ...sale,
                            jprod: temp,
                            total_b: getSubTotalBarang() + getSubTotalJasa(),
                            total_bayar:
                              getSubTotalBarang() +
                              getSubTotalJasa() +
                              ((getSubTotalBarang() + getSubTotalJasa()) *
                                pjk()) /
                                100,
                          });

                          let newError = error;
                          newError.prod[e.index].prc = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        min={0}
                        error={error?.prod[e.index]?.prc}
                        // disabled={sale && sale.so_id}
                      />
                    )}
                  />

                  <Column
                    hidden={checkCus(sale.pel_id)?.customer?.cus_curren == null}
                    header={`${
                      tr[localStorage.getItem("language")].price
                    } (IDR)`}
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <PrimeNumber
                          price
                          value={e.price_idr ? e.price_idr : null}
                          placeholder="0"
                          type="number"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].disc}
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.disc && e.disc}
                          onChange={(t) => {
                            let temp = [...sale.jprod];
                            temp[e.index].disc = t.target.value;
                            // let disc = temp[e.index].total * temp[e.index].disc / 100

                            // temp[e.index].total -= disc;
                            updateSL({
                              ...sale,
                              jprod: temp,
                              total_b: getSubTotalBarang() + getSubTotalJasa(),
                              total_bayar:
                                getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  pjk()) /
                                  100,
                            });
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
                          disabled={sale && sale.so_id}
                        />
                        <span className="p-inputgroup-addon">%</span>
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].net_prc}
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputNumber
                          value={e.nett_price && e.nett_price}
                          onChange={(t) => {
                            let temp = [...sale.jprod];
                            temp[e.index].nett_price = t.value;
                            updateSL({
                              ...sale,
                              jprod: temp,
                              total_b: getSubTotalBarang() + getSubTotalJasa(),
                              total_bayar:
                                getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  pjk()) /
                                  100,
                            });
                          }}
                          placeholder="0"
                          disabled={sale && sale.so_id}
                        />
                      </div>
                    )}
                  />

                  <Column
                    hidden={checkCus(sale.pel_id)?.customer?.cus_curren == null}
                    header={`Total (${code})`}
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.total_fc - (e.total_fc * e.disc) / 100}
                        onChange={(t) => {}}
                        placeholder="0"
                        disabled
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].total}
                    className="align-text-top"
                    body={(e) => (
                      <label className="text-nowrap">
                        <b>
                          Rp.{" "}
                          {formatIdr(
                            e.nett_price && e.nett_price != 0
                              ? e.nett_price
                              : e.total - (e.total * e.disc) / 100
                          )}
                        </b>
                      </label>
                    )}
                  />

                  <Column
                    className="align-text-top"
                    body={(e) => (
                      <Link
                        onClick={() => {
                          let temp = [...sale.jprod];
                          temp.splice(e.index, 1);
                          updateSL({
                            ...sale,
                            jprod: temp,
                          });
                        }}
                        className="btn btn-danger shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-trash"></i>
                      </Link>
                    )}
                  />
                </DataTable>
              </div>

              <div className="col-12 d-flex justify-content-end">
                <Link
                  onClick={() => {
                    let newError = error;
                    newError.prod.push({ jum: false, prc: false });
                    setError(newError);

                    updateSL({
                      ...sale,
                      jprod: [
                        ...sale.jprod,
                        {
                          id: 0,
                          pj_id: 0,
                          prod_id: null,
                          unit_id: null,
                          location: null,
                          rak_aktif: null,
                          rak_id: null,
                          order: null,
                          konv_qty: 0,
                          unit_konv: null,
                          price: null,
                          price_idr: 0,
                          disc: null,
                          nett_price: null,
                          total_fc: 0,
                          total: null,
                        },
                      ],
                    });
                  }}
                  className="btn btn-primary shadow btn-s sharp ml-1 mt-3"
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

        <CustomAccordion
          tittle={`${tr[localStorage.getItem("language")].ord} ${
            tr[localStorage.getItem("language")].jasa
          }`}
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
            <>
              <DataTable
                responsiveLayout="scroll"
                value={sale?.jjasa.map((v, i) => {
                  return {
                    ...v,
                    index: i,
                    // order: v?.order ?? 0,
                    // price: v?.price ?? 0,
                    // disc: v?.disc ?? 0,
                    // total: v?.total ?? 0,
                  };
                })}
                className="display w-170 datatable-wrapper header-white no-border"
                showGridlines={false}
                emptyMessage={() => <div></div>}
              >
                <Column
                  header={tr[localStorage.getItem("language")].supplier}
                  className="align-text-top"
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={e.sup_id && checkSupp(e.sup_id)}
                      option={supplier}
                      onChange={(t) => {
                        let temp = [...sale.jjasa];
                        temp[e.index].sup_id = t.supplier.id;
                        updateSL({ ...sale, jjasa: temp });
                      }}
                      label={"[supplier.sup_name]"}
                      placeholder={tr[localStorage.getItem("language")].pilih}
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowSupplier(true);
                      }}
                      disabled={sale && sale.so_id}
                    />
                  )}
                />

                <Column
                  header={tr[localStorage.getItem("language")].jasa}
                  className="align-text-top"
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={e.jasa_id && checkjasa(e.jasa_id)}
                      onChange={(t) => {
                        let temp = [...sale.jjasa];
                        temp[e.index].jasa_id = t.jasa.id;
                        updateSL({ ...sale, jjasa: temp });

                        let newError = error;
                        newError.jasa[e.index].id = false;
                        setError(newError);
                      }}
                      option={jasa}
                      label={"[jasa.name]"}
                      placeholder={tr[localStorage.getItem("language")].pilih}
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowJasa(true);
                      }}
                      disabled={sale && sale.so_id}
                      errorMessage="Jasa Belum Dipilih"
                      error={error?.jasa[e.index]?.id}
                    />
                  )}
                />

                <Column
                  hidden
                  header={tr[localStorage.getItem("language")].sat}
                  className="align-text-top"
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={e.unit_id && checkUnit(e.unit_id)}
                      onChange={(t) => {
                        let temp = [...sale.jjasa];
                        temp[e.index].unit_id = t.id;
                        updateSL({ ...sale, jjasa: temp });
                      }}
                      option={satuan}
                      label={"[name]"}
                      placeholder={tr[localStorage.getItem("language")].pilih}
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowSatuan(true);
                      }}
                      disabled={sale && sale.so_id}
                    />
                  )}
                />

                <Column
                  header={tr[localStorage.getItem("language")].qty}
                  className="align-text-top"
                  field={""}
                  body={(e) => (
                    <PrimeNumber
                      value={e.order && e.order}
                      onChange={(u) => {
                        let temp = [
                          ...sale.jjasa.map((v) => {
                            v.order = v.qty;
                            return v;
                          }),
                        ];

                        temp[e.index].order = u.target.value;
                        if (
                          e.sup_id &&
                          checkSupp(e.sup_id)?.supplier?.sup_curren !== null
                        ) {
                          temp[e.index].total_fc =
                            temp[e.index].order * temp[e.index].price;

                          temp[e.index].total =
                            temp[e.index].total_fc * curConvSup();
                        } else {
                          temp[e.index].total =
                            temp[e.index].order * temp[e.index].price;
                        }
                        updateSL({
                          ...sale,
                          jjasa: temp,
                          total_b: getSubTotalBarang() + getSubTotalJasa(),
                          total_bayar:
                            getSubTotalBarang() +
                            getSubTotalJasa() +
                            ((getSubTotalBarang() + getSubTotalJasa()) *
                              pjk()) /
                              100,
                        });

                        let newError = error;
                        newError.jasa[e.index].jum = false;
                        setError(newError);
                      }}
                      placeholder="0"
                      type="number"
                      min={0}
                      disabled={sale && sale.so_id}
                      error={error?.jasa[e.index]?.jum}
                    />
                  )}
                />

                <Column
                  header={tr[localStorage.getItem("language")].price}
                  className="align-text-top"
                  field={""}
                  style={{
                    minWidth: "10rem",
                  }}
                  body={(e) =>
                    e.sup_id &&
                    checkSupp(e.sup_id)?.supplier?.sup_curren !== null ? (
                      <PrimeNumber
                        value={e.price && e.price}
                        onChange={(t) => {
                          let temp = [...sale.jjasa];

                          temp[e.index].price = t.target.value;
                          if (
                            e.sup_id &&
                            checkSupp(e.sup_id)?.supplier?.sup_curren !== null
                          ) {
                            temp[e.index].total_fc =
                              temp[e.index].order * temp[e.index].price;

                            temp[e.index].total =
                              temp[e.index].total_fc * curConv();
                          } else {
                            temp[e.index].total =
                              temp[e.index].order * temp[e.index].price;
                          }
                          updateSL({
                            ...sale,
                            jjasa: temp,
                            total_b: getSubTotalBarang() + getSubTotalJasa(),
                            total_bayar:
                              getSubTotalBarang() +
                              getSubTotalJasa() +
                              ((getSubTotalBarang() + getSubTotalJasa()) *
                                pjk()) /
                                100,
                          });
                          console.log(temp);
                          let newError = error;
                          newError.jasa[e.index].prc = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        min={0}
                        disabled={sale && sale.so_id}
                        error={error?.jasa[e.index]?.prc}
                      />
                    ) : (
                      <PrimeNumber
                        price
                        value={e.price && e.price}
                        onChange={(t) => {
                          let temp = [...sale.jjasa];

                          temp[e.index].price = t.value;
                          if (
                            e.sup_id &&
                            checkSupp(e.sup_id)?.supplier?.sup_curren !== null
                          ) {
                            temp[e.index].total_fc =
                              temp[e.index].order * temp[e.index].price;

                            temp[e.index].total =
                              temp[e.index].total_fc * curConv();
                          } else {
                            temp[e.index].total =
                              temp[e.index].order * temp[e.index].price;
                          }
                          updateSL({
                            ...sale,
                            jjasa: temp,
                            total_b: getSubTotalBarang() + getSubTotalJasa(),
                            total_bayar:
                              getSubTotalBarang() +
                              getSubTotalJasa() +
                              ((getSubTotalBarang() + getSubTotalJasa()) *
                                pjk()) /
                                100,
                          });
                          console.log(temp);
                          let newError = error;
                          newError.jasa[e.index].prc = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        min={0}
                        disabled={sale && sale.so_id}
                        error={error?.jasa[e.index]?.prc}
                      />
                    )
                  }
                />

                <Column
                  header={tr[localStorage.getItem("language")].disc}
                  className="align-text-top"
                  field={""}
                  style={{
                    minWidth: "10rem",
                  }}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.disc && e.disc}
                        onChange={(t) => {
                          let temp = [...sale.jjasa];
                          temp[e.index].disc = t.target.value;
                          updateSL({
                            ...sale,
                            jjasa: temp,
                            total_b: getSubTotalBarang() + getSubTotalJasa(),
                            total_bayar:
                              getSubTotalBarang() +
                              getSubTotalJasa() +
                              ((getSubTotalBarang() + getSubTotalJasa()) *
                                pjk()) /
                                100,
                          });
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled={sale && sale.so_id}
                      />
                      <span className="p-inputgroup-addon">%</span>
                    </div>
                  )}
                />

                <Column
                  header={tr[localStorage.getItem("language")].total}
                  className="align-text-top"
                  body={(e) => (
                    <label className="text-nowrap">
                      <b>Rp. {formatIdr(e.total - (e.total * e.disc) / 100)}</b>
                    </label>
                  )}
                />

                <Column
                  className="align-text-top"
                  body={(e) => (
                    <Link
                      onClick={() => {
                        let temp = [...sale.jjasa];
                        temp.splice(e.index, 1);
                        updateSL({
                          ...sale,
                          jjasa: temp,
                        });
                      }}
                      className="btn btn-danger shadow btn-xs sharp ml-1"
                    >
                      <i className="fa fa-trash"></i>
                    </Link>
                  )}
                />
              </DataTable>

              <div className="col-12 d-flex justify-content-end">
                <Link
                  onClick={() => {
                    let newError = error;
                    newError.jasa.push({ jum: false, prc: false });
                    setError(newError);

                    updateSL({
                      ...sale,
                      jjasa: [
                        ...sale.jjasa,
                        {
                          id: 0,
                          jasa_id: null,
                          unit_id: null,
                          sup_id: null,
                          order: null,
                          price: null,
                          disc: null,
                          nett_price: null,
                          total_fc: null,
                          total: null,
                        },
                      ],
                    });
                  }}
                  className="btn btn-primary shadow btn-s sharp ml-1 mt-3"
                >
                  <span className="align-middle mx-1">
                    <i className="fa fa-plus"></i>{" "}
                    {tr[localStorage.getItem("language")].tambh}
                  </span>
                </Link>
              </div>
            </>
          }
        />

        <div className="row ml-0 mr-0 mb-0 mt-6 justify-content-between">
          <div>
            <div className="row ml-1">
              {sale.jjasa.length > 0 && sale.jprod.length > 0 && (
                <div className="d-flex col-12 align-items-center">
                  <label className="mt-1">
                    {tr[localStorage.getItem("language")].split}
                  </label>
                  <InputSwitch
                    className="ml-4"
                    checked={sale.split_inv}
                    onChange={(e) => {
                      if (e.value) {
                        updateSL({
                          ...sale,
                          split_inv: e.value,
                          total_disc: null,
                        });
                      } else {
                        updateSL({
                          ...sale,
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
                {sale.split_inv
                  ? tr[localStorage.getItem("language")].ttl_barang
                  : tr[localStorage.getItem("language")].sub_ttl}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {sale.split_inv ? (
                  <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                ) : (
                  <b>
                    Rp. {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                  </b>
                )}
              </label>
            </div>

            <div className="col-6 mt-2">
              <label className="text-label">
                {tr[localStorage.getItem("language")].disc_tambh}
              </label>
            </div>

            <div className="col-3">
              <div className="p-inputgroup">
                <PButton label="Rp." className={"p-button-outlined"} />
                <PrimeNumber
                  price
                  value={sale.total_disc_rp ?? null}
                  placeholder="0"
                  min={0}
                  onChange={(e) => {
                    let disc_persen = 0;
                    if (sale?.split_inv) {
                      disc_persen = (e.value / getSubTotalBarang()) * 100;
                    } else {
                      disc_persen =
                        (e.value / (getSubTotalBarang() + getSubTotalJasa())) *
                        100;
                    }

                    updateSL({
                      ...sale,
                      total_disc_rp: e.value,
                      total_disc: disc_persen,
                      total_b: getSubTotalBarang() + getSubTotalJasa(),
                      total_bayar:
                        getSubTotalBarang() +
                        getSubTotalJasa() -
                        e.value +
                        ((getSubTotalBarang() + getSubTotalJasa()) * pjk()) /
                          100,
                    });
                  }}
                />
              </div>
            </div>

            <div className="col-3">
              <div className="p-inputgroup">
                <PButton className={"p-button-outlined"}>
                  {" "}
                  <b>%</b>{" "}
                </PButton>
                <PrimeNumber
                  price
                  value={sale.total_disc ?? null}
                  placeholder="0"
                  min={0}
                  onChange={(e) => {
                    let disc_rp = 0;

                    if (sale?.split_inv) {
                      disc_rp = (e.value * getSubTotalBarang()) / 100;
                    } else {
                      disc_rp =
                        (e.value * (getSubTotalBarang() + getSubTotalJasa())) /
                        100;
                    }
                    updateSL({
                      ...sale,
                      total_disc: e.value,
                      total_disc_rp: disc_rp,
                      total_b: getSubTotalBarang() + getSubTotalJasa(),
                      total_bayar:
                        getSubTotalBarang() +
                        getSubTotalJasa() -
                        disc_rp +
                        ((getSubTotalBarang() + getSubTotalJasa()) * pjk()) /
                          100,
                    });
                  }}
                />
              </div>
            </div>

            <div className="col-6">
              <label className="text-label">
                {sale.split_inv ? "DPP Barang" : "DPP"}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {sale.split_inv ? (
                  <b>
                    Rp. {formatIdr(getSubTotalBarang() - sale?.total_disc_rp)}
                  </b>
                ) : (
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      getSubTotalBarang() +
                        getSubTotalJasa() -
                        sale?.total_disc_rp
                    )}
                  </b>
                )}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {sale.split_inv
                  ? `${
                      tr[localStorage.getItem("language")].pjk_barang
                    } ${pjk()}%`
                  : tr[localStorage.getItem("language")].pajak}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {sale.split_inv ? (
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      ((getSubTotalBarang() - sale?.total_disc_rp) * pjk()) /
                        100
                    )}
                  </b>
                ) : (
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      ((getSubTotalBarang() +
                        getSubTotalJasa() -
                        sale?.total_disc_rp) *
                        pjk()) /
                        100
                    )}
                  </b>
                )}
              </label>
            </div>

            <div className="col-12">
              <Divider className="ml-12"></Divider>
            </div>

            <div className="col-6">
              <label className="text-label fs-13">
                <b>{`${tr[localStorage.getItem("language")].total} ${
                  tr[localStorage.getItem("language")].bayar
                }`}</b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label fs-13">
                {sale.split_inv ? (
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      getSubTotalBarang() -
                        sale?.total_disc_rp +
                        ((getSubTotalBarang() - sale?.total_disc_rp) * pjk()) /
                          100
                    )}
                  </b>
                ) : (
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      getSubTotalBarang() +
                        getSubTotalJasa() -
                        sale?.total_disc_rp +
                        ((getSubTotalBarang() +
                          getSubTotalJasa() -
                          sale?.total_disc_rp) *
                          pjk()) /
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
              <label className="text-label fs-13">{"Uang Muka"}</label>
            </div>

            <div className="col-6">
              <label className="text-label fs-13">
                <b>Rp. {formatIdr(getUangMuka())}</b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label fs-13">
                <b>{"Sisa Pembayaran"}</b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label fs-13">
                <b>
                  Rp.{" "}
                  {formatIdr(
                    getSubTotalBarang() +
                      getSubTotalJasa() -
                      sale?.total_disc_rp +
                      ((getSubTotalBarang() +
                        getSubTotalJasa() -
                        sale?.total_disc_rp) *
                        pjk()) /
                        100 -
                      getUangMuka()
                  )}
                </b>
              </label>
            </div>

            {sale.split_inv ? (
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
                      className={`${isRjjasa ? "" : "p-button-outlined"}`}
                      onClick={() => setRjjasa(true)}
                    />
                    <InputText
                      value={
                        isRjjasa
                          ? (getSubTotalJasa() * sale.jasa_disc) / 100
                          : sale.jasa_disc
                      }
                      placeholder={
                        tr[localStorage.getItem("language")].disc_tambh
                      }
                      type="number"
                      min={0}
                      onChange={(e) => {
                        let disc = 0;
                        if (isRjjasa) {
                          disc = (e.target.value / getSubTotalJasa()) * 100;
                        } else {
                          disc = e.target.value;
                        }
                        updateSL({ ...sale, jasa_disc: disc });
                      }}
                    />
                    <PButton
                      className={`${isRjjasa ? "p-button-outlined" : ""}`}
                      onClick={() => setRjjasa(false)}
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
                  <label className="fs-14">
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

        <Dialog
          header={tr[localStorage.getItem("language")].info_sto}
          visible={display}
          style={{ width: "30vw" }}
          footer={footerVal("display")}
          onHide={() => {
            setDisplay(false);
          }}
        >
          <div className="ml-3 mr-3">
            <i
              className="pi pi-exclamation-triangle mr-3 align-middle"
              style={{ fontSize: "3rem" }}
            />
            <span>{tr[localStorage.getItem("language")].pesan_sto}</span>
          </div>
        </Dialog>
      </>
    );
  };

  const footerVal = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div>
          <PButton
            label={tr[localStorage.getItem("language")].batal}
            onClick={() => {
              setDisplay(false);
            }}
            className="p-button-text btn-primary"
          />
          <PButton
            label={tr[localStorage.getItem("language")].simpan}
            icon="pi pi-check"
            onClick={() => {
              if (isEdit) {
                setUpdate(true);
                editSale();
              } else {
                setUpdate(true);
                addSale();
              }
            }}
            autoFocus
            loading={update}
          />
        </div>
      </div>
    );
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div>
          <PButton
            label={tr[localStorage.getItem("language")].batal}
            onClick={onCancel}
            className="p-button-text btn-primary"
          />
          <PButton
            label={tr[localStorage.getItem("language")].simpan}
            icon="pi pi-check"
            onClick={() => onSubmit()}
            autoFocus
            loading={update}
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

            let temp = [...sale.jprod];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;
            updateSL({ ...sale, jprod: temp });
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
            let temp = [...sale.jjasa];
            temp[currentIndex].jasa_id = e.data.jasa.id;
            updateSL({ ...sale, jjasa: temp });
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
            let temp = [...sale.jprod];
            temp[currentIndex].unit_id = e.data.id;

            let tempj = [...sale.jjasa];
            tempj[currentIndex].unit_id = e.data.id;
            updateSL({ ...sale, jprod: temp, jjasa: tempj });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

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
            updateSL({ ...sale, top: e.data.id });
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
            let temp = [...sale.jjasa];
            temp[currentIndex].sup_id = e.data.supplier.id;
            updateSL({ ...sale, jjasa: temp });
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
        show={showLokasi}
        onHide={() => {
          setShowLok(false);
        }}
        onInput={(e) => {
          setShowLok(!e);
        }}
        onSuccessInput={(e) => {
          getLoct();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowLok(false);
            let temp = [...sale.jprod];
            temp[currentIndex].location = e.data.id;
            updateSL({ ...sale, jprod: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataSalesman
        data={salesman}
        loading={false}
        popUp={true}
        show={showSalesman}
        onHide={() => {
          setShowSalesman(false);
        }}
        onInput={(e) => {
          setShowSalesman(!e);
        }}
        onSuccessInput={(e) => {
          getSalesman();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSalesman(false);
            updateSL({ ...sale, slsm_id: e.data.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataCustomer
        data={customer}
        loading={false}
        popUp={true}
        show={showCustomer}
        onHide={() => {
          setShowCustomer(false);
        }}
        onInput={(e) => {
          setShowCustomer(!e);
        }}
        onSuccessInput={(e) => {
          getCustomer();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowCustomer(false);
            updateSL({ ...sale, pel_id: e.data.customer.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataCustomer
        data={subCus}
        loading={false}
        popUp={true}
        show={showSubCus}
        onHide={() => {
          setShowSub(false);
        }}
        onInput={(e) => {
          setShowSub(!e);
        }}
        onSuccessInput={(e) => {
          getSubCus();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSub(false);
            updateSL({ ...sale, sub_id: e.data.id });
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

export default InputPenjualan;
