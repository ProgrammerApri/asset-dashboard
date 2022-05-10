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
import { Divider } from "@material-ui/core";
import { TabPanel, TabView } from "primereact/tabview";

const data = {
  groupPro: {
    id: null,
    code: null,
    name: null,
    div_code: null,
    acc_sto: null,
    acc_send: null,
    acc_terima: null,
    hrg_pokok: null,
    acc_penj: null,
    potongan: null,
    pengembalian: null,
    selisih: null,
  },

  divisi: {
    id: null,
    code: null,
    name: null,
    desc: null,
  },
};

const GroupProduk = () => {
  const [groupPro, setGroup] = useState(null);
  const [divisi, setDivisi] = useState(null);
  const [setup, setSetup] = useState(null);
  const [account, setAccount] = useState(null);
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
    getGroupProduk();
    getDivisi();
    getSetup();
    getAccount();
    initFilters1();
  }, []);

  const getGroupProduk = async (isUpdate = false) => {
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
        console.log(data);
        setGroup(data);
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

  const getDivisi = async () => {
    const config = {
      ...endpoints.divisi,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setDivisi(data);
      }
    } catch (error) {}
  };

  const getSetup = async (isUpdate = false) => {
    const config = {
      ...endpoints.getSetup,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSetup(data);
      }
    } catch (error) {}
  };

  const getAccount = async (isUpdate = false) => {
    const config = {
      ...endpoints.account,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setAccount(data);
      }
    } catch (error) {}
  };

  const editGroupProduk = async () => {
    const config = {
      ...endpoints.editGroupPro,
      endpoint: endpoints.editGroupPro.endpoint + currentItem.groupPro.id,
      data: {
        code: currentItem.groupPro.code,
        name: currentItem.groupPro.name,
        div_code: currentItem.divisi.id,
        acc_sto: currentItem.groupPro.acc_sto,
        acc_send: currentItem.groupPro.acc_send,
        acc_terima: currentItem.groupPro.acc_terima,
        hrg_pokok: currentItem.groupPro.hrg_pokok,
        acc_penj: currentItem.groupPro.acc_penj,
        potongan: currentItem.groupPro.potongan,
        pengembalian: currentItem.groupPro.pengembalian,
        selisih: currentItem.groupPro.selisih,
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
          getGroupProduk(true);
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

  const addGroupProduk = async () => {
    const config = {
      ...endpoints.addGroupPro,
      data: {
        code: currentItem.groupPro.code,
        name: currentItem.groupPro.name,
        div_code: currentItem.divisi.id,
        acc_sto: currentItem.groupPro.acc_sto,
        acc_send: currentItem.groupPro.acc_send,
        acc_terima: currentItem.groupPro.acc_terima,
        hrg_pokok: currentItem.groupPro.hrg_pokok,
        acc_penj: currentItem.groupPro.acc_penj,
        potongan: currentItem.groupPro.potongan,
        pengembalian: currentItem.groupPro.pengembalian,
        selisih: currentItem.groupPro.selisih,
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
          getGroupProduk(true);
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
            detail: `Kode ${currentItem.groupPro.code} Sudah Digunakan`,
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

  const delGroupProduk = async (id) => {
    const config = {
      ...endpoints.delGroupPro,
      endpoint: endpoints.delGroupPro.endpoint + currentItem.groupPro.id,
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
          getGroupProduk(true);
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

    if (position) {
      setPosition(position);
    }
  };

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editGroupProduk();
      setActive(0);
    } else {
      setUpdate(true);
      addGroupProduk();
      setActive(0);
    }
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
            delGroupProduk();
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
              groupPro: {
                ...data.groupPro,
                acc_sto: setup.sto.id,
                acc_send: setup.pur_shipping.id,
                acc_terima: setup.ap.id,
                hrg_pokok: setup.pur_cogs.id,
                acc_penj: setup.sls_rev.id,
                potongan: setup.sls_disc.id,
                pengembalian: setup.sls_shipping.id,
                selisih: setup.sto_hpp_diff.id,
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

  const gl = (value) => {
    let gl = {};
    account.forEach((element) => {
      if (value === element.account.id) {
        gl = element;
      }
    });
    return gl;
  };


  const glTemplate = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.account.acc_name} - (${option.account.acc_code})`
          : ""}
      </div>
    );
  };

  const clear = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.account.acc_name} - (${option.account.acc_code})`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
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
                value={loading ? dummy : groupPro}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "groupProduk.code",
                  "groupProduk.name",
                  "groupProduk.div_code",
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
                  header="Kode Kelompok"
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => e.groupPro.code}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Kelompok"
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => e.groupPro.name}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Divisi"
                  field={(e) => e.divisi.name}
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
        header={isEdit ? "Edit Data Group Produk" : "Tambah Data Group Produk"}
        visible={displayData}
        style={{ width: "50vw" }}
        footer={renderFooter()}
        onHide={() => {
          setEdit(false);
          setDisplayData(false);
        }}
      >
        <TabView activeIndex={active} onTabChange={(e) => setActive(e.index)}>
          <TabPanel header="Informasi Produk" headerTemplate={renderTabHeader}>
            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Kode Kelompok</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.groupPro?.code ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        groupPro: {
                          ...currentItem.groupPro,
                          code: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukan Kode Kelompok"
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Nama Kelompok</label>
                <div className="p-inputgroup">
                  <InputText
                    value={`${currentItem?.groupPro?.name ?? ""}`}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        groupPro: {
                          ...currentItem.groupPro,
                          name: e.target.value,
                        },
                      })
                    }
                    placeholder="Masukan Nama Kelompok"
                  />
                </div>
              </div>
            </div>
            <div className="row mr-0 ml-0">
              <div className="col-12">
                <label className="text-label">Divisi</label>
                <div className="p-inputgroup">
                  <Dropdown
                    value={currentItem !== null ? currentItem.divisi : null}
                    options={divisi}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        divisi: e.target.value,
                      });
                    }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    placeholder="Pilih Divisi"
                  />
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel
            header="Distribusi GL Kontrol Stock"
            headerTemplate={renderTabHeader}
          >
            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Akun Persediaan</label>
                <div className="p-inputgroup">
                <Dropdown
                    value={
                      currentItem !== null &&
                      currentItem.groupPro.acc_sto!== null
                        ? gl(currentItem.groupPro.acc_sto)
                        : null
                    }
                    options={account}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        groupPro: {
                          ...currentItem.groupPro,
                          acc_sto: e.value?.account?.id ?? null,
                        },
                      });
                    }}
                    optionLabel="account.acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="account.acc_name"
                    placeholder="Pilih Akun Persediaan"
                    showClear
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Akun Pengiriman Barang</label>
                <div className="p-inputgroup">
                <Dropdown
                    value={
                      currentItem !== null &&
                      currentItem.groupPro.acc_send!== null
                        ? gl(currentItem.groupPro.acc_send)
                        : null
                    }
                    options={account}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        groupPro: {
                          ...currentItem.groupPro,
                          acc_send: e.value?.account?.id ?? null,
                        },
                      });
                    }}
                    optionLabel="account.acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="account.acc_name"
                    placeholder="Pilih Akun Pengiriman"
                    showClear
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-12">
                <label className="text-label">Akun Penerimaan Barang</label>
                <div className="p-inputgroup">
                <Dropdown
                    value={
                      currentItem !== null &&
                      currentItem.groupPro.acc_terima!== null
                        ? gl(currentItem.groupPro.acc_terima)
                        : null
                    }
                    options={account}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        groupPro: {
                          ...currentItem.groupPro,
                          acc_terima: e.value?.account?.id ?? null,
                        },
                      });
                    }}
                    optionLabel="account.acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="account.acc_name"
                    placeholder="Pilih Akun Penerimaan"
                    showClear
                  />
                </div>
              </div>
            </div>

            <h4 className="mt-4">
              <b>Akun Penjualan</b>
            </h4>
            <Divider className="mb-2"></Divider>

            <div className="row mr-0 ml-0">
              <div className="col-6">
                <label className="text-label">Harga Pokok Penjualan</label>
                <div className="p-inputgroup">
                <Dropdown
                    value={
                      currentItem !== null &&
                      currentItem.groupPro.hrg_pokok!== null
                        ? gl(currentItem.groupPro.hrg_pokok)
                        : null
                    }
                    options={account}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        groupPro: {
                          ...currentItem.groupPro,
                          hrg_pokok: e.value?.account?.id ?? null,
                        },
                      });
                    }}
                    optionLabel="account.acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="account.acc_name"
                    placeholder="Pilih Harga Pokok Penjualan"
                    showClear
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Penjualan</label>
                <div className="p-inputgroup">
                <Dropdown
                    value={
                      currentItem !== null &&
                      currentItem.groupPro.acc_penj!== null
                        ? gl(currentItem.groupPro.acc_penj)
                        : null
                    }
                    options={setup}
                    onChange={(e) => {
                      console.log(e.account);
                      setCurrentItem({
                        ...currentItem,
                        groupPro: {
                          ...currentItem.groupPro,
                          acc_penj: e.value?.account?.id ?? null,
                        },
                      });
                    }}
                    optionLabel="account.acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="account.acc_name"
                    placeholder="Pilih Akun Penjualan"
                    showClear
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0 mt-2">
              <div className="col-6">
                <label className="text-label">Potongan Penjualan</label>
                <div className="p-inputgroup">
                <Dropdown
                    value={
                      currentItem !== null &&
                      currentItem.groupPro.potongan!== null
                        ? gl(currentItem.groupPro.potongan)
                        : null
                    }
                    options={account}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        groupPro: {
                          ...currentItem.groupPro,
                          potongan: e.value?.account?.id ?? null,
                        },
                      });
                    }}
                    optionLabel="account.acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="account.acc_name"
                    placeholder="Pilih Akun Potongan Penjualan"
                    showClear
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="text-label">Pengembalian Penjualan</label>
                <div className="p-inputgroup">
                <Dropdown
                    value={
                      currentItem !== null &&
                      currentItem.groupPro.pengembalian!== null
                        ? gl(currentItem.groupPro.pengembalian)
                        : null
                    }
                    options={account}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        groupPro: {
                          ...currentItem.groupPro,
                          pengembalian: e.value?.account?.id ?? null,
                        },
                      });
                    }}
                    optionLabel="account.acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="account.acc_name"
                    placeholder="Pilih Akun Pengembalian"
                    showClear
                  />
                </div>
              </div>
            </div>

            <div className="row mr-0 ml-0">
              <div className="col-12">
                <label className="text-label">Selisih Harga Pokok</label>
                <div className="p-inputgroup">
                <Dropdown
                    value={
                      currentItem !== null &&
                      currentItem.groupPro.selisih!== null
                        ? gl(currentItem.groupPro.selisih)
                        : null
                    }
                    options={account}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        groupPro: {
                          ...currentItem.groupPro,
                          selisih: e.value?.account?.id ?? null,
                        },
                      });
                    }}
                    optionLabel="account.acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="account.acc_name"
                    placeholder="Pilih Akun Selisih Harga Pokok"
                    showClear
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

export default GroupProduk;
