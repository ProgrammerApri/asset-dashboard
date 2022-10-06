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
    <InputPengguna
      onAdd={() => {
        setActive(1);
      }}
      onEdit={() => {
        setActive(1);
      }}
      // onDetail={() => {
      //   setActive(2);
      // }}
    />,

    // <InputPengguna
    //   onCancel={() => setActive(0)}
    //   onSuccess={() => {
    //     setTimeout(() => {
    //       setActive(0);
    //       toast.current.show({
    //         severity: "info",
    //         summary: "Berhasil",
    //         detail: "Data Berhasil Diperbarui",
    //         life: 3000,
    //       });
    //     }, 500);
    //   }}
    // />,
    // <DetailKasBank onCancel={() => setActive(0)} />,
  ]);

  return (
    <>
      <Toast ref={toast} />
      {view[active]}
    </>
  );
};

export default SetupPenggunaa;
