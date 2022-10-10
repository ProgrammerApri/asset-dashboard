import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Card, Col, Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_SR } from "src/redux/actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DataCustomer from "src/jsx/screen/Mitra/Pelanggan/DataCustomer";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataSatuan from "src/jsx/screen/MasterLainnya/Satuan/DataSatuan";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { Dropdown } from "primereact/dropdown";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import { tr } from "src/data/tr";

const defError = {
  code: false,
  date: false,
  prod: [
    {
      ret: false,
    },
  ],
};

const ReturJualInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const sr = useSelector((state) => state.sr.current);
  const isEdit = useSelector((state) => state.sr.editSr);
  const dispatch = useDispatch();
  const [isRp, setRp] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [sale, setSale] = useState(null);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
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
    getCustomer();
    getPpn();
    getSale();
    getProduct();
    getSatuan();
    getLoc();
  }, []);

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !sr.ret_code || sr.ret_code === "",
      date: !sr.ret_date || sr.ret_date === "",
      sal: !sr.sale_id,
      prod: [],
    };

    sr?.product.forEach((element, i) => {
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

    if (sr?.product.length) {
      if (!errors.prod[0].ret) {
        errors.prod?.forEach((e) => {
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

    valid = !errors.code && !errors.date && !errors.sal && validProduct;

    if (!valid) {
      window.scrollTo({
        top: 180,
        left: 0,
        behavior: "smooth",
      });
    }

    return valid;
  };

  const getCustomer = async () => {
    const config = {
      ...endpoints.customer,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCustomer(data);
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

  const getSale = async () => {
    const config = {
      ...endpoints.sale,
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
          elem.jprod.forEach((el) => {
            el.prod_id = el.prod_id.id;
            el.unit_id = el.unit_id.id;
            prod.push({
              ...el,
              r_order: el.order,
            });

            let temp = [...sr.product];
            sr.product.forEach((e, i) => {
              if (el.id === e.prod_id) {
                temp[i].order = el.order;
                updateSr({ ...sr, product: temp });
              }
            });
          });
          elem.jprod = prod;
          filt.push(elem);
        });
        setSale(filt);
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

  const editSR = async () => {
    const config = {
      ...endpoints.editSR,
      endpoint: endpoints.editSR.endpoint + sr.id,
      data: sr,
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

  const addSR = async () => {
    const config = {
      ...endpoints.addSR,
      data: sr,
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
            detail: `Kode ${sr.ret_code} Sudah Digunakan`,
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

  const checkSale = (value) => {
    let selected = {};
    sale?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkPjk = (value) => {
    let selected = {};
    ppn?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkCus = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer.id) {
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
        console.log("SELEC");
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
        editSR();
      } else {
        setUpdate(true);
        addSR();
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
    sr?.product?.forEach((el) => {
      if (el.nett_price && el.nett_price > 0) {
        total += parseInt(el.nett_price);
      } else {
        total += el.totl - (el.totl * el.disc) / 100;
      }
    });

    return total;
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const updateSr = (e) => {
    dispatch({
      type: SET_CURRENT_SR,
      payload: e,
    });
  };

  const slTemplate = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.ord_code} - ${option.pel_id.cus_name}`
          : ""}
      </div>
    );
  };

  const valTemp = (option, props) => {
    if (option) {
      return <div>{option !== null ? `${option.ord_code}` : ""}</div>;
    }

    return <span>{props.placeholder}</span>;
  };

  const pjk = (value) => {
    let nil = 0;
    ppn?.forEach((elem) => {
      if (
        checkCus(checkSale(sr.sale_id)?.so_id?.pel_id)?.customer?.cus_pjk ===
        elem.id
      ) {
        nil = elem.nilai;
      }
    });

    return nil;
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Retur Penjualan</b>
      </h4>
    );
  };

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-3">
            <PrimeInput
              label={tr[localStorage.getItem("language")].kd_ret}
              value={sr.ret_code}
              onChange={(e) => {
                updateSr({ ...sr, ret_code: e.target.value });
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
              value={new Date(`${sr.ret_date}Z`)}
              onChange={(e) => {
                updateSr({ ...sr, ret_date: e.value });

                let newError = error;
                newError.date = false;
                setError(newError);
              }}
              placeholder={tr[localStorage.getItem("language")].pilih_tgl}
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.date}
            />
          </div>

          <div className="col-12 mt-0">
            <span className="fs-14">
              <b>{`${tr[localStorage.getItem("language")].info} ${
                tr[localStorage.getItem("language")].sale
              }`}</b>
            </span>
            {/* </div>
          <div className="col-12"> */}
            <Divider className="mt-2"></Divider>
          </div>

          <div className="col-3">
            <PrimeDropdown
              label={tr[localStorage.getItem("language")].kd_sale}
              value={sr.sale_id && checkSale(sr.sale_id)}
              options={sale}
              onChange={(e) => {
                updateSr({
                  ...sr,
                  sale_id: e.value.id,
                  pel_id: e.value?.pel_id?.id,
                  product: e.value.jprod.map((v) => {
                    return { ...v, totl: 0 };
                  }),
                });
                let newError = error;
                newError.sal = false;
                setError(newError);
              }}
              optionLabel={"[ord_code] - [pel_id.cus_name]"}
              placeholder={tr[localStorage.getItem("language")].pilih}
              filter
              filterBy="ord_code"
              itemTemplate={slTemplate}
              valueTemplate={valTemp}
              errorMessage="Nomor Pembelian Belum Dipilih"
              error={error?.sal}
            />
          </div>

          <div className="col-9"></div>
          {/* kode suplier otomatis keluar, karena sudah melekat di faktur pembelian  */}

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].customer}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={
                  sr.sale_id !== null
                    ? `${
                        checkCus(checkSale(sr.sale_id)?.so_id?.pel_id)?.customer
                          ?.cus_name
                      }`
                    : null
                }
                placeholder={tr[localStorage.getItem("language")].customer}
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].alamat}
            </label>
            <div className="p-inputgroup mt-2">
              <InputText
                value={
                  sr.sale_id !== null
                    ? checkCus(checkSale(sr.sale_id)?.so_id?.pel_id)?.customer
                        ?.cus_address
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
                sr.sale_id !== null
                  ? checkCus(checkSale(sr.sale_id)?.so_id?.pel_id)?.customer
                      ?.cus_telp1
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
                  sr.sale_id !== null
                    ? checkPjk(
                        checkCus(checkSale(sr.sale_id)?.so_id?.pel_id)?.customer
                          ?.cus_pjk
                      )?.name
                    : null
                }
                placeholder={tr[localStorage.getItem("language")].type_pjk}
                disabled
              />
            </div>
          </div>
        </Row>

        {sr.product?.length ? (
          <CustomAccordion
            tittle={`${tr[localStorage.getItem("language")].prod} ${
              tr[localStorage.getItem("language")].ret_sale
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
                  value={sr.product?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      // retur: v?.retur ?? 0,
                      // price: v?.price ?? 0,
                      // disc: v?.disc ?? 0,
                      // nett_price: v?.nett_price ?? 0,
                      total: v?.totl ?? 0,
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
                        //   satuan?.forEach((element) => {
                        //     if (element.id === u.unit.id) {
                        //       sat.push(element);
                        //     } else {
                        //       if (element.u_from?.id === u.unit.id) {
                        //         sat.push(element);
                        //       }
                        //     }
                        //   });
                        //   // setSatuan(sat);

                        //   let temp = [...sr.product];
                        //   temp[e.index].prod_id = u.id;
                        //   temp[e.index].unit_id = u.unit?.id;
                        //   updateSr({ ...sr, product: temp });
                        // }}
                        placeholder={tr[localStorage.getItem("language")].prod}
                        // label={"[name]"}
                        // detail
                        disabled={sr.sale_id !== null}
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
                        //   let temp = [...sr.product];
                        //   temp[e.index].unit_id = t.id;
                        //   updateSr({ ...sr, product: temp });
                        // }}
                        // option={satuan}
                        // label={"[name]"}
                        placeholder={tr[localStorage.getItem("language")].sat}
                        // detail
                        // onDetail={() => setShowSatuan(true)}
                        disabled={sr.sale_id !== null}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].gudang}
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeInput
                        value={e.location && checkLoc(e.location).name}
                        // onChange={(t) => {
                        //   let temp = [...sr.product];
                        //   temp[e.index].location = t.id;
                        //   updateSr({ ...sr, product: temp });
                        // }}
                        // option={satuan}
                        // label={"[name]"}
                        placeholder={
                          tr[localStorage.getItem("language")].gudang
                        }
                        // detail
                        // onDetail={() => setShowSatuan(true)}
                        disabled={sr.sale_id !== null}
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].qty}
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        value={e.retur && e.retur}
                        onChange={(u) => {
                          let temp = [...sr.product];
                          temp[e.index].retur = u.target.value;
                          temp[e.index].totl =
                            temp[e.index].retur * temp[e.index].price;
                          updateSr({ ...sr, product: temp });

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
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].price}
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.price && e.price}
                          onChange={(u) => {
                            let temp = [...sr.product];
                            temp[e.index].price = u.target.value;
                            temp[e.index].totl =
                              temp[e.index].retur * temp[e.index].price;
                            updateSr({ ...sr, product: temp });
                            console.log(temp);
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].disc}
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.disc && e.disc}
                          onChange={(u) => {
                            let temp = [...sr.product];
                            temp[e.index].disc = u.target.value;
                            updateSr({ ...sr, product: temp });
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
                    header={tr[localStorage.getItem("language")].net_prc}
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.nett_price && e.nett_price}
                          onChange={(u) => {
                            let temp = [...sr.product];
                            temp[e.index].nett_price = u.target.value;
                            updateSr({ ...sr, product: temp });
                            console.log(temp);
                          }}
                          placeholder="0"
                          type="number"
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
                    className="align-text-top"
                    body={(e) => (
                      <Link
                        onClick={() => {
                          let newError = error;
                          newError.prod.push({
                            ret: false,
                          });
                          setError(newError);

                          let temp = [...sr.product];
                          temp.splice(e.index, 1);
                          updateSr({
                            ...sr,
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

        {sr.product.length ? (
          <div className="row ml-0 mr-0 mb-0 mt-6 justify-content-between">
            <div>
              {/* <div className="row ml-1">
              <div className="d-flex col-12 align-items-center">
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
              </div>
            </div> */}
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
                  {`${
                    tr[localStorage.getItem("language")].pjk_barang
                  } (${pjk()}%)`}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  <b>Rp. {formatIdr((getSubTotalBarang() * pjk()) / 100)}</b>
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
                        ? (getSubTotalBarang() * sr.prod_disc) / 100
                        : sr.prod_disc
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
                      updateSr({ ...sr, prod_disc: disc });
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
                <label className="text-label">
                  <b>{`${tr[localStorage.getItem("language")].total} ${
                    tr[localStorage.getItem("language")].bayar
                  }`}</b>
                </label>
              </div>

              <div className="col-6">
                <label className="text-label fs-16">
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      getSubTotalBarang() + (getSubTotalBarang() * pjk()) / 100
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
        <Col>
          <Card>
            <Card.Body>
              {/* {header()} */}
              {body()}
              {footer()}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <DataCustomer
        data={customer}
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
          getCustomer();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSupplier(false);
            updateSr({ ...sr, pel_id: e.data.id });
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
            updateSr({ ...sr, product: e.data.id });
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

export default ReturJualInput;
