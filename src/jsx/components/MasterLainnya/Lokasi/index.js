import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataLokasi from "./DataLokasi";

const data = {
    id: 1,
    code: "",
    name: "",
    address: "",
    desc: "",
};

const Lokasi = () => {
  const [lokasi, setLokasi] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getLokasi();
  }, []);

  const getLokasi = async (isUpdate = false) => {
    setLoading(true);
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
        setLokasi(data);
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
              <DataLokasi
                data={loading ? dummy : lokasi}
                load={loading}
                onSuccessInput={() => getLokasi()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Lokasi;
