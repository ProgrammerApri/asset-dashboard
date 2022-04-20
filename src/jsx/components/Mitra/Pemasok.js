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
import { TabPanel, TabView } from "primereact/tabview";
import { Padding } from "@syncfusion/ej2-react-charts";

const data = {
  id: 1,
  sup_code: "",
  sup_name: "",
  sup_address: "",
  sup_telp: "",
  sup_saldo: "",
};

const Supplier = () => {
  const [supplier, setSupplier] = useState(null);
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

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getSupplier();
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
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => setDisplayData(false)}
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
        style={{ width: "40vw" }}
        footer={renderFooter("displayData")}
        onHide={() => {
          setEdit(false);
          setDisplayData(false);
        }}
      >
        <TabView>
          <TabPanel header="Informasi Pemasok">
            <div className="form-row">
              <div className="col-6 mt-0">
                <label className="text-label">Kode Pemasok</label>
                <div className="p-inputgroup">
                  <InputText
                    value={
                      currentItem !== null ? `${currentItem.sup_code}` : ""
                    }
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        sup_code: e.target.value,
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
                      currentItem !== null ? `${currentItem.sup_name}` : ""
                    }
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        sup_name: e.target.value,
                      })
                    }
                    placeholder="Masukan Nama Pemasok"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="col-6 mt-0">
                <label className="text-label">Email</label>
                <div className="p-inputgroup">
                  <InputText
                    value={
                      currentItem !== null ? `${currentItem.sup_code}` : ""
                    }
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        sup_code: e.target.value,
                      })
                    }
                    placeholder="Masukan Alamat Email"
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Telepon</label>
                <div className="p-inputgroup">
                  <InputText
                    value={
                      currentItem !== null ? `${currentItem.sup_name}` : ""
                    }
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        sup_name: e.target.value,
                      })
                    }
                    placeholder="Masukan No. Telepon"
                  />
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Alamat Pemasok">
            <div className="form-row">
              <div className="col-12">
                <label className="text-label">Alamat</label>
                <div className="p-inputgroup">
                  <InputTextarea
                    value={
                      currentItem !== null ? `${currentItem.sup_address}` : ""
                    }
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
          </TabPanel>

          <TabPanel header="Informasi Saldo">
            <div className="form-row">
              <div className="col-6">
                <label className="text-label">Telp</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={
                      currentItem !== null ? `${currentItem.sup_telp}` : ""
                    }
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, sup_telp: e.value })
                    }
                    placeholder="Masukan No. Telepon"
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Saldo</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={
                      currentItem !== null ? `${currentItem.sup_saldo}` : ""
                    }
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, sup_saldo: e.value })
                    }
                    placeholder="Masukan Saldo"
                    showButtons
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
