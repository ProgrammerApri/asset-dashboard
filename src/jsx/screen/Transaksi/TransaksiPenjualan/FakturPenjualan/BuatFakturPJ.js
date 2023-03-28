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
import { SET_CURRENT_INV } from "src/redux/actions";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";

import { InputSwitch } from "primereact/inputswitch";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import endpoints from "../../../../../utils/endpoints";
import { tr } from "../../../../../data/tr";
import { SET_CURRENT_FK } from "../../../../../redux/actions";

const defError = {
  code: false,
  date: false,
  cus: false,
};

const BuatFakturPJ = ({ onCancel, onSuccess }) => {
  const inv = useSelector((state) => state.fk_pj.current_fk);
  const [order, setOrder] = useState(null);
  const [invoice, setInvoice] = useState(null);
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
  const isEdit = useSelector((state) => state.fk_pj.editFkPj);
  const [isRp, setRp] = useState(false);
  const [isRpJasa, setRpJasa] = useState(false);
  const [showOrder, SetShowOrder] = useState(false);
  const [doubleClick, setDoubleClick] = useState(false);
  const [error, setError] = useState(defError);
  const dispatch = useDispatch();
  const [selectedProducts, setSelectedProducts] = useState(null);
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
    // getORD();
    getSetup();
    getSupplier();
    getPpn();
    getProduct();
    getJasa();
    getSatuan();
    getLoct();
    getCur();
  }, []);

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
        getInv();
      }
    } catch (error) {}
  };

  const getInv = async () => {
    const config = {
      ...endpoints.invoice_pj,
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setInvoice(data);

        getCustomer(data);
      }
    } catch (error) {}
  };

  const getCustomer = async (invoice) => {
    const config = {
      ...endpoints.customer,
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data?.forEach((element) => {
          invoice.forEach((elem) => {
            if (
              element.customer?.id === elem?.sale_id?.pel_id &&
              elem?.sale_id?.surat_jalan === 1 &&
              !elem?.faktur
            ) {
              filt.push(element);
            }
          });
        });

        console.log("============cuss");
        console.log(filt);

        let groupprd = filt?.filter(
          (el, i) =>
            i === filt.findIndex((ek) => el?.customer?.id === ek?.customer?.id)
        );
        setCustomer(groupprd);
      }
    } catch (error) {}
  };

  const getFkCode = async () => {
    const config = {
      ...endpoints.fakturCode,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setFkCode(data);
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

  const editinv = async () => {
    const config = {
      ...endpoints.editFkPj,
      endpoint: endpoints.editFkPj.endpoint + currentItem.id,
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
            summary: tr[localStorage.getItem("language")].berhasl,
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
      ...endpoints.addFkPj,
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
            detail: `Kode ${inv.fk_code} Sudah Digunakan`,
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

  const checkCus = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer.id) {
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

  const checkInv = (value) => {
    let selected = {};
    invoice?.forEach((element) => {
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

  const updateINV = (e) => {
    dispatch({
      type: SET_CURRENT_FK,
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

  const pjk = (value) => {
    let nil = 0;
    pajak?.forEach((elem) => {
      if (inv?.pel_id?.cus_pjk === elem.id) {
        nil = elem.nilai;
      }
    });

    return nil;
  };

  const formatIdr = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Buat Faktur</b>
      </h4>
    );
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !inv.fk_code || inv.fk_code === "",
      date: !inv.fk_date || inv.fk_date === "",
      cus: !inv.pel_id,
    };

    setError(errors);

    valid = !errors.code && !errors.date && !errors.cus;

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
              label={tr[localStorage.getItem("language")].kd_fk}
              value={inv.fk_code}
              onChange={(e) => {
                updateINV({ ...inv, fk_code: e.target?.value });
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
              value={new Date(`${inv.fk_date}Z`)}
              onChange={(e) => {
                updateINV({ ...inv, fk_date: e.value });

                setError({ ...error, date: false });
              }}
              placeholder={tr[localStorage.getItem("language")].pilih_tgl}
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.date}
              minDate={date}
            />
          </div>

          <div className="col-3">
            <label className="text-label">Faktur Pajak</label>
            <div className="p-inputgroup mt-0">
              <InputText
                value={inv.fk_tax}
                onChange={(e) => {
                  updateINV({ ...inv, fk_tax: e.target.value });
                }}
                placeholder="Masukan Faktur Pajak"
              />
            </div>
          </div>

          <div className="col-12 mt-2">
            <span className="fs-14">
              <b>Informasi Pelanggan</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div>

          <div className="col-3">
            <label className="text-label">
              {tr[localStorage.getItem("language")].customer}
            </label>
            <div className="p-inputgroup"></div>
            <PrimeDropdown
              value={inv.pel_id && checkCus(inv?.pel_id)}
              onChange={(e) => {
                let trx = [];
                let total = 0;
                invoice?.forEach((element) => {
                  if (
                    e.value?.customer?.id === element?.sale_id?.pel_id &&
                    element?.sale_id?.surat_jalan === 1 &&
                    !element?.faktur
                  ) {
                    trx.push({ ...element, total: total });
                  }
                });

                updateINV({
                  ...inv,
                  pel_id: e?.value?.customer?.id ?? null,
                  det: trx?.map((v) => {
                    return {
                      ...v,
                      inv_id: v?.id ?? null,
                      inv_date: v?.inv_date ?? null,
                      total: v.sale_id.total_b ?? null,
                      total_pay: v?.sale_id?.total_bayar ?? null,
                    };
                  }),
                  detail: trx?.map((v) => {
                    return {
                      ...v,
                      inv_id: v?.id ?? null,
                      sale_id: v?.sale_id?.id ?? null,
                      inv_date: v?.inv_date ?? null,
                      total: v.sale_id.total_b ?? null,
                      total_pay: v?.sale_id?.total_bayar ?? null,
                    };
                  }),
                });
                let newError = error;
                newError.cus = false;
                setError(newError);
              }}
              options={customer}
              optionLabel={"customer.cus_name"}
              placeholder={tr[localStorage.getItem("language")].pilih}
              errorMessage="Customer Belum Dipilih"
              error={error?.cus}
            />
          </div>

          <div className="col-9" />

          <div className="col-5">
            <label className="text-label">
              {tr[localStorage.getItem("language")].alamat}
            </label>
            <div className="p-inputgroup">
              <InputText
                value={
                  inv.pel_id !== null
                    ? checkCus(inv?.pel_id).customer?.cus_address
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
                inv.pel_id !== null
                  ? checkCus(inv?.pel_id).customer?.cus_telp1
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
                  inv.pel_id !== null
                    ? `${
                        checkPjk(checkCus(inv?.pel_id).customer?.cus_pjk)?.name
                      } (${
                        checkPjk(checkCus(inv?.pel_id).customer?.cus_pjk)?.nilai
                      } %)`
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
                  inv.pel_id !== null
                    ? checkCus(inv?.pel_id).customer?.cus_curren !== null
                      ? checkCur(checkCus(inv?.pel_id).customer?.cus_curren)
                          ?.code
                      : "IDR"
                    : null
                }
                placeholder={tr[localStorage.getItem("language")].currency}
                disabled
              />
            </div>
          </div>

          <div className="col-5">
            <label className="text-label">
              {tr[localStorage.getItem("language")].ket}
            </label>
            <div className="p-inputgroup mt-2">
              <InputText
                value={inv.fk_desc}
                onChange={(e) => {
                  updateINV({ ...inv, fk_desc: e.target.value });
                }}
                placeholder={tr[localStorage.getItem("language")].masuk}
              />
            </div>
          </div>
        </Row>

        {inv.pel_id !== null ? (
          <CustomAccordion
            tittle={"Detail Transaksi"}
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
                  responsiveLayout="scroll"
                  selection={selectedProducts}
                  onSelectionChange={(e) => {
                    setSelectedProducts(e.value);

                    console.log("=================selec");
                    console.log(e.value);

                    updateINV({
                      ...inv,
                      detail: e.value?.map((v) => {
                        return {
                          ...v,
                          inv_id: v?.id,
                          sale_id: v?.sale_id?.id,
                          inv_date: v?.inv_date,
                          total: v?.sale_id?.total_b ?? null,
                          total_pay: v?.sale_id?.total_bayar,
                        };
                      }),
                    });
                  }}
                  value={inv?.det?.map((v, i) => {
                    return {
                      ...v,
                      index: i,
                      total: v?.total ?? 0,
                    };
                  })}
                  className="display w-150 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    selectionMode="multiple"
                    headerStyle={{ width: "3rem" }}
                    exportable={false}
                  />

                  <Column
                    header="Kode Invoice"
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeInput
                        value={e.inv_id && checkInv(e.inv_id)?.inv_code}
                        onChange={(u) => {}}
                        placeholder="Kode Invoice"
                        disabled
                      />
                    )}
                  />

                  <Column
                    header="Tanggal Invoice"
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <Calendar
                          value={new Date(`${e.inv_date}Z`)}
                          onChange={(e) => {}}
                          placeholder="Tanggal Invoice"
                          dateFormat="dd-mm-yy"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Total Pembayaran"
                    className="align-text-top"
                    field={""}
                    body={(e) => (
                      <PrimeNumber
                        price
                        value={e.total_pay ?? null}
                        onChange={(u) => {}}
                        placeholder="0"
                        disabled
                      />
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
                {/* {inv.jasa.length > 0 && inv.product.length > 0 && (
                  <div className="d-flex col-12 align-items-center">
                    <label className="mt-1"></label>
                    <InputSwitch
                      className="ml-4"
                      checked={inv.split_inv}
                      disabled
                    />
                  </div>
                )} */}
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
                      {formatIdr((getSubTotalBarang() * 11) / 100)}
                    </b>
                  ) : (
                    <b>
                      Rp.{" "}
                      {formatIdr(
                        ((getSubTotalBarang() + getSubTotalJasa()) * 11) / 100
                      )}
                    </b>
                  )}
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
                    disabled
                  />
                  <InputText
                    // value={
                    //   inv.split_inv
                    //     ? isRp
                    //       ? (getSubTotalBarang() * Do.prod_disc) / 100
                    //       : inv.prod_disc
                    //     : isRp
                    //     ? ((getSubTotalBarang() + getSubTotalJasa()) *
                    //         Do.total_disc) /
                    //       100
                    //     : Do.total_disc
                    // }
                    placeholder="Diskon"
                    type="number"
                    min={0}
                    disabled
                    onChange={(e) => {
                      // if (Do.split_inv) {
                      //   let disc = 0;
                      //   if (isRp) {
                      //     disc = (e.target.value / getSubTotalBarang()) * 100;
                      //   } else {
                      //     disc = e.target.value;
                      //   }
                      //   updateINV({ ...Do, prod_disc: disc });
                      // } else {
                      //   let disc = 0;
                      //   if (isRp) {
                      //     disc =
                      //       (e.target.value /
                      //         (getSubTotalBarang() + getSubTotalJasa())) *
                      //       100;
                      //   } else {
                      //     disc = e.target.value;
                      //   }
                      //   updateINV({ ...Do, total_disc: disc });
                      // }
                    }}
                  />
                  <PButton
                    className={`${isRp ? "p-button-outlined" : ""}`}
                    onClick={() => setRp(false)}
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
                        getSubTotalBarang() + (getSubTotalBarang() * 11) / 100
                      )}
                    </b>
                  ) : (
                    <b>
                      Rp.{" "}
                      {formatIdr(
                        getSubTotalBarang() +
                          getSubTotalJasa() +
                          ((getSubTotalBarang() + getSubTotalJasa()) * 11) / 100
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
            updateINV({ ...inv, sale_id: e.data.id });
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

export default BuatFakturPJ;