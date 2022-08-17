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
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";

const defError = {
  code: false,
  date: false,
  doc: false,
  doc_date: false,
  asl: false,
  tjn: false,
  mut: [
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
      code: !lm.mtsi_code || lm.mtsi_code === "",
      date: !lm.mtsi_date || lm.mtsi_date === "",
      doc: !lm.doc || lm.doc === "",
      doc_date: !lm.doc_date || lm.doc_date === "",
      asl: !lm.loc_from,
      tjn: !lm.loc_to,
      // proj: !lm.proj_id,
      mut: [],
    };

    lm?.mutasi.forEach((element, i) => {
      if (i > 0) {
        if (element.prod_id || element.qty) {
          errors.mut[i] = {
            id: !element.prod_id,
            jum: !element.qty || element.qty === "" || element.qty === "0",
          };
        }
      } else {
        errors.mut[i] = {
          id: !element.prod_id,
          jum: !element.qty || element.qty === "" || element.qty === "0",
        };
      }
    });

    if (!errors.mut[0].id && !errors.mut[0].jum) {
      errors.mut?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    let validProduct = false;
    errors.mut?.forEach((el) => {
      for (var k in el) {
        validProduct = !el[k];
      }
    });

    valid =
      !errors.code &&
      !errors.date &&
      !errors.doc &&
      !errors.doc_date &&
      !errors.asl &&
      !errors.tjn &&
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
      ...endpoints.editMutasi,
      endpoint: endpoints.editMutasi.endpoint + lm.id,
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
      ...endpoints.addMutasi,
      data: { ...lm, doc_date: currentDate(lm.doc_date) },
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
            detail: `Kode ${lm.mtsi_code} Sudah Digunakan`,
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
              value={lm.mtsi_code}
              onChange={(e) => {
                updateLM({ ...lm, mtsi_code: e.target.value });

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
              value={new Date(`${lm.mtsi_date}Z`)}
              onChange={(e) => {
                updateLM({ ...lm, mtsi_date: e.value });

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

          <div className="col-3 mr-0 ml-0">
            <PrimeInput
              label={"Kode Dokumen"}
              value={lm.doc}
              onChange={(e) => {
                updateLM({ ...lm, doc: e.target.value });

                let newError = error;
                newError.doc = false;
                setError(newError);
              }}
              placeholder="Masukan Kode Dokumen"
              error={error?.doc}
            />
          </div>

          <div className="col-2">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${lm.doc_date}Z`)}
              onChange={(e) => {
                updateLM({ ...lm, doc_date: e.value });

                let newError = error;
                newError.doc_date = false;
                setError(newError);
              }}
              placeholder="Pilih Tanggal"
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.doc_date}
            />
          </div>

          <div className="col-12 mr-0 ml-0"></div>

          <div className="col-3">
            <label className="text-label">Lokasi Asal</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={lm.loc_from ? checkLok(lm?.loc_from) : null}
              option={lokasi}
              onChange={(e) => {
                updateLM({
                  ...lm,
                  loc_from: e.id,
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
              value={lm.loc_to ? checkLok(lm?.loc_to) : null}
              option={lokasi}
              onChange={(e) => {
                updateLM({
                  ...lm,
                  loc_to: e.id,
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
              value={lm.prj_id ? prj(lm?.prj_id) : null}
              option={proj}
              onChange={(e) => {
                updateLM({
                  ...lm,
                  prj_id: e.id,
                });
              }}
              label={"[proj_name] - [proj_code]"}
              placeholder="Pilih Project"
              detail
              onDetail={() => setShowProj(true)}
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
                value={lm.mutasi?.map((v, i) => {
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
                    maxWidth: "20rem",
                  }}
                  field={""}
                  body={(e) => (
                    <PrimeDropdown
                      value={e.prod_id && checkProd(e.prod_id)}
                      options={product}
                      onChange={(u) => {
                        // looping satuan
                        let sat = [];
                        satuan.forEach((element) => {
                          if (element.id === u.value.unit.id) {
                            sat.push(element);
                          } else {
                            if (element.u_from?.id === u.value.unit.id) {
                              sat.push(element);
                            }
                          }
                        });
                        setSatuan(sat);

                        let temp = [...lm.mutasi];
                        temp[e.index].prod_id = u.value.id;
                        temp[e.index].unit_id = u.value.unit?.id;
                        updateLM({ ...lm, mutasi: temp });

                        let newError = error;
                        newError.mut[e.index].id = false;
                        setError(newError);
                      }}
                      optionLabel="name"
                      placeholder="Pilih Produk"
                      filter
                      filterBy="name"
                      errorMessage="Produk Belum Dipilih"
                      error={error?.mut[e.index]?.id}
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
                      value={e.qty ? e.qty : null}
                      onChange={(a) => {
                        let temp = [...lm.mutasi];
                        temp[e.index].qty = a.target.value;
                        updateLM({ ...lm, mutasi: temp });

                        let newError = error;
                        newError.mut[e.index].jum = false;
                        setError(newError);
                      }}
                      placeholder="0"
                      type="number"
                      min={0}
                      error={error?.mut[e.index]?.jum}
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
                    <PrimeDropdown
                      value={e.unit_id && checkUnit(e.unit_id)}
                      onChange={(e) => {
                        let temp = [...lm.mutasi];
                        temp[e.index].unit_id = e.value.id;
                        updateLM({ ...lm, mutasi: temp });
                      }}
                      options={satuan}
                      optionLabel="name"
                      placeholder="Pilih Satuan"
                      filter
                      filterBy="name"
                    />
                  )}
                />

                <Column
                  className="align-text-top"
                  body={(e) =>
                    e.index === lm.mutasi.length - 1 ? (
                      <Link
                        onClick={() => {
                          let newError = error;
                          newError.mut.push({ jum: false });
                          setError(newError);

                          updateLM({
                            ...lm,
                            mutasi: [
                              ...lm.mutasi,
                              {
                                id: 0,
                                prod_id: null,
                                unit_id: null,
                                qty: null,
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
                          let newError = error;
                          newError.mut.push({ jum: false });
                          setError(newError);

                          let temp = [...lm.mutasi];
                          temp.splice(e.index, 1);
                          updateLM({
                            ...lm,
                            mutasi: temp,
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
      <Row>
        <Col>
          <Card>
            <Card.Body>
              {/* {header()} */}
              {body()}
              {footer()}
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
