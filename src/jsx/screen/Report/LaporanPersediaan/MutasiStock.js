import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";

import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import { Dropdown } from "primereact/dropdown";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";

const data = {
};

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const MutasiStock = () => {
  const [mtsi, setMutasi] = useState(null);
  const [produk, setProduk] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtersDate, setFiltersDate] = useState([new Date(), new Date()]);
  const [cp, setCp] = useState("");
  const [selectedSup, setSelected] = useState(null);
  const chunkSize = 4;

  useEffect(() => {
    var d = new Date();
    d.setDate(d.getDate() - 30);
    setFiltersDate([d, new Date()]);

    // initFilters1();
    getMut();
    getSup();
  }, []);

  const getMut = async () => {
    setLoading(true);
    const config = {
      ...endpoints.mutasi,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;

        setMutasi(data);
      }
    } catch (error) {}
  };

  const getSup = async () => {
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
      }
    } catch (error) {}
  };

  const supp = (value) => {
    let selected = {};
    supplier?.forEach((element) => {
      if (value === element.supplier.id) {
        selected = element;
      }
    });

    return selected;
  };

  const jsonForExcel = (mtsi, excel = false) => {
    let data = [];

    mtsi?.forEach((el) => {
      let dt = new Date(`${el?.mtsi_date}Z`);
      if (dt >= filtersDate[0] && dt <= filtersDate[1]) {
        let val = [
          {
            ref: `Mut Code : ${el.mtsi_code}`,
            type: "header",
            value: {
              date: "Mutation Date",
              from: "Mutation Of",
              to: "Mutation To",
              prod: "Product",
              ord: "Quantity",
              unit: "Unit",
            },
          },
        ];

        let total = 0;

        el.mutasi?.forEach((ek) => {
          val.push({
            type: "item",
            value: {
              date: formatDate(el.mtsi_date),
              from: el.loc_from.name,
              to: el.loc_to.name,
              prod: `${ek.prod_id.name} (${ek.prod_id.code})`,
              ord: ek.qty,
              unit: ek.unit_id.code,
            },
          });
          total += ek.qty;
        });

        val.push({
          type: "footer",
          value: {
            date: "Total",
            from: "",
            to: "",
            prod: "",
            ord: total,
            unit: "",
          },
        });
        data.push(val);
      }
    });

    let final = [
      {
        columns: [
          {
            title: "Product Mutation Report",
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
            value: `${ek.value.from}`,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: `${ek.value.to}`,
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
              alignment: { horizontal: "left", vertical: "center" },
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
            width: { wch: 13 },
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
            width: { wch: 12 },
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
            <div className="col-4 mr-3 p-0">
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
                  placeholder="Pilih Tanggal"
                  dateFormat="dd-mm-yy"
                  readOnlyInput
                />
              </div>
            </div>
            <div className="">
              {/* <Dropdown
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
              /> */}
            </div>
          </Row>
        </div>
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`product_mutation_report_export_${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={mtsi ? jsonForExcel(mtsi, true) : null}
                name={"Product Mutation"}
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

      <Row className="m-0 justify-content-center" ref={printPage}>
        {chunk(jsonForExcel(mtsi) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  tittle={"Product Mutation Report"}
                  subTittle={`Product Mutation Report From ${formatDate(
                    filtersDate[0]
                  )} To ${formatDate(filtersDate[1])}`}
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
                            emptyMessage="Tidak Ada Transaksi"
                            className="mt-4"
                          >
                            <Column
                              className="header-center"
                              header={(e) =>
                                e.props.value ? e.props?.value[0]?.ref : null
                              }
                              style={{ width: "11rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header" || e.type === "footer"
                                      ? "font-weight-bold"
                                      : ""
                                  }
                                >
                                  {e.value.date}
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
                                    e.type === "header" && "font-weight-bold"
                                  }
                                >
                                  {e.value.from}
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
                                    e.type === "header" && "font-weight-bold"
                                  }
                                >
                                  {e.value.to}
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
                                    e.type === "header" && "font-weight-bold"
                                  }
                                >
                                  {e.value.prod}
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
                                  e.type === "header" || e.type === "footer"
                                    ? "font-weight-bold"
                                    : ""
                                }
                                >
                                  {e.value.ord}
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
                                    e.type === "header" && "font-weight-bold"
                                  }
                                >
                                  {e.value.unit}
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
  );
};

export default MutasiStock;
