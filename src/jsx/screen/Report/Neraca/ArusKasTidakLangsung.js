import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "react-bootstrap";
import { Row, Col, Card } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { id } from "chartjs-plugin-streaming";
import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import { Calendar } from "primereact/calendar";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { el } from "date-fns/locale";
import { set } from "date-fns";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

// const set = {
//   operasi: [
//     {
//       name: "Penyesuaian",
//       id: [null],
//     },
//     {
//       name: "Kenaikan/Penurunan",
//       id: [null],
//     },
//   ],
//   investasi: [
//     {
//       name: "Pembelian Aset",
//       id: [null],
//     },
//     {
//       name: "Penjualan Aset",
//       id: [null],
//     },
//   ],
//   pendanaan: [
//     {
//       name: "Penambahan Dana",
//       id: [null],
//     },
//     {
//       name: "Pengurangan Dana",
//       id: [null],
//     },
//   ],
// };

const ArusKasTidakLangsung = () => {
  const [account, setAccount] = useState(null);
  const [trans, setTrans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const printPage = useRef(null);
  const toast = useRef(null);
  const dummy = Array.from({ length: 10 });
  const [kp, setKp] = useState("");
  const [accSetup, setSetupAcc] = useState(null);
  const [setup, setSetup] = useState(null);
  const [acc, setAcc] = useState(null);
  // const opt = ["+", "-"];
  const [maxDate, setMaxDate] = useState(new Date().getMonth() + 1);
  const chunkSize = 2;

  useEffect(() => {
    getAccount();
    getSetupi();
    // getSetupAcc();
    getAccDdb();
  }, []);

  const getSetupi = async (needLoading = true) => {
    setLoading(needLoading);
    const config = {
      ...endpoints.getCflow,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        let k = data;
        for (var key in k) {
          if (key !== "id" && key !== "cp_id" && key !== "user_id") {
            let val = [];
            if (k[key]) {
              k[key].forEach((el) => {
                if (el) {
                  if (key.includes("opt")) {
                    val.push(el);
                  } else {
                    val.push(Number(el));
                  }
                }
              });
              k[key] = val.length > 0 ? val : null;
            } else {
              k[key] = [null];
            }
          }
        }
        setSetup(k);
      } else {
        setSetup(set);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getSetupAcc = async () => {
    const config = {
      ...endpoints.getSetup,
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setSetupAcc(data);
        let d = data;
        for (var key in d) {
          if (key !== "id" && key !== "cp_id") {
            let val = [];
            if (d[key]) {
              d[key].forEach((el) => {
                if (el) {
                  if (key.includes("opt")) {
                    val.push(el);
                  } else {
                    val.push(Number(el));
                  }
                }
              });
              d[key] = val.length > 0 ? val : null;
            } else {
              d[key] = [null];
            }
          }
        }

        setSetup(d);
      } else {
        setSetup(set);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const checkAcc = (value) => {
    let selected = {};
    account?.forEach((element) => {
      if (Number(value) === element.account.id) {
        selected = element;
      }
    });

    return selected;
  };

  const getAccount = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.account,
      data: {},
    };

    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;

        setAccount(data);
        // getTrans();
      }
    } catch (error) {}
    if (isUpdate) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const getAccDdb = async () => {
    const config = {
      ...endpoints.acc_ddb,
    };
    let response = null;
    try {
      response = await request(null, config);

      if (response.status) {
        const { data } = response;
        setAcc(data);
        let month = [];
        data
          .map((v) => !v.from_closing && v)
          .forEach((ej) => {
            if (
              date.getFullYear() === ej.acc_year &&
              date.getMonth() + 1 >= ej.acc_month
            ) {
              month.push(ej.acc_month);
            }
          });

        setMaxDate(Math.max(...month));
        setDate(new Date(new Date().getFullYear(), Math.max(...month) - 1, 1));
      }
    } catch (error) {}
  };

  const jsonForExcel = (setup, excel = true) => {
    let data = [];
    let month = [];
    acc?.forEach((ej) => {
      if (
        date.getFullYear() === ej.acc_year &&
        date.getMonth() + 1 >= ej.acc_month
      ) {
        month.push(ej.acc_month);
      }
    });

    let t_sld = 0;
    let t_ah = 0;
    let t_labarugi = 0;
    account?.forEach((element) => {
      if (element.kategory.id === 1) {
        acc?.forEach((elem) => {
          if (element?.account?.id === elem?.acc_code?.id) {
            if (elem.acc_year === date.getFullYear()) {
              if (Math.max(...month) == elem.acc_month) {
                t_sld += elem.acc_akhir;
                t_ah += elem.acc_awal;
              }
            }
          }
        });
      }
    });

    acc?.forEach((ej) => {
      if (accSetup?.pnl?.id === ej?.acc_code?.id) {
        if (ej.acc_year === date.getFullYear()) {
          if (Math.max(...month) == ej.acc_month) {
            t_labarugi += ej.acc_akhir;
          }
        }
      }
    });

    let operasi = {
      header: "AKTIVITAS OPERASI",
      data: [
        {
          level: 1,
          col1: "Laba/Rugi Bersih",
          col2: "",
          col3: `${formatIdr(t_labarugi)}`,
        },
        {
          level: 2,
          col1: "Penyesuaian",
          col2: "",
          col3: "",
        },
      ],
    };

    let investasi = {
      header: "AKTIVITAS INVESTASI",
      data: [
        {
          level: 2,
          col1: "Penjualan Aset",
          col2: "",
          col3: "",
        },
      ],
    };

    let pendanaan = {
      header: "AKTIVITAS PENDANAAN",
      data: [
        {
          level: 2,
          col1: "Penambahan Dana",
          col2: "",
          col3: "",
        },
      ],
    };

    let t_adj = 0;
    setup?.adj.forEach((el, i) => {
      let saldo = 0;
      acc?.forEach((ej) => {
        if (checkAcc(el)?.account?.id === ej?.acc_code?.id) {
          if (ej.acc_year === date.getFullYear()) {
            if (Math.max(...month) == ej.acc_month) {
              saldo += ej.acc_akhir;
            }
          }
        }
      });
      if (setup?.adj_opt[i] === "-") {
        saldo = 0 - saldo;
      }
      operasi.data.push({
        level: 3,
        col1: `${checkAcc(el)?.account?.acc_code}-${
          checkAcc(el)?.account?.acc_name
        }`,
        col2: `${formatIdr(saldo)}`,
        col3: "",
      });
      t_adj += saldo;
    });

    operasi.data.push(
      {
        level: 2,
        col1: "Total Penyesuaian",
        col2: "",
        col3: `${formatIdr(t_adj)}`,
      },
      {
        level: 2,
        col1: "Kenaikan Penurunan",
        col2: "",
        col3: "",
      }
    );

    let t_iod_opt = 0;
    let t_iod = 0;
    setup?.iod?.forEach((el, i) => {
      let saldo = 0;

      acc?.forEach((ej) => {
        if (checkAcc(el)?.account?.id === ej?.acc_code?.id) {
          if (checkAcc(el)?.account?.id === ej?.acc_code.id) {
            if (ej.acc_year === date.getFullYear()) {
              if (Math.max(...month) == ej.acc_month) {
                saldo += ej.acc_akhir;
              }
            }
          }
        }
      });
      if (setup?.iod_opt[i] === "-") {
        saldo = 0 - saldo;
      }

      operasi.data.push({
        level: 3,
        col1: `${checkAcc(el)?.account?.acc_code}-${
          checkAcc(el)?.account?.acc_name
        }`,

        col2: `${formatIdr(saldo)}`,
        col3: "",
      });
      t_iod += saldo;
      t_iod_opt += saldo;
    });
    operasi.data.push(
      {
        level: 2,
        col1: "Total Kenaikan Penurunan",
        col2: "",
        col3: `${formatIdr(t_iod_opt)}`,
      },
      {
        level: 1,
        col1: "ARUS KAS DARI AKTIVITAS OPERASI",
        col2: "",
        col3: `${formatIdr(t_labarugi + t_adj + t_iod_opt)}`,
      }
    );

    let t_asset_sell = 0;
    setup?.asset_sell.forEach((el, i) => {
      let saldo = 0;
      acc?.forEach((ej) => {
        if (checkAcc(el)?.account?.id === ej?.acc_code?.id) {
          if (ej.acc_year === date.getFullYear()) {
            if (Math.max(...month) == ej.acc_month) {
              saldo += ej.acc_akhir;
            }
          }
        }
      });
      if (setup?.asset_sell_opt[i] === "-") {
        saldo = 0 - saldo;
      }

      investasi.data.push({
        level: 3,
        col1: `${checkAcc(el)?.account?.acc_code}-${
          checkAcc(el)?.account?.acc_name
        }`,
        col2: `${formatIdr(saldo)}`,
        col3: "",
      });

      t_asset_sell += saldo;
    });

    investasi.data.push(
      {
        level: 2,
        col1: "Total Penjualan Aset",
        col2: "",
        col3: `${formatIdr(t_asset_sell)}`,
      },
      {
        level: 2,
        col1: "Pembelian Aset",
        col2: "",
        col3: "",
      }
    );

    let t_asset_buy = 0;
    setup?.asset_buy.forEach((el, i) => {
      let saldo = 0;
      acc?.forEach((ej) => {
        if (checkAcc(el)?.account?.id === ej?.acc_code?.id) {
          if (ej.acc_year === date.getFullYear()) {
            if (Math.max(...month) == ej.acc_month) {
              saldo += ej.acc_akhir;
            }
          }
        }
      });
      if (setup?.asset_buy_opt[i] === "-") {
        saldo = 0 - saldo;
      }
      investasi.data.push({
        level: 3,
        col1: `${checkAcc(el)?.account?.acc_code}-${
          checkAcc(el)?.account?.acc_name
        }`,
        col2: `${formatIdr(saldo)}`,
        col3: "",
      });

      t_asset_buy += saldo;
    });

    investasi.data.push(
      {
        level: 2,
        col1: "Total Pembelian aset",
        col2: "",
        col3: `${formatIdr(t_asset_buy)}`,
      },
      {
        level: 2,
        col1: "ARUS KAS DARI AKTIVASI INVESTASI",
        col2: "",
        col3: `${formatIdr(t_asset_sell + t_asset_buy)}`,
      }
    );

    let t_in_sld = 0;
    setup?.in_sld.forEach((el, i) => {
      let saldo = 0;
      acc?.forEach((ej) => {
        if (checkAcc(el)?.account?.id === ej?.acc_code?.id) {
          if (ej.acc_year === date.getFullYear()) {
            if (Math.max(...month) == ej.acc_month) {
              saldo += ej.acc_akhir;
            }
          }
        }
      });
      if (setup?.in_sld_opt[i] === "-") {
        saldo = 0 - saldo;
      }
      pendanaan.data.push({
        level: 3,
        col1: `${checkAcc(el)?.account?.acc_code}-${
          checkAcc(el)?.account?.acc_name
        }`,
        col2: `${formatIdr(saldo)}`,
        col3: "",
      });
      t_in_sld += saldo;
    });

    pendanaan.data.push(
      {
        level: 2,
        col1: "Total Penambahan Dana",
        col2: "",
        col3: `${formatIdr(t_in_sld)}`,
      },
      {
        level: 2,
        col1: "Pengurangan Dana",
        col2: "",
        col3: "",
      }
    );

    let t_kenaikan = 0;
    let t_k_p = 0;
    let t_dec_sld = 0;
    setup?.dec_sld.forEach((el, i) => {
      let saldo = 0;
      acc?.forEach((ej) => {
        if (checkAcc(el)?.account?.id === ej?.acc_code?.id) {
          if (ej.acc_year === date.getFullYear()) {
            if (Math.max(...month) == ej.acc_month) {
              saldo += ej.acc_akhir;
            }
          }
        }
      });
      if (setup?.dec_sld_opt[i] === "-") {
        saldo = 0 - saldo;
      }
      pendanaan.data.push({
        level: 3,
        col1: `${checkAcc(el)?.account?.acc_code}-${
          checkAcc(el)?.account?.acc_name
        }`,
        col2: `${formatIdr(saldo)}`,
        col3: "",
      });
      t_dec_sld += saldo;
    });

    t_k_p += t_iod_opt;

    // t_k_p = t_iod + t_iod_opt;

    pendanaan.data.push(
      {
        level: 2,
        col1: "Total Pengurangan Dana",
        col2: "",
        col3: `${formatIdr(t_dec_sld)}`,
      },
      {
        level: 1,
        col1: "ARUS KAS DARI AKTIVITAS PENDANAAN",
        col2: "",
        col3: `${formatIdr(t_in_sld + t_dec_sld)}`,
      },
      {
        level: 2,
        col1: "Kenaikan/Penurunan Kas",
        col2: "",
        col3: `${formatIdr(t_k_p)}`,
      },
      {
        level: 2,
        col1: "Saldo Awal Kas",
        col2: "",
        col3: `${formatIdr(t_sld)}`,
      },
      {
        level: 2,
        col1: "Saldo Akhir Kas",
        col2: "",
        col3: `${formatIdr(t_ah)}`,
      }
    );

    data = [operasi, investasi, pendanaan];

    //            |
    // untuk nampilkan excel v
    let item_op = [];
    let item_inv = [];
    let item_pend = [];

    let final = [
      {
        columns: [
          {
            title: "Laporan Arus Kas Tidak Langsung",
            width: { wch: 50 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
        ],
        data: [
          [
            {
              value: kp,
              style: {
                font: {
                  sz: "14",
                  bold: false,
                },
                alignment: { horizontal: "left", vertical: "center" },
              },
            },
          ],
        ],
      },
      {
        columns: [
          {
            title: `Per ${formatDate(date)}`,
            width: { wch: 50 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
        ],
        data: [[]],
      },
      // Kolom Aktivitas //
      {
        columns: [
          {
            title: "AKTIVITAS OPERASI",
            width: { wch: 40 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "left", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 20 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "center", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 20 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "center", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
        ],
        data: item_op,
      },
      {
        columns: [
          {
            title: "AKTIVITAS INVESTASI",
            width: { wch: 40 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "left", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 20 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "center", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 20 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "center", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
        ],
        data: item_inv,
      },
      {
        columns: [
          {
            title: "AKTIVITAS PENDANAAN",
            width: { wch: 40 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "left", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 20 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "center", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
          {
            title: "",
            width: { wch: 20 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "center", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
        ],
        data: item_pend,
      },
    ];

    operasi.data.forEach((el) => {
      item_op.push([
        {
          value: `${el.col1}`,
          style: {
            font: {
              sz: "14",
              bold: el.level === 1 || el.level === 2,
            },
            alignment: {
              ml: "4",
              horizontal: "left",
              vertical: "center",
            },
          },
        },
        {
          value: `${el.col2}`,
          style: {
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${el.col3}`,
          style: {
            font: {
              sz: "14",
              bold: true,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
      ]);
    });

    investasi.data.forEach((el) => {
      item_inv.push([
        {
          value: `${el.col1}`,
          style: {
            font: {
              sz: "14",
              bold: el.level === 1 || el.level === 2,
            },
            alignment: {
              ml: "4",
              horizontal: "left",
              vertical: "center",
            },
          },
        },
        {
          value: `${el.col2}`,
          style: {
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${el.col3}`,
          style: {
            font: {
              sz: "14",
              bold: true,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
      ]);
    });

    pendanaan.data.forEach((el) => {
      item_pend.push([
        {
          value: `${el.col1}`,
          style: {
            font: {
              sz: "14",
              bold: el.level === 1 || el.level === 2,
            },
            alignment: {
              ml: "4",
              horizontal: "left",
              vertical: "center",
            },
          },
        },
        {
          value: `${el.col2}`,
          style: {
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${el.col3}`,
          style: {
            font: {
              sz: "14",
              bold: true,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
      ]);
    });

    if (excel) {
      return final;
    } else {
      return data;
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between mb-3">
        <div className="col-8 ml-0 mr-0 pl-0">
          <Row className="m-0">
            <div className="col-3 mr-3 p-0">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-calendar" />
                </span>
                <Calendar
                  value={date}
                  onChange={(e) => {
                    setDate(e.value);
                  }}
                  // selectionMode="range"
                  placeholder="Pilih Tanggal"
                  view="month"
                  dateFormat="MM-yy"
                  maxDate={new Date(new Date().getFullYear(), maxDate - 1, 1)}
                />
              </div>
            </div>
          </Row>
        </div>

        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`arus_kas_export_${formatDate(new Date()).replace(
                "/",
                ""
              )}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={setup ? jsonForExcel(setup, true) : null}
                name={"Report"}
              />
            </ExcelFile>
          </div>
          <ReactToPrint
            trigger={() => {
              return (
                <PrimeSingleButton
                  label="PDF"
                  icon={<i class="pi pi-file-pdf px-2"></i>}
                />
              );
            }}
            content={() => printPage.current}
          />
        </Row>
      </div>
    );
  };

  const formatDate = (date) => {
    const m = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    if (typeof date === "string") {
      var d = new Date(`${date}Z`),
        month = d.getMonth(),
        year = d.getFullYear();
    } else {
      var d = new Date(date),
        month = d.getMonth(),
        year = d.getFullYear();
    }

    return [m[month], year].join(" ");
  };

  const formatIdr = (value) => {
    if (value < 0) {
      return `-Rp. ${`${value}`
        .replace("-", "")
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
    }
    return `Rp. ${`${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  };

  let example = [
    {
      header: "AKTIVITAS OPERASI",
      data: [
        {
          level: 1,
          col1: "Laba/Rugi Bersih",
          col2: "",
          col3: "(271132856)",
        },
        {
          level: 2,
          col1: "Penyesuaian",
          col2: "",
          col3: "",
        },
        {
          level: 3,
          col1: "Akumulasi Penyusutan Mesin Produksi",
          col2: "-",
          col3: "",
        },
        {
          level: 3,
          col1: "Akumulasi Penyusutan Kendaraan Bermotor",
          col2: "23750000",
          col3: "",
        },
        {
          level: 3,
          col1: "Sample Data 3",
          col2: "-",
          col3: "",
        },
        {
          level: 2,
          col1: "Total Penyesuaian",
          col2: "",
          col3: "23750000",
        },
        {
          level: 2,
          col1: "Kenaikan Penurunan",
          col2: "",
          col3: "",
        },
        {
          level: 3,
          col1: "Penyisihan Piutang Tidak Tertagih",
          col2: "-",
          col3: "",
        },
        {
          level: 3,
          col1: "Bahan Baku 1",
          col2: "(2100000)",
          col3: "",
        },
        {
          level: 3,
          col1: "Barang Jadi - Hasil Produksi",
          col2: "-",
          col3: "",
        },
        {
          level: 3,
          col1: "Asuransi dibayar di Muka",
          col2: "-",
          col3: "",
        },
        {
          level: 3,
          col1: "    Sewa dibayar di Muka",
          col2: "(13500000)",
          col3: "",
        },
        {
          level: 2,
          col1: "Total Kenaikan Penurunan",
          col2: "",
          col3: "(34700000)",
        },
        {
          level: 1,
          col1: "ARUS KAS DARI AKTIVITAS OPERASI",
          col2: "",
          col3: "(282082856)",
        },
      ],
    },
    {
      header: "AKTIVITAS INVESTASI",
      data: [
        {
          level: 1,
          col1: "Penjualan Aset",
          col2: "",
          col3: "",
        },
        {
          level: 3,
          col1: "",
          col2: "-",
          col3: "",
        },

        {
          level: 1,
          col1: "Total Penjualan Aset",
          col2: "",
          col3: "-",
        },
        {
          level: 1,
          col1: "Pembelian Aset",
          col2: "",
          col3: "",
        },
        {
          level: 3,
          col1: "Inventaris Komputer dan Elektronik",
          col2: "-",
          col3: "",
        },
        {
          level: 3,
          col1: "Akumulasi Penyusutan Kendaraan Bermotor",
          col2: "(335000000)",
          col3: "",
        },

        {
          level: 1,
          col1: "Total Pembelian Aset",
          col2: "",
          col3: "(335000000)",
        },
        {
          level: 1,
          col1: "ARUS KAS DARI AKTIVITAS INVESTASI",
          col2: "",
          col3: "(335000000)",
        },
      ],
    },
    {
      header: "AKTIVITAS PENDANAAN",
      data: [
        {
          level: 1,
          col1: "Penambahan Dana",
          col2: "",
          col3: "",
        },
        {
          level: 3,
          col1: "Utang Usaha Lain-Lain",
          col2: "-",
          col3: "",
        },
        {
          level: 3,
          col1: "Utang Bank BCA",
          col2: "-",
          col3: "",
        },
        {
          level: 3,
          col1: "Modal Pemilik 1",
          col2: "-",
          col3: "",
        },
        {
          level: 1,
          col1: "Total Penambahan Dana",
          col2: "",
          col3: "-",
        },
        {
          level: 1,
          col1: "Pengurangan Dana",
          col2: "",
          col3: "",
        },
        {
          level: 3,
          col1: " Utang Usaha Supplier",
          col2: "-",
          col3: "",
        },
        {
          level: 3,
          col1: "Utang Pembelian Aset",
          col2: "182000000",
          col3: "",
        },

        {
          level: 1,
          col1: "Total Pengurangan Dana",
          col2: "",
          col3: "182000000",
        },

        {
          level: 1,
          col1: "Kenaikan/Penurunan Kas",
          col2: "",
          col3: "(799082856)",
        },
        {
          level: 1,
          col1: "Saldo Awal Kas",
          col2: "",
          col3: "2757500000",
        },
        {
          level: 1,
          col1: "Saldo Akhir Kas",
          col2: "",
          col3: "1958417144",
        },
      ],
    },
  ];

  const chunk = (arr, size) =>
    arr.reduce(
      (acc, e, i) => (
        i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc
      ),
      []
    );

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col>
          <Card className="mb-3">
            <Card.Body>{renderHeader()}</Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="m-0 justify-content-center">
        {chunk(jsonForExcel(setup, false), chunkSize).map((val, idx) => (
          <Card className="ml-1 mr-1 mt-2">
            <Card.Body className="p-0">
              <CustomeWrapper
                tittle={"Arus Kas Tidak Langsung"}
                subTittle={`Arus Kas Tidak Langsung as of ${formatDate(date)}`}
                page={idx + 1}
                body={val.map((v) => (
                  <DataTable
                    responsiveLayout="scroll"
                    value={v.data}
                    className="display w-150 datatable-wrapper"
                    showGridlines
                    dataKey="id"
                    rowHover
                    emptyMessage="Tidak ada data"
                  >
                    <Column
                      className="border-right border-left"
                      header={(e) => (
                        <div className="font-weight-bold">{v.header}</div>
                      )}
                      style={{
                        minWidth: "8rem",
                      }}
                      body={(e) =>
                        loading ? (
                          <Skeleton />
                        ) : (
                          <Row>
                            <div className={e.level === 3 && "mr-4"}></div>

                            <div
                              className={
                                e.level === 1
                                  ? "ml-4 font-weight-bold"
                                  : e.level === 2
                                  ? "ml-6 font-weight-bold"
                                  : "ml-6"
                              }
                            >
                              {e.col1}
                            </div>
                          </Row>
                        )
                      }
                    />
                    <Column
                      header=" "
                      className="text-right border-right"
                      style={{
                        width: "8rem",
                      }}
                      body={(e) =>
                        loading ? (
                          <Skeleton />
                        ) : (
                          <div className={""}>{`${e.col2}`}</div>
                        )
                      }
                    />
                    <Column
                      header=" "
                      className="text-right border-right"
                      style={{
                        width: "10rem",
                      }}
                      body={(e) =>
                        loading ? (
                          <Skeleton />
                        ) : (
                          <div
                            className={"font-weight-bold"}
                          >{`${e.col3}`}</div>
                        )
                      }
                    />
                  </DataTable>
                ))}
              />
            </Card.Body>
          </Card>
        ))}
      </Row>
      <Row className="m-0 justify-content-center d-none">
        <Card className="ml-1 mr-1 mt-2">
          <Card.Body className="p-0" ref={printPage}>
            <CustomeWrapper
              tittle={"Arus Kas Tidak Langsung"}
              subTittle={`Arus Kas Tidak Langsung as of ${formatDate(date)}`}
              page={1}
              onComplete={(kp, ip) => setKp(kp, ip)}
              body={
                <DataTable
                  responsiveLayout="scroll"
                  value={
                    loading
                      ? dummy
                      : account
                      ? jsonForExcel(setup, false).operasi
                      : null
                  }
                  className="display w-150 datatable-wrapper"
                  showGridlines
                  dataKey="id"
                  rowHover
                  emptyMessage="Tidak ada data"
                >
                  <Column
                    className="center-header"
                    header="Aktivitas Operasi"
                    style={{
                      minWidth: "8rem",
                    }}
                    field={(e) => e[0].value}
                    body={(e) =>
                      loading ? (
                        <Skeleton />
                      ) : (
                        <Row>
                          <div className={e[0].type == "D" && "mr-4"}></div>
                          <div
                            className={e[0].type == "U" && "font-weight-bold"}
                          >
                            {e[0].value}
                          </div>
                        </Row>
                      )
                    }
                  />

                  <Column
                    header=""
                    field={(e) => e[1].value}
                    className="text-right border-right center-header"
                    body={(e) =>
                      loading ? (
                        <Skeleton />
                      ) : (
                        <div
                          className={e[1].last && "font-weight-bold"}
                        >{`${e[1].value}`}</div>
                      )
                    }
                  />
                  <Column
                    className="center-header"
                    header="Aktivitas Investasi"
                    style={{
                      minWidth: "8rem",
                    }}
                    field={(e) => e[2].value}
                    body={(e) =>
                      loading ? (
                        <Skeleton />
                      ) : (
                        <Row>
                          <div className={"mr-4"}></div>
                          <div className={e[2].type == "D" && "mr-4"}></div>
                          <div
                            className={e[2].type == "U" && "font-weight-bold"}
                          >
                            {e[2].value}
                          </div>
                        </Row>
                      )
                    }
                  />
                  <Column
                    header=""
                    field={(e) => e[1].value}
                    className="text-right center-header"
                    body={(e) =>
                      loading ? (
                        <Skeleton />
                      ) : (
                        <div className={e[1].last && "font-weight-bold"}>
                          {`${e[2].value}`}
                        </div>
                      )
                    }
                  />
                </DataTable>
              }
            />
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default ArusKasTidakLangsung;
