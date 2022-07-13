import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
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
import { el } from "date-fns/locale";
import { InputSwitch } from "primereact/inputswitch";
import DataOrder from "../Order/DataOrder";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";

const defError = {
  code: false,
  // date: false,
  // sale: false,
};

const BuatFaktur = ({ onCancel, onSuccess }) => {
  const inv = useSelector((state) => state.inv.current);
  const [order, setOrder] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [pajak, setPajak] = useState(null);
  const [product, setProduct] = useState(null);
  const [jasa, setJasa] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [fkCode, setFkCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const isEdit = useSelector((state) => state.inv.editinv);
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
  }, []);

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

  const getORD = async () => {
    const config = {
      ...endpoints.order,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((elem) => {
          if (!elem.faktur) {
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
                if (el.id === e.djasa_id) {
                  temp[i].order = el.order;
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
      ...endpoints.editinvtur,
      endpoint: endpoints.editinvtur.endpoint + currentItem.id,
      data: {
        cus_code: currentItem.customer.cus_code,
      },
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
            summary: "Berhasil",
            detail: "Data Berhasil Diperbarui",
            life: 3000,
          });
        }, 500);
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

  const addinv = async () => {
    const config = {
      ...endpoints.addFK,
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
            summary: "Gagal",
            detail: `Kode ${inv.fk_code} Sudah Digunakan`,
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

  const checkSupp = (value) => {
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
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Buat Faktur Pembelian</b>
      </h4>
    );
  };

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !inv.fk_code || inv.fk_code === "",
      date: !inv.fk_date || inv.fk_date === "",
      sale: !inv.ord_id,
    };

    setError(errors);

    valid = !errors.code && !errors.date && !errors.sale;

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

        <Row className="mb-4">
          <div className="col-4">
            <PrimeInput
              label={"No. Faktur Pembelian"}
              value={inv.fk_code}
              onChange={(e) => {
                updateINV({ ...inv, fk_code: e.target?.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan No. Faktur"
              error={error?.code}
            />
          </div>

          <div className="col-2">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${inv.fk_date}Z`)}
              onChange={(e) => {
                updateINV({ ...inv, fk_date: e.value });

                setError({ ...error, date: false });
              }}
              placeholder="Pilih Tanggal"
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.date}
            />
          </div>

          <div className="col-12 mt-2">
            <span className="fs-14">
              <b>Informasi Pembelian</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div>

          <div className="col-4">
            <label className="text-label">No. Pembelian</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={inv.ord_id && checkOrd(inv?.ord_id)}
              onChange={(e) => {
                console.log(e);
                updateINV({
                  ...inv,
                  ord_id: e?.id ?? null,
                  product: e?.dprod ?? null,
                  jasa: e?.djasa ?? null,
                });
                let newError = error;
                newError.sale = false;
                setError(newError);
              }}
              option={order}
              // detail
              // onDetail={() => SetShowOrder(true)}
              label={"[ord_code]"}
              placeholder="No. Pembelian"
              errorMessage="Nomor Pembelian Belum Dipilih"
              error={error?.sale}
            />
          </div>

          <div className="col-6" />

          <div className="col-4">
            <label className="text-label">Supplier</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  inv.ord_id !== null
                    ? `${
                        checkSupp(checkOrd(inv.ord_id)?.sup_id?.id).supplier
                          ?.sup_name
                      } (${
                        checkSupp(checkOrd(inv.ord_id)?.sup_id?.id).supplier
                          ?.sup_code
                      })`
                    : null
                }
                placeholder="Pilih Supplier"
                disabled
              />
            </div>
          </div>

          <div className="col-5">
            <label className="text-label">Alamat Supplier</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  inv.ord_id !== null
                    ? checkSupp(checkOrd(inv.ord_id)?.sup_id?.id).supplier
                        ?.sup_address
                    : ""
                }
                placeholder="Alamat Supplier"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <PrimeInput
              label={"No. Telepon"}
              isNumber
              value={
                inv.ord_id !== null
                  ? checkSupp(checkOrd(inv.ord_id)?.sup_id?.id).supplier
                      ?.sup_telp1
                  : ""
              }
              placeholder="No. Telepon"
              disabled
            />
          </div>

          <div className="col-4">
            <label className="text-label">Jenis Pajak</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  inv.ord_id !== null
                    ? checkPjk(checkOrd(inv.ord_id)?.sup_id?.id).name
                    : null
                }
                placeholder="Jenis Pajak"
                disabled
              />
            </div>
          </div>

          <div className="col-2">
            <label className="text-label">Ppn (%)</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  inv.ord_id !== null
                    ? checkPjk(checkOrd(inv.ord_id)?.sup_id?.id).nilai
                    : null
                }
                placeholder="Nilai Ppn(%)"
                disabled
              />
            </div>
          </div>

          <div className="col-12 mt-2">
            <span className="fs-14">
              <b>Informasi Faktur Pajak</b>
            </span>
            <Divider className="mt-1"></Divider>
          </div>

          <div className="col-4">
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

          <div className="col-8">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup mt-2">
              <InputText
                value={inv.fk_desc}
                onChange={(e) => {
                  updateINV({ ...inv, fk_desc: e.target.value });
                }}
                placeholder="Masukan Keterangan"
              />
            </div>
          </div>
        </Row>

        {inv.product?.length ? (
          <CustomAccordion
            tittle={"Detail Pembelian Produk"}
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
                    header="Barcode"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.prod_id && checkProd(e.prod_id).barcode}
                          placeholder="Barcode Produk"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Produk"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={
                            e.prod_id &&
                            `${checkProd(e.prod_id).name} (${
                              checkProd(e.prod_id).code
                            })`
                          }
                          placeholder="Produk"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Satuan"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.unit_id && checkUnit(e.unit_id).name}
                          placeholder="Satuan Produk"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Jumlah"
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
                    header="Harga Satuan"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.price && e.price}
                          placeholder="0"
                          type="number"
                          min={0}
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Lokasi"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.location && checkLoc(e.location).name}
                          placeholder="Lokasi"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Diskon"
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
                    header="Harga Nett"
                    field={""}
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
                    header="Total"
                    // style={{
                    //   minWidth: "12rem",
                    // }}
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
                    header="Supplier"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={
                            e.sup_id &&
                            `${checkSupp(e.sup_id).supplier.sup_name} (${
                              checkSupp(e.sup_id).supplier.sup_code
                            })`
                          }
                          placeholder="Supplier"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Jasa"
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
                          placeholder="Jasa"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Satuan"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.unit_id && checkUnit(e.unit_id).name}
                          placeholder="Satuan"
                          disabled
                        />
                      </div>
                    )}
                  />

                  <Column
                    header="Jumlah"
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
                    header="Harga Satuan"
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
                    header="Diskon"
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
                    header="Total"
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
                  {inv.split_inv ? "Sub Total Barang" : "Sub Total"}
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
                  {inv.split_inv ? "Pajak Atas Barang (11%)" : "Pajak (11%)"}
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
                <label className="text-label">Diskon Tambahan</label>
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
                <label className="text-label">
                  <b>Total Pembayaran</b>
                </label>
              </div>

              <div className="col-6">
                <label className="text-label fs-16">
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
                      <label className="text-label">Sub Total Jasa</label>
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
                      <label className="text-label">Pajak Atas Jasa (2%)</label>
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
                      <label className="text-label">Diskon Tambahan</label>
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
                          placeholder="Diskon"
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
                        <b>Total Pembayaran</b>
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

export default BuatFaktur;
