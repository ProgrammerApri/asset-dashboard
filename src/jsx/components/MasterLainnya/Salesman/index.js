import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Toast } from "primereact/toast";
import DataSalesman from "./DataSalesman";

const data = {
  id: 1,
  sales_code: "",
  sales_name: "",
  sales_ket: "",
};

const Salesman = () => {
  const [salesman, setSalesman] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getSalesman();
  }, []);

  const getSalesman = async (isUpdate) => {
    setLoading(true);
    const config = {
      ...endpoints.salesman,
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
        setSalesman(data);
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
      <Toast ref={toast} />
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataSalesman
                data={loading ? dummy : salesman}
                load={loading}
                onSuccessInput={() => getSalesman()}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Salesman;
