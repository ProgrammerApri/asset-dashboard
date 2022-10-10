import React, { useState, useEffect, useRef } from "react";
import { request, endpoints, EncryptString } from "src/utils";
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
import { sub } from "date-fns";
import { encryptKey } from "src/data/config";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const set = {
  aktiva: [
    {
      name: "Current Asset",
      id: [null],
    },
    {
      name: "Fixed Asset",
      id: [null],
    },
    {
      name: "Depreciation",
      id: [null],
    },
  ],
  pasiva: [
    {
      name: "Payable",
      id: [null],
    },
    {
      name: "Capital",
      id: [null],
    },
  ],
};

const Neraca = () => {
  const [account, setAccount] = useState(null);
  const [trans, setTrans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const printPage = useRef(null);
  const toast = useRef(null);
  const dummy = Array.from({ length: 10 });
  const [cp, setCp] = useState("");
  const [category, setCategory] = useState(null);
  const [acc, setAcc] = useState(null);
  const [maxDate, setMaxDate] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    getAccount();
    getSetup();
    getAccDdb();
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
        let d = data;
        for (var key in d) {
          if (key !== "id" && key !== "cp_id") {
            let val = [];
            if (d[key]) {
              d[key].forEach((el) => {
                if (el) {
                  val.push(Number(el));
                }
              });
              d[key] = val.length > 0 ? val : null;
            } else {
              d[key] = [null];
            }
          }
        }

        setCategory({
          aktiva: [
            {
              name: "Current Asset",
              id: d.cur,
            },
            {
              name: "Fixed Asset",
              id: d.fixed,
            },
            {
              name: "Depreciation",
              id: d.depr,
            },
          ],
          pasiva: [
            {
              name: "Payable",
              id: d.ap,
            },
            {
              name: "Capital",
              id: d.cap,
            },
          ],
        });
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
      ...endpoints.acc_ddb,
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setAcc(data.map((v) => !v.from_closing && v));
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
    } catch (error) {
      console.log(error);
    }
  };

  const getMonthlyDates = (start, count) => {
    var result = [];
    var temp;
    var year = start.getFullYear();
    var month = start.getMonth();
    var startDay = start.getDate();
    for (var i = 0; i < count; i++) {
      temp = new Date(year, month + i, startDay);
      if (temp.getDate() != startDay) temp.setDate(0);
      result.push(temp);
    }
    return result;
  };

  const jsonForExcel = (account, excel = true) => {
    let data = [];
    const umum = {
      value: "",
      kat_code: 0,
      style: { font: { sz: "14", bold: true } },
      type: "U",
    };
    const detail = {
      value: "",
      kat_code: null,
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
      });
    });

    category?.pasiva.forEach((el) => {
      datum.push({
        type: "pasiva",
        kat_id: el.id,
        name: el.name,
        sub: [],
      });
    });

    let month = [];
    acc?.forEach((ej) => {
      if (
        date.getFullYear() === ej.acc_year &&
        date.getMonth() + 1 >= ej.acc_month
      ) {
        month.push(ej.acc_month);
      }
    });

    datum.forEach((el) => {
      el.kat_id.forEach((e) => {
        account?.forEach((ek) => {
          //tipe akun UMUM atau akun DETAIL yang tidak punya induk (umum yang yang langsung detail)
          if (
            (ek.account.dou_type === "U" && ek.kategory.id === e) ||
            (ek.account.dou_type === "D" &&
              ek.kategory.id === e &&
              ek.umm_code === null)
          ) {
            let saldo = 0;

            acc?.forEach((ej) => {
              if (ej.acc_year == date.getFullYear()) {
                if (Math.max(...month) == ej.acc_month) {
                  if (ek.account.acc_code == ej.acc_code?.umm_code) {
                    saldo += ej.acc_akhir;
                  }
                }
              }
            });
            el.sub.push({
              acc_code: ek.account.acc_code,
              acc_name: ek.account.acc_name,
              kat_code: ek.kategory.id,
              saldo: saldo,
            });
          }
        });
      });
    });

    console.log(datum);

    let totalAktiva = 0;
    let totalPasiva = 0;
    datum.forEach((el) => {
      if (el.type === "aktiva") {
        if (el.sub.length > 0) {
          aktiva.push([{ ...umum, value: el.name }, { value: "" }]);
          let total = 0;
          el.sub.forEach((sub) => {
            aktiva.push([
              {
                ...detail,
                value: `           ${sub.acc_name}`,
                kat_code: sub.kat_code,
              },
              {
                ...saldo,
                value: sub.saldo !== 0 ? `${formatIdr(sub.saldo)}` : 0,
              },
            ]);
            total += sub.saldo;
          });
          aktiva.push([
            { ...umum, value: `Total ${el.name}` },
            { ...lastSaldo, value: total !== 0 ? `${formatIdr(total)}` : 0 },
          ]);
          totalAktiva += total;
        }
      } else {
        if (el.sub.length > 0) {
          pasiva.push([{ ...umum, value: el.name }, { value: "" }]);
          let total = 0;
          el.sub.forEach((sub) => {
            pasiva.push([
              {
                ...detail,
                value: `           ${sub.acc_name}`,
                kat_code: sub.kat_code,
              },
              {
                ...saldo,
                value: sub.saldo !== 0 ? `${formatIdr(sub.saldo)}` : 0,
              },
            ]);
            total += sub.saldo;
          });
          pasiva.push([
            { ...umum, value: `Total ${el.name}` },
            { ...lastSaldo, value: total !== 0 ? `${formatIdr(total)}` : 0 },
          ]);
          totalPasiva += total;
        }
      }
    });
    aktiva.push([
      { ...umum, value: "Asset Total" },
      {
        ...lastSaldo,
        value: totalAktiva > 0 ? `${formatIdr(totalAktiva)}` : 0,
      },
    ]);
    pasiva.push([
      { ...umum, value: "Liabilities Total" },
      {
        ...lastSaldo,
        value: totalPasiva > 0 ? `${formatIdr(totalPasiva)}` : 0,
      },
    ]);

    let selisih = totalAktiva - totalPasiva;
    // if (category) {
    //   pasiva[pasiva.length - 4][1].value =
    //     selisih > 0 ? `Rp. ${formatIdr((selisih / 3).toFixed(0))}` : 0;
    //   pasiva[pasiva.length - 3][1].value =
    //     selisih > 0 ? `Rp. ${formatIdr(((selisih * 2) / 3).toFixed(0))}` : 0;
    //   pasiva[pasiva.length - 2][1].value =
    //     selisih > 0 ? `Rp. ${formatIdr(selisih / 3 + (selisih * 2) / 3)}` : 0;
    //   pasiva[pasiva.length - 1][1].value =
    //     selisih > 0
    //       ? `Rp. ${formatIdr(totalPasiva + selisih / 3 + (selisih * 2) / 3)}`
    //       : totalPasiva;
    // }

    console.log(pasiva);

    let defLength =
      aktiva.length > pasiva.length ? aktiva.length : pasiva.length;

    for (let i = 0; i < defLength - 1; i++) {
      let ak = [{ value: "" }, { value: "" }];
      let pas = [{ value: "" }, { value: "" }];
      if (i < aktiva.length - 1) {
        ak = aktiva[i];
      }
      if (i < pasiva.length - 1) {
        pas = pasiva[i];
      }

      data.push([ak[0], ak[1], pas[0], pas[1]]);
    }
    data.push([
      aktiva[aktiva.length - 1][0],
      aktiva[aktiva.length - 1][1],
      pasiva[pasiva.length - 1][0],
      pasiva[pasiva.length - 1][1],
    ]);

    let final = [
      {
        columns: [
          {
            title: "Balance Sheet",
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
      {
        columns: [
          {
            title: "Asset",
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
            title: "",
            width: { wch: 15 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "right", vertical: "center" },
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
            title: "",
            width: { wch: 15 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "right", vertical: "center" },
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

    console.log(final);

    if (excel) {
      return final;
    } else {
      return data;
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between mb-3">
        <div className="col-3 ml-0 mr-0 pl-0">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-calendar" />
            </span>
            <Calendar
              value={date}
              onChange={(e) => {
                console.log(e.value);
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
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`neraca_export_${formatDate(new Date()).replace(
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
                dataSet={account ? jsonForExcel(account, true) : null}
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
        <Card className="ml-1 mr-1 mt-2">
          <Card.Body className="p-0">
            <CustomeWrapper
              tittle={"Balance Sheet"}
              subTittle={`Balance Sheet as of ${formatDate(date)}`}
              page={1}
              body={
                <DataTable
                  responsiveLayout="scroll"
                  value={
                    loading
                      ? dummy
                      : account
                      ? jsonForExcel(account, false)
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
                    header="Asset"
                    style={{
                      minWidth: "8rem",
                    }}
                    field={(e) => e[0].value}
                    body={(e) =>
                      loading ? (
                        <Skeleton />
                      ) : e[0].type == "D" ? (
                        <Link
                          to={`/laporan/kartu-buku-besar-ringkasan/${btoa(
                            `m'${date.getMonth() + 1}`
                          )}/${btoa(`y'${date.getFullYear()}`)}/${btoa(
                            btoa(JSON.stringify({ kat_id: e[0].kat_code }))
                          )}`}
                        >
                          <Row>
                            <div className={e[0].type == "D" && "mr-4"}></div>
                            <div
                              className={e[0].type == "U" && "font-weight-bold"}
                            >
                              {e[0].value}
                            </div>
                          </Row>
                        </Link>
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
                    header=" "
                    field={(e) => e[1].value}
                    className="text-right border-right"
                    body={(e) =>
                      loading ? (
                        <Skeleton />
                      ) : (
                        <Link
                          to={`/laporan/kartu-buku-besar-ringkasan/${btoa(
                            `m'${date.getMonth() + 1}`
                          )}/${btoa(`y'${date.getFullYear()}`)}/${btoa(
                            btoa(JSON.stringify({ kat_id: e[0].kat_code }))
                          )}`}
                        >
                          <div
                            className={e[1].last && "font-weight-bold"}
                          >{`${e[1].value}`}</div>
                        </Link>
                      )
                    }
                  />
                  <Column
                    className="center-header"
                    header="Liabilities"
                    style={{
                      minWidth: "8rem",
                    }}
                    field={(e) => e[2].value}
                    body={(e) =>
                      loading ? (
                        <Skeleton />
                      ) : e[2].type == "D" ? (
                        <Link
                          to={`/laporan/kartu-buku-besar-ringkasan/${btoa(
                            `m'${date.getMonth() + 1}`
                          )}/${btoa(`y'${date.getFullYear()}`)}/${btoa(
                            btoa(JSON.stringify({ kat_id: e[2].kat_code }))
                          )}`}
                        >
                          <Row>
                            <div className={"mr-4"}></div>
                            <div className={e[2].type == "D" && "mr-4"}></div>
                            <div
                              className={e[2].type == "U" && "font-weight-bold"}
                            >
                              {e[2].value}
                            </div>
                          </Row>
                        </Link>
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
                    header=" "
                    field={(e) => e[3].value}
                    className="text-right"
                    body={(e) =>
                      loading ? (
                        <Skeleton />
                      ) : (
                        <Link
                          to={`/laporan/kartu-buku-besar-ringkasan/${btoa(
                            `m'${date.getMonth() + 1}`
                          )}/${btoa(`y'${date.getFullYear()}`)}/${btoa(
                            btoa(JSON.stringify({ kat_id: e[2].kat_code }))
                          )}`}
                        >
                          <div className={e[3].last && "font-weight-bold"}>
                            {e[3].value}
                          </div>
                        </Link>
                      )
                    }
                  />
                </DataTable>
              }
            />
          </Card.Body>
        </Card>
      </Row>
      <Row className="m-0 justify-content-center d-none">
        <Card className="ml-1 mr-1 mt-2">
          <Card.Body className="p-0" ref={printPage}>
            <CustomeWrapper
              tittle={"Balance Sheet"}
              subTittle={`Balance Sheet as of ${formatDate(date)}`}
              page={1}
              onComplete={(cp) => setCp(cp)}
              body={
                <DataTable
                  responsiveLayout="scroll"
                  value={
                    loading
                      ? dummy
                      : account
                      ? jsonForExcel(account, false)
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
                    header="Liabilities"
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
                    field={(e) => e[3].value}
                    className="text-right center-header"
                    body={(e) =>
                      loading ? (
                        <Skeleton />
                      ) : (
                        <div className={e[3].last && "font-weight-bold"}>
                          {e[3].value}
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

export default Neraca;
