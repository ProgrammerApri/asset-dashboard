import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataJasa from "./DataJasa";

const data = {
    jasa: {
      id: null,
      code: null,
      name: null,
      desc: null,
      acc_id: null,
    },
  
    account: {
      id: 0,
      acc_code: "",
      acc_name: "",
      umm_code: null,
      kat_code: 0,
      dou_type: "",
      sld_type: "",
      connect: true,
      sld_awal: 0,
    },
  };

const Jasa = () => {
  const [jasa, setJasa] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getJasa();
  }, []);

  const getJasa = async (isUpdate = false) => {
    setLoading(true);
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
        setJasa(data);
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
              <DataJasa
                data={loading ? dummy : jasa}
                load={loading}
                onSuccessInput={() => getJasa()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Jasa;
