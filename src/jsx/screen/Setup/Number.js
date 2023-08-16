import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast, ast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { Accordion, Card, Col, Row } from "react-bootstrap";
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
const def = [
  {
    id: 1,
    format_kode: "",
    prefix: "",
    dep_prefix: false,
    res_bulan: false,
    modul: "",
  },
];

const Number = () => {
  const [loading, setLoading] = useState(true);
  const [isEdit, setEdit] = useState(false);
  const [rows2, setRows2] = useState(20);
  const [year, setYear] = useState(new Date().getFullYear());
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [filters1, setFilters1] = useState(null);
  const [middle, setMiddle] = useState(new Date().getMonth() + 1);
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
  const [current, setCurrent] = useState(def);
  const rpauto = useSelector((state) => state.rpauto.currentauto);
  const [currentRP, setCurrentRP] = useState([]);
  const [currentPO, setCurrentPO] = useState(null);
  const [currentGRA, setCurrentGRA] = useState(def);
  const [currentIP, setCurrentIP] = useState(def);
  const [currentFK, setCurrentFK] = useState(def);
  const dummy = Array.from({ length: 10 });
  const [accor, setAccor] = useState({
    penjualan: true,
    pembelian: true,
    inventory: true,
    memorial: true,
    bankkeluar: false,
    bankmasuk: true,
    produksi: false,
  });

  useEffect(() => {
    getAuto();
    initFilters1();
  }, []);

  const addAuto = async (modul) => {
    const config = {
      ...endpoints.addNumber,
      data: {
        prefix: currentRP.prefix ?? null,
        format_kode: currentRP.format_kode ?? null,
        dep_prefix: currentRP.dep_prefix ?? null,
        res_bulan: currentRP.res_bulan ?? null,
        modul: currentRP.modul ?? null,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setLoading(false);
          // onInput(false);
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
            // detail: `Kode ${current.code} Sudah Digunakan`,
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
        // console.log("data", data);
        setCurrentRP(data);
        // setCurrentPO(data);
      }
    } catch (error) {}
    if (isUpdate) {
    } else {
      setTimeout(() => {}, 500);
    }
  };

  const cekrp = (value) => {
    let selected = {};
    rp?.forEach((element) => {
      if (value === element.name) {
        selected = element;
      }
    });
    return selected;
  };
  const cekpo = (value) => {
    let selected = {};
    po?.forEach((element) => {
      if (value === element.name) {
        selected = element;
      }
    });
    return selected;
  };
  const cekgra = (value) => {
    let selected = {};
    gra?.forEach((element) => {
      if (value === element.name) {
        selected = element;
      }
    });
    return selected;
  };
  const cekip = (value) => {
    let selected = {};
    ip?.forEach((element) => {
      if (value === element.name) {
        selected = element;
      }
    });
    return selected;
  };
  const cekfk = (value) => {
    let selected = {};
    fk?.forEach((element) => {
      if (value === element.name) {
        selected = element;
      }
    });
    return selected;
  };

  const rp = [
    {
      name: `${currentRP.prefix ?? ""}/${romanNumeral}/${year}/${"10001"}`,
      code: 1,
    },
    {
      name: `${currentRP.prefix ?? ""}/${year}/${romanNumeral}/${"10001"}`,
      code: 2,
    },
    {
      name: `${currentRP.prefix ?? ""}/${year}/${"10001"}`,
      code: 3,
    },
  ];
  const po = [
    {
      name: `${current.prefix ?? ""}/${romanNumeral}/${year}/${"10001"}`,
      code: 1,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${romanNumeral}/${"10001"}`,
      code: 2,
    },
    {
      name: `${currentRP.prefix ?? ""}/${year}/${"10001"}`,
      code: 3,
    },
  ];
  const sr = [
    {
      name: `${current.prefix ?? ""}/${romanNumeral}/${year}/${"10001"}`,
      code: 1,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${romanNumeral}/${"10001"}`,
      code: 2,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${"10001"}`,
      code: 3,
    },
  ];
  const fs = [
    {
      name: `${current.prefix ?? ""}/${romanNumeral}/${year}/${"10001"}`,
      code: 1,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${romanNumeral}/${"10001"}`,
      code: 2,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${"10001"}`,
      code: 3,
    },
  ];
  const is = [
    {
      name: `${current.prefix ?? ""}/${romanNumeral}/${year}/${"10001"}`,
      code: 1,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${romanNumeral}/${"10001"}`,
      code: 2,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${"10001"}`,
      code: 3,
    },
  ];
  const sl = [
    {
      name: `${current.prefix ?? ""}/${romanNumeral}/${year}/${"10001"}`,
      code: 1,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${romanNumeral}/${"10001"}`,
      code: 2,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${"10001"}`,
      code: 3,
    },
  ];
  const so = [
    {
      name: `${current.prefix ?? ""}/${romanNumeral}/${year}/${"10001"}`,
      code: 1,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${romanNumeral}/${"10001"}`,
      code: 2,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${"10001"}`,
      code: 3,
    },
  ];
  const fk = [
    {
      name: `${current.prefix ?? ""}/${romanNumeral}/${year}/${"10001"}`,
      code: 1,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${romanNumeral}/${"10001"}`,
      code: 2,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${"10001"}`,
      code: 3,
    },
  ];
  const ip = [
    {
      name: `${current.prefix ?? ""}/${romanNumeral}/${year}/${"10001"}`,
      code: 1,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${romanNumeral}/${"10001"}`,
      code: 2,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${"10001"}`,
      code: 3,
    },
  ];
  const gra = [
    {
      name: `${current.prefix ?? ""}/${romanNumeral}/${year}/${"10001"}`,
      code: 1,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${romanNumeral}/${"10001"}`,
      code: 2,
    },
    {
      name: `${current.prefix ?? ""}/${year}/${"10001"}`,
      code: 3,
    },
  ];

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const onSubmit = () => {
    if (isEdit) {
      // Lakukan sesuatu untuk mode edit
    } else {
      addAuto();
    }
  };

  const handlePrefixChange = (modul, newPrefix) => {
    setCurrentRP((prevRP) => {
      const updatedRP = prevRP.map((el) =>
        el.modul === modul ? { ...el, prefix: newPrefix } : el
      );

      // Check if data with the specified modul is found
      const modulFound = updatedRP.some((el) => el.modul === modul);

      // If data with the specified modul is not found, create a new entry
      if (!modulFound) {
        const newEntry = {
          modul: modul,
          prefix: newPrefix,
          // Set other properties as needed
        };
        updatedRP.push(newEntry);
      }

      return updatedRP;
    });
  };
  console.log("currentRP", currentRP);
  const handleDepPrefixChange = (modul, newDepPrefix) => {
    setCurrentRP((prevRP) =>
      prevRP.map((el) =>
        el.modul === modul ? { ...el, dep_prefix: newDepPrefix } : el
      )
    );
  };

  const handleResBulanChange = (modul, newResBulan) => {
    setCurrentRP((prevRP) =>
      prevRP.map((el) =>
        el.modul === modul ? { ...el, res_bulan: newResBulan } : el
      )
    );
  };
  const handleFormatKodeChange = (modul, newFormatKode) => {
    setCurrentRP((prevRP) =>
      prevRP.map((el) =>
        el.modul === modul ? { ...el, format_kode: newFormatKode } : el
      )
    );
  };

  // const updateAuto = (e) => {
  //   dispatch({
  //     type: SET_CURRENT_AUTO,
  //     payload: e,
  //   });
  // };

  const renderInputtext = (
    label,
    modul = "all",
    value,
    onChange,
    value2,
    onChange2,
    value3,
    onChange3,
    format_kode,
    onchange_format_kode
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className="d-flex">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={
                  value

                  // currentRP.find((el) => el.modul === "RP")?.prefix || ""
                }
                onChange={
                  onChange

                  // (e) => handlePrefixChange("RP", e.target.value)
                }
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={
                  value2

                  // currentRP.some(
                  // (el) => el.modul === "RP" && el.dep_prefix
                  // )
                }
                onChange={
                  onChange2
                  // (e) => handleDepPrefixChange("RP", e.value)
                }
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={
                  value3
                  //   currentRP.some(
                  //   (el) => el.modul === "RP" && el.res_bulan
                  // )
                }
                onChange={onChange3}
              />
            </div>{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={format_kode}
                onChange={onchange_format_kode}
                options={rp}
                optionLabel="name"
                placeholder="Pilih Disini"
                style={{ width: "250px" }}
              ></Dropdown>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={() => {
                  onSubmit(modul);
                }}
                autoFocus
              />
            </div>
          </div>
        </>
      </div>
    );
  };

  const renderInputtext1 = (
    label,
    modul = "PO",
    value,
    onChangePO,
    checkedPO,
    chekedonchangePO,
    checkedPO1,
    chekedonchangePO1,
    expanded = false,
    type = "all"
  ) => {
    // console.log("kode unik", currentRP.prefix);
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={currentRP.find((el) => el.modul === "PO")?.prefix || ""}
                onChange={(e) => handlePrefixChange("PO", e.target.value)}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={currentRP.some(
                  (el) => el.modul === "PO" && el.dep_prefix
                )}
                onChange={(e) => handleDepPrefixChange("PO", e.value)}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={currentRP.some(
                  (el) => el.modul === "PO" && el.res_bulan
                )}
                onChange={(e) => {
                  const new_res_bulan = e.value;
                  setCurrentRP((prevRP) =>
                    prevRP.map((el) =>
                      el.modul === "PO"
                        ? { ...el, res_bulan: new_res_bulan }
                        : el
                    )
                  );
                }}
              />
            </div>{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={currentPO?.format_kode}
                onChange={(e) => {
                  setCurrentPO({ ...currentPO, format_kode: e.target.value });
                }}
                options={gra}
                optionLabel="name"
                placeholder="Pilih Disini"
                style={{ width: "250px" }}
              ></Dropdown>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit();
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };

  const renderInputtext2 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={currentGRA.prefix}
                onChange={(e) => {
                  setCurrentGRA({ ...currentGRA, prefix: e.target.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={currentGRA.dep_prefix}
                onChange={(e) => {
                  setCurrentGRA({ ...currentGRA, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={currentGRA.res_bulan}
                onChange={(e) => {
                  setCurrentGRA({ ...currentGRA, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={currentGRA.format_kode}
                onChange={(e) => {
                  setCurrentGRA({ ...currentGRA, format_kode: e.target.value });
                }}
                options={gra}
                optionLabel="name"
                placeholder="Pilih Disini"
                style={{ width: "250px" }}
              ></Dropdown>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext3 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={currentIP.prefix}
                onChange={(e) => {
                  setCurrentIP({ ...currentIP, prefix: e.target.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={currentIP.dep_prefix}
                onChange={(e) => {
                  setCurrentIP({ ...currentIP, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={currentIP.res_bulan}
                onChange={(e) => {
                  setCurrentIP({ ...currentIP, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={currentIP.format_kode}
                onChange={(e) => {
                  setCurrentIP({ ...currentIP, format_kode: e.target.value });
                }}
                options={ip}
                optionLabel="name"
                placeholder="Pilih Disini"
                style={{ width: "250px" }}
              ></Dropdown>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext4 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={currentFK.prefix}
                onChange={(e) => {
                  setCurrentFK({ ...currentFK, prefix: e.target.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={currentFK.dep_prefix}
                onChange={(e) => {
                  setCurrentFK({ ...currentFK, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={currentFK.res_bulan}
                onChange={(e) => {
                  setCurrentFK({ ...currentFK, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={currentFK.format_kode}
                onChange={(e) => {
                  setCurrentFK({ ...currentFK, format_kode: e.target.value });
                }}
                options={fk}
                optionLabel="name"
                placeholder="Pilih Disini"
                style={{ width: "250px" }}
              ></Dropdown>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul, "rp");
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };

  const renderInputtext5 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={so}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext6 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={sl}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext7 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={is}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext8 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={fs}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext9 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={sr}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext10 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext11 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext12 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext13 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext14 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext15 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext16 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext17 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext18 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext19 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext20 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext21 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext22 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext23 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext24 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext25 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext26 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
  const renderInputtext27 = (
    label,
    modul,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex  ">
            <div className="d-flex flex-column">
              <label>Kode Unik</label>
              <InputText
                value={current.prefix}
                onChange={(e) => {
                  setCurrent({ ...current, prefix: e.value });
                }}
                placeholder="Masukkan Disini"
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Bulan</label>
              <InputText
                value={romanNumeral}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
                style={{ width: "60px" }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Tahun</label>
              <InputText
                value={year}
                // onChange={onChange}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Nomor</label>
              <InputText
                value={"10001"}
                //  onChange={(e) => {
                //    setCurrent({ ...current, res_bulan: e.value });
                //  }}
                placeholder="Masukkan Disini"
                disabled
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Aktifkan Departemen </label>
              <InputSwitch
                checked={current.dep_prefix}
                onChange={(e) => {
                  setCurrent({ ...current, dep_prefix: e.value });
                }}
              />
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Reset Bulan </label>
              <InputSwitch
                checked={current.res_bulan}
                onChange={(e) => {
                  setCurrent({ ...current, res_bulan: e.value });
                }}
                style={{ width: "50px" }}
              ></InputSwitch>
            </div>
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <label>Format Kode </label>
              <Dropdown
                value={current?.format_kode}
                options={rp}
                optionLabel="name"
                onChange={(e) => {
                  setCurrent({ ...current, format_kode: e.value });
                }}
                placeholder="Pilih Disini"
                style={{ width: "200px" }}
              />
            </div>

            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div className="d-flex flex-column">
              <div className="d-flex"></div>
              <label></label>
              <Button
                label={tr[localStorage.getItem("language")].update}
                icon="pi pi-check"
                onClick={(e) => {
                  onSubmit(modul);
                }}
                // // loading={update}
                autoFocus
                // loading={loading}
              />
            </div>
          </div>
        </>
      </div>
    );
  };
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
                {renderInputtext(
                  "Purchase Request",
                  "rp",
                  currentRP.find((el) => el.modul === "RP")?.prefix || "",
                  (e) => handlePrefixChange("RP", e.target.value),
                  currentRP.some((el) => el.modul === "RP" && el.dep_prefix),
                  (e) => handleDepPrefixChange("RP", e.value),
                  currentRP.some((el) => el.modul === "RP" && el.res_bulan),
                  (e) => handleResBulanChange("RP", e.value)
                  // (e) => {
                  //   setCurrentRP({ ...currentRP, prefix: e.target.value });
                  // },
                  // currentRP.dep_prefix,
                  // (i) => {
                  //   setCurrentRP({ ...currentRP, dep_prefix: i.value });
                  // }
                )}
                {renderInputtext(
                  "Purchase Order",
                  "po",
                  currentRP.find((el) => el.modul === "PO")?.prefix || "",
                  (e) => handlePrefixChange("PO", e.target.value),
                  currentRP.some((el) => el.modul === "PO" && el.dep_prefix),
                  (e) => handleDepPrefixChange("PO", e.value),
                  currentRP.some((el) => el.modul === "PO" && el.res_bulan),
                  (e) => handleResBulanChange("PO", e.value)
                )}
                {renderInputtext(
                  "Purchase",
                  "gra",
                  currentRP.find((el) => el.modul === "GRA")?.prefix || "",
                  (e) => handlePrefixChange("GRA", e.target.value),
                  currentRP.some((el) => el.modul === "GRA" && el.dep_prefix),
                  (e) => handleDepPrefixChange("GRA", e.value),
                  currentRP.some((el) => el.modul === "GRA" && el.res_bulan),
                  (e) => handleResBulanChange("GRA", e.value)
                )}
                {renderInputtext(
                  "Purchase Invoice",
                  "ip",
                  currentRP.find((el) => el.modul === "IP")?.prefix || "",
                  (e) => handlePrefixChange("IP", e.target.value),
                  currentRP.some((el) => el.modul === "IP" && el.dep_prefix),
                  (e) => handleDepPrefixChange("IP", e.value),
                  currentRP.some((el) => el.modul === "IP" && el.res_bulan),
                  (e) => handleResBulanChange("IP", e.value)
                )}
                {renderInputtext(
                  "Purchase Return",
                  "fk",
                  currentRP.find((el) => el.modul === "fk")?.prefix || "",
                  (e) => handlePrefixChange("fk", e.target.value),
                  currentRP.some((el) => el.modul === "fk" && el.dep_prefix),
                  (e) => handleDepPrefixChange("fk", e.value),
                  currentRP.some((el) => el.modul === "fk" && el.res_bulan),
                  (e) => handleResBulanChange("fk", e.value),
                  currentRP.some((el) => el.modul === "fk" && el.format_kode),
                  (e) => handleFormatKodeChange("fk", e.value)
                )}

                {/* {renderInputtext2(
                  "Purchase ",
                  "gra",
                  currentGRA,
                  setCurrentGRA
                )}
                {renderInputtext3(
                  "Purchase Invoice",
                  "ip",
                  currentIP,
                  setCurrentIP
                )}
                {renderInputtext4(
                  "Purchase Return",
                  "fk",
                  currentFK,
                  setCurrentFK
                )} */}
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
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={"0"}>
            <div className="accordion__body--text">
              <Col className="mr-0 ml-0">
                {renderInputtext5("Sale Order (SO)", "so")}
                {renderInputtext6("Sale ", "sale")}
                {renderInputtext7("Invoice Sale", "is")}
                {renderInputtext8("Faktur Sale", "fs")}
                {renderInputtext9("Sale Retur", "sr")}
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
                {renderInputtext10("Memorial", "memo")}
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
                {renderInputtext11("Mutation BeetwenLocation", "mutasi")}
                {renderInputtext12("Koreksi Persediaan", "kor_pes")}
                {renderInputtext13("Pemakaian Bahan Baku", "pbb")}
                {renderInputtext14("Penerimaan Hasil Jadi", "phj")}
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
                {renderInputtext15("Pemasukan Uang Masuk", "pum")}
                {renderInputtext16("Pencairan Giro Masuk", "giro")}
                {renderInputtext17("Koreksi Piutang", "kor_piut")}{" "}
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
                {renderInputtext18("Mesin", "mesin")}
                {renderInputtext19("Formula", "for")}
                {renderInputtext20("Planning", "plan")}
                {renderInputtext21("Batch", "batch")}
                {renderInputtext22("Penerimaan Hasil Jadi", "pen_ha_ji")}
                {renderInputtext23("Pembebanan", "beban")}
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
                {renderInputtext24("Pengeluaran", "keluaran")}
                {renderInputtext25("Pencairan Giro Keluar", "pgk")}
                {renderInputtext26("Koreksi Hutang", "kor_hut")}
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
        <Col className="col-lg-12 col-sm-12 col-xs-12">
          {renderPurchase()}
          {renderPenjualan()}
          {renderPersediaan()}
          {renderMemorial()}
          {renderKasBankKeluar()}
          {renderKasBankMasuk()}
          {renderProduksi()}
        </Col>

        <Col className="col-lg-6 col-sm-12 col-xs-12">
          {/* {renderLabaRugi()}
          {renderPembelian()}
          {renderOthers()}
          {renderCosting()}
          {renderSelisihKurs()}
          {renderKas()} */}
        </Col>
      </Row>
    </>
  );
};

export default Number;
