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
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
// import { connectUrl } from "src/data/config";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Pnl = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [date, setDate] = useState(new Date());
  const [project, setProject] = useState(null);
  const [account, setAccount] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [cp, setCp] = useState("");
  const chunkSize = 30;
  const [maxDate, setMaxDate] = useState(new Date().getMonth() + 1);
  const [maxYear, setMaxYear] = useState(new Date().getFullYear() + 1);

  useEffect(() => {
    getProject();
    getReport(
      formatDate(new Date(date.getFullYear(), date.getMonth(), 1)),
      formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
      0,
      0
    );
  }, []);

  const getProject = async () => {
    const config = {
      ...endpoints.project,
      // base_url: connectUrl,
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
        setProject(data);
      }
    } catch (error) {}
  };

  const getReport = async (start, end, project, product) => {
    setLoading(true);
    const config = {
      ...endpoints.reportPnl,
      endpoint:
        endpoints.reportPnl.endpoint +
        `${btoa(start)}/${btoa(end)}/${btoa(project)}/${btoa(product)}`,
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        console.log(data);
        setReport(data);
      }
    } catch (error) {}

    setLoading(false);
  };

  const formatDate = (date) => {
    if (typeof date === "string") {
      var d = new Date(`${date}Z`),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();
    } else {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();
    }

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  const jsonForExcel = (acc, excel = false) => {
    let data = [];

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

    return final;
  };

  const formatIdr = (value) => {
    if (value < 0) {
      return `(Rp. ${`${value?.toFixed(2)}`
        .replace("-", "")
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")})`;
    }
    return `Rp. ${`${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between mb-3">
        <div className="row align-items-center">
          <div className="col-6">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar" />
              </span>
              <Calendar
                value={date}
                id="range"
                onChange={(e) => {
                  setDate(e.value);
                  getReport(
                    formatDate(
                      new Date(e.value.getFullYear(), e.value.getMonth(), 1)
                    ),
                    formatDate(
                      new Date(e.value.getFullYear(), e.value.getMonth() + 1, 0)
                    ),
                    0,
                    0
                  );
                }}
                // selectionMode="range"
                placeholder="Pilih Tanggal"
                view="month"
                dateFormat="MM-yy"
                maxDate={new Date(maxYear, maxDate - 1, 1)}
              />
            </div>
          </div>
          <div className={loading ? "col-5" : "col-6"}>
            <div className="p-inputgroup">
              <Dropdown
                value={selectedProject}
                options={project && project}
                onChange={(a) => {
                  setSelectedProject(a.value)
                  getReport(
                    formatDate(
                      new Date(date.getFullYear(), date.getMonth(), 1)
                    ),
                    formatDate(
                      new Date(date.getFullYear(), date.getMonth() + 1, 0)
                    ),
                    a?.value?.id ?? 0,
                    0
                  );
                }}
                optionLabel={(option) => (
                  <div>
                    {option !== null ? `${option.proj_code} ${option.proj_name}` : ""}
                  </div>
                )}
                filter
                filterBy="proj_name"
                placeholder="Pilih Project"
                showClear
                itemTemplate={(option) => (
                  <div>
                    {option !== null ? `${option.proj_code} ${option.proj_name}` : ""}
                  </div>
                )}
              />
            </div>
          </div>
          {loading && (
            <ProgressSpinner
              style={{ width: "20px", height: "20px" }}
              strokeWidth="8"
              fill="transparent"
              animationDuration=".5s"
            />
          )}
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
          {chunk(report ?? [], chunkSize)?.map((val, idx) => {
            return (
              <Card className="ml-1 mr-1 mt-2">
                <Card.Body className="p-0">
                  <CustomeWrapper
                    tittle={"Profit/Loss Report"}
                    subTittle={`Profit/Loss Report as of ${formatDate(date)}`}
                    onComplete={(cp) => setCp(cp)}
                    page={idx + 1}
                    body={
                      <Row className="px-2">
                        {val.map((v) => {
                          if (v.type === "header") {
                            return (
                              <div
                                className="col-12 text-left p-component"
                                style={{
                                  background: "var(--input-bg)",
                                  padding: "1rem 1rem",
                                  color: "var(--text-color",
                                  fontWeight: "500",
                                }}
                              >
                                {v.label}
                              </div>
                            );
                          }
                          if (v.type === "body") {
                            return (
                              <div
                                className="col-12 text-left p-component flex justify-content-between"
                                style={{
                                  padding: "0.7rem 1rem",
                                  color: "var(--text-color",
                                  borderBottom: "1px solid var(--border-color)",
                                }}
                              >
                                <div className="ml-4">{v.label}</div>
                                <div className="text-right">
                                  {formatIdr(v.value)}
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div
                              className="col-12 text-left font-bold p-component flex justify-content-between"
                              style={{
                                padding: "0.7rem 1rem",
                                color: "var(--text-color",
                                borderBottom: "1px solid var(--border-color)",
                              }}
                            >
                              <div>{v.label}</div>
                              <div className="text-right">
                                {formatIdr(v.value)}
                              </div>
                            </div>
                          );
                        })}
                      </Row>
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
