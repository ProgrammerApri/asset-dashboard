import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
import { Row, Col, Card, Badge } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { SET_CURRENT_PBB } from "src/redux/actions";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import { Divider } from "@material-ui/core";
import { TabPanel, TabView } from "primereact/tabview";
import DataAkun from "../../Master/Akun/DataAkun";
import DataProject from "src/jsx/screen/MasterLainnya/Project/DataProject";
import endpoints from "../../../../utils/endpoints";
import { SelectButton } from "primereact/selectbutton";
import { MultiSelect } from "primereact/multiselect";
import CustomAccordion from "../../../components/Accordion/Accordion";
import { InputSwitch } from "primereact/inputswitch";
import { Calendar } from "primereact/calendar";
import { SET_PERIOD } from "../../../../redux/actions";

const defError = {
  code: false,
  // name: false,
  date: false,
  btc: false,
  uph: [
    {
      id: false,
      nom: false,
    },
  ],
  ovr: [
    {
      id: false,
    },
  ],
};

const type_pb = [
  { kode: 1, name: "Atas Batch" },
  { kode: 2, name: "Atas Produk" },
  { kode: 3, name: "Atas Panen" },
];

const InputPembebanan = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useRef(null);
  const [active, setActive] = useState(0);
  const [doubleClick, setDoubleClick] = useState(false);
  const pbb = useSelector((state) => state.pbb.current);
  const isEdit = useSelector((state) => state.pbb.editPbb);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [showAcc, setShowAcc] = useState(false);
  const [acc, setAcc] = useState(null);
  const [accDdb, setAccDdb] = useState(null);
  const [account, setAccount] = useState(null);
  const [all_ac, setAllAc] = useState(null);
  const [batch, setBatch] = useState(null);
  const [setup, setSetup] = useState(null);
  const [stcard, setStCard] = useState(null);
  const [allst, setAllSt] = useState(null);
  const [prodPanen, setProdPanen] = useState(null);
  const [period, setPeriod] = useState(null);
  const [produk, setProduk] = useState(null);
  const [prd, setPrd] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [trans, setTrans] = useState(null);
  const [transGl, setTransGl] = useState(null);
  const [showProj, setShowProj] = useState(false);
  const [proj, setProj] = useState(null);
  const [selectedPanen, setSelectedPanen] = useState(null);
  const [error, setError] = useState(defError);
  const [accor, setAccor] = useState({
    detail: true,
    panen: true,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getAcc();
    getSetup();
    getBatch();
    getStcard();
    getProduk();
    getLokasi();
    getAccDdb();
    getTrans();
    getTransGl();
    getProj();
  }, []);

  const getAcc = async () => {
    const config = {
      ...endpoints.account,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        let all_d = [];
        data.forEach((elem) => {
          if (elem.account.dou_type === "D") {
            filt.push(elem);
          }

          if (elem.account.dou_type === "D" && elem.account.sld_type === "D") {
            all_d.push(elem.account);
          }
        });
        setAcc(filt);
        setAccount(all_d);
        setAllAc(data);
      }
    } catch (error) {}
  };

  const getBatch = async () => {
    const config = {
      ...endpoints.direct_batch,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((element) => {
          if (element.pb === false) {
            filt.push(element);
          }
        });
        setBatch(data);
      }
    } catch (error) {}
  };

  const getStcard = async () => {
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
        let filt = [];
        let filt_panen = [];
        data.forEach((element) => {
          if (
            element.trx_type === "PJ" ||
            (element.trx_type === "PR" && element.trx_hpok !== null)
          ) {
            filt.push(element);
          }

          if (element.trx_type === "HRV" || element.trx_type === "MD") {
            filt_panen.push(element);
          }
        });

        let groupprd = filt
          ?.filter(
            (el, i) =>
              i === filt.findIndex((ek) => el?.prod_id?.id === ek?.prod_id?.id)
          )
          .map((v) => ({ ...v, trx: [], t_qty: 0, aloc: 0 }));

        groupprd?.forEach((element) => {
          filt?.forEach((elem) => {
            if (element?.prod_id?.id === elem?.prod_id?.id) {
              element.trx.push(elem);
              element.t_qty += elem.trx_qty;
            }
          });
        });

        let grouppanen = filt_panen
          ?.filter(
            (el, i) =>
              i ===
              filt_panen.findIndex((ek) => el?.prod_id?.id === ek?.prod_id?.id)
          )
          .map((v) => ({ ...v, t_qty: 0, aloc: 0 }));

        setStCard(filt);

        setAllSt(data);

        setProdPanen(grouppanen);

        setProduk(groupprd);
      }
    } catch (error) {
      console.log(error);
    }
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
        setPrd(data);
      }
    } catch (error) {}
  };

  const getLokasi = async () => {
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

  const getTrans = async () => {
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

  const getAccDdb = async () => {
    const config = {
      ...endpoints.acc_ddb,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        setAccDdb(data);
      }
    } catch (error) {}
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
        console.log(data);
        setProj(data);
      }
    } catch (error) {}
  };

  const editPBB = async () => {
    const config = {
      ...endpoints.editPBB,
      endpoint: endpoints.editPBB.endpoint + pbb.id,
      data: { ...pbb, batch_id: pbb?.batch_id?.id ?? null },
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

  const addPBB = async () => {
    const config = {
      ...endpoints.addPBB,
      data: pbb,
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
            detail: `Kode ${pbb.pbb_code} Sudah Digunakan`,
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

  const checkAcc = (value) => {
    let selected = {};
    account?.forEach((element) => {
      if (value === element.id) {
        selected = element;
        console.log(selected);
      }
    });

    return selected;
  };

  const checkbtc = (value) => {
    let selected = {};
    batch?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkSt = (value) => {
    let selected = {};
    allst?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkProd = (value) => {
    let selected = null;
    produk?.forEach((element) => {
      if (value === element?.prod_id?.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkPrdPanen = (value) => {
    let selected = null;
    prodPanen?.forEach((element) => {
      if (value === element.prod_id?.id) {
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

  const prj = (value) => {
    let selected = {};
    proj?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const status = () => {
    let flag = 0;
    stcard?.forEach((element) => {
      pbb?.product?.forEach((elem) => {
        if (
          checkbtc(elem.trn_id)?.bcode === element?.trx_code &&
          elem.prd_id === element?.prod_id?.id
        ) {
          flag = element?.flag;
        }
      });
    });

    return flag;
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

  const isValid = () => {
    let valid = false;
    let active = 1;
    let errors = {
      code: !pbb.pbb_code || pbb.pbb_code === "",
      date: !pbb.pbb_date || pbb.pbb_date === "",
      // name: !pbb.pbb_name || pbb.pbb_name === "",
      btc: pbb?.type_pb === 1 ? !pbb.batch_id : false,
      uph: [],
    };

    pbb?.upah.forEach((element, i) => {
      if (i > 0) {
        if (element.acc_id || element.nom_uph) {
          errors.uph[i] = {
            id: !element.acc_id,
            nom:
              !element.nom_uph ||
              element.nom_uph === "" ||
              element.nom_uph === "0",
          };
        }
      } else {
        errors.uph[i] = {
          id: !element.acc_id,
          nom:
            !element.nom_uph ||
            element.nom_uph === "" ||
            element.nom_uph === "0",
        };
      }
    });

    if (!errors.uph[0]?.id && !errors.uph[0]?.nom) {
      errors.ovr?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    let validUph = false;
    // if (!validUph) {
    errors.uph?.forEach((el, i) => {
      for (var k in el) {
        validUph = !el[k];
      }
    });
    // }

    if (!validUph) {
      toast.current.show({
        severity: "error",
        summary: "Tidak Dapat Menyimpan Data",
        detail: `Biaya Pembebanan Belum Diisi`,
        life: 6000,
      });
    }

    valid = !errors.code && !errors.date && !errors.btc && validUph;

    setError(errors);

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });

      // setActive(active);
    }

    return valid;
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editPBB();
      } else {
        setUpdate(true);
        addPBB();
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

  const formatTh = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const forTh = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const updatePBB = (e) => {
    dispatch({
      type: SET_CURRENT_PBB,
      payload: e,
    });
  };

  const itemTempLoc = (option) => {
    return (
      <div>{option !== null ? `${option.name} (${option.code})` : ""}</div>
    );
  };

  const valueTempLoc = (option, props) => {
    if (option) {
      return (
        <div>{option !== null ? `${option.name} (${option.code})` : ""}</div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const itemTempProd = (option) => {
    return (
      <div>
        {option !== null
          ? `${option?.prod_id.name} (${option?.prod_id.code})`
          : ""}
      </div>
    );
  };

  const valueTempProd = (option, props) => {
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

  const body = () => {
    let date = new Date(setup?.year_co, setup?.cutoff - 1, 31);
    return (
      <>
        <Toast ref={toast} />
        <Row className="mb-4 fs-13">
          <div className="col-3 text-black">
            <PrimeInput
              label={"Kode Pembebanan"}
              value={pbb.pbb_code}
              onChange={(e) => {
                updatePBB({ ...pbb, pbb_code: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode"
              error={error?.code}
              disabled={isEdit}
            />
          </div>

          <div className="col-3 text-black">
            <PrimeInput
              label={"Nama Pembebanan"}
              value={pbb.pbb_name}
              onChange={(e) => {
                updatePBB({ ...pbb, pbb_name: e.target.value });
              }}
              placeholder="Masukan Nama Pembebanan"
            />
          </div>

          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${pbb.pbb_date}Z`)}
              onChange={(e) => {
                let nom_d = 0;
                let nom_gl = 0;
                let dt_pbb = new Date(`${e.target?.value}Z`);
                transGl?.forEach((elem) => {
                  let dt = new Date(`${elem?.trx_date}Z`);
                  pbb?.upah?.forEach((el) => {
                    if (
                      elem?.acc_id === el?.acc_id &&
                      dt.getMonth() + 1 > setup?.cutoff &&
                      dt.getFullYear() >= setup?.year_co
                    ) {
                      if (elem.trx_dbcr === "D") {
                        nom_gl += elem.trx_amnt;
                      } else {
                        nom_gl -= elem.trx_amnt;
                      }
                    }
                  });
                });

                trans?.forEach((element) => {
                  let dt = new Date(`${element?.trx_date}Z`);
                  pbb?.upah?.forEach((el) => {
                    if (
                      element?.acc_id === el?.acc_id &&
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
                });

                console.log("cutoff" + setup.cutoff);
                console.log("year_co" + setup.year_co);

                updatePBB({
                  ...pbb,
                  pbb_date: e.target.value,
                  upah: pbb?.upah?.map((v) => {
                    return {
                      ...v,
                      value: nom_d + nom_gl,
                    };
                  }),
                });

                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              placeholder="Pilih Tanggal"
              dateFormat="dd-mm-yy"
              showIcon
              error={error?.date}
              minDate={date}
            />
          </div>

          <div className="col-12 mt-6 mb-3 text-black">
            <SelectButton
              value={
                pbb !== null && pbb.type_pb !== ""
                  ? pbb.type_pb === 1
                    ? { kode: 1, name: "Atas Batch" }
                    : pbb.type_pb === 2
                    ? { kode: 2, name: "Atas Produk" }
                    : { kode: 3, name: "Atas Panen" }
                  : null
              }
              options={type_pb}
              onChange={(e) => {
                updatePBB({
                  ...pbb,
                  type_pb: e.value?.kode ?? null,
                  batch_id: null,
                  prod_id: null,
                  t_qty: null,
                  aloc: null,
                  panen_loc: null,
                  panen_prod: null,
                  proj_id: null,
                  product: [
                    {
                      id: 0,
                      trn_id: null,
                      prd_id: null,
                      qty: null,
                      aloc: null,
                    },
                  ],
                  panen: null,
                });

                let newError = error;
                if (e.value.kode === 2) {
                  newError.btc = false;
                }
              }}
              optionLabel="name"
            />
          </div>

          {pbb.type_pb === 1 ? (
            <>
              <div className="col-3 text-black">
                <label className="text-black">Kode Batch</label>
                {isEdit ? (
                  <PrimeInput
                    value={pbb.batch_id !== null ? pbb.batch_id?.bcode : null}
                    placeholder="Kode Batch"
                    disabled
                  />
                ) : (
                  <PrimeDropdown
                    value={pbb.batch_id && checkbtc(pbb.batch_id)}
                    options={batch}
                    onChange={(e) => {
                      updatePBB({
                        ...pbb,
                        batch_id: e?.value?.id ?? null,
                        product: e?.value?.id
                          ? e.value.product?.map((v) => {
                              return {
                                ...v,
                                trn_id: e?.value?.id,
                                prd_id: v.prod_id?.id,
                                aloc_qty: null,
                              };
                            })
                          : [
                              {
                                id: 0,
                                trn_id: null,
                                prd_id: null,
                                qty: null,
                                aloc: null,
                                aloc_qty: null,
                              },
                            ],
                      });
                      let newError = error;
                      newError.btc = false;
                      setError(newError);
                    }}
                    optionLabel="bcode"
                    filter
                    filterBy="bcode"
                    placeholder="Pilih Kode Batch"
                    errorMessage="Kode Batch Belum DIpilih"
                    error={error?.btc}
                    showClear
                  />
                )}
              </div>

              <div className="col-3 text-black">
                <label className="text-black">Departement</label>
                <div className="p-inputgroup"></div>
                <PrimeInput
                  value={
                    pbb.batch_id !== null
                      ? checkbtc(pbb.batch_id)?.dep_id?.ccost_name
                      : null
                  }
                  placeholder="Departemen"
                  disabled
                />
              </div>
            </>
          ) : pbb.type_pb === 2 ? (
            <>
              <div className="col-2 text-black">
                <PrimeCalendar
                  label={"Periode"}
                  value={new Date(`${pbb?.period}Z`) ?? null}
                  onChange={(e) => {
                    // upPeriod(e.target.value);
                    updatePBB({ ...pbb, period: e.target.value });
                  }}
                  placeholder="Pilih Periode"
                  dateFormat="MM yy"
                  showIcon
                  view="month"
                  minDate={date}
                />
              </div>

              <div className="col-3 text-black">
                <label className="text-black">Produk</label>
                <div className="p-inputgroup">
                  <MultiSelect
                    value={
                      pbb?.prod_id
                        ? pbb?.prod_id?.map((v) => checkProd(v))
                        : null
                    }
                    options={produk}
                    onChange={(e) => {
                      let filt = [];
                      let all_qty = 0;

                      e?.value?.forEach((elem) => {
                        let t_qty = 0;
                        let dt = new Date(`${elem?.trx_date}Z`);
                        t_qty = elem?.t_qty;
                        if (
                          new Date(`${pbb?.period}Z`)?.getMonth() + 1 ===
                            dt?.getMonth() + 1 &&
                          new Date(`${pbb?.period}Z`)?.getFullYear() ===
                            dt?.getFullYear()
                        ) {
                          elem?.trx.forEach((element) => {
                            all_qty += element.trx_qty;
                            filt.push({
                              ...element,
                              t_qty: t_qty,
                              aloc_qty: 0,
                            });
                          });
                        }

                        // elem.aloc = t_qty / (all_qty / 100);
                      });

                      console.log("=======prod");
                      console.log(e.value);

                      updatePBB({
                        ...pbb,
                        a_qty: all_qty,
                        prod_id: e?.value?.map((a) => a?.prod_id?.id),
                        product: filt?.map((v) => {
                          return {
                            ...v,
                            trn_id: v?.id,
                            prd_id: v.prod_id?.id,
                            qty: v?.trx_qty,
                            aloc: v.t_qty / (all_qty / 100),
                            aloc_qty: v.trx_qty / (v.t_qty / 100),
                          };
                        }),
                      });
                    }}
                    placeholder="Pilih Produk"
                    optionLabel="prod_id.name"
                    showClear
                    filterBy="prod_id.name"
                    filter
                    display="chip"
                    className="w-full md:w-20rem"
                    maxSelectedLabels={3}
                  />
                </div>
              </div>

              <div className="col-2 text-black" hidden>
                <b>
                  <label className="ml-4 mt-1  fs-12 text-black">
                    {"Auto Alokasi"}
                  </label>
                </b>
                <div className="p-inputgroup ml-4 mt-2">
                  <InputSwitch
                    className="ml-0"
                    checked={pbb && pbb.auto_aloc}
                    onChange={(e) => {
                      let all_qty = 0;
                      pbb?.product?.forEach((element) => {
                        all_qty += element.trx_qty;
                      });

                      pbb?.prod_id?.forEach((el) => {
                        el.aloc = el.t_qty / (all_qty / 100);
                      });

                      // console.log("total_qty: " + all_qty);

                      // selectedProducts?.forEach((elem) => {
                      //   t_qty_check += elem.trx_qty;
                      // });

                      updatePBB({
                        ...pbb,
                        auto_aloc: e.target?.value,
                      });
                    }}
                  />
                </div>
              </div>

              {/* <div className="col-5"></div> */}
            </>
          ) : (
            <>
              <div className="col-3 text-black">
                <label className="text-black">Lokasi Gudang</label>
                <PrimeDropdown
                  value={pbb.panen_loc && checkLoc(pbb.panen_loc)}
                  options={lokasi}
                  onChange={(e) => {
                    let trn = [];
                    let all_qty = 0;
                    allst?.forEach((element) => {
                      if (
                        element?.prod_id?.id === pbb?.panen_prod &&
                        element.loc_id?.id === e?.value?.id
                      ) {
                        if (
                          (element?.trx_type === "HRV" &&
                            element.mtsi === 0 &&
                            element.flag === 0) ||
                          (element.trx_type === "MD" && element.flag === 0)
                        ) {
                          all_qty += element?.trx_qty;
                          trn.push({ ...element, all_qty: all_qty });
                        }
                      }
                    });
                    console.log("===val");
                    console.log(trn);

                    updatePBB({
                      ...pbb,
                      panen_loc: e?.value?.id ?? null,
                      pnn: e?.value?.id
                        ? trn?.map((v) => {
                            return {
                              ...v,
                              trn_id: v?.id,
                              trn_date: v?.trx_date,
                              trn_type: v?.trx_type,
                              prd_id: v?.prod_id?.id,
                              qty: v?.trx_qty,
                              aloc: v.trx_qty / (all_qty / 100),
                            };
                          })
                        : null,

                      panen: e?.value?.id
                        ? trn?.map((v) => {
                            return {
                              ...v,
                              trn_id: v?.id,
                              trn_date: v?.trx_date,
                              trn_type: v?.trx_type,
                              prd_id: v?.prod_id?.id,
                              qty: v?.trx_qty,
                              aloc: v.trx_qty / (all_qty / 100),
                            };
                          })
                        : null,
                    });
                    // let newError = error;
                    // newError.btc = false;
                    // setError(newError);
                  }}
                  optionLabel="name"
                  filter
                  filterBy="name"
                  placeholder="Pilih Lokasi"
                  itemTemplate={itemTempLoc}
                  valueTemplate={valueTempLoc}
                  // errorMessage="Kode Batch Belum DIpilih"
                  // error={error?.btc}
                  showClear
                />
              </div>

              <div className="col-3 text-black">
                <label className="text-black">Produk Panen</label>
                <PrimeDropdown
                  value={pbb.panen_prod && checkPrdPanen(pbb.panen_prod)}
                  options={prodPanen}
                  onChange={(e) => {
                    let trn = [];
                    let all_qty = 0;
                    allst?.forEach((element) => {
                      if (
                        element?.prod_id?.id === e?.value?.prod_id?.id &&
                        element.loc_id?.id === pbb?.panen_loc
                      ) {
                        if (
                          (element?.trx_type === "HRV" &&
                            element.mtsi === 0 &&
                            element.flag === 0) ||
                          (element.trx_type === "MD" && element.flag === 0)
                        ) {
                          all_qty += element?.trx_qty;
                          trn.push({ ...element, all_qty: all_qty });
                        }
                      }
                    });

                    console.log("===val");
                    console.log(pbb.panen_prod);

                    updatePBB({
                      ...pbb,
                      panen_prod: e?.value?.prod_id?.id ?? null,
                      pnn: e?.value?.prod_id?.id
                        ? trn?.map((v) => {
                            return {
                              ...v,
                              trn_id: v?.id,
                              trn_date: v?.trx_date,
                              trn_type: v?.trx_type,
                              prd_id: v?.prod_id?.id,
                              qty: v?.trx_qty,
                              aloc: v.trx_qty / (v.all_qty / 100),
                            };
                          })
                        : null,

                      panen: e?.value?.id
                        ? trn?.map((v) => {
                            return {
                              ...v,
                              trn_id: v?.id,
                              trn_date: v?.trx_date,
                              trn_type: v?.trx_type,
                              prd_id: v?.prod_id?.id,
                              qty: v?.trx_qty,
                              aloc: v.trx_qty / (v.all_qty / 100),
                            };
                          })
                        : null,
                    });
                    // let newError = error;
                    // newError.btc = false;
                    // setError(newError);
                  }}
                  optionLabel="prod_id.name"
                  filter
                  filterBy="prod_id.name"
                  placeholder="Pilih Produk"
                  itemTemplate={itemTempProd}
                  valueTemplate={valueTempProd}
                  // errorMessage="Kode Batch Belum DIpilih"
                  // error={error?.btc}
                  showClear
                />
              </div>
            </>
          )}

          <div className="col-3 text-black" hidden>
            <label className="text-black">Akun Kredit</label>
            <PrimeDropdown
              value={pbb.acc_cred && checkAcc(pbb.acc_cred)}
              options={acc}
              onChange={(u) => {
                updatePBB({ ...pbb, acc_cred: u.value.account.id });

                let newError = error;
                newError.acc_k = false;
                setError(newError);
              }}
              filter
              filterBy="account.acc_name"
              optionLabel="account.acc_name"
              itemTemplate={glTemplate}
              valueTemplate={valTemp}
              placeholder="Pilih Akun Kredit"
              errorMessage="Akun Belum Dipilih"
              error={error?.acc_k}
            />
          </div>

          <div className="col-3">
            <label className="text-label text-black">Project</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={pbb.proj_id ? prj(pbb?.proj_id) : null}
              option={proj}
              onChange={(e) => {
                updatePBB({
                  ...pbb,
                  proj_id: e?.id ?? null,
                });
              }}
              label={"[proj_name] - [proj_code]"}
              placeholder="Pilih Project"
              detail
              onDetail={() => setShowProj(true)}
              showClear
            />
          </div>

          <div className="col-6 text-black">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputText
                value={pbb.desc}
                onChange={(e) => updatePBB({ ...pbb, desc: e.target.value })}
                placeholder="Masukan Keterangan"
                error={error?.desc}
              />
            </div>
          </div>
        </Row>

        <div className="col-10"></div>

        <TabView
          className="m-1"
          activeIndex={active}
          onTabChange={(e) => setActive(e.index)}
        >
          <TabPanel
            header={
              pbb?.type_pb === 1
                ? "Detail Produk"
                : pbb.type_pb
                ? "Bukti Produksi"
                : "Bukti Panen"
            }
          >
            <div className="col-12 mt-0 p-component">
              {pbb?.type_pb === 2 ? (
                <>
                  {pbb?.prod_id
                    ?.map((v) => checkProd(v))
                    .map((val) => {
                      return (
                        <>
                          <CustomAccordion
                            tittle={val?.prod_id?.name}
                            defaultActive={true}
                            active={accor.detail}
                            onClick={() => {
                              setAccor({
                                ...accor,
                                detail: !accor.detail,
                              });
                            }}
                            key={1}
                            body={
                              <>
                                <DataTable
                                  responsiveLayout="scroll"
                                  // selection={selectedProducts}
                                  // onSelectionChange={(e) => {
                                  //   setSelectedProducts(e.value);
                                  //   let filt = [];
                                  //   let t_qty = 0;
                                  //   let all_qty = 0;

                                  //   e?.value?.forEach((elem) => {
                                  //     let dt = new Date(`${elem?.trx_date}Z`);
                                  //     t_qty = elem.t_qty;
                                  //     all_qty += elem.trx_qty;
                                  //     if (
                                  //       period?.getMonth() + 1 ===
                                  //         dt?.getMonth() + 1 &&
                                  //       period?.getFullYear() ===
                                  //         dt?.getFullYear()
                                  //     ) {
                                  //       // elem?.trx.forEach((element) => {
                                  //       filt.push({
                                  //         ...elem,
                                  //         t_qty: t_qty,
                                  //         aloc_qty: 0,
                                  //       });
                                  //       // });
                                  //     }

                                  //     elem.aloc = t_qty / (all_qty / 100);
                                  //   });

                                  //   updatePBB({
                                  //     ...pbb,
                                  //     a_qty: all_qty,
                                  //     product: filt?.map((v) => {
                                  //       return {
                                  //         ...v,
                                  //         trn_id: v?.id,
                                  //         prd_id: v.prod_id?.id,
                                  //         qty: v?.trx_qty,
                                  //         aloc: v.t_qty / (all_qty / 100),
                                  //         aloc_qty: v.trx_qty / (v.t_qty / 100),
                                  //       };
                                  //     }),
                                  //   });
                                  //   console.log("===select");
                                  //   console.log(e.value);
                                  // }}
                                  value={
                                    new Date(`${pbb?.period}Z`)?.getMonth() +
                                      1 ===
                                      new Date(
                                        `${val?.trx_date}Z`
                                      )?.getMonth() +
                                        1 &&
                                    new Date(
                                      `${pbb?.period}Z`
                                    )?.getFullYear() ===
                                      new Date(
                                        `${val?.trx_date}Z`
                                      )?.getFullYear()
                                      ? val?.trx
                                      : null
                                  }
                                  className="display w-150 datatable-wrapper header-white no-border"
                                  showGridlines={false}
                                  emptyMessage={() => <div></div>}
                                >
                                  {/* <Column
                                  selectionMode="multiple"
                                  headerStyle={{ width: "3rem" }}
                                  exportable={false}
                                /> */}

                                  <Column
                                    header="Kode Bukti"
                                    className="align-text-top"
                                    field={""}
                                    body={(e) => (
                                      <PrimeInput
                                        value={e.trx_code}
                                        onChange={(u) => {}}
                                        placeholder="Kode Bukti"
                                        disabled
                                      />
                                    )}
                                  />

                                  <Column
                                    header="Tanggal Produksi"
                                    className="align-text-top"
                                    field={""}
                                    body={(e) => (
                                      <div className="p-inputgroup">
                                        <Calendar
                                          value={
                                            new Date(
                                              `${
                                                // checkbtc(e.trn_id)?.batch_date ||
                                                // checkSt(e.trn_id)?.trx_date
                                                e.trx_date
                                              }Z`
                                            )
                                          }
                                          onChange={(e) => {}}
                                          placeholder="Tanggal Produksi"
                                          dateFormat="dd-mm-yy"
                                          disabled
                                        />
                                      </div>
                                    )}
                                  />

                                  <Column
                                    header="Produk"
                                    className="align-text-top"
                                    field={""}
                                    body={(e) => (
                                      <PrimeInput
                                        value={
                                          e.prod_id?.name
                                          // e.prd_id
                                          //   ? checkProd(e.prd_id)?.name
                                          //   : ""
                                        }
                                        onChange={(u) => {}}
                                        placeholder="Produk"
                                        disabled
                                      />
                                    )}
                                  />

                                  <Column
                                    header="Qty Produksi"
                                    className="align-text-top"
                                    field={""}
                                    body={(e) => (
                                      <PrimeNumber
                                        prc
                                        value={
                                          e.trx_qty
                                          // e.qty
                                        }
                                        onChange={(u) => {}}
                                        placeholder="0"
                                        disabled
                                      />
                                    )}
                                  />

                                  <Column
                                    header=""
                                    className="align-text-top"
                                    body={(e) => (
                                      <div className="" hidden={e.flag === 0}>
                                        <Badge
                                          className="ml-3"
                                          variant="warning light"
                                        >
                                          <i className="bx bxs-circle text-warning mr-1"></i>{" "}
                                          Sudah Ada Penambahan Biaya
                                        </Badge>
                                      </div>
                                    )}
                                  />
                                </DataTable>

                                <div
                                  className="row justify-content-between mt-5"
                                  hidden
                                >
                                  <div className="row justify-content-left col-3 text-black ml-2">
                                    <label className="text-label ml-7 mr-3 mt-3">
                                      All Qty : {formatTh(pbb?.a_qty) ?? 0}
                                    </label>
                                  </div>

                                  <div className="row justify-content-left col-3 text-black ml-2">
                                    <label className="text-label ml-6 mr-3 mt-3">
                                      Total Qty : {formatTh(val?.t_qty) ?? null}
                                    </label>
                                  </div>

                                  <div className="row justify-content-right col-6 text-black mr-2">
                                    <label className="text-label ml-6 mr-3 mt-3">
                                      Alokasi : {forTh(val?.aloc) ?? 0} %
                                    </label>
                                  </div>
                                </div>
                              </>
                            }
                          />
                        </>
                      );
                    })}
                </>
              ) : pbb.type_pb === 1 ? (
                <>
                  <CustomAccordion
                    tittle={"Detail Finish Produk"}
                    defaultActive={true}
                    active={accor.detail}
                    onClick={() => {
                      setAccor({
                        ...accor,
                        detail: !accor.detail,
                      });
                    }}
                    key={1}
                    body={
                      <>
                        <DataTable
                          responsiveLayout="scroll"
                          value={
                            // v
                            pbb?.product?.map((v, i) => {
                              return {
                                ...v,
                                index: i,
                              };
                            })
                          }
                          className="display w-150 datatable-wrapper header-white no-border"
                          showGridlines={false}
                          emptyMessage={() => <div></div>}
                        >
                          <Column
                            header="Kode Bukti"
                            className="align-text-top"
                            field={""}
                            body={(e) => (
                              <PrimeInput
                                value={
                                  pbb?.type_pb === 1
                                    ? pbb?.batch_id
                                      ? checkbtc(e.trn_id)?.bcode
                                      : ""
                                    : null
                                }
                                onChange={(u) => {}}
                                placeholder="Kode Bukti"
                                disabled
                              />
                            )}
                          />

                          <Column
                            header="Tanggal Produksi"
                            className="align-text-top"
                            field={""}
                            body={(e) => (
                              <div className="p-inputgroup">
                                <Calendar
                                  value={
                                    new Date(
                                      `${checkbtc(e.trn_id)?.batch_date}Z`
                                    )
                                  }
                                  onChange={(e) => {}}
                                  placeholder="Tanggal Produksi"
                                  dateFormat="dd-mm-yy"
                                  disabled
                                />
                              </div>
                            )}
                          />

                          <Column
                            header="Produk"
                            className="align-text-top"
                            field={""}
                            body={(e) => (
                              <PrimeInput
                                value={
                                  e.prd_id ? checkProd(e.prd_id)?.name : ""
                                }
                                onChange={(u) => {}}
                                placeholder="Produk"
                                disabled
                              />
                            )}
                          />

                          <Column
                            header="Qty Produksi"
                            className="align-text-top"
                            field={""}
                            body={(e) => (
                              <PrimeNumber
                                prc
                                value={e.qty && e.qty}
                                onChange={(u) => {}}
                                placeholder="0"
                                disabled
                              />
                            )}
                          />

                          <Column
                            hidden={pbb?.type_pb === 2}
                            header="Alokasi (%)"
                            className="align-text-top"
                            field={""}
                            body={(e) => (
                              <PrimeNumber
                                price
                                value={e?.aloc ?? null}
                                onChange={(u) => {}}
                                placeholder="0"
                                disabled
                              />
                            )}
                          />

                          <Column
                            header=""
                            className="align-text-top"
                            body={(e) => (
                              <div className="" hidden={status() === 0}>
                                <Badge className="ml-3" variant="warning light">
                                  <i className="bx bxs-circle text-warning mr-1"></i>{" "}
                                  Sudah Ada Penambahan Biaya
                                </Badge>
                              </div>
                            )}
                          />
                        </DataTable>
                      </>
                    }
                  />
                </>
              ) : (
                <>
                  {pbb?.panen_loc ? (
                    <CustomAccordion
                      tittle={"Daftar Bukti Transaksi"}
                      defaultActive={true}
                      active={accor.panen}
                      onClick={() => {
                        setAccor({
                          ...accor,
                          panen: !accor.panen,
                        });
                      }}
                      key={1}
                      body={
                        <>
                          <DataTable
                            responsiveLayout="scroll"
                            selection={selectedPanen}
                            onSelectionChange={(e) => {
                              setSelectedPanen(e.value);

                              console.log("=================selec");
                              console.log(e.value);

                              let trn = [];
                              let all_qty = 0;
                              e.value?.forEach((element) => {
                                all_qty += element?.trx_qty;
                                trn.push({ ...element, all_qty: all_qty });
                              });

                              updatePBB({
                                ...pbb,
                                panen: trn?.map((v) => {
                                  return {
                                    ...v,
                                    trn_id: v?.id,
                                    trn_date: v?.trx_date,
                                    prd_id: v.prod_id?.id,
                                    qty: v?.trx_qty,
                                    aloc: v.trx_qty / (all_qty / 100),
                                  };
                                }),
                              });
                            }}
                            value={
                              isEdit
                                ? pbb?.panen
                                : pbb?.pnn?.map((v, i) => {
                                    return {
                                      ...v,
                                      index: i,
                                    };
                                  })
                            }
                            className="display w-150 datatable-wrapper header-white no-border"
                            showGridlines={false}
                            emptyMessage={() => <div></div>}
                          >
                            <Column
                              selectionMode="multiple"
                              headerStyle={{ width: "3rem" }}
                              exportable={false}
                            />

                            <Column
                              header="Kode Bukti"
                              className="align-text-top"
                              field={""}
                              body={(e) => (
                                <PrimeInput
                                  value={
                                    e.trn_id && checkSt(e.trn_id)?.trx_code
                                  }
                                  onChange={(u) => {}}
                                  placeholder="Kode Bukti"
                                  disabled
                                />
                              )}
                            />

                            <Column
                              header="Tanggal Transaksi"
                              className="align-text-top"
                              field={""}
                              body={(e) => (
                                <div className="p-inputgroup">
                                  <Calendar
                                    value={
                                      isEdit
                                        ? new Date(
                                            `${checkSt(e.trn_id)?.trx_date}Z`
                                          )
                                        : new Date(`${e.trn_date}Z`)
                                    }
                                    onChange={(e) => {}}
                                    placeholder="Tanggal Transaksi"
                                    dateFormat="dd-mm-yy"
                                    disabled
                                  />
                                </div>
                              )}
                            />

                            <Column
                              header="Tipe Transaksi"
                              className="align-text-top"
                              field={""}
                              body={(e) => (
                                <PrimeInput
                                  value={
                                    e.trn_type === "MD"
                                      ? "Mutasi Debet"
                                      : "Produk Panen"
                                  }
                                  onChange={(u) => {}}
                                  placeholder="Tipe Transaksi"
                                  disabled
                                />
                              )}
                            />

                            <Column
                              header="Produk"
                              className="align-text-top"
                              field={""}
                              body={(e) => (
                                <PrimeInput
                                  value={
                                    e.prd_id &&
                                    `${checkProd(e.prd_id)?.name} (${
                                      checkProd(e.prd_id)?.code
                                    })`
                                  }
                                  onChange={(u) => {}}
                                  placeholder="0"
                                  disabled
                                />
                              )}
                            />

                            <Column
                              header="Kuantitas"
                              className="align-text-top"
                              field={""}
                              body={(e) => (
                                <PrimeNumber
                                  prc
                                  value={e.qty && e.qty}
                                  onChange={(u) => {}}
                                  placeholder="0"
                                  disabled
                                />
                              )}
                            />

                            <Column
                              hidden
                              header="Alokasi"
                              className="align-text-top"
                              field={""}
                              body={(e) => (
                                <PrimeInput
                                  value={e.aloc && e.aloc}
                                  onChange={(u) => {}}
                                  placeholder="0"
                                  disabled
                                />
                              )}
                            />
                          </DataTable>
                        </>
                      }
                    />
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </TabPanel>

          <TabPanel header="Pembebanan">
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="none"
                  value={pbb.upah?.map((v, i) => {
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
                    header="Akun Biaya"
                    className="col-4 align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.acc_id && checkAcc(e.acc_id)}
                        options={account}
                        onChange={(u) => {
                          let nom_sa = 0;
                          let nom_d = 0;
                          let nom_gl = 0;
                          let dt_pbb = new Date(`${pbb?.pbb_date}Z`);

                          accDdb?.forEach((el) => {
                            if (el?.acc_code?.id === u?.value?.id) {
                              nom_sa += el.acc_akhir;
                            }
                          });

                          transGl?.forEach((elem) => {
                            let dt = new Date(`${elem?.trx_date}Z`);
                            if (
                              elem?.acc_id === u?.value?.id
                              // &&
                              // dt.getMonth() + 1 > setup?.cutoff &&
                              // dt.getFullYear() >= setup?.year_co
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
                              element?.acc_id === u?.value?.id
                              // &&
                              // dt.getMonth() + 1 > setup?.cutoff &&
                              // dt.getFullYear() >= setup?.year_co
                            ) {
                              if (element.trx_dbcr === "D") {
                                nom_d += element.trx_amnt;
                              } else {
                                nom_d -= element.trx_amnt;
                              }
                            }
                          });

                          let temp = [...pbb.upah];
                          temp[e.index].acc_id = u.value?.id ?? null;
                          temp[e.index].value = nom_sa + nom_d + nom_gl;
                          updatePBB({ ...pbb, upah: temp });

                          let newError = error;
                          newError.uph[e.index].id = false;
                          setError(newError);
                        }}
                        filter
                        filterBy="acc_name"
                        optionLabel="acc_name"
                        itemTemplate={glTemplate}
                        valueTemplate={valTemp}
                        placeholder="Pilih Akun Biaya"
                        errorMessage="Akun Belum Dipilih"
                        error={error?.uph[e.index]?.id}
                        showClear
                      />
                    )}
                  />

                  <Column
                    // hidden={isEdit}
                    header={"Biaya Tersimpan"}
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
                    className="col-4 align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.nom_uph && e.nom_uph}
                        onChange={(u) => {
                          let temp = [...pbb.upah];
                          temp[e.index].nom_uph = u.value;

                          if (temp[e.index].nom_uph > e.value) {
                            temp[e.index].nom_uph = e.value;
                            toast.current.show({
                              severity: "warn",
                              summary: `Biaya Melebihi Saldo Tersimpan`,
                              // detail: `Sisa Saldo Tersimpan  ${formatIdr(e.value)}`,
                              life: 7000,
                            });
                          }

                          updatePBB({ ...pbb, upah: temp });

                          let newError = error;
                          newError.uph[e.index].nom = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        error={error?.uph[e.index]?.nom}
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
                          let temp = [...pbb.upah];
                          temp[e.index].desc = u.target.value;

                          updatePBB({ ...pbb, upah: temp });
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
                      e.index === pbb.upah.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.uph.push({
                              id: false,
                            });
                            setError(newError);

                            updatePBB({
                              ...pbb,
                              upah: [
                                ...pbb.upah,
                                {
                                  id: 0,
                                  acc_id: null,
                                  nom_uph: null,
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
                            let temp = [...pbb.upah];
                            temp.splice(e.index, 1);
                            updatePBB({ ...pbb, upah: temp });
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

          {/* <TabPanel header=""> */}
          <Card hidden>
            <Card.Body>
              <DataTable
                responsiveLayout="none"
                value={pbb.overhead?.map((v, i) => {
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
                  header="Akun Overhead"
                  className="col-4 align-text-top"
                  field={""}
                  body={(e) => (
                    <PrimeDropdown
                      value={e.acc_id && checkAcc(e.acc_id)}
                      options={acc}
                      onChange={(u) => {
                        let temp = [...pbb.overhead];
                        temp[e.index].acc_id = u.value.account.id;
                        updatePBB({ ...pbb, overhead: temp });
                      }}
                      filter
                      filterBy="account.acc_name"
                      optionLabel="account.acc_name"
                      itemTemplate={glTemplate}
                      valueTemplate={valTemp}
                      placeholder="Pilih Akun Overhead"
                    />
                  )}
                />

                <Column
                  header="Nominal Overhead"
                  className="col-4 align-text-top"
                  field={""}
                  body={(e) => (
                    <PrimeNumber
                      price
                      value={e.nom_ovr && e.nom_ovr}
                      onChange={(u) => {
                        let temp = [...pbb.overhead];
                        temp[e.index].nom_ovr = u.value;

                        updatePBB({ ...pbb, overhead: temp });
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
                        let temp = [...pbb.overhead];
                        temp[e.index].desc = u.target.value;

                        updatePBB({ ...pbb, overhead: temp });
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
                    e.index === pbb.overhead.length - 1 ? (
                      <Link
                        onClick={() => {

                          updatePBB({
                            ...pbb,
                            overhead: [
                              ...pbb.overhead,
                              {
                                id: 0,
                                acc_id: null,
                                nom_ovr: null,
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
                          let temp = [...pbb.overhead];
                          temp.splice(e.index, 1);
                          updatePBB({ ...pbb, overhead: temp });
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
          {/* </TabPanel> */}
        </TabView>

        <div className="row mb-8">
          <span className="mb-8"></span>
        </div>
      </>
    );
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
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

      <DataAkun
        data={acc}
        loading={false}
        popUp={true}
        show={showAcc}
        onHide={() => {
          setShowAcc(false);
        }}
        onInput={(e) => {
          setShowAcc(!e);
        }}
        onSuccessInput={(e) => {
          getAcc();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowAcc(false);

            let temp = [...pbb.upah];
            temp[currentIndex].acc_id = e.data.account.id;

            let tempm = [...pbb.overhead];
            temp[currentIndex].acc_id = e.data.account.id;
            updatePBB({
              ...pbb,
              code_acc: e.data.account.id,
              upah: temp,
              overhead: tempm,
            });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataProject
        data={proj}
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
            updatePBB({ ...pbb, proj_id: e.data.id });
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

export default InputPembebanan;
