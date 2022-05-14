import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "react-bootstrap";
import { Row, Col, Card, Badge } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { SelectButton } from "primereact/selectbutton";
import { MultiSelect } from "primereact/multiselect";

const data = {
  id: null,
  type: null,
  name: null,
  nilai: null,
  cutting: null,
  acc_sls_fax: null,
  acc_pur_fax: null,
  combined: null,
};

const type = [
  { name: "Tunggal", code: "T" },
  { name: "Ganda", code: "G" },
];

const Pajak = () => {
  const [pajak, setPajak] = useState(null);
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

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getPajak();
    getAccount();
    initFilters1();
  }, []);

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

  const getAccount = async () => {
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
          if (elem.account.kat_code === 5) {
            filt.push(elem.account);
          }
        });
        console.log(data);
        setAccount(filt);
      }
    } catch (error) {}
  };

  const editPajak = async () => {
    const config = {
      ...endpoints.editPajak,
      endpoint: endpoints.editPajak.endpoint + currentItem.id,
      data: {
        type: currentItem.type,
        name: currentItem.name,
        nilai: currentItem.nilai,
        cutting: currentItem.cutting,
        acc_sls_fax: currentItem.account.id,
        acc_pur_fax: currentItem.account.id,
        combined: currentItem.combined,
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
          getPajak(true);
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

  const addPajak = async () => {
    const config = {
      ...endpoints.addPajak,
      data: {
        type: currentItem.type,
        name: currentItem.name,
        nilai: currentItem.nilai,
        cutting: currentItem.cutting,
        acc_sls_fax: currentItem.id,
        acc_pur_fax: currentItem.id,
        combined: currentItem.combined,
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
          getPajak(true);
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
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Gagal Memperbarui Data",
            life: 3000,
          });
        }, 500);
      
    }
  };

  const delPajak = async (id) => {
    const config = {
      ...endpoints.delPajak,
      endpoint: endpoints.delPajak.endpoint + currentItem.id,
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
          getPajak(true);
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
      editPajak();
    } else {
      setUpdate(true);
      addPajak();
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
            delPajak();
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

  const acc = (value) => {
    let acc = {};
    account.forEach((element) => {
      if (value === element.id) {
        acc = element;
      }
    });
    return acc;
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

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : pajak}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={["name", "nilai"]}
                emptyMessage="Tidak ada data"
                paginator
                paginatorTemplate={template2}
                first={first2}
                rows={rows2}
                onPage={onCustomPage2}
                paginatorClassName="justify-content-end mt-3"
              >
                <Column
                  header="Nama"
                  field={(e) => e?.name ?? ""}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nilai (%)"
                  field={(e) => e?.nilai ?? ""}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Tipe Pajak"
                  field={(e) => e?.type ?? ""}
                  style={{ minWidth: "8rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div>
                        {e.type === "T" ? (
                          <Badge variant="success light">
                            <i className="bx bxs-circle text-success mr-1"></i>{" "}
                            Tunggal
                          </Badge>
                        ) : (
                          <Badge variant="info light">
                            <i className="bx bxs-circle text-info mr-1"></i>{" "}
                            Ganda
                          </Badge>
                        )}
                      </div>
                    )
                  }
                />
                <Column
                  header="Potongan"
                  field={(e) => e?.cutting ?? ""}
                  style={{ minWidth: "8rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div>
                        {e.cutting === false ? (
                          <Badge variant="danger light">
                            <i className="bx bxs-circle text-danger mr-1"></i>{" "}
                            Tidak Ada Potongan
                          </Badge>
                        ) : (
                          <Badge variant="info light">
                            <i className="bx bxs-circle text-info mr-1"></i>{" "}
                            Potongan
                          </Badge>
                        )}
                      </div>
                    )
                  }
                />
                <Column
                  header="Gabungan Dari"
                  field={(e) => e?.combined ?? ""}
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
        header={isEdit ? "Edit Data Pajak" : "Tambah Data Pajak"}
        visible={displayData}
        style={{ width: "40vw" }}
        footer={renderFooter("displayData")}
        onHide={() => {
          setEdit(false);
          setDisplayData(false);
        }}
      >
        <div className="col-12 mb-2">
          <label className="text-label">Pajak</label>
          <div className="p-inputgroup">
            <SelectButton
              value={
                currentItem !== null && currentItem.type !== ""
                  ? currentItem.type === "T"
                    ? { name: "Tunggal", code: "T" }
                    : { name: "Ganda", code: "G" }
                  : null
              }
              options={type}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, type: e.value.code })
              }
              optionLabel="name"
            />
          </div>
        </div>

        {currentItem !== null && currentItem.type === "T" ? (
          // currentItem.type === "T" ? (
            <>
              <div className="row ml-0 mt-0">
                <div className="col-6">
                  <label className="text-label">Nama Pajak</label>
                  <div className="p-inputgroup">
                    <InputText
                      value={currentItem !== null ? `${currentItem?.name ?? ""}` : ""}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, name: e.target.value })
                      }
                      placeholder="Masukan Nama Pajak"
                    />
                  </div>
                </div>

                <div className="col-5">
                  <label className="text-label">Nilai</label>
                  <div className="p-inputgroup">
                    <InputNumber
                      value={currentItem !== null ? `${currentItem?.nilai ?? ""}` : ""}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, nilai: e.value })
                      }
                      placeholder="Masukan Nilai"
                    />
                    <span className="fs-14 text-black font-w600 ml-2 mt-3">
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="row ml-0 mt-0">
                <div className="col-12 mb-2">
                  <label className="mt-2" htmlFor="binary">
                    {"Pemotongan"}
                  </label>
                  <Checkbox
                    className="mt-0 ml-5"
                    inputId="binary"
                    checked={currentItem ? currentItem.cutting : false}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, cutting: e.checked
                      })
                    }
                  />
                </div>
              </div>

              <div className="row ml-0 mt-0">
                <div className="col-6">
                  <label className="text-label">Akun Pajak Pembelian</label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={
                        currentItem !== null &&
                        currentItem.acc_sls_fax !== null
                          ? acc(currentItem.acc_sls_fax)
                          : null
                      }
                      options={account}
                      onChange={(e) => {
                        console.log(e.value);
                        setCurrentItem({
                            ...currentItem,
                            acc_sls_fax: e.target?.value?.id ?? null,
                        });
                      }}
                      optionLabel="account.acc_name"
                      valueTemplate={clear}
                      itemTemplate={glTemplate}
                      filter
                      filterBy="account.acc_name"
                      placeholder="Pilih Ppn Masukan"
                    />
                  </div>
                </div>

                <div className="col-6">
                  <label className="text-label">Akun Pajak Penjualan</label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={
                        currentItem !== null &&
                        currentItem.acc_pur_fax !== null
                          ? acc(currentItem.acc_pur_fax)
                          : null
                      }
                      options={account}
                      onChange={(e) => {
                        console.log(e.value);
                        setCurrentItem({
                            ...currentItem,
                            acc_pur_fax: e.target?.value?.id ?? null,
                        });
                      }}
                      optionLabel="account.acc_name"
                      valueTemplate={clear}
                      itemTemplate={glTemplate}
                      filter
                      filterBy="account.acc_name"
                      placeholder="Pilih Ppn Keluaran"
                    />
                  </div>
                </div>
              </div>
            </>
          // ) : null
        ) : null}

        {currentItem !== null && currentItem.type === "G" ? (
          // currentItem.type === "G" ? (
            <>
              <div className="row ml-0 mt-0">
                <div className="col-6">
                  <label className="text-label">Nama Pajak</label>
                  <div className="p-inputgroup">
                    <InputText
                      value={currentItem !== null ? `${currentItem?.name ?? ""}` : ""}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, name: e.target.value })
                      }
                      placeholder="Masukan Nama Pajak"
                    />
                  </div>
                </div>

                <div className="col-6">
                  <label className="text-label">Penggabungan Dari</label>
                  <div className="p-inputgroup">
                    <MultiSelect
                    className="p-invalid"
                      value={currentItem !== null ? currentItem.pajak : null}
                      options={pajak}
                      onChange={(e) => {
                        console.log(e.value);
                        setCurrentItem({
                          ...currentItem,
                          pajak: e.value,
                        });
                      }}
                      optionLabel="name"
                      filter
                      filterBy="name"
                      placeholder="Pilih Ppn"
                    />
                  </div>
                </div>
              </div>

              <div className="row ml-0 mt-0">
                <div className="col-12 mb-2">
                  <label className="text-label">Detail :</label>
                </div>
              </div>
            </>
          // ) : null
        ) : null}

        {/* <div className="row ml-0 mt-0">
           <label className="text-label ml-2">Pajak</label>
          <div className="col-12 field-radiobutton">
            <RadioButton
            className="mb-0"
              inputId="binary"
              // checked={currentItem ? currentItem.pajak.pemotongan : false}
              onChange={(e) =>
                setCurrentItem({
                  // ...currentItem,
                  // pajak: { ...currentItem.pajak, pemotongan: e.checked },
                })
              }
            />
            <label className="ml-2 mt-2">Tunggal</label>

            <RadioButton
            className="mb-0 ml-8"
              inputId="binary"
              // checked={currentItem ? currentItem.pajak.pemotongan : false}
              onChange={(e) =>
                setCurrentItem({
                  // ...currentItem,
                  // pajak: { ...currentItem.pajak, pemotongan: e.checked },
                })
              }
            />
            <label className="ml-2 mt-2">Ganda</label>
          </div>
        </div> */}
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

export default Pajak;
