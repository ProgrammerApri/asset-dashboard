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
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { Calendar } from "primereact/calendar";
import { Link } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";
import { SelectButton } from "primereact/selectbutton";
import DataSupplier from "../../Mitra/Pemasok/DataPemasok";
import { MultiSelect } from "primereact/multiselect";

const defError = {
  code: false,
  date: false,
  pl: false,
};

const proses = [
  { name: "Done", code: 0 },
  { name: "Panding", code: 1 },
];

const InputBatch = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const btc = useSelector((state) => state.btc.current);
  const isEdit = useSelector((state) => state.btc.editBtc);
  const plan = useSelector((state) => state.plan.current);
  const forml = useSelector((state) => state.forml.current);
  const [active, setActive] = useState(0);
  const [doubleClick, setDoubleClick] = useState(false);
  const dispatch = useDispatch();
  const [planning, setPlanning] = useState(null);
  const [dept, setDept] = useState(null);
  const [supplier, setSup] = useState(null);
  const [product, setProduct] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [formula, setFormula] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [mesin, setMesin] = useState(null);
  const [workCen, setWorkCen] = useState(null);
  const [workType, setWorkType] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSup, setShowSup] = useState(false);
  const [showProd, setShowProd] = useState(false);
  const [numb, setNumb] = useState(true);
  const [showSatuan, setShowSatuan] = useState(false);
  const [showWorkCen, setShowWorkCen] = useState(false);
  const [showType, setShowType] = useState(false);
  const [showMsn, setShowMsn] = useState(false);
  const [showLok, setShowLok] = useState(false);
  const [error, setError] = useState(defError);
  const [accor, setAccor] = useState({
    sequence: true,
    produk: true,
    material: false,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getSupplier();
    getProduct();
    getSatuan();
    getStatus();
    getFormula();
    getPlanning();
    getDept();
    getMesin();
    getLok();
    getWorkCen();
    getWorkType();
  }, []);

  const getSupplier = async () => {
    const config = {
      ...endpoints.supplier,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        let sup = [];
        data?.forEach((element) => {
          sup.push(element.supplier);
        });
        setSup(data);
      }
    } catch (error) {}
  };

  const getStatus = async () => {
    const config = {
      ...endpoints.batch_status,
      data: {},
    };

    let response = null;
    try {
      response = await request(null, config);
      console.log("Response:", response);
      if (response.status) {
        const { data } = response;

        setNumb(data);
      }
    } catch (error) {
      setNumb(false);
      console.error("Error:", error);
    }
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

  const getWorkCen = async () => {
    const config = {
      ...endpoints.work_center,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setWorkCen(data);
      }
    } catch (error) {}
  };

  const getWorkType = async () => {
    const config = {
      ...endpoints.Jeniskerja,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setWorkType(data);
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
      data: { ...btc, batch_date: currentDate(btc.batch_date) },
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

  const checkSup = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element?.supplier?.id) {
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

  const checkLoc = (value) => {
    let selected = {};
    lokasi?.forEach((element) => {
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

  const checkMsn = (value) => {
    let selected = {};
    mesin?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkWc = (value) => {
    let selected = {};
    workCen?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkWork = (value) => {
    let selected = {};
    workType?.forEach((element) => {
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
        top: 80,
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
    let date_act = null;
    let date_end = null;
    let step = null;
    let status = null;
    let maklon = null;

    btc?.plan_id?.sequence?.forEach((el) => {
      date_act = el?.datetime_actual;
      date_end = el?.datetime_end;
      step = el?.seq;
      status = el?.proses;
    });

    btc?.sequence?.forEach((elem) => {
      maklon = checkWork(elem?.work_id)?.maklon;
    });

    console.log("jdhfd");
    console.log(maklon);
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-6">
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
              disabled={numb}
            />
          </div>
          <div className="col-2 text-black">
            <PrimeInput
              label={"Nama Batch"}
              value={btc.bname}
              onChange={(e) => {
                updateBTC({ ...btc, bname: e.target.value });
              }}
              placeholder="Masukan Nama Batch"
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
            <label className="text-label">Kode Planning</label>
            <div className="p-inputgroup"></div>
            <PrimeDropdown
              value={btc.plan_id && checkPlan(btc.plan_id)}
              options={planning}
              onChange={(e) => {
                updateBTC({
                  ...btc,
                  plan_id: e?.value?.id ?? null,
                  seq: e?.value
                    ? e?.value?.sequence?.map((v) => {
                        return {
                          ...v,
                          seq: v.seq,
                          wc_id: v.wc_id?.id ?? null,
                          loc_id: v.loc_id?.id ?? null,
                          mch_id: v?.mch_id?.id ?? null,
                          work_id: v?.work_id?.id ?? null,
                          sup_id: v?.sup_id ?? null,
                          datetime_plan: v?.date ?? null,
                          datetime_actual: v?.datetime_actual,
                          datetime_end: v?.datetime_end,
                          durasi: v?.durasi,
                          proses: v?.proses,
                        };
                      })
                    : null,
                  product: e?.value
                    ? e?.value?.product?.map((v) => {
                        return {
                          ...v,
                          prod_id: v?.prod_id?.id ?? null,
                          unit_id: v?.unit_id?.id ?? null,
                          qty_making: v.qty_making ?? 0,
                          aloc: v?.aloc ?? null,
                          qty_receive: null,
                          qty_reject: null,
                          loc_reject: null,
                          wc_mutation: null,
                          remain: null,
                        };
                      })
                    : null,
                  material: e?.value
                    ? e?.value?.material?.map((v) => {
                        return {
                          ...v,
                          prod_id: v?.prod_id?.id ?? null,
                          unit_id: v?.unit_id?.id ?? null,
                          qty: v?.qty,
                          mat_use: v?.mat_use,
                          total_use: v?.total_use,
                          price: v?.price,
                          total_price: v?.total_price,
                        };
                      })
                    : null,
                });
                let newError = error;
                newError.pl = false;
                setError(newError);
              }}
              placeholder="Pilih Kode Planning"
              optionLabel={"pcode"}
              errorMessage="Kode Planning Belum Dipilih"
              error={error?.pl}
              showClear
            />
          </div>

          <div className="col-3 text-black">
            <PrimeInput
              label={"Nama Planning"}
              value={btc.plan_id !== null ? checkPlan(btc.plan_id)?.pname : ""}
              placeholder="Masukan Nama Planning"
              disabled
            />
          </div>

          <div className="col-3 text-black">
            <label className="text-black">Versi Routing</label>
            <div className="p-inputgroup">
              <InputText
                value={btc.plan_id && checkPlan(btc.plan_id)?.version}
                placeholder="0"
                disabled
              />
            </div>
          </div>

          <div className="col-2 text-black">
            <PrimeNumber
              price
              label={"Target Pembuatan"}
              value={btc.plan_id !== null ? checkPlan(btc.plan_id)?.total : ""}
              placeholder="0"
              disabled
            />
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

        {btc && btc.plan_id !== null ? (
          <>
            <CustomAccordion
              tittle={"Sequence"}
              defaultActive={true}
              active={accor.sequence}
              onClick={() => {
                setAccor({
                  ...accor,
                  sequence: !accor.sequence,
                });
              }}
              key={1}
              body={
                <DataTable
                  responsiveLayout="scroll"
                  value={!isEdit ? btc.seq : btc.sequence}
                  className="display w-150 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    header="Proses Ke"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "7rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        value={e.seq && e.seq}
                        onChange={(t) => {}}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Work Center"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <PrimeInput
                        value={
                          e.wc_id
                            ? `${checkWc(e.wc_id)?.work_name} (${
                                checkWc(e.wc_id)?.work_code
                              })`
                            : "-"
                        }
                        onChange={(t) => {}}
                        placeholder="Work Center"
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Lokasi"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <PrimeInput
                        value={
                          e.loc_id
                            ? `${checkLoc(e.loc_id)?.name} (${
                                checkLoc(e.loc_id)?.code
                              })`
                            : "-"
                        }
                        onChange={(t) => {}}
                        placeholder="Lokasi"
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Mesin"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <PrimeInput
                        value={
                          e.mch_id
                            ? `${checkMsn(e.mch_id)?.msn_name} (${
                                checkMsn(e.mch_id)?.msn_code
                              })`
                            : "-"
                        }
                        onChange={(t) => {}}
                        placeholder="Mesin"
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Jenis Pekerjaan"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <PrimeInput
                        value={
                          e.work_id
                            ? `${checkWork(e.work_id)?.work_name} (${
                                checkWork(e.work_id)?.work_type
                              })`
                            : "-"
                        }
                        onChange={(t) => {}}
                        placeholder="Jenis Pekerjaan"
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Mutasi"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "5em",
                    }}
                    body={(e) => (
                      <Checkbox
                        className="ml-2"
                        checked={
                          e.work_id ? checkWork(e.work_id)?.mutasi : null
                        }
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Maklon"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "5em",
                    }}
                    body={(e) => (
                      <Checkbox
                        className="ml-2"
                        checked={
                          e.work_id ? checkWork(e.work_id)?.maklon : null
                        }
                        disabled
                      />
                    )}
                  />

                  <Column
                    // hidden={maklon === false || maklon === null}
                    header="Supplier"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <MultiSelect
                          value={
                            e?.sup_id
                              ? e?.sup_id?.map((v) => checkSup(v))
                              : null
                          }
                          options={supplier}
                          onChange={(u) => {
                            let temp = [...btc.seq];
                            temp[e.index].sup_id = u?.value?.map(
                              (a) => a?.supplier?.id ?? null
                            );
                            updateBTC({ ...btc, seq: temp });
                          }}
                          placeholder="Pilih Supplier"
                          optionLabel="supplier.sup_name"
                          filterBy="supplier.sup_name"
                          filter
                          display="chip"
                          maxSelectedLabels={3}
                          disabled={
                            checkWork(e.work_id)?.maklon == false ||
                            checkWork(e.work_id)?.maklon == null
                          }
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Tanggal Plan"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <Calendar
                          value={
                            isEdit || e.datetime_plan !== null
                              ? new Date(`${e.datetime_plan}Z`)
                              : e.datetime_plan
                          }
                          onChange={(t) => {
                            let temp = [...btc.seq];
                            temp[e.index].datetime_plan = t?.value ?? null;
                            updateBTC({ ...btc, seq: temp });
                          }}
                          placeholder="Pilih Tanggal"
                          dateFormat="dd-mm-yy"
                          showTime
                          hourFormat="12"
                          // showIcon
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Tanggal Actual"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <Calendar
                          value={
                            isEdit || date_act !== null
                              ? new Date(`${e.datetime_actual}Z`)
                              : e.datetime_actual
                          }
                          onChange={(t) => {
                            let temp = [...btc.seq];
                            temp[e.index].datetime_actual = t?.value ?? null;
                            updateBTC({ ...btc, seq: temp });
                          }}
                          placeholder="Pilih Tanggal"
                          dateFormat="dd-mm-yy"
                          showTime
                          hourFormat="12"
                          showIcon
                          disabled={e.proses === 0}
                        />
                      </div>
                    )}
                  />
                  <Column
                    header="Tanggal Selesai"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <Calendar
                          value={
                            isEdit || date_end !== null
                              ? new Date(`${e.datetime_end}Z`)
                              : e.datetime_end
                          }
                          onChange={(t) => {
                            let temp = [...btc.seq];
                            temp[e.index].datetime_end = t?.value ?? null;
                            updateBTC({ ...btc, seq: temp });
                          }}
                          placeholder="Pilih Tanggal"
                          dateFormat="dd-mm-yy"
                          showTime
                          hourFormat="12"
                          showIcon
                          disabled={e.proses === 0}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Durasi (Jam)"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.durasi && e.durasi}
                        onChange={(t) => {
                          let temp = [...btc.seq];
                          temp[e.index].durasi = t?.value ?? null;
                          updateBTC({ ...btc, seq: temp });
                        }}
                        placeholder="0"
                        disabled={e.proses === 0}
                      />
                    )}
                  />

                  <Column
                    header="Status Proses"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      // <div className="p-inputgroup">
                        <SelectButton
                          value={
                            e.proses !== null && e.proses !== ""
                              ? e.proses === 0
                                ? { name: "Done", code: 0 }
                                : { name: "Panding", code: 1 }
                              : null
                          }
                          options={proses}
                          onChange={(t) => {
                            let temp = [...btc.seq];
                            temp[e.index].proses = t?.value?.code ?? null;

                            let val = [];
                            btc?.seq?.forEach((el) => {
                              if (el?.proses != null) {
                                val?.push(el);
                              }
                            });
                            updateBTC({
                              ...btc,
                              seq: temp,
                              sequence: val?.map((v) => ({
                                ...v,
                                seq: v.seq,
                                wc_id: v.wc_id ?? null,
                                loc_id: v.loc_id ?? null,
                                mch_id: v?.mch_id ?? null,
                                work_id: v?.work_id ?? null,
                                sup_id: v?.sup_id ?? null,
                                datetime_plan: v?.datetime_plan,
                                datetime_actual: temp[e.index].datetime_actual,
                                datetime_end: temp[e.index].datetime_end,
                                durasi: temp[e.index].durasi,
                                proses: t?.value?.code ?? null,
                              })),
                            });
                          }}
                          optionLabel="name"
                          // disabled={e.proses === 0}
                        />
                      // </div>
                    )}
                  />

                  {/* <Column
                className="align-text-top"
                body={(e) =>
                  e.index === plan.sequence.length - 1 ? (
                    <Link
                      onClick={() => {
                        updatePL({
                          ...plan,
                          sequence: [
                            ...plan.sequence,
                            {
                              id: 0,
                              seq: null,
                              wc_id: null,
                              loc_id: null,
                              mch_id: null,
                              work_id: null,
                              date: null,
                              time: null,
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
                        let temp = [...plan.sequence];
                        temp.splice(e.index, 1);
                        updatePL({
                          ...plan,
                          sequence: temp,
                        });
                      }}
                      className="btn btn-danger shadow btn-xs sharp ml-1"
                    >
                      <i className="fa fa-trash"></i>
                    </Link>
                  )
                }
              /> */}
                </DataTable>
              }
            />

            <CustomAccordion
              tittle={"Produk Jadi"}
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
                <DataTable
                  responsiveLayout="scroll"
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
                      minWidth: "25rem",
                    }}
                    body={(e) => (
                      <PrimeInput
                        value={
                          e.prod_id
                            ? `${checkProd(e.prod_id)?.name} (${
                                checkProd(e.prod_id)?.code
                              })`
                            : "-"
                        }
                        // option={product}
                        onChange={(u) => {
                          // // looping satuan
                          // let sat = [];
                          // satuan?.forEach((element) => {
                          //   if (element?.id === u?.unit?.id) {
                          //     sat.push(element);
                          //   } else {
                          //     if (element?.u_from?.id === u?.unit?.id) {
                          //       sat.push(element);
                          //     }
                          //   }
                          // });
                          // let temp = [...btc.product];
                          // temp[e.index].prod_id = u?.id;
                          // temp[e.index].unit_id = u.unit?.id;
                          // updateBTC({ ...btc, product: temp });
                          // let newError = error;
                          // newError.mtrl[e.index].id = false;
                          // setError(newError);
                        }}
                        // detail
                        // onDetail={() => {
                        //   setCurrentIndex(e.index);
                        //   setShowProd(true);
                        // }}
                        // label={"[name] ([code])"}
                        placeholder="Produk"
                        // errorMessage="Bahan Belum Dipilih"
                        // error={error?.mtrl[e.index]?.id}
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Satuan"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <PrimeInput
                        value={
                          e.unit_id
                            ? `${checkUnit(e.unit_id)?.name} (${
                                checkUnit(e.unit_id)?.code
                              })`
                            : "-"
                        }
                        onChange={(u) => {
                          // let temp = [...btc.product];
                          // temp[e.index].unit_id = u?.id;
                          // updateBTC({ ...btc, product: temp });
                        }}
                        // option={satuan}
                        // detail
                        // onDetail={() => {
                        //   setCurrentIndex(e.index);
                        //   setShowSatuan(true);
                        // }}
                        // label={"[name] ([code])"}
                        placeholder="Satuan"
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Kuantitas Pembuatan"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.qty_making && e.qty_making}
                        placeholder="0"
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Cost Alokasi (%)"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.aloc && e.aloc}
                        onChange={(t) => {
                          let temp = [...btc.product];
                          temp[e.index].aloc = t?.value ?? null;
                          updateBTC({ ...btc, product: temp });
                        }}
                        placeholder="0"
                        // disabled
                      />
                    )}
                  />

                  <Column
                    header="Terima Hasil"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.qty_receive && e.qty_receive}
                        onChange={(t) => {
                          let temp = [...btc.product];
                          temp[e.index].qty_receive = t?.value ?? null;
                          updateBTC({ ...btc, product: temp });
                        }}
                        placeholder="0"
                      />
                    )}
                  />

                  <Column
                    header="Reject"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.qty_reject && e.qty_reject}
                        onChange={(t) => {
                          let temp = [...btc.product];
                          temp[e.index].qty_reject = t?.value ?? null;
                          updateBTC({ ...btc, product: temp });
                        }}
                        placeholder="0"
                      />
                    )}
                  />

                  <Column
                    header="Lokasi Reject"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "20rem",
                    }}
                    body={(e) => (
                      <CustomDropdown
                        value={e.loc_reject && checkLoc(e.loc_reject)}
                        option={lokasi}
                        onChange={(t) => {
                          let temp = [...btc.product];
                          temp[e.index].loc_reject = t?.id ?? null;
                          updateBTC({ ...btc, product: temp });

                          // let newError = error;
                          // newError.msn[e.index].id = false;
                          // setError(newError);
                        }}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowLok(true);
                        }}
                        label={"[name] ([code])"}
                        placeholder="Pilih Lokasi"
                        // errorMessage="Mesin Belum Dipilih"
                        // error={error?.msn[e.index]?.id}
                      />
                    )}
                  />

                  <Column
                    header="Mutasi WC"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.wc_mutation && e.wc_mutation}
                        onChange={(t) => {
                          let temp = [...btc.product];
                          temp[e.index].wc_mutation = t?.value ?? null;
                          temp[e.index].remain =
                            temp[e.index].qty_receive - t?.value ?? null;
                          updateBTC({ ...btc, product: temp });
                        }}
                        placeholder="0"
                      />
                    )}
                  />

                  <Column
                    header="Sisa"
                    className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.remain && e.remain}
                        placeholder="0"
                        disabled
                      />
                    )}
                  />

                  {/* <Column
                className="align-text-top"
                body={(e) =>
                  e.index === plan.product.length - 1 ? (
                    <Link
                      onClick={() => {
                        updatePL({
                          ...plan,
                          product: [
                            ...plan.product,
                            {
                              id: 0,
                              prod_id: null,
                              unit_id: null,
                              qty_form: null,
                              qty_making: null,
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
                        let temp = [...plan.product];
                        temp.splice(e.index, 1);
                        updatePL({
                          ...plan,
                          product: temp,
                        });
                      }}
                      className="btn btn-danger shadow btn-xs sharp ml-1"
                    >
                      <i className="fa fa-trash"></i>
                    </Link>
                  )
                }
              /> */}
                </DataTable>
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
                    responsiveLayout="scroll"
                    value={btc.material?.map((v, i) => {
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
                      header="Bahan"
                      className="align-text-top"
                      field={""}
                      style={{
                        minWidth: "25rem",
                      }}
                      body={(e) => (
                        <PrimeInput
                          value={
                            e.prod_id
                              ? `${checkProd(e.prod_id)?.name} (${
                                  checkProd(e.prod_id)?.code
                                })`
                              : "-"
                          }
                          // option={product}
                          // onChange={(u) => {
                          //   // looping satuan
                          //   let sat = [];
                          //   satuan.forEach((element) => {
                          //     if (element?.id === u?.unit?.id) {
                          //       sat.push(element);
                          //     } else {
                          //       if (element?.u_from?.id === u?.unit?.id) {
                          //         sat.push(element);
                          //       }
                          //     }
                          //   });

                          //   let temp = [...btc.product];
                          //   temp[e.index].prod_id = u?.id;
                          //   temp[e.index].unit_id = u.unit?.id;
                          //   updateBTC({ ...btc, product: temp });

                          //   // let newError = error;
                          //   // newError.mtrl[e.index].id = false;
                          //   // setError(newError);
                          // }}
                          // detail
                          // onDetail={() => {
                          //   setCurrentIndex(e.index);
                          //   setShowProd(true);
                          // }}
                          // label={"[name] ([code])"}
                          placeholder="Bahan"
                          disabled
                          // errorMessage="Bahan Belum Dipilih"
                          // error={error?.mtrl[e.index]?.id}
                        />
                      )}
                    />

                    <Column
                      header="Satuan"
                      className="align-text-top"
                      field={""}
                      style={{
                        minWidth: "15rem",
                      }}
                      body={(e) => (
                        <PrimeInput
                          value={
                            e.unit_id
                              ? `${checkUnit(e.unit_id)?.name} (${
                                  checkUnit(e.unit_id)?.code
                                })`
                              : "-"
                          }
                          // onChange={(u) => {
                          //   let temp = [...btc.material];
                          //   temp[e.index].unit_id = u?.id;
                          //   updateBTC({ ...btc, material: temp });
                          // }}
                          // option={satuan}
                          // detail
                          // onDetail={() => {
                          //   setCurrentIndex(e.index);
                          //   setShowSatuan(true);
                          // }}
                          // label={"[name] ([code])"}
                          placeholder="Satuan"
                          disabled
                        />
                      )}
                    />

                    <Column
                      header="Kuantitas Formula"
                      className="align-text-top"
                      field={""}
                      style={{
                        minWidth: "10rem",
                      }}
                      body={(e) => (
                        <PrimeNumber
                          price
                          value={e.qty ? e.qty : ""}
                          placeholder="0"
                          disabled
                        />
                      )}
                    />

                    <Column
                      header="Kebutuhan Material"
                      className="align-text-top"
                      field={""}
                      style={{
                        minWidth: "10rem",
                      }}
                      body={(e) => (
                        <PrimeNumber
                          price
                          value={e.mat_use && e.mat_use}
                          onChange={(u) => {
                            let temp = [...btc.material];
                            temp[e.index].mat_use = u.value;
                            temp[e.index].total_use =
                              u.value > 0
                                ? u.value * checkPlan(btc.plan_id)?.total
                                : temp[e.index].qty *
                                  checkPlan(btc.plan_id)?.total;
                            updateBTC({ ...btc, material: temp });
                          }}
                          placeholder="0"
                        />
                      )}
                    />

                    <Column
                      header="Total"
                      className="align-text-top"
                      field={""}
                      style={{
                        minWidth: "10rem",
                      }}
                      body={(e) => (
                        <PrimeNumber
                          price
                          value={e.total_use && e.total_use}
                          onChange={(u) => {
                            let temp = [...btc.material];
                            temp[e.index].total_use = u.value;
                            temp[e.index].mat_use =
                              u.value / checkPlan(btc.plan_id)?.total;
                            updateBTC({ ...btc, material: temp });
                          }}
                          placeholder="0"
                        />
                      )}
                    />

                    <Column
                      className="align-text-top"
                      body={(e) => (
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
                      )}
                    />
                  </DataTable>
                </>
              }
            />
            <div className="row mb-5">
              <span className="mb-5"></span>
            </div>
          </>
        ) : (
          <></>
        )}
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
          <Card>
            <Card.Body>
              <>
                {/* {header()} */}
                {body()}
                {footer()}
              </>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <DataSupplier
        data={supplier}
        loading={false}
        popUp={true}
        show={showSup}
        onHide={() => {
          setShowSup(false);
        }}
        onInput={(e) => {
          setShowSup(!e);
        }}
        onSuccessInput={(e) => {
          getSupplier();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSup(false);
            let temp = [...btc.sequence];
            temp[currentIndex].sup_id = e.data?.supplier?.id;

            updateBTC({ ...btc, sequence: temp });
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
            // setSatuan(sat);

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
