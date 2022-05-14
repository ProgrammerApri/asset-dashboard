import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "react-bootstrap";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import DataJenisPelanggan from "./DataJenisPelanggan";

const def = {
  id: 0,
  jpel_code: "",
  jpel_name: "",
  jpel_ket: "",
};

const InputJenisPelanggan = ({
  data,
  isEdit,
  showInput,
  showDelete,
  onHideInput,
  onHideDelete,
  onSuccessInput,
  onSuccessDelete,
  onFailedDelete,
  onFailedInput,
  selected,
}) => {
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [currentItem, setCurrentItem] = useState(selected);

  console.log(data);
  console.log(currentItem);

  const editJenisPel = async () => {
    setLoading(true);
    const config = {
      ...endpoints.editJenisPel,
      endpoint: endpoints.editJenisPel.endpoint + currentItem.id,
      data: {
        jpel_code: currentItem.jpel_code,
        jpel_name: currentItem.jpel_name,
        jpel_ket: currentItem.jpel_ket,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          onSuccessInput();
          setLoading(false);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Diperbarui",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        onFailedInput();
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
          life: 3000,
        });
      }, 500);
    }
  };

  const addJenisPel = async () => {
    setLoading(true);
    const config = {
      ...endpoints.addJenisPel,
      data: {
        jpel_code: currentItem.jpel_code,
        jpel_name: currentItem.jpel_name,
        jpel_ket: currentItem.jpel_ket,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          onSuccessInput();
          setLoading(false);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Diperbarui",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        onFailedInput();
        setLoading(() => {
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: `Kode ${currentItem.jpel_code} Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
        setTimeout(() => {
          onFailedInput();
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Gagal Memperbarui Data",
            life: 3000,
          });
        }, 500);
      }
    }
  };

  const delJenisPel = async (id) => {
    const config = {
      ...endpoints.delJenisPel,
      endpoint: endpoints.delJenisPel.endpoint + currentItem.id,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setLoading(false);
          onSuccessDelete();
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Diperbarui",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        onFailedDelete();
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: `Tidak Dapat Menghapus Project`,
          life: 3000,
        });
      }, 500);
    }
  };

  const renderFooter = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => {
            onHideInput();
            setCurrentItem(def);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Simpan"
          icon="pi pi-check"
          onClick={() => {
            if (isEdit) {
              editJenisPel();
            } else {
              addJenisPel();
            }
          }}
          autoFocus
          loading={loading}
        />
      </div>
    );
  };

  const renderFooterDel = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={onHideDelete}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Hapus"
          icon="pi pi-trash"
          onClick={() => {
            delJenisPel();
          }}
          autoFocus
          loading={loading}
        />
      </div>
    );
  };

  const OnShowInput = () => {
    // if (showInput) {
    //   setCurrentItem(selected);
    //     console.log(`ON SHOW => ${currentItem}`);
    // }
    
    return showInput;
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={isEdit ? "Edit Jenis Pelanggan" : "Tambah Jenis Pelanggan"}
        visible={showInput}
        style={{ width: "40vw" }}
        footer={renderFooter("displayData")}
        onHide={() => {
          setLoading(false);
          setCurrentItem(def);
          onHideInput();
        }}
      >
        <div className="row mr-0 ml-0">
          <div className="col-6">
            <label className="text-label">Kode</label>
            <div className="p-inputgroup">
              <InputText
                value={`${currentItem?.jpel_code}`}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, jpel_code: e.target.value })
                }
                placeholder="Masukan Kode"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Nama</label>
            <div className="p-inputgroup">
              <InputText
                value={`${currentItem?.jpel_name}`}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, jpel_name: e.target.value })
                }
                placeholder="Masukan Nama Akun"
              />
            </div>
          </div>
        </div>

        <div className="row mr-0 ml-0">
          <div className="col-12">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={`${currentItem?.jpel_ket}`}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, jpel_ket: e.target.value })
                }
                placeholder="Masukan Keterangan"
              />
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        header={"Hapus Data"}
        visible={showDelete}
        style={{ width: "30vw" }}
        footer={renderFooterDel("displayDel")}
        onHide={() => {
          setLoading(false);
          onHideDelete();
        }}
      >
        <div className="ml-3 mr-3">
          <i
            className="pi pi-exclamation-triangle mr-3 align-middle"
            style={{ fontSize: "2rem" }}
          />
          <span>Apakah anda yakin ingin menghapus data ?</span>
        </div>
      </Dialog>
    </>
  );
};

export default InputJenisPelanggan;
