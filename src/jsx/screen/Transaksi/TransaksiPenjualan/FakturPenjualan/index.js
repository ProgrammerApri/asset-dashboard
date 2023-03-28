import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Toast } from "primereact/toast";
import Detail from "./Detail";
import { tr } from "../../../../../data/tr";
import DataFakturPJ from "./DataFakturPJ";
import BuatFakturPJ from "./BuatFakturPJ";
import DetailFaktur from "./DetailFaktur";

const FakturPenjualan = ({trigger}) => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);
  
  useEffect(() => {
    if (trigger !== 0) {
      setActive(0);
    }
  }, [trigger]);

  const [view, setView] = useState([
    <DataFakturPJ
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
    <BuatFakturPJ
      onCancel={() => setActive(0)}
      onSuccess={() => {
        setTimeout(() => {
          setActive(0);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhasl,
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

export default FakturPenjualan;