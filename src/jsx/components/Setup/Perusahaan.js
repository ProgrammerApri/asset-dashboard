import React, { useEffect, useRef, useState } from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
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
};

const Perusahaan = () => {
  const [displayDialog, setDisplayDialog] = useState(false);
  const picker = useRef(null);
  const [file, setFile] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [sameValue, setSameValue] = useState(false);
  const [onSubmit, setSubmit] = useState(false);
  const [available, setAvailable] = useState(false);
  const [isLoading, setLoading] = useState(true);

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
            uploadImage();
          }}
          autoFocus
          loading={onSubmit}
        />
      </div>
    );
  };

  const onHide = () => {
    setDisplayDialog(false);
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "3em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Pilih logo perusahaan
        </span>
      </div>
    );
  };

  const itemTemplate = (file, props) => {
    console.log(file);
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "40%" }}>
          <img
            alt={file.name}
            role="presentation"
            src={file.objectURL}
            width={100}
          />
          <span
            className="flex flex-column text-left ml-3"
            style={{
              width: "100px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <PButton
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {/* {uploadButton} */}
        {cancelButton}
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  const onTemplateRemove = (file, callback) => {
    callback();
    setFile(null);
  };

  const onTemplateSelect = (e) => {
    console.log(e.files);
    setFile(e.files[0]);
  };

  const uploadImage = async () => {
    setSubmit(true);
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
        postCompany(response.data);
      }
    } catch (error) {
      setSubmit(false);
    }
  };

  const getCompany = async () => {
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
          setAvailable(false);
        } else {
          setSameValue(response.data.cp_addr == response.data.cp_ship_addr);
          setCurrentData(response.data);
          setAvailable(true);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setAvailable(false);
    }
  };

  const postCompany = async (logo) => {
    const config = {
      ...endpoints.addCompany,
      data: { ...currentData, cp_logo: logo },
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setSubmit(false);
        setDisplayDialog(false);
      }
    } catch (error) {
      setSubmit(false);
    }
  };

  useEffect(() => {
    getCompany();
  }, []);

  return (
    <>
      {isLoading ? (
        <Row>
          <Col>
            <Card>
              <Card.Body>
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
                {renderLoadingData()}
                {renderLoadingData()}
                {renderLoadingData()}
                {renderLoadingData()}
                {renderLoadingData()}
                {renderLoadingData()}
                {renderLoadingData()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <div className="flex justify-content-between w-100">
                  <div style={{ height: "3rem" }}></div>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setDisplayDialog(true);
                      if (!available) {
                        setCurrentData(data);
                      }
                    }}
                  >
                    {available ? "Edit" : "Tambah"}
                    <span className="btn-icon-right">
                      <i class="bx bxs-pencil"></i>
                    </span>
                  </Button>
                </div>
              </Card.Header>
              {available ? (
                <Card.Body>
                  <div className="col-12 mb-3">
                    <img className="cp-logo" src={currentData.cp_logo} alt="" />
                  </div>
                  {renderDetail("Nama Perusahaan", currentData.cp_name)}
                  {renderDetail("Alamat Perusahaan", currentData.cp_addr)}
                  {renderDetail("Alamat Pengiriman", currentData.cp_ship_addr)}
                  {renderDetail("Telp", currentData.cp_telp)}
                  {renderDetail("Email", currentData.cp_email)}
                  {renderDetail("Website", currentData.cp_webs)}
                  {renderDetail("NPWP Perusahaan", currentData.cp_npwp)}
                  {renderDetail("Kontak Person", currentData.cp_coper)}
                  {currentData.multi_currency ? (
                    <div className="col-12 mb-3">
                      <span>
                        <strong className="mr-2">Multi Currency</strong>
                        <i
                          style={{ color: "#00ff00", fontSize: "20px" }}
                          class="bx bxs-check-circle"
                        ></i>
                      </span>
                    </div>
                  ) : (
                    <></>
                  )}
                  {currentData.appr_po ? (
                    <div className="col-12 mb-3">
                      <span>
                        <strong className="mr-2">Approval PO</strong>
                        <i
                          style={{ color: "#00ff00", fontSize: "20px" }}
                          class="bx bxs-check-circle"
                        ></i>
                      </span>
                    </div>
                  ) : (
                    <></>
                  )}
                  {currentData.appr_payment ? (
                    <div className="col-12 mb-3">
                      <span>
                        <strong className="mr-2">Approval Pembayaran</strong>
                        <i
                          style={{ color: "#00ff00", fontSize: "20px" }}
                          class="bx bxs-check-circle"
                        ></i>
                      </span>
                    </div>
                  ) : (
                    <></>
                  )}
                </Card.Body>
              ) : (
                <Card.Body>
                  <div className="col-12 mb-5 mt-5 text-center">
                    Data Perusahaan Masih Kosong
                  </div>
                </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
      )}
      <Dialog
        header={available ? "Edit Data Perusahaan" : "Tambah Data Perusahaan"}
        visible={displayDialog}
        style={{ width: "40vw" }}
        footer={renderFooter()}
        onHide={() => onHide()}
      >
        <div className="col-12 mb-2">
          <FileUpload
            ref={picker}
            name="logo"
            accept="image/*"
            onSelect={onTemplateSelect}
            headerTemplate={headerTemplate}
            itemTemplate={itemTemplate}
            emptyTemplate={emptyTemplate}
            chooseOptions={chooseOptions}
            uploadOptions={uploadOptions}
            cancelOptions={cancelOptions}
            onClear={(e) => setFile(null)}
          />
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

        <div className="col-12 mb-2">
          <Checkbox
            className="mb-2"
            inputId="binary"
            checked={currentData ? currentData.multi_currency : false}
            onChange={(e) => {
              setCurrentData({
                ...currentData,
                multi_currency: e.checked,
              });
            }}
          />
          <label className="ml-3" htmlFor="binary">
            {"Multi Currency"}
          </label>
        </div>

        <div className="col-12 mb-2">
          <Checkbox
            className="mb-2"
            inputId="binary"
            checked={currentData ? currentData.appr_po : false}
            onChange={(e) => {
              setCurrentData({
                ...currentData,
                appr_po: e.checked,
              });
            }}
          />
          <label className="ml-3" htmlFor="binary">
            {"Approval PO"}
          </label>
        </div>

        <div className="col-12 mb-2">
          <Checkbox
            className="mb-2"
            inputId="binary"
            checked={currentData ? currentData.appr_payment : false}
            onChange={(e) => {
              setCurrentData({
                ...currentData,
                appr_payment: e.checked,
              });
            }}
          />
          <label className="ml-3" htmlFor="binary">
            {"Approval Pembayaran"}
          </label>
        </div>
      </Dialog>
    </>
  );
};

export default Perusahaan;
