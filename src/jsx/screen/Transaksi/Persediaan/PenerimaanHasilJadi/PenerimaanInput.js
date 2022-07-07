import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_PHJ, SET_CURRENT_PO } from "src/redux/actions";
import DataPusatBiaya from "../../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import DataSupplier from "../../../Mitra/Pemasok/DataPemasok";
import DataRulesPay from "src/jsx/screen/MasterLainnya/RulesPay/DataRulesPay";
import DataPajak from "src/jsx/screen/Master/Pajak/DataPajak";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataLokasi from "src/jsx/screen/Master/Lokasi/DataLokasi";
import DataSatuan from "src/jsx/screen/MasterLainnya/Satuan/DataSatuan";
import DataProduk from "src/jsx/screen/Master/Produk/DataProduk";

const PenerimaanInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const phj = useSelector((state) => state.phj.current);
  const isEdit = useSelector((state) => state.phj.editPhj);
  const dispatch = useDispatch();
  const [showAcc, setShowAcc] = useState(false);
  const [showProd, setShowProd] = useState(false);
  const [showSat, setShowSat] = useState(false);
  const [showLok, setShowLok] = useState(false);
  const [product, setProduct] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [pb, setPb] = useState(null);
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
    getPB();
    getProduct();
    getSatuan();
  }, []);

  const getLokasi = async () => {
    const config = {
      ...endpoints.lokasi,
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
        setLokasi(data);
      }
    } catch (error) {}
  };

  const getPB = async () => {
    const config = {
      ...endpoints.pb,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((elem) => {
          let prod = [];
          elem.product.forEach((el) => {
            el.prod_id = el.prod_id.id;
            el.unit_id = el.unit_id.id;
            prod.push({
              ...el,
              r_order: el.order,
            });

            let temp = [...phj.product];
            phj.product.forEach((e, i) => {
              if (el.id === e.prod_id) {
                temp[i].order = el.order;
                updatePhj({ ...phj, product: temp });
              }
            });
          });
          elem.product = prod;
          filt.push(elem);
        });
        setPb(filt);
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

  const editPHJ = async () => {
    const config = {
      ...endpoints.editPHJ,
      endpoint: endpoints.editPHJ.endpoint + phj.id,
      data: phj,
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

  const addPHJ = async () => {
    const config = {
      ...endpoints.addPHJ,
      data: phj,
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
            detail: `Kode ${phj.phj_code} Sudah Digunakan`,
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

  const checkPb = (value) => {
    let selected = {};
    pb?.forEach((element) => {
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
    if (isEdit) {
      setUpdate(true);
      editPHJ();
    } else {
      setUpdate(true);
      addPHJ();
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

  const updatePhj = (e) => {
    dispatch({
      type: SET_CURRENT_PHJ,
      payload: e,
    });
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Penerimaan Hasil Jadi</b>
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
                value={phj.phj_code}
                onChange={(e) =>
                  updatePhj({ ...phj, phj_code: e.target.value })
                }
                placeholder="Masukan Kode Referensi"
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">Tanggal</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${phj.phj_date}Z`)}
                onChange={(e) => {
                  updatePhj({ ...phj, phj_date: e.value });
                }}
                placeholder="Pilih Tanggal"
                showIcon
                dateFormat="dd-mm-yy"
              />
            </div>
          </div>    

          <div className="col-5">
            <label className="text-label">Kode Pemakaian</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={phj.pb_id && checkPb(phj.pb_id)}
              option={pb}
              onChange={(e) => {
                updatePhj({
                  ...phj,
                  pb_id: e.id,
                  product: e.product,
                });
              }}
              label={"[pb_code]"}
              placeholder="Kode Pemakaian Bahan"
            />
          </div>

          {/* <div className="col-4"></div> */}

          <div className="col-7">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={phj.phj_desc}
                onChange={(e) =>
                  updatePhj({ ...phj, phj_desc: e.target.value })
                }
                placeholder="Keterangan"
              />
            </div>
          </div>
          {/* kode suplier otomatis keluar, karena sudah melekat di faktur pembelian  */}
        </Row>

        <CustomAccordion
          tittle={"Penerimaan Produk"}
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
                value={phj.product?.map((v, i) => {
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
                    width: "30rem",
                  }}
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={phj.prod_id && checkProd(phj.prod_id)}
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

                        let temp = [...phj.product];
                        temp[e.index].prod_id = e.id;
                        temp[e.index].unit_id = e.unit?.id;
                        updatePhj({ ...phj, product: temp });
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
                      value={phj.location && checkLok(phj.location)}
                      onChange={(e) => {
                        let temp = [...phj.product];
                        temp[e.index].location = e.id;
                        updatePhj({ ...phj, product: temp });
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
                        value={
                          phj.order
                            ? phj.order
                            : null
                        }
                        onChange={(a) => {
                          let temp = [...phj.product];
                          temp[e.index].order = a.target.value;
                          updatePhj({ ...phj, product: temp });
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
                    width: "10rem",
                  }}
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={phj.unit_id && checkUnit(phj.unit_id)}
                      onChange={(e) => {
                        let temp = [...phj.product];
                        temp[e.index].unit_id = e.id;
                        updatePhj({ ...phj, product: temp });
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
                  body={(e) =>
                    e.index === phj.product.length - 1 ? (
                      <Link
                        onClick={() => {
                          updatePhj({
                            ...phj,
                            product: [
                              ...phj.product,
                              {
                                id: 0,
                                prod_id: null,
                                unit_id: null,
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
                          let temp = [...phj.product];
                          temp.splice(e.index, 1);
                          updatePhj({
                            ...phj,
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

            let temp = [...phj.product];
            temp[currentIndex].prod_id = e.data?.id;
            temp[currentIndex].unit_id = e.data.id;
            updatePhj({ ...phj, product: temp });
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
            let temp = [...phj.product];
            temp[currentIndex].unit_id = e.data.id;
            updatePhj({ ...phj, product: temp });
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
            let temp = [...phj.product];
            temp[currentIndex].location = e.data.id;
            updatePhj({ ...phj, product: temp });
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

export default PenerimaanInput;
