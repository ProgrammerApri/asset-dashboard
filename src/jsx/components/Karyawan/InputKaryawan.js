import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { DatePicker } from "@y0c/react-datepicker";
import {
  SplitButton,
  ButtonGroup,
  Dropdown,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";

const options = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
 ];
 const options1 = [
    { value: "", label: "" },
    { value: "", label: "" },
 ];
 const options2 = [
    { value: "", label: "" },
    { value: "", label: "" },
 ];

const InputKaryawan = () => {
    const [selectedOption, setSelectedOption] = useState(null);
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
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Name"
                        />
                      </div>

                      <div className="col-sm-6">
                      <Select
                            defaultValue={selectedOption}
                            onChange={setSelectedOption}
                            options={options2}
                            style={{
                                lineHeight: "100px",
                                color: "#7e7e7e",
                                paddingLeft: " 15px",
                                }}
                                placeholder="Position"
                        />
                      </div>
                      </div>
                  </div>

                  <div className="form-group">
                      <div className="form-row">
                      <div className="col-sm-6">
                      <Select
                            defaultValue={selectedOption}
                            onChange={setSelectedOption}
                            options={options}
                            style={{
                                lineHeight: "100px",
                                color: "#7e7e7e",
                                paddingLeft: " 15px",
                                }}
                                placeholder="Gender"
                        />
                      </div>

                      <div className="col-sm-6">
                      <Select
                            defaultValue={selectedOption}
                            onChange={setSelectedOption}
                            options={options1}
                            style={{
                                lineHeight: "100px",
                                color: "#7e7e7e",
                                paddingLeft: " 15px",
                                }}
                                placeholder="Type"
                        />
                      </div>
                      </div>
                  </div>

                  <div className="form-group">
                    <div className="form-row">
                      <div className="col-sm-6">
                        <input
                          type="op"
                          className="form-control"
                          placeholder="Mobile"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="form-row">
                      <div className="col-sm-6">
                        <p className="mb-1">Date Joining</p>
                         <DatePicker />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Action"
                        />
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
