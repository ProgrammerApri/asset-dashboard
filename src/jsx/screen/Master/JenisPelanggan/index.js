import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataJenisPelanggan from "./DataJenisPelanggan";

const data = {
  id: 0,
  jpel_code: "",
  jpel_name: "",
  jpel_ket: "",
};

const JenisPelanggan = () => {
  const [jenisPel, setJenisPel] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getJenisPel();
  }, []);

  const getJenisPel = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.jenisPel,
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
        setJenisPel(data);
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
              <DataJenisPelanggan
                data={loading ? dummy : jenisPel}
                load={loading}
                onSuccessInput={() => getJenisPel()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default JenisPelanggan;
