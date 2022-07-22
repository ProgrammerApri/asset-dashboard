import React, { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { Row, Col, Card } from "react-bootstrap";
import KasBankOutList from "./KasBankKeluarList";
import KasBankOutInput from "./KasBankKeluarInput";

const PelunasanHutang = ({ trigger }) => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    if (trigger !== 0) {
      setActive(0);
    }
  }, [trigger]);

  const [view, setView] = useState([
    <KasBankOutList
      onAdd={() => {
        setActive(1);
      }}
      onEdit={() => {
        setActive(1);
      }}
    />,

    <KasBankOutInput
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

export default PelunasanHutang;
