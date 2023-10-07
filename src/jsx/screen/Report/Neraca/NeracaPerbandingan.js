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
import { tr } from "src/data/tr";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const set = {
  aktiva: [
    {
      name: "Current Asset",
      id: [1, 2, 3, 4, 5, 6, 8, 9, 10],
    },
    {
      name: "Fixed Asset",
      id: [12],
    },
    {
      name: "Depreciation",
      id: [13],
    },
  ],
  pasiva: [
    {
      name: "Payable",
      id: [14, 15, 16, 17, 18, 19],
    },
    {
      name: "Capital",
      id: [21, 22, 23, 24, 25, 26],
    },
  ],
};

const NeracaPerbandingan = () => {
  const [account, setAccount] = useState(null);
  const [trans, setTrans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month1, setMonth1] = useState(new Date());
  const [month2, setMonth2] = useState(new Date());
  const [cp, setCp] = useState(null);
  const [category, setCategory] = useState(null);
  const [acc, setAcc] = useState(null);
  const [neracaExc, setNeracaExc] = useState(null);
  const printPage = useRef(null);
  const toast = useRef(null);
  const dummy = Array.from({ length: 10 });
  const chunkSize = 18;

  useEffect(() => {
    var d = new Date();
    d.setDate(d.getDate() - 30);
    setMonth2(d);
    getAccount();
    getSetup();
    getAccDdb();
    getExcept();
  }, []);

  const getSetup = async (needLoading = true) => {
    setLoading(needLoading);
    const config = {
      ...endpoints.getNeraca,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        console.log("data neraca");
        console.log(data);
        setCategory({
          aktiva: data.aktiva.map((v) => ({
            name: v.name,
            id: v.category.map((i) => Number(i)),
          })),
          pasiva: data.pasiva.map((v) => ({
            name: v.name,
            id: v.category.map((i) => Number(i)),
          })),
        });
        console.log(category);
      } else {
        setCategory(set);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getAccount = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.account,
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
        setAccount(data);
        getTrans();
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

  const getTrans = async () => {
    const config = {
      ...endpoints.trans,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setTrans(data);
        // jsonForExcel(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAccDdb = async () => {
    const config = {
      ...endpoints.posting,
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setAcc(data.filter((v) => !v.from_closing && !v.transfer));

        let trx_date = [];
        data
          .filter((v) => !v.from_closing)
          .forEach((ej) => {
            trx_date.push(new Date(ej.acc_year, ej.acc_month - 1));
          });

        let maxDate = new Date(
          new Date(Math.max(...trx_date)).getFullYear(),
          new Date(Math.max(...trx_date)).getMonth()
        );
        let maxDate2 = new Date(
          new Date(Math.max(...trx_date)).getFullYear(),
          new Date(Math.max(...trx_date)).getMonth()
        );
        maxDate2.setDate(maxDate2.getDate() - 30);
        setMonth1(maxDate);
        setMonth2(maxDate2);
        // if (!date) {
        //   setDate(new Date(Math.max(...trx_date)));
        // }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getExcept = async () => {
    const config = {
      ...endpoints.getNeracaException,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setNeracaExc(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const jsonForExcel = (account, excel = true) => {
    let data = [];
    const umum = {
      value: "",
      style: { font: { sz: "14", bold: true } },
      type: "U",
    };
    const detail = {
      value: "",
      style: { font: { sz: "14", bold: false } },
      type: "D",
    };
    const saldo = {
      value: 0,
      style: {
        font: { sz: "14", bold: false },
        alignment: { horizontal: "right", vertical: "center" },
      },
    };
    let lastSaldo = {
      value: 0,
      style: {
        font: { sz: "14", bold: true },
        alignment: { horizontal: "right", vertical: "center" },
      },
      last: true,
    };
    let aktiva = [];
    let pasiva = [];
    let datum = [];

    category?.aktiva.forEach((el) => {
      datum.push({
        type: "aktiva",
        kat_id: el.id,
        name: el.name,
        sub: [],
        sub2: [],
      });
    });

    category?.pasiva.forEach((el) => {
      datum.push({
        type: "pasiva",
        kat_id: el.id,
        name: el.name,
        sub: [],
        sub2: [],
      });
    });

    let m1 = [];
    acc?.forEach((ej) => {
      if (
        month1?.getFullYear() === ej.acc_year &&
        month1?.getMonth() + 1 >= ej.acc_month
      ) {
        m1.push(ej.acc_month);
      }
    });

    let m2 = [];
    acc?.forEach((ej) => {
      if (
        month2?.getFullYear() === ej.acc_year &&
        month2?.getMonth() + 1 >= ej.acc_month
      ) {
        m2.push(ej.acc_month);
      }
    });

    datum.forEach((el) => {
      el?.kat_id?.forEach((e) => {
        account?.forEach((ek) => {
          if (
            (ek.account.dou_type === "U" && ek.kategory.id === e) ||
            (ek.account.dou_type === "D" &&
              ek.kategory.id === e &&
              ek.umm_code === null)
          ) {
            let saldo = 0;

            acc?.forEach((ej) => {
              if (ej.acc_year == month2.getFullYear()) {
                if (Math.max(...m2) == ej.acc_month) {
                  if (ek.account.acc_code == ej.acc_code?.umm_code) {
                    saldo += ej.acc_akhir;
                  }
                }
              }
            });
            el.sub.push({
              acc_code: ek.account.acc_code,
              acc_name: ek.account.acc_name,
              sld_type: ek.account.sld_type,
              saldo: saldo,
            });
          }
        });
      });
    });

    datum.forEach((el) => {
      el?.kat_id?.forEach((e) => {
        account?.forEach((ek) => {
          if (
            (ek.account.dou_type === "U" && ek.kategory.id === e) ||
            (ek.account.dou_type === "D" &&
              ek.kategory.id === e &&
              ek.umm_code === null)
          ) {
            let saldo = 0;

            acc?.forEach((ej) => {
              if (ej.acc_year == month1.getFullYear()) {
                if (Math.max(...m1) == ej.acc_month) {
                  if (ek.account.acc_code == ej.acc_code?.umm_code) {
                    saldo += ej.acc_akhir;
                  }
                }
              }
            });
            el.sub2.push({
              acc_code: ek.account.acc_code,
              acc_name: ek.account.acc_name,
              sld_type: ek.account.sld_type,
              saldo: saldo,
            });
          }
        });
      });
    });

    console.log(datum);

    let totalAktiva = 0;
    let totalAktiva2 = 0;
    let totalPasiva = 0;
    let totalPasiva2 = 0;
    datum.forEach((el) => {
      if (el.type === "aktiva") {
        if (el.sub.length > 0) {
          aktiva.push([
            { ...umum, value: el.name },
            { value: "" },
            { value: "" },
          ]);
          let total = 0;
          let total2 = 0;
          el.sub.forEach((sub, i) => {
            aktiva.push([
              { ...detail, value: `${sub.acc_name}` },
              {
                ...saldo,
                value:
                  sub.saldo !== 0
                    ? `${formatIdr(
                        sub.sld_type === "D" ? sub.saldo : 0 - sub.saldo
                      )}`
                    : 0,
              },
              {
                ...saldo,
                value:
                  el.sub2[i].saldo !== 0
                    ? `${formatIdr(
                        el?.sub[i].sld_type === "D"
                          ? el.sub2[i].saldo
                          : 0 - el.sub2[i].saldo
                      )}`
                    : 0,
              },
            ]);
            total += sub.saldo;
            total2 += el.sub2[i].saldo;
          });
          aktiva.push([
            { ...umum, value: `Total ${el.name}` },
            { ...lastSaldo, value: total !== 0 ? `${formatIdr(total)}` : 0 },
            {
              ...lastSaldo,
              value: total2 !== 0 ? `${formatIdr(total2)}` : 0,
            },
          ]);
          totalAktiva += total;
          totalAktiva2 += total2;
        }
      } else {
        if (el.sub.length > 0) {
          pasiva.push([
            { ...umum, value: el.name },
            { value: "" },
            { value: "" },
          ]);
          let total = 0;
          let total2 = 0;
          el.sub.forEach((sub, i) => {
            pasiva.push([
              { ...detail, value: `${sub.acc_name}` },
              {
                ...saldo,
                value:
                  sub.saldo !== 0
                    ? `${formatIdr(
                        sub.sld_type === "K" ? sub.saldo : 0 - sub.saldo
                      )}`
                    : 0,
              },
              {
                ...saldo,
                value:
                  el.sub2[i].saldo !== 0
                    ? `${formatIdr(
                        el.sub2[i].sld_type === "K"
                          ? el.sub2[i].saldo
                          : 0 - el.sub2[i].saldo
                      )}`
                    : 0,
              },
            ]);
            total += sub.saldo;
            total2 += el.sub2[i].saldo;
          });
          pasiva.push([
            { ...umum, value: `Total ${el.name}` },
            { ...lastSaldo, value: total !== 0 ? `${formatIdr(total)}` : 0 },
            {
              ...lastSaldo,
              value: total2 !== 0 ? `${formatIdr(total2)}` : 0,
            },
          ]);
          totalPasiva += total;
          totalPasiva2 += total2;
        }
      }
    });
    aktiva.push([
      { ...umum, value: "Asset Total" },
      {
        ...lastSaldo,
        value: totalAktiva !== 0 ? `${formatIdr(totalAktiva)}` : 0,
      },
      {
        ...lastSaldo,
        value: totalAktiva2 !== 0 ? `${formatIdr(totalAktiva2)}` : 0,
      },
    ]);
    pasiva.push([
      { ...umum, value: "Liabilities Total" },
      {
        ...lastSaldo,
        value: totalPasiva !== 0 ? `${formatIdr(totalPasiva)}` : 0,
      },
      {
        ...lastSaldo,
        value: totalPasiva2 !== 0 ? `${formatIdr(totalPasiva2)}` : 0,
      },
    ]);

    // if (category) {
    //   let selisih = totalAktiva - totalPasiva;
    //   pasiva[pasiva.length - 4][1].value =
    //     selisih > 0 ? `${formatIdr((selisih / 3).toFixed(0))}` : 0;
    //   pasiva[pasiva.length - 3][1].value =
    //     selisih > 0 ? `${formatIdr(((selisih * 2) / 3).toFixed(0))}` : 0;
    //   pasiva[pasiva.length - 2][1].value =
    //     selisih > 0 ? `${formatIdr(selisih / 3 + (selisih * 2) / 3)}` : 0;
    //   pasiva[pasiva.length - 1][1].value =
    //     selisih > 0
    //       ? `${formatIdr(totalPasiva + selisih / 3 + (selisih * 2) / 3)}`
    //       : totalPasiva;

    //   let selisih2 = totalAktiva2 - totalPasiva2;
    //   pasiva[pasiva.length - 4][2].value =
    //     selisih2 > 0 ? `${formatIdr((selisih2 / 3).toFixed(0))}` : 0;
    //   pasiva[pasiva.length - 3][2].value =
    //     selisih2 > 0 ? `${formatIdr(((selisih2 * 2) / 3).toFixed(0))}` : 0;
    //   pasiva[pasiva.length - 2][2].value =
    //     selisih2 > 0
    //       ? `${formatIdr(selisih2 / 3 + (selisih2 * 2) / 3)}`
    //       : 0;
    //   pasiva[pasiva.length - 1][2].value =
    //     selisih2 > 0
    //       ? `${formatIdr(totalPasiva2 + selisih2 / 3 + (selisih2 * 2) / 3)}`
    //       : totalPasiva2;
    // }

    // console.log(pasiva);

    let defLength =
      aktiva.length > pasiva.length ? aktiva.length : pasiva.length;

    for (let i = 0; i < defLength - 1; i++) {
      let ak = [{ value: "" }, { value: "" }, { value: "" }];
      let pas = [{ value: "" }, { value: "" }, { value: "" }];
      if (i < aktiva.length - 1) {
        ak = aktiva[i];
      }
      if (i < pasiva.length - 1) {
        pas = pasiva[i];
      }

      data.push([ak[0], ak[1], ak[2], pas[0], pas[1], pas[2]]);
    }
    data.push([
      aktiva[aktiva.length - 1][0],
      aktiva[aktiva.length - 1][1],
      aktiva[aktiva.length - 1][2],
      pasiva[pasiva.length - 1][0],
      pasiva[pasiva.length - 1][1],
      pasiva[pasiva.length - 1][2],
    ]);

    let final = [
      {
        columns: [
          {
            title: "Balance Sheet Comparison",
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
              value: cp,
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
            title: `${formatDate(month2)} and ${formatDate(month1)}`,
            width: { wch: 50 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
        ],
        data: [[]],
      },
      {
        columns: [
          {
            title: tr[localStorage.getItem("language")]?.aset,
            width: { wch: 50 },
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
            title: formatDate(month2),
            width: { wch: 15 },
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
            title: formatDate(month1),
            width: { wch: 15 },
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
            title: "Liabilities",
            width: { wch: 50 },
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
            title: formatDate(month2),
            width: { wch: 15 },
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
            title: formatDate(month1),
            width: { wch: 15 },
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
        data: data,
      },
    ];

    if (excel) {
      return final;
    } else {
      return data;
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between mb-3">
        <Row className="m-0">
          <div className="col-6 ml-0 mr-0 pl-0">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar" />
              </span>
              <Calendar
                value={month2}
                onChange={(e) => {
                  console.log(e.value);
                  setMonth2(e.value);
                }}
                view="month"
                placeholder={"Pilih Bulan"}
                dateFormat="MM yy"
              />
            </div>
          </div>
          <div className="col-6 ml-0 mr-0 pl-0">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar" />
              </span>
              <Calendar
                value={month1}
                onChange={(e) => {
                  console.log(e.value);
                  setMonth1(e.value);
                }}
                view="month"
                placeholder={"Pilih Bulan"}
                dateFormat="MM yy"
              />
            </div>
          </div>
        </Row>
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`balancesheet_comparison_export_${formatDate(
                new Date()
              ).replaceAll("/", "")}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={account ? jsonForExcel(account, true) : null}
                name={`Report`}
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
      return `(${`${value?.toFixed(2)}`
        .replace("-", "")
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")})`;
    }
    return `${`${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  };

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
        {chunk(jsonForExcel(account, false) ?? [], chunkSize).map(
          (val, idx) => {
            return (
              <div key={idx} className={"shadow p-0 mb-4 col-12"}>
                <CustomeWrapper
                  tittle={"Balance Sheet Comparison"}
                  subTittle={`Balance Sheet Comparison ${formatDate(
                    month2
                  )} and ${formatDate(month1)}`}
                  onComplete={(cp) => setCp(cp)}
                  page={idx + 1}
                  horizontal
                  viewOnly
                  body={
                    <DataTable
                      responsiveLayout="scroll"
                      value={loading ? dummy : val}
                      className="display w-150 datatable-wrapper"
                      showGridlines
                      dataKey="id"
                      rowHover
                      emptyMessage={
                        tr[localStorage.getItem("language")]?.empty_data
                      }
                    >
                      <Column
                        className="center-header header-report border-left border-right"
                        headerClassName={idx > 0 ? "d-none" : ""}
                        header="Asset"
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
                                className={
                                  e[0].type == "U" && "font-weight-bold"
                                }
                              >
                                {e[0].value}
                              </div>
                            </Row>
                          )
                        }
                      />
                      <Column
                        header={formatDate(month2)}
                        headerClassName={idx > 0 ? "d-none" : ""}
                        field={(e) => e[1].value}
                        className="center-header header-report text-right border-right"
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
                        header={formatDate(month1)}
                        headerClassName={idx > 0 ? "d-none" : ""}
                        field={(e) => e[2].value}
                        className="center-header header-report text-right border-right"
                        body={(e) =>
                          loading ? (
                            <Skeleton />
                          ) : (
                            <div
                              className={e[2].last && "font-weight-bold"}
                            >{`${e[2].value}`}</div>
                          )
                        }
                      />
                      <Column
                        className="center-header header-report border-right"
                        header="Liabilities"
                        headerClassName={idx > 0 ? "d-none" : ""}
                        style={{
                          minWidth: "8rem",
                        }}
                        field={(e) => e[3].value}
                        body={(e) =>
                          loading ? (
                            <Skeleton />
                          ) : (
                            <Row>
                              <div className={"mr-4"}></div>
                              <div className={e[3].type == "D" && "mr-4"}></div>
                              <div
                                className={
                                  e[3].type == "U" && "font-weight-bold"
                                }
                              >
                                {e[3].value}
                              </div>
                            </Row>
                          )
                        }
                      />
                      <Column
                        header={formatDate(month2)}
                        field={(e) => e[4].value}
                        headerClassName={idx > 0 ? "d-none" : ""}
                        className="center-header header-report text-right border-right"
                        body={(e) =>
                          loading ? (
                            <Skeleton />
                          ) : (
                            <div className={e[4].last && "font-weight-bold"}>
                              {e[4].value}
                            </div>
                          )
                        }
                      />
                      <Column
                        header={formatDate(month1)}
                        headerClassName={idx > 0 ? "d-none" : ""}
                        field={(e) => e[5].value}
                        className="center-header header-report text-right border-right"
                        body={(e) =>
                          loading ? (
                            <Skeleton />
                          ) : (
                            <div className={e[5].last && "font-weight-bold"}>
                              {e[5].value}
                            </div>
                          )
                        }
                      />
                    </DataTable>
                  }
                />
              </div>
            );
          }
        )}
      </Row>
      <Row className="m-0 justify-content-center d-none">
        <Card className="ml-1 mr-1 mt-2">
          <Card.Body className="p-0" ref={printPage}>
            {chunk(jsonForExcel(account, false) ?? [], chunkSize).map(
              (val, idx) => {
                return (
                  <Card className="ml-1 mr-1 mt-2">
                    <Card.Body className="p-0">
                      <CustomeWrapper
                        tittle={"Balance Sheet Comparison"}
                        subTittle={`Balance Sheet Comparison ${formatDate(
                          month2
                        )} and ${formatDate(month1)}`}
                        onComplete={(cp) => setCp(cp)}
                        page={idx + 1}
                        horizontal
                        body={
                          <DataTable
                            responsiveLayout="scroll"
                            value={loading ? dummy : val}
                            className="display w-150 datatable-wrapper"
                            showGridlines
                            dataKey="id"
                            rowHover
                            emptyMessage={
                              tr[localStorage.getItem("language")]?.empty_data
                            }
                          >
                            <Column
                              className="center-header header-report border-left border-right"
                              headerClassName={idx > 0 ? "d-none" : ""}
                              header="Asset"
                              style={{
                                minWidth: "8rem",
                              }}
                              field={(e) => e[0].value}
                              body={(e) =>
                                loading ? (
                                  <Skeleton />
                                ) : (
                                  <Row>
                                    <div
                                      className={e[0].type == "D" && "mr-4"}
                                    ></div>
                                    <div
                                      className={
                                        e[0].type == "U" && "font-weight-bold"
                                      }
                                    >
                                      {e[0].value}
                                    </div>
                                  </Row>
                                )
                              }
                            />
                            <Column
                              header={formatDate(month2)}
                              headerClassName={idx > 0 ? "d-none" : ""}
                              field={(e) => e[1].value}
                              className="center-header header-report text-right border-right"
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
                              header={formatDate(month1)}
                              headerClassName={idx > 0 ? "d-none" : ""}
                              field={(e) => e[2].value}
                              className="center-header header-report text-right border-right"
                              body={(e) =>
                                loading ? (
                                  <Skeleton />
                                ) : (
                                  <div
                                    className={e[2].last && "font-weight-bold"}
                                  >{`${e[2].value}`}</div>
                                )
                              }
                            />
                            <Column
                              className="center-header header-report border-right"
                              header="Liabilities"
                              headerClassName={idx > 0 ? "d-none" : ""}
                              style={{
                                minWidth: "8rem",
                              }}
                              field={(e) => e[3].value}
                              body={(e) =>
                                loading ? (
                                  <Skeleton />
                                ) : (
                                  <Row>
                                    <div className={"mr-4"}></div>
                                    <div
                                      className={e[3].type == "D" && "mr-4"}
                                    ></div>
                                    <div
                                      className={
                                        e[3].type == "U" && "font-weight-bold"
                                      }
                                    >
                                      {e[3].value}
                                    </div>
                                  </Row>
                                )
                              }
                            />
                            <Column
                              header={formatDate(month2)}
                              field={(e) => e[4].value}
                              headerClassName={idx > 0 ? "d-none" : ""}
                              className="center-header header-report text-right border-right"
                              body={(e) =>
                                loading ? (
                                  <Skeleton />
                                ) : (
                                  <div
                                    className={e[4].last && "font-weight-bold"}
                                  >
                                    {e[4].value}
                                  </div>
                                )
                              }
                            />
                            <Column
                              header={formatDate(month1)}
                              headerClassName={idx > 0 ? "d-none" : ""}
                              field={(e) => e[5].value}
                              className="center-header header-report text-right border-right"
                              body={(e) =>
                                loading ? (
                                  <Skeleton />
                                ) : (
                                  <div
                                    className={e[5].last && "font-weight-bold"}
                                  >
                                    {e[5].value}
                                  </div>
                                )
                              }
                            />
                          </DataTable>
                        }
                      />
                    </Card.Body>
                  </Card>
                );
              }
            )}
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default NeracaPerbandingan;
