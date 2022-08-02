import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";

import { SET_CURRENT_FM } from "src/redux/actions";
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

const InputPenerimaanHJ = ({ onCancel, onSuccess }) => {
  // const [update, setUpdate] = useState(false);
  // const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useRef(null);
  const [dept, setDept] = useState(null);
  const [showDept, setShowDept] = useState(false);
  // const [doubleClick, setDoubleClick] = useState(false);
  const plan = useSelector((state) => state.plan.current);
  // const isEdit = useSelector((state) => state.plan.editPlan);
  // const dispatch = useDispatch();
  // const [date, setDate] = useState(new Date());
  // const [showProd, setShowProd] = useState(false);
  // const [showSatuan, setShowSatuan] = useState(false);
  const [showMsn, setShowMsn] = useState(false);
  // const [product, setProduct] = useState(null);
  // const [satuan, setSatuan] = useState(null);
  const [mesin, setMesin] = useState(null);
  const [formula, setFormula] = useState(null);
  const [error, setError] = useState(defError);
  // const [active, setActive] = useState(0);
  const [update, setUpdate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const forml = useSelector((state) => state.forml.current);
  const isEdit = useSelector((state) => state.forml.editForml);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [showProd, setShowProd] = useState(false);

  // const plan = useSelector((state) => state.plan.current);
  const [showSatuan, setShowSatuan] = useState(false);
  const [product, setProduct] = useState(null);
  const [satuan, setSatuan] = useState(null);
  // const [error, setError] = useState(defError);

  const [active, setActive] = useState(0);
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
      console.log(error);
      if (error.status === 400) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: `Kode ${forml.po_code} Sudah Digunakan`,
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
  const updatePL = (e) => {
    dispatch({});
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
  const checkDept = (value) => {
    let selected = {};
    dept?.forEach((element) => {
      if (value === element.id) {
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

    return [day, month, year].join("-");
  };

  const updateFM = (e) => {
    dispatch({
      type: SET_CURRENT_FM,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !forml.fcode || forml.fcode === "",
      name: !forml.fname || forml.fname === "",
      prod: [],
      mtrl: [],
    };

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
    errors.prod?.forEach((el) => {
      for (var k in el) {
        validProduct = !el[k];
      }
    });
    if (!validProduct) {
      errors.mtrl.forEach((el) => {
        for (var k in el) {
          validMtrl = !el[k];
        }
      });
    }

    valid = !errors.code && !errors.name && (validProduct || validMtrl);

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
          
        {/* <div className="col-0"></div> */}
          {/* <div className="col-12 text-black"></div> */}
          <div className="col-2 text-black">
            <PrimeInput
              label={"Kode Penerimaan Hasil Jadi"}
              value={forml.fname}
              onChange={(e) => {
                updateFM({ ...forml, fname: e.target.value });
                let newError = error;
                newError.name = false;
                setError(newError);
              }}
              placeholder="Batch-001"
              error={error?.name}
            />
          </div>

          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Tgl Penerimaan Hasil Jadi"}
              value={date}
              onChange={(e) => {
                setDate(e.value);
              }}
              placeholder="Pilih Tanggal"
              // disabled
              dateFormat="dd-mm-yy"
              showIcon
              error={error?.date}
            />
          </div>

          <div className="col-2 text-black">
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
          <div className="col-6 text-black"></div>
          <div className="col-2 text-black">
            <PrimeInput
              label={"Total Pembuatan"}
              value={forml.fcode}
              onChange={(e) => {
                updateFM({ ...forml, fcode: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="1xxxx"
              error={error?.code}
            />
          </div>
          

          <div className="col-12 p-0 text-black">
            <div className="mt-4 mb-2 ml-3 mr-3 fs-13">
              <b>Informasi Penerimaan Hasil Jadi</b>
            </div>
            <Divider className="mb-2 ml-3 mr-3"></Divider>
          </div>

          <div className="col-3 text-black">
            {/* <div className="col-1"> */}
            <label className="text-black">Kode Batch</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={forml.fcode}
              onChange={(e) => {
                updateFM({ ...forml, fcode: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Pilih "
              error={error?.code}
            />
          </div>
          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Tanggal Batch"}
              value={date}
              onChange={(e) => {
                setDate(e.value);
              }}
              placeholder="Pilih Tanggal"
              disabled
              dateFormat="dd-mm-yy"
              error={error?.date}
            />
          </div>
          <div className="col-4 text-black">
            <label className="text-black">Departement</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={checkDept()}
              onChange={(e) => {
                // updateBTC({ ...btc, dep_id: e.id });
              }}
              option={dept}
              detail
              onDetail={() => setShowDept(true)}
              label={"Pilih Departement)"}
              // placeholder="Pilih Departement"
            />
          </div>









         
          <div className="col-8 text-black"></div>

          {/* <div className="col-7"></div> */}
        </Row>

        <TabView activeIndex={active} onTabChange={(e) => setActive(e.index)}>
          <TabPanel header="Produk Jadi">
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
                          dprod: [
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

          <TabPanel header="Produk Reject">
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

export default InputPenerimaanHJ;
