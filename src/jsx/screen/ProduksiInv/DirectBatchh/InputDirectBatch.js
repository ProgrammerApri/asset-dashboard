import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_BTC } from "src/redux/actions";
import { SET_CURRENT_FM } from "src/redux/actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { Divider } from "@material-ui/core";
import { TabPanel, TabView } from "primereact/tabview";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import DataProduk from "../../Master/Produk/DataProduk";
import DataSatuan from "../../MasterLainnya/Satuan/DataSatuan";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import { InputSwitch } from "primereact/inputswitch";
import { Link } from "react-router-dom";
import endpoints from "../../../../utils/endpoints";
import DataLokasi from "../../Master/Lokasi/DataLokasi";
import DataPusatBiaya from "../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import DataMesin from "../../Produksi/Mesin/DataMesin";

const defError = {
  code: false,
  date: false,
  tot: false,
  loc: false,
  prod: [
    {
      id: false,
      lok: false,
      qty: false,
      aloc: false,
    },
  ],
  mtrl: [
    {
      id: false,
      qty: false,
    },
  ],
};

const InputDirectBatch = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [sto, setSto] = useState(null);
  const [active, setActive] = useState(0);
  const [doubleClick, setDoubleClick] = useState(false);
  const btc = useSelector((state) => state.btc.current);
  const isEdit = useSelector((state) => state.btc.editBtc);
  const dispatch = useDispatch();
  const [showSatuan, setShowSatuan] = useState(false);
  const [showLok, setShowLok] = useState(false);
  const [showMsn, setShowMsn] = useState(false);
  const [showDept, setShowDept] = useState(false);
  const [date, setDate] = useState(new Date());
  const [stcard, setStCard] = useState(null);
  const [product, setProduct] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [setup, setSetup] = useState(null);
  const [state, setState] = useState(0);
  const [stateErr, setStateErr] = useState(0);
  const [errQty, setErqty] = useState(0);
  const [lokasi, setLokasi] = useState(null);
  const [mesin, setMesin] = useState(null);
  const [acc, setAcc] = useState(null);
  const [trans, setTrans] = useState(null);
  const [transGl, setTransGl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProd, setShowProd] = useState(false);
  const [grupP, setGrupP] = useState(null);
  const [forml, setForml] = useState(null);
  const [mat, setMaterial] = useState(null);
  const [dept, setDept] = useState(null);
  const [selectedForm, setSelectedForm] = useState(false);
  const [selectedMat, setSelectedMat] = useState(false);
  const [error, setError] = useState(defError);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getProduct();
    getFormula();
    getMaterial();
    getSetup();
    getDept();
    getLok();
    getStCard();
    getStoLoc();
    getMesin();
    getAcc();
    getTrans();
    getTransGl();
  }, []);

  const getFormula = async () => {
    const config = {
      ...endpoints.formula,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((elem) => {
          let mtrl = [];
          elem.material.forEach((element) => {
            element.prod_id = element.prod_id.id;
            element.unit_id = element.unit_id.id;
            mtrl.push(element);
          });
          elem.material = mtrl;

          let prod = [];
          elem.product.forEach((el) => {
            el.prod_id = el.prod_id.id;
            el.unit_id = el.unit_id.id;
            prod.push(el);
          });
          elem.product = prod;

          filt.push(elem);
        });
        setForml(filt);
      }
    } catch (error) {}
  };

  const getMaterial = async () => {
    const config = {
      ...endpoints.usage_mat,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((elem) => {
          let mtrl = [];
          elem.material.forEach((element) => {
            element.prod_id = element.prod_id.id;
            element.unit_id = element.unit_id.id;
            mtrl.push(element);
          });
          elem.material = mtrl;

          filt.push(elem);
        });
        setMaterial(filt);
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
        getGrupP();
        getSatuan();
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

  const getDept = async () => {
    const config = {
      ...endpoints.pusatBiaya,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setDept(data);
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

  const getLok = async () => {
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

  const getStCard = async (id, e) => {
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

  const getMesin = async (id, e) => {
    const config = {
      ...endpoints.mesin,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setMesin(data);
      }
    } catch (error) {}
  };

  const getAcc = async () => {
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
        let kas = [];
        let all_d = [];
        data.forEach((elem) => {
          if (elem.account.dou_type === "D" && elem.account.connect === false) {
            all_d.push(elem.account);
          }
        });
        setAcc(all_d);
      }
    } catch (error) {}
  };

  const getTrans = async () => {
    const config = {
      ...endpoints.trans,
      // base_url: connectUrl,
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
          if (element.tf_inv) {
            filt.push(element);
          }
        });
        setTrans(data);
      }
    } catch (error) {}
  };

  const getTransGl = async () => {
    const config = {
      ...endpoints.trans,
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
          if (!element.tf_inv) {
            filt.push(element);
          }
        });
        setTransGl(filt);
      }
    } catch (error) {}
  };

  const editBTC = async () => {
    const config = {
      ...endpoints.editDBatch,
      endpoint: endpoints.editDBatch.endpoint + btc.id,
      data: btc,
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
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
          life: 3000,
        });
      }, 500);
    }
  };

  const addBTC = async () => {
    const config = {
      ...endpoints.addDBatch,
      data: { ...btc, batch_date: currentDate(btc.batch_date) },
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
            detail: `Kode ${btc.bcode} Sudah Digunakan`,
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

  const checkLok = (value) => {
    let selected = {};
    lokasi?.forEach((element) => {
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

  const checkForml = (value) => {
    let selected = {};
    forml?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkMat = (value) => {
    let selected = {};
    mat?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkMsn = (value) => {
    let selected = {};
    mesin?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkAcc = (value) => {
    let selected = {};
    acc?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const glTemplate = (option) => {
    return (
      <div>
        {option !== null ? `${option.acc_name} - ${option.acc_code}` : ""}
      </div>
    );
  };

  const valTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.acc_name} - ${option.acc_code}` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const prodTemp = (option) => {
    return (
      <div>{option !== null ? `${option.name} (${option.code})` : ""}</div>
    );
  };

  const valProd = (option, props) => {
    if (option) {
      return (
        <div>{option !== null ? `${option.name} (${option.code})` : ""}</div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editBTC();
      } else {
        setUpdate(true);
        addBTC();
      }
    }
    // console.log(isValid());
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
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );
    return newDate.toISOString();
  };

  const updateBTC = (e) => {
    dispatch({
      type: SET_CURRENT_BTC,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let active = 4;
    let errors = {
      code: !btc.bcode || btc.bcode === "",
      date: !btc.batch_date || btc.batch_date === "",
      tot: btc.forml_id !== null ? !btc.total || btc.total === "" : false,
      loc: !btc.loc_id,
      prod: [],
      mtrl: [],
    };

    let total_prod = 0;
    let total_rej = 0;
    let total = 0;
    let qty_mat = 0;
    let qty_pj = 0;
    let qty_rej = 0;
    let tqty = 0;
    let acc_sto_m = null;
    let acc_wip_m = null;
    let acc_sto_p = null;
    let acc_sto_r = null;
    let acc_gp_m = null;
    let acc_gp_p = null;
    let acc_gp_r = null;
    let qty_m = 0;
    let st = 0;
    let sto_no_hpok = 0;

    btc?.material.forEach((element, i) => {
      if (i > 0) {
        if (element.prod_id || element.qty) {
          errors.mtrl[i] = {
            id: !element.prod_id,
            qty: !element.qty || element.qty === "" || element.qty === "0",
          };
        }
      } else {
        errors.mtrl[i] = {
          id: !element.prod_id,
          qty: !element.qty || element.qty === "" || element.qty === "0",
        };
      }

      qty_mat += Number(element.qty);
      st = element.stock;
      qty_m = Number(element.qty);

      acc_sto_m = checkProd(element?.prod_id)?.acc_sto;
      acc_wip_m = checkProd(element?.prod_id)?.acc_wip;

      if (element?.prod_id) {
        grupP?.forEach((el) => {
          if (checkProd(element?.prod_id)?.group?.id === el?.groupPro?.id) {
            if (el.groupPro.wip) {
              acc_gp_m = el.groupPro?.acc_wip;
              acc_gp_m = checkProd(element?.prod_id)?.acc_wip;
              acc_sto_m = checkProd(element?.prod_id)?.acc_wip;
            } else {
              acc_gp_m = el.groupPro?.acc_sto;
              acc_gp_m = checkProd(element?.prod_id)?.acc_sto;
              acc_sto_m = checkProd(element?.prod_id)?.acc_sto;
            }
          }
        });

        if (
          (setup?.gl_detail && acc_sto_m === null) ||
          (!setup?.gl_detail && acc_gp_m === null)
        ) {
          toast.current.show({
            severity: "error",
            summary: "Tidak Dapat Menyimpan Data",
            detail: `Akun Persediaan Produk Material Belum Diisi`,
            life: 6000,
          });
        }
      }

      stcard?.forEach((el) => {
        if (
          element?.prod_id === el?.prod_id?.id &&
          btc?.loc_id === el?.loc_id?.id &&
          el.trx_dbcr === "d"
        ) {
          if (el.trx_hpok === 0) {
            sto_no_hpok += el.trx_qty;
          }
        }
      });
    });

    btc?.product.forEach((element, i) => {
      if (i > 0) {
        if (element.prod_id || element.qty || element.loc_id || element.aloc) {
          errors.prod[i] = {
            id: !element.prod_id,
            lok: !element.loc_id || element.loc_id === null,
            qty: !element.qty || element.qty === "" || element.qty === "0",
            aloc: !element.aloc || element.aloc === "" || element.aloc === "0",
          };
        }
      } else {
        errors.prod[i] = {
          id: !element.prod_id,
          lok: !element.loc_id || element.loc_id === null,
          qty: !element.qty || element.qty === "" || element.qty === "0",
          aloc: !element.aloc || element.aloc === "" || element.aloc === "0",
        };
      }

      total_prod += Number(element.aloc);
      qty_pj += Number(element.qty);

      if (element?.prod_id) {
        grupP?.forEach((el) => {
          if (checkProd(element?.prod_id)?.group?.id === el?.groupPro?.id) {
            if (el.groupPro.wip) {
              acc_gp_p = el.groupPro.acc_wip;
              acc_gp_p = checkProd(element?.prod_id)?.acc_wip;
              acc_sto_p = checkProd(element?.prod_id)?.acc_wip;
            } else {
              acc_gp_p = el.groupPro.acc_sto;
              acc_gp_p = checkProd(element?.prod_id)?.acc_sto;
              acc_sto_p = checkProd(element?.prod_id)?.acc_sto;
            }
          }
        });

        if (
          (setup?.gl_detail && acc_sto_p === null) ||
          (!setup?.gl_detail && acc_gp_p === null)
        ) {
          toast.current.show({
            severity: "error",
            summary: "Tidak Dapat Menyimpan Data",
            detail: `Akun Persediaan Produk Jadi Belum Diisi`,
            life: 6000,
          });
        }
      }
    });

    btc?.reject.forEach((element, i) => {
      total_rej += Number(element.aloc);
      qty_rej += Number(element.qty);

      grupP?.forEach((el) => {
        if (checkProd(element?.prod_id)?.group?.id === el?.groupPro?.id) {
          if (el.groupPro.wip) {
            acc_gp_r = el.groupPro.acc_wip;
            acc_gp_r = checkProd(element?.prod_id)?.acc_wip;
            acc_sto_r = checkProd(element.prod_id)?.acc_wip;
          } else {
            acc_gp_r = el.groupPro.acc_sto;
            acc_gp_r = checkProd(element?.prod_id)?.acc_sto;
            acc_sto_r = checkProd(element.prod_id)?.acc_sto;
          }
        }
      });
    });

    tqty = qty_pj + qty_rej;
    setErqty(tqty > qty_mat);

    total = total_prod + total_rej;
    setState(formatIdr(total) !== formatIdr(100));
    errors.prod.forEach((element) => {
      element.aloc = formatIdr(total) !== formatIdr(100);
      element.qty = tqty > qty_mat;
    });

    setStateErr(qty_m > st);
    errors?.mtrl?.forEach((element) => {
      element.qty = qty_m > st;
    });

    if (!errors.mtrl[0]?.id && !errors.mtrl[0]?.qty) {
      errors.mtrl?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    if (
      !errors.prod[0]?.id &&
      !errors.prod[0]?.lok &&
      !errors.prod[0]?.qty &&
      !errors.prod[0]?.aloc
    ) {
      errors.prod?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    let validProduct = 0;
    let validMtrl = 0;
    let count = 0;
    let t_co = 0;

    errors.mtrl?.forEach((el, i) => {
      for (var k in el) {
        validMtrl += !el[k] ? 1 : 0;
      }
    });

    errors.prod.forEach((elem, i) => {
      for (var k in elem) {
        validProduct += !elem[k] ? 1 : 0;
        if (elem[k] && i < active) {
          active = 0;
        }
      }
    });

    if (sto_no_hpok > 0) {
      toast.current.show({
        severity: "error",
        summary: "Tidak Dapat Menyimpan Data",
        detail: `Persediaan Produk Belum Ada Harga Pokok`,
        life: 6000,
      });
    }

    let val_err = (sto_no_hpok = 0);

    let acc_err =
      (setup?.gl_detail && acc_sto_m !== null) ||
      (!setup?.gl_detail && acc_gp_m !== null);

    let acc_er =
      (setup?.gl_detail && acc_sto_p !== null) ||
      (!setup?.gl_detail && acc_gp_p !== null);

    let acc_r =
      (setup?.gl_detail && acc_sto_r !== null) ||
      (!setup?.gl_detail && acc_gp_r !== null);

    valid =
      !errors.code &&
      !errors.date &&
      !errors.loc &&
      !errors.tot &&
      validMtrl === errors.mtrl.length * 2 && // jumlah error material dikalikan dengan jumlah key
      validProduct === errors.prod.length * 4; // jumlah error product dikalikan sama jumlah key
    // acc_err &&
    // acc_er &&
    // val_err

    setError(errors);
    console.log("=============");
    console.log(errors);

    if (!valid) {
      window.scrollTo({
        top: 80,
        left: 0,
        behavior: "smooth",
      });
      setActive(active);
    }

    return valid;
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
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4 fs-13">
          <div className="col-3 text-black">
            <PrimeInput
              label={"Kode Batch"}
              value={btc.bcode}
              onChange={(e) => {
                updateBTC({ ...btc, bcode: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode Batch"
              error={error?.code}
              disabled={isEdit}
            />
          </div>

          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${btc.batch_date}Z`)}
              onChange={(e) => {
                updateBTC({ ...btc, batch_date: e.target.value });

                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              placeholder="Pilih Tanggal"
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.date}
              minDate={date}
            />
          </div>

          <div className="col-1"></div>

          <div
            className="d-flex col-2 align-items-center mt-3"
            hidden={selectedMat}
          >
            <InputSwitch
              className="ml-0 mt-2"
              checked={selectedForm}
              onChange={(e) => {
                setSelectedForm(e.target.value);
              }}
              disabled={selectedMat}
            />
            <b>
              <label className="ml-3 mt-3">{"Ambil Formula"}</label>
            </b>
          </div>

          <div
            className="d-flex col-2 align-items-center mt-3"
            hidden={selectedForm === true}
          >
            <InputSwitch
              className="ml-0 mt-2"
              checked={selectedMat}
              onChange={(e) => {
                setSelectedMat(e.target.value);
              }}
              disabled={selectedForm}
            />
            <b>
              <label className="ml-3 mt-3">{"Ambil Material"}</label>
            </b>
          </div>

          <div className="col-12 p-0 text-black mb-3">
            {/* <div className="mt-4 mb-2 ml-3 mr-3 fs-13">
              <b>Informas</b>
            </div>
            <Divider className="mb-2 ml-3 mr-3"></Divider> */}
          </div>

          {selectedForm && !selectedMat ? (
            <>
              <div className="col-3 text-black">
                <label className="text-black">Formula</label>
                <PrimeDropdown
                  value={btc.forml_id && checkForml(btc?.forml_id)}
                  options={forml}
                  optionLabel="fcode"
                  onChange={(e) => {
                    e?.value?.material?.forEach((element) => {
                      element.stock = 0;
                      sto?.forEach((elem) => {
                        if (
                          btc.loc_id === elem.loc_id &&
                          element.prod_id === elem.id
                        ) {
                          element.stock = elem.stock;
                        }
                      });
                    });


                    console.log(e.value);

                    updateBTC({
                      ...btc,
                      forml_id: e?.value?.id ?? null,
                      total: null,
                      material: e?.value?.id
                        ? e?.value?.material?.map((v) => {
                            return {
                              ...v,
                              qty: v?.qty * btc?.total,
                              qty_f: v?.qty,
                              t_price: null,
                            };
                          })
                        : [
                            {
                              id: 0,
                              prod_id: null,
                              unit_id: null,
                              stock: null,
                              qty: null,
                            },
                          ],
                      product: e?.value?.id
                        ? e?.value?.product?.map((v) => {
                            return {
                              ...v,
                              loc_id: null,
                              qty: v?.qty * btc?.total,
                              qty_f: v?.qty ?? null,
                            };
                          })
                        : [
                            {
                              id: 0,
                              prod_id: null,
                              unit_id: null,
                              loc_id: null,
                              qty: null,
                              aloc: null,
                            },
                          ],
                    });
                  }}
                  placeholder="Pilih Formula"
                  filter
                  filterBy="fcode"
                  showClear
                />
              </div>
            </>
          ) : !selectedForm && selectedMat ? (
            <>
              <div className="col-3 text-black">
                <label className="text-black">Material</label>
                <PrimeDropdown
                  value={btc.mat_id && checkMat(btc?.mat_id)}
                  options={mat}
                  optionLabel="code"
                  onChange={(e) => {
                    e?.value?.material?.forEach((element) => {
                      element.stock = 0;
                      sto?.forEach((elem) => {
                        if (
                          e?.value?.loc_id.id === elem.loc_id &&
                          element.prod_id === elem.id
                        ) {
                          element.stock = elem.stock;
                        }
                      });
                    });

                    console.log(e.value);
                    updateBTC({
                      ...btc,
                      mat_id: e?.value?.id ?? null,
                      loc_id: e?.value?.loc_id?.id ?? null,
                      material: e?.value?.id
                        ? e?.value?.material?.map((v) => {
                            return {
                              ...v,
                              btc_id: null,
                              qty_f: 0,
                              price: 0,
                              t_price: 0,
                            };
                          })
                        :[
                          {
                            id: 0,
                            prod_id: null,
                            unit_id: null,
                            stock: null,
                            qty: null,
                            qty_f: 0,
                            price: 0,
                            t_price: 0,
                          },
                        ],

                      biaya: e?.value?.biaya,
                    });
                  }}
                  placeholder="Pilih Kode"
                  filter
                  filterBy="code"
                  showClear
                />
              </div>
            </>
          ) : (
            <></>
          )}

          <div className="col-3 text-black">
            <label className="text-black">Gudang Material</label>
            <CustomDropdown
              value={btc.loc_id && checkLok(btc.loc_id)}
              option={lokasi}
              label={"[name] ([code])"}
              onChange={(e) => {
                let st = 0;

                sto?.forEach((element) => {
                  btc?.material?.forEach((elem) => {
                    if (
                      element?.loc_id === e?.id &&
                      element?.id === elem?.prod_id
                    ) {
                      st = element?.stock;
                    }
                  });
                });

                updateBTC({
                  ...btc,
                  loc_id: e?.id ?? null,
                  material: btc?.material?.map((v) => {
                    return { ...v, stock: st };
                  }),
                });
                let newError = error;
                newError.loc = false;
                setError(newError);
              }}
              placeholder="Pilih Gudang Material"
              detail
              onDetail={() => setShowLok(true)}
              errorMessage="Gudang Belum Dipilih"
              error={error?.loc}
            />
          </div>

          <div className="col-1 text-black" hidden={btc.forml_id === null}>
            <PrimeNumber
              prc
              label={"Total Pembuatan"}
              value={btc.total}
              onChange={(e) => {
                btc?.product.forEach((element) => {
                  element.qty = element.qty_f * e.value;
                });

                btc?.material.forEach((elem) => {
                  elem.qty = elem.qty_f * e.value;
                });
                updateBTC({ ...btc, total: e.value });

                let newError = error;
                newError.tot = false;
                setError(newError);
              }}
              min={0}
              placeholder="0"
              type="number"
              error={error?.tot}
            />
          </div>

          <div className="col-2 text-black">
            <label className="text-black">Departement</label>
            <CustomDropdown
              value={btc.dep_id && checkDept(btc?.dep_id)}
              option={dept}
              label={"[ccost_name] ([ccost_code])"}
              onChange={(e) => {
                updateBTC({ ...btc, dep_id: e.id });
              }}
              placeholder="Pilih Departement"
              detail
              onDetail={() => setShowDept(true)}
            />
          </div>

          <div className="col-2">
            <label className="text-black">Mesin</label>
            <CustomDropdown
              value={btc.msn_id && checkMsn(btc?.msn_id)}
              option={mesin}
              label={"[msn_name] ([msn_code])"}
              onChange={(e) => {
                updateBTC({ ...btc, msn_id: e.id });
              }}
              placeholder="Pilih Mesin"
              detail
              onDetail={() => setShowMsn(true)}
            />
          </div>

          <div className="d-flex col-2 align-items-center mt-3">
            <InputSwitch
              className="ml-0 mt-2"
              checked={btc && btc.auto_aloc}
              onChange={(e) => {
                let t_qty = 0;
                btc?.material?.forEach((elem) => {
                  t_qty += elem.qty;
                });

                updateBTC({
                  ...btc,
                  auto_aloc: e.target.value,
                  product: btc?.product?.map((v) => ({
                    ...v,
                    aloc: e.target.value == true ? v.qty / (t_qty / 100) : null,
                  })),
                  reject: btc?.reject?.map((r) => ({
                    ...r,
                    aloc:
                      r.qty !== null && e.target.value
                        ? r.qty / (t_qty / 100)
                        : null,
                  })),
                });

                let newError = error;
                newError.prod.push({
                  aloc: false,
                });
                setError(newError);
              }}
              disabled={btc?.forml_id}
            />
            <b>
              <label className="ml-3 mt-3">{"Auto Alokasi"}</label>
            </b>
          </div>
        </Row>

        {/* {btc && btc.plan_id !== null && (
          <> */}
        <TabView
          className="ml-2"
          activeIndex={active}
          onTabChange={(e) => setActive(e.index)}
        >
          <TabPanel header="Bahan">
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="none"
                  value={btc.material?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      // order: v?.order ?? 0,
                      // price: v?.price ?? 0,
                    };
                  })}
                  className="display w-150 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    header="Bahan"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "20rem",
                    }}
                    body={(e) =>
                      btc?.forml_id || btc?.mat_id ? (
                        <PrimeInput
                          value={
                            e.prod_id &&
                            `${checkProd(e.prod_id).name} (${
                              checkProd(e.prod_id).code
                            })`
                          }
                          onChange={(e) => {}}
                          placeholder="Bahan"
                          disabled
                        />
                      ) : (
                        <PrimeDropdown
                          value={e.prod_id && checkProd(e.prod_id)}
                          options={product}
                          onChange={(u) => {
                            let sat = [];
                            satuan.forEach((element) => {
                              if (element.id === u.value.unit.id) {
                                sat.push(element);
                              } else {
                                if (element.u_from?.id === u.value.unit.id) {
                                  sat.push(element);
                                }
                              }
                            });

                            let st = 0;
                            sto?.forEach((element) => {
                              if (
                                element.loc_id === btc?.loc_id &&
                                element.id === u.value.id
                              ) {
                                st = element.stock;
                              }
                            });

                            let temp = [...btc.material];
                            temp[e.index].prod_id = u.value.id;
                            temp[e.index].unit_id = u.value.unit?.id;
                            temp[e.index].stock = st;

                            if (temp[e.index].qty > e.stock) {
                              temp[e.index].qty = e.stock;
                              toast.current.show({
                                severity: "warn",
                                summary: "Stock Tidak Mencukupi",
                                detail: `Stock ${st} Silahkan Melakukan Pembelian Terlebih Dahulu!!`,
                                life: 5000,
                              });
                            }
                            updateBTC({ ...btc, material: temp });

                            let newError = error;
                            newError.mtrl[e.index].id = false;
                            setError(newError);
                          }}
                          filter
                          filterBy="name"
                          optionLabel="name"
                          itemTemplate={prodTemp}
                          valueTemplate={valProd}
                          placeholder="Pilih Bahan"
                          errorMessage="Bahan Belum Dipilih"
                          error={error?.mtrl[e.index]?.id}
                          disabled={btc?.forml_id}
                        />
                      )
                    }
                  />

                  <Column
                    header="Satuan"
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   width: "15rem",
                    // }}
                    body={(e) =>
                      btc?.forml_id || btc?.mat_id ? (
                        <PrimeInput
                          value={e.unit_id && checkUnit(e.unit_id)?.name}
                          onChange={(e) => {}}
                          placeholder="Bahan"
                          disabled
                        />
                      ) : (
                        <PrimeDropdown
                          value={e.unit_id && checkUnit(e.unit_id)}
                          options={satuan}
                          onChange={(u) => {
                            let temp = [...btc.material];
                            temp[e.index].unit_id = u.value.id;
                            updateBTC({ ...btc, material: temp });
                          }}
                          optionLabel="name"
                          filter
                          filterBy="name"
                          placeholder="Satuan Produk"
                          disabled={btc?.forml_id}
                        />
                      )
                    }
                  />

                  <Column
                    // hidden
                    header="Stok"
                    className="align-text-top"
                    style={{
                      minWidth: "8rem",
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
                    hidden={btc.forml_id === null}
                    header="Kuantitas Formula"
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        prc
                        value={e.qty_f ? e.qty_f : ""}
                        onChange={(t) => {}}
                        min={0}
                        placeholder="0"
                        type="number"
                        disabled={btc?.forml_id}
                      />
                    )}
                  />

                  <Column
                    header={btc.forml_id ? "Kuantitas Total" : "Kuantitas"}
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.qty && e.qty}
                        onChange={(t) => {
                          let temp = [...btc.material];
                          temp[e.index].qty = t.value;

                          if (temp[e.index].qty > e.stock) {
                            temp[e.index].qty = e.stock;
                            toast.current.show({
                              severity: "warn",
                              summary: `Stock Tersisa ${e.stock} Unit`,
                              detail: `Silahkan Melakukan Pembelian Terlebih Dahulu!!`,
                              life: 5000,
                            });
                          }

                          temp[e.index].t_price =
                            temp[e.index].price * temp[e.index].qty;
                          updateBTC({ ...btc, material: temp });

                          let newError = error;
                          newError.mtrl[e.index].qty = false;
                          setError(newError);
                        }}
                        min={0}
                        placeholder="0"
                        type="number"
                        error={error?.mtrl[e.index]?.qty}
                        errorMessage={
                          stateErr ? "Kuantitas Melebihi Stock" : null
                        }
                        disabled={btc?.forml_id || btc.mat_id}
                      />
                    )}
                  />

                  <Column
                    hidden
                    header="Harga"
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        value={e.price ? e.price : ""}
                        onChange={(t) => {
                          let temp = [...btc.material];
                          temp[e.index].price = t.target.value;

                          temp[e.index].t_price =
                            temp[e.index].price * temp[e.index].qty;
                          updateBTC({ ...btc, material: temp });
                        }}
                        min={0}
                        placeholder="0"
                        type="number"
                      />
                    )}
                  />

                  <Column
                    hidden
                    header="Total"
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.t_price}
                        placeholder="0"
                        disabled
                      />
                    )}
                  />

                  <Column
                    hidden={btc?.forml_id || btc.mat_id}
                    header=""
                    className="align-text-top"
                    field={""}
                    body={(e) =>
                      e.index === btc.material.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.mtrl.push({
                              qty: false,
                            });
                            setError(newError);

                            updateBTC({
                              ...btc,
                              material: [
                                ...btc.material,
                                {
                                  id: 0,
                                  prod_id: null,
                                  unit_id: null,
                                  qty: null,
                                  price: null,
                                  t_price: null,
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
                            let newError = error;
                            newError.mtrl.push({
                              qty: false,
                            });
                            setError(newError);

                            let temp = [...btc.material];
                            temp.splice(e.index, 1);
                            updateBTC({ ...btc, material: temp });
                          }}
                          className="btn btn-danger shadow btn-xs sharp"
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      )
                    }
                  />
                </DataTable>
              </Card.Body>
            </Card>
          </TabPanel>

          {btc?.mat_id ? (
            <TabPanel header="Biaya Pemakaian Bahan">
              <Card>
                <Card.Body>
                  <DataTable
                    responsiveLayout="none"
                    value={btc.biaya?.map((v, i) => {
                      return {
                        ...v,
                        index: i,
                        value: v?.value ?? 0,
                      };
                    })}
                    className="display w-150 datatable-wrapper header-white no-border"
                    showGridlines={false}
                    emptyMessage={() => <div></div>}
                  >
                    <Column
                      header="Akun Biaya"
                      className="col-4 align-text-top"
                      field={""}
                      body={(e) => (
                        <PrimeInput
                          value={`${checkAcc(e.acc_id)?.acc_name} - ${
                            checkAcc(e.acc_id)?.acc_code
                          }`}
                          placeholder="Pilih Akun"
                          disabled
                        />
                      )}
                    />

                    <Column
                      header="Nominal Biaya"
                      className="col-3 align-text-top"
                      field={""}
                      body={(e) => (
                        <PrimeNumber
                          price
                          value={e.value && e.value}
                          onChange={(u) => {}}
                          placeholder="0"
                          type="number"
                          min={0}
                          disabled
                        />
                      )}
                    />

                    <Column
                      header="Deskripsi"
                      className="col-5 align-text-top"
                      field={""}
                      body={(e) => (
                        <PrimeInput
                          value={e.desc && e.desc}
                          onChange={(u) => {}}
                          placeholder="Deskripsi"
                          disabled
                        />
                      )}
                    />
                  </DataTable>
                </Card.Body>
              </Card>
            </TabPanel>
          ) : (
            <></>
          )}

          <TabPanel header="Produk Jadi">
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="none"
                  value={btc.product?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      // order: v?.order ?? 0,
                    };
                  })}
                  className="display w-150 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    header="Produk"
                    className="align-text-top"
                    field={""}
                    style={{
                      width: "20rem",
                    }}
                    body={(e) =>
                      btc?.forml_id ? (
                        <PrimeInput
                          value={
                            e.prod_id &&
                            `${checkProd(e.prod_id).name} (${
                              checkProd(e.prod_id).code
                            })`
                          }
                          onChange={(e) => {}}
                          placeholder="Produk Jadi"
                          disabled
                        />
                      ) : (
                        <PrimeDropdown
                          value={e.prod_id && checkProd(e.prod_id)}
                          options={product}
                          onChange={(u) => {
                            let st = 0;
                            let sat = [];
                            satuan.forEach((element) => {
                              if (element.id === u.value.unit.id) {
                                sat.push(element);
                              } else {
                                if (element.u_from?.id === u.value.unit.id) {
                                  sat.push(element);
                                }
                              }
                            });

                            let temp = [...btc.product];
                            temp[e.index].prod_id = u.value.id;
                            temp[e.index].unit_id = u.value.unit?.id;
                            updateBTC({ ...btc, product: temp });

                            let newError = error;
                            newError.prod[e.index].id = false;
                            setError(newError);
                          }}
                          filter
                          filterBy="name"
                          optionLabel="name"
                          itemTemplate={prodTemp}
                          valueTemplate={valProd}
                          placeholder="Pilih Produk"
                          errorMessage="Produk Belum Dipilih"
                          error={error?.prod[e.index]?.id}
                          // disabled={btc?.forml_id}
                        />
                      )
                    }
                  />

                  <Column
                    header="Satuan"
                    className="align-text-top"
                    field={""}
                    style={{
                      width: "15rem",
                    }}
                    body={(e) =>
                      btc?.forml_id ? (
                        <PrimeInput
                          value={e.unit_id && checkUnit(e.unit_id)?.name}
                          onChange={(e) => {}}
                          placeholder="Satuan"
                          disabled
                        />
                      ) : (
                        <PrimeDropdown
                          value={e.unit_id && checkUnit(e.unit_id)}
                          options={satuan}
                          onChange={(u) => {
                            let temp = [...btc.product];
                            temp[e.index].unit_id = u.value.id;
                            updateBTC({ ...btc, product: temp });
                          }}
                          optionLabel="name"
                          filter
                          filterBy="name"
                          placeholder="Satuan Produk"
                          disabled={btc?.forml_id}
                        />
                      )
                    }
                  />

                  <Column
                    header="Gudang Produk Jadi"
                    className="align-text-top"
                    field={""}
                    style={{
                      width: "15rem",
                    }}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.loc_id && checkLok(e.loc_id)}
                        options={lokasi}
                        onChange={(u) => {
                          let temp = [...btc.product];
                          temp[e.index].loc_id = u.value.id;
                          updateBTC({ ...btc, product: temp });

                          let newError = error;
                          newError.prod[e.index].lok = false;
                          setError(newError);
                        }}
                        optionLabel="name"
                        filter
                        filterBy="name"
                        placeholder="Pilih Gudang Produk"
                        errorMessage="Gudang Produk Belum Dipilih"
                        error={error?.prod[e.index]?.lok}
                      />
                    )}
                  />

                  <Column
                    hidden={btc.forml_id === null}
                    header="Kuantitas Formula"
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   minWidth: "7rem",
                    // }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.qty_f ? e.qty_f : ""}
                        onChange={(t) => {}}
                        min={0}
                        placeholder="0"
                        type="number"
                        disabled={btc?.forml_id}
                      />
                    )}
                  />

                  <Column
                    header={btc.forml_id ? "Kuantitas Total" : "Kuantitas"}
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   minWidth: "7rem",
                    // }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.qty && e.qty}
                        onChange={(t) => {
                          let temp = [...btc.product];
                          let t_qty = 0;

                          temp[e.index].qty = t.value;

                          btc?.material?.forEach((el) => {
                            t_qty += el.qty;
                          });

                          if (btc?.auto_aloc) {
                            temp[e.index].aloc = t.value / (t_qty / 100);
                          }

                          updateBTC({ ...btc, product: temp });

                          let newError = error;
                          newError.prod[e.index].qty = false;
                          setError(newError);
                        }}
                        min={0}
                        placeholder="0"
                        type="number"
                        error={error?.prod[e.index]?.qty}
                        errorMessage={
                          errQty ? "Total Kuantitas Melebihi Material" : null
                        }
                        disabled={btc?.forml_id}
                      />
                    )}
                  />

                  <Column
                    header="Cost Alokasi (%)"
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   minWidth: "7rem",
                    // }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.aloc && e.aloc}
                        onChange={(u) => {
                          let temp = [...btc.product];
                          temp[e.index].aloc = Number(u.value);

                          if (temp[e.index].aloc > 100) {
                            temp[e.index].aloc = 100;
                          }
                          updateBTC({ ...btc, product: temp });

                          let newError = error;
                          newError.prod[e.index].aloc = false;
                          setError(newError);
                          setState(false);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        max={100}
                        error={error?.prod[e.index]?.aloc}
                        errorMessage={
                          state ? "Total Cost Alokasi Harus 100%" : null
                        }
                        disabled={btc.auto_aloc || btc.forml_id}
                      />
                    )}
                  />

                  <Column
                    hidden={btc?.forml_id}
                    header=""
                    className="align-text-top"
                    field={""}
                    body={(e) =>
                      e.index === btc.product.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.prod.push({
                              qty: false,
                              aloc: false,
                            });
                            setError(newError);

                            updateBTC({
                              ...btc,
                              product: [
                                ...btc.product,
                                {
                                  id: 0,
                                  prod_id: null,
                                  unit_id: null,
                                  loc_id: null,
                                  qty: null,
                                  aloc: null,
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
                            let newError = error;
                            newError.prod.push({
                              qty: false,
                              aloc: false,
                            });
                            setError(newError);

                            let temp = [...btc.product];
                            temp.splice(e.index, 1);
                            updateBTC({ ...btc, product: temp });
                          }}
                          className="btn btn-danger shadow btn-xs sharp"
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      )
                    }
                  />
                </DataTable>
              </Card.Body>
            </Card>
          </TabPanel>

          <TabPanel header="Product Reject">
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="none"
                  value={btc.reject?.map((v, i) => {
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
                    header="Produk"
                    className="align-text-top"
                    field={""}
                    style={{
                      width: "20rem",
                    }}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.prod_id && checkProd(e.prod_id)}
                        options={product}
                        onChange={(u) => {
                          let sat = [];
                          satuan.forEach((element) => {
                            if (element.id === u.value.unit.id) {
                              sat.push(element);
                            } else {
                              if (element.u_from?.id === u.value.unit.id) {
                                sat.push(element);
                              }
                            }
                          });

                          let temp = [...btc.reject];
                          temp[e.index].prod_id = u.value.id;
                          temp[e.index].unit_id = u.value.unit?.id;

                          updateBTC({ ...btc, reject: temp });

                          // let newError = error;
                          // newError.mtrl[e.index].id = false;
                          // setError(newError);
                        }}
                        filter
                        filterBy="name"
                        optionLabel="name"
                        itemTemplate={prodTemp}
                        valueTemplate={valProd}
                        placeholder="Pilih Produk"
                        // errorMessage="Bahan Belum Dipilih"
                        // error={error?.mtrl[e.index]?.id}
                      />
                    )}
                  />

                  <Column
                    header="Satuan"
                    className="align-text-top"
                    field={""}
                    style={{
                      width: "15rem",
                    }}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        options={satuan}
                        onChange={(u) => {
                          let temp = [...btc.reject];
                          temp[e.index].unit_id = u.value.id;
                          updateBTC({ ...btc, reject: temp });
                        }}
                        optionLabel="name"
                        filter
                        filterBy="name"
                        placeholder="Satuan Produk"
                        disabled={btc.plan}
                      />
                    )}
                  />

                  <Column
                    header="Lokasi Produk Reject"
                    className="align-text-top"
                    field={""}
                    style={{
                      width: "15rem",
                    }}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.loc_id && checkLok(e.loc_id)}
                        options={lokasi}
                        onChange={(u) => {
                          let temp = [...btc.reject];
                          temp[e.index].loc_id = u.value.id;
                          updateBTC({ ...btc, reject: temp });
                        }}
                        optionLabel="name"
                        filter
                        filterBy="name"
                        placeholder="Lokasi Produk Reject"
                      />
                    )}
                  />

                  <Column
                    header="Kuantitas"
                    field={""}
                    // style={{
                    //   minWidth: "7rem",
                    // }}
                    body={(e) => (
                      <PrimeNumber
                        prc
                        value={e.qty ? e.qty : ""}
                        onChange={(t) => {
                          let temp = [...btc.reject];
                          let t_qty = 0;
                          temp[e.index].qty = t.value;

                          btc?.material?.forEach((el) => {
                            t_qty += Number(el.qty);
                          });

                          if (btc?.auto_aloc) {
                            temp[e.index].aloc = t.value / (t_qty / 100);
                          }

                          updateBTC({ ...btc, reject: temp });

                          // let newError = error;
                          // newError.jasa[e.index].jum = false;
                          // setError(newError);
                        }}
                        min={0}
                        placeholder="0"
                        type="number"
                        // error={error?.jasa[e.index]?.jum}
                      />
                    )}
                  />

                  <Column
                    header="Cost Alokasi (%)"
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   minWidth: "7rem",
                    // }}
                    body={(e) => (
                      <PrimeNumber
                        value={e.aloc ? e.aloc : ""}
                        onChange={(u) => {
                          let temp = [...btc.reject];
                          temp[e.index].aloc = Number(u.target.value);
                          if (temp[e.index].aloc > 100) {
                            temp[e.index].aloc = 100;
                          }
                          updateBTC({ ...btc, reject: temp });

                          // let newError = error;
                          // newError.prod[e.index].aloc = false;
                          // setError(newError);
                          // setState(false);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        max={100}
                        // error={error?.prod[e.index]?.aloc}
                        // errorMessage={
                        //   state ? "Total Cost Alokasi Harus 100%" : null
                        // }
                      />
                    )}
                  />

                  <Column
                    header=""
                    className="align-text-top"
                    field={""}
                    body={(e) =>
                      e.index === btc.reject.length - 1 ? (
                        <Link
                          onClick={() => {
                            updateBTC({
                              ...btc,
                              reject: [
                                ...btc.reject,
                                {
                                  id: 0,
                                  prod_id: null,
                                  unit_id: null,
                                  loc_id: null,
                                  qty: null,
                                  aloc: null,
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
                            let temp = [...btc.reject];
                            temp.splice(e.index, 1);
                            updateBTC({ ...btc, reject: temp });
                          }}
                          className="btn btn-danger shadow btn-xs sharp"
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      )
                    }
                  />
                </DataTable>
              </Card.Body>
            </Card>
          </TabPanel>

          <TabPanel header={btc?.mat_id ? "Biaya Lainnya" : "Biaya"}>
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="none"
                  value={btc.wages?.map((v, i) => {
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
                    header="Akun Biaya"
                    className="col-4 align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.acc_id && checkAcc(e.acc_id)}
                        options={acc}
                        onChange={(u) => {
                          let nom_d = 0;
                          let dt_btc = new Date(`${btc?.batch_date}Z`);
                          let nom_gl = 0;
                          transGl?.forEach((elem) => {
                            let dt_gl = new Date(`${elem?.trx_date}Z`);
                            if (
                              elem?.acc_id === u?.value?.id &&
                              dt_gl.getMonth() + 1 > setup?.cutoff &&
                              dt_gl.getFullYear() >= setup?.year_co
                            ) {
                              if (elem.trx_dbcr === "D") {
                                nom_gl += elem.trx_amnt;
                              } else {
                                nom_gl -= elem.trx_amnt;
                              }
                            }
                          });

                          trans?.forEach((element) => {
                            let dt = new Date(`${element?.trx_date}Z`);
                            if (
                              element?.acc_id === u?.value?.id &&
                              dt.getMonth() + 1 > setup?.cutoff &&
                              dt.getFullYear() >= setup?.year_co
                            ) {
                              if (element.trx_dbcr === "D") {
                                nom_d += element.trx_amnt;
                              } else {
                                nom_d -= element.trx_amnt;
                              }
                            }
                          });

                          let temp = [...btc.wages];
                          temp[e.index].acc_id = u.value?.id ?? null;
                          temp[e.index].value = nom_d + nom_gl;
                          updateBTC({ ...btc, wages: temp });
                        }}
                        filter
                        filterBy="acc_name"
                        optionLabel="account.acc_name"
                        itemTemplate={glTemplate}
                        valueTemplate={valTemp}
                        placeholder="Pilih Akun"
                        showClear
                      />
                    )}
                  />
                  <Column
                    // hidden={isEdit}
                    header={isEdit ? "Biaya Tersisa" : "Biaya Tersimpan"}
                    className="col-2 align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.value && e.value}
                        onChange={(u) => {}}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Nominal Biaya"
                    className="col-2 align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.nom_wgs && e.nom_wgs}
                        onChange={(u) => {
                          let temp = [...btc.wages];
                          temp[e.index].nom_wgs = u.value;

                          // if (temp[e.index].nom_wgs > e.value) {
                          //   temp[e.index].nom_wgs = e.value;
                          //   toast.current.show({
                          //     severity: "warn",
                          //     summary: `Biaya Melebihi Saldo Tersimpan`,
                          //     // detail: `Sisa Saldo Tersimpan  ${formatIdr(e.value)}`,
                          //     life: 7000,
                          //   });
                          // }

                          updateBTC({ ...btc, wages: temp });
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                      />
                    )}
                  />

                  <Column
                    header="Deskripsi"
                    className="col-4 align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeInput
                        value={e.desc && e.desc}
                        onChange={(u) => {
                          let temp = [...btc.wages];
                          temp[e.index].desc = u.target.value;

                          updateBTC({ ...btc, wages: temp });
                        }}
                        placeholder="Masukan Deskripsi"
                      />
                    )}
                  />

                  {/* <div className="col-"></div> */}

                  <Column
                    header=""
                    className="align-text-top"
                    field={""}
                    body={(e) =>
                      e.index === btc.wages.length - 1 ? (
                        <Link
                          onClick={() => {
                            updateBTC({
                              ...btc,
                              wages: [
                                ...btc.wages,
                                {
                                  id: 0,
                                  acc_id: null,
                                  nom_wgs: null,
                                  desc: null,
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
                            let temp = [...btc.wages];
                            temp.splice(e.index, 1);
                            updateBTC({ ...btc, wages: temp });
                          }}
                          className="btn btn-danger shadow btn-xs sharp"
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      )
                    }
                  />
                </DataTable>
              </Card.Body>
            </Card>
          </TabPanel>
        </TabView>
        {/* </>
        )} */}
        <div className="row mb-5">
          <span className="mb-5"></span>
        </div>
      </>
    );
  };

  const getIndex = () => {
    let total = 0;
    forml?.product?.forEach((el) => {
      total += el.index;
    });

    return total;
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div className="justify-content-left col-6">
          <div className="col-12 mt-0 ml-0 p-0 fs-12 text-left">
            {/* <label className="text-label">
              <b>Jumlah Produk : </b>
            </label>
            <span> {}</span>
            <label className="ml-8">
              <b>Jumlah Bahan : </b>
            </label>
            <span>{}</span> */}
          </div>
        </div>

        <div className="row justify-content-right col-6">
          <div className="col-12 mt-0 fs-12 text-right">
            <PButton
              label="Batal"
              onClick={onCancel}
              className="p-button-text btn-primary"
            />
            <PButton
              label="Simpan"
              icon="pi pi-check"
              onClick={() => onSubmit()}
              autoFocus
              loading={update}
            />
          </div>
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
              <>
                {/* {header()} */}
                {body()}
                {footer()}
              </>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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

            updateBTC({ ...btc, dep_id: e.data.id });
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
            updateBTC({ ...btc, unit_id: e.data.id });
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
          getLok();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowLok(false);
            updateBTC({ ...btc, loc_id: e.data.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataMesin
        data={mesin}
        loading={false}
        popUp={true}
        show={showMsn}
        onHide={() => {
          setShowMsn(false);
        }}
        onInput={(e) => {
          setShowMsn(!e);
        }}
        onSuccessInput={(e) => {
          getMesin();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowMsn(false);
            updateBTC({ ...btc, msn_id: e.data.id });
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

export default InputDirectBatch;