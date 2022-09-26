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

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportHutang = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState(new Date());
  const [supplier, setSupplier] = useState(null);
  const [selectedSup, setSelected] = useState(null);
  const [ap, setAp] = useState(null);
  const [total, setTotal] = useState(null);
  const [cp, setCp] = useState("");
  const chunkSize = 4;

  useEffect(() => {
    getSupplier();
  }, []);

  const getAPCard = async (spl) => {
    const config = {
      ...endpoints.apcard,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let sup = [];
        let total = 0;
        spl.forEach((element) => {
          element.ap = [];
          data.forEach((el) => {
            if (el.trx_type === "LP" && el.pay_type === "P1") {
              if (element.supplier.id === el.sup_id.id) {
                element.ap.push({ ...el, trx_amnh: 0, acq_amnh: 0 });
              }
            }
          });
          element.ap.forEach((el) => {
            data.forEach((ek) => {
              if (el.id === ek.id) {
                el.trx_amnh = ek?.trx_amnh ?? 0;
                el.acq_amnh += ek?.acq_amnh ?? 0;
              }
            });
            total += el?.trx_amnh ?? 0 - el?.acq_amnh ?? 0;
          });
          if (element.ap.length > 0) {
            sup.push(element);
          }
        });
        setAp(sup);
        setTotal(total);

        let grouped = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.sup_id?.id === ek?.sup_id?.id)
        );
        setSupplier(grouped);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSupplier = async () => {
    const config = {
      ...endpoints.supplier,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSupplier(data);
        getAPCard(data);
      }
    } catch (error) {
      console.log(error);
    }
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

  const jsonForExcel = (ap, excel = false) => {
    let data = [];

    if (selectedSup) {
      ap?.forEach((el) => {
        if (selectedSup?.sup_id?.id === el.supplier?.id) {
          let val = [
            {
              sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
              type: "header",
              value: {
                ref: "Invoice",
                date: "Date",
                jt: "Due Date",
                value: "Payable",
                lns: "Payment",
                sisa: "Remain",
              },
            },
          ];
          let amn = 0;
          let acq = 0;
          el.ap.forEach((ek) => {
            let dt = new Date(`${ek.ord_id?.fk_date}Z`);
            if (dt <= filtDate) {
              val.push({
                sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
                type: "item",
                value: {
                  ref: ek.ord_id.fk_code,
                  date: formatDate(ek.ord_id.fk_date),
                  jt: ek.ord_due ? formatDate(ek.ord_due) : "-",
                  value: `Rp. ${formatIdr(ek.trx_amnh)}`,
                  lns: `Rp. ${formatIdr(ek.acq_amnh)}`,
                  sisa: `Rp. ${formatIdr(ek.trx_amnh - ek.acq_amnh)}`,
                },
              });
              amn += ek.trx_amnh;
              acq += ek.acq_amnh;
            }
          });
          val.push({
            sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
            type: "footer",
            value: {
              ref: "Total",
              date: "",
              jt: "",
              value: `Rp. ${formatIdr(amn)}`,
              lns: `Rp. ${formatIdr(acq)}`,
              sisa: `Rp. ${formatIdr(amn - acq)}`,
            },
          });
          data.push(val);
        }
      });
    } else {
      ap?.forEach((el) => {
        let val = [
          {
            sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
            type: "header",
            value: {
              ref: "Invoice",
              date: "Date",
              jt: "Due Date",
              value: "Payable",
              lns: "Payment",
              sisa: "Remain",
            },
          },
        ];
        let amn = 0;
        let acq = 0;
        el.ap.forEach((ek) => {
          let dt = new Date(`${ek.ord_id?.fk_date}Z`);
          if (dt <= filtDate) {
            val.push({
              sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
              type: "item",
              value: {
                ref: ek.ord_id.fk_code,
                date: formatDate(ek.ord_id.fk_date),
                jt: ek.ord_due ? formatDate(ek.ord_due) : "-",
                value: `Rp. ${formatIdr(ek.trx_amnh)}`,
                lns: `Rp. ${formatIdr(ek.acq_amnh)}`,
                sisa: `Rp. ${formatIdr(ek.trx_amnh - ek.acq_amnh)}`,
              },
            });
            amn += ek.trx_amnh;
            acq += ek.acq_amnh;
          }
        });
        val.push({
          sup: `${el.supplier.sup_name} (${el.supplier.sup_code})`,
          type: "footer",
          value: {
            ref: "Total",
            date: "",
            jt: "",
            value: `Rp. ${formatIdr(amn)}`,
            lns: `Rp. ${formatIdr(acq)}`,
            sisa: `Rp. ${formatIdr(amn - acq)}`,
          },
        });
        data.push(val);
      });
    }

    let final = [
      {
        columns: [
          {
            title: "Payable Report",
            width: { wch: 30 },
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
            title: `Periode ${formatDate(filtDate)}`,
            width: { wch: 30 },
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
      el.forEach((ek) => {
        item.push([
          {
            value: `${ek.value.ref}`,
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
            value: `${ek.value.date}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek.value.jt}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek.value.value}`,
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
            value: `${ek.value.lns}`,
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
            value: `${ek.value.sisa}`,
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
            title: `${el[0].sup}`,
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
      <div className="flex justify-content-between">
        <div className="col-6 ml-0 mr-0 pl-0 pt-0">
          <Row className="mt-0">
            <div className="p-inputgroup col-4">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar" />
              </span>
              <Calendar
                value={filtDate}
                onChange={(e) => {
                  console.log(e.value);
                  setFiltDate(e.value);
                }}
                // selectionMode="range"
                placeholder="Pilih Tanggal"
                dateFormat="dd-mm-yy"
              />
            </div>
            <div className="mt-2">
              <Dropdown
                value={selectedSup ?? null}
                options={supplier}
                onChange={(e) => {
                  setSelected(e.value);
                }}
                placeholder="Pilih Supplier"
                optionLabel="sup_id.sup_name"
                filter
                filterBy="sup_id.sup_name"
                showClear
              />
            </div>
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`payable_details_report_${formatDate(new Date())
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
                dataSet={ap ? jsonForExcel(ap, true) : null}
                name="Payable Details Report"
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
        {chunk(jsonForExcel(ap) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  tittle={"Debt Balance Details"}
                  subTittle={`Debt Balance Details as ${formatDate(filtDate)}`}
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
                                e.props.value ? e.props?.value[0]?.sup : null
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
              tittle={"Debt Balance Details"}
              subTittle={`Debt Balance Details as of ${formatDate(filtDate)}`}
              onComplete={(cp) => setCp(cp)}
              body={
                <>
                  {jsonForExcel(ap, false)?.map((v) => {
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
                            e.props.value ? e.props?.value[0]?.sup : null
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

export default ReportHutang;
