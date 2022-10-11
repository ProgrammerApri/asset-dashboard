import React, { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { Row, Col, Card } from "react-bootstrap";
import Pengguna from "./Pengguna";
import InputPengguna from "./InputPengguna";

const SetupPenggunaa = ({ trigger }) => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    if (trigger !== 0) {
      setActive(0);
    }
  }, [trigger]);

  const [view, setView] = useState([
    <Pengguna onAdd={() => setActive(1)} />,
    <InputPengguna onCancel={() => setActive(0)}/>,
  ]);

  return (
    <>
      <Toast ref={toast} />
      {view[active]}
    </>
  );
};

export default SetupPenggunaa;
