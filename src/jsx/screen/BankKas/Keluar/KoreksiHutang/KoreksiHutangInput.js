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
import { SET_CURRENT_KH, SET_CURRENT_PO } from "src/redux/actions";
import DataSupplier from "src/jsx/screen/Mitra/Pemasok/DataPemasok";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataAkun from "src/jsx/screen/Master/Akun/DataAkun";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";

const defError = {
  code: false,
  date: false,
  sup: false,
  akn: false,
  nil: false,
};

const KoreksiAPInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(defError);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const kh = useSelector((state) => state.kh.current);
  const isEdit = useSelector((state) => state.kh.editKh);
  const dispatch = useDispatch();
  const [supplier, setSupplier] = useState(null);
  const [rp, setRequest] = useState(null);
  const [acc, setAcc] = useState(null);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showAcc, setShowAcc] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getSupplier();
    getAcc();
  }, []);

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !kh.kh_code || kh.kh_code === "",
      date: !kh.kh_date || kh.kh_date === "",
      sup: !kh.sup_id,
      akn: !kh.acc_lwn,
      nil: !kh.nilai || kh.nilai === "",
    };

    setError(errors);

    valid =
      !errors.code && !errors.date && !errors.sup && !errors.akn && !errors.nil;

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });
    }

    return valid;
  };

  const getSupplier = async () => {
    const config = {
      ...endpoints.supplier,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSupplier(data);
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

  const getRp = async () => {
    const config = {
      ...endpoints.rPurchase,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((elem) => {
          if (elem.status === 0) {
            filt.push(elem);
            elem.rprod.forEach((el) => {
              el.order = el.order ?? 0;
              if (el.order === 0 || el.request - el.order !== 0) {
                el.prod_id = el.prod_id.id;
                el.unit_id = el.unit_id.id;
              }
            });
            elem.rjasa.forEach((element) => {
              element.jasa_id = element.jasa_id.id;
              element.unit_id = element.unit_id.id;
            });
            elem.rjasa.push({
              id: 0,
              preq_id: elem.id,
              sup_id: null,
              jasa_id: null,
              unit_id: null,
              qty: null,
              price: null,
              disc: null,
              total: null,
            });
          }
        });
        console.log(data);
        setRequest(filt);
      }
    } catch (error) {}
  };

  const editKH = async () => {
    const config = {
      ...endpoints.editKH,
      endpoint: endpoints.editKH.endpoint + kh.id,
      data: kh,
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

  const addKH = async () => {
    const config = {
      ...endpoints.addKH,
      data: kh,
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
            detail: `Kode ${kh.kh_code} Sudah Digunakan`,
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

  const supp = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element.supplier?.id) {
        selected = element;
      }
    });

    return selected;
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editKH();
      } else {
        setUpdate(true);
        addKH();
      }
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

  const updateKH = (e) => {
    dispatch({
      type: SET_CURRENT_KH,
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
            <PrimeInput
              label={"No. Referensi Koreksi"}
              value={kh.kh_code}
              onChange={(e) => {
                updateKH({ ...kh, kh_code: e.target.value });

                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Nomer Referensi"
              error={error?.code}
            />
          </div>

          <div className="col-2">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${kh.kh_date}Z`)}
              onChange={(e) => {
                updateKH({ ...kh, kh_date: e.value });

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
          <div className="col-6"></div>
          <div className="col-4 mt-3">
            <label className="text-label">Pemasok</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={kh.sup_id ? supp(kh.sup_id) : null}
              option={supplier}
              onChange={(e) => {
                updateKH({
                  ...kh,
                  sup_id: e.supplier?.id,
                });

                let newError = error;
                newError.sup = false;
                setError(newError);
              }}
              label={"[supplier.sup_name]"}
              placeholder="Pilih Pemasok"
              detail
              onDetail={() => setShowSupplier(true)}
              errorMessage="Pemasok Belum Dipilih"
              error={error?.sup}
            />
          </div>
          <div className="col-4 mt-3">
            <label className="text-label">Type Koreksi</label>
            <div className="p-inputgroup">
              <Dropdown
                value={kh.type && kh.type}
                options={rp}
                onChange={(e) => {
                  updateKH({
                    ...kh,
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
              value={kh.acc_lwn && acco(kh.acc_lwn)}
              option={acc}
              onChange={(e) => {
                updateKH({
                  ...kh,
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
          <div className="col-4">
            <PrimeNumber
              label={"Nilai"}
              value={kh.nilai}
              onChange={(e) => {
                updateKH({ ...kh, nilai: e.target.value });

                let newError = error;
                newError.nil = false;
                setError(newError);
              }}
              placeholder="0"
              type="number"
              min={0}
              error={error?.nil}
            />
          </div>
          <div className="col-4">
            <label className="text-label">Tanggal J/T</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${kh.due_date}Z`)}
                onChange={(e) => {
                  updateKH({ ...kh, due_date: e.value });
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
                value={kh.ket}
                onChange={(e) => updateKH({ ...kh, ket: e.target.value })}
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

      <DataSupplier
        data={supplier}
        loading={false}
        popUp={true}
        show={showSupplier}
        onHide={() => {
          setShowSupplier(false);
        }}
        onInput={(e) => {
          setShowSupplier(!e);
        }}
        onSuccessInput={(e) => {
          getSupplier();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSupplier(false);
            updateKH({ ...rp, req_dep: e.data.id });
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
            updateKH({ ...kh, sup_id: e.data.supplier.id });
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

export default KoreksiAPInput;
