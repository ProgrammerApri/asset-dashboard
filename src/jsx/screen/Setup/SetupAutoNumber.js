import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Accordion,
  ToggleButton,
  Form,
  SplitButton,
} from "react-bootstrap";
import { InputSwitch } from "primereact/inputswitch";
import { endpoints, request } from "src/utils";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { tr } from "src/data/tr";
import { Dropdown } from "primereact/dropdown";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import { InputText } from "primereact/inputtext";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import CustomMonthPicker from "src/jsx/components/CustomMonthPicker/CustomMonthPicker";
import { Divider } from "primereact/divider";
import { Checkbox } from "@material-ui/core";
import { SET_CURRENT_RP_AUTO } from "src/redux/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Button } from "primereact/button";
import data from "src/jsx/data";
// import { Checkbox } from "primereact/checkbox";

const set = {
  id: null,
  // cp_id: null,
  rp_no_ref: "",
  rp_ref_month: null,
  rp_ref_year: null,
  rp_depart: false,
  rp_reset_month: false,

  po_no_ref: null,
  po_ref_month: null,
  po_ref_year: null,
  po_depart: null,
  po_reset_month: false,

  gr_no_ref: null,
  gr_ref_month: null,
  gr_ref_year: null,
  gr_depart: null,
  gr_reset_month: false,

  pi_no_ref: null,
  pi_ref_month: null,
  pi_ref_year: null,
  pi_depart: null,
  pi_reset_month: false,

  pr_no_ref: null,
  pr_ref_month: null,
  pr_ref_year: null,
  pr_depart: null,
  pr_reset_month: false,

  so_no_ref: null,
  so_ref_month: null,
  so_ref_year: null,
  so_depart: null,
  so_reset_month: false,

  sl_no_ref: null,
  sl_ref_month: null,
  sl_ref_year: null,
  sl_depart: null,
  sl_reset_month: false,

  ip_no_ref: null,
  ip_ref_month: null,
  ip_ref_year: null,
  ip_depart: null,
  ip_reset_month: false,

  fp_no_ref: null,
  fp_ref_month: null,
  fp_ref_year: null,
  fp_depart: null,
  fp_reset_month: false,

  rpen_no_ref: null,
  rpen_ref_month: null,
  rpen_ref_year: null,
  rpen_depart: null,
  rpen_reset_month: false,

  mutasiantarlok_no_ref: null,
  mutasiantarlok_ref_month: null,
  mutasiantarlok_ref_year: null,
  mutasiantarlok_depart: null,
  mutasiantarlok_reset_month: false,
  korpersediaan_no_ref: null,
  korpersediaan_ref_month: null,
  korpersediaan_ref_year: null,
  korpersediaan_depart: null,
  korpersediaan_reset_month: false,

  pemkaianbb_no_ref: null,
  pemkaianbb_ref_month: null,
  pemkaianbb_ref_year: null,
  pemkaianbb_depart: null,
  pemkaianbb_reset_month: false,

  penerimaanhj_no_ref: null,
  penerimaanhj_ref_month: null,
  penerimaanhj_ref_year: null,
  penerimaanhj_depart: null,
  penerimaanhj_reset_month: false,

  memorial_no_ref: null,
  memorial_ref_month: null,
  memorial_ref_year: null,
  memorial_depart: null,
  memorial_reset_month: false,

  pengeluaran_no_ref: null,
  pengeluaran_ref_month: null,
  pengeluaran_ref_year: null,
  pengeluaran_depart: null,
  pengeluaran_reset_month: false,

  pencairangirokeluar_no_ref: null,
  pencairangirokeluar_ref_month: null,
  pencairangirokeluar_ref_year: null,
  pencairangirokeluar_depart: null,
  pencairangirokeluar_reset_month: false,

  koreksihutang_no_ref: null,
  koreksihutang_ref_month: null,
  koreksihutang_ref_year: null,
  koreksihutang_depart: null,
  koreksihutang_reset_month: false,

  pemasukan_no_ref: null,
  pemasukan_ref_month: null,
  pemasukan_ref_year: null,
  pemasukan_depart: null,
  pemasukan_reset_month: false,

  pencairangiromasuk_no_ref: null,
  pencairangiromasuk_ref_month: null,
  pencairangiromasuk_ref_year: null,
  pencairangiromasuk_depart: null,
  pencairangiromasuk_reset_month: false,

  koreksipiutang_no_ref: null,
  koreksipiutang_ref_month: null,
  koreksipiutang_ref_year: null,
  koreksipiutang_depart: null,
  koreksipiutang_reset_month: false,

  mesin_no_ref: null,
  mesin_ref_month: null,
  mesin_ref_year: null,
  mesin_depart: null,
  mesin_reset_month: false,

  formula_no_ref: null,
  formula_ref_month: null,
  formula_ref_year: null,
  formula_depart: null,
  formula_reset_month: false,

  planning_no_ref: null,
  planning_ref_month: null,
  planning_ref_year: null,
  planning_depart: null,
  planning_reset_month: false,

  batch_no_ref: null,
  batch_ref_month: null,
  batch_ref_year: null,
  batch_depart: null,
  batch_reset_month: false,

  penerimaanhasiljadi_no_ref: null,
  penerimaanhasiljadi_ref_month: null,
  penerimaanhasiljadi_ref_year: null,
  penerimaanhasiljadi_depart: null,
  penerimaanhasiljadi_reset_month: false,

  pembebanan_no_ref: null,
  pembebanan_ref_month: null,
  pembebanan_ref_year: null,
  pembebanan_depart: null,
  pembebanan_reset_month: false,
};

const SetupAutoNumber = () => {
  const toast = useRef(null);
  const [currentData, setCurrentData] = useState(null);
  const [currentSetup, setCurrentSetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onSubmit, setSubmit] = useState(false);
  const rp_auto = useSelector((state) => state.rp.currentauto);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  //pembelian
  const [prefix, setPrefix] = useState("");
  const [prefix1, setPrefix1] = useState("");
  const [prefix2, setPrefix2] = useState("");
  const [prefix3, setPrefix3] = useState("");
  const [prefix4, setPrefix4] = useState("");
  const [departement, setDepartement] = useState("");
  const [departement1, setDepartement1] = useState("");
  const [departement2, setDepartement2] = useState("");
  const [departement3, setDepartement3] = useState("");
  const [departement4, setDepartement4] = useState("");
  //penjualan
  const [penju, setPenju] = useState("");
  const [penju1, setPenju1] = useState("");
  const [penju2, setPenju2] = useState("");
  const [penju3, setPenju3] = useState("");
  const [penju4, setPenju4] = useState("");
  const [deppenju, setDeppenju] = useState("");
  const [deppenju1, setDeppenju1] = useState("");
  const [deppenju2, setDeppenju2] = useState("");
  const [deppenju3, setDeppenju3] = useState("");
  const [deppenju4, setDeppenju4] = useState("");
  //persediaan
  const [persediaan, setPersediaan] = useState("");
  const [persediaan1, setPersediaan1] = useState("");
  const [persediaan2, setPersediaan2] = useState("");
  const [persediaan3, setPersediaan3] = useState("");
  const [deppersediaan, setDeppersediaan] = useState("");
  const [deppersediaan1, setDeppersediaan1] = useState("");
  const [deppersediaan2, setDeppersediaan2] = useState("");
  const [deppersediaan3, setDeppersediaan3] = useState("");
  //memorial
  const [memorial, setMemorial] = useState("");
  const [depmemorial, setDepmemorial] = useState("");
  //pengeluaran keluar
  const [pengeluarankeluar, setPengeluarankeluar] = useState("");

  //pencairan giro keluar
  const [pencairangirokeluar, setPencairangirokeluar] = useState("");

  //koreksi hutang
  const [koreksihutang, setKoreksihutang] = useState("");

  //pemasukan masuk
  const [pemasukanmasuk, setPemasukanmasuk] = useState("");

  //pencairan giro masuk
  const [pencairangiromasuk, setPencairangiromasuk] = useState("");

  //koreksi piutang
  const [koreksipiutang, setKoreksipiutang] = useState("");

  //mesin
  const [mesin, setMesin] = useState("");

  //formula
  const [formula, setFormula] = useState("");

  //planning
  const [planning, setPlanning] = useState("");

  //batch
  const [batch, setBatch] = useState("");

  //penerimaanhasiljadi
  const [penerimaanhasiljadi, setPenerimaanhasiljadi] = useState("");

  //pembebanan
  const [pembebanan, setPembebanan] = useState("");

  const [middle, setMiddle] = useState(new Date().getMonth() + 1);
  const dispatch = useDispatch();
  const [year, setYear] = useState(new Date().getFullYear());
  const [number, setNumber] = useState("");
  const [resbulan, setResbulan] = useState(false);
  const [resbulan1, setResbulan1] = useState(false);
  const [resbulan2, setResbulan2] = useState(false);
  const [resbulan3, setResbulan3] = useState(false);
  const [resbulan4, setResbulan4] = useState(false);
  const [resbulan5, setResbulan5] = useState(false);
  const [resbulan6, setResbulan6] = useState(false);
  const [resbulan7, setResbulan7] = useState(false);
  const [resbulan8, setResbulan8] = useState(false);
  const [resbulan9, setResbulan9] = useState(false);
  const [resbulan10, setResbulan10] = useState(false);
  const [resbulan11, setResbulan11] = useState(false);
  const [resbulan12, setResbulan12] = useState(false);
  const [resbulan13, setResbulan13] = useState(false);
  const [resbulan14, setResbulan14] = useState(false);
  const [resbulan15, setResbulan15] = useState(false);
  const [resbulan16, setResbulan16] = useState(false);
  const [resbulan17, setResbulan17] = useState(false);
  const [resbulan18, setResbulan18] = useState(false);
  const [resbulan19, setResbulan19] = useState(false);
  const [resbulan20, setResbulan20] = useState(false);
  const [resbulan21, setResbulan21] = useState(false);
  const [resbulan23, setResbulan23] = useState(false);
  const [resbulan24, setResbulan24] = useState(false);
  const [resbulan25, setResbulan25] = useState(false);
  const [resbulan26, setResbulan26] = useState(false);
  const [resbulan27, setResbulan27] = useState(false);
  const [resbulan28, setResbulan28] = useState(false);
  const [resbulan29, setResbulan29] = useState(false);
  const [resbulan30, setResbulan30] = useState(false);
  const [resbulan31, setResbulan31] = useState(false);
  const [resbulan32, setResbulan32] = useState(false);
  const [resbulan33, setResbulan33] = useState(false);
  const [resbulan34, setResbulan34] = useState(false);
  const [resbulan35, setResbulan35] = useState(false);
  const [resbulan36, setResbulan36] = useState(false);
  const [resbulan37, setResbulan37] = useState(false);
  const [resbulan38, setResbulan38] = useState(false);
  const [resbulan39, setResbulan39] = useState(false);
  const [resbulan40, setResbulan40] = useState(false);
  const [resbulan41, setResbulan41] = useState(false);
  const [resbulan42, setResbulan42] = useState(false);
  const [resbulan43, setResbulan43] = useState(false);
  const [resbulan44, setResbulan44] = useState(false);
  const [resbulan45, setResbulan45] = useState(false);
  const [resbulan46, setResbulan46] = useState(false);
  const [resbulan47, setResbulan47] = useState(false);
  const [resbulan48, setResbulan48] = useState(false);
  const [resbulan49, setResbulan49] = useState(false);
  const [resbulan50, setResbulan50] = useState(false);
  const [resbulan51, setResbulan51] = useState(false);
  const [resbulan52, setResbulan52] = useState(false);
  const [resbulan53, setResbulan53] = useState(false);
  const [resbulan54, setResbulan54] = useState(false);
  const monthsInRomanNumerals = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];

  const romanNumeral = monthsInRomanNumerals[middle];

  const [accor, setAccor] = useState({
    purchase: true,
    sale: true,
    inventori: true,
    memorial: true,
    resetbulan: false,
  });

  useEffect(() => {
    postSetup();
  }, []);

  
  const postSetup = async ( isUpdate = data) => {
    let config = {};
    if (isUpdate) {
      if (data) {
        config = {
          ...endpoints.updateSetupautonumber,
          endpoint: endpoints.updateSetupautonumber.endpoint + currentData?.id,
          data: data,
        };
      } else {
        config = {
          ...endpoints.updateSetupautonumber,
          endpoint: endpoints.updateSetupautonumber.endpoint + currentData?.id,
          data: {
            ...currentData,
            data: data,
          },
        };
      }
    } else {
      config = {
        ...endpoints.addSetupautonumber,
        data: data,
      };
    }
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setSubmit(false);
        // onHide();
        toast.current.show({
          severity: "info",
          summary: "Berhasil",
          detail: "Data berhasil diperbarui",
          life: 3000,
        });
      }
    } catch (error) {
      setSubmit(false);
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: "Gagal memperbarui data",
        life: 3000,
      });
    }
  };

  const getSetup = async (needLoading = true) => {
    setLoading(needLoading);
    const config = {
      ...endpoints.getSetupautonumber,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        setCurrentSetup(data);
      } else {
        setCurrentSetup(set);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const submitUpdate = async (upload = false, data) => {
    if (currentData?.id === 0) {
      if (upload) {
        postSetup("");
      } else {
        postSetup("");
      }
    } else {
      if (upload) {
        postSetup(true);
      } else {
        postSetup("", true, data);
      }
    }
  };


  const addSetup = async () => {
    let config = {
      ...endpoints.addSetupautonumber,
      data: rp_auto,
      };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        toast.current.show({
          severity: "info",
          summary: "Berhasil",
          detail: "Data berhasil diperbarui",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: "Gagal memperbarui data",
        life: 3000,
      });
    }
  };

  const updateRp = (e) => {
    dispatch({
      type: SET_CURRENT_RP_AUTO,
      payload: e,
    });
  };


  const renderSettings = () => {
    return (
      <>
        <Col className="col-lg-12 col-sm-12 col-xs-12">
          <CustomAccordion
            tittle={"Auto Number Transaksi Purchase"}
            defaultActive={true}
            active={accor.purchase}
            onClick={() => {
              setAccor({
                ...accor,
                purchase: !accor.purchase,
              });
            }}
            key={1}
            body={
              <>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Request Purchase</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={currentData ? currentData?.rp_no_ref : null}
                        onChange={(e) => {
                          setCurrentSetup(e.target.value);
                          updateRp({
                            ...currentData,
                            rp_no_ref: e.target.value,
                            rp_ref_month: romanNumeral,
                            rp_ref_year: year,
                          });
                          // updateRp({ ...rp_auto, rp_ref_month: e.target.value });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput type="text" value={romanNumeral} disabled />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput type="text" value={year} disabled />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.rp_depart ? "SUPERVISOR" : ""}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={rp_auto.rp_depart}
                      onChange={(e) => {
                        setCurrentData({ ...rp_auto, rp_depart: e.value });
                        updateRp({ ...rp_auto, rp_depart: e.value });
                      }}
                    />
                  </div>

                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={rp_auto && rp_auto.rp_reset_month}
                      onChange={(e) => {
                        setResbulan1(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        submitUpdate();
                      }}
                      autoFocus
                      loading={onSubmit}
                    />
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Purchase Order</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.prefix}
                        onChange={(e) => {
                          setPrefix1(e.target.value);
                          updateRp({
                            ...rp_auto,
                            po_no_ref: e.target.value,
                            po_ref_month: romanNumeral,
                            po_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.po_depart ? "IT" : ""}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>

                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={rp_auto.po_depart}
                      onChange={(e) => {
                        setCurrentData({ ...rp_auto, po_depart: e.value });
                        updateRp({ ...rp_auto, po_depart: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={rp_auto && rp_auto.po_reset_month}
                      onChange={(e) => {
                        setCurrentData({
                          ...rp_auto,
                          po_reset_month: e.value,
                        });
                        updateRp({ ...rp_auto, po_reset_month: e.value });
                      }}
                    />
                  </div>

                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={onSubmit}
                    />
                    {/* <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan fitur RP (Request Purchase)"}
                    </label> */}
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Purchase</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.prefix2}
                        onChange={(e) => {
                          setPrefix2(e.target.value);
                          updateRp({
                            ...rp_auto,
                            gr_no_ref: e.target.value,
                            gr_ref_month: romanNumeral,
                            gr_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      onChange={(e) => {
                        setDepartement2(e.target.value);
                        updateRp({ ...rp_auto, gr_ref_year: e.target.value });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={resbulan4 ? "HRD" : ""}
                      onChange={(e) => {
                        setDepartement2(e.target.value);
                        updateRp({ ...rp_auto, gr_depart: e.target.value });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>

                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan4}
                      onChange={(e) => {
                        setResbulan4(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan5}
                      onChange={(e) => {
                        setResbulan5(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                    {/* <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan fitur RP (Request Purchase)"}
                    </label> */}
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Invoice Purchase</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.prefix3}
                        onChange={(e) => {
                          setPrefix3(e.target.value);
                          updateRp({
                            ...rp_auto,
                            pi_no_ref: e.target.value,
                            pi_ref_month: romanNumeral,
                            pi_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      onChange={(e) => {
                        setDepartement3(e.target.value);
                        updateRp({ ...rp_auto, pi_ref_year: e.target.value });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={resbulan6 ? "SUPPORT" : ""}
                      onChange={(e) => {
                        setDepartement3(e.target.value);
                        updateRp({ ...rp_auto, pi_depart: e.target.value });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>

                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan6}
                      onChange={(e) => {
                        setResbulan6(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan7}
                      onChange={(e) => {
                        setResbulan7(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                    {/* <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan fitur RP (Request Purchase)"}
                    </label> */}
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Faktur Purchase</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.prefix4}
                        onChange={(e) => {
                          setPrefix4(e.target.value);
                          updateRp({
                            ...rp_auto,
                            pr_no_ref: e.target.value,
                            pr_ref_month: romanNumeral,
                            pr_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={resbulan8 ? "MANAGER" : ""}
                      onChange={(e) => {
                        setDepartement4(e.target.value);
                        updateRp({ ...rp_auto, pr_depart: e.target.value });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>

                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan8}
                      onChange={(e) => {
                        setResbulan8(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan9}
                      onChange={(e) => {
                        setResbulan9(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                    {/* <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan fitur RP (Request Purchase)"}
                    </label> */}
                  </div>
                </Row>
              </>
            }
          />
          <CustomAccordion
            tittle={"Auto Number Transaksi Sale"}
            defaultActive={false}
            active={accor.sale}
            onClick={() => {
              setAccor({
                ...accor,
                sale: !accor.sale,
              });
            }}
            key={1}
            body={
              <>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Sale Order (SO)</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.penju}
                        onChange={(e) => {
                          setPenju(e.target.value);
                          updateRp({
                            ...rp_auto,
                            so_no_ref: e.target.value,
                            so_ref_month: romanNumeral,
                            so_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.so_depart}
                      onChange={(e) => {
                        setDeppenju(e.target.value);
                        updateRp({ ...rp_auto, so_depart: e.target.value });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>

                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan10}
                      onChange={(e) => {
                        setResbulan10(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan11}
                      onChange={(e) => {
                        setResbulan11(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                    {/* <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan fitur RP (Request Purchase)"}
                    </label> */}
                  </div>
                </Row>
                <Row className="mb-4">
                  {" "}
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Sale</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.penju1}
                        onChange={(e) => {
                          setPenju1(e.target.value);
                          updateRp({
                            ...rp_auto,
                            sl_no_ref: e.target.value,
                            sl_ref_month: romanNumeral,
                            sl_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.sl_depart}
                      onChange={(e) => {
                        setDeppenju1(e.target.value);
                        updateRp({ ...rp_auto, sl_depart: e.target.value });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan12}
                      onChange={(e) => {
                        setResbulan12(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan13}
                      onChange={(e) => {
                        setResbulan13(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                    {/* <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan fitur RP (Request Purchase)"}
                    </label> */}
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Invoice Sale</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.penju2}
                        onChange={(e) => {
                          setPenju2(e.target.value);
                          updateRp({
                            ...rp_auto,
                            ip_no_ref: e.target.value,
                            ip_ref_month: romanNumeral,
                            ip_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.ip_depart}
                      onChange={(e) => {
                        setDeppenju2(e.target.value);
                        updateRp({ ...rp_auto, ip_depart: e.target.value });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan14}
                      onChange={(e) => {
                        setResbulan14(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan15}
                      onChange={(e) => {
                        setResbulan15(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                    {/* <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan fitur RP (Request Purchase)"}
                    </label> */}
                  </div>
                </Row>
                <Row className="mb-4">
                  {" "}
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Faktur Sale</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.penju3}
                        onChange={(e) => {
                          setPenju3(e.target.value);
                          updateRp({
                            ...rp_auto,
                            fp_no_ref: e.target.value,
                            fp_ref_month: romanNumeral,
                            fp_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      onChange={(e) => {
                        setDepartement3(e.target.value);
                        updateRp({ ...rp_auto, pi_ref_year: e.target.value });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.fp_depart}
                      onChange={(e) => {
                        setDeppenju3(e.target.value);
                        updateRp({ ...rp_auto, fp_depart: e.target.value });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan16}
                      onChange={(e) => {
                        setResbulan16(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan17}
                      onChange={(e) => {
                        setResbulan17(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                    {/* <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan fitur RP (Request Purchase)"}
                    </label> */}
                  </div>
                </Row>
                <Row className="mb-4">
                  {" "}
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Sale Return</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.penju4}
                        onChange={(e) => {
                          setPenju4(e.target.value);
                          updateRp({
                            ...rp_auto,
                            rpen_no_ref: e.target.value,
                            rpen_ref_month: romanNumeral,
                            rpen_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.rpen_depart}
                      onChange={(e) => {
                        setDeppenju4(e.target.value);
                        updateRp({ ...rp_auto, rpen_depart: e.target.value });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan18}
                      onChange={(e) => {
                        setResbulan18(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan19}
                      onChange={(e) => {
                        setResbulan19(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                    {/* <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan fitur RP (Request Purchase)"}
                    </label> */}
                  </div>
                </Row>
              </>
            }
          />
          <CustomAccordion
            tittle={"Auto Number Inventory"}
            defaultActive={false}
            active={accor.sale}
            onClick={() => {
              setAccor({
                ...accor,
                sale: !accor.sale,
              });
            }}
            key={1}
            body={
              <>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Mutation Between Location</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.mutasiantarlok_no_ref}
                        onChange={(e) => {
                          setPersediaan(e.target.value);
                          updateRp({
                            ...rp_auto,
                            mutasiantarlok_no_ref: e.target.value,
                            mutasiantarlok_ref_month: romanNumeral,
                            mutasiantarlok_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.mutasiantarlok_depart}
                      onChange={(e) => {
                        setDeppersediaan(e.target.value);
                        updateRp({
                          ...rp_auto,
                          mutasiantarlok_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan20}
                      onChange={(e) => {
                        setResbulan20(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan21}
                      onChange={(e) => {
                        setResbulan21(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                    {/* <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan fitur RP (Request Purchase)"}
                    </label> */}
                  </div>
                </Row>
                <Row className="mb-4">
                  {" "}
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Koreksi Persediaan</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.persediaan}
                        onChange={(e) => {
                          setPersediaan1(e.target.value);
                          updateRp({
                            ...rp_auto,
                            korpersediaan_no_ref: e.target.value,
                            korpersediaan_ref_month: romanNumeral,
                            korpersediaan_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.korpersediaan_depart}
                      onChange={(e) => {
                        setDeppersediaan1(e.target.value);
                        updateRp({
                          ...rp_auto,
                          korpersediaan_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan23}
                      onChange={(e) => {
                        setResbulan23(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan24}
                      onChange={(e) => {
                        setResbulan24(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                    {/* <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan fitur RP (Request Purchase)"}
                    </label> */}
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Pemakaian Bahan Baku</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.persediaan2}
                        onChange={(e) => {
                          setPersediaan2(e.target.value);
                          updateRp({
                            ...rp_auto,
                            pemkaianbb_no_ref: e.target.value,
                            pemkaianbb_ref_month: romanNumeral,
                            pemkaianbb_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.pemkaianbb_depart}
                      onChange={(e) => {
                        setDeppersediaan2(e.target.value);
                        updateRp({
                          ...rp_auto,
                          pemkaianbb_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan25}
                      onChange={(e) => {
                        setResbulan25(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan26}
                      onChange={(e) => {
                        setResbulan26(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                    {/* <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan fitur RP (Request Purchase)"}
                    </label> */}
                  </div>
                </Row>
                <Row className="mb-4">
                  {" "}
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Penerimaan Hasil Jadi</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.penju3}
                        onChange={(e) => {
                          setPersediaan3(e.target.value);
                          updateRp({
                            ...rp_auto,
                            penerimaanhj_no_ref: e.target.value,
                            penerimaanhj_ref_month: romanNumeral,
                            penerimaanhj_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      onChange={(e) => {
                        setDeppersediaan3(e.target.value);
                        updateRp({ ...rp_auto, pi_ref_year: e.target.value });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.penerimaanhj_depart}
                      onChange={(e) => {
                        setDeppersediaan3(e.target.value);
                        updateRp({
                          ...rp_auto,
                          penerimaanhj_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan27}
                      onChange={(e) => {
                        setResbulan27(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan28}
                      onChange={(e) => {
                        setResbulan28(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                    {/* <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan fitur RP (Request Purchase)"}
                    </label> */}
                  </div>
                </Row>
              </>
            }
          />
          <CustomAccordion
            tittle={"Auto Number Memorial"}
            defaultActive={false}
            active={accor.sale}
            onClick={() => {
              setAccor({
                ...accor,
                sale: !accor.sale,
              });
            }}
            key={1}
            body={
              <>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Memorial</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.memorial}
                        onChange={(e) => {
                          setMemorial(e.target.value);
                          updateRp({
                            ...rp_auto,
                            memorial_no_ref: e.target.value,
                            memorial_ref_month: romanNumeral,
                            memorial_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.memorial_depart}
                      onChange={(e) => {
                        setDepmemorial(e.target.value);
                        updateRp({
                          ...rp_auto,
                          memorial_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan29}
                      onChange={(e) => {
                        setResbulan29(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan30}
                      onChange={(e) => {
                        setResbulan30(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                  </div>
                </Row>
              </>
            }
          />
          <CustomAccordion
            tittle={"Auto Number Kas / Bank Keluar"}
            defaultActive={false}
            active={accor.sale}
            onClick={() => {
              setAccor({
                ...accor,
                sale: !accor.sale,
              });
            }}
            key={1}
            body={
              <>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Pengeluaran</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.pengeluarankeluar}
                        onChange={(e) => {
                          setPengeluarankeluar(e.target.value);
                          updateRp({
                            ...rp_auto,
                            pwngwluaran_no_ref: e.target.value,
                            pengeluaran_ref_month: romanNumeral,
                            pengeluaran_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.memorial_depart}
                      onChange={(e) => {
                        setDepmemorial(e.target.value);
                        updateRp({
                          ...rp_auto,
                          pengeluaran_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan31}
                      onChange={(e) => {
                        setResbulan31(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan32}
                      onChange={(e) => {
                        setResbulan32(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Pencairan Giro Keluar</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.pencairangirokeluar}
                        onChange={(e) => {
                          setPencairangirokeluar(e.target.value);
                          updateRp({
                            ...rp_auto,
                            pencairangirokeluar_no_ref: e.target.value,
                            pencairangirokeluar_ref_month: romanNumeral,
                            pencairangirokeluar_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.pencairangirokeluar_depart}
                      onChange={(e) => {
                        setDepmemorial(e.target.value);
                        updateRp({
                          ...rp_auto,
                          pencairangirokeluar_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan33}
                      onChange={(e) => {
                        setResbulan33(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan34}
                      onChange={(e) => {
                        setResbulan34(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Koreksi Hutang</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.koreksihutang}
                        onChange={(e) => {
                          setKoreksihutang(e.target.value);
                          updateRp({
                            ...rp_auto,
                            koreksihutang_no_ref: e.target.value,
                            koreksihutang_ref_month: romanNumeral,
                            koreksihutang_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.koreksihutang_depart}
                      onChange={(e) => {
                        setDepmemorial(e.target.value);
                        updateRp({
                          ...rp_auto,
                          koreksihutang_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan35}
                      onChange={(e) => {
                        setResbulan35(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan36}
                      onChange={(e) => {
                        setResbulan36(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                  </div>
                </Row>
              </>
            }
          />
          <CustomAccordion
            tittle={"Auto Number Kas / Bank Masuk"}
            defaultActive={false}
            active={accor.sale}
            onClick={() => {
              setAccor({
                ...accor,
                sale: !accor.sale,
              });
            }}
            key={1}
            body={
              <>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Pemasukan</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.pemasukanmasuk}
                        onChange={(e) => {
                          setPemasukanmasuk(e.target.value);
                          updateRp({
                            ...rp_auto,
                            pemasukan_no_ref: e.target.value,
                            pemasukan_ref_month: romanNumeral,
                            pemasukan_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.pemasukan_depart}
                      onChange={(e) => {
                        setPemasukanmasuk(e.target.value);
                        updateRp({
                          ...rp_auto,
                          pemasukan_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan37}
                      onChange={(e) => {
                        setResbulan37(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan38}
                      onChange={(e) => {
                        setResbulan38(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Pencairan Giro Masuk</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.pencairangiromasuk}
                        onChange={(e) => {
                          setPencairangiromasuk(e.target.value);
                          updateRp({
                            ...rp_auto,
                            pencairangiromasuk_no_ref: e.target.value,
                            pencairangiromasuk_ref_month: romanNumeral,
                            pencairangiromasuk_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.pencairangiromasuk_depart}
                      onChange={(e) => {
                        setDepmemorial(e.target.value);
                        updateRp({
                          ...rp_auto,
                          pencairangiromasuk_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan39}
                      onChange={(e) => {
                        setResbulan39(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan40}
                      onChange={(e) => {
                        setResbulan40(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Koreksi Piutang</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.koreksipiutang}
                        onChange={(e) => {
                          setKoreksipiutang(e.target.value);
                          updateRp({
                            ...rp_auto,
                            koreksipiutang_no_ref: e.target.value,
                            koreksipiutang_ref_month: romanNumeral,
                            koreksipiutang_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.memorial_depart}
                      onChange={(e) => {
                        setDepmemorial(e.target.value);
                        updateRp({
                          ...rp_auto,
                          koreksipiutang_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan41}
                      onChange={(e) => {
                        setResbulan41(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan42}
                      onChange={(e) => {
                        setResbulan42(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                  </div>
                </Row>
              </>
            }
          />
          <CustomAccordion
            tittle={"Auto Number Produksi"}
            defaultActive={false}
            active={accor.sale}
            onClick={() => {
              setAccor({
                ...accor,
                sale: !accor.sale,
              });
            }}
            key={1}
            body={
              <>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Mesin</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.mesin}
                        onChange={(e) => {
                          setMesin(e.target.value);
                          updateRp({
                            ...rp_auto,
                            mesin_no_ref: e.target.value,
                            mesin_ref_month: romanNumeral,
                            mesin_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.mesin_depart}
                      onChange={(e) => {
                        setMesin(e.target.value);
                        updateRp({
                          ...rp_auto,
                          mesin_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan43}
                      onChange={(e) => {
                        setResbulan43(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan44}
                      onChange={(e) => {
                        setResbulan44(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Formula</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.formula}
                        onChange={(e) => {
                          setFormula(e.target.value);
                          updateRp({
                            ...rp_auto,
                            formula_no_ref: e.target.value,
                            formula_ref_month: romanNumeral,
                            formula_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.formula_depart}
                      onChange={(e) => {
                        setFormula(e.target.value);
                        updateRp({
                          ...rp_auto,
                          formula_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan45}
                      onChange={(e) => {
                        setResbulan45(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan46}
                      onChange={(e) => {
                        setResbulan46(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Planning</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.planning}
                        onChange={(e) => {
                          setPlanning(e.target.value);
                          updateRp({
                            ...rp_auto,
                            planning_no_ref: e.target.value,
                            planning_ref_month: romanNumeral,
                            planning_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.planning_depart}
                      onChange={(e) => {
                        setPlanning(e.target.value);
                        updateRp({
                          ...rp_auto,
                          planning_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan47}
                      onChange={(e) => {
                        setResbulan47(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan48}
                      onChange={(e) => {
                        setResbulan48(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Batch</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.batch}
                        onChange={(e) => {
                          setBatch(e.target.value);
                          updateRp({
                            ...rp_auto,
                            batch_no_ref: e.target.value,
                            batch_ref_month: romanNumeral,
                            batch_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.batch_depart}
                      onChange={(e) => {
                        setBatch(e.target.value);
                        updateRp({
                          ...rp_auto,
                          batch_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan49}
                      onChange={(e) => {
                        setResbulan49(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan50}
                      onChange={(e) => {
                        setResbulan50(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Penerimaan Hasil Jadi</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.penerimaanhasiljadi}
                        onChange={(e) => {
                          setPenerimaanhasiljadi(e.target.value);
                          updateRp({
                            ...rp_auto,
                            penerimaanhasiljadi_no_ref: e.target.value,
                            penerimaanhasiljadi_ref_month: romanNumeral,
                            penerimaanhasiljadi_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.penerimaanhasiljadi_depart}
                      onChange={(e) => {
                        setPenerimaanhasiljadi(e.target.value);
                        updateRp({
                          ...rp_auto,
                          penerimaanhasiljadi_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan51}
                      onChange={(e) => {
                        setResbulan51(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan52}
                      onChange={(e) => {
                        setResbulan52(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                  </div>
                </Row>
                <Row className="mb-4">
                  <div className="col-12 mb-0">
                    {/* <label className="text-label"> */}
                    <h9>Pembebanan</h9>
                    {/* </label> */}
                    <Divider className="ml-12"></Divider>
                  </div>
                  <div className="col-1">
                    <div className="">
                      <label className="text-label">Code Referensi</label>
                      {/* <div className="p-inputgroup"></div> */}
                      <PrimeInput
                        type="text"
                        value={rp_auto?.pembebanan}
                        onChange={(e) => {
                          setPembebanan(e.target.value);
                          updateRp({
                            ...rp_auto,
                            pembebanan_no_ref: e.target.value,
                            pembebanan_ref_month: romanNumeral,
                            pembebanan_ref_year: year,
                          });
                        }}
                        placeholder="Masukkan Disini"
                      />
                    </div>
                  </div>
                  <div className="col-1">
                    <label className="text-label">Bulan Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={romanNumeral}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1">
                    <label className="text-label">Tahun Referensi</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={year}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-2">
                    <label className="text-label">Departement</label>
                    <div className="p-inputgroup"></div>
                    <PrimeInput
                      type="text"
                      value={rp_auto.pemasukan_depart}
                      onChange={(e) => {
                        setPemasukanmasuk(e.target.value);
                        updateRp({
                          ...rp_auto,
                          pemasukan_depart: e.target.value,
                        });
                      }}
                      placeholder="Masukkan Disini"
                      disabled
                    />
                  </div>
                  <div className="col-1 text-right">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan53}
                      onChange={(e) => {
                        setResbulan53(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label className=" text-label"></label>
                    <div className="p-inputgroup"></div>
                    <p className="fs-10 text-large">{valueprefix}</p>
                  </div> */}
                  <div className="col-4 text-right">
                    <label className=" text-label">Reset Nomor</label>
                    <div className="p-inputgroup"></div>
                    <InputSwitch
                      checked={resbulan54}
                      onChange={(e) => {
                        setResbulan54(e.value);
                        setAccor({ ...accor, resbulan: e.value });
                      }}
                    />
                  </div>
                  <div className="d-flex col-1 align-items-center">
                    <Button
                      label={tr[localStorage.getItem("language")].update}
                      icon="pi pi-check"
                      onClick={(e) => {
                        addSetup();
                      }}
                      autoFocus
                      loading={loading}
                    />
                  </div>
                </Row>
              </>
            }
          />
        </Col>
      </>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="col-lg-12 col-sm-12 col-xs-12">{renderSettings()}</Col>
      </Row>
    </>
  );
};

export default SetupAutoNumber;
