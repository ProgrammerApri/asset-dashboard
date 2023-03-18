import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Calendar } from "primereact/calendar";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import { InputSwitch } from "primereact/inputswitch";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import endpoints from "../../../../../utils/endpoints";
import { tr } from "../../../../../data/tr";
import {
  SET_CURRENT_INV,
  SET_CURRENT_INVPJ,
} from "../../../../../redux/actions";

const defError = {
  code: false,
  date: false,
  ord: false,
};

const BuatInvoicePB = ({ onCancel, onSuccess }) => {
  const inv = useSelector((state) => state.inv.current);
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [pajak, setPajak] = useState(null);
  const [product, setProduct] = useState(null);
  const [jasa, setJasa] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [currency, setCur] = useState(null);
  const [fkCode, setFkCode] = useState(null);
  const [setup, setSetup] = useState(true);
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const isEdit = useSelector((state) => state.inv.editInv);
  const [isRp, setRp] = useState(false);
  const [isRpJasa, setRpJasa] = useState(false);
  const [showOrder, SetShowOrder] = useState(false);
  const [doubleClick, setDoubleClick] = useState(false);
  const [error, setError] = useState(defError);
  const dispatch = useDispatch();
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
    getORD();
    getSupplier();
    getPpn();
    getProduct();
    getJasa();
    getSatuan();
    getLoct();
    getCur();
    getSetup();
  }, []);

  const getORD = async () => {
    const config = {
      ...endpoints.order,
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((elem) => {
          if (!elem.faktur && !elem.invoice) {
            let prod = [];
            elem.dprod.forEach((el) => {
              el.prod_id = el.prod_id.id;
              el.unit_id = el.unit_id.id;
              el.location = el.location?.id;
              prod.push({
                ...el,
                r_order: el.order,
              });

              let temp = [...inv.product];
              inv.product.forEach((e, i) => {
                if (el.id === e.dprod_id) {
                  temp[i].order = el.order;
                  updateINV({ ...inv, product: temp });
                }
              });
            });
            elem.dprod = prod;

            let jasa = [];
            elem.djasa.forEach((element) => {
              element.jasa_id = element.jasa_id.id;
              element.unit_id = element.unit_id.id;
              jasa.push({
                ...element,
                r_order: element.order,
              });

              let temp = [...inv.jasa];
              inv.jasa.forEach((e, i) => {
                if (element.id === e.djasa_id) {
                  temp[i].order = element.order;
                  updateINV({ ...inv, jasa: temp });
                }
              });
            });
            elem.djasa = jasa;
            filt.push(elem);
          }
        });
        setOrder(filt);
      }
    } catch (error) {
      console.log("------");
      console.log(error);
    }
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
        setPajak(data);
      }
    } catch (error) {}
  };

  const getCur = async () => {
    const config = {
      ...endpoints.currency,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCur(data);
      }
    } catch (error) {}
  };

  const getProduct = async () => {
    const config = {
      ...endpoints.product,
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
        setProduct(data);
      }
    } catch (error) {}
  };

  const getJasa = async () => {
    const config = {
      ...endpoints.jasa,
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
        setJasa(data);
      }
    } catch (error) {}
  };

  const getSatuan = async () => {
    const config = {
      ...endpoints.getSatuan,
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
        setSatuan(data);
      }
    } catch (error) {}
  };

  const getLoct = async () => {
    const config = {
      ...endpoints.lokasi,
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
        setLokasi(data);
      }
    } catch (error) {}
  };

  const getSetup = async () => {
    const config = {
      ...endpoints.getCompany,
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
        setSetup(data);
      }
    } catch (error) {}
  };

  const editinv = async () => {
    const config = {
      ...endpoints.editInvPb,
      endpoint: endpoints.editInvPb.endpoint + currentItem.id,
      data: inv,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].pesan_berhasil,
            life: 3000,
          });
        }, 500);
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

  const addinv = async () => {
    const config = {
      ...endpoints.addInvPb,
      data: inv,
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
            detail: `Kode ${inv.inv_code} Sudah Digunakan`,
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

  const onSubmit = () => {
    if (isValid()) {
      if (isEdit) {
        setUpdate(true);
        editinv();
      } else {
        setUpdate(true);
        addinv();
      }
    }
  };

  const checkOrd = (value) => {
    let selected = {};
    order?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkSup = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element.supplier.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkPjk = (value) => {
    let selected = {};
    pajak?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkCur = (value) => {
    let selected = {};
    currency?.forEach((element) => {
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

  const checkProd = (value) => {
    let selected = {};
    product?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const checkJasa = (value) => {
    let selected = {};
    jasa?.forEach((element) => {
      if (value === element.jasa.id) {
        selected = element;
      }
    });

    return selected;
  };

  const FKCode = (value) => {
    let selected = null;
    fkCode?.forEach((element) => {
      if (element.faktur.fk_code === value) {
        selected = element;
      }
    });
    console.log(selected);
    return selected;
  };

  const ppn = () => {
    let nil = 0;
    pajak?.forEach((elem) => {
      if (
        checkSup(checkOrd(inv.ord_id)?.sup_id).supplier?.sup_ppn === elem.id
      ) {
        nil = elem.nilai;
      }
    });

    return nil;
  };

  const updateINV = (e) => {
    dispatch({
      type: SET_CURRENT_INV,
      payload: e,
    });
  };

  const getSubTotalBarang = () => {
    let total = 0;
    inv?.product?.forEach((el) => {
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
    inv?.jasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return total;
  };

  const formatIdr = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !inv.inv_code || inv.inv_code === "",
      date: !inv.inv_date || inv.inv_date === "",
      ord: !inv.ord_id,
    };

    setError(errors);

    valid = !errors.code && !errors.date && !errors.ord;

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
    let date = new Date(setup?.year_co, setup?.cutoff - 1, 31);
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-3">
            <PrimeInput
              label={"Kode Invoice"}
              value={inv.inv_code}
              onChange={(e) => {
                updateINV({ ...inv, inv_code: e.target?.value });
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
              value={new Date(`${inv.inv_date}Z`)}
              onChange={(e) => {
                updateINV({ ...inv, inv_date: e.value });

                setError({ ...error, date: false });
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
              <b>Informasi Pembelian</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].kd_pur}
            </label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={inv.ord_id && checkOrd(inv?.ord_id)}
              onChange={(e) => {
                console.log(e);
                let totl_prod = 0;
                let totl_jasa = 0;
                let total_bayar = 0;
                e?.dprod?.forEach((el) => {
                  if (el.nett_price && el.nett_price > 0) {
                    totl_prod += parseInt(el.nett_price);
                  } else {
                    totl_prod += el.total - (el.total * el.disc) / 100;
                  }
                });

                e?.djasa?.forEach((el) => {
                  totl_jasa += el.total - (el.total * el.disc) / 100;
                });

                total_bayar =
                  totl_prod +
                  totl_jasa +
                  ((totl_prod + totl_jasa) * ppn()) / 100;

                updateINV({
                  ...inv,
                  ord_id: e?.id ?? null,
                  product: e?.dprod ?? null,
                  jasa: e?.djasa ?? null,
                  total_bayar: total_bayar,
                });
                let newError = error;
                newError.ord = false;
                setError(newError);
              }}
              option={order}
              // detail
              // onDetail={() => SetShowOrder(true)}
              label={"[ord_code]"}
              placeholder={tr[localStorage.getItem("language")].kd_pur}
              errorMessage="Kode Pembelian Belum Dipilih"
              error={error?.ord}
            />
          </div>

          <div className="col-9" />

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].supplier}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={
                  inv.ord_id !== null
                    ? checkSup(checkOrd(inv.ord_id)?.sup_id.id).supplier
                        ?.sup_name
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
                  inv.ord_id !== null
                    ? checkSup(checkOrd(inv.ord_id)?.sup_id.id).supplier
                        ?.sup_address
                    : ""
                }
                placeholder={tr[localStorage.getItem("language")].alamat}
                disabled
              />
            </div>
          </div>

          <div className="col-2">
            <PrimeInput
              label={tr[localStorage.getItem("language")].telp}
              // isNumber
              value={
                inv.ord_id !== null
                  ? checkSup(checkOrd(inv.ord_id)?.sup_id.id).supplier
                      ?.sup_telp1
                  : ""
              }
              placeholder={tr[localStorage.getItem("language")].telp}
              disabled
            />
          </div>

          <div className="col-2">
            <label className="text-label">
              {tr[localStorage.getItem("language")].pajak}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={
                  inv.ord_id !== null
                    ? checkSup(checkOrd(inv.ord_id)?.sup_id.id).supplier
                        ?.sup_ppn !== null
                      ? `${
                          checkPjk(
                            checkSup(checkOrd(inv.ord_id)?.sup_id.id).supplier
                              ?.sup_ppn
                          )?.name
                        } (${
                          checkPjk(
                            checkSup(checkOrd(inv.ord_id)?.sup_id.id).supplier
                              ?.sup_ppn
                          )?.nilai
                        } %)`
                      : ""
                    : null
                }
                placeholder={tr[localStorage.getItem("language")].pajak}
                disabled
              />
            </div>
          </div>

          <div className="col-2">
            <label className="text-label">
              {tr[localStorage.getItem("language")].currency}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={
                  inv.ord_id !== null
                    ? checkSup(checkOrd(inv.ord_id)?.sup_id.id).supplier
                        ?.sup_curren !== null
                      ? checkCur(
                          checkSup(checkOrd(inv.ord_id)?.sup_id.id).supplier
                            ?.sup_curren
                        )?.code
                      : "IDR"
                    : null
                }
                placeholder={tr[localStorage.getItem("language")].currency}
                disabled
              />
            </div>
          </div>

          {/* <div className="col-12 mt-2">
            <span className="fs-14">
              <b>Informasi Faktur Pajak</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div> */}

          <div className="col-3" hidden>
            <label className="text-label">Faktur Pajak</label>
            <div className="p-inputgroup mt-2">
              <InputText
                value={inv.fk_tax}
                onChange={(e) => {
                  updateINV({ ...inv, fk_tax: e.target.value });
                }}
                placeholder="Masukan Faktur Pajak"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">
              {tr[localStorage.getItem("language")].ket}
            </label>
            <div className="p-inputgroup mt-2">
              <InputText
                value={inv.inv_desc}
                onChange={(e) => {
                  updateINV({ ...inv, inv_desc: e.target.value });
                }}
                placeholder={tr[localStorage.getItem("language")].masuk}
              />
            </div>
          </div>
        </Row>

        {inv.product?.length ? (
          <CustomAccordion
            tittle={"Detail Penjualan Produk"}
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
                  value={inv.product?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
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
                    hidden
                    header={tr[localStorage.getItem("language")].barcode}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.prod_id && checkProd(e.prod_id).barcode}
                          placeholder={
                            tr[localStorage.getItem("language")].barcode
                          }
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].prod}
                    field={""}
                    style={{
                      minWidth: "25rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={
                            e.prod_id &&
                            `${checkProd(e.prod_id).name} (${
                              checkProd(e.prod_id).code
                            })`
                          }
                          placeholder={
                            tr[localStorage.getItem("language")].prod
                          }
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].gudang}
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.location && checkLoc(e.location).code}
                          placeholder={
                            tr[localStorage.getItem("language")].gudang
                          }
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].satuan}
                    field={""}
                    style={{
                      minWidth: "7rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.unit_id && checkUnit(e.unit_id).code}
                          placeholder={
                            tr[localStorage.getItem("language")].satuan
                          }
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].qty}
                    field={""}
                    style={{
                      minWidth: "8rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        prc
                        value={e.order && e.order}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].price}
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.price && e.price}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled
                      />
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].disc}
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.disc && e.disc}
                          placeholder="0"
                          type="number"
                          min={0}
                          disabled
                        />
                        <span className="p-inputgroup-addon">%</span>
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].net_prc}
                    field={""}
                    style={{
                      minWidth: "10rem",
                    }}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.nett_price && e.nett_price}
                          placeholder="0"
                          type="number"
                          min={0}
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].total}
                    style={{
                      minWidth: "12rem",
                    }}
                    body={(e) => (
                      <label className="text-nowrap">
                        <b>
                          Rp.{" "}
                          {`${
                            e.nett_price && e.nett_price !== 0
                              ? e.nett_price
                              : e.total - (e.total * e.disc) / 100
                          }`.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                        </b>
                      </label>
                    )}
                  />
                </DataTable>
              </>
            }
          />
        ) : (
          <></>
        )}

        {inv.jasa?.length ? (
          <CustomAccordion
            tittle={"Detail Pembelian Jasa"}
            defaultActive={false}
            active={accor.jasa}
            onClick={() => {
              setAccor({
                ...accor,
                jasa: !accor.jasa,
              });
            }}
            key={1}
            body={
              <>
                <DataTable
                  responsiveLayout="scroll"
                  value={inv.jasa?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      price: v?.price ?? 0,
                      disc: v?.disc ?? 0,
                      total: v?.total ?? 0,
                    };
                  })}
                  className="display w-170 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    header={tr[localStorage.getItem("language")].supplier}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={
                            e.sup_id &&
                            `${checkSup(e.sup_id).supplier.sup_name} (${
                              checkSup(e.sup_id).supplier.sup_code
                            })`
                          }
                          placeholder={
                            tr[localStorage.getItem("language")].supplier
                          }
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].jasa}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={
                            e.jasa_id &&
                            `${checkJasa(e.jasa_id).jasa.name} (${
                              checkJasa(e.jasa_id).jasa.code
                            })`
                          }
                          placeholder={
                            tr[localStorage.getItem("language")].jasa
                          }
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].satuan}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.unit_id && checkUnit(e.unit_id).name}
                          placeholder={
                            tr[localStorage.getItem("language")].satuan
                          }
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].qty}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.order && e.order}
                          placeholder="0"
                          type="number"
                          min={0}
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].price}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.price && e.price}
                          onChange={(u) => {}}
                          placeholder="0"
                          type="number"
                          min={0}
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].disc}
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.disc && e.disc}
                          placeholder="0"
                          type="number"
                          min={0}
                          disabled
                        />
                        <span className="p-inputgroup-addon">%</span>
                      </div>
                    )}
                  />

                  <Column
                    header={tr[localStorage.getItem("language")].total}
                    // style={{
                    //   minWidth: "12rem",
                    // }}
                    body={(e) => (
                      <label className="text-nowrap">
                        <b>
                          {`Rp. ${e.total - (e.total * e.disc) / 100}`.replace(
                            /(\d)(?=(\d{3})+(?!\d))/g,
                            "$1."
                          )}
                        </b>
                      </label>
                    )}
                  />
                </DataTable>
              </>
            }
          />
        ) : (
          <></>
        )}

        {inv.product?.length ? (
          <div className="row ml-0 mr-0 mb-0 mt-6 justify-content-between">
            <div>
              <div className="row ml-1">
                {inv.jasa.length > 0 && inv.product.length > 0 && (
                  <div className="d-flex col-12 align-items-center">
                    <label className="mt-1"></label>
                    <InputSwitch
                      className="ml-4"
                      checked={inv.split_inv}
                      disabled
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="row justify-content-right col-6">
              <div className="col-6">
                <label className="text-label">
                  {inv.split_inv
                    ? tr[localStorage.getItem("language")].ttl_barang
                    : tr[localStorage.getItem("language")].sub_ttl}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {inv.split_inv ? (
                    <b>
                      Rp.
                      {formatIdr(getSubTotalBarang())}
                    </b>
                  ) : (
                    <b>
                      Rp.
                      {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                    </b>
                  )}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {inv.split_inv ? "DPP Barang" : "DPP"}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {inv.split_inv ? (
                    <b>
                      Rp.
                      {formatIdr(getSubTotalBarang())}
                    </b>
                  ) : (
                    <b>
                      Rp.
                      {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                    </b>
                  )}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {inv.split_inv
                    ? `${tr[localStorage.getItem("language")].pjk_barang} (11%)`
                    : `${tr[localStorage.getItem("language")].pajak} (11%)`}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  {inv.split_inv ? (
                    <b>
                      Rp.
                      {formatIdr((getSubTotalBarang() * ppn()) / 100)}
                    </b>
                  ) : (
                    <b>
                      Rp.{" "}
                      {formatIdr(
                        ((getSubTotalBarang() + getSubTotalJasa()) * ppn()) / 100
                      )}
                    </b>
                  )}
                </label>
              </div>

              <div className="col-6 mt-0">
                <label className="text-label">
                  {tr[localStorage.getItem("language")].disc_tambh}
                </label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  <b>
                    Rp.{" "}
                    {checkOrd(inv?.ord_id)?.total_disc
                      ? formatIdr(checkOrd(inv?.ord_id)?.total_disc)
                      : formatIdr(0)}
                  </b>
                </label>
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
                  {inv.split_inv ? (
                    <b>
                      Rp.{" "}
                      {formatIdr(
                        getSubTotalBarang() + (getSubTotalBarang() * ppn()) / 100
                      )}
                    </b>
                  ) : (
                    <b>
                      Rp.{" "}
                      {formatIdr(
                        getSubTotalBarang() +
                          getSubTotalJasa() +
                          ((getSubTotalBarang() + getSubTotalJasa()) * ppn()) / 100
                      )}
                    </b>
                  )}
                </label>
              </div>

              <div className="col-12">
                <Divider className="ml-12"></Divider>
              </div>

              {inv.split_inv ? (
                <>
                  <div className="row justify-content-right col-12 mt-4">
                    <div className="col-6 mt-4">
                      <label className="text-label">
                        {tr[localStorage.getItem("language")].ttl_jasa}
                      </label>
                    </div>

                    <div className="col-6 mt-4">
                      <label className="text-label">
                        <b>
                          Rp.
                          {formatIdr(getSubTotalJasa())}
                        </b>
                      </label>
                    </div>

                    <div className="col-6">
                      <label className="text-label">DPP Jasa</label>
                    </div>

                    <div className="col-6">
                      <label className="text-label">
                        <b>
                          Rp.
                          {formatIdr(getSubTotalJasa())}
                        </b>
                      </label>
                    </div>

                    <div className="col-6">
                      <label className="text-label">{`${
                        tr[localStorage.getItem("language")].pjk_jasa
                      } (2%)`}</label>
                    </div>

                    <div className="col-6">
                      <label className="text-label">
                        <b>
                          Rp.
                          {formatIdr((getSubTotalJasa() * 2) / 100)}
                        </b>
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
                          className={`${isRpJasa ? "" : "p-button-outlined"}`}
                          onClick={() => setRpJasa(true)}
                          disabled
                        />
                        <InputText
                          value={
                            isRpJasa
                              ? (getSubTotalJasa() * inv.jasa_disc) / 100
                              : inv.jasa_disc
                          }
                          placeholder={
                            tr[localStorage.getItem("language")].disc
                          }
                          type="number"
                          min={0}
                          disabled
                          onChange={(e) => {
                            // let disc = 0;
                            // if (isRpJasa) {
                            //   disc = (e.target.value / getSubTotalJasa()) * 100;
                            // } else {
                            //   disc = e.target.value;
                            // }
                            // updateINV({ ...Do, jasa_disc: disc });
                          }}
                        />
                        <PButton
                          className={`${isRpJasa ? "p-button-outlined" : ""}`}
                          onClick={() => setRpJasa(false)}
                          disabled
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
                            getSubTotalJasa() + (getSubTotalJasa() * 2) / 100
                          )}
                        </b>
                      </label>
                    </div>

                    <div className="col-12">
                      <Divider className="ml-12"></Divider>
                    </div>
                  </div>
                </>
              ) : null}
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
            label="Batal"
            onClick={onCancel}
            className="p-button-text btn-primary"
          />
          <PButton
            label="Simpan"
            icon="pi pi-check"
            onClick={onSubmit}
            autoFocus
            loading={update}
            disabled={setup?.cutoff === null}
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

      {/* <DataOrder
        data={order}
        loading={false}
        popUp={true}
        show={showOrder}
        onHide={() => {
          SetShowOrder(false);
        }}
        onInput={(e) => {
          SetShowOrder(!e);
        }}
        onSuccessInput={(e) => {
          getORD();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            SetShowOrder(false);
            updateINV({ ...inv, ord_id: e.data.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      /> */}
    </>
  );
};

export default BuatInvoicePB;
