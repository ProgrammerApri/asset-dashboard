import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";

import { SET_CURRENT_MM } from "src/redux/actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import DataAkun from "../../Master/Akun/DataAkun";
import DataPusatBiaya from "../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import { tr } from "src/data/tr";

const defError = {
  code: false,
  date: false,
  akn: [
    {
      id: false,
      type: false,
      nom: false,
    },
  ],
};

const dbcr = [
  { code: "d", name: "Debit" },
  { code: "k", name: "Kredit" },
];

const InputMemorial = ({ onCancel, onSuccess }) => {
  const toast = useRef(null);
  const [error, setError] = useState(defError);
  const [update, setUpdate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doubleClick, setDoubleClick] = useState(false);
  const memorial = useSelector((state) => state.memorial.current);
  const isEdit = useSelector((state) => state.memorial.editMemo);
  const dispatch = useDispatch();
  const [setup, setSetup] = useState(null);
  const [showAcc, setShowAcc] = useState(false);
  const [showDep, setShowDep] = useState(false);
  const [account, setAccount] = useState(null);
  const [dept, setDept] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [active, setActive] = useState(0);
  const [state, setState] = useState(0);
  const [stateType, setStateType] = useState("");
  const [accor, setAccor] = useState({
    akun: true,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getAcc();
    getSetup();
    getDept();
    getCurrency();
  }, []);

  const getAcc = async () => {
    const config = {
      ...endpoints.account,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        let filt = [];
        data?.forEach((element) => {
          if (
            element.account.dou_type === "D" &&
            element.account.connect === false
          ) {
            filt.push(element);
          }
        });
        setAccount(filt);
      }
    } catch (error) {}
  };

  const getSetup = async () => {
    const config = {
      ...endpoints.getCompany,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSetup(data);
      }
    } catch (error) {}
  };

  const getDept = async () => {
    const config = {
      ...endpoints.pusatBiaya,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setDept(data);
      }
    } catch (error) {}
  };

  const getCurrency = async () => {
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

  const editMM = async () => {
    const config = {
      ...endpoints.editMM,
      endpoint: endpoints.editMM.endpoint + memorial.id,
      data: memorial,
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
          summary: tr[localStorage.getItem("language")].gagal,
          detail: tr[localStorage.getItem("language")].pesan_gagal,
          life: 3000,
        });
      }, 500);
    }
  };

  const addMM = async () => {
    const config = {
      ...endpoints.addMM,
      data: { ...memorial, date: currentDate(memorial.date) },
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
            summary: tr[localStorage.getItem("language")].gagal,
            detail: `Kode ${memorial.code} Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: tr[localStorage.getItem("language")].gagal,
            detail: tr[localStorage.getItem("language")].pesan_gagal,
            life: 3000,
          });
        }, 500);
      }
    }
  };

  const checkAcc = (value) => {
    let selected = {};
    account?.forEach((element) => {
      if (value === element.account.id) {
        selected = element;
        console.log(selected);
      }
    });

    return selected;
  };

  const checkDept = (value) => {
    let selected = {};
    dept?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const type = (value) => {
    let selected = {};
    dbcr?.forEach((element) => {
      if (value === element.code) {
        selected = element;
      }
    });

    return selected;
  };

  const checkCur = (value) => {
    let selected = {};
    currency?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editMM();
      } else {
        setUpdate(true);
        addMM();
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

  const currentDate = (date) => {
    let now = new Date();
    let newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );
    return newDate.toISOString();
  };

  const updateMM = (e) => {
    dispatch({
      type: SET_CURRENT_MM,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let active = 1;
    let errors = {
      code: !memorial.code || memorial.code === "",
      date: !memorial.date || memorial.date === "",
      akn: [],
    };

    let nom_d = 0;
    let nom_k = 0;

    memorial?.memo.forEach((element, i) => {
      if (i > 0) {
        if (element.acc_id || element.dep_id || element.dbcr || element.amnt) {
          errors.akn[i] = {
            id: !element.acc_id,
            type: !element.dbcr,
            nom: !element.amnt || element.amnt === "" || element.amnt === "0",
          };
        }
      } else {
        errors.akn[i] = {
          id: !element.acc_id,
          type: !element.dbcr,
          nom: !element.amnt || element.amnt === "" || element.amnt === "0",
        };
      }

      if (element.dbcr === "d") {
        nom_d += element.amnt;
      } else {
        nom_k += element.amnt;
      }
    });

    setState(nom_k !== nom_d);
    if (nom_k !== nom_d) {
      toast.current.show({
        severity: "warn",
        summary: "Warning !!",
        detail: "Nominal Debit/Kredit Belum Balance",
        // sticky: true,
        life: 1000,
      });
      if (nom_k < nom_d) {
        errors.akn.forEach((element, i) => {
          if (memorial?.memo[i].dbcr === "k") {
            element.nom = true;
          }
        });
      } else if (nom_d < nom_k) {
        errors?.akn.forEach((element, i) => {
          if (memorial.memo[i].dbcr === "d") {
            element.nom = true;
          }
        });
      }

      if (nom_d) {
        errors?.akn.forEach((element, i) => {
          if (memorial.memo[i].dbcr === "d") {
            element.nom = true;
          }
        });
      }

      if (nom_k) {
        errors?.akn.forEach((element, i) => {
          if (memorial.memo[i].dbcr === "k") {
            element.nom = true;
          }
        });
      }
    }

    let count = errors.akn.length;
    let total_valid = 0;
    errors.akn?.forEach((el, i) => {
      let key_count = 0;
      let key_valid = 0;
      for (var k in el) {
        key_count++;
        if (!el[k]) {
          key_valid++;
        }
      }
      console.log(key_count);
      console.log(`key_valid ${key_valid}`);
      if (key_count === key_valid) {
        total_valid++;
      }
    });

    console.log(count);
    console.log(total_valid);
    let validMemo = count === total_valid;
    valid = !errors.code && !errors.date && validMemo;

    setError(errors);

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });

      // setActive(active);
    }

    return valid;
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Pembelian (PO)</b>
        {/* <b>{isEdit ? "Edit" : "Buat"} Pembelian (PO)</b> */}
      </h4>
    );
  };

  const glTemplate = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.account?.acc_name} - ${option.account?.acc_code}`
          : ""}
      </div>
    );
  };

  const valTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.account?.acc_name} - ${option.account?.acc_code}`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const body = () => {
    let date = new Date(new Date().getFullYear(), setup?.cutoff - 1, 31);
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-2 text-black fs-13">
            <PrimeInput
              label={tr[localStorage.getItem("language")].kd_memo}
              value={memorial.code}
              onChange={(e) => {
                updateMM({ ...memorial, code: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].masuk}
              error={error?.code}
            />
          </div>
          <div className="col-2 text-black fs-13">
            <PrimeCalendar
              label={tr[localStorage.getItem("language")].tgl}
              value={new Date(`${memorial.date}Z`)}
              onChange={(e) => {
                updateMM({ ...memorial, date: e.target.value });

                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].pilih_tgl}
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.date}
              minDate={date}
            />
          </div>

          <div className="col-5 text-black fs-13">
            <label className="text-label">{tr[localStorage.getItem("language")].ket}</label>
            <div className="p-inputgroup">
              <InputText
                value={memorial.desc}
                onChange={(e) =>
                  updateMM({ ...memorial, desc: e.target.value })
                }
                placeholder={tr[localStorage.getItem("language")].masuk}
              />
            </div>
          </div>
          <div className="col-3"></div>

          <div className="col-12 mt-3 p-component">
            <CustomAccordion
              tittle={tr[localStorage.getItem("language")].acc_memo}
              defaultActive={true}
              active={accor.akun}
              onClick={() => {
                setAccor({
                  ...accor,
                  akun: !accor.akun,
                });
              }}
              key={1}
              body={
                <>
                  <DataTable
                    responsiveLayout="scroll"
                    value={memorial.memo?.map((v, i) => {
                      return {
                        ...v,
                        index: i,
                        // order: v?.order ?? 0,
                        // price: v?.price ?? 0,
                      };
                    })}
                    className="display w-150 datatable-wrapper header-white no-border"
                    showGridlines={false}
                    emptyMessage={() => <div></div>}
                  >
                    <Column
                      header={tr[localStorage.getItem("language")].acc_memo}
                      className="align-text-top"
                      field={""}
                      body={(e) => (
                        <PrimeDropdown
                          value={e.acc_id && checkAcc(e?.acc_id)}
                          options={account}
                          onChange={(u) => {
                            let temp = [...memorial.memo];
                            temp[e.index].acc_id = u.value.account.id;
                            // temp[e.index].dbcr = u.dbcr;
                            updateMM({ ...memorial, memo: temp });

                            let newError = error;
                            newError.akn[e.index].id = false;
                            setError(newError);
                          }}
                          detail
                          onDetail={() => {
                            setCurrentIndex(e.index);
                            setShowAcc(true);
                          }}
                          optionLabel="account.acc_name"
                          itemTemplate={glTemplate}
                          valueTemplate={valTemp}
                          filter
                          filterBy={"account.acc_name"}
                          placeholder={tr[localStorage.getItem("language")].pilih}
                          errorMessage="Akun Belum Dipilih"
                          error={error?.akn[e.index]?.id}
                        />
                      )}
                    />
                    <Column
                      header={tr[localStorage.getItem("language")].dep}
                      className="align-text-top"
                      field={""}
                      body={(e) => (
                        <CustomDropdown
                          value={e.dep_id !== null ? checkDept(e.dep_id) : null}
                          option={dept}
                          onChange={(u) => {
                            let temp = [...memorial.memo];
                            temp[e.index].dep_id = u.id;
                            updateMM({ ...memorial, memo: temp });
                          }}
                          detail
                          onDetail={() => {
                            setCurrentIndex(e.index);
                            setShowDep(true);
                          }}
                          label={"[ccost_name] ([ccost_code])"}
                          placeholder={tr[localStorage.getItem("language")].pilih}
                        />
                      )}
                    />

                    <Column
                      header="Debit/Kredit "
                      className="align-text-top"
                      field={""}
                      body={(e) => (
                        <PrimeDropdown
                          value={e.dbcr && type(e.dbcr)}
                          options={dbcr}
                          onChange={(u) => {
                            let temp = [...memorial.memo];
                            temp[e.index].dbcr = u.value.code;
                            updateMM({ ...memorial, memo: temp });

                            let newError = error;
                            newError.akn[e.index].type = false;
                            newError.akn[e.index].nom = false;
                            setError(newError);
                          }}
                          optionLabel="name"
                          placeholder="D/K"
                          errorMessage="Type Belum Dipilih"
                          error={error?.akn[e.index]?.type}
                        />
                      )}
                    />
                    <Column
                      header="Nominal Debit/Kredit"
                      className="align-text-top"
                      field={""}
                      body={(e) => (
                        <PrimeNumber
                          price
                          value={e.amnt && e.amnt}
                          onChange={(u) => {
                            let temp = [...memorial.memo];
                            temp[e.index].amnt = u.value;
                            updateMM({ ...memorial, memo: temp });

                            let newError = error;
                            newError.akn[e.index].nom = false;
                            newError.akn.push({
                              nom: false,
                            });
                            setError(newError);
                          }}
                          min={0}
                          type="number"
                          placeholder="0"
                          error={error?.akn[e.index]?.nom}
                          errorMessage={state ? "Nominal Belum Balance" : null}
                        />
                      )}
                    />
                    <Column
                      header={tr[localStorage.getItem("language")].ket}
                      className="align-text-top"
                      field={""}
                      body={(e) => (
                        <PrimeInput
                          value={e.desc && e.desc}
                          onChange={(u) => {
                            let temp = [...memorial.memo];
                            temp[e.index].desc = u.target.value;
                            updateMM({ ...memorial, memo: temp });
                          }}
                          placeholder={tr[localStorage.getItem("language")].ket}
                        />
                      )}
                    />
                    <Column
                      header=""
                      className="align-text-top"
                      field={""}
                      body={(e) =>
                        e.index === memorial.memo.length - 1 ? (
                          <Link
                            onClick={() => {
                              let newError = error;
                              newError.akn.push({
                                id: false,
                                type: false,
                                nom: false,
                              });
                              setError(newError);

                              updateMM({
                                ...memorial,
                                memo: [
                                  ...memorial.memo,
                                  {
                                    id: 0,
                                    acc_id: null,
                                    dep_id: null,
                                    currency: null,
                                    dbcr: null,
                                    amnt: null,
                                    amnh: 0,
                                    desc: null,
                                  },
                                ],
                              });
                            }}
                            className="btn btn-primary shadow btn-xs sharp"
                          >
                            <i className="fa fa-plus"></i>
                          </Link>
                        ) : (
                          <Link
                            onClick={() => {
                              let newError = error;
                              newError.akn.push({
                                id: false,
                                type: false,
                                nom: false,
                              });
                              setError(newError);

                              let temp = [...memorial.memo];
                              temp.splice(e.index, 1);
                              updateMM({ ...memorial, memo: temp });
                            }}
                            className="btn btn-danger shadow btn-xs sharp"
                          >
                            <i className="fa fa-trash"></i>
                          </Link>
                        )
                      }
                    />
                  </DataTable>
                </>
              }
            />
          </div>
        </Row>
      </>
    );
  };

  const getIndex = () => {
    let total = 0;
    memorial?.product?.forEach((el) => {
      total += el.index;
    });

    return total;
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div className="justify-content-left col-6"></div>

        <div className="row justify-content-right col-6">
          <div className="col-12 mt-0 fs-12 text-right">
            <PButton
              label={tr[localStorage.getItem("language")].batal}
              onClick={onCancel}
              className="p-button-text btn-primary"
            />
            <PButton
              label={tr[localStorage.getItem("language")].simpan}
              icon="pi pi-check"
              onClick={() => onSubmit()}
              autoFocus
              loading={update}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Row>
        <Col className="pt-0 pb-0">
          <>
            {/* {header()} */}
            {body()}
            {footer()}
          </>
        </Col>
      </Row>

      <DataAkun
        data={account}
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

            let temp = [...memorial.memo];
            temp[currentIndex].acc_id = e.data.account.id;
            temp[currentIndex].acc_type = e.data.id;
            updateMM({ ...memorial, memo: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataPusatBiaya
        data={dept}
        loading={false}
        popUp={true}
        show={showDep}
        onHide={() => {
          setShowDep(false);
        }}
        onInput={(e) => {
          setShowDep(!e);
        }}
        onSuccessInput={(e) => {
          getDept();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowDep(false);
            let temp = [...memorial.memo];
            temp[currentIndex].dep_id = e.data.id;
            updateMM({ ...memorial, memo: temp });
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

export default InputMemorial;
