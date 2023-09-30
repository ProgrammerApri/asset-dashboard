import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card, Col, Row, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Divider } from "@material-ui/core";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import ReactToPrint from "react-to-print";
import Wrapper from "src/jsx/components/CustomeWrapper/Wrapper";
import { tr } from "../../../../../data/tr";

const Detail = ({ onCancel }) => {
  const show = useSelector((state) => state.order.current);
  const dispatch = useDispatch();
  const printPage = useRef(null);
  const [comp, setComp] = useState(null);
  const [order, setOrder] = useState(null);
  const [city, setCity] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [jas, setJas] = useState(null);
  const [prod, setProd] = useState(null);
  const [unit, setUnit] = useState(null);
  const [apCard, setApCard] = useState(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getORD();
    getSupplier();
    getCur();
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

  const getCur = async () => {
    const config = {
      ...endpoints.currency,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCurrency(data);
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
                  src={
                    ApiConfig.baseUrl +
                    endpoints.getImage.endpoint +
                    comp?.cp_logo
                  }
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

  const getCurRate = (value) => {
    let rate = 0;
    currency?.forEach((elem) => {
      if (show.sup_id?.sup_curren === elem.id) {
        rate = elem.rate;
      }
    });
    return rate;
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
    let total_qty = 0;
    let total_qty_konv = 0;

    show?.dprod?.forEach(el => {
      total_qty += el?.order
      total_qty_konv += el?.konv_qty
    });

    return (
      <>
        <Row className="ml-0 pt-0 justify-content-center" ref={printPage}>
          <Wrapper
            body={
              <>
                <Row className="ml-0 mr-0 mb-0 mt-0 justify-content-between">
                  <div className="row justify-content-left col-2 ml-0">
                    <div className="col-12 ml-0 text-left">
                      <img
                        style={{
                          height: "150px",
                          width: "150px",
                        }}
                        src={comp?.cp_logo}
                        alt=""
                      />
                    </div>
                  </div>

                  <div className="row justify-content-left col-10 ml-0">
                    <div className="col-6 fs-12 ml-0 mb-0 text-left">
                      <br></br>
                      <label className="text-label ml-0 mt-0 fs-18">
                        <b>{comp?.cp_name}</b>
                      </label>
                      <br></br>
                      <span className="ml-0 fs-13">{comp?.cp_addr}</span>
                      <br></br>
                      <br></br>
                      <span className="ml-0 fs-13">
                        Email : {comp?.cp_email ?? "-"}
                      </span>
                      <br></br>
                      <span className="ml-0 mt-2 fs-13">
                        Telp : {comp?.cp_telp}
                      </span>
                    </div>
                  </div>
                </Row>

                <Divider></Divider>

                <Row className="ml-1 mr-0 mb-0 mt-2 justify-content-between fs-12">
                  {/* <div className="row justify-content-left col-12"> */}
                  {/* <div className="col-8 mt-0 fs-16 text-right">
                      <label className="text-label mr-7">
                        <b>SALES INVOICE</b>
                      </label>
                    </div> */}

                  <DataTable
                    className="display w-150 datatable-wrapper fs-12 header-white report p-0"
                    emptyMessage={
                      <div className="ml-0 p-0 mt-2 text-left">
                        {/* <br /> */}
                        <label className="text-label fs-13">
                          <b>INVOICE - FAKTUR PENJUALAN</b>
                        </label>
                      </div>
                    }
                  >
                    <Column
                      header={
                        <div className="row">
                          <div className="ml-3 p-0">
                            <label className="text-label">Kepada Yth.</label>
                            <br></br>
                            <span className="ml-0 fs-14">
                              <b>{show?.pel_id.cus_name}</b>
                            </span>
                            <br></br>
                            <br></br>
                            <span className="ml-0">
                              {show?.pel_id.cus_address}
                            </span>
                            <br></br>
                            <br></br>
                            <br></br>
                            <span className="ml-0">
                              Phone : {show?.pel_id?.cus_telp1}
                            </span>
                            <br></br>
                            <span className="ml-0">
                              Email : <b>{show?.pel_id.cus_email}</b>
                            </span>
                            <br />
                            <br />
                          </div>
                        </div>
                      }
                      style={{ width: "65rem" }}
                    />

                    <Column
                      header={
                        <div className="row">
                          <div className="ml-3 p-0">
                            <span className="ml-0">
                              No. Invoice : <b>{show?.ord_code}</b>
                            </span>
                            <br></br>
                            <br></br>
                            <span className="ml-0">
                              Tgl Invoice : <b>{formatDate(show?.ord_date)}</b>
                            </span>
                            <br></br>
                            <br></br>
                            <span className="ml-0">
                              No. Pesanan :{" "}
                              <b>{show?.so_id ? show?.so_id?.so_code : "-"}</b>
                            </span>
                            <br></br>
                            <br></br>
                            <span className="ml-0">
                              Jatuh Tempo : <b>{formatDate(show?.due_date)}</b>
                            </span>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                          </div>
                        </div>
                      }
                      style={{ width: "35rem" }}
                    />
                  </DataTable>

                  {/* <Card className="col-12 p-0">
                      <div className="col-12 fs-12 ml-0 text-left">
                        <label className="text-label">
                          <b>Kepada Yth.</b>
                        </label>
                        <br></br>
                        <br></br>
                        <span className="ml-0 fs-14">
                          <b>{show?.pel_id.cus_name}</b>
                        </span>
                        <br></br>
                        <br></br>
                        <span className="ml-0">{show?.pel_id.cus_address}</span>
                        <br></br>
                        <span className="ml-0">
                          {kota(show?.pel_id.cus_kota)?.city_name},{" "}
                          {show?.pel_id.cus_kpos}
                        </span>
                        <br></br>
                        <span className="ml-0">
                          Telp : {show?.pel_id?.cus_telp1}
                        </span>
                        <br></br>
                        <br></br>
                        <span className="ml-0">
                          Cp : <b>{show?.pel_id.cus_cp}</b>
                        </span>
                        <br></br>
                        <br></br>
                        <span className="ml-0">
                          NPWP : <b>{show?.pel_id.cus_npwp}</b>
                        </span>
                      </div>
                    </Card> */}
                  {/* </div> */}

                  {/* <div className="row justify-content-left col-4">
                    <div className="col-12 mb-3 fs-13 text-left">
                      <label className="text-label"></label>
                    </div>

                    <Card className="col-12 p-0">
                      <div className="col-12 fs-12 ml-0 text-left">
                        <label className="text-label">
                          <b>
                            {tr[localStorage.getItem("language")].inf_invoice}
                          </b>
                        </label>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <span className="ml-0">
                          No. Invoice : <b>{show?.ord_code}</b>
                        </span>
                        <br></br>
                        <br></br>
                        <span className="ml-0">
                          Tgl Invoice : <b>{formatDate(show?.ord_date)}</b>
                        </span>
                        <br></br>
                        <br></br>
                        <span className="ml-0">
                          No. Pesanan :{" "}
                          <b>{show?.so_id ? show?.so_id?.so_code : "-"}</b>
                        </span>
                        <br></br>
                        <br></br>
                        <span className="ml-0">
                          Jatuh Tempo : <b>{formatDate(show?.due_date)}</b>
                        </span>
                      </div>
                    </Card>
                  </div> */}
                </Row>

                <Row className="ml-1 mt-0">
                  <label className="text-label fs-13">
                    <b>{tr[localStorage.getItem("language")].dft_prod}</b>
                  </label>

                  <DataTable
                    value={show.jprod?.map((v, i) => {
                      return {
                        ...v,
                        index: i,
                        price: v?.price ?? 0,
                        total: v?.total ?? 0,
                      };
                    })}
                    responsiveLayout="scroll"
                    className="display w-150 datatable-wrapper fs-12 header-white report"
                    // showGridlines
                    dataKey="id"
                    rowHover
                  >
                    <Column
                      header={tr[localStorage.getItem("language")].prod}
                      field={(e) => `${e.prod_id?.name} (${e.prod_id?.code})`}
                      style={{ minWidth: "22rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header={tr[localStorage.getItem("language")].qty}
                      field={(e) => formatTh(e.order)}
                      style={{ minWidth: "8rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header={tr[localStorage.getItem("language")].satuan}
                      field={(e) => e.unit_id?.name}
                      style={{ minWidth: "7rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header={"Konversi Unit"}
                      field={(e) => `${e.konv_qty} ${e.unit_konv}`}
                      style={{ minWidth: "7rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header={tr[localStorage.getItem("language")].price}
                      field={(e) => `Rp. ${formatIdr(e.price)}`}
                      style={{ minWidth: "9rem" }}
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

                {show?.jjasa?.length ? (
                  <Row className="ml-1 mt-3">
                    <>
                      <label className="text-label fs-13">
                        <b>{tr[localStorage.getItem("language")].dft_jasa}</b>
                      </label>

                      <DataTable
                        value={show.jjasa?.map((v, i) => {
                          return {
                            ...v,
                            index: i,
                            total: v?.total ?? 0,
                          };
                        })}
                        responsiveLayout="scroll"
                        className="display w-150 datatable-wrapper fs-12 header-white report"
                        // showGridlines
                        dataKey="id"
                        rowHover
                      >
                        <Column
                          header={tr[localStorage.getItem("language")].jasa}
                          field={(e) => e.jasa_id?.name}
                          style={{ minWidth: "53rem" }}
                          // body={loading && <Skeleton />}
                        />
                        <Column
                          header="Total"
                          field={(e) => `Rp. ${formatIdr(e.total)}`}
                          style={{ minWidth: "10rem" }}
                          // body={loading && <Skeleton />}
                        />
                      </DataTable>
                    </>
                  </Row>
                ) : (
                  <></>
                )}

                <Row className="ml-0 mr-0 mb-0 mt-3 justify-content-between fs-12">
                  <div className="row justify-content-left col-6">
                    <DataTable
                      className="display w-150 datatable-wrapper fs-12 header-white report p-0"
                      emptyMessage={
                        <div className="ml-0 p-0">
                          <label className="text-label">
                            Please Transfer Your Payment To :
                          </label>
                          <br></br>
                          <br></br>
                          <span>
                            Account Name : {comp?.cp_akun_name ?? "-"}
                          </span>
                          <br />
                          <span>Bank Name : {comp?.cp_bank_name ?? "-"}</span>
                          <br />
                          <span>
                            Account Number : <b>{comp?.cp_no_rek ?? "-"}</b>
                          </span>
                          <br />
                        </div>
                      }
                    >
                      <Column
                        header={
                          <div className="ml-2 p-0 mt-2 text-left">
                            {/* <br /> */}
                            <label className="text-label fs-12">
                              <b>
                                BARANG YANG SUDAH DI BELI TIDAK DAPAT DITUKAR
                                ATAU DIKEMBALIKAN
                              </b>
                            </label>
                          </div>
                        }
                        style={{ width: "65rem" }}
                      />
                    </DataTable>

                    {/* <div className="col-12 mt-4">
                      <span>Please Transfer Your Payment To :</span>
                      <br></br>
                      <br></br>
                      <span>Account Name : {comp?.cp_akun_name ?? "-"}</span>
                      <br />
                      <br />
                      <span>Bank Name : {comp?.cp_bank_name ?? "-"}</span>
                      <br />
                      <br />
                      <span>Bank Branch : {comp?.cp_branch ?? "-"}</span>
                      <br />
                      <br />
                      <span>Bank Address : {comp?.cp_bank_addr ?? "-"}</span>
                      <br />
                      <br />
                      <span>
                        Account Number : <b>{comp?.cp_no_rek ?? "-"}</b>
                      </span>
                      <br />
                      <br />
                    </div> */}
                  </div>

                  <div className="row justify-content-right col-6 mr-4">
                    <div className="col-12 mb-0">
                      <label className="text-label fs-12">
                        <b>Detail Tagihan</b>
                      </label>
                      <Divider className="ml-12 mt-0"></Divider>
                    </div>

                    <div className="col-5 mt-0 ">
                      <label className="text-label">
                        {show?.sale_id?.split_inv
                          ? "Sub Total Barang"
                          : "Subtotal"}
                      </label>
                    </div>

                    <div className="col-7 mt-0  text-right">
                      <label className="text-label">
                        {show?.sale_id?.split_inv ? (
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

                    {show.pel_id?.cus_pjk ? (
                      <>
                        <div className="col-5">
                          <label className="text-label">
                            {show?.split_inv
                              ? "DPP Barang"
                              : "Dasar Pengenaan Pajak"}
                          </label>
                        </div>

                        <div className="col-7 text-right">
                          <label className="text-label">
                            {show?.split_inv ? (
                              <b>
                                Rp.
                                {formatIdr(getSubTotalBarang())}
                              </b>
                            ) : show?.tax_prod && show?.tax_jasa ? (
                              <b>
                                Rp.
                                {formatIdr(
                                  getSubTotalBarang() + getSubTotalJasa()
                                )}
                              </b>
                            ) : show?.tax_prod ? (
                              <b>
                                Rp.
                                {formatIdr(getSubTotalBarang())}
                              </b>
                            ) : show?.tax_jasa ? (
                              <b>
                                Rp.
                                {formatIdr(getSubTotalJasa())}
                              </b>
                            ) : (
                              <b>Rp. {formatIdr(0)}</b>
                            )}
                          </label>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}

                    <div className="col-5 mt-0">
                      <label className="text-label">{"Diskon (%)"}</label>
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
                        <b>Total</b>
                      </label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label fs-13">
                        {show?.split_inv ? (
                          <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                        ) : (
                          <b>
                            Rp.{" "}
                            {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                          </b>
                        )}
                      </label>
                    </div>

                    <div className="col-5">
                      <label className="text-label">
                        {show?.split_inv
                          ? "Pajak Atas Barang"`(${pjk()}%)`
                          : `Pajak (${pjk()}%)`}
                      </label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label">
                        {show?.split_inv ? (
                          <b>
                            Rp.
                            {formatIdr((getSubTotalBarang() * pjk()) / 100)}
                          </b>
                        ) : show?.tax_prod && show?.tax_jasa ? (
                          <b>
                            Rp.{" "}
                            {formatIdr(
                              ((getSubTotalBarang() + getSubTotalJasa()) *
                                pjk()) /
                                100
                            )}
                          </b>
                        ) : show?.tax_prod ? (
                          <b>
                            Rp. {formatIdr((getSubTotalBarang() * pjk()) / 100)}
                          </b>
                        ) : show?.tax_jasa ? (
                          <b>
                            Rp. {formatIdr((getSubTotalJasa() * pjk()) / 100)}
                          </b>
                        ) : (
                          <b>Rp. {formatIdr(0)}</b>
                        )}
                      </label>
                    </div>

                    <div className="col-12">
                      <Divider className="ml-12"></Divider>
                    </div>

                    <div className="col-5">
                      <label className="text-label fs-13">
                        <b>Grand Total</b>
                      </label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label fs-13">
                        {show?.split_inv ? (
                          <b>
                            Rp.{" "}
                            {formatIdr(
                              getSubTotalBarang() +
                                (getSubTotalBarang() * pjk()) / 100
                            )}
                          </b>
                        ) : show.tax_prod && show.tax_jasa ? (
                          <b>
                            Rp.{" "}
                            {formatIdr(
                              getSubTotalBarang() +
                                getSubTotalJasa() +
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  pjk()) /
                                  100
                            )}
                          </b>
                        ) : show.tax_prod ? (
                          <b>
                            Rp.{" "}
                            {formatIdr(
                              getSubTotalBarang() +
                                getSubTotalJasa() +
                                (getSubTotalBarang() * pjk()) / 100
                            )}
                          </b>
                        ) : show.tax_jasa ? (
                          <b>
                            Rp.{" "}
                            {formatIdr(
                              getSubTotalBarang() +
                                getSubTotalJasa() +
                                (getSubTotalJasa() * pjk()) / 100
                            )}
                          </b>
                        ) : (
                          <b>
                            Rp.{" "}
                            {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                          </b>
                        )}
                      </label>
                    </div>

                    <div className="col-5">
                      <label className="text-label fs-13">
                        <b></b>
                      </label>
                    </div>

                    <div className="col-7 text-center mt-4 ml-0">
                      <label className="text-label fs-13">
                        <b>DISIAPKAN & DICEK OLEH</b>
                      </label>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>

                      <Divider className=""></Divider>
                    </div>
                  </div>
                </Row>
              </>
            }
          />
        </Row>

        <Row className="mt-4 p-0 ml-0 justify-content-center" ref={printPage}>
          <Wrapper
            body={
              <>
                <Row className="ml-0 mr-0 mb-0 mt-0 justify-content-between">
                  <div className="row justify-content-left col-2 ml-0">
                    <div className="col-12 ml-0 text-left">
                      <img
                        style={{
                          height: "150px",
                          width: "150px",
                        }}
                        src={comp?.cp_logo}
                        alt=""
                      />
                    </div>
                  </div>

                  <div className="row justify-content-left col-10 ml-0">
                    <div className="col-6 fs-12 ml-0 mb-0 text-left">
                      <br></br>
                      <label className="text-label ml-0 mt-0 fs-18">
                        <b>{comp?.cp_name}</b>
                      </label>
                      <br></br>
                      <span className="ml-0 fs-13">{comp?.cp_addr}</span>
                      <br></br>
                      <br></br>
                      <span className="ml-0 fs-13">
                        Email : {comp?.cp_email ?? "-"}
                      </span>
                      <br></br>
                      <span className="ml-0 mt-2 fs-13">
                        Telp : {comp?.cp_telp}
                      </span>
                    </div>
                  </div>
                </Row>

                <Divider></Divider>

                <Row className="ml-1 mr-0 mb-0 mt-2 justify-content-between fs-12">
                  {/* <div className="row justify-content-left col-12"> */}
                  {/* <div className="col-8 mt-0 fs-16 text-right">
                      <label className="text-label mr-7">
                        <b>SALES INVOICE</b>
                      </label>
                    </div> */}

                  <DataTable
                    className="display w-150 datatable-wrapper fs-12 header-white report p-0"
                    emptyMessage={
                      <div className="ml-0 p-0 mt-2 text-left">
                        <label className="text-label fs-13">
                          <b>PACKING LIST</b>
                        </label>
                      </div>
                    }
                  >
                    <Column
                      header={
                        <div className="row">
                          <div className="ml-3 p-0">
                            <label className="text-label">Kepada Yth.</label>
                            <br></br>
                            <span className="ml-0 fs-14">
                              <b>{show?.pel_id.cus_name}</b>
                            </span>
                            <br></br>
                            <br></br>
                            <span className="ml-0">
                              {show?.pel_id.cus_address}
                            </span>
                            <br></br>
                            <br></br>
                            <br></br>
                            <span className="ml-0">
                              Phone : {show?.pel_id?.cus_telp1}
                            </span>
                            <br></br>
                            <span className="ml-0">
                              Email : <b>{show?.pel_id.cus_email}</b>
                            </span>
                            <br />
                            <br />
                          </div>
                        </div>
                      }
                      style={{ width: "65rem" }}
                    />

                    <Column
                      header={
                        <div className="row">
                          <div className="ml-3 p-0">
                            <span className="ml-0">
                              No. Invoice : <b>{show?.ord_code}</b>
                            </span>
                            <br></br>
                            <br></br>
                            <span className="ml-0">
                              Tgl Invoice : <b>{formatDate(show?.ord_date)}</b>
                            </span>
                            <br></br>
                            <br></br>
                            <span className="ml-0">
                              No. Pesanan :{" "}
                              <b>{show?.so_id ? show?.so_id?.so_code : "-"}</b>
                            </span>
                            <br></br>
                            <br></br>
                            <span className="ml-0">
                              Jatuh Tempo : <b>{formatDate(show?.due_date)}</b>
                            </span>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                          </div>
                        </div>
                      }
                      style={{ width: "35rem" }}
                    />
                  </DataTable>
                </Row>

                <Row className="ml-1 mt-0">
                  <label className="text-label">
                    <b>{tr[localStorage.getItem("language")].dft_prod}</b>
                  </label>

                  <DataTable
                    value={show?.jprod?.map((v, i) => {
                      return {
                        ...v,
                        index: i,
                        price: v?.price ?? 0,
                        total: v?.total ?? 0,
                      };
                    })}
                    responsiveLayout="scroll"
                    className="display w-150 datatable-wrapper fs-12 header-white report"
                    // showGridlines
                    dataKey="id"
                    rowHover
                  >
                    <Column
                      header="Description of Goods"
                      field={(e) => `${e.prod_id?.name} (${e.prod_id?.code})`}
                      style={{ minWidth: "29rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header="Quantity"
                      field={(e) => `${formatTh(e.order)} ${e?.unit_id?.name}`}
                      style={{ minWidth: "11rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header="Qty Konversion"
                      field={(e) => `${formatTh(e.konv_qty)} ${e?.unit_konv}`}
                      style={{ minWidth: "8rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header="Net Weight (Kgs)"
                      field={(e) => formatTh(0)}
                      style={{ minWidth: "8rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header="Total Weight (Kgs)"
                      field={(e) => formatTh(0)}
                      style={{ minWidth: "8rem" }}
                      // body={loading && <Skeleton />}
                    />
                  </DataTable>
                </Row>

                <Row className="ml-0 mr-0 mb-0 mt-0 justify-content-between fs-12">
                  <div className="row justify-content-left col-4"></div>
                  <div className="row justify-content-left col-8">
                    <div className="col-12 mt-0">
                      <label className="text-label">
                        <b className="mr-2">Grand Total</b>
                        {/* <b className="ml-3"></b> */}
                        <b className="ml-4">{formatTh(total_qty)}</b>
                        <b className="ml-8"></b>
                        <b className="ml-6">{formatTh(total_qty_konv)}</b>
                        <b className="ml-8"></b>
                        <b className="ml-7"></b>
                        <b className="ml-8">{formatTh(0)}</b>
                      </label>
                      <Divider></Divider>
                    </div>
                  </div>
                </Row>

                <Row className="ml-0 mr-0 mb-0 mt-3 justify-content-between fs-12">
                  <div className="row justify-content-center col-6">
                    <div className="col-6 text-center mt-2 ml-0">
                      <label className="text-label fs-13">
                        <b>DITERIMA & DICEK OLEH</b>
                      </label>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>

                      <Divider className=""></Divider>
                    </div>
                  </div>
                  <div className="row justify-content-center col-6">
                    <div className="col-6 text-center mt-2 ml-0">
                      <label className="text-label fs-13">
                        <b>DISIAPKAN & DICEK OLEH</b>
                      </label>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>
                      <br></br>

                      <Divider className=""></Divider>
                    </div>
                  </div>
                </Row>
              </>
            }
          />
        </Row>
      </>
    );
  };

  return (
    <>
      {renderHeader()}
      {body()}
      {renderFooter()}
    </>
  );
};

export default Detail;
