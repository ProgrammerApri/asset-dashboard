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
  const [accor, setAccor] = useState({
    aktiva: true,
    passiva: true,
  });

  useEffect(() => {
    // getAccount();
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
      ...endpoints.addNeraca,
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
      ...endpoints.editNeraca,
      endpoint: endpoints.editNeraca.endpoint + data.id,
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

  const checkKategory = (value) => {
    let selected = {};
    kategori?.forEach((element) => {
      if (value === element.kategory.id) {
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
        tittle={"Aktiva"}
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
              "Current Asset",
              setup?.cur ?? [null],
              (e, id) => {
                let temp = setup.cur;
                temp[e.index] = id;
                setSetup({ ...setup, cur: temp });
                submitUpdate({ ...setup, cur: temp });
              },
              true,
              (e) => {
                setSetup({ ...setup, cur: [...setup.cur, 0] });
              },
              (e) => {
                let temp = setup.cur;
                temp.splice(e.index, 1);
                setSetup({ ...setup, cur: temp });
                submitUpdate({ ...setup, cur: temp });
              }
            )}
            {renderKategoriDropdown(
              "Fixed Asset",
              setup?.fixed ?? [null],
              (e, id) => {
                let temp = setup.fixed;
                temp[e.index] = id;
                setSetup({ ...setup, fixed: temp });
                submitUpdate({ ...setup, fixed: temp });
              },
              true,
              (e) => {
                setSetup({ ...setup, fixed: [...setup.fixed, 0] });
              },
              (e) => {
                let temp = setup.fixed;
                temp.splice(e.index, 1);
                setSetup({ ...setup, fixed: temp });
                submitUpdate({ ...setup, fixed: temp });
              }
            )}
            {renderKategoriDropdown(
              "Depreciation",
              setup?.depr ?? [null],
              (e, id) => {
                let temp = setup.depr;
                temp[e.index] = id;
                setSetup({ ...setup, depr: temp });
                submitUpdate({ ...setup, depr: temp });
              },
              true,
              (e) => {
                setSetup({ ...setup, depr: [...setup.depr, 0] });
              },
              (e) => {
                let temp = setup.depr;
                temp.splice(e.index, 1);
                setSetup({ ...setup, depr: temp });
                submitUpdate({ ...setup, depr: temp });
              }
            )}
          </Row>
        }
      />
    );
  };

  const renderPassiva = () => {
    return (
      <CustomAccordion
        tittle={"Pasiva"}
        active={accor?.passiva ?? [null]}
        key={1}
        defaultActive={true}
        onClick={() => {
          setAccor({
            ...accor,
            passiva: !accor.passiva,
          });
        }}
        body={
          <Row className="mr-0 ml-0">
            {renderKategoriDropdown(
              "Payable",
              setup?.ap ?? [null],
              (e, id) => {
                let temp = setup.ap;
                temp[e.index] = id;
                setSetup({ ...setup, ap: temp });
                submitUpdate({ ...setup, ap: temp });
              },
              true,
              (e) => {
                setSetup({ ...setup, ap: [...setup.ap, 0] });
              },
              (e) => {
                let temp = setup.ap;
                temp.splice(e.index, 1);
                setSetup({ ...setup, ap: temp });
                submitUpdate({ ...setup, ap: temp });
              }
            )}
            {renderKategoriDropdown(
              "Capital",
              setup?.cap ?? [null],
              (e, id) => {
                let temp = setup.cap;
                temp[e.index] = id;
                setSetup({ ...setup, cap: temp });
                submitUpdate({ ...setup, cap: temp });
              },
              true,
              (e) => {
                setSetup({ ...setup, cap: [...setup.cap, 0] });
              },
              (e) => {
                let temp = setup.cap;
                temp.splice(e.index, 1);
                setSetup({ ...setup, cap: temp });
                submitUpdate({ ...setup, cap: temp });
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
        <Col className="col-lg-6 col-sm-12 col-xs-12">{renderAktiva()}</Col>

        <Col className="col-lg-6 col-sm-12 col-xs-12">{renderPassiva()}</Col>
      </Row>
    </>
  );
};

export default SetupNeraca;
