import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Toast } from "primereact/toast";
import DataMesin from "./DataMesin";
import InputMesin from "./InputMesin";

const data = {
  id: 1,
  code: "",
  name: "",
  desc: "",
};

const Mesin = ({ trigger }) => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    if (trigger !== 0) {
      setActive(0);
    }
  }, [trigger]);

  const [view, setView] = useState([
    <DataMesin
      onAdd={() => {
        setActive(1);
      }}
      onEdit={() => {
        setActive(1);
      }}
      onDetail={() => {
        setActive(2);
      }}
    />,
    <InputMesin
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
    // <Detail onCancel={() => setActive(0)} />,
  ]);

  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <DataMesin />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Mesin;
