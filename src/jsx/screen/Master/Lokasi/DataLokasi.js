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
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { tr } from "src/data/tr";

const def = {
  id: 1,
  code: "",
  name: "",
  address: "",
  desc: "",
};

const defError = {
  code: false,
  name: false,
  addr: false,
};

const DataLokasi = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
  edit,
  del,
}) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [position, setPosition] = useState("center");
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

  const editLokasi = async () => {
    const config = {
      ...endpoints.editLokasi,
      endpoint: endpoints.editLokasi.endpoint + currentItem.id,
      data: {
        code: currentItem.code,
        name: currentItem.name,
        address: currentItem.address,
        desc: currentItem.desc,
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
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].pesan_berhasil,
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: tr[localStorage.getItem("language")].gagal,
          detail: tr[localStorage.getItem("language")].pesan_gagal,
          life: 3000,
        });
      }, 500);
    }
  };

  const addLokasi = async () => {
    const config = {
      ...endpoints.addLokasi,
      data: {
        code: currentItem.code,
        name: currentItem.name,
        address: currentItem.address,
        desc: currentItem.desc,
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
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].pesan_berhasil,
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
            summary: tr[localStorage.getItem("language")].gagal,
            detail: `Kode ${currentItem.code} Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: tr[localStorage.getItem("language")].gagal,
            detail: tr[localStorage.getItem("language")].pesan_gagal,
            life: 3000,
          });
        }, 500);
      }
    }
  };

  const delLokasi = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delLokasi,
      endpoint: endpoints.delLokasi.endpoint + currentItem.id,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setShowDelete(false);
          onSuccessInput();
          onInput(false);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].del_berhasil,
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
          summary: tr[localStorage.getItem("language")].gagal,
          detail: tr[localStorage.getItem("language")].del_gagal,
          life: 3000,
        });
      }, 500);
    }
  };

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        {edit && (
          <Link
            onClick={() => {
              setUpdate(false);
              setEdit(true);
              setCurrentItem(data);
              setShowInput(true);
              onInput(true);
            }}
            className="btn btn-primary shadow btn-xs sharp ml-1"
          >
            <i className="fa fa-pencil"></i>
          </Link>
        )}

        {del && (
          <Link
            onClick={() => {
              setUpdate(false);
              setCurrentItem(data);
              setShowDelete(true);
              onInput(true);
            }}
            className="btn btn-danger shadow btn-xs sharp ml-1"
          >
            <i className="fa fa-trash"></i>
          </Link>
        )}
      </div>
      // </React.Fragment>
    );
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editLokasi();
      } else {
        setUpdate(true);
        addLokasi();
      }
    }
  };

  const renderFooter = () => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => {
            setUpdate(false);
            onHideInput();
            onInput(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].simpan}
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
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => {
            setShowDelete(false);
            setUpdate(false);
            onInput(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].hapus}
          icon="pi pi-trash"
          onClick={() => {
            setUpdate(true);
            delLokasi();
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
            placeholder={tr[localStorage.getItem("language")].cari}
          />
        </span>
        {/* {edit && ( */}
          <PrimeSingleButton
            label={tr[localStorage.getItem("language")].tambh}
            icon={<i class="bx bx-plus px-2"></i>}
            onClick={() => {
              setShowInput(true);
              setEdit(false);
              setUpdate(false);
              setCurrentItem(def);
              onInput(true);
            }}
          />
        {/* )} */}
      </div>
    );
  };

  const template2 = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        {
          label: tr[localStorage.getItem("language")].hal,
          value: options.totalRecords,
        },
      ];

      return (
        <React.Fragment>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            {tr[localStorage.getItem("language")].page}{" "}
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
          {options.first} - {options.last}{" "}
          {tr[localStorage.getItem("language")].dari} {options.totalRecords}
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
      code: !currentItem.code || currentItem.code === "",
      name: !currentItem.name || currentItem.name === "",
      addr: !currentItem.address || currentItem.address === "",
    };

    setError(errors);

    valid = !errors.code && !errors.name && !errors.addr;

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
          globalFilterFields={["code", "name", "address", "desc"]}
          emptyMessage={tr[localStorage.getItem("language")].empty_data}
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
            header={tr[localStorage.getItem("language")].kd_loc}
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e.code}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].nm_loc}
            field={(e) => e.name}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].alamat}
            field={(e) => (e.address !== "" ? e.address : "-")}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].ket}
            field={(e) => (e?.desc !== "" ? e.desc : "-")}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          {(edit || del) && (
            <Column
              header="Action"
              dataType="boolean"
              bodyClassName="text-center"
              style={{ minWidth: "2rem" }}
              body={(e) => (load ? <Skeleton /> : actionBodyTemplate(e))}
            />
          )}
        </DataTable>
      </>
    );
  };

  const renderDialog = () => {
    return (
      <>
        <Toast ref={toast} />
        <Dialog
          header={
            isEdit
              ? `${tr[localStorage.getItem("language")].edit} ${
                  tr[localStorage.getItem("language")].gudang
                }`
              : `${tr[localStorage.getItem("language")].tambh} ${
                  tr[localStorage.getItem("language")].gudang
                }`
          }
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
                label={tr[localStorage.getItem("language")].kd_loc}
                value={currentItem !== null ? `${currentItem.code}` : ""}
                onChange={(e) => {
                  setCurrentItem({ ...currentItem, code: e.target.value });
                  let newError = error;
                  newError.code = false;
                  setError(newError);
                }}
                placeholder={tr[localStorage.getItem("language")].masuk}
                error={error?.code}
              />
            </div>

            <div className="col-6">
              <PrimeInput
                label={tr[localStorage.getItem("language")].nm_loc}
                value={currentItem !== null ? `${currentItem.name}` : ""}
                onChange={(e) => {
                  setCurrentItem({ ...currentItem, name: e.target.value });
                  let newError = error;
                  newError.name = false;
                  setError(newError);
                }}
                placeholder={tr[localStorage.getItem("language")].masuk}
                error={error?.name}
              />
            </div>
          </div>

          <div className="row ml-0 mt-0">
            <div className="col-12">
              <PrimeInput
                label={tr[localStorage.getItem("language")].alamat}
                value={currentItem !== null ? `${currentItem.address}` : ""}
                onChange={(e) => {
                  setCurrentItem({ ...currentItem, address: e.target.value });
                  let newError = error;
                  newError.addr = false;
                  setError(newError);
                }}
                placeholder={tr[localStorage.getItem("language")].masuk}
                error={error?.addr}
              />
            </div>
          </div>

          <div className="row ml-0 mt-0">
            <div className="col-12">
              <label className="text-label">
                {tr[localStorage.getItem("language")].ket}
              </label>
              <div className="p-inputgroup">
                <InputTextarea
                  value={currentItem !== null ? `${currentItem.desc}` : ""}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, desc: e.target.value })
                  }
                  placeholder={tr[localStorage.getItem("language")].masuk}
                />
              </div>
            </div>
          </div>
        </Dialog>

        <Dialog
          header={`${tr[localStorage.getItem("language")].hapus} ${
            tr[localStorage.getItem("language")].gudang
          }`}
          visible={showDelete}
          style={{ width: "30vw" }}
          footer={renderFooterDel()}
          onHide={() => {
            setUpdate(false);
            setShowDelete(false);
            onInput(false);
          }}
        >
          <div className="ml-3 mr-3">
            <i
              className="pi pi-exclamation-triangle mr-3 align-middle"
              style={{ fontSize: "2rem" }}
            />
            <span>{tr[localStorage.getItem("language")].pesan_hapus}</span>
          </div>
        </Dialog>
      </>
    );
  };

  const onHideInput = () => {
    setUpdate(false);
    setCurrentItem(def);
    setEdit(false);
    setShowInput(false);
  };

  if (popUp) {
    return (
      <>
        <Dialog
          header={"Data Lokasi"}
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

export default DataLokasi;
