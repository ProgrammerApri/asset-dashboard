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

// import { SET_CURRENT_FM, SET_CURRENT_WC, SET_PRODUCT } from "src/redux/actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import DataProduk from "../Produk/DataProduk";
import DataSatuan from "../../MasterLainnya/Satuan/DataSatuan";
import { TabPanel, TabView } from "primereact/tabview";
import { Divider } from "@material-ui/core";
import DataLokasi from "../Lokasi/DataLokasi";
import DataMesin from "../Mesin/DataMesin";

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

const InputWorkCenter = ({ onCancel, onSuccess }) => {
  const toast = useRef(null);
  const [error, setError] = useState(defError);
  const [update, setUpdate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doubleClick, setDoubleClick] = useState(false);
  const work = useSelector((state) => state.work.current);
  const isEdit = useSelector((state) => state.work.editWc);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [showMachine, setShowMachine] = useState(false);
  const [showLocat, setShowLocat] = useState(false);
  const [showType, setShowType] = useState(false);
  const [machine, setMachine] = useState(null);
  const [location, setLocation] = useState(null);
  const [workType, setWorkType] = useState(null);
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
    getLocation();
    getMachine();
    getWorkType();
  }, []);

  const getLocation = async () => {
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
        setLocation(data);
      }
    } catch (error) {}
  };

  const getMachine = async () => {
    const config = {
      ...endpoints.mesin,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setMachine(data);
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
      console.log(response);
      if (response.status) {
        const { data } = response;
        setWorkType(data);
      }
    } catch (error) {}
  };

  const editFM = async () => {
    const config = {
      ...endpoints.editWorkCenter,
      endpoint: endpoints.editWorkCenter.endpoint + work.id,
      data: work,
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
      ...endpoints.addWorkCenter,
      data: work,
    };
    console.log("dataaa");
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
            detail: `Kode ${work.fcode} Sudah Digunakan`,
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

  const checkLoc = (value) => {
    let selected = {};
    location?.forEach((element) => {
      if (value === element.id) {
        selected = element;
        console.log(selected);
      }
    });

    return selected;
  };

  const checkMch = (value) => {
    let selected = {};
    machine?.forEach((element) => {
      if (value === element.id) {
        selected = element;
        console.log(selected);
      }
    });

    return selected;
  };

  const checkType = (value) => {
    let selected = {};
    workType?.forEach((element) => {
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

  const updateWc = (e) => {
    dispatch({
      type: SET_CURRENT_WC,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let active = 1;
    let errors = {
      code: !work.fcode || work.fcode === "",
      name: !work.fname || work.fname === "",
      date: !work.date_created || work.date_created === "",
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
              label={"Kode Work Center"}
              value={work.work_code}
              onChange={(e) => {
                updateWc({ ...work, work_code: e.target.value });
              }}
              placeholder="Masukan Kode Work Center"
            />
          </div>
          <div className="col-4 text-black">
            <PrimeInput
              label={"Nama Work Center"}
              value={work.work_name}
              onChange={(e) => {
                updateWc({ ...work, work_name: e.target.value });
                // let newError = error;
                // newError.name = false;
                // setError(newError);
              }}
              placeholder="Masukan Nama Work Center"
              // error={error?.name}
            />
          </div>

          <div className="col-5 text-black">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputText
                value={work.desc}
                onChange={(e) => updateWc({ ...work, desc: e.target.value })}
                placeholder="Masukan Keterangan"
              />
            </div>
          </div>

          <div className="col-4 text-black">
            <label className="text-label">Lokasi</label>
            <CustomDropdown
              value={work.loc_id && checkLoc(work.loc_id)}
              onChange={(u) => {
                updateWc({ ...work, loc_id: u?.id ?? null });
              }}
              option={location}
              detail
              onDetail={() => {
                setShowLocat(true);
              }}
              label={"[name] ([code])"}
              placeholder="Pilih Lokasi"
            />
          </div>
          <div className="col-4 text-black">
            <label className="text-label">Mesin</label>
            <CustomDropdown
              value={work.machine_id && checkMch(work.machine_id)}
              onChange={(u) => {
                updateWc({ ...work, machine_id: u?.id ?? null });
              }}
              option={machine}
              detail
              onDetail={() => {
                setShowMachine(true);
              }}
              label={"[msn_name] ([msn_code])"}
              placeholder="Pilih Mesin"
            />
          </div>
          <div className="col-4 text-black">
            <label className="text-label">Jenis Pekerjaan</label>
            <CustomDropdown
              value={work.work_type && checkType(work.work_type)}
              onChange={(u) => {
                updateWc({ ...work, work_type: u?.id ?? null });
              }}
              option={workType}
              detail
              // onDetail={() => {
              //   setShowType(true);
              // }}
              label={"[name] ([code])"}
              placeholder="Pilih Jenis Pekerjaan"
            />
          </div>

          <div className="col-3 text-black">
            <label className="text-label">Jumlah SDM</label>
            <PrimeNumber
              price
              value={work.work_sdm ? work.work_sdm : null}
              onChange={(u) => {
                updateWc({ ...work, work_sdm: u?.value ?? null });
              }}
              placeholder="0"
            />
          </div>
          <div className="col-3 text-black">
            <label className="text-label">Estimasi Pengerjaan (Jam)</label>
            <PrimeNumber
              price
              value={work.work_estimasi ? work.work_estimasi : null}
              onChange={(u) => {
                updateWc({ ...work, work_estimasi: u?.value ?? null });
              }}
              placeholder="0"
            />
          </div>
          <div className="col-3 text-black">
            <label className="text-label">Estimasi OVH</label>
            <PrimeNumber
              price
              value={work.ovh_estimasi ? work.ovh_estimasi : null}
              onChange={(u) => {
                updateWc({ ...work, ovh_estimasi: u?.value ?? null });
              }}
              placeholder="0"
            />
          </div>
          <div className="col-3 text-black">
            <label className="text-label">Estimasi Biaya Kerja</label>
            <PrimeNumber
              price
              value={work.biaya_estimasi ? work.biaya_estimasi : null}
              onChange={(u) => {
                updateWc({ ...work, biaya_estimasi: u?.value ?? null });
              }}
              placeholder="0"
            />
          </div>
        </Row>
      </>
    );
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div className="justify-content-left col-6">
          <div className="col-12 mt-0 ml-0 p-0 fs-12 text-left">
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

      {/* <DataLokasi
        data={location}
        loading={false}
        popUp={true}
        show={showLocat}
        onHide={() => {
          setShowLocat(false);
        }}
        onInput={(e) => {
          setShowLocat(!e);
        }}
        onSuccessInput={(e) => {
          getLocation();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowLocat(false);
            updateWc({ ...work, loc_id: e?.data?.id ?? null });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      /> */}

      {/* <DataMesin
        data={machine}
        loading={false}
        popUp={true}
        show={showMachine}
        onHide={() => {
          setShowMachine(false);
        }}
        onInput={(e) => {
          setShowMachine(!e);
        }}
        onSuccessInput={(e) => {
          getMachine();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowMachine(false);
            updateWc({ ...work, machine_id: e.data?.id ?? null });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      /> */}
    </>
  );
};

export default InputWorkCenter;
