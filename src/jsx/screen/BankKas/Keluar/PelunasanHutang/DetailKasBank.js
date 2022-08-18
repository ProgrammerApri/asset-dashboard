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

const DetailKasBank = ({ onCancel }) => {
  const show = useSelector((state) => state.exp.current);
  const dispatch = useDispatch();
  const printPage = useRef(null);
  const [comp, setComp] = useState(null);
  const so = useSelector((state) => state.so.so);
  const [dep, setDep] = useState(null);
  const [lok, setLok] = useState(null);
  const [customer, setCus] = useState(null);
  const [proj, setProj] = useState(null);
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
    getProj();
    getSatuan();
    getComp();
    getDep();
    getLok();
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
        setCus(data);
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

  const getProj = async () => {
    const config = {
      ...endpoints.project,
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
        setProj(data);
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

  const getDep = async () => {
    const config = {
      ...endpoints.pusatBiaya,
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
        setDep(data);
      }
    } catch (error) {}
  };

  const getLok = async () => {
    const config = {
      ...endpoints.lokasi,
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
        setLok(data);
      }
    } catch (error) {}
  };

  const checkproj = (value) => {
    let selected = {};
    proj?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkdep = (value) => {
    let selected = {};
    dep?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });
    return selected;
  };

  const loc = (value) => {
    let selected = {};
    lok?.forEach((element) => {
      if (value === element.id) {
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
                <label className="text-label">No. Pengeluaran</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>{show?.exp_code}</b>
                </span>
              </div>

              <div className="">
                <label className="text-label">Tanggal</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>{`${formatDate(show?.exp_date)}`}</b>
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
                        <b>Kas Bank Keluar</b>
                      </label>
                    </div>
                  </div>

                  <div className="row justify-content-right col-6">
                    <div className="col-12 mt-0 fs-12 text-right">
                      <label className="text-label">
                        Tanggal Pengeluaran :{" "}
                      </label>
                      <span className="ml-1">
                        <b>{formatDate(show?.exp_date)}</b>
                      </span>
                    </div>
                  </div>
                </Row>

                <Card className="col-12 mt-0">
                  <div className="row col-12">
                    <div className="col-12 fs-12 ml-0">
                      <label className="text-label">
                        <b>Informasi Pengeluaran</b>
                      </label>
                    </div>
                    <div className="col-12 fs-12 ml-0">
                      <span className="ml-0 fs-14">
                        <b>{show?.exp_code}</b>
                      </span>
                      <br></br>
                      <br></br>

                      <span className="ml-0">
                        Tipe Pengeluaran :{" "}
                        <b>
                          {show?.exp_type === 1
                            ? "Pelunasan"
                            : show?.exp_type === 2
                            ? "Pengeluaran Kas/Bank"
                            : "Biaya Batch"}
                        </b>
                      </span>
                      {show.exp_type === 1 && (
                        <>
                          <br></br>
                          <span className="ml-0">
                            Supplier : <b>{show?.acq_sup.sup_name}</b>
                          </span>
                        </>
                      )}
                      {show.exp_type === 2 && (
                        <>
                          <br></br>
                          <span className="ml-0">
                            Akun Pengeluaran :{" "}
                            <b>{`${show?.exp_acc.acc_code}-${show?.exp_acc.acc_name}`}</b>
                          </span>

                          <br></br>
                          <span className="ml-0">
                            Departement :{" "}
                            <b>{`${checkdep(show?.exp_dep)?.ccost_name} (${
                              checkdep(show?.exp_dep)?.ccost_code
                            })`}</b>
                          </span>

                          <br></br>
                          <span className="ml-0">
                            Project :{" "}
                            <b>{`${checkproj(show?.exp_prj)?.proj_code} (${
                              checkproj(show?.exp_prj)?.proj_name
                            })`}</b>
                          </span>
                        </>
                      )}
                      {/* <span className="ml-0">
                        Jatuh Tempo : <b>{formatDate(show?.due_date)}</b>
                      </span> */}
                    </div>

                    {/* <div className="col-6 fs-12 ml-0 text-right">
                      <label className="text-label">
                        <b>Informasi Customer</b>
                      </label>
                    </div> */}

                   

                    <div className="col-6 fs-12 ml-0 text-right">
                      {/* <span className="ml-0 fs-14">
                        <b>{show?.pel_id?.cus_name}</b>
                      </span> */}
                     
                      {/* <span className="ml-0">
                        Cp : <b>{show?.pel_id?.cus_cp}</b>
                      </span>
                      <br></br>
                      <span className="ml-0">
                        {show?.pel_id?.cus_address}
                      </span> */}
                      {/* <br></br>
                      <span className="ml-0">
                        {kota(show?.pel_id?.cus_kota)?.city_name},
                        {show?.pel_id?.cus_kpos}
                      </span>
                      <br></br>
                      <br></br>
                      <span className="ml-0">
                        (+62)
                        {show?.pel_id?.cus_telp1}
                      </span> */}
                    </div>
                  </div>
                </Card>

                {show.exp_type === 2 && (
                  <Row className="ml-1 mt-0">
                    <DataTable
                      value={show.exp}
                      responsiveLayout="scroll"
                      className="display w-150 datatable-wrapper fs-12"
                      showGridlines
                      dataKey="id"
                      rowHover
                    >
                      <Column
                        header="Akun"
                        field={(e) =>
                          `${e.acc_code?.acc_code}-${e.acc_code?.acc_name}`
                        }
                        style={{ minWidth: "20rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Tipe Pengeluaran"
                        field={(e) => "Debit"}
                        style={{ minWidth: "11rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Nilai"
                        field={(e) => e.value}
                        style={{ minWidth: "12rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Keterangan"
                        field={(e) => e.desc}
                        style={{ minWidth: "20rem" }}
                        // body={loading && <Skeleton />}
                      />
                    </DataTable>
                  </Row>
                )}

                <Row className="ml-0 mr-0 mb-0 mt-8 justify-content-between fs-12">
                  <div></div>
                  <div className="row justify-content-right col-6 mr-4">
                    {/* <div className="col-12 mb-0">
                      <label className="text-label">
                        <b>Detail Pembayaran</b>
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
                          ? "Pajak Atas Barang (11%)"
                          : "Pajak (11%)"}
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
                              ((getSubTotalBarang() + getSubTotalJasa()) * 11) /
                                100
                            )}
                          </b>
                        )}
                      </label>
                    </div> */}

                    {/* <div className="col-5 mt-0">
                      <label className="text-label">Diskon(%)</label>
                    </div>

                    <div className="col-7 text-right">
                      <label className="text-label">
                        <b>
                          Rp. {show?.total_disc !== null ? show?.total_disc : 0}
                        </b>
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
                                ((getSubTotalBarang() + getSubTotalJasa()) *
                                  11) /
                                  100
                            )}
                          </b>
                        )}
                      </label>
                    </div> */}

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

export default DetailKasBank;
