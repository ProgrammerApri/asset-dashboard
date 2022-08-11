import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_PL } from "src/redux/actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import DataProduk from "../../Master/Produk/DataProduk";
import DataSatuan from "../../MasterLainnya/Satuan/DataSatuan";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import { Dropdown } from "primereact/dropdown";
import DataMesin from "../Mesin/DataMesin";
import { TabPanel, TabView } from "primereact/tabview";
import { Divider } from "@material-ui/core";
import DataPusatBiaya from "../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import DataLokasi from "../../Master/Lokasi/DataLokasi";

const defError = {
  code: false,
  name: false,
  date: false,
  rp: false,
  dep: false,
  lok: false,
  fm: false,
  un: false,
  msn: [
    {
      id: false,
    },
  ],
};

const InputPlanning = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const plan = useSelector((state) => state.plan.current);
  const isEdit = useSelector((state) => state.plan.editPlan);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [showProd, setShowProd] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [showMsn, setShowMsn] = useState(false);
  const [showDept, setShowDept] = useState(false);
  const [showLok, setShowLok] = useState(false);
  const [product, setProduct] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [mesin, setMesin] = useState(null);
  const [formula, setFormula] = useState(null);
  const [dept, setDept] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [error, setError] = useState(defError);
  const [active, setActive] = useState(0);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getFormula();
    getMesin();
    getProduct();
    getSatuan();
    getDept();
    getLok();
  }, []);

  const getFormula = async () => {
    const config = {
      ...endpoints.formula,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((elem) => {
          let prod = [];
          elem.product.forEach((el) => {
            el.prod_id = el.prod_id.id;
            el.unit_id = el.unit_id.id;
            prod.push(el);
          });
          elem.product = prod;

          let mtrl = [];
          elem.material.forEach((element) => {
            element.prod_id = element.prod_id.id;
            element.unit_id = element.unit_id.id;
            mtrl.push(element);
          });
          elem.material = mtrl;
          filt.push(elem);
        });
        setFormula(filt);
      }
    } catch (error) {}
  };

  const getMesin = async () => {
    const config = {
      ...endpoints.mesin,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setMesin(data);
        console.log("jsdj");
        console.log(data);
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

  const getLok = async () => {
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

  const editPL = async () => {
    const config = {
      ...endpoints.editPlan,
      endpoint: endpoints.editPlan.endpoint + plan.id,
      data: plan,
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

  const addPL = async () => {
    const config = {
      ...endpoints.addPlan,
      data: { ...plan, date_planing: currentDate(plan.date_planing) },
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
            detail: `Kode ${plan.pcode} Sudah Digunakan`,
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

  const checkDept = (value) => {
    let selected = {};
    dept?.forEach((element) => {
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

  const checkFm = (value) => {
    let selected = {};
    formula?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkMsn = (value) => {
    let selected = {};
    mesin?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editPL();
      } else {
        setUpdate(true);
        addPL();
      }
    }
  };

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const currentDate = (date) => {
    let now = new Date();
    let newDate = new Date(
      date?.getFullYear(),
      date?.getMonth(),
      date?.getDate(),
      now?.getHours(),
      now?.getMinutes(),
      now?.getSeconds(),
      now?.getMilliseconds()
    );
    return newDate.toISOString();
  };

  const updatePL = (e) => {
    dispatch({
      type: SET_CURRENT_PL,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let active = 2;
    let errors = {
      code: !plan.pcode || plan.pcode === "",
      name: !plan.pname || plan.pname === "",
      date: !plan.date_planing || plan.date_planing === "",
      rp: !plan.total || plan.total === "",
      dep: !plan.dep_id,
      lok: !plan.loc_id,
      fm: !plan.form_id,
      un: !plan.unit,
      msn: [],
    };

    plan?.mesin.forEach((element, i) => {
      if (i > 0) {
        if (element.mch_id) {
          errors.msn[i] = {
            id: !element.mch_id,
          };
        }
      } else {
        errors.msn[i] = {
          id: !element.mch_id,
        };
      }
    });

    if (!errors.msn[0]?.id) {
      errors.msn?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    let validMesin = false;
    if (!validMesin) {
      errors.msn.forEach((el, i) => {
        for (var k in el) {
          validMesin = !el[k];
          if (el[k] && i < active) {
            active = 2;
          }
        }
      });
      console.log(active);
    }

    valid =
      !errors.code &&
      !errors.name &&
      !errors.date &&
      !errors.dep &&
      !errors.lok &&
      !errors.fm &&
      !errors.rp &&
      !errors.un &&
      validMesin;

    setError(errors);

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });

      setActive(active);
    }

    return valid;
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Pembelian (PO)</b>
        {/* <b>{isEdit ? "Edit" : "Buat"} Pembelian (PO)</b> */}
      </h4>
    );
  };

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Tanggal"}
              value={date}
              dateFormat="dd-mm-yy"
              disabled
            />
          </div>
          <div className="col-10"></div>
          <div className="col-2 text-black">
            <PrimeInput
              label={"Kode Planning"}
              value={plan.pcode}
              onChange={(e) => {
                updatePL({ ...plan, pcode: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode"
              error={error?.code}
            />
          </div>

          <div className="col-2 text-black">
            <PrimeInput
              label={"Nama Planning"}
              value={plan.pname}
              onChange={(e) => {
                updatePL({ ...plan, pname: e.target.value });
                let newError = error;
                newError.name = false;
                setError(newError);
              }}
              placeholder="Masukan Nama"
              error={error?.name}
            />
          </div>

          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Rencana Produksi"}
              value={new Date(`${plan.date_planing}Z`)}
              onChange={(e) => {
                updatePL({ ...plan, date_planing: e.target.value });

                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              placeholder="Pilih Tanggal"
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.date}
            />
          </div>

          <div className="col-3">
            <label className="text-black">Departement</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={plan.dep_id && checkDept(plan.dep_id)}
              option={dept}
              onChange={(e) => {
                updatePL({ ...plan, dep_id: e.id });
                let newError = error;
                newError.dep = false;
                setError(newError);
              }}
              placeholder="Pilih Departemen"
              detail
              onDetail={() => setShowDept(true)}
              label={"[ccost_name] - [ccost_code]"}
              errorMessage="Departemen Belum Dipilih"
              error={error?.dep}
            />
          </div>
          <div className="col-2"></div>
          <div className="col-2 text-black">
            <PrimeNumber
              label={"Rencana Pembuatan"}
              value={plan.total}
              onChange={(e) => {
                if (plan.form_id) {
                  plan.product.forEach((element) => {
                    element.qty = element.def_qty * Number(e.target.value);
                  });
                  plan.material.forEach((elem) => {
                    elem.qty = elem.def_qty * Number(e.target.value);
                  });
                }

                updatePL({ ...plan, total: e.target.value });
                let newError = error;
                newError.rp = false;
                setError(newError);
              }}
              placeholder="0"
              type="number"
              min={0}
              error={error?.rp}
            />
          </div>

          <div className="col-2">
            <label className="text-black">Satuan</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={plan.unit !== null ? checkUnit(plan.unit) : ""}
              option={satuan}
              onChange={(e) => {
                updatePL({ ...plan, unit: e.id });
                let newError = error;
                newError.un = false;
                setError(newError);
              }}
              placeholder="Pilih Satuan"
              detail
              onDetail={() => setShowSatuan(true)}
              label={"[name]"}
              errorMessage="Satuan Belum Dipilih"
              error={error?.un}
            />
          </div>

          <div className="col-3">
            <label className="text-black">Lokasi Gudang</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={plan.loc_id && checkLoc(plan.loc_id)}
              option={lokasi}
              onChange={(e) => {
                updatePL({ ...plan, loc_id: e.id });
                let newError = error;
                newError.lok = false;
                setError(newError);
              }}
              placeholder="Pilih Lokasi"
              detail
              onDetail={() => setShowLok(true)}
              label={"[name] - [code]"}
              errorMessage="Lokasi Belum Dipilih"
              error={error?.lok}
            />
          </div>

          {/* <div className="col-3"></div> */}

          <div className="col-12 p-0 text-black">
            <div className="mt-4 mb-2 ml-3 mr-3 fs-13">
              <b>Informasi Formula</b>
            </div>
            <Divider className="mb-2 ml-3 mr-3"></Divider>
          </div>

          {/* <div className="col-7"></div> */}
          <div className="col-3 text-black">
            <label className="text-black">Kode Formula</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={plan.form_id !== null ? checkFm(plan.form_id) : null}
              option={formula}
              onChange={(e) => {
                e.product.forEach((element) => {
                  element.def_qty = element.qty;
                });
                e.material.forEach((elem) => {
                  elem.def_qty = elem.qty;
                });

                if (plan.total) {
                  e.product.forEach((element) => {
                    element.qty = element.def_qty * plan.total;
                  });
                  e.material.forEach((elem) => {
                    elem.qty = elem.def_qty * plan.total;
                  });
                }

                updatePL({
                  ...plan,
                  form_id: e.id,
                  product: e.product,
                  material: e.material,
                });
                let newError = error;
                newError.fm = false;
                setError(newError);
              }}
              placeholder="Pilih Kode Formula"
              label={"[fcode]"}
              errorMessage="Formula Belum Dipilih"
              error={error?.fm}
            />
          </div>

          <div className="col-7"></div>

          <div className="col-3 text-black">
            <PrimeInput
              label={"Nama Formula"}
              value={plan.form_id !== null ? checkFm(plan.form_id)?.fname : ""}
              onChange={(e) => {}}
              placeholder="Masukan Nama Formula"
              disabled
            />
          </div>
          <div className="col-1 text-black">
            <PrimeNumber
              label={"Versi"}
              value={
                plan.form_id !== null ? checkFm(plan.form_id)?.version : ""
              }
              onChange={(e) => {}}
              placeholder="0"
              type="number"
              min={0}
              disabled
            />
          </div>
          <div className="col-1 text-black">
            <PrimeNumber
              label={"Revisi"}
              value={plan.form_id !== null ? checkFm(plan.form_id)?.rev : ""}
              onChange={(e) => {}}
              placeholder="0"
              type="number"
              min={0}
              disabled
            />
          </div>

          <div className="col-2 text-black">
            <label className="text-label">Tanggal Revisi</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  plan.form_id !== null
                    ? formatDate(checkFm(plan.form_id)?.date_updated)
                    : ""
                }
                placeholder="Tanggal Revisi"
                dateFormat="dd-mm-yyyy"
                disabled
              />
            </div>
          </div>
          <div className="col-5 text-black">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputText
                value={plan.desc}
                onChange={(e) => updatePL({ ...plan, desc: e.target.value })}
                placeholder="Masukan Keterangan"
              />
            </div>
          </div>

          {/* <div className="col-7"></div> */}
        </Row>

        {plan && plan.form_id !== null && (
          <>
            <TabView
              className="ml-2"
              activeIndex={active}
              onTabChange={(e) => setActive(e.index)}
            >
              <TabPanel header="Produk Jadi">
                <Card>
                  <Card.Body>
                    <DataTable
                      responsiveLayout="none"
                      value={plan.product?.map((v, i) => {
                        return {
                          ...v,
                          index: i,
                          // order: v?.order ?? 0,
                        };
                      })}
                      className="display w-150 datatable-wrapper header-white no-border"
                      showGridlines={false}
                      emptyMessage={() => <div></div>}
                    >
                      <Column
                        header="Produk"
                        className="align-text-top"
                        field={""}
                        style={{
                          width: "25rem",
                        }}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <InputText
                              value={e.prod_id && checkProd(e.prod_id).name}
                              placeholder="Nama Produk"
                              disabled
                            />
                          </div>
                        )}
                      />

                      <Column
                        header="Satuan"
                        className="align-text-top"
                        field={""}
                        style={{
                          width: "15rem",
                        }}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <InputText
                              value={e.unit_id && checkUnit(e.unit_id).name}
                              placeholder="Satuan Produk"
                              disabled
                            />
                          </div>
                        )}
                      />

                      <Column
                        header="Kuantitas"
                        className="align-text-top"
                        field={""}
                        // style={{
                        //   width: "5rem",
                        // }}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <InputText
                              value={e.qty && e.qty}
                              placeholder="0"
                              disabled
                            />
                          </div>
                        )}
                      />

                      <Column
                        header="Cost Alokasi (%)"
                        className="align-text-top"
                        field={""}
                        // style={{
                        //   minWidth: "7rem",
                        // }}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <InputText
                              value={e.aloc && e.aloc}
                              placeholder="0"
                              disabled
                            />
                          </div>
                        )}
                      />
                    </DataTable>
                  </Card.Body>
                </Card>
              </TabPanel>

              <TabPanel header="Bahan">
                <Card>
                  <Card.Body>
                    <DataTable
                      responsiveLayout="none"
                      value={plan.material?.map((v, i) => {
                        return {
                          ...v,
                          index: i,
                          // order: v?.order ?? 0,
                          // price: v?.price ?? 0,
                        };
                      })}
                      className="display w-150 datatable-wrapper header-white no-border"
                      showGridlines={false}
                      emptyMessage={() => <div></div>}
                    >
                      <Column
                        header="Bahan"
                        className="align-text-top"
                        field={""}
                        style={{
                          width: "25rem",
                        }}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <InputText
                              value={e.prod_id && checkProd(e.prod_id).name}
                              placeholder="Nama Produk"
                              disabled
                            />
                          </div>
                        )}
                      />

                      <Column
                        header="Satuan"
                        className="align-text-top"
                        field={""}
                        style={{
                          width: "15rem",
                        }}
                        body={(e) => (
                          <div className="p-inputgroup">
                            <InputText
                              value={e.unit_id && checkUnit(e.unit_id).name}
                              placeholder="Satuan Produk"
                              disabled
                            />
                          </div>
                        )}
                      />

                      <Column
                        header="Kuantitas"
                        className="align-text-top"
                        field={""}
                        // style={{
                        //   width: "5rem",
                        // }}
                        body={(e) => (
                          <PrimeNumber
                            value={e.qty ? e.qty : ""}
                            placeholder="0"
                            disabled
                          />
                        )}
                      />

                      <Column
                        header="Harga"
                        className="align-text-top"
                        field={""}
                        // style={{
                        //   minWidth: "7rem",
                        // }}
                        body={(e) => (
                          <PrimeNumber
                            price
                            value={e.price ? e.price : ""}
                            placeholder="0"
                            disabled
                          />
                        )}
                      />
                    </DataTable>
                  </Card.Body>
                </Card>
              </TabPanel>

              <TabPanel header="Mesin">
                <Card>
                  <Card.Body>
                    <DataTable
                      responsiveLayout="none"
                      value={plan.mesin?.map((v, i) => {
                        return {
                          ...v,
                          index: i,
                          // order: v?.order ?? 0,
                          // price: v?.price ?? 0,
                        };
                      })}
                      className="display w-150 datatable-wrapper header-white no-border"
                      showGridlines={false}
                      emptyMessage={() => <div></div>}
                    >
                      <Column
                        header="Kode Mesin"
                        className="align-text-top"
                        field={""}
                        style={{
                          width: "20rem",
                        }}
                        body={(e) => (
                          <CustomDropdown
                            value={e.mch_id && checkMsn(e.mch_id)}
                            option={mesin}
                            onChange={(t) => {
                              let temp = [...plan.mesin];
                              temp[e.index].mch_id = t.id;
                              updatePL({ ...plan, mesin: temp });

                              let newError = error;
                              newError.msn[e.index].id = false;
                              setError(newError);
                            }}
                            detail
                            onDetail={() => {
                              setCurrentIndex(e.index);
                              setShowMsn(true);
                            }}
                            label={"[msn_name]"}
                            placeholder="Pilih Mesin"
                            errorMessage="Mesin Belum Dipilih"
                            error={error?.msn[e.index]?.id}
                          />
                        )}
                      />

                      <Column
                        className="align-text-top"
                        body={(e) =>
                          e.index === plan.mesin.length - 1 ? (
                            <Link
                              onClick={() => {
                                updatePL({
                                  ...plan,
                                  mesin: [
                                    ...plan.mesin,
                                    {
                                      id: 0,
                                      mch_id: null,
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
                                let temp = [...plan.mesin];
                                temp.splice(e.index, 1);
                                updatePL({
                                  ...plan,
                                  mesin: temp,
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
                  </Card.Body>
                </Card>
              </TabPanel>
            </TabView>
          </>
        )}
      </>
    );
  };

  const getIndex = () => {
    let total = 0;
    plan?.product?.forEach((el) => {
      total += el.index;
    });

    return total;
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div className="justify-content-left col-6">
          <div className="col-12 mt-0 ml-0 p-0 fs-12 text-left">
            <label className="text-label">
              <b>Jumlah Produk : </b>
            </label>
            <span> {}</span>
            <label className="ml-8">
              <b>Jumlah Bahan : </b>
            </label>
            <span>{}</span>
          </div>
        </div>

        <div className="row justify-content-right col-6">
          <div className="col-12 mt-0 fs-12 text-right">
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
      </div>
    );
  };

  return (
    <>
      <Row>
        <Col className="pt-0">
          <>
            {/* {header()} */}
            {body()}
            {footer()}
          </>
        </Col>
      </Row>

      <DataMesin
        data={mesin}
        loading={false}
        popUp={true}
        show={showMsn}
        onHide={() => {
          setShowMsn(false);
        }}
        onInput={(e) => {
          setShowMsn(!e);
        }}
        onSuccessInput={(e) => {
          getMesin();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowMsn(false);
            let temp = [...plan.mesin];
            temp[currentIndex].mch_id = e.data.id;
            updatePL({ ...plan, mesin: temp });
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
        show={showProd}
        onHide={() => {
          setShowProd(false);
        }}
        onInput={(e) => {
          setShowProd(!e);
        }}
        onSuccessInput={(e) => {
          getProduct();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowProd(false);
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
            setSatuan(sat);

            let temp = [...plan.product];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;

            let tempm = [...plan.material];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;
            updatePL({ ...plan, product: temp, material: tempm });
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
            let temp = [...plan.product];
            temp[currentIndex].unit_id = e.data.id;

            let tempm = [...plan.material];
            tempm[currentIndex].unit_id = e.data.id;
            updatePL({
              ...plan,
              product: temp,
              material: tempm,
              unit: e.data.id,
            });
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
            updatePL({
              ...plan,
              dep_id: e.data.id,
            });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataLokasi
        data={lokasi}
        loading={false}
        popUp={true}
        show={showLok}
        onHide={() => {
          setShowLok(false);
        }}
        onInput={(e) => {
          setShowLok(!e);
        }}
        onSuccessInput={(e) => {
          getLok();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowLok(false);
            updatePL({
              ...plan,
              loc_id: e.data.id,
            });
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

export default InputPlanning;
