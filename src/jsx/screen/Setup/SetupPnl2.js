import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Button as PButton } from "primereact/button";
import { endpoints, request } from "src/utils";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_PNL, SET_SETUP_PNL } from "src/redux/actions";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { InputTextarea } from "primereact/inputtextarea";
import { InputSwitch } from "primereact/inputswitch";

const headerTypes = [
  { id: 1, name: "Header" },
  { id: 2, name: "Total" },
];
export default function SetupPnl2() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [klasifikasi, setKlasifikasi] = useState(null);
  const [available, setAvailable] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [displayInput, setDisplayInput] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [update, setUpdate] = useState(false);
  const pnl = useSelector((state) => state.pnl);
  const dispatch = useDispatch();
  const textArea = useRef(null);
  const [currentLabel, setCurrentLabel] = useState({});

  useEffect(() => {
    getKlasifikasi();
  }, []);

  const getKlasifikasi = async () => {
    setLoading(true);
    const config = {
      ...endpoints.klasifikasi,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setKlasifikasi(data);
      }
    } catch (error) {}

    getCompany();
  };

  const getCompany = async () => {
    const config = endpoints.getCompany;
    let response = null;
    try {
      response = await request(null, config);
      console.log("company", response);
      if (response.status) {
        if (
          Object.keys(response.data).length === 0 &&
          response.data.constructor === Object
        ) {
          setAvailable(false);
        } else {
          setAvailable(true);
        }
      }
    } catch (error) {
      setAvailable(false);
    }

    getSetup();
  };

  const getSetup = async () => {
    setLoading(true);
    const config = {
      ...endpoints.getPnl,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        updateSetup(
          data.map((v) => ({
            ...v,
            klasifikasi:
              v.type === 1
                ? v?.klasifikasi !== null
                  ? v.klasifikasi
                  : [null]
                : null,
          }))
        );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const postCompany = async (data) => {
    let config = {
      ...endpoints.addCompany,
      data: {
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
        over_stock: false,
        discount: false,
        tiered: false,
        rp: false,
        over_po: false,
      },
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        if (data.id) {
          editSetup(data);
        } else {
          addSetup(data);
        }
      }
    } catch (error) {}
  };

  const addSetup = async (data) => {
    console.log(
      "DATA=======",
      data.klasifikasi?.filter((v) => v !== null)
    );
    let config = {
      ...endpoints.addPnl,
      data: {
        ...data,
        klasifikasi:
          data.type === 1 ? data.klasifikasi?.filter((v) => v !== null) : null,
      },
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        toast.current.show({
          severity: "info",
          summary: "Berhasil",
          detail: "Data berhasil diperbarui",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: "Gagal memperbarui data",
        life: 3000,
      });
    }

    getSetup();
    setLoadingSubmit(false);
    setDisplayInput(false);
    setCurrentLabel({});
  };

  const editSetup = async (data) => {
    let config = {
      ...endpoints.editPnl,
      endpoint: endpoints.editPnl.endpoint + data.id,
      data: {
        ...data,
        klasifikasi:
          data.type === 1 ? data.klasifikasi?.filter((v) => v !== null) : null,
      },
    };
    console.log("dataaaaaaaaaaa", config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        toast.current.show({
          severity: "info",
          summary: "Berhasil",
          detail: "Data berhasil diperbarui",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: "Gagal memperbarui data",
        life: 3000,
      });
    }

    getSetup();
    setLoadingSubmit(false);
    setDisplayInput(false);
  };

  const delSetup = async (id) => {
    let config = {
      ...endpoints.delPnl,
      endpoint: endpoints.delPnl.endpoint + id,
    };
    console.log("hapus", id);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setUpdate(false);
        setShowDelete(false);
        toast.current.show({
          severity: "info",
          summary: "Berhasil",
          detail: "Data berhasil diperbarui",
          life: 3000,
        });
      }
    } catch (error) {
      setUpdate(false);
      setShowDelete(false);
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: "Gagal memperbarui data",
        life: 3000,
      });
    }
  };

  const checkKlasifikasi = (value) => {
    let selected = {};
    klasifikasi?.forEach((element) => {
      if (Number(value) === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const setCurrent = (payload) => {
    dispatch({
      type: SET_CURRENT_PNL,
      payload: payload,
    });
  };

  const updateSetup = (payload) => {
    dispatch({
      type: SET_SETUP_PNL,
      payload: payload,
    });
  };

  const submitUpdate = (data) => {
    if (available) {
      if (data.id) {
        editSetup(data);
      } else {
        addSetup(data);
      }
    } else {
      postCompany(data);
    }
  };

  const renderFooterDel = (id) => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => {
            setShowDelete(false);
            setLoading(false);
            setUpdate(false);
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Hapus"
          icon="pi pi-trash"
          onClick={() => {
            setUpdate(true);
            setShowDelete(true);
            delSetup(id);
          }}
          autoFocus
          loading={loading}
        />
      </div>
    );
  };

  const renderBody = () => {
    return (
      <Card>
        <Card.Header className="p-3">
          <div className="ml-2">Setup Laba Rugi</div>
          <PrimeSingleButton
            label={"Tambah"}
            icon={<i class="bx bx-plus px-2"></i>}
            onClick={() => {
              setDisplayInput(true);
              setCurrent(pnl.default);
              setEdit(false);
            }}
          />
        </Card.Header>
        <Card.Body className="p-3">
          <Row className="mr-0 ml-0">
            {loading ? (
              <>
                <Skeleton width="200px" />
                <Skeleton className="mt-3" height="45px" />
                <Skeleton className="mt-3" width="200px" />
                <Skeleton className="mt-3" height="45px" />
                <Skeleton className="mt-3" width="200px" />
                <Skeleton className="mt-3" height="45px" />
              </>
            ) : (
              <>
                <Col className="col-12 p-0 pr-2">
                  {pnl?.setup?.map((v, i) => {
                    if (v.type === 1) {
                      return (
                        <Row>
                          <div className="col-12 ml-2 font-bold flex align-items-center">
                            {v.id}. {v.name}
                            <div className="ml-3">
                              <PButton
                                icon="pi pi-pencil"
                                className="p-button-rounded p-button-text p-button-plain p-button-sm p-0"
                                aria-label="Edit"
                                onClick={(ev) => {
                                  setEdit(true);
                                  setDisplayInput(true);
                                }}
                              />
                              <PButton
                                icon="pi pi-trash"
                                className="p-button-rounded p-button-text p-button-plain p-button-sm p-0"
                                aria-label="Delete"
                                onClick={(ev) => {
                                  setShowDelete(true);
                                }}
                              />
                            </div>
                          </div>
                          {v.klasifikasi?.map((e, index) => {
                            return (
                              <>
                                <div
                                  className="ml-4 mb-3"
                                  style={{ width: "94%" }}
                                >
                                  <div className="p-inputgroup pl-4">
                                    <Dropdown
                                      value={checkKlasifikasi(e)}
                                      options={klasifikasi && klasifikasi}
                                      onChange={(a) => {
                                        let temp = pnl.setup;
                                        temp[i].klasifikasi[index] = a.value.id;

                                        updateSetup(temp);
                                        submitUpdate(temp[i]);
                                      }}
                                      optionLabel={(option) => (
                                        <div>
                                          {option !== null
                                            ? `${option.id}. ${option.klasiname}`
                                            : ""}
                                        </div>
                                      )}
                                      filter
                                      filterBy="klasiname"
                                      placeholder="Pilih Klasifikasi"
                                      itemTemplate={(option) => (
                                        <div>
                                          {option !== null
                                            ? `${option.id}. ${option.klasiname}`
                                            : ""}
                                        </div>
                                      )}
                                    />
                                  </div>
                                </div>
                                <div className="ml-3 my-2">
                                  {index === v.klasifikasi?.length - 1 ? (
                                    <Link
                                      onClick={() => {
                                        let temp = pnl.setup;
                                        temp[i].klasifikasi.push(null);

                                        updateSetup(temp);
                                      }}
                                      className="btn btn-primary shadow btn-xs sharp"
                                    >
                                      <i className="fa fa-plus"></i>
                                    </Link>
                                  ) : (
                                    <Link
                                      onClick={() => {
                                        let temp = pnl.setup;
                                        temp[i].klasifikasi.splice(index, 1);

                                        updateSetup(temp);
                                        submitUpdate(temp[i]);
                                        setShowDelete(pnl.default);
                                      }}
                                      className="btn btn-danger shadow btn-xs sharp"
                                    >
                                      <i className="fa fa-trash"></i>
                                    </Link>
                                  )}
                                </div>
                              </>
                            );
                          })}
                        </Row>
                      );
                    }
                    return (
                      <Row>
                        <div className="col-12 ml-2 font-bold flex align-items-center">
                          {v.id}. {v.name} [{v.rule}]
                          <div className="ml-3">
                            <PButton
                              icon="pi pi-pencil"
                              className="p-button-rounded p-button-text p-button-plain p-button-sm p-0"
                              aria-label="Edit"
                              onClick={(ev) => {}}
                            />
                            <PButton
                              icon="pi pi-trash"
                              className="p-button-rounded p-button-text p-button-plain p-button-sm p-0"
                              aria-label="Delete"
                              onClick={(ev) => {}}
                            />
                          </div>
                        </div>
                      </Row>
                    );
                  })}
                </Col>
              </>
            )}
          </Row>
        </Card.Body>
      </Card>
    );
  };

  const renderFooter = () => {
    return (
      <div>
        <PButton
          label="Batal"
          onClick={() => setDisplayInput(false)}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Simpan"
          icon="pi pi-check"
          onClick={() => {
            setLoadingSubmit(true);
            submitUpdate(pnl.current);
          }}
          autoFocus
          loading={loadingSubmit}
        />
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="col-12">{renderBody()}</Col>
      </Row>

      <Dialog
        header={isEdit ? "Edit Label" : "Tambah Label"}
        visible={displayInput}
        style={{ width: "40vw" }}
        footer={renderFooter("displayData")}
        onHide={() => {
          setEdit(false);
          setDisplayInput(false);
        }}
      >
        <div className="row mr-0 ml-0">
          <div className="col-12">
            <label className="text-label">Label</label>
            <div className="p-inputgroup">
              <InputText
                value={console.log(pnl.current?.name ?? "")}
                onChange={(e) => {
                  setCurrent({ ...pnl.current, name: e.target.value });
                }}
                placeholder="Masukan Label"
              />
            </div>
          </div>
          <div className="col-12">
            <label className="text-label">Type</label>
            <SelectButton
              value={
                pnl?.current?.type === 2
                  ? { id: 2, name: "Total" }
                  : { id: 1, name: "Header" }
              }
              options={headerTypes}
              onChange={(e) => {
                console.log(e);
                setCurrent({ ...pnl.current, type: e?.value?.id });
              }}
              optionLabel="name"
            />
          </div>

          {pnl?.current?.type === 2 && (
            <>
              <div className="col-6">
                <label className="text-label">Rule</label>
                <div className="p-inputgroup">
                  <InputTextarea
                    value={pnl?.current?.rule ?? ""}
                    ref={textArea}
                    onChange={(e) => {
                      setCurrent({ ...pnl.current, rule: e.target.value });
                    }}
                    placeholder="Total 1 + Total 3 - SUM(2)"
                  />
                </div>
              </div>
              <div className="col-6 mt-3 pl-0">
                <div class="container">
                  <div class="row">
                    <div class="col-12">
                      <div
                        class="scrollable"
                        // style="height: 200px; overflow-y: scroll;"
                        style={{ height: "130px", overflowY: "scroll" }}
                      >
                        <div class="d-inline-flex flex-wrap">
                          {pnl?.setup?.map((v) => (
                            <PButton
                              label={v.type === 1 ? `SUM(${v.name})` : v.name}
                              onClick={() => {
                                let value = v.id;
                                if (v.type === 1) {
                                  value = `SUM(${v.id})`;
                                }
                                setCurrent({
                                  ...pnl.current,
                                  rule:
                                    pnl?.current?.rule !== null
                                      ? pnl?.current?.rule + value
                                      : value,
                                });
                                textArea?.current?.focus();
                              }}
                              className="p-button-outlined p-button-sm mr-2 mb-2 py-2"
                              style={{ borderRadius: "5px" }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex col-12 align-items-center">
                <InputSwitch
                  className="mr-3"
                  inputId="for_balance"
                  checked={pnl?.current?.for_balance}
                  onChange={(e) => {
                    setCurrent({ ...pnl.current, for_balance: e.value });
                  }}
                />
                <label className="mr-3 mt-1" htmlFor="for_balance">
                  {"Total For P/L Current Month"}
                </label>
              </div>
            </>
          )}
        </div>
      </Dialog>

      <Dialog
        header={"Hapus Data"}
        visible={showDelete}
        style={{ width: "30vw" }}
        footer={renderFooterDel}
        onHide={() => {
          setLoading(false);
          setShowDelete(false);
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
}
