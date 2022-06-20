import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataDivisi from "./Divisi";

const data = {
  id: 1,
  code: "",
  name: "",
  desc: "",
};

const Divisi = () => {
  const [divisi, setDivisi] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getDivisi();
  }, []);

  const getDivisi = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.divisi,
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
        setDivisi(data);
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
              <DataDivisi
                data={loading ? dummy : divisi}
                load={loading}
                onSuccessInput={() => getDivisi()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Divisi;
