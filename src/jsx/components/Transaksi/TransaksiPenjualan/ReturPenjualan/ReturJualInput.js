import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import CustomAccordion from "../../../Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_SR } from "src/redux/actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DataCustomer from "src/jsx/components/Mitra/Pelanggan/DataCustomer";

const ReturJualInput = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const sr = useSelector((state) => state.sr.current);
  const isEdit = useSelector((state) => state.sr.editSr);
  const dispatch = useDispatch();
  const [isRp, setRp] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [rp, setRequest] = useState(null);
  const [showSupplier, setShowSupplier] = useState(false);
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
    getRp();
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

  const getRp = async () => {
    const config = {
      ...endpoints.rPurchase,
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
          if (elem.status === 0) {
            filt.push(elem);
            elem.dprod.forEach((el) => {
              el.order = el.order ?? 0;
              if (el.order === 0 || el.request - el.order !== 0) {
                el.prod_id = el.prod_id.id;
                el.unit_id = el.unit_id.id;
              }
            });
            elem.rjasa.forEach((element) => {
              element.jasa_id = element.jasa_id.id;
              element.unit_id = element.unit_id.id;
            });
            elem.rjasa.push({
              id: 0,
              preq_id: elem.id,
              sup_id: null,
              jasa_id: null,
              unit_id: null,
              qty: null,
              price: null,
              disc: null,
              total: null,
            });
          }
        });
        console.log(data);
        setRequest(filt);
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

  const editPO = async () => {
    const config = {
      ...endpoints.editPO,
      endpoint: endpoints.editPO.endpoint + sr.id,
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

  const addPO = async () => {
    const config = {
      ...endpoints.addPO,
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
            detail: `Kode ${sr.po_code} Sudah Digunakan`,
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
      editPO();
    } else {
      setUpdate(true);
      addPO();
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

  const reqTemp = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.req_code} (${option.req_dep.ccost_name})`
          : ""}
      </div>
    );
  };

  const valueReqTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.req_code} (${option.req_dep.ccost_name})`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const cusTemp = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.customer.cus_code} (${option.customer.cus_name})`
          : ""}
      </div>
    );
  };

  const valueCusTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.customer.cus_code} (${option.customer.cus_name})`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const prodTemp = (option) => {
    return (
      <div>{option !== null ? `${option.name} (${option.code})` : ""}</div>
    );
  };

  const valueProd = (option, props) => {
    if (option) {
      return (
        <div>{option !== null ? `${option.name} (${option.code})` : ""}</div>
      );
    }

    return <span>{props.placeholder}</span>;
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
                value={new Date(`${sr.po_date}Z`)}
                onChange={(e) => {
                  updateSr({ ...sr, po_date: e.value });
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
                value={sr.po_code}
                onChange={(e) => updateSr({ ...sr, po_code: e.target.value })}
                placeholder="Masukan Kode Referensi"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">No. Faktur Penjualan</label>
            <div className="p-inputgroup">
              <Dropdown
                value={sr.preq_id && req_pur(sr.preq_id)}
                options={rp}
                onChange={(e) => {
                  console.log(e.value.dprod);
                  let result = null;
                  if (sr.top) {
                    result = new Date(`${req_pur(e.value.id).req_date}Z`);
                    // result.setDate(result.getDate() + rulPay(sr?.top)?.day);
                    console.log(result);
                  }
                  updateSr({
                    ...sr,
                    preq_id: e.value.id,
                    due_date: result,
                    sup_id: e.value?.ref_sup?.id ?? null,
                    dprod: e.value.dprod,
                    rjasa: e.value.rjasa,
                  });
                }}
                optionLabel="req_code"
                placeholder="Pilih Kode Permintaan"
                filter
                filterBy=""
                itemTemplate={reqTemp}
                valueTemplate={valueReqTemp}
              />
            </div>
          </div>
            {/* kode suplier otomatis keluar, karena sudah melekat di faktur pembelian  */}
            
          <div className="col-3">
            <label className="text-label">Pelanggan</label>
            <div className="p-inputgroup">
              <Dropdown
                value={sr.pel_id !== null ? checkCus(sr.pel_id) : null}
                options={customer}
                onChange={(e) => {
                  updateSr({ ...sr, pel_id: e.value.customer.id });
                }}
                optionLabel="customer.cus_name"
                placeholder="Pilih Pelanggan"
                filter
                filterBy="customer.cus_name"
                itemTemplate={cusTemp}
                valueTemplate={valueCusTemp}
              />
              <PButton
                onClick={() => {
                  setShowSupplier(true);
                }}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-3">
            <label className="text-label"></label>
            <div className="p-inputgroup mt-2">
              <InputText
                value={
                  sr.sup_id !== null
                    ? checkCus(sr.pel_id)?.customer?.cus_address
                    : ""
                }
                placeholder="Alamat Pelanggan"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label"></label>
            <div className="p-inputgroup mt-2">
              <InputText
                value={
                  sr.pel_id !== null ? checkCus(sr.pel_id)?.customer?.cus_telp1 : ""
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
                  sr.pel_id !== null ? checkPjk(checkCus(sr.pel_id)?.customer?.id) : null
                }
                placeholder="Pilih Jenis Pajak"
                disabled
              />
            </div>
          </div>
        </Row>

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
                value={sr.dprod?.map((v, i) => {
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
                  header="Produk"
                  style={{
                    maxWidth: "15rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <Dropdown
                        value={
                          sr.dprod[e.index].prod_id &&
                          checkProd(sr.dprod[e.index].prod_id)
                        }
                        options={product}
                        onChange={(e) => {
                          console.log(e.value);
                        }}
                        placeholder="Pilih Kode Produk"
                        optionLabel="name"
                        filter
                        filterBy="name"
                        valueTemplate={valueProd}
                        itemTemplate={prodTemp}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Satuan"
                  style={{
                    maxWidth: "15rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <Dropdown
                        value={
                          sr.dprod[e.index].unit_id &&
                          checkUnit(sr.dprod[e.index].unit_id)
                        }
                        onChange={(e) => {
                          let temp = [...sr.dprod];
                          temp[e.index].unit_id = e.value.id;
                          updateSr({ ...sr, dprod: temp });
                        }}
                        options={satuan}
                        optionLabel="name"
                        placeholder="Pilih Satuan"
                        filter
                        filterBy="name"
                      />
                    </div>
                  )}
                />

                <Column
                  header="Retur"
                  style={{
                    width: "10rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={
                          sr.dprod[e.index].order
                            ? sr.dprod[e.index].order
                            : null
                        }
                        onChange={(a) => {
                          let temp = [...sr.dprod];
                          let result = temp[e.index]?.request - a.target.value;
                          temp[e.index].remain = result
                          temp[e.index].order = a.target.value
                          updateSr({ ...sr, dprod: temp });
                        }}
                        placeholder="0"
                        type="number"
                      />
                    </div>
                  )}
                />

                <Column
                  header="Harga Satuan"
                  style={{
                    maxWidth: "15rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={
                          sr.dprod[e.index].price
                            ? sr.dprod[e.index].price
                            : null
                        }
                        onChange={(e) => {
                          let temp = [...sr.dprod];
                          temp[e.index].price = e.target.value;
                          updateSr({ ...sr, dprod: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                      />
                    </div>
                  )}
                />

                <Column
                  header="Diskon"
                  style={{
                    maxWidth: "10rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={
                          sr.dprod[e.index].disc ? sr.dprod[e.index].disc : null
                        }
                        onChange={(e) => {
                          let temp = [...sr.dprod];
                          temp[e.index].disc = e.target.value;
                          updateSr({ ...sr, dprod: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                      />
                    </div>
                  )}
                />

                <Column
                  header="Harga Nett"
                  style={{
                    maxWidth: "15rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={
                          sr.dprod[e.index].nett_price
                            ? sr.dprod[e.index].nett_price
                            : null
                        }
                        onChange={(e) => {
                          let temp = [...sr.dprod];
                          temp[e.index].nett_price = e.target.value;
                          updateSr({ ...sr, dprod: temp });
                          console.log(temp);
                        }}
                        placeholder="Masukan Harga Nett"
                        type="number"
                      />
                    </div>
                  )}
                />

                <Column
                  header="Total"
                  style={{
                    maxWidth: "15rem",
                  }}
                  field={""}
                  body={(e) => (
                    <label className="text-nowrap">
                      <b>{`Rp. ${
                        sr.dprod[e.index].order * sr.dprod[e.index].price -
                        sr.dprod[e.index].disc
                      }`}</b>
                    </label>
                  )}
                />

                <Column
                  body={(e) =>
                    e.index === sr.dprod.length - 1 ? (
                      <Link
                        onClick={() => {
                          updateSr({
                            ...sr,
                            dprod: [
                              ...sr.dprod,
                              {
                                id: 0,
                                prod_id: null,
                                unit_id: null,
                                request: null,
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
                          let temp = [...sr.dprod];
                          temp.splice(e.index, 1);
                          updateSr({
                            ...sr,
                            dprod: temp,
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

        <div className="row ml-0 mr-0 mb-0 mt-6 justify-content-between">
          <div>
            <div className="row ml-1">
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
            </div>
          </div>

          <div className="row justify-content-right col-6">
            <div className="col-6">
              <label className="text-label">Sub Total Barang</label>
            </div>

            <div className="col-6">
              <label className="text-label">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">DPP Barang</label>
            </div>

            <div className="col-6">
              <label className="text-label">
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">Pajak Atas Barang (11%)</label>
            </div>

            <div className="col-6">
              <label className="text-label">
                <b>Rp. </b>
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
                <InputText placeholder="Diskon" />
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
                <b>Rp. </b>
              </label>
            </div>

            <div className="col-12">
              <Divider className="ml-12"></Divider>
            </div>

            {currentItem !== null && currentItem.faktur ? (
              <>
                {/* <div className="row justify-content-right col-12 mt-4"> */}
                <div className="col-6 mt-4">
                  <label className="text-label">Sub Total Jasa</label>
                </div>

                <div className="col-6 mt-4">
                  <label className="text-label">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label">DPP Jasa</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label">Pajak Atas Jasa (2%)</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Rp. </b>
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
                    <InputText placeholder="Diskon" />
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
                    <b>Rp. </b>
                  </label>
                </div>

                <div className="col-12">
                  <Divider className="ml-12"></Divider>
                </div>
                {/* </div> */}
              </>
            ) : null}
          </div>
        </div>
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
            updateSr({ ...rp, req_dep: e.data.id });
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
