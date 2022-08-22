import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Dropdown, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";

import { SET_CURRENT_FM, SET_CURRENT_PHJ } from "src/redux/actions";
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
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";

const defError = {
  code: false,
  date: false,
  btc: false,
  rej: [{
    qty: false,
  }]
};

const InputPenerimaanHJ = ({ onCancel, onSuccess }) => {
  const toast = useRef(null);
  const [dept, setDept] = useState(null);
  const [showDept, setShowDept] = useState(false);
  const [showMsn, setShowMsn] = useState(false);
  const [mesin, setMesin] = useState(null);
  const [batch, setBatch] = useState(null);
  const [error, setError] = useState(defError);
  const [update, setUpdate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doubleClick, setDoubleClick] = useState(false);
  const phj = useSelector((state) => state.phj.current);
  const isEdit = useSelector((state) => state.phj.editPhj);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [showProd, setShowProd] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [product, setProduct] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getProduct();
    getSatuan();
    getBatch();
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

  const getBatch = async () => {
    const config = {
      ...endpoints.batch,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((elem) => {
          let prod = [];
          elem.plan_id.product.forEach((el) => {
            el.prod_id = el.prod_id.id;
            el.unit_id = el.unit_id.id;
            prod.push(el);
          });
          elem.plan_id.product = prod;
          filt.push(elem);
        });
        setBatch(filt);
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

  const editPHJ = async () => {
    const config = {
      ...endpoints.editPHJ,
      endpoint: endpoints.editPHJ.endpoint + phj.id,
      data: phj,
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

  const addPHJ = async () => {
    const config = {
      ...endpoints.addPHJ,
      data: { ...phj, phj_date: currentDate(phj.phj_date) },
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
            detail: `Kode ${phj.phj_code} Sudah Digunakan`,
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

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editPHJ();
      } else {
        setUpdate(true);
        addPHJ();
      }
    }
  };

  const checkbtc = (value) => {
    let selected = {};
    batch?.forEach((element) => {
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
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );
    return newDate.toISOString();
  };

  const updatePHJ = (e) => {
    dispatch({
      type: SET_CURRENT_PHJ,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let active = 1;
    let errors = {
      code: !phj.phj_code || phj.phj_code === "",
      date: !phj.phj_date || phj.phj_date === "",
      btc: !phj.batch_id,
    };

    valid = !errors.code && !errors.date && !errors.btc;

    setError(errors);

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });

      // setActive(active);
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

        <Row className="mb-3">
          <div className="col-3 text-black">
            <PrimeInput
              label={"Kode Penerimaan"}
              value={phj.phj_code}
              onChange={(e) => {
                updatePHJ({ ...phj, phj_code: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode"
              error={error?.code}
            />
          </div>

          <div className="col-2 text-black">
            <div className="ml-3"></div>
            <PrimeCalendar
              label={"Tgl Penerimaan"}
              value={new Date(`${phj.phj_date}Z`)}
              onChange={(e) => {
                updatePHJ({ ...phj, phj_date: e.target.value });

                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              placeholder="Pilih Tanggal"
              dateFormat="dd-mm-yy"
              showIcon
              error={error?.date}
            />
          </div>

          <div className="col-12 p-0 text-black">
            <div className="mt-4 mb-2 ml-3 mr-3 fs-13">
              <b>Informasi Batch</b>
            </div>
            <Divider className="mb-2 ml-3 mr-3"></Divider>
          </div>

          <div className="col-3 text-black">
            <label className="text-black">Kode Batch</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={phj.batch_id !== null ? checkbtc(phj.batch_id) : null}
              option={batch}
              onChange={(e) => {
                updatePHJ({
                  ...phj,
                  batch_id: e.id,
                  product: e.plan_id.product.map((v) => {
                    return { ...v, qty: "" };
                  }),
                  reject: e.plan_id.product.map((v) => {
                    return { ...v, qty: "" };
                  }),
                });
                let newError = error;
                newError.btc = false;
                // newError.prod[0].qty = false;
                setError(newError);
              }}
              label={"[bcode]"}
              placeholder="Pilih Kode Batch"
              errorMessage="Kode Batch Belum Dipilih"
              error={error?.btc}
            />
          </div>

          <div className="col-2 text-black">
            <PrimeInput
              label={"Tanggal Batch"}
              value={
                phj.batch_id !== null
                  ? formatDate(checkbtc(phj.batch_id)?.batch_date)
                  : ""
              }
              placeholder="Tanggal Batch"
              disabled
              dateFormat="dd-mm-yy"
            />
          </div>
          <div className="col-3 text-black">
            <PrimeInput
              label={"Departemen"}
              value={
                phj.batch_id !== null
                  ? checkbtc(phj.batch_id)?.dep_id?.ccost_name
                  : ""
              }
              placeholder="Departement"
              disabled
            />
          </div>

          {/* <div className="col-2 text-black"></div> */}
          <div className="col-2 text-black">
            <PrimeInput
              label={"Total Pembuatan"}
              value={
                phj.batch_id !== null
                  ? checkbtc(phj.batch_id)?.plan_id?.total
                  : ""
              }
              placeholder="Total Pembuatan"
              disabled
            />
          </div>
          <div className="col-2 text-black">
            <PrimeInput
              label={"Satuan Produksi"}
              value={
                phj.batch_id !== null
                  ? checkbtc(phj.batch_id)?.plan_id?.unit?.name
                  : ""
              }
              placeholder="Satuan Produksi"
              disabled
            />
          </div>

          <div className="col-8 text-black"></div>

          {/* <div className="col-7"></div> */}
        </Row>

        <TabView
          className="m-1"
          activeIndex={active}
          onTabChange={(e) => setActive(e.index)}
        >
          <TabPanel header="Produk Jadi">
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="none"
                  value={phj.product?.map((v, i) => {
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
                    className="col-5 align-text"
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

                          let temp = [...phj.product];
                          temp[e.index].prod_id = u.id;
                          temp[e.index].unit_id = u.unit?.id;
                          updatePHJ({ ...phj, product: temp });
                        }}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowProd(true);
                        }}
                        label={"[name]"}
                        placeholder="Pilih Produk"
                        disabled
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
                          let temp = [...phj.product];
                          temp[e.index].unit_id = u.id;
                          updatePHJ({ ...phj, product: temp });
                        }}
                        option={satuan}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowSatuan(true);
                        }}
                        label={"[name]"}
                        placeholder="Pilih Satuan"
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Jumlah"
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        value={e.qty && e.qty}
                        onChange={(u) => {
                          let temp = [...phj.product];
                          temp[e.index].qty = u.target.value;
                          updatePHJ({ ...phj, product: temp });
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                      />
                    )}
                  />
                </DataTable>
              </Card.Body>
            </Card>
          </TabPanel>

          <TabPanel header="Produk Reject">
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="none"
                  value={phj.reject?.map((v, i) => {
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
                    className="col-5 align-text"
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

                          let temp = [...phj.reject];
                          temp[e.index].prod_id = u.id;
                          temp[e.index].unit_id = u.unit?.id;
                          updatePHJ({ ...phj, reject: temp });
                        }}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowProd(true);
                        }}
                        label={"[name]"}
                        placeholder="Pilih Produk"
                        errorMessage="Produk Belum Dipilih"
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
                          let temp = [...phj.reject];
                          temp[e.index].unit_id = u.id;
                          updatePHJ({ ...phj, reject: temp });
                        }}
                        option={satuan}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowSatuan(true);
                        }}
                        label={"[name]"}
                        placeholder="Pilih Satuan"
                      />
                    )}
                  />

                  <Column
                    header="Jumlah"
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        value={e.qty && e.qty}
                        onChange={(u) => {
                          let temp = [...phj.reject];
                          temp[e.index].qty = u.target.value;
                          updatePHJ({ ...phj, reject: temp });
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                      />
                    )}
                  />

                  <Column
                    header=""
                    className=" align-text-top"
                    field={""}
                    body={(e) =>
                      e.index === phj.reject.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.rej.push({
                              qty: false,
                            });
                            setError(newError);

                            updatePHJ({
                              ...phj,
                              reject: [
                                ...phj.reject,
                                {
                                  id: 0,
                                  prod_id: null,
                                  unit_id: null,
                                  qty: null,
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
                            let temp = [...phj.reject];
                            temp.splice(e.index, 1);
                            updatePHJ({ ...phj, reject: temp });
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
    phj?.product?.forEach((el) => {
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
              <b>Saldo WIP : </b>
            </label>
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

            let temp = [...phj.product];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;

            let tempm = [...phj.reject];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;
            updatePHJ({ ...phj, product: temp, reject: tempm });
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
            let temp = [...phj.product];
            temp[currentIndex].unit_id = e.data.id;

            let tempm = [...phj.reject];
            tempm[currentIndex].unit_id = e.data.id;
            updatePHJ({ ...phj, product: temp, reject: tempm });
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
