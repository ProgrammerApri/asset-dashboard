import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_SO } from "src/redux/actions";
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
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DataRulesPay from "src/jsx/screen/MasterLainnya/RulesPay/DataRulesPay";
import DataSupplier from "src/jsx/screen/Mitra/Pemasok/DataPemasok";
import DataPajak from "src/jsx/screen/Master/Pajak/DataPajak";
import DataSatuan from "src/jsx/screen/MasterLainnya/Satuan/DataSatuan";
import DataProduk from "src/jsx/screen/Master/Produk/DataProduk";
import DataJasa from "src/jsx/screen/Master/Jasa/DataJasa";
import DataCustomer from "src/jsx/screen/Mitra/Pelanggan/DataCustomer";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataLokasi from "src/jsx/screen/Master/Lokasi/DataLokasi";
// import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { InputNumber } from "primereact/inputnumber";
import PrimeCalendar from "../../../../components/PrimeCalendar/PrimeCalendar";
import { tr } from "../../../../../data/tr";
import endpoints from "../../../../../utils/endpoints";
import DataProject from "../../../MasterLainnya/Project/DataProject";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";

const defError = {
  code: false,
  date: false,
  pel: false,
  rul: false,
  tgl: false,
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

const InputSO = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const so = useSelector((state) => state.so.current);
  const isEdit = useSelector((state) => state.so.editso);
  const [isRp, setRp] = useState(true);
  const [isRpJasa, setRpJasa] = useState(true);
  const [jasa, setJasa] = useState(null);
  const [project, setProj] = useState(null);
  const [showProduk, setShowProduk] = useState(false);
  const [showJasa, setShowJasa] = useState(false);
  const [showProj, setShowProj] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showPpn, setShowPpn] = useState(false);
  const [setup, setSetup] = useState(null);
  const [showLok, setShowLok] = useState(false);
  const [showRulesPay, setShowRulesPay] = useState(false);
  const [showSubCus, setShowSub] = useState(false);
  const [product, setProduk] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [rak, setRak] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [rulesPay, setRulesPay] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [subCus, setSubCus] = useState(null);
  const [sto, setSto] = useState(null);
  const [numb, setNumb] = useState(true);
  const [stcard, setStCard] = useState(null);
  const [currency, setCur] = useState(null);
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
    getJasa();
    getProj();
    getSetup();
    getProduk();
    getSupplier();
    getSatuan();
    getStatus();
    getRulesPay();
    getPpn();
    getCustomer();
    getSubCus();
    getloct();
    getStoLoc();
    getStCard();
    if (isEdit) {
      getRak();
    }
  }, []);

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !so.so_code || so.so_code === "",
      date: !so.so_date || so.so_date === "",
      pel: !so.pel_id,
      rul: !so.top,
      tgl: !so.req_date || so.req_date === "",
      sub: so.sub_addr ? !so.sub_id : false,
      prod: [],
      jasa: [],
    };

    let ord = 0;
    let sto = 0;
    let sto_no_hpok = 0;

    so?.sprod.forEach((element, i) => {
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

      // ord += element.

      stcard?.forEach((el) => {
        if (
          element?.prod_id === el?.prod_id?.id &&
          element?.location === el?.loc_id?.id &&
          el.trx_dbcr === "d"
        ) {
          if (el.trx_hpok === 0) {
            sto_no_hpok += el.trx_qty;
          }
        }
      });
    });

    console.log("sto_no_hpok");
    console.log(sto_no_hpok);

    so?.sjasa.forEach((element, i) => {
      if (i > 0) {
        if (element.jasa_id || element.qty || element.price) {
          errors.jasa[i] = {
            id: !element.jasa_id,
            jum: !element.qty || element.qty === "" || element.qty === "0",
            prc:
              !element.price || element.price === "" || element.price === "0",
          };
        }
      } else {
        errors.jasa[i] = {
          id: !element.jasa_id,
          jum: !element.qty || element.qty === "" || element.qty === "0",
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

    let validProduct = false;
    let validJasa = false;
    errors.prod?.forEach((el) => {
      for (var k in el) {
        validProduct = !el[k];
      }
    });
    if (!validProduct) {
      errors.jasa.forEach((el) => {
        for (var k in el) {
          validJasa = !el[k];
        }
      });
    }

    if (sto_no_hpok > 0) {
      toast.current.show({
        severity: "error",
        summary: tr[localStorage.getItem("language")].tidak_dapat_hapus_data,
        detail: `Persediaan Produk Belum Ada Harga Pokok`,
        life: 6000,
      });
    }

    let val_err = sto_no_hpok > 0;

    valid =
      !errors.code &&
      !errors.date &&
      !errors.pel &&
      !errors.rul &&
      !errors.tgl &&
      (validProduct || validJasa) &&
      !val_err;

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
      ...endpoints.getStatusSO,
      data: {},
    };

    console.log(config.data);

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

  const editSO = async () => {
    const config = {
      ...endpoints.editSO,
      endpoint: endpoints.editSO.endpoint + so.id,
      data: so,
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

  const addSO = async () => {
    const config = {
      ...endpoints.addSO,
      data: so,
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
            detail: `Code ${so.so_code} already used`,
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

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editSO();
      } else {
        setUpdate(true);
        addSO();
      }
    }
  };

  const getStCard = async () => {
    const config = {
      ...endpoints.stcard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setStCard(data);
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

  const getProduk = async () => {
    const config = {
      ...endpoints.product,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setProduk(data);
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
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSto(data);
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

  const getProj = async () => {
    const config = {
      ...endpoints.project,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setProj(data);
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
        // setSetup(data)
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

  const getloct = async () => {
    const config = {
      ...endpoints.lokasi,
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
        setLokasi(data);
      }
    } catch (error) {}
  };

  const getRak = async () => {
    const config = {
      ...endpoints.getRak,
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

        data?.forEach((element) => {
          so?.sprod?.forEach((elem) => {
            if (element?.lokasi_rak === elem?.location) {
              filt.push(element);
            }
          });
        });
        setRak(filt);
      }
    } catch (error) {}
  };

  const getCustomer = async () => {
    const config = {
      ...endpoints.customer,
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
          if (elem.customer.sub_cus === false) {
            filt.push(elem);
          }
        });
        console.log(data);
        setCustomer(filt);
        getCur();
      }
    } catch (error) {}
  };

  const getSubCus = async () => {
    const config = {
      ...endpoints.customer,
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
          if (elem.customer.sub_cus === true) {
            filt.push(elem.customer);
          }
        });
        console.log(data);
        setSubCus(filt);
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

  const checkCur = (value) => {
    let selected = {};
    currency?.forEach((element) => {
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

  const checkProj = (value) => {
    let selected = {};
    project?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkRules = (value) => {
    let selected = {};
    rulesPay?.forEach((element) => {
      if (value === element.id) {
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

  const checkPpn = (value) => {
    let selected = {};
    ppn?.forEach((element) => {
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

  const checkRak = (value) => {
    let selected = {};
    rak?.forEach((element) => {
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
        selected = element.customer;
      }
    });

    return selected;
  };

  const checkSubCus = (value) => {
    let selected = {};
    subCus?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
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

  const updateSo = (e) => {
    dispatch({
      type: SET_CURRENT_SO,
      payload: e,
    });
  };

  const header = () => {
    return (
      <h4 className="mb-4">
        <b>Sales Order</b>
      </h4>
    );
  };

  const getSubTotalBarang = () => {
    let total = 0;
    so?.sprod?.forEach((el) => {
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
    so?.sjasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return total;
  };

  const pjk = (value) => {
    let nil = 0;
    ppn?.forEach((elem) => {
      if (checkCus(so.pel_id)?.cus_pjk === elem.id) {
        nil = elem.nilai;
      }
    });

    return nil;
  };

  const curConv = () => {
    let cur = 0;
    currency?.forEach((elem) => {
      if (checkCus(so.pel_id)?.cus_curren === elem.id) {
        cur = elem.rate;
      }
    });

    return cur;
  };

  const curConvSup = () => {
    let cur_sup = 0;
    so?.sjasa.forEach((element) => {
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

  const body = () => {
    let date = new Date(setup?.year_co, setup?.cutoff - 1, 31);
    return (
      <>
        <Toast ref={toast} />
        {/* Put content body here */}
        <Row className="mb-4">
          <div className="col-3">
            <PrimeInput
              label={tr[localStorage.getItem("language")].kd_so}
              value={so.so_code}
              onChange={(e) => {
                updateSo({ ...so, so_code: e.target.value });
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
              value={new Date(`${so.so_date}Z`)}
              onChange={(e) => {
                updateSo({ ...so, so_date: e.value });

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

          <div className="col-12 mt-3">
            <span className="fs-13">
              <b>{tr[localStorage.getItem("language")].inf_pelanggan}</b>
            </span>
            {/* </div>
          <div className="col-12"> */}
            <Divider className="mt-1"></Divider>
          </div>

          <div className="col-3">
            <label>{tr[localStorage.getItem("language")].customer}</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={so.pel_id !== null ? checkCus(so.pel_id) : null}
              option={customer?.map((v) => v.customer)}
              onChange={(e) => {
                console.log(e.value);
                updateSo({
                  ...so,
                  pel_id: e.id,
                  // ppn_type: so.pel_id?.cus_pjk,
                });

                let newError = error;
                newError.pel = false;
                setError(newError);
              }}
              label={"[cus_name]"}
              placeholder={tr[localStorage.getItem("language")].pilih}
              detail
              onDetail={() => setShowCustomer(true)}
              errorMessage="Pelanggan Belum Dipilih"
              error={error?.pel}
            />
          </div>

          <div className="col-3">
            <label>{tr[localStorage.getItem("language")].alamat}</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  so.pel_id !== null ? checkCus(so.pel_id)?.cus_address : ""
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
              value={so.pel_id !== null ? checkCus(so.pel_id)?.cus_telp1 : ""}
              placeholder={tr[localStorage.getItem("language")].telp}
              disabled
            />
          </div>

          <div className="col-2">
            <label>{tr[localStorage.getItem("language")].pajak}</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  checkCus(so.pel_id)?.cus_pjk
                    ? checkPpn(checkCus(so.pel_id)?.cus_pjk).name
                    : ""
                }
                placeholder={tr[localStorage.getItem("language")].type_pjk}
                disabled
              />
            </div>
          </div>

          <div className="col-2">
            <label>{tr[localStorage.getItem("language")].currency}</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  so.pel_id
                    ? checkCus(so.pel_id)?.cus_curren !== null
                      ? checkCur(checkCus(so.pel_id)?.cus_curren).code
                      : "IDR"
                    : ""
                }
                placeholder={tr[localStorage.getItem("language")].currency}
                disabled
              />
            </div>
          </div>

          <div className="col-12 mt-3">
            <span className="fs-13">
              <b>{tr[localStorage.getItem("language")].inf_bayar}</b>
            </span>
            {/* </div>
          <div className="col-12"> */}
            <Divider className="mt-1"></Divider>
          </div>

          <div className="col-3">
            <PrimeCalendar
              label={tr[localStorage.getItem("language")].tgl_req}
              value={new Date(`${so.req_date}Z`)}
              onChange={(e) => {
                updateSo({ ...so, req_date: e.value });

                let newError = error;
                newError.tgl = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].pilih_tgl}
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.tgl}
              minDate={date}
            />
          </div>

          <div className="col-3">
            <label>{tr[localStorage.getItem("language")].syarat}</label>
            <div className="p-inputgroup mt-0"></div>
            <CustomDropdown
              value={so.top !== null ? checkRules(so.top) : null}
              option={rulesPay}
              onChange={(e) => {
                let result = new Date(`${so.req_date}Z`);
                result.setDate(result.getDate() + e.day);
                console.log(result);

                updateSo({ ...so, top: e.id, due_date: result });

                let newError = error;
                newError.rul = false;
                setError(newError);
              }}
              label={"[name] ([day] Hari)"}
              placeholder={tr[localStorage.getItem("language")].pilih}
              detail
              onDetail={() => setShowRulesPay(true)}
              errorMessage="Waktu Pembayaran Belum Dipilih"
              error={error?.rul}
            />
          </div>

          <div className="col-3">
            <label>{tr[localStorage.getItem("language")].due}</label>
            <div className="p-inputgroup mt-0">
              <Calendar
                value={new Date(`${so?.due_date}Z`)}
                onChange={(e) => {}}
                placeholder={tr[localStorage.getItem("language")].due}
                disabled
                dateFormat="dd-mm-yy"
              />
            </div>
          </div>

          <div className="col-3">
            <label>{tr[localStorage.getItem("language")].proj}</label>
            <div className="p-inputgroup mt-0"></div>
            <CustomDropdown
              value={so.proj_id && checkProj(so.proj_id)}
              option={project}
              onChange={(e) => {
                updateSo({ ...so, proj_id: e.id });
              }}
              label={"[proj_code] ([proj_name])"}
              placeholder={tr[localStorage.getItem("language")].pilih}
              detail
              onDetail={() => setShowProj(true)}
            />
          </div>

          <div className="d-flex col-12 align-items-center mt-4">
            <label className="ml-0 mt-1 fs-12">
              <b>{tr[localStorage.getItem("language")].kirim_sub}</b>
            </label>
            <InputSwitch
              className="ml-4"
              checked={so && so.sub_addr}
              onChange={(e) => {
                updateSo({ ...so, sub_addr: e.target.value });
              }}
            />
          </div>

          {so && so.sub_addr === true && (
            <>
              <div className="col-4">
                <label>{tr[localStorage.getItem("language")].pel_sub}</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={so.sub_id ? checkSubCus(so.sub_id) : null}
                  option={subCus}
                  onChange={(e) => {
                    updateSo({ ...so, sub_id: e.id });
                    let newError = error;
                    newError.sub = false;
                    setError(newError);
                  }}
                  label={"[cus_name]"}
                  placeholder={tr[localStorage.getItem("language")].pilih}
                  detail
                  onDetail={() => setShowSub(true)}
                  disabled={so && !so.sub_addr}
                  errorMessage="Sub Pelanggan Belum Dipilih"
                  error={error?.sub}
                />
              </div>

              <div className="col-4">
                <label>{tr[localStorage.getItem("language")].alamat}</label>
                <div className="p-inputgroup">
                  <InputText
                    value={
                      so.sub_id !== null
                        ? checkSubCus(so.sub_id)?.cus_address
                        : ""
                    }
                    placeholder={tr[localStorage.getItem("language")].alamat}
                    disabled
                  />
                </div>
              </div>

              <div className="col-4">
                <label>{tr[localStorage.getItem("language")].cp}</label>
                <div className="p-inputgroup">
                  <InputText
                    value={
                      so.sub_id !== null
                        ? checkSubCus(so.sub_id)?.cus_telp1
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
                  value={so.sprod?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
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
                      minWidth: "12rem",
                    }}
                    field={""}
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
                          // setSatuan(sat);

                          sto.forEach((element) => {
                            if (
                              element?.loc_id === so?.sprod[e.index].location &&
                              element?.id === u?.id
                            ) {
                              st = element.stock;
                            }
                          });

                          let temp = [...so.sprod];
                          temp[e.index].prod_id = u.id;
                          temp[e.index].unit_id = u.unit.id;
                          temp[e.index].konv_qty = 0;
                          temp[e.index].unit_konv =
                            checkUnit(temp[e.index].unit_id)?.u_from !== null
                              ? checkUnit(temp[e.index].unit_id)?.u_from?.code
                              : checkUnit(temp[e.index].unit_id)?.code;
                          temp[e.index].stock = st;

                          updateSo({ ...so, sprod: temp });

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
                        errorMessage={
                          tr[localStorage.getItem("language")].prod_belum
                        }
                        error={error?.prod[e.index]?.id}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].gudang}
                    className="align-text-top"
                    style={{
                      minWidth: "10rem",
                    }}
                    field={""}
                    body={(e) => (
                      <CustomDropdown
                        value={e.location && checkLoc(e.location)}
                        onChange={(u) => {
                          let st = 0;

                          sto.forEach((element) => {
                            if (
                              element.loc_id === u.id &&
                              element.id === so?.sprod[e.index].prod_id
                            ) {
                              st = element.stock;
                            }
                          });

                          let temp = [...so.sprod];
                          temp[e.index].location = u.id;
                          temp[e.index].stock = st;

                          // if (temp[e.index].order > checkProd(u.id)?.stock) {
                          //   temp[e.index].order = checkProd(u.id)?.stock;
                          // }
                          updateSo({ ...so, sprod: temp });

                          getRak();

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
                        errorMessage={
                          tr[localStorage.getItem("language")].lokasi_belum
                        }
                        error={error?.prod[e.index]?.lok}
                      />
                    )}
                  />

                  <Column
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
                            let temp = [...so.sprod];
                            temp[e.index].rak_aktif = u?.value;
                            temp[e.index].rak_id = null;
                            updateSo({ ...so, sprod: temp });
                          }}
                          disabled={e.location == null}
                        />
                      </div>
                    )}
                  />

                  <Column
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

                          let temp = [...so.sprod];
                          temp[e.index].rak_id = u?.value?.id ?? null;
                          // temp[e.index].stock = st;
                          updateSo({ ...so, sprod: temp });

                          // let newError = error;
                          // newError.prod[e.index].lok = false;
                          // setError(newError);
                        }}
                        options={rak}
                        optionLabel={"rak_name"}
                        filter
                        filterBy={"rak_name"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        showClear
                        disabled={!e.rak_aktif}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].stok}
                    className="align-text-top"
                    style={{
                      minWidth: "9rem",
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
                    header={tr[localStorage.getItem("language")].qty}
                    className="align-text-top"
                    style={{
                      minWidth: "9rem",
                    }}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <PrimeNumber
                          price
                          value={e.order && e.order}
                          onChange={(u) => {
                            let temp = [...so.sprod];
                            temp[e.index].order = u.value;
                            temp[e.index].konv_qty =
                              u.value * checkUnit(temp[e.index].unit_id)?.qty;

                            if (checkCus(so.pel_id)?.cus_curren !== null) {
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
                                  temp[e.index].konv_qty * temp[e.index].price;
                              } else {
                                temp[e.index].total =
                                  temp[e.index].order * temp[e.index].price;
                              }
                            }

                            if (temp[e.index].order > temp[e.index].stock) {
                              // temp[e.index].order = checkProd(e?.prod_id)?.stock;

                              toast.current.show({
                                severity: "warn",
                                summary: "Warning",
                                detail:
                                  tr[localStorage.getItem("language")].info_sto,
                                life: 3000,
                              });
                            }
                            updateSo({
                              ...so,
                              sprod: temp,
                              total_bayar:
                                getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  pjk()) /
                                  100,
                            });
                            console.log(temp);
                            let newError = error;
                            newError.prod[e.index].jum = false;
                            setError(newError);
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
                          error={error?.prod[e.index]?.jum}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].satuan}
                    className="align-text-top"
                    style={{
                      minWidth: "10rem",
                    }}
                    field={""}
                    body={(e) => (
                      <CustomDropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        onChange={(u) => {
                          let temp = [...so.sprod];
                          temp[e.index].unit_id = u.id;
                          temp[e.index].konv_qty = temp[e.index].order * u?.qty;
                          temp[e.index].unit_konv = u?.u_from?.code;
                          temp[e.index].price = null;
                          temp[e.index].total = null;
                          updateSo({ ...so, sprod: temp });
                        }}
                        option={satuan}
                        label={"[name]"}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowSatuan(true);
                        }}
                        placeholder={tr[localStorage.getItem("language")].pilih}
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
                    header={tr[localStorage.getItem("language")].price}
                    className="align-text-top"
                    style={{
                      minWidth: "8rem",
                    }}
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.price && e.price}
                        onChange={(u) => {
                          let temp = [...so.sprod];
                          temp[e.index].price = u.value;
                          if (
                            so?.pel_id &&
                            checkCus(so.pel_id)?.cus_curren !== null
                          ) {
                            if (
                              checkUnit(temp[e.index].unit_id)?.u_from !== null
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
                            temp[e.index].price_idr =
                              temp[e.index].price * curConv();
                          } else {
                            if (
                              checkUnit(temp[e.index].unit_id)?.u_from !== null
                            ) {
                              temp[e.index].total =
                                temp[e.index].konv_qty * u.value;
                            } else {
                              temp[e.index].total =
                                temp[e.index].order * u.value;
                            }
                          }

                          updateSo({
                            ...so,
                            sprod: temp,
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
                      />
                    )}
                  />

                  <Column
                    hidden={checkCus(so.pel_id)?.cus_curren == null}
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
                    style={{
                      minWidth: "9rem",
                    }}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.disc && e.disc}
                          onChange={(u) => {
                            let temp = [...so.sprod];
                            temp[e.index].disc = u.target.value;
                            updateSo({
                              ...so,
                              sprod: temp,
                              total_bayar:
                                getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  pjk()) /
                                  100,
                            });
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
                    style={{
                      minWidth: "8rem",
                    }}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputNumber
                          value={e.nett_price && e.nett_price}
                          onChange={(u) => {
                            let temp = [...so.sprod];
                            temp[e.index].nett_price = u.value;
                            updateSo({
                              ...so,
                              sprod: temp,
                              total_bayar:
                                getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  pjk()) /
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
                      so?.pel_id == null &&
                      checkCus(so.pel_id)?.customer?.cus_curren == null
                    }
                    header="FC"
                    className="align-text-top"
                    style={{
                      minWidth: "7rem",
                    }}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputNumber
                          value={
                            e.nett_price && e.nett_price !== 0
                              ? e.nett_price
                              : e.total_fc - (e.total_fc * e.disc) / 100
                          }
                          onChange={(u) => {}}
                          placeholder="0"
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
                    field={""}
                    body={(e) => (
                      <Link
                        onClick={() => {
                          let temp = [...so.sprod];
                          temp.splice(e.index, 1);
                          updateSo({ ...so, sprod: temp });
                        }}
                        className="btn btn-danger shadow btn-xs sharp"
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

                    updateSo({
                      ...so,
                      sprod: [
                        ...so.sprod,
                        {
                          id: 0,
                          prod_id: null,
                          unit_id: null,
                          request: null,
                          order: null,
                          remain: null,
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
                  <span className="align-middle mx-1 mt-3">
                    <i className="fa fa-plus"></i> {"Tambah"}
                  </span>
                </Link>
              </div>
            </Row>
          }
        />

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
            <>
              <DataTable
                responsiveLayout="scroll"
                value={so.sjasa?.map((v, i) => {
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
                  hidden
                  header={tr[localStorage.getItem("language")].pemasok}
                  className="align-text-top"
                  style={{
                    minWidth: "13rem",
                  }}
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={e.sup_id && checkSupp(e.sup_id)}
                      option={supplier}
                      onChange={(u) => {
                        let temp = [...so.sjasa];
                        temp[e.index].sup_id = u.supplier.id;
                        temp[e.index].price = null;
                        temp[e.index].total_fc = 0;
                        temp[e.index].total = 0;
                        updateSo({ ...so, sjasa: temp });
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
                  hidden
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
                          e.sup_id !== null
                            ? checkSupp(e.sup_id)?.supplier?.sup_curren !== null
                              ? checkCur(
                                  checkSupp(e.sup_id)?.supplier?.sup_curren
                                )?.code
                              : "IDR"
                            : ""
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
                    minWidth: "15rem",
                  }}
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={e.jasa_id && checkJasa(e.jasa_id)}
                      option={jasa}
                      onChange={(u) => {
                        console.log(e.value);
                        let temp = [...so.sjasa];
                        temp[e.index].jasa_id = u.jasa.id;
                        updateSo({ ...so, sjasa: temp });

                        let newError = error;
                        newError.jasa[e.index].id = false;
                        setError(newError);
                      }}
                      label={"[jasa.name]"}
                      placeholder={tr[localStorage.getItem("language")].pilih}
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowJasa(true);
                      }}
                      errorMessage={
                        tr[localStorage.getItem("language")].jasa_belum
                      }
                      error={error?.jasa[e.index]?.id}
                    />
                  )}
                />

                <Column
                  header={tr[localStorage.getItem("language")].qty}
                  className="align-text-top"
                  field={""}
                  style={{
                    minWidth: "8rem",
                  }}
                  body={(e) => (
                    <PrimeNumber
                      value={e.qty ? e.qty : ""}
                      onChange={(u) => {
                        let temp = [...so.sjasa];
                        temp[e.index].qty = u.target.value;
                        if (checkCus(so.pel_id)?.cus_curren !== null) {
                          temp[e.index].total_fc =
                            temp[e.index].qty * temp[e.index].price;

                          temp[e.index].total =
                            temp[e.index].total_fc * curConv();
                        } else {
                          temp[e.index].total =
                            temp[e.index].qty * temp[e.index].price;
                        }

                        updateSo({
                          ...so,
                          sjasa: temp,
                          total_bayar:
                            getSubTotalBarang() +
                            getSubTotalJasa() +
                            ((getSubTotalBarang() + getSubTotalJasa()) *
                              pjk()) /
                              100,
                        });

                        console.log(temp);
                        let newError = error;
                        newError.jasa[e.index].jum = false;
                        setError(newError);
                      }}
                      placeholder="0"
                      type="number"
                      min={0}
                      error={error?.jasa[e.index]?.jum}
                    />
                  )}
                />

                <Column
                  header={tr[localStorage.getItem("language")].satuan}
                  className="align-text-top"
                  style={{
                    minWidth: "13rem",
                  }}
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={e.unit_id && checkUnit(e.unit_id)}
                      option={satuan}
                      onChange={(u) => {
                        console.log(e.value);
                        let temp = [...so.sjasa];
                        temp[e.index].unit_id = u.id;
                        updateSo({ ...so, sjasa: temp });
                      }}
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
                  header={tr[localStorage.getItem("language")].price}
                  className="align-text-top"
                  style={{
                    minWidth: "10rem",
                  }}
                  field={""}
                  body={(e) =>
                    checkCus(so.pel_id)?.cus_curren !== null ? (
                      <PrimeNumber
                        value={e.price && e.price}
                        onChange={(u) => {
                          let temp = [...so.sjasa];
                          temp[e.index].price = Number(u.target.value);
                          if (checkCus(so.pel_id)?.cus_curren !== null) {
                            temp[e.index].total_fc =
                              temp[e.index].qty * temp[e.index].price;

                            temp[e.index].total =
                              temp[e.index].total_fc * curConv();
                          } else {
                            temp[e.index].total =
                              temp[e.index].qty * temp[e.index].price;
                          }

                          updateSo({
                            ...so,
                            sjasa: temp,
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
                        error={error?.jasa[e.index]?.prc}
                      />
                    ) : (
                      <PrimeNumber
                        price
                        value={e.price && e.price}
                        onChange={(u) => {
                          let temp = [...so.sjasa];
                          temp[e.index].price = u.value;
                          if (checkCus(so.pel_id)?.cus_curren !== null) {
                            temp[e.index].total_fc =
                              temp[e.index].qty * temp[e.index].price;

                            temp[e.index].total =
                              temp[e.index].total_fc * curConv();
                          } else {
                            temp[e.index].total =
                              temp[e.index].qty * temp[e.index].price;
                          }

                          updateSo({
                            ...so,
                            sjasa: temp,
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
                        error={error?.jasa[e.index]?.prc}
                      />
                    )
                  }
                />

                <Column
                  header={tr[localStorage.getItem("language")].disc}
                  className="align-text-top"
                  style={{
                    minWidth: "11rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.disc && e.disc}
                        onChange={(u) => {
                          let temp = [...so.sjasa];
                          temp[e.index].disc = u.target.value;
                          updateSo({
                            ...so,
                            sjasa: temp,
                            total_bayar:
                              getSubTotalBarang() +
                              getSubTotalJasa() +
                              ((getSubTotalBarang() + getSubTotalJasa()) *
                                pjk()) /
                                100,
                          });
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
                  field={""}
                  style={{
                    minWidth: "8rem",
                  }}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputNumber
                        value={e.total_fc - (e.total_fc * e.disc) / 100}
                        onChange={(t) => {}}
                        placeholder="0"
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
                        {`Rp. ${e.total - (e.total * e.disc) / 100}`.replace(
                          /(\d)(?=(\d{3})+(?!\d))/g,
                          "$1."
                        )}
                      </b>
                    </label>
                  )}
                />

                <Column
                  header=""
                  className="align-text-top"
                  field={""}
                  body={(e) =>
                    e.index === so.sjasa?.length - 1 ? (
                      <Link
                        onClick={() => {
                          let newError = error;
                          newError.jasa.push({ jum: false, prc: false });
                          setError(newError);

                          updateSo({
                            ...so,
                            sjasa: [
                              ...so.sjasa,
                              {
                                id: 0,
                                jasa_id: null,
                                sup_id: null,
                                unit_id: null,
                                qty: null,
                                price: null,
                                price_idr: 0,
                                disc: null,
                                total_fc: 0,
                                total: null,
                              },
                            ],
                          });
                        }}
                        className="btn btn-primary shadow btn-xs sharp"
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          let temp = [...so.sjasa];
                          temp.splice(e.index, 1);
                          updateSo({ ...so, sjasa: temp });
                        }}
                        className="btn btn-danger shadow btn-xs sharp"
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

        <div className="row ml-0 mr-0 mb-0 mt-6 justify-content-between">
          <div>
            <div className="row ml-1">
              {so?.sjasa?.length > 0 && so?.sprod?.length > 0 && (
                <div className="d-flex col-12 align-items-center">
                  <label className="mt-1">
                    {tr[localStorage.getItem("language")].split}
                  </label>
                  <InputSwitch
                    className="ml-4"
                    checked={so?.split_inv}
                    onChange={(e) => {
                      if (e.value) {
                        updateSo({
                          ...so,
                          split_inv: e.value,
                          total_disc: null,
                        });
                      } else {
                        updateSo({
                          ...so,
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
                {so?.split_inv
                  ? tr[localStorage.getItem("language")].ttl_barang
                  : tr[localStorage.getItem("language")].sub_ttl}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {so?.split_inv ? (
                  <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                ) : (
                  <b>
                    Rp. {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                  </b>
                )}
              </label>
            </div>

            <div className="col-6">{so?.split_inv ? "DPP Barang" : "DPP"}</div>

            <div className="col-6">
              <label className="text-label">
                {so.split_inv ? (
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
                {so.split_inv
                  ? `${
                      tr[localStorage.getItem("language")].pjk_barang
                    } ${pjk()}%`
                  : tr[localStorage.getItem("language")].pajak}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {so?.split_inv ? (
                  <b>Rp. {formatIdr((getSubTotalBarang() * pjk()) / 100)}</b>
                ) : (
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      ((getSubTotalBarang() + getSubTotalJasa()) * pjk()) / 100
                    )}
                  </b>
                )}
              </label>
            </div>

            <div className="col-6 mt-3">
              <label className="text-black fs-14">
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
                    so.split_inv
                      ? isRp
                        ? (getSubTotalBarang() * so.prod_disc) / 100
                        : so.prod_disc
                      : isRp
                      ? ((getSubTotalBarang() + getSubTotalJasa()) *
                          so.total_disc) /
                        100
                      : so.total_disc
                  }
                  placeholder={tr[localStorage.getItem("language")].disc_tambh}
                  type="number"
                  min={0}
                  onChange={(e) => {
                    if (so.split_inv) {
                      let disc = 0;
                      if (isRp) {
                        disc = (e.target.value / getSubTotalBarang()) * 100;
                      } else {
                        disc = e.target.value;
                      }
                      updateSo({ ...so, prod_disc: disc });
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
                      updateSo({ ...so, total_disc: disc });
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
              <label className="fs-14">
                <b>{`${tr[localStorage.getItem("language")].total} ${
                  tr[localStorage.getItem("language")].bayar
                }`}</b>
              </label>
            </div>

            <div className="col-6">
              <label className="fs-14">
                {so?.split_inv ? (
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      getSubTotalBarang() + (getSubTotalBarang() * pjk()) / 100
                    )}
                  </b>
                ) : (
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      getSubTotalBarang() +
                        getSubTotalJasa() +
                        ((getSubTotalBarang() + getSubTotalJasa()) * pjk()) /
                          100
                    )}
                  </b>
                )}
              </label>
            </div>

            <div className="col-12">
              <Divider className="ml-12"></Divider>
            </div>

            {so?.split_inv ? (
              <>
                {/* <div className="row justify-content-right col-12 mt-4"> */}
                <div className="col-6 mt-4">
                  <label className="text-black fs-14">
                    {tr[localStorage.getItem("language")].ttl_jasa}
                  </label>
                </div>

                <div className="col-6 mt-4">
                  <label className="text-black fs-14">
                    <b>Rp. {formatIdr(getSubTotalJasa())}</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">DPP Jasa</label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">
                    <b>Rp. {formatIdr(getSubTotalJasa())}</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">
                    {`${tr[localStorage.getItem("language")].pjk_jasa} (2%)`}
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">
                    <b>Rp. {formatIdr((getSubTotalJasa() * 2) / 100)}</b>
                  </label>
                </div>

                <div className="col-6 mt-3">
                  <label className="text-black fs-14">
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
                          ? (getSubTotalJasa() * so.jasa_disc) / 100
                          : so.jasa_disc
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
                        updateSo({ ...so, jasa_disc: disc });
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
                  <label className="fs-14">
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
            onClick={onSubmit}
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
            let result = new Date(`${so.req_date}Z`);
            result.setDate(result.getDate() + e?.data?.day);

            updateSo({ ...so, top: e?.data?.id, due_date: result });
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
            let temp = [...so.sjasa];
            temp[currentIndex].sup_id = e.data.supplier.id;
            updateSo({ ...so, sjasa: temp });
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
          getProduk();
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

            let temp = [...so.sprod];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;
            updateSo({ ...so, sprod: temp });
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
            let temp = [...so.sjasa];
            temp[currentIndex].jasa_id = e.data.jasa.id;
            updateSo({ ...so, sjasa: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataPajak
        data={ppn}
        loading={false}
        popUp={true}
        show={showPpn}
        onHide={() => {
          setShowPpn(false);
        }}
        onInput={(e) => {
          setShowPpn(!e);
        }}
        onSuccessInput={(e) => {
          getPpn();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowPpn(false);
            updateSo({ ...so, ppn_type: e.data.id });
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
            let temp = [...so.sprod];
            temp[currentIndex].unit_id = e.data.id;

            let tempj = [...so.sjasa];
            tempj[currentIndex].unit_id = e.data.id;
            updateSo({ ...so, sprod: temp, sjasa: tempj });
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
          getloct();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowLok(false);
            let temp = [...so.sprod];
            temp[currentIndex].location = e.data.id;
            updateSo({ ...so, sprod: temp });
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
            updateSo({ ...so, pel_id: e.data.customer.id });
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
            updateSo({ ...so, sub_id: e.data.id });
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
            updateSo({ ...so, proj_id: e.data.id });
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

export default InputSO;
