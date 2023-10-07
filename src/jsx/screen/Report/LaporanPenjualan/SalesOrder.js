import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button, Card, Col, Row } from "react-bootstrap";
import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import { Dropdown } from "primereact/dropdown";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
// import ExcelExportHelper from "../../../components/ExportExcel/ExcelExportHelper";
import { MultiSelect } from "primereact/multiselect";
import { tr } from "../../../../data/tr";

const data = {
  id: 0,
  ord_code: null,
  ord_date: null,
  faktur: null,
  po_id: null,
  dep_id: null,
  sup_id: null,
  top: null,
  due_date: null,
  split_inv: null,
  prod_disc: null,
  jasa_disc: null,
  total_disc: null,
  dprod: [],
  djasa: [],
};

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportSO = () => {
  const [so, setSo] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtersDate, setFiltersDate] = useState([new Date(), new Date()]);
  const [selectedSo, setSelectedSo] = useState([]);
  const [selectedCus, setSelectedCus] = useState([]);
  const [cp, setCp] = useState("");
  const chunkSize = 10;

  useEffect(() => {
    var d = new Date();
    d.setDate(d.getDate() - 30);
    setFiltersDate([d, new Date()]);

    // initFilters1();
    getSo();
  }, []);

  const getSo = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.so,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSo(data);
        getCur();

        let groupedCus = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.pel_id?.id === ek?.pel_id?.id)
        );

        setCustomer(groupedCus);
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

  const getCur = async () => {
    const config = {
      ...endpoints.currency,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setCurrency(data);
      }
    } catch (error) {}
  };

  const jsonForExcel = (so, excel = false) => {
    let data = [];
    let cur = 0;

    if (selectedSo?.length) {
      selectedSo?.forEach((sel) => {
        so?.forEach((el) => {
          currency?.forEach((elem) => {
            if (el.pel_id.cus_curren === elem.id) {
              cur = elem.rate;
            }
          });

          // if (el.status !== 2) {
          let tgl_gra = new Date(`${el?.so_date}Z`);
          if (tgl_gra >= filtersDate[0] && tgl_gra <= filtersDate[1]) {
            if (el?.so_code === sel?.so_code) {
              let val = [
                {
                  ref: `${el.so_code}`,
                  type: "header",
                  value: {
                    date: "Date",
                    prod: "Product",
                    cus: "Customer",
                    ord: "Quantity",
                    unit: "Unit",
                    prc: "Price",
                    total: "Total",
                  },
                },
              ];

              let total_amnt = 0;
              let total_qty = 0;

              el.sprod?.forEach((ek) => {
                val.push({
                  type: "item",
                  value: {
                    date: formatDate(el.so_date),
                    prod: `(${ek.prod_id.code}) ${ek.prod_id.name} `,
                    cus:
                      el.pel_id !== null
                        ? `(${el.pel_id.cus_code}) ${el.pel_id.cus_name}`
                        : "-",
                    ord: formatIdr(ek.order),
                    unit: ek.prod_id.unit && ek.unit_id.name,
                    prc:
                      el.pel_id.cus_curren !== null
                        ? `Rp. ${formatIdr(ek.price * cur)}`
                        : `Rp. ${formatIdr(ek.price)}`,
                    total: `Rp. ${formatIdr(ek.total)}`,
                  },
                });

                total_qty += ek?.order;
                total_amnt += ek?.total;
              });

              val.push({
                type: "footer",
                value: {
                  date: "Total",
                  prod: ``,
                  cus: "",
                  ord: formatIdr(total_qty),
                  unit: "",
                  prc: "",
                  total: `Rp. ${formatIdr(total_amnt)}`,
                },
              });

              data.push(val);
            }
          }
          // }
        });
      });
    } else if (selectedCus?.length) {
      selectedCus?.forEach((cus) => {
        so?.forEach((el) => {
          currency?.forEach((elem) => {
            if (el.pel_id.cus_curren === elem.id) {
              cur = elem.rate;
            }
          });

          // if (el.status !== 2) {
          let tgl_gra = new Date(`${el?.so_date}Z`);
          if (tgl_gra >= filtersDate[0] && tgl_gra <= filtersDate[1]) {
            if (el?.pel_id?.id === cus?.pel_id?.id) {
              let val = [
                {
                  ref: `${el.so_code}`,
                  type: "header",
                  value: {
                    date: "Date",
                    prod: "Product",
                    cus: "Customer",
                    ord: "Quantity",
                    unit: "Unit",
                    prc: "Price",
                    total: "Total",
                  },
                },
              ];

              let total_amnt = 0;
              let total_qty = 0;

              el.sprod?.forEach((ek) => {
                val.push({
                  type: "item",
                  value: {
                    date: formatDate(el.so_date),
                    prod: `(${ek.prod_id.code}) ${ek.prod_id.name} `,
                    cus:
                      el.pel_id !== null
                        ? `(${el.pel_id.cus_code}) ${el.pel_id.cus_name}`
                        : "-",
                    ord: formatIdr(ek.order),
                    unit: ek.prod_id.unit && ek.unit_id.name,
                    prc:
                      el.pel_id.cus_curren !== null
                        ? `Rp. ${formatIdr(ek.price * cur)}`
                        : `Rp. ${formatIdr(ek.price)}`,
                    total: `Rp. ${formatIdr(ek.total)}`,
                  },
                });

                total_qty += ek?.order;
                total_amnt += ek?.total;
              });

              val.push({
                type: "footer",
                value: {
                  date: "Total",
                  prod: ``,
                  cus: "",
                  ord: formatIdr(total_qty),
                  unit: "",
                  prc: "",
                  total: `Rp. ${formatIdr(total_amnt)}`,
                },
              });

              data.push(val);
            }
          }
        });
      });
    } else {
      so?.forEach((el) => {
        currency?.forEach((elem) => {
          if (el.pel_id.cus_curren === elem.id) {
            cur = elem.rate;
          }
        });

        // if (el.status !== 2) {
        let tgl_gra = new Date(`${el?.so_date}Z`);
        if (tgl_gra >= filtersDate[0] && tgl_gra <= filtersDate[1]) {
          let val = [
            {
              ref: `${el.so_code}`,
              type: "header",
              value: {
                date: "Date",
                prod: "Product",
                cus: "Customer",
                ord: "Quantity",
                unit: "Unit",
                prc: "Price",
                total: "Total",
              },
            },
          ];

          let total_amnt = 0;
          let total_qty = 0;

          el.sprod?.forEach((ek) => {
            val.push({
              type: "item",
              value: {
                date: formatDate(el.so_date),
                prod: `(${ek.prod_id.code}) ${ek.prod_id.name} `,
                cus:
                  el.pel_id !== null
                    ? `(${el.pel_id.cus_code}) ${el.pel_id.cus_name}`
                    : "-",
                ord: formatIdr(ek.order),
                unit: ek.prod_id.unit && ek.unit_id.name,
                prc:
                  el.pel_id.cus_curren !== null
                    ? `Rp. ${formatIdr(ek.price * cur)}`
                    : `Rp. ${formatIdr(ek.price)}`,
                total: `Rp. ${formatIdr(ek.total)}`,
              },
            });

            total_qty += ek?.order;
            total_amnt += ek?.total;
          });

          val.push({
            type: "footer",
            value: {
              date: "Total",
              prod: ``,
              cus: "",
              ord: formatIdr(total_qty),
              unit: "",
              prc: "",
              total: `Rp. ${formatIdr(total_amnt)}`,
            },
          });

          data.push(val);
        }
        // }
      });
    }

    let final = [
      {
        columns: [
          {
            title: "Sales Order report",
            width: { wch: 30 },
            style: {
              font: { sz: "16", bold: true },
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
            title: `Period ${formatDate(filtersDate[0])} to ${formatDate(
              filtersDate[1]
            )}`,
            width: { wch: 30 },
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
      el.forEach((ek) => {
        item.push([
          {
            value: `${ek.value.date}`,
            style: {
              font: {
                sz: "14",
                bold:
                  ek.type === "header" || ek.type === "footer" ? true : false,
              },
              alignment: { horizontal: "center", vertical: "center" },
            },
          },
          {
            value: `${ek.value.prod}`,
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
            value: `${ek.value.cus}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: ek.value.ord,
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
            value: `${ek?.value?.unit}`,
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
            value: `${ek.value.prc}`,
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
            value: `${ek.value.total}`,
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
      ]);

      final.push({
        columns: [
          {
            title: `${el[0].ref}`,
            width: { wch: 20 },
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
          {
            title: "",
            width: { wch: 15 },
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
            width: { wch: 15 },
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
            width: { wch: 15 },
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
            width: { wch: 15 },
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
      let page = [];

      data?.forEach((element) => {
        element?.forEach((el) => {
          page.push(el);
        });
      });
      console.log("page===");
      console.log(page);
      return page;
    }
  };

  const initFilters1 = () => {
    setFiltersDate({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-8 ml-0 mr-0 pl-0">
          <Row className="m-0">
            <div className="col-3 mr-3 p-0 mt-2">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-calendar" />
                </span>
                <Calendar
                  value={filtersDate}
                  onChange={(e) => {
                    setFiltersDate(e.value);
                  }}
                  selectionMode="range"
                  placeholder={tr[localStorage.getItem("language")].pilih_tgl}
                  dateFormat="dd-mm-yy"
                  readOnlyInput
                />
              </div>
            </div>
            <div className="p-inputgroup col-3">
              <MultiSelect
                value={selectedSo ?? null}
                options={so}
                onChange={(e) => {
                  setSelectedSo(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_kd_req}
                optionLabel="so_code"
                filter
                filterBy="so_code"
                showClear
                display="chip"
                maxSelectedLabels={3}
              />
            </div>
            <div className="p-inputgroup col-3">
              <MultiSelect
                value={selectedCus ?? null}
                options={customer}
                onChange={(e) => {
                  setSelectedCus(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_cus}
                optionLabel="pel_id.cus_name"
                filter
                filterBy="pel_id.cus_name"
                showClear
                display="chip"
                maxSelectedLabels={3}
              />
            </div>
          </Row>
        </div>
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            {/* <ExcelExportHelper
              json={so ? jsonForExcel(so, true) : null}
              filename={`sales_order_report_export_${new Date().getTime()}`}
              sheetname="report"
            /> */}

            <ExcelFile
              filename={`sales_order_report_export_${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={so ? jsonForExcel(so, true) : null}
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
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const formatIdr = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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

      <Row className="m-0 justify-content-center">
        {chunk(jsonForExcel(so) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-0">
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  viewOnly
                  horizontal
                  tittle={"Sales Order report"}
                  subTittle={`Sales Order report From ${formatDate(
                    filtersDate[0]
                  )} To ${formatDate(filtersDate[1])}`}
                  onComplete={(cp) => setCp(cp)}
                  page={idx + 1}
                  body={
                    <>
                      {val.map((v) => {
                        if (v.type === "header") {
                          return (
                            <>
                              <div className="header-report single">
                                {v.ref}
                              </div>
                              <div className="header-report row m-0">
                                <div className="col-2">{v.value?.date}</div>
                                <div className="col-2">{v.value?.cus}</div>
                                <div className="col-2">{v.value?.prod}</div>
                                <div className="col-1 text-right ">
                                  {v.value?.ord}
                                </div>
                                <div className="col-1">{v.value?.unit}</div>
                                <div className="col-2 text-right ">
                                  {v.value?.prc}
                                </div>
                                <div className="col-2 text-right ">
                                  {v.value?.total}
                                </div>
                              </div>
                            </>
                          );
                        } else if (v.type === "item") {
                          return (
                            <>
                              <div className="item-report row m-0">
                                <div className="col-2">{v.value?.date}</div>
                                <div className="col-2">{v.value?.cus}</div>
                                <div className="col-2">{v.value?.prod}</div>
                                <div className="col-1 text-right ">
                                  {v.value?.ord}
                                </div>
                                <div className="col-1">{v.value?.unit}</div>
                                <div className="col-2 text-right ">
                                  {v.value?.prc}
                                </div>
                                <div className="col-2 text-right ">
                                  {v.value?.total}
                                </div>
                              </div>
                            </>
                          );
                        } else if (v.type === "footer") {
                          return (
                            <>
                              <div className="footer-report row m-0 mb-5">
                                <div className="col-2">{v.value?.date}</div>
                                <div className="col-2">{v.value?.cus}</div>
                                <div className="col-2">{v.value?.prod}</div>
                                <div className="col-1 text-right ">
                                  {v.value?.ord}
                                </div>
                                <div className="col-1">{v.value?.unit}</div>
                                <div className="col-2 text-right ">
                                  {v.value?.prc}
                                </div>
                                <div className="col-2 text-right ">
                                  {v.value?.total}
                                </div>
                              </div>
                            </>
                          );
                        }
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
            {chunk(jsonForExcel(so) ?? [], chunkSize)?.map((val, idx) => {
              return (
                <Card className="ml-1 mr-1 mt-0">
                  <Card.Body className="p-0 m-0">
                    <CustomeWrapper
                      horizontal
                      tittle={"Sales Order report"}
                      subTittle={`Sales Order report From ${formatDate(
                        filtersDate[0]
                      )} To ${formatDate(filtersDate[1])}`}
                      onComplete={(cp) => setCp(cp)}
                      page={idx + 1}
                      body={
                        <>
                          {val.map((v) => {
                            if (v.type === "header") {
                              return (
                                <>
                                  <div className="header-report single">
                                    {v.ref}
                                  </div>
                                  <div className="header-report row m-0">
                                    <div className="col-2">{v.value?.date}</div>
                                    <div className="col-2">{v.value?.cus}</div>
                                    <div className="col-2">{v.value?.prod}</div>
                                    <div className="col-1 text-right ">
                                      {v.value?.ord}
                                    </div>
                                    <div className="col-1">{v.value?.unit}</div>
                                    <div className="col-2 text-right ">
                                      {v.value?.prc}
                                    </div>
                                    <div className="col-2 text-right ">
                                      {v.value?.total}
                                    </div>
                                  </div>
                                </>
                              );
                            } else if (v.type === "item") {
                              return (
                                <>
                                  <div className="item-report row m-0">
                                    <div className="col-2">{v.value?.date}</div>
                                    <div className="col-2">{v.value?.cus}</div>
                                    <div className="col-2">{v.value?.prod}</div>
                                    <div className="col-1 text-right ">
                                      {v.value?.ord}
                                    </div>
                                    <div className="col-1">{v.value?.unit}</div>
                                    <div className="col-2 text-right ">
                                      {v.value?.prc}
                                    </div>
                                    <div className="col-2 text-right ">
                                      {v.value?.total}
                                    </div>
                                  </div>
                                </>
                              );
                            } else if (v.type === "footer") {
                              return (
                                <>
                                  <div className="footer-report row m-0 mb-5">
                                    <div className="col-2">{v.value?.date}</div>
                                    <div className="col-2">{v.value?.cus}</div>
                                    <div className="col-2">{v.value?.prod}</div>
                                    <div className="col-1 text-right ">
                                      {v.value?.ord}
                                    </div>
                                    <div className="col-1">{v.value?.unit}</div>
                                    <div className="col-2 text-right ">
                                      {v.value?.prc}
                                    </div>
                                    <div className="col-2 text-right ">
                                      {v.value?.total}
                                    </div>
                                  </div>
                                </>
                              );
                            }
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

export default ReportSO;
