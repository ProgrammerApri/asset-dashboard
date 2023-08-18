import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge, Button, Card, Row, Col } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_FM, SET_EDIT_FM, SET_FM } from "src/redux/actions";
import { Divider } from "@material-ui/core";
import ReactToPrint from "react-to-print";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Tooltip } from "primereact/tooltip";
import { Timeline } from "primereact/timeline";

const data = {
  id: null,
  fcode: null,
  fname: null,
  ra_id: null,
  version: null,
  rev: null,
  desc: null,
  active: null,
  all_total: null,
  product: [],
  material: [],
  req_form: [],
};

const DataFormula = ({ onAdd, onEdit, onDetail }) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const forml = useSelector((state) => state.forml.forml);
  const show = useSelector((state) => state.forml.current);
  const profile = useSelector((state) => state.profile.profile);
  const [expandedRows, setExpandedRows] = useState(null);
  const printPage = useRef(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getFormula();
    initFilters1();
  }, []);

  const getFormula = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.formula,
      data: forml,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        dispatch({ type: SET_FM, payload: data });
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

  const delFM = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delFormula,
      endpoint: endpoints.delFormula.endpoint + currentItem.id,
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
          getFormula(true);
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

  const actionBodyTemplate = (data) => {
    return data?.id ? (
      // <React.Fragment>
      <div className="d-flex">
        {/* <Link
          onClick={() => {
            onDetail();
            let dprod = data.dprod;
            let djasa = data.djasa;
            dispatch({
              type: SET_CURRENT_ODR,
              payload: {
                ...data,
                dprod:
                  dprod.length > 0
                    ? dprod
                    : [
                        {
                          id: 0,
                          do_id: null,
                          prod_id: null,
                          unit_id: null,
                          location: null,
                          order: null,
                          price: null,
                          disc: null,
                          nett_price: null,
                          total: null,
                        },
                      ],
                djasa:
                  djasa.length > 0
                    ? djasa
                    : [
                        {
                          id: 0,
                          do_id: null,
                          jasa_id: null,
                          sup_id: null,
                          unit_id: null,
                          order: null,
                          price: null,
                          disc: null,
                          total: null,
                        },
                      ],
              },
            });
          }}
          className="btn btn-info shadow btn-xs sharp ml-1"
        >
          <i className="bx bx-show mt-1"></i>
        </Link> */}

        <Link
          onClick={() => {
            onEdit(data);
            let product = data.product;
            dispatch({
              type: SET_EDIT_FM,
              payload: true,
            });
            product.forEach((el) => {
              el.prod_id = el.prod_id?.id;
              el.unit_id = el.unit_id?.id;
            });
            let material = data.material;
            material.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });
            let req_form = data.req_form;
            req_form.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });
            dispatch({
              type: SET_CURRENT_FM,
              payload: {
                ...data,
                ra_id: data?.ra_id?.id ?? null,
                version: data?.version + 1,
                rev: data?.rev + 1,
                product:
                  product.length > 0
                    ? product
                    : [
                        {
                          id: 0,
                          form_id: null,
                          prod_id: null,
                          unit_id: null,
                          qty: null,
                          aloc: null,
                        },
                      ],
                material:
                  material.length > 0
                    ? material
                    : [
                        {
                          id: 0,
                          form_id: null,
                          prod_id: null,
                          unit_id: null,
                          qty: null,
                          konv_qty: null,
                          unit_konv: null,
                          price: null,
                        },
                      ],
                req_form: req_form.length > 0 ? req_form : null,
              },
            });
          }}
          className="btn btn-primary shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          onClick={() => {
            // setEdit(true);
            setDisplayDel(true);
            setCurrentItem(data);
          }}
          className="btn btn-danger shadow btn-xs sharp ml-1"
        >
          <i className="fa fa-trash"></i>
        </Link>
      </div>
    ) : (
      // </React.Fragment>
      <div className="d-flex">
        <Tooltip target={".btn"} />
        <Link
          data-pr-tooltip="Create Formula"
          data-pr-position="right"
          data-pr-my="left center-2"
          onClick={() => {
            onEdit();
            dispatch({
              type: SET_EDIT_FM,
              payload: false,
            });

            let product = data.product;
            product?.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });
            let material = data.material;
            material?.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });
            let req_form = data.req_form;
            req_form?.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });

            dispatch({
              type: SET_CURRENT_FM,
              payload: {
                ...data,
                ra_id: data?.ra_id?.id ?? null,
                active: false,
                version: 1,
                product:
                  product?.length > 0
                    ? product
                    : [
                        {
                          id: 0,
                          form_id: null,
                          prod_id: null,
                          unit_id: null,
                          qty: null,
                          aloc: null,
                        },
                      ],
                material:
                  material?.length > 0
                    ? material
                    : [
                        {
                          id: 0,
                          form_id: null,
                          prod_id: null,
                          unit_id: null,
                          qty: null,
                          konv_qty: null,
                          unit_konv: null,
                          price: null,
                          total: null,
                        },
                      ],
                req_form:
                  req_form?.length > 0
                    ? req_form
                    : [
                        {
                          id: 0,
                          form_id: null,
                          prod_id: null,
                          unit_id: null,
                        },
                      ],
              },
            });
          }}
          // className={`btn ${
          //   data.status === 0 ? "" : "disabled"
          // } btn-primary shadow btn-xs sharp ml-1`}
          className={`btn btn-primary shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-plus"></i>
        </Link>
      </div>
    );
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
            delFM();
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
            placeholder="Cari disini"
          />
        </span>
        <PrimeSingleButton
          label="Tambah"
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            onAdd();
            dispatch({
              type: SET_EDIT_FM,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_FM,
              payload: {
                ...data,
                active: false,
                version: 1,
                product: [
                  {
                    id: 0,
                    form_id: 0,
                    prod_id: null,
                    unit_id: null,
                    qty: null,
                    aloc: 100,
                  },
                ],
                material: [
                  {
                    id: 0,
                    form_id: 0,
                    prod_id: null,
                    unit_id: null,
                    qty: null,
                    konv_qty: null,
                    unit_konv: null,
                    price: null,
                    total: null,
                  },
                ],
                req_form: [
                  {
                    id: 0,
                    form_id: null,
                    prod_id: null,
                    unit_id: null,
                  },
                ],
              },
            });
          }}
        />
      </div>
    );
  };

  const formatDateTime = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = "" + d.getFullYear(),
      hour = "" + d.getHours(),
      minute = "" + d.getMinutes(),
      second = "" + d.getSeconds();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hour.length < 2) hour = "0" + hour;
    if (minute.length < 2) minute = "0" + minute;
    if (second.length < 2) second = "0" + second;

    return `${[day, month, year].join("-")} || ${[hour, minute, second].join(
      ":"
    )}`;
  };

  const customizedMarker = (item, index, data) => {
    console.log(index);
    return (
      <span
        className="flex align-items-center justify-content-center z-1 p-1 border-circle"
        style={{
          backgroundColor: !item.approved
            ? "red"
            : item.complete
            ? "#21BF99"
            : "white",
          border: !item.approved ? "2px solid red" : "2px solid #21BF99",
        }}
      >
        <i
          className={!item.approved ? "pi pi-times" : "pi pi-check"}
          style={{ fontSize: "0.4rem", fontWeight: "bold", color: "white" }}
        ></i>
      </span>
    );
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="row">
        <div className="col-12 pb-0">
          <Timeline
            value={data.timeline}
            layout="horizontal"
            align="top"
            marker={(item, index) => customizedMarker(item, index, data)}
            content={(item) => (
              <div
                className=""
                style={{
                  minWidth: "12rem",
                  minHeight: "4.5rem",
                  // maxHeight: "8rem",
                }}
              >
                <div className="pt-0 mt-0">
                  <b>{item.label}</b>
                </div>
                <div className="fs-12">
                  {item?.date ? formatDateTime(item?.date) : "-"}
                </div>

                <div className="fs-12">{item.approved_by}</div>

                <div className="fs-12">{item.reason}</div>
              </div>
            )}
          />
        </div>
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

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  return (
    <>
      <Toast ref={toast} />
      <DataTable
        responsiveLayout="scroll"
        value={loading ? dummy : forml}
        className="display w-150 datatable-wrapper"
        showGridlines
        dataKey="id"
        rowHover
        header={renderHeader}
        filters={filters1}
        globalFilterFields={["fcode", "fname", "date_created"]}
        emptyMessage="Tidak ada data"
        paginator
        paginatorTemplate={template2}
        first={first2}
        rows={rows2}
        onPage={onCustomPage2}
        paginatorClassName="justify-content-end mt-3"
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
      >
        <Column expander style={{ width: "3em" }} />

        <Column
          header="Tanggal Formula"
          style={{
            minWidth: "8rem",
          }}
          field={(e) => formatDate(e.date_created)}
          body={loading && <Skeleton />}
        />
        <Column
          header="Kode Formula"
          field={(e) => e.fcode ?? "-"}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        />
        <Column
          header="Nama Formula"
          field={(e) => e.fname ?? "-"}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        />
        <Column
          header="Request Formula"
          field={(e) => (e?.ra_id ? e.ra_id?.ra_code : "-")}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        />
        <Column
          header="Versi Formula"
          field={(e) => (e?.version ? e.version : "-")}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        />
        <Column
          header="Revisi"
          field={(e) => (e?.rev ? e.rev : "-")}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
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
    </>
  );
};

export default DataFormula;
