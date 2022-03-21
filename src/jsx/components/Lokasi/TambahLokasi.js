import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  SplitButton,
  ButtonGroup,
  Dropdown,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";

const TambahLokasi = () => {
  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>Tambah Lokasi Tambak</Card.Title>
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
                          placeholder="Penanggungjawab"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Penanggungjawab"
                        />
                      </div>
                      </div>
                  </div>

                  <div className="form-group">
                    <div className="form-row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Penanggungjawab"
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Penanggungjawab"
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

export default TambahLokasi;
