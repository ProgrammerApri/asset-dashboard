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

const data = {};

const InputPO = ({ onCancel, onSubmit }) => {
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [isEdit, setEdit] = useState(false);
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
        <Row>
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
                placeholder="Tanggal Permintaan"
                showIcon
              />
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

        <h4 className="mt-7 ml-0 mr-3">
          <b>Permintaan Produk</b>
        </h4>
        <div className="row mt-4">
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
            <label className="text-label">Harga Satuan</label>
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

          <div className="d-flex">
            <div className="mt-5"></div>
          </div>
        </div>
        <Divider className="mb-2 ml-0 mr-3"></Divider>

        {inProd.map((v, i) => {
          return (
            <div className="row mb-1">
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
                    showButtons
                  />
                </div>
              </div>

              <div className="col-1">
                <div className="p-inputgroup">
                  <InputNumber
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
                  />
                </div>
              </div>

              <div className="col-1">
                <div className="p-inputgroup">
                  <InputNumber
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
                  />
                </div>
              </div>

              <div className="col-1">
                <div className="p-inputgroup">
                  <InputNumber
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
                  />
                </div>
              </div>

              <div className="col-1">
                <div className="p-inputgroup">
                  <InputNumber
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
                    disabled
                  />
                </div>
              </div>

              <div className="col-1">
                <div className="p-inputgroup">
                  <InputNumber
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
                  />
                </div>
              </div>

              <div className="col-1">
                <div className="p-inputgroup">
                  <InputNumber
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
                  />
                </div>
              </div>

              <div className="col-1">
                <div className="p-inputgroup">
                  <InputNumber
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
        <Divider className="mb-2 ml-0 mr-3"></Divider>

        <h4 className="mt-7 ml-0 mr-3">
          <b>Permintaan Jasa</b>
        </h4>
        <div className="row mt-4">
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

          <div className="d-flex">
            <div className="mt-5"></div>
          </div>
        </div>
        <Divider className="mb-2 ml-0 mr-3"></Divider>

        {inJasa.map((v, i) => {
          return (
            <div className="row mb-1">
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
                </div>
              </div>

              <div className="col-1">
                <div className="p-inputgroup">
                  <InputNumber
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
                  />
                </div>
              </div>

              <div className="col-2">
                <div className="p-inputgroup">
                  <InputNumber
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
                    disabled
                  />
                </div>
              </div>

              <div className="col-1">
                <div className="p-inputgroup">
                  <InputNumber
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
                    disabled
                  />
                </div>
              </div>

              <div className="col-1">
                <div className="p-inputgroup">
                  <InputNumber
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
        <Divider className="mb-2 ml-0 mr-3"></Divider>

        <div className="row ml-0 mr-0 mb-0 justify-content-between">
          <div></div>
          <div>
            <div className="d-flex col-12 align-items-center mt-4">
              <label className="mt-1">{"Referensi Tambahan"}</label>
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

            <div className="col-12">
              <div className="p-inputgroup">
                <label className="text-label mr-7">Sub Total Barang</label>
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
                  placeholder="Sub Total"
                />
              </div>
            </div>

            <div className="col-12">
              <div className="p-inputgroup">
                <label className="text-label mr-2">
                  Diskon Tambahan (%/Rp)
                </label>
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
                  placeholder="Diskon Tambahan"
                />
              </div>
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
