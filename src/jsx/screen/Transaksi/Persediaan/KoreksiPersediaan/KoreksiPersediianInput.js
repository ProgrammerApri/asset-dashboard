import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_IC } from "src/redux/actions";
import DataPusatBiaya from "../../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataProject from "src/jsx/screen/MasterLainnya/Project/DataProject";
import DataAkun from "src/jsx/screen/Master/Akun/DataAkun";
import DataProduk from "src/jsx/screen/Master/Produk/DataProduk";
import DataSatuan from "src/jsx/screen/MasterLainnya/Satuan/DataSatuan";
import DataLokasi from "src/jsx/screen/Master/Lokasi/DataLokasi";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";

const defError = {
  code: false,
  date: false,
  akn: false,
  dep: false,
  proj: false,
  prod: [
    {
      id: false,
      lok: false,
      jum: false,
    },
  ],
};

const KoreksiPersediaanInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(defError);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const ic = useSelector((state) => state.ic.current);
  const isEdit = useSelector((state) => state.ic.editIc);
  const dispatch = useDispatch();
  const [pusatBiaya, setPusatBiaya] = useState(null);
  const [showDepartemen, setShowDept] = useState(false);
  const [showAcc, setShowAcc] = useState(false);
  const [showProj, setShowProj] = useState(false);
  const [showProd, setShowProd] = useState(false);
  const [showSat, setShowSat] = useState(false);
  const [showLok, setShowLok] = useState(false);
  const [product, setProduct] = useState(null);
  const [proj, setProj] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [acc, setAcc] = useState(null);
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
    getProj();
    getAcc();
    getProduct();
    getLokasi();
    getSatuan();
  }, []);

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !ic.ic_code || ic.ic_code === "",
      date: !ic.ic_date || ic.ic_date === "",
      akn: !ic.acc_id,
      dep: !ic.dep_id,
      proj: !ic.proj_id,
      prod: [],
    };

    ic?.product.forEach((element, i) => {
      if (i > 0) {
        if (element.prod_id || element.location || element.order) {
          errors.prod[i] = {
            id: !element.prod_id,
            lok: !element.location,
            jum:
              !element.order || element.order === "" || element.order === "0",
          };
        }
      } else {
        errors.prod[i] = {
          id: !element.prod_id,
          lok: !element.location,
          jum: !element.order || element.order === "" || element.order === "0",
        };
      }
    });

    if (!errors.prod[0].id && !errors.prod[0].jum && !errors.prod[0].lok) {
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
      !errors.akn &&
      !errors.dep &&
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

  const getAcc = async () => {
    const config = {
      ...endpoints.account,
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
        setAcc(data);
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

  const editIC = async () => {
    const config = {
      ...endpoints.editIC,
      endpoint: endpoints.editIC.endpoint + ic.id,
      data: ic,
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

  const addIC = async () => {
    const config = {
      ...endpoints.addIC,
      data: ic,
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
            detail: `Kode ${ic.ic_code} Sudah Digunakan`,
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

  const acco = (value) => {
    let selected = {};
    acc?.forEach((element) => {
      if (value === element.account.id) {
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
        editIC();
      } else {
        setUpdate(true);
        addIC();
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

  const updateIC = (e) => {
    dispatch({
      type: SET_CURRENT_IC,
      payload: e,
    });
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Koreksi Persediaan</b>
      </h4>
    );
  };

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-4">
            <PrimeInput
              label={"Kode Referensi"}
              value={ic.ic_code}
              onChange={(e) => {
                updateIC({ ...ic, ic_code: e.target.value });

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
              value={new Date(`${ic.ic_date}Z`)}
              onChange={(e) => {
                updateIC({ ...ic, ic_date: e.value });

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

          <div className="col-4"></div>
          <div className="col-4 mt-2">
            <label className="text-label">Kode Akun</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={ic.acc_id ? acco(ic?.acc_id) : null}
              option={acc}
              onChange={(e) => {
                updateIC({
                  ...ic,
                  acc_id: e.account?.id,
                });

                let newError = error;
                newError.akn = false;
                setError(newError);
              }}
              placeholder="Pilih Kode Akun"
              label={"[account.acc_name] - [account.acc_code]"}
              detail
              onDetail={() => setShowAcc(true)}
              errorMessage="Akun Belum Dipilih"
              error={error?.akn}
            />
          </div>

          <div className="col-4 mt-2">
            <label className="text-label">Departemen</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={ic.dep_id ? dept(ic?.dep_id) : null}
              option={pusatBiaya}
              onChange={(e) => {
                updateIC({ ...ic, dep_id: e.id });

                let newError = error;
                newError.dep = false;
                setError(newError);
              }}
              label={"[ccost_name] - [ccost_code]"}
              placeholder="Pilih Departemen"
              detail
              onDetail={() => setShowDept(true)}
              errorMessage="Departemen Belum Dipilih"
              error={error?.dep}
            />
          </div>

          <div className="col-4 mt-2">
            <label className="text-label">Project</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={ic.proj_id ? prj(ic?.proj_id) : null}
              option={proj}
              onChange={(e) => {
                updateIC({
                  ...ic,
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
        </Row>

        <CustomAccordion
          tittle={"Koreksi Produk"}
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
                value={ic.product?.map((v, i) => {
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
                    width: "25rem",
                  }}
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={ic.prod_id && checkProd(ic.prod_id)}
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

                        let temp = [...ic.product];
                        temp[e.index].prod_id = e.id;
                        temp[e.index].unit_id = e.unit?.id;
                        updateIC({ ...ic, product: temp });

                        let newError = error;
                        newError.prod[e.index].id = false;
                        setError(newError);
                      }}
                      placeholder="Pilih Kode Produk"
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
                  header="Lokasi"
                  className="align-text-top"
                  style={{
                    width: "15rem",
                  }}
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={ic.location && checkLok(ic.location)}
                      onChange={(e) => {
                        let temp = [...ic.product];
                        temp[e.index].location = e.id;
                        updateIC({ ...ic, product: temp });

                        let newError = error;
                        newError.prod[e.index].lok = false;
                        setError(newError);
                      }}
                      option={lokasi}
                      label={"[name]"}
                      placeholder="Pilih Lokasi"
                      detail
                      onDetail={() => {
                        setShowLok(true);
                        setCurrentIndex(e.index);
                      }}
                      errorMessage="Lokasi Belum Dipilih"
                      error={error?.prod[e.index]?.lok}
                    />
                  )}
                />

                <Column
                  header="Jumlah"
                  className="align-text-top"
                  style={{
                    width: "7rem",
                  }}
                  field={""}
                  body={(e) => (
                    <PrimeNumber
                      value={ic.order ? ic.order : null}
                      onChange={(a) => {
                        let temp = [...ic.product];
                        temp[e.index].order = a.target.value;
                        updateIC({ ...ic, product: temp });

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
                    width: "13rem",
                  }}
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={ic.unit_id && checkUnit(ic.unit_id)}
                      onChange={(e) => {
                        let temp = [...ic.product];
                        temp[e.index].unit_id = e.id;
                        updateIC({ ...ic, product: temp });
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
                  header="D/K"
                  className="align-text-top"
                  style={{
                    width: "7rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.acc_id && acco(e.acc_id)?.account?.sld_type}
                        onChange={(a) => {}}
                        placeholder="D/K"
                        // type="number"
                      />
                    </div>
                  )}
                />

                <Column
                  className="align-text-top"
                  body={(e) =>
                    e.index === ic.product.length - 1 ? (
                      <Link
                        onClick={() => {
                          updateIC({
                            ...ic,
                            product: [
                              ...ic.product,
                              {
                                id: 0,
                                prod_id: null,
                                unit_id: null,
                                type: null,
                                location: null,
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
                          let temp = [...ic.product];
                          temp.splice(e.index, 1);
                          updateIC({
                            ...ic,
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
            updateIC({ ...ic, dep_id: e.data.id });
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
            updateIC({ ...ic, proj_id: e.data.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataAkun
        data={acc}
        loading={false}
        popUp={true}
        show={showAcc}
        onHide={() => {
          setShowAcc(false);
        }}
        onInput={(e) => {
          setShowAcc(!e);
        }}
        onSuccessInput={(e) => {
          getAcc();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowAcc(false);
            updateIC({ ...ic, acc_id: e.data.account.id });
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

            let temp = [...ic.product];
            temp[currentIndex].prod_id = e.data?.id;
            temp[currentIndex].unit_id = e.data.id;
            updateIC({ ...ic, product: temp });
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
            let temp = [...ic.product];
            temp[currentIndex].unit_id = e.data.id;
            updateIC({ ...ic, product: temp });
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
            let temp = [...ic.product];
            temp[currentIndex].location = e.data.id;
            updateIC({ ...ic, product: temp });
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

export default KoreksiPersediaanInput;
