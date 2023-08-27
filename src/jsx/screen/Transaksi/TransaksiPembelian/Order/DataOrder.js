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
import { SET_CURRENT_ODR, SET_EDIT_ODR, SET_ODR } from "src/redux/actions";
import { Divider } from "@material-ui/core";
import ReactToPrint from "react-to-print";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { tr } from "src/data/tr";
import { Tooltip } from "primereact/tooltip";
import { Timeline } from "primereact/timeline";
import { InputTextarea } from "primereact/inputtextarea";

const data = {
  id: null,
  modul: null,
  ord_code: null,
  ord_date: null,
  no_doc: null,
  doc_date: null,
  invoice: true,
  faktur: true,
  po_id: null,
  dep_id: null,
  proj_id: null,
  sup_id: null,
  top: null,
  due_date: null,
  split_order: null,
  prod_disc: null,
  jasa_disc: null,
  total_disc: null,
  total_b: null,
  total_bayar: null,
  ns: false,
  same_sup: false,
  dprod: [],
  djasa: [],
};

const DataOrder = ({ onAdd, onEdit, onDetail }) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [displayApprove, setDisplayApprove] = useState(false);
  const [displayReject, setDisplayReject] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currency, setCurrency] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order.order);
  const show = useSelector((state) => state.order.current);
  const profile = useSelector((state) => state.profile.profile);
  const [reject, setReject] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const printPage = useRef(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getOrder();
    getCur();
    initFilters1();
  }, []);

  const getCodeOrder = async (isUpdate = false) => {
    // setLoading(true);
    const config = {
      ...endpoints.getcode_order,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const kode = response.data;
        console.log("gra",kode);
        onAdd();
        dispatch({
          type: SET_CURRENT_ODR,
          payload: {
            ...data,
            ord_code: kode,
            split_inv: false,
            dprod: [
              {
                id: 0,
                do_id: null,
                // preq_id: null,
                // pprod_id: null,
                prod_id: null,
                unit_id: null,
                location: null,
                req: null,
                order: null,
                remain: null,
                price: null,
                disc: null,
                nett_price: null,
                total_fc: null,
                total: null,
              },
            ],
            djasa: [
              {
                id: 0,
                do_id: null,
                jasa_id: null,
                sup_id: null,
                unit_id: null,
                order: null,
                price: null,
                disc: null,
                total_fc: null,
                total: null,
              },
            ],
          },
        });
      }
    } catch (error) {}
    if (isUpdate) {
      // setLoading(false);
    } else {
      // setTimeout(() => {
      // setLoading(false);
      // }, 500);
    }
  };
  const getOrder = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.order,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        // if (response.status) {
          const { data } = response;
  
          console.log("data Dibawah");
          console.log(data);
          const filteredData = data.filter((item) => item.modul !== "gra");

        dispatch({ type: SET_ODR, payload: filteredData });
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

  const getCur = async () => {
    const config = {
      ...endpoints.currency,
      data: {},
    };
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

  const delODR = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delODR,
      endpoint: endpoints.delODR.endpoint + currentItem.id,
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
          getOrder(true);
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

  const approveGra = async (id) => {
    setUpdate(true);
    const config = {
      ...endpoints.approveGra,
      endpoint: endpoints.approveGra.endpoint + currentItem.id,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDisplayApprove(false);
          getOrder(true);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: "Approve Success",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setUpdate(false);
        setDisplayApprove(false);
        toast.current.show({
          severity: "error",
          summary: tr[localStorage.getItem("language")].gagal,
          detail: "Failed to approve",
          life: 3000,
        });
      }, 500);
    }
  };

  const rejectGra = async (id) => {
    setUpdate(true);
    const config = {
      ...endpoints.rejectGra,
      endpoint: endpoints.rejectGra.endpoint + currentItem.id,
      data: { reason: reject ?? null },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDisplayReject(false);
          getOrder(true);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: "Approve Success",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setUpdate(false);
        setDisplayApprove(false);
        toast.current.show({
          severity: "error",
          summary: tr[localStorage.getItem("language")].gagal,
          detail: "Failed to approve",
          life: 3000,
        });
      }, 500);
    }
  };

  const canApprove = (level, data) => {
    if (!data.apprv_1 && level === 1 && data.apprv_status === 0) {
      return true;
    }

    if (
      data.apprv_1 &&
      !data.apprv_2 &&
      level === 2 &&
      data.apprv_status === 0
    ) {
      return true;
    }

    if (
      data.apprv_1 &&
      data.apprv_2 &&
      !data.apprv_3 &&
      level === 3 &&
      data.apprv_status === 0
    ) {
      return true;
    }

    return false;
  };

  const actionBodyTemplate = (data) => {
    return (
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
            let dprod = data.dprod;
            dispatch({
              type: SET_EDIT_ODR,
              payload: true,
            });
            dprod.forEach((el) => {
              el.prod_id = el.prod_id?.id;
              el.unit_id = el.unit_id?.id;
              el.location = el.location?.id;
            });
            let djasa = data.djasa;
            djasa.forEach((el) => {
              el.jasa_id = el.jasa_id.id;
              el.unit_id = el.unit_id.id;
            });
            dispatch({
              type: SET_CURRENT_ODR,
              payload: {
                ...data,
                po_id: data?.po_id?.id ? data?.po_id : null,
                dep_id: data?.dep_id?.id ?? null,
                proj_id: data?.proj_id?.id ?? null,
                sup_id: data?.sup_id?.id ?? null,
                top: data?.top?.id ?? null,
                dprod:
                  dprod.length > 0
                    ? dprod
                    : [
                        {
                          id: 0,
                          do_id: null,
                          // preq_id: null,
                          pprod_id: null,
                          prod_id: null,
                          unit_id: null,
                          location: null,
                          req: null,
                          order: null,
                          remain: null,
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
          // className={`btn ${
          //   !data.faktur ? "" : "disabled"
          // } btn-danger shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-trash"></i>
        </Link>

        {profile?.previlage?.approver && (
          <Link
            data-pr-tooltip="Approve"
            data-pr-position="right"
            data-pr-my="left center-2"
            onClick={() => {
              if (
                canApprove(
                  profile?.approval_settings?.filter(
                    (v) => v.approval_module === "gra"
                  )[0]?.approval_level,
                  data
                )
              ) {
                setEdit(true);
                setDisplayApprove(true);
                setCurrentItem(data);
              }
            }}
            className={`btn ${
              canApprove(
                profile?.approval_settings?.filter(
                  (v) => v.approval_module === "gra"
                )[0]?.approval_level,
                data
              )
                ? ""
                : "disabled"
            } btn-info shadow btn-xs sharp ml-1`}
          >
            <i className="fa fa-check"></i>
          </Link>
        )}
        {profile?.previlage?.approver && (
          <Link
            data-pr-tooltip="Reject"
            data-pr-position="right"
            data-pr-my="left center-2"
            onClick={() => {
              if (
                canApprove(
                  profile?.approval_settings?.filter(
                    (v) => v.approval_module === "gra"
                  )[0]?.approval_level,
                  data
                )
              ) {
                setEdit(true);
                setDisplayReject(true);
                setCurrentItem(data);
              }
            }}
            className={`btn ${
              canApprove(
                profile.approval_settings.filter(
                  (v) => v.approval_module === "gra"
                )[0]?.approval_level,
                data
              )
                ? ""
                : "disabled"
            } btn-danger shadow btn-xs sharp ml-1`}
          >
            <i className="fa fa-times"></i>
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
          onClick={() => setDisplayDel(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Hapus"
          icon="pi pi-trash"
          onClick={() => {
            delODR();
          }}
          autoFocus
          loading={loading}
        />
      </div>
    );
  };

  const renderFooterReject = () => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => setDisplayReject(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label={"Reject"}
          icon="pi pi-times"
          onClick={() => {
            rejectGra();
          }}
          autoFocus
          loading={update}
        />
      </div>
    );
  };

  const renderFooterApprove = () => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => setDisplayApprove(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label={"Approve"}
          icon="pi pi-check"
          onClick={() => {
            approveGra();
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
            getCodeOrder();
            dispatch({
              type: SET_EDIT_ODR,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_ODR,
              payload: {
                ...data,
                split_inv: false,
                dprod: [
                  {
                    id: 0,
                    do_id: null,
                    // preq_id: null,
                    // pprod_id: null,
                    prod_id: null,
                    unit_id: null,
                    location: null,
                    req: null,
                    order: null,
                    remain: null,
                    price: null,
                    disc: null,
                    nett_price: null,
                    total_fc: null,
                    total: null,
                  },
                ],
                djasa: [
                  {
                    id: 0,
                    do_id: null,
                    jasa_id: null,
                    sup_id: null,
                    unit_id: null,
                    order: null,
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

  const renderFooter = () => {
    return (
      <div>
        <PButton
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => setDisplayData(false)}
          className="p-button-text btn-primary"
        />
        <ReactToPrint
          trigger={() => {
            return (
              <PButton variant="primary" onClick={() => {}}>
                Print{" "}
                <span className="btn-icon-right">
                  <i class="bx bxs-printer"></i>
                </span>
              </PButton>
            );
          }}
          content={() => printPage.current}
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
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const formatTh = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const getSubTotalBarang = () => {
    let total = 0;
    show?.dprod?.forEach((el) => {
      if (el.nett_price && el.nett_price > 0) {
        total += parseInt(el.nett_price);
      } else {
        total += el.total - (el.total * el.disc) / 100;
      }
    });

    return total;
  };

  const getSubTotalJasa = () => {
    let total = 0;
    show?.djasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return total;
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
    let rate = 0;
    currency?.forEach((el) => {
      if (el?.id === data?.sup_id?.sup_curren) {
        rate = el?.rate;
      }
    });

    return (
      <div className="">
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

        <label className="text-label fs-13 text-black">
          <b>Daftar Produk</b>
        </label>

        <DataTable value={data?.dprod} responsiveLayout="scroll">
          <Column
            header="Produk"
            field={(e) => `${e.prod_id?.name} (${e.prod_id?.code})`}
            style={{ minWidth: "19rem" }}
            // body={loading && <Skeleton />}
          />
          <Column
            header="Gudang"
            field={(e) => e.location?.name}
            style={{ minWidth: "9rem" }}
            // body={loading && <Skeleton />}
          />
          <Column
            header="Jumlah"
            field={(e) => formatTh(e.order)}
            style={{ minWidth: "6rem" }}
            // body={loading && <Skeleton />}
          />
          <Column
            header="Satuan"
            field={(e) => e.unit_id?.name}
            style={{ minWidth: "7rem" }}
            // body={loading && <Skeleton />}
          />
          <Column
            hidden={data.sup_id?.sup_curren === null}
            header="Harga Satuan"
            field={(e) => (data.sup_id?.sup_curren ? formatIdr(e.price) : null)}
            style={{ minWidth: "10rem" }}
            // body={loading && <Skeleton />}
          />
          <Column
            header="Harga Satuan (IDR)"
            field={(e) =>
              data.sup_id?.sup_curren
                ? `Rp. ${formatIdr(e.price * rate)}`
                : `Rp. ${formatIdr(e.price)}`
            }
            style={{ minWidth: "10rem" }}
            // body={loading && <Skeleton />}
          />
          <Column
            header="Total (IDR)"
            field={(e) => `Rp. ${formatIdr(e.total)}`}
            style={{ minWidth: "10rem" }}
            // body={loading && <Skeleton />}
          />
        </DataTable>

        {data?.djasa?.length ? (
          <>
            <label className="text-label fs-13 text-black">
              <b>Daftar Jasa</b>
            </label>

            <DataTable value={data?.djasa} responsiveLayout="scroll">
              <Column
                header="Supplier"
                field={(e) =>
                  e.sup_id
                    ? `${e.sup_id?.supplier?.sup_name} (${e.sup_id?.supplier?.sup_code})`
                    : "-"
                }
                style={{ minWidth: "21rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header=""
                field={(e) => null}
                style={{ minWidth: "9rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Jasa"
                field={(e) => e.jasa_id?.name}
                style={{ minWidth: "27rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Total (IDR)"
                field={(e) => `Rp. ${formatIdr(e.total)}`}
                style={{ minWidth: "15rem" }}
                // body={loading && <Skeleton />}
              />
            </DataTable>
          </>
        ) : (
          <></>
        )}
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
                value={loading ? dummy : order}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={["ord_code"]}
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
                  header={tr[localStorage.getItem("language")].tgl}
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => formatDate(e.ord_date)}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].kd_pur}
                  field={(e) => e.ord_code}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].kd_ord}
                  field={(e) => e.po_id?.po_code ?? "-"}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                {/* <Column
                  header="PO Status"
                  field={(e) => (e.po_id.status !== null ? e.po_id.status : "")}
                  style={{ minWidth: "8rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div>
                        {e.po_id.status !== 1 ? (
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
                /> */}
                <Column
                  header={tr[localStorage.getItem("language")].supplier}
                  field={(e) => e?.sup_id?.sup_name}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                {/* <Column
                  header={tr[localStorage.getItem("language")].fak_pur}
                  field={(e) => e.faktur}
                  style={{ minWidth: "8rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div>
                        {e.faktur === true ? (
                          <Badge variant="info light">
                            <i className="bx bxs-plus-circle text-info mr-1 mt-1"></i>{" "}
                            Faktur
                          </Badge>
                        ) : (
                          <Badge variant="warning light">
                            <i className="bx bxs-minus-circle text-warning mr-1 mt-1"></i>{" "}
                            Non Faktur
                          </Badge>
                        )}
                      </div>
                    )
                  }
                /> */}
                <Column
                  header={"Invoice Pembelian"}
                  field={(e) => e.invoice}
                  style={{ minWidth: "8rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div>
                        {e.invoice === true ? (
                          <>
                            <Tooltip target=".link" />
                            <Link
                              className="link"
                              data-pr-tooltip="Lihat Invoice"
                              data-pr-position="right"
                              data-pr-at="right+5 top"
                              data-pr-my="left center-2"
                              onClick={() => {
                                onDetail();
                                let dprod = e?.dprod;
                                let djasa = e?.djasa;
                                dispatch({
                                  type: SET_CURRENT_ODR,
                                  payload: {
                                    ...e,
                                    dprod: dprod?.length > 0 ? dprod : null,
                                    djasa: djasa?.length > 0 ? djasa : null,
                                  },
                                });
                              }}
                              // className="btn btn-info shadow btn-xs sharp ml-1"
                            >
                              <Badge variant="info light">
                                <i className="bx bxs-plus-circle text-info mr-1 mt-1"></i>{" "}
                                Invoice
                              </Badge>
                            </Link>
                          </>
                        ) : (
                          <Badge variant="warning light">
                            <i className="bx bxs-minus-circle text-warning mr-1 mt-1"></i>{" "}
                            Non Invoice
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
        header={`${tr[localStorage.getItem("language")].hapus} ${
          tr[localStorage.getItem("language")].pur
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

      <Dialog
        header={`Approve Purchase`}
        visible={displayApprove}
        style={{ width: "30vw" }}
        footer={renderFooterApprove()}
        onHide={() => {
          setDisplayApprove(false);
        }}
      >
        <div className="ml-3 mr-3">
          <i
            className="pi pi-exclamation-triangle mr-3 align-middle"
            style={{ fontSize: "2rem" }}
          />
          <span>{tr[localStorage.getItem("language")].pesan_approve}</span>
        </div>
      </Dialog>

      <Dialog
        header={`Reject Purchase`}
        visible={displayReject}
        style={{ width: "35vw" }}
        footer={renderFooterReject()}
        onHide={() => {
          setDisplayReject(false);
        }}
      >
        <div className="row ml-0 mt-0">
          <div className="col-12">
            <label className="text-label">{"Reason"}</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={reject ? `${reject}` : ""}
                onChange={(e) => {
                  setReject(e.target.value);
                }}
                placeholder={"Reason"}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DataOrder;
