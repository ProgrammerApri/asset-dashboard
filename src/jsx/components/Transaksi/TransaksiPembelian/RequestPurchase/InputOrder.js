import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import CustomAccordion from "../../../Accordion/Accordion";
import DataPusatBiaya from "../../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import DataProduk from "../../../Master/Produk/DataProduk";
import DataJasa from "../../../Master/Jasa/DataJasa";
import DataSatuan from "../../../MasterLainnya/Satuan/DataSatuan";
import DataSupplier from "../../../Mitra/Pemasok/DataPemasok";
import PermintaanPembelian from "./PermintaanPembelian";

const data = {
  id: null,
  req_code: null,
  req_date: null,
  req_dep: {
    id: null,
    ccost_code: null,
    ccost_name: null,
    ccost_ket: null,
  },
  req_ket: null,
  refrence: false,
  ref_sup: {
    id: null,
    sup_code: null,
    sup_name: null,
    sup_jpem: null,
    sup_ppn: null,
    sup_npwp: null,
    sup_address: null,
    sup_kota: null,
    sup_kpos: null,
    sup_telp1: null,
    sup_telp2: null,
    sup_fax: null,
    sup_cp: null,
    sup_curren: null,
    sup_ket: null,
    sup_hutang: null,
    sup_uang_muka: null,
    sup_limit: null,
  },
  ref_ket: null,
};

const InputOrder = ({ onCancel }) => {
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(data);
  const toast = useRef(null);
  const [isEdit, setEdit] = useState(false);
  const [showDepartemen, setShowDepartemen] = useState(false);
  const [pusatBiaya, setPusatBiaya] = useState(null);
  const [jasa, setJasa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProduk, setShowProduk] = useState(false);
  const [showJasa, setShowJasa] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [showSupplier, setShowSupplier] = useState(false);
  const [product, setProduk] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const [satProd, setSatProd] = useState("");
  const [inProd, setInProd] = useState([
    {
      id: 0,
      prod_id: null,
      unit_id: null,
      request: null,
    },
  ]);
  const [inJasa, setInJasa] = useState([
    {
      id: 0,
      jasa_id: null,
      unit_id: null,
      qty: null,
    },
  ]);
  const [accor, setAccor] = useState({
    produk: true,
    jasa: false,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getPusatBiaya();
    getProduk();
    getJasa();
    getSatuan();
    getSupplier();
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

  const editRp = async () => {
    const config = {
      ...endpoints.editRp,
      endpoint: endpoints.editRp.endpoint + currentItem.id,
      data: {
        ...currentItem,
        prod_id: currentItem?.rprod?.prod_id ?? null,
        unit_id: currentItem?.rprod?.unit_id ?? null,
        request: currentItem?.rprod?.request ?? null,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          // setDisplayData(false);
          // getPermintaan(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Diperbarui",
            life: 3000,
          });
        }, 500);
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

  const addRp = async () => {
    const config = {
      ...endpoints.addRp,
      data: {
        ...currentItem,
        rprod: inProd,
        rjasa: inJasa,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          <PermintaanPembelian />;
          // getPermintaan(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Diperbarui",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: `Kode ${currentItem.req_code} Sudah Digunakan`,
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

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editRp();
    } else {
      setUpdate(true);
      addRp();
    }
  };

  const getProduk = async () => {
    const config = {
      ...endpoints.product,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setProduk(data);
      }
    } catch (error) {}
  };

  const getJasa = async () => {
    const config = {
      ...endpoints.jasa,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setJasa(data);
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

  const getSupplier = async () => {
    const config = {
      ...endpoints.supplier,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSupplier(data);
      }
    } catch (error) {}
  };

  const header = () => {
    return (
      <h4 className="mb-4">
        <b>Buat Permintaan</b>
      </h4>
    );
  };

  const prodTemp = (option) => {
    return (
      <div>{option !== null ? `${option.name} (${option.code})` : ""}</div>
    );
  };

  const clear = (option, props) => {
    if (option) {
      return (
        <div>{option !== null ? `${option.name} (${option.code})` : ""}</div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const jasTemp = (option) => {
    return (
      <div>
        {option !== null ? `${option.jasa.name} (${option.jasa.code})` : ""}
      </div>
    );
  };

  const valueTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.jasa.name} (${option.jasa.code})` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const suppTemp = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.supplier.sup_name} (${option.supplier.sup_code})`
          : ""}
      </div>
    );
  };

  const valueSupTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.supplier.sup_name} (${option.supplier.sup_code})`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const checkUnit = (value) => {
    let selected = {};
    satuan.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkProd = (value) => {
    let selected = {};
    product.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
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

  const supp = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const body = () => {
    return (
      <>
        <Toast ref={toast} />
        {/* Put content body here */}
        <Row className="mb-4">
          <div className="col-4">
            <label className="text-label">Tanggal</label>
            <div className="p-inputgroup">
              <Calendar
                value={currentItem !== null ? `${currentItem.req_date}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    req_date: e.value,
                  })
                }
                placeholder="Pilih Tanggal"
                showIcon
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Kode Referensi</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  currentItem !== null ? `${currentItem?.req_code ?? ""}` : ""
                }
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    req_code: e.target.value,
                  })
                }
                placeholder="Masukan Kode Referensi"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Departemen</label>
            <div className="p-inputgroup">
              <Dropdown
                value={
                  currentItem !== null &&
                  currentItem.req_dep !== null
                    ? dept(currentItem.req_dep)
                    : null
                }
                options={pusatBiaya}
                onChange={(e) => {
                  console.log(e.value);
                  setCurrentItem({
                    ...currentItem,
                      req_dep: e.value?.id ?? null,
                  });
                }}
                optionLabel="ccost_name"
                filter
                filterBy="ccost_name"
                placeholder="Pilih Departemen"
              />
              <PButton
                onClick={() => {
                  setShowDepartemen(true);
                }}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-12">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={
                  currentItem !== null ? `${currentItem?.req_ket ?? ""}` : ""
                }
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    req_ket: e.target.value,
                  })
                }
                placeholder="Masukan Keterangan"
              />
            </div>
          </div>
        </Row>

        <CustomAccordion
          tittle={"Permintaan Produk"}
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
            <Row>
              <div className="row col-12 mr-0 ml-0">
                <div className="col-4">
                  <label className="text-label">Produk</label>
                </div>

                <div className="col-3">
                  <label className="text-label">Jumlah</label>
                </div>

                <div className="col-4">
                  <label className="text-label">Satuan</label>
                </div>

                <div className="col-1 mr-0">
                  <label className="text-label">Action</label>
                </div>

                <div className="col-12">
                  <Divider></Divider>
                </div>
              </div>

              {inProd.map((v, i) => {
                return (
                  <div className="row col-12 mr-0 ml-0 mt-0">
                    <div className="col-4">
                      <div className="p-inputgroup">
                        <Dropdown
                          value={v.prod_id && checkProd(inProd[i].prod_id)}
                          //  value={
                          //   currentItem !== null ? currentItem.rprod : null
                          // }
                          options={product}
                          onChange={(e) => {
                            let temp = [...inProd];
                            temp[i].prod_id = e.value.id;
                            setInProd(temp);
                          }}
                          // onChange={(e) => {
                          //   console.log(e.value);
                          //   // if (isEdit && e.value.rprod.id ===) {

                          //   // }
                          //   setCurrentItem({
                          //     ...currentItem,
                          //     rprod: e.target.value,
                          //   });
                          // }}
                          optionLabel="name"
                          filter
                          filterBy="name"
                          placeholder="Pilih Produk"
                          valueTemplate={clear}
                          itemTemplate={prodTemp}
                        />
                        <PButton
                          onClick={() => {
                            setShowProduk(true);
                          }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-3">
                      <div className="p-inputgroup">
                        <InputText
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.request ?? ""}`
                          //     : ""
                          // }
                          value={v.request && checkUnit(inProd[i].request)}
                          onChange={(e) => {
                            let temp = [...inProd];
                            temp[i].request = e.value;
                            setInProd(temp);
                          }}
                          // onChange={(e) =>
                          //   setCurrentItem({
                          //     ...currentItem,
                          //     request: e.target.value,
                          //   })
                          // }
                          placeholder="Masukan Jumlah"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="p-inputgroup">
                        <Dropdown
                          value={v.unit_id && checkUnit(inProd[i].unit_id)}
                          onChange={(e) => {
                            let temp = [...inProd];
                            temp[i].unit_id = e.value.id;
                            setInProd(temp);
                          }}
                          options={satuan}
                          optionLabel="name"
                          filter
                          filterBy="name"
                          placeholder="Pilih Satuan"
                        />
                        <PButton
                          onClick={() => {
                            setShowSatuan(true);
                          }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-1 d-flex ml-0 mr-0">
                      <div className="mt-2">
                        {i == inProd.length - 1 ? (
                          <Link
                            onClick={() => {
                              setInProd([
                                ...inProd,
                                {
                                  id: 0,
                                  prod_id: null,
                                  unit_id: null,
                                  request: null,
                                },
                              ]);
                            }}
                            className="btn btn-primary shadow btn-xs sharp ml-1"
                          >
                            <i className="fa fa-plus"></i>
                          </Link>
                        ) : (
                          <Link
                            onClick={() => {
                              console.log(inProd);
                              console.log(i);
                              let temp = [...inProd];
                              temp.splice(i, 1);
                              setInProd(temp);
                            }}
                            className="btn btn-danger shadow btn-xs sharp ml-1"
                          >
                            <i className="fa fa-trash"></i>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Row>
          }
        />

        <CustomAccordion
          tittle={"Permintaan Jasa"}
          defaultActive={false}
          active={accor.jasa}
          onClick={() => {
            setAccor({
              ...accor,
              jasa: !accor.jasa,
            });
          }}
          key={1}
          body={
            <Row>
              <div className="row col-12 mr-0 ml-0 mb-0">
                <div className="col-4">
                  <label className="text-label">Kode Jasa</label>
                </div>

                <div className="col-3">
                  <label className="text-label">Jumlah</label>
                </div>

                <div className="col-4">
                  <label className="text-label">Satuan</label>
                </div>

                <div className="col-1">
                  <label className="text-label">Action</label>
                </div>

                <div className="col-12">
                  <Divider></Divider>
                </div>
              </div>

              {inJasa.map((v, i) => {
                return (
                  <div className="row col-12 mr-0 ml-0 mb-0">
                    <div className="col-4">
                      <div className="p-inputgroup">
                        <Dropdown
                          value={currentItem !== null ? currentItem.jasa : null}
                          options={jasa}
                          onChange={(e) => {
                            console.log(e.value);
                            setCurrentItem({
                              ...currentItem,
                              jasa: e.target.value,
                            });
                          }}
                          optionLabel="jasa.name"
                          filter
                          filterBy="jasa.name"
                          placeholder="Pilih Jasa"
                          valueTemplate={valueTemp}
                          itemTemplate={jasTemp}
                        />
                        <PButton
                          onClick={() => {
                            setShowJasa(true);
                          }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-3">
                      <div className="p-inputgroup">
                        <InputText
                          value={
                            currentItem !== null
                              ? `${currentItem?.rjasa?.qty ?? ""}`
                              : ""
                          }
                          onChange={(e) =>
                            setCurrentItem({
                              ...currentItem,
                              rjasa: {
                                ...currentItem.rjasa,
                                qty: e.target.value,
                              },
                            })
                          }
                          placeholder="Masukan Jumlah"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="p-inputgroup">
                        <Dropdown
                          value={
                            currentItem !== null ? currentItem.unit_id : null
                          }
                          options={satuan}
                          onChange={(e) => {
                            console.log(e.value);
                            setCurrentItem({
                              ...currentItem,
                              unit_id: e.target.value,
                            });
                          }}
                          optionLabel="name"
                          filter
                          filterBy="name"
                          placeholder="Pilih Jasa"
                        />
                        <PButton
                          onClick={() => {
                            setShowSatuan(true);
                          }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-1 d-flex ml-0">
                      <div className="mt-2">
                        {i == inJasa.length - 1 ? (
                          <Link
                            onClick={() => {
                              setInJasa([
                                ...inJasa,
                                {
                                  id: 0,
                                  jasa_id: 1,
                                  unit_id: null,
                                  qty: null,
                                },
                              ]);
                            }}
                            className="btn btn-primary shadow btn-xs sharp ml-1"
                          >
                            <i className="fa fa-plus"></i>
                          </Link>
                        ) : (
                          <Link
                            onClick={() => {
                              console.log(inJasa);
                              console.log(i);
                              let temp = [...inJasa];
                              temp.splice(i, 1);
                              setInJasa(temp);
                            }}
                            className="btn btn-danger shadow btn-xs sharp ml-1"
                          >
                            <i className="fa fa-trash"></i>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Row>
          }
        />

        <div className="row mb-0">
          <div className="d-flex col-12 align-items-center mt-4">
            <label className="ml-0 mt-1">{"Referensi Tambahan"}</label>
            <InputSwitch
              className="ml-4"
              checked={currentItem && currentItem.refrence}
              onChange={(e) => {
                setCurrentItem({
                  ...currentItem,
                  refrence: e.target.value,
                });
              }}
            />
          </div>

          <div className="col-6">
            <label className="text-label">Kode Supplier</label>
            <div className="p-inputgroup">
              <Dropdown
                value={
                  currentItem !== null &&
                  currentItem.ref_sup !== null
                    ? supp(currentItem.ref_sup)
                    : null
                }
                options={supplier}
                onChange={(e) => {
                  console.log(e.value);
                  setCurrentItem({
                    ...currentItem,
                      ref_sup: e.value?.id ?? null,
                  });
                }}
                optionLabel="ref_sup.sup_name"
                filter
                filterBy="ref_sup.sup_name"
                placeholder="Pilih Supplier"
                itemTemplate={suppTemp}
                valueTemplate={valueSupTemp}
                disabled={currentItem && !currentItem.refrence}
              />
              <PButton
                onClick={() => {
                  setShowSupplier(true);
                }}
                disabled={currentItem && !currentItem.refrence}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={
                  currentItem !== null ? `${currentItem?.ref_ket ?? ""}` : ""
                }
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    ref_ket: e.target.value,
                  })
                }
                placeholder="Masukan Keterangan"
                disabled={currentItem && !currentItem.refrence}
              />
            </div>
          </div>
        </div>
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
          setShowDepartemen(false);
        }}
        onInput={(e) => {
          setShowDepartemen(!e);
        }}
        onSuccessInput={(e) => {
          getPusatBiaya();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowDepartemen(false);
            // setCurrentItem({
            //   ...currentItem,
            //   jpel: e.data,
            // });
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
        show={showProduk}
        onHide={() => {
          setShowProduk(false);
        }}
        onInput={(e) => {
          setShowProduk(!e);
        }}
        onSuccessInput={(e) => {
          getProduk();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowProduk(false);
            // setCurrentItem({
            //   ...currentItem,
            //   jpel: e.data,
            // });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataJasa
        data={jasa}
        loading={false}
        popUp={true}
        show={showJasa}
        onHide={() => {
          setShowJasa(false);
        }}
        onInput={(e) => {
          setShowJasa(!e);
        }}
        onSuccessInput={(e) => {
          getJasa();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowJasa(false);
            // setCurrentItem({
            //   ...currentItem,
            //   jpel: e.data,
            // });
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
          getJasa();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSatuan(false);
            // setCurrentItem({
            //   ...currentItem,
            //   jpel: e.data,
            // });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataSupplier
        data={supplier}
        loading={false}
        popUp={true}
        show={showSupplier}
        onHide={() => {
          setShowSupplier(false);
        }}
        onInput={(e) => {
          setShowSupplier(!e);
        }}
        onSuccessInput={(e) => {
          getJasa();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSupplier(false);
            // setCurrentItem({
            //   ...currentItem,
            //   jpel: e.data,
            // });
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

export default InputOrder;
