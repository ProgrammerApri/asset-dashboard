import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_INV, SET_EDIT_INV, SET_INV } from "src/redux/actions";
import { Badge } from "primereact/badge";
import { Divider } from "@material-ui/core";
import ReactToPrint from "react-to-print";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { tr } from "../../../../../data/tr";
import {
  SET_CURRENT_FK,
  SET_EDIT_FK,
  SET_FK,
} from "../../../../../redux/actions";
import endpoints from "../../../../../utils/endpoints";

const data = {
  id: null,
  fk_code: null,
  fk_date: null,
  pel_id: null,
  fk_tax: null,
  fk_ppn: null,
  sale_id: null,
  fk_lunas: null,
  fk_desc: null,
  detail: [],
  product: [],
  jasa: [],
};

const DataFakturPJ = ({ onAdd, onDetail, onDetailF }) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [displayData, setDisplayData] = useState(false);
  const [position, setPosition] = useState("center");
  const [displayDel, setDisplayDel] = useState(false);
  const [fkCode, setFkCode] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [isRp, setRp] = useState(false);
  const [setup, setSetup] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const inv = useSelector((state) => state.fk_pj.fk_pj);
  const fk = useSelector((state) => state.fk_pj.current_fk);
  const printPage = useRef(null);
  const [customer, setCustomer] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [doubleClick, setDoubleClick] = useState(false);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getFK();
    getCustomer();
    initFilters1();
  }, []);

  const getFK = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.faktur_pj,
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
        dispatch({ type: SET_FK, payload: filt });
        getSetup();
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
  const getFkCode = async () => {
    setLoading(true);
    const config = {
      ...endpoints.getfaktur_pjcode,
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
          type: SET_CURRENT_FK,
          payload: {
            ...data,
            fk_code: kode,
            detail: [
              {
                id: 0,
                fk_id: 0,
                inv_id: null,
                sale_id: null,
                inv_date: null,
                total_pay: null,
              },
            ],
            det: [
              {
                id: 0,
                fk_id: 0,
                inv_id: null,
                inv_date: null,
                total_pay: null,
              },
            ],
          },
        });
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const getCustomer = async () => {
    const config = {
      ...endpoints.customer,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCustomer(data);
      }
    } catch (error) {}
  };

  const getSetup = async (isUpdate = false) => {
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
        setSetup(data);
      }
    } catch (error) {}
  };

  const checkCus = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer.id) {
        selected = element;
      }
    });

    return selected;
  };

  const delFK = async (id) => {
    const config = {
      ...endpoints.delFkPj,
      endpoint: endpoints.delFkPj.endpoint + currentItem.id,
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
          getFK(true);
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
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            onDetail();
            let detail = data.detail;
            dispatch({
              type: SET_CURRENT_FK,
              payload: {
                ...data,
                detail: detail.length > 0 ? detail : null,
              },
            });
          }}
          className="btn btn-info shadow btn-xs sharp ml-1 mt-1"
        >
          <i className="bx bx-show mt-1"></i>
        </Link>

        <Link
          onClick={() => {
            setEdit(true);
            setDisplayDel(true);
            setCurrentItem(data);
          }}
          className={`btn ${
            data.post === false ? "" : "disabled"
          } btn-danger shadow btn-xs sharp ml-1 mt-1`}
        >
          <i className="fa fa-trash"></i>
        </Link>
      </div>
      // </React.Fragment>
    );
  };

  const FkBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => {
            onDetailF();
            let product = data?.sale_id?.product;
            let jasa = data?.sale_id?.jasa;
            dispatch({
              type: SET_CURRENT_FK,
              payload: {
                ...data,
                product: product.length > 0 ? product : null,
                jasa: jasa.length > 0 ? jasa : null,
              },
            });
            console.log("===========dt");
            console.log(data);
          }}
          className="btn btn-info shadow btn-xs sharp ml-1 mt-1"
        >
          <i className="bx bx-show mt-1"></i>
        </Link>
      </div>
      // </React.Fragment>
    );
  };

  const onClick = () => {
    setDisplayData(true);

    if (position) {
      setPosition(position);
    }
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
            setUpdate(true);
            delFK();
          }}
          autoFocus
          loading={update}
        />
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <div>
        <PButton
          label="Batal"
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
            getFkCode();
            dispatch({
              type: SET_EDIT_FK,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_FK,
              payload: {
                ...data,
                // fk_code: fkCode,
                detail: [
                  {
                    id: 0,
                    fk_id: 0,
                    inv_id: null,
                    sale_id: null,
                    inv_date: null,
                    total_pay: null,
                  },
                ],
                det: [
                  {
                    id: 0,
                    fk_id: 0,
                    inv_id: null,
                    inv_date: null,
                    total_pay: null,
                  },
                ],
              },
            });
          }}
          // disabled={setup?.cutoff == null}
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

  const getSubTotalBarang = () => {
    let total = 0;
    fk?.product?.forEach((el) => {
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
    fk?.jasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return total;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="">
        <DataTable value={data?.detail} responsiveLayout="scroll">
          <Column
            header={"Kode Invoice"}
            style={{ width: "20rem" }}
            field={(e) => `${e.inv_id?.inv_code}`}
          />
          <Column
            header="Kode Penjualan"
            style={{ width: "20rem" }}
            field={(e) => e.sale_id?.ord_code}
          />
          <Column
            header="Tanggal Transaksi"
            style={{ width: "20rem" }}
            field={(e) => formatDate(e.inv_date)}
          />
          <Column
            header={"Total Tagihan"}
            style={{ width: "20rem" }}
            field={(e) => `Rp. ${formatIdr(e.total_pay)}`}
          />
          <Column
            header="Action"
            field={
              FkBodyTemplate
              //   (e) => (
              //   <div className="d-flex">
              //     <Link
              //       onClick={() => {
              //         onDetailF();
              //         let product = data.product;
              //         let jasa = data.jasa;
              //         dispatch({
              //           type: SET_CURRENT_FK,
              //           payload: {
              //             ...data,
              //             product: product?.length > 0 ? product : null,
              //             jasa: jasa?.length > 0 ? jasa : null,
              //           },
              //         });
              //         console.log("===========dt");
              //         console.log(data);
              //       }}
              //       className="btn btn-info shadow btn-xs sharp ml-1 mt-1"
              //     >
              //       <i className="bx bx-show mt-1"></i>
              //     </Link>
              //   </div>
              // )
            }
            style={{ minWidth: "6rem" }}
            body={loading && <Skeleton />}
          />
        </DataTable>
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
                value={loading ? dummy : inv}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "fk_code",
                  "sale_id.ord_code",
                  "formatDate(fk_date)",
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
                    minWidth: "8rem",
                  }}
                  field={(e) => formatDate(e.fk_date)}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].kd_fk}
                  field={(e) => e.fk_code}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={"Pelanggan"}
                  field={(e) => `${e.pel_id?.cus_name} - ${e.pel_id?.cus_code}`}
                  style={{ minWidth: "8rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Action"
                  field={actionBodyTemplate}
                  style={{ minWidth: "6rem" }}
                  body={loading && <Skeleton />}
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

export default DataFakturPJ;
