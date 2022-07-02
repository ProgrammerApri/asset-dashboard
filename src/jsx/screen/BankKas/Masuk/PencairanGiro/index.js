import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Row, Col, Card } from "react-bootstrap";
import PencairanGiroMundurList from "./PencairanGiroList";
import PencairanGiroMundurInput from "./PencairanGiroInput";
import PencairanGiroInList from "./PencairanGiroList";
import PencairanGiroInInput from "./PencairanGiroInput";



const PencairanGiroMasuk = () => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);
  const [view, setView] = useState([
    <PencairanGiroInList
      onAdd={() => {
        setActive(1);
      }}
    />,
    
    <PencairanGiroInInput
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

export default PencairanGiroMasuk;
