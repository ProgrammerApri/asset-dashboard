import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Row, Card, Col } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import CustomAccordion from "../../../Accordion/Accordion";

const data = {
  faktur: false,
};

const InputSO = ({ onCancel, onSubmit }) => {
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [isEdit, setEdit] = useState(false);
  const [isRp, setRp] = useState(true);
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
  }, []);

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

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Buat Permintaan SO</b>
      </h4>
    );
  };

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Row className="mb-6">
          <div className="col-6">
            <label className="text-black fs-15">Tanggal</label>
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

          <div className="col-6">
            <label className="text-black fs-14">Kode Referensi</label>
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
            <label className="text-black fs-14">Pelanggan</label>
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
                placeholder="Pilih Pelanggan"
              />
              <PButton
              // onClick={() => {
              //   setShowJenisPelanggan(true);
              // }}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-4">
            <label className="text-black fs-14"></label>
            <div className="p-inputgroup mt-2">
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
                placeholder="Alamat Pelanggan"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-black fs-14"></label>
            <div className="p-inputgroup mt-2">
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
                placeholder="Kontak Person"
              />
            </div>
          </div>

          <div className="col-12">
            <label className="text-black fs-14">Ppn</label>
            <div className="p-inputgroup mt-2">
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
                placeholder="Pilih Jenis Ppn"
              />
              <PButton
              // onClick={() => {
              //   setShowJenisPelanggan(true);
              // }}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="d-flex col-12 align-items-center mt-4">
            <label className="ml-0 mt-1 text-black fs-14">{"Alamat Pengiriman"}</label>
            <InputSwitch
              className="ml-4"
              checked={currentItem && currentItem.send_add}
              onChange={(e) => {
                setCurrentItem({
                  ...currentItem,
                  send_add: e.target.value,
                });
              }}
            />
          </div>

          <div className="col-4">
            <label className="text-black fs-14">Sub Pelanggan</label>
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
                placeholder="Pilih Sub Pelanggan"
                disabled={currentItem && !currentItem.send_add}
              />
              <PButton
                // onClick={() => {
                //   setShowJenisPelanggan(true);
                // }}
                disabled={currentItem && !currentItem.send_add}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-4">
            <label className="text-black fs-14"></label>
            <div className="p-inputgroup mt-1">
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
                placeholder="Alamat Sub Pelanggan"
                disabled={currentItem && !currentItem.send_add}
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-black fs-14"></label>
            <div className="p-inputgroup mt-1">
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
                placeholder="Kontak Person"
                disabled={currentItem && !currentItem.send_add}
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-black fs-14">Tanggal Permintaan</label>
            <div className="p-inputgroup mt-2">
              <Calendar
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
                placeholder="Tanggal Permintaan"
                showIcon
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-black fs-14">Syarat Pembayaran</label>
            <div className="p-inputgroup mt-2">
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
                placeholder="Pilih Syarat Pembayaran"
              />
              <PButton
              // onClick={() => {
              //   setShowJenisPelanggan(true);
              // }}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-4">
            <label className="text-black fs-14">Tanggal Jatuh Tempo</label>
            <div className="p-inputgroup mt-2">
              <Calendar
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
                placeholder="Tanggal Jatuh Tempo"
                showIcon
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
            <Row className="justify-content-between">
              {inProd.map((v, i) => {
                return (
                  <div className="row mr-0 ml-0 justify-content-right col-12">
                    <div className="col-5">
                      <label className="text-black fs-14">Kode Produk</label>
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
                          placeholder="Pilih Kode Produk"
                        />
                        <PButton
                        // onClick={() => {
                        //   setShowJenisPelanggan(true);
                        // }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-4">
                      <label className="text-black fs-14">Satuan</label>
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
                        // onClick={() => {
                        //   setShowJenisPelanggan(true);
                        // }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-2">
                      <label className="text-black fs-14">Pesanan</label>
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
                          placeholder="Jumlah Pesanan"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-3">
                      <label className="text-black fs-14">Harga Satuan</label>
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
                          placeholder="Masukan Harga Satuan"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-2">
                      <label className="text-black fs-14">Diskon</label>
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
                          placeholder="Diskon"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-3">
                      <label className="text-black fs-14">Harga Nett</label>
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
                          placeholder="Masukan Harga Nett"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-3">
                      <label className="text-black fs-14">Total Harga</label>
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
                          placeholder="Masukan Total Harga"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-1 d-flex ml-0">
                      {i === inProd.length - 1 ? (
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
            <Row className="justify-content-between">
              {inJasa.map((v, i) => {
                return (
                  <div className="row mr-0 ml-0 justify-content-right col-12">
                    <div className="col-4">
                      <label className="text-black fs-14">Kode Supplier</label>
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
                        />
                        <PButton
                        // onClick={() => {
                        //   setShowJenisPelanggan(true);
                        // }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-4">
                      <label className="text-black fs-14">Kode Jasa</label>
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
                        />
                        <PButton
                        // onClick={() => {
                        //   setShowJenisPelanggan(true);
                        // }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-3">
                      <label className="text-black fs-14">Satuan</label>
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
                        // onClick={() => {
                        //   setShowJenisPelanggan(true);
                        // }}
                        >
                          <i class="bx bx-food-menu"></i>
                        </PButton>
                      </div>
                    </div>

                    <div className="col-2">
                      <label className="text-black fs-14">Pesanan</label>
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
                          placeholder="Jumlah Pesanan"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-3">
                      <label className="text-black fs-14">Harga Satuan</label>
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
                          placeholder="Masukan Harga Satuan"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-2">
                      <label className="text-black fs-14">Diskon</label>
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
                          placeholder="Diskon"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <label className="text-black fs-14">Total Harga</label>
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
                          placeholder="Masukan Total Harga"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-1 d-flex ml-0">
                      {i === inJasa.length - 1 ? (
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
                );
              })}
            </Row>
          }
        />

        <div className="row ml-0 mr-0 mb-0 mt-6 justify-content-between">
          <div>
            <div className="row ml-1">
              <div className="d-flex col-12 align-items-center">
                <label className="mt-1 text-black fs-14">{"Pisah Faktur"}</label>
                <InputSwitch
                  className="ml-4"
                  checked={currentItem && currentItem.faktur}
                  onChange={(e) => {
                    setCurrentItem({
                      ...currentItem,
                      faktur: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row justify-content-right col-6">
            <div className="col-6">
              <label className="text-black fs-14">Sub Total Barang</label>
            </div>

            <div className="col-6">
              <label className="text-black fs-14">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-black fs-14">DPP Barang</label>
            </div>

            <div className="col-6">
              <label className="text-black fs-14">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-black fs-14">Pajak Atas Barang (11%)</label>
            </div>

            <div className="col-6">
              <label className="text-black fs-14">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-6 mt-3">
              <label className="text-black fs-14">Diskon Tambahan</label>
            </div>

            <div className="col-6">
              <div className="p-inputgroup">
                <PButton
                  label="Rp."
                  className={`${isRp ? "" : "p-button-outlined"}`}
                  onClick={() => setRp(true)}
                />
                <InputText placeholder="Diskon" />
                <PButton
                  className={`${isRp ? "p-button-outlined" : ""}`}
                  onClick={() => setRp(false)}
                >
                  {" "}
                  <b>%</b>{" "}
                </PButton>
              </div>
            </div>

            <div className="col-12">
              <Divider className="ml-12"></Divider>
            </div>

            <div className="col-6">
              <label className="text-black fs-15">
                <b>Total Pembayaran</b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-black fs-15">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-12">
              <Divider className="ml-12"></Divider>
            </div>

            {currentItem !== null && currentItem.faktur ? (
              <>
                {/* <div className="row justify-content-right col-12 mt-4"> */}
                <div className="col-6 mt-4">
                  <label className="text-black fs-14">Sub Total Jasa</label>
                </div>

                <div className="col-6 mt-4">
                  <label className="text-black fs-14">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">DPP Jasa</label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">Pajak Atas Jasa (2%)</label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-6 mt-3">
                  <label className="text-black fs-14">Diskon Tambahan</label>
                </div>

                <div className="col-6">
                  <div className="p-inputgroup">
                    <PButton
                      label="Rp."
                      className={`${isRp ? "" : "p-button-outlined"}`}
                      onClick={() => setRp(true)}
                    />
                    <InputText placeholder="Diskon" />
                    <PButton
                      className={`${isRp ? "p-button-outlined" : ""}`}
                      onClick={() => setRp(false)}
                    >
                      {" "}
                      <b>%</b>{" "}
                    </PButton>
                  </div>
                </div>

                <div className="col-12">
                  <Divider className="ml-12"></Divider>
                </div>

                <div className="col-6">
                  <label className="text-black fs-15">
                    <b>Total Pembayaran</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-15">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-12">
                  <Divider className="ml-12"></Divider>
                </div>
                {/* </div> */}
              </>
            ) : null}
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
      <Row>
        <Col className="pt-0">
          <Card>
            <Card.Body>
              {header()}
              {body()}
              {footer()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default InputSO;