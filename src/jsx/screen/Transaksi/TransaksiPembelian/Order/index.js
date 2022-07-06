import React, { useState, useRef } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Toast } from "primereact/toast";
import DataOrder from "./DataOrder";
import InputOrder from "./InputOrder";
import Detail from "./Detail";

const Order = () => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);
  const [view, setView] = useState([
    <DataOrder
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
    <InputOrder
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
    <Detail onCancel={() => setActive(0)} />,
  ]);

  return (
    <>
      <Toast ref={toast} />
      {view[active]}
    </>
  );
};

export default Order;
