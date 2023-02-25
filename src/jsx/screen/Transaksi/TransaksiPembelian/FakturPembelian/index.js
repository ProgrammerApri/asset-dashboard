import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Toast } from "primereact/toast";
import DataFaktur from "./DataFaktur";
import BuatFaktur from "./BuatFaktur";
import Detail from "./Detail";
import { tr } from "src/data/tr";
import DetailFaktur from "./DetailFaktur";

const FakturPembelian = ({trigger}) => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);
  
  useEffect(() => {
    if (trigger !== 0) {
      setActive(0);
    }
  }, [trigger]);

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
      onDetailF={() => {
        setActive(3);
      }}
    />,
    <BuatFaktur
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

    <Detail onCancel={() => setActive(0)} />,
    <DetailFaktur onCancel={() => setActive(0)} />,
  ]);

  return (
    <>
      <Toast ref={toast} />
      {view[active]}
    </>
  );
};

export default FakturPembelian;
