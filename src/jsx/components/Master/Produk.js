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
import CircleProgress from "../CircleProgress/circleProgress";

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
                setFile(null);
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
          <Card.Body className="p-0">
              <Row>
                <div className="ml-3 mt-1">
                  <CircleProgress
                    percent={50}
                    colors={"#F2D182"}
                    icon={
                      <svg
                        width="30"
                        height="30"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 77.62 90.11"
                      >
                        <g>
                          <g>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M77.59,24.63a30,30,0,0,1,0,3,6.2,6.2,0,0,1-3.34,5.09,1.38,1.38,0,0,0-.64,1.05c1.22,10.34-.63,20.29-3.76,30.09-1,3-1.71,6-2.54,9-.66,2.38,0,3.81,2.16,4.92a6.48,6.48,0,0,1,3.76,6.74,6.39,6.39,0,0,1-5.76,5.55,6.52,6.52,0,0,1-6.5-3.8,5.93,5.93,0,0,0-1.3-1.82,2.68,2.68,0,0,0-2.89-.51A52,52,0,0,1,36,87a51.67,51.67,0,0,1-14.3-2.8c-2.75-.95-3.87-.49-5.15,2.14a6.37,6.37,0,0,1-8.3,3.19,6.41,6.41,0,0,1-1-11.27,10.74,10.74,0,0,1,1.05-.58c2-1.07,2.65-2.53,2-4.78C8.72,67.05,7,61.18,5.46,55.27A57.45,57.45,0,0,1,4,34.7a2,2,0,0,0-1.13-2.37A5.72,5.72,0,0,1,0,27.11q-.06-2.52,0-5c.07-3.7,2.6-6.39,6.3-6.22a9.24,9.24,0,0,0,6.72-2.35c3.5-2.91,7.2-5.58,10.83-8.33A24.28,24.28,0,0,1,54,5.3c4.28,3.3,8.55,6.59,12.86,9.84a3.92,3.92,0,0,0,1.84.62c1,.1,1.92,0,2.88,0a6.12,6.12,0,0,1,6,6.08c0,.91,0,1.84,0,2.75ZM38.9,33.34H7.71c-.65,0-1.24-.1-1.34.88A56.7,56.7,0,0,0,7.48,53.53C9.06,59.88,11,66.16,12.69,72.47a6,6,0,0,1-3.14,7.26,11.66,11.66,0,0,0-1.14.66A4,4,0,0,0,6.93,85a4,4,0,0,0,3.73,2.71,3.93,3.93,0,0,0,4-2.71,5.83,5.83,0,0,1,7.3-3.22,45.12,45.12,0,0,0,15.34,3,51,51,0,0,0,18.95-3.08,4.78,4.78,0,0,1,2.22-.24,5.9,5.9,0,0,1,4.63,3.72,4,4,0,0,0,7.77-.93,4.07,4.07,0,0,0-2.5-4.33A6,6,0,0,1,65,72.31c1-3.58,1.93-7.18,3-10.72C70.75,52.84,72.27,44,71.3,34.77c-.11-1.12-.42-1.46-1.56-1.46C59.46,33.36,49.18,33.34,38.9,33.34Zm0-15.2H6.67c-2.78,0-4.22,1.43-4.27,4.2,0,1.6,0,3.2,0,4.79a3.71,3.71,0,0,0,4,3.85H71.08c2.61,0,4.08-1.47,4.15-4.08,0-1.36,0-2.72,0-4.08,0-3.37-1.34-4.69-4.74-4.69Zm24.58-2.42a11.13,11.13,0,0,0-.85-.77Q57.4,10.89,52.12,6.84A21.44,21.44,0,0,0,27.6,5.59C23.05,8.53,18.86,12,14.52,15.31c-.09.07-.11.25-.18.41Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M31.46,14.61a4.06,4.06,0,0,1-4-4.06,4.07,4.07,0,1,1,8.14.08A4.06,4.06,0,0,1,31.46,14.61Zm1.71-4a1.67,1.67,0,1,0-3.33-.08,1.67,1.67,0,1,0,3.33.08Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M38.15,7.44a6.17,6.17,0,0,1,1.53-1.13c.68-.21,1.52.65,1.45,1.39S40.56,9.14,39.75,9c-.57-.09-1.06-.66-1.59-1Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M43.67,14.58c-.43-.7-.84-1.06-.81-1.39a1.11,1.11,0,0,1,.81-.76,1.1,1.1,0,0,1,.81.75C44.5,13.52,44.1,13.88,43.67,14.58Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M33.17,10.57a1.67,1.67,0,1,1-3.33-.08,1.67,1.67,0,1,1,3.33.08Z"
                            ></path>
                          </g>
                        </g>
                      </svg>
                    }
                  />
                </div>
                <div className="col-8 mt-4">
                  <h4 className="fs-18 text-black font-w600 mb-0">
                    <b>0 Item Produk</b>
                  </h4>
                  <span className="fs-14 text-black font-w600">Segera Habis</span>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4 col-sm-4">
          <Card>
          <Card.Body className="p-0">
              <Row>
                <div className="ml-3 mt-1">
                  <CircleProgress
                    percent={50}
                    colors={"#B05B57"}
                    icon={
                      <svg
                        width="30"
                        height="30"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 77.62 90.11"
                      >
                        <g>
                          <g>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M77.59,24.63a30,30,0,0,1,0,3,6.2,6.2,0,0,1-3.34,5.09,1.38,1.38,0,0,0-.64,1.05c1.22,10.34-.63,20.29-3.76,30.09-1,3-1.71,6-2.54,9-.66,2.38,0,3.81,2.16,4.92a6.48,6.48,0,0,1,3.76,6.74,6.39,6.39,0,0,1-5.76,5.55,6.52,6.52,0,0,1-6.5-3.8,5.93,5.93,0,0,0-1.3-1.82,2.68,2.68,0,0,0-2.89-.51A52,52,0,0,1,36,87a51.67,51.67,0,0,1-14.3-2.8c-2.75-.95-3.87-.49-5.15,2.14a6.37,6.37,0,0,1-8.3,3.19,6.41,6.41,0,0,1-1-11.27,10.74,10.74,0,0,1,1.05-.58c2-1.07,2.65-2.53,2-4.78C8.72,67.05,7,61.18,5.46,55.27A57.45,57.45,0,0,1,4,34.7a2,2,0,0,0-1.13-2.37A5.72,5.72,0,0,1,0,27.11q-.06-2.52,0-5c.07-3.7,2.6-6.39,6.3-6.22a9.24,9.24,0,0,0,6.72-2.35c3.5-2.91,7.2-5.58,10.83-8.33A24.28,24.28,0,0,1,54,5.3c4.28,3.3,8.55,6.59,12.86,9.84a3.92,3.92,0,0,0,1.84.62c1,.1,1.92,0,2.88,0a6.12,6.12,0,0,1,6,6.08c0,.91,0,1.84,0,2.75ZM38.9,33.34H7.71c-.65,0-1.24-.1-1.34.88A56.7,56.7,0,0,0,7.48,53.53C9.06,59.88,11,66.16,12.69,72.47a6,6,0,0,1-3.14,7.26,11.66,11.66,0,0,0-1.14.66A4,4,0,0,0,6.93,85a4,4,0,0,0,3.73,2.71,3.93,3.93,0,0,0,4-2.71,5.83,5.83,0,0,1,7.3-3.22,45.12,45.12,0,0,0,15.34,3,51,51,0,0,0,18.95-3.08,4.78,4.78,0,0,1,2.22-.24,5.9,5.9,0,0,1,4.63,3.72,4,4,0,0,0,7.77-.93,4.07,4.07,0,0,0-2.5-4.33A6,6,0,0,1,65,72.31c1-3.58,1.93-7.18,3-10.72C70.75,52.84,72.27,44,71.3,34.77c-.11-1.12-.42-1.46-1.56-1.46C59.46,33.36,49.18,33.34,38.9,33.34Zm0-15.2H6.67c-2.78,0-4.22,1.43-4.27,4.2,0,1.6,0,3.2,0,4.79a3.71,3.71,0,0,0,4,3.85H71.08c2.61,0,4.08-1.47,4.15-4.08,0-1.36,0-2.72,0-4.08,0-3.37-1.34-4.69-4.74-4.69Zm24.58-2.42a11.13,11.13,0,0,0-.85-.77Q57.4,10.89,52.12,6.84A21.44,21.44,0,0,0,27.6,5.59C23.05,8.53,18.86,12,14.52,15.31c-.09.07-.11.25-.18.41Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M31.46,14.61a4.06,4.06,0,0,1-4-4.06,4.07,4.07,0,1,1,8.14.08A4.06,4.06,0,0,1,31.46,14.61Zm1.71-4a1.67,1.67,0,1,0-3.33-.08,1.67,1.67,0,1,0,3.33.08Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M38.15,7.44a6.17,6.17,0,0,1,1.53-1.13c.68-.21,1.52.65,1.45,1.39S40.56,9.14,39.75,9c-.57-.09-1.06-.66-1.59-1Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M43.67,14.58c-.43-.7-.84-1.06-.81-1.39a1.11,1.11,0,0,1,.81-.76,1.1,1.1,0,0,1,.81.75C44.5,13.52,44.1,13.88,43.67,14.58Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M33.17,10.57a1.67,1.67,0,1,1-3.33-.08,1.67,1.67,0,1,1,3.33.08Z"
                            ></path>
                          </g>
                        </g>
                      </svg>
                    }
                  />
                </div>
                <div className="col-8 mt-4">
                  <h4 className="fs-18 text-black font-w600 mb-0">
                    <b>1 Item Produk</b>
                  </h4>
                  <span className="fs-14 text-black font-w600">Habis</span>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4 col-sm-4">
          <Card>
          <Card.Body className="p-0">
              <Row>
                <div className="ml-3 mt-1">
                  <CircleProgress
                    percent={50}
                    colors={"#B9692F"}
                    icon={
                      <svg
                        width="30"
                        height="30"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 77.62 90.11"
                      >
                        <g>
                          <g>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M77.59,24.63a30,30,0,0,1,0,3,6.2,6.2,0,0,1-3.34,5.09,1.38,1.38,0,0,0-.64,1.05c1.22,10.34-.63,20.29-3.76,30.09-1,3-1.71,6-2.54,9-.66,2.38,0,3.81,2.16,4.92a6.48,6.48,0,0,1,3.76,6.74,6.39,6.39,0,0,1-5.76,5.55,6.52,6.52,0,0,1-6.5-3.8,5.93,5.93,0,0,0-1.3-1.82,2.68,2.68,0,0,0-2.89-.51A52,52,0,0,1,36,87a51.67,51.67,0,0,1-14.3-2.8c-2.75-.95-3.87-.49-5.15,2.14a6.37,6.37,0,0,1-8.3,3.19,6.41,6.41,0,0,1-1-11.27,10.74,10.74,0,0,1,1.05-.58c2-1.07,2.65-2.53,2-4.78C8.72,67.05,7,61.18,5.46,55.27A57.45,57.45,0,0,1,4,34.7a2,2,0,0,0-1.13-2.37A5.72,5.72,0,0,1,0,27.11q-.06-2.52,0-5c.07-3.7,2.6-6.39,6.3-6.22a9.24,9.24,0,0,0,6.72-2.35c3.5-2.91,7.2-5.58,10.83-8.33A24.28,24.28,0,0,1,54,5.3c4.28,3.3,8.55,6.59,12.86,9.84a3.92,3.92,0,0,0,1.84.62c1,.1,1.92,0,2.88,0a6.12,6.12,0,0,1,6,6.08c0,.91,0,1.84,0,2.75ZM38.9,33.34H7.71c-.65,0-1.24-.1-1.34.88A56.7,56.7,0,0,0,7.48,53.53C9.06,59.88,11,66.16,12.69,72.47a6,6,0,0,1-3.14,7.26,11.66,11.66,0,0,0-1.14.66A4,4,0,0,0,6.93,85a4,4,0,0,0,3.73,2.71,3.93,3.93,0,0,0,4-2.71,5.83,5.83,0,0,1,7.3-3.22,45.12,45.12,0,0,0,15.34,3,51,51,0,0,0,18.95-3.08,4.78,4.78,0,0,1,2.22-.24,5.9,5.9,0,0,1,4.63,3.72,4,4,0,0,0,7.77-.93,4.07,4.07,0,0,0-2.5-4.33A6,6,0,0,1,65,72.31c1-3.58,1.93-7.18,3-10.72C70.75,52.84,72.27,44,71.3,34.77c-.11-1.12-.42-1.46-1.56-1.46C59.46,33.36,49.18,33.34,38.9,33.34Zm0-15.2H6.67c-2.78,0-4.22,1.43-4.27,4.2,0,1.6,0,3.2,0,4.79a3.71,3.71,0,0,0,4,3.85H71.08c2.61,0,4.08-1.47,4.15-4.08,0-1.36,0-2.72,0-4.08,0-3.37-1.34-4.69-4.74-4.69Zm24.58-2.42a11.13,11.13,0,0,0-.85-.77Q57.4,10.89,52.12,6.84A21.44,21.44,0,0,0,27.6,5.59C23.05,8.53,18.86,12,14.52,15.31c-.09.07-.11.25-.18.41Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M31.46,14.61a4.06,4.06,0,0,1-4-4.06,4.07,4.07,0,1,1,8.14.08A4.06,4.06,0,0,1,31.46,14.61Zm1.71-4a1.67,1.67,0,1,0-3.33-.08,1.67,1.67,0,1,0,3.33.08Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M38.15,7.44a6.17,6.17,0,0,1,1.53-1.13c.68-.21,1.52.65,1.45,1.39S40.56,9.14,39.75,9c-.57-.09-1.06-.66-1.59-1Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M43.67,14.58c-.43-.7-.84-1.06-.81-1.39a1.11,1.11,0,0,1,.81-.76,1.1,1.1,0,0,1,.81.75C44.5,13.52,44.1,13.88,43.67,14.58Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M33.17,10.57a1.67,1.67,0,1,1-3.33-.08,1.67,1.67,0,1,1,3.33.08Z"
                            ></path>
                          </g>
                        </g>
                      </svg>
                    }
                  />
                </div>
                <div className="col-8 mt-4">
                  <h4 className="fs-18 text-black font-w600 mb-0">
                    <b>10 Item Produk</b>
                  </h4>
                  <span className="fs-14 text-black font-w600">Terdaftar</span>
                </div>
              </Row>
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
          setFile(null);
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
                      background: "var(--input-bg)",
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
                      ) : currentItem &&
                        currentItem.image &&
                        currentItem.image !== "" ? (
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
