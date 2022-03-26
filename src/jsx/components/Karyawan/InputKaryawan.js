import React, { useState, Fragment, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import {
  SplitButton,
  ButtonGroup,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";

const InputKaryawan = () => {
  const [selectJabatan, setJabatan] = useState(null);
  const jabatan = [
    { name: "Manager" },
    { name: "HRD" },
    { name: "Marketing" },
    { name: "Accounting" },
  ];

  const gender = [
    { name: "Male", code: "ML" },
    { name: "Female", code: "FML" },
  ];

  const Jabatan = (e) => {
    setJabatan(e.value);
  };

  const [date2, setDate2] = useState(null);
  const [gender1, setGen] = useState(null);

  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>Tambah Data Karyawan</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="basic-form">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <div className="form-row">
                      <div className="col-6 md:col-4">
                        <div className="p-inputgroup">
                          <span className="p-inputgroup-addon">
                            <i className="pi pi-id-card"></i>
                          </span>
                          <InputText placeholder="ID Karyawan" />
                        </div>
                      </div>

                      <div className="col-6 md:col-4">
                        <div className="p-inputgroup">
                          <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                          </span>
                          <InputText placeholder="Full Name" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="form-row">
                    <div className="col-6 md:col-4">
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon">
                        <i className="pi pi-user"></i>
                      </span>
                      <Dropdown
                            className="col-12 md:col-6"
                            inputId="dropdown"
                            value={selectJabatan}
                            options={jabatan}
                            onChange={(e) => setJabatan(e.value)}
                            optionLabel="name"
                          />
                    </div>
                  </div>

                      <div className="field col-6">
                        <div className="field-radiobutton">
                          <RadioButton
                            inputId="gender1"
                            name="gender"
                            value="Male"
                            onChange={(e) => setGen(e.value)}
                            checked={gender === "Male"}
                          />
                          <label className="col-2" htmlFor="gender">
                            Male
                          </label>
                          <RadioButton
                            className="marginRight"
                            inputId="gender1"
                            name="gender"
                            value="Male"
                            onChange={(e) => setGen(e.value)}
                            checked={gender === "Female"}
                          />
                          <label className="col-2" htmlFor="gender">
                            Female
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="form-row">
                      <div className="col-6 md:col-4">
                        <div className="p-inputgroup">
                          <span className="p-inputgroup-addon">
                            <i className="pi pi-phone"></i>
                          </span>
                          <InputText placeholder="Mobile" />
                        </div>
                      </div>
                      <div className="col-6 md:col-4">
                        <div className="p-inputgroup">
                          <span className="p-inputgroup-addon">
                            <i className="pi pi-id-card"></i>
                          </span>
                          <InputText placeholder="Email" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="primary">Simpan</Button>
                </form>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default InputKaryawan;
