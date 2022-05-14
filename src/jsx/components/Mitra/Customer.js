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
import { TabPanel, TabView } from "primereact/tabview";
import { Badge } from "primereact/badge";
import CircleProgress from "../CircleProgress/circleProgress";
import DataJenisPelanggan from "../Master/JenisPelanggan/DataJenisPelanggan";

const data = {
  customer: {
    id: null,
    cus_code: null,
    cus_name: null,
    cus_jpel: null,
    cus_sub_area: null,
    cus_npwp: null,
    cus_address: null,
    cus_kota: null,
    cus_kpos: null,
    cus_telp1: null,
    cus_telp2: null,
    cus_email: null,
    cus_fax: null,
    cus_cp: null,
    cus_curren: null,
    cus_pjk: null,
    cus_ket: null,
    cus_gl: null,
    cus_uang_muka: null,
    cus_limit: null,
  },

  jpel: {
    id: null,
    jpel_code: "",
    jpel_name: "",
    jpel_ket: "",
  },

  subArea: {
    id: null,
    sub_code: "",
    sub_area_code: "",
    sub_name: "",
    sub_ket: "",
  },

  currency: {
    id: null,
    code: "",
    name: "",
  },
};

const pajak = [
  { name: "Include", code: "I" },
  { name: "Exclude", code: "E" },
  { name: "Non PPN", code: "N" },
];

const Customer = () => {
  const [customer, setCustomer] = useState(null);
  const [city, setCity] = useState(null);
  const [jpel, setJpel] = useState(null);
  const [subArea, setSubArea] = useState(null);
  const [setup, setSetup] = useState(null);
  const [account, setAccount] = useState(null);
  const [accU, setAcc] = useState(null);
  const [company, setComp] = useState(null);
  const [currency, setCurrency] = useState(null);
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
  const [showJenisPelanggan, setShowJenisPelanggan] = useState(false);
  const [doubleClick, setDoubleClick] = useState(false);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getCustomer();
    getCity();
    getJpel();
    getSubArea();
    getCurrency();
    getAR();
    getSetup();
    getComp();
    getAcc();
    initFilters1();
  }, []);

  const getCustomer = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.customer,
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
        setCustomer(data);
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

  const getCity = async () => {
    const config = {
      ...endpoints.city,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCity(data);
      }
    } catch (error) {}
  };

  const getJpel = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.jenisPel,
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
        setJpel(data);
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

  const getAR = async () => {
    setLoading(true);
    const config = {
      ...endpoints.account,
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
          if (elem.account.kat_code === 3) {
            filt.push(elem.account);
          }
        });
        console.log(data);
        setAccount(filt);
      }
    } catch (error) {}
    getCustomer();
  };

  const getAcc = async () => {
    setLoading(true);
    const config = {
      ...endpoints.account,
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
          if (elem.account.kat_code === 5) {
            filt.push(elem.account);
          }
        });
        console.log(data);
        setAcc(filt);
      }
    } catch (error) {}
    getCustomer();
  };

  const getComp = async () => {
    setLoading(true);
    const config = {
      ...endpoints.getCompany,
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
        setComp(data);
      }
    } catch (error) {}
  };

  const getSetup = async () => {
    setLoading(true);
    const config = {
      ...endpoints.getSetup,
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
        setSetup(data);
      }
    } catch (error) {}
  };

  const getSubArea = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.subArea,
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
        let sub = [];
        data.forEach((element) => {
          sub.push(element.subArea);
        });
        setSubArea(sub);
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

  const getCurrency = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.currency,
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
        setCurrency(data);
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

  const editCustomer = async () => {
    const config = {
      ...endpoints.editCustomer,
      endpoint: endpoints.editCustomer.endpoint + currentItem.customer.id,
      data: {
        cus_code: currentItem.customer.cus_code,
        cus_name: currentItem.customer.cus_name,
        cus_jpel: currentItem.jpel.id,
        cus_sub_area: currentItem.subArea.id,
        cus_npwp: currentItem.customer.cus_npwp,
        cus_address: currentItem.customer.cus_address,
        cus_kota: currentItem.customer.cus_kota,
        cus_kpos: currentItem.customer.cus_kpos,
        cus_telp1: currentItem.customer.cus_telp1,
        cus_telp2: currentItem.customer.cus_telp2,
        cus_email: currentItem.customer.cus_email,
        cus_fax: currentItem.customer.cus_fax,
        cus_cp: currentItem.customer.cus_cp,
        cus_curren: currentItem.currency.id,
        cus_pjk: currentItem.customer.cus_pjk,
        cus_ket: currentItem.customer.cus_ket,
        cus_gl: currentItem.customer.cus_gl,
        cus_uang_muka: currentItem.customer.cus_uang_muka,
        cus_limit: currentItem.customer.cus_limit,
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
          getCustomer(true);
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

  const addCustomer = async () => {
    const config = {
      ...endpoints.addCustomer,
      data: {
        cus_code: currentItem.customer.cus_code,
        cus_name: currentItem.customer.cus_name,
        cus_jpel: currentItem.jpel.id,
        cus_sub_area: currentItem.subArea.id,
        cus_npwp: currentItem.customer.cus_npwp,
        cus_address: currentItem.customer.cus_address,
        cus_kota: currentItem.customer.cus_kota,
        cus_kpos: currentItem.customer.cus_kpos,
        cus_telp1: currentItem.customer.cus_telp1,
        cus_telp2: currentItem.customer.cus_telp2,
        cus_email: currentItem.customer.cus_email,
        cus_fax: currentItem.customer.cus_fax,
        cus_cp: currentItem.customer.cus_cp,
        cus_curren: currentItem.currency.id,
        cus_pjk: currentItem.customer.cus_pjk,
        cus_ket: currentItem.customer.cus_ket,
        cus_gl: currentItem.customer.cus_gl,
        cus_uang_muka: currentItem.customer.cus_uang_muka,
        cus_limit: currentItem.customer.cus_limit,
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
          getCustomer(true);
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

  const delCustomer = async () => {
    const config = {
      ...endpoints.delCustomer,
      endpoint: endpoints.delCustomer.endpoint + currentItem.customer.id,
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
          getCustomer(true);
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
    setActive(0);

    if (position) {
      setPosition(position);
    }
  };

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editCustomer();
      setActive(0);
    } else {
      setUpdate(true);
      addCustomer();
      setActive(0);
    }
  };

  const renderFooter = () => {
    if (active !== 2) {
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
            delCustomer();
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
            setCurrentItem({
              ...data,
              customer: {
                ...data.customer,
                cus_gl: setup.ar.id,
                cus_uang_muka: setup.pur_advance.id,
              },
            });
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

  const getPpn = (value) => {
    let ppn = {};
    pajak.forEach((element) => {
      if (value === element.code) {
        ppn = element;
      }
    });
    return ppn;
  };

  const kota = (value) => {
    let selected = {};
    city.forEach((element) => {
      if (element.city_id === `${value}`) {
        selected = element;
      }
    });
    console.log(currentItem);
    return selected;
  };

  const gl = (value) => {
    let gl = {};
    account.forEach((element) => {
      if (value === element.id) {
        gl = element;
      }
    });
    return gl;
  };

  const um = (value) => {
    let um = {};
    accU.forEach((element) => {
      if (value === element.id) {
        um = element;
      }
    });
    return um;
  };

  const glTemplate = (option) => {
    return (
      <div>
        {option !== null ? `${option.acc_name} - (${option.acc_code})` : ""}
      </div>
    );
  };

  const clear = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.acc_name} - (${option.acc_code})` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
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
            <Card.Body className="p-0">
              <Row>
                <div className="ml-3 mt-1">
                  <CircleProgress
                    percent={50}
                    colors={"#6EB6FF"}
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
                <div className="col-8 mt-4 ml-0">
                  <span className="fs-13 text-black font-w600 ml-">
                    Piutang Jatuh Tempo Lebih Dari <b>90 Hari</b>
                  </span>
                  <h4 className="fs-140 text-black font-w600 mt-1">
                    <b>Rp. </b>
                  </h4>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4 col-sm-4">
          <Card>
            <Card.Body className="p-0">
              <Row className="align-center">
                <div className="ml-3 mt-1">
                  <CircleProgress
                    percent={50}
                    colors={"#7A93C3"}
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
                  <span className="fs-13 text-black font-w600 mb-0">
                    Piutang Jatuh Tempo <b>Belum Jatuh Tempo</b>
                  </span>
                  <h4 className="fs-140 text-black font-w600 mt-1">
                    <b>Rp. </b>
                  </h4>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4 col-sm-4">
          <Card>
            <Card.Body className="p-0">
              <Row className="align-center">
                <div className="ml-3 mt-1">
                  <CircleProgress
                    percent={50}
                    colors={"#A79AFD"}
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
                  <span className="fs-13 text-black font-w600">
                    <b>Total Piutang</b>
                  </span>
                  <h4 className="fs-140 text-black font-w600 mt-1">
                    <b>Rp. </b>
                  </h4>
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
                value={loading ? dummy : customer}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "customer.cus_code",
                  "customer.cus_name",
                  "customer.cus_address",
                  "customer.cus_telp1",
                  "customer.cus_limit",
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
                  header="Kode Pelanggan"
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => e.customer.cus_code}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Pelanggan"
                  field={(e) => e.customer.cus_name}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Alamat"
                  field={(e) => e.customer.cus_address}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Telp"
                  field={(e) => e.customer.cus_telp1}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Limit Kredit"
                  field={(e) => e.customer.cus_limit}
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
        header={isEdit ? "Edit Data Pelanggan" : "Tambah Data Pelanggan"}
        visible={displayData}
        style={{ width: "50vw" }}
        footer={renderFooter()}
        onHide={() => {
          setEdit(false);
          setDisplayData(false);
          setActive(0);
        }}
      >
        <TabView activeIndex={active} onTabChange={(e) => setActive(e.index)}>
          <TabPanel
            header="Informasi Pelanggan"
            headerTemplate={renderTabHeader}
          >
            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Kode Pelanggan</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.customer?.cus_code ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_code: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukan Kode Pelanggan"
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Nama Pelanggan</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.customer?.cus_name ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_name: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukan Nama Pelanggan"
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Jenis Pelanggan</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={currentItem !== null ? currentItem.jpel : null}
                    options={jpel}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        jpel: e.value,
                      });
                    }}
                    optionLabel="jpel_name"
                    filter
                    filterBy="jpel_name"
                    placeholder="Pilih Jenis Pelanggan"
                  />
                  <PButton
                    onClick={() => {
                      setShowJenisPelanggan(true);
                    }}
                  >
                    <i class="bx bx-food-menu"></i>
                  </PButton>
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Sub Area Penjualan</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={currentItem !== null ? currentItem.subArea : null}
                    options={subArea}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        subArea: e.value,
                      });
                    }}
                    optionLabel="sub_name"
                    filter
                    filterBy="sub_name"
                    placeholder="Pilih Sub Area"
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-12">
                <label className="text-label">NPWP</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.customer?.cus_npwp ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_npwp: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukan NPWP"
                  />
                </div>
              </div>
            </div>

            <h4 className="mt-4">
              <b>Informasi Alamat</b>
            </h4>
            <Divider className="mb-2"></Divider>

            <div className="row mr-0 ml-0">
              <div className="col-12">
                <label className="text-label">Alamat</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.customer?.cus_address ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_address: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukan Alamat"
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Kota</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={
                      currentItem !== null &&
                      currentItem.customer.cus_kota !== null
                        ? kota(currentItem.customer.cus_kota)
                        : null
                    }
                    options={city}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_kota: e.value.city_id,
                        },
                      });
                    }}
                    optionLabel="city_name"
                    filter
                    filterBy="city_name"
                    placeholder="Pilih Kota"
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Kode Pos</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={`${currentItem?.customer?.cus_kpos ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_kpos: e.value,
                        },
                      })
                    }
                    placeholder="Masukan Kode Pos"
                    mode="decimal"
                    useGrouping={false}
                  />
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Informasi Kontak" headerTemplate={renderTabHeader}>
            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">No. Telepon 1</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={`${currentItem?.customer?.cus_telp1 ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_telp1: e.value,
                        },
                      })
                    }
                    placeholder="Masukan No. Telepon"
                    mode="decimal"
                    useGrouping={false}
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">No. Telepon 2</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={`${currentItem?.customer?.cus_telp2 ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_telp2: e.value,
                        },
                      })
                    }
                    placeholder="Masukan No. Telepon"
                    mode="decimal"
                    useGrouping={false}
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Email</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.customer?.cus_email ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_email: e.target.value,
                        },
                      })
                    }
                    placeholder="Cth. ar@gmail.com"
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Fax</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.customer?.cus_fax ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_fax: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukan Fax"
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-12">
                <label className="text-label">Contact Person</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.customer?.cus_cp ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_cp: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukan Contact Person"
                  />
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel
            header="Distribusi AR & Currency"
            headerTemplate={renderTabHeader}
          >
            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Currency</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={currentItem !== null ? currentItem.currency : null}
                    options={currency}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        currency: e.value,
                      });
                    }}
                    optionLabel="code"
                    filter
                    filterBy="name"
                    placeholder="Pilih Jenis Currency"
                    disabled={company && !company.multi_currency}
                  />
                </div>
                <small className="text-blue">
                  *Aktifkan Multi Currency Pada Setup Perusahaan Terlebih Dahulu
                </small>
              </div>

              <div className="col-6">
                <label className="text-label">PPN</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={
                      currentItem !== null &&
                      currentItem.customer.cus_pjk !== null
                        ? getPpn(currentItem.customer.cus_pjk)
                        : null
                    }
                    options={pajak}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_pjk: e.value.code,
                        },
                      });
                    }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    placeholder="Pilih Jenis Pajak"
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-12">
                <label className="text-label">Keterangan</label>
                <div className="p-inputgroup">
                  <InputTextarea
                    value={`${currentItem?.customer?.cus_ket ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_ket: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukan Keterangan"
                  />
                </div>
              </div>
            </div>

            <h4 className="mt-4 ml-0 mr-0">
              <b>Distribusi GL/AR</b>
            </h4>
            <Divider className="mb-2 ml-0 mr-0"></Divider>

            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Kode Distribusi AR</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={
                      currentItem !== null &&
                      currentItem.customer.cus_gl !== null
                        ? gl(currentItem.customer.cus_gl)
                        : null
                    }
                    options={account}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_gl: e.value?.id ?? null,
                        },
                      });
                    }}
                    optionLabel="account.acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="account.acc_name"
                    placeholder="Pilih Kode Distribusi"
                    showClear
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">
                  Kode Distribusi Uang Muka Penjualan
                </label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={
                      currentItem !== null &&
                      currentItem.customer.cus_uang_muka !== null
                        ? um(currentItem.customer.cus_uang_muka)
                        : null
                    }
                    options={accU}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_uang_muka: e.value?.id ?? null,
                        },
                      });
                    }}
                    optionLabel="account.acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="account.acc_name"
                    placeholder="Pilih Kode Distribusi Uang Muka Penjualan"
                    showClear
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-12">
                <label className="text-label">Limit Kredit</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={`${currentItem?.customer?.cus_limit ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        customer: {
                          ...currentItem.customer,
                          cus_limit: e.value,
                        },
                      })
                    }
                    placeholder="Masukan Limit Kredit"
                  />
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

      <DataJenisPelanggan
        data={jpel}
        loading={false}
        popUp={true}
        show={showJenisPelanggan}
        onHide={()=> setShowJenisPelanggan(false)}
        onSuccessInput={() => getJpel()}
        onRowSelect={(e)=>{
          if (doubleClick) {
            setShowJenisPelanggan(false);
            setCurrentItem({
              ...currentItem,
              jpel: e.data,
            });
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

export default Customer;
