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
  const show = useSelector((state) => state.pbb.current);
  const dispatch = useDispatch();
  const printPage = useRef(null);
  const [comp, setComp] = useState(null);
  const [dept, setDept] = useState(null);
  const [acc, setAcc] = useState(null);
  const [stcard, setStcard] = useState(null);
  const [batch, setBatch] = useState(null);
  const [bprod, setBprod] = useState(null);
  const [bmat, setBmat] = useState(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    // getPbb();
    getDept();
    getComp();
    getAcc();
    getStcard();
    getBatch();
  }, []);

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
        console.log(data);
        setAcc(data);
      }
    } catch (error) {}
  };

  const getStcard = async () => {
    const config = {
      ...endpoints.stcard,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        setStcard(data);
      }
    } catch (error) {}
  };

  const getBatch = async () => {
    const config = {
      ...endpoints.direct_batch,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let bprod = null;
        let bmat = null;
        let btc = null;
        data?.forEach((element) => {
          show?.product?.forEach((elem) => {
            if (element.id === elem.trn_id) {
              bprod = element.product;
              bmat = element.material;
              btc = element;
            }
          });
        });

        setBprod(bprod);
        setBmat(bmat);
        setBatch(btc);
        console.log("======");
        console.log(bmat);
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

  const checkAcc = (value) => {
    let selected = {};
    acc?.forEach((element) => {
      if (value === element.account?.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkSt = (value) => {
    let selected = {};
    stcard?.forEach((element) => {
      if (value === element?.id) {
        selected = element;
      }
    });

    return selected;
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
                <label className="text-label">No. Pembebanan</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>{show?.pbb_code}</b>
                </span>
              </div>

              <div className="">
                <label className="text-label">Departemen</label>
                <br></br>
                <span className="ml-0 fs-14">
                  <b>
                    {show?.batch_id !== null && show?.batch_id?.dep_id !== null
                      ? `${checkDept(show?.batch_id.dep_id)?.ccost_name} (${
                          checkDept(show?.batch_id.dep_id)?.ccost_code
                        })`
                      : "-"}
                  </b>
                </span>
              </div>

              {/*  */}

              <div className="">
                {/* <span className="p-buttonset"> */}
                {/* <ReactToPrint
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
    // if (value < 0) {
    //   return `-Rp. ${`${value?.toFixed(2)}`
    //     .replace("-", "")
    //     .replace(".", ",")
    //     .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
    // }
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const formatth = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const body = () => {
    return (
      <>
        <Row className="ml-0 pt-0 justify-content-center">
          <Card className="col-10">
            <Card.Body>
              <Row className="ml-0 mr-0 mb-0 mt-1 justify-content-between fs-12">
                <div className="row justify-content-left col-6">
                  <div className="col-12 mt-0 fs-14 text-left">
                    <label className="text-label">
                      <b>Detail Pembebanan</b>
                    </label>
                  </div>
                </div>

                <div className="row justify-content-right col-6">
                  <div className="col-12 mt-0 fs-12 text-right">
                    <label className="text-label">Tanggal Pembebanan : </label>
                    <span className="ml-1">
                      <b>{formatDate(show.pbb_date)}</b>
                    </span>
                  </div>
                </div>
              </Row>

              <Card className="col-12 mt-0">
                <div className="row col-12">
                  <div className="col-6 fs-12 ml-0">
                    <label className="text-label">
                      <b>Informasi Pembebanan</b>
                    </label>
                  </div>

                  <div className="col-6 fs-12 ml-0 text-right">
                    <label className="text-label">
                      {show?.type_pb === 1 ? <b>Informasi Batch</b> : ""}
                    </label>
                  </div>

                  <div className="col-6 fs-12 ml-0">
                    <span className="ml-0 fs-12">
                      No. Pembebanan : <b>{show?.pbb_code}</b>
                    </span>
                    <br></br>
                    <br></br>
                    <span className="ml-0 fs-12">
                      Nama Pembebanan : <b>{show?.pbb_name}</b>
                    </span>
                    <br></br>
                    <br></br>
                  </div>

                  {show?.type_pb === 1 ? (
                    <div className="col-6 fs-12 ml-0 text-right">
                      <span className="ml-0 fs-12">
                        No. Batch :{" "}
                        <b>
                          {show?.batch_id !== null ? show?.batch_id.bcode : "-"}
                        </b>
                      </span>
                      <br></br>
                      <br></br>
                      <span className="ml-0">
                        Tanggal Batch :{" "}
                        <b>
                          {show?.batch_id !== null
                            ? formatDate(show?.batch_id.batch_date)
                            : "-"}
                        </b>
                      </span>
                      <br></br>
                      <br></br>
                      <span className="ml-0">
                        Departemen :{" "}
                        <b>
                          {show?.batch_id.dep_id !== null
                            ? `${
                                checkDept(show?.batch_id?.dep_id).ccost_name
                              } (${
                                checkDept(show?.batch_id?.dep_id)?.ccost_code
                              })`
                            : "-"}
                        </b>
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Card>

              <Row className="ml-1 mt-4">
                <div className="col-12 ml-0 mr-0">
                  <label className="text-label fs-13 text-black">
                    <b>Biaya Pembebanan</b>
                  </label>
                  <DataTable
                    value={show.upah?.map((v, i) => {
                      return {
                        ...v,
                        index: i,
                        nom_uph: v?.nom_uph ?? 0,
                      };
                    })}
                    responsiveLayout="none"
                    className="display w-150 datatable-wrapper fs-12"
                    showGridlines
                    dataKey="id"
                    rowHover
                  >
                    <Column
                      header="Account"
                      field={(e) =>
                        `${checkAcc(e.acc_id)?.account?.acc_name} (${
                          checkAcc(e.acc_id)?.account?.acc_code
                        })`
                      }
                      style={{ minWidth: "15rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header=""
                      field={(e) => null}
                      style={{ minWidth: "20rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header="Nominal Upah"
                      field={(e) => `Rp. ${formatIdr(e.nom_uph)}`}
                      style={{ minWidth: "15rem" }}
                      // body={loading && <Skeleton />}
                    />
                    <Column
                      header="Deskripsi"
                      field={(e) => e.desc ?? "-"}
                      style={{ minWidth: "20rem" }}
                      // body={loading && <Skeleton />}
                    />
                    {/* <Column
                      header=""
                      field={(e) => null}
                      style={{ minWidth: "10rem" }}
                      // body={loading && <Skeleton />}
                    /> */}
                  </DataTable>
                </div>
              </Row>

              {show?.type_pb !== 1 ? (
                <Row className="ml-1 mt-5 mb-3">
                  <div className="col-12 ml-0 mr-0">
                    <label className="text-label fs-13 text-black">
                      <b>Detail Produk</b>
                    </label>
                  </div>

                  <div className="col-12">
                    <>
                      <DataTable
                        value={
                          show?.type_pb === 3
                            ? show?.panen
                            : show?.product?.map((v, i) => {
                                return {
                                  ...v,
                                  index: i,
                                };
                              })
                        }
                        responsiveLayout="none"
                        className="display w-150 datatable-wrapper fs-12"
                        showGridlines
                        dataKey="id"
                        rowHover
                      >
                        <Column
                          header="Kode Bukti"
                          field={(e) => checkSt(e.trn_id)?.trx_code}
                          style={{ minWidth: "15rem" }}
                          // body={loading && <Skeleton />}
                        />
                        <Column
                          header={show?.type_pb === 3 ? "Tanggal Transaksi" : "Tanggal Produksi"}
                          field={(e) => formatDate(checkSt(e.trn_id)?.trx_date)}
                          style={{ minWidth: "10rem" }}
                          // body={loading && <Skeleton />}
                        />
                        <Column
                          header="Produk"
                          field={(e) =>
                            `${checkSt(e.trn_id)?.prod_id?.name} (${
                              checkSt(e.trn_id)?.prod_id?.code
                            })`
                          }
                          style={{ minWidth: "20rem" }}
                          // body={loading && <Skeleton />}
                        />
                        <Column
                          header="Qty Produksi"
                          field={(e) => formatth(e.qty)}
                          style={{ minWidth: "10rem" }}
                          // body={loading && <Skeleton />}
                        />
                        <Column
                          header="Alokasi Biaya (%)"
                          field={(e) => formatIdr(e.aloc)}
                          style={{ minWidth: "10rem" }}
                          // body={loading && <Skeleton />}
                        />
                      </DataTable>
                    </>
                  </div>
                </Row>
              ) : (
                <Row className="ml-1 mt-5 mb-3">
                  <div className="col-12 ml-0 mr-0">
                    <label className="text-label fs-13 text-black">
                      <b>Detail Finish Product</b>
                    </label>

                    <DataTable
                      value={bprod?.map((v, i) => {
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
                        header="Kode Bukti"
                        field={(e) => show?.batch_id?.bcode}
                        style={{ minWidth: "15rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Produk"
                        field={(e) => `${e.prod_id?.name} (${e.prod_id?.code})`}
                        style={{ minWidth: "20rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Gudang"
                        field={(e) => `${e.loc_id?.name} (${e.loc_id?.code})`}
                        style={{ minWidth: "15rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Qty Produksi"
                        field={(e) => formatth(e.qty)}
                        style={{ minWidth: "10rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Alokasi Biaya (%)"
                        field={(e) => formatIdr(e.aloc)}
                        style={{ minWidth: "10rem" }}
                        // body={loading && <Skeleton />}
                      />
                    </DataTable>
                  </div>

                  <div className="col-12 ml-0 mr-0 mt-2">
                    <label className="text-label fs-13 text-black">
                      <b>Detail Material</b>
                    </label>
                    <DataTable
                      value={bmat?.map((v, i) => {
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
                        header="Kode Bukti"
                        field={(e) => show?.batch_id?.bcode}
                        style={{ minWidth: "15rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Produk"
                        field={(e) => `${e.prod_id?.name} (${e.prod_id?.code})`}
                        style={{ minWidth: "20rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Gudang"
                        field={(e) =>
                          `${batch?.loc_id?.name} (${batch?.loc_id?.code})`
                        }
                        style={{ minWidth: "15rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header=""
                        field={(e) => null}
                        style={{ minWidth: "10rem" }}
                        // body={loading && <Skeleton />}
                      />
                      <Column
                        header="Qty Produksi"
                        field={(e) => formatth(e.qty)}
                        style={{ minWidth: "10rem" }}
                        // body={loading && <Skeleton />}
                      />
                    </DataTable>
                  </div>
                </Row>
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
