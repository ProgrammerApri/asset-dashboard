import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
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
import { useDispatch } from "react-redux";
import { SET_CURRENT_PROFILE, SET_CURRENT_RP_AUTO } from "src/redux/actions";
import { tr } from "src/data/tr";

const data = {
  id: 0,
  rp_no_ref: "",
  po_no_ref: "",
  gra_no_ref: "",
  ip_no_ref: "",
  fp_no_ref: "",
  so_no_ref: "",
  sl_no_ref: "",
  ins_no_ref: "",
  fs_no_ref: "",
  sr_no_ref: "",
  mutasi_no_ref: "",
  koreksipersediaan_no_ref: "",
  pemakaian_no_ref: "",
  penerimaan_no_ref: "",
  memorial_no_ref: "",
  pengeluaran_no_ref: "",
  pencairankeluar_no_ref: "",
  koreksihutang_no_ref: "",
  pemasukan_no_ref: "",
  pencairanmasuk_no_ref: "",
  koreksipiutang_no_ref: "",
  mesin_no_ref: "",
  formula_no_ref: "",
  planning_no_ref: "",
  batch_no_ref: "",
  penerimaanjadi_no_ref: "",
  pembebanan_no_ref: "",
  auto_renew: false,
  show_dept: false,
  auto_renew1: false,
  show_dept1: false,
  auto_renew2: false,
  show_dept2: false,
  auto_renew3: false,
  show_dept3: false,
  auto_renew4: false,
  show_dept4: false,
  auto_renew5: false,
  show_dept5: false,
  auto_renew6: false,
  show_dept6: false,
  auto_renew7: false,
  show_dept7: false,
  auto_renew8: false,
  show_dept8: false,
  auto_renew9: false,
  show_dept9: false,
  auto_renew10: false,
  show_dept10: false,
  auto_renew11: false,
  show_dept11: false,
  auto_renew12: false,
  show_dept12: false,
  auto_renew13: false,
  show_dept13: false,
  auto_renew14: false,
  show_dept14: false,
  auto_renew15: false,
  show_dept15: false,
  auto_renew16: false,
  show_dept16: false,
  auto_renew17: false,
  show_dept17: false,
  auto_renew18: false,
  show_dept18: false,
  auto_renew19: false,
  show_dept19: false,
  auto_renew20: false,
  show_dept20: false,
  auto_renew21: false,
  show_dept21: false,
  auto_renew22: false,
  show_dept22: false,
  auto_renew23: false,
  show_dept23: false,
  auto_renew24: false,
  show_dept24: false,
  auto_renew25: false,
  show_dept25: false,
  auto_renew26: false,
  show_dept26: false,
  auto_renew27: false,
  show_dept27: false,
  auto_renew28: false,
  show_dept28: false,
};

const AutoNumber = () => {
  const [loading, setLoading] = useState(true);
  const [isEdit, setEdit] = useState(false);
  const [rows2, setRows2] = useState(20);
  const [year, setYear] = useState(new Date().getFullYear());
  const toast = useRef(null);
  const [filters1, setFilters1] = useState(null);
  const [setup, setSetup] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
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
  const [displayInput, setDisplayInput] = useState(false);
  const [displayDel, setDisplayDel] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [first2, setFirst2] = useState(0);
  const [current, setCurrent] = useState(data);
  const [auto, setAuto] = useState(null);
  const [resbulan, setResbulan] = useState(data);
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

  const addAuto = async () => {
    setLoadingSubmit(true);
    const config = {
      ...endpoints.addAutonumber,
      data: current,
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        setTimeout(() => {
          setLoadingSubmit(false);
          setDisplayInput(false);
          getAuto();
          // getProfile();
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Ditambahkan",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        setLoadingSubmit(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
          life: 3000,
        });
      }, 500);
    }
  };

  const getAuto = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.getAutonumber,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const dispatch = useDispatch();

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const onSubmit = () => {
    if (isEdit) {
      // editMenu(current);
    } else {
      addAuto(data);
    }
  };

  const renderInputtext = (
    label,
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
            <InputText
              value={current?.rp_no_ref ?? ""}
              onChange={(e) => {
                setCurrent({ ...current, rp_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.show_dept}
              onChange={(e) => {
                setCurrent({ ...current, show_dept: e.value });
              }}
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <div></div>
            <InputSwitch
              placeholder="Top"
              tooltip="Reset Tahun"
              tooltipOptions={{ position: "top" }}
              checked={current.auto_renew}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                onSubmit();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext1 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.po_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, po_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept1 ? "TI" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.show_dept1}
              onChange={(e) => {
                setCurrent({ ...current, show_dept1: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew1}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew1: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext2 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.gra_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, gra_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept2 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.show_dept2}
              onChange={(e) => {
                setCurrent({ ...current, show_dept2: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew2}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew2: e.value });
              }}
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext3 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.ip_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, ip_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept3 ? "MANAGER" : ""}
              placeholder="Masukkan Disini"
              disabled
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.show_dept3}
              onChange={(e) => {
                setCurrent({ ...current, show_dept3: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew3}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew3: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext4 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.fp_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, fp_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept4 ? "WAKIL MANAGER" : ""}
              placeholder="Masukkan Disini"
              disabled
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.show_dept4}
              onChange={(e) => {
                setCurrent({ ...current, show_dept4: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew4}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew4: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext5 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.so_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, so_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept5 ? "SUPPORT" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.show_dept5}
              onChange={(e) => {
                setCurrent({ ...current, show_dept5: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew5}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew5: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />{" "}
          </div>
        </>
      </div>
    );
  };
  const renderInputtext6 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.sl_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, sl_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept6 ? "AUDIT" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept6}
              onChange={(e) => {
                setCurrent({ ...current, show_dept6: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew6}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew6: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext7 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.ins_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, ins_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept7 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept7}
              onChange={(e) => {
                setCurrent({ ...current, show_dept7: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew7}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew7: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />{" "}
          </div>
        </>
      </div>
    );
  };
  const renderInputtext8 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.fs_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, fs_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept8 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept8}
              onChange={(e) => {
                setCurrent({ ...current, show_dept8: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew8}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew8: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />{" "}
          </div>
        </>
      </div>
    );
  };
  const renderInputtext9 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.sr_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, sr_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept9 ? "SUPERVISOR9" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept9}
              onChange={(e) => {
                setCurrent({ ...current, show_dept9: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew9}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew9: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />{" "}
          </div>
        </>
      </div>
    );
  };
  const renderInputtext10 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.memorial_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, memorial_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept10 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept10}
              onChange={(e) => {
                setCurrent({ ...current, show_dept10: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew10}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew10: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext11 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.mutasi_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, mutasi_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept11 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept11}
              onChange={(e) => {
                setCurrent({ ...current, show_dept11: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew11}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew11: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext12 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.koreksipersediaan_no_ref}
              onChange={(e) => {
                setCurrent({
                  ...current,
                  koreksipersediaan_no_ref: e.target.value,
                });
              }}
              placeholder="Masukkan Disini"
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept12 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept12}
              onChange={(e) => {
                setCurrent({ ...current, show_dept12: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew12}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew12: e.value });
              }}
            />{" "}
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext13 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.penerimaan_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, penerimaan_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept13 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept13}
              onChange={(e) => {
                setCurrent({ ...current, show_dept13: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew13}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew13: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext141 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.pemakaian_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, pemakaian_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept14 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept14}
              onChange={(e) => {
                setCurrent({ ...current, show_dept14: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew14}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew14: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext14 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.pengeluaran_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, pengeluaran_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept15 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept15}
              onChange={(e) => {
                setCurrent({ ...current, show_dept15: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew15}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew15: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext15 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.pencairankeluar_no_ref}
              onChange={(e) => {
                setCurrent({
                  ...current,
                  pencairankeluar_no_ref: e.target.value,
                });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept16 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept16}
              onChange={(e) => {
                setCurrent({ ...current, show_dept16: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew16}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew16: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext16 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.koreksihutang_no_ref}
              onChange={(e) => {
                setCurrent({
                  ...current,
                  koreksihutang_no_ref: e.target.value,
                });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept17 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept17}
              onChange={(e) => {
                setCurrent({ ...current, show_dept17: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew17}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew17: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext17 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.pemasukan_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, pemasukan_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept18 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept18}
              onChange={(e) => {
                setCurrent({ ...current, show_dept18: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew18}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew18: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext18 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.pencairanmasuk_no_ref}
              onChange={(e) => {
                setCurrent({
                  ...current,
                  pencairanmasuk_no_ref: e.target.value,
                });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept19 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept19}
              onChange={(e) => {
                setCurrent({ ...current, show_dept19: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew19}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew19: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext19 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.koreksipiutang_no_ref}
              onChange={(e) => {
                setCurrent({
                  ...current,
                  koreksipiutang_no_ref: e.target.value,
                });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept20 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept20}
              onChange={(e) => {
                setCurrent({ ...current, show_dept20: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew20}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew20: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext20 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.mesin_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, mesin_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept21 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept21}
              onChange={(e) => {
                setCurrent({ ...current, show_dept21: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew21}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew21: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext21 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.formula_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, formula_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept22 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept22}
              onChange={(e) => {
                setCurrent({ ...current, show_dept22: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew22}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew22: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext22 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.planning_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, planning_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept23 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>

            <InputSwitch
              checked={current.show_dept23}
              onChange={(e) => {
                setCurrent({ ...current, show_dept23: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew23}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew23: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext23 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.batch_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, batch_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept24 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept24}
              onChange={(e) => {
                setCurrent({ ...current, show_dept24: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew24}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew24: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext24 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.penerimaanjadi_no_ref}
              onChange={(e) => {
                setCurrent({
                  ...current,
                  penerimaanjadi_no_ref: e.target.value,
                });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept25 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept25}
              onChange={(e) => {
                setCurrent({ ...current, show_dept25: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew25}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew25: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext25 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.pembebanan_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, pembebanan_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept26 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept26}
              onChange={(e) => {
                setCurrent({ ...current, show_dept26: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew26}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew26: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderInputtext26 = (
    label,
    value,
    onChange,
    expanded = false,
    type = "all"
  ) => {
    return (
      <div className="col-12">
        <>
          <label className="text-label">{label}</label>
          <div className=" d-flex">
            <InputText
              value={current && current.pembebanan_no_ref}
              onChange={(e) => {
                setCurrent({ ...current, pembebanan_no_ref: e.target.value });
              }}
              placeholder="Masukkan Disini"
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={romanNumeral}
              // onChange={onChange}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={year}
              // onChange={year}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputText
              value={current.show_dept27 ? "SUPERVISOR" : ""}
              placeholder="Masukkan Disini"
              disabled
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>{" "}
            <InputSwitch
              checked={current.show_dept27}
              onChange={(e) => {
                setCurrent({ ...current, show_dept27: e.value });
                // updateAuto({ ...current, show_dept: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "5px" }}
            ></div>
            <InputSwitch
              checked={current.auto_renew27}
              onChange={(e) => {
                setCurrent({ ...current, auto_renew27: e.value });
              }}
            />
            <div
              style={{ width: "10px", marginLeft: "5px", marginRight: "50px" }}
            ></div>
            <Button
              label={tr[localStorage.getItem("language")].update}
              icon="pi pi-check"
              onClick={(e) => {
                addAuto();
              }}
              autoFocus
              // loading={loading}
            />
          </div>
        </>
      </div>
    );
  };
  const renderPurchase = () => {
    return (
      // <Col className="col-lg-12 col-sm-12 col-xs-12">
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
                  current?.rp_no_ref,
                  (e) => {
                    setCurrent({ ...current, rp_no_ref: e.target.value });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
                {renderInputtext1("Purchase Order", current?.po_no_ref, (e) => {
                  setCurrent({ ...current, po_no_ref: e.target.value });
                  // submitUpdate({ ...setup, so_no_ref: e.target.value });
                })}
                {renderInputtext2("Purchase ", current?.gra_no_ref, (e) => {
                  setSetup({ ...current, gra_no_ref: e.target.value });
                  // submitUpdate({ ...setup, so_no_ref: e.target.value });
                })}
                {renderInputtext3(
                  "Purchase Invoice",
                  current?.ip_no_ref,
                  (e) => {
                    setCurrent({ ...current, ip_no_ref: e.target.value });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
                {renderInputtext4(
                  "Purchase Return",
                  current?.fp_no_ref,
                  (e) => {
                    setSetup({ ...setup, fp_no_ref: e.target.value });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
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
                {renderInputtext5(
                  "Sale Order (SO)",
                  current?.so_no_ref,
                  (e) => {
                    setSetup({ ...setup, so_no_ref: e.target.value });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}

                {renderInputtext6("Sale ", current?.sl_no_ref, (e) => {
                  setSetup({ ...setup, sl_no_ref: e.target.value });
                  // submitUpdate({ ...setup, so_no_ref: e.target.value });
                })}
                {renderInputtext7("Invoice Sale", current?.ins_no_ref, (e) => {
                  setSetup({ ...setup, ins_no_ref: e.target.value });
                  // submitUpdate({ ...setup, so_no_ref: e.target.value });
                })}
                {renderInputtext8("Faktur Sale", current?.fs_no_ref, (e) => {
                  setSetup({ ...setup, fs_no_ref: e.target.value });
                  // submitUpdate({ ...setup, so_no_ref: e.target.value });
                })}
                {renderInputtext9("Sale Retur", current?.sr_no_ref, (e) => {
                  setSetup({ ...setup, sr_no_ref: e.target.value });
                  // submitUpdate({ ...setup, so_no_ref: e.target.value });
                })}
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
                {renderInputtext10(
                  "Memorial",
                  current?.memorial_no_ref,
                  (e) => {
                    setSetup({ ...setup, memorial_no_ref: e.target.value });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
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
                {renderInputtext11(
                  "Mutasi Between Location",
                  current?.mutasi_no_ref,
                  (e) => {
                    setSetup({ ...setup, mutasi_no_ref: e.target.value });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
                {renderInputtext12(
                  "Koreksi Persediaan",
                  current?.koreksipersediaan_no_ref,
                  (e) => {
                    setSetup({
                      ...setup,
                      koreksipersediaan_no_ref: e.target.value,
                    });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
                {renderInputtext141(
                  "Pemakaian Bahan Baku",
                  current?.pemakaian_no_ref,
                  (e) => {
                    setSetup({ ...setup, pemakaian_no_ref: e.target.value });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
                {renderInputtext13(
                  "Penerimaan Hasil Jadi",
                  current?.penerimaan_no_ref,
                  (e) => {
                    setSetup({ ...setup, penerimaan_no_ref: e.target.value });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
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
                {renderInputtext17(
                  "Pemasukan Uang Masuk",
                  current?.pemasukan_no_ref,
                  (e) => {
                    setSetup({ ...setup, pemasukan_no_ref: e.target.value });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
                {renderInputtext18(
                  "Pencairan Giro Masuk",
                  current?.pencairanmasuk_no_ref,
                  (e) => {
                    setSetup({
                      ...setup,
                      pencairanmasuk_no_ref: e.target.value,
                    });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
                {renderInputtext19(
                  "Koreksi Piutang",
                  current?.koreksipiutang_no_ref,
                  (e) => {
                    setSetup({
                      ...setup,
                      koreksipiutang_no_ref: e.target.value,
                    });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
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
                {renderInputtext20("Mesin", current?.mesin_no_ref, (e) => {
                  setSetup({ ...setup, mesin_no_ref: e.target.value });
                  // submitUpdate({ ...setup, so_no_ref: e.target.value });
                })}
                {renderInputtext21("Formula", current?.formula_no_ref, (e) => {
                  setSetup({ ...setup, formula_no_ref: e.target.value });
                  // submitUpdate({ ...setup, so_no_ref: e.target.value });
                })}
                {renderInputtext22(
                  "Planning",
                  current?.planning_no_ref,
                  (e) => {
                    setSetup({ ...setup, planning_no_ref: e.target.value });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
                {renderInputtext23("Batch", current?.batch_no_ref, (e) => {
                  setSetup({ ...setup, batch_no_ref: e.target.value });
                  // submitUpdate({ ...setup, so_no_ref: e.target.value });
                })}
                {renderInputtext24(
                  "Penerimaan Hasil Jadi",
                  current?.penerimaanjadi_no_ref,
                  (e) => {
                    setSetup({
                      ...setup,
                      penerimaanjadi_no_ref: e.target.value,
                    });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
                {renderInputtext25(
                  "Pembebanan",
                  current?.pembebanan_no_ref,
                  (e) => {
                    setSetup({ ...setup, pembebanan_no_ref: e.target.value });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
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
                {renderInputtext14(
                  "Pengeluaran",
                  current?.pengeluaran_no_ref,
                  (e) => {
                    setSetup({ ...setup, pengeluaran_no_ref: e.target.value });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
                {renderInputtext15(
                  "Pencairan Giro Keluar",
                  current?.pencairankeluar_no_ref,
                  (e) => {
                    setSetup({
                      ...setup,
                      pencairankeluar_no_ref: e.target.value,
                    });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
                {renderInputtext16(
                  "Koreksi Hutang",
                  current?.koreksihutang_no_ref,
                  (e) => {
                    setSetup({
                      ...setup,
                      koreksihutang_no_ref: e.target.value,
                    });
                    // submitUpdate({ ...setup, so_no_ref: e.target.value });
                  }
                )}
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
          {/* {renderLabaRugi()} */}
          {/* {renderPembelian()} */}
          {/* {renderOthers()} */}
          {/* {renderCosting()} */}
          {/* {renderSelisihKurs()} */}
          {/* {renderKas()} */}
        </Col>
      </Row>
    </>
  );
};

export default AutoNumber;
