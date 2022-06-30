import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import CustomAccordion from "../../../Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_SR } from "src/redux/actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DataCustomer from "src/jsx/components/Mitra/Pelanggan/DataCustomer";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataSatuan from "src/jsx/components/MasterLainnya/Satuan/DataSatuan";

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
  }, []);

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
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
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
            summary: "Gagal",
            detail: `Kode ${sr.ret_code} Sudah Digunakan`,
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

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editSR();
    } else {
      setUpdate(true);
      addSR();
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
        total += el.total - (el.total * el.disc) / 100;
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
          <div className="col-4">
            <label className="text-label">Tanggal</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${sr.ret_date}Z`)}
                onChange={(e) => {
                  updateSr({ ...sr, ret_date: e.value });
                }}
                placeholder="Pilih Tanggal"
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Kode Referensi</label>
            <div className="p-inputgroup">
              <InputText
                value={sr.ret_code}
                onChange={(e) => updateSr({ ...sr, ret_code: e.target.value })}
                placeholder="Masukan Kode Referensi"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">No. Penjualan</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={sr.sale_id && checkSale(sr.sale_id)}
              option={sale}
              onChange={(e) => {
                updateSr({
                  ...sr,
                  sale_id: e.id,
                  product: e.jprod,
                });
              }}
              label={"[ord_code] ([pel_id.cus_name])"}
              placeholder="Pilih No. Penjualan"
              detail
            />
          </div>
          {/* kode suplier otomatis keluar, karena sudah melekat di faktur pembelian  */}

          <div className="col-3">
            <label className="text-label">Pelanggan</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  sr.sale_id !== null
                    ? `${
                        checkCus(checkSale(sr.sale_id)?.so_id.pel_id)?.customer
                          .cus_name
                      } (${
                        checkCus(checkSale(sr.sale_id)?.so_id.pel_id)?.customer
                          .cus_code
                      })`
                    : null
                }
                placeholder="Pelanggan"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">Alamat Pelanggan</label>
            <div className="p-inputgroup mt-2">
              <InputText
                value={
                  sr.sale_id !== null
                    ? checkCus(checkSale(sr.sale_id)?.so_id.pel_id)?.customer
                        .cus_address
                    : ""
                }
                placeholder="Alamat Pelanggan"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">Kontak Person</label>
            <div className="p-inputgroup mt-2">
              <InputText
                value={
                  sr.sale_id !== null
                    ? checkCus(checkSale(sr.sale_id)?.so_id.pel_id)?.customer
                        .cus_telp1
                    : ""
                }
                placeholder="Kontak Person"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">Ppn</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  sr.sale_id !== null
                    ? checkPjk(
                        checkCus(checkSale(sr.sale_id)?.so_id?.pel_id).customer
                          .cus_pjk
                      )?.name
                    : null
                }
                placeholder="Pilih Jenis Pajak"
                disabled
              />
            </div>
          </div>
        </Row>

        {sr.product?.length ? (
          <CustomAccordion
            tittle={"Produk Retur"}
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
                      price: v?.price ?? 0,
                      disc: v?.disc ?? 0,
                      nett_price: v?.nett_price ?? 0,
                      total: v?.total ?? 0,
                    };
                  })}
                  className="display w-150 datatable-wrapper header-white no-border"
                  showGridlines={false}
                  emptyMessage={() => <div></div>}
                >
                  <Column
                    header="Produk"
                    field={""}
                    body={(e) => (
                      <CustomDropdown
                        value={e.prod_id && checkProd(e.prod_id)}
                        option={product}
                        onChange={(u) => {
                          let sat = [];
                          satuan?.forEach((element) => {
                            if (element.id === u.unit.id) {
                              sat.push(element);
                            } else {
                              if (element.u_from?.id === u.unit.id) {
                                sat.push(element);
                              }
                            }
                          });
                          setSatuan(sat);

                          let temp = [...sr.product];
                          temp[e.index].prod_id = u.id;
                          temp[e.index].unit_id = u.unit?.id;
                          updateSr({ ...sr, product: temp });
                        }}
                        placeholder="Pilih Kode Produk"
                        label={"[name]"}
                        detail
                        disabled={sr.sale_id !== null}
                      />
                    )}
                  />

                  <Column
                    header="Satuan"
                    field={""}
                    body={(e) => (
                      <CustomDropdown
                        value={e.unit_id && checkUnit(e.unit_id)}
                        onChange={(t) => {
                          let temp = [...sr.product];
                          temp[e.index].unit_id = t.id;
                          updateSr({ ...sr, product: temp });
                        }}
                        option={satuan}
                        label={"[name]"}
                        placeholder="Pilih Satuan"
                        detail
                        onDetail={() => setShowSatuan(true)}
                        disabled={sr.sale_id !== null}
                      />
                    )}
                  />

                  <Column
                    header="Retur"
                    field={""}
                    body={(e) => (
                      <div className="p-inputgroup">
                        <InputText
                          value={e.retur && e.retur}
                          onChange={(u) => {
                            let temp = [...sr.product];
                            temp[e.index].retur = u.target.value;
                            temp[e.index].total =
                              temp[e.index].retur * temp[e.index].price;
                            updateSr({ ...sr, product: temp });
                          }}
                          placeholder="0"
                          type="number"
                          min={0}
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
                          onChange={(u) => {
                            let temp = [...sr.product];
                            temp[e.index].price = u.target.value;
                            temp[e.index].total =
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
                    header="Diskon"
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
                    header="Harga Nett"
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
                    header="Total"
                    field={""}
                    body={(e) => (
                      <label className="text-nowrap">
                        <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                      </label>
                    )}
                  />

                  <Column
                    body={(e) =>
                      e.index === sr.product.length - 1 ? (
                        <Link
                          onClick={() => {
                            updateSr({
                              ...sr,
                              product: [
                                ...sr.product,
                                {
                                  id: 0,
                                  prod_id: null,
                                  unit_id: null,
                                  retur: null,
                                  price: null,
                                  disc: null,
                                  nett_price: null,
                                  total: null,
                                },
                              ],
                            });
                          }}
                          className="btn btn-primary shadow btn-xs sharp ml-1"
                        >
                          <i className="fa fa-plus"></i>
                        </Link>
                      ) : (
                        <Link
                          onClick={() => {
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
                      )
                    }
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
                <label className="text-label">Sub Total Barang</label>
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
                <label className="text-label">Pajak Atas Barang (11%)</label>
              </div>

              <div className="col-6">
                <label className="text-label">
                  <b>Rp. {formatIdr((getSubTotalBarang() * 11) / 100)}</b>
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
                  />
                  <InputText
                    value={
                      isRp
                        ? (getSubTotalBarang() * sr.prod_disc) / 100
                        : sr.prod_disc
                    }
                    placeholder="Diskon"
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
                  <b>Total Pembayaran</b>
                </label>
              </div>

              <div className="col-6">
                <label className="text-label fs-16">
                  <b>
                    Rp.{" "}
                    {formatIdr(
                      getSubTotalBarang() + (getSubTotalBarang() * 11) / 100
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
      {header()}
      {body()}
      {footer()}

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
