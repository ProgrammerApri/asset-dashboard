import React, { useState } from "react";
import { Card, Row, Col, Accordion } from "react-bootstrap";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button as PButton } from "primereact/button";

const Penjualan = () => {
  const [template, setTemplate] = useState(true);
  const [accor, setAccor] = useState({
    main: true,
    template: true,
    setting: false,
  });
  const [setting, setSetting] = useState({
    over_stock: false,
    discount: false,
    tiered: false,
  });

  const renderTemplate = () => {
    return (
      <Accordion className="accordion" defaultActiveKey="0">
        <div className="accordion__item" key={2}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${accor.template ? "collapsed" : ""}`}
            onClick={() => {
              setAccor({
                ...accor,
                template: !accor.template,
              });
            }}
          >
            <span className="accordion__header--icon"></span>
            <span className="accordion__header--text">
              Template Email Tagihan
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <div className="col-12 mb-2">
                <label className="text-label">Kirim Tagihan</label>
                <div className="p-inputgroup align-items-center">
                  <InputText value={""} onChange={(e) => {}} />
                  <span className="mr-3 ml-3">Hari</span>
                  <Dropdown
                    value={{ label: "Sebelum" }}
                    options={[{ label: "Sebelum" }, { label: "Sesudah" }]}
                    onChange={(e) => {}}
                    optionLabel="label"
                    placeholder="Sebelum"
                  />
                  <span className="mr-3 ml-3">Jatuh Tempo</span>
                </div>
              </div>

              <div className="col-12 mb-2">
                <label className="text-label">Template</label>
                <div className="p-inputgroup">
                  <InputText
                    value={"[Nama Perusahaan]- Transaksi [Nomor Transaksi]"}
                    onChange={(e) => {}}
                  />
                </div>
              </div>

              <div className="col-12 mb-2">
                <div className="p-inputgroup">
                  <InputTextarea
                    style={{ height: "14rem" }}
                    value={"Kepada Yth. [Nama Pelanggan],"}
                    onChange={(e) => {}}
                  />
                </div>
              </div>

              <div className="col-12 mb-2">
                <div className="row ml-0 mr-0 p-inputgroup">
                  <PButton
                    label="[Nama Perusahaan]"
                    onClick={() => {}}
                    className="p-button-outlined mr-2 mt-2"
                  />
                  <PButton
                    label="[Nomor Transaksi]"
                    onClick={() => {}}
                    className="p-button-outlined mr-2 mt-2"
                  />
                  <PButton
                    label="[Nama Pelanggan]"
                    onClick={() => {}}
                    className="p-button-outlined mr-2 mt-2"
                  />
                  <PButton
                    label="[Tanggal Transaksi]"
                    onClick={() => {}}
                    className="p-button-outlined mr-2 mt-2"
                  />
                  <PButton
                    label="[Tanggal Jatuh Tempo]"
                    onClick={() => {}}
                    className="p-button-outlined mr-2 mt-2"
                  />
                </div>
              </div>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };

  const renderSettings = () => {
    return (
      <Accordion className="acordion" defaultActiveKey="1">
        <div className="accordion__item" key={1}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${accor.setting ? "collapsed" : ""}`}
            onClick={() => {
              setAccor({
                ...accor,
                setting: !accor.setting,
              });
            }}
          >
            <span className="accordion__header--text">
              Pengaturan Penjualan
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <div className="d-flex col-12 align-items-center">
                <InputSwitch
                  className="mr-3"
                  inputId="email"
                  checked={setting.over_stock}
                  onChange={(e) =>
                    setSetting({ ...setting, over_stock: e.value })
                  }
                />
                <label className="mr-3 mt-1" htmlFor="email">
                  {"Barang boleh melebihi stok sisa"}
                </label>
              </div>

              <div className="d-flex col-12 align-items-center">
                <InputSwitch
                  className="mr-3"
                  inputId="email"
                  checked={setting.discount}
                  onChange={(e) =>
                    setSetting({ ...setting, discount: e.value })
                  }
                />
                <label className="mr-3 mt-1" htmlFor="email">
                  {"Diskon"}
                </label>
              </div>

              <div className="d-flex col-12 align-items-center">
                <InputSwitch
                  className="mr-3"
                  inputId="email"
                  checked={setting.tiered}
                  onChange={(e) => setSetting({ ...setting, tiered: e.value })}
                />
                <label className="mt-1" htmlFor="email">
                  {"Diskon Bertingkat"}
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
        <Col className="col-lg-6 col-sm-12 col-xs-12">
          <Accordion className="accordion " defaultActiveKey="0">
            <div className="accordion__item" key={0}>
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
                  Pengingat Tagihan Faktur
                </span>
                <span className="accordion__header--indicator indicator_bordered"></span>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={"0"}>
                <div className="accordion__body--text">
                  <div className="d-flex col-12 align-items-center">
                    <label className="mr-3 mt-1" htmlFor="email">
                      {"Kirim Email Tagihan"}
                    </label>
                    <InputSwitch
                      inputId="email"
                      checked={template}
                      onChange={(e) => {
                        setTemplate(e.value);
                        setAccor({
                            ...accor,
                            template: e.value,
                            setting : !e.value
                          });
                      }}
                    />
                  </div>

                  <div className="col-12 mb-2">
                    <label className="text-label">Kirim Salinan (CC)</label>
                    <div className="p-inputgroup">
                      <InputText
                        value={""}
                        onChange={(e) => {}}
                        placeholder="Kirim Salinan"
                      />
                    </div>
                  </div>

                  <div className="col-12 mb-2">
                    <label className="text-label">Dispensasi</label>
                    <div className="p-inputgroup">
                      <InputText
                        value={""}
                        onChange={(e) => {}}
                        placeholder="Total Faktur Dibawah"
                      />
                    </div>
                  </div>
                </div>
              </Accordion.Collapse>
            </div>
          </Accordion>

          {template ? renderSettings() : <></>}
        </Col>

        <Col className="col-lg-6 col-sm-12 col-xs-12">
          {template ? renderTemplate() : renderSettings()}
        </Col>
      </Row>
    </>
  );
};

export default Penjualan;
