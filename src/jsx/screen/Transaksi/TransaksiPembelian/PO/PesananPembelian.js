import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Row, Col, Card, Badge } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_PO, SET_EDIT_PO } from "src/redux/actions";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { tr } from "src/data/tr";
import { Tooltip } from "primereact/tooltip";
import { InputTextarea } from "primereact/inputtextarea";
import { Timeline } from "primereact/timeline";

const data = {
  id: null,
  modul: null,
  po_code: null,
  ref_sup: null,
  po_date: null,
  preq_id: null,
  sup_id: null,
  ppn_type: null,
  top: null,
  due_date: false,
  split_PO: null,
  prod_disc: null,
  jasa_disc: null,
  total_disc: null,
  total_bayar: null,
  ns: false,
  same_sup: false,
  rprod: [],
  rjasa: [],
  psup: [],
};

const PesananPO = ({ onAdd, onEdit, onDetail }) => {
  const [po, setPO] = useState(null);
  const [reject, setReject] = useState(null);
  const [comp, setComp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [confirm, setDisplayConfirm] = useState(false);
  const [displayApprove, setDisplayApprove] = useState(false);
  const [displayReject, setDisplayReject] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const PO = useSelector((state) => state.po.po);
  const closePo = useSelector((state) => state.po.current);
  const profile = useSelector((state) => state.profile.profile);
  const [expandedRows, setExpandedRows] = useState(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getPO();
    getComp();
    initFilters1();
  }, []);

  const getPO = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.po,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        console.log("data Dibawah");
        console.log(data);
        const filteredData = data.filter((item) => item.modul !== "po");

        // dispatch({ type: SET_RP, payload: filteredData });
        setPO(filteredData);
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

  const getCodePO = async () => {
    setLoading(true);
    const config = {
      ...endpoints.kodepo,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const kode = response.data;
        onAdd();
        dispatch({
          type: SET_CURRENT_PO,
          payload: {
            ...data,
            po_code: kode ,
            ref_sup: false,
            pprod: [],
            pjasa: [],
            psup: [],
          },
        });
      }
    } catch (error) {}
  };
  
  const getComp = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.getCompany,
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
        setComp(data);
      }
    } catch (error) {}
  };

  const delPO = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delPO,
      endpoint: endpoints.delPO.endpoint + currentItem.id,
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
          getPO(true);
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

  const closePO = async () => {
    const config = {
      ...endpoints.closePO,
      endpoint: endpoints.closePO.endpoint + closePo.id,
      data: closePo,
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
          getPO(true);
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

  const approvePo = async (id) => {
    setUpdate(true);
    const config = {
      ...endpoints.approvePo,
      endpoint: endpoints.approvePo.endpoint + currentItem.id,
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
          getPO(true);
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

  const rejectPo = async (id) => {
    setUpdate(true);
    const config = {
      ...endpoints.rejectPo,
      endpoint: endpoints.rejectPo.endpoint + currentItem.id,
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
          getPO(true);
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
    return data.id ? (
      <div className="d-flex">
        <Tooltip target={".btn"} />
        <Link
          data-pr-tooltip="Lihat Detail PO"
          data-pr-position="right"
          data-pr-my="left center-2"
          onClick={() => {
            onDetail();
            let pprod = data.pprod;
            let pjasa = data.pjasa;

            dispatch({
              type: SET_CURRENT_PO,
              payload: {
                ...data,
                ord_id: data?.ord_id?.id ?? null,
                product:
                  pprod.length > 0
                    ? pprod
                    : [
                        {
                          id: 0,
                          rprod_id: null,
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
                pjasa:
                  pjasa.length > 0
                    ? pjasa
                    : [
                        {
                          id: 0,
                          rjasa_id: null,
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
        </Link>

        <Link
          data-pr-tooltip="Edit PO"
          data-pr-position="right"
          data-pr-my="left center-2"
          onClick={() => {
            onEdit();
            dispatch({
              type: SET_EDIT_PO,
              payload: true,
            });

            let pprod = data.pprod;
            pprod.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });
            let pjasa = data.pjasa;
            pjasa.forEach((el) => {
              el.jasa_id = el.jasa_id.id;
              el.unit_id = el.unit_id.id;
            });
            // let psup = data.psup;
            // psup.forEach((el) => {
            //   el.sup_id = el.sup_id.id;
            //   el.prod_id = el.prod_id.id;
            // });

            if (!pprod.length) {
              pprod.push({
                id: 0,
                prod_id: null,
                rprod_id: null,
                unit_id: null,
                order: null,
                price: null,
                disc: null,
                nett_price: null,
                total: null,
              });
            }

            if (!pjasa.length) {
              pjasa.push({
                id: 0,
                jasa_id: null,
                rjasa_id: null,
                unit_id: null,
                sup_id: null,
                order: null,
                price: null,
                disc: null,
                nett_price: null,
                total: null,
              });
            }

            // if (!psup.length) {
            //   psup.push({
            //     id: 0,
            //     sup_id: null,
            //     prod_id: null,
            //     price: null,
            //     image: null,
            //   });
            // }

            dispatch({
              type: SET_CURRENT_PO,
              payload: {
                ...data,
                preq_id: data?.preq_id?.id,
                sup_id: data?.sup_id?.id,
                top: data?.top?.id,
                pprod: pprod,
                pjasa: pjasa,
                // psup: psup,
              },
            });
          }}
          className={`btn ${
            data.status === 0 ? "" : "disabled"
          } btn-primary shadow btn-xs sharp ml-1`}
        >
          <i className="fa fa-pencil"></i>
        </Link>

        <Link
          data-pr-tooltip="Close PO"
          data-pr-position="right"
          data-pr-my="left center-2"
          onClick={() => {
            setDisplayConfirm(true);
            dispatch({
              type: SET_EDIT_PO,
              payload: true,
            });

            let pprod = data.pprod;
            pprod.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });
            let pjasa = data.pjasa;
            pjasa.forEach((el) => {
              el.jasa_id = el.jasa_id.id;
              el.unit_id = el.unit_id.id;
            });

            if (!pprod.length) {
              pprod.push({
                id: 0,
                prod_id: null,
                rprod_id: null,
                unit_id: null,
                order: null,
                price: null,
                disc: null,
                nett_price: null,
                total: null,
              });
            }

            if (!pjasa.length) {
              pjasa.push({
                id: 0,
                jasa_id: null,
                rjasa_id: null,
                unit_id: null,
                sup_id: null,
                order: null,
                price: null,
                disc: null,
                nett_price: null,
                total: null,
              });
            }

            dispatch({
              type: SET_CURRENT_PO,
              payload: {
                ...data,
                preq_id: data?.preq_id?.id,
                sup_id: data?.sup_id?.id,
                top: data?.top?.id,
                pprod: pprod,
                pjasa: pjasa,
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
          data-pr-tooltip="Hapus PO"
          data-pr-position="right"
          data-pr-my="left center-2"
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

        {profile?.previlage?.approver && (
          <Link
            data-pr-tooltip="Approve"
            data-pr-position="right"
            data-pr-my="left center-2"
            onClick={() => {
              if (
                canApprove(
                  profile?.approval_settings?.filter(
                    (v) => v.approval_module === "po"
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
                  (v) => v.approval_module === "po"
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
                    (v) => v.approval_module === "po"
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
                  (v) => v.approval_module === "po"
                )[0]?.approval_level,
                data
              )
                ? ""
                : "disabled"
            } btn-danger     shadow btn-xs sharp ml-1`}
          >
            <i className="fa fa-times"></i>
          </Link>
        )}
      </div>
    ) : (
      <div className="d-flex">
        <Tooltip target={".btn"} />
        <Link
          data-pr-tooltip="Create PO"
          data-pr-position="right"
          data-pr-my="left center-2"
          onClick={() => {
            onEdit();
            dispatch({
              type: SET_EDIT_PO,
              payload: false,
            });

            let pprod = data.pprod;
            pprod.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });
            let pjasa = data.pjasa;
            pjasa.forEach((el) => {
              el.jasa_id = el.jasa_id.id;
              el.unit_id = el.unit_id.id;
            });
            // let psup = data.psup;
            // psup.forEach((el) => {
            //   el.sup_id = el.sup_id.id;
            //   el.prod_id = el.prod_id.id;
            // });

            if (!pprod.length) {
              pprod.push({
                id: 0,
                prod_id: null,
                rprod_id: null,
                unit_id: null,
                order: null,
                price: null,
                disc: null,
                nett_price: null,
                total: null,
              });
            }

            if (!pjasa.length) {
              pjasa.push({
                id: 0,
                jasa_id: null,
                rjasa_id: null,
                unit_id: null,
                sup_id: null,
                order: null,
                price: null,
                disc: null,
                nett_price: null,
                total: null,
              });
            }

            // if (!psup.length) {
            //   psup.push({
            //     id: 0,
            //     sup_id: null,
            //     prod_id: null,
            //     price: null,
            //     image: null,
            //   });
            // }

            dispatch({
              type: SET_CURRENT_PO,
              payload: {
                ...data,
                ref_sup: false,
                preq_id: data?.preq_id?.id,
                sup_id: data?.sup_id?.id,
                top: data?.top?.id,
                pprod: pprod,
                pjasa: pjasa,
                psup: [],
                // psup: psup,
              },
            });
          }}
          className={`btn ${
            data.status === 0 ? "" : "disabled"
          } btn-primary shadow btn-xs sharp ml-1`}
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
            delPO();
          }}
          autoFocus
          loading={loading}
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
        {/* <div className="col-12 pt-0">
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
        )} */}
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
            rejectPo();
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
            approvePo();
          }}
          autoFocus
          loading={update}
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
            closePO();
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
            getCodePO();
            getPO();
            onAdd();
            dispatch({
              type: SET_EDIT_PO,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_PO,
              payload: {
                ...data,
                po_code: null ,
                ref_sup: false,
                pprod: [],
                pjasa: [],
                psup: [],
              },
            });
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

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="pt-0">
          <Card>
            <Card.Body>
              <DataTable
                responsiveLayout="scroll"
                value={loading ? dummy : po}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "po_code",
                  "preq_id?.req_code",
                  "formatDate(po_date)",
                ]}
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
                  field={(e) => formatDate(e.po_date)}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].kd_ord}
                  field={(e) => e?.po_code ?? "-"}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].kd_req}
                  field={(e) => e.preq_id?.req_code}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].supplier}
                  field={(e) => e.sup_id?.sup_name ?? "-"}
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
                  header={"GRA"}
                  field={(e) => e.gra_code ?? "-"}
                  // style={{ minWidth: "10rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : e.gra_code ? (
                      <Badge variant="success light">
                        <i className="bx bx-check-double text-success"></i>
                      </Badge>
                    ) : (
                      <Badge variant="danger light">
                        <i className="bx bx-x text-danger"></i>
                      </Badge>
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
          tr[localStorage.getItem("language")].ord_pur
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
          tr[localStorage.getItem("language")].ord_pur
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
        header={`Approve ${tr[localStorage.getItem("language")].ord_pur}`}
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
        header={`Reject ${tr[localStorage.getItem("language")].ord_pur}`}
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

export default PesananPO;
