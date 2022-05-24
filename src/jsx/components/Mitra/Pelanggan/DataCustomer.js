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
import DataJenisPelanggan from "../../Master/JenisPelanggan/DataJenisPelanggan";
import { InputSwitch } from "primereact/inputswitch";

const def = {
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
    sub_cus: false,
    cus_id: null,
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

const DataCustomer = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
}) => {
  const [customer, setCustomer] = useState(null);
  const [nonSub, setNonSub] = useState(null);
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
  const [showInput, setShowInput] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
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
        let non = [];
        data.forEach((el) => {
          if (!el.customer.sub_cus) {
            non.push(el);
          }
        });
        setNonSub(non);
      }
    } catch (error) {}
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
    }
  };

  const getAR = async () => {
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
  };

  const getAcc = async () => {
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
  };

  const getComp = async () => {
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
  };

  const getCurrency = async (isUpdate = false) => {
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
        cus_curren: currentItem?.currency?.id ?? null,
        cus_pjk: currentItem.customer.cus_pjk,
        cus_ket: currentItem.customer.cus_ket,
        cus_gl: currentItem.customer.cus_gl,
        cus_uang_muka: currentItem.customer.cus_uang_muka,
        cus_limit: currentItem.customer.cus_limit,
        sub_cus: currentItem.customer.sub_cus,
        cus_id: currentItem.customer.cus_id,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          onSuccessInput();
          setLoading(false);
          onHideInput();
          onInput(false);
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
        sub_cus: currentItem.customer.sub_cus,
        cus_id: currentItem.customer.cus_id,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          onSuccessInput();
          setLoading(false);
          onHideInput();
          onInput(false);
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
          setLoading(false);
          setShowDelete(false);
          onSuccessInput();
          onInput(false);
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
        setLoading(false);
        setShowDelete(false);
        onInput(false);
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
            setEdit(true);
            setShowInput(true);
            onInput(true);
            setCurrentItem({
              ...data,
              customer: { ...data.customer, cus_id: data.customer.cus_id.id },
            });
          }}
          className="btn btn-primary shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          onClick={() => {
            setCurrentItem(data);
            setShowInput(true);
            onInput(true);
          }}
          className="btn btn-danger shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-trash"></i>
        </Link>
      </div>
      // </React.Fragment>
    );
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
              oonClick={() => {
                onHideInput();
                onInput(false);
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
          onClick={() => {
            setShowDelete(false);
            setLoading(false);
            onInput(false);
          }}
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
            setShowInput(true);
            setEdit(false);
            setLoading(false);
            setCurrentItem({
              ...data,
              customer: {
                ...data.customer,
                cus_gl: setup.ar.id,
                cus_uang_muka: setup.pur_advance.id,
              },
            });
            onInput(true);
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

  const checkPelanggan = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer.id) {
        selected = element;
      }
    });

    return selected;
  };

  const onHideInput = () => {
    setLoading(false);
    setCurrentItem(def);
    setEdit(false);
    setShowInput(false);
  };

  const renderBody = () => {
    return (
      <DataTable
        responsiveLayout="scroll"
        value={data}
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
        selectionMode="single"
        onRowSelect={onRowSelect}
      >
        <Column
          header="Kode Pelanggan"
          style={{
            minWidth: "8rem",
          }}
          field={(e) => e.customer.cus_code}
          body={(e) =>
            load ? (
              <Skeleton />
            ) : e.customer.sub_cus ? (
              <div>
                <span>{e.customer.cus_code} </span>
                <Badge
                  value={`Sub ${e.customer.cus_id.cus_code}`}
                  className={"active ml-2"}
                ></Badge>
              </div>
            ) : (
              <span>{e.customer.cus_code} </span>
            )
          }
        />
        <Column
          header="Nama Pelanggan"
          field={(e) => e.customer.cus_name}
          style={{ minWidth: "8rem" }}
          body={load && <Skeleton />}
        />
        <Column
          header="Alamat"
          field={(e) => e.customer.cus_address}
          style={{ minWidth: "8rem" }}
          body={load && <Skeleton />}
        />
        <Column
          header="Telp"
          field={(e) => e.customer.cus_telp1}
          style={{ minWidth: "8rem" }}
          body={load && <Skeleton />}
        />
        <Column
          header="Limit Kredit"
          field={(e) => e.customer.cus_limit}
          style={{ minWidth: "8rem" }}
          body={load && <Skeleton />}
        />
        <Column
          header="Action"
          dataType="boolean"
          bodyClassName="text-center"
          style={{ minWidth: "2rem" }}
          body={(e) => (load ? <Skeleton /> : actionBodyTemplate(e))}
        />
      </DataTable>
    );
  };

  const renderDialog = () => {
    return (
      <>
        <Toast ref={toast} />

        <Dialog
          header={isEdit ? "Edit Data Pelanggan" : "Tambah Data Pelanggan"}
          visible={showInput}
          style={{ width: "50vw" }}
          footer={renderFooter()}
          onHide={() => {
            onHideInput();
            onInput(false);
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

              <div className="d-flex col-12 align-items-center">
                <InputSwitch
                  className="mr-3"
                  inputId="email"
                  checked={currentItem && currentItem?.customer?.sub_cus}
                  onChange={(e) => {
                    setCurrentItem({
                      ...currentItem,
                      customer: { ...currentItem.customer, sub_cus: e.value },
                    });
                  }}
                />
                <label className="mr-3 mt-1" htmlFor="email">
                  {"Jadikan Sub Pelanggan"}
                </label>
              </div>

              {currentItem?.customer?.sub_cus && (
                <div className="col-12">
                  <label className="text-label">Induk Pelanggan</label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={
                        currentItem !== null
                          ? checkPelanggan(currentItem?.customer?.cus_id)
                          : null
                      }
                      options={nonSub}
                      onChange={(e) => {
                        console.log(e.value);
                        setCurrentItem({
                          ...currentItem,
                          customer: {
                            ...currentItem.customer,
                            cus_id: e.value.customer.id,
                          },
                        });
                        console.log(currentItem);
                      }}
                      optionLabel="customer.cus_name"
                      filter
                      filterBy="customer.cus_name"
                      placeholder="Pilih Pelanggan"
                      itemTemplate={(e) => (
                        <div>{`${e?.customer.cus_name} (${e?.customer.cus_code})`}</div>
                      )}
                      valueTemplate={(e, props) =>
                        e ? (
                          <div>{`${e?.customer.cus_name} (${e?.customer.cus_code})`}</div>
                        ) : (
                          <span>{props.placeholder}</span>
                        )
                      }
                    />
                  </div>
                </div>
              )}

              <h4 className="mt-4 ml-3">
                <b>Informasi Alamat</b>
              </h4>
              <Divider className="mb-2 ml-3 mr-3"></Divider>

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

            <TabPanel
              header="Informasi Kontak"
              headerTemplate={renderTabHeader}
            >
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
                    *Aktifkan Multi Currency Pada Setup Perusahaan Terlebih
                    Dahulu
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

              <h4 className="mt-4 ml-3 mr-3">
                <b>Distribusi GL/AR</b>
              </h4>
              <Divider className="mb-2 ml-3 mr-3"></Divider>

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
          visible={showDelete}
          style={{ width: "30vw" }}
          footer={renderFooterDel}
          onHide={() => {
            setLoading(false);
            setShowDelete(false);
            onInput(false);
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
          onHide={() => {
            setShowJenisPelanggan(false);
          }}
          onInput={(e) => {
            setShowJenisPelanggan(!e);
          }}
          onSuccessInput={(e) => {
            getJpel(true);
          }}
          onRowSelect={(e) => {
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

  if (popUp) {
    return (
      <>
        <Dialog
          header={"Data Customer"}
          visible={show}
          footer={() => <div></div>}
          style={{ width: "60vw" }}
          onHide={onHide}
        >
          <Row className="ml-0 mr-0">
            <Col>{renderBody()}</Col>
          </Row>
        </Dialog>
        {renderDialog()}
      </>
    );
  } else {
    return (
      <>
        {renderBody()}
        {renderDialog()}
      </>
    );
  }
};

export default DataCustomer;
