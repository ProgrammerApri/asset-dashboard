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
import { classNames } from "primereact/utils";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";

const def = {
  id: 1,
  proj_code: "",
  proj_name: "",
  proj_ket: "",
};

const defError = {
  code: false,
  name: false,
};

const DataProject = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
}) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [currentItem, setCurrentItem] = useState(def);
  const [isEdit, setEdit] = useState(def);
  const [showInput, setShowInput] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [error, setError] = useState(defError);

  useEffect(() => {
    initFilters1();
  }, []);

  const editProject = async () => {
    const config = {
      ...endpoints.editProject,
      endpoint: endpoints.editProject.endpoint + currentItem.id,
      data: {
        proj_code: currentItem.proj_code,
        proj_name: currentItem.proj_name,
        proj_ket: currentItem.proj_ket,
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

  const addProject = async () => {
    const config = {
      ...endpoints.addProject,
      data: {
        proj_code: currentItem.proj_code,
        proj_name: currentItem.proj_name,
        proj_ket: currentItem.proj_ket,
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

  const delProject = async (id) => {
    const config = {
      ...endpoints.delProject,
      endpoint: endpoints.delProject.endpoint + currentItem.id,
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

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editProject();
      } else {
        setUpdate(true);
        addProject();
      }
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
          onClick={() => onSubmit()}
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
            delProject();
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

  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !currentItem.proj_code || currentItem.proj_code === "",
      name: !currentItem.proj_name || currentItem.proj_name === "",
    };

    setError(errors);

    return valid;
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
            "project.proj_code",
            "project.proj_name",
            "project.proj_ket",
          ]}
          emptyMessage="Tidak ada data"
          paginator
          paginatorTemplate={template2}
          first={first2}
          rows={rows2}
          onPage={onCustomPage2}
          paginatorClassName="justify-content-end mt-3"
          selectionMode="single"
          onRowSelect={onRowSelect}
        >
          <Column
            header="Kode"
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e.proj_code}
            body={load && <Skeleton />}
          />
          <Column
            header="Nama"
            field={(e) => e.proj_name}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Keterangan"
            field={(e) => (e?.proj_ket !== "" ? e.proj_ket : "-")}
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

  const renderDialog = () => {
    return (
      <>
        <Toast ref={toast} />
        <Dialog
          header={isEdit ? "Edit Project" : "Tambah Project"}
          visible={showInput}
          style={{ width: "40vw" }}
          footer={renderFooter()}
          onHide={() => {
            onHideInput();
            onInput(false);
          }}
        >
          <div className="row ml-0 mt-0">
            <div className="col-6">
              <PrimeInput
                label={"Kode Project"}
                value={currentItem !== null ? `${currentItem.proj_code}` : ""}
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    proj_code: e.target.value,
                  });
                  let newError = error;
                  newError.code = false;
                  setError(newError);
                }}
                placeholder="Masukan Kode Project"
                error={error?.code}
              />
            </div>

            <div className="col-6">
              <PrimeInput
                label={"Nama Project"}
                value={currentItem !== null ? `${currentItem.proj_name}` : ""}
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    proj_name: e.target.value,
                  });
                  let newError = error;
                  newError.name = false;
                  setError(newError);
                }}
                placeholder="Masukan Nama Project"
                error={error?.name}
              />
            </div>
          </div>

          <div className="row ml-0 mt-0">
            <div className="col-12">
              <label className="text-label">Keterangan</label>
              <div className="p-inputgroup">
                <InputTextarea
                  value={currentItem !== null ? `${currentItem.proj_ket}` : ""}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, proj_ket: e.target.value })
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
          footer={renderFooterDel("displayDel")}
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

  const onHideInput = () => {
    setLoading(false);
    setCurrentItem(def);
    setEdit(false);
    setShowInput(false);
  };

  if (popUp) {
    return (
      <>
        <Dialog
          header={"Data Project"}
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

export default DataProject;