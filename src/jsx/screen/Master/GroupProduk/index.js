import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataGroupProduk from "./GroupProduk";

const data = {
  groupPro: {
    id: null,
    code: null,
    name: null,
    div_code: null,
    acc_sto: null,
    acc_send: null,
    acc_terima: null,
    hrg_pokok: null,
    acc_penj: null,
    potongan: null,
    pengembalian: null,
    selisih: null,
  },

  divisi: {
    id: null,
    code: null,
    name: null,
    desc: null,
  },
};

const GroupProduk = () => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getGroupProduk();
  }, []);

  const getGroupProduk = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.groupPro,
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
        setGroup(data);
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

  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataGroupProduk
                data={loading ? dummy : group}
                load={loading}
                onSuccessInput={() => getGroupProduk()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default GroupProduk;
