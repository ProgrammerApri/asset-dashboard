import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import CustomAccordion from "../../../Accordion/Accordion";
import DataPusatBiaya from "../../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import DataProduk from "../../../Master/Produk/DataProduk";
import DataJasa from "../../../Master/Jasa/DataJasa";
import DataSatuan from "../../../MasterLainnya/Satuan/DataSatuan";
import DataSupplier from "../../../Mitra/Pemasok/DataPemasok";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_CURRENT_RP,
  SET_PRODUCT,
  UPDATE_CURRENT_RP,
} from "src/redux/actions";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";

const InputOrder = ({ onCancel, onSuccess, onFail, onFailAdd }) => {
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [showDepartemen, setShowDepartemen] = useState(false);
  const [pusatBiaya, setPusatBiaya] = useState(null);
  const [jasa, setJasa] = useState(null);
  const [showProduk, setShowProduk] = useState(false);
  const [showJasa, setShowJasa] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [showSupplier, setShowSupplier] = useState(false);
  const product = useSelector((state) => state.product.product);
  const [satuan, setSatuan] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const rp = useSelector((state) => state.rp.current);
  const isEdit = useSelector((state) => state.rp.editRp);
  const dispatch = useDispatch();
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
    getPusatBiaya();
    getProduk();
    getJasa();
    getSatuan();
    getSupplier();
  }, []);

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

  const editRp = async () => {
    const config = {
      ...endpoints.editRp,
      endpoint: endpoints.editRp.endpoint + rp.id,
      data: rp,
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
      onFail();
    }
  };

  const addRp = async () => {
    const config = {
      ...endpoints.addRp,
      data: rp,
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
      onFailAdd(error, rp.req_code);
    }
  };

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editRp();
    } else {
      setUpdate(true);
      addRp();
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
        dispatch({
          type: SET_PRODUCT,
          payload: data,
        });
        console.log(product);
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

  const header = () => {
    return (
      <h4 className="mb-4">
        <b>Buat Permintaan</b>
      </h4>
    );
  };

  const prodTemp = (option) => {
    return (
      <div>{option !== null ? `${option.name} (${option.code})` : ""}</div>
    );
  };

  const clear = (option, props) => {
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

  const valueTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.jasa.name} (${option.jasa.code})` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const suppTemp = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.supplier.sup_name} (${option.supplier.sup_code})`
          : ""}
      </div>
    );
  };

  const valueSupTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.supplier.sup_name} (${option.supplier.sup_code})`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
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

  const jas = (value) => {
    let selected = {};
    jasa?.forEach((element) => {
      if (value === element.jasa.id) {
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

  const supp = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element.supplier.id) {
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

  const updateRp = (e) => {
    dispatch({
      type: SET_CURRENT_RP,
      payload: e,
    });
  };

  const body = () => {
    return (
      <>
        <Toast ref={toast} />
        {/* Put content body here */}
        <Row className="mb-4">
          <div className="col-4">
            <label className="text-label">Tanggal</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${rp.req_date}Z`)}
                onChange={(e) => {
                  updateRp({ ...rp, req_date: e.value });
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
                value={rp.req_code}
                onChange={(e) => updateRp({ ...rp, req_code: e.target.value })}
                placeholder="Masukan Kode Referensi"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Departemen</label>
            <div className="p-inputgroup">
              <Dropdown
                value={rp.req_dep !== null ? dept(rp.req_dep) : null}
                options={pusatBiaya}
                onChange={(e) => {
                  updateRp({ ...rp, req_dep: e.value.id });
                }}
                optionLabel="ccost_name"
                filter
                filterBy="ccost_name"
                placeholder="Pilih Departemen"
              />
              <PButton
                onClick={() => {
                  setShowDepartemen(true);
                }}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-12">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={`${rp?.req_ket ?? ""}`}
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    req_ket: e.target.value,
                  });
                  updateRp({ ...rp, req_ket: e.target.value });
                }}
                placeholder="Masukan Keterangan"
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
            <Row>
              <div className="row col-12 mr-0 ml-0">
                <div className="col-4">
                  <label className="text-label">Produk</label>
                </div>

                <div className="col-3">
                  <label className="text-label">Jumlah</label>
                </div>

                <div className="col-4">
                  <label className="text-label">Satuan</label>
                </div>

                <div className="col-12">
                  <Divider></Divider>
                </div>
              </div>

              {rp.rprod.map((v, i) => {
                return (
                  <div className="row col-12 mr-0 ml-0 mt-0">
                    <div className="col-4">
                      {/* <div className="p-inputgroup">
                        <Dropdown
                          value={v.prod_id && checkProd(v.prod_id)}
                          options={product}
                          onChange={(e) => {
                            console.log(e.value);
                            let temp = [...rp.rprod];
                            temp[i].prod_id = e.value.id;
                            temp[i].unit_id = e.value.unit?.id;
                            updateRp({ ...rp, rprod: temp });
                          }}
                          optionLabel="name"
                          filter
                          filterBy="name"
                          placeholder="Pilih Produk"
                          valueTemplate={clear}
                          itemTemplate={prodTemp}
                        />
                        <PButton
                          onClick={() => {
                            setShowProduk(true);
                          }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div> */}
                      <div className="p-inputgroup"></div>
                      <CustomDropdown
                        value={v.prod_id && checkProd(v.prod_id)}
                        option={product}
                        detail
                        onDetail={() => setShowProduk(true)}
                        onChange={(e) => {
                          let temp = [...rp.rprod];
                          temp[i].prod_id = e.id;
                          temp[i].unit_id = e.unit?.id;
                          updateRp({ ...rp, rprod: temp });
                        }}
                        label={"[name] ([code])"}
                        placeholder="Pilih Produk"
                      />
                    </div>

                    <div className="col-3">
                      <div className="p-inputgroup">
                        <InputText
                          value={v.request && v.request}
                          onChange={(e) => {
                            let temp = [...rp.rprod];
                            temp[i].request = e.target.value;
                            updateRp({ ...rp, rprod: temp });
                            console.log(temp);
                          }}
                          placeholder="Masukan Jumlah"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="p-inputgroup">
                        <Dropdown
                          value={v.unit_id && checkUnit(v.unit_id)}
                          onChange={(e) => {
                            let temp = [...rp.rprod];
                            temp[i].unit_id = e.value.id;
                            updateRp({ ...rp, rprod: temp });
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
                    </div>

                    <div className="col-1 d-flex ml-0 mr-0">
                      <div className="mt-2">
                        {i == rp.rprod.length - 1 ? (
                          <Link
                            onClick={() => {
                              updateRp({
                                ...rp,
                                rprod: [
                                  ...rp.rprod,
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
                              let temp = [...rp.rprod];
                              temp.splice(i, 1);
                              updateRp({
                                ...rp,
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
            <Row>
              <div className="row col-12 mr-0 ml-0 mb-0">
                <div className="col-4">
                  <label className="text-label">Kode Jasa</label>
                </div>

                <div className="col-3">
                  <label className="text-label">Jumlah</label>
                </div>

                <div className="col-4">
                  <label className="text-label">Satuan</label>
                </div>

                <div className="col-12">
                  <Divider></Divider>
                </div>
              </div>

              {rp.rjasa.map((v, i) => {
                return (
                  <div className="row col-12 mr-0 ml-0 mb-0">
                    <div className="col-4">
                      <div className="p-inputgroup">
                        <Dropdown
                          value={v.jasa_id && jas(v.jasa_id)}
                          options={jasa}
                          onChange={(e) => {
                            let temp = [...rp.rjasa];
                            temp[i].jasa_id = e.value.jasa.id;
                            updateRp({ ...rp, rjasa: temp });
                          }}
                          optionLabel="jasa.name"
                          filter
                          filterBy="jasa.name"
                          placeholder="Pilih Jasa"
                          valueTemplate={valueTemp}
                          itemTemplate={jasTemp}
                        />
                        <PButton
                          onClick={() => {
                            setShowJasa(true);
                          }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-3">
                      <div className="p-inputgroup">
                        <InputText
                          value={v.qty && v.qty}
                          onChange={(e) => {
                            let temp = [...rp.rjasa];
                            temp[i].request = e.target.value;
                            updateRp({ ...rp, rjasa: temp });
                          }}
                          placeholder="Masukan Jumlah"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="p-inputgroup">
                        <Dropdown
                          value={v.unit_id && checkUnit(v.unit_id)}
                          onChange={(e) => {
                            let temp = [...rp.rjasa];
                            temp[i].unit_id = e.value.id;
                            updateRp({ ...rp, rjasa: temp });
                          }}
                          options={satuan}
                          optionLabel="name"
                          filter
                          filterBy="name"
                          placeholder="Pilih Jasa"
                        />
                        <PButton
                          onClick={() => {
                            setShowSatuan(true);
                          }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-1 d-flex ml-0">
                      <div className="mt-2">
                        {i === rp.rjasa.length - 1 ? (
                          <Link
                            onClick={() => {
                              updateRp({
                                ...rp,
                                rjasa: [
                                  ...rp.rjasa,
                                  {
                                    id: 0,
                                    jasa_id: null,
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
                              let temp = [...rp.rjasa];
                              temp.splice(i, 1);
                              updateRp({ ...rp, rjasa: temp });
                            }}
                            className="btn btn-danger shadow btn-xs sharp ml-1"
                          >
                            <i className="fa fa-trash"></i>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Row>
          }
        />

        <div className="row mb-0">
          <div className="d-flex col-12 align-items-center mt-4">
            <label className="ml-0 mt-1">{"Referensi Tambahan"}</label>
            <InputSwitch
              className="ml-4"
              checked={rp && rp.refrence}
              onChange={(e) => {
                updateRp({ ...rp, refrence: e.target.value });
              }}
            />
          </div>

          <div className="col-6">
            <label className="text-label">Kode Supplier</label>
            <div className="p-inputgroup">
              <Dropdown
                value={rp.ref_sup !== null ? supp(rp.ref_sup) : null}
                options={supplier}
                onChange={(e) => {
                  updateRp({ ...rp, ref_sup: e.value.supplier.id });
                }}
                optionLabel="ref_sup.sup_name"
                filter
                filterBy="ref_sup.sup_name"
                placeholder="Pilih Supplier"
                itemTemplate={suppTemp}
                valueTemplate={valueSupTemp}
                disabled={rp && !rp.refrence}
              />
              <PButton
                onClick={() => {
                  setShowSupplier(true);
                }}
                disabled={currentItem && !currentItem.refrence}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={rp.ref_ket}
                onChange={(e) => updateRp({ ...rp, ref_ket: e.target.value })}
                placeholder="Masukan Keterangan"
                disabled={rp && !rp.refrence}
              />
            </div>
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
          setShowDepartemen(false);
        }}
        onInput={(e) => {
          setShowDepartemen(!e);
        }}
        onSuccessInput={(e) => {
          getPusatBiaya();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowDepartemen(false);
            updateRp({ ...rp, req_dep: e.data.id });
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
            updateRp({ ...rp, rprod: e.data.id });
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
            updateRp({ ...rp, rjasa: e.data.id });
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
          getJasa();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSatuan(false);
            updateRp({ ...rp, unit_id: e.data.id });
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
          getJasa();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSupplier(false);
            updateRp({ ...rp, ref_sup: e.data.id });
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
