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
import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import { el } from "date-fns/locale";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportPiutang = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState(new Date());
  const [customer, setCustomer] = useState(null);
  const [acc, setAcc] = useState(null);
  const [selectedCus, setSelected] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState([]);
  const [ar, setAr] = useState(null);
  const [total, setTotal] = useState(null);
  const [cp, setCp] = useState("");
  const chunkSize = 5;

  useEffect(() => {
    getARCard();
  }, []);

  const getARCard = async (id) => {
    const config = {
      ...endpoints.arcard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      // console.log(response);
      if (response.status) {
        const { data } = response;
        let trx_amnh = 0;
        let acq_amnh = 0;
        let total = 0;
        data.forEach((el) => {
          if (el.lunas == false) {
            if (el.trx_dbcr === "D") {
              trx_amnh += el?.trx_amnh ?? 0;
            } else {
              if (
                el.trx_type === "DP" ||
                (el.trx_type === "SA" && el.trx_dbcr === "K")
              ) {
                acq_amnh += el?.trx_amnh ?? 0;
              } else {
                acq_amnh += el?.acq_amnh ?? 0;
              }
            }
          }
        });
        total += trx_amnh - acq_amnh ?? 0;

        setAr(data);
        setTotal(total);

        let grouped = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.cus_id?.id === ek?.cus_id?.id)
        );
        setCustomer(grouped);
        getAcc(data);

        if (id) {
          grouped?.forEach((elem) => {
            if (elem?.cus_id?.id === Number(id)) {
              setSelected([elem]);
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAcc = async (ar) => {
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
        let filt = [];
        data?.forEach((elem) => {
          ar?.forEach((el) => {
            if (elem.account?.id === el.cus_id?.cus_gl) {
              filt.push(elem);
            }
          });
        });

        let grouped = filt?.filter(
          (el, i) =>
            i === filt.findIndex((ek) => el?.account?.id === ek?.account?.id)
        );
        setAcc(grouped);
        // console.log("=======");
        // console.log(filt);
      }
    } catch (error) {}
  };


  const formatDate = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const jsonForExcel = (ar, excel = false) => {
    let data = [];

    if (selectedCus?.length && selectedAcc?.length) {
      selectedCus?.forEach((cus) => {
        selectedAcc?.forEach((sel) => {
          ar?.forEach((ek) => {
            if (
              ek.cus_id?.id === cus?.cus_id?.id &&
              ek.cus_id?.cus_gl === sel?.account?.id
            ) {
              let amn = 0;
              let acq = 0;
              let val = [
                {
                  cus: `${cus.cus_id?.cus_name} (${cus.cus_id?.cus_code})`,
                  type: "header",
                  value: {
                    ref: "Transaction Code",
                    date: "Transaction Date",
                    jt: "Due Date",
                    value: "Receivable",
                    lns: "Payment",
                    // sisa: `${formatIdr(0)}`,
                  },
                },
              ];
              // el.ar.forEach((ek) => {
              let filt = new Date(`${ek?.trx_date}Z`);
              if (filt <= filtDate) {
                val.push({
                  cus: `${ek.cus_id?.cus_name} (${ek.cus_id?.cus_code})`,
                  type: "item",
                  value: {
                    ref: ek.trx_code,
                    date: formatDate(ek.trx_date),
                    jt: ek.trx_due ? formatDate(ek.trx_due) : "-",
                    value: `${formatIdr(
                      ek.trx_dbcr === "D" ? ek.trx_amnh : 0
                    )}`,
                    lns: `${formatIdr(
                      ek.trx_dbcr === "K" && ek.trx_type !== "JL"
                        ? ek.trx_amnh
                        : ek.trx_dbcr === "K" && ek.trx_type === "JL"
                        ? ek.acq_amnh
                        : 0
                    )}`,
                  },
                });

                amn += ek.trx_dbcr === "D" ? ek.trx_amnh : 0;
                acq +=
                  ek.trx_dbcr === "K" && ek.trx_type !== "JL"
                    ? ek.trx_amnh
                    : ek.trx_dbcr === "K" && ek.trx_type === "JL"
                    ? ek.acq_amnh
                    : 0;
              }
              // });
              val.push({
                sup: ``,
                type: "footer",
                value: {
                  ref: "Total",
                  date: "",
                  jt: "",
                  value: `${formatIdr(amn)}`,
                  lns: `${formatIdr(acq)}`,
                  // sisa: "",
                },
              });
              data.push(val);
            }
          });
        });
      });
    } else if (selectedCus?.length) {
      selectedCus?.forEach((p) => {
        console.log("p", p);
        let amn = 0;
        let acq = 0;
        let val = [
          {
            cus: `${p.cus_id?.cus_name} (${p.cus_id?.cus_code})`,
            type: "header",
            value: {
              ref: "Transaction Code",
              date: "Transaction Date",
              jt: "Due Date",
              value: "Receivable",
              lns: "Payment",
              // sisa: `${formatIdr(0)}`,
            },
          },
        ];
        ar?.forEach((ek) => {
          if (ek.cus_id?.id === p?.cus_id?.id) {
            // el.ar.forEach((ek) => {
            let filt = new Date(`${ek?.trx_date}Z`);
            if (filt <= filtDate) {
              val.push({
                cus: `${ek.cus_id?.cus_name} (${ek.cus_id?.cus_code})`,
                type: "item",
                value: {
                  ref: ek.trx_code,
                  date: formatDate(ek.trx_date),
                  jt: ek.trx_due ? formatDate(ek.trx_due) : "-",
                  value: `${formatIdr(ek.trx_dbcr === "D" ? ek.trx_amnh : 0)}`,
                  lns: `${formatIdr(
                    ek.trx_dbcr === "K" && ek.trx_type !== "JL"
                      ? ek.trx_amnh
                      : ek.trx_dbcr === "K" && ek.trx_type === "JL"
                      ? ek.acq_amnh
                      : 0
                  )}`,
                },
              });

              amn += ek.trx_dbcr === "D" ? ek.trx_amnh : 0;
              acq +=
                ek.trx_dbcr === "K" && ek.trx_type !== "JL"
                  ? ek.trx_amnh
                  : ek.trx_dbcr === "K" && ek.trx_type === "JL"
                  ? ek.acq_amnh
                  : 0;
            }
            // });
          }
        });
        val.push({
          sup: ``,
          type: "footer",
          value: {
            ref: "Total",
            date: "",
            jt: "",
            value: `${formatIdr(amn)}`,
            lns: `${formatIdr(acq)}`,
            // sisa: "",
          },
        });
        data.push(val);
        // });
      });
    } else if (selectedAcc?.length) {
      selectedAcc?.forEach((sel) => {
        ar?.forEach((ek) => {
          if (ek.cus_id?.cus_gl === sel?.account?.id) {
            let amn = 0;
            let acq = 0;
            let val = [
              {
                cus: `${ek.cus_id?.cus_name} (${ek.cus_id?.cus_code})`,
                type: "header",
                value: {
                  ref: "Transaction Code",
                  date: "Transaction Date",
                  jt: "Due Date",
                  value: "Receivable",
                  lns: "Payment",
                  // sisa: `${formatIdr(0)}`,
                },
              },
            ];
            // el.ar.forEach((ek) => {
            let filt = new Date(`${ek?.trx_date}Z`);
            if (filt <= filtDate) {
              val.push({
                cus: `${ek.cus_id?.cus_name} (${ek.cus_id?.cus_code})`,
                type: "item",
                value: {
                  ref: ek.trx_code,
                  date: formatDate(ek.trx_date),
                  jt: ek.trx_due ? formatDate(ek.trx_due) : "-",
                  value: `${formatIdr(ek.trx_dbcr === "D" ? ek.trx_amnh : 0)}`,
                  lns: `${formatIdr(
                    ek.trx_dbcr === "K" && ek.trx_type !== "JL"
                      ? ek.trx_amnh
                      : ek.trx_dbcr === "K" && ek.trx_type === "JL"
                      ? ek.acq_amnh
                      : 0
                  )}`,
                },
              });

              amn += ek.trx_dbcr === "D" ? ek.trx_amnh : 0;
              acq +=
                ek.trx_dbcr === "K" && ek.trx_type !== "JL"
                  ? ek.trx_amnh
                  : ek.trx_dbcr === "K" && ek.trx_type === "JL"
                  ? ek.acq_amnh
                  : 0;
            }
            // });
            val.push({
              sup: ``,
              type: "footer",
              value: {
                ref: "Total",
                date: "",
                jt: "",
                value: `${formatIdr(amn)}`,
                lns: `${formatIdr(acq)}`,
                // sisa: "",
              },
            });
            data.push(val);
          }
        });
      });
    }

    let final = [
      {
        columns: [
          {
            title: "Accounts Receivable Balance Details",
            width: { wch: 30 },
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
            width: { wch: 30 },
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
        data: [[]],
      },
    ];
    data.forEach((el) => {
      let item = [];
      data.forEach((ek) => {
        item.push([
          {
            value: `${ek?.value?.ref}`,
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
            value: `${ek?.value?.date}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek?.value?.jt}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek?.value?.value}`,
            style: {
              font: {
                sz: "14",
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: `${ek?.value?.lns}`,
            style: {
              font: {
                sz: "14",
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: `${ek?.value?.sisa}`,
            style: {
              font: {
                sz: "14",
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
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
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: "",
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: "",
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
      ]);

      final.push({
        columns: [
          {
            title: `${el?.cus}`,
            width: { wch: 30 },
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
            width: { wch: 17 },
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
            width: { wch: 17 },
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
    return `Rp. ${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const glTemplate = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.account.acc_name} - ${option.account.acc_code}`
          : ""}
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-10 ml-0 mr-0 pl-0 pt-0">
          <Row className="mt-0">
            <div className="p-inputgroup col-3  ">
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
                // selectionMode="range"
                placeholder="Pilih Tanggal"
                readOnlyInput
                dateFormat="dd-mm-yy"
              />
            </div>

            <div className="col-2 ">
              <MultiSelect
                value={selectedCus ?? null}
                options={customer}
                onChange={(e) => {
                  setSelected(e.value);
                  // console.log("===========");
                  // console.log(e.value);
                }}
                placeholder="Pilih Customer"
                optionLabel="cus_id.cus_name"
                showClear
                filterBy="cus_id.cus_name"
                filter
                display="chip"
                // className="w-full md:w-22rem"
                maxSelectedLabels={3}
              />
            </div>
            <div className="col-3">
              <MultiSelect
                value={selectedAcc ?? null}
                options={acc}
                onChange={(e) => {
                  setSelectedAcc(e.value);
                  // console.log("===========");
                  // console.log(e.value);
                }}
                placeholder="Pilih Account"
                optionLabel="account.acc_name"
                showClear
                filterBy="account.acc_name"
                filter
                itemTemplate={glTemplate}
                display="chip"
                // className="w-full md:w-22rem"
                maxSelectedLabels={3}
              />
            </div>
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`receivable_details_report_export_${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={ar ? jsonForExcel(ar, true) : null}
                name="Receivable Details Report"
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

  const renderFooter = () => {
    return (
      <Row className="m-0 mt-0">
        <div className="text-left font-weight-bold col-6">Total Hutang</div>
        <div className="col-6 text-right font-weight-bold">
          Rp. {formatIdr(total)}
        </div>
      </Row>
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
          <Card>
            <Card.Body>{renderHeader()}</Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="m-0 justify-content-center" ref={printPage}>
        {chunk(jsonForExcel(ar) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  tittle={"Balance Receivable Details"}
                  subTittle={`Balance Receivable Details Report as ${formatDate(
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
                            value={v}
                            showGridlines
                            dataKey="id"
                            rowHover
                            emptyMessage="Data Tidak Ditemukan"
                          >
                            <Column
                              className="header-center"
                              header={(e) =>
                                e.props.value ? e.props?.value[0]?.cus : null
                              }
                              style={{ minWidth: "10rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header" || e.type === "footer"
                                      ? "font-weight-bold"
                                      : ""
                                  }
                                >
                                  {e.value.ref}
                                </div>
                              )}
                            />
                            <Column
                              className="header-center"
                              header=""
                              style={{ minWidth: "10rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header" && "font-weight-bold"
                                  }
                                >
                                  {e.value.date}
                                </div>
                              )}
                            />
                            <Column
                              className="header-center"
                              header=""
                              style={{ minWidth: "8rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header" && "font-weight-bold"
                                  }
                                >
                                  {e.value.jt}
                                </div>
                              )}
                            />
                            <Column
                              className="header-center"
                              header=""
                              style={{ minWidth: "10rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold text-right"
                                      : e.type === "footer"
                                      ? "font-weight-bold text-right"
                                      : "text-right"
                                  }
                                >
                                  {e.value.value}
                                </div>
                              )}
                            />
                            <Column
                              className="header-center"
                              header=""
                              style={{ minWidth: "10rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold text-right mr-2"
                                      : e.type === "footer"
                                      ? "font-weight-bold text-right mr-2"
                                      : "text-right mr-2"
                                  }
                                >
                                  {e.value.lns}
                                </div>
                              )}
                            />
                            {/* <Column
                              className="header-center"
                              header=""
                              style={{ minWidth: "10rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold text-right"
                                      : e.type === "footer"
                                      ? "font-weight-bold text-right"
                                      : "text-right"
                                  }
                                >
                                  {e.value.sisa}
                                </div>
                              )}
                            /> */}
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

      <Row>
        <Col>
          <Card>
            <Card.Body>{renderFooter()}</Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="m-0 d-none">
        <Card ref={printPage}>
          <Card.Body className="p-0">
            <CustomeWrapper
              tittle={"Account Receivable Details"}
              subTittle={`Account Receivable Details as of ${formatDate(filtDate)}`}
              onComplete={(cp) => setCp(cp)}
              body={
                <>
                  {jsonForExcel(ar, false)?.map((v) => {
                    return (
                      <DataTable
                        responsiveLayout="scroll"
                        value={v}
                        showGridlines
                        dataKey="id"
                        rowHover
                        emptyMessage="Data Tidak Ditemukan"
                      >
                        <Column
                          className="header-center"
                          header={(e) =>
                            e.props.value ? e.props?.value[0]?.cus : null
                          }
                          style={{ width: "15rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.ref}
                            </div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header=""
                          style={{ width: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" && "font-weight-bold"
                              }
                            >
                              {e.value.date}
                            </div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header=""
                          style={{ width: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" && "font-weight-bold"
                              }
                            >
                              {e.value.jt}
                            </div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header=""
                          style={{ width: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right"
                                  : "text-right"
                              }
                            >
                              {e.value.value}
                            </div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header=""
                          style={{ width: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right"
                                  : "text-right"
                              }
                            >
                              {e.value.lns}
                            </div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header=""
                          style={{ width: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right"
                                  : "text-right"
                              }
                            >
                              {e.value.sisa}
                            </div>
                          )}
                        />
                      </DataTable>
                    );
                  })}
                  <Row className="m-0 mt-5">
                    <div className="text-left font-weight-bold col-6">
                      Total Hutang
                    </div>
                    <div className="col-6 text-right font-weight-bold">
                      Rp. {formatIdr(total)}
                    </div>
                  </Row>
                </>
              }
            />
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default ReportPiutang;
