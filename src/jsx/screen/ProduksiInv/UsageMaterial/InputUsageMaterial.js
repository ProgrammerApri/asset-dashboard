import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { Divider } from "@material-ui/core";
import { TabPanel, TabView } from "primereact/tabview";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import DataSatuan from "../../MasterLainnya/Satuan/DataSatuan";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import { InputSwitch } from "primereact/inputswitch";
import { Link } from "react-router-dom";
import endpoints from "../../../../utils/endpoints";
import DataLokasi from "../../Master/Lokasi/DataLokasi";
import DataPusatBiaya from "../../MasterLainnya/PusatBiaya/DataPusatBiaya";
import DataMesin from "../../Master/Mesin/DataMesin";
import { SET_CURRENT_USAGE } from "../../../../redux/actions";

const defError = {
  code: false,
  date: false,
  loc: false,
  mtrl: [
    {
      id: false,
      qty: false,
    },
  ],
};

const InputUsageMaterial = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [sto, setSto] = useState(null);
  const [active, setActive] = useState(0);
  const [doubleClick, setDoubleClick] = useState(false);
  const usage = useSelector((state) => state.usage.current);
  const isEdit = useSelector((state) => state.usage.editUseMat);
  const dispatch = useDispatch();
  const [showSatuan, setShowSatuan] = useState(false);
  const [showLok, setShowLok] = useState(false);
  const [showMsn, setShowMsn] = useState(false);
  const [showDept, setShowDept] = useState(false);
  const [date, setDate] = useState(new Date());
  const [stcard, setStCard] = useState(null);
  const [product, setProduct] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [setup, setSetup] = useState(null);
  const [state, setState] = useState(0);
  const [stateErr, setStateErr] = useState(0);
  const [errQty, setErqty] = useState(0);
  const [lokasi, setLokasi] = useState(null);
  const [mesin, setMesin] = useState(null);
  const [acc, setAcc] = useState(null);
  const [accDdb, setAccDdb] = useState(null);
  const [trans, setTrans] = useState(null);
  const [transGl, setTransGl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProd, setShowProd] = useState(false);
  const [grupP, setGrupP] = useState(null);
  const [dept, setDept] = useState(null);
  const [error, setError] = useState(defError);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getProduct();
    getSetup();
    getDept();
    getLok();
    getStCard();
    getStoLoc();
    getAcc();
    getAccDdb();
    getTrans();
    getTransGl();
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
        getSatuan();
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

  const getLok = async () => {
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
        setLokasi(data);
      }
    } catch (error) {}
  };

  const getStCard = async (id, e) => {
    const config = {
      ...endpoints.stcard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setStCard(data);
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

  const getAcc = async () => {
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
        let kas = [];
        let all_d = [];
        data.forEach((elem) => {
          if (elem.account.dou_type === "D" && elem.account.connect === false) {
            all_d.push(elem.account);
          }
        });
        setAcc(all_d);
      }
    } catch (error) {}
  };

  const getAccDdb = async () => {
    const config = {
      ...endpoints.acc_ddb,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        setAccDdb(data);
      }
    } catch (error) {}
  };

  const getTrans = async () => {
    const config = {
      ...endpoints.trans,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setTrans(data);
      }
    } catch (error) {}
  };

  const getTransGl = async () => {
    const config = {
      ...endpoints.trans,
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
          if (!element.tf_inv) {
            filt.push(element);
          }
        });
        setTransGl(filt);
      }
    } catch (error) {}
  };

  const editMat = async () => {
    const config = {
      ...endpoints.editUseMat,
      endpoint: endpoints.editUseMat.endpoint + usage.id,
      data: usage,
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

  const addMat = async () => {
    const config = {
      ...endpoints.addUseMat,
      data: { ...usage, date: currentDate(usage.date) },
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
            detail: `Kode ${usage.bcode} Sudah Digunakan`,
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

  const checkDept = (value) => {
    let selected = {};
    dept?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkAcc = (value) => {
    let selected = {};
    acc?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
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

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editMat();
      } else {
        setUpdate(true);
        addMat();
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

  const updateMAT = (e) => {
    dispatch({
      type: SET_CURRENT_USAGE,
      payload: e,
    });
  };

  const isValid = () => {
    let valid = false;
    let active = 1;
    let errors = {
      code: !usage.code || usage.code === "",
      date: !usage.date || usage.date === "",
      loc: !usage.loc_id,
      mtrl: [],
    };

    let total_prod = 0;
    let total_rej = 0;
    let qty_mat = 0;
    let qty_pj = 0;
    let qty_rej = 0;
    let tqty = 0;
    let acc_sto_m = null;
    let acc_wip_m = null;
    let acc_sto_p = null;
    let acc_sto_r = null;
    let acc_gp_m = null;
    let acc_gp_p = null;
    let acc_gp_r = null;
    let qty_m = 0;
    let st = 0;
    let sto_no_hpok = 0;

    usage?.material.forEach((element, i) => {
      if (i > 0) {
        if (element.prod_id || element.qty) {
          errors.mtrl[i] = {
            id: !element.prod_id,
            qty: !element.qty || element.qty === "" || element.qty === "0",
          };
        }
      } else {
        errors.mtrl[i] = {
          id: !element.prod_id,
          qty: !element.qty || element.qty === "" || element.qty === "0",
        };
      }

      qty_mat += Number(element.qty);
      acc_sto_m = checkProd(element?.prod_id)?.acc_sto;
      acc_wip_m = checkProd(element?.prod_id)?.acc_wip;
      qty_m = Number(element.qty);
      st = element.stock;

      if (element?.prod_id) {
        grupP?.forEach((el) => {
          if (checkProd(element?.prod_id)?.group?.id === el?.groupPro?.id) {
            if (el.groupPro.wip) {
              acc_gp_m = el.groupPro?.acc_wip;
              acc_gp_m = checkProd(element?.prod_id)?.acc_wip;
              acc_sto_m = checkProd(element?.prod_id)?.acc_wip;
            } else {
              acc_gp_m = el.groupPro?.acc_sto;
              acc_gp_m = checkProd(element?.prod_id)?.acc_sto;
              acc_sto_m = checkProd(element?.prod_id)?.acc_sto;
            }
          }
        });

        if (
          (setup?.gl_detail && acc_sto_m === null) ||
          (!setup?.gl_detail && acc_gp_m === null)
        ) {
          toast.current.show({
            severity: "error",
            summary: "Tidak Dapat Menyimpan Data",
            detail: `Akun Persediaan Produk Material Belum Diisi`,
            life: 6000,
          });
        }
      }

      stcard?.forEach((el) => {
        if (
          element?.prod_id === el?.prod_id?.id &&
          usage?.loc_id === el?.loc_id?.id &&
          el.trx_dbcr === "d"
        ) {
          if (el.trx_hpok === 0) {
            sto_no_hpok += el.trx_qty;
          }
        }
      });
    });

    setStateErr(qty_m > st);
    errors?.mtrl?.forEach((element) => {
      element.qty = qty_m > st;
    });

    if (!errors.mtrl[0]?.id && !errors.mtrl[0]?.qty) {
      errors.mtrl?.forEach((e) => {
        for (var key in e) {
          e[key] = false;
        }
      });
    }

    let validMtrl = false;
    if (!validMtrl) {
      errors.mtrl?.forEach((el, i) => {
        for (var k in el) {
          validMtrl = !el[k];
        }
      });
    }

    if (sto_no_hpok > 0) {
      toast.current.show({
        severity: "error",
        summary: "Tidak Dapat Menyimpan Data",
        detail: `Persediaan Produk Belum Ada Harga Pokok`,
        life: 6000,
      });
    }

    let val_err = sto_no_hpok > 0;

    let acc_err =
      (setup?.gl_detail && acc_sto_m !== null) ||
      (!setup?.gl_detail && acc_gp_m !== null);

    valid =
      !errors.code &&
      !errors.date &&
      !errors.loc &&
      validMtrl &&
      acc_err &&
      !val_err;

    setError(errors);

    if (!valid) {
      window.scrollTo({
        top: 80,
        left: 0,
        behavior: "smooth",
      });
      setActive(active);
    }

    return valid;
  };

  const formatIdr = (value) => {
    return `${value.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const prodTemp = (option) => {
    return (
      <div>{option !== null ? `${option.name} (${option.code})` : ""}</div>
    );
  };

  const valProd = (option, props) => {
    if (option) {
      return (
        <div>{option !== null ? `${option.name} (${option.code})` : ""}</div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const body = () => {
    let date = new Date(setup?.year_co, setup?.cutoff - 1, 31);
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4 fs-13">
          <div className="col-3 text-black">
            <PrimeInput
              label={"Kode Pemakaian"}
              value={usage.code}
              onChange={(e) => {
                updateMAT({ ...usage, code: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode Pemakaian"
              error={error?.code}
              disabled={isEdit}
            />
          </div>
          <div className="col-2 text-black">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${usage.date}Z`)}
              onChange={(e) => {
                updateMAT({ ...usage, date: e.target.value });

                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              placeholder="Pilih Tanggal"
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.date}
              minDate={date}
            />
          </div>

          <div className="col-1"></div>

          <div className="col-3 text-black">
            <label className="text-black">Gudang Material</label>
            <CustomDropdown
              value={usage.loc_id && checkLok(usage.loc_id)}
              option={lokasi}
              label={"[name] ([code])"}
              onChange={(e) => {
                let st = 0;

                sto?.forEach((element) => {
                  usage?.material?.forEach((elem) => {
                    if (
                      element.loc_id === e.id &&
                      element.id === elem.prod_id
                    ) {
                      st = element.stock;
                    }
                  });
                });

                updateMAT({
                  ...usage,
                  loc_id: e.id,
                  material: usage?.material?.map((v) => {
                    return { ...v, stock: st };
                  }),
                });
                let newError = error;
                newError.loc = false;
                setError(newError);
              }}
              placeholder="Pilih Gudang Material"
              detail
              onDetail={() => setShowLok(true)}
              errorMessage="Gudang Belum Dipilih"
              error={error?.loc}
            />
          </div>

          <div className="col-3 text-black">
            <label className="text-black">Departement</label>
            <CustomDropdown
              value={usage.dep_id && checkDept(usage?.dep_id)}
              option={dept}
              label={"[ccost_name] ([ccost_code])"}
              onChange={(e) => {
                updateMAT({ ...usage, dep_id: e.id });
              }}
              placeholder="Pilih Departement"
              detail
              onDetail={() => setShowDept(true)}
            />
          </div>
        </Row>

        {/* {btc && usage.plan_id !== null && (
          <> */}
        <TabView
          className="ml-2"
          activeIndex={active}
          onTabChange={(e) => setActive(e.index)}
        >
          <TabPanel header="Bahan">
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="none"
                  value={usage.material?.map((v, i) => {
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
                    header="Bahan"
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   width: "20rem",
                    // }}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.prod_id && checkProd(e.prod_id)}
                        options={product}
                        onChange={(u) => {
                          let sat = [];
                          satuan.forEach((element) => {
                            if (element?.id === u.value?.unit?.id) {
                              sat.push(element);
                            } else {
                              if (element.u_from?.id === u.value?.unit?.id) {
                                sat.push(element);
                              }
                            }
                          });

                          let st = 0;
                          sto?.forEach((element) => {
                            if (
                              element.loc_id === usage?.loc_id &&
                              element.id === u.value.id
                            ) {
                              st = element.stock;
                            }
                          });

                          let temp = [...usage.material];
                          temp[e.index].prod_id = u.value.id;
                          temp[e.index].unit_id = u.value.unit?.id;
                          temp[e.index].stock = st;

                          if (temp[e.index].qty > e.stock) {
                            temp[e.index].qty = e.stock;
                            toast.current.show({
                              severity: "warn",
                              summary: "Stock Tidak Mencukupi",
                              detail: `Stock ${st} Silahkan Melakukan Pembelian Terlebih Dahulu!!`,
                              life: 5000,
                            });
                          }
                          updateMAT({ ...usage, material: temp });

                          let newError = error;
                          newError.mtrl[e.index].id = false;
                          setError(newError);
                        }}
                        filter
                        filterBy="name"
                        optionLabel="name"
                        itemTemplate={prodTemp}
                        valueTemplate={valProd}
                        placeholder="Pilih Bahan"
                        errorMessage="Bahan Belum Dipilih"
                        error={error?.mtrl[e.index]?.id}
                      />
                    )}
                  />

                  <Column
                    header="Satuan"
                    className="align-text-top"
                    field={""}
                    // style={{
                    //   width: "15rem",
                    // }}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        options={satuan}
                        onChange={(u) => {
                          let temp = [...usage.material];
                          temp[e.index].unit_id = u.value.id;
                          updateMAT({ ...usage, material: temp });
                        }}
                        optionLabel="name"
                        filter
                        filterBy="name"
                        placeholder="Satuan Produk"
                      />
                    )}
                  />

                  <Column
                    // hidden
                    header={isEdit ? "Stok Tersisa" : "Stok"}
                    className="align-text-top"
                    style={{
                      minWidth: "8rem",
                    }}
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        prc
                        value={e?.stock ?? 0}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Kuantitas"
                    field={""}
                    // style={{
                    //   width: "11rem",
                    // }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.qty && e.qty}
                        onChange={(t) => {
                          let temp = [...usage.material];
                          temp[e.index].qty = t.value;

                          if (temp[e.index].qty > e.stock) {
                            temp[e.index].qty = e.stock;
                            toast.current.show({
                              severity: "warn",
                              summary: `Stock Tersisa ${e.stock} Unit`,
                              detail: `Silahkan Melakukan Pembelian Terlebih Dahulu!!`,
                              life: 5000,
                            });
                          }

                          temp[e.index].t_price =
                            temp[e.index].price * temp[e.index].qty;
                          updateMAT({ ...usage, material: temp });

                          let newError = error;
                          newError.mtrl[e.index].qty = false;
                          setError(newError);
                        }}
                        min={0}
                        placeholder="0"
                        type="number"
                        error={error?.mtrl[e.index]?.qty}
                        errorMessage={
                          stateErr ? "Kuantitas Melebihi Stock" : null
                        }
                      />
                    )}
                  />

                  <Column
                    header=""
                    className="align-text-top"
                    field={""}
                    body={(e) =>
                      e.index === usage.material.length - 1 ? (
                        <Link
                          onClick={() => {
                            let newError = error;
                            newError.mtrl.push({
                              qty: false,
                            });
                            setError(newError);

                            updateMAT({
                              ...usage,
                              material: [
                                ...usage.material,
                                {
                                  id: 0,
                                  prod_id: null,
                                  unit_id: null,
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
                            newError.mtrl.push({
                              qty: false,
                            });
                            setError(newError);

                            let temp = [...usage.material];
                            temp.splice(e.index, 1);
                            updateMAT({ ...usage, material: temp });
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

          <TabPanel header="Biaya">
            <Card>
              <Card.Body>
                <DataTable
                  responsiveLayout="none"
                  value={usage.biaya?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      // value: v?.value ?? 0,
                    };
                  })}
                  className="display w-150 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    header="Akun Biaya"
                    className="col-4 align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeDropdown
                        value={e.acc_id && checkAcc(e.acc_id)}
                        options={acc}
                        onChange={(u) => {
                          let nom_sa = 0;
                          let nom_d = 0;
                          let dt_um = new Date(`${usage?.date}Z`);
                          let nom_gl = 0;

                          accDdb?.forEach((el) => {
                            if (el?.acc_code?.id === u?.value?.id) {
                              nom_sa += el?.acc_akhir;
                            }

                          // console.log("CEK");
                          // console.log(el?.acc_code?.id);
                          // console.log(e.value);
                          });

                          transGl?.forEach((elem) => {
                            let dt_gl = new Date(`${elem?.trx_date}Z`);
                            if (
                              elem?.acc_id === u?.value?.id
                              // &&
                              // dt_gl.getMonth() > setup?.cutoff &&
                              // dt_gl.getFullYear() >= setup?.year_co
                            ) {
                              if (elem.trx_dbcr === "D") {
                                nom_gl += elem.trx_amnt;
                              } else {
                                nom_gl -= elem.trx_amnt;
                              }
                            }
                          });

                          trans?.forEach((element) => {
                            let dt = new Date(`${element?.trx_date}Z`);
                            if (
                              element.acc_id === u?.value?.id
                              // &&
                              // dt.getMonth() > setup?.cutoff &&
                              // dt.getFullYear() >= setup?.year_co
                            ) {
                              if (element.trx_dbcr === "D") {
                                nom_d += element.trx_amnt;
                              } else {
                                nom_d -= element.trx_amnt;
                              }
                            }
                          });

                          let temp = [...usage.biaya];
                          temp[e.index].acc_id = u.value?.id ?? null;
                          temp[e.index].nom = nom_sa + nom_d + nom_gl;
                          updateMAT({ ...usage, biaya: temp });

                          // let newError = error;
                          // newError.uph[e.index].id = false;
                          // setError(newError);
                        }}
                        filter
                        filterBy="acc_name"
                        optionLabel="account.acc_name"
                        itemTemplate={glTemplate}
                        valueTemplate={valTemp}
                        placeholder="Pilih Akun"
                        showClear
                        // errorMessage="Akun Belum Dipilih"
                        // error={error?.uph[e.index]?.id}
                      />
                    )}
                  />
                  <Column
                    // hidden={isEdit}
                    header={isEdit ? "Biaya Tersisa" : "Biaya Tersimpan"}
                    className="col-2 align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.nom && e.nom}
                        onChange={(u) => {}}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Nominal Biaya"
                    className="col-2 align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.value && e.value}
                        onChange={(u) => {
                          let temp = [...usage.biaya];
                          temp[e.index].value = u.value;

                          if (temp[e.index].value > e.nom) {
                            temp[e.index].value = e.nom;
                            toast.current.show({
                              severity: "warn",
                              summary: `Biaya Melebihi Saldo Tersimpan`,
                              // detail: `Sisa Saldo Tersimpan  ${formatIdr(e.value)}`,
                              life: 7000,
                            });
                          }

                          updateMAT({ ...usage, biaya: temp });
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                      />
                    )}
                  />

                  <Column
                    header="Deskripsi"
                    className="col-4 align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeInput
                        value={e.desc && e.desc}
                        onChange={(u) => {
                          let temp = [...usage.biaya];
                          temp[e.index].desc = u.target.value;

                          updateMAT({ ...usage, biaya: temp });
                        }}
                        placeholder="Masukan Deskripsi"
                      />
                    )}
                  />

                  {/* <div className="col-"></div> */}

                  <Column
                    header=""
                    className="align-text-top"
                    field={""}
                    body={(e) =>
                      e.index === usage.biaya.length - 1 ? (
                        <Link
                          onClick={() => {
                            // let newError = error;
                            // newError.uph.push({
                            //   id: false,
                            // });
                            // setError(newError);

                            updateMAT({
                              ...usage,
                              biaya: [
                                ...usage.biaya,
                                {
                                  id: 0,
                                  acc_id: null,
                                  value: null,
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
                            let temp = [...usage.biaya];
                            temp.splice(e.index, 1);
                            updateMAT({ ...usage, biaya: temp });
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
        {/* </>
        )} */}
        <div className="row mb-5">
          <span className="mb-5"></span>
        </div>
      </>
    );
  };

  // const getIndex = () => {
  //   let total = 0;
  //   forml?.product?.forEach((el) => {
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
              <b>Jumlah Produk : </b>
            </label>
            <span> {}</span>
            <label className="ml-8">
              <b>Jumlah Bahan : </b>
            </label>
            <span>{}</span> */}
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

      <DataPusatBiaya
        data={dept}
        loading={false}
        popUp={true}
        show={showDept}
        onHide={() => {
          setShowDept(false);
        }}
        onInput={(e) => {
          setShowDept(!e);
        }}
        onSuccessInput={(e) => {
          getDept();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowDept(false);

            updateMAT({ ...usage, dep_id: e.data.id });
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
            updateMAT({ ...usage, unit_id: e.data.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataLokasi
        data={lokasi}
        loading={false}
        popUp={true}
        show={showLok}
        onHide={() => {
          setShowLok(false);
        }}
        onInput={(e) => {
          setShowLok(!e);
        }}
        onSuccessInput={(e) => {
          getLok();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowLok(false);
            updateMAT({ ...usage, loc_id: e.data.id });
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

export default InputUsageMaterial;
