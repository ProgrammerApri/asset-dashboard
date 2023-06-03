import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card, Tooltip } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { RadioButton } from "primereact/radiobutton";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_PO, SET_PRODUCT } from "src/redux/actions";
import DataPusatBiaya from "../../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import DataSupplier from "../../../Mitra/Pemasok/DataPemasok";
import DataRulesPay from "src/jsx/screen/MasterLainnya/RulesPay/DataRulesPay";
import DataPajak from "src/jsx/screen/Master/Pajak/DataPajak";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { el, te } from "date-fns/locale";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataJasa from "src/jsx/screen/Master/Jasa/DataJasa";
import DataProduk from "src/jsx/screen/Master/Produk/DataProduk";
import DataSatuan from "src/jsx/screen/MasterLainnya/Satuan/DataSatuan";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import Histori from "../Histori/Index";
import DataHistori from "../Histori/DataHistori";
import { InputNumber } from "primereact/inputnumber";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import { tr } from "src/data/tr";
import { InputTextarea } from "primereact/inputtextarea";

const defError = {
  code: false,
  date: false,
  req: false,
  rul: false,
  sup: false,
  prod: [
    {
      jum: false,
      prc: false,
    },
  ],
  jasa: [
    {
      jum: false,
      prc: false,
    },
  ],
};

const InputPO = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [check, setCheck] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const po = useSelector((state) => state.po.current);
  const isEdit = useSelector((state) => state.po.editpo);
  const dispatch = useDispatch();
  const [isRp, setRp] = useState(true);
  const [isRpJasa, setRpJasa] = useState(true);
  const [comp, setComp] = useState(null);
  const [pusatBiaya, setPusatBiaya] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [rulesPay, setRulesPay] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [rp, setRequest] = useState(null);
  const [histori, setHistori] = useState(null);
  const [filtHis, setFiltHis] = useState([]);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showSupp, setShowSupp] = useState(false);
  const [showRulesPay, setShowRulesPay] = useState(false);
  const [showPpn, setShowPpn] = useState(false);
  const [showProd, setShowProd] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [showJasa, setShowJasa] = useState(false);
  const [showHistori, setShowHistori] = useState(false);
  // const [product, setProduct] = useState(null);
  const product = useSelector((state) => state.product.list);
  const [jasa, setJasa] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [error, setError] = useState(defError);
  const picker = useRef(null);
  const [file, setFile] = useState(null);
  const [accor, setAccor] = useState({
    produk: true,
    jasa: false,
    sup: true,
  });

  const type = [
    { name: "%", code: "P" },
    { name: "Rp", code: "R" },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getComp();
    getPusatBiaya();
    getSupplier();
    getRulesPay();
    getPpn();
    getRp();
    getProduct(po.ns);
    getJasa();
    getSatuan();
    getHistori();
    getCur();
  }, []);

  const getComp = async () => {
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
        setComp(data);
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

  const getPusatBiaya = async () => {
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
        console.log(data);
        setPusatBiaya(data);
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

  const getPpn = async () => {
    const config = {
      ...endpoints.pajak,
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
        setPpn(data);
      }
    } catch (error) {}
  };

  const getCur = async () => {
    const config = {
      ...endpoints.currency,
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
        setCurrency(data);
      }
    } catch (error) {}
  };

  const getRp = async () => {
    const config = {
      ...endpoints.rPurchase,
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
        data.forEach((elem) => {
          if (isEdit) {
            let prod = [];
            elem.rprod.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
              prod.push({
                ...el,
                r_remain: el.remain,
              });

              let temp = [...po.pprod];
              po.pprod.forEach((e, i) => {
                if (el.id == e.rprod_id) {
                  temp[i].request = el.request;
                  temp[i].r_remain = el.remain + e.order;
                  temp[i].remain = el.remain;
                  updatePo({ ...po, pprod: temp });
                }
              });
            });
            elem.rprod = prod;
            let jasa = [];
            elem.rjasa.forEach((element) => {
              element.jasa_id = element.jasa_id.id;
              element.unit_id = element.unit_id.id;
              jasa.push({
                ...element,
                r_remain: element.remain,
              });

              let temp = [...po.pjasa];
              po.pjasa.forEach((e, i) => {
                if (el.id == e.rjasa_id) {
                  temp[i].request = el.request;
                  temp[i].r_remain = el.remain + e.order;
                  temp[i].remain = el.remain;
                  updatePo({ ...po, pjasa: temp });
                }
              });
            });
            elem.rjasa = jasa;
            filt.push(elem);
          } else {
            if (elem.status !== 2 && elem.apprv_status === 1) {
              let prod = [];
              elem.rprod.forEach((el) => {
                if (el.remain > 0) {
                  el.prod_id = el.prod_id.id;
                  el.unit_id = el.unit_id.id;
                  prod.push({
                    ...el,
                    r_remain: el.remain,
                    order: 0,
                    price: 0,
                    disc: 0,
                    nett_price: 0,
                    total: 0,
                  });
                }
              });
              elem.rprod = prod;
              let jasa = [];
              elem.rjasa.forEach((element) => {
                if (element.remain > 0) {
                  element.jasa_id = element.jasa_id.id;
                  element.unit_id = element.unit_id.id;
                  jasa.push({
                    ...element,
                    sup_id: null,
                    r_remain: element.remain,
                    order: 0,
                    price: 0,
                    disc: 0,
                    nett_price: 0,
                    total: 0,
                  });
                }
              });
              elem.rjasa = jasa;
              filt.push(elem);
            }
          }
        });
        setRequest(filt);
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
        dispatch({
          type: SET_PRODUCT,
          payload: data.filter((v) => v?.group?.stock ? v?.group?.stok === !ns : true),
        });
        // setProduct(data);
        console.log("jsdj");
        console.log(data);
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

  const getHistori = async () => {
    const config = {
      ...endpoints.price_history,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        // let his = [];
        // data.forEach((elem) => {
        //   if (elem.product.id === t.id) {
        //     his.push(elem);
        //   }
        // });
        setHistori(data);
      }
    } catch (error) {}
  };

  const editPO = async () => {
    const config = {
      ...endpoints.editPO,
      endpoint: endpoints.editPO.endpoint + po.id,
      data: po,
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

  const addPO = async () => {
    let d = po;
    d.pprod.forEach((el) => {
      el.order = el.order === "" ? 0 : el.order;
      el.nett_price = el.nett_price === "" ? 0 : el.nett_price;
      el.price = el.order === "" ? 0 : el.price;
      el.disc = el.disc === "" ? 0 : el.disc;
    });
    let ref_supp = [];
    d?.psup.forEach((el) => {
      el.prod_id.forEach((ek, i) => {
        ref_supp.push({
          sup_id: el.sup_id,
          po_id: null,
          prod_id: ek,
          price: el.price[i],
          image: "",
        });
      });
    });
    // d.psup = ref_supp;
    const config = {
      ...endpoints.addPO,
      data: { ...d, note: d?.note ?? null, psup: ref_supp },
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
            summary: tr[localStorage.getItem("language")].gagal,
            detail: `Kode ${po.po_code} Sudah Digunakan`,
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

  const req_pur = (value) => {
    let selected = {};
    rp?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const dept = (value) => {
    let selected = {};
    pusatBiaya?.forEach((element) => {
      if (element.id === `${value}`) {
        selected = element;
      }
    });
    return selected;
  };

  const pjk = (value) => {
    let selected = {};
    ppn?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const supp = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element.supplier.id) {
        selected = element;
      }
    });

    return selected;
  };

  const cur = (value) => {
    let selected = {};
    currency?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const suppH = (value) => {
    let selected = {};
    filtHis?.forEach((element) => {
      if (value === element.supplier?.id) {
        selected = element;
      }
    });

    return selected;
  };

  const rulPay = (value) => {
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
        console.log(selected);
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

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editPO();
      } else {
        setUpdate(true);
        addPO();
      }
    }
  };

  const uploadImage = async () => {
    if (file) {
      const config = {
        ...endpoints.uploadImage,
        data: {
          image: file,
        },
      };
      console.log(config.data);
      let response = null;
      try {
        response = await request(null, config, {
          "Content-Type": "multipart/form-data",
        });
        console.log(response);
        if (response.status) {
          if (isEdit) {
            editPO(response.data);
          } else {
            addPO(response.data);
          }
        }
      } catch (error) {
        if (isEdit) {
          editPO("");
        } else {
          addPO("");
        }
      }
    } else {
      if (isEdit) {
        editPO("");
      } else {
        addPO("");
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

    return [year, month, day].join("-");
  };

  const updatePo = (e) => {
    dispatch({
      type: SET_CURRENT_PO,
      payload: e,
    });
  };

  const getSubTotalBarang = () => {
    let total = 0;
    po?.pprod?.forEach((el) => {
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
    po?.pjasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return total;
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !po.po_code || po.po_code === "",
      date: !po.po_date || po.po_date === "",
      req: !po?.preq_id,
      rul: !po?.top,
      sup: po.ref_sup === false ? !po.sup_id : false,
      prod: [],
      jasa: [],
    };

    po?.pprod?.forEach((element, i) => {
      if (i > 0) {
        if (element?.order || element?.price) {
          errors.prod[i] = {
            jum:
              !element?.order ||
              element?.order === "" ||
              element?.order === "0",
            prc:
              !element?.price ||
              element?.price === "" ||
              element?.price === "0",
          };
        }
      } else {
        errors.prod[i] = {
          jum:
            !element?.order || element?.order === "" || element?.order === "0",
          prc:
            !element?.price || element?.price === "" || element?.price === "0",
        };
      }
    });

    po?.pjasa?.forEach((element, i) => {
      if (i > 0) {
        if (element.order || element.price) {
          errors.jasa[i] = {
            jum:
              !element.order || element.order === "" || element.order === "0",
            prc:
              !element.price || element.price === "" || element.price === "0",
          };
        }
      } else {
        errors.jasa[i] = {
          jum: !element.order || element.order === "" || element.order === "0",
          prc: !element.price || element.price === "" || element.price === "0",
        };
      }
    });

    if (po?.pprod?.length) {
      if (!errors.prod[0]?.jum && !errors.prod[0]?.prc) {
        errors.jasa?.forEach((e) => {
          for (var key in e) {
            e[key] = false;
          }
        });
      }
    }

    if (po?.pjasa.length) {
      if (!errors.jasa[0]?.jum && !errors.jasa[0]?.prc) {
        errors.prod?.forEach((e) => {
          for (var key in e) {
            e[key] = false;
          }
        });
      }
    }

    let validProduct = false;
    let validJasa = false;
    errors.prod?.forEach((el) => {
      for (var k in el) {
        validProduct = !el[k];
      }
    });
    if (!validProduct) {
      errors.jasa?.forEach((el) => {
        for (var k in el) {
          validJasa = !el[k];
        }
      });
    }

    valid =
      !errors.code &&
      !errors.date &&
      !errors.req &&
      !errors.sup &&
      !errors.rul &&
      (validProduct || validJasa);

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

  const pajk = (value) => {
    let nil = 0;
    ppn?.forEach((elem) => {
      if (supp(po.sup_id)?.supplier?.sup_ppn === elem.id) {
        nil = elem.nilai;
      }
    });
    return nil;
  };

  const curConv = () => {
    let cur = 0;
    currency?.forEach((elem) => {
      if (supp(po.sup_id)?.supplier?.sup_curren === elem.id) {
        cur = elem.rate;
      }
    });

    return cur;
  };

  const body = () => {
    let date = new Date(comp?.year_co, comp?.cutoff - 1, 31);
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-5">
          <div className="col-3">
            <PrimeInput
              label={tr[localStorage.getItem("language")].kd_ord}
              value={po.po_code}
              onChange={(e) => {
                updatePo({ ...po, po_code: e.target.value });
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
              value={new Date(`${po.po_date}Z`)}
              onChange={(e) => {
                let result = new Date(e.value);
                result.setDate(result.getDate() + e.day);
                console.log(result);

                updatePo({ ...po, po_date: e.value, due_date: result });
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

          <div className="col-7"></div>

          <div className="col-12 p-0">
            <div className="mt-4 mb-2 ml-3 mr-3 fs-14">
              <b>{tr[localStorage.getItem("language")].req}</b>
            </div>
            <Divider className="mb-2 ml-3 mr-3"></Divider>
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].kd_req}
            </label>
            <div className="p-inputgroup"></div>
            <PrimeDropdown
              value={po.preq_id && req_pur(po.preq_id)}
              options={rp}
              onChange={(e) => {
                let result = null;
                if (po.top) {
                  result = new Date(`${po.po_date}Z`);
                  result.setDate(result.getDate() + rulPay(po?.top)?.day);
                  console.log(result);
                }

                let prod = [];
                let prc = [];
                e?.value.rprod.forEach((element) => {
                  prod.push(element.prod_id);
                  prc.push(0);
                });
                let psup = [
                  {
                    sup_id: 0,
                    prod_id: prod,
                    price: prc,
                    image: null,
                  },
                ];

                updatePo({
                  ...po,
                  preq_id: e.value.id,
                  due_date: result,
                  sup_id: e.value.ref_sup?.id ?? null,
                  dep_id: e.value.req_dep?.id ?? null,
                  split_inv: false,
                  ns: e.value?.ns ?? false,
                  pprod: e.value.rprod ?? null,
                  pjasa: e.value.rjasa ?? null,
                  psup: psup,
                });

                let newError = error;
                let ep = [];
                newError.req = false;
                newError.sup = false;
                e?.value.rprod?.forEach((element) => {
                  ep.push({
                    jum: false,
                    prc: false,
                  });
                });

                newError.prod = ep;
                newError.jasa.push({ jum: false, prc: false });
                setError(newError);

                getProduct(e.value?.ns);
              }}
              optionLabel="req_code"
              placeholder={tr[localStorage.getItem("language")].pilih}
              filter
              filterBy="req_code"
              errorMessage="No. Permintaan Belum Dipilih"
              error={error?.req}
              disabled={isEdit}
            />
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].dep}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={
                  po?.preq_id ? req_pur(po.preq_id)?.req_dep?.ccost_name : null
                }
                placeholder={tr[localStorage.getItem("language")].dep}
                disabled
              />
            </div>
          </div>

          <div className="col-6" />

          {po && po?.ref_sup === false && (
            <>
              <div className="col-3">
                <label className="text-label">
                  {tr[localStorage.getItem("language")].supplier}
                </label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={po?.sup_id ? supp(po?.sup_id) : null}
                  option={supplier}
                  onChange={(e) => {
                    updatePo({ ...po, sup_id: e.supplier?.id });
                    let newError = error;
                    newError.sup = false;
                    setError(newError);
                  }}
                  placeholder={tr[localStorage.getItem("language")].pilih}
                  detail
                  onDetail={() => setShowSupplier(true)}
                  label={"[supplier.sup_name]"}
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
                      po.sup_id !== null
                        ? supp(po.sup_id)?.supplier?.sup_address
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
                    po.sup_id !== null
                      ? supp(po.sup_id)?.supplier?.sup_telp1
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
                      po.sup_id !== null
                        ? pjk(supp(po.sup_id)?.supplier?.sup_ppn).name
                        : null
                    }
                    onChange={(e) => {
                      updatePo({ ...po, ppn_type: e.target.value });
                    }}
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
                      supp(po.sup_id)?.supplier?.sup_curren !== null
                        ? cur(supp(po.sup_id)?.supplier?.sup_curren).code
                        : "IDR"
                    }
                    onChange={(e) => {
                      // updatePo({ ...po, ppn_type: e.target.value });
                    }}
                    placeholder={tr[localStorage.getItem("language")].currency}
                    disabled
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex col-12 align-items-center mt-4">
            <label className="ml-0 mt-1 fs-12">
              <b>{"Tambah Referensi Supplier"}</b>
            </label>
            <InputSwitch
              className="ml-4"
              checked={po && po.ref_sup}
              onChange={(e) => {
                let newError = error;
                newError.sup = false;
                setError(newError);

                updatePo({ ...po, ref_sup: e.target.value });
              }}
            />
          </div>

          {po && po.ref_sup === true && (
            <>
              {po?.psup?.length ? (
                <>
                  <Col className="ml-0 mr-0 p-0">
                    <DataTable
                      responsiveLayout="none"
                      // value={[
                      //   {
                      //     sup_id: null,
                      //     prod_id: ["produk 1", "produk 2", "produk 3"],
                      //     price: [1000, 200, 0],
                      //   },
                      // ]}
                      value={po.psup?.map((v, i) => {
                        return {
                          ...v,
                          index: i,
                          price: v?.price ?? 0,
                        };
                      })}
                      className="display w-150 datatable-wrapper header-white no-border"
                      showGridlines={false}
                      emptyMessage={() => <div></div>}
                    >
                      <Column
                        header={tr[localStorage.getItem("language")].supplier}
                        className="align-text-top"
                        field={""}
                        // style={{
                        //   minWidth: "12rem",
                        // }}
                        body={(e) => (
                          <div className="flex">
                            <div className="col-2 ml-0 p-2">
                              <RadioButton
                                inputId="binary"
                                checked={po && po.check}
                                onChange={(e) => {
                                  let temp = [...po.pprod];

                                  po.psup?.forEach((element, i) => {
                                    temp[e.index]?.prod_id.forEach((elem) => {
                                      if (elem === element.prod_id) {
                                        temp[e.index].price = element.price[i];
                                      }
                                      console.log("ckckc");
                                      console.log(elem);
                                    });
                                  });

                                  updatePo({
                                    ...po,
                                    check: e.target.value,
                                    pprod: temp,
                                  });
                                }}
                              />
                            </div>
                            <div className="col-10 ml-0 p-0">
                              <CustomDropdown
                                value={e.sup_id && supp(e.sup_id)}
                                option={supplier}
                                onChange={(t) => {
                                  let temp = [...po.psup];
                                  temp[e.index].sup_id = t.supplier?.id;

                                  histori?.forEach((element) => {
                                    if (element.supplier.id === t.supplier.id) {
                                      temp[e.index]?.prod_id?.forEach(
                                        (elem, i) => {
                                          if (elem === element.product.id) {
                                            temp[e.index].price[i] =
                                              element.price;
                                          }
                                        }
                                      );
                                    }
                                  });
                                  updatePo({ ...po, psup: temp });
                                }}
                                placeholder={
                                  tr[localStorage.getItem("language")].pilih
                                }
                                label={"[supplier.sup_name]"}
                                detail
                                onDetail={() => {
                                  setCurrentIndex(e.index);
                                  setShowSupp(true);
                                }}
                              />
                            </div>
                          </div>
                        )}
                      />

                      <Column
                        header={tr[localStorage.getItem("language")].nm_prod}
                        className="align-text-top"
                        field={""}
                        // style={{
                        //   minWidth: "7rem",
                        // }}
                        body={(e) =>
                          //  console.log(e)
                          e?.prod_id?.map((val, i) => {
                            return (
                              <div
                                className={`p-inputgroup${
                                  i > 0 ? " mt-2" : ""
                                }`}
                              >
                                <InputText
                                  value={val && checkProd(val).name}
                                  onChange={(t) => {}}
                                  placeholder={
                                    tr[localStorage.getItem("language")].nm_prod
                                  }
                                  disabled
                                />
                              </div>
                            );
                          })
                        }
                      />

                      <Column
                        header={tr[localStorage.getItem("language")].price}
                        className="align-text-top"
                        field={""}
                        // style={{
                        //   minWidth: "10rem",
                        // }}
                        body={(e) =>
                          e.price?.map((val, i) => {
                            return (
                              <div
                                className={`p-inputgroup${
                                  i > 0 ? " mt-2" : ""
                                }`}
                              >
                                <InputText
                                  value={val ? val : ""}
                                  onChange={(t) => {
                                    let temp = [...po.psup];
                                    temp[e.index].price[i] = t.target.value;

                                    updatePo({ ...po, psup: temp });
                                  }}
                                  min={0}
                                  placeholder="0"
                                  type="number"
                                  // disabled
                                />
                              </div>
                            );
                          })
                        }
                      />

                      <Column
                        header=""
                        style={{ width: "4rem" }}
                        body={(e) => (
                          <div>
                            <Tooltip
                              target=".upload"
                              mouseTrack
                              mouseTrackLeft={10}
                            />
                            <input
                              type="file"
                              id="file"
                              ref={picker}
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                console.log("ceeekk");
                                console.log(e);
                                setFile(e.target.files[0]);
                              }}
                            />

                            <Card.Body
                              className="flex align-items-center justify-content-center p-0"
                              data-pr-tooltip="Upload File"
                              onClick={() => {
                                picker.current.click();
                              }}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              {file ? (
                                <img
                                  style={{ width: "115px", height: "95px" }}
                                  src={URL.createObjectURL(file)}
                                  alt=""
                                />
                              ) : e.image && e.image !== "" ? (
                                <img
                                  style={{ width: "115px", height: "95px" }}
                                  src={e.image}
                                  alt=""
                                />
                              ) : (
                                <i
                                  className="pi pi-image p-4"
                                  style={{
                                    fontSize: "3em",
                                    borderRadius: "10%",
                                    backgroundColor: "var(--surface-d)",
                                    color: "var(--surface-g)",
                                  }}
                                ></i>
                              )}
                            </Card.Body>
                          </div>
                        )}
                      />

                      <Column
                        body={(e) =>
                          e.index === po.psup.length - 1 ? (
                            <Link
                              onClick={() => {
                                let prod = [];
                                let prc = [];
                                po?.pprod?.forEach((element) => {
                                  prod.push(element.prod_id);
                                  prc.push(0);
                                });
                                updatePo({
                                  ...po,
                                  psup: [
                                    ...po.psup,
                                    {
                                      sup_id: 0,
                                      prod_id: prod,
                                      price: prc,
                                      image: null,
                                    },
                                  ],
                                });
                              }}
                              className="btn btn-primary shadow btn-xs sharp ml-1"
                            >
                              <i className="fa fa-plus"></i>
                            </Link>
                          ) : (
                            <Link
                              onClick={() => {
                                let temp = [...po.psup];
                                temp.splice(e.index, 1);
                                updatePo({
                                  ...po,
                                  psup: temp,
                                });
                              }}
                              className="btn btn-danger shadow btn-xs sharp ml-1"
                            >
                              <i className="fa fa-trash"></i>
                            </Link>
                          )
                        }
                      />
                    </DataTable>
                  </Col>
                </>
              ) : (
                <></>
              )}
            </>
          )}

          <div className="col-12 p-0">
            <div className="mt-5 mb-2 ml-3 mr-3 fs-14">
              <b>{tr[localStorage.getItem("language")].bayar}</b>
            </div>
            <Divider className="mb-2 ml-3 mr-3"></Divider>
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].syarat}
            </label>
            <div className="p-inputgroup mt-2"></div>
            <CustomDropdown
              value={po?.top ? rulPay(po.top) : null}
              option={rulesPay}
              onChange={(e) => {
                let result = new Date(`${po.po_date}Z`);
                result.setDate(result.getDate() + e.day);
                console.log(result);

                updatePo({ ...po, top: e.id, due_date: result });

                let newError = error;
                newError.rul = false;
                setError(newError);
              }}
              label={"[name] ([day] Hari)"}
              placeholder={tr[localStorage.getItem("language")].pilih}
              detail
              onDetail={() => setShowRulesPay(true)}
              errorMessage="Syarat Pembayaran Belum Dipilih"
              error={error?.rul}
            />
          </div>

          <div className="col-2">
            <label className="text-label">{`${
              tr[localStorage.getItem("language")].tgl
            } ${tr[localStorage.getItem("language")].req}`}</label>
            <div className="p-inputgroup mt-2">
              <Calendar
                value={new Date(`${req_pur(po.preq_id)?.req_date}Z`)}
                placeholder={`${tr[localStorage.getItem("language")].tgl} ${
                  tr[localStorage.getItem("language")].req
                }`}
                disabled
                dateFormat="dd-mm-yy"
              />
            </div>
          </div>

          <div className="col-2">
            <label className="text-label">
              {tr[localStorage.getItem("language")].due}
            </label>
            <div className="p-inputgroup mt-2">
              <Calendar
                value={new Date(`${po?.due_date}Z`)}
                onChange={(e) => {}}
                placeholder={tr[localStorage.getItem("language")].due}
                disabled
                dateFormat="dd-mm-yy"
              />
            </div>
          </div>

          {/* {po?.preq_id !== null ? (
            <>
              <div className="d-flex col-12 align-items-center mt-4">
                <label className="ml-0 mt-4">{"Non Stock"}</label>
                <InputSwitch
                  className="ml-4 mt-4"
                  checked={po && po.ns}
                  onChange={(e) => {
                    updatePo({ ...po, ns: e.target.value });
                  }}
                  disabled
                />
              </div>
            </>
          ) : (
            <></>
          )} */}
        </Row>

        {po?.pprod?.length ? (
          <CustomAccordion
            tittle={`${tr[localStorage.getItem("language")].req} ${
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
              <>
                <DataTable
                  responsiveLayout="none"
                  // responsiveLayout="scroll"
                  value={po.pprod?.map((v, i) => {
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
                    // style={{
                    //   width: "12rem",
                    // }}
                    body={(e) => (
                      <CustomDropdown
                        value={e.prod_id && checkProd(e.prod_id)}
                        option={product}
                        onChange={(t) => {
                          let sat = [];
                          satuan.forEach((element) => {
                            if (element.id === t.unit.id) {
                              sat.push(element);
                            } else {
                              if (element.u_from?.id === t.unit.id) {
                                sat.push(element);
                              }
                            }
                          });
                          // setSatuan(sat);

                          let temp = [...po.pprod];
                          temp[e.index].prod_id = t.id;
                          temp[e.index].unit_id = t.unit?.id;
                          updatePo({ ...po, pprod: temp });
                        }}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        label={"[name]"}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowProd(true);
                        }}
                      />
                    )}
                  />

                  <Column
                    header=""
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "1rem",
                    }}
                    body={(e) => (
                      <Link
                        onClick={() => {
                          let his = [];
                          histori.forEach((elem) => {
                            if (elem.product.id === e.prod_id) {
                              his.push(elem);
                            }
                          });
                          setFiltHis(his);

                          setCurrentIndex(e.index);
                          setShowHistori(true);
                        }}
                        className="sharp mt-1"
                      >
                        <i className="bx bx-history fs-18"></i>
                      </Link>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].sat}
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   width: "8rem",
                    // }}
                    body={(e) => (
                      <CustomDropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        onChange={(t) => {
                          let temp = [...po.pprod];
                          temp[e.index].unit_id = t.id;
                          updatePo({ ...po, pprod: temp });
                        }}
                        option={satuan}
                        label={"[name]"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowSatuan(true);
                        }}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].req}
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   width: "5rem",
                    // }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <PrimeNumber
                          prc
                          value={e.request ? e.request : ""}
                          onChange={(t) => {
                            let temp = [...po.pprod];
                            temp[e.index].request = t.target.value;
                            updatePo({ ...po, pprod: temp });
                            console.log(temp);
                          }}
                          placeholder="0"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].ord}
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   minWidth: "7rem",
                    // }}
                    body={(e) => (
                      <PrimeNumber
                        prc
                        value={e.order ? e.order : null}
                        onChange={(t) => {
                          let temp = [...po.pprod];
                          let val = t.value > e.r_remain ? e.r_remain : t.value;
                          let result =
                            temp[e.index].order - val + temp[e.index].remain;
                          temp[e.index].order = val;

                          if (supp(po.sup_id)?.supplier?.sup_curren !== null) {
                            temp[e.index].total_fc =
                              temp[e.index].order * temp[e.index].price;

                            temp[e.index].total =
                              temp[e.index].total_fc * curConv();
                          } else {
                            temp[e.index].total =
                              temp[e.index].order * temp[e.index].price;
                          }
                          temp[e.index].remain = result;
                          updatePo({
                            ...po,
                            pprod: temp,
                            total_bayar:
                              getSubTotalBarang() +
                              getSubTotalJasa() +
                              ((getSubTotalBarang() + getSubTotalJasa()) *
                                pajk()) /
                                100,
                          });

                          let newError = error;
                          newError.prod[e.index].jum = false;
                          newError.prod.push({ jum: false });
                          setError(newError);
                        }}
                        min={0}
                        placeholder="0"
                        type="number"
                        error={error?.prod[e.index]?.jum}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].sisa}
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   minWidth: "7rem",
                    // }}
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
                    field={""}
                    // style={{
                    //   minWidth: "10rem",
                    // }}
                    body={(e) =>
                      supp(po.sup_id)?.supplier?.sup_curren !== null ? (
                        <PrimeNumber
                          value={e.price ? e.price : null}
                          onChange={(t) => {
                            let temp = [...po.pprod];
                            temp[e.index].price = t.target.value;
                            if (
                              supp(po.sup_id)?.supplier?.sup_curren !== null
                            ) {
                              temp[e.index].total_fc =
                                temp[e.index].order * temp[e.index].price;

                              temp[e.index].total =
                                temp[e.index].total_fc * curConv();

                              temp[e.index].idr = t.target.value * curConv();
                            } else {
                              temp[e.index].total =
                                temp[e.index].order * temp[e.index].price;
                            }
                            updatePo({
                              ...po,
                              pprod: temp,
                              total_bayar:
                                getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  pajk()) /
                                  100,
                            });

                            let newError = error;
                            newError.prod[e.index].prc = false;
                            setError(newError);
                          }}
                          min={0}
                          placeholder="0"
                          // mode="decimal"
                          // type="number"
                          error={error?.prod[e.index]?.prc}
                        />
                      ) : (
                        <PrimeNumber
                          price
                          value={e.price ? e.price : null}
                          onChange={(t) => {
                            let temp = [...po.pprod];
                            temp[e.index].price = t.value;
                            if (
                              supp(po.sup_id)?.supplier?.sup_curren !== null
                            ) {
                              temp[e.index].total_fc =
                                temp[e.index].order * temp[e.index].price;

                              temp[e.index].total =
                                temp[e.index].total_fc * curConv();
                            } else {
                              temp[e.index].total =
                                temp[e.index].order * temp[e.index].price;
                            }
                            updatePo({
                              ...po,
                              pprod: temp,
                              total_bayar:
                                getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  pajk()) /
                                  100,
                            });

                            let newError = error;
                            newError.prod[e.index].prc = false;
                            setError(newError);
                          }}
                          min={0}
                          placeholder="0"
                          // mode="decimal"
                          // type="number"
                          error={error?.prod[e.index]?.prc}
                        />
                      )
                    }
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].disc}
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   minWidth: "10rem",
                    // }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.disc ? e.disc : ""}
                          onChange={(t) => {
                            let temp = [...po.pprod];
                            temp[e.index].disc = t.target.value;
                            // let disc = temp[e.index].total * temp[e.index].disc / 100
                            // console.log(disc);
                            // temp[e.index].total -= disc;
                            updatePo({ ...po, pprod: temp });
                            console.log(temp);
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
                        />
                        <span className="p-inputgroup-addon">%</span>
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].net_prc}
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   minWidth: "10rem",
                    // }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputNumber
                          value={e.nett_price ? e.nett_price : ""}
                          onChange={(t) => {
                            let temp = [...po.pprod];
                            temp[e.index].nett_price = t.value;
                            updatePo({
                              ...po,
                              pprod: temp,
                              total_bayar:
                                getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  pajk()) /
                                  100,
                            });
                            console.log(temp);
                          }}
                          placeholder="0"
                          min={0}
                        />
                      </div>
                    )}
                  />

                  <Column
                    hidden={
                      po?.sup_id == null ||
                      supp(po?.sup_id)?.supplier?.sup_curren === null
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
                      po?.sup_id == null ||
                      supp(po?.sup_id)?.supplier?.sup_curren === null
                    }
                    header="FC"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "8rem",
                    }}
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
                    body={(e) =>
                      e.index === po.pprod.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.prod.push({ jum: false, prc: false });
                            setError(newError);

                            updatePo({
                              ...po,
                              pprod: [
                                ...po.pprod,
                                {
                                  id: 0,
                                  prod_id: null,
                                  rprod_id: null,
                                  unit_id: null,
                                  order: null,
                                  price: null,
                                  disc: null,
                                  nett_price: null,
                                  total_fc: null,
                                  total: null,
                                },
                              ],
                              psup: po.pprod,
                            });
                          }}
                          className="btn btn-primary shadow btn-xs sharp ml-1"
                        >
                          <i className="fa fa-plus"></i>
                        </Link>
                      ) : (
                        <Link
                          onClick={() => {
                            let temp = [...po.pprod];
                            temp.splice(e.index, 1);
                            updatePo({
                              ...po,
                              pprod: temp,
                            });
                          }}
                          className="btn btn-danger shadow btn-xs sharp ml-1"
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      )
                    }
                  />
                </DataTable>
              </>
            }
          />
        ) : (
          <></>
        )}

        {po?.pjasa?.length ? (
          <div className="d-flex col-12 align-items-center mt-6 mb-2">
            <label className="ml-0 mt-1">{"Supplier Sama Dengan Produk"}</label>
            <InputSwitch
              className="ml-4"
              checked={po.same_sup}
              onChange={(e) => {
                updatePo({
                  ...po,
                  same_sup: e.target.value,
                  pjasa: po.pjasa.map((v) => ({
                    ...v,
                    sup_id: e.target.value === true ? po.sup_id : null,
                    price: null,
                    total_fc: 0,
                    total: 0,
                  })),
                });
                // console.log("==============" + order.sup_id);
              }}
            />
          </div>
        ) : (
          <></>
        )}

        {po?.pjasa?.length ? (
          <CustomAccordion
            tittle={`${tr[localStorage.getItem("language")].req} ${
              tr[localStorage.getItem("language")].jasa
            }`}
            defaultActive={true}
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
                  responsiveLayout="none"
                  value={po.pjasa?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
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
                    field={""}
                    style={{
                      maxWidth: "15rem",
                    }}
                    body={(e) => (
                      <CustomDropdown
                        value={e.sup_id && supp(e.sup_id)}
                        option={supplier}
                        onChange={(t) => {
                          let temp = [...po.pjasa];
                          temp[e.index].sup_id = t.value.supplier.id;
                          updatePo({ ...po, pjasa: temp });
                          console.log(temp);
                        }}
                        label={"[supplier.sup_name]"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowSupplier(true);
                        }}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].jasa}
                    field={""}
                    style={{
                      maxWidth: "15rem",
                    }}
                    body={(e) => (
                      <CustomDropdown
                        value={e.jasa_id && checkjasa(e.jasa_id)}
                        onChange={(t) => {
                          let temp = [...po.pjasa];
                          temp[e.index].jasa_id = t.jasa.id;
                          updatePo({ ...po, pjasa: temp });
                        }}
                        option={jasa}
                        label={"[jasa.name]"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        disabled={e.id !== 0}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].sat}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <Dropdown
                          value={e.unit_id && checkUnit(e.unit_id)}
                          onChange={(t) => {
                            let temp = [...po.pjasa];
                            temp[e.index].unit_id = t.value.id;
                            updatePo({ ...po, pjasa: temp });
                          }}
                          options={satuan}
                          optionLabel="name"
                          placeholder={
                            tr[localStorage.getItem("language")].pilih
                          }
                          filter
                          filterBy="name"
                          disabled={e.id !== 0}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].req}
                    field={""}
                    style={{
                      minWidth: "7rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.request && e.request}
                          onChange={(t) => {
                            let temp = [...po.pjasa];
                            temp[e.index].request = t.target.value;
                            updatePo({ ...po, pjasa: temp });
                            console.log(temp);
                          }}
                          placeholder="0"
                          type="number"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].ord}
                    field={""}
                    style={{
                      minWidth: "7rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        value={e.order ? e.order : ""}
                        onChange={(t) => {
                          let temp = [...po.pjasa];
                          let val =
                            t.target.value > e.r_remain
                              ? e.r_remain
                              : t.target.value;
                          let result =
                            temp[e.index].order - val + temp[e.index].remain;
                          temp[e.index].order = val;

                          temp[e.index].total =
                            temp[e.index].price * temp[e.index].order;
                          temp[e.index].remain = result;
                          updatePo({
                            ...po,
                            pjasa: temp,
                            total_bayar:
                              getSubTotalBarang() +
                              getSubTotalJasa() +
                              ((getSubTotalBarang() + getSubTotalJasa()) *
                                pajk()) /
                                100,
                          });

                          let newError = error;
                          newError.jasa[e.index].jum = false;
                          setError(newError);
                        }}
                        min={0}
                        placeholder="0"
                        type="number"
                        error={error?.jasa[e.index]?.jum}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].sisa}
                    field={""}
                    style={{
                      minWidth: "7rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.remain ? e.remain : 0}
                          placeholder="0"
                          type="number"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].price}
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) =>
                      supp(po.sup_id)?.supplier?.sup_curren !== null ? (
                        <PrimeNumber
                          value={e.price ? e.price : ""}
                          onChange={(u) => {
                            let temp = [...po.pjasa];
                            temp[e.index].price = u.target.value;
                            if (po.same_sup) {
                              if (
                                supp(po.sup_id)?.supplier?.sup_curren !== null
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
                                supp(e.sup_id)?.supplier?.sup_curren !== null
                              ) {
                                temp[e.index].total_fc =
                                  temp[e.index].order * temp[e.index].price;

                                temp[e.index].total =
                                  temp[e.index].total_fc *
                                  cur(supp(e.sup_id)?.supplier?.sup_curren)
                                    ?.rate;
                              } else {
                                temp[e.index].total =
                                  temp[e.index].order * temp[e.index].price;
                              }
                            }

                            updatePo({
                              ...po,
                              pjasa: temp,
                              total_bayar:
                                getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  pajk()) /
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
                        />
                      ) : (
                        <PrimeNumber
                          price
                          value={e.price ? e.price : ""}
                          onChange={(u) => {
                            let temp = [...po.pjasa];
                            temp[e.index].price = u.value;
                            if (po.same_sup) {
                              if (
                                supp(po.sup_id)?.supplier?.sup_curren !== null
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
                                supp(e.sup_id)?.supplier?.sup_curren !== null
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

                            updatePo({
                              ...po,
                              pjasa: temp,
                              total_bayar:
                                getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  pajk()) /
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
                        />
                      )
                    }
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].disc}
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.disc && e.disc}
                          onChange={(t) => {
                            let temp = [...po.pjasa];
                            temp[e.index].disc = t.target.value;
                            updatePo({ ...po, pjasa: temp });
                            console.log(temp);
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
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
                    body={(e) => (
                      <label className="text-nowrap">
                        <b>
                          Rp. {formatIdr(e.total - (e.total * e.disc) / 100)}
                        </b>
                      </label>
                    )}
                  />

                  <Column
                    body={(e) =>
                      e.index === po.pjasa.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.jasa.push({ jum: false, prc: false });
                            setError(newError);

                            updatePo({
                              ...po,
                              pjasa: [
                                ...po.pjasa,
                                {
                                  id: 0,
                                  jasa_id: null,
                                  rjasa_id: null,
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
                          className="btn btn-primary shadow btn-xs sharp ml-1"
                        >
                          <i className="fa fa-plus"></i>
                        </Link>
                      ) : (
                        <Link
                          onClick={() => {
                            let temp = [...po.pjasa];
                            temp.splice(e.index, 1);
                            updatePo({
                              ...po,
                              pjasa: temp,
                            });
                          }}
                          className="btn btn-danger shadow btn-xs sharp ml-1"
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      )
                    }
                  />
                </DataTable>
              </>
            }
          />
        ) : (
          <></>
        )}

        {po?.pprod?.length ? (
          <div className="row ml-0 mr-0 mb-0 mt-6 justify-content-between">
            <div className="col-6 pl-0">
              <label className="text-label">Note</label>
              <div className="p-inputgroup">
                <InputTextarea
                  placeholder="Catatan"
                  value={po.note}
                  onChange={(e) => {
                    updatePo({ ...po, note: e.target.value });
                  }}
                />
              </div>
              <div className="row mt-4">
                {po.pjasa?.length > 0 && po.pprod?.length > 0 && (
                  <div className="d-flex col-12 align-items-center">
                    <label className="mt-1">
                      {tr[localStorage.getItem("language")].split}
                    </label>
                    <InputSwitch
                      className="ml-4"
                      checked={po.split_inv}
                      onChange={(e) => {
                        if (e.value) {
                          updatePo({
                            ...po,
                            split_inv: e.value,
                            total_disc: null,
                          });
                        } else {
                          updatePo({
                            ...po,
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
                  {po.split_inv
                    ? tr[localStorage.getItem("language")].ttl_barang
                    : tr[localStorage.getItem("language")].sub_ttl}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {po.split_inv ? (
                    <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                  ) : (
                    <b>
                      Rp. {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                    </b>
                  )}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {po.split_inv ? "DPP Barang" : "DPP"}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {po.split_inv ? (
                    <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                  ) : (
                    <b>
                      Rp. {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                    </b>
                  )}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {po.split_inv
                    ? `${
                        tr[localStorage.getItem("language")].pjk_barang
                      } (${pajk()}%)`
                    : tr[localStorage.getItem("language")].pajak}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {po.split_inv ? (
                    <b>Rp. {formatIdr((getSubTotalBarang() * pajk()) / 100)}</b>
                  ) : (
                    <b>
                      Rp.{" "}
                      {formatIdr(
                        ((getSubTotalBarang() + getSubTotalJasa()) * pajk()) /
                          100
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
                      po.split_inv
                        ? isRp
                          ? (getSubTotalBarang() * po.prod_disc) / 100
                          : po.prod_disc
                        : isRp
                        ? ((getSubTotalBarang() + getSubTotalJasa()) *
                            po.total_disc) /
                          100
                        : po.total_disc
                    }
                    placeholder={
                      tr[localStorage.getItem("language")].disc_tambh
                    }
                    type="number"
                    min={0}
                    onChange={(e) => {
                      if (po.split_inv) {
                        let disc = 0;
                        if (isRp) {
                          disc = (e.target.value / getSubTotalBarang()) * 100;
                        } else {
                          disc = e.target.value;
                        }
                        updatePo({ ...po, prod_disc: disc });
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
                        updatePo({ ...po, total_disc: disc });
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
                  {po.split_inv ? (
                    <b>
                      Rp.{" "}
                      {formatIdr(
                        getSubTotalBarang() +
                          (getSubTotalBarang() * pajk()) / 100
                      )}
                    </b>
                  ) : (
                    <b>
                      Rp.{" "}
                      {formatIdr(
                        getSubTotalBarang() +
                          getSubTotalJasa() +
                          ((getSubTotalBarang() + getSubTotalJasa()) * pajk()) /
                            100
                      )}
                    </b>
                  )}
                </label>
              </div>

              <div className="col-12">
                <Divider className="ml-12"></Divider>
              </div>

              {po.split_inv ? (
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
                    <label className="text-label">
                      {tr[localStorage.getItem("language")].pjk_jasa} (2%)
                    </label>
                  </div>

                  <div className="col-6">
                    <label className="text-label">
                      <b>Rp. {formatIdr((getSubTotalJasa() * 2) / 100)}</b>
                    </label>
                  </div>

                  <div className="col-6 mt-3">
                    <label className="text-label">
                      {tr[localStorage.getItem("language")].disc_tambh}n
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
                            ? (getSubTotalJasa() * po.jasa_disc) / 100
                            : po.jasa_disc
                        }
                        placeholder={
                          tr[localStorage.getItem("language")].disc_tambh
                        }
                        type="number"
                        min={0}
                        onChange={(e) => {
                          let disc = 0;
                          if (isRpJasa) {
                            disc = (e.target.value / getSubTotalJasa()) * 100;
                          } else {
                            disc = e.target.value;
                          }
                          updatePo({ ...po, jasa_disc: disc });
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
                    <label className="text-label fs-13">
                      <b>{`${tr[localStorage.getItem("language")].total} ${
                        tr[localStorage.getItem("language")].bayar
                      }`}</b>
                    </label>
                  </div>

                  <div className="col-6">
                    <label className="text-label fs-13">
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
        ) : (
          <></>
        )}
      </>
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
            updatePo({ ...po, top: e.data.id });
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
          console.log(e);
          if (doubleClick) {
            setShowSupplier(false);

            // let temp = [...po.pjasa];
            // temp[currentIndex].sup_id = e.data.supplier?.id;
            updatePo({ ...po, sup_id: e.data?.supplier?.id });
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
        show={showSupp}
        onHide={() => {
          setShowSupp(false);
        }}
        onInput={(e) => {
          setShowSupp(!e);
        }}
        onSuccessInput={(e) => {
          getSupplier();
        }}
        onRowSelect={(e) => {
          console.log(e);
          if (doubleClick) {
            setShowSupp(false);

            let temp = [...po.psup];
            temp[currentIndex].sup_id = e.data.supplier?.id;

            histori?.forEach((element) => {
              if (element.supplier.id === e.data.supplier.id) {
                temp[currentIndex]?.prod_id?.forEach((elem, i) => {
                  if (elem === element.product.id) {
                    temp[currentIndex].price[i] = element.price;
                  }
                });
              }
            });
            updatePo({ ...po, psup: temp });
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
          console.log(e);
          if (doubleClick) {
            setShowJasa(false);
            let temp = [...po.pjasa];
            temp[currentIndex].jasa_id = e.data?.jasa?.id;
            updatePo({ ...po, pjasa: temp });
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
        show={showProd}
        onHide={() => {
          setShowProd(false);
        }}
        onInput={(e) => {
          setShowProd(!e);
        }}
        onSuccessInput={(e) => {
          getProduct();
        }}
        onRowSelect={(e) => {
          console.log(e);
          if (doubleClick) {
            setShowProd(false);
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
            // setSatuan(sat);

            let temp = [...po.pprod];
            temp[currentIndex].prod_id = e.data?.id;
            temp[currentIndex].unit_id = e.data.id;
            updatePo({ ...po, pprod: temp });
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
            let temp = [...po.pprod];
            temp[currentIndex].unit_id = e.data.unit?.id;
            updatePo({ ...po, pprod: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <Histori
        data={filtHis}
        loading={false}
        popUp={true}
        show={showHistori}
        onHide={() => {
          setShowHistori(false);
        }}
        onInput={(e) => {
          setShowHistori(!e);
        }}
        onSuccessInput={(e) => {
          getHistori();
        }}
        onRowSelect={(e) => {
          // if (doubleClick) {
          //   setShowSatuan(false);
          //   let temp = [...po.pprod];
          //   temp[currentIndex].unit_id = e.data.unit?.id;
          //   updatePo({ ...po, pprod: temp });
          // }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />
    </>
  );
};

export default InputPO;
