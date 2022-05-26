import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import DataSalesOrder from "./DataSalesOrder";
import InputSO from "./InputSO";
import { Row, Col, Card } from "react-bootstrap";

const SalesOrder = () => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);
  const [view, setView] = useState([
    <DataSalesOrder
      onAdd={() => {
        setActive(1);
      }}
      onEdit={() => {
        setActive(1);
      }}
    />,
    <InputSO
      onCancel={() => setActive(0)}
      onSubmit={() => {}}
      onSuccess={() => {
        setTimeout(() => {
          setActive(0);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Diperbarui",
            life: 3000,
          });
        }, 500);
      }}
    />,
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

export default SalesOrder;
