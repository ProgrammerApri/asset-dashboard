import React, { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { Row, Col, Card } from "react-bootstrap";
import Pengguna from "./Pengguna";
import InputPengguna from "./InputPengguna";
import { tr } from "src/data/tr";

const SetupPenggunaa = ({ trigger }) => {
  const [active, setActive] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    if (trigger !== 0) {
      setActive(0);
    }
  }, [trigger]);

  const [view, setView] = useState([
    <Pengguna
      onAdd={() => {
        setActive(1);
      }}
      onEdit={(e) => {
        setActive(1);
      }}
    />,
    <InputPengguna
      onCancel={() => {
        setActive(0);
      }}
      onSuccess={() => {
        setTimeout(()=>{
          setActive(0);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].pesan_berhasil,
            life: 3000,
          });
        },500);
      }}
      onFail={() => {
        setTimeout(() => {
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Gagal Memperbarui Data",
            life: 3000,
          });
        }, 500);
      }}
      onFailAdd={(error, code) => {
        if (error.status === 400) {
          setTimeout(() => {
            toast.current.show({
              severity: "error",
              summary: "Gagal",
              detail: `Kode ${code} Sudah Digunakan`,
              life: 3000,
            });
          }, 500);
        } else {
          setTimeout(() => {
            toast.current.show({
              severity: "error",
              summary: "Gagal",
              detail: "Gagal Memperbarui Data",
              life: 3000,
            });
          }, 500);
        }
      }}
    />,
  ]);

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="pt-0"></Col>
      </Row>
      {view[active]}
    </>
  );
};

export default SetupPenggunaa;
