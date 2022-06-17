import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button as PButton } from "primereact/button";
import { Button, Card, Col, Row } from "react-bootstrap";
import { SET_CURRENT_INV, SET_INV } from "src/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Divider } from "@material-ui/core";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import ReactToPrint from "react-to-print";

const Detail = ({ onCancel }) => {
  const inv = useSelector((state) => state.inv.current);
  const dispatch = useDispatch();
  const printPage = useRef(null);
  const [order, setOrder] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [jas, setJas] = useState(null);
  const [prod, setProd] = useState(null);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Detail Faktur Pembelian</b>
      </h4>
    );
  };

  const body = () => {
    return (
      <>
        <Row className="ml-0 pt-0">
          <div className="col-6">
            <label className="text-label  textAlign-right">
              Tanggal Faktur
            </label>
            <div className="p-inputgroup">
              <span className="ml-0">{formatDate(inv.fk_date)}</span>
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">No. Faktur</label>
            <div className="p-inputgroup">
              <span className="ml-0">{inv.fk_code}</span>
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">No. Pembelian</label>
            <div className="p-inputgroup"></div>
            <span className="ml-0">{inv.ord_id?.ord_code}</span>
          </div>

          <div className="col-6">
            <label className="text-label">Supplier</label>
            <div className="p-inputgroup">
              <span className="ml-0">{inv.ord_id?.sup_id?.sup_name}</span>
            </div>
          </div>

          {/* <Row className="ml-1 mt-4 col-12"> */}
            <DataTable
              value={inv.product?.map((v, i) => {
                return {
                  ...v,
                  index: i,
                  price: v?.price ?? 0,
                  disc: v?.disc ?? 0,
                  total: v?.total ?? 0,
                };
              })}
              esponsiveLayout="scroll"
              className="display w-150 datatable-wrapper"
              showGridlines
              dataKey="id"
              rowHover
            >
              <Column
                header="Produk"
                field={(e) => e.prod_id && e.prod_id?.name}
                style={{ minWidth: "15rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Jumlah"
                field={(e) => e.order}
                style={{ minWidth: "15rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Harga Satuan"
                field={(e) => e.price}
                style={{ minWidth: "15rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Lokasi"
                field={(e) => e.location?.name}
                style={{ minWidth: "15rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Total"
                field={(e) => formatIdr(e.total)}
                style={{ minWidth: "15rem" }}
                // body={loading && <Skeleton />}
              />
            </DataTable>
          {/* </Row> */}

          <Row className="ml-1 mt-5 col-12">
            <DataTable
              responsiveLayout="scroll"
              className="display w-150 datatable-wrapper"
              showGridlines
              dataKey="id"
              rowHover
              value={inv.jasa?.map((v, i) => {
                return {
                  ...v,
                  index: i,
                  price: v?.price ?? 0,
                  disc: v?.disc ?? 0,
                  total: v?.disc ?? "",
                };
              })}
            >
              <Column
                header="Supplier"
                field={(e) => supp(e.sup_id)?.supplier?.sup_name}
                style={{ minWidth: "20rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Jasa"
                field={(e) => e.jasa_id && jasa(e.jasa_id)?.name}
                style={{ minWidth: "20rem" }}
                // body={loading && <Skeleton />}
              />
              <Column
                header="Total"
                field={(e) => formatIdr(e.total)}
                style={{ minWidth: "20rem" }}
                // body={loading && <Skeleton />}
              />
            </DataTable>
          </Row>

          <div className="row ml-0 mr-0 mb-0 mt-4 justify-content-between">
            <div>
              <div className="row ml-0 mt-3 col-12"></div>
            </div>

            <div className="row justify-content-right col-6 ml-6">
              <div className="col-6">
                <label className="text-label">
                  {inv.split_inv ? "Sub Total Barang" : "Subtotal"}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {inv.split_inv ? (
                    <b>
                      Rp.
                      {/* {formatIdr(getSubTotalBarang())} */}
                    </b>
                  ) : (
                    <b>
                      Rp.
                      {/* {formatIdr(getSubTotalBarang() + getSubTotalJasa())} */}
                    </b>
                  )}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {inv.split_inv ? "DPP Barang" : "DPP"}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {inv.split_inv ? (
                    <b>
                      Rp.
                      {/* {formatIdr(getSubTotalBarang())} */}
                    </b>
                  ) : (
                    <b>
                      Rp.
                      {/* {formatIdr(getSubTotalBarang() + getSubTotalJasa())} */}
                    </b>
                  )}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {inv.split_inv ? "Pajak Atas Barang (11%)" : "Pajak (11%)"}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {inv.split_inv ? (
                    <b>
                      Rp.
                      {/* {formatIdr((getSubTotalBarang() * 11) / 100)} */}
                    </b>
                  ) : (
                    <b>
                      Rp.{" "}
                      {/* {formatIdr(
                        ((getSubTotalBarang() + getSubTotalJasa()) * 11) / 100
                      )} */}
                    </b>
                  )}
                </label>
              </div>

              <div className="col-6 mt-3">
                <label className="text-label">Diskon</label>
              </div>

              <div className="col-6">
                <div className="p-inputgroup">
                  <InputText
                    // value={
                    //   inv.split_inv
                    //     ? isRp
                    //       ? (getSubTotalBarang() * Do.prod_disc) / 100
                    //       : inv.prod_disc
                    //     : isRp
                    //     ? ((getSubTotalBarang() + getSubTotalJasa()) *
                    //         Do.total_disc) /
                    //       100
                    //     : Do.total_disc
                    // }
                    placeholder="Diskon"
                    type="number"
                    min={0}
                    disabled
                    onChange={(e) => {}}
                  />
                </div>
              </div>

              <div className="col-12">
                <Divider className="ml-12"></Divider>
              </div>

              <div className="col-6">
                <label className="text-label">
                  <b>Total</b>
                </label>
              </div>

              <div className="col-6">
                <label className="text-label fs-16">
                  {inv.split_inv ? (
                    <b>
                      Rp.{" "}
                      {/* {formatIdr(
                        getSubTotalBarang() + (getSubTotalBarang() * 11) / 100
                      )} */}
                    </b>
                  ) : (
                    <b>
                      Rp.{" "}
                      {/* {formatIdr(
                        getSubTotalBarang() +
                          getSubTotalJasa() +
                          ((getSubTotalBarang() + getSubTotalJasa()) * 11) / 100
                      )} */}
                    </b>
                  )}
                </label>
              </div>
            </div>
          </div>
        </Row>

        <Row className="ml-0 pt-0 d-none">
          <Col>
            <Card ref={printPage}>
              <Card.Body>
                <CustomeWrapper
                  tittle={"Faktur Pembelian"}
                  body={
                    <Card>
                      <div className="col-6">
                        <label className="text-label">Tanggal Faktur</label>
                        <div className="p-inputgroup">
                          <span className="ml-0">
                            {formatDate(inv.fk_date)}
                          </span>
                        </div>
                      </div>

                      <div className="col-6">
                        <label className="text-label">No. Faktur</label>
                        <div className="p-inputgroup">
                          <span className="ml-0">{inv.fk_code}</span>
                        </div>
                      </div>

                      <div className="col-6">
                        <label className="text-label">No. Pembelian</label>
                        <div className="p-inputgroup"></div>
                        <span className="ml-0">{inv.ord_id?.ord_code}</span>
                      </div>

                      <div className="col-6">
                        <label className="text-label">Supplier</label>
                        <div className="p-inputgroup">
                          <span className="ml-0">{inv.sup_id?.sup_name}</span>
                        </div>
                      </div>

                      <Row className="ml-1 mt-4">
                        <DataTable className="display w-150 datatable-wrapper">
                          <Column
                            header="Produk"
                            field={(e) => null}
                            style={{ minWidth: "13rem" }}
                            // body={loading && <Skeleton />}
                          />
                          <Column
                            header="Jumlah"
                            field={null}
                            style={{ minWidth: "12rem" }}
                            // body={loading && <Skeleton />}
                          />
                          <Column
                            header="Harga Satuan"
                            field={(e) => null}
                            style={{ minWidth: "12rem" }}
                            // body={loading && <Skeleton />}
                          />
                          <Column
                            header="Lokasi"
                            field={(e) => null}
                            style={{ minWidth: "12rem" }}
                            // body={loading && <Skeleton />}
                          />
                          <Column
                            header="Total"
                            field={(e) => null}
                            style={{ minWidth: "12rem" }}
                            // body={loading && <Skeleton />}
                          />
                        </DataTable>
                      </Row>

                      <Row className="ml-1 mt-5">
                        <DataTable className="display w-150 datatable-wrapper">
                          <Column
                            header="Supplier"
                            field={(e) => null}
                            style={{ minWidth: "21rem" }}
                            // body={loading && <Skeleton />}
                          />
                          <Column
                            header="Jasa"
                            field={null}
                            style={{ minWidth: "20rem" }}
                            // body={loading && <Skeleton />}
                          />
                          <Column
                            header="Total"
                            field={(e) => null}
                            style={{ minWidth: "20rem" }}
                            // body={loading && <Skeleton />}
                          />
                        </DataTable>
                      </Row>

                      <Row className="ml-0 mr-0 mb-0 mt-4 justify-content-between">
                        <div>
                          <div className="row ml-0 mt-3 center"></div>
                        </div>

                        <div className="row justify-content-right col-6 mr-4">
                          <div className="col-6">
                            <label className="text-label">
                              {inv.split_inv ? "Sub Total Barang" : "Subtotal"}
                            </label>
                          </div>

                          <div className="col-6">
                            <label className="text-label">
                              {inv.split_inv ? (
                                <b>
                                  Rp.
                                  {/* {formatIdr(getSubTotalBarang())} */}
                                </b>
                              ) : (
                                <b>
                                  Rp.
                                  {/* {formatIdr(getSubTotalBarang() + getSubTotalJasa())} */}
                                </b>
                              )}
                            </label>
                          </div>

                          <div className="col-6">
                            <label className="text-label">
                              {inv.split_inv ? "DPP Barang" : "DPP"}
                            </label>
                          </div>

                          <div className="col-6">
                            <label className="text-label">
                              {inv.split_inv ? (
                                <b>
                                  Rp.
                                  {/* {formatIdr(getSubTotalBarang())} */}
                                </b>
                              ) : (
                                <b>
                                  Rp.
                                  {/* {formatIdr(getSubTotalBarang() + getSubTotalJasa())} */}
                                </b>
                              )}
                            </label>
                          </div>

                          <div className="col-6">
                            <label className="text-label">
                              {inv.split_inv
                                ? "Pajak Atas Barang (11%)"
                                : "Pajak (11%)"}
                            </label>
                          </div>

                          <div className="col-6">
                            <label className="text-label">
                              {inv.split_inv ? (
                                <b>
                                  Rp.
                                  {/* {formatIdr((getSubTotalBarang() * 11) / 100)} */}
                                </b>
                              ) : (
                                <b>
                                  Rp.{" "}
                                  {/* {formatIdr(
                        ((getSubTotalBarang() + getSubTotalJasa()) * 11) / 100
                      )} */}
                                </b>
                              )}
                            </label>
                          </div>

                          <div className="col-6 mt-3">
                            <label className="text-label">Diskon</label>
                          </div>

                          <div className="col-6">
                            <div className="p-inputgroup">
                              <InputText
                                // value={
                                //   inv.split_inv
                                //     ? isRp
                                //       ? (getSubTotalBarang() * Do.prod_disc) / 100
                                //       : inv.prod_disc
                                //     : isRp
                                //     ? ((getSubTotalBarang() + getSubTotalJasa()) *
                                //         Do.total_disc) /
                                //       100
                                //     : Do.total_disc
                                // }
                                placeholder="Diskon"
                                type="number"
                                min={0}
                                disabled
                                onChange={(e) => {}}
                              />
                            </div>
                          </div>

                          <div className="col-12">
                            <Divider className="ml-12"></Divider>
                          </div>

                          <div className="col-6">
                            <label className="text-label">
                              <b>Total</b>
                            </label>
                          </div>

                          <div className="col-6">
                            <label className="text-label fs-16">
                              {inv.split_inv ? (
                                <b>
                                  Rp.{" "}
                                  {/* {formatIdr(
                        getSubTotalBarang() + (getSubTotalBarang() * 11) / 100
                      )} */}
                                </b>
                              ) : (
                                <b>
                                  Rp.{" "}
                                  {/* {formatIdr(
                        getSubTotalBarang() +
                          getSubTotalJasa() +
                          ((getSubTotalBarang() + getSubTotalJasa()) * 11) / 100
                      )} */}
                                </b>
                              )}
                            </label>
                          </div>
                        </div>
                      </Row>
                    </Card>
                  }
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div>
          <PButton
            label="Batal"
            onClick={onCancel}
            className="p-button-text btn-primary"
          />

          <ReactToPrint
            trigger={() => {
              return (
                <PButton variant="primary" onClick={() => {}}>
                  PDF{" "}
                  <span className="btn-icon-right">
                    <i class="bx bxs-file-pdf"></i>
                  </span>
                </PButton>
              );
            }}
            content={() => printPage.current}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {header()}
      {body()}
      {footer()}
    </>
  );
};

export default Detail;
