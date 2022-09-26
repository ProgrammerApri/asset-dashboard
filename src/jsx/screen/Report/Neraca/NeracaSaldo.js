import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";

import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
// import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
// import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import { el } from "date-fns/locale";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Link } from "react-router-dom";
import eachWeekOfInterval from "date-fns/eachWeekOfInterval/index.js";

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

const NeracaSaldo = ({ month, year, kategory }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState(
    year && month ? new Date(year, month - 1, 1) : new Date()
  );
  const [customer, setCustomer] = useState(null);
  const [selectCus, setSelectCus] = useState(null);
  const [account, setAcc] = useState(null);
  const [trans, setTrans] = useState(null);
  const [cp, setCp] = useState("");
  const [acc, setAccDdb] = useState(null);
  const [category, setCategory] = useState(null);
  const [maxDate, setMaxDate] = useState(new Date().getMonth() + 1);
  const chunkSize = 2;

  useEffect(() => {
    getAcc();
    getAccDdb();
    getSetup();
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

  const getAcc = async () => {
    const config = {
      ...endpoints.account,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        // let filt = [];
        // data.forEach((el) => {
        //   if (el.account.dou_type === "D") {
        //     filt.push(el);
        //   }
        // });
        // setAcc(filt);
        setAcc(data);
        // getTrans(data);
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
        setAccDdb(data);
        let month = [];
        data
          .map((v) => !v.from_closing && v)
          .forEach((ej) => {
            if (
              filtDate.getFullYear() === ej.acc_year &&
              filtDate.getMonth() + 1 >= ej.acc_month
            ) {
              month.push(ej.acc_month);
            }
          });

        setMaxDate(Math.max(...month));
        setFiltDate(
          new Date(new Date().getFullYear(), Math.max(...month) - 1, 1)
        );
      }
    } catch (error) {
      console.log(error);
    }
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

  const jsonForExcel = (account, excel = false) => {
    let data = [];

    let month = [];
    acc?.forEach((ej) => {
      if (
        filtDate.getFullYear() === ej.acc_year &&
        filtDate.getMonth() + 1 >= ej.acc_month
      ) {
        month.push(ej.acc_month);
      }
    });

    if (category) {
      for (var key in category) {
        category[key].forEach((e) => {
          let val = [
            {
              acco: "Akun",
              acc_id: "",
              kat: "",
              slda: "Saldo Awal",
              debe: "Mutasi Debit",
              kred: "Mutasi Kredit",
              blce: "Balance",
              type: "header",
            },
          ];
          let total = 0;
          e.id.forEach((ek) => {
            account?.forEach((el) => {
              if (el.account.kat_code === 8) {
                console.log(el);
              }
              let db = 0;
              let kr = 0;
              let sa = 0;
              let bl = 0;
              if (ek === el.account.kat_code && el.account.dou_type === "D") {
                acc?.forEach((element) => {
                  if (element?.acc_code?.id === el?.account?.id) {
                    if (element.acc_year == filtDate.getFullYear()) {
                      if (Math.max(...month) == element.acc_month) {
                        sa += element.acc_awal;
                        db += element.acc_debit;
                        kr += element.acc_kredit;
                        bl += element.acc_akhir;
                      }
                    }
                  }
                });
                val.push({
                  acco: `${el.account?.acc_code}-${el.account?.acc_name}`,
                  acc_id: el.account?.id,
                  kat: el.kategory?.id,
                  slda:
                    el.account.dou_type === "U" && e.name !== "Depreciation"
                      ? ""
                      : `${formatIdr(sa)}`,
                  debe:
                    el.account.dou_type === "U" && e.name !== "Depreciation"
                      ? ""
                      : `${formatIdr(db)}`,
                  kred:
                    el.account.dou_type === "U" && e.name !== "Depreciation"
                      ? ""
                      : `${formatIdr(kr)}`,
                  blce:
                    el.account.dou_type === "U" && e.name !== "Depreciation"
                      ? ""
                      : `${formatIdr(bl)}`,
                  type: "item",
                });
                total += bl;
              }
            });
          });
          if (val.length === 1) {
            e.id.forEach((ek) => {
              account?.forEach((el) => {
                if (el.account.kat_code === 8) {
                  console.log(el);
                }
                let db = 0;
                let kr = 0;
                let sa = 0;
                let bl = 0;
                if (ek === el.account.kat_code && el.account.dou_type === "U") {
                  acc?.forEach((element) => {
                    if (element?.acc_code?.id === el?.account?.id) {
                      if (element.acc_year == filtDate.getFullYear()) {
                        if (Math.max(...month) == element.acc_month) {
                          sa += element.acc_awal;
                          db += element.acc_debit;
                          kr += element.acc_kredit;
                          bl += element.acc_akhir;
                        }
                      }
                    }
                  });
                  val.push({
                    acco: `${el.account?.acc_code}-${el.account?.acc_name}`,
                    acc_id: el.account?.id,
                    kat: el.kategory?.id,
                    slda: `${formatIdr(sa)}`,
                    debe: `${formatIdr(db)}`,
                    kred: `${formatIdr(kr)}`,
                    blce: `${formatIdr(bl)}`,
                    type: "item",
                  });
                  total += bl;
                }
              });
            });
          }
          val.push({
            acco: `Total ${e.name}`,
            acc_id: "",
            kat: "",
            slda: "",
            debe: "",
            kred: "",
            blce: `${formatIdr(total)}`,
            type: "footer",
          });
          data.push({
            acco: `${e.name}`,
            slda: "Saldo Awal",
            debe: "Mutasi Debet",
            kred: "Mutasi Kredit",
            blce: "Balance",
            val: val,
          });
        });
      }
    }

    let final = [
      {
        columns: [
          {
            title: "General Ledger Card",
            width: { wch: 40 },
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
                font: { sz: "14", bold: false },
                alignment: { horizontal: "left", vertical: "center" },
              },
            },
          ],
        ],
      },
      {
        columns: [
          {
            title: `Period ${formatDate(filtDate)}`,
            width: { wch: 40 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
        ],
        data: [[]],
      },
    ];

    data.forEach((el) => {
      let item = [];
      el.val.forEach((ek) => {
        item.push([
          {
            value: `${ek.acco}`,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek.slda}`,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: `${ek.debe}`,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: `${ek.kred}`,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: `${ek.blce}`,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
        ]);
      });

      final.push({
        columns: [
          {
            title: el.acco,
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
              alignment: { horizontal: "right", vertical: "center" },
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
              alignment: { horizontal: "right", vertical: "center" },
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
              alignment: { horizontal: "right", vertical: "center" },
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
              alignment: { horizontal: "right", vertical: "center" },
              fill: {
                paternType: "solid",
                fgColor: { rgb: "F3F3F3" },
              },
            },
          },
        ],
        data: item,
      });
    });

    if (excel) {
      return final;
    } else {
      return data;
    }
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

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-6 ml-0 mr-0 pl-0 pt-0">
          <Row className="mt-0">
            <div className="p-inputgroup col-6">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar" />
              </span>
              <Calendar
                value={filtDate}
                id="range"
                onChange={(e) => {
                  console.log(e.value);
                  setFiltDate(e.value);
                }}
                view="month"
                placeholder="Pilih Tanggal"
                readOnlyInput
                dateFormat="MM yy"
                maxDate={new Date(new Date().getFullYear(), maxDate - 1, 1)}
              />
            </div>
            <div className="col-4">
              {/* <CustomDropdown
                value={customer && selectCus}
                option={customer}
                onChange={(e) => {
                  setSelectCus(e);
                }}
                label={"[customer.cus_name] ([customer.cus_code])"}
                placeholder="Pilih Pelanggan"
              /> */}
            </div>
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`neraca_saldo_report_export_${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={account ? jsonForExcel(account, true) : null}
                name="Neraca Saldo"
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

  const chunk = (arr, size) =>
    arr.reduce(
      (acc, e, i) => (
        i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc
      ),
      []
    );

  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Body>{renderHeader()}</Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="m-0 justify-content-center">
        {chunk(jsonForExcel(account) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0">
                <CustomeWrapper
                  tittle={"Balance Sheet Saldo"}
                  subTittle={`General Ledger Card per ${formatDate(filtDate)}`}
                  onComplete={(cp) => setCp(cp)}
                  page={idx + 1}
                  body={
                    <>
                      {val.map((v) => {
                        return (
                          <DataTable
                            responsiveLayout="scroll"
                            value={v.val}
                            showGridlines
                            dataKey="id"
                            rowHover
                            emptyMessage="Data Tidak Ditemukan"
                          >
                            <Column
                              className="header-center"
                              header={v.acco}
                              style={{ width: "20rem" }}
                              field={(e) => e?.acco}
                              body={(e) => {
                                return e.type === "header" ||
                                  e.type === "footer" ? (
                                  <div className="font-weight-bold">
                                    {e?.acco}
                                  </div>
                                ) : (
                                  <Link
                                    to={`/laporan/kartu-buku-besar-rincian/${btoa(
                                      `m'${filtDate.getMonth() + 1}`
                                    )}/${btoa(
                                      `y'${filtDate.getFullYear()}`
                                    )}/${btoa(`kat'${e.kat}`)}/${btoa(
                                      btoa(JSON.stringify({ acc_id: e.acc_id }))
                                    )}`}
                                  >
                                    <td className="header-center">{e?.acco}</td>
                                  </Link>
                                );
                              }}
                            />
                            <Column
                              className="header-right text-right"
                              header=""
                              style={{ minWidht: "8rem" }}
                              field={(e) => e?.slda}
                              body={(e) => (
                                <div
                                  className={`header-right text-right${
                                    e.type === "header" || e.type === "footer"
                                      ? " font-weight-bold"
                                      : ""
                                  }`}
                                >
                                  {e?.slda}
                                </div>
                              )}
                            />
                            <Column
                              className="header-right text-right"
                              header=""
                              style={{ minWidht: "8rem" }}
                              field={(e) => e?.debe}
                              body={(e) => (
                                <div
                                  className={`header-right text-right${
                                    e.type === "header" || e.type === "footer"
                                      ? " font-weight-bold"
                                      : ""
                                  }`}
                                >
                                  {e?.debe}
                                </div>
                              )}
                            />
                            <Column
                              className="header-right text-right"
                              header=""
                              style={{ minWidht: "10rem" }}
                              field={(e) => e?.kred}
                              body={(e) => (
                                <div
                                  className={`header-right text-right${
                                    e.type === "header" || e.type === "footer"
                                      ? " font-weight-bold"
                                      : ""
                                  }`}
                                >
                                  {e?.kred}
                                </div>
                              )}
                            />
                            <Column
                              className="header-right text-right"
                              header=""
                              style={{ minWidht: "10rem" }}
                              field={(e) => e?.blce}
                              body={(e) => (
                                <div
                                  className={`header-right text-right${
                                    e.type === "header" || e.type === "footer"
                                      ? " font-weight-bold"
                                      : ""
                                  }`}
                                >
                                  {e?.blce}
                                </div>
                              )}
                            />
                          </DataTable>
                        );
                      })}
                    </>
                  }
                />
              </Card.Body>
            </Card>
          );
        })}
      </Row>

      <Row className="m-0 justify-content-center d-none">
        <Card>
          <Card.Body className="p-0" ref={printPage}>
            {chunk(jsonForExcel(account) ?? [], chunkSize)?.map((val, idx) => {
              return (
                <Card className="ml-1 mr-1 mt-2">
                  <Card.Body className="p-0">
                    <CustomeWrapper
                      tittle={"Balance Sheet Saldo"}
                      subTittle={`General Ledger Card per ${formatDate(
                        filtDate
                      )}`}
                      onComplete={(cp) => setCp(cp)}
                      page={idx + 1}
                      body={
                        <>
                          {val.map((v) => {
                            return (
                              <DataTable
                                responsiveLayout="scroll"
                                value={v.val}
                                showGridlines
                                dataKey="id"
                                rowHover
                                emptyMessage="Data Tidak Ditemukan"
                              >
                                <Column
                                  className="header-center"
                                  header={v.acco}
                                  style={{ width: "20rem" }}
                                  field={(e) => e?.acco}
                                  body={(e) => {
                                    return e.type === "header" ||
                                      e.type === "footer" ? (
                                      <div className="font-weight-bold">
                                        {e?.acco}
                                      </div>
                                    ) : (
                                      <td className="header-center">
                                        {e?.acco}
                                      </td>
                                    );
                                  }}
                                />
                                <Column
                                  className="header-right text-right"
                                  header=""
                                  style={{ minWidht: "8rem" }}
                                  field={(e) => e?.slda}
                                  body={(e) => (
                                    <div
                                      className={`header-right text-right${
                                        e.type === "header" ||
                                        e.type === "footer"
                                          ? " font-weight-bold"
                                          : ""
                                      }`}
                                    >
                                      {e?.slda}
                                    </div>
                                  )}
                                />
                                <Column
                                  className="header-right text-right"
                                  header=""
                                  style={{ minWidht: "8rem" }}
                                  field={(e) => e?.debe}
                                  body={(e) => (
                                    <div
                                      className={`header-right text-right${
                                        e.type === "header" ||
                                        e.type === "footer"
                                          ? " font-weight-bold"
                                          : ""
                                      }`}
                                    >
                                      {e?.debe}
                                    </div>
                                  )}
                                />
                                <Column
                                  className="header-right text-right"
                                  header=""
                                  style={{ minWidht: "10rem" }}
                                  field={(e) => e?.kred}
                                  body={(e) => (
                                    <div
                                      className={`header-right text-right${
                                        e.type === "header" ||
                                        e.type === "footer"
                                          ? " font-weight-bold"
                                          : ""
                                      }`}
                                    >
                                      {e?.kred}
                                    </div>
                                  )}
                                />
                                <Column
                                  className="header-right text-right"
                                  header=""
                                  style={{ minWidht: "10rem" }}
                                  field={(e) => e?.blce}
                                  body={(e) => (
                                    <div
                                      className={`header-right text-right${
                                        e.type === "header" ||
                                        e.type === "footer"
                                          ? " font-weight-bold"
                                          : ""
                                      }`}
                                    >
                                      {e?.blce}
                                    </div>
                                  )}
                                />
                              </DataTable>
                            );
                          })}
                        </>
                      }
                    />
                  </Card.Body>
                </Card>
              );
            })}
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default NeracaSaldo;
