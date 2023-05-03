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

const data = {
  id: null,
  pp_code: null,
  pp_date: null,
  pasal: [],
  pjadi: [],
};

const DataPerubahanProduk = ({ onAdd, onEdit, onDetail }) => {
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
  const pp = useSelector((state) => state.pp.pp);
  const show = useSelector((state) => state.pp.current);
  const [expandedRows, setExpandedRows] = useState(null);
  const printPage = useRef(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getPproduct();
    getProduct();
    initFilters1();
  }, []);

  const getPproduct = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.perubahan_prod,
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
        dispatch({ type: SET_PP, payload: filt });
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
      ...endpoints.delPproduct,
      endpoint: endpoints.delPproduct.endpoint + currentItem.id,
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
          getPproduct(true);
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
        {/* <Link
          onClick={() => {
            onDetail();
            let pasal = data.pasal;
            let pjadi = data.pjadi;
            dispatch({
              type: SET_CURRENT_PP,
              payload: {
                ...data,
                pasal:
                  pasal.length > 0
                    ? pasal
                    : [
                        {
                          id: 0,
                          pp_id: null,
                          prod_id: null,
                          unit_id: null,
                          loc_id: null,
                          qty: null,
                        },
                      ],
                pjadi:
                  pjadi.length > 0
                    ? pjadi
                    : [
                        {
                          id: 0,
                          pp_id: null,
                          prod_id: null,
                          unit_id: null,
                          loc_id: null,
                          qty: null,
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
            let pasal = data.pasal;
            dispatch({
              type: SET_EDIT_PP,
              payload: true,
            });
            pasal?.forEach((el) => {
              el.prod_id = el.prod_id?.id;
              el.unit_id = el.unit_id?.id;
              el.loc_id = el.loc_id?.id;
            });
            let pjadi = data.pjadi;
            pjadi?.forEach((elem) => {
              elem.prod_id = elem.prod_id.id;
              elem.unit_id = elem.unit_id.id;
              elem.loc_id = elem.loc_id.id;
            });
            dispatch({
              type: SET_CURRENT_PP,
              payload: {
                ...data,
                pasal:
                  pasal?.length > 0
                    ? pasal
                    : [
                        {
                          id: 0,
                          pp_id: null,
                          prod_id: null,
                          unit_id: null,
                          loc_id: null,
                          qty: null,
                        },
                      ],
                pjadi:
                  pjadi?.length > 0
                    ? pjadi
                    : [
                        {
                          id: 0,
                          pp_id: null,
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
              type: SET_EDIT_PP,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_PP,
              payload: {
                ...data,
                pasal: [
                  {
                    id: 0,
                    pp_id: null,
                    prod_id: null,
                    unit_id: null,
                    loc_id: null,
                    qty: null,
                  },
                ],
                pjadi: [
                  {
                    id: 0,
                    pp_id: null,
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
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="">
        <div className="col-12 mt-1 fs-12 text-left">
          <label className="text-label mb-1">
            <b>Produk Asal</b>
          </label>
          <DataTable value={data?.pasal} responsiveLayout="scroll">
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

        <div className="col-12 mt-2 fs-12 text-left">
          <label className="text-label mb-1">
            <b>Menjadi Produk</b>
          </label>
          <DataTable value={data?.pjadi} responsiveLayout="scroll">
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
                value={loading ? dummy : pp}
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
                  header={tr[localStorage.getItem("language")].tgl_perubahan}
                  field={(e) => formatDate(e.pp_date)}
                  // style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].kd_perubahan}
                  // style={{
                  //   minWidth: "8rem",
                  // }}
                  field={(e) => e.pp_code}
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

export default DataPerubahanProduk;
