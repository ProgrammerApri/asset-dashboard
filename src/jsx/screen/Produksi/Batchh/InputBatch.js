import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_BTC } from "src/redux/actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import DataProduk from "../../Master/Produk/DataProduk";
import DataSatuan from "../../MasterLainnya/Satuan/DataSatuan";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "@material-ui/core";

const defError = {
  code: false,
  name: false,
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

const InputBatch = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const btc = useSelector((state) => state.btc.current);
  const isEdit = useSelector((state) => state.btc.editBtc);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [showProd, setShowProd] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [showDept, setShowDept] = useState(false);
  const [product, setProduct] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [formula, setFormula] = useState(null);
  const [planning, setPlanning] = useState(null);
  const [dept, setDept] = useState(null);
  const [error, setError] = useState(defError);
  const [accor, setAccor] = useState({
    produk: true,
    material: true,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getProduct();
    getSatuan();
    getFormula();
    getPlanning();
    getDept();
  }, []);

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

  const getFormula = async () => {
    const config = {
      ...endpoints.formula,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setFormula(data);
      }
    } catch (error) {}
  };

  const getPlanning = async () => {
    const config = {
      ...endpoints.planning,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setPlanning(data);
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

  const editBTC = async () => {
    const config = {
      ...endpoints.editBatch,
      endpoint: endpoints.editBatch.endpoint + btc.id,
      data: btc,
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

  const addBTC = async () => {
    const config = {
      ...endpoints.addBatch,
      data: btc,
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
            detail: `Kode ${btc.bcode} Sudah Digunakan`,
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

  const checkFor = (value) => {
    let selected = {};
    formula?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkPlan = (value) => {
    let selected = {};
    planning?.forEach((element) => {
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

  const onSubmit = () => {
    // if (isValid()) {
    if (isEdit) {
      setUpdate(true);
      editBTC();
    } else {
      setUpdate(true);
      addBTC();
    }
    // }
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

  const updateBTC = (e) => {
    dispatch({
      type: SET_CURRENT_BTC,
      payload: e,
    });
  };

  // const isValid = () => {
  //   let valid = false;
  //   let errors = {
  //     code: !forml.fcode || forml.fcode === "",
  //     name: !forml.fname || forml.fname === "",
  //     prod: [],
  //     mtrl: [],
  //   };

  //   forml?.product.forEach((element, i) => {
  //     if (i > 0) {
  //       if (element.prod_id || element.qty || element.aloc) {
  //         errors.prod[i] = {
  //           id: !element.prod_id,
  //           qty: !element.qty || element.qty === "" || element.qty === "0",
  //           aloc: !element.aloc || element.aloc === "" || element.aloc === "0",
  //         };
  //       }
  //     } else {
  //       errors.prod[i] = {
  //         id: !element.prod_id,
  //         qty: !element.qty || element.qty === "" || element.qty === "0",
  //         aloc: !element.aloc || element.aloc === "" || element.aloc === "0",
  //       };
  //     }
  //   });

  //   forml?.material.forEach((element, i) => {
  //     if (i > 0) {
  //       if (element.prod_id || element.qty || element.price) {
  //         errors.mtrl[i] = {
  //           id: !element.prod_id,
  //           qty: !element.qty || element.qty === "" || element.qty === "0",
  //           prc:
  //             !element.price || element.price === "" || element.price === "0",
  //         };
  //       }
  //     } else {
  //       errors.mtrl[i] = {
  //         id: !element.prod_id,
  //         qty: !element.qty || element.qty === "" || element.qty === "0",
  //         prc: !element.price || element.price === "" || element.price === "0",
  //       };
  //     }
  //   });

  //   if (!errors.prod[0]?.id && !errors.prod[0]?.qty && !errors.prod[0]?.aloc) {
  //     errors.mtrl?.forEach((e) => {
  //       for (var key in e) {
  //         e[key] = false;
  //       }
  //     });
  //   }

  //   if (!errors.mtrl[0]?.id && !errors.mtrl[0]?.qty && !errors.mtrl[0]?.prc) {
  //     errors.prod?.forEach((e) => {
  //       for (var key in e) {
  //         e[key] = false;
  //       }
  //     });
  //   }

  //   let validProduct = false;
  //   let validMtrl = false;
  //   errors.prod?.forEach((el) => {
  //     for (var k in el) {
  //       validProduct = !el[k];
  //     }
  //   });
  //   if (!validProduct) {
  //     errors.mtrl.forEach((el) => {
  //       for (var k in el) {
  //         validMtrl = !el[k];
  //       }
  //     });
  //   }

  //   valid = !errors.code && !errors.name && (validProduct || validMtrl);

  //   setError(errors);

  //   if (!valid) {
  //     window.scrollTo({
  //       top: 180,
  //       left: 0,
  //       behavior: "smooth",
  //     });
  //   }

  //   return valid;
  // };

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
            <PrimeInput
              label={"Kode Batch"}
              value={btc.fcode}
              onChange={(e) => {
                updateBTC({ ...btc, fcode: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode Batch"
              error={error?.code}
              //   disabled
            />
          </div>
          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Tanggal"}
              value={date}
              onChange={(e) => {
                setDate(e.value);
              }}
              //   placeholder="Pilih Tanggal"
              // showIcon
              dateFormat="dd-mm-yy"
              disabled
              error={error?.date}
            />
          </div>

          <div className="col-3 text-black">
            <label className="text-black">Departement</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={btc.dep_id && checkDept(btc.dep_id)}
              onChange={(e) => {
                updateBTC({ ...btc, dep_id: e.id });
              }}
              option={dept}
              detail
              onDetail={() => setShowDept(true)}
              label={"[ccost_name] ([ccost_code])"}
              placeholder="Pilih Departement"
            />
          </div>

          <div className="col-12 p-0 text-black">
            <div className="mt-4 mb-2 ml-3 mr-3 fs-13">
              <b>Informasi Planning</b>
            </div>
            <Divider className="mb-2 ml-3 mr-3"></Divider>
          </div>

          <div className="col-3">
            <label className="text-black">Kode Planning</label>
            <div className="p-inputgroup">
              <Dropdown
                value={btc.pl_id && checkPlan(btc.pl_id)}
                options={planning}
                onChange={(e) => {
                  updateBTC({ ...btc, pl_id: e.target.value });
                  let newError = error;
                  newError.code = false;
                  setError(newError);
                }}
                placeholder="Pilih Kode Planning"
                optionLabel="pcode"
                filter
                filterBy="pcode"
                error={error?.code}
              />
            </div>
          </div>

          <div className="col-9"></div>

          <div className="col-3 text-black">
            <PrimeInput
              label={"Nama Planning"}
              value={btc.fcode}
              onChange={(e) => {
                updateBTC({ ...btc, fcode: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Nama Planning"
              disabled
              error={error?.code}
            />
          </div>

          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Rencana Produksi"}
              value={null}
              onChange={(e) => {
                setDate(e.value);
              }}
              placeholder="Tanggal Planning"
              dateFormat="dd-mm-yy"
              disabled
              error={error?.date}
            />
          </div>

          <div className="col-2 text-black">
            <PrimeInput
              label={"Total Pembuatan"}
              value={btc.fname}
              // onChange={(e) => {
              //   updateBTC({ ...btc, fname: e.target.value });
              //   let newError = error;
              //   newError.name = false;
              //   setError(newError);
              // }}
              placeholder="200"
              disabled
            />
          </div>

          <div className="col-2">
            <label className="text-black">Satuan</label>
            <div className="p-inputgroup"></div>
            <InputText value={null} placeholder="Satuan Produksi" disabled />
          </div>

          <div className="col-12 p-0 text-black">
            <div className="mt-4 mb-2 ml-3 mr-3 fs-13">
              <b>Informasi Formula</b>
            </div>
            <Divider className="mb-2 ml-3 mr-3"></Divider>
          </div>

          <div className="col-3 text-black ">
            <label className="text-black">Kode Formula</label>
            <div className="p-inputgroup">
              <Dropdown
                value={btc.fcode}
                options={formula}
                onChange={(e) => {
                  updateBTC({ ...btc, fcode: e.target.value });
                  let newError = error;
                  newError.code = false;
                  setError(newError);
                }}
                placeholder="Pilih Kode Formula"
                optionLabel="fcode"
                filter
                filterBy="fcode"
                error={error?.code}
              />
            </div>
          </div>

          <div className="col-9"></div>

          <div className="col-3 text-black">
            <PrimeInput
              label={"Nama Formula"}
              value={btc.fname}
              onChange={(e) => {
                updateBTC({ ...btc, fname: e.target.value });
              }}
              placeholder="Masukan Nama Formula"
              disabled
            />
          </div>

          <div className="col-1 text-black">
            <PrimeNumber
              label={"Versi"}
              value={btc.version}
              onChange={(e) => {
                updateBTC({ ...btc, version: e.target.value });
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
              value={btc.rev}
              onChange={(e) => {
                updateBTC({ ...btc, rev: e.target.value });
              }}
              placeholder="0"
              type="number"
              min={0}
              disabled
            />
          </div>

          <div className="col-2 text-black">
            <PrimeInput
              label={"Tanggal Revisi"}
              value={formatDate(date)}
              onChange={(e) => {
                setDate(e.value);
              }}
              placeholder="Tanggal Revisi"
              disabled
            />
          </div>

          <div className="col-5 text-black">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputText
                value={btc.desc}
                onChange={(e) => updateBTC({ ...btc, desc: e.target.value })}
                placeholder="Masukan Keterangan"
              />
            </div>
          </div>
        </Row>

        <CustomAccordion
          tittle={"Produk"}
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
                value={btc.product?.map((v, i) => {
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
                  header="Produk Hasil Jadi"
                  className="align-text-top"
                  field={""}
                  style={{
                    width: "30rem",
                  }}
                  body={(e) => (
                    <CustomDropdown
                      value={e.prod_id && checkProd(e.prod_id)}
                      option={product}
                      onChange={(t) => {
                        let sat = [];
                        satuan.forEach((element) => {
                          if (element.id === t.unit.id) {
                            sat.push(element);
                          } else {
                            if (element.u_from?.id === t.unit.id) {
                              sat.push(element);
                            }
                          }
                        });
                        setSatuan(sat);

                        let temp = [...btc.product];
                        temp[e.index].prod_id = t.id;
                        temp[e.index].unit_id = t.unit?.id;
                        updateBTC({ ...btc, product: temp });

                        let newError = error;
                        newError.prod[e.index].id = false;
                        setError(newError);
                      }}
                      placeholder="Pilih Produk"
                      label={"[name]"}
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowProd(true);
                      }}
                      errorMessage="Produk Belum Dipilih"
                      error={error?.prod[e.index]?.id}
                    />
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
                    <CustomDropdown
                      value={e.unit_id && checkUnit(e.unit_id)}
                      onChange={(t) => {
                        let temp = [...btc.product];
                        temp[e.index].unit_id = t.id;
                        updateBTC({ ...btc, product: temp });
                      }}
                      option={satuan}
                      label={"[name]"}
                      placeholder="Pilih Satuan"
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowSatuan(true);
                      }}
                    />
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
                      onChange={(t) => {
                        let temp = [...btc.product];
                        temp[e.index].qty = t.target.value;
                        updateBTC({ ...btc, product: temp });

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
                      value={e.aloc && e.aloc}
                      onChange={(u) => {
                        let temp = [...btc.product];
                        temp[e.index].aloc = u.target.value;
                        updateBTC({ ...btc, product: temp });

                        let newError = error;
                        newError.prod[e.index].aloc = false;
                        setError(newError);
                      }}
                      placeholder="0"
                      type="number"
                      min={0}
                      error={error?.prod[e.index]?.aloc}
                    />
                  )}
                />

                <Column
                  className="align-text-top"
                  body={(e) =>
                    e.index === btc.product.length - 1 ? (
                      <Link
                        onClick={() => {
                          let newError = error;
                          newError.prod.push({ qty: false, aloc: false });
                          setError(newError);

                          updateBTC({
                            ...btc,
                            product: [
                              ...btc.product,
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
                        className="btn btn-primary shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          let temp = [...btc.product];
                          temp.splice(e.index, 1);
                          updateBTC({
                            ...btc,
                            product: temp,
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

        <CustomAccordion
          tittle={"Mesin"}
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
                value={btc.product?.map((v, i) => {
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
                  header="Kode Mesin"
                  className="align-text-top"
                  field={""}
                  style={{
                    width: "60rem",
                  }}
                  body={(e) => (
                    <CustomDropdown
                      value={e.prod_id && checkProd(e.prod_id)}
                      option={product}
                      onChange={(t) => {
                        let sat = [];
                        satuan.forEach((element) => {
                          if (element.id === t.unit.id) {
                            sat.push(element);
                          } else {
                            if (element.u_from?.id === t.unit.id) {
                              sat.push(element);
                            }
                          }
                        });
                        setSatuan(sat);

                        let temp = [...btc.product];
                        temp[e.index].prod_id = t.id;
                        temp[e.index].unit_id = t.unit?.id;
                        updateBTC({ ...btc, product: temp });

                        let newError = error;
                        newError.prod[e.index].id = false;
                        setError(newError);
                      }}
                      placeholder="Pilih Produk"
                      label={"[name]"}
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowProd(true);
                      }}
                      errorMessage="Produk Belum Dipilih"
                      error={error?.prod[e.index]?.id}
                    />
                  )}
                />

                <Column
                  header="Action"
                  //   paginatorClassName="text-align: right"
                  className="align-text-right"
                  field={""}
                  style={{
                    minWidth: "10rem",
                  }}
                  body={(e) => (
                    <PrimeNumber
                      value={e.aloc && e.aloc}
                      onChange={(u) => {
                        let temp = [...btc.product];
                        temp[e.index].aloc = u.target.value;
                        updateBTC({ ...btc, product: temp });

                        let newError = error;
                        newError.prod[e.index].aloc = false;
                        setError(newError);
                      }}
                      placeholder="0"
                      type="number"
                      min={0}
                      error={error?.prod[e.index]?.aloc}
                    />
                  )}
                />

                <Column
                  className="align-text-top"
                  body={(e) =>
                    e.index === btc.product.length - 1 ? (
                      <Link
                        onClick={() => {
                          let newError = error;
                          newError.prod.push({ qty: false, aloc: false });
                          setError(newError);

                          updateBTC({
                            ...btc,
                            product: [
                              ...btc.product,
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
                        className="btn btn-primary shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          let temp = [...btc.product];
                          temp.splice(e.index, 1);
                          updateBTC({
                            ...btc,
                            product: temp,
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

        <CustomAccordion
          tittle={"Bahan"}
          defaultActive={true}
          active={accor.material}
          onClick={() => {
            setAccor({
              ...accor,
              material: !accor.material,
            });
          }}
          key={1}
          body={
            <>
              <DataTable
                responsiveLayout="none"
                value={btc.material?.map((v, i) => {
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
                  header="Bahan Hasil Jadi"
                  className="align-text-top"
                  field={""}
                  style={{
                    width: "30rem",
                  }}
                  body={(e) => (
                    <CustomDropdown
                      value={e.prod_id && checkProd(e.prod_id)}
                      option={product}
                      onChange={(t) => {
                        let sat = [];
                        satuan.forEach((element) => {
                          if (element.id === t.unit.id) {
                            sat.push(element);
                          } else {
                            if (element.u_from?.id === t.unit.id) {
                              sat.push(element);
                            }
                          }
                        });
                        setSatuan(sat);

                        let temp = [...btc.material];
                        temp[e.index].prod_id = t.id;
                        temp[e.index].unit_id = t.unit?.id;
                        updateBTC({ ...btc, material: temp });

                        let newError = error;
                        newError.mtrl[e.index].id = false;
                        setError(newError);
                      }}
                      label={"[name]"}
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
                  style={{
                    width: "15rem",
                  }}
                  body={(e) => (
                    <CustomDropdown
                      value={e.unit_id && checkUnit(e.unit_id)}
                      onChange={(t) => {
                        let temp = [...btc.material];
                        temp[e.index].unit_id = t.id;
                        updateBTC({ ...btc, material: temp });
                      }}
                      option={satuan}
                      label={"[name]"}
                      placeholder="Pilih Satuan"
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowSatuan(true);
                      }}
                    />
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
                      onChange={(t) => {
                        let temp = [...btc.material];
                        temp[e.index].qty = t.target.value;
                        updateBTC({ ...btc, material: temp });

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
                  header="Harga"
                  className="align-text-top"
                  field={""}
                  // style={{
                  //   minWidth: "7rem",
                  // }}
                  body={(e) => (
                    <PrimeNumber
                      value={e.price ? e.price : ""}
                      onChange={(t) => {
                        let temp = [...btc.material];
                        temp[e.index].price = t.target.value;
                        updateBTC({ ...btc, material: temp });

                        let newError = error;
                        newError.mtrl[e.index].prc = false;
                        setError(newError);
                      }}
                      min={0}
                      placeholder="0"
                      type="number"
                      error={error?.mtrl[e.index]?.prc}
                    />
                  )}
                />

                <Column
                  className="align-text-top"
                  body={(e) =>
                    e.index === btc.material.length - 1 ? (
                      <Link
                        onClick={() => {
                          let newError = error;
                          newError.mtrl.push({ qty: false, prc: false });
                          setError(newError);

                          updateBTC({
                            ...btc,
                            material: [
                              ...btc.material,
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
                        className="btn btn-primary shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          let temp = [...btc.material];
                          temp.splice(e.index, 1);
                          updateBTC({
                            ...btc,
                            material: temp,
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
        <div className="row mb-8">
          <span className="mb-8"></span>
        </div>
      </>
    );
  };

  const getIndex = () => {
    let total = 0;
    btc?.product?.forEach((el) => {
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

            let temp = [...btc.product];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;

            let tempm = [...btc.material];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;
            updateBTC({ ...btc, product: temp, material: tempm });
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
            let temp = [...btc.product];
            temp[currentIndex].unit_id = e.data.id;

            let tempm = [...btc.material];
            tempm[currentIndex].unit_id = e.data.id;
            updateBTC({ ...btc, product: temp, material: tempm });
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

export default InputBatch;
