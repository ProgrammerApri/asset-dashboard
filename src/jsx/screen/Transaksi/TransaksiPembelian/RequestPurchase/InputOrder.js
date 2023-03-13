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
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
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
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { tr } from "src/data/tr";

const defError = {
  code: false,
  date: false,
  sup: false,
  prod: [
    {
      id: false,
      jum: false,
    },
  ],
  jasa: [
    {
      id: false,
      jum: false,
    },
  ],
};

const InputOrder = ({ onCancel, onSuccess, onFail, onFailAdd }) => {
  const enterEvent = useRef();
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
  const [comp, setComp] = useState(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const rp = useSelector((state) => state.rp.current);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(defError);
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
    getComp();
    getPusatBiaya();
    getProduk();
    getJasa();
    getSatuan();
    getSupplier();
  }, []);

  const getComp = async () => {
    const config = {
      ...endpoints.getCompany,
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
        setComp(data);
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
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editRp();
      } else {
        setUpdate(true);
        addRp();
      }
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

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !rp.req_code || rp.req_code === "",
      date: !rp.req_date || rp.req_date === "",
      sup: rp.refrence ? !rp.ref_sup : false,
      prod: [],
      jasa: [],
    };

    rp?.rprod.forEach((element, i) => {
      if (i > 0) {
        if (element.prod_id || element.request) {
          errors.prod[i] = {
            id: !element.prod_id,
            jum:
              !element.request ||
              element.request === "" ||
              element.request === "0",
          };
        }
      } else {
        errors.prod[i] = {
          id: !element.prod_id,
          jum:
            !element.request ||
            element.request === "" ||
            element.request === "0",
        };
      }
    });

    rp?.rjasa.forEach((element, i) => {
      if (i > 0) {
        if (element.jasa_id || element.request) {
          errors.jasa[i] = {
            id: !element.jasa_id,
            jum:
              !element.request ||
              element.request === "" ||
              element.request === "0",
          };
        }
      } else {
        errors.jasa[i] = {
          id: !element.jasa_id,
          jum:
            !element.request ||
            element.request === "" ||
            element.request === "0",
        };
      }
    });

    if (!errors.prod[0].id && !errors.prod[0].jum) {
      errors.jasa.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    if (!errors.jasa[0].id && !errors.jasa[0].jum) {
      errors.prod.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    let validProduct = false;
    let validJasa = false;
    errors.prod.forEach((el) => {
      for (var k in el) {
        validProduct = !el[k];
      }
    });
    if (!validProduct) {
      errors.jasa.forEach((el) => {
        for (var k in el) {
          validJasa = !el[k];
        }
      });
    }

    valid = !errors.code && !errors.date && (validProduct || validJasa);

    setError(errors);

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });
    }

    return valid;
  };

  const body = () => {
    let date = new Date(comp?.year_co, comp?.cutoff - 1, 31);
    return (
      <>
        <Toast ref={toast} />
        {/* Put content body here */}
        <Row className="mb-4">
          <div className="col-4">
            <PrimeInput
              label={tr[localStorage.getItem("language")].kd_req}
              value={rp.req_code}
              onChange={(e) => {
                updateRp({ ...rp, req_code: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              onKeyDown={(event) => {
                // console.log(event);
                // if (event.key.toLowerCase() === "enter") {
                //   var ev3 = document.createEvent('KeyboardEvent');
                //   ev3.initKeyEvent(
                //       'keypress', true, true, window, false, false, false, false, 9, 0);
                // }
              }}
              placeholder={tr[localStorage.getItem("language")].masuk}
              error={error?.code}
            />
          </div>

          <div className="col-2">
            <PrimeCalendar
              label={tr[localStorage.getItem("language")].tgl}
              value={new Date(`${rp.req_date}Z`)}
              onChange={(e) => {
                updateRp({ ...rp, req_date: e.value });
                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].pilih_tgl}
              error={error?.date}
              showIcon
              minDate={date}
            />
          </div>

          <div className="col-6"></div>

          <div className="col-4">
            <label className="text-label">
              {tr[localStorage.getItem("language")].dep}
            </label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={rp.req_dep !== null ? dept(rp.req_dep) : null}
              onChange={(e) => {
                updateRp({ ...rp, req_dep: e.id });
              }}
              option={pusatBiaya}
              detail
              onDetail={() => setShowDepartemen(true)}
              label={"[ccost_name] ([ccost_code])"}
              placeholder={tr[localStorage.getItem("language")].pilih}
            />
          </div>

          <div className="col-8">
            <label className="text-label">
              {tr[localStorage.getItem("language")].ket}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={`${rp?.req_ket ?? ""}`}
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    req_ket: e.target.value,
                  });
                  updateRp({ ...rp, req_ket: e.target.value });
                }}
                placeholder={tr[localStorage.getItem("language")].masuk}
              />
            </div>
          </div>
        </Row>

        <CustomAccordion
          tittle={`${tr[localStorage.getItem("language")].req} ${
            tr[localStorage.getItem("language")].prod
          }`}
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
                  <label className="text-label">{tr[localStorage.getItem("language")].prod}</label>
                </div>

                <div className="col-3">
                  <label className="text-label">{tr[localStorage.getItem("language")].req}</label>
                </div>

                <div className="col-4">
                  <label className="text-label">{tr[localStorage.getItem("language")].sat}</label>
                </div>

                <div className="col-12">
                  <Divider></Divider>
                </div>
              </div>

              {rp.rprod.map((v, i) => {
                return (
                  <div className="row col-12 mr-0 ml-0 mt-0">
                    <div className="col-4">
                      <div className="p-inputgroup"></div>
                      <CustomDropdown
                        value={v.prod_id && checkProd(v.prod_id)}
                        option={product}
                        detail
                        onDetail={() => {
                          setCurrentIndex(i);
                          setShowProduk(true);
                        }}
                        onChange={(e) => {
                          let sat = [];
                          satuan.forEach((element) => {
                            if (element.id === e.unit?.id) {
                              sat.push(element);
                            } else {
                              if (element.u_from?.id === e.unit?.id) {
                                sat.push(element);
                              }
                            }
                          });
                          // setSatuan(sat);

                          let temp = [...rp.rprod];
                          temp[i].prod_id = e.id;
                          temp[i].unit_id = e.unit?.id;
                          updateRp({ ...rp, rprod: temp });

                          let newError = error;
                          newError.prod[i].id = false;
                          setError(newError);
                        }}
                        label={"[name] ([code])"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        errorMessage="Produk Belum Dipilih"
                        error={error?.prod[i]?.id}
                      />
                    </div>

                    <div className="col-3">
                      <PrimeNumber
                        value={v.request && v.request}
                        onChange={(e) => {
                          console.log(e);
                          let temp = [...rp.rprod];
                          temp[i].request = e.target.value;
                          updateRp({ ...rp, rprod: temp });

                          let newError = error;
                          newError.prod[i].jum = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        type="number"
                        error={error?.prod[i]?.jum}
                      />
                    </div>

                    <div className="col-4">
                      <CustomDropdown
                        value={v.unit_id && checkUnit(v.unit_id)}
                        option={satuan}
                        detail
                        onDetail={() => {
                          setCurrentIndex(i);
                          setShowSatuan(true);
                        }}
                        onChange={(e) => {
                          let temp = [...rp.rprod];
                          temp[i].unit_id = e.id;
                          updateRp({ ...rp, rprod: temp });
                        }}
                        label={"[name]"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                      />
                    </div>

                    <div className="col-1 d-flex ml-0 mr-0">
                      <div className="mt-2">
                        {i === rp.rprod.length - 1 ? (
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

                              let newError = error;
                              newError.prod.push({ id: false, jum: false });
                              setError(newError);
                              console.log("shjsfj");
                              console.log(error);
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
                              let newError = error;
                              newError.prod.splice(i, 1);
                              setError(newError);
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
          tittle={`${tr[localStorage.getItem("language")].req} ${tr[localStorage.getItem("language")].jasa}`}
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
                  <label className="text-label">{tr[localStorage.getItem("language")].kd_jasa}</label>
                </div>

                <div className="col-3">
                  <label className="text-label">{tr[localStorage.getItem("language")].req}</label>
                </div>

                <div className="col-4">
                  <label className="text-label">{tr[localStorage.getItem("language")].sat}</label>
                </div>

                <div className="col-12">
                  <Divider></Divider>
                </div>
              </div>

              {rp.rjasa.map((v, i) => {
                return (
                  <div className="row col-12 mr-0 ml-0 mb-0">
                    <div className="col-4">
                      <div className="p-inputgroup"></div>
                      <CustomDropdown
                        value={v.jasa_id && jas(v.jasa_id)}
                        option={jasa}
                        detail
                        onDetail={() => {
                          setCurrentIndex(i);
                          setShowJasa(true);
                        }}
                        onChange={(e) => {
                          let temp = [...rp.rjasa];
                          temp[i].jasa_id = e.jasa.id;
                          updateRp({ ...rp, rjasa: temp });
                          let newError = error;
                          newError.jasa[i].id = false;
                          setError(newError);
                        }}
                        label={"[jasa.name] ([jasa.code])"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        errorMessage="Jasa Belum Dipilih"
                        error={error?.jasa[i]?.id}
                      />
                    </div>

                    <div className="col-3">
                      <PrimeNumber
                        value={v.qty && v.qty}
                        onChange={(e) => {
                          let temp = [...rp.rjasa];
                          temp[i].request = e.target.value;
                          updateRp({ ...rp, rjasa: temp });
                          let newError = error;
                          newError.jasa[i].jum = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        type="number"
                        error={error?.jasa[i]?.jum}
                      />
                    </div>

                    <div className="col-4">
                      <div className="p-inputgroup"></div>
                      <CustomDropdown
                        value={v.unit_id && checkUnit(v.unit_id)}
                        onChange={(e) => {
                          let temp = [...rp.rjasa];
                          temp[i].unit_id = e.id;
                          updateRp({ ...rp, rjasa: temp });
                        }}
                        option={satuan}
                        detail
                        onDetail={() => {
                          setCurrentIndex(i);
                          setShowSatuan(true);
                        }}
                        label={"[name]"}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                      />
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
                              let newError = error;
                              newError.jasa.push({ id: false, jum: false });
                              setError(newError);
                              console.log("shjsfj");
                              console.log(error);
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
                              let newError = error;
                              newError.prod.splice(i, 1);
                              setError(newError);
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
            <label className="ml-0 mt-1">{tr[localStorage.getItem("language")].ref_tambh}</label>
            <InputSwitch
              className="ml-4"
              checked={rp && rp.refrence}
              onChange={(e) => {
                updateRp({ ...rp, refrence: e.target.value });
              }}
            />
          </div>

          <div className="col-6">
            <label className="text-label">{tr[localStorage.getItem("language")].kd_pem}</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={rp.ref_sup !== null ? supp(rp.ref_sup) : null}
              onChange={(e) => {
                updateRp({ ...rp, ref_sup: e.supplier.id });
                setError({ ...error, sup: false });
              }}
              option={supplier}
              detail
              onDetail={() => setShowSupplier(true)}
              label={"[supplier.sup_name]"}
              placeholder={tr[localStorage.getItem("language")].pilih}
              disabled={rp && !rp.refrence}
              errorMessage="Supplier Belum Dipilih"
              error={error?.sup}
            />
          </div>

          <div className="col-6">
            <label className="text-label">{tr[localStorage.getItem("language")].ket}</label>
            <div className="p-inputgroup">
              <InputText
                value={rp.ref_ket}
                onChange={(e) => updateRp({ ...rp, ref_ket: e.target.value })}
                placeholder={tr[localStorage.getItem("language")].masuk}
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
            label={tr[localStorage.getItem("language")].batal}
            onClick={onCancel}
            className="p-button-text btn-primary"
          />
          <PButton
            label={tr[localStorage.getItem("language")].simpan}
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
          console.log(e);
          if (doubleClick) {
            setShowProduk(false);
            let sat = [];
            satuan.forEach((element) => {
              if (element.id === e.data.unit.id) {
                sat.push(element);
              } else {
                if (element.u_from?.id === e.data.unit.id) {
                  sat.push(element);
                }
              }
            });
            // setSatuan(sat);

            let temp = [...rp.rprod];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;
            updateRp({ ...rp, rprod: temp });
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
            let temp = [...rp.rjasa];
            temp[currentIndex].jasa_id = e.data.jasa.id;
            updateRp({ ...rp, rjasa: temp });
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
            let temp = [...rp.rprod];
            temp[currentIndex].unit_id = e.data.id;
            updateRp({ ...rp, rprod: temp });
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
