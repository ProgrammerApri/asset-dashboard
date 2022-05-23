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

const InputPO = ({ onCancel, onSubmit, onSuccess }) => {
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
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });
            elem.rjasa.forEach(element => {
              element.jasa_id = element.jasa_id.id;
              element.unit_id = element.unit_id.id;
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
      ...endpoints.editPermintaan,
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
            detail: `Kode ${currentItem.customer.cus_code} Sudah Digunakan`,
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
                  console.log(e.value);
                  updatePo({ ...po, preq_id: e.value.id, rprod: e.value.rprod, rjasa:e.value.rjasa });
                }}
                optionLabel="req_code"
                placeholder="Pilih Kode Permintaan"
                itemTemplate={reqTemp}
                valueTemplate={valueReqTemp}
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Supplier</label>
            <div className="p-inputgroup">
              <Dropdown
                value={po.sup_id !== null ? dept(po.sup_id) : null}
                options={supplier}
                onChange={(e) => {
                  updatePo({ ...po, sup_id: e.value.id });
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
                value={po.po_code}
                onChange={(e) => updatePo({ ...po, po_code: e.target.value })}
                placeholder="Alamat Supplier"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label"></label>
            <div className="p-inputgroup mt-2">
              <InputText
                // value={
                //   currentItem !== null
                //     ? `${currentItem?.jasa?.name ?? ""}`
                //     : ""
                // }
                onChange={(e) =>
                  setCurrentItem({
                    // ...currentItem,
                    // jasa: { ...currentItem.jasa, name: e.target.value },
                  })
                }
                placeholder="Kontak Person"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Departemen</label>
            <div className="p-inputgroup mt-2">
              <Dropdown
                value={po.preq_id !== null ? dept(req_pur(po.preq_id)?.req_dep?.id) : null}
                options={pusatBiaya}
                // onChange={(e) => {
                //   updatePo({ ...po, req_dep: e.value?.id ?? "" });
                // }}
                optionLabel="ccost_name"
                placeholder="Pilih Departemen"
                itemTemplate={deptTemp}
                valueTemplate={valueDeptTemp}
              />
              <PButton
                onClick={() => {
                  setShowDept(true);
                }}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Ppn</label>
            <div className="p-inputgroup mt-2">
              <Dropdown
                value={po.sup_id !== null ? dept(po.sup_id) : null}
                options={ppn}
                onChange={(e) => {
                  updatePo({ ...po, sup_id: e.value.id });
                }}
                optionLabel="name"
                placeholder="Pilih Jenis Pajak"
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

          <div className="col-4">
            <label className="text-label">Syarat Pembayaran</label>
            <div className="p-inputgroup mt-2">
              <Dropdown
                value={po.top !== null ? rulPay(po.top) : null}
                options={rulesPay}
                onChange={(e) => {
                  updatePo({ ...po, top: e.value.id });
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
                value={new Date(`${po.req_date}Z`)}
                onChange={(e) => {
                  updatePo({ ...po, req_date: e.value });
                }}
                placeholder="Tanggal Permintaan"
                showIcon
                disabled
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Tanggal Jatuh Tempo</label>
            <div className="p-inputgroup mt-2">
              <Calendar
                // value={
                //   currentItem !== null
                //     ? `${currentItem?.jasa?.name ?? ""}`
                //     : ""
                // }
                onChange={(e) =>
                  setCurrentItem({
                    // ...currentItem,
                    // jasa: { ...currentItem.jasa, name: e.target.value },
                  })
                }
                placeholder="Tanggal Jatuh Tempo"
                showIcon
                disabled
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
            <Row className="justify-content-between">
              {po.rprod.map((v, i) => {
                return (
                  <div className="row mr-0 ml-0 justify-content-right col-12">
                    <div className="col-5">
                      <label className="text-label">Kode Produk</label>
                      <div className="p-inputgroup">
                        <Dropdown
                          // value={v.prod_id && checkProd(v.prod_id)}
                          options={product}
                          onChange={(e) => {
                            console.log(e.value);
                            // let temp = [...po.rprod];
                            // temp[i].preq_id = e.value.id;
                            // temp[i].unit_id = e.value.unit.id;
                            // updatePo({ ...po, rprod: temp });
                          }}
                          placeholder="Pilih Kode Produk"
                          valueTemplate={valueProd}
                          itemTemplate={prodTemp}
                        />
                        {/* <PButton
                        // onClick={() => {
                        //   setShowJenisPelanggan(true);
                        // }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton> */}
                      </div>
                    </div>

                    <div className="col-3">
                      <label className="text-label">Satuan</label>
                      <div className="p-inputgroup">
                        <Dropdown
                          // value={v.unit_id && checkUnit(v.unit_id)}
                          onChange={(e) => {
                            let temp = [...po.rprod];
                            temp[i].unit_id = e.value.id;
                            updatePo({ ...po, rprod: temp });
                          }}
                          options={satuan}
                          optionLabel="name"
                          placeholder="Pilih Satuan"
                        />
                        <PButton
                        // onClick={() => {
                        //   setShowJenisPelanggan(true);
                        // }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-1">
                      <label className="text-label">Permintaan</label>
                      <div className="p-inputgroup">
                        <InputText
                          value={v.request && v.request}
                          onChange={(e) => {
                            let temp = [...po.rprod];
                            temp[i].request = e.target.value;
                            updatePo({ ...po, rprod: temp });
                            console.log(temp);
                          }}
                          placeholder="0"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-1">
                      <label className="text-label">Pesanan</label>
                      <div className="p-inputgroup">
                        <InputText
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="0"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-1">
                      <label className="text-label">Sisa</label>
                      <div className="p-inputgroup">
                        <InputText
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="0"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-3">
                      <label className="text-label">Harga Satuan</label>
                      <div className="p-inputgroup">
                        <InputText
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="Masukan Harga Satuan"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-2">
                      <label className="text-label">Diskon</label>
                      <div className="p-inputgroup">
                        <InputText
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="Diskon"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-3">
                      <label className="text-label">Harga Nett</label>
                      <div className="p-inputgroup">
                        <InputText
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="Masukan Harga Nett"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-3">
                      <label className="text-label">Total Harga</label>
                      <div className="p-inputgroup">
                        <InputText
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="Masukan Total Harga"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-1 d-flex ml-0">
                      {i === po.rprod.length - 1 ? (
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
                            temp.splice(i, 1);
                            updatePo({
                              ...po,
                              rprod: temp,
                            });
                          }}
                          className="btn btn-danger shadow btn-xs sharp ml-1"
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </Row>
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
            <Row className="justify-content-between">
              {po.rjasa.map((v, i) => {
                return (
                  <div className="row mr-0 ml-0 justify-content-right col-12">
                    <div className="col-4">
                      <label className="text-label">Kode Supplier</label>
                      <div className="p-inputgroup">
                        <Dropdown
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="Pilih Kode Supplier"
                        />
                        <PButton
                        // onClick={() => {
                        //   setShowJenisPelanggan(true);
                        // }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-4">
                      <label className="text-label">Kode Jasa</label>
                      <div className="p-inputgroup">
                        <Dropdown
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="Pilih Kode Jasa"
                        />
                        <PButton
                        // onClick={() => {
                        //   setShowJenisPelanggan(true);
                        // }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-3">
                      <label className="text-label">Satuan</label>
                      <div className="p-inputgroup">
                        <Dropdown
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="Pilih Satuan"
                        />
                        <PButton
                        // onClick={() => {
                        //   setShowJenisPelanggan(true);
                        // }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-2">
                      <label className="text-label">Pesanan</label>
                      <div className="p-inputgroup">
                        <InputText
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="Jumlah Pesanan"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-3">
                      <label className="text-label">Harga Satuan</label>
                      <div className="p-inputgroup">
                        <InputText
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="Masukan Harga Satuan"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-2">
                      <label className="text-label">Diskon</label>
                      <div className="p-inputgroup">
                        <InputText
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="Diskon"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <label className="text-label">Total Harga</label>
                      <div className="p-inputgroup">
                        <InputText
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="Masukan Total Harga"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-1 d-flex ml-0">
                      {i === po.rjasa.length - 1 ? (
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
                      ) : (
                        <Link
                          onClick={() => {
                            let temp = [...po.rjasa];
                            temp.splice(i, 1);
                            updatePo({ ...po, rjasa: temp });
                          }}
                          className="btn btn-danger shadow btn-xs sharp ml-1"
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </Row>
          }
        />

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
                <b>Rp. </b>
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
