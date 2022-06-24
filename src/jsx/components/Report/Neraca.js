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
import CustomeWrapper from "../CustomeWrapper/CustomeWrapper";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const category = {
  aktiva: [
    {
      name: "Aktiva Lancar",
      id: [1, 2, 3, 4, 5, 6, 8, 9, 10],
    },
    {
      name: "Aktiva Tetap",
      id: [12],
    },
    {
      name: "Depresiasi",
      id: [13],
    },
  ],
  pasiva: [
    {
      name: "Hutang",
      id: [14, 15, 16, 17, 18, 19],
    },
    {
      name: "Modal",
      id: [21, 22, 23, 24, 25, 26],
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

  useEffect(() => {
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
      });
    });

    category.pasiva.forEach((el) => {
      datum.push({
        type: "pasiva",
        kat_id: el.id,
        name: el.name,
        sub: [],
      });
    });

    datum.forEach((el) => {
      el.kat_id.forEach((e) => {
        account.forEach((ek) => {
          if (ek.account.dou_type === "U" && ek.kategory.id === e) {
            let saldo = 0;
            trans?.forEach((ej) => {
              let trx_date = new Date(`${ej.trx_date}Z`);
              if (trx_date <= date) {
                if (ek.account.acc_code == ej.acc_id.umm_code) {
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
              { ...detail, value: `           ${sub.acc_name}` },
              {
                ...saldo,
                value: sub.saldo > 0 ? `Rp. ${formatIdr(sub.saldo)}` : 0,
              },
            ]);
            total += sub.saldo;
          });
          aktiva.push([
            { ...umum, value: `Total ${el.name}` },
            { ...lastSaldo, value: total > 0 ? `Rp. ${formatIdr(total)}` : 0 },
          ]);
          totalAktiva += total;
        }
      } else {
        if (el.sub.length > 0) {
          pasiva.push([{ ...umum, value: el.name }, { value: "" }]);
          let total = 0;
          el.sub.forEach((sub) => {
            pasiva.push([
              { ...detail, value: `           ${sub.acc_name}` },
              {
                ...saldo,
                value: sub.saldo > 0 ? `Rp. ${formatIdr(sub.saldo)}` : 0,
              },
            ]);
            total += sub.saldo;
          });
          pasiva.push([
            { ...umum, value: `Total ${el.name}` },
            { ...lastSaldo, value: total > 0 ? `Rp. ${formatIdr(total)}` : 0 },
          ]);
          totalPasiva += total;
        }
      }
    });
    aktiva.push([
      { ...umum, value: "Total Aktiva" },
      {
        ...lastSaldo,
        value: totalAktiva > 0 ? `Rp. ${formatIdr(totalAktiva)}` : 0,
      },
    ]);
    pasiva.push([
      { ...umum, value: "Total Pasiva" },
      {
        ...lastSaldo,
        value: totalPasiva > 0 ? `Rp. ${formatIdr(totalPasiva)}` : 0,
      },
    ]);

    let selisih = totalAktiva-totalPasiva
    pasiva[pasiva.length-4][1].value = selisih > 0 ? `Rp. ${formatIdr((selisih/3).toFixed(0))}` : 0
    pasiva[pasiva.length-3][1].value = selisih > 0 ? `Rp. ${formatIdr((selisih*2/3).toFixed(0))}` : 0
    pasiva[pasiva.length-2][1].value = selisih > 0 ? `Rp. ${formatIdr((selisih/3)+(selisih*2/3))}` : 0
    pasiva[pasiva.length-1][1].value = selisih > 0 ? `Rp. ${formatIdr(totalPasiva+(selisih/3)+(selisih*2/3))}` : totalPasiva

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
            title: "Aktiva",
            width: { wch: 50 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "center", vertical: "center" },
            },
          },
          {
            title: "",
            width: { wch: 15 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            title: "Pasiva",
            width: { wch: 50 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "center", vertical: "center" },
            },
          },
          {
            title: "",
            width: { wch: 15 },
            style: {
              font: { sz: "14", bold: true },
              alignment: { horizontal: "tight", vertical: "center" },
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
              dateFormat="dd-mm-yy"
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
                <Button variant="primary" onClick={() => {}}>
                  EXCEL
                  <span className="btn-icon-right">
                    <i class="bx bx-table"></i>
                  </span>
                </Button>
              }
            >
              <ExcelSheet
                dataSet={account ? jsonForExcel(account, true) : null}
                name={`Neraca-${formatDate(new Date())}`}
              />
            </ExcelFile>
          </div>
          <ReactToPrint
            trigger={() => {
              return (
                <Button variant="primary" onClick={() => {}}>
                  PDF{" "}
                  <span className="btn-icon-right">
                    <i class="bx bxs-file-pdf"></i>
                  </span>
                </Button>
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

    return [day, month, year].join("/");
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
            <Card.Body>
              {renderHeader()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="m-0 justify-content-center" >
        <Card className="ml-1 mr-1 mt-2">
          <Card.Body className="p-0">
            <CustomeWrapper
              tittle={"Laporan Neraca"}
              subTittle={`Laporan Neraca ${formatDate(date)}`}
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
                  header="Aktiva"
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
                        <div className={e[0].type == "U" && "font-weight-bold"}>
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
                      <div
                        className={e[1].last && "font-weight-bold"}
                      >{`${e[1].value}`}</div>
                    )
                  }
                />
                <Column
                  className="center-header"
                  header="Pasiva"
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
                        <div className={e[2].type == "U" && "font-weight-bold"}>
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
      <Row className="m-0 justify-content-center d-none" >
        <Card className="ml-1 mr-1 mt-2">
          <Card.Body className="p-0" ref={printPage}>
            <CustomeWrapper
              tittle={"Laporan Neraca"}
              subTittle={`Laporan Neraca ${formatDate(date)}`}
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
                  header="Aktiva"
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
                        <div className={e[0].type == "U" && "font-weight-bold"}>
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
                      <div
                        className={e[1].last && "font-weight-bold"}
                      >{`${e[1].value}`}</div>
                    )
                  }
                />
                <Column
                  className="center-header"
                  header="Pasiva"
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
                        <div className={e[2].type == "U" && "font-weight-bold"}>
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
