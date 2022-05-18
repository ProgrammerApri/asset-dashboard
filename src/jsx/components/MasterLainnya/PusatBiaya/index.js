import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataPusatBiaya from "./DataPusatBiaya";

const data = {
  id: 0,
  jpel_code: "",
  jpel_name: "",
  jpel_ket: "",
};

const PusatBiaya = () => {
  const [pusatBiaya, setPusatBiaya] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getPusatBiaya();
  }, []);

  const getPusatBiaya = async (isUpdate = false) => {
    setLoading(true);
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
        setPusatBiaya(data);
      }
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataPusatBiaya
                data={loading ? dummy : pusatBiaya}
                load={loading}
                onSuccessInput={() => getPusatBiaya()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PusatBiaya;
