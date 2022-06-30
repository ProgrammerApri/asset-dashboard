import React, { useState, useEffect, useRef } from "react";

import { request, endpoints } from "src/utils";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Alert } from "react-bootstrap";
import { Row, Col, Card } from "react-bootstrap";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";

const KlasifikasiAkun = () => {
  const [klasifikasi, setKlasifikasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [displayData, setDisplayData] = useState(false);
  const [position, setPosition] = useState("center");
  const [currentItem, setCurrentItem] = useState({ id: "", klasiname: "" });
  const toast = useRef(null);

  const dummy = Array.from({ length: 10 });

  const dialogFuncMap = {
    displayData: setDisplayData,
  };

  useEffect(() => {
    getKlasifikasi();
  }, []);

  const getKlasifikasi = async (isUpdate = false) => {
    setLoading(true);
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
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const editKlasifikasi = async () => {
    const config = {
      ...endpoints.editKlasi,
      endpoint: endpoints.editKlasi.endpoint + currentItem.id,
      data: {
        name: currentItem.klasiname,
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
          dialogFuncMap["displayData"](false);
          getKlasifikasi(true);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data berhasil diperbarui",
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
          detail: "Gagal memperbarui data",
          life: 3000,
        });
      }, 500);
    }
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
    setUpdate(true);
    editKlasifikasi();
  };

  const renderFooter = (kode) => {
    return (
      <div>
        <Button
          label="Batal"
          onClick={() => onHide(kode)}
          className="p-button-text btn-primary"
        />
        <Button
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
        <Col>
          <Card>
            {/* <Card.Header>
              <Card.Title>Klasifikasi Akun</Card.Title>
            </Card.Header> */}
            <Card.Body>
              <DataTable
                responsive
                value={loading ? dummy : klasifikasi}
                className="display w-100 datatable-wrapper"
                showGridlines
                rows={10}
                dataKey="id"
                rowHover
              >
                <Column
                  field="id"
                  header="Kode"
                  style={{
                    width: "10rem",
                  }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Nama Klasifikasi Akun"
                  field="klasiname"
                  style={{ minWidth: "25rem" }}
                  body={loading && <Skeleton />}
                />
                <Column
                  header="Action"
                  dataType="boolean"
                  bodyClassName="text-center"
                  style={{ minWidth: "2rem" }}
                  body={(e) => (loading ? <Skeleton /> : actionBodyTemplate(e))}
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
            <InputText
              value={currentItem.klasiname}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, klasiname: e.target.value })
              }
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default KlasifikasiAkun;
