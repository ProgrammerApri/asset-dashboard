import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Toast } from "primereact/toast";
// import Detail from "./Detail";
import Detail from "./Detail";
import DataUsageMaterial from "./DataUsageMaterial";
import InputUsageMaterial from "./InputUsageMaterial";

const UsageMaterial = ({ trigger }) => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    if (trigger !== 0) {
      setActive(0);
    }
  }, [trigger]);

  const [view, setView] = useState([
    <DataUsageMaterial
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
    <InputUsageMaterial
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

export default UsageMaterial;
