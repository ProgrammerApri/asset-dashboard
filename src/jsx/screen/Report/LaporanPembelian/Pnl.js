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
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import { sub } from "date-fns";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Pnl = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [date, setDate] = useState([new Date(), new Date()]);
  const [trans, setTrans] = useState(null);
  const [account, setAccount] = useState(null);
  const [cp, setCp] = useState("");
  const chunkSize = 4;

  useEffect(() => {
    var d = new Date();
    d.setDate(d.getDate() - 7);
    setDate([d, new Date()]);
    getAccount();
  }, []);

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
        // jsonForExcel(data);
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

  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  const jsonForExcel = (acc, excel = false) => {
    let data = [];
    let new_acc = [];
    let grouped = acc?.filter(
      (el, i) =>
        i ===
        acc.findIndex(
          (ek) =>
            el.klasifikasi.id >= 4 &&
            el.klasifikasi.id <= 9 &&
            el?.klasifikasi.id === ek?.klasifikasi.id
        )
    );

    grouped?.forEach((el) => {
      let total = 0;
      let sub = [];
      acc.forEach((ek) => {
        if (ek.account.dou_type === "U") {
          if (el.klasifikasi.id === ek.klasifikasi.id) {
            let saldo = 0;
            trans?.forEach((ej) => {
              if (ej.acc_id.acc_code === ek.account.acc_code) {
                saldo += ej.trx_amnt;
              }
            });
            sub.push({
              acc_name: `${ek.account.acc_code}-${ek.account.acc_name}`,
              type: "item",
              saldo: `Rp. ${formatIdr(saldo)}`,
            });
            total += saldo;
          }
        }
      });
      sub.push({
        acc_name: `Sub Total ${el.klasifikasi.klasiname}`,
        type: "footer",
        saldo: `Rp. ${formatIdr(total)}`,
      });
      data.push({
        klasifikasi: `${el.klasifikasi.id}-${el.klasifikasi.klasiname}`,
        sub: sub,
      });
    });

    console.log(data);

    let final = [
      {
        columns: [
          {
            title: "Profit/Loss Report",
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
            title: `Periode (${formatDate(date[0])}) - (${formatDate(
              date[1]
            )})`,
            width: { wch: 50 },
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
      el.sub.forEach((ek) => {
        item.push([
          {
            value: `${ek.type === "item" ? "         " : ""}${ek.acc_name}`,
            style: {
              font: {
                sz: "14",
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek.saldo}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
        ]);
      });

      item.push([
        {
          value: "",
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: "",
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
      ]);

      final.push({
        columns: [
          {
            title: `${el.klasifikasi}`,
            width: { wch: 50 },
            style: {
              font: { sz: "14", bold: false },
              alignment: { horizontal: "left", vertical: "center" },
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
              alignment: { horizontal: "left", vertical: "center" },
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
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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
              id="range"
              onChange={(e) => setDate(e.value)}
              selectionMode="range"
              placeholder="Pilih Tanggal"
              readOnlyInput
            />
          </div>
        </div>
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`pnl_report_${formatDate(new Date())
                .replace("-", "")
                .replace("-", "")}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={account ? jsonForExcel(account, true) : null}
                name="Report"
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
      {/* <Toast ref={toast} /> */}
      <Row>
        <Col>
          <Card className="mb-3">
            <Card.Body>{renderHeader()}</Card.Body>
          </Card>
        </Col>
      </Row>

      <>
        <Row className="m-0 justify-content-center" ref={printPage}>
          {chunk(jsonForExcel(account) ?? [], chunkSize)?.map((val, idx) => {
            return (
              <Card className="ml-1 mr-1 mt-2">
                <Card.Body className="p-0">
                  <CustomeWrapper
                    tittle={"Profit/Loss Report"}
                    subTittle={`Profit/Loss Report as of 25/06/2022`}
                    onComplete={(cp) => setCp(cp)}
                    page={idx + 1}
                    body={
                      <>
                        {val.map((v) => {
                          return (
                            <DataTable
                              responsiveLayout="scroll"
                              value={v.sub}
                              showGridlines
                              dataKey="id"
                              rowHover
                              emptyMessage="Data Tidak Ditemukan"
                            >
                              <Column
                                className="header-center"
                                header={v.klasifikasi}
                                style={{ width: "20rem" }}
                                body={(e) => (
                                  <div
                                    className={
                                      e.type == "footer"
                                        ? "font-weight-bold"
                                        : "ml-4"
                                    }
                                  >
                                    {e.acc_name}
                                  </div>
                                )}
                              />
                              <Column
                                className="header-center"
                                header=""
                                style={{ minWidht: "10rem" }}
                                body={(e) => (
                                  <div
                                    className={
                                      e.type == "header"
                                        ? "font-weight-bold text-right"
                                        : e.type == "footer"
                                        ? "font-weight-bold text-right"
                                        : "text-right"
                                    }
                                  >
                                    {e.saldo}
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
      </>
    </>
  );
};

export default Pnl;