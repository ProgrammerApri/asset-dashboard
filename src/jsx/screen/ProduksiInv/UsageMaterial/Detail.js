import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
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
import endpoints from "../../../../utils/endpoints";

const Detail = ({ onCancel }) => {
  const show = useSelector((state) => state.usage.current);
  const dispatch = useDispatch();
  const printPage = useRef(null);
  const [comp, setComp] = useState(null);
  const [useMat, setMaterial] = useState(null);
  const [plan, setPlan] = useState(null);
  const [lok, setLok] = useState(null);
  const [dept, setDept] = useState(null);
  const [mesin, setMesin] = useState(null);
  const [prod, setProd] = useState(null);
  const [unit, setUnit] = useState(null);
  const [stcard, setStcard] = useState(null);
  const [acc, setAcc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getMaterial();
    getDept();
    getProduct();
    getMesin();
    getSatuan();
    getComp();
    getLok();
    getPlan();
  }, []);

  const getMaterial = async () => {
    const config = {
      ...endpoints.usage_mat,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setMaterial(data);
        getSt();
        getAcc();
      }
    } catch (error) {}
  };

  const getSt = async () => {
    const config = {
      ...endpoints.stcard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setStcard(data);
      }
    } catch (error) {}
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

  const getAcc = async () => {
    const config = {
      ...endpoints.account,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setAcc(data);
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

  const chekMsn = (value) => {
    let selected = {};
    mesin?.forEach((element) => {
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

  const hpp_pm = () => {
    let hpp = 0;
    show?.material?.forEach((elem) => {
      stcard?.forEach((element) => {
        if (
          element.trx_code === show.bcode &&
          element.prod_id.id === elem.prod_id.id &&
          element.loc_id.id === show.loc_id.id
        ) {
          hpp = element.trx_hpok;
        }
      });
    });
    return hpp;
  };

  const hpp_pj = () => {
    let hpp_pj = 0;
    show?.product?.forEach((ei) => {
      stcard?.forEach((eh) => {
        if (
          show.bcode === eh.trx_code &&
          ei.prod_id.id === eh.prod_id.id &&
          eh.loc_id.id === ei.loc_id.id
        ) {
          hpp_pj = eh.trx_hpok;
        }
      });
    });
    console.log("=============");
    console.log(hpp_pj);
    return hpp_pj;
  };

  const hpp_pr = () => {
    let hpp = 0;
    show?.reject?.forEach((elem) => {
      stcard?.forEach((element) => {
        if (
          element.trx_code === show.bcode &&
          element.prod_id.id === elem.prod_id.id &&
          element.loc_id.id === elem.loc_id.id
        ) {
          hpp = element.trx_hpok;
        }
      });
    });
    return hpp;
  };

  const formatTh = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const forTh = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const renderHeader = () => {
    return (
      <Row>
        <Col>
          <Card className="px-4 py-3 fs-13">
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
                <label className="text-label">Kode Pemakaian Material</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>{show?.code}</b>
                </span>
              </div>

              <div className="">
                <label className="text-label">Departemen</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>
                    {show?.dep_id !== null
                      ? `${checkDept(show?.dep_id)?.ccost_name} (${
                          checkDept(show?.dep_id)?.ccost_code
                        })`
                      : "-"}
                  </b>
                </span>
              </div>

              {/*  */}

              <div className="">
                {/* <span className="p-buttonset">
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
                  /> */}
                <Button
                  label="Batal"
                  onClick={onCancel}
                  className="p-button-info"
                  icon="pi pi-times"
                />
                {/* </span> */}
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
    if (value < 0) {
      return `-Rp. ${`${value.toFixed(2)}`
        .replace("-", "")
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
    }
    return `Rp. ${`${value.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  };

  const checkAcc = (value) => {
    let selected = {};
    acc?.forEach((element) => {
      if (value === element.account.id) {
        selected = element;
      }
    });

    return selected;
  };

  const body = () => {
    return (
      <>
        <Row className="ml-0 pt-0 justify-content-center" ref={printPage}>
          <Card className="col-11">
            <Card.Body>
              <Row className="ml-0 mr-0 mb-0 mt-1 justify-content-between fs-12">
                <div className="row justify-content-left col-6">
                  <div className="col-12 mt-0 fs-14 text-left">
                    <label className="text-label">
                      <b>Detail Produk Material</b>
                    </label>
                  </div>
                </div>

                <div className="row justify-content-right col-6">
                  <div className="col-12 mt-0 fs-12 text-right"></div>
                </div>
              </Row>

              <Card className="col-6 mt-0">
                <div className="row col-12">
                  <div className="col-6 fs-12 ml-0">
                    <label className="text-label">
                      <b>Informasi Pemakaian</b>
                    </label>
                  </div>

                  <div className="col-6 fs-12 ml-0 text-right">
                    {/* <label className="text-label">
                      <b>Informasi Produksi</b>
                    </label> */}
                  </div>

                  <div className="col-6 fs-12 ml-0">
                    <span className="ml-0 fs-12">
                      Kode Pemakaian : <b>{show?.code}</b>
                    </span>
                    <br></br>
                    <br></br>
                    <span className="ml-0">
                      {/* Mesin Produksi :{" "}
                      <b>
                        {show?.msn_id !== null
                          ? `${chekMsn(show?.msn_id).msn_name} (${
                              chekMsn(show?.msn_id).msn_code
                            })`
                          : "-"}
                      </b> */}
                    </span>
                  </div>

                  <div className="col-6 fs-12 ml-0 text-right">
                    {/* <span className="ml-0">
                      Lokasi Row Material : <b>{show?.loc_id?.name}</b>
                    </span>
                    <br></br>
                    <br></br> */}
                    <label className="text-label">Tanggal Pemakaian : </label>
                    <span className="ml-1">
                      <b>{formatDate(show.date)}</b>
                    </span>
                  </div>
                </div>
              </Card>

              <Row className="ml-1 mt-4">
                <div className="col-12 ml-0 mr-0">
                  <label className="text-label fs-13 text-black">
                    <b>Material</b>
                  </label>
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
                      field={(e) => `${e.prod_id?.name} (${e.prod_id?.code})`}
                      style={{ width: "20rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header="Gudang"
                      field={(e) =>
                        `${show?.loc_id?.name} (${show.loc_id?.code})`
                      }
                      style={{ minWidth: "10rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header="Jumlah"
                      field={(e) => forTh(e.qty)}
                      style={{ minWidth: "6rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header="Satuan"
                      field={(e) => e.unit_id?.name}
                      style={{ minWidth: "8rem" }}
                      // body={loading && <Skeleton />}
                    />
                  </DataTable>
                </div>
              </Row>

              {show?.wages !== null ? (
                <Row className="ml-1 mt-5 mb-3">
                  <div className="col-12 ml-0 mr-0">
                    <label className="text-label fs-13 text-black">
                      <b>Biaya Pemakaian</b>
                    </label>
                    <DataTable
                      value={show?.biaya?.map((v, i) => {
                        return {
                          ...v,
                          index: i,
                          value: v?.value ?? 0,
                        };
                      })}
                      responsiveLayout="scroll"
                      className="display w-150 datatable-wrapper fs-12"
                      showGridlines
                      dataKey="id"
                      rowHover
                    >
                      <Column
                        header="Akun"
                        field={(e) =>
                          e.acc_id
                            ? `${checkAcc(e.acc_id)?.account?.acc_name} - ${
                                checkAcc(e.acc_id)?.account?.acc_code
                              }`
                            : "-"
                        }
                        style={{ width: "20rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Deskripsi"
                        field={(e) =>
                          e.desc ? e.desc  : `Biaya Atas Pemakaian ${show?.code}`
                        }
                        style={{ minWidth: "10rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header=""
                        field={null}
                        style={{ minWidth: "6rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Nominal"
                        field={(e) => (e.value ? formatIdr(e.value) : "-")}
                        style={{ minWidth: "8rem" }}
                        // body={loading && <Skeleton />}
                      />
                    </DataTable>
                  </div>
                </Row>
              ) : (
                <></>
              )}
            </Card.Body>
          </Card>
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
