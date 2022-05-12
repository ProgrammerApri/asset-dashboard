import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import PermintaanPembelian from "./PermintaanPembelian";
import InputOrder from "./InputOrder";

const RequestPurchase = () => {
  const [active, setActive] = useState(0);
  const [view, setView] = useState([
    <PermintaanPembelian onAdd={() => setActive(1)} />,
    <InputOrder 
      onCancel={() => setActive(0)} 
      onSubmit={() => {}} 
    />,
  ]);

  return (
    <Row>
      <Col className="pt-0">
        <Card>
          <Card.Body>{view[active]}</Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default RequestPurchase;
