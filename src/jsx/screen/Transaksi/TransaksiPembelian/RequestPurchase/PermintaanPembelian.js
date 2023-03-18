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
import { SET_CURRENT_RP, SET_EDIT, SET_RP } from "src/redux/actions";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { tr } from "src/data/tr";

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
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const rp = useSelector((state) => state.rp.rp);
  const show = useSelector((state) => state.rp.current);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getPermintaan();
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

  const delPermintaan = async (id) => {
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

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
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
      >
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
    </>
  );
};

export default PermintaanPembelian;
