import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
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
import { SET_CURRENT_PP, SET_EDIT_PP, SET_PP } from "src/redux/actions";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import endpoints from "../../../../utils/endpoints";
import { tr } from "../../../../data/tr";
import {
  SET_CURRENT_HRV,
  SET_EDIT_HRV,
  SET_HRV,
} from "../../../../redux/actions";

const data = {
  id: null,
  code: null,
  name: null,
  date: null,
  proj_id: null,
  desc: null,
  hrv_det: [],
};

const DataPanen = ({ onAdd, onEdit, onDetail }) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);
  const [dept, setDept] = useState(true);
  const [product, setProduct] = useState(null);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const hrv = useSelector((state) => state.hrv.hrv);
  const show = useSelector((state) => state.hrv.current);
  const [expandedRows, setExpandedRows] = useState(null);
  const printPage = useRef(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getHarvest();
    getProduct();
    initFilters1();
  }, []);

  const getHarvest = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.harvest,
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
          if (!element.closing) {
            filt.push(element);
          }
        });
        dispatch({ type: SET_HRV, payload: filt });
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

  const getProduct = async () => {
    const config = {
      ...endpoints.product,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setProduct(data);
      }
    } catch (error) {}
  };

  const getDept = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.pusatBiaya,
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
        setDept(data);
      }
    } catch (error) {}
  };

  const delPprod = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delHrv,
      endpoint: endpoints.delHrv.endpoint + currentItem.id,
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
          getHarvest(true);
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
        setUpdate(false);
        setDisplayDel(false);
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
      //  <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            onEdit(data);
            let hrv_det = data.hrv_det;
            dispatch({
              type: SET_EDIT_HRV,
              payload: true,
            });
            hrv_det?.forEach((el) => {
              el.prod_id = el.prod_id?.id;
              el.unit_id = el.unit_id?.id;
              el.loc_id = el.loc_id?.id;
            });
            dispatch({
              type: SET_CURRENT_HRV,
              payload: {
                ...data,
                proj_id: data.proj_id ?? null,
                hrv_det:
                  hrv_det?.length > 0
                    ? hrv_det
                    : [
                        {
                          id: 0,
                          hrv_id: null,
                          prod_id: null,
                          unit_id: null,
                          loc_id: null,
                          qty: null,
                        },
                      ],
              },
            });
          }}
          className={`btn ${
            data.post === false ? "" : "disabled"
          } btn-primary shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          onClick={() => {
            // setEdit(true);
            setDisplayDel(true);
            setCurrentItem(data);
          }}
          className={`btn ${
            data.post === false ? "" : "disabled"
          } btn-danger shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-trash"></i>
        </Link>
      </div>
      //  </React.Fragment>
    );
  };

  const renderFooterDel = () => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => setDisplayDel(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].hapus}
          icon="pi pi-trash"
          onClick={() => {
            delPprod();
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
            onAdd();
            dispatch({
              type: SET_EDIT_HRV,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_HRV,
              payload: {
                ...data,
                hrv_det: [
                  {
                    id: 0,
                    hrv_id: null,
                    prod_id: null,
                    unit_id: null,
                    loc_id: null,
                    qty: null,
                  },
                ],
              },
            });
          }}
        />
      </div>
    );
  };

  const checkProd = (value) => {
    let selected = {};
    product?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
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

  const formatth = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="">
        <div className="col-12 mt-1 fs-12 text-left">
          <label className="text-label mb-1">
            <b>Detail Produk</b>
          </label>
          <DataTable value={data?.hrv_det} responsiveLayout="scroll">
            <Column
              header={tr[localStorage.getItem("language")].prod}
              style={{ width: "20rem" }}
              field={(e) => `${e.prod_id?.name} (${e.prod_id?.code})`}
            />
            <Column
              header={tr[localStorage.getItem("language")].gudang}
              style={{ width: "20rem" }}
              field={(e) => `${e.loc_id?.name} (${e.loc_id?.code})`}
            />
            <Column
              header={tr[localStorage.getItem("language")].qty}
              style={{ width: "20rem" }}
              field={(e) => formatth(e.qty)}
            />
            <Column
              header={tr[localStorage.getItem("language")].satuan}
              style={{ width: "20rem" }}
              field={(e) => e.unit_id?.name}
            />
          </DataTable>
        </div>
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="pt-0">
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : hrv}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={["pp_code"]}
                emptyMessage={tr[localStorage.getItem("language")].empty_data}
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
                  header={"Tanggal Panen"}
                  field={(e) => formatDate(e.date)}
                  // style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={"Kode Panen"}
                  // style={{
                  //   minWidth: "8rem",
                  // }}
                  field={(e) => e.code}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={"Nama Panen"}
                  // style={{
                  //   minWidth: "8rem",
                  // }}
                  field={(e) => e.name}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Action"
                  dataType="boolean"
                  bodyClassName="text-center"
                  // style={{ minWidth: "2rem" }}
                  body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Dialog
        header={tr[localStorage.getItem("language")].hapus_data}
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
          <span>{tr[localStorage.getItem("language")].pesan_hapus}</span>
        </div>
      </Dialog>
    </>
  );
};

export default DataPanen;
