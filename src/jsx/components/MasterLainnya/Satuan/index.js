import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import DataSatuan from "./DataSatuan";

const data = {
  id: 0,
  code: null,
  name: null,
  type: "d",
  desc: null,
  active: true,
  qty: 1,
  u_from: null,
  u_to: null,
};

const Satuan = () => {
  const [satuan, setSatuan] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getSatuan();
  }, []);

  const getSatuan = async (isUpdate = false) => {
    // setLoading(true);
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
        setSatuan(data);
        // let dasar = [];
        // data.forEach((el) => {
        //   if (el.type === "d") {
        //     dasar.push(el);
        //   }
        // });
        setSatuan(data);
        
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
              <DataSatuan
                data={loading ? dummy : satuan}
                load={loading}
                onSuccessInput={() => getSatuan()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Satuan;
