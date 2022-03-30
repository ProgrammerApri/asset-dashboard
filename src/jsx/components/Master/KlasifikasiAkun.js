import React, { useState, useEffect } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import data from "../../../constants/data";
import { Row, Col, Card } from "react-bootstrap";
import { Button } from 'primereact/button';
import { Link } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

const KlasifikasiAkun = () => {
   const [klasifikasi, setKlasifikasi] = useState(null);
  //  const [ setData ] = useState();
  //  const [dataDialog, setDataDialog] = useState(false);
   const [displayData, setDisplayData] = useState(false);
   const [position, setPosition] = useState('center');

   const dialogFuncMap = {
    'displayData': setDisplayData,
}
   

   useEffect(() => {
    console.log(data.data);
    setKlasifikasi(getKlasifikasi(data.data)); }, []);

  const getKlasifikasi = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);
      return d;
    });
  };

  const actionBodyTemplate = () => {
    return (
      // <React.Fragment>
      <div className="d-flex">
         <Link onClick={() => onClick('displayData')} className="btn btn-primary shadow btn-xs sharp ml-2">
          <i className="fa fa-pencil"></i>
        </Link>
        </div>
      // </React.Fragment>
  );
  };

//   const editData = (klasifikasi) => {
//     setKlasifikasi({...klasifikasi});
//     setDataDialog(true);
// }

const onClick = (kode, klasifikasi) => {
  dialogFuncMap[`${kode}`](true);

  if (position) {
      setPosition(position);
  }
}

const onHide = (kode) => {
  dialogFuncMap[`${kode}`](false);
}

const renderFooter = (kode) => {
  return (
      <div>
          <Button label="No" icon="pi pi-times" onClick={() => onHide(kode)} className="p-button-text btn-primary" />
          <Button label="Yes" icon="pi pi-check" onClick={() => onHide(kode)} autoFocus />
      </div>
  );
}
 return (
        <>
        <Row>
            <Col>
            <Card>
            <Card.Header>
              <Card.Title>Klasifikasi Akun</Card.Title>
            </Card.Header>
            <Card.Body>
              <DataTable responsive
                value={klasifikasi}
                paginator
                className="display w-100 datatable-wrapper"
                showGridlines
                rows={10} 
                dataKey="kode"
                globalFilterFields={[
                  "kode",
                  "nama",
                ]}
              >
                <Column
                  field="kode"
                  header="Kode"
                  style={{ minWidth: "6rem" }}
                />
                <Column
                  header="Nama Klasifikasi Akun"
                  field="nama"
                  style={{ minWidth: "12rem" }}

                />
                 <Column
                header="Action"
                dataType="boolean"
                bodyClassName="text-center"
                style={{ minWidth: "2rem" }}
                body={actionBodyTemplate}
              />
              </DataTable>
            </Card.Body>
          </Card>
            </Col>
          </Row>
          <Dialog header="Edit Klasifikasi Akun" visible={displayData} style={{ width: '40vw' }} footer={renderFooter('displayData')} onHide={() => onHide('displayData')}>
          <div className="col-12 mb-2">
              <label className="text-label">Kode Klasifikasi</label>
              <div className="p-inputgroup">
                   <InputText disabled/>
              </div>
            </div>

            <div className="col-12 mb-2">
              <label className="text-label">Nama Klasifikasi</label>
              <div className="p-inputgroup">
                   <InputText/>
              </div>
            </div>
      </Dialog>
        </>
      );

  
};

export default KlasifikasiAkun;