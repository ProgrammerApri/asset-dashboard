import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import CustomAccordion from "../../../Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_OUT, SET_CURRENT_PO } from "src/redux/actions";
import DataPusatBiaya from "../../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import DataSupplier from "../../../Mitra/Pemasok/DataPemasok";
import DataRulesPay from "src/jsx/components/MasterLainnya/RulesPay/DataRulesPay";
import DataPajak from "src/jsx/components/Master/Pajak/DataPajak";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SelectButton } from "primereact/selectbutton";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import { InputTextarea } from "primereact/inputtextarea";
import DataProject from "src/jsx/components/MasterLainnya/Project/DataProject";

const KasBankOutInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const out = useSelector((state) => state.out.current);
  const isEdit = useSelector((state) => state.out.editOut);
  const dispatch = useDispatch();
  const [account, setAccount] = useState(null);
  const [accKas, setAccKas] = useState(null);
  const [accBank, setAccBank] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [faktur, setFaktur] = useState(null);
  const [rp, setRequest] = useState(null);
  const [dept, setDept] = useState(null);
  const [proj, setProj] = useState(null);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showDepartemen, setShowDept] = useState(false);
  const [showProj, setShowProj] = useState(false);
  const [showPpn, setShowPpn] = useState(false);
  const [product, setProduct] = useState(null);
  const [jasa, setJasa] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [accor, setAccor] = useState({
    bayar: true,
    keluar: false,
  });

  const [type, setType] = useState({ kode: 1, typePengeluaran: "Pelunasan" });
  const [typeB, setTypeB] = useState({ kode: 1, jenisPengeluaran: "Kas" });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getAccKas();
    getAccBank();
    getSupplier();
    getFaktur();
    getDept();
    getProj();
    getAccount();
    getRp();
  }, []);

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
        setFaktur(data);
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
        //   if (elem.account.kat_code === 1 && elem.account.kat_code === 2) {
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
          if (elem.account.kat_code === 1) {
            filt.push(elem);
          }
        });
        console.log(data);
        setAccKas(filt);
      }
    } catch (error) {}
  };

  const getAccBank = async () => {
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
          if (elem.account.kat_code === 2) {
            filt.push(elem);
          }
        });
        setAccBank(filt);
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
          if (elem.status === 0) {
            filt.push(elem);
            elem.rprod.forEach((el) => {
              el.order = el.order ?? 0;
              if (el.order === 0 || el.request - el.order !== 0) {
                el.prod_id = el.prod_id.id;
                el.unit_id = el.unit_id.id;
              }
            });
            elem.rjasa.forEach((element) => {
              element.jasa_id = element.jasa_id.id;
              element.unit_id = element.unit_id.id;
            });
            elem.rjasa.push({
              id: 0,
              preq_id: elem.id,
              sup_id: null,
              jasa_id: null,
              unit_id: null,
              qty: null,
              price: null,
              disc: null,
              total: null,
            });
          }
        });
        console.log(data);
        setRequest(filt);
      }
    } catch (error) {}
  };

  const editPO = async () => {
    const config = {
      ...endpoints.editPO,
      endpoint: endpoints.editPO.endpoint + out.id,
      data: out,
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

  const addPO = async () => {
    const config = {
      ...endpoints.addPO,
      data: out,
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
            detail: `Kode ${out.po_code} Sudah Digunakan`,
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

  const req_pur = (value) => {
    let selected = {};
    rp?.forEach((element) => {
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

  const checkAccBank = (value) => {
    let selected = {};
    accBank?.forEach((element) => {
      if (value === element.account.id) {
        selected = element;
      }
    });

    return selected;
  };

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editPO();
    } else {
      setUpdate(true);
      addPO();
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

  const updateOut = (e) => {
    dispatch({
      type: SET_CURRENT_OUT,
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
                value={new Date(`${out.po_date}Z`)}
                onChange={(e) => {
                  updateOut({ ...out, po_date: e.value });
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
                value={out.po_code}
                onChange={(e) => updateOut({ ...out, po_code: e.target.value })}
                placeholder="Masukan Kode Referensi"
              />
            </div>
          </div>

          <div className="col-4 mb-2">
            <label className="text-label">Jenis Pengeluaran</label>
            <div className="p-inputgroup">
              <SelectButton
                value={type}
                options={[
                  { kode: 1, typePengeluaran: "Pelunasan" },
                  { kode: 2, typePengeluaran: "Pengeluaran Kas / Bank" },
                ]}
                onChange={(e) => {
                  console.log(e.value);
                  setType(e.value);
                }}
                optionLabel="typePengeluaran"
              />
            </div>
          </div>

          {/* Type Pembayaran */}
          {type.kode === 1 ? (
            <>
              <div className="col-8">
                <label className="text-label">Kode Pemasok</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={out.preq_id && req_pur(out.preq_id)}
                  option={faktur}
                  onChange={(e) => {
                    console.log(e.value.rprod);
                    let result = null;
                    updateOut({
                      ...out,
                      preq_id: e.value.id,
                      due_date: result,
                      sup_id: e.value?.ref_sup?.id ?? null,
                      rprod: e.value.rprod,
                      rjasa: e.value.rjasa,
                    });
                  }}
                  label={"[ord_id.sup_id.sup_name] ([ord_id.sup_id.sup_code])"}
                  placeholder="Pilih Kode Pemasok"
                  detail
                />
              </div>

              {/* Jenis pengeluaran 
                    Kas --> harus ambil akun yang type kas 
                    Bank --> ambil dari master bank 
                    Giro --> entry kode bank dan nomer Giro */}

              <div className="col-4 mb-2">
                <label className="text-label">Jenis Pengeluaran</label>
                <div className="p-inputgroup">
                  <SelectButton
                    value={typeB}
                    options={[
                      { kode: 1, jenisPengeluaran: "Kas" },
                      { kode: 2, jenisPengeluaran: "Bank" },
                      { kode: 3, jenisPengeluaran: "Giro" },
                    ]}
                    onChange={(e) => {
                      console.log(e.value);
                      setTypeB(e.value);
                    }}
                    optionLabel="jenisPengeluaran"
                  />
                </div>
              </div>

              {/* kode pembayaran cash  */}
              {typeB.kode === 1 ? (
                <>
                  <div className="col-4">
                    <label className="text-label">Kode Akun</label>
                    <div className="p-inputgroup"></div>
                    <CustomDropdown
                      value={out.preq_id && req_pur(out.preq_id)}
                      option={accKas}
                      onChange={(e) => {}}
                      label={"[account.acc_name] ([account.acc_code])"}
                      placeholder="Pilih Kode Akun"
                      detail
                    />
                  </div>
                </>
              ) : // pembayaran bank
              typeB.kode === 2 ? (
                <>
                  <div className="col-4">
                    <label className="text-label">Kode Bank</label>
                    <div className="p-inputgroup"></div>
                    <CustomDropdown
                      // value={out.preq_id && req_pur(out.preq_id)}
                      option={accBank}
                      onChange={(e) => {}}
                      label={"[account.acc_name] ([account.acc_code])"}
                      placeholder="Pilih Kode Bank"
                      detail
                    />
                  </div>

                  <div className="col-4">
                    <label className="text-label">Kode Referensi Bank</label>
                    <div className="p-inputgroup">
                      <InputText
                        value={out.po_code}
                        onChange={(e) =>
                          updateOut({ ...out, po_code: e.target.value })
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
                        value={out.po_code}
                        onChange={(e) =>
                          updateOut({ ...out, po_code: e.target.value })
                        }
                        placeholder="Nomor Giro"
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <label className="text-label">Tanggal Cair</label>
                    <div className="p-inputgroup">
                      <Calendar
                        value={new Date(`${out.po_date}Z`)}
                        onChange={(e) => {
                          updateOut({ ...out, po_date: e.value });
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
                      // value={out.preq_id && req_pur(out.preq_id)}
                      option={accBank}
                      onChange={(e) => {}}
                      label={"[account.acc_name] ([account.acc_code])"}
                      placeholder="Pilih Kode Bank"
                      detail
                    />
                  </div>
                </>
              )}

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
                      value={null}
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
                          <CustomDropdown
                            // value={
                            //   out.rprod[e.index].prod_id &&
                            //   checkProd(out.rprod[e.index].prod_id)
                            // }
                            option={product}
                            onChange={(e) => {
                              console.log(e.value);
                            }}
                            placeholder="Pilih Kode Produk"
                            label={"[name]"}
                            detail
                          />
                        )}
                      />

                      <Column
                        header="Tanggal J/T tempo"
                        field={""}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <Calendar
                              value={new Date(`${out.po_date}Z`)}
                              onChange={(e) => {
                                updateOut({ ...out, po_date: e.value });
                              }}
                              placeholder="Pilih Tanggal"
                              showIcon
                              dateFormat="dd/mm/yy"
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
                                out.rprod[e.index].order
                                  ? out.rprod[e.index].order
                                  : null
                              }
                              onChange={(a) => {
                                let temp = [...out.rprod];
                                let result =
                                  temp[e.index]?.request - a.target.value;
                                temp[e.index].remain = result;
                                temp[e.index].order = a.target.value;
                                updateOut({ ...out, rprod: temp });
                              }}
                              placeholder="D"
                              // type="number"
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
                              value={
                                out.rprod[e.index].price
                                  ? out.rprod[e.index].price
                                  : null
                              }
                              onChange={(e) => {
                                let temp = [...out.rprod];
                                temp[e.index].price = e.target.value;
                                updateOut({ ...out, rprod: temp });
                                console.log(temp);
                              }}
                              placeholder="0"
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
                              value={
                                out.rprod[e.index].disc
                                  ? out.rprod[e.index].disc
                                  : null
                              }
                              onChange={(e) => {
                                let temp = [...out.rprod];
                                temp[e.index].disc = e.target.value;
                                updateOut({ ...out, rprod: temp });
                                console.log(temp);
                              }}
                              placeholder="0"
                              type="number"
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
                                let temp = [...out.rprod];
                                temp.splice(e.index, 1);
                                updateOut({
                                  ...out,
                                  rprod: temp,
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
            </>
          ) : (
            // Type Pengeluaran
            <>
              {" "}
              <div className="col-4">
                <label className="text-label">Kode Akun</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  // value={out.preq_id && req_pur(out.preq_id)}
                  option={account}
                  onChange={(e) => {
                    // console.log(e.value.rprod);
                    // let result = null;
                    // updateOut({
                    //   ...out,
                    //   preq_id: e.value.id,
                    //   due_date: result,
                    //   sup_id: e.value?.ref_sup?.id ?? null,
                    //   rprod: e.value.rprod,
                    //   rjasa: e.value.rjasa,
                    // });
                  }}
                  label={"[account.acc_name] ([account.acc_code])"}
                  placeholder="Pilih Kode Akun"
                  detail
                />
              </div>

              <div className="col-4">
                <label className="text-label">Kode Departemen</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={out.preq_id && req_pur(out.preq_id)}
                  option={dept}
                  onChange={(e) => {}}
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
                  value={out.preq_id && req_pur(out.preq_id)}
                  option={proj}
                  onChange={(e) => {}}
                  label={"[proj_name] ([proj_code])"}
                  placeholder="Pilih Kode Akun"
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
                      value={null}
                      className="display w-150 datatable-wrapper header-white no-border"
                      showGridlines={false}
                      emptyMessage={() => <div></div>}
                    >
                      <Column
                        header="Kode Akun"
                        style={{
                          maxWidth: "15rem",
                        }}
                        field={""}
                        body={(e) => (
                          <CustomDropdown
                            value={out.preq_id && req_pur(out.preq_id)}
                            option={rp}
                            onChange={(e) => {
                              console.log(e.value.rprod);
                              let result = null;
                              updateOut({
                                ...out,
                                preq_id: e.value.id,
                                due_date: result,
                                sup_id: e.value?.ref_sup?.id ?? null,
                                rprod: e.value.rprod,
                                rjasa: e.value.rjasa,
                              });
                            }}
                            label={"[req_code]"}
                            placeholder="Pilih Kode Akun"
                            detail
                          />
                        )}
                      />

                      <Column
                        header="D/K"
                        style={{
                          maxWidth: "15rem",
                        }}
                        field={""}
                        body={(e) => (
                          <CustomDropdown
                            value={out.preq_id && req_pur(out.preq_id)}
                            option={rp}
                            onChange={(e) => {
                              console.log(e.value.rprod);
                              let result = null;
                              updateOut({
                                ...out,
                                preq_id: e.value.id,
                                due_date: result,
                                sup_id: e.value?.ref_sup?.id ?? null,
                                rprod: e.value.rprod,
                                rjasa: e.value.rjasa,
                              });
                            }}
                            label={"[req_code]"}
                            placeholder="Pilih Kode Akun"
                            detail
                          />
                        )}
                      />

                      <Column
                        header="Nilai"
                        field={""}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <InputText
                              value={
                                out.rprod[e.index].price
                                  ? out.rprod[e.index].price
                                  : null
                              }
                              onChange={(e) => {
                                let temp = [...out.rprod];
                                temp[e.index].price = e.target.value;
                                updateOut({ ...out, rprod: temp });
                                console.log(temp);
                              }}
                              placeholder="0"
                            />
                          </div>
                        )}
                      />

                      <Column
                        header="Keterangan"
                        style={{
                          maxWidth: "10rem",
                        }}
                        field={""}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <InputTextarea
                              value={
                                out.rprod[e.index].price
                                  ? out.rprod[e.index].price
                                  : null
                              }
                              onChange={(e) => {
                                let temp = [...out.rprod];
                                temp[e.index].price = e.target.value;
                                updateOut({ ...out, rprod: temp });
                                console.log(temp);
                              }}
                              placeholder="0"
                            />
                          </div>
                        )}
                      />

                      <Column
                        body={(e) =>
                          e.index === out.rprod.length - 1 ? (
                            <Link
                              onClick={() => {
                                updateOut({
                                  ...out,
                                  rprod: [
                                    ...out.rprod,
                                    {
                                      id: 0,
                                      prod_id: null,
                                      unit_id: null,
                                      request: null,
                                      ket: null,
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
                                let temp = [...out.rprod];
                                temp.splice(e.index, 1);
                                updateOut({
                                  ...out,
                                  rprod: temp,
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
            updateOut({ ...out, req_dep: e.data.id });
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
            updateOut({ ...out, req_dep: e.data.id });
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
            updateOut({ ...out, req_dep: e.data.id });
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
