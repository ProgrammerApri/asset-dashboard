import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button, Card, Row, Col } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_SO, SET_EDIT_SO, SET_SO } from "src/redux/actions";
import ReactToPrint from "react-to-print";
import { Divider } from "@material-ui/core";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";

const data = {
  id: null,
  so_code: null,
  so_date: null,
  pel_id: null,
  sub_id: null,
  sub_addr: null,
  ppn_type: null,
  top: null,
  req_date: null,
  due_date: false,
  split_inv: null,
  prod_disc: null,
  jasa_disc: null,
  total_disc: null,
  sprod: [],
  sjasa: [],
};

const DataSalesOrder = ({ onAdd, onEdit, onDetail }) => {
  const [so, setSO] = useState(null);
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
  const So = useSelector((state) => state.so.so);
  const show = useSelector((state) => state.so.current);
  const printPage = useRef(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getSO();
    initFilters1();
  }, []);

  const getSO = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.so,
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
        dispatch({ type: SET_SO, payload: data });
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

  const delSO = async (id) => {
    const config = {
      ...endpoints.delSO,
      endpoint: endpoints.delSO.endpoint + currentItem.id,
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
          getSO(true);
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
            let sprod = data.sprod;
            let sjasa = data.sjasa;
            dispatch({
              type: SET_CURRENT_SO,
              payload: {
                ...data,
                sprod:
                  sprod.length > 0
                    ? sprod
                    : [
                        {
                          id: 0,
                          prod_id: null,
                          unit_id: null,
                          location: null,
                          request: null,
                          order: null,
                          remain: null,
                          price: null,
                          disc: null,
                          nett_price: null,
                          total: null,
                        },
                      ],
                sjasa:
                  sjasa.length > 0
                    ? sjasa
                    : [
                        {
                          id: 0,
                          jasa_id: null,
                          sup_id: null,
                          unit_id: null,
                          qty: null,
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
            let sprod = data.sprod;
            dispatch({
              type: SET_EDIT_SO,
              payload: true,
            });
            sprod.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
            });
            let sjasa = data.sjasa;
            sjasa.forEach((el) => {
              el.jasa_id = el.jasa_id.id;
              el.unit_id = el.unit_id.id;
            });
            dispatch({
              type: SET_CURRENT_SO,
              payload: {
                ...data,
                pel_id: data?.pel_id?.id ?? null,
                sub_id: data?.sub_id?.id ?? null,
                top: data?.top?.id ?? null,
                sprod:
                  sprod.length > 0
                    ? sprod
                    : [
                        {
                          id: 0,
                          prod_id: null,
                          unit_id: null,
                          location: null,
                          request: null,
                          order: null,
                          remain: null,
                          price: null,
                          disc: null,
                          nett_price: null,
                          total: null,
                        },
                      ],
                sjasa:
                  sjasa.length > 0
                    ? sjasa
                    : [
                        {
                          id: 0,
                          jasa_id: null,
                          sup_id: null,
                          unit_id: null,
                          qty: null,
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
            delSO();
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
            placeholder="Cari disini"
          />
        </span>
        <PrimeSingleButton
          label="Tambah"
          icon={<i class="bx bx-plus px-2"></i>}
          onClick={() => {
            onAdd();
            dispatch({
              type: SET_EDIT_SO,
              payload: false,
            });
            dispatch({
              type: SET_CURRENT_SO,
              payload: {
                ...data,
                sprod: [
                  {
                    id: 0,
                    prod_id: null,
                    unit_id: null,
                    location: null,
                    request: null,
                    order: null,
                    remain: null,
                    price: null,
                    disc: null,
                    nett_price: null,
                    total: null,
                  },
                ],
                sjasa: [
                  {
                    id: 0,
                    jasa_id: null,
                    sup_id: null,
                    unit_id: null,
                    qty: null,
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
    show?.sprod?.forEach((el) => {
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
    show?.sjasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return total;
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
                value={loading ? dummy : So}
                className="display w-150 datatable-wrapper"
                showGridlines
                dataKey="id"
                rowHover
                header={renderHeader}
                filters={filters1}
                globalFilterFields={[
                  "so.so_code",
                  "so.so_date",
                  "pel_id.cus_name",
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
                    minWidth: "10rem",
                  }}
                  field={(e) => formatDate(e.so_date)}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Kode Referensi"
                  field={(e) => e.so_code}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Pelanggan"
                  field={(e) => e.pel_id.cus_name}
                  style={{ minWidth: "10rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Tanggal Jatuh Tempo"
                  field={(e) => formatDate(e.due_date)}
                  style={{ minWidth: "10rem" }}
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
              <b>{formatDate(show.so_date)}</b>
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
                <label className="text-label">No. Pesanan :</label>
                <span className="ml-1">
                  <b>{show.so_code}</b>
                </span>
              </div>

              <div className="col-4">
                <label className="text-label">Pelanggan</label>
                <div className="">
                  <span className="ml-0">
                    <b>{show.pel_id?.cus_name}</b>
                  </span>
                  <br />
                  <span>{show.pel_id?.cus_address}</span>
                  <br />
                  <span>{show.pel_id?.cus_telp1}</span>
                </div>
              </div>
            </div>
          </Card>

          <Row className="ml-1 mt-0">
            <DataTable
              className="display w-150 datatable-wrapper fs-12"
              value={show?.sprod}
            >
              <Column
                header="Produk"
                field={(e) => `${e.prod_id?.name} (${e.prod_id?.code})`}
                style={{ minWidth: "10rem" }}
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
                style={{ minWidth: "10rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Total"
                field={(e) => formatIdr(e.total)}
                style={{ minWidth: "8rem" }}
                // body={loading && <Skeleton />}
              />
            </DataTable>
          </Row>

          {So.sjasa?.length ? (
            <Row className="ml-1 mt-5">
              <>
                <DataTable
                  className="display w-150 datatable-wrapper fs-12"
                  value={show?.sjasa.map((v, i) => {
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
                  <b>{show.total_disc !== null ? show.total_disc : 0}</b>
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

              <div className="col-7">
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

export default DataSalesOrder;
