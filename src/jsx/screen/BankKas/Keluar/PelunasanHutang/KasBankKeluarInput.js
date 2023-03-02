import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import CustomAccordion from "../../../../components/Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_EXP } from "src/redux/actions";
import DataSupplier from "src/jsx/screen/Mitra/Pemasok/DataPemasok";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SelectButton } from "primereact/selectbutton";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataAkun from "src/jsx/screen/Master/Akun/DataAkun";
import DataPusatBiaya from "src/jsx/screen/MasterLainnya/PusatBiaya/DataPusatBiaya";
import DataBank from "src/jsx/screen/MasterLainnya/Bank/DataBank";
import DataProject from "src/jsx/screen/MasterLainnya/Project/DataProject";
import { Divider } from "@material-ui/core";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { InputNumber } from "primereact/inputnumber";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";

const defError = {
  code: false,
  date: false,
  sup: false,
  acq_kas: false,
  ref_bnk: false,
  kd_bnk: false,
  kd_giro: false,
  tgl_gr: false,
  bnk_gr: false,
  exp_kas: false,
  exp_bnk: false,
  acq: [
    {
      pay: false,
    },
  ],
  exp: [
    {
      acc_code: false,
      acc_bnk: false,
      bnk_code: false,
      value: false,
    },
  ],
};

const KasBankOutInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(defError);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const exp = useSelector((state) => state.exp.current);
  const isEdit = useSelector((state) => state.exp.editExp);
  const dispatch = useDispatch();
  const [accKas, setAccKas] = useState(null);
  const [acc, setAcc] = useState(null);
  const [allacc, setAllAcc] = useState(null);
  const [bank, setBank] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [allSup, setAllSup] = useState(null);
  const [faktur, setFaktur] = useState(null);
  const [apcard, setAP] = useState(null);
  const [dept, setDept] = useState(null);
  const [proj, setProj] = useState(null);
  const [batch, setBatch] = useState(null);
  const [po, setPo] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showDepartemen, setShowDept] = useState(false);
  const [showProj, setShowProj] = useState(false);
  const [showAccKas, setShowAccKas] = useState(false);
  const [showAcc, setShowAcc] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [showBankG, setShowBankG] = useState(false);
  const [accor, setAccor] = useState({
    bayar: true,
    keluar: false,
  });

  const type_trx = [
    { typePengeluaran: "Pelunasan", kode: 1 },
    { typePengeluaran: "Pengeluaran", kode: 2 },
    { typePengeluaran: "Uang Muka", kode: 3 },
    { typePengeluaran: "Biaya Batch", kode: 4 },
  ];

  const acq_pay = [
    { kode: 1, jenisPengeluaran: "Kas" },
    { kode: 2, jenisPengeluaran: "Bank" },
    { kode: 3, jenisPengeluaran: "Giro" },
  ];

  const exp_type = [
    { kode: 1, name: "Kas" },
    { kode: 2, name: "Bank" },
  ];

  const type_acc = [
    { kode: 1, name: "Akun" },
    { kode: 2, name: "Bank" },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getBank();
    getSupplier();
    getBatch();
    getProj();
    getDept();
    getAccount();
    getCurrency();
    getPo();
  }, []);

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !exp.exp_code || exp.exp_code === "",
      date: !exp.exp_date || exp.exp_date === "",
      sup: exp.type_trx === 1 ? !exp.acq_sup : false,
      acq_kas: exp.type_trx === 1 && exp.acq_pay === 1 ? !exp.acq_kas : false,
      ref_bnk:
        exp.type_trx === 1 && exp.acq_pay === 2
          ? !exp.bank_ref || exp.bank_ref === ""
          : false,
      kd_bnk: exp.type_trx === 1 && exp.acq_pay === 2 ? !exp.bank_acc : false,
      kd_giro:
        exp.type_trx === 1 && exp.acq_pay === 3
          ? !exp.giro_num || exp.giro_num === ""
          : false,
      tgl_gr:
        exp.type_trx === 1 && exp.acq_pay === 3
          ? !exp.giro_date || exp.giro_date === ""
          : false,
      bnk_gr: exp.type_trx === 1 && exp.acq_pay === 3 ? !exp.bank_id : false,
      exp_kas: exp.type_trx === 2 && exp.exp_type === 1 ? !exp.kas_acc : false,
      exp_bnk: exp.type_trx === 2 && exp.exp_type === 2 ? !exp.exp_bnk : false,
      acq: [],
      exp: [],
    };

    exp?.acq?.forEach((element, i) => {
      if (i > 0) {
        if (element.payment) {
          errors.acq[i] = {
            pay:
              exp?.type_trx === 1
                ? !element.payment ||
                  element.payment === "" ||
                  element.payment === null ||
                  element.payment === "0"
                : false,
          };
        }
      } else {
        errors.acq[i] = {
          pay:
            exp?.type_trx === 1
              ? !element.payment ||
                element.payment === "" ||
                element.payment === null ||
                element.payment === "0"
              : false,
        };
      }
    });

    exp?.exp?.forEach((element, i) => {
      if (i > 0) {
        if (
          element.acc_code ||
          element.acc_bnk ||
          element.bnk_code ||
          element.value
        ) {
          errors.exp[i] = {
            acc_code:
              exp.type_trx === 2 && exp.exp_type === 1
                ? !element.acc_code
                : false,
            acc_bnk:
              exp.type_trx === 2 && exp.exp_type === 2 && exp.type_acc === 1
                ? !element.acc_bnk
                : false,
            bnk_code:
              exp.type_trx === 2 && exp.exp_type === 2 && exp.type_acc === 2
                ? !element.bnk_code
                : false,
            value:
              exp.type_trx === 2
                ? !element.value ||
                  element.value === "" ||
                  element.value === null ||
                  element.value === 0
                : false,
          };
        }
      } else {
        errors.exp[i] = {
          acc_code:
            exp.type_trx === 2 && exp.exp_type === 1
              ? !element.acc_code
              : false,
          acc_bnk:
            exp.type_trx === 2 && exp.exp_type === 2 && exp.type_acc === 1
              ? !element.acc_bnk
              : false,
          bnk_code:
            exp.type_trx === 2 && exp.exp_type === 2 && exp.type_acc === 2
              ? !element.bnk_code
              : false,
          value:
            exp.type_trx === 2
              ? !element.value ||
                element.value === "" ||
                element.value === null ||
                element.value === 0
              : false,
        };
      }
    });

    if (exp?.acq.length) {
      if (!errors.acq[0]?.pay) {
        errors.acq?.forEach((e) => {
          for (var key in e) {
            e[key] = false;
          }
        });
      }
    }

    // if (exp?.exp?.length) {
    if (
      !errors.exp[0]?.acc_code &&
      !errors.exp[0]?.acc_bnk &&
      !errors.exp[0]?.bnk_code &&
      !errors.exp[0]?.value
    ) {
      errors.exp?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }
    // }

    let validAcq = false;
    let validExp = false;
    errors.acq?.forEach((el) => {
      for (var k in el) {
        validAcq = !el[k];
      }
    });

    // if (!validAcq) {
    errors.exp?.forEach((el) => {
      for (var k in el) {
        validExp = !el[k];
      }
    });
    // }

    setError(errors);

    valid =
      !errors.code &&
      !errors.date &&
      !errors.sup &&
      !errors.acq_kas &&
      !errors.ref_bnk &&
      !errors.kd_bnk &&
      !errors.kd_giro &&
      !errors.tgl_gr &&
      !errors.bnk_gr &&
      !errors.exp_kas &&
      !errors.exp_bnk &&
      (validAcq || validExp);

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });
    }

    return valid;
  };

  const getAPCard = async (spl) => {
    const config = {
      ...endpoints.apcard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let sup = [];
        spl.forEach((element) => {
          element.ap = [];
          data.forEach((el) => {
            if (el.trx_type === "LP" && el.pay_type === "P1") {
              if (element.supplier.id === el.sup_id.id) {
                element.ap.push(el);
              }
            }
          });
          if (element.ap.length > 0) {
            sup.push(element);
          }
          console.log("hdjsdjs");
          console.log(element);
        });
        setAP(data);
        setSupplier(sup);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFaktur = async () => {
    const config = {
      ...endpoints.faktur,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let sup = [];
        supplier.forEach((element) => {
          element.fk = [];
          data.forEach((el) => {
            if (element.supplier.id === el.ord_id.sup_id) {
              element.fk.push(el);
            }
          });
          if (element.fk.length > 0) {
            sup.push(element);
          }
        });
        setFaktur(data);
        setSupplier(sup);
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
        getAPCard(data);
        setAllSup(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAccount = async () => {
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
        let all = [];
        data.forEach((elem) => {
          if (elem.account.dou_type === "D" && elem.account.kat_code === 1) {
            kas.push(elem.account);
          }

          if (elem.account.dou_type === "D" && elem.account.connect === false) {
            all_d.push(elem.account);
          }

          all.push(elem.account);
        });
        setAccKas(kas);
        setAcc(all_d);
        setAllAcc(all);
      }
    } catch (error) {}
  };

  const getBank = async () => {
    const config = {
      ...endpoints.bank,
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
          filt.push(elem.bank);
        });
        setBank(filt);
      }
    } catch (error) {}
  };

  const getBatch = async () => {
    const config = {
      ...endpoints.batch,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setBatch(data);
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

  const getCurrency = async () => {
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
        setCurrency(data);
      }
    } catch (error) {}
  };

  const getPo = async () => {
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
        setPo(data);
      }
    } catch (error) {}
  };

  const editEXP = async () => {
    const config = {
      ...endpoints.editEXP,
      endpoint: endpoints.editEXP.endpoint + exp.id,
      data: exp,
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

  const addEXP = async () => {
    const config = {
      ...endpoints.addEXP,
      data: exp,
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
            detail: `Kode ${exp.exp_code} Sudah Digunakan`,
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

  const checkProj = (value) => {
    let selected = {};
    proj?.forEach((element) => {
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

  const supp = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element.supplier.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkBank = (value) => {
    let selected = {};
    bank?.forEach((element) => {
      if (value === element?.id) {
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

  const checkPo = (value) => {
    let selected = {};
    po?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkAcc = (value) => {
    let selected = {};
    allacc?.forEach((element) => {
      if (value === element.id) {
        selected = element;
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

  const checkAP = (value) => {
    let selected = {};
    apcard?.forEach((element) => {
      if (value === element.ord_id.id) {
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

  const bankTemplate = (option) => {
    return (
      <div>
        {option !== null ? `${option.BANK_NAME} - ${option.BANK_CODE}` : ""}
      </div>
    );
  };

  const valBTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.BANK_NAME} - ${option.BANK_CODE}` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const onSubmit = () => {
    // if (isValid()) {
    if (isEdit) {
      setUpdate(true);
      editEXP();
    } else {
      setUpdate(true);
      addEXP();
    }
    // }
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

  const updateExp = (e) => {
    dispatch({
      type: SET_CURRENT_EXP,
      payload: e,
    });
  };

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-3">
            <PrimeInput
              label={"Kode Referensi"}
              value={exp.exp_code}
              onChange={(e) => {
                updateExp({ ...exp, exp_code: e.target.value });

                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode Referensi"
              error={error?.code}
            />
          </div>

          <div className="col-2">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${exp.exp_date}Z`)}
              onChange={(e) => {
                updateExp({ ...exp, exp_date: e.value });

                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              placeholder="Pilih Tanggal"
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.date}
            />
          </div>

          <div className="col-12 mt-1">
            <span className="fs-13">
              <b>Informasi Pengeluaran</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div>

          <div className="col-12 mb-2">
            <label className="text-label">Tipe Transaksi</label>
            <div className="p-inputgroup">
              <SelectButton
                value={
                  exp !== null && exp.type_trx !== ""
                    ? exp.type_trx === 1
                      ? { kode: 1, typePengeluaran: "Pelunasan" }
                      : exp.type_trx === 2
                      ? { kode: 2, typePengeluaran: "Pengeluaran" }
                      : exp.type_trx === 3
                      ? { kode: 3, typePengeluaran: "Uang Muka" }
                      : { kode: 4, typePengeluaran: "Biaya Batch" }
                    : null
                }
                options={type_trx}
                onChange={(e) => {
                  console.log(e.value);
                  updateExp({
                    ...exp,
                    type_trx: e.value.kode,
                    acq_pay: e.value.kode === 1 ? 1 : null,
                    exp_type: e.value?.kode === 2 ? 1 : null,
                    type_acc: e.value?.kode === 2 ? 1 : null,
                    dp_type: e.value?.kode === 3 ? 1 : null,
                    acq_sup: null,
                    acq_kas: null,
                    bank_ref: null,
                    bank_acc: null,
                    giro_num: null,
                    giro_date: null,
                    bank_id: null,
                    exp_bnk: null,
                    kas_acc: null,
                    exp_dep: null,
                    exp_proj: null,
                    dp_sup: null,
                    dp_kas: null,
                    dp_bnk: null,
                    exp: exp?.exp.map((v) => ({
                      ...v,
                      acc_code: null,
                      acc_bnk: null,
                      bnk_code: null,
                      value: null,
                      desc: null,
                    })),
                    acq: null,
                    det_dp: null,
                  });
                }}
                optionLabel="typePengeluaran"
              />
            </div>
          </div>

          {/* Type Pembayaran */}
          {exp !== null && exp.type_trx === 1 ? (
            <>
              <div className="col-12 mt-1">
                <span className="fs-13">
                  <b>Informasi Pelunasan</b>
                </span>
                <Divider className="mt-1"></Divider>
              </div>

              <div className="col-3">
                <PrimeDropdown
                  label={"Supplier"}
                  value={exp.acq_sup && supp(exp.acq_sup)}
                  options={supplier}
                  onChange={(e) => {
                    e?.value?.ap?.forEach((elem) => {
                      apcard.forEach((el) => {
                        if (elem?.po_id && el.po_id) {
                          if (
                            elem?.po_id?.id === el?.po_id?.id &&
                            el.trx_type === "DP"
                          ) {
                            if (elem?.sup_id?.sup_curren !== null) {
                              elem.dp = el.trx_amnv ?? 0;
                            } else {
                              elem.dp = el.trx_amnh ?? 0;
                            }
                          }
                        } else {
                          elem.dp = 0;
                        }
                      });
                    });

                    updateExp({
                      ...exp,
                      acq_sup: e.value.supplier?.id,
                      acq: e.value.ap?.map((v) => {
                        return {
                          id: null,
                          fk_id: v.ord_id?.id ?? null,
                          type: v.trx_type,
                          value:
                            v?.sup_id?.sup_curren !== null
                              ? v.trx_amnv
                              : v.trx_amnh,
                          payment: null,
                          sisa:
                            v?.sup_id?.sup_curren !== null
                              ? v.trx_amnv - v.dp
                              : v.trx_amnh - v.dp,
                          dp: v.dp ?? 0,
                        };
                      }),
                    });

                    let newError = error;
                    newError.sup = false;
                    setError(newError);
                  }}
                  optionLabel="supplier.sup_name"
                  placeholder="Pilih Supplier"
                  filter
                  filterBy="supplier.sup_name"
                  errorMessage="Supplier Belum Dipilih"
                  error={error?.sup}
                />
              </div>

              <div className="col-8">
                <label className="text-label">Pelunasan Melalui</label>
                <div className="p-inputgroup">
                  <SelectButton
                    value={
                      exp !== null && exp.acq_pay !== ""
                        ? exp.acq_pay === 1
                          ? { kode: 1, jenisPengeluaran: "Kas" }
                          : exp.acq_pay === 2
                          ? { kode: 2, jenisPengeluaran: "Bank" }
                          : { kode: 3, jenisPengeluaran: "Giro" }
                        : null
                    }
                    options={acq_pay}
                    onChange={(e) => {
                      updateExp({
                        ...exp,
                        acq_pay: e.value.kode,
                        acq_kas: null,
                        bank_ref: null,
                        bank_acc: null,
                        giro_num: null,
                        giro_date: null,
                        bank_id: null,
                      });
                    }}
                    optionLabel="jenisPengeluaran"
                  />
                </div>
              </div>

              {/* kode pembayaran cash  */}
              {exp !== null && exp.acq_pay === 1 ? (
                <>
                  <div className="col-3">
                    <PrimeDropdown
                      label={"Akun Kas"}
                      value={exp.acq_kas && checkAcc(exp.acq_kas)}
                      options={accKas}
                      onChange={(e) => {
                        updateExp({
                          ...exp,
                          acq_kas: e.value?.id ?? null,
                        });

                        let newError = error;
                        newError.acq_kas = false;
                        setError(newError);
                      }}
                      optionLabel="account.acc_name"
                      placeholder="Pilih Akun Kas"
                      filter
                      filterBy="acc_name"
                      itemTemplate={glTemplate}
                      valueTemplate={valTemp}
                      showClear
                      errorMessage="Akun Cash Belum Dipilih"
                      error={error?.acq_kas}
                    />
                  </div>
                </>
              ) : // pembayaran bank
              exp !== null && exp.acq_pay === 2 ? (
                <>
                  <div className="col-4">
                    <PrimeInput
                      label={"Kode Referensi Bank"}
                      value={exp.bank_ref}
                      onChange={(e) => {
                        updateExp({ ...exp, bank_ref: e.target.value });

                        let newError = error;
                        newError.bn_code = false;
                        setError(newError);
                      }}
                      placeholder="Masukan Kode Bank"
                      error={error?.bn_code}
                    />
                  </div>

                  <div className="col-4">
                    <PrimeDropdown
                      label={"Kode Bank"}
                      value={exp.bank_acc && checkBank(exp.bank_acc)}
                      options={bank}
                      onChange={(e) => {
                        updateExp({
                          ...exp,
                          bank_acc: e.value?.id ?? null,
                        });

                        let newError = error;
                        newError.bn_acc = false;
                        setError(newError);
                      }}
                      optionLabel="bank.BANK_NAME"
                      placeholder="Pilih Akun Bank"
                      filter
                      filterBy="BANK_CODE"
                      itemTemplate={bankTemplate}
                      valueTemplate={valBTemp}
                      errorMessage="Akun Bank Belum Dipilih"
                      error={error?.bn_acc}
                      showClear
                    />
                  </div>
                </>
              ) : (
                // pembayran giro
                <>
                  <div className="col-4">
                    <PrimeInput
                      label={"Nomor Giro"}
                      value={exp.giro_num}
                      onChange={(e) => {
                        updateExp({ ...exp, giro_num: e.target.value });

                        let newError = error;
                        newError.gr = false;
                        setError(newError);
                      }}
                      placeholder="Nomor Giro"
                      error={error?.gr}
                    />
                  </div>

                  <div className="col-2">
                    <PrimeCalendar
                      label={"Tanggal Cair"}
                      value={new Date(`${exp.giro_date}Z`)}
                      onChange={(e) => {
                        updateExp({ ...exp, giro_date: e.value });

                        let newError = error;
                        newError.tgl = false;
                        setError(newError);
                      }}
                      placeholder="Pilih Tanggal"
                      showIcon
                      dateFormat="dd-mm-yy"
                      error={error?.tgl}
                    />
                  </div>

                  <div className="col-4">
                    <PrimeDropdown
                      label={"Kode Bank"}
                      value={exp.bank_id && checkBank(exp.bank_id)}
                      options={bank}
                      onChange={(e) => {
                        updateExp({
                          ...exp,
                          bank_id: e.value?.id ?? null,
                        });

                        let newError = error;
                        newError.bn_id = false;
                        setError(newError);
                      }}
                      optionLabel="bank.BANK_NAME"
                      placeholder="Pilih Kode Bank"
                      filter
                      filterBy="BANK_CODE"
                      itemTemplate={bankTemplate}
                      valueTemplate={valBTemp}
                      errorMessage="Akun Bank Belum Dipilih"
                      error={error?.bn_id}
                      showClear
                    />
                  </div>
                </>
              )}

              {exp?.acq?.length ? (
                <CustomAccordion
                  className="col-12 mt-4"
                  tittle={"Data Pembayaran"}
                  defaultActive={true}
                  active={accor.bayar}
                  onClick={() => {
                    setAccor({
                      ...accor,
                      bayar: !accor.bayar,
                    });
                  }}
                  key={1}
                  body={
                    <>
                      <DataTable
                        responsiveLayout="none"
                        value={exp?.acq?.map((v, i) => {
                          return {
                            ...v,
                            index: i,
                            // payment: v?.payment ?? 0,
                          };
                        })}
                        className="display w-150 datatable-wrapper header-white no-border"
                        showGridlines={false}
                        emptyMessage={() => <div></div>}
                      >
                        <Column
                          header="Kode Faktur"
                          style={{
                            maxWidth: "15rem",
                          }}
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <InputText
                                value={
                                  e.fk_id && checkAP(e.fk_id)?.ord_id?.ord_code
                                }
                                onChange={(u) => {}}
                                placeholder="Kode Transaksi"
                                disabled
                              />
                            </div>
                          )}
                        />

                        <Column
                          header="Tanggal J/T tempo"
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <Calendar
                                value={
                                  new Date(
                                    `${e.fk_id && checkAP(e.fk_id).ord_due}Z`
                                  )
                                }
                                onChange={(e) => {}}
                                placeholder="Tanggal Jatuh Tempo"
                                dateFormat="dd-mm-yy"
                                disabled
                              />
                            </div>
                          )}
                        />

                        <Column
                          header="Type"
                          style={{
                            width: "10rem",
                          }}
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <InputText
                                value={
                                  e.fk_id && checkAP(e.fk_id)?.trx_type === "LP"
                                    ? "BL"
                                    : null
                                }
                                onChange={(a) => {}}
                                placeholder="Type"
                                disabled
                              />
                            </div>
                          )}
                        />

                        <Column
                          header="Total Pembayaran"
                          style={{
                            maxWidth: "15rem",
                          }}
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <InputNumber
                                value={e?.value}
                                onChange={(e) => {}}
                                placeholder="0"
                                disabled
                              />
                            </div>
                          )}
                        />

                        <Column
                          header="Uang Muka"
                          style={{
                            maxWidth: "15rem",
                          }}
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <InputNumber
                                value={e?.dp}
                                onChange={(e) => {}}
                                placeholder="0"
                                disabled
                              />
                            </div>
                          )}
                        />

                        <Column
                          hidden={isEdit}
                          header="Sisa Pembayaran"
                          style={{
                            maxWidth: "15rem",
                          }}
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <InputNumber
                                value={e.sisa ?? 0}
                                onChange={(e) => {}}
                                placeholder="0"
                                disabled
                              />
                            </div>
                          )}
                        />

                        <Column
                          header="Nilai Pembayaran"
                          className="align-text-top"
                          field={""}
                          body={(e) =>
                            supp(exp.acq_sup)?.supplier?.sup_curren !== null ? (
                              <PrimeNumber
                                value={e.payment ? e.payment : ""}
                                onChange={(u) => {
                                  let temp = [...exp.acq];
                                  temp[e.index].payment = Number(
                                    u.target.value
                                  );
                                  updateExp({ ...exp, acq: temp });

                                  let newError = error;
                                  newError.acq[e.index].pay = false;
                                  newError.acq?.push({ pay: false });
                                  setError(newError);
                                }}
                                placeholder="0"
                                // min={0}
                                type="number"
                                error={error?.acq[e.index]?.pay}
                              />
                            ) : (
                              <PrimeNumber
                                price
                                value={e.payment && e.payment}
                                onChange={(u) => {
                                  let temp = [...exp.acq];
                                  temp[e.index].payment = u?.value;
                                  updateExp({ ...exp, acq: temp });

                                  let newError = error;
                                  newError.acq[e.index].pay = false;
                                  newError?.acq?.push({ pay: false });
                                  setError(newError);
                                }}
                                placeholder="0"
                                min={0}
                                error={error?.acq[e.index]?.pay}
                              />
                            )
                          }
                        />

                        <Column
                          body={
                            (e) => (
                              // e.index === out.rprod.length - 1 ? (
                              <Link
                                onClick={() => {
                                  let newError = error;
                                  newError.acq.push({ pay: false });
                                  setError(newError);

                                  let temp = [...exp.acq];
                                  temp.splice(e.index, 1);
                                  updateExp({
                                    ...exp,
                                    acq: temp,
                                  });
                                }}
                                className="btn btn-danger shadow btn-xs sharp ml-1"
                              >
                                <i className="fa fa-trash"></i>
                              </Link>
                            )
                            // )
                          }
                        />
                      </DataTable>
                    </>
                  }
                />
              ) : (
                <></>
              )}
            </>
          ) : exp !== null && exp.type_trx === 2 ? (
            // Type Pengeluaran
            <>
              <div className="col-12 mt-1">
                <span className="fs-13">
                  <b>Informasi Pengeluaran</b>
                </span>
                <Divider className="mt-1"></Divider>
              </div>

              <div className="col-12 mb-2">
                <label className="text-label">Tipe Pengeluaran</label>
                <div className="p-inputgroup">
                  <SelectButton
                    value={
                      exp !== null && exp.exp_type !== ""
                        ? exp.exp_type === 1
                          ? { kode: 1, name: "Kas" }
                          : { kode: 2, name: "Bank" }
                        : null
                    }
                    options={exp_type}
                    onChange={(e) => {
                      updateExp({
                        ...exp,
                        exp_type: e.value.kode,
                        type_acc: e.value.kode === 2 ? 1 : null,
                        exp_bnk: null,
                        kas_acc: null,
                        exp: exp.exp.map((v) => ({
                          ...v,
                          acc_code: null,
                          acc_bnk: null,
                          bnk_code: null,
                          value: null,
                          desc: null,
                        })),
                      });

                      let newError = error;
                      if (e.value.kode === 1) {
                        newError.exp_bnk = false;
                        newError.exp.push({
                          acc_bnk: false,
                          bnk_code: false,
                          value: false,
                        });
                      } else {
                        newError.exp_kas = false;
                      }

                      if (e.value.kode === 2 && exp.type_acc === 1) {
                        newError.exp.push({
                          acc_code: false,
                          bnk_code: false,
                          value: false,
                        });
                      } else if (e.value.kode === 2 && exp.type_acc === 2) {
                        newError.exp.push({
                          acc_code: false,
                          acc_bnk: false,
                          value: false,
                        });
                      }
                    }}
                    optionLabel="name"
                  />
                </div>
              </div>

              {exp !== null && exp.exp_type === 1 ? (
                <>
                  <div className="col-3">
                    <PrimeDropdown
                      label={"Kode Akun"}
                      value={exp.kas_acc && checkAcc(exp.kas_acc)}
                      options={accKas}
                      onChange={(e) => {
                        updateExp({
                          ...exp,
                          kas_acc: e.value?.id ?? null,
                        });

                        let newError = error;
                        newError.exp_kas = false;
                        setError(newError);
                      }}
                      optionLabel="account.acc_name"
                      placeholder="Pilih Kode Akun"
                      filter
                      filterBy="acc_name"
                      itemTemplate={glTemplate}
                      valueTemplate={valTemp}
                      errorMessage="Akun Belum Dipilih"
                      error={error?.exp_kas}
                      showClear
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-3">
                    <PrimeDropdown
                      label={"Kode Bank"}
                      value={exp.exp_bnk && checkBank(exp.exp_bnk)}
                      options={bank}
                      onChange={(e) => {
                        updateExp({
                          ...exp,
                          exp_bnk: e.value?.id ?? null,
                        });

                        let newError = error;
                        newError.exp_bnk = false;
                        setError(newError);
                      }}
                      optionLabel="bank.BANK_NAME"
                      placeholder="Pilih Kode Bank"
                      filter
                      filterBy="BANK_NAME"
                      itemTemplate={bankTemplate}
                      valueTemplate={valBTemp}
                      errorMessage="Bank Belum Dipilih"
                      error={error?.exp_bnk}
                      showClear
                    />
                  </div>
                </>
              )}

              <div className="col-3">
                <label className="text-label">Kode Departemen</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={exp.exp_dep && checkDept(exp.exp_dep)}
                  option={dept}
                  onChange={(e) => {
                    updateExp({
                      ...exp,
                      exp_dep: e.id,
                    });
                  }}
                  label={"[ccost_name] - [ccost_code]"}
                  placeholder="Pilih Departemen"
                  detail
                  onDetail={() => setShowDept(true)}
                  showClear
                />
              </div>

              <div className="col-3">
                <label className="text-label">Kode Project</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={exp.exp_prj && checkProj(exp.exp_prj)}
                  option={proj}
                  onChange={(e) => {
                    updateExp({
                      ...exp,
                      exp_prj: e.id,
                    });
                  }}
                  label={"[proj_name] - [proj_code]"}
                  placeholder="Pilih Project"
                  detail
                  onDetail={() => setShowProj(true)}
                  showClear
                />
              </div>

              <div className="col-7 mt-1" hidden={exp.exp_type === 1}>
                <label className="text-label"></label>
                <div className="p-inputgroup">
                  <SelectButton
                    value={
                      exp !== null && exp.type_acc !== ""
                        ? exp.type_acc === 1
                          ? { kode: 1, name: "Akun" }
                          : { kode: 2, name: "Bank" }
                        : null
                    }
                    options={type_acc}
                    onChange={(e) => {
                      updateExp({
                        ...exp,
                        type_acc: e.value.kode,
                        exp: exp.exp.map((v) => ({
                          ...v,
                          acc_bnk: null,
                          bnk_code: null,
                          value: null,
                          fc: 0,
                          desc: null,
                        })),
                      });
                    }}
                    optionLabel="name"
                  />
                </div>
              </div>

              <CustomAccordion
                className="col-12 mt-4"
                tittle={"Akun Pengeluaran"}
                defaultActive={true}
                active={accor.keluar}
                onClick={() => {
                  setAccor({
                    ...accor,
                    keluar: !accor.keluar,
                  });
                }}
                key={1}
                body={
                  <>
                    <DataTable
                      responsiveLayout="none"
                      value={exp.exp?.map((v, i) => {
                        return {
                          ...v,
                          index: i,
                          // value: v?.value ?? 0,
                        };
                      })}
                      className="display w-150 datatable-wrapper header-white no-border"
                      showGridlines={false}
                      emptyMessage={() => <div></div>}
                    >
                      <Column
                        hidden={exp.exp_type === 2}
                        header={"Kode Akun Pengeluaran"}
                        className="align-text-top"
                        style={{
                          width: "25rem",
                        }}
                        field={""}
                        body={(e) => (
                          <PrimeDropdown
                            value={e.acc_code && checkAcc(e.acc_code)}
                            options={acc}
                            onChange={(u) => {
                              let temp = [...exp.exp];
                              if (exp.exp_type === 1) {
                                temp[e.index].acc_code = u.value?.id ?? null;
                              }

                              updateExp({ ...exp, exp: temp });

                              let newError = error;
                              newError.exp[e.index].acc_code = false;
                              // newError.acq.push({ pay: false });
                              setError(newError);
                            }}
                            optionLabel={"account.acc_name"}
                            itemTemplate={glTemplate}
                            valueTemplate={valTemp}
                            filter
                            filterBy={"acc_name"}
                            placeholder={"Pilih Kode Akun"}
                            errorMessage="Akun Belum Dipilih"
                            error={error?.exp[e.index]?.acc_code}
                            showClear
                          />
                        )}
                      />

                      <Column
                        hidden={exp.exp_type === 1}
                        header={
                          exp.type_acc === 1 || exp.exp_type === 1
                            ? "Kode Akun"
                            : "Kode Bank"
                        }
                        className="align-text-top"
                        style={{
                          width: "25rem",
                        }}
                        field={""}
                        body={(e) => (
                          <PrimeDropdown
                            value={
                              exp.type_acc === 1
                                ? e.acc_bnk && checkAcc(e.acc_bnk)
                                : e.bnk_code && checkBank(e.bnk_code)
                            }
                            options={exp.type_acc === 1 ? acc : bank}
                            onChange={(u) => {
                              let temp = [...exp.exp];

                              if (exp.type_acc === 1) {
                                temp[e.index].acc_bnk = u.value?.id ?? null;
                              } else {
                                temp[e.index].bnk_code = u.value?.id ?? null;
                                temp[e.index].value = null;
                                temp[e.index].fc = null;
                              }

                              updateExp({ ...exp, exp: temp });

                              let newError = error;
                              if (exp?.type_acc == 1) {
                                newError.exp[e.index].acc_bnk = false;
                              } else {
                                newError.exp[e.index].bnk_code = false;
                              }

                              setError(newError);
                            }}
                            optionLabel={
                              exp.type_acc === 1 ? "acc_name" : "bank.BANK_NAME"
                            }
                            itemTemplate={
                              exp.type_acc === 1 ? glTemplate : bankTemplate
                            }
                            valueTemplate={
                              exp.type_acc === 1 ? valTemp : valBTemp
                            }
                            filter
                            filterBy={
                              exp.type_acc === 1
                                ? "account.acc_name"
                                : "BANK_NAME"
                            }
                            placeholder={
                              exp.type_acc === 1
                                ? "Pilih Kode Akun"
                                : "Pilih Kode Bank"
                            }
                            showClear
                            errorMessage={
                              exp.type_acc === 1
                                ? "Akun Belum Dipilih"
                                : "Bank Belum Dipilih"
                            }
                            error={
                              exp.type_acc === 1
                                ? error?.exp[e.index]?.acc_bnk
                                : error?.exp[e.index]?.bnk_code
                            }
                          />
                        )}
                      />

                      <Column
                        hidden={exp.type_acc !== 2}
                        header="Currency"
                        className="align-text-top"
                        style={{
                          width: "8rem",
                        }}
                        field={""}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <InputText
                              value={
                                e.bnk_code !== null
                                  ? checkBank(e.bnk_code)?.CURRENCY !== null
                                    ? checkCur(checkBank(e.bnk_code)?.CURRENCY)
                                        ?.code
                                    : "IDR"
                                  : ""
                              }
                              onChange={(e) => {}}
                              placeholder="Currency"
                              disabled
                            />
                          </div>
                        )}
                      />

                      <Column
                        hidden={exp.type_acc === 2}
                        header="Tipe Saldo"
                        className="align-text-top"
                        style={{
                          width: "8rem",
                        }}
                        field={""}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <InputText
                              value={
                                e.acc_bnk !== null || e.acc_code !== null
                                  ? exp.exp_type === 1
                                    ? checkAcc(e.acc_code)?.sld_type
                                    : checkAcc(e.acc_bnk)?.sld_type
                                  : ""
                              }
                              onChange={(e) => {}}
                              placeholder="Tipe Saldo"
                              disabled
                            />
                          </div>
                        )}
                      />

                      <Column
                        header="Nilai"
                        className="align-text-top"
                        style={{
                          minWidth: "7rem",
                        }}
                        field={""}
                        body={(e) =>
                          exp.type_acc === 2 &&
                          checkBank(e.bnk_code)?.CURRENCY !== null ? (
                            <PrimeNumber
                              value={e.value && e.value}
                              onChange={(u) => {
                                let temp = [...exp.exp];
                                temp[e.index].value = u.target.value;
                                temp[e.index].fc =
                                  temp[e.index].value *
                                  checkCur(checkBank(e.bnk_code)?.CURRENCY)
                                    ?.rate;

                                updateExp({ ...exp, exp: temp });

                                let newError = error;
                                newError.exp[e.index].value = false;
                                newError.exp.push({ value: false });
                                setError(newError);
                              }}
                              placeholder="0"
                              min={0}
                              error={error?.exp[e.index]?.value}
                            />
                          ) : (
                            <PrimeNumber
                              price
                              value={e.value && e.value}
                              onChange={(u) => {
                                let temp = [...exp.exp];
                                temp[e.index].value = u.value;
                                temp[e.index].fc = temp[e.index].value;
                                updateExp({ ...exp, exp: temp });

                                let newError = error;
                                newError.exp[e.index].value = false;
                                newError.exp.push({ value: false });
                                setError(newError);
                              }}
                              placeholder="0"
                              min={0}
                              error={error?.exp[e.index]?.value}
                            />
                          )
                        }
                      />

                      <Column
                        hidden={exp.type_acc !== 2}
                        header="FC"
                        className="align-text-top"
                        style={{
                          minWidth: "8rem",
                        }}
                        field={""}
                        body={(e) => (
                          <PrimeNumber
                            price
                            value={e.fc && e.fc}
                            onChange={(e) => {}}
                            placeholder="0"
                            disabled
                          />
                        )}
                      />

                      <Column
                        header="Keterangan"
                        className="align-text-top"
                        // style={{
                        //   maxWidth: "15rem",
                        // }}
                        field={""}
                        body={(e) => (
                          <PrimeInput
                            value={e.desc}
                            onChange={(u) => {
                              let temp = [...exp.exp];
                              temp[e.index].desc = u.target.value;
                              updateExp({ ...exp, exp: temp });
                            }}
                            placeholder="Masukan Keterangan"
                          />
                        )}
                      />

                      <Column
                        body={(e) =>
                          e.index === exp.exp.length - 1 ? (
                            <Link
                              onClick={() => {
                                let newError = error;
                                newError.exp.push({ value: false });
                                setError(newError);

                                updateExp({
                                  ...exp,
                                  exp: [
                                    ...exp.exp,
                                    {
                                      id: null,
                                      acc_code: null,
                                      acc_bnk: null,
                                      bnk_code: null,
                                      value: null,
                                      fc: null,
                                      desc: null,
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
                                let newError = error;
                                newError.exp.push({ value: false });
                                setError(newError);

                                let temp = [...exp.exp];
                                temp.splice(e.index, 1);
                                updateExp({
                                  ...exp,
                                  exp: temp,
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
            </>
          ) : exp !== null && exp.type_trx === 3 ? (
            // Uang Muka
            <>
              <div className="col-12 p-0">
                <div className="mt-4 mb-2 ml-3 mr-3 fs-13">
                  <b>{"Uang Muka Pembelian"}</b>
                </div>
                <Divider className="mb-2 ml-3 mr-3"></Divider>
              </div>

              <div className="col-3">
                <PrimeDropdown
                  label={"Supplier"}
                  value={exp?.dp_sup && supp(exp?.dp_sup)}
                  options={allSup}
                  onChange={(e) => {
                    let filt = [];
                    po?.forEach((element) => {
                      if (e.value?.supplier?.id === element?.sup_id?.id) {
                        filt.push(element);
                      }
                    });
                    updateExp({
                      ...exp,
                      dp_sup: e.value?.supplier?.id,
                      det_dp: filt?.map((v) => {
                        return {
                          ...v,
                          po_id: v?.id,
                          t_bayar: v?.total_bayar,
                          desc: null,
                        };
                      }),
                    });
                  }}
                  optionLabel="supplier.sup_name"
                  placeholder="Pilih Supplier"
                  filter
                  filterBy="supplier.sup_name"
                />
              </div>

              <div className="col-2 mb-2">
                <label className="text-label">DP Melalui</label>
                <div className="p-inputgroup">
                  <SelectButton
                    value={
                      exp !== null && exp.dp_type !== ""
                        ? exp.dp_type === 1
                          ? { kode: 1, name: "Kas" }
                          : { kode: 2, name: "Bank" }
                        : null
                    }
                    options={exp_type}
                    onChange={(e) => {
                      updateExp({
                        ...exp,
                        dp_type: e.value.kode,
                        // type_acc: e.value.kode === 2 ? 1 : null,
                        // exp_bnk: null,
                        // kas_acc: null,
                        // exp: exp.exp.map((v) => ({
                        //   ...v,
                        //   acc_code: null,
                        //   acc_bnk: null,
                        //   bnk_code: null,
                        //   value: null,
                        //   desc: null,
                        // })),
                      });

                      // let newError = error;
                      // if (e.value.kode === 1) {
                      //   newError.exp_bnk = false;
                      //   newError.exp.push({
                      //     acc_bnk: false,
                      //     bnk_code: false,
                      //     value: false,
                      //   });
                      // } else {
                      //   newError.exp_kas = false;
                      // }

                      // if (e.value.kode === 2 && exp.type_acc === 1) {
                      //   newError.exp.push({
                      //     acc_code: false,
                      //     bnk_code: false,
                      //     value: false,
                      //   });
                      // } else if (e.value.kode === 2 && exp.type_acc === 2) {
                      //   newError.exp.push({
                      //     acc_code: false,
                      //     acc_bnk: false,
                      //     value: false,
                      //   });
                      // }
                    }}
                    optionLabel="name"
                  />
                </div>
              </div>

              {exp !== null && exp.dp_type === 1 ? (
                <>
                  <div className="col-3">
                    <PrimeDropdown
                      label={"Kode Akun"}
                      value={exp.dp_kas && checkAcc(exp.dp_kas)}
                      options={accKas}
                      onChange={(e) => {
                        updateExp({
                          ...exp,
                          dp_kas: e.value?.id ?? null,
                        });

                        // let newError = error;
                        // newError.exp_kas = false;
                        // setError(newError);
                      }}
                      optionLabel="account.acc_name"
                      placeholder="Pilih Kode Akun"
                      filter
                      filterBy="acc_name"
                      itemTemplate={glTemplate}
                      valueTemplate={valTemp}
                      // errorMessage="Akun Belum Dipilih"
                      // error={error?.exp_kas}
                      showClear
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-3">
                    <PrimeDropdown
                      label={"Kode Bank"}
                      value={exp.dp_bnk && checkBank(exp.dp_bnk)}
                      options={bank}
                      onChange={(e) => {
                        updateExp({
                          ...exp,
                          dp_bnk: e.value?.id ?? null,
                        });

                        // let newError = error;
                        // newError.exp_bnk = false;
                        // setError(newError);
                      }}
                      optionLabel="bank.BANK_NAME"
                      placeholder="Pilih Kode Bank"
                      filter
                      filterBy="BANK_NAME"
                      itemTemplate={bankTemplate}
                      valueTemplate={valBTemp}
                      // errorMessage="Bank Belum Dipilih"
                      // error={error?.exp_bnk}
                      showClear
                    />
                  </div>
                </>
              )}

              {exp?.det_dp?.length ? (
                <>
                  <CustomAccordion
                    className="col-12 mt-4"
                    tittle={"Daftar Pesanan Pembelian"}
                    defaultActive={true}
                    active={accor.bayar}
                    onClick={() => {
                      setAccor({
                        ...accor,
                        bayar: !accor.bayar,
                      });
                    }}
                    key={1}
                    body={
                      <>
                        <DataTable
                          responsiveLayout="none"
                          value={exp?.det_dp?.map((v, i) => {
                            return {
                              ...v,
                              index: i,
                              // payment: v?.payment ?? 0,
                            };
                          })}
                          className="display w-150 datatable-wrapper header-white no-border"
                          showGridlines={false}
                          emptyMessage={() => <div></div>}
                        >
                          <Column
                            header="No. Pesanan Pembelian"
                            style={{
                              maxWidth: "10rem",
                            }}
                            field={""}
                            body={(e) => (
                              <PrimeInput
                                value={checkPo(e.po_id)?.po_code ?? null}
                                onChange={(u) => {}}
                                placeholder="No. Pesanan Pembelian"
                                disabled
                              />
                            )}
                          />

                          <Column
                            header="Tanggal Pesanan"
                            style={{
                              maxWidth: "10rem",
                            }}
                            field={""}
                            body={(e) => (
                              <div className="p-inputgroup">
                                <Calendar
                                  value={
                                    new Date(`${checkPo(e.po_id)?.po_date}Z`)
                                  }
                                  onChange={(e) => {}}
                                  placeholder="Tanggal Pesanan"
                                  dateFormat="dd-mm-yy"
                                  disabled
                                />
                              </div>
                            )}
                          />

                          <Column
                            header="Total Tagihan"
                            style={{
                              maxWidth: "10rem",
                            }}
                            field={""}
                            body={(e) => (
                              <PrimeNumber
                                price
                                value={e?.t_bayar}
                                onChange={(e) => {}}
                                placeholder="0"
                                disabled
                              />
                            )}
                          />

                          <Column
                            header="Nilai Uang Muka"
                            // className="align-text-top"
                            style={{
                              maxWidth: "10rem",
                            }}
                            field={""}
                            body={(e) =>
                              supp(exp.dp_sup)?.supplier?.sup_curren !==
                              null ? (
                                <PrimeNumber
                                  value={e.value ? e.value : ""}
                                  onChange={(u) => {
                                    let temp = [...exp.det_dp];
                                    temp[e.index].value = Number(
                                      u.target.value
                                    );
                                    temp[e.index].remain =
                                      e.t_bayar - Number(u.target.value);
                                    updateExp({ ...exp, det_dp: temp });

                                    // let newError = error;
                                    // newError.acq[e.index].pay = false;
                                    // newError.acq?.push({ pay: false });
                                    // setError(newError);
                                  }}
                                  placeholder="0"
                                  // min={0}
                                  type="number"
                                  // error={error?.acq[e.index]?.pay}
                                />
                              ) : (
                                <PrimeNumber
                                  price
                                  value={e.value && e.value}
                                  onChange={(u) => {
                                    let temp = [...exp.det_dp];
                                    temp[e.index].value = u.value;
                                    temp[e.index].remain = e.t_bayar - u.value;
                                    updateExp({ ...exp, det_dp: temp });

                                    // let newError = error;
                                    // newError.acq[e.index].pay = false;
                                    // newError.acq.push({ pay: false });
                                    // setError(newError);
                                  }}
                                  placeholder="0"
                                  min={0}
                                  // error={error?.acq[e.index]?.pay}
                                />
                              )
                            }
                          />

                          <Column
                            hidden={isEdit}
                            header="Sisa Tagihan"
                            style={{
                              maxWidth: "10rem",
                            }}
                            field={""}
                            body={(e) => (
                              <PrimeNumber
                                price
                                value={e.remain ?? 0}
                                onChange={(e) => {}}
                                placeholder="0"
                                disabled
                              />
                            )}
                          />

                          <Column
                            header="Deskripsi"
                            style={{
                              maxWidth: "20rem",
                            }}
                            field={""}
                            body={(e) => (
                              <PrimeInput
                                value={e.desc ?? null}
                                onChange={(e) => {
                                  let temp = [...exp.det_dp];
                                  temp[e.index].desc = e.target.value;
                                  updateExp({ ...exp, det_dp: temp });
                                }}
                                placeholder="Masukan Deskripsi"
                              />
                            )}
                          />
                        </DataTable>
                      </>
                    }
                  />
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            // Biaya Batch
            <>
              <div className="col-3">
                <label className="text-label">Kode Akun</label>
                <div className="p-inputgroup"></div>
                <PrimeDropdown
                  value={exp.exp_acc && checkAcc(exp.exp_acc)}
                  options={acc}
                  onChange={(e) => {
                    updateExp({
                      ...exp,
                      exp_acc: e.value.account.id,
                    });

                    let newError = error;
                    newError.akn = false;
                    setError(newError);
                  }}
                  optionLabel="account.acc_name"
                  placeholder="Pilih Kode Akun"
                  filter
                  filterBy="account.acc_name"
                  errorMessage="Akun Belum Dipilih"
                  error={error?.akn}
                />
              </div>
              <div className="col-2">
                <label className="text-label">Kode Batch</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={exp.batch_id && checkbtc(exp.batch_id)}
                  option={batch}
                  onChange={(e) => {
                    updateExp({
                      ...exp,
                      batch_id: e.id,
                    });

                    let newError = error;
                    newError.btc = false;
                    setError(newError);
                  }}
                  label={"[bcode]"}
                  placeholder="Pilih Kode Batch"
                  errorMessage="Kode Batch Belum Dipilih"
                  error={error?.btc}
                />
              </div>
              <div className="col-3">
                <PrimeInput
                  label={"Departemen"}
                  value={
                    exp.batch_id !== null
                      ? checkbtc(exp.batch_id)?.dep_id?.ccost_name
                      : ""
                  }
                  placeholder="Departemen"
                  disabled
                />
              </div>
              <div className="col-3">
                <label className="text-label">Kode Project</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={exp.exp_prj && checkProj(exp.exp_prj)}
                  option={proj}
                  onChange={(e) => {
                    updateExp({
                      ...exp,
                      exp_prj: e.id,
                    });

                    let newError = error;
                    newError.proj = false;
                    setError(newError);
                  }}
                  label={"[proj_name] - [proj_code]"}
                  placeholder="Pilih Project"
                  detail
                  onDetail={() => setShowProj(true)}
                  errorMessage="Kode Project Belum Dipilih"
                  error={error?.proj}
                />
              </div>
              <CustomAccordion
                className="col-12 mt-4"
                tittle={"Biaya Batch"}
                defaultActive={true}
                active={accor.keluar}
                onClick={() => {
                  setAccor({
                    ...accor,
                    keluar: !accor.keluar,
                  });
                }}
                key={1}
                body={
                  <>
                    <DataTable
                      responsiveLayout="none"
                      value={exp.exp?.map((v, i) => {
                        return {
                          ...v,
                          index: i,
                          // value: v?.value ?? 0,
                        };
                      })}
                      className="display w-150 datatable-wrapper header-white no-border"
                      showGridlines={false}
                      emptyMessage={() => <div></div>}
                    >
                      <Column
                        header="Kode Akun"
                        className="align-text-top"
                        style={{
                          width: "25rem",
                        }}
                        field={""}
                        body={(e) => (
                          <PrimeDropdown
                            value={e.acc_code && checkAcc(e.acc_code)}
                            option={acc}
                            onChange={(u) => {
                              console.log(e.value);
                              let temp = [...exp.exp];
                              temp[e.index].acc_code = u.target.account.id;
                              updateExp({ ...exp, exp: temp });

                              let newError = error;
                              newError.exp[e.index].acc = false;
                              setError(newError);
                            }}
                            optionLabel={"account.acc_name"}
                            itemTemplate={glTemplate}
                            valueTemplate={valTemp}
                            filter
                            filterBy={"acc_name"}
                            errorMessage="Akun Belum Dipilih"
                            error={error?.exp[e.index]?.acc}
                          />
                        )}
                      />

                      <Column
                        header="D/K"
                        className="align-text-top"
                        style={{
                          width: "6rem",
                        }}
                        field={""}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <InputText
                              value={
                                e.acc_code &&
                                checkAcc(e.acc_code)?.account?.sld_type
                              }
                              onChange={(e) => {}}
                              placeholder="D/K"
                              disabled
                            />
                          </div>
                        )}
                      />

                      <Column
                        header="Nilai"
                        className="align-text-top"
                        style={{
                          maxWidth: "5rem",
                        }}
                        field={""}
                        body={(e) => (
                          <PrimeNumber
                            price
                            value={e.value && e.value}
                            onChange={(u) => {
                              let temp = [...exp.exp];
                              temp[e.index].value = u.value;
                              updateExp({ ...exp, exp: temp });

                              let newError = error;
                              newError.exp[e.index].nil = false;
                              setError(newError);
                            }}
                            placeholder="0"
                            min={0}
                            error={error?.exp[e.index]?.nil}
                          />
                        )}
                      />

                      <Column
                        header="Keterangan"
                        className="align-text-top"
                        // style={{
                        //   maxWidth: "15rem",
                        // }}
                        field={""}
                        body={(e) => (
                          <PrimeInput
                            value={e.desc}
                            onChange={(u) => {
                              let temp = [...exp.exp];
                              temp[e.index].desc = u.target.value;
                              updateExp({ ...exp, exp: temp });
                            }}
                            placeholder="Masukan Keterangan"
                          />
                        )}
                      />

                      <Column
                        body={(e) =>
                          e.index === exp.exp.length - 1 ? (
                            <Link
                              onClick={() => {
                                let newError = error;
                                newError.exp.push({ nil: false });
                                setError(newError);

                                updateExp({
                                  ...exp,
                                  exp: [
                                    ...exp.exp,
                                    {
                                      id: null,
                                      acc_code: null,
                                      value: null,
                                      desc: null,
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
                                let temp = [...exp.exp];
                                temp.splice(e.index, 1);
                                updateExp({
                                  ...exp,
                                  exp: temp,
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
            </>
          )}

          {/* kode suplier otomatis keluar, karena sudah melekat di faktur pembelian  */}
        </Row>
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
            onClick={() => onSubmit()}
            autoFocus
            loading={update}
          />
        </div>
      </div>
    );
  };

  return (
    <Row>
      <Col className="pt-0">
        <Card>
          <Card.Body>
            {/* {header()} */}
            {body()}
            {footer()}

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
                  updateExp({ ...exp, acq_sup: e.data.id });
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
                  updateExp({ ...exp, exp_prj: e.data.id });
                }

                setDoubleClick(true);

                setTimeout(() => {
                  setDoubleClick(false);
                }, 2000);
              }}
            />

            <DataBank
              data={bank}
              loading={false}
              popUp={true}
              show={showBank}
              onHide={() => {
                setShowBank(false);
              }}
              onInput={(e) => {
                setShowBank(!e);
              }}
              onSuccessInput={(e) => {
                getBank();
              }}
              onRowSelect={(e) => {
                if (doubleClick) {
                  setShowBank(false);
                  updateExp({
                    ...exp,
                    bank_id: e.data.bank.id,
                    bank_acc: e.data.bank.acc_id,
                  });
                }

                setDoubleClick(true);

                setTimeout(() => {
                  setDoubleClick(false);
                }, 2000);
              }}
            />

            <DataBank
              data={bank}
              loading={false}
              popUp={true}
              show={showBankG}
              onHide={() => {
                setShowBankG(false);
              }}
              onInput={(e) => {
                setShowBankG(!e);
              }}
              onSuccessInput={(e) => {
                getBank();
              }}
              onRowSelect={(e) => {
                if (doubleClick) {
                  setShowBankG(false);
                  updateExp({
                    ...exp,
                    bank_id: e.data.bank.id,
                    bank_acc: e.data.bank.acc_id,
                  });
                }

                setDoubleClick(true);

                setTimeout(() => {
                  setDoubleClick(false);
                }, 2000);
              }}
            />

            <DataAkun
              data={accKas}
              loading={false}
              popUp={true}
              show={showAccKas}
              onHide={() => {
                setShowAccKas(false);
              }}
              onInput={(e) => {
                setShowAccKas(!e);
              }}
              onSuccessInput={(e) => {
                getAccount();
              }}
              onRowSelect={(e) => {
                if (doubleClick) {
                  setShowAccKas(false);
                  updateExp({ ...exp, kas_acc: e.data.account.id });
                }

                setDoubleClick(true);

                setTimeout(() => {
                  setDoubleClick(false);
                }, 2000);
              }}
            />

            <DataAkun
              data={allacc}
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
                getAccount();
              }}
              onRowSelect={(e) => {
                if (doubleClick) {
                  setShowAcc(false);
                  updateExp({ ...exp, exp_acc: e.data.account.id });
                }

                setDoubleClick(true);

                setTimeout(() => {
                  setDoubleClick(false);
                }, 2000);
              }}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default KasBankOutInput;
