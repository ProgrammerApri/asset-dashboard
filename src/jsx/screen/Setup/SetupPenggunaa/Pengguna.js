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
import {
  SET_CURRENT_EXP,
  SET_EDIT_EXP,
  SET_EXP,
  SET_USER,
} from "src/redux/actions";
import { Skeleton } from "primereact/skeleton";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";

const def = {
  id: null,
  username: null,
  email: null,
  password: null,
  active: true,
  menu: [],
};

const Pengguna = ({ onAdd, onDetail, del, onInput = () => {}, }) => {
  const [loading, setLoading] = useState(true);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [showInput, setShowInput] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [current, setCurrent] = useState(def);
  // const [edit, setEdit] = useState("");
  const [dep, setDep] = useState(null);
  const [proj, setProj] = useState(null);
  const [edit, setEdit] = useState(false);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
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
      ...endpoints.user,
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
        {edit && (
          <Link
            onClick={() => {
              setEdit(true);
              setCurrent(data);
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
              setCurrent(data);
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

  const renderFooterDel = () => {
    return (
      <div>
        <PButton
          label="Batal"
          // onClick={() => setDisplayDel(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Hapus"
          icon="pi pi-trash"
          onClick={() => {}}
          autoFocus
          loading={loading}
        />
      </div>
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
            onAdd();
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

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
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
                            <i className="bx bx-x text-danger mr-1"></i> Tidak Aktif
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
