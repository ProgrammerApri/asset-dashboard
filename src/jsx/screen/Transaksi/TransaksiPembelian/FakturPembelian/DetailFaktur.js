import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
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

const DetailFaktur = ({ onCancel }) => {
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
    let fk_code = null;
    inv?.forEach((element) => {
      if (element.id === show?.fk_id) {
        fk_code = element.fk_code;
      }
    });
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
                <label className="text-label">No. Faktur Pembelian</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>{fk_code}</b>
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
                  <b>{`${supp(show?.ord_id?.sup_id)?.supplier?.sup_name} (${
                    supp(show?.ord_id?.sup_id)?.supplier?.sup_code
                  })`}</b>
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

  const formatTh = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const getSubTotalBarang = () => {
    let total = 0;
    show?.ord_id?.product?.forEach((el) => {
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
    show?.ord_id?.jasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return total;
  };

  const pajk = (value) => {
    let nil = 0;
    ppn?.forEach((elem) => {
      if (supp(show?.ord_id?.sup_id)?.supplier?.sup_ppn === elem.id) {
        nil = elem.nilai;
      }
    });
    return nil;
  };

  const getUangMuka = () => {
    let dp = 0;
    apCard?.forEach((element) => {
      if (
        show?.ord_id?.po_id === element.po_id?.id &&
        element.trx_type === "DP"
      ) {
        dp += element.trx_amnh;
      }
    });

    return dp;
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Detail Faktur Pembelian</b>
      </h4>
    );
  };

  const body = () => {
    let fk_date = null;
    let fk_code = null;
    inv?.forEach((element) => {
      if (element.id === show?.fk_id) {
        fk_date = element.fk_date;
        fk_code = element.fk_code;
      }
    });
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
                        <b>Faktur Pajak Pembelian</b>
                      </label>
                    </div>
                  </div>

                  <div className="row justify-content-right col-6">
                    <div className="col-12 mt-0 fs-12 text-right">
                      <label className="text-label">Tanggal Faktur : </label>
                      <span className="ml-1">
                        <b>{formatDate(fk_date)}</b>
                      </span>
                    </div>
                  </div>
                </Row>

                <Card className="col-12 mt-0">
                  <div className="row col-12">
                    <div className="col-6 fs-12 ml-0">
                      <label className="text-label">
                        <b>Informasi Pembelian</b>
                      </label>
                    </div>

                    <div className="col-6 fs-12 ml-0 text-right">
                      <label className="text-label">
                        <b>Informasi Supplier</b>
                      </label>
                    </div>

                    <div className="col-6 fs-12 ml-0">
                      <span className="ml-0 fs-14">
                        <b>{fk_code}</b>
                      </span>
                      <br></br>
                      <br></br>
                      <span className="ml-0">
                        No. Pembelian : <b>{show?.ord_id?.ord_code}</b>
                      </span>
                      <br></br>
                      <br></br>
                      <span className="ml-0">
                        Jatuh Tempo :{" "}
                        <b>{formatDate(show?.ord_id?.due_date)}</b>
                      </span>
                    </div>

                    <div className="col-6 fs-12 ml-0 text-right">
                      <span className="ml-0 fs-14">
                        <b>{supp(show?.ord_id?.sup_id)?.supplier?.sup_name}</b>
                      </span>
                      <br></br>
                      <span className="ml-0">
                        Cp :{" "}
                        <b>{supp(show?.ord_id?.sup_id)?.supplier?.sup_cp}</b>
                      </span>
                      <br></br>
                      <span className="ml-0">
                        {supp(show?.ord_id?.sup_id)?.supplier?.sup_address}
                      </span>
                      <br></br>
                      <span className="ml-0">
                        {
                          kota(supp(show?.ord_id?.sup_id)?.supplier?.sup_kota)
                            ?.city_name
                        }
                        ,{supp(show?.ord_id?.sup_id)?.supplier?.sup_kpos}
                      </span>
                      <br></br>
                      <span className="ml-0">
                        (+62)
                        {supp(show?.ord_id?.sup_id)?.supplier?.sup_telp1}
                      </span>
                    </div>
                  </div>
                </Card>

                <Row className="ml-0 mt-0 mr-1" >
                  <div className="col-12 ml-0 mr-0">
                    <label className="text-label fs-13 text-black">
                      <b>Daftar Produk</b>
                    </label>
                    <DataTable
                      value={show?.ord_id?.product?.map((v, i) => {
                        return {
                          ...v,
                          index: i,
                          price: v?.price ?? 0,
                          total: v?.total ?? 0,
                        };
                      })}
                      responsiveLayout="none"
                      className="display w-150 datatable-wrapper fs-12"
                      // showGridlines
                      dataKey="id"
                      rowHover
                    >
                      <Column
                        header="Produk"
                        field={(e) => `${e.prod_id?.name} (${e.prod_id?.code})`}
                        style={{ minWidth: "28rem" }}
                        // body={loading && <Skeleton />}
                      />
                      {/* <Column
                      header="Lokasi"
                      field={(e) => e.location?.name}
                      style={{ minWidth: "9rem" }}
                      // body={loading && <Skeleton />}
                    /> */}
                      <Column
                        header="Jumlah"
                        field={(e) => formatTh(e?.order)}
                        style={{ minWidth: "8rem" }}
                        // body={loading && <Skeleton />}
                      />
                      {/* <Column
                      header="Satuan"
                      field={(e) => e?.unit_id?.name}
                      style={{ minWidth: "9rem" }}
                      // body={loading && <Skeleton />}
                    /> */}
                      <Column
                        header="Harga Satuan"
                        field={(e) => `Rp. ${formatIdr(e?.price)}`}
                        style={{ minWidth: "10rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Total"
                        field={(e) => `Rp. ${formatIdr(e?.total)}`}
                        style={{ minWidth: "15rem" }}
                        // body={loading && <Skeleton />}
                      />
                    </DataTable>
                  </div>
                </Row>

                {show?.jasa?.length ? (
                  <Row className="ml-1 mt-6">
                    <>
                      <DataTable
                        value={show.jasa?.map((v, i) => {
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
                      <label className="fs-13 text-label">
                        <b>Detail Pembayaran</b>
                      </label>
                      <Divider className="ml-12"></Divider>
                    </div>

                    <div className="col-5 mt-2 ">
                      <label className="text-label">
                        {show?.split_inv
                          ? "Sub Total Barang"
                          : "Harga Jual/Penggantian"}
                      </label>
                    </div>

                    <div className="col-7 mt-2  text-right">
                      <label className="text-label">
                        {show?.split_inv ? (
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

                    <div className="col-5 mt-0">
                      <label className="text-label">Diskon(%)</label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label">
                        <b>
                          Rp. {formatIdr(0)}
                          {/* {show?.detail.map(
                            (v) => v.ord_id?.total_disc ?? formatIdr(0)
                          )} */}
                        </b>
                      </label>
                    </div>

                    <div className="col-5">
                      <label className="text-label">
                        {show?.split_inv ? "DPP Barang" : "Uang Muka"}
                      </label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label">
                        {show?.split_inv ? (
                          <b>
                            Rp.
                            {formatIdr(getUangMuka())}
                          </b>
                        ) : (
                          <b>
                            Rp.
                            {formatIdr(getUangMuka())}
                          </b>
                        )}
                      </label>
                    </div>

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
                        {show?.split_inv
                          ? "Pajak Atas Barang"`(${pajk()}%)`
                          : "Total PPN"}
                      </label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label">
                        {show?.split_inv ? (
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

                    <div className="col-12">
                      <Divider className="ml-12"></Divider>
                    </div>

                    <div className="col-5">
                      <label className="fs-13 text-label">
                        <b>Total</b>
                      </label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label fs-13">
                        {show?.split_inv ? (
                          <b>
                            Rp.{" "}
                            {formatIdr(
                              getSubTotalBarang() +
                                (getSubTotalBarang() * pajk()) / 100 -
                                getUangMuka()
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
                                  100 -
                                getUangMuka()
                            )}
                          </b>
                        )}
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

export default DetailFaktur;
