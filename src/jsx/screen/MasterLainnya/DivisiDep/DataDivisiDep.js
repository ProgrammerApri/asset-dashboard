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
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import { tr } from "src/data/tr";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";

const def = {
  id: 1,
  div_ccost_code: "",
  div_ccost_name: "",
  div_ccost_ket: "",
  dep_id: null,
};

const defError = {
  code: false,
  name: false,
};

const DataDivisiDep = ({
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
  const [pusatbiaya, setPusatBiaya] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [currentItem, setCurrentItem] = useState(def);
  const [isEdit, setEdit] = useState(def);
  const [showInput, setShowInput] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [error, setError] = useState(defError);

  useEffect(() => {
    initFilters1();
    getPusatBiaya();
  }, []);

  const editPusatBiaya = async () => {
    setLoading(true);
    const config = {
      ...endpoints.editDivPusatBiaya,
      endpoint: endpoints.editDivPusatBiaya.endpoint + currentItem.id,
      data: {
        div_ccost_code: currentItem.div_ccost_code,
        div_ccost_name: currentItem.div_ccost_name,
        div_ccost_ket: currentItem.div_ccost_ket,
        dep_id: currentItem.dep_id.id,
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
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].pesan_berhasil,
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: tr[localStorage.getItem("language")].gagal,
          detail: tr[localStorage.getItem("language")].pesan_gagal,
          life: 3000,
        });
      }, 500);
    }
  };

  const addPusatBiaya = async () => {
    setLoading(true);
    const config = {
      ...endpoints.addDivPusatBiaya,
      data: {
        div_ccost_code: currentItem.div_ccost_code,
        div_ccost_name: currentItem.div_ccost_name,
        div_ccost_ket: currentItem.div_ccost_ket,
        dep_id: currentItem.dep_id.id,
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
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: tr[localStorage.getItem("language")].gagal,
            detail: `Kode ${currentItem.div_ccost_code} Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
        setTimeout(() => {
          setLoading(false);
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

  const getPusatBiaya = async (isUpdate = false) => {
    const config = {
      ...endpoints.pusatBiaya,
      data: {},
    };
    console.log("jjjjjjjjj", config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        setPusatBiaya(data);
      }
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
    }
  };

  const delPusatBiaya = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delDivPusatBiaya,
      endpoint: endpoints.delDivPusatBiaya.endpoint + currentItem.id,
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
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].del_berhasil,
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

  const renderFooter = () => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => {
            onHideInput();
            onInput(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].simpan}
          icon="pi pi-check"
          onClick={() => {
            // if (isValid()) {
            if (isEdit) {
              editPusatBiaya();
            } else {
              addPusatBiaya();
            }
            // }
          }}
          autoFocus
          loading={loading}
        />
      </div>
    );
  };

  const renderFooterDel = (kode) => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => {
            setShowDelete(false);
            setLoading(false);
            onInput(false);
          }}
          className="p-button-text btn-s btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].hapus}
          icon="pi pi-trash"
          onClick={() => {
            delPusatBiaya();
          }}
          autoFocus
          loading={loading}
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
        <PrimeSingleButton
          label={tr[localStorage.getItem("language")].tambh}
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

  // const isValid = () => {
  //   let valid = false;
  //   let errors = {
  //     code: !currentItem.div_ccost_code || currentItem.div_ccost_code === "",
  //     name: !currentItem.div_ccost_name || currentItem.div_ccost_name === "",
  //   };

  //   setError(errors);
  //   valid = !errors.code && !errors.name;

  //   return valid;
  // };

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
            "div_ccost_code",
            "div_ccost_name",
            "div_ccost_ket",
            "dep_id",
          ]}
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
            header={tr[localStorage.getItem("language")].kd_dep}
            style={{
              minWidth: "8rem",
            }}
            field="div_ccost_code"
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].nm_dep}
            field="div_ccost_name"
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].ket}
            field="div_ccost_ket"
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
    console.log("data", data);
    return (
      <>
        <Toast ref={toast} />
        <Dialog
          header={
            isEdit
              ? `${tr[localStorage.getItem("language")].edit} ${
                  tr[localStorage.getItem("language")].dep
                }`
              : `${tr[localStorage.getItem("language")].tambh} ${
                  tr[localStorage.getItem("language")].divdep
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
          <div className="row mr-0 mt-0">
            <div className="col-6">
              <PrimeInput
                label={tr[localStorage.getItem("language")].kd_divdep}
                value={
                  currentItem !== null ? `${currentItem.div_ccost_code}` : ""
                }
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    div_ccost_code: e.target.value,
                  });
                  // let newError = error;
                  // newError.code = false;
                  // setError(newError);
                }}
                placeholder={tr[localStorage.getItem("language")].masuk}
                // error={error?.code}
              />
            </div>
            <div className="col-6">
              <PrimeInput
                label={tr[localStorage.getItem("language")].nm_divdep}
                value={
                  currentItem !== null ? `${currentItem?.div_ccost_name}` : ""
                }
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    div_ccost_name: e.target.value,
                  });
                  // let newError = error;
                  // newError.code = false;
                  // setError(newError);
                }}
                placeholder={tr[localStorage.getItem("language")].masuk}
                // error={error?.code}
              />
            </div>

            <div className="col-6">
              <PrimeDropdown
                label={tr[localStorage.getItem("language")].nm_dep}
                value={currentItem !== null ? currentItem.dep_id : null}
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    dep_id: e.target.value || null,
                  });
                }}
                // onChange={(e) => {
                //   setCurrentItem({
                //     ...currentItem,
                //     ccost_name: e.value ?? null,
                //   });
                //   // let newError = error;
                //   // newError.name = false;
                //   // setError(newError);
                // }}
                options={pusatbiaya}
                // placeholder={tr[localStorage.getItem("language")].masuk}
                // error={error?.name}
                optionLabel="ccost_name"
                filter
                filterBy="ccost_name"
                placeholder={tr[localStorage.getItem("language")].pilih}
              />
            </div>
          </div>

          <div className="row mr-0 mt-0">
            <div className="col-12">
              <label className="text-label">
                {tr[localStorage.getItem("language")].ket}
              </label>
              <div className="p-inputgroup">
                <InputTextarea
                  value={
                    currentItem !== null ? `${currentItem.div_ccost_ket}` : ""
                  }
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      div_ccost_ket: e.target.value,
                    })
                  }
                  placeholder={tr[localStorage.getItem("language")].masuk}
                />
              </div>
            </div>
          </div>
        </Dialog>

        <Dialog
          header={`${tr[localStorage.getItem("language")].hapus} ${
            tr[localStorage.getItem("language")].dep
          }`}
          visible={showDelete}
          style={{ width: "30vw" }}
          footer={renderFooterDel()}
          onHide={() => {
            setLoading(false);
            setShowDelete(false);
            onInput(false);
          }}
        >
          <div className="ml-2 mr-3">
            <i
              className="pi pi-exclamation-triangle mr-2 align-middle"
              style={{ fontSize: "1rem" }}
            />
            <span>{tr[localStorage.getItem("language")].pesan_hapus}</span>
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
          header={`${tr[localStorage.getItem("language")].data} ${
            tr[localStorage.getItem("language")].dev
          }`}
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

export default DataDivisiDep;
