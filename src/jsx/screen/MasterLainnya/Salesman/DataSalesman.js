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

const def = {
  id: 1,
  sales_code: "",
  sales_name: "",
  sales_ket: "",
};

const defError = {
  code: false,
  name: false,
};

const DataSalesman = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
}) => {
  const [salesman, setSalesman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [position, setPosition] = useState("center");
  const [currentItem, setCurrentItem] = useState(def);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [showInput, setShowInput] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [error, setError] = useState(defError);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    initFilters1();
  }, []);

  const editSalesman = async () => {
    const config = {
      ...endpoints.editSalesman,
      endpoint: endpoints.editSalesman.endpoint + currentItem.id,
      data: {
        sales_code: currentItem.sales_code,
        sales_name: currentItem.sales_name,
        sales_ket: currentItem.sales_ket,
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

  const addSalesman = async () => {
    const config = {
      ...endpoints.addSalesman,
      data: {
        sales_code: currentItem.sales_code,
        sales_name: currentItem.sales_name,
        sales_ket: currentItem.sales_ket,
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
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: tr[localStorage.getItem("language")].gagal,
            detail: `Kode ${currentItem.sales_code} Sudah Digunakan`,
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

  const delSalesman = async (id) => {
    const config = {
      ...endpoints.delSalesman,
      endpoint: endpoints.delSalesman.endpoint + currentItem.id,
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
        editSalesman();
      } else {
        setUpdate(true);
        addSalesman();
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
            setError(false);
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
            setLoading(false);
            onInput(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].hapus}
          icon="pi pi-trash"
          onClick={() => {
            delSalesman();
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

  const onHideInput = () => {
    setUpdate(false);
    setError(false);
    setCurrentItem(def);
    setEdit(false);
    setShowInput(false);
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !currentItem.sales_code || currentItem.sales_code === "",
      name: !currentItem.sales_name || currentItem.sales_name === "",
    };

    setError(errors);

    valid = !errors.code && !errors.name;

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
          globalFilterFields={["sales_code", "sales_name", "sales_ket"]}
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
            header={tr[localStorage.getItem("language")].kd_slsm}
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e.sales_code}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].nm_slsm}
            field={(e) => e.sales_name}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].ket}
            field={(e) => (e?.sales_ket !== "" ? e.sales_ket : "-")}
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
        <Dialog
          header={
            isEdit
              ? `${tr[localStorage.getItem("language")].edit} ${
                  tr[localStorage.getItem("language")].salesmn
                }`
              : `${tr[localStorage.getItem("language")].tambh} ${
                  tr[localStorage.getItem("language")].salesmn
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
          <div className="row ml-0 mr-0">
            <div className="col-6">
              <PrimeInput
                label={tr[localStorage.getItem("language")].kd_slsm}
                value={currentItem !== null ? `${currentItem.sales_code}` : ""}
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    sales_code: e.target.value,
                  });
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
                label={tr[localStorage.getItem("language")].nm_slsm}
                value={currentItem !== null ? `${currentItem.sales_name}` : ""}
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    sales_name: e.target.value,
                  });
                  let newError = error;
                  newError.name = false;
                  setError(newError);
                }}
                placeholder={tr[localStorage.getItem("language")].masuk}
                error={error?.name}
              />
            </div>
          </div>

          <div className="col-12">
            <label className="text-label">
              {tr[localStorage.getItem("language")].ket}
            </label>
            <div className="p-inputgroup">
              <InputTextarea
                value={currentItem !== null ? `${currentItem.sales_ket}` : ""}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, sales_ket: e.target.value })
                }
                placeholder={tr[localStorage.getItem("language")].masuk}
              />
            </div>
          </div>
        </Dialog>

        <Dialog
          header={`${tr[localStorage.getItem("language")].hapus} ${
            tr[localStorage.getItem("language")].salesmn
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

  if (popUp) {
    return (
      <>
        <Dialog
          header={`${tr[localStorage.getItem("language")].data} ${
            tr[localStorage.getItem("language")].salesmn
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

export default DataSalesman;
