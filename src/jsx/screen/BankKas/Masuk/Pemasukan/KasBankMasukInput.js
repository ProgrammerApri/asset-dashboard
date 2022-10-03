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

const dk = [
  { name: "Debit", code: "D" },
  { name: "Kredit", code: "K" },
];

const KasBankInInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const inc = useSelector((state) => state.inc.current);
  const isEdit = useSelector((state) => state.inc.editInc);
  const dispatch = useDispatch();
  const [bank, setBank] = useState(null);
  const [acc, setAcc] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [arcard, setAR] = useState(null);
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
  const [accor, setAccor] = useState({
    bayar: true,
    keluar: false,
  });

  const inc_type = [
    { typePengeluaran: "Pelunasan", kode: 1 },
    { typePengeluaran: "Pemasukan Kas/Bank", kode: 2 },
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
    getBank();
    getCustomer();
    getDept();
    getProj();
    getAcc();
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
            if (el.trx_type === "JL" && el.pay_type === "P1") {
              if (element.customer.id === el.cus_id.id) {
                element.ar.push(el);
              }
            }
          });

          // element.ar.forEach((el) => {
          //   data.forEach((ek) => {
          //     if (el.trx_code === ek.id) {
          //       el.trx_amnh = ek?.trx_amnh ?? 0;
          //       el.acq_amnh += ek?.acq_amnh ?? 0;
          //     }
          //   });
          //   sisa = el?.trx_amnh ?? 0 - el?.acq_amnh ?? 0;
          // });

          if (element.ar.length > 0) {
            pel.push(element);
          }
        });
        setAR(data);
        setCustomer(pel);
        setSisa(sisa);
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

        setBank(data);
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

        setAcc(data);
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

  const editINC = async () => {
    const config = {
      ...endpoints.editINC,
      endpoint: endpoints.editINC.endpoint + inc.id,
      data: inc,
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

  const cus = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer.id) {
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
    acc?.forEach((element) => {
      if (value === element.account.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkAR = (value) => {
    let selected = {};
    arcard?.forEach((element) => {
      if (value === element.bkt_id.id) {
        selected = element;
      }
    });

    return selected;
  };

  const cekType = (value) => {
    let selected = {};
    dk?.forEach((element) => {
      if (value === element.code) {
        selected = element;
      }
    });

    return selected;
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
          ? `${option.bank.BANK_NAME} - ${option.bank.BANK_CODE}`
          : ""}
      </div>
    );
  };

  const valBTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.bank.BANK_NAME} - ${option.bank.BANK_CODE}`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const accTemplate = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.account.acc_name} - ${option.account.acc_code}`
          : ""}
      </div>
    );
  };

  const valATemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.account.acc_name} - ${option.account.acc_code}`
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

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Pemasukan</b>
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
            <label className="text-label">Kode Referensi</label>
            <div className="p-inputgroup">
              <InputText
                value={inc.inc_code}
                onChange={(e) =>
                  updateInc({ ...inc, inc_code: e.target.value })
                }
                placeholder="Masukan Kode Referensi"
              />
            </div>
          </div>

          <div className="col-2">
            <label className="text-label">Tanggal</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${inc.inc_date}Z`)}
                onChange={(e) => {
                  updateInc({ ...inc, inc_date: e.value });
                }}
                placeholder="Pilih Tanggal"
                showIcon
                dateFormat="dd-mm-yy"
              />
            </div>
          </div>

          <div className="col-12 mt-2">
            <span className="fs-14">
              <b>Informasi Pemasukan</b>
            </span>
            {/* </div>
          <div className="col-12"> */}
            <Divider className="mt-2"></Divider>
          </div>

          <div className="col-4 mb-2">
            <label className="text-label">Tipe Pemasukan</label>
            <div className="p-inputgroup">
              <SelectButton
                value={
                  inc !== null && inc.inc_type !== ""
                    ? inc.inc_type === 1
                      ? { kode: 1, typePengeluaran: "Pelunasan" }
                      : { kode: 2, typePengeluaran: "Pemasukan Kas/Bank" }
                    : null
                }
                options={inc_type}
                onChange={(e) => {
                  updateInc({
                    ...inc,
                    inc_type: e.value?.kode,
                    acq_pay: e.value?.kode === 1 ? 1 : null,
                  });
                }}
                optionLabel="typePengeluaran"
              />
            </div>
          </div>

          <div className="col-8"></div>

          {/* Type Pembayaran */}
          {inc !== null && inc.inc_type === 1 ? (
            <>
              <div className="col-3">
                <label className="text-label">Pelanggan</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={inc.acq_cus && cus(inc.acq_cus)}
                  option={customer}
                  onChange={(e) => {
                    updateInc({
                      ...inc,
                      acq_cus: e.customer?.id,
                      acq: e.ar?.map((v) => {
                        return {
                          id: null,
                          sale_id: v.bkt_id?.id,
                          value: v.trx_amnh,
                          sisa: sisa,
                          payment: 0,
                        };
                      }),
                    });
                  }}
                  label={"[customer.cus_name] ([customer.cus_code])"}
                  placeholder="Pilih Pelanggan"
                  detail
                />
              </div>

              <div className="col-8 mb-2">
                <label className="text-label">Jenis Pemasukan</label>
                <div className="p-inputgroup">
                  <SelectButton
                    value={
                      inc !== null && inc.acq_pay !== ""
                        ? inc.acq_pay === 1
                          ? { kode: 1, jenisPengeluaran: "Kas" }
                          : inc.acq_pay === 2
                          ? { kode: 2, jenisPengeluaran: "Bank" }
                          : { kode: 3, jenisPengeluaran: "Giro" }
                        : null
                    }
                    options={acq_pay}
                    onChange={(e) => {
                      updateInc({ ...inc, acq_pay: e.value?.kode });
                    }}
                    optionLabel="jenisPengeluaran"
                  />
                </div>
              </div>

              {/* kode pembayaran bank  */}
              {inc !== null && inc.acq_pay === 1 ? (
                <>
                  <div className="col-3">
                    <label className="text-label">Kode Akun</label>
                    <div className="p-inputgroup"></div>
                    <CustomDropdown
                      value={inc.acc_kas && checkAcc(inc.acc_kas)}
                      option={acc}
                      onChange={(e) => {
                        updateInc({
                          ...inc,
                          acc_kas: e.account?.id,
                        });
                      }}
                      label={"[account.acc_name] - [account.acc_code]"}
                      placeholder="Pilih Kode Akun"
                      detail
                      onDetail={() => setShowAcc(true)}
                    />
                  </div>
                </>
              ) : inc !== null && inc.acq_pay === 2 ? (
                <>
                  <div className="col-3">
                    <label className="text-label">Kode Referensi Bank</label>
                    <div className="p-inputgroup">
                      <InputText
                        value={inc.bank_ref}
                        onChange={(e) =>
                          updateInc({ ...inc, bank_ref: e.target.value })
                        }
                        placeholder="Masukan Kode Bank"
                      />
                    </div>
                  </div>

                  <div className="col-3">
                    <label className="text-label">Kode Bank</label>
                    <div className="p-inputgroup"></div>
                    <CustomDropdown
                      value={inc.bank_id && checkBank(inc.bank_id)}
                      option={bank}
                      onChange={(e) => {
                        updateInc({
                          ...inc,
                          bank_id: e.bank?.id,
                        });
                      }}
                      label={"[bank.BANK_NAME] - [bank.BANK_CODE]"}
                      placeholder="Pilih Kode Bank"
                      detail
                      onDetail={() => setShowBank(true)}
                    />
                  </div>
                </>
              ) : (
                // pembayran giro
                <>
                  <div className="col-3">
                    <label className="text-label">Nomor Giro</label>
                    <div className="p-inputgroup">
                      <InputText
                        value={inc.giro_num}
                        onChange={(e) =>
                          updateInc({ ...inc, giro_num: e.target.value })
                        }
                        placeholder="Nomor Giro"
                      />
                    </div>
                  </div>

                  <div className="col-3">
                    <label className="text-label">Tanggal Cair</label>
                    <div className="p-inputgroup">
                      <Calendar
                        value={new Date(`${inc.giro_date}Z`)}
                        onChange={(e) => {
                          updateInc({ ...inc, giro_date: e.value });
                        }}
                        placeholder="Pilih Tanggal"
                        showIcon
                        dateFormat="dd-mm-yy"
                      />
                    </div>
                  </div>

                  <div className="col-3">
                    <label className="text-label">Kode Bank</label>
                    <div className="p-inputgroup"></div>
                    <CustomDropdown
                      value={inc.giro_bnk && checkBank(inc.giro_bnk)}
                      option={bank}
                      onChange={(e) => {
                        updateInc({
                          ...inc,
                          giro_bnk: e.bank.id,
                        });
                      }}
                      label={"[bank.BANK_NAME] - [bank.BANK_CODE]"}
                      placeholder="Pilih Kode Bank"
                      onDetail={() => setShowBankG(true)}
                      detail
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
                          header="Kode Trans"
                          style={{
                            maxWidth: "15rem",
                          }}
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <InputText
                                value={
                                  e.sale_id &&
                                  checkAR(e.sale_id)?.bkt_id?.ord_code
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
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <Calendar
                                value={
                                  new Date(
                                    `${
                                      e.sale_id &&
                                      checkAR(e.sale_id)?.bkt_id?.due_date
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
                          header="Type"
                          style={{
                            width: "10rem",
                          }}
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <InputText
                                value={e.sale_id && checkAR(e.sale_id).trx_type}
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
                              <InputNumber
                                value={e.value}
                                onChange={(e) => {}}
                                placeholder="0"
                                disabled
                              />
                            </div>
                          )}
                        />

                        <Column
                          header="Sisa"
                          style={{
                            maxWidth: "15rem",
                          }}
                          field={""}
                          body={(e) => (
                            <PrimeNumber
                              price
                              value={e.sisa}
                              onChange={(e) => {}}
                              placeholder="0"
                              disabled
                            />
                          )}
                        />

                        <Column
                          header="Nilai Pembayaran"
                          style={{
                            maxWidth: "10rem",
                          }}
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <PrimeNumber
                                price
                                value={e.payment ?? ""}
                                onChange={(u) => {
                                  let temp = [...inc.acq];
                                  temp[e.index].payment = u.value;
                                  updateInc({ ...inc, acq: temp });
                                }}
                                placeholder="0"
                                type="number"
                                min={0}
                              />
                            </div>
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
          ) : (
            // Type Pengeluaran
            <>
              {" "}
              <div className="col-4">
                <label className="text-label">Kode Akun</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={inc.inc_acc && checkAcc(inc.inc_acc)}
                  option={acc}
                  onChange={(u) => {
                    updateInc({ ...inc, inc_acc: u.account.id });
                  }}
                  label={"[account.acc_name] - [account.acc_code]"}
                  placeholder="Pilih Kode Akun"
                  detail
                  onDetail={() => setShowAccKas(true)}
                />
              </div>
              <div className="col-4">
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
              <div className="col-4">
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
                        header="Kode Akun"
                        // style={{
                        //   maxWidth: "15rem",
                        // }}
                        field={""}
                        body={(e) => (
                          <PrimeDropdown
                            value={e.acc_code && checkAcc(e.acc_code)}
                            options={acc}
                            onChange={(u) => {
                              let temp = [...inc.inc];
                              temp[e.index].acc_code = u.value.account.id;
                              updateInc({ ...inc, inc: temp });
                            }}
                            optionLabel="account.acc_name"
                            placeholder="Pilih Kode Akun"
                            filter
                            filterBy="account.acc_name"
                            itemTemplate={accTemplate}
                            valueTemplate={valATemp}
                          />
                        )}
                      />

                      <Column
                        header="Debit/Kredit"
                        className="align-text-top"
                        style={{
                          width: "11rem",
                        }}
                        field={""}
                        body={(e) => (
                          <PrimeDropdown
                            value={e.dbcr && cekType(e.dbcr)}
                            options={dk}
                            onChange={(a) => {
                              let temp = [...inc.inc];
                              temp[e.index].dbcr = a.value.code;
                              updateInc({ ...inc, inc: temp });
                            }}
                            optionLabel="name"
                            placeholder="Debit/Kredit"
                          />
                        )}
                      />

                      <Column
                        header="Nilai"
                        className="align-text-top"
                        field={""}
                        style={{
                          width: "15rem",
                        }}
                        body={(e) => (
                          <PrimeNumber
                            price
                            value={e.value && e.value}
                            onChange={(u) => {
                              let temp = [...inc.inc];
                              temp[e.index].value = u.value;
                              updateInc({ ...inc, inc: temp });
                            }}
                            placeholder="0"
                            min={0}
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
                                updateInc({
                                  ...inc,
                                  inc: [
                                    ...inc.inc,
                                    {
                                      id: null,
                                      bnk_code: null,
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
