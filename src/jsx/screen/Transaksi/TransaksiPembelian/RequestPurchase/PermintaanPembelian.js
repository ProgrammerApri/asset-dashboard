import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge, Button, Row, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_RP, SET_EDIT, SET_RP, SET_USER } from "src/redux/actions";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { tr } from "src/data/tr";
import { Tooltip } from "primereact/tooltip";
import { Timeline } from "primereact/timeline";

const data = {
  id: null,
  req_code: null,
  req_date: null,
  req_dep: null,
  req_ket: null,
  refrence: false,
  ref_sup: null,
  ref_ket: null,
  ns: false,
  rprod: [],
  rjasa: [],
};

const PermintaanPembelian = ({ onAdd, onEdit }) => {
  const [permintaan, setPermintaan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [displayData, setDisplayDat] = useState(false);
  const [displayApprove, setDisplayApprove] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [approverCount, setApproverCount] = useState(0);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const rp = useSelector((state) => state.rp.rp);
  const show = useSelector((state) => state.rp.current);
  const profile = useSelector((state) => state.profile.profile);
  const user = useSelector((state) => state.user.user);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getUser();
    initFilters1();
  }, []);

  const getPermintaan = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.rPurchase,
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
        dispatch({ type: SET_RP, payload: data });
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
        dispatch({
          type: SET_USER,
          payload: data.filter((v) => v.previlage?.approver),
        });
        setApproverCount(
          data.filter(
            (v) =>
              v.previlage?.approver &&
              (v.previlage?.dep_id == profile?.previlage?.dep_id ||
                v.previlage?.access_type == 1) &&
              v.approval_settings.some((v) => v.approval_module == "rp")
          ).length
        );
        setLoading(false);
        getPermintaan();
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

  const approveRp = async (id) => {
    setUpdate(true);
    const config = {
      ...endpoints.approveRp,
      endpoint: endpoints.approveRp.endpoint + currentItem.id,
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
          getPermintaan(true);
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

  const delPermintaan = async (id) => {
    setUpdate(true);
    const config = {
      ...endpoints.delRp,
      endpoint: endpoints.delRp.endpoint + currentItem.id,
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
          getPermintaan(true);
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

  const canApprove = (level, data) => {
    if (!data.apprv_1 && level === 1) {
      return true;
    }

    if (!data.apprv_2 && level === 2) {
      return true;
    }

    if (!data.apprv_3 && level === 3) {
      return true;
    }

    return false;
  };

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Tooltip target={".btn"} />
        <Link
          onClick={() => {
            setDisplayDat(data);
            let rprod = data.rprod;
            // rprod.forEach((el) => {
            //   el.prod_id = el.prod_id?.id;
            //   el.unit_id = el.unit_id?.id;
            // });
            let rjasa = data.rjasa;
            // rjasa.forEach((el) => {
            //   el.jasa_id = el.jasa_id?.id;
            //   el.unit_id = el.unit_id?.id;
            // });
            dispatch({
              type: SET_CURRENT_RP,
              payload: {
                ...data,
                rprod:
                  rprod.length > 0
                    ? rprod
                    : [
                        {
                          id: 0,
                          prod_id: null,
                          unit_id: null,
                          request: null,
                        },
                      ],
                rjasa:
                  rjasa.length > 0
                    ? rjasa
                    : [
                        {
                          id: 0,
                          jasa_id: null,
                          unit_id: null,
                          request: null,
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
            let rprod = data.rprod;
            dispatch({
              type: SET_EDIT,
              payload: true,
            });
            rprod.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });
            let rjasa = data.rjasa;
            rjasa.forEach((el) => {
              el.jasa_id = el.jasa_id.id;
              el.unit_id = el.unit_id.id;
            });
            dispatch({
              type: SET_CURRENT_RP,
              payload: {
                ...data,
                req_dep: data?.req_dep?.id ?? null,
                ref_sup: data?.ref_sup?.id ?? null,
                rprod:
                  rprod.length > 0
                    ? rprod
                    : [
                        {
                          id: 0,
                          prod_id: null,
                          unit_id: null,
                          request: null,
                        },
                      ],
                rjasa:
                  rjasa.length > 0
                    ? rjasa
                    : [
                        {
                          id: 0,
                          jasa_id: null,
                          unit_id: null,
                          request: null,
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

        {profile.previlage.approver && (
          <Link
            data-pr-tooltip="Approve"
            data-pr-position="right"
            data-pr-my="left center-2"
            onClick={() => {
              setEdit(true);
              setDisplayApprove(true);
              setCurrentItem(data);
            }}
            className={`btn ${
              canApprove(
                profile.approval_settings.filter(
                  (v) => v.approval_module === "rp"
                )[0].approval_level,
                data
              )
                ? ""
                : "disabled"
            } btn-info shadow btn-xs sharp ml-1`}
          >
            <i className="fa fa-check"></i>
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
          label={tr[localStorage.getItem("language")].batal}
          onClick={() => setDisplayDel(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label={tr[localStorage.getItem("language")].hapus}
          icon="pi pi-trash"
          onClick={() => {
            delPermintaan();
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
            approveRp();
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
              type: SET_EDIT,
              payload: false,
            });

            dispatch({
              type: SET_CURRENT_RP,
              payload: {
                ...data,
                req_dep: profile.previlage?.dep_id ?? null,
                rprod: [
                  {
                    id: 0,
                    prod_id: null,
                    unit_id: null,
                    request: null,
                  },
                ],
                rjasa: [
                  {
                    id: 0,
                    jasa_id: null,
                    unit_id: null,
                    request: null,
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
          onClick={() => setDisplayDat(false)}
          className="p-button-text btn-primary"
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

  const customizedMarker = (item) => {
    console.log(item);
    return (
      <span
        className="flex align-items-center justify-content-center z-1 p-1 border-circle"
        style={{
          backgroundColor: item.complete ? "#21BF99" : "white",
          border: "2px solid #21BF99",
        }}
      >
        <i
          className={"pi pi-check"}
          style={{ fontSize: "0.4rem", fontWeight: "bold", color: "white" }}
        ></i>
      </span>
    );
  };

  const checkUser = (value) => {
    let selected = null;
    user?.forEach((element) => {
      if (element.id === value) {
        selected = element;
      }
    });

    return selected;
  };

  const generateValuTimeline = (data) => {
    let value = [
      {
        label: "Request Created",
        date: data?.created_at ? formatDateTime(data?.created_at) : "-",
        approved_by: data?.created_by
          ? `Created By: ${checkUser(data?.created_by)?.username}`
          : "-",
        reason: "-",
        complete: true,
      },
    ];

    if (data.apprv_status === 1) {
      if (data?.apprv_1) {
        value.push({
          label: "Approval Level 1",
          date: data?.apprv1_time ? formatDateTime(data?.apprv1_time) : "-",
          approved_by: `Approved By: ${
            data?.apprv_1 ? checkUser(data?.apprv_1)?.username : "-"
          }`,
          reason: "-",
          complete: true,
        });
      }
      if (data?.apprv_2) {
        value.push({
          label: "Approval Level 2",
          date: data?.apprv2_time ? formatDateTime(data?.apprv2_time) : "-",
          approved_by: `Approved By: ${
            data?.apprv_2 ? checkUser(data?.apprv_2)?.username : "-"
          }`,
          reason: "-",
          complete: true,
        });
      }
      if (data?.apprv_3) {
        value.push({
          label: "Approval Level 3",
          date: data?.apprv3_time ? formatDateTime(data?.apprv3_time) : "-",
          approved_by: `Approved By: ${
            data?.apprv_3 ? checkUser(data?.apprv_3)?.username : "-"
          }`,
          reason: "-",
          complete: true,
        });
      }
    }

    if (data.apprv_status === 0) {
      const len = Array.from({ length: approverCount });
      console.log(approverCount);
      len.forEach((el, i) => {
        if (data[`apprv_${i + 1}`]) {
          value.push({
            label: `Approval Level ${i + 1}`,
            date: data[`apprv${i + 1}_time`]
              ? formatDateTime(data[`apprv${i + 1}_time`])
              : "-",
            approved_by: `Approved By: ${
              data[`apprv_${i + 1}`]
                ? checkUser(data[`apprv_${i + 1}`])?.username
                : "-"
            }`,
            reason: "-",
            complete: true,
          });
        } else {
          value.push({
            label: `Approval Level ${i + 1}`,
            date: "-",
            approved_by: "-",
            reason: "-",
            complete: false,
          });
        }
      });
    }

    if (data.apprv_status === 3) {
      if (data?.apprv_1) {
        value.push({
          label: "Approval Level 1",
          date: data?.apprv1_time ? formatDateTime(data?.apprv1_time) : "-",
          approved_by: `Approved By: ${
            data?.apprv_1 ? checkUser(data?.apprv_1)?.username : "-"
          }`,
          reason: "-",
          complete: true,
        });
      }
      if (data?.apprv_2) {
        value.push({
          label: "Approval Level 2",
          date: data?.apprv2_time ? formatDateTime(data?.apprv2_time) : "-",
          approved_by: `Approved By: ${
            data?.apprv_2 ? checkUser(data?.apprv_2)?.username : "-"
          }`,
          reason: "-",
          complete: true,
        });
      }
      if (data?.apprv_3) {
        value.push({
          label: "Approval Level 3",
          date: data?.apprv3_time ? formatDateTime(data?.apprv3_time) : "-",
          approved_by: `Approved By: ${
            data?.apprv_3 ? checkUser(data?.apprv_3)?.username : "-"
          }`,
          reason: "-",
          complete: true,
        });
      }

      if (data?.reject) {
        value.push({
          label: "Rejected",
          date: data?.apprv3_time ? formatDateTime(data?.apprv3_time) : "-",
          approved_by: `Rejected By: ${
            data?.reject ? checkUser(data?.reject)?.username : "-"
          }`,
          reason: data?.reason ?? "-",
          complete: true,
        });
      }
    }

    return value;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="row">
        <div className="col-12">
          <Timeline
            value={generateValuTimeline(data)}
            layout="horizontal"
            align="top"
            marker={customizedMarker}
            content={(item) => (
              <div className="row" style={{ minWidth: "14rem" }}>
                <div className="col-12 pt-0 mt-0">
                  <b>{item.label}</b>
                </div>
                <div className="col-12 pt-0 mt-0">{item.date}</div>

                <div className="col-12 pt-0 mt-0">{item.approved_by}</div>

                <div className="col-12 pt-0 mt-0">{item.reason}</div>
              </div>
            )}
          />
        </div>
        <div className="col-12">
          <DataTable value={data?.rprod} responsiveLayout="scroll">
            <Column
              header="Produk"
              field={(e) => e.prod_id?.name}
              style={{ minWidth: "14rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header="Jumlah"
              field={(e) => e.request}
              style={{ minWidth: "12rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header="Satuan"
              field={(e) => e.unit_id?.name}
              style={{ minWidth: "12rem" }}
              // body={loading && <Skeleton />}
            />
          </DataTable>
        </div>
        {data?.rjasa.length > 0 && (
          <div className="col-12">
            <DataTable
              value={data?.rjasa}
              responsiveLayout="scroll"
              className="mt-2"
            >
              <Column
                header="Jasa"
                field={(e) => e.jasa_id?.name}
                style={{ minWidth: "13rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Jumlah"
                field={(e) => e.request}
                style={{ minWidth: "13rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Satuan"
                field={(e) => e.unit_id?.name}
                style={{ minWidth: "12rem" }}
              />
            </DataTable>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />

      <DataTable
        responsiveLayout="scroll"
        value={loading ? dummy : rp}
        className="display w-150 datatable-wrapper"
        showGridlines
        dataKey="id"
        rowHover
        header={renderHeader}
        filters={filters1}
        globalFilterFields={["req_code", "req_dep.ccost_name"]}
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
            minWidth: "10rem",
          }}
          field={(e) => formatDate(e.req_date)}
          body={loading && <Skeleton />}
        />
        <Column
          header={tr[localStorage.getItem("language")].kd_req}
          field={(e) => e.req_code}
          style={{ minWidth: "10rem" }}
          body={loading && <Skeleton />}
        />
        <Column
          header={tr[localStorage.getItem("language")].dep}
          field={(e) => e.req_dep?.ccost_name}
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
                {
                  e.status !== 2 ? (
                    <Badge variant="success light">
                      <i className="bx bxs-circle text-success mr-1"></i> Open
                    </Badge>
                  ) : (
                    <Badge variant="danger light">
                      <i className="bx bxs-circle text-danger mr-1"></i> Close
                    </Badge>
                  )
                  // (
                  //   <Badge variant="success light">
                  //     <i className="bx bxs-circle text-success mr-1"></i> Selesai
                  //   </Badge>
                  // )
                }
              </div>
            )
          }
        />
        <Column
          header={"Approval Status"}
          field={(e) => e?.approval_status ?? ""}
          style={{ minWidth: "8rem" }}
          body={(e) =>
            loading ? (
              <Skeleton />
            ) : (
              <>
                {e?.apprv_status === 0 ? (
                  <Badge variant="warning light">
                    <i className="bx bxs-circle text-warning mr-1"></i>{" "}
                    {e?.apprv_text ?? "No Status"}
                  </Badge>
                ) : e?.apprv_status === 1 ? (
                  <Badge variant="success light">
                    <i className="bx bxs-circle text-success mr-1"></i>{" "}
                    {e?.apprv_text ?? "No Status"}
                  </Badge>
                ) : (
                  <Badge variant="danger light">
                    <i className="bx bxs-circle text-danger mr-1"></i>{" "}
                    {e?.apprv_text ?? "No Status"}
                  </Badge>
                )}
              </>
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
        header={"Detail Permintaan"}
        visible={displayData}
        style={{ width: "38vw" }}
        footer={renderFooter("displayData")}
        onHide={() => {
          setDisplayDat(false);
        }}
      >
        <Row className="ml-0 pt-0 fs-12">
          <div className="col-8">
            <label className="text-label">Tanggal Permintaan :</label>
            <span className="ml-1">
              <b>{formatDate(show.req_date)}</b>
            </span>
          </div>

          <div className="col-4">
            <label className="text-label">No. Permintaan :</label>
            <span className="ml-1">
              <b>{show.req_code}</b>
            </span>
          </div>

          <Card className="col-12 ml-0 mr-0">
            <div className="row">
              <div className="col-8">
                <label className="text-label">Departemen</label>
                <div className="p-inputgroup"></div>
                <span className="ml-0">
                  <b>{show.req_dep?.ccost_name}</b>
                </span>
              </div>

              <div className="col-4">
                <label className="text-label">Ref. Supplier</label>
                <div className="p-inputgroup">
                  <span className="ml-0">
                    <b>{show.ref_sup?.sup_name}</b>
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Row className="ml-2 mt-0">
            <DataTable
              responsiveLayout="scroll"
              className="display w-150 datatable-wrapper fs-12"
              value={show?.rprod?.map((v, i) => {
                return {
                  ...v,
                  index: i,
                  request: v?.request ?? 0,
                };
              })}
            >
              <Column
                header="Produk"
                field={(e) => e.prod_id?.name}
                style={{ minWidth: "14rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Jumlah"
                field={(e) => e.request}
                style={{ minWidth: "12rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Satuan"
                field={(e) => e.unit_id?.name}
                style={{ minWidth: "12rem" }}
                // body={loading && <Skeleton />}
              />
            </DataTable>
          </Row>

          {rp.rjasa?.length ? (
            <Row className="ml-1 mt-5">
              <>
                <DataTable
                  className="display w-150 datatable-wrapper fs-12"
                  value={show?.rjasa?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      request: v?.request,
                    };
                  })}
                >
                  <Column
                    header="Jasa"
                    field={(e) => e.jasa_id?.name}
                    style={{ minWidth: "13rem" }}
                    // body={loading && <Skeleton />}
                  />
                  <Column
                    header="Jumlah"
                    field={(e) => e.request}
                    style={{ minWidth: "13rem" }}
                    // body={loading && <Skeleton />}
                  />
                  <Column
                    header="Satuan"
                    field={(e) => e.unit_id?.name}
                    style={{ minWidth: "12rem" }}
                    // body={loading && <Skeleton />}
                  />
                </DataTable>
              </>
            </Row>
          ) : (
            <></>
          )}
        </Row>
      </Dialog>

      <Dialog
        header={`${tr[localStorage.getItem("language")].hapus} ${
          tr[localStorage.getItem("language")].req_pur
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
        header={`Approve ${tr[localStorage.getItem("language")].req_pur}`}
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
    </>
  );
};

export default PermintaanPembelian;
