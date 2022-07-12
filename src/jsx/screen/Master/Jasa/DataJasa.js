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
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";

const def = {
  jasa: {
    id: null,
    code: null,
    name: null,
    desc: null,
    acc_id: null,
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
  acc1: false,
};

const DataJasa = ({
  data,
  load,
  popUp = false,
  show = false,
  onHide = () => {},
  onInput = () => {},
  onRowSelect,
  onSuccessInput,
}) => {
  const [account, setAccount] = useState(null);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [currentItem, setCurrentItem] = useState(def);
  const [isEdit, setEdit] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [error, setError] = useState(defError);

  useEffect(() => {
    getAccount();
    initFilters1();
  }, []);

  const getAccount = async () => {
    console.log("-------------------");
    // console.log(currentItem);
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
        // let filt = [];
        // data.forEach((element) => {
        //   if (element.account.kat_code === 2 && element.account.connect) {
        //     filt.push(element.account);
        //   }
        // });
        console.log(data);
        setAccount(data);
      }
    } catch (error) {}
  };

  const editJasa = async () => {
    setLoading(true);
    const config = {
      ...endpoints.editJasa,
      endpoint: endpoints.editJasa.endpoint + currentItem.jasa.id,
      data: {
        code: currentItem.jasa.code,
        name: currentItem.jasa.name,
        desc: currentItem.jasa.desc,
        acc_id: currentItem.account.account.id,
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

  const addJasa = async () => {
    setLoading(true);
    const config = {
      ...endpoints.addJasa,
      data: {
        code: currentItem.jasa.code,
        name: currentItem.jasa.name,
        desc: currentItem.jasa.desc,
        acc_id: currentItem.account.account.id,
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
            detail: `Kode ${currentItem.jasa.code} Sudah Digunakan`,
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

  const delJasa = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delJasa,
      endpoint: endpoints.delJasa.endpoint + currentItem.jasa.id,
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
      setTimeout(() => {
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: `Tidak Dapat Menghapus Data`,
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
          className="btn btn-primary shadow btn-xs sharp ml-2"
        >
          <i className="fa fa-pencil"></i>
        </Link>

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
      </div>
      // </React.Fragment>
    );
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
                editJasa();
              } else {
                addJasa();
              }
            }
          }}
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
          label="Batal"
          onClick={() => {
            setShowDelete(false);
            setLoading(false);
            onInput(false);
          }}
          className="p-button-text btn-s btn-primary"
        />
        <PButton
          label="Hapus"
          className="p-button btn-s btn-primary"
          icon="pi pi-trash"
          onClick={() => {
            delJasa();
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

  const glTemplate = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.account.acc_name} - (${option.account.acc_code})`
          : ""}
      </div>
    );
  };

  const clear = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.account.acc_name} - (${option.account.acc_code})`
            : ""}
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
      code: !currentItem.jasa.code || currentItem.jasa.code === "",
      name: !currentItem.jasa.name || currentItem.jasa.name === "",
      acc1: !currentItem?.account?.id,
    };

    setError(errors);

    valid = !errors.code && !errors.name && !errors.acc1;

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
            "jasa.code",
            "jasa.name",
            "jasa.desc",
            "account.acc_name",
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
            header="Kode Jasa"
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e.jasa.code}
            body={load && <Skeleton />}
          />
          <Column
            header="Nama Jasa"
            field={(e) => e.jasa.name}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Akun Distribusi GL"
            field={(e) => e.account.acc_name}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Keterangan"
            field={(e) => e.jasa?.desc ?? "-"}
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
          header={isEdit ? "Edit Jasa" : "Tambah Jasa"}
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
                label={"Kode Jasa"}
                value={
                  currentItem !== null ? `${currentItem?.jasa?.code ?? ""}` : ""
                }
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    jasa: { ...currentItem.jasa, code: e.target.value },
                  });
                  let newError = error;
                  newError.code = false;
                  setError(newError);
                }}
                placeholder="Masukan Kode Jasa"
                error={error?.code}
              />
            </div>

            <div className="col-6">
              <PrimeInput
                label={"Nama Jasa"}
                value={
                  currentItem !== null ? `${currentItem?.jasa?.name ?? ""}` : ""
                }
                onChange={(e) => {
                  setCurrentItem({
                    ...currentItem,
                    jasa: { ...currentItem.jasa, name: e.target.value },
                  });
                  let newError = error;
                  newError.name = false;
                  setError(newError);
                }}
                placeholder="Masukan Nama Jasa"
                error={error?.name}
              />
            </div>
          </div>

          <div className="row ml-0 mt-0">
            <div className="col-12">
              <PrimeDropdown
                label={"Akun Distribusi GL"}
                value={currentItem !== null ? currentItem.account : null}
                options={account}
                onChange={(e) => {
                  console.log(e.value);
                  setCurrentItem({
                    ...currentItem,
                    account: e.value,
                  });
                  let newError = error;
                  newError.acc1 = false;
                  setError(newError);
                }}
                optionLabel="acc_name"
                valueTemplate={clear}
                itemTemplate={glTemplate}
                filter
                filterBy="acc_name"
                placeholder="Pilih Akun Distribusi GL"
                errorMessage="Akun Distribusi Belum Dipilih"
                error={error?.acc1}
                // showClear
              />
            </div>
          </div>

          <div className="row ml-0 mt-0">
            <div className="col-12">
              <label className="text-label">Keterangan</label>
              <div className="p-inputgroup">
                <InputTextarea
                  value={
                    currentItem !== null
                      ? `${currentItem?.jasa?.desc ?? ""}`
                      : ""
                  }
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      jasa: { ...currentItem.jasa, desc: e.target.value },
                    })
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
          <div className="ml-2 mr-3">
            <i
              className="pi pi-exclamation-triangle mr-2 align-middle"
              style={{ fontSize: "1rem" }}
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
          header={"Data Jasa"}
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

export default DataJasa;
