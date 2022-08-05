import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_BTC } from "src/redux/actions";
import { SET_CURRENT_FM } from "src/redux/actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { Divider } from "@material-ui/core";
import { TabPanel, TabView } from "primereact/tabview";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import DataProduk from "../../Master/Produk/DataProduk";
import DataSatuan from "../../MasterLainnya/Satuan/DataSatuan";

const defError = {
  code: false,
  date: false,
  pl: false,
};

const InputBatch = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const plan = useSelector((state) => state.plan.current);
  const [mesin, setMesin] = useState(null);
  const forml = useSelector((state) => state.forml.current);
  const [active, setActive] = useState(0);
  const [doubleClick, setDoubleClick] = useState(false);
  const btc = useSelector((state) => state.btc.current);
  const isEdit = useSelector((state) => state.btc.editBtc);
  const dispatch = useDispatch();
  const [showSatuan, setShowSatuan] = useState(false);
  const [date, setDate] = useState(new Date());
  const [product, setProduct] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [formula, setFormula] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProd, setShowProd] = useState(false);
  const [planning, setPlanning] = useState(null);
  const [dept, setDept] = useState(null);
  const [error, setError] = useState(defError);

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
    getMesin();
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

  const checkMsn = (value) => {
    let selected = {};
    mesin?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const updateFM = (e) => {
    dispatch({
      type: SET_CURRENT_FM,
      payload: e,
    });
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

          let msn = [];
          elem.mesin.forEach((el) => {
            el.mch_id = el.mch_id.id;
            msn.push(el);
          });
          elem.mesin = msn;
          filt.push(elem);
        });
        setPlanning(filt);
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

  const getMesin = async () => {
    const config = {
      ...endpoints.mesin,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setMesin(data);
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
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editBTC();
      } else {
        setUpdate(true);
        addBTC();
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

  const updateBTC = (e) => {
    dispatch({
      type: SET_CURRENT_BTC,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !btc.bcode || btc.bcode === "",
      date: !btc.batch_date || btc.batch_date === "",
      pl: !btc.plan_id,
    };

    valid = !errors.code && !errors.date && !errors.pl;

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
          <div className="col-2 text-black">
            <PrimeInput
              label={"Kode Batch"}
              value={btc.bcode}
              onChange={(e) => {
                updateBTC({ ...btc, bcode: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode Batch"
              error={error?.code}
            />
          </div>
          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${btc.batch_date}Z`)}
              onChange={(e) => {
                updateBTC({ ...btc, batch_date: e.target.value });

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

          <div className="col-12 p-0 text-black">
            <div className="mt-4 mb-2 ml-3 mr-3 fs-13">
              <b>Informasi Planning</b>
            </div>
            <Divider className="mb-2 ml-3 mr-3"></Divider>
          </div>

          <div className="col-3">
            <PrimeDropdown
              label={"Kode Planning"}
              value={btc.plan_id && checkPlan(btc.plan_id)}
              options={planning}
              onChange={(e) => {
                updateBTC({
                  ...btc,
                  plan_id: e.value.id,
                  form_id: e.value.form_id?.id,
                  product: e.value.product,
                  material: e.value.material,
                  mesin: e.value.mesin,
                });
                let newError = error;
                newError.pl = false;
                setError(newError);
              }}
              placeholder="Pilih Kode Planning"
              optionLabel="pcode"
              errorMessage="Kode Planning Belum Dipilih"
              error={error?.pl}
            />
          </div>

          <div className="col-9"></div>

          <div className="col-3 text-black">
            <PrimeInput
              label={"Nama Planning"}
              value={btc.plan_id !== null ? checkPlan(btc.plan_id)?.pname : ""}
              placeholder="Masukan Nama Planning"
              disabled
            />
          </div>
          <div className="col-3 text-black">
            <label className="text-black">Departement</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  btc.plan_id && checkPlan(btc.plan_id)?.dep_id?.ccost_name
                }
                placeholder="Departement"
                disabled
              />
            </div>
          </div>

          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Rencana Produksi"}
              value={
                btc.plan_id !== null
                  ? new Date(`${checkPlan(btc.plan_id)?.date_planing}Z`)
                  : ""
              }
              placeholder="Tanggal Planning"
              dateFormat="dd-mm-yy"
              disabled
            />
          </div>

          <div className="col-2 text-black">
            <PrimeInput
              label={"Total Pembuatan"}
              value={btc.plan_id !== null ? checkPlan(btc.plan_id)?.total : ""}
              placeholder="Total Pembuatan"
              disabled
            />
          </div>

          <div className="col-2">
            <label className="text-black">Satuan</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  btc.plan_id !== null ? checkPlan(btc.plan_id)?.unit?.name : ""
                }
                placeholder="Satuan Produksi"
                disabled
              />
            </div>
          </div>

          {btc && btc.plan_id !== null && (
            <>
              <div className="col-12 p-0 text-black">
                <div className="mt-4 mb-2 ml-3 mr-3 fs-13">
                  <b>Informasi Formula</b>
                </div>
                <Divider className="mb-2 ml-3 mr-3"></Divider>
              </div>

              <div className="col-3 text-black ">
                <PrimeInput
                  label={"Kode Formula"}
                  value={
                    btc.plan_id !== null
                      ? checkPlan(btc.plan_id)?.form_id?.fcode
                      : ""
                  }
                  placeholder="Kode Formula"
                  disabled
                />
              </div>

              <div className="col-9"></div>

              <div className="col-3 text-black">
                <PrimeInput
                  label={"Nama Formula"}
                  value={
                    btc.plan_id !== null
                      ? checkPlan(btc.plan_id)?.form_id?.fname
                      : ""
                  } 
                  placeholder="Nama Formula"
                  disabled
                />
              </div>

              <div className="col-1 text-black">
                <PrimeNumber
                  label={"Versi"}
                  value={
                    btc.plan_id !== null
                      ? checkPlan(btc.plan_id)?.form_id?.version
                      : ""
                  }
                  placeholder="0"
                  type="number"
                  min={0}
                  disabled
                />
              </div>

              <div className="col-1 text-black">
                <PrimeNumber
                  label={"Revisi"}
                  value={
                    btc.plan_id !== null
                      ? checkPlan(btc.plan_id)?.form_id?.rev
                      : ""
                  }
                  placeholder="0"
                  type="number"
                  min={0}
                  disabled
                />
              </div>

              <div className="col-2 text-black">
                <PrimeInput
                  label={"Tanggal Revisi"}
                  value={
                    btc.plan_id !== null
                      ? formatDate(
                          checkPlan(btc.plan_id)?.form_id?.date_updated
                        )
                      : ""
                  }
                  placeholder="Tanggal Revisi"
                  disabled
                />
              </div>

              <div className="col-5 text-black">
                <label className="text-label">Keterangan</label>
                <div className="p-inputgroup">
                  <InputText
                    value={btc.desc}
                    onChange={(e) =>
                      updateBTC({ ...btc, desc: e.target.value })
                    }
                    placeholder="Masukan Keterangan"
                  />
                </div>
              </div>
            </>
          )}
        </Row>

        {btc && btc.plan_id !== null && (
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
                        header="Produk"
                        className="align-text-top"
                        field={""}
                        style={{
                          width: "20rem",
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
                        header="Bahan"
                        className="align-text-top"
                        field={""}
                        style={{
                          width: "20rem",
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
                      value={btc.mesin?.map((v, i) => {
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
                          <div className="p-inputgroup">
                            <InputText
                              value={e.mch_id && checkMsn(e.mch_id).msn_name}
                              placeholder="Nama Mesin"
                              disabled
                            />
                          </div>
                        )}
                      />

                      <Column className="align-text-top" body={null} />
                    </DataTable>
                  </Card.Body>
                </Card>
              </TabPanel>
            </TabView>
          </>
        )}
        <div className="row mb-5">
          <span className="mb-5"></span>
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

export default InputBatch;
