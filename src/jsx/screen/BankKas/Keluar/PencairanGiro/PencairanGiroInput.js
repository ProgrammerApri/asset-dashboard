import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_GIRO } from "src/redux/actions";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataBank from "src/jsx/components/MasterLainnya/Bank/DataBank";

const PencairanGiroMundurInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const giro = useSelector((state) => state.giro.current);
  const isEdit = useSelector((state) => state.giro.editGiro);
  const dispatch = useDispatch();
  const [bank, setBank] = useState(null);
  const [showBank, setShowBank] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getBank();
  }, []);

  const getBank = async () => {
    const config = {
      ...endpoints.bank,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setBank(data);
      }
    } catch (error) {}
  };

  const editGiro = async () => {
    const config = {
      ...endpoints.editGiro,
      endpoint: endpoints.editGiro.endpoint + giro.id,
      data: giro,
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

  const addGiro = async () => {
    const config = {
      ...endpoints.addGiro,
      data: giro,
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
            detail: `Kode ${giro.giro_code} Sudah Digunakan`,
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

  const checkBank = (value) => {
    let selected = {};
    bank?.forEach((element) => {
      if (value === element.bank.id) {
        selected = element;
      }
    });

    return selected;
  };

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editGiro();
    } else {
      setUpdate(true);
      addGiro();
    }
  };

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const updateGR = (e) => {
    dispatch({
      type: SET_CURRENT_GIRO,
      payload: e,
    });
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Pencairan Giro</b>
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
            <label className="text-label">Tanggal</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${giro.giro_date}Z`)}
                onChange={(e) => {
                  updateGR({ ...giro, giro_date: e.value });
                }}
                placeholder="Tanggal Pencairan"
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Nomor Giro</label>
            <div className="p-inputgroup">
              <InputText
                value={giro.giro_code}
                onChange={(e) =>
                  updateGR({ ...giro, giro_code: e.target.value })
                }
                placeholder="Nomor Giro"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Nilai Giro</label>
            <div className="p-inputgroup">
              <InputText
                value={giro.giro_value}
                onChange={(e) =>
                  updateGR({ ...giro, giro_value: e.target.value })
                }
                placeholder="Nilai Giro"
                type="number"
                min={0}
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Kode Bank</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={giro.bank_code && checkBank(giro.bank_code)}
              option={bank}
              onChange={(e) => updateGR({ ...giro, bank_code: e.target.value })}
              label={"[bank.BANK_NAME] ([bank.BANK_CODE])"}
              placeholder="Pilih Kode Bank"
              detail
              onDetail={() => setShowBank(true)}
            />
          </div>
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
      {header()}
      {body()}
      {footer()}

      <DataBank
        data={bank}
        loading={false}
        popUp={true}
        show={showBank}
        onHide={() => {
          setShowBank(false);
        }}
        onInput={(e) => {
          setShowBank(!e);
        }}
        onSuccessInput={(e) => {
          getBank();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowBank(false);
            updateGR({ ...giro, bank_code: e.data.id });
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

export default PencairanGiroMundurInput;
