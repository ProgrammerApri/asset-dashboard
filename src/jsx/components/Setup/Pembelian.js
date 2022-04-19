import React, { useState } from "react";
import { Card, Row, Col, Accordion } from "react-bootstrap";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button as PButton } from "primereact/button";

const Pembelian = () => {
  const [template, setTemplate] = useState(true);
  const [accor, setAccor] = useState({
    main: true,
  });
  const [setting, setSetting] = useState({
    rp: false,
    over: false,
  });


  const renderSettings = () => {
    return (
      <Accordion className="acordion" defaultActiveKey="0">
        <div className="accordion__item" key={1}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${accor.main ? "collapsed" : ""}`}
            onClick={() => {
              setAccor({
                ...accor,
                main: !accor.main,
              });
            }}
          >
            <span className="accordion__header--text">
              Pengaturan Pembelian
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <div className="d-flex col-12 align-items-center">
                <InputSwitch
                  className="mr-3"
                  inputId="email"
                  checked={setting.rp}
                  onChange={(e) =>
                    setSetting({ ...setting, rp: e.value })
                  }
                />
                <label className="mr-3 mt-1" htmlFor="email">
                  {"Aktifkan fitur RP (Request Purchase"}
                </label>
              </div>

              <div className="d-flex col-12 align-items-center">
                <InputSwitch
                  className="mr-3"
                  inputId="email"
                  checked={setting.over}
                  onChange={(e) =>
                    setSetting({ ...setting, over: e.value })
                  }
                />
                <label className="mr-3 mt-1" htmlFor="email">
                  {"Pembelian barang boleh melebihi PO"}
                </label>
              </div>

            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };

  return (
    <>
      <Row>
        <Col className="col-lg-12 col-sm-12 col-xs-12">
          {renderSettings()}
        </Col>
      </Row>
    </>
  );
};

export default Pembelian;
