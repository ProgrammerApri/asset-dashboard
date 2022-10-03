import React, { useRef, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Badge } from "react-bootstrap";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import { InputTextarea } from "primereact/inputtextarea";
import { Password } from "primereact/password";

const def = {
  id: 1,
  username: "",
  name: "",
  email: "",
  company: "",
};
const defError = {
  username: false,
  name: false,
  email: false,
};

const Pengguna = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
}) => {
  const [value3, setValue3] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [showInput, setShowInput] = useState(false);
  const [isEdit, setEdit] = useState(def);
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [currentItem, setCurrentItem] = useState(def);
  const [error, setError] = useState(defError);

  const editUSER = async () => {
    const config = {
      ...endpoints.editUSER,
      endpoint: endpoints.editUSER.endpoint + currentItem.id,
      data: {
        username: currentItem.username,
        email: currentItem.email,
        name: currentItem.name,
        password: currentItem.password,
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
          setUpdate(false);
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

  const addUSER = async () => {
    const config = {
      ...endpoints.addUSER,
      data: {
        username: currentItem.username,
        email: currentItem.email,
        name: currentItem.name,
        password: currentItem.password,
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
          setUpdate(false);
          // onHideInput();
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
            detail: `Username ${currentItem.username} Sudah Digunakan`,
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

  const delUSER = async (id) => {
    const config = {
      ...endpoints.delUSER,
      endpoint: endpoints.delUSER.endpoint + currentItem.id,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(true);
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
        setUpdate(false);
        setShowDelete(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: `Tidak Dapat Menghapus Project`,
          life: 3000,
        });
      }, 500);
    }
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      username: !currentItem.username || currentItem.username === "",
      name: !currentItem.name || currentItem.name === "",
      email: !currentItem.email || currentItem.email === "",
    };

    setError(errors);

    valid = !errors.username && !errors.name && !errors.email;

    return valid;
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

  const onSubmit = () => {
    // if (isValid()) {
      if (isEdit) {
        setLoading(true);
        editUSER();
      } else {
        setLoading(true);
        addUSER();
      }
    // }
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
  console.log("-----------");
  console.log(Button);

  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
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

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            // value={globalFilterValue1}
            // onChange={onGlobalFilterChange1}
            placeholder="Cari disini"
          />
        </span>
        {/* <Row className="mr-1"> */}
        <Button
          variant="primary"
          onClick={() => {
            setShowInput(true);
            setEdit(false);
            setLoading(false);
            setCurrentItem(def);
            onInput(true);
          }}
        >
          Tambah{" "}
          <span className="btn-icon-right">
            <i class="bx bx-plus"></i>
          </span>
        </Button>
        {/* </Row> */}
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
            setLoading(true);
            delUSER();
          }}
          autoFocus
          loading={loading}
        />
      </div>
    );
  };

  const renderBody = () => {
    return (
      <>
        <Toast ref={toast} />
        <DataTable
          responsive
          value={null}
          className="display w-100 datatable-wrapper"
          showGridlines
          dataKey="id"
          rowHover
          header={renderHeader}
          emptyMessage="Tidak ada data"
          paginator
          paginatorTemplate={template2}
          first={first2}
          rows={rows2}
          onPage={onCustomPage2}
          paginatorClassName="justify-content-end mt-3"
        >
          <Column
            field={(e) => e.username}
            header="Username"
            style={{
              minWidth: "10rem",
            }}
            body={load && <Skeleton />}
          />
          <Column
            header="Email"
            field={(e) => e.email}
            style={{ minWidth: "10rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Perusahaan"
            field={(e) => e.company}
            style={{ minWidth: "10rem" }}
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
          header={isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
          visible={showInput}
          style={{ width: "40vw" }}
          footer={renderFooter()}
          onHide={() => {
            onHideInput();
            onInput(false);
          }}
        >
          <div className="row ml-0 mt-0">
            <div className="col-12">
              <PrimeInput
                label={"Username"}
                value={currentItem !== null ? `${currentItem.username}` : ""}
                onChange={(e) => {
                  setCurrentItem({ ...currentItem, username: e.target.value });
                  let newError = error;
                  newError.username = false;
                  setError(newError);
                }}
                placeholder="Masukan Username"
                error={error?.username}
              />
            </div>
          </div>

          <div className="row ml-0 mt-0">
            <div className="col-6">
              <PrimeInput
                label={"Email"}
                value={currentItem !== null ? `${currentItem.email}` : ""}
                onChange={(e) => {
                  setCurrentItem({ ...currentItem, email: e.target.value });
                  let newError = error;
                  newError.email = false;
                  setError(newError);
                }}
                placeholder="Masukan Nama Email"
                error={error?.email}
              />
            </div>

            <div className="col-6">
              <label>Password</label>
              <div className="p-inputgroup ">
                <Password
                  label={"Password "}
                  value={value3}
                  onChange={(e) => setValue3(e.target.value)}
                  placeholder="Masukkan Password"
                  toggleMask
                />
              </div>
            </div>

            <div className="col-12">
              <PrimeInput
                label={"Perusahaan"}
                value={currentItem !== null ? `${currentItem.company}` : ""}
                onChange={(e) => {
                  setCurrentItem({ ...currentItem, company: e.target.value });
                  let newError = error;
                  newError.company = false;
                  setError(newError);
                }}
                placeholder="Masukan Alamat"
                error={error?.company}
              />
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
          header={"Data Pengguna"}
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

export default Pengguna;
