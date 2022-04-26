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
import { InputSwitch } from "primereact/inputswitch";
import { Divider } from "@material-ui/core";
import { Badge } from "react-bootstrap";

const data = {
  id: 0,
  code: null,
  name: null,
  type: "d",
  desc: null,
  active: true,
  qty: 1,
  u_from: null,
  u_to: null,
};

const addKonversi = [];

const DataSatuan = () => {
  const [satuan, setSatuan] = useState(null);
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
  const [konversi, setKonversi] = useState([{ qty: 0, unit: null }]);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getSatuan();
    initFilters1();
  }, []);

  const getSatuan = async (isUpdate = false) => {
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
        setSatuan(data);
      }
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const editSatuan = async () => {
    const config = {
      ...endpoints.updateSatuan,
      endpoint: endpoints.updateSatuan.endpoint + currentItem.id,
      data: currentItem,
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
          getSatuan(true);
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

  const addSatuan = async () => {
    const config = {
      ...endpoints.addSatuan,
      data: currentItem,
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
          getSatuan(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Ditambahkan",
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
            detail: `Kode Project ${currentItem.proj_code} Sudah Digunakan`,
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

  const delSatuan = async (id) => {
    const config = {
      ...endpoints.deleteSatuan,
      endpoint: endpoints.deleteSatuan.endpoint + currentItem.id,
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
          getSatuan(true);
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
            data = {
              ...data,
              u_from: data.u_from && data.u_from.id,
              u_to: data.u_to && data.u_to.id,
            };
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
      editSatuan();
    } else {
      setUpdate(true);
      addSatuan();
    }
  };

  const renderFooter = () => {
    return (
      <div className="mt-3">
        <PButton
          label="Batal"
          onClick={() => {
            setDisplayData(false);
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
            delSatuan();
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
            setActive(0);
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

  const checkUnit = (value) => {
    let selected = {};
    satuan.forEach((el) => {
      if (value === el.id) {
        selected = el;
      }
    });

    return selected;
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : satuan}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "satuan.code",
                  "satuan.name",
                  "satuan.status",
                  "satuan.ket",
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
                  header="Kode Satuan"
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => e.code}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Satuan"
                  field={(e) => e.name}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Status Satuan"
                  style={{ minWidth: "8rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : e.type == "d" ? (
                      <Badge variant="warning light">
                        {" "}Dasar
                      </Badge>
                    ) : (
                      <Badge variant="info light">
                        {" "}Konversi
                      </Badge>
                    )
                  }
                />
                <Column
                  header="Keterangan"
                  field={(e) => e?.desc ?? "-"}
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
        header={isEdit ? "Edit Satuan" : "Tambah Satuan"}
        visible={displayData}
        style={{ width: "40vw" }}
        footer={renderFooter()}
        onHide={() => {
          setEdit(false);
          setDisplayData(false);
        }}
      >
        <div className="row mr-0 ml-0">
          <div className="col-6">
            <label className="text-label">Kode Satuan</label>
            <div className="p-inputgroup">
              <InputText
                value={currentItem !== null ? currentItem.code : ""}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, code: e.target.value })
                }
                placeholder="Masukan Kode Satuan"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Nama Satuan</label>
            <div className="p-inputgroup">
              <InputText
                value={currentItem !== null ? currentItem.name : ""}
                onChange={(e) => {
                  setCurrentItem({ ...currentItem, name: e.target.value });
                }}
                placeholder="Masukan Nama Satuan"
              />
            </div>
          </div>
        </div>

        <div className="col-12">
          <label className="text-label">Keterangan</label>
          <div className="p-inputgroup">
            <InputTextarea
              value={currentItem !== null ? currentItem.desc : ""}
              onChange={(e) => {
                setCurrentItem({ ...currentItem, desc: e.target.value });
              }}
              placeholder="Masukan Keterangan"
            />
          </div>
        </div>

        <div className="d-flex col-12 align-items-center">
          <InputSwitch
            className="mr-3"
            inputId="email"
            checked={currentItem && currentItem.active}
            onChange={(e) => {
              setCurrentItem({ ...currentItem, active: e.value });
            }}
          />
          <label className="mr-3 mt-1" htmlFor="email">
            {"Aktif"}
          </label>
        </div>
        <div className="d-flex col-12 align-items-center">
          <InputSwitch
            className="mr-3"
            inputId="email"
            checked={currentItem && currentItem.type == "d"}
            onChange={(e) => {
              setCurrentItem({
                ...currentItem,
                type: e.value ? "d" : "k",
              });
            }}
          />
          <label className="mr-3 mt-1" htmlFor="email">
            {"Satuan Dasar"}
          </label>
        </div>

        {currentItem && currentItem.type == "k" && (
          <>
            <h4 className="mt-4 ml-3 mr-3">
              <b>Konversi Satuan</b>
            </h4>
            <Divider className="mb-2 ml-3 mr-3"></Divider>

            <div className="row ml-0 mr-0">
              <div className="col-3">
                <label className="text-label">Nilai/Kuantiti</label>
                <div className="p-inputgroup">
                  <InputNumber
                    value={currentItem && currentItem.qty}
                    onChange={(e) => {
                      setCurrentItem({ ...currentItem, qty: e.value });
                    }}
                    placeholder="Masukan Nilai"
                    showButtons
                  />
                </div>
              </div>

              <div className="col-4">
                <label className="text-label"> </label>
                <div className="p-inputgroup mt-2">
                  <Dropdown
                    value={currentItem && checkUnit(currentItem.u_to)}
                    options={satuan}
                    onChange={(e) => {
                      setCurrentItem({ ...currentItem, u_to: e.value.id });
                    }}
                    placeholder="Pilih Satuan"
                    optionLabel="name"
                    filter
                    filterBy="name"
                  />
                </div>
              </div>
              <div
                className="col-1 mt-4"
                style={{ fontSize: "1rem", paddingTop: "1.5rem" }}
              >
                {" "}
                /
              </div>
              <div className="col-4">
                <label className="text-label"> </label>
                <div className="p-inputgroup mt-2">
                  <Dropdown
                    value={currentItem && checkUnit(currentItem.u_from)}
                    options={satuan}
                    onChange={(e) => {
                      setCurrentItem({ ...currentItem, u_from: e.value.id });
                    }}
                    placeholder="Pilih Satuan"
                    optionLabel="name"
                    filter
                    filterBy="name"
                  />
                </div>
              </div>
            </div>
          </>
        )}
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

export default DataSatuan;
