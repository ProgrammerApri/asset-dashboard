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

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportKBB = ({ month, year, kategory }) => {
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
  const [maxDate, setMaxDate] = useState(new Date().getMonth() + 1);
  const chunkSize = 17;

  useEffect(() => {
    getAcc();
    getAccDdb();
  }, []);

  const getTrans = async (acc) => {
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
        // let acc = [];
        // acc.forEach((element) => {
        //   element.trans = [];
        //   data.forEach((el) => {
        //     if (element.account.id === el.acc_id.id) {
        //       element.trans.push({ ...el, trx_amnh: 0, acq_amnh: 0 });
        //     }
        //   });
        //   element.trans.forEach((el) => {
        //     data.forEach((ek) => {
        //       if (el.id === ek.id) {
        //         el.trx_amnh = ek?.trx_amnh ?? 0;
        //         el.acq_amnh += ek?.acq_amnh ?? 0;
        //       }
        //     });
        //   });
        //   if (element.trans.length > 0) {
        //     acc.push(element);
        //   }
        // });
        setTrans(data);
        // jsonForExcel(data);
      }
    } catch (error) {
      console.log(error);
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
        let filt = [];
        data.forEach((el) => {
          if (el.account.dou_type === "D") {
            filt.push(el);
          }
        });
        setAcc(filt);
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

    account?.forEach((el) => {
      if (kategory) {
        if (Number(kategory) === el.kategory.id) {
          let db = 0;
          let kr = 0;
          let sa = 0;
          let bl = 0;
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
          data.push({
            acco: `${el.account?.acc_code}-${el.account?.acc_name}`,
            acc_id: el.account?.id,
            kat: el.kategory?.id,
            slda: `${formatIdr(sa)}`,
            debe: `${formatIdr(db)}`,
            kred: `${formatIdr(kr)}`,
            blce: `${formatIdr(bl)}`,
          });
        }
      } else {
        let db = 0;
        let kr = 0;
        let sa = 0;
        let bl = 0;
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
        data.push({
          acco: `${el.account?.acc_code}-${el.account?.acc_name}`,
          acc_id: el.account?.id,
          kat: el.kategory?.id,
          slda: `${formatIdr(sa)}`,
          debe: `${formatIdr(db)}`,
          kred: `${formatIdr(kr)}`,
          blce: `${formatIdr(bl)}`,
        });
      }
    });

    let final = [
      {
        columns: [
          {
            title: "Ringkasan Kartu Buku Besar",
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

    let item = [];
    data.forEach((el) => {
      item.push([
        {
          value: `${el.acco}`,
          style: {
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: `${el.slda}`,
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${el.debe}`,
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${el.kred}`,
          style: {
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${el.blce}`,
          style: {
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
      ]);
    });

    final.push({
      columns: [
        {
          title: "Account",
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
          title: "Start Balance",
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
          title: "Mutasi Debit",
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
          title: "Mutasi Kredit",
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
          title: "Balance",
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
              filename={`gl_card_report_export_${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={account ? jsonForExcel(account, true) : null}
                name="GL Card Report"
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
                  tittle={"Ringkasan Kartu Buku Besar"}
                  subTittle={`Ringkasan Kartu Buku Besar per ${formatDate(filtDate)}`}
                  onComplete={(cp) => setCp(cp)}
                  page={idx + 1}
                  horizontal
                  body={
                    <>
                      <DataTable
                        responsiveLayout="scroll"
                        value={val}
                        showGridlines
                        dataKey="id"
                        rowHover
                        emptyMessage="Data Tidak Ditemukan"
                      >
                        <Column
                          className="header-center"
                          header="Akun"
                          style={{ width: "20rem" }}
                          field={(e) => e?.acco}
                          body={(e) => (
                            <Link
                              to={`/laporan/kartu-buku-besar-rincian/${btoa(
                                `m'${filtDate.getMonth() + 1}`
                              )}/${btoa(`y'${filtDate.getFullYear()}`)}/${btoa(
                                `kat'${e.kat}`
                              )}/${btoa(
                                btoa(JSON.stringify({ acc_id: e.acc_id }))
                              )}`}
                            >
                              <td className="header-center">{e?.acco}</td>
                            </Link>
                          )}
                        />
                        <Column
                          className="header-right text-right"
                          header="Saldo Awal"
                          style={{ minWidht: "8rem" }}
                          field={(e) => e?.slda}
                        />
                        <Column
                          className="header-right text-right"
                          header="Mutasi Debit"
                          style={{ minWidht: "8rem" }}
                          field={(e) => e?.debe}
                        />
                        <Column
                          className="header-right text-right"
                          header="Mutasi Kredit"
                          style={{ minWidht: "10rem" }}
                          field={(e) => e?.kred}
                        />
                        <Column
                          className="header-right text-right"
                          header="Balance"
                          style={{ minWidht: "10rem" }}
                          field={(e) => e?.blce}
                        />
                      </DataTable>
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
                      tittle={"Ringkasan Kartu Buku Besar"}
                      subTittle={`Ringkasan Kartu Buku Besar per ${formatDate(
                        filtDate
                      )}`}
                      onComplete={(cp) => setCp(cp)}
                      page={idx + 1}
                      horizontal
                      body={
                        <>
                          {/* {val.map((v) => { */}
                          {/* return ( */}
                          <DataTable
                            responsiveLayout="scroll"
                            value={val}
                            showGridlines
                            dataKey="id"
                            rowHover
                            emptyMessage="Data Tidak Ditemukan"
                          >
                            <Column
                              className="header-center"
                              header="Akun"
                              style={{ width: "20rem" }}
                              field={(e) => e?.acco}
                              body={(e) => (
                                <td className="header-center">{e?.acco}</td>
                              )}
                            />
                            <Column
                              className="header-right text-right"
                              header="Saldo Awal"
                              style={{ minWidht: "8rem" }}
                              field={(e) => e?.slda}
                            />
                            <Column
                              className="header-right text-right"
                              header="Mutasi Debit"
                              style={{ minWidht: "8rem" }}
                              field={(e) => e?.debe}
                            />
                            <Column
                              className="header-right text-right"
                              header="Mutasi Kredit"
                              style={{ minWidht: "10rem" }}
                              field={(e) => e?.kred}
                            />
                            <Column
                              className="header-right text-right"
                              header="Balance"
                              style={{ minWidht: "10rem" }}
                              field={(e) => e?.blce}
                            />
                          </DataTable>
                          {/* );
                       })} */}
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

export default ReportKBB;
