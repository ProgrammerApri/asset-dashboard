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

const data = {
  supplier: {
    id: 0,
    sup_code: "",
    sup_name: "",
    sup_jpem: 0,
    sup_ppn: "",
    sup_npwp: "",
    sup_address: "",
    sup_kota: null,
    sup_kpos: 0,
    sup_telp1: 0,
    sup_telp2: 0,
    sup_fax: "",
    sup_cp: "",
    sup_curren: 0,
    sup_ket: "",
    sup_hutang: 0,
    sup_uang_muka: 0,
    sup_limit: 0,
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

const Supplier = () => {
  const [supplier, setSupplier] = useState(null);
  const [jpem, setJpem] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [city, setCity] = useState(null);
  const [setup, setSetup] = useState(null);
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
    getSupplier();
    getJpem();
    getCurrency();
    getCity();
    getSetup();
    initFilters1();
  }, []);

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
        setSupplier(data);
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

  const editSupplier = async () => {
    const config = {
      ...endpoints.editSupplier,
      endpoint: endpoints.editSupplier.endpoint + currentItem.supplier.id,
      data: {
        sup_code: currentItem.supplier.sup_code,
        sup_name: currentItem.supplier.sup_name,
        sup_jpem: currentItem.jpem.id,
        sup_ppn: currentItem.supplier.sup_ppn,
        sup_npwp: currentItem.supplier.sup_npwp,
        sup_address: currentItem.supplier.sup_address,
        sup_kota: currentItem.supplier.sup_kota,
        sup_kpos: currentItem.supplier.sup_kpos,
        sup_telp1: currentItem.supplier.sup_telp1,
        sup_telp2: currentItem.supplier.sup_telp2,
        sup_fax: currentItem.supplier.sup_fax,
        sup_cp: currentItem.supplier.sup_cp,
        sup_curren: currentItem.currency.id,
        sup_ket: currentItem.supplier.sup_ket,
        sup_hutang: setup.ap.id,
        sup_uang_muka: setup.pur_advance.id,
        sup_limit: currentItem.supplier.sup_limit,
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
          getSupplier(true);
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

  const addSupplier = async () => {
    const config = {
      ...endpoints.addSupplier,
      data: {
        sup_code: currentItem.supplier.sup_code,
        sup_name: currentItem.supplier.sup_name,
        sup_jpem: currentItem.jpem.id,
        sup_ppn: currentItem.supplier.sup_ppn,
        sup_npwp: currentItem.supplier.sup_npwp,
        sup_address: currentItem.supplier.sup_address,
        sup_kota: currentItem.supplier.sup_kota,
        sup_kpos: currentItem.supplier.sup_kpos,
        sup_telp1: currentItem.supplier.sup_telp1,
        sup_telp2: currentItem.supplier.sup_telp2,
        sup_fax: currentItem.supplier.sup_fax,
        sup_cp: currentItem.supplier.sup_cp,
        sup_curren: currentItem.currency.id,
        sup_ket: currentItem.supplier.sup_ket,
        sup_hutang: setup.ap.id,
        sup_uang_muka: setup.pur_advance.id,
        sup_limit: currentItem.supplier.sup_limit,
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
          getSupplier(true);
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
            detail: `Kode ${currentItem.supplier.sup_code} Sudah Digunakan`,
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

  const delSupplier = async (id) => {
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
          setUpdate(false);
          setDisplayData(false);
          getSupplier(true);
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
      editSupplier();
    } else {
      setUpdate(true);
      addSupplier();
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
            delSupplier();
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
    console.log(selected);
    return selected;
  };

  const renderTabHeader = (options) => {
    return (
      <button
        type="button"
        onClick={options.onClick}
        className={options.className}
      >
        {options.titleElement}
        <Badge value={`${options.index+1}`} className={`${active === options.index ? "active" : ""} ml-2`}></Badge>
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
              <span className="fs-13 text-black font-w600 mb-0">
                Hutang Jatuh Tempo Lebih Dari <b>90 Hari</b>
              </span>
              <h4 className="fs-140 text-black font-w600 mt-3">
                <b>Rp. </b>
              </h4>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4 col-sm-4">
          <Card>
            <Card.Body className="p-4">
              <span className="fs-13 text-black font-w600 mb-0">
                Hutang Jatuh Tempo <b>Belum Jatuh Tempo</b>
              </span>
              <h4 className="fs-140 text-black font-w600 mt-3">
                <b>Rp. </b>
              </h4>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4 col-sm-4">
          <Card>
            <Card.Body className="p-4">
              <span className="fs-13 text-black font-w600 mb-0">
                <b>Total Hutang</b>
              </span>
              <h4 className="fs-140 text-black font-w600 mt-3">
                <b>Rp. </b>
              </h4>
            </Card.Body>
          </Card>
        </div>

        <Col className="col-xl-12 col-xxl-12 pt-0">
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : supplier}
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
              >
                <Column
                  header="Kode Pemasok"
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => e.supplier.sup_code}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Pemasok"
                  field={(e) => e.supplier.sup_name}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Alamat"
                  field={(e) => e.supplier.sup_address}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Telp"
                  field={(e) => e.supplier.sup_telp1}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Limit Kredit"
                  field={(e) => e.supplier.sup_limit}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Action"
                  dataType="boolean"
                  bodyClassName="text-center"
                  style={{ minWidth: "3rem" }}
                  body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Dialog
        header={isEdit ? "Edit Data Pemasok" : "Tambah Data Pemasok"}
        visible={displayData}
        style={{ width: "50vw" }}
        footer={renderFooter("displayData")}
        onHide={() => {
          setEdit(false);
          setDisplayData(false);
        }}
      >
        <TabView
        activeIndex={active}
        onTabChange={(e) => setActive(e.index)}
        >
          <TabPanel header="Informasi Supplier" headerTemplate={renderTabHeader}>
            <div className="row ml-0 mt-0">
              <div className="col-6 mt-0">
                <label className="text-label">Kode Pemasok</label>
                <div className="p-inputgroup">
                  <InputText
                    value={
                      currentItem !== null
                        ? `${currentItem.supplier.sup_code}`
                        : ""
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
                        ? `${currentItem.supplier.sup_name}`
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
                <label className="text-label">PPN</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={
                      currentItem !== null
                        ? getPpn(currentItem.supplier.sup_ppn)
                        : null
                    }
                    options={pajak}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        supplier: {
                          ...currentItem.supplier,
                          sup_ppn: e.value.code,
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
                <label className="text-label">NPWP</label>
                <div className="p-inputgroup">
                  <InputText
                    value={
                      currentItem !== null
                        ? `${currentItem.supplier.sup_npwp}`
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
                        ? `${currentItem.supplier.sup_address}`
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
                      currentItem !== null &&
                      currentItem.supplier.sup_kota !== null
                        ? kota(currentItem.supplier.sup_kota)
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
                        ? `${currentItem.supplier.sup_kpos}`
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

          <TabPanel header="Informasi Kontak" headerTemplate={renderTabHeader}>
            <div className="row ml-0 mt-0">
              <div className="col-6 mt-0">
                <label className="text-label">No. Telepon 1</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={
                      currentItem !== null
                        ? `${currentItem.supplier.sup_telp1}`
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
                        ? `${currentItem.supplier.sup_telp2}`
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
                        ? `${currentItem.supplier.sup_fax}`
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
                        ? `${currentItem.supplier.sup_cp}`
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
            header="Currency & Distribusi AP"
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
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Limit Kredit</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={
                      currentItem !== null
                        ? `${currentItem.supplier.sup_limit}`
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

            <div className="row ml-0 mt-0">
              <div className="col-12">
                <label className="text-label">Keterangan</label>
                <div className="p-inputgroup">
                  <InputTextarea
                    value={
                      currentItem !== null
                        ? `${currentItem.supplier.sup_ket}`
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
              <b>Distribusi GL/AR</b>
            </h4>
            <Divider className="mb-3"></Divider>

            <div className="row ml-0 mt-0">
              <div className="col-6">
                <label className="text-label">Hutang</label>
                <div className="p-inputgroup">
                  <InputText
                    value={
                      setup !== null
                        ? `(${setup.ap.acc_code}) - ${setup.ap.acc_name}`
                        : ""
                    }
                    disabled
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Uang Muka Pembelian</label>
                <div className="p-inputgroup">
                  <InputText
                    value={
                      setup !== null
                        ? `(${setup.pur_advance.acc_code}) - ${setup.pur_advance.acc_name}`
                        : ""
                    }
                    disabled
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
    </>
  );
};

export default Supplier;
