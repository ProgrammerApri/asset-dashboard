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
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { tr } from "src/data/tr";

const def = {
  bank: {
    id: 1,
    BANK_CODE: "",
    BANK_NAME: "",
    BANK_DESC: "",
    CURRENCY: null,
    acc_id: null,
    user_entry: 0,
    user_edit: null,
    entry_date: "",
    edit_date: "",
  },

  account: {
    id: 0,
    acc_code: "",
    acc_name: "",
    umm_code: null,
    kat_code: 0,
    dou_type: "",
    sld_type: "",
    connect: true,
    sld_awal: 0,
  },
};

const defError = {
  code: false,
  name: false,
  jpel: false,
  induk: false,
  addrs: false,
  city: false,
};

const DataBank = ({
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
  const [bank, setBank] = useState(null);
  const [account, setAccount] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [position, setPosition] = useState("center");
  const [currentItem, setCurrentItem] = useState(def);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(def);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [error, setError] = useState(defError);

  useEffect(() => {
    getAccount();
    getCurr();
    initFilters1();
  }, []);

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
        data.forEach((element) => {
          if (element.account.dou_type === "D" && element.account.connect) {
            filt.push(element.account);
          }
        });
        console.log(data);
        setAccount(filt);
      }
    } catch (error) {}
  };

  const getCurr = async () => {
    setLoading(true);
    const config = {
      ...endpoints.currency,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        
        setCurrency(data);
      }
    } catch (error) {}
  };

  const editBank = async () => {
    const config = {
      ...endpoints.editBank,
      endpoint: endpoints.editBank.endpoint + currentItem.bank.id,
      data: {
        BANK_CODE: currentItem?.bank?.BANK_CODE,
        ACC_ID: currentItem?.account?.id,
        BANK_NAME: currentItem?.bank?.BANK_NAME,
        BANK_DESC: currentItem?.bank?.BANK_DESC,
        CURRENCY: currentItem?.bank?.CURRENCY,
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

  const addBank = async () => {
    const config = {
      ...endpoints.addBank,
      data: {
        BANK_CODE: currentItem.bank.BANK_CODE  ?? null,
        ACC_ID: currentItem.account.id  ?? null,
        BANK_NAME: currentItem.bank.BANK_NAME  ?? null,
        BANK_DESC: currentItem.bank.BANK_DESC  ?? null,
        CURRENCY: currentItem.bank.CURRENCY ?? null,
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
            detail: `Kode ${currentItem.bank.BANK_CODE} Sudah Digunakan`,
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

  const delBank = async (id) => {
    const config = {
      ...endpoints.delBank,
      endpoint: endpoints.delBank.endpoint + currentItem.bank.id,
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
        onSuccessInput();
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
        {edit && (
          <Link
            onClick={() => {
              setEdit(true);
              setCurrentItem(data);
              setShowInput(true);
              onInput(true);
            }}
            className="btn btn-primary shadow btn-xs sharp ml-2"
          >
            <i className="fa fa-pencil"></i>
          </Link>
        )}

        {del && (
          <Link
            onClick={() => {
              setCurrentItem(data);
              setShowDelete(true);
              onInput(true);
            }}
            className="btn btn-danger shadow btn-xs sharp ml-2"
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
        setLoading(true);
        editBank();
      } else {
        setLoading(true);
        addBank();
      }
    }
  };

  const renderFooter = () => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => {
            setLoading(false);
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
          className="p-button btn-s btn-primary"
          icon="pi pi-trash"
          onClick={() => {
            delBank();
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
        {edit && (
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
        )}
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

  const glTemplate = (option) => {
    return (
      <div>
        {option !== null ? `${option.acc_name} - ${option.acc_code}` : ""}
      </div>
    );
  };

  const valueTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.acc_name} - ${option.acc_code}` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const curr = (value) => {
    let selected = {};
    currency?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });
    return selected;
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
      code: !currentItem.bank.BANK_CODE || currentItem.bank.BANK_CODE === "",
      name: !currentItem.bank.BANK_NAME || currentItem.bank.BANK_NAME === "",
      acc_id: !currentItem.account.id,
    };

    setError(errors);

    valid = !errors.code && !errors.name && !errors.acc_id;

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
            "bank.BANK_CODE",
            "account.acc_name",
            "bank.BANK_NAME",
            "bank.BANK_DESC",
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
            header={tr[localStorage.getItem("language")].kd_bnk}
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e.bank?.BANK_CODE}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].nm_bnk}
            field={(e) => e.bank?.BANK_NAME}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].akun}
            field={(e) => e.account?.acc_name}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].currency}
            field={(e) => curr(e.bank?.CURRENCY)?.code}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header={tr[localStorage.getItem("language")].ket}
            field={(e) => (e.bank?.BANK_DESC !== "" ? e.bank?.BANK_DESC : "-")}
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
                  tr[localStorage.getItem("language")].bank
                }`
              : `${tr[localStorage.getItem("language")].tambh} ${
                  tr[localStorage.getItem("language")].bank
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
                label={tr[localStorage.getItem("language")].kd_bnk}
                value={
                  currentItem !== null ? `${currentItem?.bank?.BANK_CODE}` : ""
                }
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    bank: { ...currentItem.bank, BANK_CODE: e.target.value },
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
                label={tr[localStorage.getItem("language")].nm_bnk}
                value={
                  currentItem !== null ? `${currentItem?.bank?.BANK_NAME}` : ""
                }
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    bank: { ...currentItem.bank, BANK_NAME: e.target.value },
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

          <div className="row ml-0 mt-0">
            <div className="col-6">
              <PrimeDropdown
                label={tr[localStorage.getItem("language")].akun}
                value={currentItem !== null ? currentItem?.account : null}
                options={account && account}
                onChange={(e) => {
                  console.log(e.value);
                  setCurrentItem({
                    ...currentItem,
                    account: e.value,
                  });
                  let newError = error;
                  newError.acc_id = false;
                  setError(newError);
                }}
                optionLabel="acc_name"
                filter
                filterBy="acc_name"
                placeholder={tr[localStorage.getItem("language")].pilih}
                itemTemplate={glTemplate}
                valueTemplate={valueTemp}
                errorMessage="Akun Distribusi GL Belum Dipilih"
                error={error?.acc_id}
              />
            </div>

            <div className="col-6">
              <PrimeDropdown
                label={tr[localStorage.getItem("language")].currency}
                value={currentItem !== null ? curr(currentItem?.bank?.CURRENCY) : null}
                options={currency}
                onChange={(e) => {
                  console.log(e.value);
                  setCurrentItem({
                    ...currentItem,
                      bank: { ...currentItem.bank, CURRENCY: e?.value?.id },
                  });
                }}
                optionLabel="code"
                filter
                filterBy="code"
                placeholder={tr[localStorage.getItem("language")].pilih}
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
                  value={
                    currentItem !== null ? `${currentItem?.bank?.BANK_DESC}` : ""
                  }
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      bank: { ...currentItem.bank, BANK_DESC: e.target.value },
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
            tr[localStorage.getItem("language")].bank
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

  if (popUp) {
    return (
      <>
        <Dialog
          header={"Data Bank"}
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

export default DataBank;
