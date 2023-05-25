import React, { useState, useRef, useEffect } from "react";
import { Card, Row, Col, Accordion } from "react-bootstrap";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button as PButton } from "primereact/button";
import { endpoints, request } from "src/utils";
import { Toast } from "primereact/toast";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import { useDispatch, useSelector } from "react-redux";
import { SET_USER } from "src/redux/actions";

const data = {
  id: 0,
  cp_name: "",
  cp_addr: "",
  cp_ship_addr: "",
  cp_telp: "",
  cp_webs: "",
  cp_email: "",
  cp_npwp: "",
  cp_coper: "",
  cp_logo: "",
  multi_currency: false,
  appr_po: false,
  appr_payment: false,
  over_stock: false,
  discount: false,
  tiered: false,
  rp: false,
  over_po: false,
};

const Penjualan = () => {
  const toast = useRef(null);
  const [template, setTemplate] = useState(true);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accor, setAccor] = useState({
    main: true,
    template: true,
    so: true,
    sales: true,
    setting: false,
  });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    getCompany();
    getUser();
  }, []);

  const getUser = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.getUser,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        const { data } = response;
        dispatch({
          type: SET_USER,
          payload: data.filter((v) => v.previlage?.approver),
        });
        setLoading(false);
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

  const getCompany = async (needLoading = true) => {
    const config = endpoints.getCompany;
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        console.log(
          Object.keys(response.data).length === 0 &&
            response.data.constructor === Object
        );
        if (
          Object.keys(response.data).length === 0 &&
          response.data.constructor === Object
        ) {
          setCurrentData(data);
        } else {
          setCurrentData(response.data);
        }
      }
    } catch (error) {}
  };

  const postCompany = async (logo, isUpdate = false, data) => {
    let config = {};
    if (isUpdate) {
      if (data) {
        config = {
          ...endpoints.updateCompany,
          endpoint: endpoints.updateCompany.endpoint + currentData.id,
          data: data,
        };
      } else {
        config = {
          ...endpoints.updateCompany,
          endpoint: endpoints.updateCompany.endpoint + currentData.id,
          data: {
            ...currentData,
            cp_logo: logo !== "" ? logo : currentData.cp_logo,
          },
        };
      }
    } else {
      if (data) {
        config = {
          ...endpoints.addCompany,
          data: data,
        };
      } else {
        config = {
          ...endpoints.addCompany,
          data: { ...currentData, cp_logo: logo },
        };
      }
    }
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        getCompany(false);
        toast.current.show({
          severity: "info",
          summary: "Berhasil",
          detail: "Data berhasil diperbarui",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: "Gagal memperbarui data",
        life: 3000,
      });
    }
  };

  const submitUpdate = (data) => {
    if (currentData.id === 0) {
      postCompany("", data);
    } else {
      postCompany("", true, data);
    }
  };

  const checkUser = (value) => {
    let selected = null;
    user?.forEach((element) => {
      if (element.id === value) {
        selected = element;
      }
    });

    return selected;
  };

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
                  checked={currentData && currentData.over_stock}
                  onChange={(e) => {
                    setCurrentData({ ...currentData, over_stock: e.value });
                    submitUpdate({ ...currentData, over_stock: e.value });
                  }}
                />
                <label className="mr-3 mt-1" htmlFor="email">
                  {"Barang boleh melebihi stok sisa"}
                </label>
              </div>

              <div className="d-flex col-12 align-items-center">
                <InputSwitch
                  className="mr-3"
                  inputId="email"
                  checked={currentData && currentData.discount}
                  onChange={(e) => {
                    setCurrentData({ ...currentData, discount: e.value });
                    submitUpdate({ ...currentData, discount: e.value });
                  }}
                />
                <label className="mr-3 mt-1" htmlFor="email">
                  {"Diskon"}
                </label>
              </div>

              <div className="d-flex col-12 align-items-center">
                <InputSwitch
                  className="mr-3"
                  inputId="email"
                  checked={currentData && currentData.tiered}
                  onChange={(e) => {
                    setCurrentData({ ...currentData, tiered: e.value });
                    submitUpdate({ ...currentData, tiered: e.value });
                  }}
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

  const renderApprovalSo = () => {
    return (
      <CustomAccordion
        tittle={"Approval Sales Order (SO)"}
        active={accor.so}
        key={1}
        defaultActive={true}
        onClick={() => {
          setAccor({
            ...accor,
            so: !accor.so,
          });
        }}
        body={
          <Row>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 1"}
                value={currentData?.rp1 ? checkUser(currentData?.rp1) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, rp1: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
            </div>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 2"}
                value={currentData?.rp2 ? checkUser(currentData?.rp2) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, rp2: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
            </div>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 3"}
                value={currentData?.rp3 ? checkUser(currentData?.rp3) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, rp3: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
            </div>
          </Row>
        }
      />
    );
  };

  const renderApprovalSales = () => {
    return (
      <CustomAccordion
        tittle={"Approval Sales"}
        active={accor.sales}
        key={1}
        defaultActive={true}
        onClick={() => {
          setAccor({
            ...accor,
            sales: !accor.sales,
          });
        }}
        body={
          <Row>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 1"}
                value={currentData?.po1 ? checkUser(currentData?.po1) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, po1: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
            </div>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 2"}
                value={currentData?.po2 ? checkUser(currentData?.po2) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, po2: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
            </div>
            <div className="col-12 ">
              <PrimeDropdown
                label={"Approval Level 3"}
                value={currentData?.po3 ? checkUser(currentData?.po3) : null}
                options={user}
                filter
                filterBy={"username"}
                onChange={(e) => {
                  setCurrentData({ ...currentData, po3: e.value?.id });
                }}
                showClear
                placeholder="Pilih User"
                optionLabel={"username"}
              />
            </div>
          </Row>
        }
      />
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="col-lg-6 col-sm-12 col-xs-12">
          <div className="row">
            <div className="col-12">
              <Accordion className="accordion " defaultActiveKey="0">
                <div className="accordion__item" key={0}>
                  <Accordion.Toggle
                    as={Card.Text}
                    eventKey={`0`}
                    className={`accordion__header ${
                      accor.main ? "collapsed" : ""
                    }`}
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
                              setting: !e.value,
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

              {renderApprovalSo()}
            </div>
          </div>
        </Col>
        <Col className="col-lg-6 col-sm-12 col-xs-12">
          <div className="row">
            <div className="col-12">
              {template ? renderTemplate() : renderSettings()}
              {renderApprovalSales()}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Penjualan;
