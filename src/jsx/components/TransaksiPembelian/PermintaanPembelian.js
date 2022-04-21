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

const data = {
  customer: {
    id: 1,
    cus_code: "",
    cus_name: "",
    cus_jpel: "",
    cus_sub_area: "",
    cus_kolektor: "",
    cus_npwp: "",
    cus_address: "",
    cus_kota: "",
    cus_kpos: "",
    cus_telp1: "",
    cus_telp2: "",
    cus_email: "",
    cus_fax: "",
    cus_cp: "",
    cus_curren: "",
    cus_pjk: "",
    cus_ket: "",
    cus_gl: "",
    cus_uang_muka: "",
    cus_limit: "",
  },

  jenisPel: {
    id: 0,
    jpel_code: "",
    jpel_name: "",
    jpel_ket: "",
  },

  subArea: {
    id: 1,
    sub_code: "",
    sub_area_code: "",
    sub_name: "",
    sub_ket: "",
  },

  currency: {
    id: 1,
    code: "",
    name: "",
  },
};

const PermintaanPembelian = () => {
  const [permintaan, setPermintaan] = useState(null);
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
    getCustomer();
    initFilters1();
  }, []);

  const getCustomer = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.noStock,
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
        setPermintaan(data);
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
      endpoint: endpoints.editCustomer.endpoint + currentItem.id,
      data: {
        cus_code: currentItem.customer.cus_code,
        cus_name: currentItem.customer.cus_name,
        cus_jpel: currentItem.jenisPel.id,
        cus_sub_area: currentItem.subArea.id,
        cus_kolektor: currentItem.kolektor.id,
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
        cus_gl: currentItem,
        cus_uang_muka: currentItem,
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
        cus_jpel: currentItem.jenisPel.id,
        cus_sub_area: currentItem.subArea.id,
        cus_kolektor: currentItem.kolektor.id,
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
        cus_gl: currentItem,
        cus_uang_muka: currentItem,
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
      editCustomer();
    } else {
      setUpdate(true);
      addCustomer();
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
        <Col className="pt-0">
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : permintaan}
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
                  header="Tanggal"
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => e.tanggal}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nomor Permintaan"
                  field={(e) => e.no}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Status"
                  field={(e) => e.status}
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
                value={currentItem !== null ? `${currentItem.customer.cus_code}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    customer: { ...currentItem.customer, cus_code: e.target.value },
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
                value={currentItem !== null ? `${currentItem.customer.cus_name}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    customer: { ...currentItem.customer, cus_name: e.target.value },
                  })
                }
                placeholder="Masukan Nama Pelanggan"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col-6">
            <label className="text-label">Jenis Pelanggan</label>
            <div className="p-inputgroup">
              <Dropdown
                value={currentItem !== null ? `${currentItem.jenisPel.jpel_name}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    jenisPel: { ...currentItem.jenisPel, jpel_name: e.target.value },
                  })
                }
                placeholder="Pilih Jenis Pelanggan"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Sub Area Penjualan</label>
            <div className="p-inputgroup">
              <Dropdown
                value={currentItem !== null ? `${currentItem.subArea.sub_name}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    jenisPel: { ...currentItem.jenisPel, sub_name: e.target.value },
                  })
                }
                placeholder="Pilih Sub Area Penjualan"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col-6">
            <label className="text-label">Kolektor</label>
            <div className="p-inputgroup">
              <Dropdown
                value={currentItem !== null ? `${currentItem.cus_code}` : ""}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, cus_code: e.target.value })
                }
                placeholder="Pilih Kolektor"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">NPWP</label>
            <div className="p-inputgroup">
              <InputText
                value={currentItem !== null ? `${currentItem.customer.cus_npwp}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    customer: { ...currentItem.customer, cus_npwp: e.target.value },
                  })
                }
                placeholder="Masukan NPWP"
              />
            </div>
          </div>
        </div>

        <h4 className="mt-5">
          <b>Informasi Alamat</b>
        </h4>
        <Divider className="mb-3"></Divider>

        <div className="form-row">
          <div className="col-12">
            <label className="text-label">Alamat</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={currentItem !== null ? `${currentItem.customer.cus_address}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    customer: { ...currentItem.customer, cus_code: e.target.value },
                  })
                }
                placeholder="Masukan Alamat"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col-6">
            <label className="text-label">Kota</label>
            <div className="p-inputgroup">
              <Dropdown
                value={currentItem !== null ? `${currentItem.customer.cus_kota}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    customer: { ...currentItem.customer, cus_kota: e.target.value },
                  })
                }
                placeholder="Pilih Kota"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Kode Pos</label>
            <div className="p-inputgroup">
              <InputNumber
                value={currentItem !== null ? `${currentItem.customer.cus_kpos}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    customer: { ...currentItem.customer, cus_kpos: e.value },
                  })
                }
                placeholder="Masukan Kode Pos"
              />
            </div>
          </div>
        </div>

        <h4 className="mt-5">
          <b>Informasi Kontak</b>
        </h4>
        <Divider className="mb-3"></Divider>

        <div className="form-row">
          <div className="col-6">
            <label className="text-label">Telp 1</label>
            <div className="p-inputgroup">
              <InputNumber
                value={currentItem !== null ? `${currentItem.customer.cus_telp1}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    customer: { ...currentItem.customer, cus_telp1: e.value },
                  })
                }
                placeholder="Masukan No. Telepon"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Telp 2</label>
            <div className="p-inputgroup">
              <InputNumber
                value={currentItem !== null ? `${currentItem.customer.cus_telp2}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    customer: { ...currentItem.customer, cus_telp2: e.value },
                  })
                }
                placeholder="Masukan No. Telepon"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col-6">
            <label className="text-label">Email</label>
            <div className="p-inputgroup">
              <InputText
                value={currentItem !== null ? `${currentItem.customer.cus_email}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    customer: { ...currentItem.customer, cus_email: e.target.value },
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
                value={currentItem !== null ? `${currentItem.customer.cus_fax}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    customer: { ...currentItem.customer, cus_fax: e.target.value },
                  })
                }
                placeholder="Masukan Fax"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col-12">
            <label className="text-label">Contact Person</label>
            <div className="p-inputgroup">
              <InputText
                value={currentItem !== null ? `${currentItem.customer.cus_cp}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    customer: { ...currentItem.customer, cus_cp: e.target.value },
                  })
                }
                placeholder="Masukan Contact Person"
              />
            </div>
          </div>
        </div>

        <h4 className="mt-5">
          <b>Informasi Currency</b>
        </h4>
        <Divider className="mb-3"></Divider>

        <div className="form-row">
          <div className="col-6">
            <label className="text-label">Currency</label>
            <div className="p-inputgroup">
              <Dropdown
                value={currentItem !== null ? `${currentItem.currency.name}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    currency: { ...currentItem.currency, name: e.target.value },
                  })
                }
                placeholder="Pilih Jenis Currency"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Pajak</label>
            <div className="p-inputgroup">
              <Dropdown
                value={currentItem !== null ? `${currentItem.customer.cus_pjk}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    customer: { ...currentItem.customer, cus_pjk: e.target.value },
                  })
                }
                placeholder="Pilih Pajak"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col-12">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={currentItem !== null ? `${currentItem.customer.cus_ket}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    customer: { ...currentItem.customer, cus_ket: e.target.value },
                  })
                }
                placeholder="Masukan Keterangan"
              />
            </div>
          </div>
        </div>

        <h4 className="mt-5">
          <b>Distribusi GL/AR</b>
        </h4>
        <Divider className="mb-3"></Divider>

        <div className="form-row">
          <div className="col-6">
            <label className="text-label">Kode Distribusi GL/AR</label>
            <div className="p-inputgroup">
              <Dropdown
                value={currentItem !== null ? `${currentItem.cus_telp}` : ""}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, cus_telp: e.value })
                }
                placeholder="Pilih Kode Distribusi"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">
              Kode Distribusi Uang Muka Penjualan
            </label>
            <div className="p-inputgroup">
              <Dropdown
                value={currentItem !== null ? `${currentItem.cus_saldo}` : ""}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, cus_saldo: e.value })
                }
                placeholder="Pilih Kode Distribusi Uang Muka"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col-12">
            <label className="text-label">Limit Kredit</label>
            <div className="p-inputgroup">
              <InputNumber
                value={currentItem !== null ? `${currentItem.customer.cus_limit}` : ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    customer: { ...currentItem.customer, cus_limit: e.value },
                  })
                }
                placeholder="Masukan Limit Kredit"
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

export default PermintaanPembelian;
