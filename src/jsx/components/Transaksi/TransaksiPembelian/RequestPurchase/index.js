import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import PermintaanPembelian from "./PermintaanPembelian";
import InputOrder from "./InputOrder";

const data = {
  id: null,
  req_code: null,
  req_date: null,
  req_dep: {
    id: null,
    ccost_code: null,
    ccost_name: null,
    ccost_ket: null,
  },
  req_ket: null,
  refrence: false,
  ref_sup: null,
  ref_ket: null,
};

const RequestPurchase = () => {
  const [active, setActive] = useState(0);
  const [currentItem, setCurrentItem] = useState(data);
  const [view, setView] = useState([
    <PermintaanPembelian
      onAdd={() => {
        setActive(1);
      }}
      onEdit={(e) => {
        setCurrentItem(e);
        setActive(1);
      }}
    />,
    <InputOrder
      onCancel={() => {
        setActive(0);
      }}
      onSubmit={() => {}}
      data={currentItem}
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
