import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "react-bootstrap";
import { Row, Col, Card, Badge } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_USER, SET_EDIT_USER, SET_USER } from "src/redux/actions";
import { Skeleton } from "primereact/skeleton";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import { InputTextarea } from "primereact/inputtextarea";

const def = {
  id: null,
  username: null,
  email: null,
  password: null,
  active: true,
  menu: [],
};
const defError = {
  username: false,
  email: false,
};

const Pengguna = ({ onAdd, onEdit }) => {
  const [loading, setLoading] = useState(true);
  const [displayDel, setDisplayDel] = useState(false);
  // const [currentItem, setCurrentItem] = useState(null);
  const [update, setUpdate] = useState(true);
  const toast = useRef(null);
  const [showInput, setShowInput] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [current, setCurrent] = useState(def);
  // const [edit, setEdit] = useState("");
  // const [dep, setDep] = useState(null);
  // const [proj, setProj] = useState(null);
  const [edit, setEdit] = useState(false);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [error, setError] = useState(defError);
  const [displayData, setDisplayDat] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    initFilters1();
    getUser();
  }, []);

  const getUser = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.getUser,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        const { data } = response;
        dispatch({ type: SET_USER, payload: data });
        setLoading(false);
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

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            onEdit(data);
            dispatch({
              type: SET_EDIT_USER,
              payload: true,
            })
            dispatch({
              type: SET_CURRENT_USER,
              payload: data
            });
          }}
          className={`btn btn-primary shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          onClick={() => {
            setEdit(true);
            setDisplayDel(true);
            setCurrent(data);
          }}
          className={`btn btn-danger shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-trash"></i>
        </Link>
      </div>
      // </React.Fragment>
    );
  };

  const delUSER = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delUSER,
      endpoint: endpoints.delUSER.endpoint + current.id,
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
          getUser(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Dihapus",
            life: 3000,
          });
        }, 100);
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
  const editUSER = async () => {
    setLoading(true);
    const config = {
      ...endpoints.editUSER,
      endpoint: endpoints.editUSER.endpoint + current.id,
      data: {
        username: current.username,
        email: current.email,
        password: current.password,
        active: current.active,
        menu: [],
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          // onSuccessInput();
          setLoading(false);
          onHideInput();
          // onInput(false);
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
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
          life: 3000,
        });
      }, 500);
    }
  };
  const onHideInput = () => {
    setLoading(false);
    setCurrent(def);
    setEdit(false);
    setShowInput(false);
    // onInput(false);
  };

  const renderFooterDel = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => setDisplayDel(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Hapus"
          icon="pi pi-trash"
          onClick={() => {
            delUSER();
          }}
          autoFocus
          loading={loading}
        />
      </div>
    );
  };

  const renderDialog = () => {
    return (
      <>
        <Toast ref={toast} />
        <Dialog
          header={edit ? "Edit Pengguna" : "Tambah Pengguna"}
          visible={showInput}
          style={{ width: "40vw" }}
          footer={renderFooter()}
          onHide={onHideInput}
        >
          <div className="row mr-0 ml-0">
            <div className="col-6">
              <PrimeInput
                label={"Kode Jenis Pelanggan"}
                value={`${current?.jpel_code}`}
                onChange={(e) => {
                  setCurrent({
                    ...current,
                    jpel_code: e.target.value,
                  });
                  let newError = error;
                  newError.code = false;
                  setError(newError);
                }}
                placeholder="Masukan Kode"
                error={error?.code}
              />
            </div>

            <div className="col-6">
              <PrimeInput
                label={"Nama Jenis Pelanggan"}
                value={`${current?.jpel_name}`}
                onChange={(e) => {
                  setCurrent({
                    ...current,
                    jpel_name: e.target.value,
                  });
                  let newError = error;
                  newError.name = false;
                  setError(newError);
                }}
                placeholder="Masukan Nama Jenis Pelanggan"
                error={error?.name}
              />
            </div>
          </div>

          <div className="row mr-0 ml-0">
            <div className="col-12">
              <label className="text-label">Keterangan</label>
              <div className="p-inputgroup">
                <InputTextarea
                  value={`${current?.jpel_ket}`}
                  onChange={(e) =>
                    setCurrent({ ...current, jpel_ket: e.target.value })
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
            // onInput(false);
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

  const renderFooter = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => setDisplayDat(false)}
          className="p-button-text btn-primary"
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
            dispatch({
              type: SET_EDIT_USER,
              payload: false,
            })
            dispatch({
              type: SET_CURRENT_USER,
              payload: {
                id: null
              }
            });
            onAdd();
            setShowInput(true);
            setEdit(false);
            setLoading(false);
            setCurrent(def);
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

  return (
    <>
      <Row>
        <Col className="pt-0">
          <Card>
            <Card.Body>
              <Toast ref={toast} />
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : user}
                className="display w-150 datatable-wrapper"
                // rowExpansionTemplate={rowExpansionTemplate}
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={null}
                globalFilterFields={["username"]}
                emptyMessage="Tidak ada data"
                paginator
                paginatorTemplate={template2}
                first={first2}
                rows={rows2}
                onPage={onCustomPage2}
                paginatorClassName="justify-content-end mt-3"
              >
                <Column
                  header="Username"
                  field="username"
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Email"
                  field="email"
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Active"
                  field="active"
                  style={{ minWidth: "8rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div>
                        {e.active ? (
                          <Badge variant="success light">
                            <i className="bx bx-check text-success mr-1"></i>{" "}
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="danger light">
                            <i className="bx bx-x text-danger mr-1"></i> Tidak
                            Aktif
                          </Badge>
                        )}
                      </div>
                    )
                  }
                />

                <Column
                  header="Action"
                  dataType="boolean"
                  bodyClassName="text-center"
                  style={{ minWidth: "2rem" }}
                  body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
                />
              </DataTable>

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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Pengguna;
