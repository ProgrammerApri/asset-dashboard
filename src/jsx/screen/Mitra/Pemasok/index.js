import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataSupplier from "./DataPemasok";
import CircleProgress from "src/jsx/components/CircleProgress/circleProgress";

const data = {
  supplier: {
    id: null,
    sup_code: null,
    sup_name: null,
    sup_jpem: null,
    sup_ppn: null,
    sup_npwp: null,
    sup_address: null,
    sup_kota: null,
    sup_kpos: null,
    sup_telp1: null,
    sup_telp2: null,
    sup_fax: null,
    sup_cp: null,
    sup_curren: null,
    sup_ket: null,
    sup_hutang: null,
    sup_uang_muka: null,
    sup_limit: null,
  },

  currency: {
    id: 0,
    code: "",
    name: "",
  },

  jenisPemasok: {
    id: 1,
    jpem_code: "",
    jpem_name: "",
    jpem_ket: "",
  },

  city: {
    city_id: 0,
    province_id: 0,
    province: "",
    type: "",
    city_name: "",
    postal_code: 0,
  },
};

const Supplier = ({edit, del}) => {
  const [supplier, setSupplier] = useState(null);
  const [ap, setAp] = useState(null);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getSupplier();
    getAP();
  }, []);

  const getSupplier = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.supplier,
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
        setSupplier(data);
      }
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const getAP = async () => {
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
        setAp(data);
      }
    } catch (error) {}
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const getHutangBJT = () => {
    let jt = 0;
    ap?.forEach((element) => {
      let due = new Date(`${element?.ord_due}Z`);
      let diff = (date - due) / (1000 * 60 * 60 * 24);

      jt += diff <= 0 ? element.trx_amnh : 0;
    });
    console.log("cek");
    console.log(jt);
    return jt;
  };

  const getHutangJT = () => {
    let jte = 0;
    ap?.forEach((element) => {
      let due = new Date(`${element?.ord_due}Z`);
      let diff = (date - due) / (1000 * 60 * 60 * 24);

      jte += diff > 60 ? element.trx_amnh : 0;
    });
    return jte;
  };

  const getTotal = () => {
    let total = 0;
    ap?.forEach((element) => {
      total += element.trx_amnh;

      // console.log("cek");
      // console.log(total);
    });
    return total;
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

  return (
    <>
      <Row className="mt-2">
        <div className="col-md-4 col-sm-4">
          <Card>
            <Card.Body className="p-0">
              <Row className="align-center">
                <div className="ml-3 mt-1">
                  <CircleProgress
                    percent={50}
                    colors={"#58B9DF"}
                    icon={
                      <svg
                        width="30"
                        height="30"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 77.62 90.11"
                      >
                        <g>
                          <g>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M77.59,24.63a30,30,0,0,1,0,3,6.2,6.2,0,0,1-3.34,5.09,1.38,1.38,0,0,0-.64,1.05c1.22,10.34-.63,20.29-3.76,30.09-1,3-1.71,6-2.54,9-.66,2.38,0,3.81,2.16,4.92a6.48,6.48,0,0,1,3.76,6.74,6.39,6.39,0,0,1-5.76,5.55,6.52,6.52,0,0,1-6.5-3.8,5.93,5.93,0,0,0-1.3-1.82,2.68,2.68,0,0,0-2.89-.51A52,52,0,0,1,36,87a51.67,51.67,0,0,1-14.3-2.8c-2.75-.95-3.87-.49-5.15,2.14a6.37,6.37,0,0,1-8.3,3.19,6.41,6.41,0,0,1-1-11.27,10.74,10.74,0,0,1,1.05-.58c2-1.07,2.65-2.53,2-4.78C8.72,67.05,7,61.18,5.46,55.27A57.45,57.45,0,0,1,4,34.7a2,2,0,0,0-1.13-2.37A5.72,5.72,0,0,1,0,27.11q-.06-2.52,0-5c.07-3.7,2.6-6.39,6.3-6.22a9.24,9.24,0,0,0,6.72-2.35c3.5-2.91,7.2-5.58,10.83-8.33A24.28,24.28,0,0,1,54,5.3c4.28,3.3,8.55,6.59,12.86,9.84a3.92,3.92,0,0,0,1.84.62c1,.1,1.92,0,2.88,0a6.12,6.12,0,0,1,6,6.08c0,.91,0,1.84,0,2.75ZM38.9,33.34H7.71c-.65,0-1.24-.1-1.34.88A56.7,56.7,0,0,0,7.48,53.53C9.06,59.88,11,66.16,12.69,72.47a6,6,0,0,1-3.14,7.26,11.66,11.66,0,0,0-1.14.66A4,4,0,0,0,6.93,85a4,4,0,0,0,3.73,2.71,3.93,3.93,0,0,0,4-2.71,5.83,5.83,0,0,1,7.3-3.22,45.12,45.12,0,0,0,15.34,3,51,51,0,0,0,18.95-3.08,4.78,4.78,0,0,1,2.22-.24,5.9,5.9,0,0,1,4.63,3.72,4,4,0,0,0,7.77-.93,4.07,4.07,0,0,0-2.5-4.33A6,6,0,0,1,65,72.31c1-3.58,1.93-7.18,3-10.72C70.75,52.84,72.27,44,71.3,34.77c-.11-1.12-.42-1.46-1.56-1.46C59.46,33.36,49.18,33.34,38.9,33.34Zm0-15.2H6.67c-2.78,0-4.22,1.43-4.27,4.2,0,1.6,0,3.2,0,4.79a3.71,3.71,0,0,0,4,3.85H71.08c2.61,0,4.08-1.47,4.15-4.08,0-1.36,0-2.72,0-4.08,0-3.37-1.34-4.69-4.74-4.69Zm24.58-2.42a11.13,11.13,0,0,0-.85-.77Q57.4,10.89,52.12,6.84A21.44,21.44,0,0,0,27.6,5.59C23.05,8.53,18.86,12,14.52,15.31c-.09.07-.11.25-.18.41Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M31.46,14.61a4.06,4.06,0,0,1-4-4.06,4.07,4.07,0,1,1,8.14.08A4.06,4.06,0,0,1,31.46,14.61Zm1.71-4a1.67,1.67,0,1,0-3.33-.08,1.67,1.67,0,1,0,3.33.08Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M38.15,7.44a6.17,6.17,0,0,1,1.53-1.13c.68-.21,1.52.65,1.45,1.39S40.56,9.14,39.75,9c-.57-.09-1.06-.66-1.59-1Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M43.67,14.58c-.43-.7-.84-1.06-.81-1.39a1.11,1.11,0,0,1,.81-.76,1.1,1.1,0,0,1,.81.75C44.5,13.52,44.1,13.88,43.67,14.58Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M33.17,10.57a1.67,1.67,0,1,1-3.33-.08,1.67,1.67,0,1,1,3.33.08Z"
                            ></path>
                          </g>
                        </g>
                      </svg>
                    }
                  />
                </div>
                <div className="col-8 mt-4">
                  <span className="fs-13 text-black font-w600 ml-">
                    Hutang Jatuh Tempo Lebih Dari <b>60 Hari</b>
                  </span>
                  <h4 className="fs-140 text-black font-w600 mt-1">
                    <b>Rp. {formatIdr(getHutangJT())}</b>
                  </h4>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4 col-sm-4">
          <Card>
            <Card.Body className="p-0">
              <Row>
                <div className="ml-3 mt-1">
                  <CircleProgress
                    percent={50}
                    colors={"#8D77A4"}
                    icon={
                      <svg
                        width="30"
                        height="30"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 77.62 90.11"
                      >
                        <g>
                          <g>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M77.59,24.63a30,30,0,0,1,0,3,6.2,6.2,0,0,1-3.34,5.09,1.38,1.38,0,0,0-.64,1.05c1.22,10.34-.63,20.29-3.76,30.09-1,3-1.71,6-2.54,9-.66,2.38,0,3.81,2.16,4.92a6.48,6.48,0,0,1,3.76,6.74,6.39,6.39,0,0,1-5.76,5.55,6.52,6.52,0,0,1-6.5-3.8,5.93,5.93,0,0,0-1.3-1.82,2.68,2.68,0,0,0-2.89-.51A52,52,0,0,1,36,87a51.67,51.67,0,0,1-14.3-2.8c-2.75-.95-3.87-.49-5.15,2.14a6.37,6.37,0,0,1-8.3,3.19,6.41,6.41,0,0,1-1-11.27,10.74,10.74,0,0,1,1.05-.58c2-1.07,2.65-2.53,2-4.78C8.72,67.05,7,61.18,5.46,55.27A57.45,57.45,0,0,1,4,34.7a2,2,0,0,0-1.13-2.37A5.72,5.72,0,0,1,0,27.11q-.06-2.52,0-5c.07-3.7,2.6-6.39,6.3-6.22a9.24,9.24,0,0,0,6.72-2.35c3.5-2.91,7.2-5.58,10.83-8.33A24.28,24.28,0,0,1,54,5.3c4.28,3.3,8.55,6.59,12.86,9.84a3.92,3.92,0,0,0,1.84.62c1,.1,1.92,0,2.88,0a6.12,6.12,0,0,1,6,6.08c0,.91,0,1.84,0,2.75ZM38.9,33.34H7.71c-.65,0-1.24-.1-1.34.88A56.7,56.7,0,0,0,7.48,53.53C9.06,59.88,11,66.16,12.69,72.47a6,6,0,0,1-3.14,7.26,11.66,11.66,0,0,0-1.14.66A4,4,0,0,0,6.93,85a4,4,0,0,0,3.73,2.71,3.93,3.93,0,0,0,4-2.71,5.83,5.83,0,0,1,7.3-3.22,45.12,45.12,0,0,0,15.34,3,51,51,0,0,0,18.95-3.08,4.78,4.78,0,0,1,2.22-.24,5.9,5.9,0,0,1,4.63,3.72,4,4,0,0,0,7.77-.93,4.07,4.07,0,0,0-2.5-4.33A6,6,0,0,1,65,72.31c1-3.58,1.93-7.18,3-10.72C70.75,52.84,72.27,44,71.3,34.77c-.11-1.12-.42-1.46-1.56-1.46C59.46,33.36,49.18,33.34,38.9,33.34Zm0-15.2H6.67c-2.78,0-4.22,1.43-4.27,4.2,0,1.6,0,3.2,0,4.79a3.71,3.71,0,0,0,4,3.85H71.08c2.61,0,4.08-1.47,4.15-4.08,0-1.36,0-2.72,0-4.08,0-3.37-1.34-4.69-4.74-4.69Zm24.58-2.42a11.13,11.13,0,0,0-.85-.77Q57.4,10.89,52.12,6.84A21.44,21.44,0,0,0,27.6,5.59C23.05,8.53,18.86,12,14.52,15.31c-.09.07-.11.25-.18.41Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M31.46,14.61a4.06,4.06,0,0,1-4-4.06,4.07,4.07,0,1,1,8.14.08A4.06,4.06,0,0,1,31.46,14.61Zm1.71-4a1.67,1.67,0,1,0-3.33-.08,1.67,1.67,0,1,0,3.33.08Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M38.15,7.44a6.17,6.17,0,0,1,1.53-1.13c.68-.21,1.52.65,1.45,1.39S40.56,9.14,39.75,9c-.57-.09-1.06-.66-1.59-1Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M43.67,14.58c-.43-.7-.84-1.06-.81-1.39a1.11,1.11,0,0,1,.81-.76,1.1,1.1,0,0,1,.81.75C44.5,13.52,44.1,13.88,43.67,14.58Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M33.17,10.57a1.67,1.67,0,1,1-3.33-.08,1.67,1.67,0,1,1,3.33.08Z"
                            ></path>
                          </g>
                        </g>
                      </svg>
                    }
                  />
                </div>
                <div className="col-8 mt-4">
                  <span className="fs-13 text-black mb-0">
                    <b>
                      Hutang Jatuh Tempo <b>Belum Jatuh Tempo</b>
                    </b>
                  </span>
                  <h4 className="fs-140 text-black mt-1">
                    <b>Rp. {formatIdr(getHutangBJT())}</b>
                  </h4>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4 col-sm-4">
          <Card>
            <Card.Body className="p-0">
              <Row className="align-center">
                <div className="ml-3 mt-1">
                  <CircleProgress
                    percent={50}
                    colors={"#869AAC"}
                    icon={
                      <svg
                        width="30"
                        height="30"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 77.62 90.11"
                      >
                        <g>
                          <g>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M77.59,24.63a30,30,0,0,1,0,3,6.2,6.2,0,0,1-3.34,5.09,1.38,1.38,0,0,0-.64,1.05c1.22,10.34-.63,20.29-3.76,30.09-1,3-1.71,6-2.54,9-.66,2.38,0,3.81,2.16,4.92a6.48,6.48,0,0,1,3.76,6.74,6.39,6.39,0,0,1-5.76,5.55,6.52,6.52,0,0,1-6.5-3.8,5.93,5.93,0,0,0-1.3-1.82,2.68,2.68,0,0,0-2.89-.51A52,52,0,0,1,36,87a51.67,51.67,0,0,1-14.3-2.8c-2.75-.95-3.87-.49-5.15,2.14a6.37,6.37,0,0,1-8.3,3.19,6.41,6.41,0,0,1-1-11.27,10.74,10.74,0,0,1,1.05-.58c2-1.07,2.65-2.53,2-4.78C8.72,67.05,7,61.18,5.46,55.27A57.45,57.45,0,0,1,4,34.7a2,2,0,0,0-1.13-2.37A5.72,5.72,0,0,1,0,27.11q-.06-2.52,0-5c.07-3.7,2.6-6.39,6.3-6.22a9.24,9.24,0,0,0,6.72-2.35c3.5-2.91,7.2-5.58,10.83-8.33A24.28,24.28,0,0,1,54,5.3c4.28,3.3,8.55,6.59,12.86,9.84a3.92,3.92,0,0,0,1.84.62c1,.1,1.92,0,2.88,0a6.12,6.12,0,0,1,6,6.08c0,.91,0,1.84,0,2.75ZM38.9,33.34H7.71c-.65,0-1.24-.1-1.34.88A56.7,56.7,0,0,0,7.48,53.53C9.06,59.88,11,66.16,12.69,72.47a6,6,0,0,1-3.14,7.26,11.66,11.66,0,0,0-1.14.66A4,4,0,0,0,6.93,85a4,4,0,0,0,3.73,2.71,3.93,3.93,0,0,0,4-2.71,5.83,5.83,0,0,1,7.3-3.22,45.12,45.12,0,0,0,15.34,3,51,51,0,0,0,18.95-3.08,4.78,4.78,0,0,1,2.22-.24,5.9,5.9,0,0,1,4.63,3.72,4,4,0,0,0,7.77-.93,4.07,4.07,0,0,0-2.5-4.33A6,6,0,0,1,65,72.31c1-3.58,1.93-7.18,3-10.72C70.75,52.84,72.27,44,71.3,34.77c-.11-1.12-.42-1.46-1.56-1.46C59.46,33.36,49.18,33.34,38.9,33.34Zm0-15.2H6.67c-2.78,0-4.22,1.43-4.27,4.2,0,1.6,0,3.2,0,4.79a3.71,3.71,0,0,0,4,3.85H71.08c2.61,0,4.08-1.47,4.15-4.08,0-1.36,0-2.72,0-4.08,0-3.37-1.34-4.69-4.74-4.69Zm24.58-2.42a11.13,11.13,0,0,0-.85-.77Q57.4,10.89,52.12,6.84A21.44,21.44,0,0,0,27.6,5.59C23.05,8.53,18.86,12,14.52,15.31c-.09.07-.11.25-.18.41Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M31.46,14.61a4.06,4.06,0,0,1-4-4.06,4.07,4.07,0,1,1,8.14.08A4.06,4.06,0,0,1,31.46,14.61Zm1.71-4a1.67,1.67,0,1,0-3.33-.08,1.67,1.67,0,1,0,3.33.08Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M38.15,7.44a6.17,6.17,0,0,1,1.53-1.13c.68-.21,1.52.65,1.45,1.39S40.56,9.14,39.75,9c-.57-.09-1.06-.66-1.59-1Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M43.67,14.58c-.43-.7-.84-1.06-.81-1.39a1.11,1.11,0,0,1,.81-.76,1.1,1.1,0,0,1,.81.75C44.5,13.52,44.1,13.88,43.67,14.58Z"
                            ></path>
                            <path
                              fill="white"
                              class="cls-1"
                              d="M33.17,10.57a1.67,1.67,0,1,1-3.33-.08,1.67,1.67,0,1,1,3.33.08Z"
                            ></path>
                          </g>
                        </g>
                      </svg>
                    }
                  />
                </div>
                <div className="col-8 mt-4">
                  <span className="fs-13 text-black font-w600">
                    <b>Total Hutang</b>
                  </span>
                  <h4 className="fs-140 text-black font-w600 mt-1">
                    <b>Rp. {formatIdr(getTotal())}</b>
                  </h4>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </div>

        <Col>
          <Card>
            <Card.Body>
              <DataSupplier
                data={loading ? dummy : supplier}
                load={loading}
                onSuccessInput={() => getSupplier()}
                edit ={edit}
                del={del}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Supplier;
