import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
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

const data = {
  id: null,
  fk_code: null,
  fk_date: null,
  fk_tax: null,
  fk_ppn: null,
  fk_lunas: null,
  ord_id: null,
  product: [],
  jasa: [],
};

const DataFaktur = ({ onAdd, onDetail }) => {
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
  const [isRpJasa, setRpJasa] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);
  const dispatch = useDispatch();
  const inv = useSelector((state) => state.inv.inv);
  const fk = useSelector((state) => state.inv.current);
  const printPage = useRef(null);
  const [supplier, setSupplier] = useState(null);
  const [doubleClick, setDoubleClick] = useState(false);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getFK();
    getSupplier();
    initFilters1();
  }, []);

  const getFK = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.faktur,
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
        dispatch({ type: SET_INV, payload: data });
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

  const getSupplier = async () => {
    const config = {
      ...endpoints.supplier,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSupplier(data);
      }
    } catch (error) {}
  };

  const checkSupp = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element.supplier.id) {
        selected = element;
      }
    });

    return selected;
  };

  const delFK = async (id) => {
    const config = {
      ...endpoints.delFK,
      endpoint: endpoints.delFK.endpoint + currentItem.id,
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
            let jasa = data.jasa;
            dispatch({
              type: SET_CURRENT_INV,
              payload: {
                ...data,
                product:
                  product.length > 0
                    ? product
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
                jasa:
                  jasa.length > 0
                    ? jasa
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
          className="btn btn-danger shadow btn-xs sharp ml-1 mt-1"
        >
          <i className="fa fa-trash"></i>
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
          label="Batal"
          onClick={() => setDisplayDel(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Hapus"
          icon="pi pi-trash"
          onClick={() => {
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
            placeholder="Cari disini"
          />
        </span>
        <PrimeSingleButton
          label="Tambah"
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            onAdd();
            dispatch({
              type: SET_EDIT_INV,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_INV,
              payload: {
                ...data,
                // fk_code: fkCode,
                product: [
                  {
                    id: 0,
                    ord_id: null,
                    prod_id: null,
                    unit_id: null,
                    order: null,
                    price: null,
                    disc: null,
                    location: null,
                    nett_price: null,
                    total: null,
                  },
                ],
                jasa: [
                  {
                    id: 0,
                    ord_id: null,
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

  return (
    <>
      <Toast ref={toast} />
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
          "ord_id.ord_code",
          "formatDate(fk_date)",
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
          style={{
            minWidth: "8rem",
          }}
          field={(e) => formatDate(e.fk_date)}
          body={loading && <Skeleton />}
        />
        <Column
          header="Nomor Faktur"
          field={(e) => e.fk_code}
          style={{ minWidth: "8rem" }}
          body={loading && <Skeleton />}
        />
        <Column
          header="Nomor Pembelian"
          field={(e) => e.ord_id.ord_code}
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

      <Dialog
        header={"Detail Faktur"}
        visible={displayData}
        style={{ width: "41vw" }}
        footer={renderFooter("displayData")}
        onHide={() => {
          setDisplayData(false);
        }}
      >
        <Row className="ml-0 pt-0 fs-12">
          <div className="col-8">
            <label className="text-label">Tanggal Faktur :</label>
            <span className="ml-1">
              <b>{formatDate(fk.fk_date)}</b>
            </span>
          </div>

          <Card className="col-12">
            <div className="row">
              <div className="col-8">
                <label className="text-label">No. Faktur :</label>
                <span className="ml-1">
                  <b>{fk.fk_code}</b>
                </span>
              </div>

              <div className="col-4">
                <label className="text-label">No. Pembelian :</label>
                <span className="ml-1">
                  <b>{fk.ord_id?.ord_code}</b>
                </span>
              </div>
            </div>

            <div className="row">
              <div className="col-8">
                <label className="text-label">Supplier</label>
                <div className="">
                  <span className="ml-0">
                    <b>{checkSupp(fk.ord_id?.sup_id).supplier?.sup_name}</b>
                  </span>
                  <br />
                  <span>{checkSupp(fk.ord_id?.sup_id)?.supplier?.sup_address}</span>
                  <br />
                  <span>{checkSupp(fk.ord_id?.sup_id)?.supplier?.sup_telp1}</span>
                </div>
              </div>
            </div>
          </Card>

          <Row className="ml-1 mt-0">
            <DataTable
              value={fk.product?.map((v, i) => {
                return {
                  ...v,
                  index: i,
                  price: v?.price ?? 0,
                  total: v?.total ?? 0,
                };
              })}
              responsiveLayout="scroll"
              className="display w-150 datatable-wrapper fs-12"
              showGridlines
              dataKey="id"
              rowHover
            >
              <Column
                header="Produk"
                field={(e) => e.prod_id?.name}
                style={{ minWidth: "8rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Jumlah"
                field={(e) => e.order}
                style={{ minWidth: "6rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Satuan"
                field={(e) => e.unit_id?.name}
                style={{ minWidth: "6rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Harga Satuan"
                field={(e) => formatIdr(e.price)}
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
                style={{ minWidth: "5rem" }}
                // body={loading && <Skeleton />}
              />
            </DataTable>
          </Row>

          {inv.jasa?.length ? (
            <Row className="ml-1 mt-5">
              <>
                <DataTable
                  value={fk.jasa?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      price: v?.price ?? 0,
                      disc: v?.disc ?? 0,
                      total: v?.total ?? 0,
                    };
                  })}
                  responsiveLayout="scroll"
                  className="display w-150 datatable-wrapper fs-12"
                  showGridlines
                  dataKey="id"
                  rowHover
                >
                  <Column
                    header="Supplier"
                    field={(e) => e.sup_id?.sup_name}
                    style={{ minWidth: "14rem" }}
                    // body={loading && <Skeleton />}
                  />
                  <Column
                    header="Jasa"
                    field={(e) => e.jasa_id?.name}
                    style={{ minWidth: "14rem" }}
                    // body={loading && <Skeleton />}
                  />
                  <Column
                    header="Total"
                    field={(e) => e.total}
                    style={{ minWidth: "13rem" }}
                    // body={loading && <Skeleton />}
                  />
                </DataTable>
              </>
            </Row>
          ) : (
            <></>
          )}

          <Row className="ml-0 mr-0 mb-0 mt-4 justify-content-between">
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
                  {fk.split_inv ? "Sub Total Barang" : "Subtotal"}
                </label>
              </div>

              <div className="col-7 mt-2">
                <label className="text-label">
                  {fk.split_inv ? (
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
                  {fk.split_inv ? "DPP Barang" : "DPP"}
                </label>
              </div>

              <div className="col-7">
                <label className="text-label">
                  {fk.split_inv ? (
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
                  {fk.split_inv ? "Pajak Atas Barang (11%)" : "Pajak (11%)"}
                </label>
              </div>

              <div className="col-7">
                <label className="text-label">
                  {fk.split_inv ? (
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

              <div className="col-7">
                <label className="text-label"><b>{fk.total_disc !== null ? fk.total_disc : 0}</b></label>
              </div>

              <div className="col-12">
                <Divider className="ml-12"></Divider>
              </div>

              <div className="col-5">
                <label className="text-label">
                  <b>Total</b>
                </label>
              </div>

              <div className="col-7">
                <label className="text-label fs-13">
                  {fk.split_inv ? (
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

        <Row className="ml-0 pt-0 d-none">
          <Col>
            <Card ref={printPage}>
              <Card.Body>
                <CustomeWrapper
                  tittle={"Faktur Pembelian"}
                  body={
                    <Card>
                      <div className="col-8">
                        <label className="text-label">Tanggal Faktur</label>
                        <div className="p-inputgroup">
                          <span className="ml-4">{formatDate(fk.fk_date)}</span>
                        </div>
                      </div>

                      <div className="col-4">
                        <label className="text-label">No. Faktur</label>
                        <div className="p-inputgroup">
                          <span className="ml-4">{fk.fk_code}</span>
                        </div>
                      </div>

                      <div className="col-8">
                        <label className="text-label">No. Pembelian</label>
                        <div className="p-inputgroup"></div>
                        <span className="ml-0">{fk.ord_id?.ord_code}</span>
                      </div>

                      <div className="col-4">
                        <label className="text-label">Supplier</label>
                        <div className="p-inputgroup">
                          <span className="ml-0">
                            {fk.ord_id?.sup_id?.sup_name}
                          </span>
                        </div>
                      </div>

                      <Row className="ml-1 mt-4">
                        <DataTable
                          className="display w-150 datatable-wrapper fs-12"
                          value={fk.product?.map((v, i) => {
                            return {
                              ...v,
                              index: i,
                              price: v?.price ?? 0,
                              total: v?.total ?? 0,
                            };
                          })}
                        >
                          <Column
                            header="Produk"
                            field={(e) => e.prod_id?.name}
                            style={{ minWidth: "12rem" }}
                            // body={loading && <Skeleton />}
                          />
                          <Column
                            header="Jumlah"
                            field={(e) => e.order}
                            style={{ minWidth: "8rem" }}
                            // body={loading && <Skeleton />}
                          />
                          <Column
                            header="Satuan"
                            field={(e) => e.unit_id?.name}
                            style={{ minWidth: "8rem" }}
                            // body={loading && <Skeleton />}
                          />
                          <Column
                            header="Harga Satuan"
                            field={(e) => formatIdr(e.price)}
                            style={{ minWidth: "12rem" }}
                            // body={loading && <Skeleton />}
                          />
                          <Column
                            header="Lokasi"
                            field={(e) => e.location?.name}
                            style={{ minWidth: "11rem" }}
                            // body={loading && <Skeleton />}
                          />
                          <Column
                            header="Total"
                            field={(e) => formatIdr(e.total)}
                            style={{ minWidth: "10rem" }}
                            // body={loading && <Skeleton />}
                          />
                        </DataTable>
                      </Row>

                      {inv.jasa?.length ? (
                        <Row className="ml-1 mt-5">
                          <>
                            <DataTable
                              className="display w-150 datatable-wrapper fs-12"
                              value={fk.jasa?.map((v, i) => {
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
                                style={{ minWidth: "21rem" }}
                                // body={loading && <Skeleton />}
                              />
                              <Column
                                header="Jasa"
                                field={(e) => e.jasa_id?.name}
                                style={{ minWidth: "20rem" }}
                                // body={loading && <Skeleton />}
                              />
                              <Column
                                header="Total"
                                field={(e) => formatIdr(e.total)}
                                style={{ minWidth: "20rem" }}
                                // body={loading && <Skeleton />}
                              />
                            </DataTable>
                          </>
                        </Row>
                      ) : (
                        <></>
                      )}

                      <Row className="ml-0 mr-0 mb-0 mt-4 justify-content-between">
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
                              {fk.split_inv ? "Sub Total Barang" : "Subtotal"}
                            </label>
                          </div>

                          <div className="col-7 mt-2 text-right">
                            <label className="text-label">
                              {fk.split_inv ? (
                                <b>
                                  Rp.
                                  {formatIdr(getSubTotalBarang())}
                                </b>
                              ) : (
                                <b>
                                  Rp.
                                  {formatIdr(
                                    getSubTotalBarang() + getSubTotalJasa()
                                  )}
                                </b>
                              )}
                            </label>
                          </div>

                          <div className="col-5">
                            <label className="text-label">
                              {fk.split_inv ? "DPP Barang" : "DPP"}
                            </label>
                          </div>

                          <div className="col-7 text-right">
                            <label className="text-label">
                              {fk.split_inv ? (
                                <b>
                                  Rp.
                                  {formatIdr(getSubTotalBarang())}
                                </b>
                              ) : (
                                <b>
                                  Rp.
                                  {formatIdr(
                                    getSubTotalBarang() + getSubTotalJasa()
                                  )}
                                </b>
                              )}
                            </label>
                          </div>

                          <div className="col-5">
                            <label className="text-label">
                              {fk.split_inv
                                ? "Pajak Atas Barang (11%)"
                                : "Pajak (11%)"}
                            </label>
                          </div>

                          <div className="col-7 text-right">
                            <label className="text-label">
                              {fk.split_inv ? (
                                <b>
                                  Rp.
                                  {formatIdr((getSubTotalBarang() * 11) / 100)}
                                </b>
                              ) : (
                                <b>
                                  Rp.{" "}
                                  {formatIdr(
                                    ((getSubTotalBarang() + getSubTotalJasa()) *
                                      11) /
                                      100
                                  )}
                                </b>
                              )}
                            </label>
                          </div>

                          <div className="col-5 mt-3">
                            <label className="text-label">Diskon(%)</label>
                          </div>

                          <div className="col-7 text-right">
                            <label className="text-label">
                            <b>Rp. {fk.ord_id?.total_disc !== null ? fk.ord_id?.total_disc : 0}</b>
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
                              {fk.split_inv ? (
                                <b>
                                  Rp.{" "}
                                  {formatIdr(
                                    getSubTotalBarang() +
                                      (getSubTotalBarang() * 11) / 100
                                  )}
                                </b>
                              ) : (
                                <b>
                                  Rp.{" "}
                                  {formatIdr(
                                    getSubTotalBarang() +
                                      getSubTotalJasa() +
                                      ((getSubTotalBarang() +
                                        getSubTotalJasa()) *
                                        11) /
                                        100
                                  )}
                                </b>
                              )}
                            </label>
                          </div>
                        </div>
                      </Row>
                    </Card>
                  }
                />
              </Card.Body>
            </Card>
          </Col>
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

export default DataFaktur;
