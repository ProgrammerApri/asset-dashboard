import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { Row, Card, Col } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Divider } from "@material-ui/core";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_SL } from "src/redux/actions";
import DataSupplier from "../../../Mitra/Pemasok/DataPemasok";
import DataRulesPay from "src/jsx/screen/MasterLainnya/RulesPay/DataRulesPay";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { el } from "date-fns/locale";
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import DataCustomer from "src/jsx/screen/Mitra/Pelanggan/DataCustomer";
import DataSatuan from "src/jsx/screen/MasterLainnya/Satuan/DataSatuan";
import DataProduk from "src/jsx/screen/Master/Produk/DataProduk";
import DataJasa from "src/jsx/screen/Master/Jasa/DataJasa";
import DataSalesman from "src/jsx/screen/MasterLainnya/Salesman/DataSalesman";
import DataLokasi from "src/jsx/screen/Master/Lokasi/DataLokasi";
import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";
import { Dropdown } from "primereact/dropdown";

const defError = {
  code: false,
  date: false,
  pel: false,
  rul: false,
  sls: false,
  prod: false,
  jum: false,
  lok: false,
  prc: false,
};

const InputPenjualan = ({ onCancel, onSuccess }) => {
  const [update, setUpdate] = useState(false);
  const toast = useRef(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sale = useSelector((state) => state.sl.current);
  const isEdit = useSelector((state) => state.sl.editSL);
  const dispatch = useDispatch();
  const [isRp, setRp] = useState(true);
  const [isRjjasa, setRjjasa] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [subCus, setSubCus] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [rulesPay, setRulesPay] = useState(null);
  const [ppn, setPpn] = useState(null);
  const [salesman, setSalesman] = useState(null);
  const [so, setSO] = useState(null);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showSalesman, setShowSalesman] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showSubCus, setShowSub] = useState(false);
  const [showSatuan, setShowSatuan] = useState(false);
  const [showProduk, setShowProduk] = useState(false);
  const [showJasa, setShowJasa] = useState(false);
  const [showRulesPay, setShowRulesPay] = useState(false);
  const [showLokasi, setShowLok] = useState(false);
  const [product, setProduct] = useState(null);
  const [jasa, setJasa] = useState(null);
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
    getSubCus();
    getSupplier();
    getRulesPay();
    getPpn();
    getSO();
    getProduct();
    getJasa();
    getSatuan();
    getLoct();
    getSalesman();
  }, []);

  const isValid = () => {
    let valid = false;
    let errors = {
      code: !sale.ord_code || sale.ord_code === "",
      date: !sale.ord_date || sale.ord_date === "",
      pel: !sale.pel_id?.id,
      rul: !sale.top?.id,
      sls: !sale.slsm_id?.id,
      prod: !sale.jprod?.prod_id?.id,
      jum: !sale.jprod?.order,
      prc: !sale.jprod?.price,
      lok: !sale.jprod?.location?.id,
    };

    setError(errors);

    return valid;
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
            filt.push(elem);
          }
        });
        console.log(data);
        setSubCus(filt);
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

  const getSalesman = async () => {
    const config = {
      ...endpoints.salesman,
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
        setSalesman(data);
      }
    } catch (error) {}
  };

  const getSO = async () => {
    const config = {
      ...endpoints.so,
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
          let prod = [];
          elem.sprod.forEach((el) => {
            el.prod_id = el.prod_id.id;
            el.unit_id = el.unit_id.id;
            prod.push({
              ...el,
              r_order: el.order,
            });

            let temp = [...sale.jprod];
            sale.jprod.forEach((e, i) => {
              if (el.id === e.sprod_id) {
                temp[i].order = el.order;
                updateSL({ ...sale, jprod: temp });
              }
            });
          });
          elem.sprod = prod;

          let jasa = [];
          elem.sjasa.forEach((element) => {
            element.jasa_id = element.jasa_id.id;
            element.unit_id = element.unit_id.id;
            jasa.push({
              ...element,
              r_order: element.order,
            });

            let temp = [...sale.jjasa];
            sale.jjasa.forEach((e, i) => {
              if (el.id === e.sjasa_id) {
                temp[i].order = el.order;
                updateSL({ ...sale, jjasa: temp });
              }
            });
          });
          elem.sjasa = jasa;
          filt.push(elem);
        });
        setSO(filt);
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

  const getLoct = async () => {
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

  const editSale = async () => {
    const config = {
      ...endpoints.editSales,
      endpoint: endpoints.editSales.endpoint + sale.id,
      data: sale,
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

  const addSale = async () => {
    const config = {
      ...endpoints.addSale,
      data: sale,
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
            detail: `Kode ${sale.ord_code} Sudah Digunakan`,
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

  const checkSO = (value) => {
    let selected = {};
    so?.forEach((element) => {
      if (value === element.id) {
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

  const checkSales = (value) => {
    let selected = {};
    salesman?.forEach((element) => {
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

  const checkSubCus = (value) => {
    let selected = {};
    subCus?.forEach((element) => {
      if (value === element.customer.id) {
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

  const checkRulesP = (value) => {
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
        editSale();
      } else {
        setUpdate(true);
        addSale();
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

  const updateSL = (e) => {
    dispatch({
      type: SET_CURRENT_SL,
      payload: e,
    });
  };

  const header = () => {
    return (
      <h4 className="mb-4">
        <b>Penjualan</b>
      </h4>
    );
  };

  const getSubTotalBarang = () => {
    let total = 0;
    sale?.jprod?.forEach((el) => {
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
    sale?.jjasa?.forEach((el) => {
      total += el.total - (el.total * el.disc) / 100;
    });

    return total;
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const soTemplate = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.so_code} - ${option.pel_id.cus_name}`
          : ""}
      </div>
    );
  };

  const valTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.so_code}`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />
        <Row className="mb-4">
          <div className="col-7"></div>
          <div className="col-3">
            <PrimeInput
              label={"No. Penjualan"}
              value={sale.ord_code}
              onChange={(e) => {
                updateSL({ ...sale, ord_code: e.target.value });

                let newError = error;
                newError.code = false;
                setError(newError);
              }}
              placeholder="Masukan No. Penjualan"
              error={error?.code}
            />
          </div>

          <div className="col-2">
            <PrimeCalendar
              label={"Tanggal"}
              value={new Date(`${sale.ord_date}Z`)}
              onChange={(e) => {
                let result = null;
                if (sale.top) {
                  result = new Date(e.value);
                  result.setDate(
                    result.getDate() + checkRulesP(sale?.top)?.day
                  );
                  console.log(result);
                }
                updateSL({
                  ...sale,
                  ord_date: e.value,
                  due_date: result,
                });

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

          <div className="col-12 mt-0">
            <span className="fs-14">
              <b>Informasi Pesanan</b>
            </span>
            {/* </div>
          <div className="col-12"> */}
            <Divider className="mt-2"></Divider>
          </div>

          <div className="col-3">
            <label className="text-label">No. Pesanan Penjualan</label>
            <div className="p-inputgroup">
            <Dropdown
              value={sale.so_id && checkSO(sale.so_id)}
              options={so}
              onChange={(e) => {
                let result = null;
                if (sale.top != null) {
                  result = new Date(`${sale.ord_date}Z`);
                  result.setDate(
                    result.getDate() + checkRulesP(sale?.top)?.day
                  );
                  console.log(result);
                }
                updateSL({
                  ...sale,
                  so_id: e.value.id,
                  due_date: result,
                  top: e.value.top.id ?? null,
                  pel_id: e.value.pel_id?.id ?? null,
                  sub_id: e.value.sub_id?.id ?? null,
                  jprod: e.value.sprod,
                  jjasa: e.value.sjasa.map((v) => {
                    return { ...v, order: v.qty };
                  }),
                });
              }}
              optionLabel={"[so_code] ([pel_id.cus_name])"}
              placeholder="Pilih No. Pesanan"
              filter
              filterBy="so_code"
              itemTemplate={soTemplate}
              valueTemplate={valTemp}
            />
            </div>
          </div>

          <div className="col-9"></div>

          <div className="col-3">
            <label className="text-label">Pelanggan</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={sale.pel_id !== null ? checkCus(sale.pel_id) : null}
              option={customer}
              onChange={(e) => {
                updateSL({ ...sale, pel_id: e.customer.id });

                let newError = error;
                newError.pel = false;
                setError(newError);
              }}
              placeholder="Pilih Pelanggan"
              detail
              onDetail={() => setShowCustomer(true)}
              label={"[customer.cus_name]"}
              errorMessage="Pelanggan Belum Dipilih"
              error={error?.pel}
              disabled={sale && sale.so_id}
            />
          </div>

          <div className="col-3">
            <label className="text-label">Alamat Pelanggan</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  sale.pel_id !== null
                    ? checkCus(sale.pel_id)?.customer?.cus_address
                    : ""
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
              value={
                sale.pel_id !== null
                  ? checkCus(sale.pel_id)?.customer?.cus_telp1
                  : ""
              }
              placeholder="No. Telepon"
              disabled
            />
          </div>

          <div className="col-3">
            <label className="text-label">Ppn</label>
            <div className="p-inputgroup">
              <InputText
                value={
                  sale.pel_id !== null
                    ? checkPpn(checkCus(sale.pel_id)?.pajak?.id).name
                    : null
                }
                placeholder="Jenis Pajak"
                disabled
              />
            </div>
          </div>

          <div className="col-12 mt-3">
            <span className="fs-14">
              <b>Informasi Pembayaran</b>
            </span>
            {/* </div>
          <div className="col-12"> */}
            <Divider className="mt-2"></Divider>
          </div>

          <div className="col-4">
            <label className="text-label">Syarat Pembayaran</label>
            <div className="p-inputgroup mt-0"></div>
            <CustomDropdown
              value={sale.top !== null ? checkRulesP(sale.top) : null}
              option={rulesPay}
              onChange={(e) => {
                let result = new Date(`${sale.ord_date}Z`);
                result.setDate(result.getDate() + e.day);
                console.log(result);

                updateSL({ ...sale, top: e.id, due_date: result });

                let newError = error;
                newError.rul = false;
                setError(newError);
              }}
              placeholder="Pilih Syarat Pembayaran"
              detail
              onDetail={() => setShowRulesPay(true)}
              label={"[name] ([day] Hari)"}
              errorMessage="Syarat Pembayaran Belum Dipilih"
              error={error?.rul}
              disabled={sale && sale.so_id}
            />
          </div>

          <div className="col-4">
            <label className="text-label">Tanggal Jatuh Tempo</label>
            <div className="p-inputgroup mt-0">
              <Calendar
                value={new Date(`${sale?.due_date}Z`)}
                onChange={(e) => {}}
                placeholder="Tanggal Jatuh Tempo"
                disabled
                dateFormat="dd-mm-yy"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">Salesman</label>
            <div className="p-inputgroup"></div>
            <CustomDropdown
              value={sale.slsm_id && checkSales(sale.slsm_id)}
              option={salesman}
              onChange={(e) => {
                updateSL({ ...sale, slsm_id: e.id });

                let newError = error;
                newError.sls = false;
                setError(newError);
              }}
              placeholder="Pilih Salesman"
              detail
              onDetail={() => setShowSalesman(true)}
              label={"[sales_name]"}
              errorMessage="Salesman Belum Dipilih"
              error={error?.sls}
            />
          </div>

          <div className="d-flex col-12 align-items-center mt-4">
            <label className="ml-0 mt-1 fs-12">
              <b>{"Kirim Ke Sub Pelanggan"}</b>
            </label>
            <InputSwitch
              className="ml-4"
              checked={sale.sub_addr}
              onChange={(e) => {
                updateSL({ ...sale, sub_addr: e.target.value });
              }}
              // disabled={sale && sale.so_id}
            />
          </div>

          {sale.sub_addr === true && (
            <>
              <div className="col-4">
                <label className="text-black fs-14">Sub Pelanggan</label>
                <div className="p-inputgroup"></div>
                <CustomDropdown
                  value={sale.sub_id ? checkSubCus(sale.sub_id) : null}
                  option={subCus}
                  onChange={(e) => {
                    updateSL({ ...sale, sub_id: e.customer.id });
                  }}
                  placeholder="Pilih Sub Pelanggan"
                  label={"[customer.cus_name]"}
                  detail
                  onDetail={() => setShowSub(true)}
                  disabled={sale && sale.so_id}
                />
              </div>

              <div className="col-4">
                <label className="text-black fs-14">Alamat Sub Pelanggan</label>
                <div className="p-inputgroup mt-1">
                  <InputText
                    value={
                      sale.sub_id !== null
                        ? checkSubCus(sale.sub_id)?.customer?.cus_address
                        : ""
                    }
                    placeholder="Alamat Sub Pelanggan"
                    disabled
                  />
                </div>
              </div>

              <div className="col-4">
                <label className="text-black fs-14">Kontak Person</label>
                <div className="p-inputgroup mt-1">
                  <InputText
                    value={
                      sale.sub_id !== null
                        ? checkSubCus(sale.sub_id)?.customer?.cus_telp1
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
                value={sale?.jprod.map((v, i) => {
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
                  style={{
                    width: "20rem",
                  }}
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

                        let temp = [...sale.jprod];
                        temp[e.index].prod_id = u.id;
                        temp[e.index].unit_id = u.unit?.id;
                        updateSL({ ...sale, jprod: temp });

                        let newError = error;
                        newError.prod = false;
                        setError(newError);
                      }}
                      placeholder="Pilih Produk"
                      label={"[name]"}
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowProduk(true);
                      }}
                      errorMessage="Produk Belum Dipilih"
                      error={error?.prod}
                      disabled={sale && sale.so_id}
                    />
                  )}
                />

                <Column
                  header="Lokasi"
                  field={""}
                  style={{
                    width: "10rem",
                  }}
                  body={(e) => (
                    <CustomDropdown
                      value={e.location && checkLoc(e.location)}
                      onChange={(u) => {
                        let temp = [...sale.jprod];
                        temp[e.index].location = u.id;
                        updateSL({ ...sale, jprod: temp });

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
                      disabled={sale && sale.so_id}
                    />
                  )}
                />

                <Column
                  header="Jumlah"
                  style={{
                    width: "8rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <PrimeNumber
                        value={e.order && e.order}
                        onChange={(u) => {
                          let temp = [...sale.jprod];
                          temp[e.index].order = u.target.value;
                          temp[e.index].total =
                            temp[e.index].order * temp[e.index].price;
                          updateSL({ ...sale, jprod: temp });
                          console.log(temp);

                          let newError = error;
                          newError.jum = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        error={error?.jum}
                        disabled={sale && sale.so_id}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Satuan"
                  field={""}
                  style={{
                    width: "10rem",
                  }}
                  body={(e) => (
                    <CustomDropdown
                      value={e.unit_id && checkUnit(e.unit_id)}
                      onChange={(t) => {
                        let temp = [...sale.jprod];
                        temp[e.index].unit_id = t.id;
                        updateSL({ ...sale, jprod: temp });
                      }}
                      option={satuan}
                      label={"[name]"}
                      placeholder="Pilih Satuan"
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowSatuan(true);
                      }}
                      disabled={sale && sale.so_id}
                    />
                  )}
                />

                <Column
                  header="Harga Satuan"
                  style={{
                    width: "10rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <PrimeNumber
                        value={e.price && e.price}
                        onChange={(u) => {
                          let temp = [...sale.jprod];
                          temp[e.index].price = u.target.value;
                          temp[e.index].total =
                            temp[e.index].order * temp[e.index].price;
                          updateSL({ ...sale, jprod: temp });
                          console.log(temp);

                          let newError = error;
                          newError.prc = false;
                          setError(newError);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        error={error?.prc}
                        disabled={sale && sale.so_id}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Diskon"
                  field={""}
                  style={{
                    width: "15rem",
                  }}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.disc ? e.disc : 0}
                        onChange={(t) => {
                          let temp = [...sale.jprod];
                          temp[e.index].disc = t.target.value;
                          // let disc = temp[e.index].total * temp[e.index].disc / 100
                          // console.log(disc);
                          // temp[e.index].total -= disc;
                          updateSL({ ...sale, jprod: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled={sale && sale.so_id}
                      />
                      <span className="p-inputgroup-addon">%</span>
                    </div>
                  )}
                />

                <Column
                  header="Harga Nett"
                  field={""}
                  style={{
                    width: "10rem",
                  }}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.nett_price ? e.nett_price : 0}
                        onChange={(t) => {
                          let temp = [...sale.jprod];
                          temp[e.index].nett_price = t.target.value;
                          updateSL({ ...sale, jprod: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                        disabled={sale && sale.so_id}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Total"
                  body={(e) => (
                    <label className="text-nowrap">
                      <b>
                        Rp.{" "}
                        {formatIdr(
                          e.nett_price && e.nett_price != 0
                            ? e.nett_price
                            : e.total - (e.total * e.disc) / 100
                        )}
                      </b>
                    </label>
                  )}
                />

                <Column
                  body={(e) =>
                    e.index === sale.jprod.length - 1 ? (
                      <Link
                        onClick={() => {
                          updateSL({
                            ...sale,
                            jprod: [
                              ...sale.jprod,
                              {
                                id: 0,
                                prod_id: null,
                                unit_id: null,
                                location: null,
                                order: null,
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
                          let temp = [...sale.jprod];
                          temp.splice(e.index, 1);
                          updateSL({
                            ...sale,
                            jprod: temp,
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
          tittle={"Permintaan Jasa"}
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
                value={sale?.jjasa.map((v, i) => {
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
                      onChange={(t) => {
                        let temp = [...sale.jjasa];
                        temp[e.index].sup_id = t.supplier.id;
                        updateSL({ ...sale, jjasa: temp });
                        console.log(temp);
                      }}
                      label={"[supplier.sup_name]"}
                      placeholder="Pilih Supplier"
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowSupplier(true);
                      }}
                      disabled={sale && sale.so_id}
                    />
                  )}
                />

                <Column
                  header="Jasa"
                  field={""}
                  body={(e) => (
                    <CustomDropdown
                      value={e.jasa_id && checkjasa(e.jasa_id)}
                      onChange={(t) => {
                        let temp = [...sale.jjasa];
                        temp[e.index].jasa_id = t.jasa.id;
                        updateSL({ ...sale, jjasa: temp });
                      }}
                      option={jasa}
                      label={"[jasa.name]"}
                      placeholder="Pilih Kode Jasa"
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowJasa(true);
                      }}
                      disabled={sale && sale.so_id}
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
                        let temp = [...sale.jjasa];
                        temp[e.index].unit_id = t.id;
                        updateSL({ ...sale, jjasa: temp });
                      }}
                      option={satuan}
                      label={"[name]"}
                      placeholder="Pilih Satuan"
                      detail
                      onDetail={() => {
                        setCurrentIndex(e.index);
                        setShowSatuan(true);
                      }}
                      disabled={sale && sale.so_id}
                    />
                  )}
                />

                <Column
                  header="Jumlah"
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.order && e.order}
                        onChange={(u) => {
                          let temp = [
                            ...sale.jjasa.map((v) => {
                              v.order = v.qty;
                              return v;
                            }),
                          ];
                          temp[e.index].order = u.target.value;
                          temp[e.index].total =
                            temp[e.index].order * temp[e.index].price;
                          updateSL({ ...sale, jjasa: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled={sale && sale.so_id}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Harga Satuan"
                  field={""}
                  style={{
                    minWidth: "10rem",
                  }}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.price && e.price}
                        onChange={(t) => {
                          let temp = [...sale.jjasa];
                          temp[e.index].price = t.target.value;
                          temp[e.index].total =
                            temp[e.index].order * temp[e.index].price;
                          updateSL({ ...sale, jjasa: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled={sale && sale.so_id}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Diskon"
                  field={""}
                  style={{
                    minWidth: "10rem",
                  }}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.disc && e.disc}
                        onChange={(t) => {
                          let temp = [...sale.jjasa];
                          temp[e.index].disc = t.target.value;
                          updateSL({ ...sale, jjasa: temp });
                          console.log(temp);
                        }}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled={sale && sale.so_id}
                      />
                      <span className="p-inputgroup-addon">%</span>
                    </div>
                  )}
                />

                <Column
                  header="Total"
                  body={(e) => (
                    <label className="text-nowrap">
                      <b>Rp. {formatIdr(e.total - (e.total * e.disc) / 100)}</b>
                    </label>
                  )}
                />

                <Column
                  body={(e) =>
                    e.index === sale.jjasa.length - 1 ? (
                      <Link
                        onClick={() => {
                          updateSL({
                            ...sale,
                            jjasa: [
                              ...sale.jjasa,
                              {
                                id: 0,
                                jasa_id: null,
                                unit_id: null,
                                sup_id: null,
                                order: null,
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
                          let temp = [...sale.jjasa];
                          temp.splice(e.index, 1);
                          updateSL({
                            ...sale,
                            jjasa: temp,
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
              {sale.jjasa.length > 0 && sale.jprod.length > 0 && (
                <div className="d-flex col-12 align-items-center">
                  <label className="mt-1">{"Pisah Faktur"}</label>
                  <InputSwitch
                    className="ml-4"
                    checked={sale.split_inv}
                    onChange={(e) => {
                      if (e.value) {
                        updateSL({
                          ...sale,
                          split_inv: e.value,
                          total_disc: null,
                        });
                      } else {
                        updateSL({
                          ...sale,
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
                {sale.split_inv ? "Sub Total Barang" : "Sub Total"}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {sale.split_inv ? (
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
                {sale.split_inv ? "DPP Barang" : "DPP"}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {sale.split_inv ? (
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
                {sale.split_inv ? "Pajak Atas Barang (11%)" : "Pajak (11%)"}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {sale.split_inv ? (
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
                    sale.split_inv
                      ? isRp
                        ? (getSubTotalBarang() * sale.prod_disc) / 100
                        : sale.prod_disc
                      : isRp
                      ? ((getSubTotalBarang() + getSubTotalJasa()) *
                          sale.total_disc) /
                        100
                      : sale.total_disc
                  }
                  placeholder="Diskon"
                  type="number"
                  min={0}
                  onChange={(e) => {
                    if (sale.split_inv) {
                      let disc = 0;
                      if (isRp) {
                        disc = (e.target.value / getSubTotalBarang()) * 100;
                      } else {
                        disc = e.target.value;
                      }
                      updateSL({ ...sale, prod_disc: disc });
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
                      updateSL({ ...sale, total_disc: disc });
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
              <label className="text-label fs-14">
                <b>Total Pembayaran</b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label fs-14">
                {sale.split_inv ? (
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

            {sale.split_inv ? (
              <>
                {/* <div className="row justify-content-right col-12 mt-4"> */}
                <div className="col-6 mt-4">
                  <label className="text-label">Sub Total Jasa</label>
                </div>

                <div className="col-6 mt-4">
                  <label className="text-label">
                    <b>Rp. {formatIdr(getSubTotalJasa())}</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label">DPP Jasa</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Rp. {formatIdr(getSubTotalJasa())}</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label">Pajak Atas Jasa (2%)</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Rp. {formatIdr((getSubTotalJasa() * 2) / 100)}</b>
                  </label>
                </div>

                <div className="col-6 mt-3">
                  <label className="text-label">Diskon Tambahan</label>
                </div>

                <div className="col-6">
                  <div className="p-inputgroup">
                    <PButton
                      label="Rp."
                      className={`${isRjjasa ? "" : "p-button-outlined"}`}
                      onClick={() => setRjjasa(true)}
                    />
                    <InputText
                      value={
                        isRjjasa
                          ? (getSubTotalJasa() * sale.jasa_disc) / 100
                          : sale.jasa_disc
                      }
                      placeholder="Diskon"
                      type="number"
                      min={0}
                      onChange={(e) => {
                        let disc = 0;
                        if (isRjjasa) {
                          disc = (e.target.value / getSubTotalJasa()) * 100;
                        } else {
                          disc = e.target.value;
                        }
                        updateSL({ ...sale, jasa_disc: disc });
                      }}
                    />
                    <PButton
                      className={`${isRjjasa ? "p-button-outlined" : ""}`}
                      onClick={() => setRjjasa(false)}
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
                    <b>Total Pembayaran</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="fs-14">
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
          getProduct();
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

            let temp = [...sale.jprod];
            temp[currentIndex].prod_id = e.data.id;
            temp[currentIndex].unit_id = e.data.unit?.id;
            updateSL({ ...sale, jprod: temp });
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
            let temp = [...sale.jjasa];
            temp[currentIndex].jasa_id = e.data.jasa.id;
            updateSL({ ...sale, jjasa: temp });
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
            let temp = [...sale.jprod];
            temp[currentIndex].unit_id = e.data.id;

            let tempj = [...sale.jjasa];
            tempj[currentIndex].unit_id = e.data.id;
            updateSL({ ...sale, jprod: temp, jjasa: tempj });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

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
            updateSL({ ...sale, top: e.data.id });
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
            let temp = [...sale.jjasa];
            temp[currentIndex].sup_id = e.data.supplier.id;
            updateSL({ ...sale, jjasa: temp });
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
        show={showLokasi}
        onHide={() => {
          setShowLok(false);
        }}
        onInput={(e) => {
          setShowLok(!e);
        }}
        onSuccessInput={(e) => {
          getLoct();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowLok(false);
            let temp = [...sale.jprod];
            temp[currentIndex].location = e.data.id;
            updateSL({ ...sale, jprod: temp });
          }

          setDoubleClick(true);

          setTimeout(() => {
            setDoubleClick(false);
          }, 2000);
        }}
      />

      <DataSalesman
        data={salesman}
        loading={false}
        popUp={true}
        show={showSalesman}
        onHide={() => {
          setShowSalesman(false);
        }}
        onInput={(e) => {
          setShowSalesman(!e);
        }}
        onSuccessInput={(e) => {
          getSalesman();
        }}
        onRowSelect={(e) => {
          if (doubleClick) {
            setShowSalesman(false);
            updateSL({ ...sale, slsm_id: e.data.id });
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
            updateSL({ ...sale, pel_id: e.data.customer.id });
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
            updateSL({ ...sale, sub_id: e.data.id });
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

export default InputPenjualan;