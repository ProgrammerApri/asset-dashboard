import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, TabPane } from "react-bootstrap";
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

const def = {
  supplier: {
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

  currency: {
    id: 0,
    code: "",
    name: "",
  },

  jenisPemasok: {
    id: 1,
    jpem_code: "",
    jpem_name: "",
    jpem_ket: "",
  },

  city: {
    city_id: 0,
    province_id: 0,
    province: "",
    type: "",
    city_name: "",
    postal_code: 0,
  },
};

const pajak = [
  { name: "Include", code: "I" },
  { name: "Exclude", code: "E" },
  { name: "Non PPN", code: "N" },
];

const DataSupplier = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
}) => {
  const [jpem, setJpem] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [city, setCity] = useState(null);
  const [setup, setSetup] = useState(null);
  const [accHut, setAccHut] = useState(null);
  const [accUm, setAccUm] = useState(null);
  const [company, setComp] = useState(null);
  const [pajak, setPajak] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    getJpem();
    getCurrency();
    getCity();
    getSetup();
    getAccHut();
    getAccUm();
    getCompany();
    getPajak();
    initFilters1();
  }, []);

  const getJpem = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.jenisPemasok,
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
        setJpem(data);
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

  const getCity = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.city,
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
        setCity(data);
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

  const getSetup = async (isUpdate = false) => {
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
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const getAccHut = async () => {
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
          // if (elem.account.kat_code === 9) {
          //   filt.push(elem.account);
          // }
          filt.push(elem.account);
        });
        console.log(data);
        setAccHut(filt);
      }
    } catch (error) {}
  };

  const getAccUm = async () => {
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
          // if (elem.account.kat_code === 5) {
          //   filt.push(elem.account);
          // }
        });
        console.log(data);
        setAccUm(data);
      }
    } catch (error) {}
  };

  const getCompany = async (isUpdate = false) => {
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
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const getPajak = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.pajak,
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
        setPajak(data);
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

  const editSupplier = async () => {
    const config = {
      ...endpoints.editSupplier,
      endpoint: endpoints.editSupplier.endpoint + currentItem.supplier.id,
      data: {
        sup_code: currentItem?.supplier?.sup_code ?? null,
        sup_name: currentItem?.supplier?.sup_name ?? null,
        sup_jpem: currentItem?.jpem?.id ?? null,
        sup_ppn: currentItem?.supplier?.sup_ppn ?? null,
        sup_npwp: currentItem?.supplier?.sup_npwp ?? null,
        sup_address: currentItem?.supplier?.sup_address ?? null,
        sup_kota: currentItem?.supplier?.sup_kota ?? null,
        sup_kpos: currentItem?.supplier?.sup_kpos ?? null,
        sup_telp1: currentItem?.supplier?.sup_telp1 ?? null,
        sup_telp2: currentItem?.supplier?.sup_telp2 ?? null,
        sup_fax: currentItem?.supplier?.sup_fax ?? null,
        sup_cp: currentItem?.supplier?.sup_cp ?? null,
        sup_curren: currentItem?.currency?.id ?? null,
        sup_ket: currentItem?.supplier?.sup_ket ?? null,
        sup_hutang: currentItem?.supplier?.sup_hutang ?? null,
        sup_uang_muka: currentItem?.supplier?.sup_uang_muka ?? null,
        sup_limit: currentItem?.supplier?.sup_limit ?? null,
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
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
          life: 3000,
        });
      }, 500);
    }
  };

  const addSupplier = async () => {
    const config = {
      ...endpoints.addSupplier,
      data: {
        sup_code: currentItem?.supplier?.sup_code ?? null,
        sup_name: currentItem?.supplier?.sup_name ?? null,
        sup_jpem: currentItem?.jpem?.id ?? null,
        sup_ppn: currentItem?.supplier?.sup_ppn ?? null,
        sup_npwp: currentItem?.supplier?.sup_npwp ?? null,
        sup_address: currentItem?.supplier?.sup_address ?? null,
        sup_kota: currentItem?.supplier?.sup_kota ?? null,
        sup_kpos: currentItem?.supplier?.sup_kpos ?? null,
        sup_telp1: currentItem?.supplier?.sup_telp1 ?? null,
        sup_telp2: currentItem?.supplier?.sup_telp2 ?? null,
        sup_fax: currentItem?.supplier?.sup_fax ?? null,
        sup_cp: currentItem?.supplier?.sup_cp ?? null,
        sup_curren: currentItem?.currency?.id ?? null,
        sup_ket: currentItem?.supplier?.sup_ket ?? null,
        sup_hutang: currentItem?.supplier?.sup_hutang ?? null,
        sup_uang_muka: currentItem?.supplier?.sup_uang_muka ?? null,
        sup_limit: currentItem?.supplier?.sup_limit ?? null,
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
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: `Kode ${currentItem.supplier.sup_code} Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
        setTimeout(() => {
          setLoading(false);
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

  const delSupplier = async () => {
    setLoading(true);
    const config = {
      ...endpoints.delSupplier,
      endpoint: endpoints.delSupplier.endpoint + currentItem.supplier.id,
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
            setCurrentItem(data);
            setShowInput(true);
            onInput(true);
          }}
          className="btn btn-primary shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          onClick={() => {
            setCurrentItem(data);
            setShowDelete(true);
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
      setLoading(true);
      editSupplier();
      setActive(0);
    } else {
      setLoading(true);
      addSupplier();
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
              onClick={() => {
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
            loading={loading}
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
          loading={loading}
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
            delSupplier();
          }}
          autoFocus
          loading={loading}
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
              ...def,
              supplier: {
                ...def.supplier,
                sup_hutang: setup?.ap?.id,
                sup_uang_muka: setup?.pur_advance?.id,
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

  const ppn = (value) => {
    let selected = {};
    pajak?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });
    return selected;
  };

  const kota = (value) => {
    let selected = {};
    city?.forEach((element) => {
      if (value === element.city_id) {
        selected = element;
      }
    });
    return selected;
  };

  const hut = (value) => {
    let hut = {};
    accHut?.forEach((element) => {
      if (value === element.id) {
        hut = element;
      }
    });
    return hut;
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
          {option !== null ? `${option?.acc_name} - (${option?.acc_code})` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  // const glTemp = (option) => {
  //   return (
  //     <div>
  //       {option !== null ? `${option.acc_name} - (${option.acc_code})` : ""}
  //     </div>
  //   );
  // };

  // const value = (option, props) => {
  //   if (option) {
  //     return (
  //       <div>
  //         {option !== null ? `${option?.acc_name} - (${option?.acc_code})` : ""}
  //       </div>
  //     );
  //   }

  //   return <span>{props.placeholder}</span>;
  // };

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

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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
          "supplier.sup_code",
          "supplier.sup_name",
          "supplier.sup_address",
          "supplier.sup_telp1",
          "supplier.sup_limit",
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
          header="Kode Pemasok"
          style={{
            minWidth: "8rem",
          }}
          field={(e) => e.supplier?.sup_code}
          body={load && <Skeleton />}
        />
        <Column
          header="Nama Pemasok"
          field={(e) => e.supplier?.sup_name}
          style={{ minWidth: "8rem" }}
          body={load && <Skeleton />}
        />
        <Column
          header="Alamat"
          field={(e) => e.supplier?.sup_address}
          style={{ minWidth: "8rem" }}
          body={load && <Skeleton />}
        />
        <Column
          header="Telp"
          field={(e) => e.supplier?.sup_telp1}
          style={{ minWidth: "8rem" }}
          body={load && <Skeleton />}
        />
        <Column
          header="Limit Kredit"
          field={(e) => formatIdr(e.supplier?.sup_limit ?? "")}
          style={{ minWidth: "8rem" }}
          body={load && <Skeleton />}
        />
        <Column
          header="Action"
          dataType="boolean"
          bodyClassName="text-center"
          style={{ minWidth: "3rem" }}
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
          header={isEdit ? "Edit Data Pemasok" : "Tambah Data Pemasok"}
          visible={showInput}
          style={{ width: "50vw" }}
          footer={renderFooter()}
          onHide={() => {
            onHideInput();
            onInput(false);
            setActive(0);
          }}
        >
          <TabView activeIndex={active} onTabChange={(e) => setActive(e.index)}>
            <TabPanel
              header="Informasi Supplier"
              headerTemplate={renderTabHeader}
            >
              <div className="row ml-0 mt-0">
                <div className="col-6 mt-0">
                  <label className="text-label">Kode Pemasok</label>
                  <div className="p-inputgroup">
                    <InputText
                      value={
                        currentItem !== null
                          ? currentItem?.supplier?.sup_code
                          : null
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_code: e.target.value,
                          },
                        })
                      }
                      placeholder="Masukan Kode Pemasok"
                    />
                  </div>
                </div>

                <div className="col-6">
                  <label className="text-label">Nama Pemasok</label>
                  <div className="p-inputgroup">
                    <InputText
                      value={
                        currentItem !== null
                          ? `${currentItem?.supplier?.sup_name ?? ""}`
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_name: e.target.value,
                          },
                        })
                      }
                      placeholder="Masukan Nama Pemasok"
                    />
                  </div>
                </div>
              </div>

              <div className="row ml-0 mt-0">
                <div className="col-6 mt-0">
                  <label className="text-label">Jenis Pemasok</label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={currentItem !== null ? currentItem.jpem : null}
                      options={jpem}
                      onChange={(e) => {
                        console.log(e.value);
                        setCurrentItem({
                          ...currentItem,
                          jpem: e.value,
                        });
                      }}
                      optionLabel="jpem_name"
                      filter
                      filterBy="jpem_name"
                      placeholder="Pilih Jenis Pemasok"
                    />
                  </div>
                </div>

                <div className="col-6">
                  <label className="text-label">NPWP</label>
                  <div className="p-inputgroup">
                    <InputText
                      value={
                        currentItem !== null
                          ? `${currentItem?.supplier?.sup_npwp ?? ""}`
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_npwp: e.target.value,
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

              <div className="row ml-0 mt-0">
                <div className="col-12">
                  <label className="text-label">Alamat</label>
                  <div className="p-inputgroup">
                    <InputText
                      value={
                        currentItem !== null
                          ? `${currentItem?.supplier?.sup_address ?? ""}`
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_address: e.target.value,
                          },
                        })
                      }
                      placeholder="Masukan Alamat"
                    />
                  </div>
                </div>
              </div>

              <div className="row ml-0 mt-0">
                <div className="col-6 mt-0">
                  <label className="text-label">Kota</label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={
                        currentItem !== null
                          ? kota(currentItem?.supplier?.sup_kota)
                          : null
                      }
                      options={city}
                      onChange={(e) => {
                        console.log(e.value);
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_kota: e.value.city_id,
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
                      value={
                        currentItem !== null
                          ? `${currentItem?.supplier?.sup_kpos ?? ""}`
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_kpos: e.value,
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
              <div className="row ml-0 mt-0">
                <div className="col-6 mt-0">
                  <label className="text-label">No. Telepon 1</label>
                  <div className="p-inputgroup">
                    <InputNumber
                      value={
                        currentItem !== null
                          ? `${currentItem?.supplier?.sup_telp1 ?? ""}`
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_telp1: e.value,
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
                      value={
                        currentItem !== null
                          ? `${currentItem?.supplier?.sup_telp2 ?? ""}`
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_telp2: e.value,
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

              <div className="row ml-0 mt-0">
                <div className="col-6 mt-0">
                  <label className="text-label">Fax</label>
                  <div className="p-inputgroup">
                    <InputText
                      value={
                        currentItem !== null
                          ? `${currentItem?.supplier?.sup_fax ?? ""}`
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_fax: e.target.value,
                          },
                        })
                      }
                      placeholder="Masukan Fax"
                    />
                  </div>
                </div>

                <div className="col-6">
                  <label className="text-label">Contact Person</label>
                  <div className="p-inputgroup">
                    <InputText
                      value={
                        currentItem !== null
                          ? `${currentItem?.supplier?.sup_cp ?? ""}`
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_cp: e.target.value,
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
              header="Distribusi AP & Currency"
              headerTemplate={renderTabHeader}
            >
              <div className="row ml-0 mt-0">
                <div className="col-6">
                  <label className="text-label">Kode Currency</label>
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
                      filterBy="code"
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
                        currentItem !== null
                          ? ppn(currentItem?.supplier?.sup_ppn)
                          : null
                      }
                      options={pajak}
                      onChange={(e) => {
                        console.log(e.value);
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_ppn: e.value.id,
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

              <div className="row ml-0 mt-0">
                <div className="col-12">
                  <label className="text-label">Keterangan</label>
                  <div className="p-inputgroup">
                    <InputTextarea
                      value={
                        currentItem !== null
                          ? `${currentItem?.supplier?.sup_ket ?? ""}`
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_ket: e.target.value,
                          },
                        })
                      }
                      placeholder="Masukan Keterangan"
                    />
                  </div>
                </div>
              </div>

              <h4 className="mt-4">
                <b>Distribusi GL/AP</b>
              </h4>
              <Divider className="mb-3"></Divider>

              <div className="row ml-0 mt-0">
                <div className="col-6">
                  <label className="text-label">Hutang</label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={
                        currentItem !== null &&
                        currentItem.supplier.sup_hutang !== null
                          ? hut(currentItem.supplier.sup_hutang)
                          : null
                      }
                      options={accHut}
                      onChange={(e) => {
                        console.log(e.value);
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_hutang: e.value?.id ?? null,
                          },
                        });
                      }}
                      optionLabel="account.acc_name"
                      valueTemplate={clear}
                      itemTemplate={glTemplate}
                      filter
                      filterBy="account.acc_name"
                      placeholder="Kode Distribusi Hutang"
                      showClear
                      // disabled
                    />
                  </div>
                </div>

                <div className="col-6">
                  <label className="text-label">Uang Muka Pembelian</label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={
                        currentItem !== null 
                          ? hut(currentItem?.supplier?.sup_uang_muka)
                          : null
                      }
                      options={accHut}
                      onChange={(e) => {
                        console.log(e.value);
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_uang_muka: e.value?.id ?? null,
                          },
                        });
                      }}
                      optionLabel="account.acc_name"
                      valueTemplate={clear}
                      itemTemplate={glTemplate}
                      filter
                      filterBy="account.acc_name"
                      placeholder="Kode Distribusi Uang Muka"
                      showClear
                      // disabled
                    />
                  </div>
                </div>
              </div>

              <div className="row ml-0 mt-0">
                <div className="col-12">
                  <label className="text-label">Limit Kredit</label>
                  <div className="p-inputgroup">
                    <InputNumber
                      value={
                        currentItem !== null
                          ? `${currentItem?.supplier?.sup_limit ?? ""}`
                          : ""
                      }
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          supplier: {
                            ...currentItem.supplier,
                            sup_limit: e.value,
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
          footer={renderFooterDel()}
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
      </>
    );
  };

  if (popUp) {
    return (
      <>
        <Dialog
          header={"Data Supplier"}
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

export default DataSupplier;
