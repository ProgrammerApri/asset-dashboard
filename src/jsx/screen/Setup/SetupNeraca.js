import React, { useEffect, useState, useRef } from "react";
import { Card, Row, Col, Accordion } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";
import { endpoints, request } from "src/utils";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { tr } from "src/data/tr";
import { Button as PButton } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";

const set = {
  id: 0,
  cp_id: null,
  cur: [null],
  fixed: [null],
  depr: [null],
  ap: [null],
  cap: [null],
};

const SetupNeraca = () => {
  const toast = useRef(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [setup, setSetup] = useState(set);
  const [available, setAvailable] = useState(false);
  const [kategori, setKategori] = useState(null);
  const [isEdit, setEdit] = useState(false);
  const [displayInput, setDisplayInput] = useState(false);
  const [displaySetting, setDisplaySetting] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [current, setCurrent] = useState({
    tittle: null,
    type: null,
    accounts: [],
  });
  const [exept, setExept] = useState(null);
  const [accor, setAccor] = useState({
    aktiva: true,
    passiva: true,
  });

  useEffect(() => {
    getAcc();
    getKategori();
  }, []);

  const getKategori = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.kategori,
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
        setKategori(data);
      }
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }

    getCompany();
  };

  const getAcc = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.account,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setAccount(data);
      }
    } catch (error) {}
  };

  const getCompany = async () => {
    const config = endpoints.getCompany;
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
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

  const getSetup = async (needLoading = true) => {
    setLoading(needLoading);
    const config = {
      ...endpoints.getNeraca,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let d = data;
        setSetup(d);
      } else {
        setSetup(set);
      }
      setLoading(false);
    } catch (error) {
      console.log("-------------------");
      console.log(error);
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
        addSetup(data);
      }
    } catch (error) {}
  };

  const addSetup = async (data) => {
    let config = {
      ...endpoints.addNeraca,
      data: data,
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setDisplayInput(false);
        toast.current.show({
          severity: "info",
          summary: "Berhasil",
          detail: "Data berhasil diperbarui",
          life: 3000,
        });
        setLoadingSubmit(false);
        setCurrent({
          tittle: null,
          type: null,
          accounts: [],
        });
      }
    } catch (error) {
      setLoadingSubmit(false);
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: "Gagal memperbarui data",
        life: 3000,
      });
    }

    getSetup(false);
  };

  const editSetup = async (data) => {
    let config = {
      ...endpoints.editNeraca,
      endpoint: endpoints.editNeraca.endpoint + data.id,
      data: {
        tittle: data.name,
        accounts: data.category.filter((v) => v !== 0),
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

    getSetup(false);
  };

  const submitUpdate = (data) => {
    if (data.id) {
      editSetup(data);
    }
  };

  const checkKategory = (value) => {
    let selected = {};
    kategori?.forEach((element) => {
      if (value === element.kategory.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkAcc = (value) => {
    let selected = {};
    account?.forEach((element) => {
      if (value === element.account.id) {
        selected = element;
      }
    });

    return selected;
  };

  const renderKategoriDropdown = (
    label,
    value,
    onChange,
    expanded = false,
    onAdd,
    onRemove
  ) => {
    return (
      <div className={`${expanded ? "col-12" : "col-6"} mb-2 p-0`}>
        {loading ? (
          <>
            <Skeleton width="200px" />
            <Skeleton className="mt-3" height="45px" />
          </>
        ) : (
          <>
            <DataTable
              responsiveLayout="scroll"
              value={value?.map((e, i) => {
                return { index: i, id: Number(e) };
              })}
              className="display w-150 datatable-wrapper header-white no-border"
              showGridlines={false}
              emptyMessage={() => <div></div>}
            >
              <Column
                header={label}
                className="align-text-top p-2"
                field={""}
                body={(e) => (
                  <div className="p-inputgroup">
                    <Dropdown
                      value={checkKategory(e.id)}
                      options={kategori && kategori}
                      onChange={(a) => {
                        onChange(e, a.value.kategory.id);
                      }}
                      optionLabel={(option) => (
                        <div>
                          {option !== null
                            ? `${option.kategory.id}. ${option.kategory.name}`
                            : ""}
                        </div>
                      )}
                      filter
                      filterBy="kategory.name"
                      placeholder="Pilih Kategori"
                      itemTemplate={(option) => (
                        <div>
                          {option !== null
                            ? `${option.kategory.id}. ${option.kategory.name}`
                            : ""}
                        </div>
                      )}
                    />
                  </div>
                )}
              />
              <Column
                header=""
                className="align-text-top"
                field={""}
                style={{
                  width: "3rem",
                }}
                body={(e) =>
                  e.index === value.length - 1 ? (
                    <Link
                      onClick={() => {
                        onAdd(e);
                        console.log(setup.id);
                      }}
                      className="btn btn-primary shadow btn-xs sharp"
                    >
                      <i className="fa fa-plus"></i>
                    </Link>
                  ) : (
                    <Link
                      onClick={() => {
                        onRemove(e);
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
        )}
      </div>
    );
  };

  const renderSetting = () => {
    return (
      <div className="d-flex">
        <div className="col-3">
          <Link
            onClick={() => {
              setEdit(true);
              setDisplayInput(true);
            }}
            // style={{width: "3rem"}}
            className="btn btn-primary shadow btn-xs sharp"
          >
            <i className="fa fa-pencil"></i>
          </Link>
        </div>

        <div className="col-3">
          <Link
            onClick={() => {
              // setExept({ ...exept, accounts: null });
              setDisplaySetting(true);
            }}
            // style={{width: "3rem"}}
            className="btn btn-info shadow btn-xs sharp"
          >
            <i className="fa fa-edit"></i>
          </Link>
        </div>
      </div>
    );
  };

  const renderAktiva = () => {
    return (
      <Card>
        <Card.Header className="p-3">
          <div className="ml-2">Aktiva</div>
          <PrimeSingleButton
            label={tr[localStorage.getItem("language")].tambh}
            icon={<i class="bx bx-plus px-2"></i>}
            onClick={() => {
              setDisplayInput(true);
              setCurrent({ ...current, type: 1 });
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
              setup?.aktiva?.map((v, i) => {
                return (
                  <>
                    {renderSetting()}
                    {renderKategoriDropdown(
                      v.name,
                      v.category ?? [null],
                      (e, id) => {
                        let temp = setup.aktiva;
                        temp[i].category[e.index] = id;

                        setSetup({ ...setup, aktiva: temp });
                        submitUpdate(temp[i]);
                      },
                      true,
                      (e) => {
                        let temp = setup.aktiva;
                        temp[i].category.push(0);

                        setSetup({ ...setup, aktiva: temp });
                      },
                      (e) => {
                        let temp = setup.aktiva;
                        temp[i].category.splice(e.index, 1);

                        setSetup({ ...setup, aktiva: temp });
                        submitUpdate(temp[i]);
                      }
                    )}
                  </>
                );
              })
            )}
          </Row>
        </Card.Body>
      </Card>
    );
  };

  const renderPassiva = () => {
    return (
      <Card>
        <Card.Header className="p-3">
          <div className="ml-2">Pasiva</div>
          <PrimeSingleButton
            label={tr[localStorage.getItem("language")].tambh}
            icon={<i class="bx bx-plus px-2"></i>}
            onClick={() => {
              setDisplayInput(true);
              setCurrent({ ...current, type: 2 });
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
              setup?.pasiva?.map((v, i) => {
                return (
                  <>
                    {renderKategoriDropdown(
                      v.name,
                      v.category ?? [null],
                      (e, id) => {
                        let temp = setup.pasiva;
                        temp[i].category[e.index] = id;

                        setSetup({ ...setup, pasiva: temp });
                        submitUpdate(temp[i]);
                      },
                      true,
                      (e) => {
                        let temp = setup.pasiva;
                        temp[i].category.push(0);

                        setSetup({ ...setup, pasiva: temp });
                      },
                      (e) => {
                        let temp = setup.pasiva;
                        temp[i].category.splice(e.index, 1);

                        setSetup({ ...setup, pasiva: temp });
                        submitUpdate(temp[i]);
                      }
                    )}
                  </>
                );
              })
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
          onClick={() => {
            setDisplayInput(false);
            setCurrent({
              tittle: null,
              type: null,
              accounts: [],
            });
          }}
          className="p-button-text btn-primary"
        />
        <PButton
          label="Simpan"
          icon="pi pi-check"
          onClick={() => {
            setLoadingSubmit(true);
            if (isEdit) {
              if (available) {
                editSetup(current);
              } else {
                postCompany(current);
              }
            } else {
              if (available) {
                addSetup(current);
              } else {
                postCompany(current);
              }
            }
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
        <Col className="col-lg-6 col-sm-12 col-xs-12">{renderAktiva()}</Col>

        <Col className="col-lg-6 col-sm-12 col-xs-12">{renderPassiva()}</Col>
      </Row>

      <Dialog
        header={isEdit ? "Edit Sub Neraca" : "Tambah Sub Neraca"}
        visible={displayInput}
        style={{ width: "30vw" }}
        footer={renderFooter()}
        onHide={() => {
          setEdit(false);
          setDisplayInput(false);
          setCurrent({
            tittle: null,
            type: null,
            accounts: [],
          });
        }}
      >
        <div className="row mr-0 ml-0">
          <div className="col-12">
            <label className="text-label">Judul Sub</label>
            <div className="p-inputgroup">
              <InputText
                value={current.tittle}
                onChange={(e) => {
                  setCurrent({ ...current, tittle: e.target.value });
                }}
                placeholder="Masukan Judul Sub"
              />
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        header={"Setting Exeption Neraca"}
        visible={displaySetting}
        style={{ width: "30vw" }}
        footer={renderFooter()}
        onHide={() => {
          setEdit(false);
          setDisplaySetting(false);
          setExept(false);
        }}
      >
        <Row>

          {/* {exept?.account?.map((v, i) => { */}
          {/* return ( */}
          <div className="row col-12 mr-0 ml-0 mt-0">
            <div className="col-10">
              <label className="text-label">Akun</label>
              <div className="p-inputgroup">
                <Dropdown
                  value={checkAcc(exept?.accounts)}
                  options={account}
                  onChange={(a) => {
                    setExept({ ...exept, accounts: a.value.account.id });
                  }}
                  optionLabel={(option) => (
                    <div>
                      {option !== null
                        ? `${option.account.acc_code}. ${option.account.acc_name}`
                        : ""}
                    </div>
                  )}
                  filter
                  filterBy="account.acc_name"
                  placeholder="Pilih Akun"
                  itemTemplate={(option) => (
                    <div>
                      {option !== null
                        ? `${option.account.acc_code}. ${option.account.acc_name}`
                        : ""}
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="col-1 d-flex ml-0 mr-0">
              <div className="mt-4">
                {exept === exept?.accounts?.length - 1 ? (
                  <Link
                    onClick={() => {
                      setExept({
                        ...exept,
                        accounts: [
                          ...exept.accounts,
                          {
                            accounts: null,
                          },
                        ],
                      });
                    }}
                    className="btn btn-primary shadow btn-xs sharp ml-1"
                  >
                    <i className="fa fa-plus"></i>
                  </Link>
                ) : (
                  <Link
                    onClick={() => {
                      let temp = [...exept.accounts];
                      temp.splice(exept, 1);
                      setExept({
                        ...exept,
                        accounts: temp,
                      });
                    }}
                    className="btn btn-danger shadow btn-xs sharp ml-1"
                  >
                    <i className="fa fa-trash"></i>
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/* );
          })} */}
        </Row>
      </Dialog>
    </>
  );
};

export default SetupNeraca;
