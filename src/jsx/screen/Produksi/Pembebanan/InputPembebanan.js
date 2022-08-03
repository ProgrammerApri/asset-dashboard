import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import {
  SET_CURRENT_FM,
  SET_CURRENT_PL,
  UPDATE_CURRENT_FM,
} from "src/redux/actions";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
// import CustomAccordion from "src/jsx/components/Accordion/Accordion";
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
import { Card, Divider } from "@material-ui/core";
import { TabPanel, TabView } from "primereact/tabview";

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

const InputPembebanan = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useRef(null);
  const forml = useSelector((state) => state.forml.current);
  const [mesin, setMesin] = useState(null);
  const [active, setActive] = useState(0);
  const [doubleClick, setDoubleClick] = useState(false);
  const btc = useSelector((state) => state.btc.current);
  const isEdit = useSelector((state) => state.btc.editBtc);
  const dispatch = useDispatch();
  const [showMsn, setShowMsn] = useState(false);
  const [date, setDate] = useState(new Date());
  const plan = useSelector((state) => state.plan.current);
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
  const updatePL = (e) => {
    dispatch({
      type: SET_CURRENT_PL,
      payload: e,
    });
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
  const updateFM = (e) => {
    dispatch({
      type: SET_CURRENT_FM,
      payload: e,
    });
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
          {/* <div className="col-12"></div> */}
          <div className="col-2">
            <label className="text-black">Kode Pembebanan</label>
            <div className="p-inputgroup">
              <PrimeInput
                value={btc.pl_id && checkPlan(btc.pl_id)}
                options={planning}
                onChange={(e) => {
                  updateBTC({ ...btc, pl_id: e.target.value });
                  let newError = error;
                  newError.code = false;
                  setError(newError);
                }}
                placeholder="001-001xx"
                optionLabel="pcode"
                filter
                filterBy="pcode"
                error={error?.code}
              />
            </div>
          </div>
          <div className="col- text-black"></div>
          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Tgl Dibuat"}
              value={null}
              onChange={(e) => {
                setDate(e.value);
              }}
              placeholder="Pilih Tanggal"
              dateFormat="dd-mm-yy"
              //   disabled
              showIcon
              error={error?.date}
            />
          </div>

          <div className="col-6"></div>

          <div className="col-3 text-black">
            <PrimeInput
              label={"Nama Pembebanan"}
              value={btc.fcode}
              onChange={(e) => {
                updateBTC({ ...btc, fcode: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Nama Pembebanan"
              //   disabled
              error={error?.code}
            />
          </div>

          <div className="col-12 p-0 text-black">
            <div className="mt-4 mb-2 ml-3 mr-3 fs-13">
              <b>Informasi Batch</b>
            </div>
            <Divider className="mb-2 ml-3 mr-3"></Divider>
          </div>
          <div className="col-12"></div>

          <div className="col-2 text-black">
            <label className="text-black">Kode Batch</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
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
            <label className="text-black">Nama Batch</label>
            <div className="p-inputgroup"></div>
            <PrimeInput
              value={btc.fcode}
              onChange={(e) => {
                updateBTC({ ...btc, fcode: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Otomatis"
              error={error?.code}
              disabled
            />
          </div>
          {/* <div className="col-7"></div> */}
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
          {/* <div className="col-6 text-black"></div> */}

          <div className="col-9"></div>
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
          <div className="col-7"></div>
          <div className="col-3 text-black">
            <label className="text-black">Akun Kredit</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={null}
              onChange={(e) => {
                setDate(e.value);
              }}
              placeholder="Pilih Buku Rekening"
              //   dateFormat="dd-mm-yy"
              //   disabled
              error={error?.date}
            />
            {/* </div> */}
          </div>

          <div className="col-12"></div>

          {/* <Row className="mb-4"> */}

          {/* <div className="col-24"></div> */}
        </Row>

        <div className="col-12"></div>

        <TabView
          className="m-1"
          activeIndex={active}
          onTabChange={(e) => setActive(e.index)}
        >
          <TabPanel header="Upah">
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
                // header="Produk"
                className="col-5 align-text-top"
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
                      setSatuan(sat);

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
                    label={"[name]"}
                    placeholder="52000001 - Upah"
                    errorMessage="Produk Belum Dipilih"
                    error={error?.prod[e.index]?.id}
                  />
                )}
              />

              <div className="col-6"></div>

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
          </TabPanel>

          <TabPanel header="Overhead">
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
                // header="Produk"
                className="col-5 align-text-top"
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
                      setSatuan(sat);

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
                    label={"[name]"}
                    placeholder="5200000123- Overhead"
                    errorMessage="Produk Belum Dipilih"
                    error={error?.prod[e.index]?.id}
                  />
                )}
              />

              <div className="col-6"></div>

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

export default InputPembebanan;
