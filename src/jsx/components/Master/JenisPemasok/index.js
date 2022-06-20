import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataLokasi from "./DataLokasi";

const data = {
  id: 1,
  jpem_code: "",
  jpem_name: "",
  jpem_ket: "",
};

const JenisPemasok = () => {
  const [jenisPemasok, setJenisPemasok] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getJenisPemasok();
  }, []);

  const getJenisPemasok = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.jenisPemasok,
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
        setJenisPemasok(data);
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
                data={loading ? dummy : jenisPemasok}
                load={loading}
                onSuccessInput={() => getJenisPemasok()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default JenisPemasok;
