import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "react-bootstrap";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "@material-ui/core";

const data = {

};

const InputOrder = () => {
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [isEdit, setEdit] = useState(false);

  useEffect(() => {
  }, []);

 

  const editPermintaan = async () => {
    const config = {
      ...endpoints.editPermintaan,
      endpoint: endpoints.editPermintaan.endpoint + currentItem.id,
      data: {
        cus_code: currentItem.customer.cus_code,
       
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDisplayData(false);
          getPermintaan(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Diperbarui",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
          life: 3000,
        });
      }, 500);
    }
  };

  const addPermintaan = async () => {
    const config = {
      ...endpoints.addPermintaan,
      data: {
        cus_code: currentItem.customer.cus_code,
  
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          setDisplayData(false);
          getPermintaan(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Diperbarui",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: `Kode ${currentItem.customer.cus_code} Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Gagal Memperbarui Data",
            life: 3000,
          });
        }, 500);
      }
    }
  };


  const onClick = () => {
    setCurrentItem();
  };


  const renderFooter = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => setDisplayData(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Simpan"
          icon="pi pi-check"
          onClick={() => onSubmit()}
          autoFocus
          loading={update}
        />
      </div>
    );
  };


  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="pt-0">
          <Card>
            <Card.Body>
              
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </>
  );
};

export default InputOrder;
