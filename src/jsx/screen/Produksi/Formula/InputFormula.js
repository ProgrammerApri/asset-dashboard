import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
// import { Dropdown } from "primereact/dropdown";

import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_PO } from "src/redux/actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { InputTextarea } from "primereact/inputtextarea";

const defError = {
  code: false,
  date: false,
  req: false,
  rul: false,
  sup: false,
  prod: [
    {
      jum: false,
      prc: false,
    },
  ],
  jasa: [
    {
      jum: false,
      prc: false,
    },
  ],
};

const InputFormula = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [check, setCheck] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const po = useSelector((state) => state.po.current);
  const isEdit = useSelector((state) => state.po.editpo);
  const dispatch = useDispatch();
  const [value1, setValue1] = useState("");
  const [isRp, setRp] = useState(true);
  const [isRpJasa, setRpJasa] = useState(true);
  const [pusatBiaya, setPusatBiaya] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [rulesPay, setRulesPay] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [rp, setRequest] = useState(null);
  const [histori, setHistori] = useState(null);
  const [filtHis, setFiltHis] = useState([]);
  const [selectedCity1, setSelectedCity1] = useState(null);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showSupp, setShowSupp] = useState(false);
  const [showRulesPay, setShowRulesPay] = useState(false);
  const [showPpn, setShowPpn] = useState(false);
  const [showProd, setShowProd] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [showJasa, setShowJasa] = useState(false);
  const [showHistori, setShowHistori] = useState(false);
  const [product, setProduct] = useState(null);
  const [jasa, setJasa] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [error, setError] = useState(defError);
  const picker = useRef(null);

  const [currentItem, setCurrentItem] = useState();
  const [file, setFile] = useState(null);
  const [accor, setAccor] = useState({
    produk: true,
    jasa: false,
    sup: true,
  });

  const type = [
    { name: "%", code: "P" },
    { name: "Rp", code: "R" },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getPusatBiaya();
    getSupplier();
    getRulesPay();
    getPpn();
    getProduct();
    getJasa();
    getSatuan();
    getHistori();
  }, []);

  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const onCityChange = (e) => {
    setSelectedCity1(e.value);
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

  const getPusatBiaya = async () => {
    const config = {
      ...endpoints.pusatBiaya,
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
        setPusatBiaya(data);
      }
    } catch (error) {}
  };

  const getRulesPay = async () => {
    const config = {
      ...endpoints.rules_pay,
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
        setRulesPay(data);
      }
    } catch (error) {}
  };

  const getPpn = async () => {
    const config = {
      ...endpoints.pajak,
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
        setPpn(data);
      }
    } catch (error) {}
  };

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
        console.log("jsdj");
        console.log(data);
      }
    } catch (error) {}
  };

  const getJasa = async () => {
    const config = {
      ...endpoints.jasa,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setJasa(data);
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

  const getHistori = async () => {
    const config = {
      ...endpoints.price_history,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        // let his = [];
        // data.forEach((elem) => {
        //   if (elem.product.id === t.id) {
        //     his.push(elem);
        //   }
        // });
        setHistori(data);
      }
    } catch (error) {}
  };

  const editPO = async () => {
    const config = {
      ...endpoints.editPO,
      endpoint: endpoints.editPO.endpoint + po.id,
      data: po,
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

  const addPO = async () => {
    let d = po;
    d.pprod.forEach((el) => {
      el.order = el.order === "" ? 0 : el.order;
      el.nett_price = el.nett_price === "" ? 0 : el.nett_price;
      el.price = el.order === "" ? 0 : el.price;
      el.disc = el.disc === "" ? 0 : el.disc;
    });
    let ref_supp = [];
    d.psup.forEach((el) => {
      el.prod_id.forEach((ek, i) => {
        ref_supp.push({
          sup_id: el.sup_id,
          po_id: null,
          prod_id: ek,
          price: el.price[i],
          image: "",
        });
      });
    });
    // d.psup = ref_supp;
    const config = {
      ...endpoints.addPO,
      data: { ...d, psup: ref_supp },
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
            detail: `Kode ${po.po_code} Sudah Digunakan`,
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

  const req_pur = (value) => {
    let selected = {};
    rp?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const dept = (value) => {
    let selected = {};
    pusatBiaya?.forEach((element) => {
      if (element.id === `${value}`) {
        selected = element;
      }
    });
    return selected;
  };

  const pjk = (value) => {
    let selected = {};
    ppn?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const supp = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element.supplier.id) {
        selected = element;
      }
    });

    return selected;
  };

  const suppH = (value) => {
    let selected = {};
    filtHis?.forEach((element) => {
      if (value === element.supplier?.id) {
        selected = element;
      }
    });

    return selected;
  };

  const rulPay = (value) => {
    let selected = {};
    rulesPay?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
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

  const checkjasa = (value) => {
    let selected = {};
    jasa?.forEach((element) => {
      if (value === element.jasa.id) {
        selected = element;
      }
    });

    return selected;
  };

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editPO();
      } else {
        setUpdate(true);
        addPO();
      }
    }
  };

  const uploadImage = async () => {
    if (file) {
      const config = {
        ...endpoints.uploadImage,
        data: {
          image: file,
        },
      };
      console.log(config.data);
      let response = null;
      try {
        response = await request(null, config, {
          "Content-Type": "multipart/form-data",
        });
        console.log(response);
        if (response.status) {
          if (isEdit) {
            editPO(response.data);
          } else {
            addPO(response.data);
          }
        }
      } catch (error) {
        if (isEdit) {
          editPO("");
        } else {
          addPO("");
        }
      }
    } else {
      if (isEdit) {
        editPO("");
      } else {
        addPO("");
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

    return [year, month, day].join("-");
  };

  const updatePo = (e) => {
    dispatch({
      type: SET_CURRENT_PO,
      payload: e,
    });
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Pembelian (PO)</b>
        {/* <b>{isEdit ? "Edit" : "Buat"} Pembelian (PO)</b> */}
      </h4>
    );
  };

  const getSubTotalBarang = () => {
    let total = 0;
    po?.pprod?.forEach((el) => {
      if (el.nett_price && el.nett_price > 0) {
        total += parseInt(el.nett_price);
      } else {
        total += el.total - (el.total * el.disc) / 100;
      }
    });

    return total;
  };

  const getSubTotalJasa = () => {
    let total = 0;
    po?.pjasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return total;
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !po.po_code || po.po_code === "",
      date: !po.po_date || po.po_date === "",
      req: !po?.preq_id,
      rul: !po?.top,
      sup: !po.sup_id,
      prod: [],
      jasa: [],
    };

    po?.pprod?.forEach((element, i) => {
      if (i > 0) {
        if (element?.order || element?.price) {
          errors.prod[i] = {
            jum:
              !element?.order ||
              element?.order === "" ||
              element?.order === "0",
            prc:
              !element?.price ||
              element?.price === "" ||
              element?.price === "0",
          };
        }
      } else {
        errors.prod[i] = {
          jum:
            !element?.order || element?.order === "" || element?.order === "0",
          prc:
            !element?.price || element?.price === "" || element?.price === "0",
        };
      }
    });

    po?.pjasa?.forEach((element, i) => {
      if (i > 0) {
        if (element.order || element.price) {
          errors.jasa[i] = {
            jum:
              !element.order || element.order === "" || element.order === "0",
            prc:
              !element.price || element.price === "" || element.price === "0",
          };
        }
      } else {
        errors.jasa[i] = {
          jum: !element.order || element.order === "" || element.order === "0",
          prc: !element.price || element.price === "" || element.price === "0",
        };
      }
    });

    if (po?.pprod?.length) {
      if (!errors.prod[0]?.jum && !errors.prod[0]?.prc) {
        errors.jasa?.forEach((e) => {
          for (var key in e) {
            e[key] = false;
          }
        });
      }
    }

    if (po?.pjasa.length) {
      if (!errors.jasa[0]?.jum && !errors.jasa[0]?.prc) {
        errors.prod?.forEach((e) => {
          for (var key in e) {
            e[key] = false;
          }
        });
      }
    }

    let validProduct = false;
    let validJasa = false;
    errors.prod?.forEach((el) => {
      for (var k in el) {
        validProduct = !el[k];
      }
    });
    if (!validProduct) {
      errors.jasa?.forEach((el) => {
        for (var k in el) {
          validJasa = !el[k];
        }
      });
    }

    valid =
      !errors.code &&
      !errors.date &&
      !errors.req &&
      !errors.sup &&
      !errors.rul &&
      (validProduct || validJasa);

    setError(errors);

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });
    }

    return valid;
  };

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-5">
          <div className="col-2">
            <PrimeInput
              label={"Kode Formula"}
              value={po.po_code}
              onChange={(e) => {
                updatePo({});
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode Formula"
              error={error?.code}
            />
          </div>
          <div className="col-2">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${po.po_date}Z`)}
              onChange={(e) => {
                let result = new Date(e.value);
                result.setDate(result.getDate() + e.day);
                console.log(result);

                updatePo({ ...po, po_date: e.value, due_date: result });
                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              placeholder="Pilih Tanggal"
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.date}
            />
          </div>
          <div className="col-7"></div>
          <div className="col-3">
            <PrimeInput
              label={"Nama Formula"}
              value={po.po_code}
              onChange={(e) => {
                updatePo({});
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Nama Formula"
              error={error?.code}
            />
          </div>
          <div className="col-1">
            <PrimeInput
              label={"Versi"}
              value={po.po_code}
              onChange={(e) => {
                updatePo({});
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="1"
              error={error?.code}
            />
          </div>
          <div className="col-1">
            <PrimeInput
              label={"Revisi"}
              // value={po.po_code}
              onChange={(e) => {
                updatePo({});
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="1"
              error={error?.code}
            />
          </div>
          <div className="col-2">
            <PrimeInput
              label={"Tanggal Revisi"}
              // value={po.po_code}
              onChange={(e) => {
                updatePo({});
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="00/00/0000"
              disabled
              error={error?.code}
            />
          </div>
          <div className="col-3"></div>
          <div className="flex col-12 align-items-center mt-2">
            <label className="ml-0 mt-2 fs-12">
              <b>{"Aktif"}</b>
            </label>
            <InputSwitch
              className="ml-4"
              checked={po && po.ref_sup}
              onChange={(e) => {
                updatePo({ ...po, ref_sup: e.target.value });
              }}
            />
          </div>
          {/* <div className="col-7"></div> */}
          <div className="col-4">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup">
              <InputTextarea
                value={currentItem !== null ? `` : ""}
                onChange={(e) => setCurrentItem({})}
                placeholder="Masukan Keterangan"
              />
            </div>
          </div>
        </Row>

        <CustomAccordion
          tittle={"Produk"}
          defaultActive={true}
          active={accor.produk}
          onClick={() => {
            setAccor({
              ...accor,
              produk: !accor.produk,
            });
          }}
          key={1}
          body={
            <>
              <DataTable
                responsiveLayout="none"
                value={po.pprod?.map((v, i) => {
                  return {
                    ...v,
                    index: i,
                    order: v?.order ?? 0,
                    price: v?.price ?? 0,
                    disc: v?.disc ?? 0,
                    total: v?.total ?? 0,
                  };
                })}
                className="display w-150 datatable-wrapper header-white no-border"
                showGridlines={false}
                emptyMessage={() => <div></div>}
              >
                <Column
                  header="Produk Hasil Jadi"
                  className="align-text-top"
                  field={""}
                  // style={{
                  //   width: "12rem",
                  // }}
                  body={(e) => (
                    <div className="flex">
                      <div className="col-11 ml-0 p-0">
                        <CustomDropdown
                          value={e.prod_id && checkProd(e.prod_id)}
                          option={product}
                          onChange={(t) => {
                            let sat = [];
                            satuan.forEach((element) => {
                              if (element.id === t.unit.id) {
                                sat.push(element);
                              } else {
                                if (element.u_from?.id === t.unit.id) {
                                  sat.push(element);
                                }
                              }
                            });
                            setSatuan(sat);

                            let temp = [...po.pprod];
                            temp[e.index].prod_id = t.id;
                            temp[e.index].unit_id = t.unit?.id;
                            updatePo({ ...po, pprod: temp });
                          }}
                          placeholder="Pilih Kode Produk"
                          label={"[name]"}
                          detail
                          onDetail={() => {
                            setCurrentIndex(e.index);
                            setShowProd(true);
                          }}
                        />
                      </div>
                      {/* <div className="col-1 align-items-center p-0"> */}
                      <Link
                        onClick={() => {
                          let his = [];
                          histori.forEach((elem) => {
                            if (elem.product.id === e.prod_id) {
                              his.push(elem);
                            }
                          });
                          setFiltHis(his);

                          setCurrentIndex(e.index);
                          setShowHistori(true);
                        }}
                        className="sharp mt-1"
                      >
                        <i className="bx bx-history fs-18"></i>
                      </Link>
                      {/* </div> */}
                    </div>
                  )}
                />

                <Column
                  header="Satuan"
                  className="align-text-top"
                  field={""}
                  // style={{
                  //   width: "8rem",
                  // }}
                  body={(e) => (
                    <CustomDropdown
                      value={e.unit_id && checkUnit(e.unit_id)}
                      onChange={(t) => {
                        let temp = [...po.pprod];
                        temp[e.index].unit_id = t.id;
                        updatePo({ ...po, pprod: temp });
                      }}
                      option={satuan}
                      label={"[name]"}
                      placeholder="Pilih Satuan"
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowSatuan(true);
                      }}
                    />
                  )}
                />

                <Column
                  header="Kuantitas"
                  className="align-text-top"
                  field={""}
                  // style={{
                  //   width: "5rem",
                  // }}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.request ? e.request : 0}
                        onChange={(t) => {
                          let temp = [...po.pprod];
                          temp[e.index].request = t.target.value;
                          updatePo({ ...po, pprod: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        disabled
                      />
                    </div>
                  )}
                />

                <Column
                  header="Cost Alokasi"
                  className="align-text-top"
                  field={""}
                  // style={{
                  //   minWidth: "7rem",
                  // }}
                  body={(e) => (
                    <PrimeNumber
                      value={e.order ? e.order : ""}
                      onChange={(t) => {
                        let temp = [...po.pprod];
                        let val =
                          t.target.value > e.r_remain
                            ? e.r_remain
                            : t.target.value;
                        let result =
                          temp[e.index].order - val + temp[e.index].remain;
                        temp[e.index].order = val;

                        temp[e.index].total =
                          temp[e.index].price * temp[e.index].order;
                        temp[e.index].remain = result;
                        updatePo({ ...po, pprod: temp });

                        let newError = error;
                        newError.prod[e.index].jum = false;
                        setError(newError);
                      }}
                      min={0}
                      placeholder="0"
                      type="number"
                      error={error?.prod[e.index]?.jum}
                    />
                  )}
                />

                <Column
                  header="Action"
                  className="align-text-top"
                  field={""}
                  // style={{
                  //   minWidth: "7rem",
                  // }}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <Link
                        onClick={() => {}}
                        className="btn btn-danger shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-trash"></i>
                      </Link>
                    </div>
                  )}
                />

                <Column
                  className="align-text-top"
                  body={(e) =>
                    e.index === po.pprod.length - 1 ? (
                      <Link
                        onClick={() => {
                          updatePo({
                            ...po,
                            pprod: [
                              ...po.pprod,
                              {
                                id: 0,
                                prod_id: null,
                                rprod_id: null,
                                unit_id: null,
                                order: null,
                                price: null,
                                disc: null,
                                nett_price: null,
                                total: null,
                              },
                            ],
                            psup: po.pprod,
                          });
                        }}
                        className="btn btn-primary shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          let temp = [...po.pprod];
                          temp.splice(e.index, 1);
                          updatePo({
                            ...po,
                            pprod: temp,
                          });
                        }}
                        className="btn btn-danger shadow btn-xs sharp ml-1"
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

        <CustomAccordion
          tittle={"Bahan"}
          defaultActive={true}
          active={accor.produk}
          onClick={() => {
            setAccor({
              ...accor,
              produk: !accor.produk,
            });
          }}
          key={1}
          body={
            <>
              <DataTable
                responsiveLayout="none"
                value={po.pprod?.map((v, i) => {
                  return {
                    ...v,
                    index: i,
                    order: v?.order ?? 0,
                    price: v?.price ?? 0,
                    disc: v?.disc ?? 0,
                    total: v?.total ?? 0,
                  };
                })}
                className="display w-150 datatable-wrapper header-white no-border"
                showGridlines={false}
                emptyMessage={() => <div></div>}
              >
                <Column
                  header="Bahan Hasil Jadi"
                  className="align-text-top"
                  field={""}
                  // style={{
                  //   width: "12rem",
                  // }}
                  body={(e) => (
                    <div className="flex">
                      <div className="col-11 ml-0 p-0">
                        <CustomDropdown
                          value={selectedCity1}
                          options={cities}
                          onChange={onCityChange}
                          optionLabel="name"
                          placeholder="Select a City"
                        />
                      </div>
                      {/* <div className="col-1 align-items-center p-0"> */}
                      <Link
                        onClick={() => {
                          let his = [];
                          histori.forEach((elem) => {
                            if (elem.product.id === e.prod_id) {
                              his.push(elem);
                            }
                          });
                          setFiltHis(his);

                          setCurrentIndex(e.index);
                          setShowHistori(true);
                        }}
                        className="sharp mt-1"
                      >
                        <i className="bx bx-history fs-18"></i>
                      </Link>
                      {/* </div> */}
                    </div>
                  )}
                />

                <Column
                  header="Satuan"
                  className="align-text-top"
                  field={""}
                  // style={{
                  //   width: "8rem",
                  // }}
                  body={(e) => (
                    <CustomDropdown
                      value={e.unit_id && checkUnit(e.unit_id)}
                      onChange={(t) => {
                        let temp = [...po.pprod];
                        temp[e.index].unit_id = t.id;
                        updatePo({ ...po, pprod: temp });
                      }}
                      option={satuan}
                      label={"[name]"}
                      placeholder="Pilih Satuan"
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowSatuan(true);
                      }}
                    />
                  )}
                />

                <Column
                  header="Kuantitas"
                  className="align-text-top"
                  field={""}
                  // style={{
                  //   width: "5rem",
                  // }}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.request ? e.request : 0}
                        onChange={(t) => {
                          let temp = [...po.pprod];
                          temp[e.index].request = t.target.value;
                          updatePo({ ...po, pprod: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        disabled
                      />
                    </div>
                  )}
                />

                <Column
                  header="Harga"
                  className="align-text-top"
                  field={""}
                  // style={{
                  //   minWidth: "7rem",
                  // }}
                  body={(e) => (
                    <PrimeNumber
                      value={e.order ? e.order : ""}
                      onChange={(t) => {
                        let temp = [...po.pprod];
                        let val =
                          t.target.value > e.r_remain
                            ? e.r_remain
                            : t.target.value;
                        let result =
                          temp[e.index].order - val + temp[e.index].remain;
                        temp[e.index].order = val;

                        temp[e.index].total =
                          temp[e.index].price * temp[e.index].order;
                        temp[e.index].remain = result;
                        updatePo({ ...po, pprod: temp });

                        let newError = error;
                        newError.prod[e.index].jum = false;
                        setError(newError);
                      }}
                      min={0}
                      placeholder="0"
                      type="number"
                      error={error?.prod[e.index]?.jum}
                    />
                  )}
                />

                <Column
                  header="Action"
                  className="align-text-top"
                  field={""}
                  style={
                    {
                      //   minWidth: "7rem",
                    }
                  }
                  body={(e) => (
                    <div className="p-inputgroup">
                      <Link
                        onClick={() => {}}
                        className="btn btn-danger shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-trash"></i>
                      </Link>
                    </div>
                  )}
                />

                <Column
                  className="align-text-top"
                  body={(e) =>
                    e.index === po.pprod.length - 1 ? (
                      <Link
                        onClick={() => {
                          updatePo({
                            ...po,
                            pprod: [
                              ...po.pprod,
                              {
                                id: 0,
                                prod_id: null,
                                rprod_id: null,
                                unit_id: null,
                                order: null,
                                price: null,
                                disc: null,
                                nett_price: null,
                                total: null,
                              },
                            ],
                            psup: po.pprod,
                          });
                        }}
                        className="btn btn-primary shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-plus"></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          let temp = [...po.pprod];
                          temp.splice(e.index, 1);
                          updatePo({
                            ...po,
                            pprod: temp,
                          });
                        }}
                        className="btn btn-danger shadow btn-xs sharp ml-1"
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
        <InputText
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          placeholder="Jumlah Produk : 2"
        />
        <span className="ml-2">{value1}</span>
        <InputText
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          placeholder="Jumlah Bahan : 5"
        />
        <span className="ml-2">{value1}</span>
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
      <Row>
        <Col className="pt-0">
          <>
            {/* {header()} */}
            {body()}
            {footer()}
          </>
        </Col>
      </Row>
    </>
  );
};

export default InputFormula;
