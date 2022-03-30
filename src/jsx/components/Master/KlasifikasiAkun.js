import React, { useState, useEffect } from "react";

import { request, endpoints } from "src/utils";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

// import data from "../../../constants/data";
import { Row, Col, Card } from "react-bootstrap";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

const KlasifikasiAkun = () => {
  const [klasifikasi, setKlasifikasi] = useState(null);

  const [displayData, setDisplayData] = useState(false);
  const [position, setPosition] = useState("center");
  const [currentItem, setCurrentItem] = useState({id:"", klasiname:""});

  const dialogFuncMap = {
    displayData: setDisplayData,
  };

  useEffect(() => {
    getKlasifikasi();
  }, []);

  const getKlasifikasi = async () => {
    const config = {
      ...endpoints.klasifikasi,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        setKlasifikasi(data);
      }
    } catch (error) {}
  };

  const actionBodyTemplate = (data) => {
    return (
      // <React.Fragment>
      <div className="d-flex">
        <Link
          onClick={() => onClick("displayData", data)}
          className="btn btn-primary shadow btn-xs sharp ml-2"
        >
          <i className="fa fa-pencil"></i>
        </Link>
      </div>
      // </React.Fragment>
    );
  };

  const onClick = (kode, klasifikasi) => {
    dialogFuncMap[`${kode}`](true);
    setCurrentItem(klasifikasi);
    console.log(klasifikasi);
    if (position) {
      setPosition(position);
    }
  };

  const onHide = (kode) => {
    dialogFuncMap[`${kode}`](false);
  };

  const onSubmit = () => {
    console.log(currentItem.klasiname);
  }

  const renderFooter = (kode) => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => onHide(kode)}
          className="p-button-text btn-primary"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => onSubmit()}
          autoFocus
        />
      </div>
    );
  };
  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>Klasifikasi Akun</Card.Title>
            </Card.Header>
            <Card.Body>
              <DataTable
                responsive
                value={klasifikasi}
                className="display w-100 datatable-wrapper"
                showGridlines
                rows={10}
                dataKey="id"
                globalFilterFields={["kode", "nama"]}
              >
                <Column field="id" header="Kode" style={{ minWidth: "6rem" }} />
                <Column
                  header="Nama Klasifikasi Akun"
                  field="klasiname"
                  style={{ minWidth: "12rem" }}
                />
                <Column
                  header="Action"
                  dataType="boolean"
                  bodyClassName="text-center"
                  style={{ minWidth: "2rem" }}
                  body={(e) => actionBodyTemplate(e)}
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Dialog
        header="Edit Klasifikasi Akun"
        visible={displayData}
        style={{ width: "40vw" }}
        footer={renderFooter("displayData")}
        onHide={() => onHide("displayData")}
      >
        <div className="col-12 mb-2">
          <label className="text-label">Kode Klasifikasi</label>
          <div className="p-inputgroup">
            <InputText value={`${currentItem.id}`} disabled />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Nama Klasifikasi</label>
          <div className="p-inputgroup">
            <InputText value={currentItem.klasiname} onChange={(e) => setCurrentItem({...currentItem, klasiname:e.target.value})}/>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default KlasifikasiAkun;
