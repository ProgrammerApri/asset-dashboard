import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import { Calendar } from "primereact/calendar";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Messages } from "primereact/messages";
import { useDispatch, useSelector } from "react-redux";
import { SET_FILTER_DATE } from "src/redux/actions";
import { Checkbox } from "primereact/checkbox";
import { tr } from "src/data/tr";

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

const exceptions = [
  {
    id: null,
    sub_id: null,
    acc_code: ["1.11.0001"],
  },
  {
    id: null,
    sub_id: null,
    acc_code: ["1.12.0001"],
  },
];

const Neraca = () => {
  const [account, setAccount] = useState(null);
  const [trans, setTrans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkDet, setcheck] = useState(true);
  // const [date, setDate] = useState(new Date());
  const date = useSelector((state) => state.neraca.filter_date);
  const dispatch = useDispatch();
  const printPage = useRef(null);
  const toast = useRef(null);
  const dummy = Array.from({ length: 10 });
  const [cp, setCp] = useState("");
  const [category, setCategory] = useState(null);
  const [neracaExc, setNeracaExc] = useState(null);
  const [acc, setAcc] = useState(null);
  const [maxDate, setMaxDate] = useState(new Date().getMonth() + 1);
  const [maxYear, setMaxYear] = useState(new Date().getFullYear() + 1);
  const messages = useRef(null);
  const chunkSize = 25;

  const setDate = (payload) => {
    dispatch({ type: SET_FILTER_DATE, payload: payload });
  };

  useEffect(() => {
    getAccount();
    getSetup();
    getAccDdb();
    getExcept();
    messages.current.clear();
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

        setMaxDate(new Date(Math.max(...trx_date)).getMonth() + 1);
        setMaxYear(new Date(Math.max(...trx_date)).getFullYear());
        if (!date) {
          setDate(new Date(Math.max(...trx_date)));
        }
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
    let balance = true;
    let data = [];
    const umum = {
      value: "",
      kat_code: 0,
      umm_code: 0,
      style: { font: { sz: "14", bold: true } },
      type: "U",
    };
    const detail = {
      value: "",
      kat_code: null,
      umm_code: null,
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
        exp: [],
      });
    });

    category?.pasiva.forEach((el) => {
      datum.push({
        type: "pasiva",
        kat_id: el.id,
        name: el.name,
        sub: [],
        exp: [],
      });
    });

    let month = [];
    acc?.forEach((ej) => {
      console.log(ej.acc_month);
      if (
        date?.getFullYear() === ej.acc_year &&
        date?.getMonth() + 1 >= ej.acc_month
      ) {
        month.push(ej.acc_month);
      }
    });

    console.log("======================");
    console.log(month);

    let acc_exceptions = [];

    neracaExc?.forEach((el) => {
      el.code_akun.forEach((ej) => {
        acc_exceptions.push(ej);
      });
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
              if (ej.acc_year == date?.getFullYear()) {
                if (Math.max(...month) == ej.acc_month) {
                  if (ek.account.acc_code == ej.acc_code?.umm_code) {
                    saldo += ej.acc_akhir;
                  }
                }
              }
            });

            let exception = false;
            if (acc_exceptions?.length) {
              if (acc_exceptions.some((v) => ek.account.acc_code === v)) {
                exception = true;
              }
            }

            el.sub.push({
              acc_code: ek.account.acc_code,
              acc_name: ek.account.acc_name,
              sld_type: ek.account.sld_type,
              kat_code: ek.kategory.id,
              excep: exception,
              saldo: saldo,
              sld: saldo,
            });
            el.exp.push({
              excep: exception,
              sld_type: ek.account.sld_type,
              sld: saldo,
            });
          }
        });
      });
    });

    let totalAktiva = 0;
    let totalPasiva = 0;

    datum.forEach((el) => {
      if (el.type === "aktiva") {
        if (el.sub.length > 0) {
          aktiva.push([{ ...umum, value: el.name }, { value: "" }]);
          let total = 0;

          el?.exp?.forEach((exp) => {
            total += exp.sld_type === "D" ? exp.sld : 0 - exp.sld;
          });
          console.log("exp");
          console.log(total);

          el.sub.forEach((sub) => {
            console.log("sub");
            console.log(sub);

            if (!sub?.excep) {
              aktiva.push([
                {
                  ...detail,
                  value: `${sub.acc_name}`,
                  acc_code: sub.acc_code,
                  kat_code: sub.kat_code,
                },
                {
                  ...saldo,
                  value:
                    sub.saldo !== 0
                      ? `${formatIdr(
                          sub.sld_type === "D" ? sub.saldo : 0 - sub.saldo
                        )}`
                      : 0,
                },
              ]);
            }
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

          el?.exp?.forEach((exp) => {
            total += exp.sld_type === "K" ? exp.sld : 0 - exp.sld;
          });

          el.sub.forEach((sub) => {
            if (!sub?.excep) {
              pasiva.push([
                {
                  ...detail,
                  value: `${sub.acc_name}`,
                  acc_code: sub.acc_code,
                  kat_code: sub.kat_code,
                },
                {
                  ...saldo,
                  value:
                    sub.saldo !== 0
                      ? `${formatIdr(
                          sub.sld_type === "K" ? sub.saldo : 0 - sub.saldo
                        )}`
                      : 0,
                },
              ]);
            }
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
        value: `${formatIdr(totalAktiva)}`,
      },
    ]);
    pasiva.push([
      { ...umum, value: "Liabilities Total" },
      {
        ...lastSaldo,
        value: `${formatIdr(totalPasiva)}`,
      },
    ]);

    console.log("=====Aktiva=====");
    console.log(totalAktiva);
    console.log("=====Pasiva=====");
    console.log(totalPasiva);

    balance = totalAktiva.toFixed(2) === totalPasiva.toFixed(2);
    if (messages?.current?.state?.messages?.length < 1 && !balance) {
      messages?.current?.show({
        severity: "warn",
        summary: "",
        detail: `Balance Sheet is not balance`,
        sticky: true,
      });
    }
    if (messages?.current?.state?.messages?.length > 1 && balance) {
      messages?.current?.clear();
    }

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

    // console.log(pasiva);

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
            title: "",
            width: { wch: 25 },
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
            width: { wch: 25 },
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

    console.log("DATA", data);

    if (excel) {
      return final;
    } else {
      return data;
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between mb-3">
        <div className="col-2 ml-0 mr-0 pl-0">
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
              placeholder={tr[localStorage.getItem("language")]?.pilih_tgl}
              view="month"
              dateFormat="MM-yy"
              maxDate={new Date(maxYear, maxDate - 1, 1)}
            />
          </div>
        </div>
        <div className="col-8 ml-0 mr-0 pl-0 mt-2" hidden>
          <span className="fs-13">
            <b>Tampilkan Detail</b>
          </span>
          <Checkbox
            className="mb-0 ml-2 mt-0"
            inputId="binary"
            checked={checkDet ?? false}
            onChange={(e) => {
              console.log(e.checked);
              setcheck(e.checked);
            }}
          />
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
        <div className="col-12 pt-0 pb-0">
          <Messages ref={messages}></Messages>
        </div>
      </Row>
      <Row className="m-0 justify-content-center">
        {chunk(jsonForExcel(account, false) ?? [], chunkSize).map(
          (val, idx) => {
            return (
              <Card className="ml-1 mr-1 mt-2">
                <Card.Body className="p-0">
                  <CustomeWrapper
                    tittle={"Balance Sheet"}
                    subTittle={`Balance Sheet as of ${formatDate(date)}`}
                    page={idx + 1}
                    body={
                      <DataTable
                        responsiveLayout="scroll"
                        value={loading ? dummy : account ? val : null}
                        className="display w-150 datatable-wrapper"
                        showGridlines
                        dataKey="id"
                        rowHover
                        emptyMessage={tr[localStorage.getItem("language")]?.empty_data}
                      >
                        <Column
                          className={"center-header header-report"}
                          headerClassName={idx > 0 ? "d-none" : ""}
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
                                  `m'${date?.getMonth() + 1}`
                                )}/${btoa(`y'${date?.getFullYear()}`)}/${btoa(
                                  btoa(
                                    JSON.stringify({ kat_id: e[0].acc_code })
                                  )
                                )}`}
                              >
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
                              </Link>
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
                          header=" "
                          field={(e) => e[1].value}
                          className={`text-right border-right header-report`}
                          headerClassName={idx > 0 ? "d-none" : ""}
                          body={(e) =>
                            loading ? (
                              <Skeleton />
                            ) : (
                              <Link
                                to={`/laporan/kartu-buku-besar-ringkasan/${btoa(
                                  `m'${date?.getMonth() + 1}`
                                )}/${btoa(`y'${date?.getFullYear()}`)}/${btoa(
                                  btoa(
                                    JSON.stringify({ kat_id: e[0].acc_code })
                                  )
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
                          className={"center-header header-report"}
                          headerClassName={idx > 0 ? "d-none" : ""}
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
                                  `m'${date?.getMonth() + 1}`
                                )}/${btoa(`y'${date?.getFullYear()}`)}/${btoa(
                                  btoa(
                                    JSON.stringify({ kat_id: e[2].acc_code })
                                  )
                                )}`}
                              >
                                <Row>
                                  <div className={"mr-4"}></div>
                                  <div
                                    className={e[2].type == "D" && "mr-4"}
                                  ></div>
                                  <div
                                    className={
                                      e[2].type == "U" && "font-weight-bold"
                                    }
                                  >
                                    {e[2].value}
                                  </div>
                                </Row>
                              </Link>
                            ) : (
                              <Row>
                                <div className={"mr-4"}></div>
                                <div
                                  className={e[2].type == "D" && "mr-4"}
                                ></div>
                                <div
                                  className={
                                    e[2].type == "U" && "font-weight-bold"
                                  }
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
                          className={`text-right header-report`}
                          headerClassName={idx > 0 ? "d-none" : ""}
                          body={(e) =>
                            loading ? (
                              <Skeleton />
                            ) : (
                              <Link
                                to={`/laporan/kartu-buku-besar-ringkasan/${btoa(
                                  `m'${date?.getMonth() + 1}`
                                )}/${btoa(`y'${date?.getFullYear()}`)}/${btoa(
                                  btoa(
                                    JSON.stringify({ kat_id: e[2].acc_code })
                                  )
                                )}`}
                              >
                                <div
                                  className={e[3].last && "font-weight-bold"}
                                >
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
                        tittle={"Balance Sheet"}
                        subTittle={`Balance Sheet as of ${formatDate(date)}`}
                        page={idx + 1}
                        onComplete={(cp) => setCp(cp)}
                        body={
                          <DataTable
                            responsiveLayout="scroll"
                            value={loading ? dummy : account ? val : null}
                            className="display w-150 datatable-wrapper"
                            showGridlines
                            dataKey="id"
                            rowHover
                            emptyMessage={tr[localStorage.getItem("language")]?.empty_data}
                          >
                            <Column
                              className="center-header header-report"
                              header="Asset"
                              headerClassName={idx > 0 ? "d-none" : ""}
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
                              header=""
                              field={(e) => e[1].value}
                              headerClassName={idx > 0 ? "d-none" : ""}
                              className="text-right border-right center-header header-report"
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
                              className="center-header header-report"
                              header="Liabilities"
                              headerClassName={idx > 0 ? "d-none" : ""}
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
                                    <div
                                      className={e[2].type == "D" && "mr-4"}
                                    ></div>
                                    <div
                                      className={
                                        e[2].type == "U" && "font-weight-bold"
                                      }
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
                              headerClassName={idx > 0 ? "d-none" : ""}
                              className="text-right center-heade header-report"
                              body={(e) =>
                                loading ? (
                                  <Skeleton />
                                ) : (
                                  <div
                                    className={e[3].last && "font-weight-bold"}
                                  >
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
                );
              }
            )}
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default Neraca;
