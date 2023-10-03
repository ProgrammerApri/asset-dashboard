import React, { useEffect, useRef, useState } from "react";
import { Card, Row, Col, Button, Badge, Accordion } from "react-bootstrap";
import logo from "../../../images/udang-logo.png";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button as PButton } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Tag } from "primereact/tag";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { endpoints, request } from "src/utils";
import { Skeleton } from "primereact/skeleton";
import { InputSwitch } from "primereact/inputswitch";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { SelectButton } from "primereact/selectbutton";
import { ApiConfig } from "src/data/config";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import CustomMonthPicker from "src/jsx/components/CustomMonthPicker/CustomMonthPicker";

const lang = [
  { name: "Indonesia", code: "ID" },
  { name: "English", code: "EN" },
];

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
  cp_akun_name: "",
  cp_bank_name: "",
  cp_no_rek: "",
  cp_branch: "",
  cp_bank_addr: "",
  cp_akun_name_usd: "",
  cp_bank_name_usd: "",
  cp_no_rek_usd: "",
  cp_branch_usd: "",
  cp_bank_addr_usd: "",
  multi_currency: false,
  appr_po: false,
  appr_payment: false,
  over_stock: false,
  discount: false,
  tiered: false,
  rp: false,
  status_number_otomatis: false,
  over_po: false,
  rak_option: false,
  cutoff: null,
  year_co: null,
};

const Perusahaan = () => {
  const toast = useRef(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [displayDialog2, setDisplayDialog2] = useState(false);
  const [displayDialog3, setDisplayDialog3] = useState(false);
  const [displayDialog4, setDisplayDialog4] = useState(false);
  const picker = useRef(null);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [sameValue, setSameValue] = useState(false);
  const [onSubmit, setSubmit] = useState(false);
  const [available, setAvailable] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language"));
  const [isLoading, setLoading] = useState(true);
  const [accor, setAccor] = useState({
    main: true,
    other: false,
    approval: false,
    cutoff: true,
    bhs: false,
  });

  const renderDetail = (label, value) => {
    return (
      <>
        <div className="col-12 mb-3">
          <label>{label} :</label>
          <div>
            <strong>{value}</strong>
          </div>
        </div>
      </>
    );
  };

  const renderLoadingData = () => {
    return (
      <>
        <Skeleton width="20em" height="1em" className="col-12 mb-3"></Skeleton>
        <Skeleton width="50em" height="1em" className="col-12 mb-3"></Skeleton>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => onHide()}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Simpan"
          icon="pi pi-check"
          onClick={() => {
            submitUpdate(true);
          }}
          autoFocus
          loading={onSubmit}
        />
      </div>
    );
  };

  const renderFooter2 = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => onHide()}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Simpan"
          icon="pi pi-check"
          onClick={() => {
            submitUpdate();
          }}
          autoFocus
          loading={onSubmit}
        />
      </div>
    );
  };

  const onHide = () => {
    setDisplayDialog(false);
    setDisplayDialog2(false);
    setDisplayDialog3(false);
    setDisplayDialog4(false);
    setFile(null);
    getCompany(false);
  };

  const uploadImage = async (isUpdate = false) => {
    setSubmit(true);
    if (file) {
      const config = {
        ...endpoints.uploadImage,
        data: {
          image: file,
        },
      };
      console.log(config.data);
      let response = null;
      try {
        response = await request(null, config, {
          "Content-Type": "multipart/form-data",
        });
        console.log(response);
        if (response.status) {
          postCompany(response.data, isUpdate);
        }
      } catch (error) {
        setSubmit(false);
      }
    } else {
      postCompany("", isUpdate);
    }
  };

  const getCompany = async (needLoading = true) => {
    if (!needLoading) {
      setLoading(false);
    } else {
      setLoading(true);
    }
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
          setAvailable(true);
          setCurrentData(data);
        } else {
          setSameValue(response.data.cp_addr == response.data.cp_ship_addr);
          setAvailable(true);
          setCurrentData(response.data);
        }

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setAvailable(false);
    }
  };

  const postCompany = async (logo, isUpdate = false, data) => {
    let config = {};
    if (isUpdate) {
      if (data) {
        config = {
          ...endpoints.updateCompany,
          endpoint: endpoints.updateCompany.endpoint + currentData?.id,
          data: data,
        };
      } else {
        config = {
          ...endpoints.updateCompany,
          endpoint: endpoints.updateCompany.endpoint + currentData?.id,
          data: {
            ...currentData,
            cp_logo: logo !== "" ? logo : currentData.cp_logo,
          },
        };
      }
    } else {
      config = {
        ...endpoints.addCompany,
        data: { ...currentData, cp_logo: logo },
      };
    }
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setSubmit(false);
        onHide();
        toast.current.show({
          severity: "info",
          summary: "Berhasil",
          detail: "Data berhasil diperbarui",
          life: 3000,
        });
      }
    } catch (error) {
      setSubmit(false);
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: "Gagal memperbarui data",
        life: 3000,
      });
    }
  };

  const submitUpdate = async (upload = false, data) => {
    if (currentData?.id === 0) {
      if (upload) {
        uploadImage();
      } else {
        postCompany("");
      }
    } else {
      if (upload) {
        uploadImage(true);
      } else {
        postCompany("", true, data);
      }
    }
  };

  useEffect(() => {
    getCompany();
  }, []);

  return (
    <>
      <Toast ref={toast} />
      {isLoading ? (
        <Row>
          <Col className="col-lg-6 col-sm-12 col-xs-12">
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
                  <span className="accordion__header--icon"></span>
                  <span className="accordion__header--text">
                    Informasi Perusahaan
                  </span>
                  <span className="accordion__header--indicator indicator_bordered"></span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={"0"}>
                  <div className="accordion__body--text">
                    <Skeleton
                      width="7em"
                      height="7em"
                      className="col-12 mb-3"
                    ></Skeleton>
                    {renderLoadingData()}
                    {renderLoadingData()}
                    {renderLoadingData()}
                    {renderLoadingData()}
                    {renderLoadingData()}
                  </div>
                </Accordion.Collapse>
              </div>
            </Accordion>

            <Accordion className="accordion " defaultActiveKey="1">
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
                  <span className="accordion__header--icon"></span>
                  <span className="accordion__header--text">Approval</span>
                  <span className="accordion__header--indicator indicator_bordered"></span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={"0"}>
                  <div className="accordion__body--text">
                    {renderLoadingData()}
                    {renderLoadingData()}
                    {renderLoadingData()}
                  </div>
                </Accordion.Collapse>
              </div>
            </Accordion>
          </Col>

          <Col className="col-lg-6 col-sm-12 col-xs-12">
            <Accordion className="accordion " defaultActiveKey="1">
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
                  <span className="accordion__header--icon"></span>
                  <span className="accordion__header--text">
                    Informasi Lain
                  </span>
                  <span className="accordion__header--indicator indicator_bordered"></span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={"0"}>
                  <div className="accordion__body--text">
                    {renderLoadingData()}
                    {renderLoadingData()}
                    {renderLoadingData()}
                    {renderLoadingData()}
                    {renderLoadingData()}
                    {renderLoadingData()}
                    {renderLoadingData()}
                  </div>
                </Accordion.Collapse>
              </div>
            </Accordion>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col className="col-lg-6 col-sm-12 col-xs-12">
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
                  <span className="accordion__header--icon"></span>
                  <span className="accordion__header--text">
                    Informasi Perusahaan
                  </span>
                  <span className="accordion__header--indicator indicator_bordered"></span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={"0"}>
                  <div className="accordion__body--text">
                    {currentData && currentData.cp_logo !== "" ? (
                      <div className="col-12 mb-3">
                        <img
                          className="cp-logo"
                          src={
                            ApiConfig.baseUrl +
                            endpoints.getImage.endpoint +
                            currentData.cp_logo
                          }
                          alt=""
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                    {renderDetail(
                      "Nama Perusahaan",
                      currentData && currentData.cp_name !== ""
                        ? currentData.cp_name
                        : "-"
                    )}
                    {renderDetail(
                      "Alamat Perusahaan",
                      currentData && currentData.cp_addr !== ""
                        ? currentData.cp_addr
                        : "-"
                    )}
                    {renderDetail(
                      "Alamat Pengiriman",
                      currentData && currentData.cp_ship_addr !== ""
                        ? currentData.cp_ship_addr
                        : "-"
                    )}
                    {renderDetail(
                      "Telp",
                      currentData && currentData.cp_telp != ""
                        ? currentData.cp_telp
                        : "-"
                    )}
                    <div className="mt-3 mb-1 flex justify-content-between">
                      <div></div>
                      <PButton
                        label="Ubah"
                        icon="pi pi-pencil"
                        iconPos="right"
                        onClick={() => {
                          setDisplayDialog(true);
                        }}
                      />
                    </div>
                  </div>
                </Accordion.Collapse>
              </div>
            </Accordion>

            <Accordion className="accordion" defaultActiveKey="0">
              <div className="accordion__item" key={2}>
                <Accordion.Toggle
                  as={Card.Text}
                  eventKey={`0`}
                  className={`accordion__header ${
                    accor.other ? "collapsed" : ""
                  }`}
                  onClick={() => {
                    setAccor({
                      ...accor,
                      other: !accor.other,
                    });
                  }}
                >
                  <span className="accordion__header--icon"></span>
                  <span className="accordion__header--text">
                    Informasi Bank (IDR)
                  </span>
                  <span className="accordion__header--indicator indicator_bordered"></span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={"0"}>
                  <div className="accordion__body--text">
                    {renderDetail(
                      "Nama Akun",
                      currentData && currentData.cp_akun_name !== ""
                        ? currentData.cp_akun_name
                        : "-"
                    )}
                    {renderDetail(
                      "Nama Bank",
                      currentData && currentData.cp_bank_name !== ""
                        ? currentData.cp_bank_name
                        : "-"
                    )}
                    {renderDetail(
                      "Nomor Rekening",
                      currentData && currentData.cp_no_rek !== ""
                        ? currentData.cp_no_rek
                        : "-"
                    )}
                    {renderDetail(
                      "Cabang Bank",
                      currentData && currentData.cp_branch !== ""
                        ? currentData.cp_branch
                        : "-"
                    )}
                    {renderDetail(
                      "Alamat Bank",
                      currentData && currentData.cp_bank_addr !== ""
                        ? currentData.cp_bank_addr
                        : "-"
                    )}

                    <div className="mt-3 mb-1 flex justify-content-between">
                      <div></div>
                      <PButton
                        label="Ubah"
                        icon="pi pi-pencil"
                        iconPos="right"
                        onClick={() => {
                          setDisplayDialog3(true);
                        }}
                      />
                    </div>
                  </div>
                </Accordion.Collapse>
              </div>
            </Accordion>

            <Accordion className="acordion" defaultActiveKey="1">
              <div className="accordion__item" key={1}>
                <Accordion.Toggle
                  as={Card.Text}
                  eventKey={`0`}
                  className={`accordion__header ${
                    accor.approval ? "collapsed" : ""
                  }`}
                  onClick={() => {
                    setAccor({
                      ...accor,
                      approval: !accor.other,
                    });
                  }}
                >
                  <span className="accordion__header--icon"></span>
                  <span className="accordion__header--text">
                    Setting Transaksi
                  </span>
                  <span className="accordion__header--indicator indicator_bordered"></span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={"0"}>
                  <div className="accordion__body--text">
                    <div className="d-flex col-12 align-items-center">
                      <InputSwitch
                        className="mr-3"
                        inputId="email"
                        checked={currentData && currentData.multi_currency}
                        onChange={(e) => {
                          setCurrentData({
                            ...currentData,
                            multi_currency: e.value,
                          });
                          submitUpdate(false, {
                            ...currentData,
                            multi_currency: e.value,
                          });
                        }}
                      />
                      <label className="mr-3 mt-1" htmlFor="email">
                        {"Multi Currency"}
                      </label>
                    </div>

                    <div className="d-flex col-12 align-items-center">
                      <InputSwitch
                        className="mr-3"
                        inputId="email"
                        checked={currentData && currentData.appr_po}
                        onChange={(e) => {
                          setCurrentData({ ...currentData, appr_po: e.value });
                          submitUpdate(false, {
                            ...currentData,
                            appr_po: e.value,
                          });
                        }}
                      />
                      <label className="mr-3 mt-1" htmlFor="email">
                        {"Approval PO"}
                      </label>
                    </div>

                    <div className="d-flex col-12 align-items-center">
                      <InputSwitch
                        className="mr-3"
                        inputId="email"
                        checked={currentData && currentData.appr_payment}
                        onChange={(e) => {
                          setCurrentData({
                            ...currentData,
                            appr_payment: e.value,
                          });
                          submitUpdate(false, {
                            ...currentData,
                            appr_payment: e.value,
                          });
                        }}
                      />
                      <label className="mr-3 mt-1" htmlFor="email">
                        {"Approval Pembayaran"}
                      </label>
                    </div>

                    <div className="d-flex col-12 align-items-center">
                      <InputSwitch
                        className="mr-3"
                        inputId="email"
                        checked={currentData && currentData.rak_option}
                        onChange={(e) => {
                          setCurrentData({
                            ...currentData,
                            rak_option: e.value,
                          });
                          submitUpdate(false, {
                            ...currentData,
                            rak_option: e.value,
                          });
                        }}
                      />
                      <label className="mr-3 mt-1" htmlFor="email">
                        {"Aktifkan Rak Untuk Semua Transaksi"}
                      </label>
                    </div>
                  </div>
                </Accordion.Collapse>
              </div>
            </Accordion>
          </Col>

          <Col className="col-lg-6 col-sm-12 col-xs-12">
            <Accordion className="accordion" defaultActiveKey="1">
              <div className="accordion__item" key={2}>
                <Accordion.Toggle
                  as={Card.Text}
                  eventKey={`0`}
                  className={`accordion__header ${
                    accor.other ? "collapsed" : ""
                  }`}
                  onClick={() => {
                    setAccor({
                      ...accor,
                      other: !accor.other,
                    });
                  }}
                >
                  <span className="accordion__header--icon"></span>
                  <span className="accordion__header--text">
                    Informasi Lain
                  </span>
                  <span className="accordion__header--indicator indicator_bordered"></span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={"0"}>
                  <div className="accordion__body--text">
                    {renderDetail(
                      "Email",
                      currentData && currentData.cp_email !== ""
                        ? currentData.cp_email
                        : "-"
                    )}
                    {renderDetail(
                      "Website",
                      currentData && currentData.cp_webs !== ""
                        ? currentData.cp_webs
                        : "-"
                    )}
                    {renderDetail(
                      "NPWP Perusahaan",
                      currentData && currentData.cp_npwp !== ""
                        ? currentData.cp_npwp
                        : "-"
                    )}
                    {renderDetail(
                      "Kontak Person",
                      currentData && currentData.cp_coper !== ""
                        ? currentData.cp_coper
                        : "-"
                    )}
                    <div className="mt-3 mb-1 flex justify-content-between">
                      <div></div>
                      <PButton
                        label="Ubah"
                        icon="pi pi-pencil"
                        iconPos="right"
                        onClick={() => {
                          setDisplayDialog2(true);
                        }}
                      />
                    </div>
                  </div>
                </Accordion.Collapse>
              </div>
            </Accordion>

            <Accordion className="accordion" defaultActiveKey="1">
              <div className="accordion__item" key={2}>
                <Accordion.Toggle
                  as={Card.Text}
                  eventKey={`0`}
                  className={`accordion__header ${
                    accor.other ? "collapsed" : ""
                  }`}
                  onClick={() => {
                    setAccor({
                      ...accor,
                      other: !accor.other,
                    });
                  }}
                >
                  <span className="accordion__header--icon"></span>
                  <span className="accordion__header--text">
                    Informasi Bank (USD)
                  </span>
                  <span className="accordion__header--indicator indicator_bordered"></span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={"0"}>
                  <div className="accordion__body--text">
                    {renderDetail(
                      "Nama Akun",
                      currentData && currentData.cp_akun_name_usd !== ""
                        ? currentData.cp_akun_name_usd
                        : "-"
                    )}
                    {renderDetail(
                      "Nama Bank",
                      currentData && currentData.cp_bank_name_usd !== ""
                        ? currentData.cp_bank_name_usd
                        : "-"
                    )}
                    {renderDetail(
                      "Nomor Rekening",
                      currentData && currentData.cp_no_rek_usd !== ""
                        ? currentData.cp_no_rek_usd
                        : "-"
                    )}
                    {renderDetail(
                      "Cabang Bank",
                      currentData && currentData.cp_branch_usd !== ""
                        ? currentData.cp_branch_usd
                        : "-"
                    )}
                    {renderDetail(
                      "Alamat Bank",
                      currentData && currentData.cp_bank_addr_usd !== ""
                        ? currentData.cp_bank_addr_usd
                        : "-"
                    )}

                    <div className="mt-3 mb-1 flex justify-content-between">
                      <div></div>
                      <PButton
                        label="Ubah"
                        icon="pi pi-pencil"
                        iconPos="right"
                        onClick={() => {
                          setDisplayDialog4(true);
                        }}
                      />
                    </div>
                  </div>
                </Accordion.Collapse>
              </div>
            </Accordion>

            <CustomAccordion
              tittle={"Cutoff"}
              defaultActive={true}
              active={accor.cutoff}
              onClick={() => {
                setAccor({
                  ...accor,
                  cutoff: !accor.cutoff,
                });
              }}
              key={1}
              body={
                <Row className="mr-0 ml-0">
                  <div className="col-6">
                    <CustomMonthPicker
                      dropdown
                      value={currentData?.cutoff}
                      onChange={(e) => {
                        submitUpdate(false, { ...currentData, cutoff: e });
                        setCurrentData({ ...currentData, cutoff: e });
                      }}
                    />
                  </div>

                  <div className="col-6">
                    <CustomMonthPicker
                      dyear
                      value={currentData?.year_co}
                      onChange={(e) => {
                        submitUpdate(false, { ...currentData, year_co: e });
                        setCurrentData({ ...currentData, year_co: e });
                      }}
                    />
                  </div>
                </Row>
              }
            />

            <Accordion className="acordion" defaultActiveKey="0">
              <div className="accordion__item" key={1}>
                <Accordion.Toggle
                  as={Card.Text}
                  eventKey={`0`}
                  className={`accordion__header ${
                    accor.bhs ? "collapsed" : ""
                  }`}
                  onClick={() => {
                    setAccor({
                      ...accor,
                      bhs: !accor.other,
                    });
                  }}
                >
                  <span className="accordion__header--icon"></span>
                  <span className="accordion__header--text">Bahasa</span>
                  <span className="accordion__header--indicator indicator_bordered"></span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={"0"}>
                  <div className="accordion__body--text">
                    <div className="d-flex col-12 align-items-center">
                      <SelectButton
                        value={
                          language === "id"
                            ? { name: "Indonesia", code: "ID" }
                            : { name: "English", code: "EN" }
                        }
                        options={lang}
                        onChange={(e) => {
                          if (e.value.code === "ID") {
                            setLanguage("id");
                            localStorage.setItem("language", "id");
                          } else {
                            setLanguage("en");
                            localStorage.setItem("language", "en");
                          }
                        }}
                        optionLabel="name"
                      />
                    </div>
                  </div>
                </Accordion.Collapse>
              </div>
            </Accordion>
          </Col>
        </Row>
      )}
      <Dialog
        header={"Edit Informasi Perusahaan"}
        visible={displayDialog}
        style={{ width: "40vw" }}
        footer={renderFooter()}
        onHide={() => onHide()}
      >
        <div className="col-12 mb-2">
          <Tooltip target=".upload" mouseTrack mouseTrackLeft={10} />
          <input
            type="file"
            id="file"
            ref={picker}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              console.log(e);
              setFile(e.target.files[0]);
            }}
          />
          <div className="flex align-items-center flex-column">
            <Card
              className="upload mb-3"
              data-pr-tooltip="Klik untuk memilih foto"
              style={{ cursor: "pointer", height: "200px", width: "200px" }}
              onClick={() => {
                picker.current.click();
              }}
            >
              <Card.Body className="flex align-items-center justify-content-center">
                {file ? (
                  <img
                    style={{ maxWidth: "150px" }}
                    src={URL.createObjectURL(file)}
                    alt=""
                  />
                ) : currentData && currentData.cp_logo !== "" ? (
                  <img
                    style={{ maxWidth: "150px" }}
                    src={currentData.cp_logo}
                    alt=""
                  />
                ) : (
                  <i
                    className="pi pi-image p-3"
                    style={{
                      fontSize: "3em",
                      borderRadius: "50%",
                      backgroundColor: "var(--surface-b)",
                      color: "var(--surface-d)",
                    }}
                  ></i>
                )}
              </Card.Body>
            </Card>
            <span
              style={{
                fontSize: "0.9rem",
                color: "var(--text-color-secondary)",
              }}
              className="mb-5"
            >
              Logo Perusahaan
            </span>
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Nama Perusahaan</label>
          <div className="p-inputgroup">
            <InputText
              value={currentData ? currentData.cp_name : null}
              onChange={(e) => {
                setCurrentData({
                  ...currentData,
                  cp_name: e.target.value,
                });
              }}
              placeholder="Nama Perusahaan"
            />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Alamat Perusahaan</label>
          <div className="p-inputgroup">
            <InputTextarea
              value={currentData ? currentData.cp_addr : null}
              onChange={(e) => {
                if (sameValue) {
                  setCurrentData({
                    ...currentData,
                    cp_addr: e.target.value,
                    cp_ship_addr: e.target.value,
                  });
                } else {
                  setCurrentData({
                    ...currentData,
                    cp_addr: e.target.value,
                  });
                }
              }}
              placeholder="Alamat Perusahaan"
            />
          </div>
        </div>

        <div className="col-12 mb-2">
          <Checkbox
            className="mb-2"
            inputId="binary"
            checked={sameValue}
            onChange={(e) => {
              console.log(e);
              setSameValue(e.checked);
              if (e.checked) {
                setCurrentData({
                  ...currentData,
                  cp_ship_addr: currentData.cp_addr,
                });
              }
            }}
          />
          <label className="ml-3" htmlFor="binary">
            {"Alamat pengiriman sama dengan alamat perusahaan"}
          </label>
        </div>

        {!sameValue ? (
          <div className="col-12">
            <label className="text-label">Alamat Pengiriman</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={currentData ? currentData.cp_ship_addr : null}
                onChange={(e) => {
                  setCurrentData({
                    ...currentData,
                    cp_ship_addr: e.target.value,
                  });
                }}
                placeholder="Alamat Pengiriman"
              />
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="col-12 mb-2">
          <label className="text-label">No. Telp</label>
          <div className="p-inputgroup">
            <InputText
              value={currentData ? currentData.cp_telp : null}
              onChange={(e) => {
                setCurrentData({
                  ...currentData,
                  cp_telp: e.target.value,
                });
              }}
              placeholder="No. Telpon"
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        header={"Edit Informasi Lain"}
        visible={displayDialog2}
        style={{ width: "40vw" }}
        footer={renderFooter2()}
        onHide={() => onHide()}
      >
        <div className="col-12 mb-2">
          <label className="text-label">Email</label>
          <div className="p-inputgroup">
            <InputText
              value={currentData ? currentData.cp_email : null}
              onChange={(e) => {
                setCurrentData({
                  ...currentData,
                  cp_email: e.target.value,
                });
              }}
              placeholder="Email Perusahaan"
            />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Website</label>
          <div className="p-inputgroup">
            <InputText
              value={currentData ? currentData.cp_webs : null}
              onChange={(e) => {
                setCurrentData({
                  ...currentData,
                  cp_webs: e.target.value,
                });
              }}
              placeholder="Website Perusahaan"
            />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">NPWP Perusahaan</label>
          <div className="p-inputgroup">
            <InputText
              value={currentData ? currentData.cp_npwp : null}
              onChange={(e) => {
                setCurrentData({
                  ...currentData,
                  cp_npwp: e.target.value,
                });
              }}
              placeholder="NPWP"
            />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Kontak Person</label>
          <div className="p-inputgroup">
            <InputText
              value={currentData ? currentData.cp_coper : null}
              onChange={(e) => {
                setCurrentData({
                  ...currentData,
                  cp_coper: e.target.value,
                });
              }}
              placeholder="Kontak Person"
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        header={"Edit Informasi Bank (IDR)"}
        visible={displayDialog3}
        style={{ width: "40vw" }}
        footer={renderFooter2()}
        onHide={() => onHide()}
      >
        <div className="row">
          <div className="col-6 mb-2">
            <label className="text-label">Nama Akun</label>
            <div className="p-inputgroup">
              <InputText
                value={currentData ? currentData.cp_akun_name : null}
                onChange={(e) => {
                  setCurrentData({
                    ...currentData,
                    cp_akun_name: e.target.value,
                  });
                }}
                placeholder="Nama Akun Bank"
              />
            </div>
          </div>

          <div className="col-6 mb-2">
            <label className="text-label">Nama Bank</label>
            <div className="p-inputgroup">
              <InputText
                value={currentData ? currentData.cp_bank_name : null}
                onChange={(e) => {
                  setCurrentData({
                    ...currentData,
                    cp_bank_name: e.target.value,
                  });
                }}
                placeholder="Nama Bank"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6 mb-2">
            <label className="text-label">No. Rekening</label>
            <div className="p-inputgroup">
              <InputText
                value={currentData ? currentData.cp_no_rek : null}
                onChange={(e) => {
                  setCurrentData({
                    ...currentData,
                    cp_no_rek: e.target.value,
                  });
                }}
                placeholder="No. Rekening"
              />
            </div>
          </div>
          <div className="col-6 mb-2">
            <label className="text-label">Cabang Bank</label>
            <div className="p-inputgroup">
              <InputText
                value={currentData ? currentData.cp_branch : null}
                onChange={(e) => {
                  setCurrentData({
                    ...currentData,
                    cp_branch: e.target.value,
                  });
                }}
                placeholder="Cabang Bank"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6 mb-2">
            <label className="text-label">Alamat Bank</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={currentData ? currentData.cp_bank_addr : null}
                onChange={(e) => {
                  setCurrentData({
                    ...currentData,
                    cp_bank_addr: e.target.value,
                  });
                }}
                placeholder="Alamat Bank"
              />
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        header={"Edit Informasi Bank (USD)"}
        visible={displayDialog4}
        style={{ width: "40vw" }}
        footer={renderFooter2()}
        onHide={() => onHide()}
      >
        <div className="row">
          <div className="col-6 mb-2">
            <label className="text-label">Nama Akun</label>
            <div className="p-inputgroup">
              <InputText
                value={currentData ? currentData.cp_akun_name_usd : null}
                onChange={(e) => {
                  setCurrentData({
                    ...currentData,
                    cp_akun_name_usd: e.target.value,
                  });
                }}
                placeholder="Nama Akun Bank"
              />
            </div>
          </div>

          <div className="col-6 mb-2">
            <label className="text-label">Nama Bank</label>
            <div className="p-inputgroup">
              <InputText
                value={currentData ? currentData.cp_bank_name_usd : null}
                onChange={(e) => {
                  setCurrentData({
                    ...currentData,
                    cp_bank_name_usd: e.target.value,
                  });
                }}
                placeholder="Nama Bank"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6 mb-2">
            <label className="text-label">No. Rekening</label>
            <div className="p-inputgroup">
              <InputText
                value={currentData ? currentData.cp_no_rek_usd : null}
                onChange={(e) => {
                  setCurrentData({
                    ...currentData,
                    cp_no_rek_usd: e.target.value,
                  });
                }}
                placeholder="No. Rekening"
              />
            </div>
          </div>
          <div className="col-6 mb-2">
            <label className="text-label">Cabang Bank</label>
            <div className="p-inputgroup">
              <InputText
                value={currentData ? currentData.cp_branch_usd : null}
                onChange={(e) => {
                  setCurrentData({
                    ...currentData,
                    cp_branch_usd: e.target.value,
                  });
                }}
                placeholder="Cabang Bank"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6 mb-2">
            <label className="text-label">Alamat Bank</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={currentData ? currentData.cp_bank_addr_usd : null}
                onChange={(e) => {
                  setCurrentData({
                    ...currentData,
                    cp_bank_addr_usd: e.target.value,
                  });
                }}
                placeholder="Alamat Bank"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Perusahaan;
