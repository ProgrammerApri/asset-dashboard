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
import { Tooltip } from "primereact/tooltip";

const data = {
  id: null,
  code: null,
  name: null,
  group: null,
  type: null,
  codeb: null,
  unit: null,
  suplier: null,
  b_price: null,
  s_price: null,
  barcode: null,
  metode: null,
  max_stock: null,
  min_stock: null,
  re_stock: null,
  lt_stock: null,
  max_order: null,
  image: null,
};

const type = [
  { name: "Stock", id: 1 },
  { name: "Non Stock", id: 2 },
];

const metode = [
  { name: "First In First Out (FIFO)", id: 1 },
  { name: "Avarage", id: 2 },
];

const Produk = () => {
  const [product, setProduk] = useState(null);
  const [group, setGroup] = useState(null);
  const [unit, setUnit] = useState(null);
  const [suplier, setSupplier] = useState(null);
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
  const picker = useRef(null);
  const [file, setFile] = useState(null);
  // const [currentData, setCurrentData] = useState(null);
  const [onUpload, setSubmit] = useState(false);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getProduk();
    getGroup();
    getUnit();
    getSupplier();
    initFilters1();
  }, []);

  const getProduk = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.product,
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

  const getGroup = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.groupPro,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let grp = [];
        data.forEach((element) => {
          grp.push(element.groupPro);
        });
        setGroup(grp);
      }
    } catch (error) {}
  };

  const getUnit = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.getSatuan,
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
        setUnit(data);
      }
    } catch (error) {}
  };

  const getSupplier = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.supplier,
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
        let sup = [];
        data.forEach((element) => {
          sup.push(element.supplier);
        });
        setSupplier(sup);
      }
    } catch (error) {}
  };

  const editProduk = async (image) => {
    const config = {
      ...endpoints.editProduct,
      endpoint: endpoints.editProduct.endpoint + currentItem.id,
      data: {
        ...currentItem,
        group: currentItem?.group?.id ?? null,
        suplier: currentItem?.suplier?.id ?? null,
        unit: currentItem?.unit?.id ?? null,
        image: image,
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
          setDisplayData(false);
          getProduk(true);
          setActive(0);
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

  const addProduk = async (image) => {
    const config = {
      ...endpoints.addProduct,
      data: {
        ...currentItem,
        group: currentItem?.group?.id ?? null,
        suplier: currentItem?.suplier?.id ?? null,
        unit: currentItem?.unit?.id ?? null,
        image: image,
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
          setDisplayData(false);
          getProduk(true);
          setActive(0);
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
            detail: `Kode ${currentItem.code} Sudah Digunakan`,
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

  // const postProduct = async (image, isUpdate = false, data) => {
  //   let config = {};
  //   if (isUpdate) {
  //     if (data) {
  //       config = {
  //         ...endpoints.editProduct,
  //         endpoint: endpoints.editProduct.endpoint + currentItem.id,
  //         data: {
  //           ...currentItem,
  //           group: currentItem?.group?.id ?? null,
  //           suplier: currentItem?.suplier?.id ?? null,
  //           unit: currentItem?.unit?.id ?? null,
  //         },
  //       };
  //     } else {
  //       config = {
  //         ...endpoints.editProduct,
  //         endpoint: endpoints.editProduct.endpoint + currentItem.id,
  //         data: {
  //           ...currentItem,
  //           image: image !== "" ? image : currentItem.image,
  //         },
  //       };
  //     }
  //   } else {
  //     config = {
  //       ...endpoints.addProduct,
  //       data: {
  //         ...currentItem,
  //         group: currentItem?.group?.id ?? null,
  //         suplier: currentItem?.suplier?.id ?? null,
  //         unit: currentItem?.unit?.id ?? null,
  //         image: image,
  //       },
  //     };
  //   }
  //   let response = null;
  //   try {
  //     response = await request(null, config);
  //     console.log(response);
  //     if (response.status) {
  //       setTimeout(() => {
  //         setUpdate(false);
  //         setDisplayData(false);
  //         getProduk(true);
  //         toast.current.show({
  //           severity: "info",
  //           summary: "Berhasil",
  //           detail: "Data Berhasil Diperbarui",
  //           life: 3000,
  //         });
  //       }, 500);
  //     }
  //   } catch (error) {
  //     setSubmit(false);
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Gagal",
  //       detail: "Gagal memperbarui data",
  //       life: 3000,
  //     });
  //   }
  // };

  const delProduk = async (id) => {
    const config = {
      ...endpoints.delProduct,
      endpoint: endpoints.delProduct.endpoint + currentItem.id,
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

  const uploadImage = async () => {
    if (file) {
      const config = {
        ...endpoints.uploadImage,
        data: {
          image: file,
        },
      };
      console.log(config.data);
      let response = null;
      try {
        response = await request(null, config, {
          "Content-Type": "multipart/form-data",
        });
        console.log(response);
        if (response.status) {
          if (isEdit) {
            editProduk(response.data);
          } else {
            addProduk(response.data);
          }
        }
      } catch (error) {
        if (isEdit) {
          editProduk("");
        } else {
          addProduk("");
        }
      }
      setFile(null);
    } else {
      if (isEdit) {
        editProduk("");
      } else {
        addProduk("");
      }
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
    setUpdate(true);
    uploadImage();
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
              onClick={() => {
                setDisplayData(false);
                setActive(0);
                setFile(null)
              }}
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
          // onClick={() => {
          //   setUpdate(true);
          //   setActive(0);
          //   submitUpdate();
          // }}
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

  const getType = (nilai) => {
    let typ = {};
    type.forEach((element) => {
      if (nilai === element.id) {
        typ = element;
      }
    });
    return typ;
  };

  const getMetodeHPP = (value) => {
    let met = {};
    metode.forEach((element) => {
      if (value === element.id) {
        met = element;
      }
    });
    return met;
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
                value={loading ? dummy : product}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "code",
                  "barcode",
                  "name",
                  "group.group",
                  "type",
                  "stock",
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
                  field={(e) => e?.code ?? ""}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Barcode"
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => e?.barcode ?? ""}
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
                  field={(e) => e?.group?.name ?? ""}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                {/* <Column
                  header="Departemen Barang"
                  field={(e) => e?.type?.name ?? ""}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                /> */}
                <Column
                  header="Informasi Stock"
                  field={(e) => e?.max_stock ?? ""}
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
          setActive(0);
          setFile(null)
        }}
      >
        <TabView activeIndex={active} onTabChange={(e) => setActive(e.index)}>
          <TabPanel header="Informasi Produk" headerTemplate={renderTabHeader}>
            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Kode Barang</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.code ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, code: e.target.value })
                    }
                    placeholder="Masukan Kode Produk"
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Nama Barang</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.name ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, name: e.target.value })
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
                    value={currentItem !== null ? currentItem.group : null}
                    options={group}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        group: e.target.value,
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
                    value={
                      currentItem !== null && currentItem.type !== null
                        ? getType(currentItem.type)
                        : null
                    }
                    options={type}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        type: e.value.id,
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
                    value={`${currentItem?.codeb ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, codeb: e.target.value })
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
                    value={currentItem !== null ? currentItem.unit : null}
                    options={unit}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        unit: e.target.value,
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
                    value={currentItem !== null ? currentItem.suplier : null}
                    options={suplier}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        suplier: e.target.value,
                      });
                    }}
                    optionLabel="sup_name"
                    filter
                    filterBy="sup_name"
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
                    value={`${currentItem?.b_price ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, b_price: e.value })
                    }
                    placeholder="Masukan Harga Beli"
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Harga Jual</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={`${currentItem?.s_price ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, s_price: e.value })
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
              <div className="col-6">
                <label className="text-label">Kode Barcode</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.barcode ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        barcode: e.target.value,
                      })
                    }
                    placeholder="Masukan Kode Barcode"
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Metode HPP</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={
                      currentItem !== null && currentItem.metode !== null
                        ? getMetodeHPP(currentItem.metode)
                        : null
                    }
                    options={metode}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        metode: e.value.id,
                      });
                    }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    placeholder="Pilih Metode HPP"
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Maksimum Stock</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={`${currentItem?.max_stock ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, max_stock: e.value })
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
                    value={`${currentItem?.min_stock ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, min_stock: e.value })
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
                    value={`${currentItem?.re_stock ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, re_stock: e.value })
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
                    value={`${currentItem?.lt_stock ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        lt_stock: e.target.value,
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
                    value={`${currentItem?.max_order ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, max_order: e.value })
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
                <Tooltip target=".upload" mouseTrack mouseTrackLeft={10} />
                <input
                  type="file"
                  id="file"
                  ref={picker}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    console.log(e);
                    setFile(e.target.files[0]);
                  }}
                />
                <div>
                  <Card
                    className="upload mb-3"
                    data-pr-tooltip="Klik untuk memilih foto"
                    style={{
                      cursor: "pointer",
                      height: "200px",
                      width: "200px",
                      background: "var(--input-bg)"
                    }}
                    onClick={() => {
                      picker.current.click();
                    }}
                  >
                    <Card.Body className="flex align-items-center justify-content-center">
                      {file ? (
                        <img
                          style={{ maxWidth: "150px" }}
                          src={URL.createObjectURL(file)}
                          alt=""
                        />
                      ) : currentItem && currentItem.image && currentItem.image !== "" ? (
                        <img
                          style={{ maxWidth: "150px" }}
                          src={currentItem.image}
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
