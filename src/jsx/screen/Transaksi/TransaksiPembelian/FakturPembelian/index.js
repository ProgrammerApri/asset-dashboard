import React, { useState, useRef } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Toast } from "primereact/toast";
import DataFaktur from "./DataFaktur";
import BuatFaktur from "./BuatFaktur";
import Detail from "./Detail";

const FakturPembelian = () => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);
  const [view, setView] = useState([
    <DataFaktur
      onAdd={() => {
        setActive(1);
      }}
      // onEdit={() => {
      //   setActive(1);
      // }}
      onDetail={() => {
        setActive(2);
      }}
    />,
    <BuatFaktur
      onCancel={() => setActive(0)}
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

    <Detail
      onCancel={() => setActive(0)}
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

export default FakturPembelian;
