import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "react-bootstrap";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { SelectButton } from "primereact/selectbutton";
import CustomAccordion from "../../Accordion/Accordion";

const data = {};

const InputPO = ({ onCancel, onSubmit }) => {
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

  const type = [
    { name: "%", code: "P" },
    { name: "Rp", code: "R" },
  ];

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
        <b>Buat Permintaan PO</b>
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
            <label className="text-label">No. Permintaan Pembelian</label>
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
                placeholder="Pilih Kode Permintaan"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Supplier</label>
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
                placeholder="Pilih Supplier"
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
            <label className="text-label"></label>
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
                placeholder="Alamat Supplier"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label"></label>
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

          <div className="col-4">
            <label className="text-label">Tanggal Permintaan</label>
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
            <label className="text-label">Ppn</label>
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
                placeholder="Pilih Jenis Pajak"
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
            <label className="text-label">Departemen</label>
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
                placeholder="Tanggal Permintaan"
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

          <div className="col-6">
            <label className="text-label">Syarat Pembayaran</label>
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

          <div className="col-6">
            <label className="text-label">Tanggal Jatuh Tempo</label>
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
            <Row>
              <div className="row col-12 mr-0 ml-0">
                <div className="col-2 ml-0">
                  <label className="text-label">Kode Produk</label>
                </div>

                <div className="col-2">
                  <label className="text-label">Satuan</label>
                </div>

                <div className="col-1">
                  <label className="text-label">Permintaan</label>
                </div>

                <div className="col-1">
                  <label className="text-label">Pesanan</label>
                </div>

                <div className="col-1">
                  <label className="text-label">Sisa</label>
                </div>

                <div className="col-1">
                  <label className="text-label">Harga</label>
                </div>

                <div className="col-1">
                  <label className="text-label">Diskon</label>
                </div>

                <div className="col-1">
                  <label className="text-label">Harga Nett</label>
                </div>

                <div className="col-1">
                  <label className="text-label">Total</label>
                </div>

                <div className="col-1">
                  <label className="text-label">Action</label>
                </div>
              </div>

              <div className="col-12">
                <Divider></Divider>
              </div>

              {inProd.map((v, i) => {
                return (
                  <div className="row col-12 mb-0 mr-0 ml-0">
                    <div className="col-2">
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

                    <div className="col-2">
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

                    <div className="col-1">
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
                          placeholder="0"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-1">
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
                          placeholder="0"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-1">
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
                          placeholder="0"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-1">
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

                    <div className="col-1">
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

                    <div className="col-1">
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
                          placeholder="Harga Nett"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-1">
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
                          placeholder="Total Harga"
                          type="number"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-1 d-flex ml-0">
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
              <div className="row col-12 mt-0 mr-0 ml-0">
                <div className="col-2">
                  <label className="text-label">Kode Supplier</label>
                </div>
                <div className="col-2">
                  <label className="text-label">Kode Jasa</label>
                </div>

                <div className="col-2">
                  <label className="text-label">Satuan</label>
                </div>

                <div className="col-1">
                  <label className="text-label">Jumlah</label>
                </div>

                <div className="col-2">
                  <label className="text-label">Harga</label>
                </div>

                <div className="col-1">
                  <label className="text-label">Diskon</label>
                </div>

                <div className="col-1">
                  <label className="text-label">Total</label>
                </div>

                <div className="col-1">
                  <label className="text-label">Action</label>
                </div>
              </div>

              <div className="col-12">
                <Divider></Divider>
              </div>

              {inJasa.map((v, i) => {
                return (
                  <div className="row col-12 mb-1 mr-0 ml-0">
                    <div className="col-2">
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

                    <div className="col-2">
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

                    <div className="col-2">
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

                    <div className="col-1">
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
                          placeholder="0"
                          type="number"
                        />
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
                          placeholder="Masukan Harga"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-1">
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
                          placeholder="0"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="col-1">
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
                          placeholder="0"
                          type="number"
                          disabled
                        />
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

        <div className="row ml-0 mr-0 mb-0 mt-6 justify-content-between">
          <div>
            <div className="row ml-1">
              <div className="d-flex col-12 align-items-center">
                <label className="mt-1">{"Pisah Faktur"}</label>
                <InputSwitch
                  className="ml-4"
                  // checked={currentItem && currentItem.type == "d"}
                  onChange={(e) => {
                    setCurrentItem({
                      ...currentItem,
                      type: e.value ? "y" : "t",
                    });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row justify-content-right col-6">
            <div className="col-6">
              <label className="text-label">Sub Total Barang</label>
            </div>

            <div className="col-6">
              <label className="text-label">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">DPP Barang</label>
            </div>

            <div className="col-6">
              <label className="text-label">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">Pajak Atas Barang (11%)</label>
            </div>

            <div className="col-6">
              <label className="text-label">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-6 mt-3">
              <label className="text-label">Diskon Tambahan</label>
            </div>

            <div className="col-6">
              <div className="p-inputgroup">
                <PButton
                  label="Rp."
                  className={`${isRp ? "" : "p-button-outlined"}`}
                  onClick={() => setRp(true)}
                />
                <InputText placeholder="Diskon" />
                <PButton className={`${isRp ? "p-button-outlined" : ""}`} onClick={() => setRp(false)}>
                  {" "}
                  <b>%</b>{" "}
                </PButton>
              </div>
            </div>

            <div className="col-12">
              <Divider className="ml-12"></Divider>
            </div>

            <div className="col-6">
              <label className="text-label">
                <b>Total Pembayaran</b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label fs-16">
                <b>Rp. </b>
              </label>
            </div>
          </div>

          {/* {currentItem !== null && currentItem.faktur === true ? (
            // currentItem.type === "G" ? (
            <>
              <div className="row justify-content-right col-6">
                <div className="col-6">
                  <label className="text-label">Sub Total Jasa</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label">Diskon Tambahan</label>
                </div>

                <div className="col-6">
                  <div className="p-inputgroup">
                    <Button icon="pi pi-check" className="p-button-success" />
                    <InputText placeholder="Diskon" />
                    <Button icon="pi pi-times" className="p-button-danger" />
                  </div>
                </div>

                <div className="col-6">
                  <label className="text-label">DPP Jasa</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label">Pajak Atas Jasa (2%)</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-12">
                  <Divider className="ml-12"></Divider>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Total Pembayaran</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label fs-16">
                    <b>Rp. </b>
                  </label>
                </div>
              </div>
            </>
          ) : // ) : null
          null} */}
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

export default InputPO;
