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
import { SET_CURRENT_PO } from "src/redux/actions";
import DataPusatBiaya from "../../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import DataSupplier from "../../../Mitra/Pemasok/DataPemasok";
import DataRulesPay from "src/jsx/components/MasterLainnya/RulesPay/DataRulesPay";
import DataPajak from "src/jsx/components/Master/Pajak/DataPajak";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SelectButton } from "primereact/selectbutton";

const KasBankOutInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const po = useSelector((state) => state.po.current);
  const isEdit = useSelector((state) => state.po.editpo);
  const dispatch = useDispatch();
  const [isRp, setRp] = useState(true);
  const [pusatBiaya, setPusatBiaya] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [rulesPay, setRulesPay] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [rp, setRequest] = useState(null);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showDepartemen, setShowDept] = useState(false);
  const [showRulesPay, setShowRulesPay] = useState(false);
  const [showPpn, setShowPpn] = useState(false);
  const [product, setProduct] = useState(null);
  const [jasa, setJasa] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [accor, setAccor] = useState({
    produk: true,
    jasa: false,
  });

  const [type, setType] = useState({ kode: 1, typePengeluaran: "Pelunasan" });
  const [typeB, setTypeB] = useState({ kode: 1, jenisPengeluaran: "Kas" });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getPusatBiaya();
    getSupplier();
    getRulesPay();
    getPpn();
    getRp();
    getProduct();
    getJasa();
    getSatuan();
  }, []);

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
      console.log(error);
      if (error.status === 400) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: `Kode ${po.po_code} Sudah Digunakan`,
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

  const dept = (value) => {
    let selected = {};
    pusatBiaya?.forEach((element) => {
      if (value === element.id) {
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
        console.log("SELEC");
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

  const reqTemp = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.req_code} (${option.req_dep.ccost_name})`
          : ""}
      </div>
    );
  };

  const valueReqTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.req_code} (${option.req_dep.ccost_name})`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const deptTemp = (option) => {
    return (
      <div>
        {option !== null ? `${option.ccost_code} (${option.ccost_name})` : ""}
      </div>
    );
  };

  const valueDeptTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.ccost_code} (${option.ccost_name})` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const suppTemp = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.supplier.sup_code} (${option.supplier.sup_name})`
          : ""}
      </div>
    );
  };

  const valueSupTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.supplier.sup_code} (${option.supplier.sup_name})`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const rulTemp = (option) => {
    return (
      <div>{option !== null ? `${option.name} (${option.day} Hari)` : ""}</div>
    );
  };

  const valueRulTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.name} (${option.day} Hari)` : ""}
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

  const valueProd = (option, props) => {
    if (option) {
      return (
        <div>{option !== null ? `${option.name} (${option.code})` : ""}</div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const jasTemp = (option) => {
    return (
      <div>
        {option !== null ? `${option.jasa.name} (${option.jasa.code})` : ""}
      </div>
    );
  };

  const valueJasTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.jasa.name} (${option.jasa.code})` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const updatePo = (e) => {
    dispatch({
      type: SET_CURRENT_PO,
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
                value={new Date(`${po.po_date}Z`)}
                onChange={(e) => {
                  updatePo({ ...po, po_date: e.value });
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
                value={po.po_code}
                onChange={(e) => updatePo({ ...po, po_code: e.target.value })}
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

          {type.kode === 1 ? (
            <>
              <div className="col-4">
                <label className="text-label">Kode Pemasok</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={po.preq_id && req_pur(po.preq_id)}
                    options={rp}
                    onChange={(e) => {
                      console.log(e.value.rprod);
                      let result = null;
                      if (po.top) {
                        result = new Date(`${req_pur(e.value.id).req_date}Z`);
                        result.setDate(result.getDate() + rulPay(po?.top)?.day);
                        console.log(result);
                      }
                      updatePo({
                        ...po,
                        preq_id: e.value.id,
                        due_date: result,
                        sup_id: e.value?.ref_sup?.id ?? null,
                        rprod: e.value.rprod,
                        rjasa: e.value.rjasa,
                      });
                    }}
                    optionLabel="req_code"
                    placeholder="Pilih Kode Pemasok"
                    itemTemplate={reqTemp}
                    valueTemplate={valueReqTemp}
                  />
                </div>
              </div>

              {/* Jenis pengeluaran 
                    Kas --> harus ambil akun yang type kas 
                    Bank --> ambil dari master bank 
                    Giro --> entry kode bank dan nomer Giro */}

              <div className="col-8 mb-2">
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
                    <div className="p-inputgroup">
                      <Dropdown
                        value={po.preq_id && req_pur(po.preq_id)}
                        options={rp}
                        onChange={(e) => {
                          console.log(e.value.rprod);
                          let result = null;
                          if (po.top) {
                            result = new Date(
                              `${req_pur(e.value.id).req_date}Z`
                            );
                            result.setDate(
                              result.getDate() + rulPay(po?.top)?.day
                            );
                            console.log(result);
                          }
                          updatePo({
                            ...po,
                            preq_id: e.value.id,
                            due_date: result,
                            sup_id: e.value?.ref_sup?.id ?? null,
                            rprod: e.value.rprod,
                            rjasa: e.value.rjasa,
                          });
                        }}
                        optionLabel="req_code"
                        placeholder="Pilih Kode Akun"
                        itemTemplate={reqTemp}
                        valueTemplate={valueReqTemp}
                      />
                    </div>
                  </div>
                </>
              ) : // pembayaran bank
              typeB.kode === 2 ? (
                <>
                  <div className="col-4">
                    <label className="text-label">Kode Bank</label>
                    <div className="p-inputgroup">
                      <Dropdown
                        value={po.preq_id && req_pur(po.preq_id)}
                        options={rp}
                        onChange={(e) => {
                          console.log(e.value.rprod);
                          let result = null;
                          if (po.top) {
                            result = new Date(
                              `${req_pur(e.value.id).req_date}Z`
                            );
                            result.setDate(
                              result.getDate() + rulPay(po?.top)?.day
                            );
                            console.log(result);
                          }
                          updatePo({
                            ...po,
                            preq_id: e.value.id,
                            due_date: result,
                            sup_id: e.value?.ref_sup?.id ?? null,
                            rprod: e.value.rprod,
                            rjasa: e.value.rjasa,
                          });
                        }}
                        optionLabel="req_code"
                        placeholder="Pilih Kode Bank"
                        itemTemplate={reqTemp}
                        valueTemplate={valueReqTemp}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <label className="text-label">Kode Referensi Bank</label>
                    <div className="p-inputgroup">
                      <InputText
                        value={po.po_code}
                        onChange={(e) =>
                          updatePo({ ...po, po_code: e.target.value })
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
                    <label className="text-label">Nomer Giro</label>
                    <div className="p-inputgroup">
                      <InputText
                        value={po.po_code}
                        onChange={(e) =>
                          updatePo({ ...po, po_code: e.target.value })
                        }
                        placeholder="Nomer Giro"
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <label className="text-label">Kode Bank</label>
                    <div className="p-inputgroup">
                      <Dropdown
                        value={po.preq_id && req_pur(po.preq_id)}
                        options={rp}
                        onChange={(e) => {
                          console.log(e.value.rprod);
                          let result = null;
                          if (po.top) {
                            result = new Date(
                              `${req_pur(e.value.id).req_date}Z`
                            );
                            result.setDate(
                              result.getDate() + rulPay(po?.top)?.day
                            );
                            console.log(result);
                          }
                          updatePo({
                            ...po,
                            preq_id: e.value.id,
                            due_date: result,
                            sup_id: e.value?.ref_sup?.id ?? null,
                            rprod: e.value.rprod,
                            rjasa: e.value.rjasa,
                          });
                        }}
                        optionLabel="req_code"
                        placeholder="Pilih Kode Bank"
                        itemTemplate={reqTemp}
                        valueTemplate={valueReqTemp}
                      />
                    </div>
                  </div>
                </>
              )}

              <CustomAccordion
                tittle={"Data Pembayaran"}
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
                          <div className="p-inputgroup">
                            <Dropdown
                              value={
                                po.rprod[e.index].prod_id &&
                                checkProd(po.rprod[e.index].prod_id)
                              }
                              options={product}
                              onChange={(e) => {
                                console.log(e.value);
                              }}
                              placeholder="Pilih Kode Produk"
                              optionLabel="name"
                              filter
                              filterBy="name"
                              valueTemplate={valueProd}
                              itemTemplate={prodTemp}
                            />
                          </div>
                        )}
                      />

                      <Column
                        header="Tanggal J/T tempo"
                        style={{
                          maxWidth: "15rem",
                        }}
                        field={""}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <Dropdown
                              value={
                                po.rprod[e.index].unit_id &&
                                checkUnit(po.rprod[e.index].unit_id)
                              }
                              onChange={(e) => {
                                let temp = [...po.rprod];
                                temp[e.index].unit_id = e.value.id;
                                updatePo({ ...po, rprod: temp });
                              }}
                              options={satuan}
                              optionLabel="name"
                              placeholder="Pilih Satuan"
                              filter
                              filterBy="name"
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
                                po.rprod[e.index].order
                                  ? po.rprod[e.index].order
                                  : null
                              }
                              onChange={(a) => {
                                let temp = [...po.rprod];
                                let result =
                                  temp[e.index]?.request - a.target.value;
                                temp[e.index].remain = result;
                                temp[e.index].order = a.target.value;
                                updatePo({ ...po, rprod: temp });
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
                                po.rprod[e.index].price
                                  ? po.rprod[e.index].price
                                  : null
                              }
                              onChange={(e) => {
                                let temp = [...po.rprod];
                                temp[e.index].price = e.target.value;
                                updatePo({ ...po, rprod: temp });
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
                                po.rprod[e.index].disc
                                  ? po.rprod[e.index].disc
                                  : null
                              }
                              onChange={(e) => {
                                let temp = [...po.rprod];
                                temp[e.index].disc = e.target.value;
                                updatePo({ ...po, rprod: temp });
                                console.log(temp);
                              }}
                              placeholder="0"
                              type="number"
                            />
                          </div>
                        )}
                      />

                      <Column
                        body={(e) =>
                          e.index === po.rprod.length - 1 ? (
                            <Link
                              onClick={() => {
                                updatePo({
                                  ...po,
                                  rprod: [
                                    ...po.rprod,
                                    {
                                      id: 0,
                                      prod_id: null,
                                      unit_id: null,
                                      request: null,
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
                                let temp = [...po.rprod];
                                temp.splice(e.index, 1);
                                updatePo({
                                  ...po,
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
          ) : (
            <>
              {" "}
              <div className="col-4">
                <label className="text-label">Kode Akun</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={po.preq_id && req_pur(po.preq_id)}
                    options={rp}
                    onChange={(e) => {
                      console.log(e.value.rprod);
                      let result = null;
                      if (po.top) {
                        result = new Date(`${req_pur(e.value.id).req_date}Z`);
                        result.setDate(result.getDate() + rulPay(po?.top)?.day);
                        console.log(result);
                      }
                      updatePo({
                        ...po,
                        preq_id: e.value.id,
                        due_date: result,
                        sup_id: e.value?.ref_sup?.id ?? null,
                        rprod: e.value.rprod,
                        rjasa: e.value.rjasa,
                      });
                    }}
                    optionLabel="req_code"
                    placeholder="Pilih Kode Akun"
                    itemTemplate={reqTemp}
                    valueTemplate={valueReqTemp}
                  />
                </div>
              </div>
              <div className="col-4">
                <label className="text-label">Kode Departemen</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={po.preq_id && req_pur(po.preq_id)}
                    options={rp}
                    onChange={(e) => {
                      console.log(e.value.rprod);
                      let result = null;
                      if (po.top) {
                        result = new Date(`${req_pur(e.value.id).req_date}Z`);
                        result.setDate(result.getDate() + rulPay(po?.top)?.day);
                        console.log(result);
                      }
                      updatePo({
                        ...po,
                        preq_id: e.value.id,
                        due_date: result,
                        sup_id: e.value?.ref_sup?.id ?? null,
                        rprod: e.value.rprod,
                        rjasa: e.value.rjasa,
                      });
                    }}
                    optionLabel="req_code"
                    placeholder="Pilih Kode Departemen"
                    itemTemplate={reqTemp}
                    valueTemplate={valueReqTemp}
                  />
                </div>
              </div>
              <div className="col-4">
                <label className="text-label">Kode Project</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={po.preq_id && req_pur(po.preq_id)}
                    options={rp}
                    onChange={(e) => {
                      console.log(e.value.rprod);
                      let result = null;
                      if (po.top) {
                        result = new Date(`${req_pur(e.value.id).req_date}Z`);
                        result.setDate(result.getDate() + rulPay(po?.top)?.day);
                        console.log(result);
                      }
                      updatePo({
                        ...po,
                        preq_id: e.value.id,
                        due_date: result,
                        sup_id: e.value?.ref_sup?.id ?? null,
                        rprod: e.value.rprod,
                        rjasa: e.value.rjasa,
                      });
                    }}
                    optionLabel="req_code"
                    placeholder="Pilih Kode Project"
                    itemTemplate={reqTemp}
                    valueTemplate={valueReqTemp}
                  />
                </div>
              </div>
            </>
          )}

<CustomAccordion
                tittle={"Pengeluaran Kas / Bank"}
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
                          <div className="p-inputgroup">
                            <Dropdown
                              value={
                                po.rprod[e.index].prod_id &&
                                checkProd(po.rprod[e.index].prod_id)
                              }
                              options={product}
                              onChange={(e) => {
                                console.log(e.value);
                              }}
                              placeholder="Pilih Kode Produk"
                              optionLabel="name"
                              filter
                              filterBy="name"
                              valueTemplate={valueProd}
                              itemTemplate={prodTemp}
                            />
                          </div>
                        )}
                      />

                      <Column
                        header="D/K"
                        style={{
                          maxWidth: "15rem",
                        }}
                        field={""}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <Dropdown
                              value={
                                po.rprod[e.index].unit_id &&
                                checkUnit(po.rprod[e.index].unit_id)
                              }
                              onChange={(e) => {
                                let temp = [...po.rprod];
                                temp[e.index].unit_id = e.value.id;
                                updatePo({ ...po, rprod: temp });
                              }}
                              options={satuan}
                              optionLabel="name"
                              placeholder="Pilih Satuan"
                              filter
                              filterBy="name"
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
                                po.rprod[e.index].price
                                  ? po.rprod[e.index].price
                                  : null
                              }
                              onChange={(e) => {
                                let temp = [...po.rprod];
                                temp[e.index].price = e.target.value;
                                updatePo({ ...po, rprod: temp });
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
                            <InputText
                              value={
                                po.rprod[e.index].disc
                                  ? po.rprod[e.index].disc
                                  : null
                              }
                              onChange={(e) => {
                                let temp = [...po.rprod];
                                temp[e.index].disc = e.target.value;
                                updatePo({ ...po, rprod: temp });
                                console.log(temp);
                              }}
                              placeholder="0"
                              type="number"
                            />
                          </div>
                        )}
                      />

                      <Column
                        body={(e) =>
                          e.index === po.rprod.length - 1 ? (
                            <Link
                              onClick={() => {
                                updatePo({
                                  ...po,
                                  rprod: [
                                    ...po.rprod,
                                    {
                                      id: 0,
                                      prod_id: null,
                                      unit_id: null,
                                      request: null,
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
                                let temp = [...po.rprod];
                                temp.splice(e.index, 1);
                                updatePo({
                                  ...po,
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

      <DataPusatBiaya
        data={pusatBiaya}
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
          getPusatBiaya();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowDept(false);
            updatePo({ ...rp, req_dep: e.data.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

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
            updatePo({ ...rp, req_dep: e.data.id });
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
            updatePo({ ...rp, req_dep: e.data.id });
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
            updatePo({ ...rp, req_dep: e.data.id });
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