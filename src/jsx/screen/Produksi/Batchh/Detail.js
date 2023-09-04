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

const Detail = ({ onCancel }) => {
  const show = useSelector((state) => state.btc.current);
  const dispatch = useDispatch();
  const printPage = useRef(null);
  const [comp, setComp] = useState(null);
  const [btc, setBtc] = useState(null);
  const [plan, setPlan] = useState(null);
  const [lok, setLok] = useState(null);
  const [dept, setDept] = useState(null);
  const [mesin, setMesin] = useState(null);
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
    getBatch();
    getDept();
    getProduct();
    getMesin();
    getSatuan();
    getComp();
    getLok();
    getPlan();
  }, []);

  const getBatch = async () => {
    const config = {
      ...endpoints.batch,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setBtc(data);
      }
    } catch (error) {
      console.log("------");
      console.log(error);
    }
  };

  const getDept = async () => {
    const config = {
      ...endpoints.pusatBiaya,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setDept(data);
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

  const getMesin = async () => {
    const config = {
      ...endpoints.mesin,
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
        setMesin(data);
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

  const getPlan = async () => {
    const config = {
      ...endpoints.planning,
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
        setPlan(data);
      }
    } catch (error) {}
  };

  const checkDept = (value) => {
    let selected = {};
    dept?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const chekLok = (value) => {
    let selected = {};
    lok?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });
    return selected;
  };

  const chekPL = (value) => {
    let selected = {};
    plan?.forEach((element) => {
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
                <label className="text-label">No. Batch</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>{show?.bcode}</b>
                </span>
              </div>

              <div className="">
                <label className="text-label">Departemen</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>
                    {show?.dep_id
                      ? `${show.dep_id.ccost_name} (${show.dep_id.ccost_code})`
                      : ""}
                  </b>
                </span>
              </div>

              {/*  */}

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
                        <b>Kartu Batch</b>
                      </label>
                    </div>
                  </div>

                  <div className="row justify-content-right col-6">
                    <div className="col-12 mt-0 fs-12 text-right">
                      <label className="text-label">Tanggal Batch : </label>
                      <span className="ml-1">
                        <b>{formatDate(show.batch_date)}</b>
                      </span>
                    </div>
                  </div>
                </Row>

                <Card className="col-12 mt-0">
                  <div className="row col-12">
                    <div className="col-6 fs-12 ml-0">
                      <label className="text-label">
                        <b>Informasi Batch</b>
                      </label>
                    </div>

                    <div className="col-6 fs-12 ml-0 text-right">
                      <label className="text-label">
                        <b>Informasi Planning</b>
                      </label>
                    </div>

                    <div className="col-6 fs-12 ml-0">
                      <span className="ml-0 fs-14">
                        No. Batch : <b>{show?.bcode}</b>
                      </span>
                      <br></br>
                    </div>

                    <div className="col-6 fs-12 ml-0 text-right">
                      <span className="ml-0 fs-14">
                        <b>{show?.plan_id?.pcode}</b>
                      </span>
                      <br></br>
                      <span className="ml-0">
                        Nama Planning : <b>{show?.plan_id?.pname}</b>
                      </span>
                      <br></br>
                      <span className="ml-0">
                        Tanggal Rencana :{" "}
                        <b>{show?.plan_id?.date_planing || ""}</b>
                      </span>

                      <br></br>
                      <span className="ml-0">
                        Rencana Produksi :{" "}
                        <b>{`${show?.plan_id?.total} (${show?.product[0]?.unit_id?.name})`}</b>
                      </span>
                      <br></br>
                      <br></br>
                      <span className="ml-0">
                        Lokasi Gudang :{" "}
                        <b>{chekLok(show?.plan_id?.loc_id)?.name}</b>
                      </span>
                    </div>
                  </div>
                </Card>

                <Row className="ml-1 mt-0">
                  <div className="col-12 ml-0 mr-0">
                    <label className="text-label fs-13 text-black">
                      <b>Produk Jadi</b>
                    </label>
                  </div>

                  <div className="col-12">
                    <>
                      <DataTable
                        value={show.product?.map((v, i) => {
                          console.log("produk", v);
                          return {
                            ...v,
                            index: i,
                            qty_form: v?.qty_making ?? 0,
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
                          field={(e) =>
                            `${e.prod_id?.name} (${e.prod_id?.code})`
                          }
                          style={{ minWidth: "19rem" }}
                          // body={loading && <Skeleton />}
                        />
                        <Column
                          header="Jumlah"
                          field={(e) => e.qty_form}
                          style={{ minWidth: "6rem" }}
                          // body={loading && <Skeleton />}
                        />
                        <Column
                          header="Satuan"
                          field={(e) => e.unit_id?.name}
                          style={{ minWidth: "9rem" }}
                          // body={loading && <Skeleton />}
                        />
                        <Column
                          header="Alokasi (%)"
                          field={(e) => e.aloc}
                          style={{ minWidth: "10rem" }}
                          // body={loading && <Skeleton />}
                        />
                      </DataTable>
                    </>
                  </div>
                </Row>

                <Row className="ml-1 mt-4">
                  <div className="col-12 ml-0 mr-0">
                    <label className="text-label fs-13 text-black">
                      <b>Bahan</b>
                    </label>
                  </div>

                  <div className="col-12">
                    <>
                      <DataTable
                        value={show.material?.map((v, i) => {
                          return {
                            ...v,
                            index: i,
                            price: v?.price ?? 0,
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
                          field={(e) =>
                            `${e.prod_id?.name} (${e.prod_id?.code})`
                          }
                          style={{ minWidth: "19rem" }}
                          // body={loading && <Skeleton />}
                        />
                        <Column
                          header="Jumlah"
                          field={(e) => e.qty}
                          style={{ minWidth: "6rem" }}
                          // body={loading && <Skeleton />}
                        />
                        <Column
                          header="Satuan"
                          field={(e) => e.unit_id?.name}
                          style={{ minWidth: "9rem" }}
                          // body={loading && <Skeleton />}
                        />
                        <Column
                          header="Harga"
                          field={(e) => e.price}
                          style={{ minWidth: "10rem" }}
                          // body={loading && <Skeleton />}
                        />
                      </DataTable>
                    </>
                  </div>
                </Row>

                <Row className="ml-1 mt-4">
                  <div className="col-12 ml-0 mr-0">
                    <label className="text-label fs-13 text-black">
                      <b>Mesin</b>
                    </label>
                  </div>

                  <div className="col-12">
                    <>
                      <DataTable
                        value={show.mesin?.map((v, i) => {
                          return {
                            ...v,
                            index: i,
                          };
                        })}
                        responsiveLayout="scroll"
                        className="display w-150 datatable-wrapper fs-12"
                        showGridlines
                        dataKey="id"
                        rowHover
                      >
                        <Column
                          header="Mesin"
                          field={(e) =>
                            `${e.mch_id?.msn_name} (${e.mch_id?.msn_code})`
                          }
                          style={{ minWidth: "19rem" }}
                          // body={loading && <Skeleton />}
                        />
                      </DataTable>
                    </>
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
