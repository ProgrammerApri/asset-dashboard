import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Row, Col, Card } from "react-bootstrap";

const ReturPenjualan = () => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);
  const [view, setView] = useState([
    // <DataSalesOrder
    //   onAdd={() => {
    //     setActive(1);
    //   }}
    // />,
    // <InputSO
    //   onCancel={() => setActive(0)}
    //   onSubmit={() => {}}
    // />,
  ]);

 return (
    <>
    <Toast ref={toast} />
    <Row>
      <Col className="pt-0">
        <Card>
          <Card.Body>{view[active]}</Card.Body>
        </Card>
      </Col>
    </Row>
    </>
  );
};

export default ReturPenjualan;
