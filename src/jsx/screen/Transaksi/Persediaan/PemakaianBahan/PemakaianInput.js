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
import { SET_CURRENT_PB } from "src/redux/actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
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
  prod: [
    {
      id: false,
      lok: false,
      sto: false,
      jum: false,
    },
  ],
};

const PemakaianInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(defError);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const pb = useSelector((state) => state.pb.current);
  const isEdit = useSelector((state) => state.pb.editPb);
  const dispatch = useDispatch();
  const [showAcc, setShowAcc] = useState(false);
  const [showProd, setShowProd] = useState(false);
  const [showSat, setShowSat] = useState(false);
  const [showLok, setShowLok] = useState(false);
  const [product, setProduct] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [numb, setNumb] = useState(true);
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
    getLokasi();
    getProduct();
    getAcc();
    getStatus()
    getSatuan();
  }, []);

  const getStatus = async () => {
    const config = {
      ...endpoints.getstatus_pbb,
      data: {},
    };

    console.log("Data sebelum request:", config.data);

    let response = null;
    try {
      response = await request(null, config);
      console.log("Response:", response);
      if (response.status) {
        const { data } = response;

        setNumb(data);
      }
    } catch (error) {setNumb(false);
      console.error("Error:", error);
    }
  };



  const isValid = () => {
    let valid = false;
    let errors = {
      code: !pb.pb_code || pb.pb_code === "",
      date: !pb.pb_date || pb.pb_date === "",
      akn: !pb.acc_id,
      prod: [],
    };

    pb?.product.forEach((element, i) => {
      if (i > 0) {
        if (
          element.prod_id ||
          element.location ||
          element.end ||
          element.order
        ) {
          errors.prod[i] = {
            id: !element.prod_id,
            lok: !element.location,
            sto: !element.end || element.end === "" || element.end === "0",
            jum:
              !element.order || element.order === "" || element.order === "0",
          };
        }
      } else {
        errors.prod[i] = {
          id: !element.prod_id,
          lok: !element.location,
          sto: !element.end || element.end === "" || element.end === "0",
          jum: !element.order || element.order === "" || element.order === "0",
        };
      }
    });

    if (
      !errors.prod[0].id &&
      !errors.prod[0].lok &&
      !errors.prod[0].sto &&
      !errors.prod[0].jum
    ) {
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

    valid = !errors.code && !errors.date && !errors.akn && validProduct;

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

  const getAcc = async () => {
    const config = {
      ...endpoints.account,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setAcc(data);
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

  const editPB = async () => {
    const config = {
      ...endpoints.editPB,
      endpoint: endpoints.editPB.endpoint + pb.id,
      data: pb,
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

  const addPB = async () => {
    const config = {
      ...endpoints.addPB,
      data: pb,
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
            detail: `Kode ${pb.pb_code} Sudah Digunakan`,
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

  const checkAcc = (value) => {
    let selected = {};
    acc?.forEach((element) => {
      if (value === element.account.id) {
        selected = element;
      }
    });

    return selected;
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editPB();
      } else {
        setUpdate(true);
        addPB();
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

  const updatePB = (e) => {
    dispatch({
      type: SET_CURRENT_PB,
      payload: e,
    });
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Pemakaian Bahan Baku</b>
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
              value={pb.pb_code}
              onChange={(e) => {
                updatePB({ ...pb, pb_code: e.target.value });

                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode Referensi"
              error={error?.code}
              disabled={numb}
            />
          </div>

          <div className="col-3">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${pb.pb_date}Z`)}
              onChange={(e) => {
                updatePB({ ...pb, pb_date: e.value });

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

          <div className="col-5">
            <label className="text-label">Kode Akun WIP</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={pb.acc_id ? checkAcc(pb?.acc_id) : null}
              option={acc}
              onChange={(e) => {
                updatePB({
                  ...pb,
                  acc_id: e.account.id,
                });

                let newError = error;
                newError.akn = false;
                setError(newError);
              }}
              label={"[account.acc_name] - [account.acc_code]"}
              placeholder="Pilih Kode Akun WIP"
              detail
              onDetail={() => setShowAcc(true)}
              errorMessage="Akun Belum Dipilih"
              error={error?.akn}
            />
          </div>
          
        </Row>

        <CustomAccordion
          tittle={"Pemakaian Produk"}
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
                value={pb.product?.map((v, i) => {
                  return {
                    ...v,
                    index: i,
                    // end: v?.end ?? 0,
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
                  style={{
                    width: "30rem",
                  }}
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={pb.prod_id && checkProd(pb.prod_id)}
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

                        let temp = [...pb.product];
                        temp[e.index].prod_id = e.id;
                        temp[e.index].unit_id = e.unit?.id;
                        updatePB({ ...pb, product: temp });

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
                  header="Satuan"
                  className="align-text-top"
                  style={{
                    width: "10rem",
                  }}
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={pb.unit_id && checkUnit(pb.unit_id)}
                      onChange={(e) => {
                        let temp = [...pb.product];
                        temp[e.index].unit_id = e.id;
                        updatePB({ ...pb, product: temp });
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
                  header="Lokasi"
                  className="align-text-top"
                  style={{
                    width: "15rem",
                  }}
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={pb.location && checkLok(pb.location)}
                      onChange={(e) => {
                        let temp = [...pb.product];
                        temp[e.index].location = e.id;
                        updatePB({ ...pb, product: temp });

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
                  header="Ending Stok"
                  className="align-text-top"
                  style={{
                    width: "10rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <PrimeNumber
                        value={pb.end ? pb.end : null}
                        onChange={(a) => {
                          let temp = [...pb.product];
                          temp[e.index].end = a.target.value;
                          updatePB({ ...pb, product: temp });

                          let newError = error;
                          newError.prod[e.index].sto = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        error={error?.prod[e.index]?.sto}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Jumlah"
                  className="align-text-top"
                  style={{
                    width: "10rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <PrimeNumber
                        value={pb.order ? pb.order : null}
                        onChange={(a) => {
                          let temp = [...pb.product];
                          temp[e.index].order = a.target.value;
                          updatePB({ ...pb, product: temp });

                          let newError = error;
                          newError.prod[e.index].jum = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        error={error?.prod[e.index]?.jum}
                      />
                    </div>
                  )}
                />

                <Column
                  className="align-text-top"
                  body={(e) =>
                    e.index === pb.product.length - 1 ? (
                      <Link
                        onClick={() => {
                          let newError = error;
                          newError.prod.push({ sto: false, jum: false });
                          setError(newError);

                          updatePB({
                            ...pb,
                            product: [
                              ...pb.product,
                              {
                                id: 0,
                                prod_id: null,
                                unit_id: null,
                                end: null,
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
                          let temp = [...pb.product];
                          temp.splice(e.index, 1);
                          updatePB({
                            ...pb,
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
            updatePB({ ...pb, acc_id: e.data.account.id });
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

            let temp = [...pb.product];
            temp[currentIndex].prod_id = e.data?.id;
            temp[currentIndex].unit_id = e.data.id;
            updatePB({ ...pb, product: temp });
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
            let temp = [...pb.product];
            temp[currentIndex].unit_id = e.data.id;
            updatePB({ ...pb, product: temp });
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
            let temp = [...pb.product];
            temp[currentIndex].location = e.data.id;
            updatePB({ ...pb, product: temp });
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

export default PemakaianInput;
