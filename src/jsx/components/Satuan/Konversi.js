import React, { useState, useEffect, useRef } from "react";
import DataSatuan from "./Satuan";
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
import { TabView, TabPanel } from "primereact/tabview";
import { InputNumber } from "primereact/inputnumber";
import { Badge } from "primereact/badge";
import { InputSwitch } from "primereact/inputswitch";

const Konversi = () => {
  const [satuan, setSatuan] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [konversi, setKonversi] = useState([
    {
      code: null,
      qty: null,
      u_from: null,
      u_to: null,
    },
  ]);

  useEffect(() => {
    getSatuan();
  }, []);

  const getSatuan = async () => {
    const config = {
      ...endpoints.getSatuan,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log(data);
        setSatuan(data);
      }
    } catch (error) {}
  };

  const addSatuan = async () => {
    const config = {
      ...endpoints.convertSatuan,
      data: {konversi : konversi},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        if (response.data.length > 0) {
          setTimeout(() => {
            setUpdate(false);
            setKonversi([
              {
                code: null,
                qty: null,
                u_from: null,
                u_to: null,
              },
            ]);
            toast.current.show({
              severity: "info",
              summary: "Berhasil",
              detail: "Data Berhasil Ditambahkan",
              life: 3000,
            });
          }, 500);
        }
        setUpdate(false);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: `Kode Project ${currentItem.proj_code} Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
        setTimeout(() => {
          setUpdate(false);
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

  const checkUnit = (value) => {
    let selected = {};
    satuan.forEach((el) => {
      if (value === el.id) {
        selected = el;
      }
    });

    return selected;
  };

  return (
    <>
      <Toast ref={toast} />
      <Card>
        <Card.Body>
          <div className="row">
            <div className="col-3">
              <label className="text-label">
                <b>Kode Satuan</b>
              </label>
            </div>

            <div className="col-2">
              <label className="text-label">
                <b>Nilai/Kuantitas</b>
              </label>
            </div>

            <div className="col-3">
              <label className="text-label">
                <b>Satuan</b>
              </label>
            </div>

            <div className="ml-1"> </div>

            <div className="col-3">
              <label className="text-label">
                <b>Dari Satuan</b>
              </label>
            </div>

            <div className="d-flex">
              <div className="mt-5"></div>
            </div>
          </div>

          {konversi.map((v, i) => {
            return (
              <div className="row">
                <div className="col-3">
                  <div className="p-inputgroup">
                    <InputText
                      value={v.code}
                      onChange={(e) => {
                        let temp = [...konversi];
                        temp[i].code = e.target.value;
                        setKonversi(temp);
                      }}
                      placeholder="Kode Satuan"
                    />
                  </div>
                </div>

                <div className="col-2">
                  <div className="p-inputgroup">
                    <InputNumber
                      value={v.qty}
                      onChange={(e) => {
                        let temp = [...konversi];
                        temp[i].qty = e.value;
                        setKonversi(temp);
                      }}
                      placeholder="Masukan Nilai"
                      showButtons
                    />
                  </div>
                </div>

                <div className="col-3">
                  <div className="p-inputgroup">
                    <Dropdown
                      value={v.u_to && checkUnit(konversi[i].u_to)}
                      options={satuan}
                      onChange={(e) => {
                        let temp = [...konversi];
                        temp[i].u_to = e.value.id;
                        setKonversi(temp);
                      }}
                      placeholder="Pilih Satuan"
                      optionLabel="name"
                      filter
                      filterBy="name"
                    />
                  </div>
                </div>

                <div
                  className="mt-2"
                  style={{ fontSize: "1rem", paddingTop: "0.7rem" }}
                >
                  {" "}
                  /
                </div>

                <div className="col-3">
                  <div className="p-inputgroup">
                    <Dropdown
                      value={v.u_from && checkUnit(konversi[i].u_from)}
                      options={satuan}
                      onChange={(e) => {
                        let temp = [...konversi];
                        temp[i].u_from = e.value.id;
                        setKonversi(temp);
                      }}
                      placeholder="Pilih Satuan"
                      optionLabel="name"
                      filter
                      filterBy="name"
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="mt-3">
                    {i == konversi.length - 1 ? (
                      <Link
                        onClick={() => {
                          setKonversi([
                            ...konversi,
                            {
                              code: null,
                              qty: null,
                              u_from: null,
                              u_to: null,
                            },
                          ]);
                        }}
                        className="btn btn-primary shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          console.log(konversi);
                          console.log(i);
                          let temp = [...konversi];
                          temp.splice(i, 1);
                          setKonversi(temp);
                        }}
                        className="btn btn-danger shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-trash"></i>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="row ml-0 mr-0 justify-content-between">
            <div></div>
            <div className="mt-5">
              <PButton
                label="Simpan"
                icon="pi pi-check"
                onClick={() => {
                  setUpdate(true);
                  addSatuan();
                }}
                loading={update}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default Konversi;
