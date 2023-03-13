import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_PR } from "src/redux/actions";
import DataSupplier from "../../../Mitra/Pemasok/DataPemasok";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import { el } from "date-fns/locale";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { InputNumber } from "primereact/inputnumber";
import { tr } from "src/data/tr";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";

const defError = {
  code: false,
  date: false,
  fk: false,
  prod: [
    {
      ret: false,
    },
  ],
};

const ReturBeliInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const pr = useSelector((state) => state.pr.current);
  const isEdit = useSelector((state) => state.pr.editPr);
  const dispatch = useDispatch();
  const [isRp, setRp] = useState(true);
  const [comp, setComp] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [fk, setFk] = useState(null);
  const [showSupplier, setShowSupplier] = useState(false);
  const [product, setProduct] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [lokasi, setLoc] = useState(null);
  const [error, setError] = useState(defError);
  const [accor, setAccor] = useState({
    produk: true,
    jasa: false,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getComp();
    getSupplier();
    getPpn();
    getFK();
    getProduct();
    getSatuan();
    getLoc();
  }, []);

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !pr.ret_code || pr.ret_code === "",
      date: !pr.ret_date || pr.ret_date === "",
      fk: !pr.fk_id,
      prod: [],
    };

    pr?.product.forEach((element, i) => {
      if (element.retur) {
        errors.prod[i] = {
          ret: !element.retur || element.retur === "" || element.retur === "0",
        };
      } else {
        errors.prod[i] = {
          ret: !element.retur || element.retur === "" || element.retur === "0",
        };
      }
    });

    if (pr?.product.length) {
      if (!errors.prod[0].ret) {
        errors.prod.forEach((e) => {
          for (var key in e) {
            e[key] = false;
          }
        });
      }
    }

    let validProduct = false;
    errors.prod.forEach((el) => {
      for (var k in el) {
        validProduct = !el[k];
      }
    });

    setError(errors);

    valid = !errors.code && !errors.date && !errors.fk && validProduct;

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });
    }

    return valid;
  };

  const getComp = async () => {
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
        setComp(data);
      }
    } catch (error) {}
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

  const getFK = async () => {
    const config = {
      ...endpoints.faktur,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((elem) => {
          let prod = [];
          elem.product.forEach((el) => {
            el.prod_id = el.prod_id.id;
            el.unit_id = el.unit_id.id;
            prod.push({
              ...el,
              r_order: el.order,
            });

            let temp = [...pr.product];
            pr.product.forEach((e, i) => {
              if (el.id === e.prod_id) {
                temp[i].order = el.order;
                updatePr({ ...pr, product: temp });
              }
            });
          });
          elem.product = prod;
          filt.push(elem);
        });
        setFk(filt);
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

  const getLoc = async () => {
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
        setLoc(data);
      }
    } catch (error) {}
  };

  const editPr = async () => {
    const config = {
      ...endpoints.editPr,
      endpoint: endpoints.editPr.endpoint + pr.id,
      data: pr,
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

  const addPr = async () => {
    const config = {
      ...endpoints.addPr,
      data: pr,
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
            detail: `Kode ${pr.ret_code} Sudah Digunakan`,
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

  const checkFK = (value) => {
    let selected = {};
    fk?.forEach((element) => {
      if (value === element.id) {
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

  const checkProd = (value) => {
    let selected = {};
    product?.forEach((element) => {
      if (value === element.id) {
        selected = element;
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

  const checkLoc = (value) => {
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
        editPr();
      } else {
        setUpdate(true);
        addPr();
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

  const getSubTotalBarang = () => {
    let total = 0;
    pr?.product?.forEach((el) => {
      if (el.nett_price && el.nett_price > 0) {
        total += parseInt(el.nett_price);
      } else {
        total += el.totl - (el.totl * el.disc) / 100;
      }
    });

    return total;
  };

  const pajk = (value) => {
    let nil = 0;
    ppn?.forEach((elem) => {
      if (
        supp(checkFK(pr.fk_id)?.ord_id.sup_id).supplier.sup_ppn ===
        elem.id
      ) {
        nil = elem.nilai;
      }
    });

    return nil;
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const updatePr = (e) => {
    dispatch({
      type: SET_CURRENT_PR,
      payload: e,
    });
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Retur Pembelian</b>
      </h4>
    );
  };

  const body = () => {
    let date = new Date(comp?.year_co, comp?.cutoff - 1, 31);
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-3">
            <PrimeInput
              label={tr[localStorage.getItem("language")].kd_ret}
              value={pr.ret_code}
              onChange={(e) => {
                updatePr({ ...pr, ret_code: e.target.value });

                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].masuk}
              error={error?.code}
            />
          </div>

          <div className="col-2">
            <PrimeCalendar
              label={tr[localStorage.getItem("language")].tgl}
              value={new Date(`${pr.ret_date}Z`)}
              onChange={(e) => {
                updatePr({ ...pr, ret_date: e.target.value });

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

          <div className="col-12 mt-2">
            <span className="fs-14">
              <b>{tr[localStorage.getItem("language")].ret_pur}</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].fak_pur}
            </label>
            <div className="p-inputgroup"></div>
            <PrimeDropdown
              value={pr.fk_id && checkFK(pr.fk_id)}
              options={fk}
              onChange={(e) => {
                updatePr({
                  ...pr,
                  fk_id: e.value.id,
                  product: e.value.product.map((v) => {
                    return { ...v, location: v.location.id, retur: 0 };
                  }),
                });
                let newError = error;
                newError.fk = false;
                setError(newError);
              }}
              optionLabel="fk_code"
              placeholder={tr[localStorage.getItem("language")].pilih}
              errorMessage="Nomor Faktur Belum Dipilih"
              error={error?.fk}
            />
          </div>
          {/* kode suplier otomatis keluar, karena sudah melekat di faktur pembelian  */}
          <div className="col-9" />

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].supplier}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={
                  pr.fk_id !== null
                    ? supp(checkFK(pr.fk_id)?.ord_id.sup_id)?.supplier?.sup_name
                    : null
                }
                placeholder={tr[localStorage.getItem("language")].supplier}
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].alamat}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={
                  pr.fk_id !== null
                    ? supp(checkFK(pr.fk_id)?.ord_id.sup_id).supplier
                        .sup_address
                    : ""
                }
                placeholder={tr[localStorage.getItem("language")].alamat}
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <PrimeInput
              label={tr[localStorage.getItem("language")].telp}
              isNumber
              value={
                pr.fk_id !== null
                  ? supp(checkFK(pr.fk_id)?.ord_id.sup_id).supplier.sup_telp1
                  : ""
              }
              placeholder={tr[localStorage.getItem("language")].telp}
              disabled
            />
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].type_pjk}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={
                  pr.fk_id !== null
                    ? pjk(
                        supp(checkFK(pr.fk_id)?.ord_id?.sup_id).supplier.sup_ppn
                      )?.name
                    : null
                }
                placeholder={tr[localStorage.getItem("language")].type_pjk}
                disabled
              />
            </div>
          </div>
        </Row>

        {pr.product?.length ? (
          <CustomAccordion
            tittle={`${tr[localStorage.getItem("language")].ret_pur} ${
              tr[localStorage.getItem("language")].prod
            }`}
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
                  value={pr.product?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      // retur: v?.retur ?? 0,
                      // price: v?.price ?? 0,
                      // disc: v?.disc ?? 0,
                      // nett_price: v?.nett_price ?? 0,
                      totl: v?.totl ?? 0,
                    };
                  })}
                  className="display w-150 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    header={tr[localStorage.getItem("language")].prod}
                    className="align-text-top"
                    style={{
                      width: "20rem",
                    }}
                    field={""}
                    body={(e) => (
                      <PrimeInput
                        value={e.prod_id && checkProd(e.prod_id).name}
                        // option={product}
                        // onChange={(u) => {
                        //   let sat = [];
                        //   satuan.forEach((element) => {
                        //     if (element.id === u.unit.id) {
                        //       sat.push(element);
                        //     } else {
                        //       if (element.u_from?.id === u.unit.id) {
                        //         sat.push(element);
                        //       }
                        //     }
                        //   });
                        //   // setSatuan(sat);

                        //   let temp = [...pr.product];
                        //   temp[e.index].prod_id = u.id;
                        //   temp[e.index].unit_id = u.unit?.id;
                        //   updatePr({ ...pr, product: temp });
                        // }}
                        placeholder={tr[localStorage.getItem("language")].pilih}
                        // label={"[name]"}
                        disabled={pr.fk_id !== null}
                        // onDetail={() => setShowProduk(true)}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].sat}
                    className="align-text-top"
                    style={{
                      width: "8rem",
                    }}
                    field={""}
                    body={(e) => (
                      <PrimeInput
                        value={e.unit_id && checkUnit(e.unit_id).code}
                        // onChange={(t) => {
                        //   let temp = [...pr.product];
                        //   temp[e.index].unit_id = t.id;
                        //   updatePr({ ...pr, product: temp });
                        // }}
                        // option={satuan}
                        // label={"[name]"}
                        placeholder={tr[localStorage.getItem("language")].sat}
                        disabled={pr.fk_id !== null}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].gudang}
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeInput
                        value={e.location && checkLoc(e.location)?.name}
                        // onChange={(t) => {
                        //   let temp = [...pr.product];
                        //   temp[e.index].location = t.id;
                        //   updatePr({ ...pr, product: temp });
                        // }}
                        // option={lokasi}
                        // label={"[name]"}
                        placeholder={
                          tr[localStorage.getItem("language")].gudang
                        }
                        disabled={pr.fk_id !== null}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].qty}
                    className="align-text-top"
                    style={{
                      width: "8rem",
                    }}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <PrimeNumber
                          value={e.retur && e.retur}
                          onChange={(u) => {
                            let temp = [...pr.product];
                            temp[e.index].retur = u.target.value;
                            temp[e.index].totl =
                              temp[e.index].retur * temp[e.index].price;
                            updatePr({ ...pr, product: temp });

                            let newError = error;
                            newError.prod[e.index].ret = false;

                            newError.prod.push({ ret: false });
                            setError(newError);
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
                          error={error?.prod[e.index]?.ret}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].price}
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputNumber
                          value={e.price && e.price}
                          onChange={(u) => {
                            let temp = [...pr.product];
                            temp[e.index].price = u.value;
                            temp[e.index].totl =
                              temp[e.index].retur * temp[e.index].price;
                            updatePr({ ...pr, product: temp });
                            console.log(temp);
                          }}
                          placeholder="0"
                          min={0}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].disc}
                    className="align-text-top"
                    style={{
                      width: "10rem",
                    }}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.disc && e.disc}
                          onChange={(u) => {
                            let temp = [...pr.product];
                            temp[e.index].disc = u.target.value;
                            updatePr({ ...pr, product: temp });
                            console.log(temp);
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
                        />
                        <span className="p-inputgroup-addon">%</span>
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].net_pcr}
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputNumber
                          value={e.nett_price && e.nett_price}
                          onChange={(u) => {
                            let temp = [...pr.product];
                            temp[e.index].nett_price = u.value;
                            updatePr({ ...pr, product: temp });
                            console.log(temp);
                          }}
                          placeholder="0"
                          min={0}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].total}
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <label className="text-nowrap">
                        <b>
                          Rp.{" "}
                          {formatIdr(
                            e.nett_price && e.nett_price != 0
                              ? e.nett_price
                              : e.totl - (e.totl * e.disc) / 100
                          )}
                        </b>
                      </label>
                    )}
                  />

                  <Column
                    body={(e) => (
                      <Link
                        onClick={() => {
                          let newError = error;
                          newError.prod.push({
                            ret: false,
                          });
                          setError(newError);

                          let temp = [...pr.product];
                          temp.splice(e.index, 1);
                          updatePr({
                            ...pr,
                            product: temp,
                          });
                        }}
                        className="btn btn-danger shadow btn-xs sharp ml-1"
                      >
                        <i className="fa fa-trash"></i>
                      </Link>
                    )}
                  />
                </DataTable>
              </>
            }
          />
        ) : (
          <></>
        )}

        {pr.product?.length ? (
          <div className="row ml-0 mr-0 mb-0 mt-6 justify-content-between">
            <div>
              <div className="row ml-1">
                {/* <div className="d-flex col-12 align-items-center">
                <label className="mt-1">{"Pisah Faktur"}</label>
                <InputSwitch
                  className="ml-4"
                  checked={currentItem && currentItem.faktur}
                  onChange={(e) => {
                    setCurrentItem({
                      ...currentItem,
                      faktur: e.target.value,
                    });
                  }}
                />
              </div> */}
              </div>
            </div>

            <div className="row justify-content-right col-6">
              <div className="col-6">
                <label className="text-label">
                  {tr[localStorage.getItem("language")].ttl_barang}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">DPP Barang</label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {`${tr[localStorage.getItem("language")].pjk_barang} (${pajk()}%)`}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  <b>Rp. {formatIdr((getSubTotalBarang() * pajk()) / 100)}</b>
                </label>
              </div>

              <div className="col-6 mt-3">
                <label className="text-label">
                  {tr[localStorage.getItem("language")].disc_tambh}
                </label>
              </div>

              <div className="col-6">
                <div className="p-inputgroup">
                  <PButton
                    label="Rp."
                    className={`${isRp ? "" : "p-button-outlined"}`}
                    onClick={() => setRp(true)}
                  />
                  <InputText
                    value={
                      isRp
                        ? (getSubTotalBarang() * pr.prod_disc) / 100
                        : pr.prod_disc
                    }
                    placeholder={
                      tr[localStorage.getItem("language")].disc_tambh
                    }
                    type="number"
                    min={0}
                    onChange={(e) => {
                      let disc = 0;
                      if (isRp) {
                        disc = (e.target.value / getSubTotalBarang()) * 100;
                      } else {
                        disc = e.target.value;
                      }
                      updatePr({ ...pr, prod_disc: disc });
                    }}
                  />
                  <PButton
                    className={`${isRp ? "p-button-outlined" : ""}`}
                    onClick={() => setRp(false)}
                  >
                    {" "}
                    <b>%</b>{" "}
                  </PButton>
                </div>
              </div>

              <div className="col-12">
                <Divider className="ml-12"></Divider>
              </div>

              <div className="col-6">
                <label className="text-label fs-14">
                  <b>{`${tr[localStorage.getItem("language")].total} ${
                    tr[localStorage.getItem("language")].bayar
                  }`}</b>
                </label>
              </div>

              <div className="col-6">
                <label className="text-label fs-14">
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      getSubTotalBarang() + (getSubTotalBarang() * pajk()) / 100
                    )}
                  </b>
                </label>
              </div>

              <div className="col-12">
                <Divider className="ml-12"></Divider>
              </div>

              {/*  */}
            </div>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div>
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
    );
  };

  return (
    <>
      <Row>
        <Col className="pt-0">
          <Card>
            <Card.Body>
              {/* {header()} */}
              {body()}
              {footer()}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <DataSupplier
        data={supplier}
        loading={false}
        popUp={true}
        show={showSupplier}
        onHide={() => {
          setShowSupplier(false);
        }}
        onInput={(e) => {
          setShowSupplier(!e);
        }}
        onSuccessInput={(e) => {
          getSupplier();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSupplier(false);
            updatePr({ ...pr, req_dep: e.data.id });
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

export default ReturBeliInput;
