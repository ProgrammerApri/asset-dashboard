import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card, Col, Row, Badge } from "react-bootstrap";
import { SET_CURRENT_INV, SET_INV } from "src/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Divider } from "@material-ui/core";
import ReactToPrint from "react-to-print";
import Wrapper from "src/jsx/components/CustomeWrapper/Wrapper";
import { ApiConfig } from "src/data/config";

const Detail = ({ onCancel }) => {
  const show = useSelector((state) => state.order.current);
  const dispatch = useDispatch();
  const printPage = useRef(null);
  const [comp, setComp] = useState(null);
  const [order, setOrder] = useState(null);
  const [city, setCity] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [jas, setJas] = useState(null);
  const [prod, setProd] = useState(null);
  const [unit, setUnit] = useState(null);
  const [apCard, setApCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getORD();
    getSupplier();
    getProduct();
    getJasa();
    getSatuan();
    getComp();
    getCity();
    getPpn();
    getApCard();
  }, []);

  const getORD = async () => {
    const config = {
      ...endpoints.order,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setOrder(data);
      }
    } catch (error) {
      console.log("------");
      console.log(error);
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

  const getProduct = async () => {
    const config = {
      ...endpoints.product,
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
        setProd(data);
      }
    } catch (error) {}
  };

  const getJasa = async () => {
    const config = {
      ...endpoints.jasa,
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
        setJas(data);
      }
    } catch (error) {}
  };

  const getSatuan = async () => {
    const config = {
      ...endpoints.getSatuan,
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
        setUnit(data);
      }
    } catch (error) {}
  };

  const getComp = async () => {
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

  const getCity = async () => {
    const config = {
      ...endpoints.city,
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
        setCity(data);
      }
    } catch (error) {}
  };

  const getPpn = async () => {
    const config = {
      ...endpoints.pajak,
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
        setPpn(data);
      }
    } catch (error) {}
  };

  const jasa = (value) => {
    let selected = {};
    jas?.forEach((element) => {
      if (value === element.jasa.id) {
        selected = element;
      }
    });

    return selected;
  };

  const supp = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element.supplier.id) {
        selected = element;
      }
    });

    return selected;
  };

  const getApCard = async () => {
    const config = {
      ...endpoints.apcard,
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        // let filt = [];
        // data?.forEach((element) => {
        //   if (element.trx_type == "DP") {
        //     filt.push(element);
        //   }
        // });
        setApCard(data);
      }
    } catch (error) {}
  };

  const kota = (value) => {
    let selected = {};
    city?.forEach((element) => {
      if (element.city_id === `${value}`) {
        selected = element;
      }
    });
    return selected;
  };

  const renderHeader = () => {
    return (
      <Row>
        <Col>
          <Card className="px-4 py-3">
            <div className="flex justify-content-between align-items-center">
              <div className="">
                <img
                  style={{
                    height: "50px",
                    width: "50px",
                  }}
                  src={ApiConfig.baseUrl +endpoints.getImage.endpoint+comp?.cp_logo}
                  alt=""
                />
                <br></br>
                <span className="ml-0 fs-10">
                  <b>{comp?.cp_name}</b>
                </span>
              </div>

              <div className="">
                <label className="text-label">No. Invoice</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>{show?.ord_code}</b>
                </span>
              </div>

              <div className="">
                <label className="text-label">Supplier</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>{`${show?.sup_id?.sup_name} (${show?.sup_id?.sup_code})`}</b>
                </span>
              </div>

              <div className="">
                <label className="text-label ml-2"></label>
                <br></br>
                {
                  <div>
                    {show?.faktur === true ? (
                      <Badge variant="info light" className="fs-13">
                        <i className="bx bxs-plus-circle text-info mr-0 fs-14"></i>{" "}
                        Faktur
                      </Badge>
                    ) : (
                      <Badge variant="warning light" className="fs-14">
                        <i className="bx bxs-minus-circle text-warning mr-0 fs-14"></i>{" "}
                        Non Faktur
                      </Badge>
                    )}
                  </div>
                }
              </div>

              <div className="">
                <label className="text-label ml-3 fs-12">Status Tagihan</label>
                <br></br>
                {getSubTotalBarang() +
                  getSubTotalJasa() +
                  ((getSubTotalBarang() + getSubTotalJasa()) * pajk()) / 100 -
                  getUangMuka() -
                  getPelunasan() ===
                0 ? (
                  <Badge
                    variant="primary light"
                    style={{ width: "7rem", height: "2rem" }}
                  >
                    <span className="fs-14 mb-0 mr-3">
                      <i className="bx bx-check text-primary ml-2 mt-0"></i>{" "}
                      Lunas
                    </span>
                  </Badge>
                ) : (
                  <Badge
                    variant="warning light"
                    style={{ width: "7rem", height: "2rem" }}
                  >
                    <span className="fs-14 mb-0 mr-3">
                      <i className="bx bxs-circle text-warning ml-2 mt-0"></i>{" "}
                      Open
                    </span>
                  </Badge>
                )}
              </div>

              <div className="">
                <span className="p-buttonset">
                  <ReactToPrint
                    trigger={() => {
                      return (
                        <Button
                          className="p-button-info"
                          label="Cetak"
                          onClick={() => {}}
                          icon="bx bxs-printer"
                          // disabled={show?.apprv === false}
                        />
                      );
                    }}
                    content={() => printPage.current}
                  />
                  {/* <Button
                    className="p-button-info"
                    label="Kirim"
                    icon="bx bxs-paper-plane"
                    onClick={() => {}}
                    // disabled={show?.apprv === false}
                  /> */}
                  <Button
                    label="Batal"
                    onClick={onCancel}
                    className="p-button-info"
                    icon="pi pi-times"
                  />
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    );
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

  const formatTh = (value) => {
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

  const pajk = (value) => {
    let nil = 0;
    ppn?.forEach((elem) => {
      if (show.sup_id?.sup_ppn === elem.id) {
        nil = elem.nilai;
      }
    });
    return nil;
  };

  const getUangMuka = () => {
    let dp = 0;
    apCard?.forEach((element) => {
      if (show?.po_id?.id === element.po_id?.id && element.trx_type === "DP") {
        dp += element.trx_amnh;
      }
    });

    return dp;
  };

  const getPelunasan = () => {
    let bayar = 0;
    apCard?.forEach((element) => {
      if (show?.id === element.ord_id?.id && element.pay_type === "H4") {
        bayar += element.acq_amnh;
      }
    });

    return bayar;
  };

  const body = () => {
    return (
      <>
        <Row className="ml-0 pt-0 justify-content-center" ref={printPage}>
          {/* <Card>
            <Card.Body> */}
          <Wrapper
            body={
              <>
                <Row className="ml-0 mr-0 mb-0 mt-0 justify-content-between">
                  {/* <div></div> */}
                  <div className="row justify-content-left col-6 ml-0">
                    <div className="col-12 ml-0 text-left">
                      <img
                        style={{
                          height: "150px",
                          width: "150px",
                        }}
                        src={ApiConfig.baseUrl +endpoints.getImage.endpoint+comp?.cp_logo}
                        alt=""
                      />
                      {/* <br></br> */}
                    </div>
                  </div>

                  <div className="row justify-content-right col-6 ml-0">
                    <div className="col-6 fs-12 ml-0 text-right"></div>

                    <div className="col-6 fs-12 ml-0 mt-3 text-right">
                      <br></br>
                      <label className="text-label ml-0 mt-0 fs-14">
                        <b>{comp?.cp_name}</b>
                      </label>
                      <br></br>
                      <span className="ml-0">{comp?.cp_addr}</span>
                      <br></br>
                      <span className="ml-0">{comp?.cp_email}</span>
                      <br></br>
                      <span className="ml-0">{comp?.cp_telp}</span>
                    </div>
                  </div>
                </Row>

                <Divider></Divider>

                <Row className="ml-0 mr-0 mb-0 mt-1 justify-content-between fs-12">
                  <div className="row justify-content-left col-6">
                    <div className="col-12 mt-0 fs-14 text-left">
                      <label className="text-label">
                        <b>Invoice Pembelian</b>
                      </label>
                    </div>
                  </div>

                  <div className="row justify-content-right col-6">
                    <div className="col-12 mt-0 fs-12 text-right">
                      <label className="text-label">Tanggal Invoice : </label>
                      <span className="ml-1">
                        <b>{formatDate(show.ord_date)}</b>
                      </span>
                    </div>
                  </div>
                </Row>

                <Card className="col-12 mt-0">
                  <div className="row col-12">
                    <div className="col-8 fs-12 ml-0">
                      <label className="text-label">
                        <b>Informasi Pembelian</b>
                      </label>
                    </div>

                    <div className="col-4 fs-12 ml-0 text-right">
                      <label className="text-label">
                        <b>Informasi Supplier</b>
                      </label>
                    </div>

                    <div className="col-8 fs-12 ml-0">
                      <span className="ml-0 fs-14">
                        <b>{show?.ord_code}</b>
                      </span>
                      <br></br>
                      <br></br>
                      <span className="ml-0">
                        No. Pembelian : <b>{show?.ord_code ?? "-"}</b>
                      </span>
                      <br></br>
                      <br></br>
                      <span className="ml-0">
                        Nomor PO : <b>{show?.po_id?.po_code ?? "-"}</b>
                      </span>
                      <br></br>
                      <br></br>
                      <span className="ml-0">
                        Jatuh Tempo : <b>{formatDate(show?.due_date)}</b>
                      </span>
                      <br></br>
                      <br></br>
                      <span className="ml-0">
                        {
                          <div>
                            {show?.faktur === true ? (
                              <Badge variant="info light" className="fs-11">
                                <i className="bx bxs-plus-circle text-info mr-0"></i>{" "}
                                Faktur
                              </Badge>
                            ) : (
                              <Badge variant="warning light" className="fs-11">
                                <i className="bx bxs-minus-circle text-warning mr-0"></i>{" "}
                                Non Faktur
                              </Badge>
                            )}
                          </div>
                        }
                      </span>
                    </div>

                    <div className="col-4 fs-12 ml-0 text-right">
                      <span className="ml-0 fs-14">
                        <b>{show?.sup_id?.sup_name}</b>
                      </span>
                      <br></br>
                      <br></br>
                      <span className="ml-0">
                        Cp : <b>{show?.sup_id?.sup_cp}</b>
                      </span>
                      <br></br>
                      <br></br>
                      <span className="ml-0">{show?.sup_id?.sup_address}</span>
                      <br></br>
                      <span className="ml-0">
                        {kota(show?.sup_id?.sup_kota)?.city_name},
                        {show?.sup_id?.sup_kpos}
                      </span>
                      <br></br>
                      <br></br>
                      <span className="ml-0">
                        {/* (+62) */}
                        {show?.sup_id?.sup_telp1}
                      </span>
                    </div>
                  </div>
                </Card>

                <Row className="ml-1 mt-2">
                  <label className="text-label fs-13">
                    <b>Daftar Produk</b>
                  </label>

                  <DataTable
                    value={show.dprod?.map((v, i) => {
                      return {
                        ...v,
                        index: i,
                        price: v?.price ?? 0,
                        total: v?.total ?? 0,
                      };
                    })}
                    responsiveLayout="scroll"
                    className="display w-150 datatable-wrapper fs-12"
                    // showGridlines
                    dataKey="id"
                    rowHover
                  >
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
                      field={(e) => `Rp. ${formatIdr(e.price)}`}
                      style={{ minWidth: "10rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header="Total"
                      field={(e) => `Rp. ${formatIdr(e.total)}`}
                      style={{ minWidth: "10rem" }}
                      // body={loading && <Skeleton />}
                    />
                  </DataTable>
                </Row>

                {show?.djasa?.length ? (
                  <Row className="ml-1 mt-6">
                    <>
                      <label className="text-label fs-13">
                        <b>Daftar Jasa</b>
                      </label>

                      <DataTable
                        value={show.djasa?.map((v, i) => {
                          return {
                            ...v,
                            index: i,
                            total: v?.total ?? 0,
                          };
                        })}
                        responsiveLayout="scroll"
                        className="display w-150 datatable-wrapper fs-12"
                        // showGridlines
                        dataKey="id"
                        rowHover
                      >
                        <Column
                          header="Supplier"
                          field={(e) =>
                            e.sup_id
                              ? `${e.sup_id?.supplier?.sup_name} (${e.sup_id?.supplier?.sup_code})`
                              : "-"
                          }
                          style={{ minWidth: "21rem" }}
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
                          field={(e) => e.total}
                          style={{ minWidth: "15rem" }}
                          // body={loading && <Skeleton />}
                        />
                      </DataTable>
                    </>
                  </Row>
                ) : (
                  <></>
                )}

                <Row className="ml-0 mr-0 mb-0 mt-8 justify-content-between fs-12">
                  <div></div>
                  <div className="row justify-content-right col-6 mr-4">
                    <div className="col-12 mb-0">
                      <label className="text-label fs-13">
                        <b>Detail Tagihan</b>
                      </label>
                      <Divider className="ml-12"></Divider>
                    </div>

                    <div className="col-5 mt-2 ">
                      <label className="text-label">
                        {show.split_inv ? "Sub Total Barang" : "Subtotal"}
                      </label>
                    </div>

                    <div className="col-7 mt-2  text-right">
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
                        {show.split_inv
                          ? "Pajak Atas Barang"`(${pajk()}%)`
                          : "Pajak"}
                      </label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label">
                        {show.split_inv ? (
                          <b>
                            Rp.
                            {formatIdr((getSubTotalBarang() * pajk()) / 100)}
                          </b>
                        ) : (
                          <b>
                            Rp.{" "}
                            {formatIdr(
                              ((getSubTotalBarang() + getSubTotalJasa()) *
                                pajk()) /
                                100
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
                        <b>
                          Rp.{" "}
                          {show?.total_disc !== null
                            ? formatIdr(show?.total_disc)
                            : formatIdr(0)}
                        </b>
                      </label>
                    </div>

                    <div className="col-12">
                      <Divider className="ml-12"></Divider>
                    </div>

                    <div className="col-5">
                      <label className="text-label fs-13">
                        <b>Total Tagihan</b>
                      </label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label fs-13">
                        {show.split_inv ? (
                          <b>
                            Rp.{" "}
                            {formatIdr(
                              getSubTotalBarang() +
                                (getSubTotalBarang() * pajk()) / 100
                            )}
                          </b>
                        ) : (
                          <b>
                            Rp.{" "}
                            {formatIdr(
                              getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  pajk()) /
                                  100
                            )}
                          </b>
                        )}
                      </label>
                    </div>

                    <div className="col-5 mt-0">
                      <label className="text-label">{"Uang Muka"}</label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label">
                        <b>Rp. {formatIdr(getUangMuka())}</b>
                      </label>
                    </div>

                    <div className="col-5 mt-0">
                      <label className="text-label">{"Sudah Dibayar"}</label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label">
                        <b>Rp. {formatIdr(getPelunasan())}</b>
                      </label>
                    </div>

                    <div className="col-12">
                      <Divider className="ml-12"></Divider>
                    </div>

                    <div className="col-5">
                      <label className="text-label fs-13">
                        <b>{"Sisa Tagihan"}</b>
                      </label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label fs-13">
                        <b>
                          Rp.{" "}
                          {formatIdr(
                            getSubTotalBarang() +
                              getSubTotalJasa() +
                              ((getSubTotalBarang() + getSubTotalJasa()) *
                                pajk()) /
                                100 -
                              getUangMuka() -
                              getPelunasan()
                          )}
                        </b>
                      </label>

                      <br></br>
                      <br></br>
                      {getSubTotalBarang() +
                        getSubTotalJasa() +
                        ((getSubTotalBarang() + getSubTotalJasa()) * pajk()) /
                          100 -
                        getUangMuka() -
                        getPelunasan() ===
                      0 ? (
                        <Badge
                          variant="primary light"
                          style={{ width: "7rem", height: "2rem" }}
                        >
                          <span className="fs-15 mb-0 mr-3">
                            <i className="bx bx-check text-primary ml-2 mt-0"></i>{" "}
                            Lunas
                          </span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="warning light"
                          style={{ width: "7rem", height: "2rem" }}
                        >
                          <span className="fs-15 mb-0 mr-3">
                            <i className="bx bxs-circle text-warning ml-2 mt-0"></i>{" "}
                            Open
                          </span>
                        </Badge>
                      )}
                    </div>

                    <div className="col-12 text-right mt-8">
                      <label className="text-label fs-13">
                        <b>Semarang, {formatDate(date)}</b>
                      </label>
                      <br></br>
                      <label className="text-label fs-13 mr-7 mt-6">
                        {comp?.cp_coper}
                      </label>
                    </div>
                  </div>
                </Row>
              </>
            }
          />
          {/* </Card.Body>
          </Card> */}
        </Row>
      </>
    );
  };

  const footer = () => {};

  return (
    <>
      {renderHeader()}
      {body()}
      {footer()}
    </>
  );
};

export default Detail;
