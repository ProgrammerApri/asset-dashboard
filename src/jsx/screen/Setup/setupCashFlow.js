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
import { SelectButton } from "primereact/selectbutton";

const set = {
  id: 0,
  cp_id: null,
  adj: [null],
  iod: [null],
  asset_sell: [null],
  asset_buy: [null],
  in_sld: [null],
  dec_sld: [null],
  adj_opt: ["+"],
  iod_opt: ["+"],
  asset_sell_opt: ["+"],
  asset_buy_opt: ["+"],
  in_sld_opt: ["+"],
  dec_sld_opt: ["+"],
};

const SetupCashFlow = () => {
  const toast = useRef(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [setup, setSetup] = useState(set);
  const [available, setAvailable] = useState(false);
  const [kategori, setKategori] = useState(null);
  const [type, setType] = useState("-");
  const options = ["+", "-"];
  const [accor, setAccor] = useState({
    aktivitasO: true,
    ainvestasi: true,
    AktivitasP: true,
  });
  // const type = [
  //   { name: "+", kode: 1 },
  //   { name: "-", kode: 2 },
  // ];

  useEffect(() => {
    getAccount();
    // getKategori();
  }, []);

  const getAccount = async () => {
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

    setLoading(false);
    getSetup();
  };

  const getSetup = async (needLoading = true) => {
    setLoading(needLoading);
    const config = {
      ...endpoints.getCflow,
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
          if (key !== "id" && key !== "cp_id" && key !== "user_id") {
            let val = [];
            if (d[key]) {
              d[key].forEach((el) => {
                if (el) {
                  if (key.includes("opt")) {
                    val.push(el);
                  } else {
                    val.push(Number(el));
                  }
                }
              });
              d[key] = val.length > 0 ? val : null;
            } else {
              d[key] = [null];
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
      if (key !== "id" && key !== "cp_id" && key !== "user_id") {
        let val = [];
        d[key].forEach((el) => {
          if (el) {
            if (key.includes("opt")) {
              val.push(el);
            } else {
              val.push(Number(el));
            }
          }
        });
        d[key] = val.length > 0 ? val : null;
      }
    }
    let config = {
      ...endpoints.addCflow,
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
  const checkAcc = (value) => {
    let selected = {};
    account?.forEach((element) => {
      if (value === element.account?.id) {
        selected = element;
      }
    });

    return selected;
  };
  const editSetup = async (data) => {
    let d = data;
    for (var key in d) {
      if (key !== "id" && key !== "cp_id" && key !== "user_id") {
        let val = [];
        d[key].forEach((el) => {
          if (el) {
            if (key.includes("opt")) {
              val.push(el);
            } else {
              val.push(Number(el));
            }
          }
        });
        d[key] = val.length > 0 ? val : null;
      }
    }
    let config = {
      ...endpoints.editCflow,
      endpoint: endpoints.editCflow.endpoint + data.id,
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

  const renderKategoriDropdown = (
    label,
    value,
    opt,
    onChange,
    onChangeOption,
    expanded = false,
    onAdd,
    onRemove,
    e
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
                return { index: i, id: Number(e), key: i }; // add a unique identifier to each item
              })}
              className="display w-150 datatable-wrapper header-white no-border"
              showGridlines={false}
              emptyMessage={() => <div></div>}
            >
              <Column
                header={label}
                className="p-0 ml-xs "
                field={""}
                style={{
                  width: "7rem",
                }}
                body={(e) => (
                  <SelectButton
                    value={opt[e.index]}
                    options={options}
                    onChange={(a) => {
                      onChangeOption(e, a.value);
                    }}
                  />
                )}
              />
              <Column
                header=""
                className="align-text-top p-2"
                field={""}
                key={e?.key} // use the unique identifier as the key prop
                body={(e) => (
                  <div className="p-inputgroup">
                    <Dropdown
                      value={checkAcc(e.id)}
                      options={account && account}
                      onChange={(a) => {
                        onChange(e, a.value.account.id);
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
                      disabled={value.length >= 1}
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

  const renderAktivitasO = () => {
    return (
      <CustomAccordion
        tittle={"Aktivitas Operasi"}
        ArusKas={accor.aktivitasO}
        key={1}
        defaultActive={true}
        onClick={() => {
          setAccor({
            ...accor,
            aktivitasO: !accor.aktivitasO,
          });
        }}
        body={
          <Row className="mr-0 ml-0">
            {renderKategoriDropdown(
              "Penyesuaian",
              setup?.adj ?? [null],
              setup.adj_opt ?? [null],
              (e, id) => {
                let temp = setup.adj;
                temp[e.index] = id;
                let opt = setup.adj_opt;
                temp[e.index] = id;
                setSetup({ ...setup, adj: temp });
                submitUpdate({ ...setup, adj: temp, adj_opt: opt });
              },
              (e, v) => {
                let temp = setup.adj_opt;
                temp[e.index] = v ?? "+";
                console.log(temp);
                setSetup({ ...setup, adj_opt: temp });
                submitUpdate({ ...setup, adj_opt: temp, adj: setup.adj });
              },
              true,
              (e) => {
                setSetup({
                  ...setup,
                  adj: [...setup.adj, 0],
                  adj_opt: [...setup.adj_opt, "+"],
                });
              },
              (e) => {
                let temp = setup.adj;
                temp.splice(e.index, 1);
                let opt = setup.adj_opt;
                opt.splice(e.index);
                setSetup({ ...setup, adj: temp, adj_opt: opt });
                submitUpdate({ ...setup, adj: temp, adj_opt: opt });
              }
            )}
            {renderKategoriDropdown(
              "Kenaikan/Penurunan",
              setup?.iod ?? [null],
              setup.iod_opt ?? [null],
              (e, id) => {
                let temp = setup.iod;
                temp[e.index] = id;
                setSetup({ ...setup, iod: temp });
                submitUpdate({ ...setup, iod: temp, iod_opt: setup.iod_opt });
              },
              (e, c) => {
                let temp = set.iod_opt;
                temp[e.index] = c ?? "+";
                setSetup({ ...setup, iod_opt: temp });
                submitUpdate({ ...setup, iod_opt: temp, iod: setup.iod });
              },
              true,
              (e) => {
                setSetup({
                  ...setup,
                  iod: [...setup.iod, 0],
                  iod_opt: [...setup.iod_opt, "+"],
                });
              },
              (e) => {
                let temp = setup.iod;
                temp.splice(e.index, 1);
                let opt = setup.iod_opt;
                opt.splice(e.index);
                setSetup({ ...setup, iod: temp, iod_opt: opt });
                submitUpdate({ ...setup, iod: temp, iod_opt: opt });
              }
            )}
          </Row>
        }
      />
    );
  };

  const renderAktivitasPendanaan = () => {
    return (
      <CustomAccordion
        tittle={"Aktivitas Pendanaan"}
        ArusKas={accor.AktivitasP}
        key={1}
        defaultActive={true}
        onClick={() => {
          setAccor({
            ...accor,
            AktivitasP: !accor.AktivitasP,
          });
        }}
        body={
          <Row className="mr-0 ml-0">
            {renderKategoriDropdown(
              "Penambahan Dana",
              setup?.in_sld ?? [null],
              setup.in_sld_opt ?? [null],
              (e, id) => {
                let temp = setup.in_sld;
                temp[e.index] = id;
                setSetup({ ...setup, in_sld: temp });
                submitUpdate({
                  ...setup,
                  in_sld: temp,
                  in_sld_opt: setup.in_sld_opt,
                });
              },

              (e, l) => {
                let temp = setup.in_sld_opt;
                temp[e.index] = l ?? "+";
                setSetup({ ...setup, in_sld_opt: temp });
                submitUpdate({ ...setup, in_sld_opt: temp, in_sld: setup.adj });
              },
              true,
              (e) => {
                setSetup({
                  ...setup,
                  in_sld: [...setup.in_sld, 0],
                  in_sld_opt: [...setup.in_sld, "+"],
                });
              },
              (e) => {
                let temp = setup.in_sld;
                temp.splice(e.index, 1);
                let opt = setup.in_sld_opt;
                opt.splice(e.index);
                setSetup({ ...setup, in_sld: temp, in_sld_opt: opt });
                submitUpdate({ ...setup, in_sld: temp, in_sld_opt: opt });
              }
            )}
            {renderKategoriDropdown(
              "Pengurangan Dana",
              setup?.dec_sld ?? [null],
              setup?.dec_sld_opt ?? [null],
              (e, id) => {
                let temp = setup.dec_sld;
                temp[e.index] = id;
                setSetup({ ...setup, dec_sld: temp });
                submitUpdate({
                  ...setup,
                  dec_sld: temp,
                  dec_sld_opt: setup.dec_sld_opt,
                });
              },
              (e, k) => {
                let temp = setup.dec_sld_opt;
                temp[e.index] = k ?? "+";
                setSetup({ ...setup, dec_sld_opt: temp });
                submitUpdate({
                  ...setup,
                  dec_sld_opt: temp,
                  dec_sld: setup.dec_sld,
                });
              },
              true,
              (e) => {
                setSetup({
                  ...setup,
                  dec_sld: [...setup.dec_sld, 0],
                  dec_sld_opt: [...setup.dec_sld_opt, "+"],
                });
              },
              (e) => {
                let temp = setup.dec_sld;
                temp.splice(e.index, 1);
                let opt = setup.adj_opt;
                opt.splice(e.index);
                setSetup({ ...setup, dec_sld: temp, dec_sld_opt: opt });
                submitUpdate({ ...setup, dec_sld: temp, dec_sld_opt: opt });
              }
            )}
          </Row>
        }
      />
    );
  };

  const renderAktivitasInvestasi = () => {
    return (
      <CustomAccordion
        tittle={"Aktivitas Investasi"}
        active={accor?.ainvestasi ?? [null]}
        key={1}
        defaultActive={true}
        onClick={() => {
          setAccor({
            ...accor,
            ainvestasi: !accor.ainvestasi,
          });
        }}
        body={
          <Row className="mr-0 ml-0">
            {renderKategoriDropdown(
              "Penjualan Aset",
              setup?.asset_sell ?? [null],
              setup.asset_sell_opt ?? [null],
              (e, id) => {
                let temp = setup.asset_sell;
                temp[e.index] = id;
                setSetup({ ...setup, asset_sell: temp });
                submitUpdate({ ...setup, asset_sell: temp });
              },
              (e, s) => {
                let temp = setup.asset_sell_opt;
                temp[e.index] = s;
                setSetup({ ...setup, asset_sell_opt: temp });
              },
              true,
              (e) => {
                setSetup({
                  ...setup,
                  asset_sell: [...setup.asset_sell, 0],
                  asset_sell_opt: [...setup.asset_sell_opt, "+"],
                });
              },
              (e) => {
                let temp = setup.asset_sell;
                temp.splice(e.index, 1);
                let opt = setup.asset_sell_opt;
                opt.splice(e.index);
                setSetup({ ...setup, asset_sell: temp, asset_sell_opt: opt });
                submitUpdate({ ...setup, asset_sell: temp });
              }
            )}
            {renderKategoriDropdown(
              "Pembelian Aset",
              setup?.asset_buy ?? [null],
              setup?.asset_buy_opt ?? [null],
              (e, id) => {
                let temp = setup.asset_buy;
                temp[e.index] = id;
                setSetup({ ...setup, asset_buy: temp });
                submitUpdate({ ...setup, asset_buy: temp });
              },
              (e, a) => {
                let temp = setup.asset_buy_opt;
                temp[e.index] = a;
                setSetup({ ...setup, asset_buy_opt: temp });
              },

              true,
              (e) => {
                setSetup({
                  ...setup,
                  asset_buy: [...setup.asset_buy, 0],
                  asset_buy_opt: [...setup.asset_buy_opt, "+"],
                });
              },
              (e) => {
                let temp = setup.asset_buy;
                temp.splice(e.index, 1);
                let opt = setup.asset_buy_opt;
                opt.splice(e.index);
                setSetup({ ...setup, asset_buy: temp, asset_buy_opt: opt });
                submitUpdate({ ...setup, asset_buy: temp });
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
        <Col className="col-lg-12 col-sm-12 col-xs-12">
          {renderAktivitasO()}
          {renderAktivitasInvestasi()}
          {renderAktivitasPendanaan()}
        </Col>
      </Row>
    </>
  );
};

export default SetupCashFlow;
