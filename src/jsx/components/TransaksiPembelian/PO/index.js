import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import InputPO from "./InputPO";
import PesananPO from "./PesananPembelian";

const PermintaanPO = () => {
  const [active, setActive] = useState(0);
  const [view, setView] = useState([
    <PesananPO
      onAdd={() => {
        setActive(1);
      }}
    />,
    <InputPO onCancel={() => setActive(0)} onSubmit={() => {}} />,
  ]);

  return (
    view[active]
  );
};

export default PermintaanPO;
