import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Card, Row, Col, Badge } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_SO, SET_EDIT_SO, SET_SO } from "src/redux/actions";
import ReactToPrint from "react-to-print";
import { Divider } from "@material-ui/core";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { tr } from "src/data/tr";
import { Tooltip } from "primereact/tooltip";

const data = {
  id: null,
  so_code: null,
  so_date: null,
  pel_id: null,
  sub_id: null,
  sub_addr: null,
  ppn_type: null,
  top: null,
  req_date: null,
  due_date: false,
  split_inv: null,
  prod_disc: null,
  jasa_disc: null,
  total_disc: null,
  total_bayar: null,
  sprod: [],
  sjasa: [],
};

const DataSalesOrder = ({ onAdd, onEdit, onDetail }) => {
  const [so, setSO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [confirm, setDisplayConfirm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const So = useSelector((state) => state.so.so);
  const closeSo = useSelector((state) => state.so.current);
  const printPage = useRef(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getSO();
    initFilters1();
  }, []);

  const getSO = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.so,
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
        dispatch({ type: SET_SO, payload: data });
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

  const delSO = async (id) => {
    const config = {
      ...endpoints.delSO,
      endpoint: endpoints.delSO.endpoint + currentItem.id,
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
          getSO(true);
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

  const closeSO = async () => {
    const config = {
      ...endpoints.closeSO,
      endpoint: endpoints.closeSO.endpoint + closeSo.id,
      data: closeSo,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDisplayConfirm(false);
          getSO(true);
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
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: tr[localStorage.getItem("language")].gagal,
          detail: tr[localStorage.getItem("language")].pesan_gagal,
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
            onDetail();
            let sprod = data.sprod;
            let sjasa = data.sjasa;
            dispatch({
              type: SET_CURRENT_SO,
              payload: {
                ...data,
                sprod:
                  sprod.length > 0
                    ? sprod
                    : [
                        {
                          id: 0,
                          prod_id: null,
                          unit_id: null,
                          location: null,
                          request: null,
                          order: null,
                          remain: null,
                          price: null,
                          disc: null,
                          nett_price: null,
                          total_fc: null,
                          total: null,
                        },
                      ],
                sjasa:
                  sjasa.length > 0
                    ? sjasa
                    : [
                        {
                          id: 0,
                          jasa_id: null,
                          sup_id: null,
                          unit_id: null,
                          qty: null,
                          price: null,
                          disc: null,
                          total_fc: null,
                          total: null,
                        },
                      ],
              },
            });
          }}
          className="btn btn-info shadow btn-xs sharp ml-1"
        >
          <i className="bx bx-show mt-1"></i>
        </Link>

        <Link
          onClick={() => {
            onEdit(data);
            let sprod = data.sprod;
            dispatch({
              type: SET_EDIT_SO,
              payload: true,
            });
            sprod.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });
            let sjasa = data.sjasa;
            sjasa.forEach((el) => {
              el.jasa_id = el.jasa_id.id;
              el.unit_id = el.unit_id.id;
            });
            dispatch({
              type: SET_CURRENT_SO,
              payload: {
                ...data,
                pel_id: data?.pel_id?.id ?? null,
                sub_id: data?.sub_id?.id ?? null,
                top: data?.top?.id ?? null,
                sprod:
                  sprod.length > 0
                    ? sprod
                    : [
                        {
                          id: 0,
                          prod_id: null,
                          unit_id: null,
                          location: null,
                          request: null,
                          order: null,
                          remain: null,
                          price: null,
                          disc: null,
                          nett_price: null,
                          total_fc: null,
                          total: null,
                        },
                      ],
                sjasa:
                  sjasa.length > 0
                    ? sjasa
                    : [
                        {
                          id: 0,
                          jasa_id: null,
                          sup_id: null,
                          unit_id: null,
                          qty: null,
                          price: null,
                          disc: null,
                          total_fc: null,
                          total: null,
                        },
                      ],
              },
            });
          }}
          className={`btn ${
            data.status !== 2 ? "" : "disabled"
          } btn-primary shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Tooltip target=".btn" />
        <Link
          data-pr-tooltip="Close SO"
          data-pr-position="right"
          data-pr-at="right+5 top"
          data-pr-my="left center-2"
          onClick={() => {
            setDisplayConfirm(true);
            let sprod = data.sprod;
            dispatch({
              type: SET_EDIT_SO,
              payload: true,
            });
            sprod.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });
            let sjasa = data.sjasa;
            sjasa.forEach((el) => {
              el.jasa_id = el.jasa_id.id;
              el.unit_id = el.unit_id.id;
            });
            dispatch({
              type: SET_CURRENT_SO,
              payload: {
                ...data,
                pel_id: data?.pel_id?.id ?? null,
                sub_id: data?.sub_id?.id ?? null,
                top: data?.top?.id ?? null,
                sprod:
                  sprod.length > 0
                    ? sprod
                    : [
                        {
                          id: 0,
                          prod_id: null,
                          unit_id: null,
                          location: null,
                          request: null,
                          order: null,
                          remain: null,
                          price: null,
                          disc: null,
                          nett_price: null,
                          total_fc: null,
                          total: null,
                        },
                      ],
                sjasa:
                  sjasa.length > 0
                    ? sjasa
                    : [
                        {
                          id: 0,
                          jasa_id: null,
                          sup_id: null,
                          unit_id: null,
                          qty: null,
                          price: null,
                          disc: null,
                          total_fc: null,
                          total: null,
                        },
                      ],
              },
            });
          }}
          className={`btn ${
            data.status !== 2 ? "" : "disabled"
          } btn-warning shadow btn-xs sharp ml-1`}
        >
          <i className="bx bx-x mt-1"></i>
        </Link>

        <Link
          onClick={() => {
            setEdit(true);
            setDisplayDel(true);
            setCurrentItem(data);
          }}
          className={`btn ${
            data.status !== 2 ? "" : "disabled"
          } btn-danger shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-trash"></i>
        </Link>
      </div>
      // </React.Fragment>
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
            delSO();
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
        <PrimeSingleButton
          label={tr[localStorage.getItem("language")].tambh}
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            onAdd();
            dispatch({
              type: SET_EDIT_SO,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_SO,
              payload: {
                ...data,
                sprod: [
                  {
                    id: 0,
                    prod_id: null,
                    unit_id: null,
                    location: null,
                    request: null,
                    order: null,
                    remain: null,
                    price: null,
                    disc: null,
                    nett_price: null,
                    total_fc: null,
                    total: null,
                  },
                ],
                sjasa: [
                  {
                    id: 0,
                    jasa_id: null,
                    sup_id: null,
                    unit_id: null,
                    qty: null,
                    price: null,
                    disc: null,
                    total_fc: null,
                    total: null,
                  },
                ],
              },
            });
          }}
        />
      </div>
    );
  };

  const footerClose = () => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => setDisplayConfirm(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Ya"
          icon="pi pi-check"
          onClick={() => {
            setUpdate(true);
            closeSO();
          }}
          autoFocus
          loading={update}
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
      <Row>
        <Col className="pt-0">
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : So}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "so.so_code",
                  "so.so_date",
                  "pel_id.cus_name",
                ]}
                emptyMessage={tr[localStorage.getItem("language")].empty_data}
                paginator
                paginatorTemplate={template2}
                first={first2}
                rows={rows2}
                onPage={onCustomPage2}
                paginatorClassName="justify-content-end mt-3"
              >
                <Column
                  header={tr[localStorage.getItem("language")].tgl}
                  style={{
                    minWidth: "10rem",
                  }}
                  field={(e) => formatDate(e.so_date)}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].kd_so}
                  field={(e) => e.so_code}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].customer}
                  field={(e) => e.pel_id.cus_name}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].due}
                  field={(e) => formatDate(e.due_date)}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].sts}
                  field={(e) => e?.status ?? ""}
                  style={{ minWidth: "8rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div>
                        {e.status !== 2 ? (
                          <Badge variant="success light">
                            <i className="bx bx-check text-success mr-1"></i>{" "}
                            Open
                          </Badge>
                        ) : (
                          <Badge variant="danger light">
                            <i className="bx bx-x text-danger mr-1"></i> Close
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Dialog
        header={`${tr[localStorage.getItem("language")].close} ${
          tr[localStorage.getItem("language")].sal_ord
        }`}
        visible={confirm}
        style={{ width: "30vw" }}
        footer={footerClose("confirm")}
        onHide={() => {
          setDisplayConfirm(false);
        }}
      >
        <div className="ml-3 mr-3">
          <i
            className="pi pi-exclamation-triangle mr-3 align-middle"
            style={{ fontSize: "2rem" }}
          />
          <span>{tr[localStorage.getItem("language")].pesan_cls}</span>
        </div>
      </Dialog>

      <Dialog
        header={`${tr[localStorage.getItem("language")].hapus} ${
          tr[localStorage.getItem("language")].sal_ord
        }`}
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

export default DataSalesOrder;
