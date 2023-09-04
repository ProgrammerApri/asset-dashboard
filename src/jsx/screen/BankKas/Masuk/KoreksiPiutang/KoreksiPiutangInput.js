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
import { setAutoFreeze } from "@reduxjs/toolkit/node_modules/immer";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";

const defError = {
  code: false,
  date: false,
  cus: false,
  akn: false,
  nil: false,
};

const tipe = [
  { name: "Nota Debit", code: "ND" },
  { name: "Nota Kredit", code: "NK" },
];

const KoreksiARInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(defError);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const kp = useSelector((state) => state.kp.current);
  const isEdit = useSelector((state) => state.kp.editKp);
  const dispatch = useDispatch();
  const [numb, setNumb] = useState(true);
  const [ar, setAr] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [acc, setAcc] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [showCustomer, setShowCus] = useState(false);
  const [showAcc, setShowAcc] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getAr();
    getAcc();
    getStatus()
    getCur();
  }, []);

  const getStatus = async () => {
    const config = {
      ...endpoints.korHutStatus,
      data: {},
    };

    console.log("Data sebelum request:", config.data);

    let response = null;
    try {
      response = await request(null, config);
      console.log("Response:", response);
      if (response.status) {
        const { data } = response;

        setNumb(data);
      }
    } catch (error) {setNumb(false);
      console.error("Error:", error);
    }
  };


  
  const getAr = async () => {
    const config = {
      ...endpoints.arcard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data?.forEach((element) => {
          if (!element.lunas && element.trx_dbcr === "D") {
            filt.push(element);
          }
        });

        setAr(data);

        let grouped = filt?.filter(
          (el, i) =>
            i === filt?.findIndex((ek) => el.cus_id?.id === ek.cus_id?.id)
        );
        setCustomer(grouped);
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

  const getCur = async () => {
    const config = {
      ...endpoints.currency,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCurrency(data);
      }
    } catch (error) {}
  };

  const editKP = async () => {
    const config = {
      ...endpoints.editKorPiu,
      endpoint: endpoints.editKorPiu.endpoint + kp.id,
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
      ...endpoints.addKorPiu,
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

  const curr = (value) => {
    let selected = {};
    currency?.forEach((element) => {
      if (value === element?.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkTipe = (value) => {
    let selected = {};
    tipe?.forEach((element) => {
      if (value === element?.kode) {
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

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-3">
            <PrimeInput
              label={"No. Referensi"}
              value={kp.code}
              onChange={(e) => {
                updateKP({ ...kp, code: e.target.value });

                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Nomer Referensi"
              error={error?.code}
              disabled={numb}
            />
          </div>

          <div className="col-2">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${kp.date}Z`)}
              onChange={(e) => {
                updateKP({ ...kp, date: e.value });

                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              placeholder="Tanggal"
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.date}
            />
          </div>
          <div className="col-2">
            <label className="text-label">Jatuh Tempo</label>
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
          <div className="col-4"></div>
          <div className="col-3 mt-3">
            <label className="text-label">Pelanggan</label>
            <PrimeDropdown
              value={kp.cus_id ? cuss(kp.cus_id) : null}
              options={customer}
              onChange={(e) => {
                let t_piutang = 0;
                ar?.forEach((element) => {
                  if (
                    element.cus_id?.id === e.value?.cus_id?.id &&
                    !element.lunas
                  ) {
                    if (e.value?.cus_id?.cus_curren !== null) {
                      if (element.trx_dbcr === "D") {
                        t_piutang += element.trx_amnv;
                      } else {
                        t_piutang -= element.trx_amnv;
                      }
                    } else {
                      if (element.trx_dbcr === "D") {
                        t_piutang += element.trx_amnh;
                      } else {
                        t_piutang -= element.trx_amnh;
                      }
                    }
                  }
                });
                updateKP({
                  ...kp,
                  cus_id: e?.value?.cus_id?.id ?? null,
                  total_piu: t_piutang,
                  piu_fc: e?.value?.cus_id?.cus_curren
                    ? t_piutang * curr(e?.value?.cus_id?.cus_curren)?.rate
                    : 0,
                });

                let newError = error;
                newError.cus = false;
                setError(newError);
              }}
              filter
              filterBy={"cus_id.cus_name"}
              optionLabel="cus_id.cus_name"
              placeholder="Pilih Pelanggan"
              errorMessage="Pelanggan Belum Dipilih"
              error={error?.cus}
              showClear
            />
          </div>
          <div className="col-2 mt-3">
            <label className="text-label">Tipe Koreksi</label>
            <div className="p-inputgroup">
              <Dropdown
                value={kp.type_kor && checkTipe(kp.type_kor)}
                options={tipe}
                onChange={(e) => {
                  updateKP({
                    ...kp,
                    type_kor: e.value?.code,
                  });
                }}
                optionLabel="name"
                placeholder="Pilih Tipe Koreksi"
              />
            </div>
          </div>
          <div className="col-3 mt-3">
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

                let newError = error;
                newError.akn = false;
                setError(newError);
              }}
              label={"[account.acc_name] - [account.acc_code]"}
              placeholder="Akun Lawan"
              detail
              onDetail={() => setShowAcc(true)}
              errorMessage="Akun Belum Dipilih"
              error={error?.akn}
            />
          </div>
          <div className="col-4 mt-3">
            <label className="text-label">Keterangan </label>
            <div className="p-inputgroup">
              <InputText
                value={kp.desc}
                onChange={(e) => updateKP({ ...kp, desc: e.target.value })}
                placeholder="Keterangan"
              />
            </div>
          </div>

          <div className="col-1 mt-3" hidden={kp?.cus_id == null}>
            <PrimeInput
              price
              label={"Mata Uang"}
              value={
                kp.cus_id
                  ? cuss(kp?.cus_id)?.cus_curren
                    ? curr(cuss(kp?.cus_id)?.cus_curren)?.code
                    : "IDR"
                  : ""
              }
              placeholder="0"
              type="number"
              min={0}
              disabled
            />
          </div>

          <div className="col-2 mt-3" hidden={kp?.cus_id == null}>
            {cuss(kp?.cus_id)?.cus_curren ? (
              <PrimeNumber
                label={"Nilai Piutang"}
                value={kp.total_piu}
                placeholder="0"
                type="number"
                min={0}
                disabled
              />
            ) : (
              <PrimeNumber
                price
                label={"Nilai Piutang"}
                value={kp.total_piu}
                placeholder="0"
                type="number"
                min={0}
                disabled
              />
            )}
          </div>

          <div
            className="col-2 mt-3"
            hidden={kp?.cus_id == null || cuss(kp?.cus_id)?.cus_curren == null}
          >
            <PrimeNumber
              price
              label={"Foreign Currency"}
              value={kp.piu_fc}
              placeholder="0"
              type="number"
              min={0}
              disabled
            />
          </div>

          <div className="col-2 mt-3">
            {cuss(kp?.cus_id)?.cus_curren != null ? (
              <PrimeNumber
                label={"Nilai Koreksi"}
                value={kp.value}
                onChange={(e) => {
                  updateKP({ ...kp, value: e.target.value });

                  let newError = error;
                  newError.nil = false;
                  setError(newError);
                }}
                placeholder="0"
                type="number"
                min={0}
                error={error?.nil}
              />
            ) : (
              <PrimeNumber
                price
                label={"Nilai Koreksi"}
                value={kp.value}
                onChange={(e) => {
                  updateKP({ ...kp, value: e.value });

                  let newError = error;
                  newError.nil = false;
                  setError(newError);
                }}
                placeholder="0"
                type="number"
                min={0}
                error={error?.nil}
              />
            )}
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
            updateKP({ ...kp, acc_lwn: e.data?.account.id });
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
