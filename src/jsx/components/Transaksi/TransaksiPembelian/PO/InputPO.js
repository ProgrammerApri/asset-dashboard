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
import { tr } from "date-fns/locale";

const InputPO = ({ onCancel, onSuccess }) => {
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

  const type = [
    { name: "%", code: "P" },
    { name: "Rp", code: "R" },
  ];

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
            // elem.rjasa.push({
            //   id: 0,
            //   preq_id: elem.id,
            //   sup_id: null,
            //   jasa_id: null,
            //   unit_id: null,
            //   qty: null,
            //   price: null,
            //   disc: null,
            //   total: null,
            // });
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
        <b>Buat Permintaan PO</b>
      </h4>
    );
  };

  const getSubTotal = () => {
    let total = 0;
    po?.rprod?.forEach((el) => {
      if (el.nett_price && el.nett_price > 0) {
        total += parseInt(el.nett_price);
      } else {
        total += el.total - (el.total * el.disc) / 100;
      }
    });

    po?.rjasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return `${total}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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

          <div className="col-4">
            <label className="text-label">No. Permintaan Pembelian</label>
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
                placeholder="Pilih Kode Permintaan"
                itemTemplate={reqTemp}
                valueTemplate={valueReqTemp}
                filter
                filterBy="req_code"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Supplier</label>
            <div className="p-inputgroup">
              <Dropdown
                value={po.sup_id !== null ? supp(po.sup_id) : null}
                options={supplier}
                onChange={(e) => {
                  updatePo({ ...po, sup_id: e.value.supplier.id });
                }}
                optionLabel="supplier.sup_name"
                placeholder="Pilih Supplier"
                itemTemplate={suppTemp}
                valueTemplate={valueSupTemp}
              />
              <PButton
                onClick={() => {
                  setShowSupplier(true);
                }}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-4">
            <label className="text-label"></label>
            <div className="p-inputgroup mt-2">
              <InputText
                value={
                  po.sup_id !== null
                    ? supp(po.sup_id)?.supplier?.sup_address
                    : ""
                }
                placeholder="Alamat Supplier"
                disabled
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label"></label>
            <div className="p-inputgroup mt-2">
              <InputText
                value={
                  po.sup_id !== null ? supp(po.sup_id)?.supplier?.sup_telp1 : ""
                }
                placeholder="Kontak Person"
                disabled
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Ppn</label>
            <div className="p-inputgroup mt-2">
              <Dropdown
                value={
                  po.sup_id !== null ? pjk(supp(po.sup_id)?.supplier?.id) : null
                }
                options={ppn}
                optionLabel="name"
                placeholder="Pilih Jenis Pajak"
                disabled
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Departemen</label>
            <div className="p-inputgroup mt-2">
              <Dropdown
                value={
                  po.preq_id !== null
                    ? dept(req_pur(po.preq_id)?.req_dep?.id)
                    : null
                }
                options={pusatBiaya}
                optionLabel="ccost_name"
                placeholder="Pilih Departemen"
                itemTemplate={deptTemp}
                valueTemplate={valueDeptTemp}
                disabled
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Syarat Pembayaran</label>
            <div className="p-inputgroup mt-2">
              <Dropdown
                value={po.top !== null ? rulPay(po.top) : null}
                options={rulesPay}
                onChange={(e) => {
                  let result = new Date(`${req_pur(po.preq_id).req_date}Z`);
                  result.setDate(result.getDate() + e.value.day);
                  console.log(result);

                  updatePo({ ...po, top: e.value.id, due_date: result });
                }}
                optionLabel="name"
                placeholder="Pilih Syarat Pembayaran"
                itemTemplate={rulTemp}
                valueTemplate={valueRulTemp}
              />
              <PButton
                onClick={() => {
                  setShowRulesPay(true);
                }}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Tanggal Permintaan</label>
            <div className="p-inputgroup mt-2">
              <Calendar
                value={new Date(`${req_pur(po.preq_id)?.req_date}Z`)}
                placeholder="Tanggal Permintaan"
                disabled
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Tanggal Jatuh Tempo</label>
            <div className="p-inputgroup mt-2">
              <Calendar
                value={new Date(`${po?.due_date}Z`)}
                onChange={(e) => {}}
                placeholder="Tanggal Jatuh Tempo"
                disabled
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>
        </Row>

        {po?.rprod?.length ? (
          <CustomAccordion
            tittle={"Permintaan Produk"}
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
                  value={po.rprod.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      price: v?.price ?? 0,
                      disc: v?.disc ?? 0,
                      total: v?.total ?? 0,
                    };
                  })}
                  className="display w-150 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    header="Produk"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <Dropdown
                          value={e.prod_id && checkProd(e.prod_id)}
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
                          disabled={e.id !== 0}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Satuan"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <Dropdown
                          value={e.unit_id && checkUnit(e.unit_id)}
                          onChange={(t) => {
                            let temp = [...po.rprod];
                            temp[e.index].unit_id = t.value.id;
                            updatePo({ ...po, rprod: temp });
                          }}
                          options={satuan}
                          optionLabel="name"
                          placeholder="Pilih Satuan"
                          filter
                          filterBy="name"
                          disabled={e.id !== 0}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Permintaan"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.request ? e.request : 0}
                          onChange={(t) => {
                            let temp = [...po.rprod];
                            temp[e.index].request = t.target.value;
                            updatePo({ ...po, rprod: temp });
                            console.log(temp);
                          }}
                          placeholder="0"
                          type="number"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Pesanan"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.order ? e.order : 0}
                          onChange={(t) => {
                            let temp = [...po.rprod];
                            temp[e.index].order =
                              t.target.value > e.request
                                ? e.request
                                : t.target.value;
                            let result =
                              temp[e.index].request - temp[e.index].order;
                            temp[e.index].total =
                              temp[e.index].price * temp[e.index].order;
                            temp[e.index].remain = result;
                            updatePo({ ...po, rprod: temp });
                          }}
                          min={0}
                          placeholder="0"
                          type="number"
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Sisa"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.remain ? e.remain : 0}
                          placeholder="0"
                          type="number"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Harga Satuan"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.price ? e.price : 0}
                          onChange={(t) => {
                            let temp = [...po.rprod];
                            temp[e.index].price = t.target.value;
                            temp[e.index].total =
                              temp[e.index].price * temp[e.index].order;
                            updatePo({ ...po, rprod: temp });
                          }}
                          min={0}
                          placeholder="0"
                          type="number"
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Diskon"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.disc ? e.disc : 0}
                          onChange={(t) => {
                            let temp = [...po.rprod];
                            temp[e.index].disc = t.target.value;
                            // let disc = temp[e.index].total * temp[e.index].disc / 100
                            // console.log(disc);
                            // temp[e.index].total -= disc;
                            updatePo({ ...po, rprod: temp });
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
                    header="Harga Nett"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={
                            po.rprod[e.index].nett_price
                              ? po.rprod[e.index].nett_price
                              : 0
                          }
                          onChange={(t) => {
                            let temp = [...po.rprod];
                            temp[e.index].nett_price = t.target.value;
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
                    header="Total"
                    body={(e) => (
                      <label className="text-nowrap">
                        <b>
                          Rp.{" "}
                          {`${
                            e.nett_price && e.nett_price != 0
                              ? e.nett_price
                              : e.total - (e.total * e.disc) / 100
                          }`.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                        </b>
                      </label>
                    )}
                  />

                  {/* <Column
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
                /> */}
                </DataTable>
              </>
            }
          />
        ) : (
          <></>
        )}

        {po?.rjasa?.length ? (
          <CustomAccordion
            tittle={"Permintaan Jasa"}
            defaultActive={true}
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
                  responsiveLayout="none"
                  value={po.rjasa.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      price: v?.price ?? 0,
                      disc: v?.disc ?? 0,
                      total: v?.total ?? 0,
                    };
                  })}
                  className="display w-170 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    header="Supplier"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <Dropdown
                          value={e.sup_id && supp(e.sup_id)}
                          options={supplier}
                          onChange={(t) => {
                            let temp = [...po.rjasa];
                            temp[e.index].sup_id = t.value.supplier.id;
                            updatePo({ ...po, rjasa: temp });
                            console.log(temp);
                          }}
                          optionLabel="supplier.sup_name"
                          placeholder="Pilih Supplier"
                          itemTemplate={suppTemp}
                          valueTemplate={valueSupTemp}
                        />
                        <PButton
                        // onClick={() => {
                        //   setShowJenisPelanggan(true);
                        // }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    )}
                  />

                  <Column
                    header="Jasa"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <Dropdown
                          value={e.jasa_id && checkjasa(e.jasa_id)}
                          onChange={(t) => {
                            let temp = [...po.rjasa];
                            temp[e.index].jasa_id = t.value.jasa.id;
                            updatePo({ ...po, rjasa: temp });
                          }}
                          options={jasa}
                          optionLabel="jasa.name"
                          placeholder="Pilih Kode Jasa"
                          itemTemplate={jasTemp}
                          valueTemplate={valueJasTemp}
                          disabled={e.id !== 0}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Satuan"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <Dropdown
                          value={e.unit_id && checkUnit(e.unit_id)}
                          onChange={(t) => {
                            let temp = [...po.rjasa];
                            temp[e.index].unit_id = t.value.id;
                            updatePo({ ...po, rjasa: temp });
                          }}
                          options={satuan}
                          optionLabel="name"
                          placeholder="Pilih Satuan"
                          disabled={e.id !== 0}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Pesanan"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.qty && e.qty}
                          onChange={(t) => {
                            let temp = [...po.rjasa];
                            temp[e.index].qty = t.target.value;
                            temp[e.index].total =
                              temp[e.index].qty * temp[e.index].price;
                            updatePo({ ...po, rjasa: temp });
                            console.log(temp);
                          }}
                          placeholder="Jumlah Pesanan"
                          type="number"
                          min={0}
                          disabled={e.id !== 0}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Harga Satuan"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.price && e.price}
                          onChange={(t) => {
                            let temp = [...po.rjasa];
                            temp[e.index].price = t.target.value;
                            temp[e.index].total =
                              temp[e.index].qty * temp[e.index].price;
                            updatePo({ ...po, rjasa: temp });
                            console.log(temp);
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Diskon"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.disc && e.disc}
                          onChange={(t) => {
                            let temp = [...po.rjasa];
                            temp[e.index].disc = t.target.value;
                            updatePo({ ...po, rjasa: temp });
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
                    header="Total"
                    body={(e) => (
                      <label className="text-nowrap">
                        <b>{`Rp. ${e.total - (e.total * e.disc) / 100}`}</b>
                      </label>
                    )}
                  />

                  {/* <Column
                  body={(e) =>
                    e.index === po.rjasa.length - 1 ? (
                      <Link
                        onClick={() => {
                          updatePo({
                            ...po,
                            rjasa: [
                              ...po.rjasa,
                              {
                                id: 0,
                                jasa_id: null,
                                unit_id: null,
                                qty: null,
                              },
                            ],
                          });
                        }}
                        className="btn btn-primary shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : e.id === 0 ? (
                      <Link
                        onClick={() => {
                          let temp = [...po.rjasa];
                          temp.splice(e.index, 1);
                          updatePo({
                            ...po,
                            rjasa: temp,
                          });
                        }}
                        className="btn btn-danger shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-trash"></i>
                      </Link>
                    ) : (
                      <></>
                    )
                  }
                /> */}
                </DataTable>
              </>
            }
          />
        ) : (
          <></>
        )}

        <div className="row ml-0 mr-0 mb-0 mt-6 justify-content-between">
          <div>
            <div className="row ml-1">
              <div className="d-flex col-12 align-items-center">
                <label className="mt-1">{"Pisah Faktur"}</label>
                <InputSwitch
                  className="ml-4"
                  checked={currentItem && currentItem.faktur}
                  onChange={(e) => {
                    setCurrentItem({
                      ...currentItem,
                      faktur: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row justify-content-right col-6">
            <div className="col-6">
              <label className="text-label">Sub Total Barang</label>
            </div>

            <div className="col-6">
              <label className="text-label">
                <b>Rp. {getSubTotal()}</b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">DPP Barang</label>
            </div>

            <div className="col-6">
              <label className="text-label">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">Pajak Atas Barang (11%)</label>
            </div>

            <div className="col-6">
              <label className="text-label">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-6 mt-3">
              <label className="text-label">Diskon Tambahan</label>
            </div>

            <div className="col-6">
              <div className="p-inputgroup">
                <PButton
                  label="Rp."
                  className={`${isRp ? "" : "p-button-outlined"}`}
                  onClick={() => setRp(true)}
                />
                <InputText placeholder="Diskon" />
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
              <label className="text-label">
                <b>Total Pembayaran</b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label fs-16">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-12">
              <Divider className="ml-12"></Divider>
            </div>

            {currentItem !== null && currentItem.faktur ? (
              <>
                {/* <div className="row justify-content-right col-12 mt-4"> */}
                <div className="col-6 mt-4">
                  <label className="text-label">Sub Total Jasa</label>
                </div>

                <div className="col-6 mt-4">
                  <label className="text-label">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label">DPP Jasa</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label">Pajak Atas Jasa (2%)</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-6 mt-3">
                  <label className="text-label">Diskon Tambahan</label>
                </div>

                <div className="col-6">
                  <div className="p-inputgroup">
                    <PButton
                      label="Rp."
                      className={`${isRp ? "" : "p-button-outlined"}`}
                      onClick={() => setRp(true)}
                    />
                    <InputText placeholder="Diskon" />
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
                  <label className="text-label">
                    <b>Total Pembayaran</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label fs-16">
                    <b>Rp. </b>
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

export default InputPO;
