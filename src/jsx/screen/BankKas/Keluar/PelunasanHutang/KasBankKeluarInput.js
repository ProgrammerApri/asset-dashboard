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

const defError = {
  code: false,
  date: false,
  sup: false,
  akn: false,
  dep: false,
  proj: false,
  acco: false,
  bn_code: false,
  bn_acc: false,
  gr: false,
  tgl: false,
  bn_id: false,
  exp: [
    {
      acc: false,
      nil: false,
    },
  ],
  acq: [
    {
      pay: false,
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
  const [account, setAccount] = useState(null);
  const [accKas, setAccKas] = useState(null);
  const [bank, setBank] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [faktur, setFaktur] = useState(null);
  const [apcard, setAP] = useState(null);
  const [dept, setDept] = useState(null);
  const [proj, setProj] = useState(null);
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

  const exp_type = [
    { typePengeluaran: "Pelunasan", kode: 1 },
    { typePengeluaran: "Pengeluaran Kas/Bank", kode: 2 },
  ];

  const acq_pay = [
    { kode: 1, jenisPengeluaran: "Kas" },
    { kode: 2, jenisPengeluaran: "Bank" },
    { kode: 3, jenisPengeluaran: "Giro" },
  ];

  const [type, setType] = useState({ kode: 1, typePengeluaran: "Pelunasan" });
  const [typeB, setTypeB] = useState({ kode: 1, jenisPengeluaran: "Kas" });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getAccKas();
    getBank();
    getSupplier();
    getDept();
    getProj();
    getAccount();
  }, []);

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !exp.exp_code || exp.exp_code === "",
      date: !exp.exp_date || exp.exp_date === "",
      sup: exp.exp_type === 1 ? !exp.acq_sup : false,
      akn: exp.exp_type === 2 ? !exp.exp_acc : false,
      dep: exp.exp_type === 2 ? !exp.exp_dep : false,
      proj: exp.exp_type === 2 ? !exp.exp_prj : false,
      acco: exp.acq_pay === 1 ? !exp.kas_acc : false,
      bn_code: exp.acq_pay === 2 ? !exp.bank_ref : false,
      bn_acc: exp.acq_pay === 2 ? !exp.bank_acc : false,
      gr: exp.acq_pay === 3 ? !exp.giro_num : false,
      tgl: exp.acq_pay === 3 ? !exp.giro_date : false,
      bn_id: exp.acq_pay === 3 ? !exp.bank_id : false,
      exp: [],
      acq: [],
    };

    exp?.exp.forEach((element, i) => {
      if (i > 0) {
        if (element.acc_code || element.value) {
          errors.exp[i] = {
            acc: !element.acc_code,
            nil:
              !element.value || element.value === "" || element.value === "0",
          };
        }
      } else {
        errors.exp[i] = {
          acc: !element.acc_code,
          nil: !element.value || element.value === "" || element.value === "0",
        };
      }
    });

    exp?.acq?.forEach((element, i) => {
      if (i > 0) {
        if (element.payment) {
          errors.acq[i] = {
            pay:
              !element.payment ||
              element.payment === "" ||
              element.payment === "0",
          };
        }
      } else {
        errors.acq[i] = {
          pay:
            !element.payment ||
            element.payment === "" ||
            element.payment === "0",
        };
      }
    });

    // if (exp !== null && exp.exp_type === 2) {
    if (!errors.exp[0].acc && !errors.exp[0].nil) {
      errors.acq?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }
    // }

    // if (exp !== null && exp.exp_type === 1) {
    if (exp?.acq.length) {
      if (!errors.acq[0]?.pay) {
        errors.exp?.forEach((e) => {
          for (var key in e) {
            e[key] = false;
          }
        });
      }
    }
    // }

    let validExp = false;
    let validAcq = false;
    errors.exp?.forEach((el) => {
      for (var k in el) {
        validExp = !el[k];
      }
    });
    if (!validExp) {
      errors.acq?.forEach((el) => {
        for (var k in el) {
          validAcq = !el[k];
        }
      });
    }

    setError(errors);

    valid =
      !errors.code &&
      !errors.date &&
      !errors.sup &&
      !errors.akn &&
      !errors.dep &&
      !errors.proj &&
      !errors.acco &&
      !errors.bn_code &&
      !errors.bn_acc &&
      !errors.gr &&
      !errors.tgl &&
      !errors.bn_id &&
      (validExp || validAcq);

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
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        // let filt = [];
        // data.forEach((elem) => {
        //   if (elem.account.kat_code === 1 & 2) {
        //     filt.push(elem);
        //   }
        // });
        setAccount(data);
      }
    } catch (error) {}
  };

  const getAccKas = async () => {
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
        let filt = [];
        data.forEach((elem) => {
          if (elem.account.kat_code === 1 && elem.account.dou_type === "D") {
            filt.push(elem);
          }
        });
        console.log(data);
        setAccKas(filt);
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
        // let filt = [];
        // data.forEach((elem) => {
        //   if (elem.account.kat_code === 2) {
        //     filt.push(elem);
        //   }
        // });
        setBank(data);
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

  const supp = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element.supplier.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkAccKas = (value) => {
    let selected = {};
    accKas?.forEach((element) => {
      if (value === element.account.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkBank = (value) => {
    let selected = {};
    bank?.forEach((element) => {
      if (value === element.bank.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkAcc = (value) => {
    let selected = {};
    account?.forEach((element) => {
      if (value === element.account.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkFk = (value) => {
    let selected = {};
    faktur?.forEach((element) => {
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

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editEXP();
      } else {
        setUpdate(true);
        addEXP();
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

  const updateExp = (e) => {
    dispatch({
      type: SET_CURRENT_EXP,
      payload: e,
    });
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Pembayaran</b>
      </h4>
    );
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

          <div className="col-12">
            <span className="fs-14">
              <b>Informasi Pengeluaran</b>
            </span>
            {/* </div>
          <div className="col-12"> */}
            <Divider className="mt-2"></Divider>
          </div>

          <div className="col-4 mb-2">
            <label className="text-label">Tipe Pengeluaran</label>
            <div className="p-inputgroup">
              <SelectButton
                value={
                  exp !== null && exp.exp_type !== ""
                    ? exp.exp_type === 1
                      ? { kode: 1, typePengeluaran: "Pelunasan" }
                      : { kode: 2, typePengeluaran: "Pengeluaran Kas/Bank" }
                    : null
                }
                options={exp_type}
                onChange={(e) => {
                  console.log(e.value);
                  updateExp({
                    ...exp,
                    exp_type: e.value.kode,
                    acq_pay: e.value.kode === 1 ? 1 : null,
                  });
                }}
                optionLabel="typePengeluaran"
              />
            </div>
          </div>

          <div className="col-8"></div>

          {/* Type Pembayaran */}
          {exp !== null && exp.exp_type === 1 ? (
            <>
              <div className="col-4">
                <label className="text-label">Kode Pemasok</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={exp.acq_sup && supp(exp.acq_sup)}
                  option={supplier}
                  onChange={(e) => {
                    updateExp({
                      ...exp,
                      acq_sup: e.supplier?.id,
                      acq: e.ap?.map((v) => {
                        return {
                          id: null,
                          fk_id: v.ord_id?.id,
                          value: v.trx_amnh,
                          payment: 0,
                        };
                      }),
                    });

                    let newError = error;
                    newError.sup = false;
                    setError(newError);
                  }}
                  label={"[supplier.sup_name]"}
                  placeholder="Pilih Pemasok"
                  detail
                  errorMessage="Pemasok Belum Dipilih"
                  error={error?.sup}
                />
              </div>

              <div className="col-8">
                <label className="text-label">Jenis Pengeluaran</label>
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
                      updateExp({ ...exp, acq_pay: e.value.kode });
                    }}
                    optionLabel="jenisPengeluaran"
                  />
                </div>
              </div>

              {/* kode pembayaran cash  */}
              {exp !== null && exp.acq_pay === 1 ? (
                <>
                  <div className="col-4">
                    <label className="text-label">Kode Akun</label>
                    <div className="p-inputgroup"></div>
                    <CustomDropdown
                      value={exp.kas_acc && checkAccKas(exp.kas_acc)}
                      option={accKas}
                      onChange={(e) => {
                        updateExp({ ...exp, kas_acc: e.account.id });

                        let newError = error;
                        newError.acco = false;
                        setError(newError);
                      }}
                      label={"[account.acc_name] - [account.acc_code]"}
                      placeholder="Pilih Kode Akun"
                      detail
                      onDetail={() => setShowAccKas(true)}
                      errorMessage="Akun Belum Dipilih"
                      error={error?.acco}
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
                    <label className="text-label">Akun Bank</label>
                    <div className="p-inputgroup"></div>
                    <CustomDropdown
                      value={exp.bank_id && checkBank(exp.bank_id)}
                      option={bank}
                      onChange={(e) => {
                        updateExp({
                          ...exp,
                          bank_id: e.bank?.id,
                          bank_acc: e.bank?.acc_id,
                        });

                        let newError = error;
                        newError.bn_acc = false;
                        setError(newError);
                      }}
                      label={"[bank.BANK_NAME] - [bank.BANK_CODE]"}
                      placeholder="Pilih Akun Bank"
                      detail
                      onDetail={() => setShowBank(true)}
                      errorMessage="Akun Bank Belum Dipilih"
                      error={error?.bn_acc}
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
                    <label className="text-label">Kode Bank</label>
                    <div className="p-inputgroup"></div>
                    <CustomDropdown
                      value={exp.bank_id && checkBank(exp.bank_id)}
                      option={bank}
                      onChange={(e) => {
                        updateExp({
                          ...exp,
                          bank_id: e.bank?.id,
                          bank_acc: e.bank?.acc_id,
                        });

                        let newError = error;
                        newError.bn_id = false;
                        setError(newError);
                      }}
                      label={"[bank.BANK_NAME] - [bank.BANK_CODE]"}
                      placeholder="Pilih Kode Bank"
                      onDetail={() => setShowBankG(true)}
                      detail
                      errorMessage="Akun Bank Belum Dipilih"
                      error={error?.bn_id}
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
                            payment: v?.payment ?? 0,
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
                                  e.fk_id && checkAP(e.fk_id)?.ord_id?.fk_code
                                }
                                onChange={(u) => {}}
                                placeholder="Kode Faktur"
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
                                value={e.fk_id && checkAP(e.fk_id).trx_type}
                                onChange={(a) => {}}
                                placeholder="Type"
                                disabled
                              />
                            </div>
                          )}
                        />

                        <Column
                          header="Nilai"
                          style={{
                            maxWidth: "15rem",
                          }}
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <InputText
                                value={e.value}
                                onChange={(e) => {}}
                                placeholder="0"
                                type="number"
                                disabled
                              />
                            </div>
                          )}
                        />

                        <Column
                          header="Nilai Pembayaran"
                          className="align-text-top"
                          field={""}
                          body={(e) => (
                            <PrimeNumber
                              value={e.payment && e.payment}
                              onChange={(u) => {
                                let temp = [...exp.acq];
                                temp[e.index].payment = u.target.value;
                                updateExp({ ...exp, acq: temp });

                                let newError = error;
                                newError.acq[e.index].pay = false;
                                setError(newError);
                              }}
                              placeholder="0"
                              type="number"
                              min={0}
                              error={error?.acq[e.index]?.pay}
                            />
                          )}
                        />

                        <Column
                          body={
                            (e) => (
                              // e.index === out.rprod.length - 1 ? (
                              <Link
                                onClick={() => {
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
          ) : (
            // Type Pengeluaran
            <>
              {" "}
              <div className="col-4">
                <label className="text-label">Kode Akun</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={exp.exp_acc && checkAcc(exp.exp_acc)}
                  option={account}
                  onChange={(e) => {
                    updateExp({
                      ...exp,
                      exp_acc: e.account.id,
                    });

                    let newError = error;
                    newError.akn = false;
                    setError(newError);
                  }}
                  label={"[account.acc_name] - [account.acc_code]"}
                  placeholder="Pilih Kode Akun"
                  detail
                  onDetail={() => setShowAcc(true)}
                  errorMessage="Akun Belum Dipilih"
                  error={error?.akn}
                />
              </div>
              <div className="col-4">
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

                    let newError = error;
                    newError.dep = false;
                    setError(newError);
                  }}
                  label={"[ccost_name] - [ccost_code]"}
                  placeholder="Pilih Departemen"
                  detail
                  onDetail={() => setShowDept(true)}
                  errorMessage="Departemen Belum Dipilih"
                  error={error?.dep}
                />
              </div>
              <div className="col-4">
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
                tittle={"Pengeluaran Kas / Bank"}
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
                          value: v?.value ?? 0,
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
                          <CustomDropdown
                            value={e.acc_code && checkAcc(e.acc_code)}
                            option={account}
                            onChange={(u) => {
                              console.log(e.value);
                              let temp = [...exp.exp];
                              temp[e.index].acc_code = u.account.id;
                              updateExp({ ...exp, exp: temp });

                              let newError = error;
                              newError.exp[e.index].acc = false;
                              setError(newError);
                            }}
                            label={"[account.acc_name] - [account.acc_code]"}
                            placeholder="Pilih Kode Akun"
                            detail
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
                        field={""}
                        body={(e) => (
                          <PrimeNumber
                            value={e.value && e.value}
                            onChange={(u) => {
                              let temp = [...exp.exp];
                              temp[e.index].value = u.target.value;
                              updateExp({ ...exp, exp: temp });

                              let newError = error;
                              newError.exp[e.index].nil = false;
                              setError(newError);
                            }}
                            placeholder="Nilai"
                            type="number"
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
    <>
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
            updateExp({ ...exp, exp_dep: e.data.id });
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
          getAccKas();
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
        data={account}
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
    </>
  );
};

export default KasBankOutInput;
