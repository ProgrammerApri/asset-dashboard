import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_KP } from "src/redux/actions";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataAkun from "src/jsx/screen/Master/Akun/DataAkun";
import DataCustomer from "src/jsx/screen/Mitra/Pelanggan/DataCustomer";

const KoreksiARInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const kp = useSelector((state) => state.kp.current);
  const isEdit = useSelector((state) => state.kp.editKp);
  const dispatch = useDispatch();
  const [customer, setCustomer] = useState(null);
  const [rp, setRequest] = useState(null);
  const [acc, setAcc] = useState(null);
  const [showCustomer, setShowCus] = useState(false);
  const [showAcc, setShowAcc] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getCustomer();
    getAcc();
  }, []);

  const getCustomer = async () => {
    const config = {
      ...endpoints.customer,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCustomer(data);
      }
    } catch (error) {}
  };

  const getAcc = async () => {
    const config = {
      ...endpoints.account,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setAcc(data);
      }
    } catch (error) {}
  };

  const editKP = async () => {
    const config = {
      ...endpoints.editKP,
      endpoint: endpoints.editKP.endpoint + kp.id,
      data: kp,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        onSuccess();
      }
    } catch (error) {
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
  };

  const addKP = async () => {
    const config = {
      ...endpoints.addKP,
      data: kp,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: `Kode ${kp.kp_code} Sudah Digunakan`,
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

  const acco = (value) => {
    let selected = {};
    acc?.forEach((element) => {
      if (value === element.account.id) {
        selected = element;
      }
    });

    return selected;
  };

  const cuss = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer?.id) {
        selected = element;
      }
    });

    return selected;
  };

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editKP();
    } else {
      setUpdate(true);
      addKP();
    }
  };

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const updateKP = (e) => {
    dispatch({
      type: SET_CURRENT_KP,
      payload: e,
    });
  };

  const header = () => {
    return (
      <h4 className="mb-4">
        <b>Koreksi Hutang</b>
      </h4>
    );
  };

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-4">
            <label className="text-label">Nomer Referensi Koreksi</label>
            <div className="p-inputgroup">
              <InputText
                value={kp.kp_code}
                onChange={(e) => updateKP({ ...kp, kp_code: e.target.value })}
                placeholder="Nomer Referensi"
              />
            </div>
          </div>

          <div className="col-2">
            <label className="text-label">Tanggal</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${kp.kp_date}Z`)}
                onChange={(e) => {
                  updateKP({ ...kp, kp_date: e.value });
                }}
                placeholder="Tanggal"
                showIcon
                dateFormat="dd-mm-yy"
              />
            </div>
          </div>
          <div className="col-6"></div>
          <div className="col-4 mt-3">
            <label className="text-label">Pelanggan</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={kp.pel_id ? cuss(kp.pel_id) : null}
              option={customer}
              onChange={(e) => {
                updateKP({
                  ...kp,
                  pel_id: e.customer?.id,
                });
              }}
              label={"[customer.cus_name]"}
              placeholder="Pilih Pelanggan"
              detail
              onDetail={() => setShowCus(true)}
            />
          </div>
          <div className="col-4 mt-3">
            <label className="text-label">Type Koreksi</label>
            <div className="p-inputgroup">
              <Dropdown
                value={kp.type && kp.type}
                options={rp}
                onChange={(e) => {
                  updateKP({
                    ...kp,
                    type: e.value.id,
                  });
                }}
                optionLabel="name"
                placeholder="Pilih Type Koreksi"
              />
            </div>
          </div>
          <div className="col-4 mt-3">
            <label className="text-label">Akun Lawan</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={kp.acc_lwn && acco(kp.acc_lwn)}
              option={acc}
              onChange={(e) => {
                updateKP({
                  ...kp,
                  acc_lwn: e.account?.id,
                });
              }}
              label={"[account.acc_name] - [account.acc_code]"}
              placeholder="Akun Lawan"
              detail
              onDetail={() => setShowAcc(true)}
            />
          </div>
          <div className="col-4">
            <label className="text-label">Nilai </label>
            <div className="p-inputgroup">
              <InputText
                value={kp.nilai}
                onChange={(e) => updateKP({ ...kp, nilai: e.target.value })}
                placeholder="0"
                type="number"
                min={0}
              />
            </div>
          </div>
          <div className="col-4">
            <label className="text-label">Tanggal J/T</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${kp.due_date}Z`)}
                onChange={(e) => {
                  updateKP({ ...kp, due_date: e.value });
                }}
                placeholder="Tanggal Jatuh Tempo"
                showIcon
                dateFormat="dd-mm-yy"
              />
            </div>
          </div>
          <div className="col-4">
            <label className="text-label">Keterangan </label>
            <div className="p-inputgroup">
              <InputText
                value={kp.ket}
                onChange={(e) => updateKP({ ...kp, ket: e.target.value })}
                placeholder="Keterangan"
              />
            </div>
          </div>
          {/* kode suplier otomatis keluar, karena sudah melekat di faktur pembelian  */}
        </Row>
      </>
    );
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div>
          <PButton
            label="Batal"
            onClick={onCancel}
            className="p-button-text btn-primary"
          />
          <PButton
            label="Simpan"
            icon="pi pi-check"
            onClick={() => onSubmit()}
            autoFocus
            loading={update}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* {header()} */}
      {body()}
      {footer()}

      <DataCustomer
        data={customer}
        loading={false}
        popUp={true}
        show={showCustomer}
        onHide={() => {
          setShowCus(false);
        }}
        onInput={(e) => {
          setShowCus(!e);
        }}
        onSuccessInput={(e) => {
          getCustomer();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowCus(false);
            updateKP({ ...kp, pel_id: e.data.customer.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataAkun
        data={acc}
        loading={false}
        popUp={true}
        show={showAcc}
        onHide={() => {
          setShowAcc(false);
        }}
        onInput={(e) => {
          setShowAcc(!e);
        }}
        onSuccessInput={(e) => {
          getAcc();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowAcc(false);
            updateKP({ ...rp, req_dep: e.data.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />
    </>
  );
};

export default KoreksiARInput;
