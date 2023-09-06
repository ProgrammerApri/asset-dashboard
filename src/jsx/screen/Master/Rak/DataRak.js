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
import { SET_CURRENT_RAK, SET_EDIT_RAK } from "src/redux/actions";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import { InputSwitch } from "primereact/inputswitch";
import { Badge } from "primereact/badge";
import { tr } from "src/data/tr";

const def = {
  id: 1,
  rak_code: null,
  rak_name: null,
  lokasi_rak: null,
};

const defError = {
  code: false,
  name: false,
  // mts: false,
};

const mts = [
  { name: "Y", id: 1 },
  { name: "N", id: 0 },
];

const DataRak = ({
  data,
  load,
  onSuccessInput,
  onRowSelect,
  popUp,
  show,
  onHide = () => {},
  onInput = () => {},
}) => {
  const rak = useSelector((state) => state.rak.current);
  const isEdit = useSelector((state) => state.rak.editRak);
  const [isEditt, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [position, setPosition] = useState("center");
  const [currentItem, setCurrentItem] = useState(def);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const [error, setError] = useState(defError);

  useEffect(() => {
    initFilters1();
    getLok();
  }, []);

  const editRak = async () => {
    // setLoading(true);
    const config = {
      ...endpoints.editRak,
      endpoint: endpoints.editRak.endpoint + rak.id,
      data: rak,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        // setTimeout(() => {
        setUpdate(false);
        setDisplayData(false);
        onSuccessInput(true);
        toast.current.show({
          severity: "info",
          summary: "Berhasil",
          detail: "Data Berhasil Diperbarui",
          life: 3000,
        });
        // }, 500);
      }
    } catch (error) {
      // setTimeout(() => {
      setUpdate(false);
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: "Gagal Memperbarui Data",
        life: 3000,
      });
      // }, 500);
    }
  };

  const getLok = async () => {
    const config = {
      ...endpoints.lokasi,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setLokasi(data);
      }
    } catch (error) {}
  };

  const addRak = async () => {
    // setLoading(true);
    const config = {
      ...endpoints.addRak,
      data: rak,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setUpdate(false);
        setDisplayData(false);
        onSuccessInput(true);
        toast.current.show({
          severity: "info",
          summary: "Berhasil",
          detail: "Data Berhasil Diperbarui",
          life: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        // setTimeout(() => {
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: `Kode ${rak.rak_code} Sudah Digunakan`,
          life: 3000,
        });
        // }, 500);
      } else {
        // setTimeout(() => {
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
          life: 3000,
        });
        // }, 500);
      }
    }
  };

  const delDataRak = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delRak,
      endpoint: endpoints.delRak.endpoint + currentItem.id,
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

  const checkLokasi = (value) => {
    let selected = {};
    lokasi?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            setDisplayData(
              dispatch({
                type: SET_EDIT_RAK,
                payload: true,
              }),
              dispatch({
                type: SET_CURRENT_RAK,
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
        editRak();
      } else {
        setUpdate(true);
        addRak();
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
            delDataRak();
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
                type: SET_EDIT_RAK,
                payload: false,
              }),
              dispatch({
                type: SET_CURRENT_RAK,
                payload: {
                  ...data,
                  rak_code: null,
                  rak_name: null,
                  lokasi_rak: null,
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

  const updateRAK = (e) => {
    dispatch({
      type: SET_CURRENT_RAK,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !rak.rak_code || rak.rak_code === "",
      name: !rak.rak_name || rak.rak_name === "",
    };

    valid = !errors.code && !errors.name;

    setError(errors);

    valid = !errors.code && !errors.name;

    return valid;
  };

  const renderBody = (e) => {
    console.log("data", e);

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
          globalFilterFields={["rak_code", "rak_name", "lokasi_rak"]}
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
            header="Kode Rak"
            style={{
              minWidth: "8rem",
            }}
            field={(e) => e.rak_code}
            body={load && <Skeleton />}
          />
          <Column
            header="Nama Rak"
            field={(e) => e.rak_name}
            style={{ minWidth: "8rem" }}
            body={load && <Skeleton />}
          />
          <Column
            header="Lokasi Rak"
            field={(e) => checkLokasi(e.lokasi_rak).name ?? "-"}
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
          header={isEdit ? "Edit Data Rak" : "Tambah Data Rak"}
          visible={displayData}
          style={{ width: "40vw" }}
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
                label={"Kode Rak"}
                value={rak?.rak_code}
                onChange={(e) => {
                  updateRAK({ ...rak, rak_code: e.target.value });
                  let newError = error;
                  newError.code = false;
                  setError(newError);
                }}
                placeholder="Masukan Kode Rak"
                error={error?.code}
              />
            </div>

            <div className="col-6">
              <PrimeInput
                label={"Nama Rak"}
                value={rak?.rak_name}
                onChange={(e) => {
                  updateRAK({ ...rak, rak_name: e.target.value });
                  let newError = error;
                  newError.name = false;
                  setError(newError);
                }}
                placeholder="Masukan Nama Rak"
                error={error?.name}
              />
            </div>

            <div className="col-4">
              <PrimeDropdown
                label={"Lokasi Rak"}
                value={rak.lokasi_rak && checkLokasi(rak.lokasi_rak)}
                options={lokasi}
                onChange={(e) => {
                  updateRAK({ ...rak, lokasi_rak: e.target.value.id });
                }}
                placeholder={tr[localStorage.getItem("language")].masuk}
                optionLabel="name"
                filter
                filterBy="name"
                // errorMessage="Grup Produk Belum Dipilih"
                // disabled={isEdit}
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
      </>
    );
  };

  if (popUp) {
    return (
      <>
        <Dialog
          header={"Data Rak"}
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

export default DataRak;
