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

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const category = {
  aktiva: [
    {
      name: "Aktiva Lancar",
      id: [1, 2, 3, 4, 5]
    },
    {
      name: "Aktiva Tetap",
      id: [6]
    },
    {
      name: "Aktiva Lainnya",
      id: [8]
    },
  ],
  pasiva: [
    {
      name: "Hutang",
      id: [9, 10, 11, 12, 18]
    },
    {
      name: "Modal",
      id: [13, 15, 16, 17]
    },
  ]
}

const Neraca = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
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
        alignment: { horizontal: "center", vertical: "center" },
      },
    };
    let lastSaldo = {
      value: 0,
      style: {
        font: { sz: "14", bold: true },
        alignment: { horizontal: "center", vertical: "center" },
      },
      last: true,
    };
    let aktiva = [];
    let pasiva = [];
    let datum = [];
    // account.forEach((el) => {
    //   if (el.account.dou_type === "U") {
    //     datum.push({
    //       id: el.account.id,
    //       acc_code: el.account.acc_code,
    //       acc_name: el.account.acc_name,
    //       kategori: el.account.kat_code,
    //       detail: [],
    //     });
    //   }
    // });

    category.aktiva.forEach((el) => {
      datum.push({
        type : "aktiva",
        kat_id : el.id,
        name : el.name,
        sub : []
      })
    });

    category.pasiva.forEach((el) => {
      datum.push({
        type : "pasiva",
        kat_id : el.id,
        name : el.name,
        sub : []
      })
    });

    datum.forEach((el) => {
      el.kat_id.forEach((e) => {
        account.forEach((ek) => {
          if (
            ek.account.dou_type === "U" &&
            ek.kategory.id === e
          ) {
            el.sub.push({
              acc_code: ek.account.acc_code,
              acc_name: ek.account.acc_name,
              saldo: ek.account.sld_awal,
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
          el.sub.forEach((sub) => {
            aktiva.push([
              { ...detail, value: `           ${sub.acc_name}` },
              { ...saldo, value: sub.saldo },
            ]);
            total += sub.saldo;
          });
          aktiva.push([
            { ...umum, value: `Total ${el.name}` },
            { ...lastSaldo, value: total },
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
              { ...saldo, value: sub.saldo },
            ]);
            total += sub.saldo;
          });
          pasiva.push([
            { ...umum, value: `Total ${el.name}` },
            { ...lastSaldo, value: total },
          ]);
          totalPasiva += total;
        }
      }
    });
    aktiva.push([
      { ...umum, value: "Total Aktiva" },
      { ...lastSaldo, value: totalAktiva },
    ]);
    pasiva.push([
      { ...umum, value: "Total Pasiva" },
      { ...lastSaldo, value: totalPasiva },
    ]);

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

    console.log("=========================");
    console.log(data);

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
            width: { wch: 10 },
            style: { font: { sz: "14", bold: true } },
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
            width: { wch: 10 },
            style: { font: { sz: "14", bold: true } },
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
      <div className="flex justify-content-between">
        <div style={{ height: "3rem" }}></div>
        <Row className="mr-1">
          <div className="mr-3">
            <ExcelFile
              filename={`neraca_export_${new Date().getTime()}`}
              element={
                <Button variant="primary" onClick={() => {}}>
                  Excel
                  <span className="btn-icon-right">
                    <i class="bx bx-table"></i>
                  </span>
                </Button>
              }
            >
              <ExcelSheet
                dataSet={account ? jsonForExcel(account) : null}
                name="Neraca"
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

  return (
    <>
      <Toast ref={toast} />
      <Row>
        <Col>
          <Card>
            <Card.Body>
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
                header={renderHeader}
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
                  className="text-center border-right"
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
                  className="text-center"
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div
                        className={e[3].last && "font-weight-bold"}
                      >{e[3].value}</div>
                    )
                  }
                />
              </DataTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="d-none">
        <Col>
          <Card
            ref={printPage}>
            <Card.Body>
              <Col>
              <h2>test</h2>
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
                // showGridlines
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
                  className="text-center border-right"
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
                  className="text-center"
                  body={(e) =>
                    loading ? (
                      <Skeleton />
                    ) : (
                      <div
                        className={e[3].last && "font-weight-bold"}
                      >{e[3].value}</div>
                    )
                  }
                />
              </DataTable>
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Neraca;
