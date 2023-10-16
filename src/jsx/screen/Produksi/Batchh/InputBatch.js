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
import { Dialog } from "primereact/dialog";
import { tr } from "src/data/tr";
import { fil } from "date-fns/locale";

const defError = {
  code: false,
  date: false,
  plan: false,
  seq: [
    {
      actual: false,
      end: false,
      durasi: false,
    },
  ],
  prod: [
    {
      receive: false,
      mutasi: false,
    },
  ],
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
  const [displayConfirm, setDisplayConfirm] = useState(false);
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
      data: { ...btc, batch_date: currentDate(btc?.batch_date) },
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
    return newDate?.toISOString();
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
      plan: !btc?.plan_id,
      seq: [],
      prod: [],
    };

    btc?.sequence?.forEach((element, i) => {
      if (i > 0) {
        if (
          element?.datetime_actual ||
          element?.datetime_end ||
          element?.durasi
        ) {
          errors.seq[i] = {
            actual:
              !element?.datetime_actual ||
              element?.datetime_actual === "" ||
              element?.datetime_actual === null,
            end:
              !element?.datetime_end ||
              element?.datetime_end === "" ||
              element?.datetime_end === null,
            durasi:
              !element?.durasi ||
              element?.durasi === "" ||
              element?.durasi === 0,
          };
        }
      } else {
        errors.seq[i] = {
          actual:
            !element?.datetime_actual ||
            element?.datetime_actual === "" ||
            element?.datetime_actual === null,
          end:
            !element?.datetime_end ||
            element?.datetime_end === "" ||
            element?.datetime_end === null,
          durasi:
            !element?.durasi || element?.durasi === "" || element?.durasi === 0,
        };
      }
    });

    btc?.product?.forEach((element, i) => {
      if (i > 0) {
        if (element?.qty_receive || element?.wc_mutation) {
          errors.prod[i] = {
            receive:
              !element?.qty_receive ||
              element?.qty_receive === "" ||
              element?.qty_receive === "0",
            mutasi:
              !element?.wc_mutation ||
              element?.wc_mutation === "" ||
              element?.wc_mutation === "0",
          };
        }
      } else {
        errors.prod[i] = {
          receive:
            !element?.qty_receive ||
            element?.qty_receive === "" ||
            element?.qty_receive === "0",
          mutasi:
            !element?.wc_mutation ||
            element?.wc_mutation === "" ||
            element?.wc_mutation === "0",
        };
      }
    });

    if (btc?.sequence?.length) {
      if (
        !errors.seq[0]?.actual &&
        !errors.seq[0]?.end &&
        !errors.seq[0]?.durasi
      ) {
        errors.seq?.forEach((e) => {
          for (var key in e) {
            e[key] = false;
          }
        });
      }
    }

    if (btc?.product.length) {
      if (!errors.prod[0]?.receive && !errors.prod[0]?.mutasi) {
        errors.prod?.forEach((e) => {
          for (var key in e) {
            e[key] = false;
          }
        });
      }
    }

    let validSeq = false;
    let validProduct = false;
    errors.seq?.forEach((el) => {
      for (var k in el) {
        validSeq = !el[k];
      }
    });

    errors.prod?.forEach((el) => {
      for (var k in el) {
        validProduct = !el[k];
      }
    });

    valid =
      !errors.code && !errors.date && !errors.plan && validSeq && validProduct;

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
    let date_act = null;
    let date_end = null;
    let status = null;
    let disabled = true;

    btc?.plan_id?.sequence?.forEach((el) => {
      date_act = el?.datetime_actual;
      date_end = el?.datetime_end;
      status = el?.proses;
    });

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
                let step = 0;
                let maklon = null;
                let step_seq = e?.value?.sequence.map((v) => ({
                  ...v,
                  disabled: true,
                }));

                e?.value?.sequence?.forEach((elem) => {
                  let disabled = true;
                  maklon = checkWork(elem?.work_id)?.maklon;

                  if (elem.proses !== null && elem.proses !== 1) {
                    step_seq[step].disabled = true;
                    if (step < e?.value?.sequence.length - 1) {
                      step_seq[step + 1].disabled = false;
                    }
                  }

                  if (elem.proses === null && step === 0) {
                    step_seq[step].disabled = false;
                  }

                  step++;
                });
                console.log("jdhfd");
                console.log(step);

                step_seq?.forEach((el) => {
                  if (!el?.disabled && !el?.work_id?.mutasi) {
                    // setDisplayConfirm(true);
                  }
                });

                updateBTC({
                  ...btc,
                  plan_id: e?.value?.id ?? null,
                  seqq: e?.value
                    ? step_seq?.map((v) => {
                        return {
                          ...v,
                          seq: v?.seq,
                          wc_id: v.wc_id?.id ?? null,
                          loc_id: v.loc_id?.id ?? null,
                          mch_id: v?.mch_id?.id ?? null,
                          work_id: v?.work_id?.id ?? null,
                          sup_id: v?.sup_id ?? null,
                          datetime_plan: v?.date ?? null,
                          datetime_actual:
                            v?.datetime_actual !== null
                              ? new Date(`${v.datetime_actual}Z`)
                              : null,
                          datetime_end:
                            v?.datetime_end !== null
                              ? new Date(`${v.datetime_end}Z`)
                              : null,
                          durasi: v?.durasi ?? null,
                          proses: v?.proses ?? null,
                          batch: v?.batch ?? null,
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
                          // v?.wc_mutation == null
                          //   ? v?.qty_making
                          //   : v?.wc_mutation
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
              tittle={<b>Sequence</b>}
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
                  value={
                    !isEdit
                      ? btc?.seqq.map((v, i) => {
                          return {
                            ...v,
                            index: i,
                          };
                        })
                      : btc?.sequence?.map((b, a) => {
                          return {
                            ...b,
                            index: a,
                          };
                        })
                  }
                  className="display w-150 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    header={<b>Proses</b>}
                    // className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "4rem",
                    }}
                    body={(e) => (
                      <div>
                        <label className="ml-3">{e.seq}</label>
                      </div>
                      // <PrimeNumber
                      //   value={e.seq && e.seq}
                      //   onChange={(t) => {}}
                      //   placeholder="0"
                      //   type="number"
                      //   min={0}
                      //   disabled
                      // />
                    )}
                  />

                  <Column
                    header={<b>Work Center</b>}
                    // className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <div>
                        <label className="ml-0">
                          {e.wc_id
                            ? `${checkWc(e.wc_id)?.work_name} (${
                                checkWc(e.wc_id)?.work_code
                              })`
                            : "-"}
                        </label>
                      </div>
                      // <PrimeInput
                      //   value={
                      //     e.wc_id
                      //       ? `${checkWc(e.wc_id)?.work_name} (${
                      //           checkWc(e.wc_id)?.work_code
                      //         })`
                      //       : "-"
                      //   }
                      //   onChange={(t) => {}}
                      //   placeholder="Work Center"
                      //   disabled
                      // />
                    )}
                  />

                  <Column
                    header={<b>Lokasi Gudang</b>}
                    // className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <div>
                        <label className="ml-0">
                          {e.loc_id
                            ? `${checkLoc(e.loc_id)?.name} (${
                                checkLoc(e.loc_id)?.code
                              })`
                            : "-"}
                        </label>
                      </div>

                      // <PrimeInput
                      //   value={
                      //     e.loc_id
                      //       ? `${checkLoc(e.loc_id)?.name} (${
                      //           checkLoc(e.loc_id)?.code
                      //         })`
                      //       : "-"
                      //   }
                      //   onChange={(t) => {}}
                      //   placeholder="Lokasi"
                      //   disabled
                      // />
                    )}
                  />

                  <Column
                    header={<b>Mesin</b>}
                    // className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <div>
                        <label className="ml-0">
                          {e.mch_id
                            ? `${checkMsn(e.mch_id)?.msn_name} (${
                                checkMsn(e.mch_id)?.msn_code
                              })`
                            : "-"}
                        </label>
                      </div>

                      // <PrimeInput
                      //   value={
                      //     e.mch_id
                      //       ? `${checkMsn(e.mch_id)?.msn_name} (${
                      //           checkMsn(e.mch_id)?.msn_code
                      //         })`
                      //       : "-"
                      //   }
                      //   onChange={(t) => {}}
                      //   placeholder="Mesin"
                      //   disabled
                      // />
                    )}
                  />

                  <Column
                    header={<b>Jenis Pekerjaan</b>}
                    // className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <div>
                        <label className="ml-0">
                          {e.work_id
                            ? `${checkWork(e.work_id)?.work_name} (${
                                checkWork(e.work_id)?.work_type
                              })`
                            : "-"}
                        </label>
                      </div>

                      // <PrimeInput
                      //   value={
                      //     e.work_id
                      //       ? `${checkWork(e.work_id)?.work_name} (${
                      //           checkWork(e.work_id)?.work_type
                      //         })`
                      //       : "-"
                      //   }
                      //   onChange={(t) => {}}
                      //   placeholder="Jenis Pekerjaan"
                      //   disabled
                      // />
                    )}
                  />

                  <Column
                    header={<b>Mutasi</b>}
                    // className="align-text-top"
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
                    header={<b>Maklon</b>}
                    // className="align-text-top"
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
                    header={<b>Supplier</b>}
                    // className="align-text-top"
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
                            let temp = [...btc.seqq];
                            temp[e.index].sup_id = u?.value?.map(
                              (a) => a?.supplier?.id ?? null
                            );
                            updateBTC({ ...btc, seqq: temp });
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
                    header={<b>Tanggal Plan</b>}
                    // className="align-text-top"
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
                    header={<b>Tanggal Actual</b>}
                    // className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <Calendar
                          value={
                            // !isEdit
                            //   ?
                            e.datetime_actual
                            // : new Date(`${e.datetime_actual}Z`)
                          }
                          onChange={(a) => {
                            let temp = btc.seqq;
                            let tempp = btc.sequence;

                            if (!isEdit) {
                              temp[e.index].datetime_actual = a?.value ?? null;
                              updateBTC({ ...btc, seqq: temp });
                            } else {
                              tempp[e.index].datetime_actual = a?.value ?? null;
                              updateBTC({ ...btc, sequence: tempp });
                            }
                          }}
                          placeholder="Pilih Tanggal"
                          dateFormat="dd-mm-yy"
                          showTime
                          hourFormat="12"
                          showIcon
                          disabled={e.disabled}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={<b>Tanggal Selesai</b>}
                    // className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "15rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <Calendar
                          value={
                            // !isEdit
                            //   ?
                            e.datetime_end
                            // : new Date(`${e.datetime_end}Z`)
                          }
                          onChange={(u) => {
                            let temp = btc.seqq;
                            let tempp = btc.sequence;

                            if (!isEdit) {
                              temp[e.index].datetime_end = u?.value ?? null;
                              updateBTC({ ...btc, seqq: temp });
                            } else {
                              tempp[e.index].datetime_end = u?.value ?? null;
                              updateBTC({ ...btc, sequence: tempp });
                            }
                          }}
                          placeholder="Pilih Tanggal"
                          dateFormat="dd-mm-yy"
                          showTime
                          hourFormat="12"
                          showIcon
                          disabled={e.disabled}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={<b>Durasi (Jam)</b>}
                    // className="align-text-top"
                    field={""}
                    style={{
                      minWidth: "8rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.durasi && e.durasi}
                        onChange={(a) => {
                          let temp = btc.seqq;
                          let tempp = btc.sequence;

                          if (!isEdit) {
                            temp[e.index].durasi = a?.value ?? null;
                            updateBTC({ ...btc, seqq: temp });
                          } else {
                            tempp[e.index].durasi = a?.value ?? null;
                            updateBTC({ ...btc, sequence: tempp });
                          }
                        }}
                        placeholder="0"
                        disabled={e.disabled}
                      />
                    )}
                  />

                  <Column
                    header={<b>Status Proses</b>}
                    // className="align-text-top"
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
                          let temp = btc.seqq;
                          let tempp = btc.sequence;

                          if (!isEdit) {
                            temp[e.index].proses = t?.value?.code ?? null;
                          } else {
                            tempp[e.index].proses = t?.value?.code ?? null;
                          }

                          let val = [];
                          btc?.seqq?.forEach((el) => {
                            if (!el?.disabled) {
                              val?.push(el);
                            }
                          });
                          updateBTC({
                            ...btc,
                            seqq: !isEdit ? temp : null,
                            sequence: !isEdit
                              ? val?.map((v) => ({
                                  ...v,
                                  seq: v.seq,
                                  wc_id: v.wc_id ?? null,
                                  loc_id: v.loc_id ?? null,
                                  mch_id: v?.mch_id ?? null,
                                  work_id: v?.work_id ?? null,
                                  sup_id: v?.sup_id ?? null,
                                  datetime_plan: v?.datetime_plan,
                                  datetime_actual:
                                    temp[e.index].datetime_actual,
                                  datetime_end: temp[e.index].datetime_end,
                                  durasi: temp[e.index].durasi,
                                  proses: t?.value?.code ?? null,
                                }))
                              : tempp,
                          });
                        }}
                        optionLabel="name"
                        disabled={e.disabled}
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
              tittle={<b>Produk Jadi</b>}
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
                    header={<b>Produk</b>}
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
                    header={<b>Qty Pembuatan</b>}
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
                    header={<b>Satuan</b>}
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
                    header={<b>Cost Alokasi (%)</b>}
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
                    header={<b>Terima Hasil/Mutasi</b>}
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
                          temp[e.index].remain =
                            t?.value - temp[e.index].wc_mutation ?? null;
                          updateBTC({ ...btc, product: temp });
                        }}
                        placeholder="0"
                      />
                    )}
                  />

                  <Column
                    header={<b>Reject</b>}
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
                    header={<b>Lokasi Reject</b>}
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
                    header={<b>Mutasi WC</b>}
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
                    header={<b>Sisa</b>}
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
              tittle={<b>Bahan</b>}
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
                      header={<b>Bahan</b>}
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
                      header={<b>Qty Formula</b>}
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
                      header={<b>Satuan</b>}
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
                      header={<b>Kebutuhan Material</b>}
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
                      header={<b>Total</b>}
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

  const footerConfirm = () => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={onCancel}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Ya"
          icon="pi pi-check"
          onClick={() => {
            setUpdate(true);
            // closePO();
          }}
          autoFocus
          loading={update}
        />
      </div>
    );
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

      <Dialog
        header={"Mutasi Tidak Diaktifkan"}
        visible={displayConfirm}
        style={{ width: "30vw" }}
        footer={footerConfirm("displayConfirm")}
        onHide={onCancel}
      >
        <div className="ml-3 mr-3">
          <i
            className="pi pi-exclamation-triangle mr-3 align-middle"
            style={{ fontSize: "2rem" }}
          />
          <span>Apakah yakin ingin melanjutkan mutasi ?</span>
        </div>
      </Dialog>

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
