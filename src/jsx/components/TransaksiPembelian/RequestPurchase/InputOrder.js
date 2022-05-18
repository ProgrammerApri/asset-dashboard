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
import CustomAccordion from "../../Accordion/Accordion";
import DataPusatBiaya from "../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import DataProduk from "../../Master/Produk/DataProduk";
import DataJasa from "../../Master/Jasa/DataJasa";
import DataSatuan from "../../MasterLainnya/Satuan/DataSatuan";
import DataSupplier from "../../Mitra/Pemasok/DataPemasok";

const data = {};

const type = [
  { name: "Aktif", code: "A" },
  { name: "Non Aktif", code: "N" },
];

const InputOrder = ({ onCancel, onSubmit }) => {
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
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
  const [inProd, setInProd] = useState([
    {
      id: 0,
      qty: 1,
      u_from: null,
      u_to: null,
    },
  ]);
  const [inJasa, setInJasa] = useState([
    {
      id: 0,
      qty: 1,
      u_from: null,
      u_to: null,
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

  // const editPermintaan = async () => {
  //   const config = {
  //     ...endpoints.editPermintaan,
  //     endpoint: endpoints.editPermintaan.endpoint + currentItem.id,
  //     data: {
  //       cus_code: currentItem.customer.cus_code,

  //     },
  //   };
  //   console.log(config.data);
  //   let response = null;
  //   try {
  //     response = await request(null, config);
  //     console.log(response);
  //     if (response.status) {
  //       setTimeout(() => {
  //         setUpdate(false);
  //         setDisplayData(false);
  //         getPermintaan(true);
  //         toast.current.show({
  //           severity: "info",
  //           summary: "Berhasil",
  //           detail: "Data Berhasil Diperbarui",
  //           life: 3000,
  //         });
  //       }, 500);
  //     }
  //   } catch (error) {
  //     setTimeout(() => {
  //       setUpdate(false);
  //       toast.current.show({
  //         severity: "error",
  //         summary: "Gagal",
  //         detail: "Gagal Memperbarui Data",
  //         life: 3000,
  //       });
  //     }, 500);
  //   }
  // };

  // const addPermintaan = async () => {
  //   const config = {
  //     ...endpoints.addPermintaan,
  //     data: {
  //       cus_code: currentItem.customer.cus_code,

  //     },
  //   };
  //   console.log(config.data);
  //   let response = null;
  //   try {
  //     response = await request(null, config);
  //     console.log(response);
  //     if (response.status) {
  //       setTimeout(() => {
  //         setUpdate(false);
  //         setDisplayData(false);
  //         getPermintaan(true);
  //         toast.current.show({
  //           severity: "info",
  //           summary: "Berhasil",
  //           detail: "Data Berhasil Diperbarui",
  //           life: 3000,
  //         });
  //       }, 500);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     if (error.status === 400) {
  //       setTimeout(() => {
  //         setUpdate(false);
  //         toast.current.show({
  //           severity: "error",
  //           summary: "Gagal",
  //           detail: `Kode ${currentItem.customer.cus_code} Sudah Digunakan`,
  //           life: 3000,
  //         });
  //       }, 500);
  //     } else {
  //       setTimeout(() => {
  //         setUpdate(false);
  //         toast.current.show({
  //           severity: "error",
  //           summary: "Gagal",
  //           detail: "Gagal Memperbarui Data",
  //           life: 3000,
  //         });
  //       }, 500);
  //     }
  //   }
  // };

  // const onClick = () => {
  //   setCurrentItem();
  // };

  // const renderFooter = () => {
  //   return (
  //     <div>
  //       <PButton
  //         label="Batal"
  //         onClick={() => setDisplayData(false)}
  //         className="p-button-text btn-primary"
  //       />
  //       <PButton
  //         label="Simpan"
  //         icon="pi pi-check"
  //         onClick={() => onSubmit()}
  //         autoFocus
  //         loading={update}
  //       />
  //     </div>
  //   );
  // };

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

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Row className="mb-4">
          <div className="col-4">
            <label className="text-label">Tanggal</label>
            <div className="p-inputgroup">
              <Calendar
                // value={
                //   currentItem !== null
                //     ? `${currentItem?.jasa?.code ?? ""}`
                //     : ""
                // }
                onChange={(e) =>
                  setCurrentItem({
                    // ...currentItem,
                    // jasa: { ...currentItem.jasa, code: e.target.value },
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
                // value={
                //   currentItem !== null
                //     ? `${currentItem?.jasa?.name ?? ""}`
                //     : ""
                // }
                onChange={(e) =>
                  setCurrentItem({
                    // ...currentItem,
                    // jasa: { ...currentItem.jasa, name: e.target.value },
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
                // value={
                //   currentItem !== null
                //     ? `${currentItem?.jasa?.name ?? ""}`
                //     : ""
                // }
                onChange={(e) =>
                  setCurrentItem({
                    // ...currentItem,
                    // jasa: { ...currentItem.jasa, name: e.target.value },
                  })
                }
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
                // value={
                //   currentItem !== null
                //     ? `${currentItem?.jasa?.name ?? ""}`
                //     : ""
                // }
                onChange={(e) =>
                  setCurrentItem({
                    // ...currentItem,
                    // jasa: { ...currentItem.jasa, name: e.target.value },
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
              <div className="row col-12 mr-0 ml-0 mb-0">
                <div className="col-4">
                  <label className="text-label">Produk</label>
                </div>

                <div className="col-2">
                  <label className="text-label">Jumlah</label>
                </div>

                <div className="col-4">
                  <label className="text-label">Satuan</label>
                </div>

                <div className="col-2">
                  <label className="text-label">Action</label>
                </div>
              </div>

              {inProd.map((v, i) => {
                return (
                  <div className="row col-12 mr-0 ml-0 mt-0">
                    <div className="col-4">
                      <div className="p-inputgroup">
                        <Dropdown
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="Pilih Produk"
                          options={product}
                          optionLabel="name"
                          filter
                          filterBy="name"
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

                    <div className="col-2">
                      <div className="p-inputgroup">
                        <InputText
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
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
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
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

                    <div className="col-2 d-flex ml-0">
                      <div className="mt-2">
                        {i == inProd.length - 1 ? (
                          <Link
                            onClick={() => {
                              setInProd([
                                ...inProd,
                                {
                                  id: 0,
                                  qty: 1,
                                  u_from: null,
                                  u_to: null,
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

                <div className="col-2">
                  <label className="text-label">Jumlah</label>
                </div>

                <div className="col-4">
                  <label className="text-label">Satuan</label>
                </div>

                <div className="col-2">
                  <label className="text-label">Action</label>
                </div>
              </div>

              {inJasa.map((v, i) => {
                return (
                  <div className="row col-12 mr-0 ml-0 mb-0">
                    <div className="col-4">
                      <div className="p-inputgroup">
                        <Dropdown
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
                          placeholder="Pilih Kode Jasa"
                          options={jasa}
                          optionLabel="name"
                          filter
                          filterBy="name"
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

                    <div className="col-2">
                      <div className="p-inputgroup">
                        <InputText
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
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
                          // value={
                          //   currentItem !== null
                          //     ? `${currentItem?.jasa?.name ?? ""}`
                          //     : ""
                          // }
                          onChange={(e) =>
                            setCurrentItem({
                              // ...currentItem,
                              // jasa: { ...currentItem.jasa, name: e.target.value },
                            })
                          }
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

                    <div className="col-2 d-flex ml-0">
                      <div className="mt-2">
                        {i == inJasa.length - 1 ? (
                          <Link
                            onClick={() => {
                              setInJasa([
                                ...inJasa,
                                {
                                  id: 0,
                                  qty: 1,
                                  u_from: null,
                                  u_to: null,
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
              checked={currentItem && currentItem.type === "A"}
              onChange={(e) => {
                setCurrentItem({
                  ...currentItem,
                  type: e.value ? "A" : "N",
                });
              }}
            />
          </div>

          <div className="col-6">
            <label className="text-label">Kode Supplier</label>
            <div className="p-inputgroup">
              <Dropdown
                // value={
                //   currentItem !== null
                //     ? `${currentItem?.jasa?.name ?? ""}`
                //     : ""
                // }
                onChange={(e) =>
                  setCurrentItem({
                    // ...currentItem,
                    // jasa: { ...currentItem.jasa, name: e.target.value },
                  })
                }
                placeholder="Pilih Kode Supplier"
                disabled={currentItem && currentItem.type === "N"}
              />
              <PButton
                onClick={() => {
                  setShowSupplier(true);
                }}
                disabled={currentItem && currentItem.type === "N"}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputTextarea
                // value={
                //   currentItem !== null
                //     ? `${currentItem?.jasa?.name ?? ""}`
                //     : ""
                // }
                onChange={(e) =>
                  setCurrentItem({
                    // ...currentItem,
                    // jasa: { ...currentItem.jasa, name: e.target.value },
                  })
                }
                placeholder="Masukan Keterangan"
                disabled={currentItem && currentItem.type === "N"}
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
            onClick={onSubmit}
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
