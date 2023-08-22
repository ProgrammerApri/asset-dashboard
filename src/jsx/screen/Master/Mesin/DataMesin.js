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
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_MSN, SET_EDIT_MSN, SET_MSN } from "src/redux/actions";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { Divider } from "primereact/divider";
import { Tooltip } from "primereact/tooltip";

const def = {
  id: 1,
  msn_code: null,
  msn_name: null,
  max_sdm: null,
  clean_up: null,
  ttl_kerja: null,
  ttl_kerja_msn: null,
  bts_bwh_toleransi: null,
  bts_atas_toleransi: null,
  desc: null,
};

const defError = {
  code: false,
  name: false,
  max_sdm: false,
  clean_up: false,
};

const DataMesin = ({
  data,
  load,
  onSuccessInput,
  onRowSelect,
  popUp,
  show,
  onHide = () => {},
  onInput = () => {},
}) => {
  const msn = useSelector((state) => state.msn.current);
  const isEdit = useSelector((state) => state.msn.editMsn);
  const [isEditt, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [displayClean, setDisplayClean] = useState(false);
  const [position, setPosition] = useState("center");
  const [currentItem, setCurrentItem] = useState(def);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const [error, setError] = useState(defError);

  useEffect(() => {
    initFilters1();
  }, []);

  const editMesin = async () => {
    // setLoading(true);
    const config = {
      ...endpoints.editMesin,
      endpoint: endpoints.editMesin.endpoint + msn.id,
      data: msn,
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
          onSuccessInput(true);
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

  const addMesin = async () => {
    // setLoading(true);
    const config = {
      ...endpoints.addMesin,
      data: msn,
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
          onSuccessInput(true);
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
            detail: `Kode ${msn.msn_code} Sudah Digunakan`,
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

  const delDataMesin = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delMesin,
      endpoint: endpoints.delMesin.endpoint + currentItem.id,
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
          onSuccessInput(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Dihapus",
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
          detail: `Tidak Dapat Menghapus Data`,
          life: 3000,
        });
      }, 500);
    }
  };

  const cleanMesin = async () => {
    // setLoading(true);
    const config = {
      ...endpoints.cleanMesin,
      endpoint: endpoints.cleanMesin.endpoint + msn.id,
      data: msn,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDisplayClean(false);
          onSuccessInput(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Mesin Berhasil Clean Up",
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
          detail: "Gagal Clean Up Mesin",
          life: 3000,
        });
      }, 500);
    }
  };

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Tooltip target={".btn"} />
        <Link
          data-pr-tooltip="Clean Up Mesin"
          data-pr-position="right"
          data-pr-my="left center-2"
          onClick={() => {
            setDisplayClean(
              dispatch({
                type: SET_EDIT_MSN,
                payload: true,
              }),
              dispatch({
                type: SET_CURRENT_MSN,
                payload: data,
              })
            );
          }}
          className="btn btn-info shadow btn-xs sharp ml-1"
        >
          <i className="bx bx-refresh mt-1"></i>
        </Link>

        <Link
          onClick={() => {
            setDisplayData(
              dispatch({
                type: SET_EDIT_MSN,
                payload: true,
              }),
              dispatch({
                type: SET_CURRENT_MSN,
                payload: data,
              })
            );
            // setDisplayData(true);
            // setCurrentItem(data);
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

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editMesin();
      } else {
        setUpdate(true);
        addMesin();
      }
    }
  };

  const renderFooter = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => {
            setDisplayData(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Simpan"
          icon="pi pi-check"
          onClick={onSubmit}
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
          onClick={() => {
            setDisplayDel(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Hapus"
          icon="pi pi-trash"
          onClick={() => {
            delDataMesin();
          }}
          autoFocus
          loading={update}
        />
      </div>
    );
  };

  const renderFooterClean = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => {
            setDisplayDel(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Clean"
          icon="pi pi-check"
          onClick={() => {
            setUpdate(true);
            cleanMesin();
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
            setDisplayData(
              dispatch({
                type: SET_EDIT_MSN,
                payload: false,
              }),
              dispatch({
                type: SET_CURRENT_MSN,
                payload: {
                  ...data,
                  msn_code: null,
                  msn_name: null,
                  max_sdm: null,
                  clean_up: null,
                  ttl_kerja: null,
                  ttl_kerja_msn: null,
                  bts_bwh_toleransi: null,
                  bts_atas_toleransi: null,
                  desc: null,
                },
              })
            );
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

  const updateMSN = (e) => {
    dispatch({
      type: SET_CURRENT_MSN,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !msn.msn_code || msn.msn_code === "",
      name: !msn.msn_name || msn.msn_name === "",
      max_sdm: !msn.max_sdm || msn.max_sdm === "",
      clean_up: !msn.clean_up || msn.clean_up === "",
    };

    valid = !errors.code && !errors.name && !errors.max_sdm && !errors.clean_up;

    setError(errors);

    valid = !errors.code && !errors.name && !errors.max_sdm && !errors.clean_up;

    return valid;
  };

  const formatIdr = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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
          globalFilterFields={["msn_code", "msn_name", "desc"]}
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
            header="Kode Mesin"
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e.msn_code}
            body={load && <Skeleton />}
          />
          <Column
            header="Nama Mesin"
            field={(e) => e.msn_name}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Clean Up (Jam)"
            field={(e) => formatIdr(e.clean_up ?? 0)}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Total Kerja (Jam)"
            field={(e) => formatIdr(e.ttl_kerja ?? 0)}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Total Kerja Mesin (Jam)"
            field={(e) => formatIdr(e.ttl_kerja_msn ?? 0)}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Keterangan"
            field={(e) => (e?.desc !== "" ? e.desc : "-")}
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
          header={isEdit ? "Edit Data Mesin" : "Tambah Data Mesin"}
          visible={displayData}
          style={{ width: "45vw" }}
          footer={renderFooter()}
          onHide={() => {
            // setEdit(false);
            setDisplayData(false);
            onInput(false);
          }}
        >
          <div className="row ml-0 mt-0">
            <div className="col-6">
              <PrimeInput
                label={"Kode Mesin"}
                value={msn.msn_code}
                onChange={(e) => {
                  updateMSN({ ...msn, msn_code: e.target.value });
                  let newError = error;
                  newError.code = false;
                  setError(newError);
                }}
                placeholder="Masukan Kode Mesin"
                error={error?.code}
              />
            </div>

            <div className="col-6">
              <PrimeInput
                label={"Nama Mesin"}
                value={msn.msn_name}
                onChange={(e) => {
                  updateMSN({ ...msn, msn_name: e.target.value });
                  let newError = error;
                  newError.name = false;
                  setError(newError);
                }}
                placeholder="Masukan Nama Mesin"
                error={error?.name}
              />
            </div>
          </div>
          <div className="col-12 text-black">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputText
                value={msn.desc}
                onChange={(e) => updateMSN({ ...msn, desc: e.target.value })}
                placeholder="Masukan Keterangan"
              />
            </div>
          </div>

          <div className="col-12 mt-3">
            <label className="text-label fs-14">
              <b>Estimasi pekerjaan</b>
            </label>
            <Divider></Divider>
          </div>

          <div className="row ml-0 mt-0">
            <div className="col-3">
              <PrimeNumber
                price
                label={"Max SDM"}
                value={msn.max_sdm}
                onChange={(e) => {
                  updateMSN({ ...msn, max_sdm: e.value });
                  let newError = error;
                  newError.max_sdm = false;
                  setError(newError);
                }}
                placeholder="0"
                type="number"
                error={error?.max_sdm}
                // error={error?.name}
              />
            </div>
            <div className="col-3">
              <PrimeNumber
                price
                label={"Clean Up"}
                value={msn.clean_up}
                onChange={(e) => {
                  updateMSN({ ...msn, clean_up: e.value });
                  let newError = error;
                  newError.clean_up = false;
                  setError(newError);
                }}
                placeholder="0"
                type="number"
                error={error?.clean_up}
                // error={error?.code}
              />
            </div>

            <div className="col-3" hidden>
              <label> Total Pekerjaan</label>
              <InputText
                price
                value={msn.ttl_kerja}
                onChange={(e) => {
                  updateMSN({ ...msn, ttl_kerja: e.value });
                }}
                placeholder="0"
                type="number"
                disabled
              />
            </div>
            <div className="col-3" hidden>
              <label> Total Pekerjaan Mesin</label>
              <InputText
                price
                value={msn.ttl_kerja_msn}
                onChange={(e) => {
                  updateMSN({ ...msn, ttl_kerja_msn: e.value });
                }}
                placeholder="0 "
                type="number"
                disabled
                onHide
              />
            </div>
          </div>
          <div className="row ml-0 mt-0">
            <div className="col-6">
              <PrimeInput
                label={"Batas Bawah Toleransi"}
                value={msn.bts_bwh_toleransi}
                onChange={(e) => {
                  updateMSN({ ...msn, bts_bwh_toleransi: e.target.value });
                  // let newError = error;
                  // newError.code = false;
                  // setError(newError);
                }}
                placeholder="Masukan Disini"
                // type="number"
                // error={error?.code}
              />
            </div>

            <div className="col-6">
              <PrimeInput
                label={"Batas Atas Toleransi"}
                value={msn.bts_atas_toleransi}
                onChange={(e) => {
                  updateMSN({ ...msn, bts_atas_toleransi: e.target.value });
                  // let newError = error;
                  // newError.name = false;
                  // setError(newError);
                }}
                placeholder="Masukan Disini"
                // type="number"
                // error={error?.name}
              />
            </div>
          </div>
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

        <Dialog
          header={"Clean Up Mesin"}
          visible={displayClean}
          style={{ width: "30vw" }}
          footer={renderFooterClean("displayClean")}
          onHide={() => {
            setDisplayClean(false);
          }}
        >
          <div className="ml-3 mr-3">
            <i
              className="pi pi-exclamation-triangle mr-3 align-middle"
              style={{ fontSize: "2rem" }}
            />
            <span>
              {`Apakah anda yakin ingin clean up mesin ${msn.msn_code} ?`}{" "}
            </span>
          </div>
        </Dialog>
      </>
    );
  };

  if (popUp) {
    return (
      <>
        <Dialog
          header={"Data Mesin"}
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

export default DataMesin;