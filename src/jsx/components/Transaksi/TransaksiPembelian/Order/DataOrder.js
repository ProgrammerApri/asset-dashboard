import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge, Button, Card, Row } from "react-bootstrap";
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

const data = {
  id: null,
  ord_code: null,
  ord_date: null,
  faktur: true,
  po_id: null,
  dep_id: null,
  sup_id: null,
  top: null,
  due_date: null,
  split_order: null,
  prod_disc: null,
  jasa_disc: null,
  total_disc: null,
  dprod: [],
  djasa: [],
};

const DataOrder = ({ onAdd, onEdit }) => {
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
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order.order);
  const show = useSelector((state) => state.order.current);
  const printPage = useRef(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getOrder();
    initFilters1();
  }, []);

  const getOrder = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.order,
      data: order,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        dispatch({ type: SET_ODR, payload: data });
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

  const delODR = async (id) => {
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
        </Link>

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
                po_id: data?.po_id?.id ?? null,
                dep_id: data?.dep_id?.id ?? null,
                sup_id: data?.sup_id?.id ?? null,
                top: data?.top?.id ?? null,
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
        <Button
          variant="primary"
          onClick={() => {
            onAdd();
            dispatch({
              type: SET_EDIT_ODR,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_ODR,
              payload: {
                ...data,
                dprod: [
                  {
                    id: 0,
                    do_id: null,
                    // preq_id: null,
                    // pprod_id: null,
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
                    total: null,
                  },
                ],
              },
            });
          }}
        >
          Tambah{" "}
          <span className="btn-icon-right">
            <i class="bx bx-plus"></i>
          </span>
        </Button>
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

  return (
    <>
      <Toast ref={toast} />
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
        emptyMessage="Tidak ada data"
        paginator
        paginatorTemplate={template2}
        first={first2}
        rows={rows2}
        onPage={onCustomPage2}
        paginatorClassName="justify-content-end mt-3"
      >
        <Column
          header="Tanggal Pembelian"
          style={{
            minWidth: "8rem",
          }}
          field={(e) => formatDate(e.ord_date)}
          body={loading && <Skeleton />}
        />
        <Column
          header="No. Pembelian"
          field={(e) => e.ord_code}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        />
        {/* <Column
          header="No. Pesanan Pembelian"
          field={(e) => e.po_id}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        /> */}
        <Column
          header="Departemen"
          field={(e) => e.dep_id.ccost_name}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        />
        <Column
          header="Faktur"
          field={(e) => e.faktur}
          style={{ minWidth: "8rem" }}
          body={(e) =>
            loading ? (
              <Skeleton />
            ) : (
              <div>
                {e.faktur === true ? (
                  <Badge variant="info light">
                    <i className="bx bxs-circle text-info mr-1"></i> Faktur
                  </Badge>
                ) : (
                  <Badge variant="warning light">
                    <i className="bx bxs-circle text-warning mr-1"></i> Non
                    Faktur
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

      <Dialog
        header={"Detail Pembelian"}
        visible={displayData}
        style={{ width: "40vw" }}
        footer={renderFooter("displayData")}
        onHide={() => {
          setDisplayData(false);
        }}
      >
        <Row className="ml-0 pt-0 fs-12">
          <div className="col-8">
            <label className="text-label">Tanggal Pembelian :</label>
            <span className="ml-1">
              <b>{formatDate(show.ord_date)}</b>
            </span>
          </div>

          <div className="col-4">
            <label className="text-label">Jatuh Tempo :</label>
            <span className="ml-1">
              <b>{formatDate(show.due_date)}</b>
            </span>
          </div>

          <Card className="col-12">
            <div className="row">
              <div className="col-8">
                <label className="text-label">No. Pembelian :</label>
                <span className="ml-1">
                  <b>{show.ord_code}</b>
                </span>
              </div>

              <div className="col-4">
                <label className="text-label">No. Pesanan :</label>
                <span className="ml-1">
                  <b>{show.po_id?.po_code}</b>
                </span>
              </div>
            </div>

            <div className="row">
              <div className="col-8">
                <label className="text-label">Supplier</label>
                <div className="">
                  <span className="ml-0">
                    <b>{show.sup_id?.sup_name}</b>
                  </span>
                  <br />
                  <span>{show.sup_id?.sup_address}</span>
                  <br />
                  <span>{show.sup_id?.sup_telp1}</span>
                </div>
              </div>

              <div className="col-4">
                <label className="text-label"></label>
                <div className="p-inputgroup">
                  <span className="ml-0">
                    {
                      <div>
                        {show.faktur === true ? (
                          <Badge variant="info light">
                            <i className="bx bxs-plus-circle text-info mr-1"></i>{" "}
                            Faktur
                          </Badge>
                        ) : (
                          <Badge variant="warning light">
                            <i className="bx bxs-minus-circle text-warning mr-1"></i>{" "}
                            Non Faktur
                          </Badge>
                        )}
                      </div>
                    }
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Row className="ml-1 mt-0">
            <DataTable
              className="display w-150 datatable-wrapper fs-12"
              value={show?.dprod}
            >
              <Column
                header="Produk"
                field={(e) => `${e.prod_id?.name} (${e.prod_id?.code})`}
                style={{ minWidth: "8rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Jumlah"
                field={(e) => e.order}
                style={{ minWidth: "5rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Satuan"
                field={(e) => e.unit_id?.name}
                style={{ minWidth: "5rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Harga Satuan"
                field={(e) => e.price}
                style={{ minWidth: "8rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Lokasi"
                field={(e) => e.location?.name}
                style={{ minWidth: "8rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Total"
                field={(e) => formatIdr(e.total)}
                style={{ minWidth: "6rem" }}
                // body={loading && <Skeleton />}
              />
            </DataTable>
          </Row>

          {order.djasa?.length ? (
            <Row className="ml-1 mt-5">
              <>
                <DataTable
                  className="display w-150 datatable-wrapper fs-12"
                  value={show?.djasa.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      total: v?.total ?? 0,
                    };
                  })}
                >
                  <Column
                    header="Supplier"
                    field={(e) => e.sup_id?.sup_name}
                    style={{ minWidth: "15rem" }}
                    // body={loading && <Skeleton />}
                  />
                  <Column
                    header="Jasa"
                    field={(e) => e.jasa_id?.name}
                    style={{ minWidth: "15rem" }}
                    // body={loading && <Skeleton />}
                  />
                  <Column
                    header="Total"
                    field={(e) => formatIdr(e.total)}
                    style={{ minWidth: "10rem" }}
                    // body={loading && <Skeleton />}
                  />
                </DataTable>
              </>
              0
            </Row>
          ) : (
            <></>
          )}

          <Row className="ml-0 mr-0 mb-0 mt-4 justify-content-between fs-12">
            <div></div>
            <div className="row justify-content-right col-6 mr-4">
              <div className="col-12 mb-0">
                <label className="text-label">
                  <b>Detail Pembayaran</b>
                </label>
                <Divider className="ml-12"></Divider>
              </div>

              <div className="col-5 mt-2">
                <label className="text-label">
                  {show.split_inv ? "Sub Total Barang" : "Subtotal"}
                </label>
              </div>

              <div className="col-7 mt-2 text-right">
                <label className="text-label">
                  {show.split_inv ? (
                    <b>
                      Rp.
                      {formatIdr(getSubTotalBarang())}
                    </b>
                  ) : (
                    <b>
                      Rp.
                      {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                    </b>
                  )}
                </label>
              </div>

              <div className="col-5">
                <label className="text-label">
                  {show.split_inv ? "DPP Barang" : "DPP"}
                </label>
              </div>

              <div className="col-7 text-right">
                <label className="text-label">
                  {show.split_inv ? (
                    <b>
                      Rp.
                      {formatIdr(getSubTotalBarang())}
                    </b>
                  ) : (
                    <b>
                      Rp.
                      {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                    </b>
                  )}
                </label>
              </div>

              <div className="col-5">
                <label className="text-label">
                  {show.split_inv ? "Pajak Atas Barang (11%)" : "Pajak (11%)"}
                </label>
              </div>

              <div className="col-7 text-right">
                <label className="text-label">
                  {show.split_inv ? (
                    <b>
                      Rp.
                      {formatIdr((getSubTotalBarang() * 11) / 100)}
                    </b>
                  ) : (
                    <b>
                      Rp.{" "}
                      {formatIdr(
                        ((getSubTotalBarang() + getSubTotalJasa()) * 11) / 100
                      )}
                    </b>
                  )}
                </label>
              </div>

              <div className="col-5 mt-0">
                <label className="text-label">Diskon(%)</label>
              </div>

              <div className="col-7 text-right">
                <label className="text-label">
                  <b>Rp. {show.total_disc !== null ? show.total_disc : 0}</b>
                </label>
              </div>

              <div className="col-12">
                <Divider className="ml-12"></Divider>
              </div>

              <div className="col-5">
                <label className="text-label">
                  <b>Total</b>
                </label>
              </div>

              <div className="col-7 text-right">
                <label className="text-label fs-13">
                  {show.split_inv ? (
                    <b>
                      Rp.{" "}
                      {formatIdr(
                        getSubTotalBarang() + (getSubTotalBarang() * 11) / 100
                      )}
                    </b>
                  ) : (
                    <b>
                      Rp.{" "}
                      {formatIdr(
                        getSubTotalBarang() +
                          getSubTotalJasa() +
                          ((getSubTotalBarang() + getSubTotalJasa()) * 11) / 100
                      )}
                    </b>
                  )}
                </label>
              </div>
            </div>
          </Row>
        </Row>
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

export default DataOrder;
