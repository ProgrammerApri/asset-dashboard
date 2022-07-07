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

const KoreksiPersediaanInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
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
    if (isEdit) {
      setUpdate(true);
      editIC();
    } else {
      setUpdate(true);
      addIC();
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
            <label className="text-label">Kode Referensi</label>
            <div className="p-inputgroup">
              <InputText
                value={ic.ic_code}
                onChange={(e) => updateIC({ ...ic, ic_code: e.target.value })}
                placeholder="Masukan Kode Referensi"
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">Tanggal</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${ic.ic_date}Z`)}
                onChange={(e) => {
                  updateIC({ ...ic, ic_date: e.value });
                }}
                placeholder="Pilih Tanggal"
                showIcon
                dateFormat="dd-mm-yy"
              />
            </div>
          </div>

          <div className="col-4"></div>
          <div className="col-4">
            <label className="text-label">Kode Akun</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={ic.acc_id ? acco(ic?.acc_id) : null}
              option={acc}
              onChange={(e) => {
                updateIC({ ...ic, acc_id: e.account?.id });
              }}
              placeholder="Pilih Kode Akun"
              label={"[account.acc_name] ([account.acc_code])"}
              detail
              onDetail={() => setShowAcc(true)}
            />
          </div>

          <div className="col-4">
            <label className="text-label">Departemen</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={ic.dep_id ? dept(ic?.dep_id) : null}
              option={pusatBiaya}
              onChange={(e) => {
                updateIC({ ...ic, dep_id: e.id });
              }}
              label={"[ccost_name] ([ccost_code])"}
              placeholder="Pilih Departemen"
              detail
              onDetail={() => setShowDept(true)}
            />
          </div>

          <div className="col-4">
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
              }}
              label={"[proj_name] ([proj_code])"}
              placeholder="Pilih Project"
              detail
              onDetail={() => setShowProj(true)}
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
                      }}
                      placeholder="Pilih Kode Produk"
                      label={"[name] ([code])"}
                      detail
                      onDetail={() => {
                        setShowProd(true);
                        setCurrentIndex(e.index);
                      }}
                    />
                  )}
                />

                <Column
                  header="Lokasi"
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
                      }}
                      option={lokasi}
                      label={"[name] ([code])"}
                      placeholder="Pilih Lokasi"
                      detail
                      onDetail={() => {
                        setShowLok(true);
                        setCurrentIndex(e.index);
                      }}
                    />
                  )}
                />

                <Column
                  header="Jumlah"
                  style={{
                    width: "7rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={ic.order ? ic.order : null}
                        onChange={(a) => {
                          let temp = [...ic.product];
                          temp[e.index].order = a.target.value;
                          updateIC({ ...ic, product: temp });
                        }}
                        placeholder="0"
                        type="number"
                      />
                    </div>
                  )}
                />

                <Column
                  header="Satuan"
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
                      label={"[name] ([code])"}
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
                  style={{
                    width: "7rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.acc_id && acco(e.acc_id).account.sld_type}
                        onChange={(a) => {}}
                        placeholder="D/K"
                        // type="number"
                      />
                    </div>
                  )}
                />

                <Column
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
      {header()}
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
