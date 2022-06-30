import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataPajak from "./DataPajak";

const data = {
  id: null,
  type: null,
  name: null,
  nilai: null,
  cutting: null,
  acc_sls_fax: null,
  acc_pur_fax: null,
  combined: null,
};

const Pajak = () => {
  const [pajak, setPajak] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getPajak();
  }, []);

  const getPajak= async (isUpdate = false) => {
    setLoading(true);
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
        setPajak(data);
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
              <DataPajak
                data={loading ? dummy : pajak}
                load={loading}
                onSuccessInput={() => getPajak()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Pajak;
