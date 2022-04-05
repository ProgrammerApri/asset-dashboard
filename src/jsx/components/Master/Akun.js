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
import { SelectButton } from "primereact/selectbutton";
import { Checkbox } from "primereact/checkbox";

const data = {
  account: {
    acc_code: "",
    acc_name: "Iuran",
    kode_umum: 0,
    kode_kategori: 0,
    du: "U",
    kode_saldo: "",
    terhubung: "",
    saldo_awal: 0,
  },
  kategory: {
    id: 0,
    name: "",
    kode_klasi: 0,
    kode_saldo: "",
  },
  klasifikasi: {
    id: 0,
    klasiname: "",
  },
};

const saldoNormal = [
  { name: "Debit", code: "D" },
  { name: "Kredit", code: "K" },
];

const jenisAkun = [
  { name: "Detail", code: "D" },
  { name: "Umum", code: "U" },
];

const Akun = () => {
  const [account, setAkccount] = useState(null);
  const [kategori, setKategori] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [position, setPosition] = useState("center");
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [akunTerhub, setAkunTerhub] = useState(false);

  const dialogFuncMap = {
    displayData: setDisplayData,
  };

  useEffect(() => {
    getKategori();
    initFilters1();
  }, []);

  const getKategori = async () => {
    console.log("-------------------");
    // console.log(currentItem);
    setLoading(true);
    const config = {
      ...endpoints.kategori,
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
        setKategori(data);
      }
    } catch (error) {}
  };

  const getAccountUmum = async (data) => {
    const config = {
      ...endpoints.accountUmum,
      endpoint: endpoints.accountUmum.endpoint + data.account.id,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const data = response;
        setCurrentItem({
          ...currentItem,
          account: { ...currentItem.account, acc_code: data }
        });
      }
    } catch (error) {}
  };

  const getAccKodeUm = async (data) => {
    const config = {
      ...endpoints.getAccKodeUm,
      endpoint: endpoints.getAccKodeUm.endpoint + data.kategory.id,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const res = response.data;
        setCurrentItem({
          ...currentItem,
          account: { ...currentItem.account, acc_code: res },
          kategory: data.kategory,
          klasifikasi: data.klasifikasi,
        });
      }
    } catch (error) {}
  };

  // const editAccount = async () => {
  //   const config = {
  //     ...endpoints.editAccount,
  //     endpoint: endpoints.editAccount.endpoint + currentItem.account.id,
  //     data: {
  //       acc_name: currentItem.account.acc_name,
  //       kode_kategori: currentItem.kategory.id,
  //       acc_code: currentItem.account.acc_code,
  //       kode_umum: currentItem.account.kode_umum,
  //       du: currentItem.account.du,
  //       kode_saldo: currentItem.account.kode_saldo,
  //       terhubung: currentItem.account.terhubung,
  //       saldo_awal: currentItem.account.saldo_awal,
  //     },
  //   };
  //   console.log(config.data);
  //   let response = null;
  //   try {
  //     response = await request(null, config);
  //     console.log(response);
  //     if (response.status) {
  //       setTimeout(() => {
  //         setUpdate(false);
  //         dialogFuncMap["displayData"](false);
  //         getKategori(true);
  //         toast.current.show({
  //           severity: "info",
  //           summary: "Berhasil",
  //           detail: "Data berhasil diperbarui",
  //           life: 3000,
  //         });
  //       }, 500);
  //     }
  //   } catch (error) {
  //     setTimeout(() => {
  //       setUpdate(false);
  //       toast.current.show({
  //         severity: "error",
  //         summary: "Gagal",
  //         detail: "Gagal memperbarui data",
  //         life: 3000,
  //       });
  //     }, 500);
  //   }
  // };

  const addAccount = async () => {
    const config = {
      ...endpoints.addAccount,
      data: {
        acc_name: currentItem.account.acc_name,
        kode_kategori: currentItem.kategory.id,
        acc_code: currentItem.account.acc_code,
        kode_umum: currentItem.account.kode_umum,
        du: currentItem.account.du,
        kode_saldo: currentItem.account.kode_saldo,
        terhubung: currentItem.account.terhubung,
        saldo_awal: currentItem.account.saldo_awal,
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
          dialogFuncMap["displayData"](false);
          getKategori(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data berhasil diperbarui",
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
          detail: "Gagal memperbarui data",
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
          }}
          className="btn btn-primary shadow btn-xs sharp ml-2"
        >
          <i className="fa fa-pencil"></i>
        </Link>
      </div>
      // </React.Fragment>
    );
  };

  const onClick = (kode, kategori) => {
    dialogFuncMap[`${kode}`](true);
    setCurrentItem(kategori);

    if (position) {
      setPosition(position);
    }
  };

  const onHide = (kode) => {
    dialogFuncMap[`${kode}`](false);
  };

  const onSubmit = () => {
    setUpdate(true);
    addAccount();
  };

  const renderFooter = (kode) => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => onHide(kode)}
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

            onClick("displayData", data);
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

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>Akun</Card.Title>
            </Card.Header>
            <Card.Body>
              <DataTable
                responsive="scroll"
                value={account}
                className="display w-150 datatable-wrapper"
                showGridlines
                rows={10}
                dataKey=""
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "akun.name",
                  "kategory.name",
                  "akun.kode_akun",
                  "kategory.id",
                  "akun.jenis_akun",
                  "akun.saldo_normal",
                ]}
                emptyMessage="Tidak ada data"
              >
                <Column
                  field={(e) => e.account.id}
                  header="ID"
                  style={{
                    width: "10rem",
                    fontWeight: "bold",
                    color: "#727272",
                  }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Akun"
                  field={(e) => e.account.acc_name}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kategori"
                  field={(e) => e.account.kode_kategori}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Akun"
                  field={(e) => e.account.acc_code}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Akun Umum"
                  field={(e) => e.account.kode_umum}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Jenis Akun"
                  field={(e) => e.account.du}
                  style={{ minWidth: "10rem" }}
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
        header={isEdit ? "Edit Akun" : "Tambah Akun"}
        visible={displayData}
        style={{ width: "50vw" }}
        footer={renderFooter("displayData")}
        onHide={() => {
          setEdit(false);
          onHide("displayData");
        }}
      >
        <div className="col-12 mb-2">
          <label className="text-label">Kode Akun</label>
          <div className="p-inputgroup">
            <InputText
              value={
                currentItem !== null ? `${currentItem.account.acc_code}` : ""
              }
              onChange={(e) =>
                setCurrentItem({
                  ...currentItem,
                  account: { ...currentItem.account, acc_code: e.target.value },
                })
              }
              placeholder="Masukan Kode Akun"
              disabled
            />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Nama Akun</label>
          <div className="p-inputgroup">
            <InputText
              // value={currentItem !== null ? `${currentItem.account.acc_name}` : ""}
              // onChange={(e) =>
              //   setCurrentItem({
              //     ...currentItem,
              //     account: { ...currentItem.account, acc_name: e.target.value },
              //   })
              // }
              placeholder="Masukan Nama Akun"
            />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Kategori</label>
          <div className="p-inputgroup">
            <Dropdown
              value={
                currentItem !== null
                  ? {
                      kategory: currentItem.kategory,
                      klasifikasi: currentItem.klasifikasi,
                    }
                  : null
              }
              options={kategori}
              onChange={(e) => {
                console.log(e.value);
                getAccKodeUm(e.value);
              }}
              optionLabel="kategory.name"
              filter
              filterBy="kategory.name"
              placeholder="Pilih Kategori"
            />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Jenis Akun</label>
          <div className="p-inputgroup">
            <SelectButton
              value={
                currentItem !== null && currentItem.account.du !== ""
                  ? currentItem.account.du === "D"
                    ? { name: "Detail", code: "D" }
                    : { name: "Umum", code: "U" }
                  : null
              }
              options={jenisAkun}
              onChange={(e) => {
                console.log(e.value);
                setCurrentItem({
                  ...currentItem,
                  account: {
                    ...currentItem.account,
                    du: e.value.code,
                  },
                });
              }}
              optionLabel="name"
            />
          </div>
        </div>

        {currentItem !== null && currentItem.account.du !== "" ? (
          currentItem.account.du === "D" ? (
            <>
              <div className="col-12 mb-2">
                <label className="text-label">Akun Umum</label>
                <div className="p-inputgroup">
                <Dropdown
                  value={currentItem !== null ? currentItem.account : null}
                  options={account}
                  onChange={(e) => {
                    console.log(e.value);
                    getAccountUmum(e.value);
                    // setCurrentItem({
                    //   ...currentItem,
                    //   account: e.value,
                    // });
                  }}
                  optionLabel="account.acc_code"
                  filter
                  filterBy="account.acc_code"
                  placeholder="Pilih Kode Umum"
            />
                </div>
              </div>
            </>
          ) : null
        ) : null}

        <div className="col-12 mb-2">
          <label className="text-label">Saldo Normal</label>
          <div className="p-inputgroup">
            <SelectButton
              value={
                currentItem !== null && currentItem.kategory.kode_saldo !== ""
                  ? currentItem.kategory.kode_saldo === "D"
                    ? { name: "Debit", code: "D" }
                    : { name: "Kredit", code: "K" }
                  : null
              }
              options={saldoNormal}
              onChange={(e) => {
                console.log(e.value);
                setCurrentItem({
                  ...currentItem,
                  account: {
                    ...currentItem.account,
                    kode_saldo: e.value.code,
                  },
                });
              }}
              optionLabel="name"
            />
          </div>
        </div>

        <div className="col-12 mb-2">
          <Checkbox
            className="mb-2"
            inputId="binary"
            checked={akunTerhub}
            onChange={(e) => setAkunTerhub(e.checked)}
          />
          <label className="ml-3" htmlFor="binary">
            {"Akun Terhubung"}
          </label>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Saldo Awal</label>
          <div className="p-inputgroup">
            <InputText
              //   value={currentItem !== null ? `${currentItem.kategory.name}` : ""}
              //   onChange={(e) =>
              //     setCurrentItem({
              //       ...currentItem,
              //       kategory: { ...currentItem.kategory, name: e.target.value },
              //     })
              //   }
              placeholder="Masukan Saldo Awal"
              disabled
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Akun;
