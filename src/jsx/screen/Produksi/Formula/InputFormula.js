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

import { SET_CURRENT_FM, SET_PRODUCT } from "src/redux/actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import DataProduk from "../../Master/Produk/DataProduk";
import DataSatuan from "../../MasterLainnya/Satuan/DataSatuan";
import { TabPanel, TabView } from "primereact/tabview";
import { Divider } from "@material-ui/core";

const defError = {
  code: false,
  name: false,
  date: false,
  prod: [
    {
      id: false,
      qty: false,
      aloc: false,
    },
  ],
  mtrl: [
    {
      id: false,
      qty: false,
      prc: false,
    },
  ],
};

const InputFormula = ({ onCancel, onSuccess }) => {
  const toast = useRef(null);
  const [error, setError] = useState(defError);
  const [update, setUpdate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doubleClick, setDoubleClick] = useState(false);
  const forml = useSelector((state) => state.forml.current);
  const isEdit = useSelector((state) => state.forml.editForml);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [showProd, setShowProd] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [reqForm, setReqForm] = useState(null);
  const product = useSelector((state) => state.product.list);
  const [satuan, setSatuan] = useState(null);
  const [active, setActive] = useState(0);
  const [state, setState] = useState(0);
  const [accor, setAccor] = useState({
    produk: true,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getReq();
    getProduct();
    getSatuan();
  }, []);

  const getReq = async () => {
    const config = {
      ...endpoints.recordAct,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setReqForm(data);

        console.log("===============");
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
        dispatch({
          type: SET_PRODUCT,
          payload: data,
        });
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

  const editFM = async () => {
    const config = {
      ...endpoints.editFormula,
      endpoint: endpoints.editFormula.endpoint + forml.id,
      data: forml,
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

  const addFM = async () => {
    const config = {
      ...endpoints.addFormula,
      data: { ...forml, date_created: currentDate(forml.date_created) },
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
            detail: `Kode ${forml.fcode} Sudah Digunakan`,
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

  const checkReq = (value) => {
    let selected = {};
    reqForm?.forEach((element) => {
      if (value === element.id) {
        selected = element;
        console.log(selected);
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

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editFM();
      } else {
        setUpdate(true);
        addFM();
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
      date.getMonth(),
      date.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );
    return newDate.toISOString();
  };

  const updateFM = (e) => {
    dispatch({
      type: SET_CURRENT_FM,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let active = 1;
    let errors = {
      code: !forml.fcode || forml.fcode === "",
      name: !forml.fname || forml.fname === "",
      date: !forml.date_created || forml.date_created === "",
      prod: [],
      mtrl: [],
    };
    let total = 0;

    forml?.product.forEach((element, i) => {
      if (i > 0) {
        if (element.prod_id || element.qty || element.aloc) {
          errors.prod[i] = {
            id: !element.prod_id,
            qty: !element.qty || element.qty === "" || element.qty === "0",
            aloc: !element.aloc || element.aloc === "" || element.aloc === "0",
          };
        }
      } else {
        errors.prod[i] = {
          id: !element.prod_id,
          qty: !element.qty || element.qty === "" || element.qty === "0",
          aloc: !element.aloc || element.aloc === "" || element.aloc === "0",
        };
      }

      total += Number(element.aloc);
    });
    console.log(total);
    setState(total !== 100);
    errors.prod.forEach((element) => {
      element.aloc = total !== 100;
    });

    forml?.material.forEach((element, i) => {
      if (i > 0) {
        if (element.prod_id || element.qty || element.price) {
          errors.mtrl[i] = {
            id: !element.prod_id,
            qty: !element.qty || element.qty === "" || element.qty === "0",
            prc:
              !element.price || element.price === "" || element.price === "0",
          };
        }
      } else {
        errors.mtrl[i] = {
          id: !element.prod_id,
          qty: !element.qty || element.qty === "" || element.qty === "0",
          prc: !element.price || element.price === "" || element.price === "0",
        };
      }
    });

    if (!errors.prod[0]?.id && !errors.prod[0]?.qty && !errors.prod[0]?.aloc) {
      errors.mtrl?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    if (!errors.mtrl[0]?.id && !errors.mtrl[0]?.qty && !errors.mtrl[0]?.prc) {
      errors.prod?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    let validProduct = false;
    let validMtrl = false;
    errors.prod?.forEach((el, i) => {
      for (var k in el) {
        validProduct = !el[k];
      }
    });
    if (!validProduct) {
      errors.mtrl.forEach((elem, i) => {
        for (var k in elem) {
          validMtrl = !elem[k];
          if (elem[k] && i < active) {
            active = 1;
          }
        }
      });
    }

    valid =
      !errors.code &&
      !errors.name &&
      !errors.date &&
      (validProduct || validMtrl);

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

  const formatIdr = (value) => {
    return `${value.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-3 text-black">
            <PrimeInput
              label={"Kode Formula"}
              value={forml.fcode}
              onChange={(e) => {
                updateFM({ ...forml, fcode: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode Formula"
              error={error?.code}
            />
          </div>
          <div className="col-4 text-black">
            <PrimeInput
              label={"Nama Formula"}
              value={forml.fname}
              onChange={(e) => {
                updateFM({ ...forml, fname: e.target.value });
                let newError = error;
                newError.name = false;
                setError(newError);
              }}
              placeholder="Masukan Nama Formula"
              error={error?.name}
            />
          </div>
          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${forml.date_created}Z`)}
              onChange={(e) => {
                updateFM({ ...forml, date_created: e.target.value });

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
          <div className="col-3"></div>
          <div className="col-2 text-black">
            <PrimeNumber
              label={"Versi"}
              value={forml.version}
              onChange={(e) => {
                updateFM({ ...forml, version: e.target.value });
              }}
              placeholder="0"
              type="number"
              min={0}
              disabled
            />
          </div>
          <div className="col-1 text-black">
            <PrimeNumber
              label={"Revisi"}
              value={forml.rev}
              onChange={(e) => {
                updateFM({ ...forml, rev: e.target.value });
              }}
              placeholder="0"
              type="number"
              min={0}
            />
          </div>
          <div className="col-2 text-black">
            <PrimeInput
              label={"Tanggal Revisi"}
              value={formatDate(date)}
              onChange={(e) => {
                updateFM({ ...forml, date_updated: e.target.value });
              }}
              placeholder="dd/mm/yyyy"
              disabled
            />
          </div>
          <div className="flex col-2 align-items-center mt-4">
            <label className="ml-0 mt-1 fs-12 text-black">
              <b>{"Aktif"}</b>
            </label>
            <InputSwitch
              className="ml-4"
              checked={forml && forml.active}
              onChange={(e) => {
                updateFM({ ...forml, active: e.target.value });
              }}
            />
          </div>
          <div className="col-5 text-black">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputText
                value={forml.desc}
                onChange={(e) => updateFM({ ...forml, desc: e.target.value })}
                placeholder="Masukan Keterangan"
              />
            </div>
          </div>
          <div className="col-12"></div>

          {forml.ra_id ? (
            <>
              <CustomAccordion
                tittle={"Product Request"}
                defaultActive={true}
                active={accor.produk}
                onClick={() => {
                  setAccor({
                    ...accor,
                    produk: !accor.produk,
                  });
                }}
                key={1}
                className="mt-3 ml-2 mr-2"
                body={
                  <>
                    <div className="row ml-0">
                      <div
                        className="col-3 text-black"
                        hidden={forml.ra_id === null}
                      >
                        <PrimeInput
                          label={"Kode Request Formula"}
                          value={
                            forml.ra_id ? checkReq(forml?.ra_id)?.ra_code : null
                          }
                          onChange={(e) => {
                            // updateFM({ ...forml, fname: e.target.value });
                            // let newError = error;
                            // newError.name = false;
                            // setError(newError);
                          }}
                          placeholder="Kode Request Formula"
                          disabled
                        />
                      </div>
                      <div
                        className="col-2 text-black"
                        hidden={forml.ra_id === null}
                      >
                        <PrimeCalendar
                          label={"Tanggal Request"}
                          value={
                            forml.ra_id
                              ? new Date(`${checkReq(forml?.ra_id)?.ra_date}Z`)
                              : null
                          }
                          onChange={(e) => {}}
                          placeholder="Tanggal Request"
                          dateFormat="dd-mm-yy"
                          disabled
                        />
                      </div>
                    </div>

                    <DataTable
                      responsiveLayout="none"
                      value={forml.req_form?.map((v, i) => {
                        return {
                          ...v,
                          index: i,
                          // order: v?.order ?? 0,
                        };
                      })}
                      className="display w-150 datatable-wrapper header-white no-border p-0"
                      showGridlines={false}
                      emptyMessage={() => <div></div>}
                    >
                      <Column
                        className="align-text-top"
                        style={{ width: "75rem" }}
                        field={""}
                        body={(e) => (
                          <PrimeInput
                            label={"Produk"}
                            value={
                              e.prod_id
                                ? `${checkProd(e?.prod_id)?.name} (${
                                    checkProd(e?.prod_id)?.code
                                  })`
                                : null
                            }
                            onChange={(e) => {}}
                            placeholder="Produk"
                            disabled
                          />
                        )}
                      />

                      <Column
                        className="align-text-top"
                        style={{ width: "35rem" }}
                        field={""}
                        body={(e) => (
                          <PrimeInput
                            label={"Satuan"}
                            value={
                              e.unit_id
                                ? `${checkUnit(e?.unit_id)?.name} (${
                                    checkUnit(e?.unit_id)?.code
                                  })`
                                : null
                            }
                            onChange={(e) => {}}
                            placeholder="Satuan"
                            disabled
                          />
                        )}
                      />
                    </DataTable>
                  </>
                }
              />
            </>
          ) : (
            <></>
          )}
        </Row>

        <TabView
          className="ml-2"
          activeIndex={active}
          onTabChange={(e) => setActive(e.index)}
        >
          <TabPanel header="Produk">
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="none"
                  value={forml.product?.map((v, i) => {
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
                    header="Nama Produk"
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <CustomDropdown
                        value={e.prod_id && checkProd(e.prod_id)}
                        option={product}
                        onChange={(u) => {
                          // looping satuan
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
                          // setSatuan(sat);

                          let temp = [...forml.product];
                          temp[e.index].prod_id = u.id;
                          temp[e.index].unit_id = u.unit?.id;
                          updateFM({ ...forml, product: temp });

                          let newError = error;
                          newError.prod[e.index].id = false;
                          setError(newError);
                        }}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowProd(true);
                        }}
                        label={"[name] ([code])"}
                        placeholder="Pilih Produk"
                        errorMessage="Produk Belum Dipilih"
                        error={error?.prod[e.index]?.id}
                      />
                    )}
                  />

                  <Column
                    header="Satuan"
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <CustomDropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        onChange={(u) => {
                          let temp = [...forml.product];
                          temp[e.index].unit_id = u.id;
                          updateFM({ ...forml, product: temp });
                        }}
                        option={satuan}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowSatuan(true);
                        }}
                        label={"[name] ([code])"}
                        placeholder="Pilih Satuan"
                      />
                    )}
                  />

                  <Column
                    header="Kuantitas"
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.qty && e.qty}
                        onChange={(u) => {
                          let temp = [...forml.product];
                          temp[e.index].qty = u.value;
                          updateFM({ ...forml, product: temp });

                          let newError = error;
                          newError.prod[e.index].qty = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        error={error?.prod[e.index]?.qty}
                      />
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
                      <PrimeNumber
                        price
                        value={e.aloc && e.aloc}
                        onChange={(u) => {
                          let temp = [...forml.product];
                          temp[e.index].aloc = u.value;
                          updateFM({ ...forml, product: temp });

                          let newError = error;
                          newError.prod[e.index].aloc = false;
                          setError(newError);
                          setState(false);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        error={error?.prod[e.index]?.aloc}
                        errorMessage={
                          state ? "Total Cost Alokasi Harus 100%" : null
                        }
                      />
                    )}
                  />

                  <Column
                    header=""
                    className="align-text-top"
                    field={""}
                    body={(e) =>
                      e.index === forml.product.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.prod.push({
                              qty: false,
                              aloc: false,
                            });
                            setError(newError);

                            updateFM({
                              ...forml,
                              product: [
                                ...forml.product,
                                {
                                  id: 0,
                                  prod_id: null,
                                  unit_id: null,
                                  qty: null,
                                  aloc: null,
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
                            let temp = [...forml.product];
                            temp.splice(e.index, 1);
                            updateFM({ ...forml, product: temp });
                          }}
                          className="btn btn-danger shadow btn-xs sharp"
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

          <TabPanel header="Bahan">
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="none"
                  value={forml.material?.map((v, i) => {
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
                    header="Nama Bahan"
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <CustomDropdown
                        value={e.prod_id && checkProd(e.prod_id)}
                        option={product}
                        onChange={(u) => {
                          // looping satuan
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
                          // setSatuan(sat);

                          let temp = [...forml.material];
                          temp[e.index].prod_id = u.id;
                          temp[e.index].unit_id = u.unit?.id;
                          temp[e.index].konv_qty = 0;
                          temp[e.index].unit_konv =
                            checkUnit(temp[e.index].unit_id)?.u_from !== null
                              ? checkUnit(temp[e.index].unit_id)?.u_from?.code
                              : checkUnit(temp[e.index].unit_id)?.code;
                          updateFM({ ...forml, material: temp });

                          let newError = error;
                          newError.mtrl[e.index].id = false;
                          setError(newError);
                        }}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowProd(true);
                        }}
                        label={"[name] ([code])"}
                        placeholder="Pilih Bahan"
                        errorMessage="Bahan Belum Dipilih"
                        error={error?.mtrl[e.index]?.id}
                      />
                    )}
                  />

                  <Column
                    header="Satuan"
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <CustomDropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        onChange={(u) => {
                          let temp = [...forml.material];
                          temp[e.index].unit_id = u.id;
                          temp[e.index].konv_qty = temp[e.index].qty * u?.qty;
                          temp[e.index].unit_konv = u?.u_from
                            ? u?.u_from?.code
                            : u?.code;
                          updateFM({ ...forml, material: temp });
                        }}
                        option={satuan}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowSatuan(true);
                        }}
                        label={"[name] ([code])"}
                        placeholder="Pilih Satuan"
                      />
                    )}
                  />

                  <Column
                    header="Kuantitas"
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.qty && e.qty}
                        onChange={(u) => {
                          let temp = [...forml.material];
                          temp[e.index].qty = u.value;

                          temp[e.index].konv_qty =
                            temp[e.index].qty *
                            checkUnit(temp[e.index].unit_id)?.qty;

                          updateFM({ ...forml, material: temp });

                          let newError = error;
                          newError.mtrl[e.index].qty = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        error={error?.mtrl[e.index]?.qty}
                      />
                    )}
                  />

                  <Column
                    header={"Konversi Qty"}
                    className="align-text-top"
                    style={{
                      minWidth: "8rem",
                    }}
                    field={""}
                    body={(e) => (
                      <>
                        <label className="ml-1">{`${formatIdr(
                          e?.konv_qty ?? 0
                        )} (${e?.unit_konv ?? ""})`}</label>
                      </>
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
                        value={e.price && e.price}
                        onChange={(u) => {
                          let temp = [...forml.material];
                          temp[e.index].price = u.value;
                          updateFM({ ...forml, material: temp });

                          let newError = error;
                          newError.mtrl[e.index].prc = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        min={0}
                        error={error?.mtrl[e.index]?.prc}
                        disabled
                      />
                    )}
                  />

                  <Column
                    header=""
                    className="align-text-top"
                    field={""}
                    body={(e) =>
                      e.index === forml.material.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.mtrl.push({
                              qty: false,
                              prc: false,
                            });
                            setError(newError);

                            updateFM({
                              ...forml,
                              material: [
                                ...forml.material,
                                {
                                  id: 0,
                                  prod_id: null,
                                  unit_id: null,
                                  qty: null,
                                  price: null,
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
                            let temp = [...forml.material];
                            temp.splice(e.index, 1);
                            updateFM({ ...forml, material: temp });
                          }}
                          className="btn btn-danger shadow btn-xs sharp"
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
        <div className="row mb-8">
          <span className="mb-8"></span>
        </div>
      </>
    );
  };

  const getIndex = () => {
    let total = 0;
    forml?.product?.forEach((el) => {
      total += el.length;
    });

    return total;
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div className="justify-content-left col-6">
          <div className="col-12 mt-0 ml-0 p-0 fs-12 text-left">
            {/* <label className="text-label">
              <b>Jumlah Produk : </b>
            </label>
            <span> {}</span>
            <label className="ml-8">
              <b>Jumlah Bahan : </b>
            </label>
            <span>{}</span> */}
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
            // setSatuan(sat);

            let temp = [...forml.product];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;

            let tempm = [...forml.material];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;
            updateFM({ ...forml, product: temp, material: tempm });
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
            let temp = [...forml.product];
            temp[currentIndex].unit_id = e.data.id;

            let tempm = [...forml.material];
            tempm[currentIndex].unit_id = e.data.id;
            updateFM({ ...forml, product: temp, material: tempm });
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

export default InputFormula;
