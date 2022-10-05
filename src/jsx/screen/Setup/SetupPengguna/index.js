import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import PermintaanPembelian from "./PermintaanPembelian";
import InputOrder from "./InputOrder";
import { Toast } from "primereact/toast";
import InputPengguna from "src/jsx/screen/Setup/InputPengguna";
import Pengguna from "./Pengguna";

const data = {
  id: null,
  req_code: null,
  req_date: null,
  req_dep: null,
  req_ket: null,
  refrence: false,
  ref_sup: null,
  ref_ket: null,
};

const SetupPengguna = ({trigger}) => {
  const [active, setActive] = useState(0);
  const [current, updateCurrent] = useState(data);
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
        // updateCurrent(e);
        setActive(1);
      }}
    />,
    <InputPengguna
      onCancel={() => {
        setActive(0);
      }}
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
        <Col className="pt-0">
          <Card>
            <Card.Body>{view[active]}</Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SetupPengguna;
