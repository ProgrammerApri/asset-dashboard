import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast, ast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { Accordion, Badge, Card, Col, Row } from "react-bootstrap";
import { FilterMatchMode } from "primereact/api";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Button, Button as PButton } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Link } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { Dialog } from "primereact/dialog";
import { endpoints, request } from "src/utils";
import { InputSwitch } from "primereact/inputswitch";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_CURRENT_AUTO,
  SET_CURRENT_PROFILE,
  SET_CURRENT_RP_AUTO,
} from "src/redux/actions";
import { tr } from "src/data/tr";
import { Checkbox } from "@material-ui/core";
import PrimeDropdown from "src/jsx/components/PrimeDropdown/PrimeDropdown";
import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
import { InputNumber } from "primereact/inputnumber";
import data from "src/jsx/data";
import { current } from "@reduxjs/toolkit";
import { isVisible } from "@syncfusion/ej2-base";
const def = [
  {
    id: 1,
    format_kode: "",
    prefix: "",
    dep_prefix: false,
    res_bulan: false,
    bulan: false,
    tahun: false,
    number: "",
    modul: "",
    aktif: false,
    status_aktif: false,
  },
];

const Number = () => {
  const [loading, setLoading] = useState(true);
  const [isEdit, setEdit] = useState(false);
  const [rows2, setRows2] = useState(20);
  // const [checked, setChecked] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const toast = useRef(null);
  const [buttonValue, setButtonValue] = useState(false); // Atau nilai default yang sesuai
  const dispatch = useDispatch();
  const [bulan, setBulan] = useState(false); // State untuk nilai Checkbox
  const [filters1, setFilters1] = useState(null);
  const [middle, setMiddle] = useState(new Date().getMonth());
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
  const rpauto = useSelector((state) => state.rpauto.currentauto);
  const [currentRP, setCurrentRP] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const dummy = Array.from({ length: 10 });
  const [accor, setAccor] = useState({
    aktiva: true,
    penjualan: true,
    pembelian: true,
    inventory: true,
    memorial: true,
    bankkeluar: false,
    bankmasuk: true,
    produksi: false,
  });
  const profile = useSelector((state) => state.profile.profile);
  const [pusatBiaya, setPusatBiaya] = useState(null);

  useEffect(() => {
    getAuto();
    getCompany();
    getPusatBiaya();
    initFilters1();
  }, []);

  const postCompany = async (logo, isUpdate = false, data) => {
    let config = {};
    if (isUpdate) {
      if (data) {
        config = {
          ...endpoints.updateCompany,
          endpoint: endpoints.updateCompany.endpoint + currentData.id,
          data: data,
        };
      } else {
        config = {
          ...endpoints.updateCompany,
          endpoint: endpoints.updateCompany.endpoint + currentData.id,
          data: {
            ...currentData,
            cp_logo: logo !== "" ? logo : currentData.cp_logo,
          },
        };
      }
    } else {
      if (data) {
        config = {
          ...endpoints.addCompany,
          data: data,
        };
      } else {
        config = {
          ...endpoints.addCompany,
          data: { ...currentData, cp_logo: logo },
        };
      }
    }
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        getCompany(false);
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

  const getCompany = async (needLoading = true) => {
    if (needLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    const config = endpoints.getCompany;
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        if (
          Object.keys(response.data).length === 0 &&
          response.data.constructor === Object
        ) {
          setCurrentData(data);
        } else {
          setCurrentData(response.data);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getPusatBiaya = async () => {
    const config = {
      ...endpoints.pusatBiaya,
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
        setPusatBiaya(data);
      }
    } catch (error) {}
  };

  const addAuto = async (
    prefix,
    bulan,
    tahun,
    dep_prefix,
    res_bulan,
    number,
    format_kode,
    modul,
    aktif,
    status_aktif
  ) => {
    const config = {
      ...endpoints.addNumber,
      data: {
        prefix: prefix ?? null,
        format_kode: format_kode ?? null,
        dep_prefix: dep_prefix ?? null,
        res_bulan: res_bulan ?? null,
        bulan: bulan ?? null,
        tahun: tahun ?? null,
        number: number ?? null,
        modul: modul ?? null,
        aktif: aktif ? false : true,
        status_aktif: status_aktif ?? false,
      },
    };
    console.log("post");
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setLoading(false);
          toast.current?.show({
            severity: "info",
            summary: tr[localStorage.getItem("language")].berhsl,
            detail: tr[localStorage.getItem("language")].pesan_berhasil,
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        setTimeout(() => {
          // setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: tr[localStorage.getItem("language")].gagal,
            detail: `Kode Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
        setTimeout(() => {
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

  const getAuto = async (isUpdate = false) => {
    const config = {
      ...endpoints.getNumber,
      data: {},
    };

    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCurrentRP(data);
      }
    } catch (error) {}
    if (isUpdate) {
    } else {
      setTimeout(() => {}, 500);
    }
  };

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const onSubmit = (
    prefix,
    bulan,
    tahun,
    dep_prefix,
    res_bulan,
    number,
    format_kode,
    modul,
    aktif,
    status_aktif
  ) => {
    if (isEdit) {
    } else {
      addAuto(
        prefix,
        bulan,
        tahun,
        dep_prefix,
        res_bulan,
        number,
        format_kode,
        modul,
        aktif,
        status_aktif
      );
    }
  };

  const submitUpdate = (data) => {
    if (currentData?.id === 0) {
      postCompany("", data);
    } else {
      postCompany("", true, data);
    }
  };

  const handlePrefixChange = (modul, newPrefix) => {
    setCurrentRP((prevRP) =>
      prevRP.map((el) =>
        el.modul === modul
          ? {
              ...el,
              prefix: newPrefix,
            }
          : el
      )
    );
  };
  const handleDepPrefixChange = (modul, newDepPrefix) => {
    setCurrentRP((prevRP) =>
      prevRP.map((el) =>
        el.modul === modul ? { ...el, dep_prefix: newDepPrefix } : el
      )
    );
  };
  const handleTahunChange = (modul, newTahun) => {
    setCurrentRP((prevRP) =>
      prevRP.map((el) => (el.modul === modul ? { ...el, tahun: newTahun } : el))
    );
  };

  const handleBulanChange = (modul, newBulan) => {
    setCurrentRP((prevRP) =>
      prevRP.map((el) => (el.modul === modul ? { ...el, bulan: newBulan } : el))
    );
  };

  const handleStatusChange = (status_aktif) => {
    setCurrentRP((prevRP) =>
      prevRP.map((el) => ({ ...el, status_aktif: status_aktif }))
    );
  };

  const handleres_bulananChange = (modul, newres_bulanan) => {
    setCurrentRP((prevRP) =>
      prevRP.map((el) =>
        el.modul === modul ? { ...el, res_bulan: newres_bulanan } : el
      )
    );
  };

  const handleNumberChange = (modul, newNumber) => {
    const maxLength = 4;

    const trimmedNumber = newNumber.replace(/^0+/, "");
    const formattedNumber = trimmedNumber.slice(0, maxLength);
    const leadingZeroesCount = Math.max(0, maxLength - formattedNumber.length);
    const leadingZeroes = "0".repeat(leadingZeroesCount);
    const finalNumber = leadingZeroes + formattedNumber;

    setCurrentRP((prevRP) =>
      prevRP.map((el) =>
        el.modul === modul ? { ...el, number: finalNumber } : el
      )
    );
  };

  const dept = (value) => {
    let selected = {};
    pusatBiaya?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const generateCodePreview = (data) => {
    let code = [];
    if (data?.prefix && data?.prefix !== "") {
      code.push(data?.prefix);

      if (data?.bulan) {
        code.push(romanNumeral);
      }
      if (data?.tahun) {
        code.push(year);
      }
      if (data?.dep_prefix) {
        code.push(
          profile.previlage?.dep_id
            ? dept(profile.previlage?.dep_id).ccost_code
            : "DEP-CODE"
        );
      }
    }

    code.push(data?.number);

    return code.join("/");
  };

  const renderInputtext = (label, modul = "") => {
    const isButtonActive = currentRP.some(
      (el) => el.modul === modul && el.aktif
    );
    return (
      <div className="col-12">
        <>
          <label className="text-label" style={{ fontSize: "15px" }}>
            {label}
          </label>
          <div className="d-flex">
            <div className="d-flex flex-column">
              <label>Kode Prefix</label>
              <InputText
                value={currentRP.find((el) => el.modul === modul)?.prefix || ""}
                onChange={(e) => {
                  handlePrefixChange(modul, e.target.value);
                }}
                placeholder="Masukkan Disini"
                disabled={isButtonActive}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
              ></div>
              <div className="d-flex flex-column">
                <InputSwitch
                  checked={currentRP.some(
                    (el) => el.modul === modul && el.bulan
                  )}
                  onChange={(e) => handleBulanChange(modul, e.value)}
                  disabled={isButtonActive}
                />
              </div>
              <div
                style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
              ></div>
              <div className="d-flex flex-column">
                <label>Bulan</label>
                <InputText
                  value={romanNumeral}
                  placeholder="Masukkan Disini"
                  disabled
                  style={{ width: "60px" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
              ></div>
              <div className="d-flex flex-column">
                <InputSwitch
                  checked={currentRP.some(
                    (el) => el.modul === modul && el.tahun
                  )}
                  onChange={(e) => handleTahunChange(modul, e.value)}
                  disabled={isButtonActive}
                />
              </div>
              <div
                style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
              ></div>
              <div className="d-flex flex-column">
                <label>Tahun</label>
                <InputText
                  value={year}
                  placeholder="Masukkan Disini"
                  disabled
                />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
              ></div>
              <div className="d-flex flex-column">
                <label>Nomor</label>
                <InputText
                  value={
                    currentRP.find((el) => el.modul === modul)?.number || ""
                  }
                  onChange={(e) => handleNumberChange(modul, e.target.value)}
                  placeholder="Masukkan Min 4 Digit"
                  type="number"
                  maxLength={4}
                  disabled={isButtonActive}
                />
              </div>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={currentRP.some(
                  (el) => el.modul === modul && el.dep_prefix
                )}
                onChange={(e) => handleDepPrefixChange(modul, e.value)}
                disabled={isButtonActive}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "10px" }}
            ></div>
            <div className="flex-column">
              <label>Reset Number Per Bulan </label>
              <div className="input-switch-container">
                <InputSwitch
                  checked={currentRP.some(
                    (el) => el.modul === modul && el.res_bulan
                  )}
                  onChange={(e) => handleres_bulananChange(modul, e.value)}
                  disabled={isButtonActive}
                  // isVisible={isButtonActive}
                />
              </div>
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "10px" }}
            ></div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                className="d-flex flex-column"
                style={{ display: "flex", marginLeft: "5px" }}
              >
                <label>Format Kode </label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <InputText
                      value={generateCodePreview(
                        currentRP.find((el) => el.modul === modul)
                      )}
                      // onChange={(e) => onchange_format_kode(e.target.value)}
                      placeholder="Penyesuaian kode"
                      style={{ width: "200px", marginRight: "50px" }}
                      disabled // Disable if tahun is not checked
                    />
                    <div style={{ width: "100px" }}>
                      <span
                        className={`badge ${
                          isButtonActive ? "badge-success" : "badge-danger"
                        } light`}
                        style={{
                          fontSize: "10px",
                        }}
                      >
                        {isButtonActive ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </div>
                  </div>

                  <Button
                    label={tr[localStorage.getItem("language")].update}
                    icon="pi pi-check"
                    onClick={() => {
                      const aktifValue = currentRP.some(
                        (el) => el.modul === modul && el.aktif
                      );
                      onSubmit(
                        currentRP.find((el) => el.modul === modul)?.prefix ||
                          "",
                        currentRP.some((el) => el.modul === modul && el.bulan),
                        currentRP.some((el) => el.modul === modul && el.tahun),
                        currentRP.some(
                          (el) => el.modul === modul && el.dep_prefix
                        ),
                        currentRP.some(
                          (el) => el.modul === modul && el.res_bulan
                        ),
                        currentRP.find((el) => el.modul === modul)?.number ||
                          "",
                        generateCodePreview(
                          currentRP.find((el) => el.modul === modul)
                        ),
                        modul,
                        currentRP.some((el) => el.modul === modul && el.aktif),
                        currentRP.some((el) => el.status_aktif)
                      );

                      console.log("kirim 1", aktifValue);
                    }}
                    autoFocus
                    disabled={isButtonActive}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    );
  };

  const renderLoading = (width) => {
    return (
      <div className="d-flex col-12 align-items-center">
        <Skeleton
          className="mr-3"
          height="30px"
          width="50px"
          borderRadius="20px"
        />
        <Skeleton className="mr-3" width={width ? width : "250px"} />
      </div>
    );
  };

  const renderSettings = () => {
    console.log("status", currentData && currentData.rp);
    return (
      <Accordion className="acordion" defaultActiveKey="0">
        <div className="accordion__item" key={1}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${accor.main ? "collapsed" : ""}`}
            onClick={() => {
              setAccor({
                ...accor,
                main: !accor.main,
              });
            }}
          >
            <span className="accordion__header--text">
              Fitur Kode Transaksi Otomatis
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              {loading ? (
                <>
                  {renderLoading()}
                  {renderLoading("400px")}
                </>
              ) : (
                <>
                  <div className="d-flex col-12 align-items-center">
                    <InputSwitch
                      className="mr-3"
                      inputId="email"
                      checked={currentData && currentData.rp}
                      onChange={(e) => {
                        setCurrentData({ ...currentData, rp: e.value });
                        submitUpdate({ ...currentData, rp: e.value });
                      }}
                    />
                    <label className="mr-3 mt-1" htmlFor="email">
                      {"Aktifkan Fitur Kode Transaksi Otomatis "}
                    </label>
                  </div>
                </>
              )}
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };

  // const renderAktiva = (modul) => {
  //   return (
  //     <Accordion className="col-lg-12 col-sm-12 col-xs-12" defaultActiveKey="0">
  //       <div className="accordion__item" key={0}>
  //         <Accordion.Toggle
  //           as={Card.Text}
  //           eventKey="0"
  //           className={`accordion__header ${accor.aktiva ? "collapsed" : ""}`}
  //           onClick={() => {
  //             setAccor((prevAccor) => ({
  //               ...prevAccor,
  //               aktiva: !prevAccor.aktiva,
  //             }));
  //           }}
  //         >
  //           <span className="accordion__header--text">
  //             Mau mengaktifkan Penomoran Otomatis?
  //           </span>
  //           <span className="accordion__header--indicator indicator_bordered"></span>
  //         </Accordion.Toggle>
  //         <Accordion.Collapse eventKey="0">
  //           <div className="accordion__body--text">
  //             <div className="d-flex col-12 align-items-center">
  //               <Col className="mr-0 ml-0 ">
  //                 {renderInput("Aktifkan fitur penomoran otomatis")}

  //                 {/* <InputSwitch
  //                   className="mr-3"
  //                   checked={!currentRP?.some(
  //                     (el) => el.modul === modul && el.status_aktif
  //                   )}
  //                   onChange={(e) => handleStatusChange(modul, e.value)}
  //                 />
  //                 <label className="mr-3 mt-1" htmlFor="email">
  //                   Aktifkan fitur penomoran otomatis
  //                 </label> */}
  //               </Col>
  //             </div>
  //           </div>
  //         </Accordion.Collapse>
  //       </div>
  //     </Accordion>
  //   );
  // };

  const renderPurchase = () => {
    return (
      <Accordion
        className=" col-lg-12 col-sm-12 col-xs-12"
        defaultActiveKey="0"
      >
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">
              Auto Number Purchase
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0 ">
                {renderInputtext("Purchase Request", "rp", false)}
                {renderInputtext("Purchase Order", "po")}
                {renderInputtext("Purchase", "gra")}
                {renderInputtext("Purchase Invoice", "ip")}
                {renderInputtext("Purchase Return", "pr")}
              </Col>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };
  const renderPenjualan = () => {
    return (
      // <Col className="col-lg-12 col-sm-12 col-xs-12">
      <Accordion
        className=" col-lg-12 col-sm-12 col-xs-12"
        defaultActiveKey="1"
      >
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">Auto Number Sale</span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0">
                {renderInputtext("Sale Order (SO)", "so")}
                {renderInputtext("Sale ", "sale")}
                {renderInputtext("Invoice Sale", "is")}
                {renderInputtext("Faktur Sale", "fs")}
                {renderInputtext("Sale Retur", "sr")}
              </Col>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };

  const renderMemorial = () => {
    return (
      // <Col className="col-lg-12 col-sm-12 col-xs-12">
      <Accordion
        className=" col-lg-12 col-sm-12 col-xs-12"
        defaultActiveKey="1"
      >
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">
              Auto Number Memorial
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0">
                {renderInputtext("Memorial", "memo")}
              </Col>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };
  const renderPersediaan = () => {
    return (
      // <Col className="col-lg-12 col-sm-12 col-xs-12">
      <Accordion
        className=" col-lg-12 col-sm-12 col-xs-12"
        defaultActiveKey="1"
      >
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">
              Auto Number Kas / Bank Keluar
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0">
                {renderInputtext("Mutation Beetwen Location", "mutasi")}
                {renderInputtext("Koreksi Persediaan", "koreksi_persediaan")}
                {renderInputtext("Pemakaian Bahan Baku", "pbb")}
                {renderInputtext("Penerimaan Hasil Jadi", "phj")}
              </Col>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };
  const renderKasBankMasuk = () => {
    return (
      // <Col className="col-lg-12 col-sm-12 col-xs-12">
      <Accordion
        className=" col-lg-12 col-sm-12 col-xs-12"
        defaultActiveKey="1"
      >
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">
              Auto Number Kas Bank / Masuk
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0">
                {renderInputtext("Pemasukan Uang Masuk", "pum")}
                {renderInputtext("Pencairan Giro Masuk", "giro_masuk")}
                {renderInputtext("Koreksi Piutang", "koreksi_piutang")}
              </Col>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };
  const renderProduksi = () => {
    return (
      // <Col className="col-lg-12 col-sm-12 col-xs-12">
      <Accordion
        className=" col-lg-12 col-sm-12 col-xs-12"
        defaultActiveKey="1"
      >
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">
              Auto Number Produksi
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0">
                {renderInputtext("Mesin", "mesin")}
                {renderInputtext("Formula", "formula")}
                {renderInputtext("Planning", "plan")}
                {renderInputtext("Batch", "batch")}
                {renderInputtext(
                  "Penerimaan Hasil Jadi Produksi",
                  "penerimaan_hasil_jadi_produksi"
                )}
                {renderInputtext("Pembebanan", "beban")}
              </Col>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };
  const renderKasBankKeluar = () => {
    return (
      // <Col className="col-lg-12 col-sm-12 col-xs-12">
      <Accordion
        className=" col-lg-12 col-sm-12 col-xs-12"
        defaultActiveKey="1"
      >
        <div className="accordion__item" key={0}>
          <Accordion.Toggle
            as={Card.Text}
            eventKey={`0`}
            className={`accordion__header ${
              accor.penjualan ? "collapsed" : ""
            }`}
            onClick={() => {
              setAccor({
                ...accor,
                penjualan: !accor.penjualan,
              });
            }}
          >
            <span className="accordion__header--text">
              Auto Number Kas / Bank Keluar
            </span>
            <span className="accordion__header--indicator indicator_bordered"></span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0">
                {renderInputtext("Pengeluaran", "keluaran")}
                {renderInputtext(
                  "Pencairan Giro Keluar",
                  "pencairan_giro_keluar"
                )}
                {renderInputtext("Koreksi Hutang", "koreksi_hutang")}
                {renderInputtext("Record Activity", "record_activity")}
              </Col>
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  };
  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col className="col-lg-12 col-sm-12 col-xs-12">{renderSettings()}</Col>
        {currentData?.rp == true ? (
          <Col className="col-lg-12 col-sm-12 col-xs-12">
            <div className="row">
              <div className="col-12">
                <>
                  {renderPurchase()}
                  {renderPenjualan()}
                  {renderPersediaan()}
                  {renderMemorial()}
                  {renderKasBankKeluar()}
                  {renderKasBankMasuk()}
                  {renderProduksi()}
                </>
              </div>
            </div>
          </Col>
        ) : (
          <></>
        )}
      </Row>
    </>
  );
};

export default Number;
