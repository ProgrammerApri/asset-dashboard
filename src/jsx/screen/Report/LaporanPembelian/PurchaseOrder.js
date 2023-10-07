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

const data = {};

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportPO = () => {
  const [po, setPo] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtersDate, setFiltersDate] = useState([new Date(), new Date()]);
  const [selectedSup, setSelectedSup] = useState([]);
  const [selectedPo, setSelectedPo] = useState([]);
  const [cp, setCp] = useState("");
  const chunkSize = 10;

  useEffect(() => {
    var d = new Date();
    d.setDate(d.getDate() - 30);
    setFiltersDate([d, new Date()]);

    // initFilters1();
    getPo();
  }, []);

  const getPo = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.po,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setPo(data);
        getCur();

        let groupedSup = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.sup_id?.id === ek?.sup_id?.id)
        );

        setSupplier(groupedSup);
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

  const jsonForExcel = (po, excel = false) => {
    let data = [];
    let cur = 0;

    if (selectedPo?.length) {
      selectedPo?.forEach((sel) => {
        po?.forEach((el) => {
          let tgl_gra = new Date(`${el?.po_date}Z`);

          currency?.forEach((elem) => {
            if (el.sup_id.sup_curren === elem.id) {
              cur = elem.rate;
            }
          });

          if (tgl_gra >= filtersDate[0] && tgl_gra <= filtersDate[1]) {
            if (el?.po_code === sel?.po_code) {
              let val = [
                {
                  ref: `PO Code : ${el.po_code}`,
                  type: "header",
                  value: {
                    date: "Date",
                    rp: "Request Code",
                    sup: tr[localStorage.getItem("language")].pemasok,
                    prod: "Product Name",
                    ord: "Qty",
                    unit: "Unit",
                    prc: "Price",
                    t_prc: "Total Price",
                    st_gra: "Status",
                  },
                },
              ];

              let total = 0;
              let total_qty = 0;
              el.pprod?.forEach((ek) => {
                val.push({
                  type: "item",
                  value: {
                    date: formatDate(el.po_date),
                    rp: el.preq_id?.req_code ?? "-",
                    sup:
                      el.sup_id !== null
                        ? `${el.sup_id?.sup_name} (${el.sup_id?.sup_code})`
                        : "-",
                    prod: `${ek.prod_id?.name} (${ek.prod_id?.code})`,
                    ord: formatIdr(ek.order),
                    unit: ek.unit_id?.name,
                    prc:
                      el.sup_id.sup_curren !== null
                        ? `Rp. ${formatIdr(ek.price * cur)}`
                        : `Rp. ${formatIdr(ek.price)}`,
                    t_prc: `Rp. ${formatIdr(ek.total)}`,
                    st_gra: ek.status === 1 ? "Open" : "Close",
                  },
                });
                total += ek.total;
                total_qty += ek.order;
              });

              val.push({
                // ref: el.kd_gra,
                type: "footer",
                value: {
                  date: "Total",
                  sup: "",
                  prod: "",
                  ord: formatIdr(total_qty),
                  unit: "",
                  prc: "",
                  t_prc: `Rp. ${formatIdr(total)}`,
                },
              });
              data.push(val);
            }
          }
        });
      });
    } else if (selectedSup?.length) {
      selectedSup?.forEach((sup) => {
        po?.forEach((el) => {
          let tgl_gra = new Date(`${el?.po_date}Z`);

          currency?.forEach((elem) => {
            if (el.sup_id.sup_curren === elem.id) {
              cur = elem.rate;
            }
          });

          if (tgl_gra >= filtersDate[0] && tgl_gra <= filtersDate[1]) {
            if (el?.sup_id?.id === sup?.sup_id?.id) {
              let val = [
                {
                  ref: `PO Code : ${el.po_code}`,
                  type: "header",
                  value: {
                    date: "Date",
                    rp: "Request Code",
                    sup: tr[localStorage.getItem("language")].pemasok,
                    prod: "Product Name",
                    ord: "Qty",
                    unit: "Unit",
                    prc: "Price",
                    t_prc: "Total Price",
                    st_gra: "Status",
                  },
                },
              ];

              let total = 0;
              let total_qty = 0;
              el.pprod?.forEach((ek) => {
                val.push({
                  type: "item",
                  value: {
                    date: formatDate(el.po_date),
                    rp: el.preq_id?.req_code ?? "-",
                    sup:
                      el.sup_id !== null
                        ? `${el.sup_id?.sup_name} (${el.sup_id?.sup_code})`
                        : "-",
                    prod: `${ek.prod_id?.name} (${ek.prod_id?.code})`,
                    ord: formatIdr(ek.order),
                    unit: ek.unit_id?.name,
                    prc:
                      el.sup_id.sup_curren !== null
                        ? `Rp. ${formatIdr(ek.price * cur)}`
                        : `Rp. ${formatIdr(ek.price)}`,
                    t_prc: `Rp. ${formatIdr(ek.total)}`,
                    st_gra: ek.status === 1 ? "Open" : "Close",
                  },
                });
                total += ek.total;
                total_qty += ek.order;
              });

              val.push({
                // ref: el.kd_gra,
                type: "footer",
                value: {
                  date: "Total",
                  sup: "",
                  prod: "",
                  ord: formatIdr(total_qty),
                  unit: "",
                  prc: "",
                  t_prc: `Rp. ${formatIdr(total)}`,
                },
              });
              data.push(val);
            }
          }
        });
      });
    } else {
      po?.forEach((el) => {
        let tgl_gra = new Date(`${el?.po_date}Z`);

        currency?.forEach((elem) => {
          if (el.sup_id.sup_curren === elem.id) {
            cur = elem.rate;
          }
        });

        if (tgl_gra >= filtersDate[0] && tgl_gra <= filtersDate[1]) {
          let val = [
            {
              ref: `PO Code : ${el.po_code}`,
              type: "header",
              value: {
                date: "Date",
                rp: "Request Code",
                sup: tr[localStorage.getItem("language")].pemasok,
                prod: "Product Name",
                ord: "Qty",
                unit: "Unit",
                prc: "Price",
                t_prc: "Total Price",
                st_gra: "Status",
              },
            },
          ];

          let total = 0;
          let total_qty = 0;
          el.pprod?.forEach((ek) => {
            val.push({
              type: "item",
              value: {
                date: formatDate(el.po_date),
                rp: el.preq_id?.req_code ?? "-",
                sup:
                  el.sup_id !== null
                    ? `${el.sup_id?.sup_name} (${el.sup_id?.sup_code})`
                    : "-",
                prod: `${ek.prod_id?.name} (${ek.prod_id?.code})`,
                ord: formatIdr(ek.order),
                unit: ek.unit_id?.name,
                prc:
                  el.sup_id.sup_curren !== null
                    ? `Rp. ${formatIdr(ek.price * cur)}`
                    : `Rp. ${formatIdr(ek.price)}`,
                t_prc: `Rp. ${formatIdr(ek.total)}`,
                st_gra: ek.status === 1 ? "Open" : "Close",
              },
            });
            total += ek.total;
            total_qty += ek.order;
          });

          val.push({
            // ref: el.kd_gra,
            type: "footer",
            value: {
              date: "Total",
              sup: "",
              prod: "",
              ord: formatIdr(total_qty),
              unit: "",
              prc: "",
              t_prc: `Rp. ${formatIdr(total)}`,
            },
          });
          data.push(val);
        }
      });
    }

    let final = [
      {
        columns: [
          {
            title: "Purchase Order Report",
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
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek.value.rp}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek.value.sup}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
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
            value: `${ek.value.unit}`,
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
            value: `${ek.value.t_prc}`,
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
            value: `${ek.value.st_gra}`,
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
            width: { wch: 35 },
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
            width: { wch: 10 },
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
            width: { wch: 10 },
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
      let page = [];

      data?.forEach((element) => {
        element?.forEach((el) => {
          page.push(el);
        });
      });
      console.log("page");
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
                value={selectedPo ?? null}
                options={po}
                onChange={(e) => {
                  setSelectedPo(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_kd_ord}
                optionLabel="po_code"
                showClear
                filterBy="po_code"
                filter
                display="chip"
                maxSelectedLabels={3}
              />
            </div>
            <div className="p-inputgroup col-3">
              <MultiSelect
                value={selectedSup ?? null}
                options={supplier}
                onChange={(e) => {
                  setSelectedSup(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")].pilih_sup}
                optionLabel="sup_id.sup_name"
                showClear
                filterBy="sup_id.sup_name"
                filter
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
              json={po ? jsonForExcel(po, true) : null}
              filename={`purchase_order_report_export_${new Date().getTime()}`}
              sheetname="report"
            /> */}

            <ExcelFile
              filename={`purchase_order_report_export_${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={po ? jsonForExcel(po, true) : null}
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

  const formatTh = (value) => {
    return `${value}`
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
        {chunk(jsonForExcel(po) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-0">
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  viewOnly
                  horizontal
                  tittle={"Purchase Order Report"}
                  subTittle={`Purchase Order Report From ${formatDate(
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
                                <div className="col-1">{v.value?.date}</div>
                                <div className="col-1">{v.value?.rp}</div>
                                <div className="col-2">{v.value?.sup}</div>
                                <div className="col-2">{v.value?.prod}</div>
                                <div className="col-1 text-right ">
                                  {v.value?.ord}
                                </div>
                                <div className="col-1">{v.value?.unit}</div>
                                <div className="col-1 text-right ">
                                  {v.value?.prc}
                                </div>
                                <div className="col-2 text-right ">
                                  {v.value?.t_prc}
                                </div>
                                <div className="col-1 text-center ">
                                  {v.value?.st_gra}
                                </div>
                              </div>
                            </>
                          );
                        } else if (v.type === "item") {
                          return (
                            <>
                              <div className="item-report row m-0">
                                <div className="col-1">{v.value?.date}</div>
                                <div className="col-1">{v.value?.rp}</div>
                                <div className="col-2">{v.value?.sup}</div>
                                <div className="col-2">{v.value?.prod}</div>
                                <div className="col-1 text-right ">
                                  {v.value?.ord}
                                </div>
                                <div className="col-1">{v.value?.unit}</div>
                                <div className="col-1 text-right ">
                                  {v.value?.prc}
                                </div>
                                <div className="col-2 text-right ">
                                  {v.value?.t_prc}
                                </div>
                                <div className="col-1 text-center ">
                                  {v.value?.st_gra}
                                </div>
                              </div>
                            </>
                          );
                        } else if (v.type === "footer") {
                          return (
                            <>
                              <div className="footer-report row m-0 mb-5">
                                <div className="col-1">{v.value?.date}</div>
                                <div className="col-1">{v.value?.rp}</div>
                                <div className="col-2">{v.value?.sup}</div>
                                <div className="col-2">{v.value?.prod}</div>
                                <div className="col-1 text-right ">
                                  {v.value?.ord}
                                </div>
                                <div className="col-1">{v.value?.unit}</div>
                                <div className="col-1 text-right ">
                                  {v.value?.prc}
                                </div>
                                <div className="col-2 text-right ">
                                  {v.value?.t_prc}
                                </div>
                                <div className="col-1 text-center ">
                                  {v.value?.st_gra}
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
        <Card className="ml-1 mr-1 mt-0">
          <Card.Body className="p-0 m-0" ref={printPage}>
            {chunk(jsonForExcel(po) ?? [], chunkSize)?.map((val, idx) => {
              return (
                <Card className="ml-1 mr-1 mt-0">
                  <Card.Body className="p-0 m-0">
                    <CustomeWrapper
                      horizontal
                      tittle={"Purchase Order Report"}
                      subTittle={`Purchase Order Report From ${formatDate(
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
                                    <div className="col-1">{v.value?.date}</div>
                                    <div className="col-1">{v.value?.rp}</div>
                                    <div className="col-2">{v.value?.sup}</div>
                                    <div className="col-2">{v.value?.prod}</div>
                                    <div className="col-1 text-right ">
                                      {v.value?.ord}
                                    </div>
                                    <div className="col-1">{v.value?.unit}</div>
                                    <div className="col-2 text-right ">
                                      {v.value?.prc}
                                    </div>
                                    <div className="col-1 text-right ">
                                      {v.value?.t_prc}
                                    </div>
                                    <div className="col-1 text-center ">
                                      {v.value?.st_gra}
                                    </div>
                                  </div>
                                </>
                              );
                            } else if (v.type === "item") {
                              return (
                                <>
                                  <div className="item-report row m-0">
                                    <div className="col-1">{v.value?.date}</div>
                                    <div className="col-1">{v.value?.rp}</div>
                                    <div className="col-2">{v.value?.sup}</div>
                                    <div className="col-2">{v.value?.prod}</div>
                                    <div className="col-1 text-right ">
                                      {v.value?.ord}
                                    </div>
                                    <div className="col-1">{v.value?.unit}</div>
                                    <div className="col-2 text-right ">
                                      {v.value?.prc}
                                    </div>
                                    <div className="col-1 text-right ">
                                      {v.value?.t_prc}
                                    </div>
                                    <div className="col-1 text-center ">
                                      {v.value?.st_gra}
                                    </div>
                                  </div>
                                </>
                              );
                            } else if (v.type === "footer") {
                              return (
                                <>
                                  <div className="footer-report row m-0 mb-5">
                                    <div className="col-1">{v.value?.date}</div>
                                    <div className="col-1">{v.value?.rp}</div>
                                    <div className="col-2">{v.value?.sup}</div>
                                    <div className="col-2">{v.value?.prod}</div>
                                    <div className="col-1 text-right ">
                                      {v.value?.ord}
                                    </div>
                                    <div className="col-1">{v.value?.unit}</div>
                                    <div className="col-2 text-right ">
                                      {v.value?.prc}
                                    </div>
                                    <div className="col-1 text-right ">
                                      {v.value?.t_prc}
                                    </div>
                                    <div className="col-1 text-center ">
                                      {v.value?.st_gra}
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

export default ReportPO;
