import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Toast } from "primereact/toast";
import { tr } from "src/data/tr";
import RecordActivityData from "./RecordActivityData";
import InputRA from "./InputRA";

const data = {
  id: null,
  ra_code: null,
  ra_date: null,
  ra_dep: null,
  ra_ket: null,
  ra_cus: null,
  status: null,
  apprv_status: null,
  apprv_text: null,
  apprv_1: null,
  apprv_2: null,
  apprv_3: null,
  apprv1_time: null,
  apprv2_time: null,
  apprv3_time: null,
  reject: null,
  reject_time: null,
  reason: null,
  product: []
};

const RecordActivity = ({ trigger }) => {
  const [active, setActive] = useState(0);
  const [current, updateCurrent] = useState(data);
  const toast = useRef(null);

  useEffect(() => {
    if (trigger !== 0) {
      setActive(0);
    }
  }, [trigger]);

  const [view, setView] = useState([
    <RecordActivityData
      onAdd={() => {
        setActive(1);
      }}
      onEdit={(e) => {
        // updateCurrent(e);
        setActive(1);
      }}
    />,
    <InputRA
      onCancel={() => {
        setActive(0);
      }}
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
      onFail={() => {
        setTimeout(() => {
          toast.current.show({
            severity: "error",
            summary: tr[localStorage.getItem("language")].gagal,
            detail: tr[localStorage.getItem("language")].pesan_gagal,
            life: 3000,
          });
        }, 500);
      }}
      onFailAdd={(error, code) => {
        if (error.status === 400) {
          setTimeout(() => {
            toast.current.show({
              severity: "error",
              summary: tr[localStorage.getItem("language")].gagal,
              detail: `Kode ${code} Sudah Digunakan`,
              life: 3000,
            });
          }, 500);
        } else {
          setTimeout(() => {
            toast.current.show({
              severity: "error",
              summary: tr[localStorage.getItem("language")].gagal,
              detail: tr[localStorage.getItem("language")].pesan_gagal,
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

export default RecordActivity;
