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
import { SET_BTC, SET_CURRENT_BTC, SET_EDIT_BTC } from "src/redux/actions";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";

const data = {
  id: null,
  bcode: null,
  bname: null,
  batch_date: null,
  plan_id: null,
  desc: null,
  sequence: [],
  product: [],
  material: [],
};

const DataBatch = ({ onAdd, onEdit, onDetail }) => {
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
  const btc = useSelector((state) => state.btc.btc);
  const show = useSelector((state) => state.btc.current);
  const printPage = useRef(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getBatch();
    initFilters1();
  }, []);

  const getBatch_code = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.batch_code,
      data: btc,
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
          type: SET_CURRENT_BTC,
          payload: {
            ...data,
            bcode:kode,
            sequence: [
              {
                id: 0,
                seq: null,
                wc_id: null,
                loc_id: null,
                mch_id: null,
                work_id: null,
                sup_id: null,
                datetime_plan: null,
                datetime_actual: null,
                datetime_end: null,
                durasi: null,
                proses: null,
              },
            ],
            product: [
              {
                id: 0,
                prod_id: null,
                unit_id: null,
                qty_making: null,
                aloc: null,
                qty_receive: null,
                qty_reject: null,
                loc_reject: null,
                wc_mutation: null,
                remain: null,
              },
            ],
            material: [
              {
                id: 0,
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
  const getBatch = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.batch,
      data: btc,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        dispatch({ type: SET_BTC, payload: data });
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

  const delBTC = async (id) => {
    setLoading(true);
    const config = {
      ...endpoints.delBatch,
      endpoint: endpoints.delBatch.endpoint + currentItem.id,
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
          getBatch(true);
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
            onDetail();
            let sequence = data.sequence;
            let product = data.product;
            let material = data.material;

            sequence?.forEach((el) => {
              el.wc_id = el?.wc_id ?? null;
              el.loc_id = el?.loc_id ?? null;
              el.mch_id = el?.mch_id ?? null;
              el.work_id = el?.work_id ?? null;
              el.sup_id = el?.sup_id ?? null;
            });

            product?.forEach((element) => {
              element.qty = element.qty * Number(data.plan_id.total);
            });

            material?.forEach((elem) => {
              elem.qty = elem.qty * Number(data.plan_id.total);
            });

            dispatch({
              type: SET_CURRENT_BTC,
              payload: {
                ...data,
                product: product?.length > 0 ? product : null,
                material: material?.length > 0 ? material : null,
                sequence: sequence?.length > 0 ? sequence : null,
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
              type: SET_EDIT_BTC,
              payload: true,
            });

            let sequence = data.sequence;
            sequence?.forEach((el) => {
              el.wc_id = el?.wc_id?.id ?? null;
              el.loc_id = el?.loc_id?.id ?? null;
              el.mch_id = el?.mch_id?.id ?? null;
              el.work_id = el?.work_id?.id ?? null;
              el.sup_id = el?.sup_id?.id ?? null;
            });

            let product = data.product;
            product?.forEach((element) => {
              element.prod_id = element.prod_id?.id;
              element.unit_id = element.unit_id?.id;
              element.loc_reject = element?.loc_reject?.id;
            });

            let material = data.material;
            material?.forEach((elem) => {
              elem.prod_id = elem?.prod_id?.id ?? null;
              elem.unit_id = elem?.unit_id?.id ?? null;
            });

            dispatch({
              type: SET_CURRENT_BTC,
              payload: {
                ...data,
                plan_id: data?.plan_id?.id ?? null,
                sequence:
                  sequence?.length > 0
                    ? sequence
                    : [
                        {
                          id: 0,
                          seq: null,
                          wc_id: null,
                          loc_id: null,
                          mch_id: null,
                          work_id: null,
                          sup_id: null,
                          datetime_plan: null,
                          datetime_actual: null,
                          datetime_end: null,
                          durasi: null,
                          proses: null,
                        },
                      ],
                material:
                  material?.length > 0
                    ? material
                    : [
                        {
                          id: 0,
                          prod_id: null,
                          unit_id: null,
                          qty: null,
                          mat_use: null,
                          total_use: null,
                          price: null,
                          total_price: null,
                        },
                      ],
                product:
                  product?.length > 0
                    ? product
                    : [
                        {
                          id: 0,
                          prod_id: null,
                          unit_id: null,
                          qty_making: null,
                          aloc: null,
                          qty_receive: null,
                          qty_reject: null,
                          loc_reject: null,
                          wc_mutation: null,
                          remain: null,
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
            delBTC();
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
            getBatch_code()
            dispatch({
              type: SET_EDIT_BTC,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_BTC,
              payload: {
                ...data,
                seqq: [
                  {
                    id: 0,
                    seq: null,
                    wc_id: null,
                    loc_id: null,
                    mch_id: null,
                    work_id: null,
                    sup_id: null,
                    datetime_plan: null,
                    datetime_actual: null,
                    datetime_end: null,
                    durasi: null,
                    proses: null,
                  },
                ],
                sequence: [
                  {
                    id: 0,
                    seq: null,
                    wc_id: null,
                    loc_id: null,
                    mch_id: null,
                    work_id: null,
                    sup_id: null,
                    datetime_plan: null,
                    datetime_actual: null,
                    datetime_end: null,
                    durasi: null,
                    proses: null,
                  },
                ],
                product: [
                  {
                    id: 0,
                    prod_id: null,
                    unit_id: null,
                    qty_making: null,
                    aloc: null,
                    qty_receive: null,
                    qty_reject: null,
                    loc_reject: null,
                    wc_mutation: null,
                    remain: null,
                  },
                ],
                material: [
                  {
                    id: 0,
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
                value={loading ? dummy : btc}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "bcode",
                  "plan_id.pcode",
                ]}
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
                  field={(e) => formatDate(e.batch_date)}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Batch"
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => e.bcode ?? "-"}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Batch"
                  style={{
                    minWidth: "8rem",
                  }}
                  field={(e) => e.bname ?? "-"}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Planning"
                  field={(e) => e.plan_id?.pcode ?? "-"}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Planning"
                  field={(e) => e.plan_id?.pname}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Formula"
                  field={(e) => e.plan_id?.form_id?.fcode ?? "-"}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Formula"
                  field={(e) => e.plan_id?.form_id?.fname ?? "-"}
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

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

export default DataBatch;
