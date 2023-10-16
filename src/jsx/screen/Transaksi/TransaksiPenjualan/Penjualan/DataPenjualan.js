import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Row, Card, Col, Badge } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_SL, SET_EDIT_SL, SET_SL } from "src/redux/actions";
import { Divider } from "@material-ui/core";
import ReactToPrint from "react-to-print";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { tr } from "src/data/tr";
import { Tooltip } from "primereact/tooltip";

const data = {
  id: null,
  modul: null,
  ord_code: null,
  ord_date: null,
  no_doc: null,
  doc_date: null,
  so_id: null,
  invoice: null,
  pel_id: null,
  proj_id: null,
  ppn_type: null,
  sub_addr: null,
  sub_id: null,
  slsm_id: null,
  surat_jalan: 2,
  req_date: null,
  top: null,
  due_date: false,
  split_inv: null,
  prod_disc: null,
  jasa_disc: null,
  total_disc: null,
  total_disc_rp: null,
  total_b: null,
  total_bayar: null,
  jprod: [],
  jjasa: [],
};

const DataPenjualan = ({ onAdd, onEdit, onDetail }) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const [supplier, setSupp] = useState(null);
  const [currency, setCurrency] = useState(null);
  const dispatch = useDispatch();
  const sale = useSelector((state) => state.sl.sl);
  const show = useSelector((state) => state.sl.current);
  const printPage = useRef(null);
  const [expandedRows, setExpandedRows] = useState(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getSale();
    getSupp();
    getCur();
    initFilters1();
  }, []);

  const getSale = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.sale,
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
        const filteredData = data.filter((item) => item.modul !== "sale");

        dispatch({ type: SET_SL, payload: filteredData });
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

  const getSaleCode = async () => {
    // setLoading(true);
    const config = {
      ...endpoints.code_sale,
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
          type: SET_CURRENT_SL,
          payload: {
            ...data,
            ord_code: kode,
            surat_jalan: 2,
            jprod: [
              {
                id: 0,
                pj_id: null,
                prod_id: null,
                unit_id: null,
                location: null,
                stock: null,
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
            jjasa: [
              {
                id: 0,
                pj_id: null,
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
  };

  const getSupp = async () => {
    const config = {
      ...endpoints.supplier,
      data: {},
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;

        setSupp(data);
      }
    } catch (error) {}
  };

  const getCur = async () => {
    const config = {
      ...endpoints.currency,
      data: {},
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;

        setCurrency(data);
      }
    } catch (error) {}
  };

  const delSale = async (id) => {
    const config = {
      ...endpoints.delSales,
      endpoint: endpoints.delSales.endpoint + currentItem.id,
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
          getSale(true);
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
        {/* <Link
          onClick={() => {
            onDetail();
            let jprod = data.jprod;
            let jjasa = data.jjasa;

            dispatch({
              type: SET_CURRENT_SL,
              payload: {
                ...data,
                jprod: jprod.length > 0 ? jprod : null,
                jjasa: jjasa.length > 0 ? jjasa : null,
              },
            });
          }}
          className="btn btn-info shadow btn-xs sharp ml-1"
        >
          <i className="bx bx-show mt-1"></i>
        </Link> */}

        <Link
          onClick={() => {
            onEdit();
            dispatch({
              type: SET_EDIT_SL,
              payload: true,
            });

            let jprod = data.jprod;
            jprod.forEach((el) => {
              el.prod_id = el?.prod_id?.id ?? null;
              el.unit_id = el?.unit_id?.id ?? null;
              el.location = el.location?.id ?? null;
            });
            let jjasa = data.jjasa;
            jjasa.forEach((el) => {
              el.jasa_id = el?.jasa_id?.id ?? null;
              el.unit_id = el?.unit_id?.id ?? null;
            });

            if (!jprod.length) {
              jprod.push({
                id: 0,
                pj_id: 0,
                prod_id: null,
                unit_id: null,
                location: null,
                rak_aktif: null,
                rak_id: null,
                order: null,
                konv_qty: 0,
                unit_konv: null,
                price: null,
                price_idr: 0,
                disc: null,
                nett_price: null,
                total_fc: 0,
                total: null,
              });
            }

            if (!jjasa.length) {
              jjasa.push({
                id: 0,
                sup_id: null,
                jasa_id: null,
                unit_id: null,
                order: null,
                price: null,
                disc: null,
                nett_price: null,
                total_fc: null,
                total: null,
              });
            }

            dispatch({
              type: SET_CURRENT_SL,
              payload: {
                ...data,
                // so_id: data?.so_id?.id,
                pel_id: data?.pel_id?.id ?? null,
                proj_id: data?.proj_id?.id ?? null,
                slsm_id: data?.slsm_id?.id ?? null,
                top: data?.top?.id,
                jprod: jprod,
                jjasa: jjasa,
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
            setUpdate(true);
            delSale();
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
            getSaleCode();
            dispatch({
              type: SET_EDIT_SL,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_SL,
              payload: {
                ...data,
                surat_jalan: 2,
                jprod: [
                  {
                    id: 0,
                    pj_id: 0,
                    prod_id: null,
                    unit_id: null,
                    location: null,
                    rak_aktif: null,
                    rak_id: null,
                    order: null,
                    konv_qty: 0,
                    unit_konv: null,
                    price: null,
                    price_idr: 0,
                    disc: null,
                    nett_price: null,
                    total_fc: 0,
                    total: null,
                  },
                ],
                jjasa: [
                  {
                    id: 0,
                    pj_id: null,
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

  const formatTh = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const formatIdr = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const getSubTotalBarang = () => {
    let total = 0;
    show?.jprod?.forEach((el) => {
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
    show?.jjasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return total;
  };

  const checkSupp = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element?.supplier?.id) {
        selected = element;
      }
    });
    return selected;
  };

  const rowExpansionTemplate = (data) => {
    let cur_rate = 0;
    let cur_code = null;

    currency?.forEach((element) => {
      if (data?.pel_id?.cus_curren === element.id) {
        cur_rate = element?.rate;
        cur_code = element?.code;
      }
    });

    return (
      <div className="">
        <label className="text-label fs-13 text-black">
          <b>Daftar Produk</b>
        </label>

        <DataTable value={data?.jprod} responsiveLayout="scroll">
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
            header="Harga Satuan"
            field={(e) =>
              data?.pel_id?.cus_curren
                ? `${cur_code} ${formatIdr(e.price)}`
                : `Rp. ${formatIdr(e.price)}`
            }
            style={{ minWidth: "8rem" }}
            // body={loading && <Skeleton />}
          />
          <Column
            hidden={data?.pel_id?.cus_curren == null}
            header="Harga Satuan (IDR)"
            field={(e) =>
              data?.pel_id?.cus_curren
                ? `Rp. ${formatIdr(e.price * cur_rate)}`
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

        {data?.jjasa?.length ? (
          <>
            <label className="text-label fs-13 text-black">
              <b>Daftar Jasa</b>
            </label>

            <DataTable value={data?.jjasa} responsiveLayout="scroll">
              <Column
                header="Supplier"
                field={(e) =>
                  e.sup_id
                    ? `${checkSupp(e.sup_id)?.supplier?.sup_name} (${
                        checkSupp(e.sup_id)?.supplier?.sup_code
                      })`
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
                header="Total"
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
                value={loading ? dummy : sale}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "ord_code",
                  "formatDate(ord_date)",
                  "so_id.so_code",
                  "pel_id.cus_name",
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
                  field={(e) => formatDate(e.ord_date)}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].kd_sale}
                  field={(e) => e.ord_code}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].kd_so}
                  field={(e) => e.so_id?.so_code ?? "-"}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={tr[localStorage.getItem("language")].customer}
                  field={(e) => e.pel_id?.cus_name}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header={"Dokumen"}
                  field={(e) => e.surat_jalan}
                  style={{ minWidth: "8rem" }}
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div>
                        <Tooltip target=".link" />
                        <Link
                          className="link"
                          data-pr-tooltip="Lihat Invoice"
                          data-pr-position="right"
                          data-pr-at="right+5 top"
                          data-pr-my="left center-2"
                          onClick={() => {
                            onDetail();
                            let jprod = e?.jprod;
                            let jjasa = e?.jjasa;

                            dispatch({
                              type: SET_CURRENT_SL,
                              payload: {
                                ...e,
                                jprod: jprod?.length > 0 ? jprod : null,
                                jjasa: jjasa?.length > 0 ? jjasa : null,
                              },
                            });
                          }}
                          // className="btn btn-info shadow btn-xs sharp ml-1"
                        >
                          {e.surat_jalan === 1 ? (
                            <>
                              <Badge variant="info light">
                                <i className="bx bxs-plus-circle text-info mr-1 mt-1"></i>{" "}
                                Invoice
                              </Badge>
                            </>
                          ) : (
                            <Badge variant="success light">
                              <i className="bx bxs-plus-circle text-success mr-1 mt-1"></i>{" "}
                              Invoice + Faktur
                            </Badge>
                          )}
                        </Link>
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
          tr[localStorage.getItem("language")].sale
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

export default DataPenjualan;
