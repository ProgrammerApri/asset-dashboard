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
import DataMesin from "../../Master/Mesin/DataMesin";
import { TabPanel, TabView } from "primereact/tabview";
import { Divider } from "@material-ui/core";
import DataPusatBiaya from "../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import DataLokasi from "../../Master/Lokasi/DataLokasi";
import { Calendar } from "primereact/calendar";
import DataWorkCenter from "../../Master/WorkCenter/DataWorkCenter";
import DataJeniskerja from "../../Master/Jenis_kerja/DataJeniskerja";

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
  const [showDept, setShowDept] = useState(false);
  const [showWorkCen, setShowWorkCen] = useState(false);
  const [showType, setShowType] = useState(false);
  const [showMsn, setShowMsn] = useState(false);
  const [showLok, setShowLok] = useState(false);
  const [product, setProduct] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [mesin, setMesin] = useState(null);
  const [formula, setFormula] = useState(null);
  const [dept, setDept] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [workCen, setWorkCen] = useState(null);
  const [workType, setWorkType] = useState(null);
  const [error, setError] = useState(defError);
  const [active, setActive] = useState(0);
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
    getFormula();
    getProduct();
    getSatuan();
    getDept();
    getWorkCen();
    getWorkType();
    getMesin();
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
          if (elem?.active) {
            filt.push(elem);
          }
        });
        setFormula(filt);
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

  const checkFm = (value) => {
    let selected = {};
    formula?.forEach((element) => {
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

  const checkMsn = (value) => {
    let selected = {};
    mesin?.forEach((element) => {
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

  const onSubmit = () => {
    // if (isValid()) {
    if (isEdit) {
      setUpdate(true);
      editPL();
    } else {
      setUpdate(true);
      addPL();
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
      rp: !plan.total || plan.total === "",
      dep: !plan.dep_id,
      fm: !plan.form_id,
      msn: [],
    };

    plan?.sequence.forEach((element, i) => {
      if (i > 0) {
        if (element.seq) {
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
      !errors.fm &&
      !errors.rp &&
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

        <Row className="mb-8">
          <div className="col-3 text-black">
            <PrimeInput
              label={"Kode Routing"}
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

          <div className="col-3 text-black">
            <PrimeInput
              label={"Nama Routing"}
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
              label={"Tanggal"}
              value={new Date(`${plan.date_created}Z`)}
              onChange={(e) => {
                updatePL({ ...plan, date_created: e.target.value });
              }}
              dateFormat="dd-mm-yy"
              showIcon
              // disabled
            />
          </div>
          {/* <div className="col-4"></div> */}

          <div className="col-3" hidden>
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

          <div className="col-1 text-black">
            <PrimeNumber
              label={"Versi Routing"}
              value={plan.version ?? 0}
              onChange={(e) => {
                updatePL({ ...plan, version: e.target.value });
                // let newError = error;
                // newError.name = false;
                // setError(newError);
              }}
              placeholder="0"
              // error={error?.name}
            />
          </div>

          {/* <div className="col-3"></div> */}

          <div className="col-12 p-0 text-black">
            <div className="mt-4 mb-2 ml-3 mr-3 fs-13">
              <b>Informasi Formula</b>
            </div>
            <Divider className="mb-2 ml-3 mr-3"></Divider>
          </div>

          <div className="col-3 text-black">
            <label className="text-black">Kode Formula</label>
            <PrimeDropdown
              value={plan.form_id !== null ? checkFm(plan.form_id) : null}
              options={formula}
              onChange={(e) => {
                // e?.value?.product.forEach((element) => {
                //   element.def_qty = element.qty;
                // });
                // e?.value?.material.forEach((elem) => {
                //   elem.def_qty = elem.qty;
                // });

                // if (plan.total) {
                //   e?.value?.product.forEach((element) => {
                //     element.qty = element.def_qty * plan.total;
                //   });
                //   e?.value?.material.forEach((elem) => {
                //     elem.total_use = elem.mat_use * plan.total;
                //   });
                // }

                updatePL({
                  ...plan,
                  form_id: e?.value?.id ?? null,
                  product: e?.value?.id
                    ? e?.value?.product?.map((v) => {
                        return {
                          ...v,
                          prod_id: v?.prod_id?.id,
                          unit_id: v?.unit_id?.id,
                          qty_form: v.qty ?? 0,
                          qty_making: null,
                        };
                      })
                    : null,
                  material: e?.value?.id
                    ? e?.value?.material?.map((v) => {
                        return {
                          ...v,
                          prod_id: v?.prod_id?.id,
                          unit_id: v?.unit_id?.id,
                          qty: v?.qty ?? 0,
                          mat_use: v.qty,
                          total_use: null,
                        };
                      })
                    : null,
                });
                let newError = error;
                newError.fm = false;
                setError(newError);
              }}
              placeholder="Pilih Kode Formula"
              optionLabel={"fcode"}
              errorMessage="Formula Belum Dipilih"
              error={error?.fm}
              showClear
            />
          </div>

          <div className="col-3 text-black">
            <PrimeInput
              label={"Nama Formula"}
              value={plan.form_id !== null ? checkFm(plan.form_id)?.fname : ""}
              onChange={(e) => {}}
              placeholder="Masukan Nama Formula"
              disabled
            />
          </div>
          <div className="col-6"></div>

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
          <div className="col-2 text-black">
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
            <PrimeNumber
              price
              label={"Target Pembuatan"}
              value={plan.total}
              onChange={(e) => {
                updatePL({
                  ...plan,
                  total: e.value,
                  product: plan?.product?.map((v) => {
                    return {
                      ...v,
                      qty_making: e.value * v.qty_form,
                    };
                  }),
                  material: plan?.material?.map((v) => {
                    return {
                      ...v,
                      total_use:
                        v.mat_use > 0 ? e.value * v.mat_use : e.value * v.qty,
                    };
                  }),
                });
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

          <div className="col-7 text-black">
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

        {plan?.form_id ? (
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
                <>
                  <DataTable
                    responsiveLayout="none"
                    value={plan.sequence?.map((v, i) => {
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
                      header="Proses Ke"
                      className="align-text-top"
                      field={""}
                      style={{
                        width: "10rem",
                      }}
                      body={(e) => (
                        <PrimeNumber
                          value={e.seq && e.seq}
                          onChange={(t) => {
                            let temp = [...plan.sequence];
                            temp[e.index].seq = Number(t.target.value);
                            updatePL({ ...plan, sequence: temp });
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
                        />
                      )}
                    />

                    <Column
                      header="Work Center"
                      className="align-text-top"
                      field={""}
                      style={{
                        width: "20rem",
                      }}
                      body={(e) => (
                        <CustomDropdown
                          value={e.wc_id && checkWc(e.wc_id)}
                          option={workCen}
                          onChange={(t) => {
                            let temp = [...plan.sequence];
                            temp[e.index].wc_id = t?.id ?? null;
                            temp[e.index].loc_id = t?.loc_id?.id ?? null;
                            temp[e.index].mch_id = t?.machine_id?.id ?? null;
                            temp[e.index].work_id = t?.work_type?.id ?? null;
                            updatePL({ ...plan, sequence: temp });

                            // let newError = error;
                            // newError.msn[e.index].id = false;
                            // setError(newError);
                          }}
                          detail
                          onDetail={() => {
                            setCurrentIndex(e.index);
                            setShowWorkCen(true);
                          }}
                          label={"[work_name] ([work_code])"}
                          placeholder="Pilih Work Center"
                          // errorMessage="Mesin Belum Dipilih"
                          // error={error?.msn[e.index]?.id}
                        />
                      )}
                    />

                    <Column
                      header="Lokasi"
                      className="align-text-top"
                      field={""}
                      style={{
                        width: "20rem",
                      }}
                      body={(e) => (
                        <CustomDropdown
                          value={e.loc_id && checkLoc(e.loc_id)}
                          option={lokasi}
                          onChange={(t) => {
                            let temp = [...plan.sequence];
                            temp[e.index].loc_id = t?.id ?? null;
                            updatePL({ ...plan, sequence: temp });

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
                          placeholder="Pilih Mesin"
                          // errorMessage="Mesin Belum Dipilih"
                          // error={error?.msn[e.index]?.id}
                        />
                      )}
                    />

                    <Column
                      header="Mesin"
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
                            let temp = [...plan.sequence];
                            temp[e.index].mch_id = t?.id ?? null;
                            updatePL({ ...plan, sequence: temp });

                            let newError = error;
                            newError.msn[e.index].id = false;
                            setError(newError);
                          }}
                          detail
                          onDetail={() => {
                            setCurrentIndex(e.index);
                            setShowMsn(true);
                          }}
                          label={"[msn_name] ([msn_code])"}
                          placeholder="Pilih Mesin"
                          errorMessage="Mesin Belum Dipilih"
                          error={error?.msn[e.index]?.id}
                        />
                      )}
                    />

                    <Column
                      header="Jenis Pekerjaan"
                      className="align-text-top"
                      field={""}
                      style={{
                        width: "20rem",
                      }}
                      body={(e) => (
                        <CustomDropdown
                          value={e.work_id && checkWork(e.work_id)}
                          option={workType}
                          onChange={(t) => {
                            let temp = [...plan.sequence];
                            temp[e.index].work_id = t?.id ?? null;
                            updatePL({ ...plan, sequence: temp });

                            // let newError = error;
                            // newError.msn[e.index].id = false;
                            // setError(newError);
                          }}
                          detail
                          onDetail={() => {
                            setCurrentIndex(e.index);
                            setShowType(true);
                          }}
                          label={"[work_name] ([work_type])"}
                          placeholder="Pilih Pekerjaan"
                          // errorMessage="Mesin Belum Dipilih"
                          // error={error?.msn[e.index]?.id}
                        />
                      )}
                    />

                    <Column
                      header="Mutasi/Non Mutasi"
                      className="align-text-top"
                      field={""}
                      style={{
                        width: "20rem",
                      }}
                      body={(e) => (
                        <PrimeInput
                          value={
                            e.work_id
                              ? checkWork(e.work_id)?.mutasi == true
                                ? "Mutasi"
                                : "Non Mutasi"
                              : null
                          }
                          placeholder="0"
                          disabled
                        />
                      )}
                    />

                    <Column
                      header="Tanggal"
                      className="align-text-top"
                      field={""}
                      style={{
                        minWidth: "15rem",
                      }}
                      body={(e) => (
                        <div className="p-inputgroup">
                          <Calendar
                            value={!isEdit ? e.date : new Date(`${e.date}Z`)}
                            onChange={(t) => {
                              console.log("time");
                              console.log(t.value);
                              let temp = [...plan.sequence];
                              temp[e.index].date = t?.value ?? null;
                              updatePL({ ...plan, sequence: temp });
                            }}
                            placeholder="Pilih Tanggal"
                            dateFormat="dd-mm-yy"
                            showTime
                            hourFormat="12"
                            showIcon
                          />
                        </div>
                      )}
                    />

                    <Column
                      hidden
                      header="Waktu"
                      className="align-text-top"
                      field={""}
                      style={{
                        width: "15rem",
                      }}
                      body={(e) => (
                        <div className="p-inputgroup">
                          <Calendar
                            value={e.time && e.time}
                            onChange={(t) => {
                              let temp = [...plan.sequence];
                              temp[e.index].time =
                                `${t?.value?.getHours()}:${t?.value?.getMinutes()}` ??
                                null;
                              updatePL({ ...plan, sequence: temp });
                            }}
                            placeholder="Pilih Waktu"
                            timeOnly
                          />
                        </div>
                      )}
                    />

                    <Column
                      className="align-text-top"
                      body={
                        (e) => (
                          // e.index === plan.sequence.length - 1 ? (
                          //   <Link
                          //     onClick={() => {
                          //       updatePL({
                          //         ...plan,
                          //         sequence: [
                          //           ...plan.sequence,
                          //           {
                          //             id: 0,
                          //             seq: null,
                          //             wc_id: null,
                          //             loc_id: null,
                          //             mch_id: null,
                          //             work_id: null,
                          //             date: null,
                          //             time: null,
                          //           },
                          //         ],
                          //       });
                          //     }}
                          //     className="btn btn-primary shadow btn-xs sharp ml-1"
                          //   >
                          //     <i className="fa fa-plus"></i>
                          //   </Link>
                          // ) : (
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
                        // )
                      }
                    />
                  </DataTable>

                  <div className="col-12 d-flex justify-content-end">
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
                      className="btn btn-primary shadow btn-s sharp ml-1 mt-3"
                    >
                      <span className="align-middle mx-1">
                        <i className="fa fa-plus"></i> {"Tambah"}
                      </span>
                    </Link>
                  </div>
                </>
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
                      <CustomDropdown
                        value={e.prod_id && checkProd(e.prod_id)}
                        option={product}
                        onChange={(u) => {
                          // looping satuan
                          let sat = [];
                          satuan.forEach((element) => {
                            if (element?.id === u?.unit?.id) {
                              sat.push(element);
                            } else {
                              if (element?.u_from?.id === u?.unit?.id) {
                                sat.push(element);
                              }
                            }
                          });

                          let temp = [...plan.product];
                          temp[e.index].prod_id = u?.id;
                          temp[e.index].unit_id = u.unit?.id;
                          updatePL({ ...plan, product: temp });

                          // let newError = error;
                          // newError.mtrl[e.index].id = false;
                          // setError(newError);
                        }}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowProd(true);
                        }}
                        label={"[name] ([code])"}
                        placeholder="Pilih Produk"
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
                      width: "15rem",
                    }}
                    body={(e) => (
                      <CustomDropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        onChange={(u) => {
                          let temp = [...plan.product];
                          temp[e.index].unit_id = u?.id;
                          updatePL({ ...plan, product: temp });
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
                    header="Kuantitas Formula"
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   width: "5rem",
                    // }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.qty_form && e.qty_form}
                        onChange={(t) => {
                          let temp = [...plan.product];
                          temp[e.index].qty_form = t?.value ?? null;
                          temp[e.index].qty_making = t?.value * plan.total;
                          updatePL({ ...plan, product: temp });
                        }}
                        placeholder="0"
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Kuantitas Pembuatan"
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   width: "5rem",
                    // }}
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
                    // style={{
                    //   minWidth: "7rem",
                    // }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.aloc && e.aloc}
                        onChange={(t) => {
                          let temp = [...plan.product];
                          temp[e.index].aloc = t?.value ?? null;
                          updatePL({ ...plan, product: temp });
                        }}
                        placeholder="0"
                        // disabled
                      />
                    )}
                  />

                  <Column
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
                  />
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
                <DataTable
                  responsiveLayout="none"
                  value={plan.material?.map((v, i) => {
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
                      width: "25rem",
                    }}
                    body={(e) => (
                      <CustomDropdown
                        value={e.prod_id && checkProd(e.prod_id)}
                        option={product}
                        onChange={(u) => {
                          // looping satuan
                          let sat = [];
                          satuan.forEach((element) => {
                            if (element?.id === u?.unit?.id) {
                              sat.push(element);
                            } else {
                              if (element?.u_from?.id === u?.unit?.id) {
                                sat.push(element);
                              }
                            }
                          });

                          let temp = [...plan.product];
                          temp[e.index].prod_id = u?.id;
                          temp[e.index].unit_id = u.unit?.id;
                          updatePL({ ...plan, product: temp });

                          // let newError = error;
                          // newError.mtrl[e.index].id = false;
                          // setError(newError);
                        }}
                        detail
                        onDetail={() => {
                          setCurrentIndex(e.index);
                          setShowProd(true);
                        }}
                        label={"[name] ([code])"}
                        placeholder="Pilih Produk"
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
                      width: "15rem",
                    }}
                    body={(e) => (
                      <CustomDropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        onChange={(u) => {
                          let temp = [...plan.material];
                          temp[e.index].unit_id = u?.id;
                          updatePL({ ...plan, material: temp });
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
                    header="Kuantitas Formula"
                    className="align-text-top"
                    field={""}
                    style={{
                      width: "10rem",
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
                      Width: "10rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.mat_use && e.mat_use}
                        onChange={(u) => {
                          let temp = [...plan.material];
                          temp[e.index].mat_use = u.value;
                          temp[e.index].total_use =
                            u.value > 0
                              ? u.value * plan.total
                              : temp[e.index].qty * plan.total;
                          updatePL({ ...plan, material: temp });
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
                      Width: "10rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.total_use && e.total_use}
                        onChange={(u) => {
                          let temp = [...plan.material];
                          temp[e.index].total_use = u.value;
                          temp[e.index].mat_use = u.value / plan.total;
                          updatePL({ ...plan, material: temp });
                        }}
                        placeholder="0"
                      />
                    )}
                  />

                  <Column
                    className="align-text-top"
                    body={(e) =>
                      e.index === plan.material.length - 1 ? (
                        <Link
                          onClick={() => {
                            updatePL({
                              ...plan,
                              material: [
                                ...plan.material,
                                {
                                  id: 0,
                                  prod_id: null,
                                  unit_id: null,
                                  qty: null,
                                  mat_use: null,
                                  total_use: null,
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
                            let temp = [...plan.material];
                            temp.splice(e.index, 1);
                            updatePL({
                              ...plan,
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
              }
            />
          </>
        ) : (
          <></>
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

      <DataWorkCenter
        data={workCen}
        loading={false}
        popUp={true}
        show={showWorkCen}
        onHide={() => {
          setShowWorkCen(false);
        }}
        onInput={(e) => {
          setShowWorkCen(!e);
        }}
        onSuccessInput={(e) => {
          getWorkCen();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowWorkCen(false);
            let temp = [...plan.sequence];
            temp[currentIndex].wc_id = e?.data?.id ?? null;
            temp[currentIndex].loc_id = e?.data?.loc_id?.id ?? null;
            temp[currentIndex].mch_id = e?.data?.machine_id?.id ?? null;
            temp[currentIndex].work_id = e?.data?.work_type?.id ?? null;
            updatePL({ ...plan, sequence: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataJeniskerja
        data={workType}
        loading={false}
        popUp={true}
        show={showType}
        onHide={() => {
          setShowType(false);
        }}
        onInput={(e) => {
          setShowType(!e);
        }}
        onSuccessInput={(e) => {
          getWorkType();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowType(false);
            let temp = [...plan.sequence];
            temp[currentIndex].work_id = e?.data?.id ?? null;
            updatePL({ ...plan, sequence: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

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
            let temp = [...plan.sequence];
            temp[currentIndex].mch_id = e?.data?.id ?? null;
            updatePL({ ...plan, sequence: temp });
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
            let temp = [...plan.sequence];
            temp[currentIndex].loc_id = e?.data?.id ?? null;
            updatePL({ ...plan, sequence: temp });
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
