import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
import { Row, Col, Dropdown, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import DataProduk from "../../Master/Produk/DataProduk";
import DataSatuan from "../../MasterLainnya/Satuan/DataSatuan";
import DataProject from "src/jsx/screen/MasterLainnya/Project/DataProject";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import endpoints from "../../../../utils/endpoints";
import { SET_CURRENT_HRV } from "../../../../redux/actions";
import CustomAccordion from "../../../components/Accordion/Accordion";
import { tr } from "../../../../data/tr";

const defError = {
  code: false,
  date: false,
  ppa: [
    {
      id: false,
      loc: false,
      qty: false,
    },
  ],
};

const InputPanen = ({ onCancel, onSuccess }) => {
  const toast = useRef(null);
  const [state, setState] = useState(null);
  const [setup, setSetup] = useState(null);
  const [lokasi, setLok] = useState(null);
  const [sto, setSto] = useState(null);
  const [error, setError] = useState(defError);
  const [update, setUpdate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doubleClick, setDoubleClick] = useState(false);
  const hrv = useSelector((state) => state.hrv.current);
  const isEdit = useSelector((state) => state.hrv.editHrv);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [showProd, setShowProd] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [showProj, setShowProj] = useState(false);
  const [proj, setProj] = useState(null);
  const [product, setProduct] = useState(null);
  const [grupP, setGrupP] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [active, setActive] = useState(0);
  const [accor, setAccor] = useState({
    hrv_det: true,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getProduct();
    getSetup();
    getSatuan();
    getLokasi();
    getStoLoc();
    getProj();
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
        let filt = [];
        data?.forEach((element) => {
          if (element.prd_harvest) {
            filt.push(element);
          }
        });
        setProduct(filt);
        getGrupP();
      }
    } catch (error) {}
  };

  const getGrupP = async () => {
    const config = {
      ...endpoints.groupPro,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setGrupP(data);
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

  const getLokasi = async () => {
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
        setLok(data);
      }
    } catch (error) {}
  };

  const getSetup = async () => {
    const config = {
      ...endpoints.getCompany,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSetup(data);
      }
    } catch (error) {}
  };

  const getStoLoc = async (id, e) => {
    const config = {
      ...endpoints.sto,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSto(data);
      }
    } catch (error) {}
  };

  const getProj = async () => {
    const config = {
      ...endpoints.project,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        setProj(data);
      }
    } catch (error) {}
  };

  const editPP = async () => {
    const config = {
      ...endpoints.editHrv,
      endpoint: endpoints.editHrv.endpoint + hrv.id,
      data: hrv,
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

  const addPP = async () => {
    const config = {
      ...endpoints.addHrv,
      data: { ...hrv, date: currentDate(hrv.date) },
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
            detail: `Kode ${hrv.code} Sudah Digunakan`,
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

  const checkLok = (value) => {
    let selected = {};
    lokasi?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const prj = (value) => {
    let selected = {};
    proj?.forEach((element) => {
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
        editPP();
      } else {
        setUpdate(true);
        addPP();
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

  const updatePP = (e) => {
    dispatch({
      type: SET_CURRENT_HRV,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let active = 1;
    let errors = {
      code: !hrv.code || hrv.code === "",
      date: !hrv.date || hrv.date === "",
      ppa: [],
    };

    let acc_pa = null;
    let acc_gp_pa = null;
    hrv?.hrv_det.forEach((element, i) => {
      if (i > 0) {
        if (element?.prod_id || element?.loc_id || element?.qty) {
          errors.ppa[i] = {
            id: !element.prod_id,
            loc: !element.loc_id,
            qty: !element.qty || element.qty === "" || element.qty === "0",
          };
        }
      } else {
        errors.ppa[i] = {
          id: !element.prod_id,
          loc: !element.loc_id,
          qty: !element.qty || element.qty === "" || element.qty === "0",
        };
      }

      if (element?.prod_id) {
        grupP?.forEach((el) => {
          if (checkProd(element?.prod_id)?.group?.id === el?.groupPro?.id) {
            if (el.groupPro.wip) {
              acc_gp_pa = el.groupPro.acc_wip;
              acc_gp_pa = checkProd(element.prod_id)?.acc_wip;
              acc_pa = checkProd(element.prod_id)?.acc_wip;
            } else {
              acc_gp_pa = el.groupPro.acc_sto;
              acc_gp_pa = checkProd(element.prod_id)?.acc_sto;
              acc_pa = checkProd(element.prod_id)?.acc_sto;
            }
          }
        });

        if (
          (setup?.gl_detail && acc_pa === null) ||
          (!setup?.gl_detail && acc_gp_pa === null)
        ) {
          toast.current.show({
            severity: "error",
            summary: "Tidak Dapat Menyimpan Data",
            detail: `Akun Persediaan Produk Belum Diisi`,
            life: 6000,
          });
        }
      }
    });

    if (!errors.ppa[0]?.id && !errors.ppa[0]?.loc && !errors.ppa[0]?.qty) {
      errors.ppa?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    let validPpa = false;
    if (!validPpa) {
      errors.ppa?.forEach((el, i) => {
        for (var k in el) {
          validPpa = !el[k];
        }
      });
    }

    let acc_err =
      (setup?.gl_detail && acc_pa !== null) ||
      (!setup?.gl_detail && acc_gp_pa !== null);

    valid = !errors.code && !errors.date && validPpa && acc_err;

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

  const prdTemplate = (option) => {
    return (
      <div>{option !== null ? `${option.name} (${option.code})` : ""}</div>
    );
  };

  const valTemp = (option, props) => {
    if (option) {
      return (
        <div>{option !== null ? `${option.name}  (${option.code})` : ""}</div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const body = () => {
    let date = new Date(setup?.year_co, setup?.cutoff - 1, 31);
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-5 fs-13">
          <div className="col-3 text-black">
            <PrimeInput
              label={"Kode Panen"}
              value={hrv.code}
              onChange={(e) => {
                updatePP({ ...hrv, code: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode"
              error={error?.code}
              disabled={isEdit}
            />
          </div>

          <div className="col-3 text-black">
            <PrimeInput
              label={"Nama Panen"}
              value={hrv.name}
              onChange={(e) => {
                updatePP({ ...hrv, name: e.target.value });
              }}
              placeholder="Masukan Nama Panen"
            />
          </div>

          <div className="col-2 text-black">
            <div className="ml-3"></div>
            <PrimeCalendar
              label={"Tanggal Panen"}
              value={new Date(`${hrv.date}Z`)}
              onChange={(e) => {
                updatePP({ ...hrv, date: e.target.value });

                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              placeholder="Pilih Tanggal"
              dateFormat="dd-mm-yy"
              showIcon
              error={error?.date}
              minDate={date}
            />
          </div>

          <div className="col-3"></div>

          <div className="col-3">
            <label className="text-label text-black">Project</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={hrv.proj_id ? prj(hrv?.proj_id) : null}
              option={proj}
              onChange={(e) => {
                updatePP({
                  ...hrv,
                  proj_id: e.id,
                });
              }}
              label={"[proj_name] - [proj_code]"}
              placeholder="Pilih Project"
              detail
              onDetail={() => setShowProj(true)}
            />
          </div>

          <div className="col-5 text-black">
            <PrimeInput
              label={"Keterangan"}
              value={hrv.desc}
              onChange={(e) => {
                updatePP({ ...hrv, desc: e.target.value });
              }}
              placeholder="Masukan Keterangan"
            />
          </div>
        </Row>

        <CustomAccordion
          className="fs-13 text-black text-bold"
          tittle={"Produk Panen"}
          defaultActive={true}
          active={accor.hrv_det}
          onClick={() => {
            setAccor({
              ...accor,
              hrv_det: !accor.hrv_det,
            });
          }}
          key={1}
          body={
            <>
              <DataTable
                responsiveLayout="scroll"
                value={hrv.hrv_det?.map((v, i) => {
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
                  style={{
                    width: "35rem",
                  }}
                  body={(e) => (
                    <PrimeDropdown
                      value={e.prod_id && checkProd(e.prod_id)}
                      options={product}
                      onChange={(u) => {
                        let sat = [];
                        let st = 0;
                        satuan.forEach((element) => {
                          if (element.id === u.value.unit.id) {
                            sat.push(element);
                          } else {
                            if (element.u_from?.id === u.value.unit.id) {
                              sat.push(element);
                            }
                          }
                        });

                        let temp = [...hrv.hrv_det];
                        temp[e.index].prod_id = u.value.id;
                        temp[e.index].unit_id = u.value.unit?.id;

                        updatePP({ ...hrv, hrv_det: temp });

                        let newError = error;
                        newError.ppa[e.index].id = false;
                        setError(newError);
                      }}
                      filter
                      filterBy="name"
                      optionLabel="name"
                      itemTemplate={prdTemplate}
                      valueTemplate={valTemp}
                      placeholder="Pilih Produk"
                      errorMessage="Produk Belum Dipilih"
                      error={error?.ppa[e.index]?.id}
                    />
                  )}
                />

                <Column
                  header="Satuan"
                  className="align-text-top"
                  field={""}
                  style={{
                    width: "18rem",
                  }}
                  body={(e) => (
                    <PrimeDropdown
                      value={e.unit_id && checkUnit(e.unit_id)}
                      options={satuan}
                      onChange={(u) => {
                        let temp = [...hrv.hrv_det];
                        temp[e.index].unit_id = u.value.id;
                        updatePP({ ...hrv, hrv_det: temp });
                      }}
                      optionLabel="name"
                      filter
                      filterBy="name"
                      placeholder="Satuan Produk"
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
                    <PrimeDropdown
                      value={e.loc_id && checkLok(e.loc_id)}
                      options={lokasi}
                      onChange={(u) => {
                        let temp = [...hrv.hrv_det];
                        temp[e.index].loc_id = u.value.id;
                        updatePP({ ...hrv, hrv_det: temp });

                        let newError = error;
                        newError.ppa[e.index].loc = false;
                        setError(newError);
                      }}
                      optionLabel="name"
                      filter
                      filterBy="name"
                      itemTemplate={prdTemplate}
                      valueTemplate={valTemp}
                      placeholder="Lokasi Produk"
                      errorMessage="Lokasi Belum Dipilih"
                      error={error?.ppa[e.index]?.loc}
                    />
                  )}
                />

                <Column
                  header="Kuantitas Panen"
                  className="align-text-top"
                  style={{
                    width: "15rem",
                  }}
                  body={(e) => (
                    <PrimeNumber
                      price
                      value={e.qty && e.qty}
                      onChange={(u) => {
                        let temp = [...hrv.hrv_det];
                        temp[e.index].qty = Number(u.value);

                        updatePP({ ...hrv, hrv_det: temp });

                        let newError = error;
                        newError.ppa[e.index].qty = false;
                        setError(newError);
                      }}
                      placeholder="0"
                      type="number"
                      min={0}
                      error={error?.ppa[e.index]?.qty}
                    />
                  )}
                />

                <Column
                  header=""
                  className="align-text-top"
                  field={""}
                  body={(e) =>
                    e.index === hrv.hrv_det.length - 1 ? (
                      <Link
                        onClick={() => {
                          let newError = error;
                          newError.ppa.push({
                            id: false,
                            loc: false,
                            qty: false,
                          });
                          setError(newError);

                          updatePP({
                            ...hrv,
                            hrv_det: [
                              ...hrv.hrv_det,
                              {
                                id: 0,
                                prod_id: null,
                                unit_id: null,
                                loc_id: null,
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
                          let newError = error;
                          newError.ppa.push({
                            id: false,
                            loc: false,
                            qty: false,
                          });
                          setError(newError);

                          let temp = [...hrv.hrv_det];
                          temp.splice(e.index, 1);
                          updatePP({ ...hrv, hrv_det: temp });
                        }}
                        className="btn btn-danger shadow btn-xs sharp"
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
      </>
    );
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div className="justify-content-left col-6">
          <div className="col-12 mt-0 ml-0 p-0 fs-12 text-left">
            {/* <label className="text-label">
              <b>Saldo WIP : </b>
            </label> */}
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

            let temp = [...hrv.hrv_det];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;

            let tempm = [...hrv.pjadi];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;
            updatePP({ ...hrv, hrv_det: temp, pjadi: tempm });
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
            let temp = [...hrv.hrv_det];
            temp[currentIndex].unit_id = e.data.id;

            let tempm = [...hrv.pjadi];
            tempm[currentIndex].unit_id = e.data.id;
            updatePP({ ...hrv, hrv_det: temp, pjadi: tempm });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataProject
        data={proj}
        loading={false}
        popUp={true}
        show={showProj}
        onHide={() => {
          setShowProj(false);
        }}
        onInput={(e) => {
          setShowProj(!e);
        }}
        onSuccessInput={(e) => {
          getProj();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowProj(false);
            updatePP({ ...hrv, proj_id: e.data.id });
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

export default InputPanen;
