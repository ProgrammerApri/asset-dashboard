import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_LM } from "src/redux/actions";
import DataPusatBiaya from "../../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataProject from "src/jsx/screen/MasterLainnya/Project/DataProject";
import DataProduk from "src/jsx/screen/Master/Produk/DataProduk";
import DataSatuan from "src/jsx/screen/MasterLainnya/Satuan/DataSatuan";
import DataLokasi from "src/jsx/screen/Master/Lokasi/DataLokasi";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";

const defError = {
  code: false,
  date: false,
  asl: false,
  tjn: false,
  proj: false,
  prod: [
    {
      id: false,
      jum: false,
    },
  ],
};

const MutasiAntarInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(defError);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const lm = useSelector((state) => state.lm.current);
  const isEdit = useSelector((state) => state.lm.editLm);
  const dispatch = useDispatch();
  const [pusatBiaya, setPusatBiaya] = useState(null);
  const [showDepartemen, setShowDept] = useState(false);
  const [showProj, setShowProj] = useState(false);
  const [showProd, setShowProd] = useState(false);
  const [showSat, setShowSat] = useState(false);
  const [showLok, setShowLok] = useState(false);
  const [showLoks, setShowLoks] = useState(false);
  const [product, setProduct] = useState(null);
  const [proj, setProj] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [accor, setAccor] = useState({
    produk: true,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getPusatBiaya();
    getLokasi();
    getProj();
    getProduct();
    getSatuan();
  }, []);

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !lm.lm_code || lm.lm_code === "",
      date: !lm.lm_date || lm.lm_date === "",
      asl: !lm.lok_asl,
      tjn: !lm.lok_tjn,
      proj: !lm.proj_id,
      prod: [],
    };

    lm?.product.forEach((element, i) => {
      if (i > 0) {
        if (element.prod_id || element.order) {
          errors.prod[i] = {
            id: !element.prod_id,
            jum:
              !element.order || element.order === "" || element.order === "0",
          };
        }
      } else {
        errors.prod[i] = {
          id: !element.prod_id,
          jum: !element.order || element.order === "" || element.order === "0",
        };
      }
    });

    if (!errors.prod[0].id && !errors.prod[0].jum) {
      errors.prod?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    let validProduct = false;
    errors.prod?.forEach((el) => {
      for (var k in el) {
        validProduct = !el[k];
      }
    });

    valid =
      !errors.code &&
      !errors.date &&
      !errors.asl &&
      !errors.tjn &&
      !errors.proj &&
      validProduct;

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

  const getPusatBiaya = async () => {
    const config = {
      ...endpoints.pusatBiaya,
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
        setPusatBiaya(data);
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
        setLokasi(data);
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

  const editLM = async () => {
    const config = {
      ...endpoints.editLM,
      endpoint: endpoints.editLM.endpoint + lm.id,
      data: lm,
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

  const addLM = async () => {
    const config = {
      ...endpoints.addLM,
      data: lm,
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
            detail: `Kode ${lm.lm_code} Sudah Digunakan`,
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

  const dept = (value) => {
    let selected = {};
    pusatBiaya?.forEach((element) => {
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

  const checkProd = (value) => {
    let selected = {};
    product?.forEach((element) => {
      if (value === element.id) {
        selected = element;
        console.log("SELEC");
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

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editLM();
      } else {
        setUpdate(true);
        addLM();
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

    return [year, month, day].join("-");
  };

  const updateLM = (e) => {
    dispatch({
      type: SET_CURRENT_LM,
      payload: e,
    });
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Mutasi Antar Lokasi</b>
      </h4>
    );
  };

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4 ">
          <div className="col-3 mr-0 ml-0">
            <PrimeInput
              label={"Kode Referensi"}
              value={lm.lm_code}
              onChange={(e) => {
                updateLM({ ...lm, lm_code: e.target.value });

                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode Referensi"
              error={error?.code}
            />
          </div>

          <div className="col-2">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${lm.lm_date}Z`)}
              onChange={(e) => {
                updateLM({ ...lm, lm_date: e.value });

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

          <div className="col-12 mr-0 ml-0"></div>

          <div className="col-3">
            <label className="text-label">Lokasi Asal</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={lm.lok_asl ? checkLok(lm?.lok_asl) : null}
              option={lokasi}
              onChange={(e) => {
                updateLM({
                  ...lm,
                  lok_asl: e.id,
                });

                let newError = error;
                newError.asl = false;
                setError(newError);
              }}
              label={"[name] - [code]"}
              placeholder="Lokasi Asal"
              detail
              onDetail={() => setShowLok(true)}
              errorMessage="Lokasi Asal Belum Dipilih"
              error={error?.asl}
            />
          </div>

          <div className="col-3">
            <label className="text-label">Lokasi Tujuan</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={lm.lok_tjn ? checkLok(lm?.lok_tjn) : null}
              option={lokasi}
              onChange={(e) => {
                updateLM({
                  ...lm,
                  lok_tjn: e.id,
                });

                let newError = error;
                newError.tjn = false;
                setError(newError);
              }}
              label={"[name] - [code]"}
              placeholder="Lokasi Tujuan"
              detail
              onDetail={() => setShowLoks(true)}
              errorMessage="Lokasi Tujuan Belum Dipilih"
              error={error?.tjn}
            />
          </div>
          {/* <div className="col-6"></div>  */}
          <div className="col-3">
            <label className="text-label">Departemen</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={lm.dep_id ? dept(lm?.dep_id) : null}
              option={pusatBiaya}
              onChange={(e) => {
                updateLM({ ...lm, dep_id: e.id });
              }}
              label={"[ccost_name] - [ccost_code]"}
              placeholder="Pilih Departemen"
              detail
              onDetail={() => setShowDept(true)}
            />
          </div>

          <div className="col-3">
            <label className="text-label">Project</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={lm.proj_id ? prj(lm?.proj_id) : null}
              option={proj}
              onChange={(e) => {
                updateLM({
                  ...lm,
                  proj_id: e.id,
                });

                let newError = error;
                newError.proj = false;
                setError(newError);
              }}
              label={"[proj_name] - [proj_code]"}
              placeholder="Pilih Project"
              detail
              onDetail={() => setShowProj(true)}
              errorMessage="Project Belum Dipilih"
              error={error?.proj}
            />
          </div>
          {/* kode suplier otomatis keluar, karena sudah melekat di faktur pembelian  */}
        </Row>

        <CustomAccordion
          tittle={"Mutasi Produk"}
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
                value={lm.product?.map((v, i) => {
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
                  header="Produk"
                  className="align-text-top"
                  style={{
                    maxWidth: "15rem",
                  }}
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={lm.prod_id && checkProd(lm.prod_id)}
                      option={product}
                      onChange={(e) => {
                        let sat = [];
                        satuan.forEach((element) => {
                          if (element.id === e.unit.id) {
                            sat.push(element);
                          } else {
                            if (element.u_from?.id === e.unit.id) {
                              sat.push(element);
                            }
                          }
                        });
                        setSatuan(sat);

                        let temp = [...lm.product];
                        temp[e.index].prod_id = e.id;
                        temp[e.index].unit_id = e.unit?.id;
                        updateLM({ ...lm, product: temp });

                        let newError = error;
                        newError.prod[e.index].id = false;
                        setError(newError);
                      }}
                      placeholder="Pilih Produk"
                      label={"[name]"}
                      detail
                      onDetail={() => {
                        setShowProd(true);
                        setCurrentIndex(e.index);
                      }}
                      errorMessage="Produk Belum Dipilih"
                      error={error?.prod[e.index]?.id}
                    />
                  )}
                />

                <Column
                  header="Jumlah Mutasi"
                  className="align-text-top"
                  style={{
                    width: "10rem",
                  }}
                  field={""}
                  body={(e) => (
                    <PrimeNumber
                      value={lm.order ? lm.order : null}
                      onChange={(a) => {
                        let temp = [...lm.product];
                        temp[e.index].order = a.target.value;
                        updateLM({ ...lm, product: temp });

                        let newError = error;
                        newError.prod[e.index].jum = false;
                        setError(newError);
                      }}
                      placeholder="0"
                      type="number"
                      min={0}
                      error={error?.prod[e.index]?.jum}
                    />
                  )}
                />

                <Column
                  header="Satuan"
                  className="align-text-top"
                  style={{
                    maxWidth: "15rem",
                  }}
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={lm.unit_id && checkUnit(lm.unit_id)}
                      onChange={(e) => {
                        let temp = [...lm.product];
                        temp[e.index].unit_id = e.id;
                        updateLM({ ...lm, product: temp });
                      }}
                      option={satuan}
                      label={"[name]"}
                      placeholder="Pilih Satuan"
                      detail
                      onDetail={() => {
                        setShowSat(true);
                        setCurrentIndex(e.index);
                      }}
                    />
                  )}
                />

                <Column
                  className="align-text-top"
                  body={(e) =>
                    e.index === lm.product.length - 1 ? (
                      <Link
                        onClick={() => {
                          let newError = error;
                          newError.prod.push({ jum: false });
                          setError(newError);

                          updateLM({
                            ...lm,
                            product: [
                              ...lm.product,
                              {
                                id: 0,
                                prod_id: null,
                                unit_id: null,
                                order: null,
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
                          let temp = [...lm.product];
                          temp.splice(e.index, 1);
                          updateLM({
                            ...lm,
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
      </>
    );
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div>
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
    );
  };

  return (
    <>
      {/* {header()} */}
      {body()}
      {footer()}

      <DataPusatBiaya
        data={pusatBiaya}
        loading={false}
        popUp={true}
        show={showDepartemen}
        onHide={() => {
          setShowDept(false);
        }}
        onInput={(e) => {
          setShowDept(!e);
        }}
        onSuccessInput={(e) => {
          getPusatBiaya();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowDept(false);
            updateLM({ ...lm, dep_id: e.data.id });
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
            updateLM({ ...lm, proj_id: e.data.id });
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
            setSatuan(sat);

            let temp = [...lm.product];
            temp[currentIndex].prod_id = e.data?.id;
            temp[currentIndex].unit_id = e.data.id;
            updateLM({ ...lm, product: temp });
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
        show={showSat}
        onHide={() => {
          setShowSat(false);
        }}
        onInput={(e) => {
          setShowSat(!e);
        }}
        onSuccessInput={(e) => {
          getSatuan();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSat(false);
            let temp = [...lm.product];
            temp[currentIndex].unit_id = e.data.id;
            updateLM({ ...lm, product: temp });
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
          getLokasi();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowLok(false);
            updateLM({ ...lm, lok_asl: e.data.id });
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
        show={showLoks}
        onHide={() => {
          setShowLoks(false);
        }}
        onInput={(e) => {
          setShowLoks(!e);
        }}
        onSuccessInput={(e) => {
          getLokasi();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowLoks(false);
            updateLM({ ...lm, lok_tjn: e.data.id });
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

export default MutasiAntarInput;
