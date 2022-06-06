import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { request, endpoints } from "src/utils";
import { Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomAccordion from "../../../Accordion/Accordion";
import { SET_CURRENT_ODR } from "src/redux/actions";
import DataSupplier from "src/jsx/components/Mitra/Pemasok/DataPemasok";
import DataRulesPay from "src/jsx/components/MasterLainnya/RulesPay/DataRulesPay";
import DataPusatBiaya from "src/jsx/components/MasterLainnya/PusatBiaya/DataPusatBiaya";
import DataProduk from "src/jsx/components/Master/Produk/DataProduk";
import DataJasa from "src/jsx/components/Master/Jasa/DataJasa";
import DataSatuan from "src/jsx/components/MasterLainnya/Satuan/DataSatuan";
import { SelectButton } from "primereact/selectbutton";
import { el } from "date-fns/locale";

const InputOrder = ({ onCancel, onSuccess }) => {
  const order = useSelector((state) => state.order.current);
  const [dept, setDept] = useState(null);
  const [po, setPO] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [rulesPay, setRulesPay] = useState(null);
  const [pajak, setPajak] = useState(null);
  const [product, setProduct] = useState(null);
  const [jasa, setJasa] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showRulesPay, setShowRulesPay] = useState(false);
  const [showDept, setShowDept] = useState(false);
  const [showProduk, setShowProduk] = useState(false);
  const [showJasa, setShowJasa] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const isEdit = useSelector((state) => state.order.editOdr);
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const [isRp, setRp] = useState(true);
  const [isRpJasa, setRpJasa] = useState(true);
  const dispatch = useDispatch();
  const [accor, setAccor] = useState({
    produk: true,
    jasa: false,
  });

  const faktur = [
    { name: "Faktur", sts: true },
    { name: "Non Faktur", sts: false },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getSupplier();
    getRulesPay();
    getDept();
    getProduct();
    getJasa();
    getSatuan();
    getPjk();
    getPO();
    getLoc();
  }, []);

  const editODR = async () => {
    const config = {
      ...endpoints.editODR,
      endpoint: endpoints.editODR.endpoint + order.id,
      data: order,
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

  const addODR = async () => {
    const config = {
      ...endpoints.addODR,
      data: order,
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
            detail: `Kode ${order.ord_code} Sudah Digunakan`,
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

  const getPO = async () => {
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
        let filt = [];
        data.forEach((elem) => {
          let prod = [];
          elem.pprod.forEach((el) => {
            el.prod_id = el.prod_id.id;
            el.unit_id = el.unit_id.id;
            prod.push({
              ...el,
              r_order: el.order,
            });

            let temp = [...order.dprod];
            order.dprod.forEach((e, i) => {
              if (el.id == e.pprod_id) {
                temp[i].order = el.order;
                updateORD({ ...order, dprod: temp });
              }
            });
          });
          elem.pprod = prod;

          let jasa = [];
          elem.pjasa.forEach((element) => {
            element.jasa_id = element.jasa_id.id;
            element.unit_id = element.unit_id.id;
            jasa.push({
              ...element,
              r_order: element.order,
            });

            let temp = [...order.djasa];
            order.djasa.forEach((e, i) => {
              if (el.id == e.pjasa_id) {
                temp[i].order = el.order;
                updateORD({ ...order, djasa: temp });
              }
            });
          });
          elem.pjasa = jasa;
          filt.push(elem);
        });
        setPO(filt);
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

  const getDept = async () => {
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
        setDept(data);
      }
    } catch (error) {
      console.log(error);
    }
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

  const getPjk = async () => {
    const config = {
      ...endpoints.pajak,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setPajak(data);
      }
    } catch (error) {}
  };

  const getLoc= async () => {
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

  const checkUnit = (value) => {
    let selected = {};
    satuan?.forEach((element) => {
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
      }
    });

    return selected;
  };

  const checkJasa = (value) => {
    let selected = {};
    jasa?.forEach((element) => {
      if (value === element.jasa.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkSupp = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element.supplier.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkPO = (value) => {
    let selected = {};
    po?.forEach((element) => {
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

  const checkpjk = (value) => {
    let selected = {};
    pajak?.forEach((element) => {
      if (value === element.id) {
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

  const checRulPay = (value) => {
    let selected = {};
    rulesPay?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
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

  const poTemp = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.po_code} (${option.preq_id.req_dep.ccost_name})`
          : ""}
      </div>
    );
  };

  const valuePOTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.po_code} (${option.preq_id.req_dep.ccost_name})`
            : ""}
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

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editODR();
    } else {
      setUpdate(true);
      addODR();
    }
  };

  const updateORD = (e) => {
    dispatch({
      type: SET_CURRENT_ODR,
      payload: e,
    });
  };

  const getSubTotalBarang = () => {
    let total = 0;
    order?.dprod?.forEach((el) => {
      if (el.nett_price && el.nett_price > 0) {
        total += parseInt(el.nett_price);
      } else {
        total += el.total - (el.total * el.disc) / 100;
      }
    });

    return total;
  };

  const getSubTotalJasa = () => {
    let total = 0;
    order?.djasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return total;
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>{isEdit ? "Edit" : "Buat"} Pembelian</b>
      </h4>
    );
  };

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-6">
            <label className="text-label">Tanggal</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${order.ord_date}Z`)}
                onChange={(e) => {
                  updateORD({ ...order, ord_date: e.value });
                }}
                placeholder="Pilih Tanggal"
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Kode Pembelian</label>
            <div className="p-inputgroup">
              <InputText
                value={order.ord_code}
                onChange={(e) =>
                  updateORD({ ...order, ord_code: e.target.value })
                }
                placeholder="Masukan Kode Pembelian"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">No. Pesanan Pembelian</label>
            <div className="p-inputgroup">
              <Dropdown
                value={order.po_id !== null ? checkPO(order.po_id) : null}
                options={po}
                onChange={(e) => {
                  console.log(e.value.preq_id.req_dep.id);
                  updateORD({
                    ...order,
                    po_id: e.value.id,
                    top: e.value?.top.id ?? null,
                    sup_id: e.value?.id ?? null,
                    dep_id: e.value?.preq_id?.req_dep?.id ?? null,
                    dprod: e.value.pprod,
                    djasa: e.value.pjasa,
                  });
                }}
                placeholder="Pilih No. Pesanan Pembelian"
                optionLabel="po_code"
                filter
                filterBy="po_code"
                valueTemplate={valuePOTemp}
                itemTemplate={poTemp}
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Departemen</label>
            <div className="p-inputgroup">
              <Dropdown
                value={order.dep_id !== null ? checkDept(order.dep_id) : null}
                options={dept}
                onChange={(e) => {
                  updateORD({ ...order, dep_id: e.value.id });
                }}
                placeholder="Departemen"
                optionLabel="ccost_name"
                filter
                filterBy="ccost_name"
                valueTemplate={valueDeptTemp}
                itemTemplate={deptTemp}
                disabled={order && order.po_id !== null}
              />
              <PButton
                onClick={() => {
                  setShowDept(true);
                }}
                disabled={order && order.po_id !== null}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">Supplier</label>
            <div className="p-inputgroup">
              <Dropdown
                value={order.sup_id !== null ? checkSupp(order.sup_id) : null}
                options={supplier}
                onChange={(e) => {
                  updateORD({ ...order, sup_id: e.value.supplier.id });
                }}
                optionLabel="supplier.sup_name"
                placeholder="Pilih Supplier"
                filter
                filterBy="supplier.sup_name"
                itemTemplate={suppTemp}
                valueTemplate={valueSupTemp}
                disabled={order && order.po_id !== null}
              />
              <PButton
                onClick={() => {
                  setShowSupplier(true);
                }}
                disabled={order && order.po_id !== null}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">Alamat Supplier</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  order.sup_id !== null
                    ? checkSupp(order.sup_id)?.supplier?.sup_address
                    : ""
                }
                placeholder="Alamat Supplier"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">Kontak Person</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  order.sup_id !== null
                    ? checkSupp(order.sup_id)?.supplier?.sup_telp1
                    : ""
                }
                placeholder="Kontak Person"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">Jenis Pajak</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  order.sup_id !== null
                    ? checkpjk(checkSupp(order.sup_id)?.supplier?.sup_ppn).name
                    : null
                }
                placeholder="Jenis Pajak"
                disabled
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Syarat Pembayaran</label>
            <div className="p-inputgroup mt-2">
              <Dropdown
                value={
                  order.top !== null ? checRulPay(order.top) : null
                  // order.top !== null
                  //   ? checRulPay(checkPO(order.po_id)?.top?.id)
                  //   : null
                }
                options={rulesPay}
                onChange={(e) => {
                  let result = new Date(`${order.due_date}Z`);
                  result.setDate(result.getDate() + e.value.day);
                  console.log(result);

                  updateORD({ ...order, top: e.value.id, due_date: result });
                }}
                optionLabel="name"
                placeholder="Pilih Syarat Pembayaran"
                filter
                filterBy="name"
                itemTemplate={rulTemp}
                valueTemplate={valueRulTemp}
                disabled={order && order.po_id !== null}
              />
              <PButton
                onClick={() => {
                  setShowRulesPay(true);
                }}
                disabled={order && order.po_id !== null}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Tanggal Jatuh Tempo</label>
            <div className="p-inputgroup mt-2">
              <Calendar
                value={new Date(`${checkPO(order.po_id).due_date}Z`)}
                onChange={(e) => {}}
                placeholder="Tanggal Jatuh Tempo"
                disabled
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>

          <div className="col-4 mt-3">
            <label className="text-label"></label>
            <div className="p-inputgroup">
              <SelectButton
                value={
                  order.faktur !== null && order.faktur !== ""
                    ? order.faktur === true
                      ? { name: "Faktur", sts: true }
                      : { name: "Non Faktur", sts: false }
                    : null
                }
                options={faktur}
                onChange={(e) => {
                  console.log(e.value);
                  updateORD({
                    ...order,
                    faktur: e.value.sts,
                  });
                }}
                optionLabel="name"
              />
            </div>
          </div>
        </Row>

        <CustomAccordion
          tittle={"Pembelian Produk"}
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
                responsiveLayout="scroll"
                value={order.dprod?.map((v, i) => {
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
                  // style={{
                  //   maxWidth: "15rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <Dropdown
                        value={e.prod_id && checkProd(e.prod_id)}
                        options={product}
                        onChange={(u) => {
                          console.log(e.value);
                          let temp = [...order.dprod];
                          temp[e.index].prod_id = u.value.id;
                          temp[e.index].unit_id = u.value.unit?.id;
                          updateORD({ ...order, dprod: temp });
                        }}
                        placeholder="Pilih Produk"
                        optionLabel="name"
                        filter
                        filterBy="name"
                        valueTemplate={valueProd}
                        itemTemplate={prodTemp}
                        disabled={order && order.po_id !== null}
                      />
                      <PButton
                        onClick={() => {
                          setShowProduk(true);
                        }}
                        disabled={order && order.po_id !== null}
                      >
                        <i class="bx bx-food-menu"></i>
                      </PButton>
                    </div>
                  )}
                />

                <Column
                  header="Satuan"
                  // style={{
                  //   minWidth: "10rem",
                  //   maxWidth: "15rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <Dropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        onChange={(u) => {
                          let temp = [...order.dprod];
                          temp[e.index].unit_id = u.value.id;
                          updateORD({ ...order, dprod: temp });
                        }}
                        options={satuan}
                        optionLabel="name"
                        filter
                        filterBy="name"
                        placeholder="Pilih Satuan"
                        disabled={order && order.po_id !== null}
                      />
                      <PButton
                        onClick={() => {
                          setShowSatuan(true);
                        }}
                        disabled={order && order.po_id !== null}
                      >
                        <i class="bx bx-food-menu"></i>
                      </PButton>
                    </div>
                  )}
                />

                <Column
                  header="Pesanan"
                  // style={{
                  //   maxWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.order && e.order}
                        onChange={(u) => {
                          let temp = [...order.dprod];
                          temp[e.index].order = u.target.value;
                          temp[e.index].total =
                            temp[e.index].order * temp[e.index].price;
                          updateORD({ ...order, dprod: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled={order && order.po_id !== null}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Lokasi"
                  // style={{
                  //   maxWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <Dropdown
                        value={e.location && checkLoc(e.location)}
                        onChange={(u) => {
                          let temp = [...order.dprod];
                          temp[e.index].location = u.value.id;
                          updateORD({ ...order, dprod: temp });
                        }}
                        options={lokasi}
                        optionLabel="name"
                        placeholder="Lokasi"
                      />
                    </div>
                  )}
                />

                <Column
                  header="Harga Satuan"
                  // style={{
                  //   minWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.price && e.price}
                        onChange={(u) => {
                          let temp = [...order.dprod];
                          temp[e.index].price = u.target.value;
                          temp[e.index].total =
                            temp[e.index].order * temp[e.index].price;
                          updateORD({ ...order, dprod: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled={order && order.po_id !== null}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Diskon"
                  // style={{
                  //   maxWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.disc && e.disc}
                        onChange={(u) => {
                          let temp = [...order.dprod];
                          temp[e.index].disc = u.target.value;
                          updateORD({ ...order, dprod: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled={order && order.po_id !== null}
                      />
                      <span className="p-inputgroup-addon">%</span>
                    </div>
                  )}
                />

                <Column
                  header="Harga Nett"
                  // style={{
                  //   minWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.nett_price && e.nett_price}
                        onChange={(u) => {
                          let temp = [...order.dprod];
                          temp[e.index].nett_price = u.target.value;
                          updateORD({ ...order, dprod: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled={order && order.po_id !== null}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Total"
                  // style={{
                  //   minWidth: "12rem",
                  // }}
                  body={(e) => (
                    <label className="text-nowrap">
                      <b>
                        Rp.{" "}
                        {`${
                          e.nett_price && e.nett_price !== 0
                            ? e.nett_price
                            : e.total - (e.total * e.disc) / 100
                        }`.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                      </b>
                    </label>
                  )}
                />

                <Column
                  header=""
                  // style={{
                  //   maxWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) =>
                    e.index === order.dprod.length - 1 ? (
                      <Link
                        onClick={() => {
                          updateORD({
                            ...order,
                            dprod: [
                              ...order.dprod,
                              {
                                id: 0,
                                prod_id: null,
                                unit_id: null,
                                request: null,
                                order: null,
                                remain: null,
                                price: null,
                                disc: null,
                                nett_price: null,
                                total: null,
                              },
                            ],
                          });
                        }}
                        className="btn btn-primary shadow btn-xs sharp"
                        disabled={order && order.po_id !== null}
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          let temp = [...order.dprod];
                          temp.splice(e.index, 1);
                          updateORD({ ...order, dprod: temp });
                        }}
                        className="btn btn-danger shadow btn-xs sharp"
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

        <CustomAccordion
          tittle={"Pembelian Jasa"}
          defaultActive={false}
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
                responsiveLayout="scroll"
                value={order.djasa?.map((v, i) => {
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
                  // style={{
                  //   width: "15rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <Dropdown
                        value={e.sup_id && checkSupp(e.sup_id)}
                        options={supplier}
                        onChange={(u) => {
                          console.log(e.value);
                          let temp = [...order.djasa];
                          temp[e.index].sup_id = u.value.supplier.id;
                          updateORD({ ...order, djasa: temp });
                        }}
                        optionLabel="supplier.sup_name"
                        placeholder="Pilih Supplier"
                        filter
                        filterBy="supplier.sup_name"
                        itemTemplate={suppTemp}
                        valueTemplate={valueSupTemp}
                        disabled={order && order.po_id !== null}
                      />
                      <PButton
                        onClick={() => {
                          setShowSupplier(true);
                        }}
                        disabled={order && order.po_id !== null}
                      >
                        <i class="bx bx-food-menu"></i>
                      </PButton>
                    </div>
                  )}
                />

                <Column
                  header="Jasa"
                  // style={{
                  //   maxWidth: "15rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <Dropdown
                        value={e.jasa_id && checkJasa(e.jasa_id)}
                        options={jasa}
                        onChange={(u) => {
                          console.log(e.value);
                          let temp = [...order.djasa];
                          temp[e.index].jasa_id = u.value.jasa.id;
                          updateORD({ ...order, djasa: temp });
                        }}
                        optionLabel="jasa.name"
                        placeholder="Pilih Jasa"
                        filter
                        filterBy="jasa.name"
                        itemTemplate={jasTemp}
                        valueTemplate={valueJasTemp}
                        disabled={order && order.po_id !== null}
                      />
                      <PButton
                        onClick={() => {
                          setShowJasa(true);
                        }}
                        disabled={order && order.po_id !== null}
                      >
                        <i class="bx bx-food-menu"></i>
                      </PButton>
                    </div>
                  )}
                />

                <Column
                  header="Satuan"
                  // style={{
                  //   maxWidth: "12rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <Dropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        options={satuan}
                        onChange={(u) => {
                          console.log(e.value);
                          let temp = [...order.djasa];
                          temp[e.index].unit_id = u.value.id;
                          updateORD({ ...order, djasa: temp });
                        }}
                        optionLabel="name"
                        placeholder="Pilih Satuan"
                        filter
                        filterBy="name"
                        disabled={order && order.po_id !== null}
                      />
                      <PButton
                        onClick={() => {
                          setShowSatuan(true);
                        }}
                        disabled={order && order.po_id !== null}
                      >
                        <i class="bx bx-food-menu"></i>
                      </PButton>
                    </div>
                  )}
                />

                <Column
                  header="Pesanan"
                  // style={{
                  //   maxWidth: "15rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.order && e.order}
                        onChange={(u) => {
                          let temp = [...order.djasa];
                          temp[e.index].order = u.target.value;
                          temp[e.index].total =
                            temp[e.index].order * temp[e.index].price;
                          updateORD({ ...order, djasa: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled={order && order.po_id !== null}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Harga Satuan"
                  // style={{
                  //   width: "25rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.price && e.price}
                        onChange={(u) => {
                          let temp = [...order.djasa];
                          temp[e.index].price = u.target.value;
                          temp[e.index].total =
                            temp[e.index].order * temp[e.index].price;
                          updateORD({ ...order, djasa: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled={order && order.po_id !== null}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Diskon"
                  // style={{
                  //   width: "25rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.disc && e.disc}
                        onChange={(u) => {
                          let temp = [...order.djasa];
                          temp[e.index].disc = u.target.value;
                          updateORD({ ...order, djasa: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled={order && order.po_id !== null}
                      />
                      <span className="p-inputgroup-addon">%</span>
                    </div>
                  )}
                />

                <Column
                  header="Total"
                  // style={{
                  //   minWidth: "12rem",
                  // }}
                  body={(e) => (
                    <label className="text-nowrap">
                      <b>
                        {`Rp. ${e.total - (e.total * e.disc) / 100}`.replace(
                          /(\d)(?=(\d{3})+(?!\d))/g,
                          "$1."
                        )}
                      </b>
                    </label>
                  )}
                />

                <Column
                  header=""
                  // style={{
                  //   maxWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) =>
                    e.index === order.djasa?.length - 1 ? (
                      <Link
                        onClick={() => {
                          updateORD({
                            ...order,
                            djasa: [
                              ...order.djasa,
                              {
                                id: 0,
                                jasa_id: null,
                                sup_id: null,
                                unit_id: null,
                                order: null,
                                price: null,
                                disc: null,
                                total: null,
                              },
                            ],
                          });
                        }}
                        className="btn btn-primary shadow btn-xs sharp"
                        disabled={order && order.po_id !== null}
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          let temp = [...order.djasa];
                          temp.splice(e.index, 1);
                          updateORD({ ...order, djasa: temp });
                        }}
                        className="btn btn-danger shadow btn-xs sharp"
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

        <div className="row ml-0 mr-0 mb-0 mt-6 justify-content-between">
          <div>
            <div className="row ml-1">
              {order.djasa.length > 0 && order.dprod.length > 0 && (
                <div className="d-flex col-12 align-items-center">
                  <label className="mt-1">{"Pisah Faktur"}</label>
                  <InputSwitch
                    className="ml-4"
                    checked={order.split_inv}
                    onChange={(e) => {
                      if (e.value) {
                        updateORD({
                          ...order,
                          split_inv: e.value,
                          total_disc: null,
                        });
                      } else {
                        updateORD({
                          ...order,
                          split_inv: e.value,
                          prod_disc: null,
                          jasa_disc: null,
                        });
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="row justify-content-right col-6">
            <div className="col-6">
              <label className="text-label">
                {order.split_inv ? "Sub Total Barang" : "Sub Total"}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {order.split_inv ? (
                  <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                ) : (
                  <b>
                    Rp. {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                  </b>
                )}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {order.split_inv ? "DPP Barang" : "DPP"}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {order.split_inv ? (
                  <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                ) : (
                  <b>
                    Rp. {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                  </b>
                )}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {order.split_inv ? "Pajak Atas Barang (11%)" : "Pajak (11%)"}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {order.split_inv ? (
                  <b>Rp. {formatIdr((getSubTotalBarang() * 11) / 100)}</b>
                ) : (
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      ((getSubTotalBarang() + getSubTotalJasa()) * 11) / 100
                    )}
                  </b>
                )}
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
                <InputText
                  value={
                    order.split_inv
                      ? isRp
                        ? (getSubTotalBarang() * order.prod_disc) / 100
                        : order.prod_disc
                      : isRp
                      ? ((getSubTotalBarang() + getSubTotalJasa()) *
                          order.total_disc) /
                        100
                      : order.total_disc
                  }
                  placeholder="Diskon"
                  type="number"
                  min={0}
                  onChange={(e) => {
                    if (order.split_inv) {
                      let disc = 0;
                      if (isRp) {
                        disc = (e.target.value / getSubTotalBarang()) * 100;
                      } else {
                        disc = e.target.value;
                      }
                      updateORD({ ...order, prod_disc: disc });
                    } else {
                      let disc = 0;
                      if (isRp) {
                        disc =
                          (e.target.value /
                            (getSubTotalBarang() + getSubTotalJasa())) *
                          100;
                      } else {
                        disc = e.target.value;
                      }
                      updateORD({ ...order, total_disc: disc });
                    }
                  }}
                />
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
                {order.split_inv ? (
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      getSubTotalBarang() + (getSubTotalBarang() * 11) / 100
                    )}
                  </b>
                ) : (
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      getSubTotalBarang() +
                        getSubTotalJasa() +
                        ((getSubTotalBarang() + getSubTotalJasa()) * 11) / 100
                    )}
                  </b>
                )}
              </label>
            </div>

            <div className="col-12">
              <Divider className="ml-12"></Divider>
            </div>

            {order.split_inv ? (
              <>
                {/* <div className="row justify-content-right col-12 mt-4"> */}
                <div className="col-6 mt-4">
                  <label className="text-label">Sub Total Jasa</label>
                </div>

                <div className="col-6 mt-4">
                  <label className="text-label">
                    <b>Rp. {formatIdr(getSubTotalJasa())}</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label">DPP Jasa</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Rp. {formatIdr(getSubTotalJasa())}</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label">Pajak Atas Jasa (2%)</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Rp. {formatIdr((getSubTotalJasa() * 2) / 100)}</b>
                  </label>
                </div>

                <div className="col-6 mt-3">
                  <label className="text-label">Diskon Tambahan</label>
                </div>

                <div className="col-6">
                  <div className="p-inputgroup">
                    <PButton
                      label="Rp."
                      className={`${isRpJasa ? "" : "p-button-outlined"}`}
                      onClick={() => setRpJasa(true)}
                    />
                    <InputText
                      value={
                        isRpJasa
                          ? (getSubTotalJasa() * order.jasa_disc) / 100
                          : order.jasa_disc
                      }
                      placeholder="Diskon"
                      type="number"
                      min={0}
                      onChange={(e) => {
                        let disc = 0;
                        if (isRpJasa) {
                          disc = (e.target.value / getSubTotalJasa()) * 100;
                        } else {
                          disc = e.target.value;
                        }
                        updateORD({ ...order, jasa_disc: disc });
                      }}
                    />
                    <PButton
                      className={`${isRpJasa ? "p-button-outlined" : ""}`}
                      onClick={() => setRpJasa(false)}
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
                    <b>
                      Rp.{" "}
                      {formatIdr(
                        getSubTotalJasa() + (getSubTotalJasa() * 2) / 100
                      )}
                    </b>
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
            onClick={onSubmit}
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
            updateORD({ ...order, top: e.data.id });
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
            updateORD({ ...order, dep_id: e.data.id });
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
            updateORD({ ...order, sup_id: e.data.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataProduk
        data={product}
        loading={false}
        popUp={true}
        show={showProduk}
        onHide={() => {
          setShowProduk(false);
        }}
        onInput={(e) => {
          setShowProduk(!e);
        }}
        onSuccessInput={(e) => {
          getProduct();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowProduk(false);
            updateORD({ ...order, dprod: e.data.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataJasa
        data={jasa}
        loading={false}
        popUp={true}
        show={showJasa}
        onHide={() => {
          setShowJasa(false);
        }}
        onInput={(e) => {
          setShowJasa(!e);
        }}
        onSuccessInput={(e) => {
          getJasa();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowJasa(false);
            updateORD({ ...order, djasa: e.data.id });
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
            updateORD({ ...order, sup_id: e.data.id });
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

export default InputOrder;
