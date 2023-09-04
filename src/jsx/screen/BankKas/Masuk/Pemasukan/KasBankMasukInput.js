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
import { SET_CURRENT_inc, SET_CURRENT_INC } from "src/redux/actions";
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
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import { InputNumber } from "primereact/inputnumber";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { ar } from "date-fns/locale";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";

const defError = {
  code: false,
  date: false,
  cus: false,
  acq_kas: false,
  ref_bnk: false,
  kd_bnk: false,
  kd_giro: false,
  tgl_gr: false,
  bnk_gr: false,
  inc_kas: false,
  inc_bnk: false,
  dp_cus: false,
  dp_kas: false,
  dp_bnk: false,
  acq: [
    {
      pay: false,
    },
  ],
  inc: [
    {
      acc_code: false,
      acc_bnk: false,
      bnk_code: false,
      value: false,
    },
  ],
};

const KasBankInInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const inc = useSelector((state) => state.inc.current);
  const isEdit = useSelector((state) => state.inc.editInc);
  const dispatch = useDispatch();
  const [bank, setBank] = useState(null);
  const [acc, setAcc] = useState(null);
  const [accKas, setAccKas] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [allCus, setAllCus] = useState(null);
  const [arcard, setAR] = useState(null);
  const [numb, setNumb] = useState(true);
  const [dept, setDept] = useState(null);
  const [proj, setProj] = useState(null);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showDepartemen, setShowDept] = useState(false);
  const [showProj, setShowProj] = useState(false);
  const [showAccKas, setShowAccKas] = useState(false);
  const [showAcc, setShowAcc] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [showBankG, setShowBankG] = useState(false);
  const [sisa, setSisa] = useState(null);
  const [so, setSo] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [error, setError] = useState(defError);
  const [accor, setAccor] = useState({
    bayar: true,
    keluar: false,
  });

  const type_trx = [
    { name: "Pelunasan", kode: 1 },
    { name: "Pemasukan", kode: 2 },
    { name: "Uang Muka", kode: 3 },
  ];

  const acq_pay = [
    { kode: 1, name: "Kas" },
    { kode: 2, name: "Bank" },
    { kode: 3, name: "Giro" },
  ];

  const inc_type = [
    { kode: 1, name: "Kas" },
    { kode: 2, name: "Bank" },
  ];

  const acc_type = [
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
    getCustomer();
    getDept();
    getProj();
    getAcc();
    getSisa();
    getStatus()
    getSo();
    getCur();
  }, []);

  const getARCard = async (plg) => {
    const config = {
      ...endpoints.arcard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        let pel = [];
        let sisa = 0;
        plg.forEach((element) => {
          element.ar = [];
          data.forEach((el) => {
            if (el.trx_dbcr === "D" && el.pay_type === "P1") {
              if (element.customer.id === el.cus_id.id) {
                if (!el.lunas) {
                  element.ar.push(el);
                }
              }
            }
          });

          if (element.ar.length > 0) {
            pel.push(element);
          }
        });
        setAR(data);
        setCustomer(pel);
        // setSisa(sisa);
      }
    } catch (error) {}
  };


  const getStatus = async () => {
    const config = {
      ...endpoints.incomeStatus,
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
    } catch (error) {setNumb(false);
      console.error("Error:", error);
    }
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
        setAllCus(data);
        getARCard(data);
      }
    } catch (error) {}
  };

  const getBank = async () => {
    const config = {
      ...endpoints.bank,
      data: {},
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        let filt = [];

        data?.forEach((element) => {
          filt.push(element.bank);
        });

        setBank(filt);
      }
    } catch (error) {}
  };

  const getAcc = async () => {
    const config = {
      ...endpoints.account,
      data: {},
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        let kas = [];
        let all_d = [];
        data.forEach((elem) => {
          if (elem.account.dou_type === "D" && elem.account.kat_code === 1) {
            kas.push(elem.account);
          }

          if (elem.account.dou_type === "D" && elem.account.connect === false) {
            all_d.push(elem.account);
          }
        });
        setAccKas(kas);
        setAcc(all_d);
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

      if (response.status) {
        const { data } = response;
        setDept(data);
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

      if (response.status) {
        const { data } = response;
        setProj(data);
      }
    } catch (error) {}
  };

  const getSisa = async () => {
    const config = {
      ...endpoints.inc_sisa,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSisa(data);
      }
    } catch (error) {}
  };

  const getSo = async () => {
    const config = {
      ...endpoints.so,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setSo(data);
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
        setCurrency(data);
      }
    } catch (error) {}
  };

  const editINC = async () => {
    const config = {
      ...endpoints.editINC,
      endpoint: endpoints.editINC.endpoint + inc.id,
      data: { ...inc, acq_cus: inc?.acq_cus?.id ?? null },
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
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
          life: 3000,
        });
      }, 500);
    }
  };

  const addINC = async () => {
    const config = {
      ...endpoints.addINC,
      data: inc,
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
            summary: "Gagal",
            detail: `Kode ${inc.inc_code} Sudah Digunakan`,
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
    proj?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkSo = (value) => {
    let selected = {};
    so?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const cus = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer?.id) {
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

  const checkAcc = (value) => {
    let selected = {};
    acc?.forEach((element) => {
      if (value === element?.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkAR = (value) => {
    let selected = {};
    arcard?.forEach((element) => {
      if (value === element?.bkt_id?.id) {
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

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editINC();
    } else {
      setUpdate(true);
      addINC();
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

  const bankTemplate = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.BANK_NAME} - ${option.BANK_CODE}`
          : ""}
      </div>
    );
  };

  const valBTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.BANK_NAME} - ${option.BANK_CODE}`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const updateInc = (e) => {
    dispatch({
      type: SET_CURRENT_INC,
      payload: e,
    });
  };

  const body = () => {
    // let date = new Date(setup?.year_co, setup?.cutoff - 1, 31);
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-3">
            <label className="text-label">Kode Referensi</label>
            <PrimeInput
              value={inc.inc_code}
              onChange={(e) => {
                let newError = error;
                newError.code = false;
                setError(newError);

                updateInc({ ...inc, inc_code: e.target.value });
              }}
              placeholder="Masukan Kode Referensi"
              error={error?.code}
              disabled={numb}

            />
          </div>

          <div className="col-2">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${inc.inc_date}Z`)}
              onChange={(e) => {
                let newError = error;
                newError.date = false;
                setError(newError);

                updateInc({ ...inc, inc_date: e.value });
              }}
              placeholder="Pilih Tanggal"
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.date}
              // minDate={date}
            />
          </div>

          <div className="col-7 mb-2">
            <label className="text-label">Jenis Transaksi</label>
            <div className="p-inputgroup">
              <SelectButton
                value={
                  inc !== null && inc.type_trx !== ""
                    ? inc.type_trx === 1
                      ? { kode: 1, name: "Pelunasan" }
                      : inc.type_trx === 2
                      ? { kode: 2, name: "Pemasukan" }
                      : { kode: 3, name: "Uang Muka" }
                    : null
                }
                options={type_trx}
                onChange={(e) => {
                  console.log(e.value);
                  updateInc({
                    ...inc,
                    type_trx: e.value.kode,
                    acq_pay: e.value?.kode === 1 ? 1 : null,
                    inc_type: e.value?.kode === 2 ? 1 : null,
                    acc_type: e.value?.kode === 2 ? 1 : null,
                    dp_type: e.value?.kode === 3 ? 1 : null,
                    acq_cus: null,
                    acq_kas: null,
                    bank_ref: null,
                    bank_acc: null,
                    giro_num: null,
                    giro_date: null,
                    giro_bnk: null,
                    inc_bnk: null,
                    inc_kas: null,
                    inc_dep: null,
                    inc_proj: null,
                    dp_cus: null,
                    dp_kas: null,
                    dp_bnk: null,
                    inc: inc?.inc.map((v) => ({
                      ...v,
                      acc_code: null,
                      acc_bnk: null,
                      bnk_code: null,
                      value: null,
                      fc: null,
                      desc: null,
                    })),
                    acq: null,
                    det_dp: null,
                  });

                  let newError = error;
                  newError.cus = false;
                  newError.acq_kas = false;
                  newError.ref_bnk = false;
                  newError.kd_bnk = false;
                  newError.kd_giro = false;
                  newError.tgl_gr = false;
                  newError.bnk_gr = false;

                  if (e.value.kode == 1) {
                    newError.inc.push({
                      acc_code: false,
                      acc_bnk: false,
                      bnk_code: false,
                      value: false,
                    });
                  } else {
                    newError.acq.push({
                      pay: false,
                    });
                  }
                }}
                optionLabel="name"
              />
            </div>
          </div>

          {inc !== null && inc.type_trx === 1 ? (
            <>
              <div className="col-12 mt-2">
                <span className="fs-14">
                  <b>Informasi Pelunasan</b>
                </span>
                <Divider className="mt-2"></Divider>
              </div>

              {/* Type Pembayaran */}

              <div className="col-3">
                <label className="text-label">Pelanggan</label>
                <div className="p-inputgroup"></div>
                {isEdit ? (
                  <PrimeInput
                    value={inc?.acq_cus?.cus_name}
                    onChange={(e) => {}}
                    placeholder="Pelanggan"
                    disabled
                  />
                ) : (
                  <PrimeDropdown
                    value={inc.acq_cus && cus(inc.acq_cus).cus_name}
                    options={customer}
                    onChange={(e) => {
                      let dp = 0;
                      e?.value?.ar?.forEach((elem) => {
                        elem.sisa = elem.trx_amnh;
                        elem.sisa_fc = elem.trx_amnv;
                        sisa?.forEach((element) => {
                          if (
                            element?.id === elem?.bkt_id?.id ||
                            element?.id === elem?.sa_id?.id
                          ) {
                            elem.sisa_fc = element.sisa_fc;
                            elem.sisa = element.sisa;
                          }
                        });

                        arcard?.forEach((el) => {
                          if (elem?.so_id && el?.so_id) {
                            if (
                              elem.so_id?.id == el.so_id?.id &&
                              el.trx_type === "DP"
                            ) {
                              if (elem?.cus_id?.cus_curren !== null) {
                                elem.dp = el.trx_amnv;
                              } else {
                                elem.dp = el.trx_amnh;
                              }
                            }
                          } else {
                            elem.dp = 0;
                          }

                          // if (
                          //   elem?.bkt_id?.id == el.bkt_id?.id &&
                          //   el.trx_type === "J4"
                          // ) {
                          //   if (elem?.cus_id?.cus_curren !== null) {
                          //     elem.uang_masuk += el.acq_amnv ?? 0;
                          //   } else {
                          //     elem.uang_masuk += el.acq_amnh ?? 0;
                          //   }
                          // }
                        });
                      });

                      let newError = error;
                      newError.cus = false;
                      setError(newError);

                      updateInc({
                        ...inc,
                        acq_cus: e.value?.customer?.id,
                        acq: e.value.ar?.map((v) => {
                          return {
                            id: null,
                            sale_id: v?.bkt_id !== null ? v?.bkt_id?.id : null,
                            sa_id: null,
                            type: v.trx_type,
                            value:
                              v.cus_id?.cus_curren !== null
                                ? v.trx_amnv
                                : v.trx_amnh,
                            sisa:
                              v.cus_id?.cus_curren !== null
                                ? v.dp > 0
                                  ? v.sisa_fc - v?.dp
                                  : v.sisa_fc
                                : v.dp > 0
                                ? v.sisa - v.dp
                                : v.sisa,
                            payment: null,
                            dp: v.dp ?? 0,
                            uang_masuk:
                              v.cus_id?.cus_curren !== null
                                ? v.trx_amnv - v.sisa_fc
                                : v.trx_amnh - v.sisa,
                          };
                        }),
                      });
                    }}
                    optionLabel="customer.cus_name"
                    placeholder="Pilih Pelanggan"
                    filter
                    filterBy="customer.cus_name"
                    errorMessage="Pelanggan Belum Dipilih"
                    error={error?.cus}
                  />
                )}
              </div>

              <div className="col-8 mb-2">
                <label className="text-label">Pembayaran Melalui</label>
                <div className="p-inputgroup">
                  <SelectButton
                    value={
                      inc !== null && inc.acq_pay !== ""
                        ? inc.acq_pay === 1
                          ? { kode: 1, name: "Kas" }
                          : inc.acq_pay === 2
                          ? { kode: 2, name: "Bank" }
                          : { kode: 3, name: "Giro" }
                        : null
                    }
                    options={acq_pay}
                    onChange={(e) => {
                      updateInc({
                        ...inc,
                        acq_pay: e.value.kode,
                        acq_kas: null,
                        bank_ref: null,
                        bank_acc: null,
                        giro_num: null,
                        giro_date: null,
                        giro_bnk: null,
                      });

                      let newError = error;
                      if (e.value.kode === 1) {
                        newError.kd_giro = false;
                        newError.tgl_gr = false;
                        newError.bnk_gr = false;
                        newError.ref_bnk = false;
                        newError.kd_bnk = false;
                      }

                      if (e.value.kode === 2) {
                        newError.kd_giro = false;
                        newError.tgl_gr = false;
                        newError.bnk_gr = false;
                        newError.acq_kas = false;
                      }

                      if (e.value.kode === 3) {
                        newError.acq_kas = false;
                        newError.ref_bnk = false;
                        newError.kd_bnk = false;
                      }
                    }}
                    optionLabel="name"
                  />
                </div>
              </div>

              {/* kode pembayaran bank  */}
              {inc !== null && inc.acq_pay === 1 ? (
                <>
                  <div className="col-3">
                    <PrimeDropdown
                      label={"Akun Kas"}
                      value={inc.acq_kas && checkAcc(inc.acq_kas)}
                      options={accKas}
                      onChange={(e) => {
                        updateInc({
                          ...inc,
                          acq_kas: e.value?.id ?? null,
                        });

                        let newError = error;
                        newError.acq_kas = false;
                        setError(newError);
                      }}
                      optionLabel="acc_name"
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
              ) : inc !== null && inc.acq_pay === 2 ? (
                <>
                  <div className="col-3">
                    <label className="text-label">Kode Bank</label>
                    <PrimeDropdown
                      value={inc.bank_acc && checkBank(inc.bank_acc)}
                      options={bank}
                      onChange={(e) => {
                        let newError = error;
                        newError.kd_bnk = false;
                        setError(newError);

                        updateInc({
                          ...inc,
                          bank_acc: e?.value?.id ?? null,
                          bank_ref: e.value?.BANK_CODE ?? null,
                        });
                      }}
                      optionLabel="BANK_NAME"
                      placeholder="Pilih Kode Bank"
                      filter
                      filterBy={"BANK_NAME"}
                      itemTemplate={bankTemplate}
                      valueTemplate={valBTemp}
                      errorMessage="Bank Belum Dipilih"
                      error={error?.kd_bnk}
                      showClear
                    />
                  </div>

                  <div className="col-3">
                    <label className="text-label">Kode Referensi Bank</label>
                    <PrimeInput
                      value={inc?.bank_acc ? inc.bank_ref : ""}
                      onChange={(e) => {
                        let newError = error;
                        newError.ref_bnk = false;
                        setError(newError);

                        updateInc({ ...inc, bank_ref: e.target.value });
                      }}
                      placeholder="Masukan Kode Bank"
                      error={error?.ref_bnk}
                    />
                  </div>
                </>
              ) : (
                // pembayran giro
                <>
                  <div className="col-3">
                    <label className="text-label">Nomor Giro</label>
                    <PrimeInput
                      value={inc.giro_num}
                      onChange={(e) => {
                        let newError = error;
                        newError.kd_giro = false;
                        setError(newError);

                        updateInc({ ...inc, giro_num: e.target.value });
                      }}
                      placeholder="Nomor Giro"
                      error={error?.kd_giro}
                    />
                  </div>

                  <div className="col-3">
                    <PrimeCalendar
                      label={"Tanggal Pencairan"}
                      value={new Date(`${inc.giro_date}Z`)}
                      onChange={(e) => {
                        let newError = error;
                        newError.tgl_gr = false;
                        setError(newError);

                        updateInc({ ...inc, giro_date: e.value });
                      }}
                      placeholder="Pilih Tanggal"
                      showIcon
                      dateFormat="dd-mm-yy"
                      error={error?.tgl_gr}
                    />
                  </div>

                  <div className="col-3">
                    <label className="text-label">Kode Bank</label>
                    <div className="p-inputgroup"></div>
                    <PrimeDropdown
                      value={inc.giro_bnk && checkBank(inc.giro_bnk)}
                      options={bank}
                      onChange={(e) => {
                        let newError = error;
                        newError.bnk_gr = false;
                        setError(newError);

                        updateInc({
                          ...inc,
                          giro_bnk: e.value?.id ?? null,
                        });
                      }}
                      optionLabel="BANK_NAME"
                      placeholder="Pilih Kode Bank"
                      filter
                      filterBy={"BANK_NAME"}
                      itemTemplate={bankTemplate}
                      valueTemplate={valBTemp}
                      errorMessage="Bank Belum Dipilih"
                      error={error?.bnk_gr}
                      showClear
                    />
                  </div>
                </>
              )}

              {inc?.acq?.length ? (
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
                        value={inc?.acq?.map((v, i) => {
                          return {
                            ...v,
                            index: i,
                            // value: v?.value ?? 0,
                            // payment: v?.payment ?? 0,
                          };
                        })}
                        className="display w-150 datatable-wrapper header-white no-border"
                        showGridlines={false}
                        emptyMessage={() => <div></div>}
                      >
                        <Column
                          header="Kode Transaksi"
                          style={{
                            minWidth: "15rem",
                          }}
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <InputText
                                value={
                                  checkAR(e.sale_id)?.bkt_id?.ord_code
                                  // || check(e.sa_id)?.code
                                }
                                onChange={(u) => {}}
                                placeholder="Kode Trans"
                                disabled
                              />
                            </div>
                          )}
                        />

                        <Column
                          header="Tanggal J/T tempo"
                          style={{
                            minWidth: "10rem",
                          }}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <Calendar
                                value={
                                  new Date(
                                    `${
                                      checkAR(e.sale_id)?.bkt_id?.due_date
                                      // ||
                                      // check(e.sa_id)?.due_date
                                    }Z`
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
                          hidden={isEdit}
                          header="Type"
                          style={{
                            minWidth: "6rem",
                          }}
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <InputText
                                value={e.type}
                                onChange={(a) => {}}
                                placeholder="Type"
                                disabled
                              />
                            </div>
                          )}
                        />

                        <Column
                          header="Nilai Tagihan"
                          style={{
                            minWidth: "10rem",
                          }}
                          field={""}
                          body={(e) => (
                            <PrimeNumber
                              price
                              value={e.value ? e.value : null}
                              onChange={(u) => {}}
                              placeholder="0"
                              type="number"
                              min={0}
                              disabled
                            />
                          )}
                        />

                        <Column
                          header="Uang Muka"
                          style={{
                            minWidth: "10rem",
                          }}
                          field={""}
                          body={(e) => (
                            <PrimeNumber
                              price
                              value={e.dp ? e.dp : null}
                              onChange={(u) => {}}
                              placeholder="0"
                              type="number"
                              min={0}
                              disabled
                            />
                          )}
                        />

                        <Column
                          header="Telah Dibayar"
                          style={{
                            minWidth: "10rem",
                          }}
                          field={""}
                          body={(e) => (
                            <PrimeNumber
                              price
                              value={e.uang_masuk ? e.uang_masuk : null}
                              onChange={(u) => {}}
                              placeholder="0"
                              type="number"
                              min={0}
                              disabled
                            />
                          )}
                        />

                        <Column
                          hidden={isEdit}
                          header="Sisa Tagihan"
                          style={{
                            minWidth: "10rem",
                          }}
                          field={""}
                          body={(e) => (
                            <PrimeNumber
                              price
                              value={e.sisa ? e.sisa : null}
                              onChange={(u) => {}}
                              placeholder="0"
                              type="number"
                              min={0}
                              disabled
                            />
                          )}
                        />

                        <Column
                          header="Nilai Pembayaran"
                          style={{
                            minWidth: "10rem",
                          }}
                          field={""}
                          body={(e) => (
                            <PrimeNumber
                              price
                              value={e.payment ? e.payment : null}
                              onChange={(u) => {
                                let temp = [...inc.acq];
                                temp[e.index].payment = Number(u.value);
                                updateInc({ ...inc, acq: temp });

                                let newError = error;
                                newError.acq[e.index].pay = false;
                                newError.acq?.push({ pay: false });
                                setError(newError);
                              }}
                              placeholder="0"
                              type="number"
                              min={0}
                              error={error?.acq[e.index]?.pay}
                              // disabled={e.sisa === 0 || e.sisa === null}
                            />
                          )}
                        />

                        <Column
                          body={
                            (e) => (
                              // e.index === out.rprod.length - 1 ? (
                              <Link
                                onClick={() => {
                                  let temp = [...inc.acq];
                                  temp.splice(e.index, 1);
                                  updateInc({
                                    ...inc,
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
          ) : inc.type_trx === 2 ? (
            <>
              <div className="col-12 mt-2">
                <span className="fs-14">
                  <b>Informasi Pemasukan</b>
                </span>
                <Divider className="mt-2"></Divider>
              </div>

              <div className="col-12 mb-2">
                <label className="text-label">Tipe Pemasukan</label>
                <div className="p-inputgroup">
                  <SelectButton
                    value={
                      inc !== null && inc.inc_type !== ""
                        ? inc.inc_type === 1
                          ? { kode: 1, name: "Kas" }
                          : { kode: 2, name: "Bank" }
                        : null
                    }
                    options={inc_type}
                    onChange={(e) => {
                      updateInc({
                        ...inc,
                        inc_type: e.value.kode,
                        acc_type: e.value.kode === 2 ? 1 : null,
                        inc_bnk: null,
                        inc_kas: null,
                        inc: inc.inc.map((v) => ({
                          ...v,
                          acc_code: null,
                          acc_bnk: null,
                          bnk_code: null,
                          value: null,
                          fc: null,
                          desc: null,
                        })),
                      });

                      let newError = error;
                      if (e.value.kode === 1) {
                        newError.inc_bnk = false;
                      } else {
                        newError.inc_kas = false;
                      }
                    }}
                    optionLabel="name"
                  />
                </div>
              </div>

              {inc !== null && inc.inc_type === 1 ? (
                <>
                  <div className="col-3">
                    <PrimeDropdown
                      label={"Kode Akun"}
                      value={inc.inc_kas && checkAcc(inc.inc_kas)}
                      options={accKas}
                      onChange={(e) => {
                        updateInc({
                          ...inc,
                          inc_kas: e.value?.id ?? null,
                        });

                        let newError = error;
                        newError.inc_kas = false;
                        setError(newError);
                      }}
                      optionLabel="account.acc_name"
                      placeholder="Pilih Kode Akun"
                      filter
                      filterBy="acc_name"
                      itemTemplate={glTemplate}
                      valueTemplate={valTemp}
                      errorMessage="Akun Belum Dipilih"
                      error={error?.inc_kas}
                      showClear
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-3">
                    <PrimeDropdown
                      label={"Kode Bank"}
                      value={checkBank(inc.inc_bnk)}
                      options={bank}
                      onChange={(e) => {
                        updateInc({
                          ...inc,
                          inc_bnk: e.value.bank.id,
                        });

                        let newError = error;
                        newError.inc_bnk = false;
                        setError(newError);
                      }}
                      optionLabel="bank.BANK_NAME"
                      placeholder="Pilih Kode Bank"
                      filter
                      filterBy="bank.BANK_NAME"
                      itemTemplate={bankTemplate}
                      valueTemplate={valBTemp}
                      errorMessage="Bank Belum Dipilih"
                      error={error?.inc_bnk}
                    />
                  </div>
                </>
              )}

              <div className="col-3">
                <label className="text-label">Kode Departemen</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={inc.inc_dep && checkDept(inc.inc_dep)}
                  option={dept}
                  onChange={(e) => {
                    updateInc({
                      ...inc,
                      inc_dep: e.id,
                    });
                  }}
                  label={"[ccost_name] - [ccost_code]"}
                  placeholder="Pilih Departemen"
                  detail
                  onDetail={() => setShowDept(true)}
                />
              </div>

              <div className="col-3">
                <label className="text-label">Kode Project</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={inc.inc_prj && checkProj(inc.inc_prj)}
                  option={proj}
                  onChange={(e) => {
                    updateInc({
                      ...inc,
                      inc_prj: e.id,
                    });
                  }}
                  label={"[proj_name] - [proj_code]"}
                  placeholder="Pilih Project"
                  detail
                  onDetail={() => setShowProj(true)}
                />
              </div>

              <div className="col-7 mt-1" hidden={inc.inc_type === 1}>
                <label className="text-label"></label>
                <div className="p-inputgroup">
                  <SelectButton
                    value={
                      inc !== null && inc.acc_type !== ""
                        ? inc.acc_type === 1
                          ? { kode: 1, name: "Akun" }
                          : { kode: 2, name: "Bank" }
                        : null
                    }
                    options={acc_type}
                    onChange={(e) => {
                      updateInc({
                        ...inc,
                        acc_type: e.value.kode,
                        inc: inc.inc.map((v) => ({
                          ...v,
                          acc_bnk: null,
                          bnk_code: null,
                          value: null,
                          fc: null,
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
                tittle={"Pemasukan Kas/Bank"}
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
                      value={inc.inc?.map((v, i) => {
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
                        hidden={inc.inc_type === 2}
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
                              let temp = [...inc.inc];
                              if (inc.inc_type === 1) {
                                temp[e.index].acc_code = u.value?.id ?? null;
                              }

                              updateInc({ ...inc, inc: temp });

                              let newError = error;
                              newError.inc[e.index].acc_code = false;
                              setError(newError);
                            }}
                            optionLabel={"account.acc_name"}
                            itemTemplate={glTemplate}
                            valueTemplate={valTemp}
                            filter
                            filterBy={"acc_name"}
                            placeholder={"Pilih Kode Akun"}
                            errorMessage="Akun Belum Dipilih"
                            error={error?.inc[e.index]?.acc_code}
                            showClear
                          />
                        )}
                      />

                      <Column
                        hidden={inc.inc_type === 1}
                        header={
                          inc.acc_type === 1 || inc.inc_type === 1
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
                              inc.acc_type === 1
                                ? e.acc_bnk && checkAcc(e.acc_bnk)
                                : e.bnk_code && checkBank(e.bnk_code)
                            }
                            options={inc.acc_type === 1 ? acc : bank}
                            onChange={(u) => {
                              let temp = [...inc.inc];

                              if (inc.acc_type === 1) {
                                temp[e.index].acc_bnk = u.value?.id ?? null;
                              } else {
                                temp[e.index].bnk_code = u.value.bank.id;
                                temp[e.index].value = null;
                                temp[e.index].fc = null;
                              }

                              updateInc({ ...inc, inc: temp });

                              let newError = error;
                              if (inc?.acc_type == 1) {
                                newError.inc[e.index].acc_bnk = false;
                              } else {
                                newError.inc[e.index].bnk_code = false;
                              }

                              setError(newError);
                            }}
                            optionLabel={
                              inc.acc_type === 1 ? "acc_name" : "bank.BANK_NAME"
                            }
                            itemTemplate={
                              inc.acc_type === 1 ? glTemplate : bankTemplate
                            }
                            valueTemplate={
                              inc.acc_type === 1 ? valTemp : valBTemp
                            }
                            filter
                            filterBy={
                              inc.acc_type === 1
                                ? "account.acc_name"
                                : "bank.BANK_NAME"
                            }
                            placeholder={
                              inc.acc_type === 1
                                ? "Pilih Kode Akun"
                                : "Pilih Kode Bank"
                            }
                            showClear={inc.acc_type !== 2}
                            errorMessage={
                              inc.acc_type === 1
                                ? "Akun Belum Dipilih"
                                : "Bank Belum Dipilih"
                            }
                            error={
                              inc.acc_type === 1
                                ? error?.inc[e.index]?.acc_bnk
                                : error?.inc[e.index]?.bnk_code
                            }
                          />
                        )}
                      />

                      <Column
                        hidden={inc.acc_type === 2}
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
                                  ? inc.inc_type === 1
                                    ? checkAcc(e.acc_code)?.sld_type
                                    : checkAcc(e.acc_bnk)?.sld_type
                                  : null
                              }
                              onChange={(e) => {}}
                              placeholder="Tipe Saldo"
                              disabled
                            />
                          </div>
                        )}
                      />

                      <Column
                        hidden={inc.acc_type !== 2}
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
                                  ? checkBank(e.bnk_code)?.bank?.CURRENCY !==
                                    null
                                    ? checkCur(
                                        checkBank(e.bnk_code)?.bank?.CURRENCY
                                      )?.code
                                    : "IDR"
                                  : null
                              }
                              onChange={(e) => {}}
                              placeholder="Currency"
                              disabled
                            />
                          </div>
                        )}
                      />

                      <Column
                        header="Nilai"
                        className="align-text-top"
                        field={""}
                        style={{
                          minWidth: "10rem",
                        }}
                        body={(e) =>
                          inc.acc_type === 2 &&
                          checkBank(e.bnk_code)?.bank?.CURRENCY !== null ? (
                            <PrimeNumber
                              value={e.value && e.value}
                              onChange={(u) => {
                                let temp = [...inc.inc];
                                temp[e.index].value = u.target.value;
                                temp[e.index].fc =
                                  temp[e.index].value *
                                  checkCur(
                                    checkBank(e.bnk_code)?.bank?.CURRENCY
                                  )?.rate;
                                updateInc({ ...inc, inc: temp });

                                let newError = error;
                                newError.inc[e.index].value = false;
                                newError.inc.push({ value: false });
                                setError(newError);
                              }}
                              placeholder="0"
                              min={0}
                              error={error?.inc[e.index]?.value}
                            />
                          ) : (
                            <PrimeNumber
                              price
                              value={e.value && e.value}
                              onChange={(u) => {
                                let temp = [...inc.inc];
                                temp[e.index].value = u.value;
                                temp[e.index].fc = temp[e.index].value;
                                updateInc({ ...inc, inc: temp });

                                let newError = error;
                                newError.inc[e.index].value = false;
                                newError.inc.push({ value: false });
                                setError(newError);
                              }}
                              placeholder="0"
                              min={0}
                              error={error?.inc[e.index]?.value}
                            />
                          )
                        }
                      />

                      <Column
                        hidden={inc.acc_type !== 2}
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
                        // style={{
                        //   maxWidth: "15rem",
                        // }}
                        field={""}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <InputText
                              value={e.desc && e.desc}
                              onChange={(u) => {
                                let temp = [...inc.inc];
                                temp[e.index].desc = u.target.value;
                                updateInc({ ...inc, inc: temp });
                              }}
                              placeholder="Masukan Keterangan"
                            />
                          </div>
                        )}
                      />

                      <Column
                        body={(e) =>
                          e.index === inc.inc.length - 1 ? (
                            <Link
                              onClick={() => {
                                let newError = error;
                                newError.inc.push({
                                  acc_code: false,
                                  value: false,
                                });
                                setError(newError);

                                updateInc({
                                  ...inc,
                                  inc: [
                                    ...inc.inc,
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
                                let temp = [...inc.inc];
                                temp.splice(e.index, 1);
                                updateInc({
                                  ...inc,
                                  inc: temp,
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
          ) : (
            <>
              <div className="col-12 p-0 mb-2">
                <div className="mt-4 mb-2 ml-3 mr-3 fs-14">
                  <b>{"Uang Muka Penjualan"}</b>
                </div>
                <Divider className="mb-2 ml-3 mr-3"></Divider>
              </div>

              <div className="col-3">
                <label className="text-label">Pelanggan</label>
                <div className="p-inputgroup"></div>
                <PrimeDropdown
                  value={inc?.dp_cus && cus(inc?.dp_cus).cus_name}
                  options={allCus}
                  onChange={(e) => {

                    console.log("data:");
                    let filt = [];
                    so?.forEach((element) => {
                      if (!element?.sub_addr) {
                        if (element?.pel_id?.id === e.value?.customer?.id) {
                          filt.push(element);
                        }
                      } else {
                        if (element?.sub_id === e.value?.customer?.id) {
                          filt.push(element);
                        }
                      }
                    });

                    // let newError = error;
                    // newError.cus = false;
                    // setError(newError);

                    updateInc({
                      ...inc,
                      dp_cus: e.value?.customer?.id ?? null,
                      det_dp: e.value?.customer?.id
                        ? filt?.map((v) => {
                            return {
                              ...v,
                              so_id: v?.id ?? null,
                              t_bayar: v?.total_bayar ?? 0,
                              desc: null,
                            };
                          })
                        : null,
                    });
                  }}
                  optionLabel="customer.cus_name"
                  placeholder="Pilih Pelanggan"
                  filter
                  filterBy="customer.cus_name"
                  showClear
                  // errorMessage="Pelanggan Belum Dipilih"
                  // error={error?.cus}
                />
              </div>

              <div className="col-2 mb-2">
                <label className="text-label">DP Melalui</label>
                <div className="p-inputgroup">
                  <SelectButton
                    value={
                      inc !== null && inc.dp_type !== ""
                        ? inc.dp_type === 1
                          ? { kode: 1, name: "Kas" }
                          : { kode: 2, name: "Bank" }
                        : null
                    }
                    options={inc_type}
                    onChange={(e) => {
                      updateInc({
                        ...inc,
                        dp_type: e.value.kode,
                        // acc_type: e.value.kode === 2 ? 1 : null,
                        // inc_bnk: null,
                        // inc_kas: null,
                        // inc: inc.inc.map((v) => ({
                        //   ...v,
                        //   acc_code: null,
                        //   acc_bnk: null,
                        //   bnk_code: null,
                        //   value: null,
                        //   fc: null,
                        //   desc: null,
                        // })),
                      });

                      // let newError = error;
                      // if (e.value.kode === 1) {
                      //   newError.inc_bnk = false;
                      // } else {
                      //   newError.inc_kas = false;
                      // }
                    }}
                    optionLabel="name"
                  />
                </div>
              </div>

              {inc !== null && inc.dp_type === 1 ? (
                <>
                  <div className="col-3">
                    <PrimeDropdown
                      label={"Kode Akun"}
                      value={inc.dp_kas && checkAcc(inc.dp_kas)}
                      options={accKas}
                      onChange={(e) => {
                        updateInc({
                          ...inc,
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
                      value={checkBank(inc.dp_bnk)}
                      options={bank}
                      onChange={(e) => {
                        updateInc({
                          ...inc,
                          dp_bnk: e.value.bank.id,
                        });

                        // let newError = error;
                        // newError.exp_bnk = false;
                        // setError(newError);
                      }}
                      optionLabel="bank.BANK_NAME"
                      placeholder="Pilih Kode Bank"
                      filter
                      filterBy="bank.BANK_NAME"
                      itemTemplate={bankTemplate}
                      valueTemplate={valBTemp}
                      // errorMessage="Bank Belum Dipilih"
                      // error={error?.exp_bnk}
                    />
                  </div>
                </>
              )}

              {inc?.det_dp?.length ? (
                <CustomAccordion
                  className="col-12 mt-4"
                  tittle={"Daftar Pesanan Penjualan"}
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
                        value={inc?.det_dp?.map((v, i) => {
                          return {
                            ...v,
                            index: i,
                            // value: v?.value ?? 0,
                            // payment: v?.payment ?? 0,
                          };
                        })}
                        className="display w-150 datatable-wrapper header-white no-border"
                        showGridlines={false}
                        emptyMessage={() => <div></div>}
                      >
                        <Column
                          header="Kode Transaksi"
                          style={{
                            maxWidth: "10rem",
                          }}
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <InputText
                                value={checkSo(e.so_id)?.so_code}
                                onChange={(u) => {}}
                                placeholder="Kode Trans"
                                disabled
                              />
                            </div>
                          )}
                        />

                        <Column
                          header="Tanggal Pesanan"
                          field={""}
                          style={{
                            maxWidth: "10rem",
                          }}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <Calendar
                                value={
                                  new Date(`${checkSo(e.so_id)?.so_date}Z`)
                                }
                                onChange={(e) => {}}
                                placeholder="Tanggal Pesanan"
                                dateFormat="dd-mm-yy"
                                disabled
                              />
                            </div>
                          )}
                        />

                        {/* <Column
                          header="Tanggal J/T tempo"
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <Calendar
                                value={
                                  new Date(`${checkSo(e.so_id)?.due_date}Z`)
                                }
                                onChange={(e) => {}}
                                placeholder="Tanggal Jatuh Tempo"
                                dateFormat="dd-mm-yy"
                                disabled
                              />
                            </div>
                          )}
                        /> */}

                        <Column
                          header="Total Pembayaran"
                          style={{
                            maxWidth: "12rem",
                          }}
                          field={""}
                          body={(e) => (
                            <PrimeNumber
                              price
                              value={e.t_bayar}
                              onChange={(e) => {}}
                              placeholder="0"
                              disabled
                            />
                          )}
                        />

                        <Column
                          header="Nominal DP"
                          style={{
                            maxWidth: "12rem",
                          }}
                          field={""}
                          body={(e) =>
                            cus(inc.dp_cus)?.customer?.cus_curren !== null ? (
                              <PrimeNumber
                                // price
                                value={e.value ? e.value : null}
                                onChange={(u) => {
                                  let temp = [...inc.det_dp];
                                  temp[e.index].value = Number(u.target.value);
                                  temp[e.index].remain =
                                    e.t_bayar - Number(u.target.value);
                                  updateInc({ ...inc, det_dp: temp });

                                  let newError = error;
                                  newError.acq[e.index].pay = false;
                                  newError.acq?.push({ pay: false });
                                  setError(newError);
                                }}
                                placeholder="0"
                                type="number"
                                min={0}
                                error={error?.acq[e.index]?.pay}
                                // disabled={e.sisa === 0 || e.sisa === null}
                              />
                            ) : (
                              <PrimeNumber
                                price
                                value={e.value ? e.value : null}
                                onChange={(u) => {
                                  let temp = [...inc.det_dp];
                                  temp[e.index].value = Number(u.value);
                                  temp[e.index].remain =
                                    e.t_bayar - Number(u.value);
                                  updateInc({ ...inc, det_dp: temp });

                                  let newError = error;
                                  newError.acq[e.index].pay = false;
                                  newError.acq?.push({ pay: false });
                                  setError(newError);
                                }}
                                placeholder="0"
                                type="number"
                                min={0}
                                error={error?.acq[e.index]?.pay}
                                // disabled={e.sisa === 0 || e.sisa === null}
                              />
                            )
                          }
                        />

                        <Column
                          hidden={isEdit}
                          header="Sisa Pembayaran"
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
                                let temp = [...inc.det_dp];
                                temp[e.index].desc = e.target.value;
                                updateInc({ ...inc, det_dp: temp });
                              }}
                              placeholder="Masukan Deskripsi"
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
    <>
      {/* {header()} */}
      {body()}
      {footer()}

      <DataPusatBiaya
        data={dept}
        loading={false}
        popUp={true}
        show={showDepartemen}
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
            updateInc({ ...inc, inc_dep: e.data.id });
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
            updateInc({ ...inc, inc_prj: e.data.id });
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
            updateInc({
              ...inc,
              bank_id: e.data.bank.id,
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
            updateInc({
              ...inc,
              giro_bnk: e.data.bank.id,
            });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

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
            updateInc({
              ...inc,
              acc_kas: e.data.account.id,
            });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataAkun
        data={acc}
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
          getAcc();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowAccKas(false);
            updateInc({
              ...inc,
              inc_acc: e.data.account.id,
            });
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

export default KasBankInInput;
