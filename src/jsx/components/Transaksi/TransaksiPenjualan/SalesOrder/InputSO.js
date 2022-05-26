import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_SO } from "src/redux/actions";
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
import CustomAccordion from "../../../Accordion/Accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DataRulesPay from "src/jsx/components/MasterLainnya/RulesPay/DataRulesPay";
import DataSupplier from "src/jsx/components/Mitra/Pemasok/DataPemasok";
import DataPajak from "src/jsx/components/Master/Pajak/DataPajak";
import DataSatuan from "src/jsx/components/MasterLainnya/Satuan/DataSatuan";
import DataProduk from "src/jsx/components/Master/Produk/DataProduk";
import DataJasa from "src/jsx/components/Master/Jasa/DataJasa";
import DataCustomer from "src/jsx/components/Mitra/Pelanggan/DataCustomer";

const InputSO = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const so = useSelector((state) => state.so.current);
  const isEdit = useSelector((state) => state.so.editso);
  const [isRp, setRp] = useState(true);
  const [jasa, setJasa] = useState(null);
  const [showProduk, setShowProduk] = useState(false);
  const [showJasa, setShowJasa] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showPpn, setShowPpn] = useState(false);
  const [showRulesPay, setShowRulesPay] = useState(false);
  const [product, setProduk] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [rulesPay, setRulesPay] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [subCus, setSubCus] = useState(null);
  const [inProd, setInProd] = useState([
    {
      prod_id: null,
      unit_id: null,
      request: null,
      price: null,
      disc: null,
      nett_price: null,
    },
  ]);
  const [inJasa, setInJasa] = useState([
    {
      jasa_id: null,
      unit_id: null,
      qty: null,
      price: null,
      disc: null,
      nett_price: null,
    },
  ]);
  const [accor, setAccor] = useState({
    produk: true,
    jasa: false,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getJasa();
    getProduk();
    getSupplier();
    getSatuan();
    getRulesPay();
    getPpn();
    getCustomer();
    getSubCus();
  }, []);

  const editSO = async () => {
    const config = {
      ...endpoints.editSO,
      endpoint: endpoints.editSO.endpoint + so.id,
      data: so,
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

  const addSO = async () => {
    const config = {
      ...endpoints.addSO,
      data: so,
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
            detail: `Kode ${so.so_code} Sudah Digunakan`,
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

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editSO();
    } else {
      setUpdate(true);
      addSO();
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
        setProduk(data);
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

  const getCustomer = async () => {
    const config = {
      ...endpoints.customer,
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
        setCustomer(data);
      }
    } catch (error) {}
  };

  const getSubCus = async () => {
    const config = {
      ...endpoints.customer,
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
          if (elem.customer.sub_cus === true) {
            filt.push(elem.customer);
          }
        });
        console.log(data);
        setSubCus(filt);
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

  const checkRules = (value) => {
    let selected = {};
    rulesPay?.forEach((element) => {
      if (value === element.id) {
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

  const checkPpn = (value) => {
    let selected = {};
    ppn?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkCus = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkSubCus = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer.id) {
        selected = element;
      }
    });

    return selected;
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

  const cusTemp = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.customer.cus_name} (${option.customer.cus_code})`
          : ""}
      </div>
    );
  };

  const valueCusTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.customer.cus_name} (${option.customer.cus_code})`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const SubcusTemp = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.cus_name} (${option.cus_code})`
          : ""}
      </div>
    );
  };

  const valueSubCusTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.cus_name} (${option.cus_code})`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
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

  const updateSo = (e) => {
    dispatch({
      type: SET_CURRENT_SO,
      payload: e,
    });
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Buat Permintaan SO</b>
      </h4>
    );
  };

  const body = () => {
    return (
      <>
        <Toast ref={toast} />
        {/* Put content body here */}
        <Row className="mb-6">
          <div className="col-6">
            <label className="text-black fs-15">Tanggal</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${so.so_date}Z`)}
                onChange={(e) => {
                  updateSo({ ...so, po_date: e.value });
                }}
                placeholder="Pilih Tanggal"
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-black fs-14">Kode Referensi</label>
            <div className="p-inputgroup">
              <InputText
                value={so.so_code}
                onChange={(e) => updateSo({ ...so, so_code: e.target.value })}
                placeholder="Masukan Kode Referensi"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-black fs-14">Pelanggan</label>
            <div className="p-inputgroup">
              <Dropdown
                value={so.pel_id !== null ? checkCus(so.pel_id) : null}
                options={customer}
                onChange={(e) => {
                  updateSo({ ...so, pel_id: e.value.customer.id });
                }}
                optionLabel="cus_name"
                placeholder="Pilih Pelanggan"
                itemTemplate={cusTemp}
                valueTemplate={valueCusTemp}
              />
              <PButton
                onClick={() => {
                  setShowCustomer(true);
                }}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-4">
            <label className="text-black fs-14"></label>
            <div className="p-inputgroup mt-2">
              <InputText
                value={
                  so.pel_id !== null
                    ? checkCus(so.pel_id)?.customer?.cus_address
                    : ""
                }
                placeholder="Alamat Pelanggan"
                disabled
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-black fs-14"></label>
            <div className="p-inputgroup mt-2">
              <InputText
                value={
                  so.pel_id !== null
                    ? checkCus(so.pel_id)?.customer?.cus_telp1
                    : ""
                }
                placeholder="Kontak Person"
                disabled
              />
            </div>
          </div>

          <div className="col-12">
            <label className="text-black fs-14">Ppn</label>
            <div className="p-inputgroup mt-2">
              <Dropdown
                value={so.ppn_type !== null ? checkPpn(so.ppn_type) : null}
                options={ppn}
                onChange={(e) => {
                  updateSo({ ...so, ppn_type: e.value.id });
                }}
                optionLabel="name"
                placeholder="Pilih Jenis Ppn"
              />
              <PButton
                onClick={() => {
                  setShowPpn(true);
                }}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="d-flex col-12 align-items-center mt-4">
            <label className="ml-0 mt-1 text-black fs-14">
              {"Kirim Ke Sub Pelanggan"}
            </label>
            <InputSwitch
              className="ml-4"
              checked={so && so.sub_addr}
              onChange={(e) => {
                updateSo({ ...so, sub_addr: e.target.value });
              }}
            />
          </div>

          <div className="col-4">
            <label className="text-black fs-14">Sub Pelanggan</label>
            <div className="p-inputgroup">
              <Dropdown
                value={so.sub_id !== null ? checkSubCus(so.sub_id) : null}
                options={subCus}
                onChange={(e) => {
                  updateSo({ ...so, sub_id: e.value?.id });
                }}
                optionLabel="cus_name"
                placeholder="Pilih Pelanggan"
                itemTemplate={SubcusTemp}
                valueTemplate={valueSubCusTemp}
                disabled={so && !so.sub_addr}
              />
              <PButton
                onClick={() => {
                  setShowCustomer(true);
                }}
                disabled={so && !so.sub_addr}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-4">
            <label className="text-black fs-14"></label>
            <div className="p-inputgroup mt-1">
              <InputText
                value={
                  so.sub_id !== null
                    ? checkSubCus(so.sub_id)?.customer?.cus_address
                    : ""
                }
                placeholder="Alamat Sub Pelanggan"
                disabled
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-black fs-14"></label>
            <div className="p-inputgroup mt-1">
              <InputText
                value={
                  so.sub_id !== null
                    ? checkSubCus(so.sub_id)?.customer?.cus_telp1
                    : ""
                }
                placeholder="Kontak Person"
                disabled
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-black fs-14">Tanggal Permintaan</label>
            <div className="p-inputgroup mt-2">
              <Calendar
                value={new Date(`${so.req_date}Z`)}
                onChange={(e) => {
                  updateSo({ ...so, req_date: e.value });
                }}
                placeholder="Pilih Tanggal Pemintaan"
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-black fs-14">Syarat Pembayaran</label>
            <div className="p-inputgroup mt-2">
              <Dropdown
                value={so.top !== null ? checkRules(so.top) : null}
                options={rulesPay}
                onChange={(e) => {
                  let result = new Date(`${so.req_date}Z`);
                  result.setDate(result.getDate() + e.value.day);
                  console.log(result);

                  updateSo({ ...so, top: e.value.id, due_date: result });
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

          <div className="col-4">
            <label className="text-black fs-14">Tanggal Jatuh Tempo</label>
            <div className="p-inputgroup mt-2">
              <Calendar
                value={new Date(`${so?.due_date}Z`)}
                onChange={(e) => {}}
                placeholder="Tanggal Jatuh Tempo"
                disabled
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>
        </Row>

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
                value={inProd.map((v, i) => {
                  return { ...v, index: i };
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
                          let temp = [...inProd];
                          temp[e.index].prod_id = u.value.id;
                          temp[e.index].unit_id = u.value.unit?.id;
                          updateSo({ inProd: temp });
                        }}
                        placeholder="Pilih Kode Produk"
                        optionLabel="name"
                        filter
                        filterBy="name"
                        valueTemplate={valueProd}
                        itemTemplate={prodTemp}
                      />
                      <PButton
                        onClick={() => {
                          setShowProduk(true);
                        }}
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
                          let temp = [...inProd];
                          temp[e.index].unit_id = u.value.id;
                          updateSo({ inProd: temp });
                        }}
                        options={satuan}
                        optionLabel="name"
                        filter
                        filterBy="name"
                        placeholder="Pilih Satuan"
                      />
                      <PButton
                        onClick={() => {
                          setShowSatuan(true);
                        }}
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
                        value={e.request && e.request}
                        onChange={(u) => {
                          let temp = [...inProd];
                          temp[e.index].request = u.target.value;
                          temp[e.index].total =
                            temp[e.index].request * temp[e.index].price;
                          updateSo({ inProd: temp });
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
                          let temp = [...inProd];
                          temp[e.index].price = u.target.value;
                          temp[e.index].total =
                            temp[e.index].request * temp[e.index].price;
                          updateSo({ inProd: temp });
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
                  // style={{
                  //   maxWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.disc && e.disc}
                        onChange={(u) => {
                          let temp = [...inProd];
                          temp[e.index].disc = u.target.value;
                          updateSo({ inProd: temp });
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
                  // style={{
                  //   minWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.nett_price && e.nett_price}
                        onChange={(u) => {
                          let temp = [...inProd];
                          temp[e.index].nett_price = u.target.value;
                          updateSo({ inProd: temp });
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
                  header="Total"
                  // style={{
                  //   minWidth: "12rem",
                  // }}
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

                <Column
                  header=""
                  // style={{
                  //   maxWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) =>
                    e.index === inProd.length - 1 ? (
                      <Link
                        onClick={() => {
                          setInProd([
                            ...inProd,
                            {
                              prod_id: null,
                              unit_id: null,
                              request: null,
                              price: null,
                              disc: null,
                              nett_price: null,
                            },
                          ]);
                        }}
                        className="btn btn-primary shadow btn-xs sharp"
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          let temp = [...inProd];
                          temp.splice(e.index, 1);
                          setInProd(temp);
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
          tittle={"Permintaan Jasa"}
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
                value={inJasa.map((v, i) => {
                  return { ...v, index: i };
                })}
                className="display w-170 datatable-wrapper header-white no-border"
                showGridlines={false}
                emptyMessage={() => <div></div>}
              >
                <Column
                  header="Supplier"
                  style={{
                    width: "15rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <Dropdown
                        value={e.sup_id && checkSupp(e.sup_id)}
                        options={supplier}
                        onChange={(u) => {
                          console.log(e.value);
                          let temp = [...inJasa];
                          temp[e.index].sup_id = u.value.supplier.id;
                          updateSo({ inJasa: temp });
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
                  )}
                />

                <Column
                  header="Jasa"
                  style={{
                    maxWidth: "15rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <Dropdown
                        value={e.jasa_id && checkJasa(e.jasa_id)}
                        options={jasa}
                        onChange={(u) => {
                          console.log(e.value);
                          let temp = [...inJasa];
                          temp[e.index].jasa_id = u.value.jasa.id;
                          updateSo({ inJasa: temp });
                        }}
                        optionLabel="jasa.name"
                        placeholder="Pilih Jasa"
                        itemTemplate={jasTemp}
                        valueTemplate={valueJasTemp}
                      />
                      <PButton
                        onClick={() => {
                          setShowJasa(true);
                        }}
                      >
                        <i class="bx bx-food-menu"></i>
                      </PButton>
                    </div>
                  )}
                />

                <Column
                  header="Satuan"
                  style={{
                    maxWidth: "12rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <Dropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        options={satuan}
                        onChange={(u) => {
                          console.log(e.value);
                          let temp = [...inJasa];
                          temp[e.index].unit_id = u.value.unit?.id;
                          updateSo({ inJasa: temp });
                        }}
                        optionLabel="name"
                        placeholder="Pilih Satuan"
                      />
                      <PButton
                        onClick={() => {
                          setShowSatuan(true);
                        }}
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
                        value={e.qty && e.qty}
                        onChange={(u) => {
                          let temp = [...inJasa];
                          temp[e.index].qty = u.target.value;
                          temp[e.index].total =
                            temp[e.index].qty * temp[e.index].price;
                          updateSo({ inJasa: temp });
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
                  header="Harga Satuan"
                  style={{
                    width: "25rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.price && e.price}
                        onChange={(u) => {
                          let temp = [...inJasa];
                          temp[e.index].price = u.target.value;
                          temp[e.index].total =
                            temp[e.index].qty * temp[e.index].price;
                          updateSo({ inJasa: temp });
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
                  style={{
                    width: "25rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.disc && e.disc}
                        onChange={(u) => {
                          let temp = [...inJasa];
                          temp[e.index].disc = u.target.value;
                          updateSo({ inJasa: temp });
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
                    e.index === inJasa.length - 1 ? (
                      <Link
                        onClick={() => {
                          setInJasa([
                            ...inJasa,
                            {
                              jasa_id: null,
                              unit_id: null,
                              qty: null,
                              price: null,
                              disc: null,
                              nett_price: null,
                            },
                          ]);
                        }}
                        className="btn btn-primary shadow btn-xs sharp"
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          let temp = [...inJasa];
                          temp.splice(e.index, 1);
                          setInJasa(temp);
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
              <div className="d-flex col-12 align-items-center">
                <label className="mt-1 text-black fs-14">
                  {"Pisah Faktur"}
                </label>
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
              <label className="text-black fs-14">Sub Total</label>
            </div>

            <div className="col-6">
              <label className="text-black fs-14">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-black fs-14">DPP</label>
            </div>

            <div className="col-6">
              <label className="text-black fs-14">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-black fs-14">
                Pajak Atas Barang (11%)
              </label>
            </div>

            <div className="col-6">
              <label className="text-black fs-14">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-6 mt-3">
              <label className="text-black fs-14">Diskon Tambahan</label>
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
              <label className="text-black fs-15">
                <b>Total Pembayaran</b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-black fs-15">
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
                  <label className="text-black fs-14">Sub Total Jasa</label>
                </div>

                <div className="col-6 mt-4">
                  <label className="text-black fs-14">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">DPP Jasa</label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">
                    Pajak Atas Jasa (2%)
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-6 mt-3">
                  <label className="text-black fs-14">Diskon Tambahan</label>
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
                  <label className="text-black fs-15">
                    <b>Total Pembayaran</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-15">
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
            updateSo({ ...so, top: e.data.id });
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
            updateSo({ ...so, sup: e.data.id });
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
          getProduk();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowProduk(false);
            // updateSo({ ...so, ppn: e.data.id });
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
            // updateSo({ ...so, ppn: e.data.id });
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
            updateSo({ ...so, ppn: e.data.id });
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
            // updateSo({ ...so, ppn: e.data.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataCustomer
        data={customer}
        loading={false}
        popUp={true}
        show={showCustomer}
        onHide={() => {
          setShowCustomer(false);
        }}
        onInput={(e) => {
          setShowCustomer(!e);
        }}
        onSuccessInput={(e) => {
          getCustomer();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowCustomer(false);
            // updateSo({ ...so, cus_id: e.data.id });
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

export default InputSO;
