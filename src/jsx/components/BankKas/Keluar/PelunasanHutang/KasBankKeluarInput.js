import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import CustomAccordion from "../../../Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_EXP } from "src/redux/actions";
import DataPusatBiaya from "../../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import DataSupplier from "../../../Mitra/Pemasok/DataPemasok";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SelectButton } from "primereact/selectbutton";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataProject from "src/jsx/components/MasterLainnya/Project/DataProject";
import DataBank from "src/jsx/components/MasterLainnya/Bank/DataBank";
import DataAkun from "src/jsx/components/Master/Akun/DataAkun";

const KasBankOutInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
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

  const getAPCard = async () => {
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
        data.forEach((elem) => {
          if (elem.trx_type === "LP" && elem.pay_type === "P1") {
            supplier.forEach((element) => {
              element.fk = [];
              data.forEach((el) => {
                if (element.supplier.id === el.sup_id.id) {
                  element.fk.push(el);
                }
              });
              if (element.fk.length > 0) {
                sup.push(element);
              }
            });
          }
        });
        setAP(data);
        setSupplier(sup)
      }
    } catch (error) {}
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
        setSupplier(data);
        getAPCard();
      }
    } catch (error) {}
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
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editEXP();
    } else {
      setUpdate(true);
      addEXP();
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
          <div className="col-4">
            <label className="text-label">Tanggal</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${exp.exp_date}Z`)}
                onChange={(e) => {
                  updateExp({ ...exp, exp_date: e.value });
                }}
                placeholder="Pilih Tanggal"
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Kode Referensi</label>
            <div className="p-inputgroup">
              <InputText
                value={exp.exp_code}
                onChange={(e) =>
                  updateExp({ ...exp, exp_code: e.target.value })
                }
                placeholder="Masukan Kode Referensi"
              />
            </div>
          </div>

          <div className="col-4 mb-2">
            <label className="text-label">Jenis Pengeluaran</label>
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
                  updateExp({ ...exp, exp_type: e.value.kode });
                }}
                optionLabel="typePengeluaran"
              />
            </div>
          </div>

          {/* Type Pembayaran */}
          {exp !== null && exp.exp_type === 1 ? (
            <>
              <div className="col-8">
                <label className="text-label">Kode Pemasok</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={exp.acq_sup && checkAP(exp.acq_sup)}
                  option={apcard}
                  onChange={(e) => {
                    updateExp({
                      ...exp,
                      acq_sup: e.supplier?.id,
                      acq: e.ord_id?.id,
                    });
                  }}
                  label={"[sup_id.sup_name] ([sup_id.sup_code])"}
                  placeholder="Pilih Pemasok"
                  detail
                />
              </div>

              <div className="col-4 mb-2">
                <label className="text-label">Jenis Pengeluaran</label>
                <div className="p-inputgroup">
                  <SelectButton
                    value={
                      exp !== null && exp.acq_pay !== ""
                        ? exp.acq_pay === 1
                          ? { kode: 1, jenisPengeluaran: "Kas" }
                          : { kode: 2, jenisPengeluaran: "Bank" }
                        : //  : { kode: 3, jenisPengeluaran: "Giro" }
                          null
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
                      }}
                      label={"[account.acc_name] ([account.acc_code])"}
                      placeholder="Pilih Kode Akun"
                      detail
                      onDetail={() => setShowAccKas(true)}
                    />
                  </div>
                </>
              ) : // pembayaran bank
              exp !== null && exp.acq_pay === 2 ? (
                <>
                  <div className="col-4">
                    <label className="text-label">Kode Bank</label>
                    <div className="p-inputgroup"></div>
                    <CustomDropdown
                      value={exp.bank_acc && checkBank(exp.bank_acc)}
                      option={bank}
                      onChange={(e) => {
                        updateExp({ ...exp, bank_acc: e.bank.id });
                      }}
                      label={"[bank.BANK_NAME] ([bank.BANK_CODE])"}
                      placeholder="Pilih Kode Bank"
                      detail
                      onDetail={() => setShowBank(true)}
                    />
                  </div>

                  <div className="col-4">
                    <label className="text-label">Kode Referensi Bank</label>
                    <div className="p-inputgroup">
                      <InputText
                        value={exp.bank_ref}
                        onChange={(e) =>
                          updateExp({ ...exp, bank_ref: e.target.value })
                        }
                        placeholder="Masukan Kode Bank"
                      />
                    </div>
                  </div>
                </>
              ) : (
                // pembayran giro
                <>
                  <div className="col-4">
                    <label className="text-label">Nomor Giro</label>
                    <div className="p-inputgroup">
                      <InputText
                        value={exp.giro_num}
                        onChange={(e) =>
                          updateExp({ ...exp, giro_num: e.target.value })
                        }
                        placeholder="Nomor Giro"
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <label className="text-label">Tanggal Cair</label>
                    <div className="p-inputgroup">
                      <Calendar
                        value={new Date(`${exp.giro_date}Z`)}
                        onChange={(e) => {
                          updateExp({ ...exp, giro_date: e.value });
                        }}
                        placeholder="Pilih Tanggal"
                        showIcon
                        dateFormat="dd/mm/yy"
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <label className="text-label">Kode Bank</label>
                    <div className="p-inputgroup"></div>
                    <CustomDropdown
                      value={exp.bank_id && checkBank(exp.bank_id)}
                      option={bank}
                      onChange={(e) => {
                        updateExp({ ...exp, bank_id: e.bank.id });
                      }}
                      label={"[bank.BANK_NAME] ([bank.BANK_CODE])"}
                      placeholder="Pilih Kode Bank"
                      onDetail={() => setShowBankG(true)}
                      detail
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
                            value: v?.value ?? 0,
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
                                value={e.ord_id && checkAP(e.ord_id)?.fk_code}
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
                                    `${
                                      e.ord_due &&
                                      e.ord_due
                                    }Z`
                                  )
                                }
                                onChange={(e) => {}}
                                placeholder="Tanggal Jatuh Tempo"
                                dateFormat="dd/mm/yy"
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
                                  e.trx_type && e.trx_type
                                }
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
                                value={e.trx_amnh && e.trx_amnh}
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
                          style={{
                            maxWidth: "10rem",
                          }}
                          field={""}
                          body={(e) => (
                            <div className="p-inputgroup">
                              <InputText
                                value={e.payment && e.payment}
                                onChange={(u) => {
                                  let temp = [...exp.acq];
                                  temp[e.index].payment = u.target.value;
                                  updateExp({ ...exp, acq: temp });
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
                  }}
                  label={"[account.acc_name] ([account.acc_code])"}
                  placeholder="Pilih Kode Akun"
                  detail
                  onDetail={() => setShowAcc(true)}
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
                  }}
                  label={"[ccost_name] ([ccost_code])"}
                  placeholder="Pilih Departemen"
                  detail
                  onDetail={() => setShowDept(true)}
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
                  }}
                  label={"[proj_name] ([proj_code])"}
                  placeholder="Pilih Project"
                  detail
                  onDetail={() => setShowProj(true)}
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
                        // style={{
                        //   maxWidth: "15rem",
                        // }}
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
                            }}
                            label={"[account.acc_name] ([account.acc_code])"}
                            placeholder="Pilih Kode Akun"
                            detail
                          />
                        )}
                      />

                      <Column
                        header="D/K"
                        style={{
                          width: "6rem",
                        }}
                        field={""}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <InputText
                              value={
                                e.acc_code &&
                                checkAcc(e.acc_code).account.sld_type
                              }
                              onChange={(e) => {}}
                              placeholder="Saldo"
                              disabled
                            />
                          </div>
                        )}
                      />

                      <Column
                        header="Nilai"
                        field={""}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <InputText
                              value={e.value && e.value}
                              onChange={(u) => {
                                let temp = [...exp.exp];
                                temp[e.index].value = u.target.value;
                                updateExp({ ...exp, exp: temp });
                              }}
                              placeholder="Nilai"
                              type="number"
                              min={0}
                            />
                          </div>
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
                                let temp = [...exp.exp];
                                temp[e.index].desc = u.target.value;
                                updateExp({ ...exp, exp: temp });
                              }}
                              placeholder="Masukan Keterangan"
                            />
                          </div>
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
      {header()}
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
            updateExp({ ...exp, req_dep: e.data.id });
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
            updateExp({ ...exp, bank_acc: e.data.bank.id });
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
            updateExp({ ...exp, bank_id: e.data.bank.id });
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
