import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { SET_CURRENT_INV, SET_INV } from "src/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Divider } from "@material-ui/core";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import ReactToPrint from "react-to-print";
import Wrapper from "src/jsx/components/CustomeWrapper/Wrapper";
import endpoints from "../../../../../utils/endpoints";

const Detail = ({ onCancel }) => {
  const show = useSelector((state) => state.inv_pj.current_inv);
  const inv = useSelector((state) => state.inv_pj.inv_pj);
  const dispatch = useDispatch();
  const printPage = useRef(null);
  const [comp, setComp] = useState(null);
  const [order, setOrder] = useState(null);
  const [city, setCity] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [arCard, setAr] = useState(null);
  const [jas, setJas] = useState(null);
  const [prod, setProd] = useState(null);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getCus();
    getProduct();
    getJasa();
    getSatuan();
    getComp();
    getCity();
    getPpn();
    getAr();
  }, []);

  const getCus = async () => {
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

  const getAr = async () => {
    const config = {
      ...endpoints.arcard,
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
        setAr(data);
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

  const cuss = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer.id) {
        selected = element;
      }
    });

    return selected;
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
                  src={comp?.cp_logo}
                  alt=""
                />
                <br></br>
                <span className="ml-0 fs-10">
                  <b>{comp?.cp_name}</b>
                </span>
              </div>

              <div className="">
                <label className="text-label">No. Invoice Penjualan</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>{show?.inv_code}</b>
                </span>
              </div>

              <div className="">
                <label className="text-label">Customer</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>{`${cuss(show?.sale_id?.pel_id)?.customer?.cus_name} (${
                    cuss(show?.sale_id?.pel_id)?.customer?.cus_code
                  })`}</b>
                </span>
              </div>

              <div className="">
                <label className="text-label ml-2">Status Tagihan</label>
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
                  <Button
                    className="p-button-info"
                    label="Kirim"
                    icon="bx bxs-paper-plane"
                    onClick={() => {}}
                    // disabled={show?.apprv === false}
                  />
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

  const formatTh = (value) => {
    return `${value}`
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
    show?.product?.forEach((el) => {
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
    show?.jasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return total;
  };

  const pajk = (value) => {
    let nil = 0;
    ppn?.forEach((elem) => {
      if (cuss(show?.sale_id?.pel_id)?.customer?.cus_pjk === elem.id) {
        nil = elem.nilai;
      }
    });
    return nil;
  };

  const getUangMuka = () => {
    let dp = 0;
    arCard?.forEach((element) => {
      if (
        show?.sale_id?.so_id === element.so_id?.id &&
        element.trx_type === "DP"
      ) {
        dp += element.trx_amnh;
      }
    });

    return dp;
  };

  const getPelunasan = () => {
    let bayar = 0;
    arCard?.forEach((element) => {
      if (
        show?.sale_id?.id === element.bkt_id?.id &&
        element.pay_type === "J4"
      ) {
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
                        src={comp?.cp_logo}
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
                        <b>Invoice Penjualan</b>
                      </label>
                    </div>
                  </div>

                  <div className="row justify-content-right col-6">
                    <div className="col-12 mt-0 fs-12 text-right">
                      <label className="text-label">Tanggal Invoice : </label>
                      <span className="ml-1">
                        <b>{formatDate(show?.inv_date)}</b>
                      </span>
                    </div>
                  </div>
                </Row>

                <Card className="col-12 mt-0">
                  <div className="row col-12">
                    <div className="col-6 fs-12 ml-0">
                      <label className="text-label fs-13">
                        <b>Informasi Penjualan</b>
                      </label>
                    </div>

                    <div className="col-6 fs-12 ml-0 text-right">
                      <label className="text-label fs-13">
                        <b>Informasi Pembeli</b>
                      </label>
                    </div>

                    <div className="col-6 fs-12 ml-0">
                      <span className="ml-0 fs-14">
                        <b>{show?.inv_code}</b>
                      </span>
                      <br></br>
                      <br></br>
                      <span className="ml-0">
                        No. Penjualan : <b>{show?.sale_id?.ord_code}</b>
                      </span>
                      <br></br>
                      <span className="ml-0">
                        Jatuh Tempo :{" "}
                        <b>{formatDate(show?.sale_id?.due_date)}</b>
                      </span>
                    </div>

                    <div className="col-6 fs-12 ml-0 text-right">
                      <span className="ml-0 fs-14">
                        <b>{cuss(show?.sale_id?.pel_id)?.customer?.cus_name}</b>
                      </span>
                      <br></br>
                      <span className="ml-0">
                        Cp :{" "}
                        <b>{cuss(show?.sale_id.pel_id)?.customer?.cus_cp}</b>
                      </span>
                      <br></br>
                      <span className="ml-0">
                        {cuss(show?.sale_id.pel_id)?.customer?.cus_address}
                      </span>
                      <br></br>
                      <span className="ml-0">
                        {
                          kota(cuss(show?.sale_id.pel_id)?.customer?.cus_kota)
                            ?.city_name
                        }
                        ,{cuss(show?.sale_id.pel_id)?.customer?.cus_kpos}
                      </span>
                      <br></br>
                      <span className="ml-0">
                        {cuss(show?.sale_id.pel_id)?.customer?.cus_telp1}
                      </span>
                    </div>
                  </div>
                </Card>

                <Row className="ml-1 mt-0">
                  <label className="text-label">
                    <b>Daftar Produk</b>
                  </label>

                  <DataTable
                    value={show?.product?.map((v, i) => {
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
                      header="Lokasi"
                      field={(e) => e.location?.name}
                      style={{ minWidth: "7rem" }}
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

                {show?.jasa?.length ? (
                  <Row className="ml-1 mt-6">
                    <>
                      <label className="text-label">
                        <b>Daftar Jasa</b>
                      </label>
                      <DataTable
                        value={show?.jasa?.map((v, i) => {
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
                          field={(e) => e.sup_id?.sup_name}
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
                        {show?.sale_id?.split_inv
                          ? "Sub Total Barang"
                          : "Subtotal"}
                      </label>
                    </div>

                    <div className="col-7 mt-2  text-right">
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

                    <div className="col-5">
                      <label className="text-label">
                        {show?.sale_id?.split_inv ? "DPP Barang" : "DPP"}
                      </label>
                    </div>

                    <div className="col-7 text-right">
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

                    <div className="col-5">
                      <label className="text-label">
                        {show?.sale_id?.split_inv
                          ? "Pajak Atas Barang"`(${pajk()}%)`
                          : "Pajak"}
                      </label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label">
                        {show?.sale_id?.split_inv ? (
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
                          {show?.sale_id?.total_disc !== null
                            ? formatIdr(show?.sale_id?.total_disc)
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
                        {show?.sale_id?.split_inv ? (
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
