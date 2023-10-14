import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "react-bootstrap";
import { Row, Col, Badge } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { SelectButton } from "primereact/selectbutton";
import { MultiSelect } from "primereact/multiselect";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import { tr } from "../../../../data/tr";

const def = {
  id: null,
  type: "T",
  name: null,
  nilai: null,
  cutting: false,
  acc_sls_tax: null,
  acc_pur_tax: null,
  combined: null,
};

const defError = {
  name: false,
  nilai: false,
  // acc1: false,
  // acc2: false,
};

const type = [
  { name: "Tunggal", code: "T" },
  { name: "Ganda", code: "G" },
];

const DataPajak = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
}) => {
  const [pajak, setPajak] = useState(null);
  const [account, setAccount] = useState(null);
  const [comp, setComp] = useState(null);
  const [first2, setFirst2] = useState(0);
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
    getPajak();
    getAccount();
    getComp();
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
      }, 500);
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
          if (elem.account.dou_type === "D") {
            filt.push(elem.account);
          }
        });
        console.log(data);
        setAccount(filt);
      }
    } catch (error) {}
  };

  const getComp = async () => {
    setLoading(true);
    const config = {
      ...endpoints.getCompany,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setComp(data);
      }
    } catch (error) {}
  };

  const editPajak = async () => {
    const config = {
      ...endpoints.editPajak,
      endpoint: endpoints.editPajak.endpoint + currentItem.id,
      data: currentItem,
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
            summary: tr[localStorage.getItem("language")].berhasl,
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

  const addPajak = async () => {
    const config = {
      ...endpoints.addPajak,
      data: currentItem,
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
            summary: tr[localStorage.getItem("language")].berhasl,
            detail: tr[localStorage.getItem("language")].pesan_berhasil,
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
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

  const delPajak = async (id) => {
    setLoading(true);
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
          setLoading(false);
          setShowDelete(false);
          onSuccessInput();
          onInput(false);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhasl,
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

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setLoading(true);
        editPajak();
      } else {
        setLoading(true);
        addPajak();
      }
    }
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
            delPajak();
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

  const acc = (value) => {
    let acc = {};
    account?.forEach((element) => {
      if (value === element.id) {
        acc = element;
      }
    });
    return acc;
  };

  const glTemplate = (option) => {
    return (
      <div>
        {option !== null ? `${option.acc_name} - ${option.acc_code}` : ""}
      </div>
    );
  };

  const clear = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.acc_name} - ${option.acc_code}` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const onHideInput = () => {
    setLoading(false);
    setCurrentItem(def);
    setEdit(false);
    setShowInput(false);
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      name: !currentItem.name || currentItem.name === "",
      nilai: !currentItem.nilai || currentItem.nilai === "",
      // acc1: !currentItem?.acc_sls_tax,
      // acc2: !currentItem?.acc_pur_tax,
    };

    setError(errors);

    valid = !errors.name && !errors.nilai;

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
          globalFilterFields={["name", "nilai"]}
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
            header={tr[localStorage.getItem("language")].nm_pjk}
            field={(e) => e?.name ?? ""}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].nil}
            field={(e) => e?.nilai ?? ""}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          {/* <Column
            header={tr[localStorage.getItem("language")].type_pjk}
            field={(e) => e?.type ?? ""}
            style={{ minWidth: "8rem" }}
            body={(e) =>
              load ? (
                <Skeleton />
              ) : (
                <div>
                  {e.type === "T" ? (
                    <Badge variant="success light">
                      <i className="bx bxs-circle text-success mr-1"></i>{" "}
                      {"tr[localStorage.getItem("language")].tunggal"}
                    </Badge>
                  ) : (
                    <Badge variant="info light">
                      <i className="bx bxs-circle text-info mr-1"></i>{" "}
                      {tr[localStorage.getItem("language")].gabungan}
                    </Badge>
                  )}
                </div>
              )
            }
          /> */}
          <Column
            header={tr[localStorage.getItem("language")].pemotong}
            field={(e) => e?.cutting ?? ""}
            style={{ minWidth: "8rem" }}
            body={(e) =>
              load ? (
                <Skeleton />
              ) : (
                <div>
                  {e.cutting === false ? (
                    <Badge variant="danger light">
                      <i className="bx bxs-circle text-danger mr-1"></i>{" "}
                      {"Bukan Pemotongan"}
                    </Badge>
                  ) : (
                    <Badge variant="info light">
                      <i className="bx bxs-circle text-info mr-1"></i>{" "}
                      {"Pemotongan"}
                    </Badge>
                  )}
                </div>
              )
            }
          />
          {/* <Column
            header={tr[localStorage.getItem("language")].gabungan}
            field={(e) => e?.combined ?? "-"}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          /> */}
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
    console.log("dataaaaaa",data);
    return (
      <>
        <Toast ref={toast} />
        <Dialog
          header={
            isEdit
              ? "Edit Data"
              : "Tambah Data"
          }
          visible={showInput}
          style={{ width: "40vw" }}
          footer={renderFooter("displayData")}
          onHide={() => {
            onHideInput();
            onInput(false);
          }}
        >
          <div className="col-12 mb-2" hidden>
            <label className="text-label">{tr[localStorage.getItem("language")].pajak}</label>
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
                onChange={(e) => {
                  console.log(e.value);
                  setCurrentItem({ ...currentItem, type: e.value.code });
                }}
                optionLabel="name"
              />
            </div>
          </div>

          {currentItem !== null && currentItem.type === "T" ? (
            // currentItem.type === "T" ? (
            <>
              <div className="row ml-0 mt-0">
                <div className="col-6">
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].nm_pjk}
                    value={
                      currentItem !== null ? `${currentItem?.name ?? ""}` : ""
                    }
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

                <div className="col-6">
                  {/* <div className="p-inputgroup"> */}
                  <PrimeInput
                    label={tr[localStorage.getItem("language")].nil}
                    number
                    value={
                      currentItem !== null ? `${currentItem?.nilai ?? ""}` : ""
                    }
                    onChange={(e) => {
                      setCurrentItem({ ...currentItem, nilai: e.value });
                      let newError = error;
                      newError.nilai = false;
                      setError(newError);
                    }}
                    placeholder={tr[localStorage.getItem("language")].masuk}
                    error={error?.nilai}
                  />

                  {/* <span className="p-inputgroup-addon col-2">%</span> */}
                  {/* </div> */}
                </div>
              </div>

              <div className="row ml-0 mt-0">
                <div className="col-12 mb-2">
                  <label className="mt-3" htmlFor="binary">
                    {tr[localStorage.getItem("language")].pemotong}
                  </label>
                  <Checkbox
                    className="mb-1 ml-5"
                    inputId="binary"
                    checked={currentItem ? currentItem.cutting : false}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, cutting: e.checked })
                    }
                  />
                </div>
              </div>

              <div
                className="row ml-0 mt-0"
              >
                <div className="col-6">
                  <PrimeDropdown
                    label={tr[localStorage.getItem("language")].acc_pjk_bl}
                    value={
                      currentItem !== null && currentItem.acc_pur_tax !== null
                        ? acc(currentItem.acc_pur_tax)
                        : null
                    }
                    options={account}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        acc_pur_tax: e.value?.id ?? null,
                      });
                      // let newError = error;
                      // newError.acc1 = false;
                      // setError(newError);
                    }}
                    optionLabel="account.acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="acc_name"
                    placeholder={tr[localStorage.getItem("language")].pilih}
                    // errorMessage="Akun Pajak Pembelian Belum Dipilih"
                    // error={error?.acc1}
                    // disabled={localStorage.getItem("product") !== "inv+gl"}
                    showClear
                  />
                </div>

                <div className="col-6">
                  <PrimeDropdown
                    label={tr[localStorage.getItem("language")].acc_pjk_jl}
                    value={
                      currentItem !== null && currentItem.acc_sls_tax !== null
                        ? acc(currentItem.acc_sls_tax)
                        : null
                    }
                    options={account}
                    onChange={(e) => {
                      console.log(e.value);
                      setCurrentItem({
                        ...currentItem,
                        acc_sls_tax: e.value?.id ?? null,
                      });
                      // let newError = error;
                      // newError.acc2 = false;
                      // setError(newError);
                    }}
                    optionLabel="account.acc_name"
                    valueTemplate={clear}
                    itemTemplate={glTemplate}
                    filter
                    filterBy="acc_name"
                    placeholder={tr[localStorage.getItem("language")].pilih}
                    // errorMessage="Akun Pajak Penjualan Belum Dipilih"
                    // error={error?.acc2}
                    showClear
                  />
                </div>
              </div>
            </>
          ) : (
            // currentItem.type === "G" ? (
            <>
              {" "}
              <div className="row ml-0 mt-0">
                <div className="col-6">
                  <label className="text-label">{tr[localStorage.getItem("language")].nm_pjk}</label>
                  <div className="p-inputgroup">
                    <InputText
                      value={
                        currentItem !== null ? `${currentItem?.name ?? ""}` : ""
                      }
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, name: e.target.value })
                      }
                      placeholder={tr[localStorage.getItem("language")].masuk}
                    />
                  </div>
                </div>

                <div className="col-6">
                  <label className="text-label">{tr[localStorage.getItem("language")].gabungan}</label>
                  <div className="p-inputgroup">
                    <MultiSelect
                      value={currentItem !== null ? currentItem.pajak : null}
                      options={pajak}
                      onChange={(e) => {
                        console.log("=====ppn=======");
                        console.log(e.value);
                        setCurrentItem({
                          ...currentItem,
                          pajak: e.value,
                        });
                      }}
                      optionLabel="name"
                      filter
                      filterBy="name"
                      placeholder={tr[localStorage.getItem("language")].pilih}
                      display="chip"
                    />
                  </div>
                </div>
              </div>
              <div className="row ml-0 mr-0 mb-0 mt-6 justify-content-between">
                <div className="row justify-content-right col-6">
                  <div className="col-4">
                    <label className="text-label">Detail :</label>
                  </div>

                  <div className="col-6">
                    <label className="text-label">
                      <b>
                        1.{" "}
                        {currentItem.pajak !== null
                          ? currentItem.pajak?.nilai
                          : ""}
                        %
                      </b>
                    </label>
                  </div>

                  <div className="col-4">
                    <label className="text-label"></label>
                  </div>

                  <div className="col-6">
                    <label className="text-label">
                      <b>2. {}%</b>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </Dialog>

        <Dialog
          header={tr[localStorage.getItem("language")].hapus_data}
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
          header={"Data Pajak"}
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

export default DataPajak;
