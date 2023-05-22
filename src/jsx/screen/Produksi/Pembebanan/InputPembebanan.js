import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { SET_CURRENT_PBB } from "src/redux/actions";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import { Divider } from "@material-ui/core";
import { TabPanel, TabView } from "primereact/tabview";
import DataAkun from "../../Master/Akun/DataAkun";
import { id } from "chartjs-plugin-streaming";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";

const defError = {
  code: false,
  name: false,
  btc: false,
  account: false,
  uph: [
    {
      id: false,
    },
  ],
  ovh: [
    {
      id: false,
    },
  ],
};

const InputPembebanan = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useRef(null);
  const [active, setActive] = useState(0);
  const [doubleClick, setDoubleClick] = useState(false);
  const pbb = useSelector((state) => state.pbb.current);
  const isEdit = useSelector((state) => state.pbb.editPBB);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [showAcc, setShowAcc] = useState(false);
  const [acc, setAcc] = useState(null);
  const [account, setAccount] = useState(null);
  const [batch, setBatch] = useState(null);
  const [error, setError] = useState(defError);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getAcc();
    getBatch();
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
          filt.push(element.account);
        });
        setAcc(filt);
        setAccount(data);
      }
    } catch (error) {}
  };

  const getBatch = async () => {
    const config = {
      ...endpoints.batch,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setBatch(data);
      }
    } catch (error) {}
  };

  const editPBB = async () => {
    const config = {
      ...endpoints.editPBB,
      endpoint: endpoints.editPBB.endpoint + pbb.id,
      data: pbb,
    };

    let response = null;
    try {
      response = await request(null, config);

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

  const addPBB = async () => {
    const config = {
      ...endpoints.addPBB,
      data: pbb,
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        onSuccess();
      }
    } catch (error) {
      if (error.status === 400) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: `Kode ${pbb.pbb_code} Sudah Digunakan`,
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

  const checkAcc = (value) => {
    let selected = {};
    acc?.forEach((element) => {
      if (value === element?.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkbtc = (value) => {
    let selected = {};
    batch?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const isValid = () => {
    let valid = false;
    let active = 1;
    let errors = {
      code: !pbb.pbb_code || pbb.pbb_code === "",
      date: !pbb.pbb_date || pbb.pbb_date === "",
      btc: !pbb.batch_id,
      acc: !pbb.acc_cred || pbb.acc_cred === "",
      uph: [],
      ovh: [],
    };

    pbb?.uph?.forEach((element, i) => {
      if (i > 0) {
        if (element?.acc_id) {
          errors.uph[i] = {
            id: !element?.acc_id,
          };
        }
      } else {
        errors.uph[i] = {
          id: !element?.acc_id,
        };
      }
    });

    pbb?.ovh?.forEach((element, i) => {
      if (i > 0) {
        if (element.acc_id) {
          errors.ovh[i] = {
            id: !element.acc_id,
          };
        }
      } else {
        errors.ovh[i] = {
          id: !element.acc_id,
        };
      }
    });

    if (!errors.uph[0]?.id) {
      errors.ovh?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    if (!errors.ovh[0]?.id) {
      errors.uph?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    let validUpah = false;
    let validOver = false;
    errors.uph?.forEach((el) => {
      for (var k in el) {
        validUpah = !el[k];
      }
    });
    if (!validUpah) {
      errors.ovh?.forEach((el) => {
        for (var k in el) {
          validOver = !el[k];
        }
      });
    }

    valid =
      !errors.code &&
      !errors.date &&
      !errors.btc &&
      !errors.account &&
      (validUpah || validOver);

    setError(errors);

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });

      setActive(active);
    }

    return valid;
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editPBB();
      } else {
        setUpdate(true);
        addPBB();
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

  const updatePBB = (e) => {
    dispatch({
      type: SET_CURRENT_PBB,
      payload: e,
    });
  };

  const glTemplate = (option) => {
    return (
      <div>
        {option !== null ? `${option.acc_name} - ${option.acc_code}` : ""}
      </div>
    );
  };

  const valTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.acc_name} - ${option.acc_code}` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };


  const body = () => {
    return (
      <>
        <Toast ref={toast} />
        <Row className="mb-4">
          <div className="col-2 text-black">
            <PrimeInput
              label={"Kode Pembebanan"}
              value={pbb.pbb_code}
              onChange={(e) => {
                updatePBB({ ...pbb, pbb_code: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode"
              error={error?.code}
            />
          </div>

          <div className="col-3 text-black">
            <PrimeInput
              label={"Nama Pembebanan"}
              value={pbb.pbb_name}
              onChange={(e) => {
                updatePBB({ ...pbb, pbb_name: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Nama Pembebanan"
              error={error?.code}
            />
          </div>

          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${pbb.pbb_date}Z`)}
              onChange={(e) => {
                updatePBB({ ...pbb, pbb_date: e.target.value });
              }}
              placeholder="Pilih Tanggal"
              dateFormat="dd-mm-yy"
              showIcon
              error={error?.date}
            />
          </div>

          <div className="col-12 p-0 text-black">
            <div className="mt-4 mb-2 ml-3 mr-3 fs-13">
              <b>Informasi Batch</b>
            </div>
            <Divider className="mb-2 ml-3 mr-3"></Divider>
          </div>

          <div className="col-2 text-black">
            <label className="text-black">Kode Batch</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={pbb.batch_id && checkbtc(pbb.dept_id)}
              option={batch}
              onChange={(e) => {
                updatePBB({ ...pbb, batch_id: e.id });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              label={"[bcode]"}
              placeholder="Pilih Kode Batch"
              errorMessage="Kode Batch Belum DIpilih"
              error={error?.btc}
            />
          </div>

          <div className="col-3 text-black">
            <label className="text-black">Departement</label>
            <div className="p-inputgroup"></div>
            <PrimeInput
              value={
                pbb.batch_id !== null
                  ? checkbtc(pbb.batch_id)?.dep_id?.ccost_name
                  : ""
              }
              placeholder="Departemen"
              disabled
            />
          </div>

          <div className="col-3 text-black">
            <label className="text-black">Akun Kredit</label>
            <div className="p-inputgroup"></div>
            <PrimeDropdown
              value={pbb.acc_cred && checkAcc(pbb.acc_cred)}
              options={acc}
              onChange={(u) => {
                updatePBB({ ...pbb, acc_cred: u.value?.id ?? null });

                let newError = error;
                newError.id = false;
                setError(newError);
              }}
              filter
              filterBy={"acc_name"}
              optionLabel={"[account.acc_name]"}
              itemTemplate={glTemplate}
              valueTemplate={valTemp}
              placeholder="Pilih Akun Kredit"
              errorMessage="Akun Belum Dipilih"
              error={error?.acc}
              showClear
            />
          </div>

          <div className="col-4 text-black">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputText
                value={pbb.desc}
                onChange={(e) => updatePBB({ ...pbb, desc: e.target.value })}
                placeholder="Masukan Keterangan"
                error={error?.desc}
              />
            </div>
          </div>
        </Row>

        <div className="col-10"></div>

        <TabView
          className="m-1"
          activeIndex={active}
          onTabChange={(e) => setActive(e.index)}
        >
          <TabPanel header="Upah">
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="none"
                  value={pbb.uph?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      // order: v?.order ?? 0,
                    };
                  })}
                  className="display w-150 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    header="Akun Upah"
                    className="col-4 align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.acc_id && checkAcc(e.acc_id)}
                        options={acc}
                        onChange={(u) => {
                          let temp = [...pbb.uph];
                          temp[e.index].acc_id = u?.value?.id ?? null;
                          updatePBB({ ...pbb, uph: temp });

                          let newError = error;
                          newError.uph[e.index].id = false;
                          setError(newError);
                        }}
                        filter
                        filterBy={"acc_name"}
                        optionLabel={"[acc_name]"}
                        itemTemplate={glTemplate}
                        valueTemplate={valTemp}
                        placeholder="Pilih Akun Upah"
                        errorMessage="Akun Belum Dipilih"
                        error={error?.uph[e.index]?.id}
                        showClear
                      />
                    )}
                  />

                  {/* <div className="col-"></div> */}

                  <Column
                    header=""
                    className="align-text-top"
                    field={""}
                    body={(e) =>
                      e.index === pbb.uph.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.uph.push({
                              id: false,
                            });
                            setError(newError);

                            updatePBB({
                              ...pbb,
                              uph: [
                                ...pbb.uph,
                                {
                                  id: 0,
                                  acc_id: null,
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
                            let temp = [...pbb.uph];
                            temp.splice(e.index, 1);
                            updatePBB({ ...pbb, uph: temp });
                          }}
                          className="btn btn-danger shadow btn-xs sharp"
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      )
                    }
                  />
                </DataTable>
              </Card.Body>
            </Card>
          </TabPanel>

          <TabPanel header="Overhead">
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="none"
                  value={pbb.ovh?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      // order: v?.order ?? 0,
                    };
                  })}
                  className="display w-150 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    header="Akun Overhead"
                    className="col-4 align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.acc_id && checkAcc(e.acc_id)}
                        options={acc}
                        onChange={(u) => {
                          let temp = [...pbb.ovh];
                          temp[e.index].acc_id = u.value?.id ?? null;
                          updatePBB({ ...pbb, ovh: temp });

                          let newError = error;
                          newError.ovh[e.index].id = false;
                          setError(newError);
                        }}
                        filter
                        filterBy={"acc_name"}
                        optionLabel={"[acc_name]"}
                        itemTemplate={glTemplate}
                        valueTemplate={valTemp}
                        placeholder="Pilih Akun Overhead"
                        errorMessage="Akun Belum Dipilih"
                        error={error?.ovh[e.index]?.id}
                        showClear
                      />
                    )}
                  />

                  {/* <div className="col-"></div> */}

                  <Column
                    header=""
                    className="align-text-top"
                    field={""}
                    body={(e) =>
                      e.index === pbb.ovh.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.ovh.push({
                              id: false,
                            });
                            setError(newError);

                            updatePBB({
                              ...pbb,
                              ovh: [
                                ...pbb.ovh,
                                {
                                  id: 0,
                                  acc_id: null,
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
                            let temp = [...pbb.ovh];
                            temp.splice(e.index, 1);
                            updatePBB({ ...pbb, ovh: temp });
                          }}
                          className="btn btn-danger shadow btn-xs sharp"
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      )
                    }
                  />
                </DataTable>
              </Card.Body>
            </Card>
          </TabPanel>
        </TabView>

        <div className="row mb-8">
          <span className="mb-8"></span>
        </div>
      </>
    );
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div className="col-12 mt-0 fs-12 text-right">
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
      <Row>
        <Col className="pt-0">
          <>
            {/* {header()} */}
            {body()}
            {footer()}
          </>
        </Col>
      </Row>

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

            let temp = [...pbb.uph];
            temp[currentIndex].acc_id = e.data.account.id;

            let tempm = [...pbb.ovh];
            temp[currentIndex].acc_id = e.data.account.id;
            updatePBB({
              ...pbb,
              acc_cred: e.data.account.id,
              uph: temp,
              ovh: tempm,
            });
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

export default InputPembebanan;
