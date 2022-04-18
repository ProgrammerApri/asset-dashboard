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
import { TabView, TabPanel } from "primereact/tabview";
import { InputNumber } from "primereact/inputnumber";

const data = {
  customer: {
    id: 1,
    cus_code: "",
    cus_name: "",
    cus_address: "",
    cus_telp: "",
    cus_saldo: "",
  },

  supplier: {
    id: 1,
    sup_code: "",
    sup_name: "",
    sup_address: "",
    sup_telp: "",
    sup_saldo: "",
  },
};

const Mitra = () => {
  const [mitra, setMitra] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [position, setPosition] = useState("center");
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getMitra();
    getCustomer();
    getSupplier();
    initFilters1();
  }, []);

  const getMitra = async (isUpdate = false) => {};

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

  ///CRUD CUSTOMER MENU

  const editCustomer = async () => {
    const config = {
      ...endpoints.editCustomer,
      endpoint: endpoints.editCustomer.endpoint + currentItem.id,
      data: {
        cus_code: currentItem.cus_code,
        cus_name: currentItem.cus_name,
        cus_address: currentItem.cus_address,
        cus_telp: currentItem.cus_telp,
        cus_saldo: currentItem.cus_saldo,
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
        cus_code: currentItem.cus_code,
        cus_name: currentItem.cus_name,
        cus_address: currentItem.cus_address,
        cus_telp: currentItem.cus_telp,
        cus_saldo: currentItem.cus_saldo,
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
            detail: `Kode ${currentItem.proj_code} Sudah Digunakan`,
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

  const delCustomer = async (id) => {
    const config = {
      ...endpoints.delCustomer,
      endpoint: endpoints.delCustomer.endpoint + currentItem.id,
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
            detail: "Data Berhasil Diperbarui",
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
          detail: `Tidak Dapat Menghapus Project`,
          life: 3000,
        });
      }, 500);
    }
  };

  ///CRUD SUPPLIER MENU

  const editSupplier = async () => {
    const config = {
      ...endpoints.editSupplier,
      endpoint: endpoints.editSupplier.endpoint + currentItem.id,
      data: {
        sup_code: currentItem.sup_code,
        sup_name: currentItem.sup_name,
        sup_address: currentItem.sup_address,
        sup_telp: currentItem.sup_telp,
        sup_saldo: currentItem.sup_saldo,
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
          setDialog(false);
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
        sup_code: currentItem.sup_code,
        sup_name: currentItem.sup_name,
        sup_address: currentItem.sup_address,
        sup_telp: currentItem.sup_telp,
        sup_saldo: currentItem.sup_saldo,
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
          setDialog(false);
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
            detail: `Kode ${currentItem.sup_code} Sudah Digunakan`,
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
      endpoint: endpoints.delSupplier.endpoint + currentItem.id,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDialog(false);
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
      setTimeout(() => {
        setUpdate(false);
        setDisplayDel(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: `Tidak Dapat Menghapus Project`,
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

  const actionTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            setEdit(true);
            setDialog(true);
            setCurrentItem(data);
          }}
          className="btn btn-primary shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          onClick={() => {
            setEdit(true);
            setDialog(true);
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
        editCustomer();
        editSupplier();
    } else {
      setUpdate(true);
        addCustomer();
        addSupplier();
    }
  };

  const renderFooter = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => setDisplayData(false) & setDialog(false)}
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
            // delProject();
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

  const renderHeader2 = () => {
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
            setDialog(true);
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

  return (
    <>
      <Toast ref={toast} />

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <TabView>
                <TabPanel header="Pelanggan">
                  <div className="row">
                    <div className="col-xl col-md-6 col-sm-6">
                      <div className="card">
                        <div className="card-body p-4">
                          <span className="fs-14">
                            Piutang Jatuh Tempo Lebih Dari <b>90 Hari</b>
                          </span>
                          <h4 className="fs-160 text-black font-w600 mb-0">
                            <b>Rp. </b>
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl col-md-6 col-sm-6">
                      <div className="card">
                        <div className="card-body p-4">
                          <span className="fs-14">
                            Piutang Jatuh Tempo <b>Belum Jatuh Tempo</b>
                          </span>
                          <h4 className="fs-160 text-black font-w600 mb-0">
                            <b>Rp. </b>
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl col-md-6 col-sm-6">
                      <div className="card">
                        <div className="card-body p-4">
                          <span className="fs-14">
                            <b>Total Piutang</b>
                          </span>
                          <h4 className="fs-160 text-black font-w600 mb-0">
                            <b>Rp. </b>
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
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
                      "customer.cus_telp",
                      "customer.cus_saldo",
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
                      field={(e) => e.cus_code}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      header="Nama Pelanggan"
                      field={(e) => e.cus_name}
                      style={{ minWidth: "8rem" }}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      header="Alamat"
                      field={(e) => e.cus_address}
                      style={{ minWidth: "8rem" }}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      header="Telp"
                      field={(e) => e.cus_telp}
                      style={{ minWidth: "8rem" }}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      header="Saldo"
                      field={(e) => e.cus_saldo}
                      style={{ minWidth: "8rem" }}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      header="Action"
                      dataType="boolean"
                      bodyClassName="text-center"
                      style={{ minWidth: "2rem" }}
                      body={(e) =>
                        loading ? <Skeleton /> : actionBodyTemplate(e)
                      }
                    />
                  </DataTable>
                </TabPanel>

                <TabPanel header="Pemasok">
                  <div className="row">
                    <div className="col-xl col-md-6 col-sm-6">
                      <div className="card primary-box">
                        <div className="card-body p-4">
                          <span className="fs-14">
                            Hutang Jatuh Tempo Lebih Dari <b>90 Hari</b>
                          </span>
                          <h4 className="fs-160 text-black font-w600 mb-0">
                            <b>Rp. </b>
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl col-md-6 col-sm-6">
                      <div className="card">
                        <div className="card-body p-4">
                          <span className="fs-14">
                            Hutang Jatuh Tempo <b>Belum Jatuh Tempo</b>
                          </span>
                          <h4 className="fs-160 text-black font-w600 mb-0">
                            <b>Rp. </b>
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl col-md-6 col-sm-6">
                      <div className="card">
                        <div className="card-body p-4">
                          <span className="fs-14">
                            <b>Total Hutang</b>
                          </span>
                          <h4 className="fs-160 text-black font-w600 mb-0">
                            <b>Rp. </b>
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DataTable
                    responsiveLayout="scroll"
                    value={loading ? dummy : supplier}
                    className="display w-150 datatable-wrapper"
                    showGridlines
                    dataKey="id"
                    rowHover
                    header={renderHeader2}
                    filters={filters1}
                    globalFilterFields={[
                      "supplier.sup_code",
                      "supplier.sup_name",
                      "supplier.sup_address",
                      "supplier.sup_telp",
                      "supplier.sup_saldo",
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
                      field={(e) => e.sup_code}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      header="Nama Pemasok"
                      field={(e) => e.sup_name}
                      style={{ minWidth: "8rem" }}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      header="Alamat"
                      field={(e) => e.sup_address}
                      style={{ minWidth: "8rem" }}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      header="Telp"
                      field={(e) => e.sup_telp}
                      style={{ minWidth: "8rem" }}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      header="Saldo"
                      field={(e) => e.sup_saldo}
                      style={{ minWidth: "8rem" }}
                      body={loading && <Skeleton />}
                    />
                    <Column
                      header="Action"
                      dataType="boolean"
                      bodyClassName="text-center"
                      style={{ minWidth: "2rem" }}
                      body={(e) => (loading ? <Skeleton /> : actionTemplate(e))}
                    />
                  </DataTable>
                </TabPanel>
              </TabView>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Dialog
        header={isEdit ? "Edit Data Pelanggan" : "Tambah Data pelanggan"}
        visible={displayData}
        style={{ width: "40vw" }}
        footer={renderFooter("displayData")}
        onHide={() => {
          setEdit(false);
          setDisplayData(false);
        }}
      >
        <div className="form-row">
          <div className="col-6">
            <label className="text-label">Kode Pelanggan</label>
            <div className="p-inputgroup">
              <InputText
                value={currentItem !== null ? `${currentItem.cus_code}` : ""}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, cus_code: e.target.value })
                }
                placeholder="Masukan Kode Pelanggan"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Nama Pelanggan</label>
            <div className="p-inputgroup">
              <InputText
                value={currentItem !== null ? `${currentItem.cus_name}` : ""}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, cus_name: e.target.value })
                }
                placeholder="Masukan Nama Pelanggan"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col-12">
            <label className="text-label">Alamat</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={currentItem !== null ? `${currentItem.cus_address}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    cus_address: e.target.value,
                  })
                }
                placeholder="Masukan Alamat"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col-6">
            <label className="text-label">Telp</label>
            <div className="p-inputgroup">
              <InputNumber
                value={currentItem !== null ? `${currentItem.cus_telp}` : ""}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, cus_telp: e.target.value })
                }
                placeholder="Masukan No. Telepon"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Saldo</label>
            <div className="p-inputgroup">
              <InputNumber
                value={currentItem !== null ? `${currentItem.cus_saldo}` : ""}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, cus_saldo: e.target.value })
                }
                placeholder="Masukan Saldo"
              />
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        header={isEdit ? "Edit Data Pemasok" : "Tambah Data Pemasok"}
        visible={dialog}
        style={{ width: "40vw" }}
        footer={renderFooter("dialog")}
        onHide={() => {
          setEdit(false);
          setDialog(false);
        }}
      >
        <div className="form-row">
          <div className="col-6">
            <label className="text-label">Kode Pemasok</label>
            <div className="p-inputgroup">
              <InputText
                value={currentItem !== null ? `${currentItem.sup_code}` : ""}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, sup_code: e.target.value })
                }
                placeholder="Masukan Kode Pemasok"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Nama Pemasok</label>
            <div className="p-inputgroup">
              <InputText
                value={currentItem !== null ? `${currentItem.sup_name}` : ""}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, sup_name: e.target.value })
                }
                placeholder="Masukan Nama Pemasok"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col-12">
            <label className="text-label">Alamat</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={currentItem !== null ? `${currentItem.sup_address}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    sup_address: e.target.value,
                  })
                }
                placeholder="Masukan Alamat"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col-6">
            <label className="text-label">Telp</label>
            <div className="p-inputgroup">
              <InputNumber
                value={currentItem !== null ? `${currentItem.sup_telp}` : ""}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, sup_telp: e.target.value })
                }
                placeholder="Masukan No. Telepon"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Saldo</label>
            <div className="p-inputgroup">
              <InputNumber
                value={currentItem !== null ? `${currentItem.sup_saldo}` : ""}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, sup_saldo: e.target.value })
                }
                placeholder="Masukan Saldo"
              />
            </div>
          </div>
        </div>
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

export default Mitra;
