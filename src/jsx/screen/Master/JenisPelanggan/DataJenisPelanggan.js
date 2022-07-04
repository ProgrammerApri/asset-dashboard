import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Col, Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";

const def = {
  id: 0,
  jpel_code: "",
  jpel_name: "",
  jpel_ket: "",
};

const defError = {
  code: false,
  name: false,
};

const DataJenisPelanggan = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
}) => {
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [currentItem, setCurrentItem] = useState(def);
  const [isEdit, setEdit] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [error, setError] = useState(defError);

  useEffect(() => {
    initFilters1();
  }, []);

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
        <PrimeSingleButton
          label="Tambah"
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            setShowInput(true);
            setEdit(false);
            setLoading(false);
            setCurrentItem(def);
            onInput(true);
          }}
        />
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

  const editJenisPel = async () => {
    setLoading(true);
    const config = {
      ...endpoints.editJenisPel,
      endpoint: endpoints.editJenisPel.endpoint + currentItem.id,
      data: {
        jpel_code: currentItem.jpel_code,
        jpel_name: currentItem.jpel_name,
        jpel_ket: currentItem.jpel_ket,
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

  const addJenisPel = async () => {
    setLoading(true);
    const config = {
      ...endpoints.addJenisPel,
      data: {
        jpel_code: currentItem.jpel_code,
        jpel_name: currentItem.jpel_name,
        jpel_ket: currentItem.jpel_ket,
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
            detail: `Kode ${currentItem.jpel_code} Sudah Digunakan`,
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

  const delJenisPel = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delJenisPel,
      endpoint: endpoints.delJenisPel.endpoint + currentItem.id,
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
            detail: "Data Berhasil Diperbarui",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setLoading(false);
        setShowDelete(false);
        onSuccessInput();
        onInput(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: `Tidak Dapat Menghapus Project`,
          life: 3000,
        });
      }, 500);
    }
  };

  const renderFooter = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => {
            onHideInput();
            onInput(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Simpan"
          icon="pi pi-check"
          onClick={() => {
            if (isValid()) {
              if (isEdit) {
                editJenisPel();
                setLoading(true);
              } else {
                addJenisPel();
                setLoading(true);
              }
            }
          }}
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
            delJenisPel();
          }}
          autoFocus
          loading={loading}
        />
      </div>
    );
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
            onInput(true);
          }}
          className="btn btn-danger shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-trash"></i>
        </Link>
      </div>
      // </React.Fragment>
    );
  };

  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
  };

  const renderBody = () => {
    return (
      <>
        <Toast ref={toast} />
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
            "jenisPel.jpel_code",
            "jenisPel.jpel_name",
            "jenisPel.jpel_ket",
          ]}
          emptyMessage="Tidak ada data"
          paginator
          paginatorTemplate={template2}
          first={first2}
          rows={rows2}
          onPage={onCustomPage2}
          paginatorClassName="justify-content-end mt-3"
          selectionMode="single"
          // selection={selectedProduct3}
          onRowSelect={onRowSelect}
        >
          <Column
            header="Kode"
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e.jpel_code}
            body={load && <Skeleton />}
          />
          <Column
            header="Nama"
            field={(e) => e.jpel_name}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Keterangan"
            field={(e) => (e.jpel_ket !== "" ? e.jpel_ket : "-")}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Action"
            dataType="boolean"
            bodyClassName="text-center"
            style={{ minWidth: "2rem" }}
            body={(e) => (load ? <Skeleton /> : actionBodyTemplate(e))}
          />
        </DataTable>
      </>
    );
  };

  const onHideInput = () => {
    setLoading(false);
    setCurrentItem(def);
    setEdit(false);
    setShowInput(false);
    onInput(false);
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !currentItem.jpel_code || currentItem.jpel_code === "",
      name: !currentItem.jpel_name || currentItem.jpel_name === "",
    };

    setError(errors);

    return valid;
  };

  const renderDialog = () => {
    return (
      <>
        <Toast ref={toast} />
        <Dialog
          header={isEdit ? "Edit Jenis Pelanggan" : "Tambah Jenis Pelanggan"}
          visible={showInput}
          style={{ width: "40vw" }}
          footer={renderFooter()}
          onHide={onHideInput}
        >
          <div className="row mr-0 ml-0">
            <div className="col-6">
              <PrimeInput
                label={"Kode Jenis Pelanggan"}
                value={`${currentItem?.jpel_code}`}
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    jpel_code: e.target.value,
                  });
                  let newError = error;
                  newError.code = false;
                  setError(newError);
                }}
                placeholder="Masukan Kode"
                error={error?.code}
              />
            </div>

            <div className="col-6">
              <PrimeInput
                label={"Nama Jenis Pelanggan"}
                value={`${currentItem?.jpel_name}`}
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    jpel_name: e.target.value,
                  });
                  let newError = error;
                  newError.name = false;
                  setError(newError);
                }}
                placeholder="Masukan Nama Jenis Pelanggan"
                error={error?.name}
              />
            </div>
          </div>

          <div className="row mr-0 ml-0">
            <div className="col-12">
              <label className="text-label">Keterangan</label>
              <div className="p-inputgroup">
                <InputTextarea
                  value={`${currentItem?.jpel_ket}`}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, jpel_ket: e.target.value })
                  }
                  placeholder="Masukan Keterangan"
                />
              </div>
            </div>
          </div>
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
          header={"Data Jenis Pelanggan"}
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

export default DataJenisPelanggan;
