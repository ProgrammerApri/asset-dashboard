import React, { useState, useEffect, useRef } from "react";
import { request } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";

// import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { MultiSelect } from "primereact/multiselect";
import endpoints from "../../../../utils/endpoints";

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportJurnal = ({ trx_code }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acc, setAcc] = useState(null);
  const [selectTrn, setSelectTrn] = useState([]);
  const printPage = useRef(null);
  const [date, setDate] = useState([new Date(), new Date()]);
  const [trans, setTrans] = useState(null);
  const [filtTrn, setFiltTrn] = useState(null);
  const [cp, setCp] = useState("");
  const page = [];
  const chunkSize = 2;

  useEffect(() => {
    var d = new Date();
    d.setDate(d.getDate() - 30);
    setDate([d, new Date()]);
    getTrans(formatDate(d), formatDate(new Date()), trx_code ? trx_code : 0);
    getAcc();
  }, []);

  const getTrans = async (startDate, endDate, trx_code = 0) => {
    console.log(trx_code);
    setLoading(true);
    const config = {
      ...endpoints.reportJurnal,
      endpoint:
        endpoints.reportJurnal.endpoint +
        `${btoa(startDate)}/${btoa(endDate)}/${btoa(trx_code)}`,
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setLoading(false);
        const { data } = response;
        let trx_date = [];
        data.forEach((el) => {
          el.trx.forEach((ek) => {
            trx_date.push(new Date(ek.trx_date + "Z"));
          });
        });
        if (trx_code !== 0) {
          setDate([
            new Date(Math.min(...trx_date)),
            new Date(Math.max(...trx_date)),
          ]);
        }

        let groupTrn = data?.filter(
          (el, i) => i === data.findIndex((ek) => el?.trx_code === ek?.trx_code)
        );

        setTrans(data);
        setFiltTrn(groupTrn);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // const getTrans = async () => {
  //   const config = {
  //     ...endpoints.trans,
  //     data: {},
  //   };
  //   let response = null;
  //   try {
  //     response = await request(null, config);
  //     console.log(response);
  //     if (response.status) {
  //       const { data } = response;
  //       let groupTrn = data?.filter(
  //         (el, i) => i === data.findIndex((ek) => el?.trx_code === ek?.trx_code)
  //       );

  //       setTrans(data);
  //       setFiltTrn(groupTrn);
  //       // jsonForExcel(data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
        setAcc(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkAcc = (value) => {
    let selected = {};
    acc?.forEach((element) => {
      if (value === element.account.id) {
        selected = element;
      }
    });

    return selected;
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

  const jsonForExcel = (new_trans, excel = false) => {
    let data = [];
    // let grouped = trans?.filter(
    //   (el, i) => i === trans.findIndex((ek) => el?.trx_code === ek?.trx_code)
    // );
    // let new_trans = [];

    // if (trx_code) {
    //   grouped?.forEach((el) => {
    //     if (el.trx_code === trx_code) {
    //       let trx = [];
    //       trans?.forEach((ek) => {
    //         if (el.trx_code === ek.trx_code) {
    //           trx.push(ek);
    //         }
    //       });
    //       new_trans.push({
    //         trx_code: el.trx_code,
    //         trx_date: formatDate(el.trx_date),
    //         trx: trx,
    //       });
    //     }
    //   });
    // } else {
    //   console.log("grouped", grouped);
    //   grouped?.forEach((el) => {
    //     let trx_date = new Date(`${el?.trx_date}Z`);
    //     trx_date?.setHours(0, 0, 0, 0);
    //     date[0]?.setHours(0, 0, 0, 0);
    //     date[1]?.setHours(0, 0, 0, 0);
    //     if (trx_date >= date[0] && trx_date <= date[1]) {
    //       let trx = [];
    //       trans?.forEach((ek) => {
    //         if (el.trx_code === ek.trx_code) {
    //           trx.push(ek);
    //         }
    //       });
    //       new_trans.push({
    //         trx_code: el.trx_code,
    //         trx_date: formatDate(el.trx_date),
    //         trx: trx,
    //       });
    //     }
    //   });
    // }

    console.log("new_trans", new_trans);

    if (selectTrn?.length) {
      selectTrn?.forEach((sel) => {
        new_trans?.forEach((el) => {
          if (sel?.trx_code == el.trx_code) {
            let val = [
              {
                trx_code: `No. Transaksi : ${el.trx_code}`,
                trx_date: `${el.trx_date}`,
                type: "header",
                value: {
                  acc: "Account",
                  trx_date: "Tanggal",
                  debit: "Mutasi Debit",
                  kredit: "Mutasi Kredit",
                  desc: "Deskripsi",
                },
              },
            ];
            let k = 0;
            let d = 0;
            el.trx.forEach((ek) => {
              val.push({
                trx_code: `${el.trx_code}`,
                trx_date: `${el.trx_date}`,
                type: "item",
                value: {
                  acc: `${checkAcc(ek?.acc_id)?.account?.acc_code}-${
                    checkAcc(ek?.acc_id)?.account?.acc_name
                  }`,
                  trx_date: `${formatDate(ek.trx_date)}`,
                  debit:
                    ek.trx_dbcr === "D" ? `Rp. ${formatIdr(ek.trx_amnt)}` : "-",
                  kredit:
                    ek.trx_dbcr === "K" ? `Rp. ${formatIdr(ek.trx_amnt)}` : "-",
                  desc: ek.trx_desc,
                },
              });
              k += ek.trx_dbcr === "K" ? ek.trx_amnt : 0;
              d += ek.trx_dbcr === "D" ? ek.trx_amnt : 0;
            });
            val.push({
              trx_code: `${el.trx_code}`,
              trx_date: `${el.trx_date}`,
              type: "footer",
              value: {
                acc: "Total",
                trx_date: "",
                debit: `Rp. ${formatIdr(d)}`,
                kredit: `Rp. ${formatIdr(k)}`,
                desc: "",
              },
            });
            data.push(val);
          }
        });
      });
    } else {
      new_trans?.forEach((el) => {
        let val = [
          {
            trx_code: `No. Transaksi : ${el.trx_code}`,
            trx_date: `${el.trx_date}`,
            type: "header",
            value: {
              acc: "Account",
              trx_date: "Tanggal",
              debit: "Mutasi Debit",
              kredit: "Mutasi Kredit",
              desc: "Deskripsi",
            },
          },
        ];
        let k = 0;
        let d = 0;
        el.trx.forEach((ek) => {
          val.push({
            trx_code: `${el.trx_code}`,
            trx_date: `${el.trx_date}`,
            type: "item",
            value: {
              acc: `${checkAcc(ek?.acc_id)?.account?.acc_code}-${
                checkAcc(ek?.acc_id)?.account?.acc_name
              }`,
              trx_date: `${formatDate(ek.trx_date)}`,
              debit:
                ek.trx_dbcr === "D" ? `Rp. ${formatIdr(ek.trx_amnt)}` : "-",
              kredit:
                ek.trx_dbcr === "K" ? `Rp. ${formatIdr(ek.trx_amnt)}` : "-",
              desc: ek.trx_desc,
            },
          });
          k += ek.trx_dbcr === "K" ? ek.trx_amnt : 0;
          d += ek.trx_dbcr === "D" ? ek.trx_amnt : 0;
        });
        val.push({
          trx_code: `${el.trx_code}`,
          trx_date: `${el.trx_date}`,
          type: "footer",
          value: {
            acc: "Total",
            trx_date: "",
            debit: `Rp. ${formatIdr(d)}`,
            kredit: `Rp. ${formatIdr(k)}`,
            desc: "",
          },
        });
        data.push(val);
      });
    }

    let final = [
      {
        columns: [
          {
            title: "Journal Report",
            width: { wch: 35 },
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
            title: `Period ${formatDate(date[0])} to ${formatDate(date[1])}`,
            width: { wch: 35 },
            style: {
              font: { sz: "14", bold: false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
        ],
        data: [[]],
      },
    ];

    data.forEach((el) => {
      let item = [];
      item.push([
        {
          value: `${el[0].trx_date}`,
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
          value: "",
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
          value: "",
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
          value: "",
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
      ]);
      el.forEach((ek) => {
        item.push([
          {
            value: `${ek.value.acc}`,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: ek.value.trx_date,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: ek.value.debit,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: ek.value.kredit,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: `${ek.value.desc}`,
            style: {
              font: {
                sz: "14",
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
              alignment: { horizontal: "left", vertical: "center" },
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
      ]);

      final.push({
        columns: [
          {
            title: `${el[0].trx_code}`,
            width: { wch: 35 },
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
            width: { wch: 50 },
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

    console.log("data", data);

    if (excel) {
      return final;
    } else {
      // let page = [];
      let total_row = 0;
      data.forEach((el) => {
        el.forEach((element) => {
          page.push(element);
        });
      });

      console.log("PAGE");
      return data;
    }
  };

  const formatIdr = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between mb-3">
        <div className="col-10 ml-0 mr-0 pl-0">
          <Row>
            <div className="p-inputgroup col-3">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar" />
              </span>
              <Calendar
                value={date}
                id="range"
                onChange={(e) => {
                  if (e.value[1]) {
                    getTrans(formatDate(e.value[0]), formatDate(e.value[1]));
                  }
                  setDate(e.value);
                }}
                selectionMode="range"
                placeholder="Pilih Tanggal"
                readOnlyInput
              />
            </div>

            <div className="p-inputgroup col-3">
              <MultiSelect
                value={selectTrn ?? null}
                options={filtTrn}
                onChange={(e) => {
                  setSelectTrn(e.value);
                }}
                placeholder="Pilih Kode Transaksi"
                optionLabel="trx_code"
                showClear
                filterBy="trx_code"
                filter
                display="chip"
                // className="w-full md:w-15rem"
                maxSelectedLabels={3}
              />
            </div>
          </Row>
        </div>
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            {/* <ExcelFile
              filename={`journal_report_export_${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={trans ? jsonForExcel(trans, true) : null}
                name="Journal Report"
              />
            </ExcelFile> */}
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
          {chunk(jsonForExcel(trans) ?? [], chunkSize)?.map((val, idx) => {
            return (
              <Card className="ml-1 mr-1 mt-2">
                <Card.Body className="p-0">
                  <CustomeWrapper
                    tittle={"Transaction Journal"}
                    subTittle={`Transaction Journal for Period ${formatDate(
                      date[0]
                    )} to ${formatDate(date[1])}`}
                    onComplete={(cp) => cp !== "" && setCp(cp)}
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
                                  e.props.value
                                    ? e.props?.value[0]?.trx_code
                                    : null
                                }
                                style={{ width: "15rem" }}
                                body={(e) => (
                                  <div
                                    className={
                                      e.type == "header" || e.type == "footer"
                                        ? "font-weight-bold"
                                        : ""
                                    }
                                  >
                                    {e.value.acc}
                                  </div>
                                )}
                              />
                              <Column
                                className="header-center"
                                header=""
                                style={{ width: "5rem" }}
                                body={(e) => (
                                  <div
                                    className={
                                      e.type == "header" || e.type == "footer"
                                        ? "font-weight-bold"
                                        : ""
                                    }
                                  >
                                    {e.value.trx_date}
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
                                      e.type == "header"
                                        ? "font-weight-bold text-right"
                                        : e.type == "footer"
                                        ? "font-weight-bold text-right"
                                        : "text-right"
                                    }
                                  >
                                    {e.value.debit}
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
                                      e.type == "header"
                                        ? "font-weight-bold text-right mr-4"
                                        : e.type == "footer"
                                        ? "font-weight-bold text-right mr-4"
                                        : "text-right mr-4"
                                    }
                                  >
                                    {e.value.kredit}
                                  </div>
                                )}
                              />
                              <Column
                                className="header-center"
                                header=""
                                style={{ width: "15rem" }}
                                body={(e) => (
                                  <div
                                    className={
                                      e.type == "header"
                                        ? "ml-3 font-weight-bold text-left"
                                        : e.type == "footer"
                                        ? "font-weight-bold text-left"
                                        : "text-left ml-3"
                                    }
                                  >
                                    {e.value.desc}
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

export default ReportJurnal;
