import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_SO } from "src/redux/actions";
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
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DataRulesPay from "src/jsx/screen/MasterLainnya/RulesPay/DataRulesPay";
import DataSupplier from "src/jsx/screen/Mitra/Pemasok/DataPemasok";
import DataPajak from "src/jsx/screen/Master/Pajak/DataPajak";
import DataSatuan from "src/jsx/screen/MasterLainnya/Satuan/DataSatuan";
import DataProduk from "src/jsx/screen/Master/Produk/DataProduk";
import DataJasa from "src/jsx/screen/Master/Jasa/DataJasa";
import DataCustomer from "src/jsx/screen/Mitra/Pelanggan/DataCustomer";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataLokasi from "src/jsx/screen/Master/Lokasi/DataLokasi";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";

const defError = {
  code: false,
  date: false,
  pel: false,
  tgl: false,
  rul: false,
  prod: false,
  jum: false,
  lok: false,
  prc: false,
};

const InputSO = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const so = useSelector((state) => state.so.current);
  const isEdit = useSelector((state) => state.so.editso);
  const [isRp, setRp] = useState(true);
  const [isRpJasa, setRpJasa] = useState(true);
  const [jasa, setJasa] = useState(null);
  const [showProduk, setShowProduk] = useState(false);
  const [showJasa, setShowJasa] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showPpn, setShowPpn] = useState(false);
  const [showLok, setShowLok] = useState(false);
  const [showRulesPay, setShowRulesPay] = useState(false);
  const [showSubCus, setShowSub] = useState(false);
  const [product, setProduk] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [rulesPay, setRulesPay] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [subCus, setSubCus] = useState(null);
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
    getJasa();
    getProduk();
    getSupplier();
    getSatuan();
    getRulesPay();
    getPpn();
    getCustomer();
    getSubCus();
    getloct();
  }, []);

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !so.so_code || so.so_code === "",
      date: !so.so_date || so.so_date === "",
      pel: !so.pel_id?.id,
      tgl: !so.req_date || so.req_date === "",
      rul: !so.top?.id,
      prod: !so.sprod?.prod_id?.id,
      jum: !so.sprod?.request,
      lok: !so.sprod?.location?.id,
      prc: !so.sprod?.price,
    };

    setError(errors);

    return valid;
  };

  const editSO = async () => {
    const config = {
      ...endpoints.editSO,
      endpoint: endpoints.editSO.endpoint + so.id,
      data: so,
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

  const addSO = async () => {
    const config = {
      ...endpoints.addSO,
      data: so,
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
            detail: `Kode ${so.so_code} Sudah Digunakan`,
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
        editSO();
      } else {
        setUpdate(true);
        addSO();
      }
    }
  };

  const getProduk = async () => {
    const config = {
      ...endpoints.product,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setProduk(data);
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

  const getloct = async () => {
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

  const getCustomer = async () => {
    const config = {
      ...endpoints.customer,
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
          if (elem.customer.sub_cus === false) {
            filt.push(elem);
          }
        });
        console.log(data);
        setCustomer(filt);
      }
    } catch (error) {}
  };

  const getSubCus = async () => {
    const config = {
      ...endpoints.customer,
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
          if (elem.customer.sub_cus === true) {
            filt.push(elem.customer);
          }
        });
        console.log(data);
        setSubCus(filt);
      }
    } catch (error) {}
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

  const checkRules = (value) => {
    let selected = {};
    rulesPay?.forEach((element) => {
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

  const checkPpn = (value) => {
    let selected = {};
    ppn?.forEach((element) => {
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

  const checkCus = (value) => {
    let selected = {};
    customer?.forEach((element) => {
      if (value === element.customer.id) {
        selected = element.customer;
      }
    });

    return selected;
  };

  const checkSubCus = (value) => {
    let selected = {};
    subCus?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const suppTemp = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.supplier.sup_code} (${option.supplier.sup_name})`
          : ""}
      </div>
    );
  };

  const valueSupTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.supplier.sup_code} (${option.supplier.sup_name})`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const rulTemp = (option) => {
    return (
      <div>{option !== null ? `${option.name} (${option.day} Hari)` : ""}</div>
    );
  };

  const valueRulTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.name} (${option.day} Hari)` : ""}
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

  const jasTemp = (option) => {
    return (
      <div>
        {option !== null ? `${option.jasa.name} (${option.jasa.code})` : ""}
      </div>
    );
  };

  const valueJasTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.jasa.name} (${option.jasa.code})` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const cusTemp = (option) => {
    return (
      <div>
        {option !== null ? `${option.cus_name} (${option.cus_code})` : ""}
      </div>
    );
  };

  const valueCusTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.cus_name} (${option.cus_code})` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const SubcusTemp = (option) => {
    return (
      <div>
        {option !== null ? `${option.cus_name} (${option.cus_code})` : ""}
      </div>
    );
  };

  const valueSubCusTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null ? `${option.cus_name} (${option.cus_code})` : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
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

  const updateSo = (e) => {
    dispatch({
      type: SET_CURRENT_SO,
      payload: e,
    });
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Sales Order</b>
      </h4>
    );
  };

  const getSubTotalBarang = () => {
    let total = 0;
    so?.sprod?.forEach((el) => {
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
    so?.sjasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return total;
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const body = () => {
    return (
      <>
        <Toast ref={toast} />
        {/* Put content body here */}
        <Row className="mb-6">
          <div className="col-6">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${so.so_date}Z`)}
              onChange={(e) => {
                updateSo({ ...so, so_date: e.value });

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

          <div className="col-6">
            <PrimeInput
              label={"Kode Referensi"}
              value={so.so_code}
              onChange={(e) => {
                updateSo({ ...so, so_code: e.target.value });
                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan Kode Referensi"
              error={error?.code}
            />
          </div>

          <div className="col-3">
            <label className="text-black fs-14">Pelanggan</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={so.pel_id !== null ? checkCus(so.pel_id) : null}
              option={customer?.map((v) => v.customer)}
              onChange={(e) => {
                console.log(e.value);
                updateSo({
                  ...so,
                  pel_id: e.id,
                });

                let newError = error;
                newError.pel = false;
                setError(newError);
              }}
              label={"[cus_name] ([cus_code])"}
              placeholder="Pilih Pelanggan"
              detail
              onDetail={() => setShowCustomer(true)}
              errorMessage="Pelanggan Belum Dipilih"
              error={error?.pel}
            />
          </div>

          <div className="col-3">
            <label className="text-black fs-14">Alamat Pelanggan</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  so.pel_id !== null ? checkCus(so.pel_id)?.cus_address : ""
                }
                placeholder="Alamat Pelanggan"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <PrimeInput
              label={"No. Telepon"}
              isNumber
              value={so.pel_id !== null ? checkCus(so.pel_id)?.cus_telp1 : ""}
              placeholder="No. Telepon"
              disabled
            />
          </div>

          <div className="col-3">
            <label className="text-black fs-14">Ppn</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  so.pel_id !== null
                    ? checkPpn(checkCus(so.pel_id)?.cus_pjk).name
                    : null
                }
                onChange={(e) => {}}
                placeholder="Jenis Ppn"
                disabled
              />
            </div>
          </div>

          <div className="col-4">
            <PrimeCalendar
              label={"Tanggal Permintaan"}
              value={new Date(`${so.req_date}Z`)}
              onChange={(e) => {
                updateSo({ ...so, req_date: e.value });

                let newError = error;
                newError.tgl = false;
                setError(newError);
              }}
              placeholder="Pilih Tanggal Pemintaan"
              showIcon
              dateFormat="dd-mm-yy"
              error={error?.tgl}
            />
          </div>

          <div className="col-4">
            <label className="text-black fs-14">Jangka Pembayaran</label>
            <div className="p-inputgroup mt-0"></div>
            <CustomDropdown
              value={so.top !== null ? checkRules(so.top) : null}
              option={rulesPay}
              onChange={(e) => {
                let result = new Date(`${so.req_date}Z`);
                result.setDate(result.getDate() + e.day);
                console.log(result);

                updateSo({ ...so, top: e.id, due_date: result });

                let newError = error;
                newError.rul = false;
                setError(newError);
              }}
              label={"[name] ([day] Hari)"}
              placeholder="Pilih Jangka Waktu"
              detail
              onDetail={() => setShowRulesPay(true)}
              errorMessage="Waktu Pembayaran Belum Dipilih"
              error={error?.tgl}
            />
          </div>

          <div className="col-4">
            <label className="text-black fs-14">Tanggal Jatuh Tempo</label>
            <div className="p-inputgroup mt-0">
              <Calendar
                value={new Date(`${so?.due_date}Z`)}
                onChange={(e) => {}}
                placeholder="Tanggal Jatuh Tempo"
                disabled
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>

          <div className="d-flex col-12 align-items-center mt-4">
            <label className="ml-0 mt-1 text-black fs-14">
              <b>{"Kirim Ke Sub Pelanggan"}</b>
            </label>
            <InputSwitch
              className="ml-4"
              checked={so && so.sub_addr}
              onChange={(e) => {
                updateSo({ ...so, sub_addr: e.target.value });
              }}
            />
          </div>

          {so && so.sub_addr === true && (
            <>
              <div className="col-4">
                <label className="text-black fs-14">Sub Pelanggan</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={so.sub_id ? checkSubCus(so.sub_id) : null}
                  option={subCus}
                  onChange={(e) => {
                    updateSo({ ...so, sub_id: e.id });
                  }}
                  label={"[cus_name] ([cus_code])"}
                  placeholder="Pilih Sub Pelanggan"
                  detail
                  onDetail={() => setShowSub(true)}
                  disabled={so && !so.sub_addr}
                />
              </div>

              <div className="col-4">
                <label className="text-black fs-14">Alamat Sub Pelanggan</label>
                <div className="p-inputgroup">
                  <InputText
                    value={
                      so.sub_id !== null
                        ? checkSubCus(so.sub_id)?.cus_address
                        : ""
                    }
                    placeholder="Alamat Sub Pelanggan"
                    disabled
                  />
                </div>
              </div>

              <div className="col-4">
                <label className="text-black fs-14">Kontak Person</label>
                <div className="p-inputgroup">
                  <InputText
                    value={
                      so.sub_id !== null
                        ? checkSubCus(so.sub_id)?.cus_telp1
                        : ""
                    }
                    placeholder="Kontak Person"
                    disabled
                  />
                </div>
              </div>
            </>
          )}
        </Row>

        <CustomAccordion
          tittle={"Pesanan Produk"}
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
                value={so.sprod?.map((v, i) => {
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
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={e.prod_id && checkProd(e.prod_id)}
                      option={product}
                      onChange={(u) => {
                        let sat = [];
                        satuan.forEach((element) => {
                          if (element.id === u.unit.id) {
                            sat.push(element);
                          } else {
                            if (element.u_from?.id === u.unit.id) {
                              sat.push(element);
                            }
                          }
                        });
                        setSatuan(sat);

                        let temp = [...so.sprod];
                        temp[e.index].prod_id = u.id;
                        temp[e.index].unit_id = u.unit?.id;
                        updateSo({ ...so, sprod: temp });

                        let newError = error;
                        newError.prod = false;
                        setError(newError);
                      }}
                      placeholder="Pilih Produk"
                      label={"[name] ([code])"}
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowProduk(true);
                      }}
                      errorMessage="Produk Belum Dipilih"
                      error={error?.prod}
                    />
                  )}
                />

                <Column
                  header="Satuan"
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={e.unit_id && checkUnit(e.unit_id)}
                      onChange={(u) => {
                        let temp = [...so.sprod];
                        temp[e.index].unit_id = u.id;
                        updateSo({ ...so, sprod: temp });
                      }}
                      option={satuan}
                      label={"[name]"}
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowSatuan(true);
                      }}
                      placeholder="Pilih Satuan"
                    />
                  )}
                />

                <Column
                  header="Lokasi"
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={e.location && checkLoc(e.location)}
                      onChange={(u) => {
                        let temp = [...so.sprod];
                        temp[e.index].location = u.id;
                        updateSo({ ...so, sprod: temp });

                        let newError = error;
                        newError.lok = false;
                        setError(newError);
                      }}
                      option={lokasi}
                      label={"[name]"}
                      placeholder="Lokasi"
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowLok(true);
                      }}
                      errorMessage="Lokasi Belum Dipilih"
                      error={error?.lok}
                    />
                  )}
                />

                <Column
                  header="Jumlah"
                  // style={{
                  //   maxWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <PrimeNumber
                        value={e.order && e.order}
                        onChange={(u) => {
                          let temp = [...so.sprod];
                          temp[e.index].order = u.target.value;
                          temp[e.index].total =
                            temp[e.index].order * temp[e.index].price;
                          updateSo({ ...so, sprod: temp });
                          console.log(temp);
                          let newError = error;
                          newError.jum = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        error={error?.jum}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Harga Satuan"
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <PrimeNumber
                        value={e.price && e.price}
                        onChange={(u) => {
                          let temp = [...so.sprod];
                          temp[e.index].price = u.target.value;
                          temp[e.index].total =
                            temp[e.index].order * temp[e.index].price;
                          updateSo({ ...so, sprod: temp });
                          console.log(temp);
                          let newError = error;
                          newError.prc = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        error={error?.prc}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Diskon"
                  // style={{
                  //   maxWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.disc && e.disc}
                        onChange={(u) => {
                          let temp = [...so.sprod];
                          temp[e.index].disc = u.target.value;
                          updateSo({ ...so, sprod: temp });
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
                  // style={{
                  //   minWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.nett_price && e.nett_price}
                        onChange={(u) => {
                          let temp = [...so.sprod];
                          temp[e.index].nett_price = u.target.value;
                          updateSo({ ...so, sprod: temp });
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

                <Column
                  header=""
                  // style={{
                  //   maxWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) =>
                    e.index === so.sprod.length - 1 ? (
                      <Link
                        onClick={() => {
                          updateSo({
                            ...so,
                            sprod: [
                              ...so.sprod,
                              {
                                id: 0,
                                prod_id: null,
                                unit_id: null,
                                request: null,
                                order: null,
                                remain: null,
                                price: null,
                                disc: null,
                                nett_price: null,
                                total: null,
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
                          let temp = [...so.sprod];
                          temp.splice(e.index, 1);
                          updateSo({ ...so, sprod: temp });
                        }}
                        className="btn btn-danger shadow btn-xs sharp"
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
          tittle={"Pesanan Jasa"}
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
                value={so.sjasa?.map((v, i) => {
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
                    <CustomDropdown
                      value={e.sup_id && checkSupp(e.sup_id)}
                      option={supplier}
                      onChange={(u) => {
                        let temp = [...so.sjasa];
                        temp[e.index].sup_id = u.supplier.id;
                        updateSo({ ...so, sjasa: temp });
                      }}
                      label={"[supplier.sup_name] ([supplier.sup_code])"}
                      placeholder="Pilih Supplier"
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowSupplier(true);
                      }}
                    />
                  )}
                />

                <Column
                  header="Jasa"
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={e.jasa_id && checkJasa(e.jasa_id)}
                      option={jasa}
                      onChange={(u) => {
                        console.log(e.value);
                        let temp = [...so.sjasa];
                        temp[e.index].jasa_id = u.jasa.id;
                        updateSo({ ...so, sjasa: temp });
                      }}
                      label={"[jasa.name] ([jasa.code])"}
                      placeholder="Pilih Jasa"
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowJasa(true);
                      }}
                    />
                  )}
                />

                <Column
                  header="Satuan"
                  style={{
                    maxWidth: "12rem",
                  }}
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={e.unit_id && checkUnit(e.unit_id)}
                      option={satuan}
                      onChange={(u) => {
                        console.log(e.value);
                        let temp = [...so.sjasa];
                        temp[e.index].unit_id = u.id;
                        updateSo({ ...so, sjasa: temp });
                      }}
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
                  header="Jumlah"
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.qty && e.qty}
                        onChange={(u) => {
                          let temp = [...so.sjasa];
                          temp[e.index].qty = u.target.value;
                          temp[e.index].total =
                            temp[e.index].qty * temp[e.index].price;
                          updateSo({ ...so, sjasa: temp });
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
                  header="Harga Satuan"
                  style={{
                    width: "25rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.price && e.price}
                        onChange={(u) => {
                          let temp = [...so.sjasa];
                          temp[e.index].price = u.target.value;
                          temp[e.index].total =
                            temp[e.index].qty * temp[e.index].price;
                          updateSo({ ...so, sjasa: temp });
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
                  style={{
                    width: "25rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.disc && e.disc}
                        onChange={(u) => {
                          let temp = [...so.sjasa];
                          temp[e.index].disc = u.target.value;
                          updateSo({ ...so, sjasa: temp });
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

                <Column
                  header=""
                  // style={{
                  //   maxWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) =>
                    e.index === so.sjasa?.length - 1 ? (
                      <Link
                        onClick={() => {
                          updateSo({
                            ...so,
                            sjasa: [
                              ...so.sjasa,
                              {
                                id: 0,
                                jasa_id: null,
                                sup_id: null,
                                unit_id: null,
                                qty: null,
                                price: null,
                                disc: null,
                                total: null,
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
                          let temp = [...so.sjasa];
                          temp.splice(e.index, 1);
                          updateSo({ ...so, sjasa: temp });
                        }}
                        className="btn btn-danger shadow btn-xs sharp"
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
              {so?.sjasa?.length > 0 && so?.sprod?.length > 0 && (
                <div className="d-flex col-12 align-items-center">
                  <label className="mt-1">{"Pisah Faktur"}</label>
                  <InputSwitch
                    className="ml-4"
                    checked={so?.split_inv}
                    onChange={(e) => {
                      if (e.value) {
                        updateSo({
                          ...so,
                          split_inv: e.value,
                          total_disc: null,
                        });
                      } else {
                        updateSo({
                          ...so,
                          split_inv: e.value,
                          prod_disc: null,
                          jasa_disc: null,
                        });
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="row justify-content-right col-6">
            <div className="col-6">
              <label className="text-label">
                {so?.split_inv ? "Sub Total Barang" : "Sub Total"}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {so?.split_inv ? (
                  <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                ) : (
                  <b>
                    Rp. {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                  </b>
                )}
              </label>
            </div>

            <div className="col-6">{so?.split_inv ? "DPP Barang" : "DPP"}</div>

            <div className="col-6">
              <label className="text-label">
                {so.split_inv ? (
                  <b>Rp. {formatIdr(getSubTotalBarang())}</b>
                ) : (
                  <b>
                    Rp. {formatIdr(getSubTotalBarang() + getSubTotalJasa())}
                  </b>
                )}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {so.split_inv ? "Pajak Atas Barang (11%)" : "Pajak (11%)"}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {so?.split_inv ? (
                  <b>Rp. {formatIdr((getSubTotalBarang() * 11) / 100)}</b>
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
              <label className="text-black fs-14">Diskon Tambahan</label>
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
                    so.split_inv
                      ? isRp
                        ? (getSubTotalBarang() * so.prod_disc) / 100
                        : so.prod_disc
                      : isRp
                      ? ((getSubTotalBarang() + getSubTotalJasa()) *
                          so.total_disc) /
                        100
                      : so.total_disc
                  }
                  placeholder="Diskon"
                  type="number"
                  min={0}
                  onChange={(e) => {
                    if (so.split_inv) {
                      let disc = 0;
                      if (isRp) {
                        disc = (e.target.value / getSubTotalBarang()) * 100;
                      } else {
                        disc = e.target.value;
                      }
                      updateSo({ ...so, prod_disc: disc });
                    } else {
                      let disc = 0;
                      if (isRp) {
                        disc =
                          (e.target.value /
                            (getSubTotalBarang() + getSubTotalJasa())) *
                          100;
                      } else {
                        disc = e.target.value;
                      }
                      updateSo({ ...so, total_disc: disc });
                    }
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
              <label className="text-black fs-15">
                <b>Total Pembayaran</b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label fs-16">
                {so?.split_inv ? (
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

            {so?.split_inv ? (
              <>
                {/* <div className="row justify-content-right col-12 mt-4"> */}
                <div className="col-6 mt-4">
                  <label className="text-black fs-14">Sub Total Jasa</label>
                </div>

                <div className="col-6 mt-4">
                  <label className="text-black fs-14">
                    <b>Rp. {formatIdr(getSubTotalJasa())}</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">DPP Jasa</label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">
                    <b>Rp. {formatIdr(getSubTotalJasa())}</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">
                    Pajak Atas Jasa (2%)
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-14">
                    <b>Rp. {formatIdr((getSubTotalJasa() * 2) / 100)}</b>
                  </label>
                </div>

                <div className="col-6 mt-3">
                  <label className="text-black fs-14">Diskon Tambahan</label>
                </div>

                <div className="col-6">
                  <div className="p-inputgroup">
                    <PButton
                      label="Rp."
                      className={`${isRpJasa ? "" : "p-button-outlined"}`}
                      onClick={() => setRpJasa(true)}
                    />
                    <InputText
                      value={
                        isRpJasa
                          ? (getSubTotalJasa() * so.jasa_disc) / 100
                          : so.jasa_disc
                      }
                      placeholder="Diskon"
                      type="number"
                      min={0}
                      onChange={(e) => {
                        let disc = 0;
                        if (isRpJasa) {
                          disc = (e.target.value / getSubTotalJasa()) * 100;
                        } else {
                          disc = e.target.value;
                        }
                        updateSo({ ...so, jasa_disc: disc });
                      }}
                    />
                    <PButton
                      className={`${isRpJasa ? "p-button-outlined" : ""}`}
                      onClick={() => setRpJasa(false)}
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
                  <label className="text-black fs-15">
                    <b>Total Pembayaran</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-black fs-15">
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
      {header()}
      {body()}
      {footer()}

      <DataRulesPay
        data={rulesPay}
        loading={false}
        popUp={true}
        show={showRulesPay}
        onHide={() => {
          setShowRulesPay(false);
        }}
        onInput={(e) => {
          setShowRulesPay(!e);
        }}
        onSuccessInput={(e) => {
          getRulesPay();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowRulesPay(false);
            updateSo({ ...so, top: e.data.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

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
            let temp = [...so.sjasa];
            temp[currentIndex].sup_id = e.data.supplier.id;
            updateSo({ ...so, sjasa: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataProduk
        data={product}
        loading={false}
        popUp={true}
        show={showProduk}
        onHide={() => {
          setShowProduk(false);
        }}
        onInput={(e) => {
          setShowProduk(!e);
        }}
        onSuccessInput={(e) => {
          getProduk();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowProduk(false);
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

            let temp = [...so.sprod];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;
            updateSo({ ...so, sprod: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataJasa
        data={jasa}
        loading={false}
        popUp={true}
        show={showJasa}
        onHide={() => {
          setShowJasa(false);
        }}
        onInput={(e) => {
          setShowJasa(!e);
        }}
        onSuccessInput={(e) => {
          getJasa();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowJasa(false);
            let temp = [...so.sjasa];
            temp[currentIndex].jasa_id = e.data.jasa.id;
            updateSo({ ...so, sjasa: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataPajak
        data={ppn}
        loading={false}
        popUp={true}
        show={showPpn}
        onHide={() => {
          setShowPpn(false);
        }}
        onInput={(e) => {
          setShowPpn(!e);
        }}
        onSuccessInput={(e) => {
          getPpn();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowPpn(false);
            updateSo({ ...so, ppn_type: e.data.id });
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
            let temp = [...so.sprod];
            temp[currentIndex].unit_id = e.data.id;

            let tempj = [...so.sjasa];
            tempj[currentIndex].unit_id = e.data.id;
            updateSo({ ...so, sprod: temp, sjasa: tempj });
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
          getloct();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowLok(false);
            let temp = [...so.sprod];
            temp[currentIndex].location = e.data.id;
            updateSo({ ...so, sprod: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataCustomer
        data={customer}
        loading={false}
        popUp={true}
        show={showCustomer}
        onHide={() => {
          setShowCustomer(false);
        }}
        onInput={(e) => {
          setShowCustomer(!e);
        }}
        onSuccessInput={(e) => {
          getCustomer();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowCustomer(false);
            updateSo({ ...so, pel_id: e.data.customer.id });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataCustomer
        data={subCus}
        loading={false}
        popUp={true}
        show={showSubCus}
        onHide={() => {
          setShowSub(false);
        }}
        onInput={(e) => {
          setShowSub(!e);
        }}
        onSuccessInput={(e) => {
          getSubCus();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSub(false);
            updateSo({ ...so, sub_id: e.data.id });
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

export default InputSO;
