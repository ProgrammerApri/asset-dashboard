import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
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
  SET_CURRENT_RECACTIVITY,
  SET_ORIGINAL_PRODUCT,
  SET_PRODUCT,
} from "src/redux/actions";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import { SelectButton } from "primereact/selectbutton";
import endpoints from "../../../../../utils/endpoints";
import { tr } from "../../../../../data/tr";
import DataCustomer from "src/jsx/screen/Mitra/Pelanggan/DataCustomer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DataProdukMentah from "src/jsx/screen/Master/Produk/DataProdukMentah";

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

const tipe = [
  { name: "Stok", code: true },
  { name: "Non Stok", code: false },
];

const InputRA = ({ onCancel, onSuccess, onFail, onFailAdd }) => {
  const enterEvent = useRef();
  const profile = useSelector((state) => state.profile.profile);
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showDepartemen, setShowDepartemen] = useState(false);
  const [pusatBiaya, setPusatBiaya] = useState(null);
  const [setup, setSetup] = useState(null);
  const [showProduk, setShowProduk] = useState(false);
  const [showJasa, setShowJasa] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  // const product = useSelector((state) => state.product.list);
  const [product, setProd] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const recAct = useSelector((state) => state.recAct.current);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(defError);
  const isEdit = useSelector((state) => state.recAct.editRp);
  const dispatch = useDispatch();
  const [accor, setAccor] = useState({
    produk: true,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getPusatBiaya();
    getProduk();
    getSatuan();
    getCustomer();
    getSetup();
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
      ...endpoints.editRecordAct,
      endpoint: endpoints.editRecordAct.endpoint + recAct.id,
      data: recAct,
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
    let now = new Date();
    const config = {
      ...endpoints.addRecordAct,
      data: {
        ...recAct,
        ra_date: new Date(
          recAct.ra_date?.setHours(
            now.getHours(),
            now.getMinutes(),
            now.getSeconds()
          )
        ),
      },
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
      onFailAdd(error, recAct.ra_code);
    }
  };

  const onSubmit = () => {
    // if (isValid()) {
    if (isEdit) {
      setUpdate(true);
      editRp();
    } else {
      setUpdate(true);
      addRp();
    }
    // }
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
        let filt = [];
        data?.forEach((element) => {
          if (element.departement?.id === profile.previlage?.dep_id) {
            filt.push(element);
          }
        });
        setProd(filt);
        console.log("profile");
        console.log(filt);

        // dispatch({
        //   type: SET_PRODUCT,
        //   payload: filt,
        //   // .filter((v) => (v?.rec_act ? v?.rec_act === !ns : true)),
        // });
        // dispatch({
        //   type: SET_ORIGINAL_PRODUCT,
        //   payload: data.filter((v) => v?.group?.stock === !ns),
        // });
      }
    } catch (error) {
      console.log(error);
    }
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

  const getCustomer = async () => {
    const config = {
      ...endpoints.customer,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data?.forEach((element) => {
          filt.push(element.customer);
        });
        setCustomer(filt);
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

  const getSetup = async () => {
    const config = {
      ...endpoints.getCompany,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSetup(data);

        console.log("company");
        console.log(data);
      }
    } catch (error) {}
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

  const dept = (value) => {
    let selected = {};
    pusatBiaya?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkCus = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element?.id) {
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

  const updateRA = (e) => {
    dispatch({
      type: SET_CURRENT_RECACTIVITY,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !recAct.req_code || recAct.req_code === "",
      date: !recAct.req_date || recAct.req_date === "",
      sup: recAct.refrence ? !recAct.ref_sup : false,
      prod: [],
      jasa: [],
    };

    recAct?.rprod.forEach((element, i) => {
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

    recAct?.rjasa.forEach((element, i) => {
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
    let date = new Date(setup?.year_co, setup?.cutoff - 1, 31);
    return (
      <>
        <Toast ref={toast} />
        {/* Put content body here */}
        <Row className="mb-4">
          <div className="col-3">
            <PrimeInput
              label={"Kode Permintaan"}
              value={recAct.ra_code}
              onChange={(e) => {
                updateRA({ ...recAct, ra_code: e.target.value });
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
              value={new Date(`${recAct.ra_date}Z`)}
              onChange={(e) => {
                updateRA({ ...recAct, ra_date: e.value });
                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              dateFormat="dd-mm-yy"
              placeholder={tr[localStorage.getItem("language")].pilih_tgl}
              error={error?.date}
              minDate={date}
              showIcon
            />
          </div>

          <div className="col-6"></div>

          <div className="col-3">
            <label className="text-label">{"Calon Pelanggan"}</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={recAct.ra_cus !== null ? checkCus(recAct?.ra_cus) : null}
              onChange={(e) => {
                updateRA({ ...recAct, ra_cus: e?.id });
              }}
              option={customer}
              detail
              onDetail={() => setShowCustomer(true)}
              label={"[cus_name] ([cus_code])"}
              placeholder={tr[localStorage.getItem("language")].pilih}
            />
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].dep}
            </label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={recAct.ra_dep !== null ? dept(recAct.ra_dep) : null}
              onChange={(e) => {
                updateRA({ ...recAct, ra_dep: e.id });
              }}
              option={pusatBiaya}
              detail
              onDetail={() => setShowDepartemen(true)}
              label={"[ccost_name] ([ccost_code])"}
              placeholder={tr[localStorage.getItem("language")].pilih}
            />
          </div>

          <div className="col-6">
            <label className="text-label">
              {tr[localStorage.getItem("language")].ket}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={`${recAct?.ra_ket ?? ""}`}
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    ra_ket: e.target.value,
                  });
                  updateRA({ ...recAct, ra_ket: e.target.value });
                }}
                placeholder={tr[localStorage.getItem("language")].masuk}
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
                value={recAct.product?.map((v, i) => {
                  return {
                    ...v,
                    index: i,
                  };
                })}
                className="display w-150 datatable-wrapper header-white no-border"
                showGridlines={false}
                emptyMessage={() => <div></div>}
              >
                <Column
                  header={tr[localStorage.getItem("language")].prod}
                  className="align-text-top"
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={e.prod_id && checkProd(e.prod_id)}
                      option={product}
                      onChange={(u) => {
                        let sat = [];
                        satuan.forEach((element) => {
                          if (element.id === u.unit.id) {
                            sat.push(element);
                          } else {
                            if (element.u_from?.id === u.unit.id) {
                              sat.push(element);
                            }
                          }
                        });

                        let temp = [...recAct.product];
                        temp[e.index].prod_id = u.id;
                        temp[e.index].unit_id = u.unit?.id;
                        updateRA({ ...recAct, product: temp });

                        let newError = error;
                        newError.prod[e.index].id = false;
                        setError(newError);
                      }}
                      placeholder={tr[localStorage.getItem("language")].pilih}
                      label={"[name] ([code])"}
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowProduk(true);
                      }}
                      errorMessage="Produk Belum Dipilih"
                      error={error?.prod[e.index]?.id}
                    />
                  )}
                />

                <Column
                  header={tr[localStorage.getItem("language")].sat}
                  className="align-text-top"
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={e.unit_id && checkUnit(e.unit_id)}
                      onChange={(u) => {
                        let temp = [...recAct.product];
                        temp[e.index].unit_id = u.id;
                        updateRA({ ...recAct, product: temp });
                      }}
                      option={satuan}
                      label={"[name]"}
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowSatuan(true);
                      }}
                      placeholder={tr[localStorage.getItem("language")].pilih}
                    />
                  )}
                />

                <Column
                  header=""
                  className="align-text-top"
                  field={""}
                  body={(e) =>
                    e.index === recAct.product.length - 1 ? (
                      <Link
                        onClick={() => {
                          let newError = error;
                          newError.prod.push({ jum: false, prc: false });
                          setError(newError);

                          updateRA({
                            ...recAct,
                            product: [
                              ...recAct.product,
                              {
                                id: 0,
                                prod_id: null,
                                unit_id: null,
                              },
                            ],
                          });
                        }}
                        className="btn btn-primary shadow btn-xs sharp"
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          let temp = [...recAct.product];
                          temp.splice(e.index, 1);
                          updateRA({ ...recAct, product: temp });
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

        <div className="mb-8 col-12"></div>
        <div className="mb-8 col-12"></div>
        <div className="mb-8 col-12"></div>
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
            disabled={setup?.cutoff === null}
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
            updateRA({ ...recAct, ra_dep: e.data?.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataProdukMentah
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
              if (element.id === e.data?.unit?.id) {
                sat.push(element);
              } else {
                if (element.u_from?.id === e.data?.unit?.id) {
                  sat.push(element);
                }
              }
            });
            // setSatuan(sat);

            let temp = [...recAct.product];
            temp[currentIndex].prod_id = e.data?.id;
            temp[currentIndex].unit_id = e.data?.unit?.id;
            updateRA({ ...recAct, product: temp });
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
            let temp = [...recAct.product];
            temp[currentIndex].unit_id = e.data?.id;
            updateRA({ ...recAct, product: temp });
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
            updateRA({ ...recAct, ra_cus: e.data?.id });
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

export default InputRA;
