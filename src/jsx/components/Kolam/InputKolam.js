import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
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
    { value: "block-a6", label: "Block A(6)" },
    { value: "block-b6", label: "Block B(6)" },
    { value: "block-c6", label: "Block C(6)" },
    { value: "block-a7", label: "Block A(7)" },
    { value: "block-b7", label: "Block B(7)" },
    { value: "block-c7", label: "Block C(7)" },
 ];
 const options1 = [
    { value: "", label: "" },
    { value: "", label: "" },
 ];
 const options2 = [
    { value: "", label: "" },
    { value: "", label: "" },
 ];

const InputKolam = () => {
    const [selectedOption, setSelectedOption] = useState(null);
  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>Tambah Data Kolam</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="basic-form">
                <form onSubmit={(e) => e.preventDefault()}>
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
                                placeholder="Block"
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
                        <input
                          type="calender"
                          className="form-control"
                          placeholder="Joining Date"
                        />
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

export default InputKolam;
