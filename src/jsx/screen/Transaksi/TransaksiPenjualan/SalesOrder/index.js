import React, { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import DataSalesOrder from "./DataSalesOrder";
import InputSO from "./InputSO";
import { Row, Col, Card } from "react-bootstrap";
import Detail from "./Detail";
import { set } from "date-fns";
import { tr } from "src/data/tr";

const SalesOrder = ({ trigger }) => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    if (trigger !== 0) {
      setActive(0);
    }
  }, [trigger]);
  
  const [view, setView] = useState([
    <DataSalesOrder
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
    <InputSO
      onCancel={() => setActive(0)}
      onSubmit={() => {}}
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
    <Detail onCancel={() => setActive(0)} />,
  ]);

  return (
    <>
      <Toast ref={toast} />
      {view[active]}
    </>
  );
};

export default SalesOrder;
