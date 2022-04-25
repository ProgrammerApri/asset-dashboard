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
import { Badge } from "primereact/badge";
import { InputNumber } from "primereact/inputnumber";
import { TabPanel, TabView } from "primereact/tabview";

const data = {};

const Produk = () => {
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [position, setPosition] = useState("center");
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [active, setActive] = useState(0);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getProduk();
    initFilters1();
  }, []);

  const getProduk = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.produk,
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
        setProduk(data);
      }
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const editProduk = async () => {
    const config = {
      ...endpoints.editProduk,
      endpoint: endpoints.editProduk.endpoint + currentItem.id,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDisplayData(false);
          getProduk(true);
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

  const addProduk = async () => {
    const config = {
      ...endpoints.addProduk,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDisplayData(false);
          getProduk(true);
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
            detail: `Kode ${currentItem.customer.cus_code} Sudah Digunakan`,
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

  const delProduk = async (id) => {
    const config = {
      ...endpoints.delProduk,
      endpoint: endpoints.delProduk.endpoint + currentItem.id,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDisplayDel(false);
          getProduk(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Dihapus",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setUpdate(false);
        setDisplayDel(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: `Tidak Dapat Menghapus Data`,
          life: 3000,
        });
      }, 500);
    }
  };

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            console.log(data);
            setEdit(true);
            onClick("displayData", data);
            setCurrentItem(data);
          }}
          className="btn btn-primary shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          onClick={() => {
            setEdit(true);
            setDisplayDel(true);
            setCurrentItem(data);
          }}
          className="btn btn-danger shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-trash"></i>
        </Link>
      </div>
      // </React.Fragment>
    );
  };

  const onClick = () => {
    setDisplayData(true);
    setCurrentItem();

    if (position) {
      setPosition(position);
    }
  };

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editProduk();
    } else {
      setUpdate(true);
      addProduk();
    }
  };

  const renderFooter = () => {
    if (active !== 1) {
      return (
        <div className="mt-3">
          {active > 0 ? (
            <PButton
              label="Sebelumnya"
              onClick={() => {
                if (active > 0) {
                  setActive(active - 1);
                }
              }}
              className="p-button-text btn-primary"
            />
          ) : (
            <PButton
              label="Batal"
              onClick={() => setDisplayData(false)}
              className="p-button-text btn-primary"
            />
          )}
          <PButton
            label="Selanjutnya"
            onClick={() => {
              if (active < 2) {
                setActive(active + 1);
              }
            }}
            autoFocus
            loading={update}
          />
        </div>
      );
    }

    return (
      <div className="mt-3">
        <PButton
          label="Sebelumnya"
          onClick={() => {
            if (active > 0) {
              setActive(active - 1);
            }
          }}
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
    );
  };

  const renderFooterDel = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => setDisplayDel(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Hapus"
          icon="pi pi-trash"
          onClick={() => {
            delProduk();
          }}
          autoFocus
          loading={update}
        />
      </div>
    );
  };

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Cari disini"
          />
        </span>
        <Button
          variant="primary"
          onClick={() => {
            setEdit(false);
            setCurrentItem(data);
            setDisplayData(true);
          }}
        >
          Tambah{" "}
          <span className="btn-icon-right">
            <i class="bx bx-plus"></i>
          </span>
        </Button>
      </div>
    );
  };

  const template2 = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        { label: "Semua", value: options.totalRecords },
      ];

      return (
        <React.Fragment>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Data per halaman:{" "}
          </span>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
          />
        </React.Fragment>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} dari {options.totalRecords}
        </span>
      );
    },
  };

  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
  };

  const renderTabHeader = (options) => {
    return (
      <button
        type="button"
        onClick={options.onClick}
        className={options.className}
      >
        {options.titleElement}
        <Badge
          value={`${options.index + 1}`}
          className={`${active === options.index ? "active" : ""} ml-2`}
        ></Badge>
      </button>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <div className="col-md-4 col-sm-4">
          <Card>
            <Card.Body className="p-4">
              <h4 className="fs-140 text-black font-w600 mt-3">
                <b>0 Item Produk</b>
              </h4>
              <span className="fs-13 text-black font-w600 mb-0">
                Segera Habis
              </span>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4 col-sm-4">
          <Card>
            <Card.Body className="p-4">
              <h4 className="fs-140 text-black font-w600 mt-3">
                <b>1 Item Produk</b>
              </h4>
              <span className="fs-13 text-black font-w600 mb-0">Habis</span>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4 col-sm-4">
          <Card>
            <Card.Body className="p-4">
              <h4 className="fs-140 text-black font-w600 mt-3">
                <b>10 Item Produk</b>
              </h4>
              <span className="fs-13 text-black font-w600 mb-0">Terdaftar</span>
            </Card.Body>
          </Card>
        </div>

        <Col className="pt-0">
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : produk}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "produk.code",
                  "produk.barcode",
                  "produk.name",
                  "produk.group_barang",
                  "produk.departemen",
                  "produk.stock",
                ]}
                emptyMessage="Tidak ada data"
                paginator
                paginatorTemplate={template2}
                first={first2}
                rows={rows2}
                onPage={onCustomPage2}
                paginatorClassName="justify-content-end mt-3"
              >
                <Column
                  header="Kode Barang"
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => e.code}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Barcode"
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => e.barcode}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Barang"
                  field={(e) => e.name}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Group Barang"
                  field={(e) => e.group_barang}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Departemen Barang"
                  field={(e) => e.departemen}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Informasi Stock"
                  field={(e) => e.stock}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Action"
                  dataType="boolean"
                  bodyClassName="text-center"
                  style={{ minWidth: "2rem" }}
                  body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Dialog
        header={isEdit ? "Edit Data Produk" : "Tambah Data Produk"}
        visible={displayData}
        style={{ width: "50vw" }}
        footer={renderFooter()}
        onHide={() => {
          setEdit(false);
          setDisplayData(false);
        }}
      >
        <TabView activeIndex={active} onTabChange={(e) => setActive(e.index)}>
          <TabPanel header="Informasi Produk" headerTemplate={renderTabHeader}>
            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Kode Barang</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.produk?.code ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        produk: {
                          ...currentItem.produk,
                          code: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukan Kode Produk"
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Nama Barang</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.produk?.name ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        produk: {
                          ...currentItem.produk,
                          name: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukan Nama Barang"
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Kode Group</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={currentItem !== null ? currentItem.jpel : null}
                    // options={divisi}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        jpel: e.value,
                      });
                    }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    placeholder="Pilih Group Barang"
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Type Barang</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={currentItem !== null ? currentItem.subArea : null}
                    // options={subArea}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        subArea: e.value,
                      });
                    }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    placeholder="Pilih Type Barang"
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-12">
                <label className="text-label">Kode Sebelumnya</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.produk?.kd_sebelumnya ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.produk,
                          kd_sebelumnya: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukan Kode Sebelumnya"
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Satuan</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={currentItem !== null ? currentItem.satuan : null}
                    // options={divisi}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        satuan: e.value,
                      });
                    }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    placeholder="Pilih Satuan Barang"
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Pemasok</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={currentItem !== null ? currentItem.pemasok : null}
                    // options={subArea}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        pemasok: e.value,
                      });
                    }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    placeholder="Pilih Pemasok"
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Harga Beli</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={`${currentItem?.produk?.hrg_beli ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        produk: {
                          ...currentItem.produk,
                          hrg_beli: e.value,
                        },
                      })
                    }
                    placeholder="Masukan Harga Beli"
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Harga Jual</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={`${currentItem?.produk?.hrg_jual ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        produk: {
                          ...currentItem.produk,
                          hrg_jual: e.value,
                        },
                      })
                    }
                    placeholder="Masukan Harga Jual"
                  />
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel
            header="Informasi Produk Lainnya"
            headerTemplate={renderTabHeader}
          >
            <div className="row mr-0 ml-0">
              <div className="col-12">
                <label className="text-label">Kode Barcode</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.produk?.barcode ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        produk: {
                          ...currentItem.produk,
                          barcode: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukan Kode Barcode"
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Maksimum Stock</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={`${currentItem?.produk?.max_stock ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        produk: {
                          ...currentItem.produk,
                          max_stock: e.value,
                        },
                      })
                    }
                    placeholder="Masukan Maksimum Stock"
                    showButtons
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Minimum Stock</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={`${currentItem?.produk?.min_stock ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        produk: {
                          ...currentItem.produk,
                          min_stock: e.value,
                        },
                      })
                    }
                    placeholder="Masukan Minimum Stock"
                    showButtons
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Reorder Stock</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={`${currentItem?.produk?.reorder ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        produk: {
                          ...currentItem.produk,
                          reorder: e.value,
                        },
                      })
                    }
                    placeholder="Masukan Reorder Stock"
                    showButtons
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Lead Timeout Stock</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.produk?.lead_timeout ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        produk: {
                          ...currentItem.produk,
                          lead_timeout: e.value,
                        },
                      })
                    }
                    placeholder="Masukan Lead Timeout Stock"
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-12">
                <label className="text-label">Maksimal Order</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={`${currentItem?.produk?.max_order ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        produk: {
                          ...currentItem.produk,
                          max_order: e.value,
                        },
                      })
                    }
                    placeholder="Masukan Maksimal Order"
                    showButtons
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-12">
                <label className="text-label">Gambar</label>
                <div className="flex align-items-center flex-column">
                  <Card
                    className="upload mb-3"
                    data-pr-tooltip="Klik Untuk Memilih Foto"
                    style={{
                      cursor: "pointer",
                      height: "200px",
                      width: "200px",
                    }}
                    onClick={() => {}}
                  >
                    <Card.Body className="flex align-items-center justify-content-center">
                      {data ? (
                        <img
                          style={{ maxWidth: "150px" }}
                          // src={URL.createObjectURL()}
                          alt=""
                        />
                      ) : currentItem && currentItem.gambar !== "" ? (
                        <img
                          style={{ maxWidth: "150px" }}
                          src={currentItem.gambar}
                          alt=""
                        />
                      ) : (
                        <i
                          className="pi pi-image p-3"
                          style={{
                            fontSize: "3em",
                            borderRadius: "50%",
                            backgroundColor: "var(--surface-b)",
                            color: "var(--surface-d)",
                          }}
                        ></i>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </Dialog>

      <Dialog
        header={"Hapus Data"}
        visible={displayDel}
        style={{ width: "30vw" }}
        footer={renderFooterDel("displayDel")}
        onHide={() => {
          setDisplayDel(false);
        }}
      >
        <div className="ml-3 mr-3">
          <i
            className="pi pi-exclamation-triangle mr-3 align-middle"
            style={{ fontSize: "2rem" }}
          />
          <span>Apakah anda yakin ingin menghapus data ?</span>
        </div>
      </Dialog>
    </>
  );
};

export default Produk;
