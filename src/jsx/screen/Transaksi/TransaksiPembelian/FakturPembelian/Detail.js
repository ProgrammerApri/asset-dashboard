import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card, Col, Row } from "react-bootstrap";
import { SET_CURRENT_INV, SET_INV } from "src/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Divider } from "@material-ui/core";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import ReactToPrint from "react-to-print";
import Wrapper from "src/jsx/components/CustomeWrapper/Wrapper";
import endpoints from "../../../../../utils/endpoints";
import { ApiConfig } from "src/data/config";

const Detail = ({ onCancel }) => {
  const show = useSelector((state) => state.fk_pb.current_pb_fk);
  const inv = useSelector((state) => state.fk_pb.fk_pb);
  const dispatch = useDispatch();
  const printPage = useRef(null);
  const [comp, setComp] = useState(null);
  const [order, setOrder] = useState(null);
  const [city, setCity] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [jas, setJas] = useState(null);
  const [apCard, setApCard] = useState(null);
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
    getORD();
    getSupplier();
    getProduct();
    getJasa();
    getSatuan();
    getComp();
    getCity();
    getPpn();
    getAp();
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

  const getAp = async () => {
    const config = {
      ...endpoints.apcard,
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
        setApCard(data);
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
                <label className="text-label">No. Faktur Pembelian</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>{show?.fk_code}</b>
                </span>
              </div>

              {/* <div className="">
                <label className="text-label">Departemen</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>{`${de(show?.ord_id?.dep_id)?.ccost_name} (${show?.ord_id?.dep_id?.ccost_code})`}</b>
                </span>
              </div> */}

              <div className="">
                <label className="text-label">Supplier</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>{`${show?.sup_id?.sup_name} (${show?.sup_id?.sup_code})`}</b>
                </span>
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

  const getDp = () => {
    let dp = 0;
    show?.detail?.forEach((el) => {
      apCard?.forEach((element) => {
        if (
          el.ord_id?.po_id === element?.po_id?.id &&
          element?.trx_type === "DP"
        ) {
          dp += element.trx_amnh;
        }
      });
    });

    return dp;
  };

  const pajk = (value) => {
    let nil = 0;
    ppn?.forEach((elem) => {
      if (show?.sup_id?.sup_ppn === elem.id) {
        nil = elem.nilai;
      }
    });
    return nil;
  };

  const getSubTotal = () => {
    let total = 0;
    let totals = 0;
    show?.detail?.forEach((el) => {
      total += el.total;
    });
    totals = (total * pajk()) / 100;

    return total;
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
                        <b>Faktur Pembelian</b>
                      </label>
                    </div>
                  </div>

                  <div className="row justify-content-right col-6">
                    <div className="col-12 mt-0 fs-12 text-right">
                      <label className="text-label">Tanggal Faktur : </label>
                      <span className="ml-1">
                        <b>{formatDate(show?.fk_date)}</b>
                      </span>
                    </div>
                  </div>
                </Row>

                <Card className="col-12 mt-0">
                  <div className="row col-12">
                    <div className="col-6 fs-12 ml-0">
                      <label className="text-label">
                        <b>Informasi Faktur</b>
                      </label>
                    </div>

                    <div className="col-6 fs-12 ml-0 text-right">
                      <label className="text-label">
                        <b>Informasi Supplier</b>
                      </label>
                    </div>

                    <div className="col-6 fs-12 ml-0">
                      <span className="ml-0 fs-13">
                        No. Faktur : <b>{show?.fk_code}</b>
                      </span>
                      <br></br>
                      {/* <span className="ml-0">
                        No. Pembelian : <b>{show?.ord_id?.ord_code}</b>
                      </span>
                      <br></br>
                      <span className="ml-0">
                        Jatuh Tempo :{" "}
                        <b>{formatDate(show?.ord_id?.due_date)}</b>
                      </span> */}
                    </div>

                    <div className="col-6 fs-12 ml-0 text-right">
                      <span className="ml-0 fs-14">
                        <b>{show?.sup_id?.sup_name}</b>
                      </span>
                      <br></br>
                      <span className="ml-0">
                        Cp : <b>{show.sup_id?.sup_cp}</b>
                      </span>
                      <br></br>
                      <span className="ml-0">{show.sup_id?.sup_address}</span>
                      <br></br>
                      <span className="ml-0">
                        {kota(show.sup_id?.sup_kota)?.city_name},
                        {show.sup_id?.sup_kpos}
                      </span>
                      <br></br>
                      <span className="ml-0">
                        (+62)
                        {show.sup_id?.sup_telp1}
                      </span>
                    </div>
                  </div>
                </Card>

                <Row className="ml-0 mt-0 mr-1">
                  <div className="col-12 ml-0 mr-0">
                    <label className="text-label fs-13 text-black">
                      <b>Daftar Invoice</b>
                    </label>
                    <DataTable
                      value={show?.detail?.map((v, i) => {
                        return {
                          ...v,
                          index: i,
                        };
                      })}
                      responsiveLayout="none"
                      className="display w-150 datatable-wrapper fs-12"
                      // showGridlines
                      dataKey="id"
                      rowHover
                    >
                      <Column
                        header="Kode Invoice"
                        field={(e) => e.inv_id?.inv_code}
                        style={{ minWidth: "16rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Kode Penjualan"
                        field={(e) => e.ord_id?.ord_code}
                        style={{ minWidth: "14rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Tanggal Transaksi"
                        field={(e) => formatDate(e?.inv_date)}
                        style={{ minWidth: "14rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Total Tagihan"
                        field={(e) => `Rp. ${formatIdr(e?.total_pay)}`}
                        style={{ minWidth: "14rem" }}
                        // body={loading && <Skeleton />}
                      />
                    </DataTable>
                  </div>
                </Row>

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
                        {"Harga Jual/Penggantian"}
                      </label>
                    </div>

                    <div className="col-7 mt-2  text-right">
                      <label className="text-label">
                        {
                          <b>
                            Rp.
                            {formatIdr(getSubTotal())}
                          </b>
                        }
                      </label>
                    </div>

                    <div className="col-5 mt-0">
                      <label className="text-label">Diskon(%)</label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label">
                        <b>
                          Rp.{" "}
                          {show?.detail.map(
                            (v) => v.sale_id?.total_disc ?? formatIdr(0)
                          )}
                        </b>
                      </label>
                    </div>

                    <div className="col-5">
                      <label className="text-label">{"Uang Muka"}</label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label">
                        {
                          <b>
                            Rp.
                            {formatIdr(getDp())}
                          </b>
                        }
                      </label>
                    </div>

                    <div className="col-5">
                      <label className="text-label">
                        {"Dasar Pengenaan Pajak"}
                      </label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label">
                        {
                          <b>
                            Rp.
                            {formatIdr(getSubTotal())}
                          </b>
                        }
                      </label>
                    </div>

                    <div className="col-5">
                      <label className="text-label">{"Total PPN"}</label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label">
                        {<b>Rp. {formatIdr((getSubTotal() * pajk()) / 100)}</b>}
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
                        {
                          <b>
                            Rp.{" "}
                            {formatIdr(
                              getSubTotal() +
                                (getSubTotal() * pajk()) / 100 -
                                getDp()
                            )}
                          </b>
                        }
                      </label>
                    </div>

                    {/* <div className="col-12 text-right mt-8">
                      <label className="text-label fs-13">
                        <b>Semarang, {formatDate(date)}</b>
                      </label>
                      <br></br>
                      <label className="text-label fs-13 mr-7 mt-6">
                        {comp?.cp_coper}
                      </label>
                    </div> */}
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
