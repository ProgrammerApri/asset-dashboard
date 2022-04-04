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
import { SelectButton } from 'primereact/selectbutton';
import { Checkbox } from 'primereact/checkbox';


const data = {
  akun: {
    id: 1,
    name_akun: "",
    kategori: "",
    kode_akun: 0,
    akun_umum: 0,
    jenis_akun: "",
    saldo: "",
    saldo_awal: "",
  },

  kategory: {
    id: 1,
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
  const [klasifikasi, setKlasifikasi] = useState(null);
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

  const getKlasifikasi = async () => {
    console.log("-------------------");
    // console.log(currentItem);
    setLoading(true);
    const config = {
      ...endpoints.klasifikasi,
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
        setKlasifikasi(data);
      }
    } catch (error) {}
    getKategori();
  };

  const getKategori= async () => {
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
    getKategori();
  };

  const editKategori = async () => {
    const config = {
      ...endpoints.editKateg,
      endpoint: endpoints.editKateg.endpoint + currentItem.kategory.id,
      data: {
        name: currentItem.kategory.name,
        kode_klasi: currentItem.klasifikasi.id,
        kode_saldo: currentItem.kategory.kode_saldo,
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

  const addAkun = async () => {
    const config = {
      ...endpoints.addAkun,
      data: {
        name: currentItem.akun.name,
        kode_klasi: currentItem.klasifikasi.id,
        kode_saldo: currentItem.kategory.kode_saldo,
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
    if (isEdit) {
      setUpdate(true);
      editKategori();
    } else {
      setUpdate(true);
      addAkun();
    }
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
                value={kategori}
                className="display w-100 datatable-wrapper"
                showGridlines
                rows={10}
                dataKey="kategory.id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "kategory.name",
                  "klasifikasi.klasiname",
                  "kategory.kode_saldo",
                ]}
                emptyMessage="Tidak ada data kategori"
              >
                <Column
                  field={(e) => e.kategory.id}
                  header="Kode"
                  style={{
                    width: "10rem",
                    fontWeight: "bold",
                    color: "#727272",
                  }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Kategori Akun"
                  field={(e) => e.kategory.name}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Klasifikasi Akun"
                  field={(e) => e.klasifikasi.klasiname}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Saldo Normal"
                  field={(e) => e.kategory.kode_saldo}
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
          <label className="text-label">Nama Akun</label>
          <div className="p-inputgroup">
            <InputText
              value={currentItem !== null ? `${currentItem.akun.name}` : ""}
              onChange={(e) =>
                setCurrentItem({
                  ...currentItem,
                  akun: { ...currentItem.akun, name: e.target.value },
                })
              }
              placeholder="Masukan Nama Akun"
            />
          </div>
        </div>
        
        <div className="col-12 mb-2">
          <label className="text-label">Kategori</label>
          <div className="p-inputgroup">
            <Dropdown
              value={currentItem !== null ? currentItem.kategory : null}
              options={kategori}
              onChange={(e) => {
                console.log(e.value);
                setCurrentItem({
                  ...currentItem,
                  kategory: e.value,
                });
              }}
              optionLabel="name"
              filter
              filterBy="name"
              placeholder="Pilih Kategori"
            />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Kode Akun</label>
          <div className="p-inputgroup">
            <Dropdown
              value={
                currentItem !== null && currentItem.kategory.id !== ""
                  ? currentItem.kategory.id : null
              }
              options={kategori}
              onChange={(e) => {
                console.log(e.value);
                setCurrentItem({
                  ...currentItem,
                  kategory: {
                    ...currentItem.kategory,
                    id: e.value,
                  },
                });
              }}
              optionLabel="id"
              placeholder="Pilih Kode Akun"
              disabled
            />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Akun Umum</label>
          <div className="p-inputgroup">
            <Dropdown
              value={
                currentItem !== null && currentItem.kategory.kode_saldo !== ""
                  ? currentItem.kategory.kode_saldo : null
              }
            //   options={}
              onChange={(e) => {
                console.log(e.value);
                setCurrentItem({
                  ...currentItem,
                  kategory: {
                    ...currentItem.kategory,
                    kode_saldo: e.value.code,
                  },
                });
              }}
              optionLabel="name"
              placeholder="Pilih Akun Umum"
            />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Jenis Akun</label>
          <div className="p-inputgroup">
            <SelectButton
              value={
                currentItem !== null && currentItem.akun.jenis_akun !== ""
                  ? currentItem.akun.jenis_akun === "D"
                    ? { name: "Detail", code: "D" }
                    : { name: "Umum", code: "U" }
                  : null
              }
              options={jenisAkun}
              onChange={(e) => {
                console.log(e.value);
                setCurrentItem({
                  ...currentItem,
                  akun: {
                    ...currentItem.akun,
                    jenis_akun: e.value.code,
                  },
                });
              }}
              optionLabel="name"
            />
          </div>
        </div>


        <div className="col-12 mb-2">
          <label className="text-label">Saldo Normal</label>
          <div className="p-inputgroup">
            <SelectButton
              value={
                currentItem !== null && currentItem.akun.saldo !== ""
                  ? currentItem.akun.saldo === "D"
                    ? { name: "Debit", code: "D" }
                    : { name: "Kredit", code: "K" }
                  : null
              }
              options={saldoNormal}
              onChange={(e) => {
                console.log(e.value);
                setCurrentItem({
                  ...currentItem,
                  akun: {
                    ...currentItem.akun,
                    saldo: e.value.code,
                  },
                });
              }}
              optionLabel="name"
            />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Akun Terhubung</label>
          <Checkbox className="ml-8 mb-2" inputId="binary" checked={akunTerhub} onChange={e => setAkunTerhub(e.checked)} />
            <label className="ml-3" htmlFor="binary">{akunTerhub ? 'True' : 'False'}</label>

            {/* <Checkbox
              value={
                currentItem !== null && currentItem.kategory.kode_saldo !== ""
                  ? currentItem.kategory.kode_saldo === "D"
                    ? { name: "Detail", code: "D" }
                    : { name: "Umum", code: "U" }
                  : null
              }
              options={jenisAkun}
              onChange={(e) => {
                // console.log(e.value);
                // setCurrentItem({
                //   ...currentItem,
                //   kategory: {
                //     ...currentItem.kategory,
                //     kode_saldo: e.value.code,
                //   },
                // });
              }}
              optionLabel="name"
            /> */}
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
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Akun;
