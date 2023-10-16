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
import { SET_CURRENT_PL, SET_EDIT_PL, SET_PL } from "src/redux/actions";
import { Divider } from "@material-ui/core";
import ReactToPrint from "react-to-print";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { tr } from "src/data/tr";
import { Timeline } from "primereact/timeline";

const data = {
  id: null,
  pcode: null,
  pname: null,
  version: null,
  form_id: null,
  desc: null,
  total: null,
  unit: null,
  product: [],
  material: [],
  sequence: [],
};

const DataPlanning = ({ onAdd, onEdit, onDetail }) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);
  const [displayData, setDisplayData] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);
  const plan = useSelector((state) => state.plan.plan);
  const show = useSelector((state) => state.plan.current);
  const printPage = useRef(null);
  const [expandedRows, setExpandedRows] = useState(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getPlan();
    initFilters1();
  }, []);

  const getPlan_code = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.planning_code,
      data: plan,
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
          type: SET_CURRENT_PL,
          payload: {
            ...data,
            pcode: kode,
            date_created: new Date(),
            dep_id: profile?.previlage?.dep_id ?? null,
            version: 1,
            sequence: [
              {
                id: 0,
                seq: 1,
                wc_id: null,
                loc_id: null,
                mch_id: null,
                work_id: null,
                sup_id: null,
                date: null,
                time: null,
                datetime_actual: null,
                datetime_end: null,
                durasi: null,
                proses: null,
              },
            ],
            product: [],
            material: [],
          },
        });
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

  const getPlan = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.planning,
      data: plan,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        dispatch({ type: SET_PL, payload: data });
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

  const delPL = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delPlan,
      endpoint: endpoints.delPlan.endpoint + currentItem.id,
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
          getPlan(true);
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
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            setDisplayData(data);

            let product = data.product;
            let material = data.material;
            dispatch({
              type: SET_CURRENT_PL,
              payload: {
                ...data,
                product: product.length > 0 ? product : null,
                material: material.length > 0 ? material : null,
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
            dispatch({
              type: SET_EDIT_PL,
              payload: true,
            });
            let product = data.product;
            product.forEach((el) => {
              el.prod_id = el?.prod_id?.id ?? null;
              el.unit_id = el?.unit_id?.id ?? null;
            });
            let material = data.material;
            material.forEach((el) => {
              el.prod_id = el?.prod_id?.id ?? null;
              el.unit_id = el?.unit_id?.id ?? null;
            });
            let sequence = data.sequence;
            sequence.forEach((el) => {
              el.wc_id = el?.wc_id?.id ?? null;
              el.loc_id = el?.loc_id?.id ?? null;
              el.mch_id = el?.mch_id?.id ?? null;
              el.work_id = el?.work_id?.id ?? null;
              el.sup_id = el?.sup_id ?? null;
            });
            dispatch({
              type: SET_CURRENT_PL,
              payload: {
                ...data,
                dep_id: data?.dep_id?.id ?? null,
                form_id: data?.form_id?.id ?? null,
                sequence:
                  sequence.length > 0
                    ? sequence
                    : [
                        {
                          id: 0,
                          seq: 1,
                          wc_id: null,
                          loc_id: null,
                          mch_id: null,
                          work_id: null,
                          sup_id: null,
                          date: null,
                          time: null,
                          datetime_actual: null,
                          datetime_end: null,
                          durasi: null,
                          proses: null,
                        },
                      ],
                product:
                  product.length > 0
                    ? product
                    : [
                        {
                          id: 0,
                          pl_id: null,
                          prod_id: null,
                          unit_id: null,
                          qty_form: null,
                          qty_making: null,
                          aloc: null,
                        },
                      ],
                material:
                  material.length > 0
                    ? material
                    : [
                        {
                          id: 0,
                          pl_id: null,
                          prod_id: null,
                          unit_id: null,
                          qty: null,
                          mat_use: null,
                          total_use: null,
                          price: null,
                          total_price: null,
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
            // setEdit(true);
            setDisplayDel(true);
            setCurrentItem(data);
          }}
          className="btn btn-danger shadow btn-xs sharp ml-1"
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
            delPL();
          }}
          autoFocus
          loading={loading}
        />
      </div>
    );
  };

  const renderFooterDet = () => {
    return (
      <div>
        <PButton
          label="Kembali"
          onClick={() => {
            setDisplayData(false);
          }}
          autoFocus
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
            getPlan_code();
            dispatch({
              type: SET_EDIT_PL,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_PL,
              payload: {
                ...data,
                date_created: new Date(),
                dep_id: profile?.previlage?.dep_id ?? null,
                version: 1,
                sequence: [
                  {
                    id: 0,
                    seq: 1,
                    wc_id: null,
                    loc_id: null,
                    mch_id: null,
                    work_id: null,
                    sup_id: null,
                    date: null,
                    time: null,
                    datetime_actual: null,
                    datetime_end: null,
                    durasi: null,
                    proses: null,
                  },
                ],
                product: [],
                material: [],
              },
            });
          }}
        />
      </div>
    );
  };

  // const renderFooter = () => {
  //   return (
  //     <div>
  //       <PButton
  //         label="Batal"
  //         onClick={() => setDisplayData(false)}
  //         className="p-button-text btn-primary"
  //       />
  //       <ReactToPrint
  //         trigger={() => {
  //           return (
  //             <PButton variant="primary" onClick={() => {}}>
  //               Print{" "}
  //               <span className="btn-icon-right">
  //                 <i class="bx bxs-printer"></i>
  //               </span>
  //             </PButton>
  //           );
  //         }}
  //         content={() => printPage.current}
  //       />
  //     </div>
  //   );
  // };

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

  const formatDateTime = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      hour = d.getHours(),
      minute = d.getMinutes(),
      second = d.getSeconds();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hour.length < 2) hour = "0" + hour;
    if (minute.length < 2) minute = "0" + minute;
    if (second.length < 2) second = "0" + second;

    return [hour, minute, second].join(":");
  };

  const formatTh = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const customizedMarker = (item, index, data) => {
    console.log(index);
    return (
      <span
        className="flex align-items-center justify-content-center z-1 p-1 border-circle"
        style={{
          backgroundColor:
            item.proses === 1
              ? "orange"
              : item.proses === 0
              ? "#21BF99"
              : "white",
          border: item.proses == 1 ? "2px solid orange" : "2px solid #21BF99",
        }}
      >
        <i
          className={item.proses === 1 ? "pi pi-times" : "pi pi-check"}
          style={{ fontSize: "0.4rem", fontWeight: "bold", color: "white" }}
        ></i>
      </span>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="pt-0">
          <DataTable
            responsiveLayout="scroll"
            value={loading ? dummy : plan}
            className="display w-150 datatable-wrapper"
            showGridlines
            dataKey="id"
            rowHover
            header={renderHeader}
            filters={filters1}
            globalFilterFields={["pcode", "pname", "form_id.fcode"]}
            emptyMessage="Tidak ada data"
            paginator
            paginatorTemplate={template2}
            first={first2}
            rows={rows2}
            onPage={onCustomPage2}
            paginatorClassName="justify-content-end mt-3"
          >
            <Column
              header="Tanggal"
              style={{
                minWidth: "8rem",
              }}
              field={(e) => formatDate(e.date_created)}
              body={loading && <Skeleton />}
            />
            <Column
              header="Kode Routing"
              style={{
                minWidth: "8rem",
              }}
              field={(e) => e.pcode}
              body={loading && <Skeleton />}
            />
            <Column
              header="Nama Routing"
              field={(e) => e.pname}
              style={{ minWidth: "10rem" }}
              body={loading && <Skeleton />}
            />
            <Column
              header="Versi Routing"
              field={(e) => e.version}
              style={{ minWidth: "8rem" }}
              body={loading && <Skeleton />}
            />
            <Column
              header="Kode Formula"
              field={(e) => e.form_id.fcode}
              style={{ minWidth: "8rem" }}
              body={loading && <Skeleton />}
            />
            <Column
              header="Nama Formula"
              field={(e) => e.form_id.fname}
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
        </Col>
      </Row>

      <Dialog
        header={"Routing Produk & Material"}
        visible={displayData}
        style={{ width: "65vw", height: "50vw" }}
        footer={renderFooterDet("displayData")}
        onHide={() => {
          setDisplayData(false);
        }}
      >
        <div className="ml-3 mr-3">
          <label className="text-label fs-13 text-black mt-0">
            <b>Routing Sequence</b>
          </label>
          <Timeline
            value={show?.sequence}
            layout="horizontal"
            align="top"
            marker={(item, index) => customizedMarker(item, index, show)}
            content={(item) => (
              <div
                className=""
                style={{
                  minWidth: "3rem",
                  minHeight: "4rem",
                  // maxHeight: "8rem",
                }}
              >
                <div className="pt-0 mt-0">
                  <b>{`Proses Ke- ${item.seq}`}</b>
                </div>

                <div className="fs-12">
                  {item?.datetime_actual
                    ? `Actual Date: ${formatDate(
                        item.datetime_actual
                      )} ${formatDateTime(item?.datetime_actual)}`
                    : "-"}
                </div>

                <div className="fs-12 mt-1">
                  {item?.datetime_end
                    ? `End Date: ${formatDate(
                        item.datetime_end
                      )} ${formatDateTime(item?.datetime_end)}`
                    : "-"}
                </div>

                <div className="fs-12 mt-1">
                  {item?.batch_code ? `Batch Code: ${item?.batch_code}` : "-"}
                </div>

                <div className="fs-12 mt-2">
                  {item.proses === 0 ? (
                    <Badge variant="success light">
                      <i className="bx bx-check text-success mr-1"></i> Done
                    </Badge>
                  ) : item.proses === 1 ? (
                    <Badge variant="warning light">
                      <i className="bx bx-circle text-warning mr-1"></i> Panding
                    </Badge>
                  ) : (
                    <Badge variant="danger light">
                      <i className="bx bx-x text-danger mr-1"></i> No Proses
                    </Badge>
                  )}
                </div>
              </div>
            )}
          />

          <label className="text-label fs-13 text-black mt-4">
            <b>{"Produk Jadi"}</b>
          </label>

          <DataTable value={show?.product} responsiveLayout="scroll">
            <Column
              header={tr[localStorage.getItem("language")].prod_jd}
              field={(e) => `${e.prod_id?.name} (${e.prod_id?.code})`}
              style={{ minWidth: "15rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header={"Qty Formula"}
              field={(e) => formatTh(e.qty_form)}
              style={{ minWidth: "6rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header={"Qty Pembuatan"}
              field={(e) => formatTh(e.qty_making)}
              style={{ minWidth: "6rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header={tr[localStorage.getItem("language")].satuan}
              field={(e) => e.unit_id?.name}
              style={{ minWidth: "7rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header={"Cost Alokasi (%)"}
              field={(e) => formatTh(e.aloc)}
              style={{ minWidth: "6rem" }}
              // body={loading && <Skeleton />}
            />
          </DataTable>

          <label className="text-label fs-13 text-black mt-4">
            <b>{"Produk Material"}</b>
          </label>

          <DataTable value={show?.material} responsiveLayout="scroll">
            <Column
              header={tr[localStorage.getItem("language")].prod_jd}
              field={(e) => `${e.prod_id?.name} (${e.prod_id?.code})`}
              style={{ minWidth: "15rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header={"Qty Formula"}
              field={(e) => formatTh(e.qty)}
              style={{ minWidth: "6rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header={"Qty Pemakaian"}
              field={(e) => formatTh(e.mat_use)}
              style={{ minWidth: "6rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header={"Total Pemakaian"}
              field={(e) => formatTh(e.total_use)}
              style={{ minWidth: "6rem" }}
              // body={loading && <Skeleton />}
            />
            <Column
              header={tr[localStorage.getItem("language")].satuan}
              field={(e) => e.unit_id?.name}
              style={{ minWidth: "7rem" }}
              // body={loading && <Skeleton />}
            />
          </DataTable>
        </div>
      </Dialog>

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

export default DataPlanning;
