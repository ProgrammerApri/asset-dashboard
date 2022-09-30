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

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const category = {
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
  const [cp, setCp] = useState(null)
  const printPage = useRef(null);
  const toast = useRef(null);
  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    var d = new Date();
    d.setDate(d.getDate() - 30);
    setMonth2(d);
    getAccount();
  }, []);

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

    category.aktiva.forEach((el) => {
      datum.push({
        type: "aktiva",
        kat_id: el.id,
        name: el.name,
        sub: [],
        sub2: [],
      });
    });

    category.pasiva.forEach((el) => {
      datum.push({
        type: "pasiva",
        kat_id: el.id,
        name: el.name,
        sub: [],
        sub2: [],
      });
    });

    datum.forEach((el) => {
      el.kat_id.forEach((e) => {
        account.forEach((ek) => {
          if (ek.account.dou_type === "U" && ek.kategory.id === e) {
            let saldo = 0;
            trans?.forEach((ej) => {
              let trx_date = new Date(`${ej.trx_date}Z`);
              if (trx_date.getMonth()+1 === month2.getMonth() + 1) {
                if (ek.account?.acc_code === ej.acc_id?.umm_code) {
                  saldo += ej.trx_amnt;
                }
              }
            });
            el.sub.push({
              acc_code: ek.account.acc_code,
              acc_name: ek.account.acc_name,
              saldo: saldo,
            });
          }
        });
      });
    });

    datum.forEach((el) => {
      el.kat_id.forEach((e) => {
        account.forEach((ek) => {
          if (ek.account.dou_type === "U" && ek.kategory.id === e) {
            let saldo = 0;
            trans?.forEach((ej) => {
              let trx_date = new Date(`${ej.trx_date}Z`);
              if (trx_date.getMonth() + 1 === month1.getMonth() + 1) {
                if (ek.account.acc_code === ej.acc_id?.umm_code) {
                  saldo += ej.trx_amnt;
                }
              }
            });
            el.sub2.push({
              acc_code: ek.account.acc_code,
              acc_name: ek.account.acc_name,
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
                value: sub.saldo > 0 ? `Rp. ${formatIdr(sub.saldo)}` : 0,
              },
              {
                ...saldo,
                value:
                  el.sub2[i].saldo > 0
                    ? `Rp. ${formatIdr(el.sub2[i].saldo)}`
                    : 0,
              },
            ]);
            total += sub.saldo;
            total2 += el.sub2[i].saldo;
          });
          aktiva.push([
            { ...umum, value: `Total ${el.name}` },
            { ...lastSaldo, value: total > 0 ? `Rp. ${formatIdr(total)}` : 0 },
            {
              ...lastSaldo,
              value: total2 > 0 ? `Rp. ${formatIdr(total2)}` : 0,
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
                value: sub.saldo > 0 ? `Rp. ${formatIdr(sub.saldo)}` : 0,
              },
              {
                ...saldo,
                value:
                  el.sub2[i].saldo > 0
                    ? `Rp. ${formatIdr(el.sub2[i].saldo)}`
                    : 0,
              },
            ]);
            total += sub.saldo;
            total2 += el.sub2[i].saldo;
          });
          pasiva.push([
            { ...umum, value: `Total ${el.name}` },
            { ...lastSaldo, value: total > 0 ? `Rp. ${formatIdr(total)}` : 0 },
            {
              ...lastSaldo,
              value: total2 > 0 ? `Rp. ${formatIdr(total2)}` : 0,
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
        value: totalAktiva > 0 ? `Rp. ${formatIdr(totalAktiva)}` : 0,
      },
      {
        ...lastSaldo,
        value: totalAktiva2 > 0 ? `Rp. ${formatIdr(totalAktiva2)}` : 0,
      },
    ]);
    pasiva.push([
      { ...umum, value: "Liabilities Total" },
      {
        ...lastSaldo,
        value: totalPasiva > 0 ? `Rp. ${formatIdr(totalPasiva)}` : 0,
      },
      {
        ...lastSaldo,
        value: totalPasiva2 > 0 ? `Rp. ${formatIdr(totalPasiva2)}` : 0,
      },
    ]);

    let selisih = totalAktiva - totalPasiva;
    pasiva[pasiva.length - 4][1].value =
      selisih > 0 ? `Rp. ${formatIdr((selisih / 3).toFixed(0))}` : 0;
    pasiva[pasiva.length - 3][1].value =
      selisih > 0 ? `Rp. ${formatIdr(((selisih * 2) / 3).toFixed(0))}` : 0;
    pasiva[pasiva.length - 2][1].value =
      selisih > 0 ? `Rp. ${formatIdr(selisih / 3 + (selisih * 2) / 3)}` : 0;
    pasiva[pasiva.length - 1][1].value =
      selisih > 0
        ? `Rp. ${formatIdr(totalPasiva + selisih / 3 + (selisih * 2) / 3)}`
        : totalPasiva;

    let selisih2 = totalAktiva2 - totalPasiva2;
    pasiva[pasiva.length - 4][2].value =
      selisih2 > 0 ? `Rp. ${formatIdr((selisih2 / 3).toFixed(0))}` : 0;
    pasiva[pasiva.length - 3][2].value =
      selisih2 > 0 ? `Rp. ${formatIdr(((selisih2 * 2) / 3).toFixed(0))}` : 0;
    pasiva[pasiva.length - 2][2].value =
      selisih2 > 0 ? `Rp. ${formatIdr(selisih2 / 3 + (selisih2 * 2) / 3)}` : 0;
    pasiva[pasiva.length - 1][2].value =
      selisih2 > 0
        ? `Rp. ${formatIdr(totalPasiva2 + selisih2 / 3 + (selisih2 * 2) / 3)}`
        : totalPasiva2;

    console.log(pasiva);

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
                placeholder="Pilih Bulan"
                dateFormat="mm/yy"
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
                placeholder="Pilih Bulan"
                dateFormat="mm/yy"
              />
            </div>
          </div>
        </Row>
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`balancesheet_comparison_export_${formatDate(new Date()).replaceAll(
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
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [month, year].join("/");
  };

  const formatIdr = (value) => {
    return `${value}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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
              tittle={"Balance Sheet Comparison"}
              subTittle={`Balance Sheet Comparison ${formatDate(month2)} and ${formatDate(month1)}`}
              onComplete={(cp) => setCp(cp)}
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
                    className="center-header border-left border-right"
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
                    header={formatDate(month2)}
                    field={(e) => e[1].value}
                    className="center-header text-right border-right"
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
                    field={(e) => e[2].value}
                    className="center-header text-right border-right"
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
                    className="center-header border-right"
                    header="Liabilities"
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
                            className={e[3].type == "U" && "font-weight-bold"}
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
                    className="center-header text-right border-right"
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
                    field={(e) => e[5].value}
                    className="center-header text-right border-right"
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
          </Card.Body>
        </Card>
      </Row>
      <Row className="m-0 justify-content-center d-none">
        <Card className="ml-1 mr-1 mt-2">
          <Card.Body className="p-0" ref={printPage}>
          <CustomeWrapper
              tittle={"Balance Sheet Comparison"}
              subTittle={`Balance Sheet Comparison ${formatDate(month2)} and ${formatDate(month1)}`}
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
                    className="center-header border-left border-right"
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
                    header={formatDate(month2)}
                    field={(e) => e[1].value}
                    className="center-header text-right border-right"
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
                    field={(e) => e[2].value}
                    className="center-header text-right border-right"
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
                    className="center-header border-right"
                    header="Liabilities"
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
                            className={e[3].type == "U" && "font-weight-bold"}
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
                    className="center-header text-right border-right"
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
                    field={(e) => e[5].value}
                    className="center-header text-right border-right"
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
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default NeracaPerbandingan;
