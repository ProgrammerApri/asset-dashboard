import React, { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { Row, Col, Card } from "react-bootstrap";
// import ListX from "./ListX";
// import InputX from "./InputX";
import KoreksiPersediaanInput from "./KoreksiPersediianInput";
import KoreksiPersediaanList from "./KoreksiPersediaanList";
import { tr } from "src/data/tr";

const KoreksiStok = ({ trigger }) => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    if (trigger !== 0) {
      setActive(0);
    }
  }, [trigger]);
  
  const [view, setView] = useState([
    <KoreksiPersediaanList
      onAdd={() => {
        setActive(1);
      }}
    />,

    <KoreksiPersediaanInput
      onCancel={() => setActive(0)}
      onSuccess={() => {
        setTimeout(() => {
          setActive(0);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].pesan_berhasil,
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

export default KoreksiStok;
