import React, { useState, useRef } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Toast } from "primereact/toast";
import InputPO from "./InputPO";
import PesananPO from "./PesananPembelian";

const PermintaanPO = () => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);
  const [view, setView] = useState([
    <PesananPO
      onAdd={() => {
        setActive(1);
      }}
    />,
    <InputPO
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

export default PermintaanPO;
