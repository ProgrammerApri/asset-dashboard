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

const set = {
  id: 0,
  klasi: [null],
};

const SetupPnl = () => {
  const toast = useRef(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [setup, setSetup] = useState(set);
  const [available, setAvailable] = useState(false);
  const [klasifikasi, setKlasifikasi] = useState(null);
  const [accor, setAccor] = useState({
    aktiva: true,
    passiva: true,
  });

  useEffect(() => {
    getKlasifikasi();
  }, []);

  const getKlasifikasi = async (isUpdate = false) => {
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
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }

    getCompany();
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
        let d = data;
        for (var key in d) {
          if (key !== "id" && key !== "cp_id") {
            let val = [];
            if (d[key]) {
              d[key].forEach((el) => {
                if (el) {
                  val.push(Number(el));
                }
              });
              d[key] = val.length > 0 ? val : null;
            } else {
              d[key] = [null]
            }
          }
        }
        console.log(d);
        setSetup(d);
      } else {
        setSetup(set);
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
        addSetup(data);
      }
    } catch (error) {}
  };

  const addSetup = async (data) => {
    let d = data;
    for (var key in d) {
      if (key !== "id" && key !== "cp_id") {
        let val = [];
        d[key].forEach((el) => {
          if (el) {
            val.push(Number(el));
          }
        });
        d[key] = val.length > 0 ? val : null;
      }
    }
    let config = {
      ...endpoints.addPnl,
      data: d,
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

  const editSetup = async (data) => {
    let d = data;
    for (var key in d) {
      if (key !== "id" && key !== "cp_id") {
        let val = [];
        d[key].forEach((el) => {
          if (el) {
            val.push(Number(el));
          }
        });
        d[key] = val.length > 0 ? val : null;
      }
    }
    let config = {
      ...endpoints.editPnl,
      endpoint: endpoints.editPnl.endpoint + data.id,
      data: d,
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

  const checkKlasifikasi = (value) => {
    let selected = {};
    klasifikasi?.forEach((element) => {
      if (value === element.id) {
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
                      value={checkKlasifikasi(e.id)}
                      options={klasifikasi && klasifikasi}
                      onChange={(a) => {
                        onChange(e, a.value.id);
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

  const renderAktiva = () => {
    return (
      <CustomAccordion
        tittle={"Laba Rugi"}
        active={accor.aktiva}
        key={1}
        defaultActive={true}
        onClick={() => {
          setAccor({
            ...accor,
            aktiva: !accor.aktiva,
          });
        }}
        body={
          <Row className="mr-0 ml-0">
            {renderKategoriDropdown(
              "Klasifikasi",
              setup?.klasi ?? [null],
              (e, id) => {
                let temp = setup.klasi;
                temp[e.index] = id;
                setSetup({ ...setup, klasi: temp });
                submitUpdate({ ...setup, klasi: temp });
              },
              true,
              (e) => {
                setSetup({ ...setup, klasi: [...setup.klasi, null] });
              },
              (e) => {
                let temp = setup.klasi;
                temp.splice(e.index, 1);
                setSetup({ ...setup, klasi: temp });
                submitUpdate({ ...setup, klasi: temp });
              }
            )}
          </Row>
        }
      />
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="col-lg-12 col-sm-12 col-xs-12">{renderAktiva()}</Col>
      </Row>
    </>
  );
};

export default SetupPnl;
