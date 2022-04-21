import React, { useEffect, useState } from "react";
import { Card, Row, Col, Accordion } from "react-bootstrap";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button as PButton } from "primereact/button";
import { endpoints, request } from "src/utils";

const SetupAkun = () => {
  const [template, setTemplate] = useState(true);
  const [account, setAccount] = useState(null);
  const [accor, setAccor] = useState({
    penjualan: true,
    pembelian: true,
    ar_ap: true,
    persediaan: false,
    lainnya: false,
    labarugi: true,
  });

  useEffect(() => {
    getAccount();
  }, []);

  const getAccount = async () => {
    const config = {
      ...endpoints.account,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        setAccount(data);
      }
    } catch (error) {}
  };

  const renderAccountDropdown = (label, value, onChange, expanded = false) => {
    return (
      <div className={`${expanded ? "col-12" : "col-6"} mb-2`}>
        <label className="text-label">{label}</label>
        <div className="p-inputgroup">
          <Dropdown
            value={value}
            options={account && account}
            onChange={onChange}
            optionLabel="acc_name"
            filter
            filterBy="account.acc_name"
            placeholder="Pilih Akun"
            itemTemplate={(option) => (
              <div>
                {option !== null
                  ? `(${option.account.acc_code}) - ${option.account.acc_name}`
                  : ""}
              </div>
            )}
          />
        </div>
      </div>
    );
  };

  const renderOthers = () => {
    return (
      <Accordion className="acordion" defaultActiveKey="1">
        <div className="accordion__item" key={1}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${accor.lainnya ? "collapsed" : ""}`}
            onClick={() => {
              setAccor({
                ...accor,
                lainnya: !accor.lainnya,
              });
            }}
          >
            <span className="accordion__header--text">Aset</span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Row className="mr-0 ml-0">
                {renderAccountDropdown(
                  "Aset Tetap",
                  null,
                  (e) => {
                    console.log(e.value);
                  },
                  true
                )}
              </Row>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };

  const renderPenjualan = () => {
    return (
      <Accordion className="accordion " defaultActiveKey="0">
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">Penjualan</span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Row className="mr-0 ml-0">
                {renderAccountDropdown("Pendapatan Penjualan", null, (e) => {
                  console.log(e.value);
                })}

                {renderAccountDropdown("Pembayaran Dimuka", null, (e) => {
                  console.log(e.value);
                })}

                {renderAccountDropdown("Diskon Penjualan", null, (e) => {
                  console.log(e.value);
                })}

                {renderAccountDropdown("Penjualan Belum Ditagih", null, (e) => {
                  console.log(e.value);
                })}

                {renderAccountDropdown("Retur Penjualan", null, (e) => {
                  console.log(e.value);
                })}

                {renderAccountDropdown("Piutang Belum Ditagih", null, (e) => {
                  console.log(e.value);
                })}

                {renderAccountDropdown("Pengiriman Penjualan", null, (e) => {
                  console.log(e.value);
                })}

                {renderAccountDropdown("Hutang Pajak Penjualan", null, (e) => {
                  console.log(e.value);
                })}
              </Row>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };

  const renderPembelian = () => {
    return (
      <Accordion className="accordion " defaultActiveKey="0">
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.pembelian ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                pembelian: !accor.pembelian,
              });
            }}
          >
            <span className="accordion__header--text">Pembelian</span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Row className="mr-0 ml-0">
                <div className="col-6 mb-2">
                  <label className="text-label">Pembelian (COGS)</label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={null}
                      options={account && account}
                      onChange={(e) => {
                        console.log(e.value);
                      }}
                      optionLabel="acc_name"
                      filter
                      filterBy="acc_name"
                      placeholder="Pilih Akun"
                      itemTemplate={(option) => (
                        <div>
                          {option !== null
                            ? `(${option.account.acc_code}) - ${option.account.acc_name}`
                            : ""}
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="col-6 mb-2">
                  <label className="text-label">Hutang Belum Ditagih</label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={null}
                      options={account && account}
                      onChange={(e) => {
                        console.log(e.value);
                      }}
                      optionLabel="acc_name"
                      filter
                      filterBy="acc_name"
                      placeholder="Pilih Akun"
                      itemTemplate={(option) => (
                        <div>
                          {option !== null
                            ? `(${option.account.acc_code}) - ${option.account.acc_name}`
                            : ""}
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="col-6 mb-2">
                  <label className="text-label">Pengiriman Pembelian</label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={null}
                      options={account && account}
                      onChange={(e) => {
                        console.log(e.value);
                      }}
                      optionLabel="acc_name"
                      filter
                      filterBy="acc_name"
                      placeholder="Pilih Akun"
                      itemTemplate={(option) => (
                        <div>
                          {option !== null
                            ? `(${option.account.acc_code}) - ${option.account.acc_name}`
                            : ""}
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="col-6 mb-2">
                  <label className="text-label">Pajak Pembelian</label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={null}
                      options={account && account}
                      onChange={(e) => {
                        console.log(e.value);
                      }}
                      optionLabel="acc_name"
                      filter
                      filterBy="acc_name"
                      placeholder="Pilih Akun"
                      itemTemplate={(option) => (
                        <div>
                          {option !== null
                            ? `(${option.account.acc_code}) - ${option.account.acc_name}`
                            : ""}
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="col-6 mb-2">
                  <label className="text-label">Uang Muka Pembelian</label>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={null}
                      options={account && account}
                      onChange={(e) => {
                        console.log(e.value);
                      }}
                      optionLabel="acc_name"
                      filter
                      filterBy="acc_name"
                      placeholder="Pilih Akun"
                      itemTemplate={(option) => (
                        <div>
                          {option !== null
                            ? `(${option.account.acc_code}) - ${option.account.acc_name}`
                            : ""}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </Row>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };

  const renderArAp = () => {
    return (
      <Accordion className="accordion " defaultActiveKey="0">
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${accor.ar_ap ? "collapsed" : ""}`}
            onClick={() => {
              setAccor({
                ...accor,
                ar_ap: !accor.ar_ap,
              });
            }}
          >
            <span className="accordion__header--text">AR/AP</span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Row className="mr-0 ml-0">
                {renderAccountDropdown("Piutang Usaha", null, (e) => {
                  console.log(e.value);
                })}

                {renderAccountDropdown("Hutang Usaha", null, (e) => {
                  console.log(e.value);
                })}
              </Row>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };

  const renderPersediaan = () => {
    return (
      <Accordion className="accordion " defaultActiveKey="1">
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.persediaan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                persediaan: !accor.persediaan,
              });
            }}
          >
            <span className="accordion__header--text">Persediaan</span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Row className="mr-0 ml-0">
                {renderAccountDropdown("Persediaan", null, (e) => {
                  console.log(e.value);
                })}

                {renderAccountDropdown("Persediaan Rusak", null, (e) => {
                  console.log(e.value);
                })}

                {renderAccountDropdown("Persediaan Umum", null, (e) => {
                  console.log(e.value);
                })}

                {renderAccountDropdown("Persediaan Produksi", null, (e) => {
                  console.log(e.value);
                })}
              </Row>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };

  const renderLabaRugi = () => {
    return (
      <Accordion className="accordion " defaultActiveKey="0">
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${accor.labarugi ? "collapsed" : ""}`}
            onClick={() => {
              setAccor({
                ...accor,
                labarugi: !accor.labarugi,
              });
            }}
          >
            <span className="accordion__header--text">Laba Rugi</span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Row className="mr-0 ml-0">
                {renderAccountDropdown("Laba Rugi Berjalan", null, (e) => {
                  console.log(e.value);
                })}

                {renderAccountDropdown(
                  "Laba Rugi Tahun Berjalan",
                  null,
                  (e) => {
                    console.log(e.value);
                  }
                )}

                {renderAccountDropdown("Laba Rugi Ditahan", null, (e) => {
                  console.log(e.value);
                })}
              </Row>
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
          {renderArAp()} {renderPenjualan()} {renderPersediaan()}
        </Col>

        <Col className="col-lg-6 col-sm-12 col-xs-12">
            {renderLabaRugi()}
          {renderPembelian()}
          {renderOthers()}
        </Col>
      </Row>
    </>
  );
};

export default SetupAkun;
