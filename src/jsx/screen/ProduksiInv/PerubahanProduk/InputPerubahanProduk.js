import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
import { Row, Col, Dropdown, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_PP } from "src/redux/actions";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import DataProduk from "../../Master/Produk/DataProduk";
import DataSatuan from "../../MasterLainnya/Satuan/DataSatuan";
import { TabPanel, TabView } from "primereact/tabview";
import { Divider } from "@material-ui/core";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import endpoints from "../../../../utils/endpoints";

const defError = {
  code: false,
  date: false,
  ppa: [
    {
      id: false,
      loc: false,
      qty: false,
    },
  ],
  ppj: [
    {
      id: false,
      loc: false,
      qty: false,
    },
  ],
};

const InputPerubahanProduk = ({ onCancel, onSuccess }) => {
  const toast = useRef(null);
  const [state, setState] = useState(null);
  const [setup, setSetup] = useState(null);
  const [lokasi, setLok] = useState(null);
  const [sto, setSto] = useState(null);
  const [error, setError] = useState(defError);
  const [update, setUpdate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doubleClick, setDoubleClick] = useState(false);
  const pp = useSelector((state) => state.pp.current);
  const isEdit = useSelector((state) => state.pp.editPp);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [showProd, setShowProd] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [product, setProduct] = useState(null);
  const [grupP, setGrupP] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getProduct();
    getSetup();
    getSatuan();
    getLokasi();
    getStoLoc();
  }, []);

  const getProduct = async () => {
    const config = {
      ...endpoints.product,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setProduct(data);
        getGrupP();
      }
    } catch (error) {}
  };

  const getGrupP = async () => {
    const config = {
      ...endpoints.groupPro,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setGrupP(data);
      }
    } catch (error) {}
  };

  const getSatuan = async () => {
    const config = {
      ...endpoints.getSatuan,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSatuan(data);
      }
    } catch (error) {}
  };

  const getLokasi = async () => {
    const config = {
      ...endpoints.lokasi,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setLok(data);
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

  const getStoLoc = async (id, e) => {
    const config = {
      ...endpoints.sto,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSto(data);
      }
    } catch (error) {}
  };

  const editPP = async () => {
    const config = {
      ...endpoints.editPproduct,
      endpoint: endpoints.editPproduct.endpoint + pp.id,
      data: pp,
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

  const addPP = async () => {
    const config = {
      ...endpoints.addPproduct,
      data: { ...pp, pp_date: currentDate(pp.pp_date) },
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
            detail: `Kode ${pp.pp_code} Sudah Digunakan`,
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

  const checkProd = (value) => {
    let selected = {};
    product?.forEach((element) => {
      if (value === element.id) {
        selected = element;
        console.log(selected);
      }
    });

    return selected;
  };

  const checkUnit = (value) => {
    let selected = {};
    satuan?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkLok = (value) => {
    let selected = {};
    lokasi?.forEach((element) => {
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
        editPP();
      } else {
        setUpdate(true);
        addPP();
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

  const updatePP = (e) => {
    dispatch({
      type: SET_CURRENT_PP,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let active = 1;
    let errors = {
      code: !pp.pp_code || pp.pp_code === "",
      date: !pp.pp_date || pp.pp_date === "",
      ppa: [],
      ppj: [],
    };

    let pa_qty = 0;
    let pj_qty = 0;
    let acc_pa = null;
    let acc_pj = null;
    let acc_gp_pa = null;
    let acc_gp_pj = null;
    pp?.pasal.forEach((element, i) => {
      if (i > 0) {
        if (element?.prod_id || element?.loc_id || element?.qty) {
          errors.ppa[i] = {
            id: !element.prod_id,
            loc: !element.loc_id,
            qty: !element.qty || element.qty === "" || element.qty === "0",
          };
        }
      } else {
        errors.ppa[i] = {
          id: !element.prod_id,
          loc: !element.loc_id,
          qty: !element.qty || element.qty === "" || element.qty === "0",
        };
      }
      pa_qty += Number(element.qty);

      grupP?.forEach((el) => {
        if (checkProd(element?.prod_id)?.group?.id === el?.groupPro?.id) {
          if (el.groupPro.wip) {
            acc_gp_pa = el.groupPro.acc_wip;
            acc_gp_pa = checkProd(element.prod_id)?.acc_wip;
            acc_pa = checkProd(element.prod_id)?.acc_wip;
          } else {
            acc_gp_pa = el.groupPro.acc_sto;
            acc_gp_pa = checkProd(element.prod_id)?.acc_sto;
            acc_pa = checkProd(element.prod_id)?.acc_sto;
          }
        }
      });
    });

    pp?.pjadi.forEach((element, i) => {
      if (i > 0) {
        if (element?.prod_id || element?.loc_id) {
          errors.ppj[i] = {
            id: !element.prod_id,
            loc: !element.loc_id,
            qty: !element.qty || element.qty === "" || element.qty === "0",
          };
        }
      } else {
        errors.ppj[i] = {
          id: !element.prod_id,
          loc: !element.loc_id,
          qty: !element.qty || element.qty === "" || element.qty === "0",
        };
      }
      pj_qty += Number(element.qty);

      grupP?.forEach((el) => {
        if (checkProd(element?.prod_id)?.group?.id === el?.groupPro?.id) {
          if (el.groupPro.wip) {
            acc_gp_pj = el.groupPro.acc_wip;
            acc_gp_pj = checkProd(element.prod_id)?.acc_wip;
            acc_pj = checkProd(element.prod_id)?.acc_wip;
          } else {
            acc_gp_pj = el.groupPro.acc_sto;
            acc_gp_pj = checkProd(element.prod_id)?.acc_sto;
            acc_pj = checkProd(element.prod_id)?.acc_sto;
          }
        }
      });
    });

    if (!errors.ppa[0]?.id && !errors.ppa[0]?.loc && !errors.ppa[0]?.qty) {
      errors.ppa?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    if (!errors.ppj[0]?.id && !errors.ppj[0]?.loc && !errors.ppj[0]?.qty) {
      errors.ppj?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    setState(pa_qty !== pj_qty);
    errors.ppj.forEach((element) => {
      element.qty = pa_qty !== pj_qty;
    });

    let validPpj = false;
    let validPpa = false;
    if (!validPpa) {
      errors.ppa?.forEach((el, i) => {
        for (var k in el) {
          validPpa = !el[k];
        }
      });
    }
    if (!validPpj) {
      errors.ppj.forEach((elem, i) => {
        for (var k in elem) {
          validPpj = !elem[k];
          if (elem[k] && i < active) {
            active = 1;
          }
        }
      });
    }

    if (
      (setup?.gl_detail && acc_pa === null) ||
      (!setup?.gl_detail && acc_gp_pa === null)
    ) {
      toast.current.show({
        severity: "error",
        summary: "Tidak Dapat Menyimpan Data",
        detail: `Akun Persediaan Produk Asal Belum Diisi`,
        life: 6000,
      });
    }

    if (
      (setup?.gl_detail && acc_pj === null) ||
      (!setup.gl_detail && acc_gp_pj === null)
    ) {
      toast.current.show({
        severity: "error",
        summary: "Tidak Dapat Menyimpan Data",
        detail: `Akun Persediaan Produk Jadi Belum Diisi`,
        life: 6000,
      });
    }

    let acc_err =
      (setup?.gl_detail && acc_pa !== null) ||
      (!setup?.gl_detail && acc_gp_pa !== null);
    let acc_er =
      (setup?.gl_detail && acc_pj !== null) ||
      (!setup?.gl_detail && acc_gp_pj !== null);

    valid =
      !errors.code && !errors.date && validPpa && validPpj && acc_err && acc_er;

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

  const body = () => {
    let date = new Date(setup?.year_co, setup?.cutoff - 1, 31);
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-3 fs-13">
          <div className="col-3 text-black">
            <PrimeInput
              label={"Kode Perubahan"}
              value={pp.pp_code}
              onChange={(e) => {
                updatePP({ ...pp, pp_code: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode"
              error={error?.code}
              disabled={isEdit}
            />
          </div>

          <div className="col-2 text-black">
            <div className="ml-3"></div>
            <PrimeCalendar
              label={"Tgl Perubahan"}
              value={new Date(`${pp.pp_date}Z`)}
              onChange={(e) => {
                updatePP({ ...pp, pp_date: e.target.value });

                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              placeholder="Pilih Tanggal"
              dateFormat="dd-mm-yy"
              showIcon
              error={error?.date}
              minDate={date}
            />
          </div>
        </Row>

        <TabView
          className="m-1"
          activeIndex={active}
          onTabChange={(e) => setActive(e.index)}
        >
          <TabPanel header="Produk Asal">
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="scroll"
                  value={pp.pasal?.map((v, i) => {
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
                    header="Nama Produk"
                    className="col-5 align-text"
                    style={{
                      width: "35rem",
                    }}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.prod_id && checkProd(e.prod_id)}
                        options={product}
                        onChange={(u) => {
                          let sat = [];
                          let st = 0;
                          satuan.forEach((element) => {
                            if (element.id === u.value.unit.id) {
                              sat.push(element);
                            } else {
                              if (element.u_from?.id === u.value.unit.id) {
                                sat.push(element);
                              }
                            }
                          });

                          sto?.forEach((element) => {
                            if (
                              element.loc_id === u.value.id &&
                              element.id === e.loc_id
                            ) {
                              st = element.stock;
                            }
                          });

                          let temp = [...pp.pasal];
                          temp[e.index].prod_id = u.value.id;
                          temp[e.index].unit_id = u.value.unit?.id;
                          temp[e.index].stock = st;

                          updatePP({ ...pp, pasal: temp });

                          let newError = error;
                          newError.ppa[e.index].id = false;
                          setError(newError);
                        }}
                        filter
                        filterBy="name"
                        optionLabel="name"
                        placeholder="Pilih Produk"
                        errorMessage="Produk Belum Dipilih"
                        error={error?.ppa[e.index]?.id}
                      />
                    )}
                  />

                  <Column
                    header="Satuan"
                    className="align-text-top"
                    field={""}
                    style={{
                      width: "18rem",
                    }}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        options={satuan}
                        onChange={(u) => {
                          let temp = [...pp.pasal];
                          temp[e.index].unit_id = u.value.id;
                          updatePP({ ...pp, pasal: temp });
                        }}
                        optionLabel="name"
                        filter
                        filterBy="name"
                        placeholder="Satuan Produk"
                      />
                    )}
                  />

                  <Column
                    header="Lokasi"
                    className="align-text-top"
                    field={""}
                    style={{
                      width: "20rem",
                    }}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.loc_id && checkLok(e.loc_id)}
                        options={lokasi}
                        onChange={(u) => {
                          let st = 0;
                          sto?.forEach((element) => {
                            if (
                              element.loc_id === u.value.id &&
                              element.id === e.prod_id
                            ) {
                              st = element.stock;
                            }
                          });

                          let temp = [...pp.pasal];
                          temp[e.index].loc_id = u.value.id;
                          temp[e.index].stock = st;
                          updatePP({ ...pp, pasal: temp });

                          let newError = error;
                          newError.ppa[e.index].loc = false;
                          setError(newError);
                        }}
                        optionLabel="name"
                        filter
                        filterBy="name"
                        placeholder="Lokasi Produk"
                        errorMessage="Lokasi Belum Dipilih"
                        error={error?.ppa[e.index]?.loc}
                      />
                    )}
                  />

                  <Column
                    hidden={isEdit}
                    header="Stok Produk"
                    className="align-text-top"
                    style={{
                      width: "15rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        value={e?.stock ?? 0}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled
                      />
                    )}
                  />
                  <Column
                    header="Jumlah Perubahan"
                    className="align-text-top"
                    style={{
                      width: "15rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        prc
                        value={e.qty && e.qty}
                        onChange={(u) => {
                          let temp = [...pp.pasal];
                          let tempp = [...pp.pjadi];
                          temp[e.index].qty = Number(u.value);
                          tempp[e.index].qty = temp[e.index].qty;

                          if (temp[e.index].qty > e.stock) {
                            temp[e.index].qty = e.stock;
                            tempp[e.index].qty = temp[e.index].qty;
                            toast.current.show({
                              severity: "warn",
                              summary: "Jumlah Melebihi Stock",
                              detail: `Silahkan Melakukan Perubahan Sesuai Persediaan Saat Ini!!`,
                              life: 5000,
                            });
                          }
                          updatePP({ ...pp, pasal: temp });

                          let newError = error;
                          newError.ppa[e.index].qty = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        error={error?.ppa[e.index]?.qty}
                      />
                    )}
                  />

                  <Column
                    header=""
                    className="align-text-top"
                    field={""}
                    body={(e) =>
                      e.index === pp.pasal.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.ppa.push({
                              id: false,
                              loc: false,
                              qty: false,
                            });
                            setError(newError);

                            updatePP({
                              ...pp,
                              pasal: [
                                ...pp.pasal,
                                {
                                  id: 0,
                                  prod_id: null,
                                  unit_id: null,
                                  loc_id: null,
                                  qty: null,
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
                            newError.ppa.push({
                              id: false,
                              loc: false,
                              qty: false,
                            });
                            setError(newError);

                            let temp = [...pp.pasal];
                            temp.splice(e.index, 1);
                            updatePP({ ...pp, pasal: temp });
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

          <TabPanel header="Produk Jadi">
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="none"
                  value={pp.pjadi?.map((v, i) => {
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
                    header="Nama Produk"
                    className="col-5 align-text"
                    style={{
                      width: "35rem",
                    }}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.prod_id && checkProd(e.prod_id)}
                        options={product}
                        onChange={(u) => {
                          let sat = [];
                          satuan.forEach((element) => {
                            if (element.id === u.value.unit.id) {
                              sat.push(element);
                            } else {
                              if (element.u_from?.id === u.value.unit.id) {
                                sat.push(element);
                              }
                            }
                          });

                          let temp = [...pp.pjadi];
                          temp[e.index].prod_id = u.value.id;
                          temp[e.index].unit_id = u.value.unit?.id;

                          updatePP({ ...pp, pjadi: temp });

                          let newError = error;
                          newError.ppj[e.index].id = false;
                          setError(newError);
                        }}
                        filter
                        filterBy="name"
                        optionLabel="name"
                        placeholder="Pilih Produk"
                        errorMessage="Produk Belum Dipilih"
                        error={error?.ppj[e.index]?.id}
                      />
                    )}
                  />

                  <Column
                    header="Satuan"
                    className="align-text-top"
                    field={""}
                    style={{
                      width: "18rem",
                    }}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        options={satuan}
                        onChange={(u) => {
                          let temp = [...pp.pjadi];
                          temp[e.index].unit_id = u.value.id;
                          updatePP({ ...pp, pjadi: temp });
                        }}
                        optionLabel="name"
                        filter
                        filterBy="name"
                        placeholder="Satuan Produk"
                      />
                    )}
                  />

                  <Column
                    header="Lokasi"
                    className="align-text-top"
                    field={""}
                    style={{
                      width: "20rem",
                    }}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.loc_id && checkLok(e.loc_id)}
                        options={lokasi}
                        onChange={(u) => {
                          let temp = [...pp.pjadi];
                          temp[e.index].loc_id = u.value.id;
                          updatePP({ ...pp, pjadi: temp });

                          let newError = error;
                          newError.ppj[e.index].loc = false;
                          setError(newError);
                        }}
                        optionLabel="name"
                        filter
                        filterBy="name"
                        placeholder="Lokasi Produk"
                        errorMessage="Lokasi Belum Dipilih"
                        error={error?.ppj[e.index]?.loc}
                      />
                    )}
                  />

                  <Column
                    header="Jumlah"
                    className="align-text-top"
                    style={{
                      width: "15rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        prc
                        value={e.qty && e.qty}
                        onChange={(u) => {
                          let temp = [...pp.pjadi];
                          temp[e.index].qty = Number(u.value);
                          updatePP({ ...pp, pjadi: temp });

                          let newError = error;
                          newError.ppj[e.index].qty = false;
                          setError(newError);
                          setState(false);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        error={error?.ppj[e.index]?.qty}
                        errorMessage={
                          state ? "Total Kuantitas Belum Sesuai" : null
                        }
                      />
                    )}
                  />

                  <Column
                    header=""
                    className="align-text-top"
                    field={""}
                    body={(e) =>
                      e.index === pp.pjadi.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.ppj.push({
                              id: false,
                              qty: false,
                              loc: false,
                            });
                            setError(newError);

                            updatePP({
                              ...pp,
                              pjadi: [
                                ...pp.pjadi,
                                {
                                  id: 0,
                                  prod_id: null,
                                  unit_id: null,
                                  loc_id: null,
                                  qty: null,
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
                            newError.ppj.push({
                              id: false,
                              qty: false,
                              loc: false,
                            });
                            setError(newError);

                            let temp = [...pp.pjadi];
                            temp.splice(e.index, 1);
                            updatePP({ ...pp, pjadi: temp });
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
      </>
    );
  };

  // const getIndex = () => {
  //   let total = 0;
  //   phj?.product?.forEach((el) => {
  //     total += el.index;
  //   });

  //   return total;
  // };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div className="justify-content-left col-6">
          <div className="col-12 mt-0 ml-0 p-0 fs-12 text-left">
            {/* <label className="text-label">
              <b>Saldo WIP : </b>
            </label> */}
          </div>
        </div>

        <div className="row justify-content-right col-6">
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
      </div>
    );
  };

  return (
    <>
      <Row>
        <Col className="pt-0">
          <Card>
            <Card.Body>
              <>
                {/* {header()} */}
                {body()}
                {footer()}
              </>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <DataProduk
        data={product}
        loading={false}
        popUp={true}
        show={showProd}
        onHide={() => {
          setShowProd(false);
        }}
        onInput={(e) => {
          setShowProd(!e);
        }}
        onSuccessInput={(e) => {
          getProduct();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowProd(false);
            let sat = [];
            satuan.forEach((element) => {
              if (element.id === e.data.unit.id) {
                sat.push(element);
              } else {
                if (element.u_from?.id === e.data.unit.id) {
                  sat.push(element);
                }
              }
            });
            setSatuan(sat);

            let temp = [...pp.pasal];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;

            let tempm = [...pp.pjadi];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;
            updatePP({ ...pp, pasal: temp, pjadi: tempm });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataSatuan
        data={satuan}
        loading={false}
        popUp={true}
        show={showSatuan}
        onHide={() => {
          setShowSatuan(false);
        }}
        onInput={(e) => {
          setShowSatuan(!e);
        }}
        onSuccessInput={(e) => {
          getSatuan();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSatuan(false);
            let temp = [...pp.pasal];
            temp[currentIndex].unit_id = e.data.id;

            let tempm = [...pp.pjadi];
            tempm[currentIndex].unit_id = e.data.id;
            updatePP({ ...pp, pasal: temp, pjadi: tempm });
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

export default InputPerubahanProduk;
