import React, { useRef, useState } from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import logo from "../../../images/udang-logo.png";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button as PButton } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Tag } from "primereact/tag";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";

const Perusahaan = () => {
  const [displayDialog, setDisplayDialog] = useState(false);
  const picker = useRef(null);

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
          onClick={() => {}}
          autoFocus
          loading={false}
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
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const itemTemplate = (file, props) => {
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
  };

  const onTemplateSelect = (e) => {
    console.log(e.files[0]);
  };

  return (
    <>
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
                  }}
                >
                  Edit{" "}
                  <span className="btn-icon-right">
                    <i class="bx bxs-pencil"></i>
                  </span>
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="col-12 mb-3">
                <img className="cp-logo" src={logo} alt="" />
              </div>
              {renderDetail("Nama Perusahaan", "PT. ABC")}
              {renderDetail(
                "Alamat Perusahaan",
                "Jl. Perusahaan ABC komplek AAA No.20 Kelurahan AA, Kecamatan BB, Kab. CC, Provinsi DDDDDDDD"
              )}
              {renderDetail(
                "Alamat Pengiriman",
                "Jl. Perusahaan ABC komplek AAA No.20 Kelurahan AA, Kecamatan BB, Kab. CC, Provinsi DDDDDDDD"
              )}
              {renderDetail("Telp", "08324839424")}
              {renderDetail("Email", "email@company.com")}
              {renderDetail("Website", "company.com")}
              {renderDetail("NPWP Perusahaan", "002939000099234000")}
              {renderDetail("Kontak Person", "08324839424")}
              <div className="col-12 mb-3">
                <span>
                  <strong className="mr-2">Multi Currency</strong>
                  <i
                    style={{ color: "#00ff00", fontSize: "20px" }}
                    class="bx bxs-check-circle"
                  ></i>
                </span>
              </div>
              <div className="col-12 mb-3">
                <span className="align-middle text-center">
                  <strong className="mr-2">Approval Pembayaran</strong>
                  <i
                    style={{ color: "#00ff00", fontSize: "20px" }}
                    class="bx bxs-check-circle"
                  ></i>
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Dialog
        header="Edit Data Perusahaan"
        visible={displayDialog}
        style={{ width: "40vw" }}
        footer={renderFooter()}
        onHide={() => onHide()}
      >
        <FileUpload
          ref={picker}
          name="demo[]"
          url="https://primefaces.org/primereact/showcase/upload.php"
          accept="image/*"
          onSelect={onTemplateSelect}
          headerTemplate={headerTemplate}
          itemTemplate={itemTemplate}
          emptyTemplate={emptyTemplate}
          chooseOptions={chooseOptions}
          uploadOptions={uploadOptions}
          cancelOptions={cancelOptions}
        />

        <div className="col-12 mb-2">
          <label className="text-label">Nama Perusahaan</label>
          <div className="p-inputgroup">
            <InputText value={""} placeholder="PT. ABC" />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Alamat Perusahaan</label>
          <div className="p-inputgroup">
            <InputTextarea
              value=""
              onChange={(e) => {}}
              placeholder="Jl. Alamat Perusahaan ...."
            />
          </div>
        </div>

        <div className="col-12 mb-2">
                <Checkbox
                  className="mb-2"
                  inputId="binary"
                  checked={false}
                  onChange={(e) =>
                   {}
                  }
                />
                <label className="ml-3" htmlFor="binary">
                  {"Alamat pengiriman sama dengan alamat perusahaan"}
                </label>
              </div>

        <div className="col-12">
          <label className="text-label">Alamat Pengiriman</label>
          <div className="p-inputgroup">
            <InputTextarea
              value=""
              onChange={(e) => {}}
              placeholder="Jl. Alamat Pengiriman ...."
            />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">No. Telp</label>
          <div className="p-inputgroup">
            <InputText value={""} placeholder="08399xxxxxx" />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">Email</label>
          <div className="p-inputgroup">
            <InputText value={""} placeholder="mail@company.com" />
          </div>
        </div>

        <div className="col-12 mb-2">
          <label className="text-label">NPWP Perusahaan</label>
          <div className="p-inputgroup">
            <InputText value={""} placeholder="0000xxxxxxxxxxx" />
          </div>
        </div>
        
        <div className="col-12 mb-2">
          <label className="text-label">No. Telp</label>
          <div className="p-inputgroup">
            <InputText value={""} placeholder="08399xxxxxx" />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Perusahaan;
