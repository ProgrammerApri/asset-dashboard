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

const ReportGRA = () => {
  const [gra, setGra] = useState(null);
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
    getOrd();
  }, []);

  const getOrd = async (isUpdate = false) => {
    setLoading(true);
    const config = {
      ...endpoints.order,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        // let gra = [];
        // data.forEach((element) => {
        //   element.dprod.forEach((el) => {
        //     gra.push({
        //       kd_gra: element.ord_code,
        //       tgl_gra: element.ord_date,
        //       no_po: element.po_id.po_code,
        //       kd_sup: element.sup_id.sup_code,
        //       nm_sup: element.sup_id.sup_name,
        //       prod_kd: el.prod_id.code,
        //       prod_nm: el.prod_id.name,
        //       sat: el.unit_id.code,
        //       ord: el.order,
        //       prc: el.price,
        //       total: el.total,
        //     });
        //   });
        // });
        setGra(data);
        let grouped = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.sup_id?.id === ek?.sup_id?.id)
        );
        setSupplier(grouped);
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

  const getProduk = async () => {
    const config = {
      ...endpoints.product,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setProduk(data);
      }
    } catch (error) {}
  };

  const exportExcel = () => {
    let data = [];
    gra.forEach((el) => {
      data.push({
        Nomor_GRA: el.ord_code,
        Tanggal: formatDate(el.ord_date),
        Nomor_PO: el.po_id.po_code,
        Kode_Supplier: el.sup_id.sup_code,
        Nama_Supplier: el.sup_id.sup_name,
        Kode_Barang: el.dprod.prod_id,
        Nama_Barang: el.dprod.prod_id,
        Satuan: el.dprod.unit_id,
        Jumlah: el.dprod.order,
        Harga: el.dprod.price,
      });
    });

    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "reportGRA");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const jsonForExcel = (gra, excel = false) => {
    let data = [];
    // let grouped = gra?.filter(
    //   (el, i) => i === gra.findIndex((ek) => el?.kd_gra === ek?.kd_gra)
    // );
    // let new_gra = [];
    // grouped?.forEach((el) => {
    //       let trx = [];
    //       gra?.forEach((ek) => {
    //         if (el.kd_gra === ek.kd_gra) {
    //           trx.push(ek);
    //         }
    //       });
    //       new_gra.push({
    //         kd_gra: el.kd_gra,
    //         tgl_gra: formatDate(el.tgl_gra),
    //         trx: trx,
    //       });
    //     }
    //   }
    // });
    if (selectedSup) {
      gra?.forEach((el) => {
        let tgl_gra = new Date(`${el?.ord_date}Z`);
        if (tgl_gra >= filtersDate[0] && tgl_gra <= filtersDate[1]) {
          if (selectedSup?.sup_id?.id === el.sup_id?.id) {
            let val = [
              {
                ref: `No. Trans : ${el.ord_code}`,
                type: "header",
                // style: { font: { sz: "14", bold: true } },
                value: {
                  date: "Date",
                  po: "PO Code",
                  sup: "Supplier",
                  prod: "Product Name",
                  ord: "Quantity",
                  unit: "Unit",
                  prc: "Price",
                  tot: "Total",
                },
              },
            ];

            let total = 0;
            el.dprod?.forEach((ek) => {
              val.push({
                // ref: el.kd_gra,
                type: "item",
                value: {
                  date: formatDate(el.ord_date),
                  po: el.po_id.po_code,
                  sup: `${el.sup_id.sup_name} (${el.sup_id.sup_name})`,
                  prod: `${ek.prod_id.name} (${ek.prod_id.code})`,
                  ord: ek.order,
                  unit: ek.unit_id.name,
                  prc: `Rp. ${formatIdr(ek.price)}`,
                  tot: `Rp. ${formatIdr(ek.total)}`,
                },
              });
              total += ek.total;
            });

            val.push({
              // ref: el.kd_gra,
              type: "footer",
              value: {
                date: "Total",
                po: "",
                sup: "",
                prod: "",
                ord: "",
                unit: "",
                prc: "",
                tot: `Rp. ${formatIdr(total)}`,
              },
            });
            data.push(val);
          }
        }
      });
    } else {
      gra?.forEach((el) => {
        let tgl_gra = new Date(`${el?.ord_date}Z`);
        if (tgl_gra >= filtersDate[0] && tgl_gra <= filtersDate[1]) {
          let val = [
            {
              ref: `No. Trans : ${el.ord_code}`,
              type: "header",
              // style: { font: { sz: "14", bold: true } },
              value: {
                date: "Date",
                po: "PO Code",
                sup: "Supplier",
                prod: "Product Name",
                ord: "Quantity",
                unit: "Unit",
                prc: "Price",
                tot: "Total",
              },
            },
          ];

          let total = 0;
          el.dprod?.forEach((ek) => {
            val.push({
              // ref: el.kd_gra,
              type: "item",
              value: {
                date: formatDate(el.ord_date),
                po: el.po_id.po_code,
                sup: `${el.sup_id.sup_name} (${el.sup_id.sup_name})`,
                prod: `${ek.prod_id.name} (${ek.prod_id.code})`,
                ord: ek.order,
                unit: ek.unit_id.name,
                prc: `Rp. ${formatIdr(ek.price)}`,
                tot: `Rp. ${formatIdr(ek.total)}`,
              },
            });
            total += ek.total;
          });

          val.push({
            // ref: el.kd_gra,
            type: "footer",
            value: {
              date: "Total",
              po: "",
              sup: "",
              prod: "",
              ord: "",
              unit: "",
              prc: "",
              tot: `Rp. ${formatIdr(total)}`,
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
            title: "Purchase Report",
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
            value: `${ek.value.po}`,
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
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: `${ek.value.ord}`,
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
            value: `${ek.value.tot}`,
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
            <div className="col-3 mr-3 p-0">
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
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`purchase_report_export_${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={gra ? jsonForExcel(gra, true) : null}
                name={"Purchase"}
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
        {chunk(jsonForExcel(gra) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  tittle={"Purchase Report"}
                  subTittle={`Purchase Report From ${formatDate(
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
                                  {e.value.po}
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
                                  {e.value.sup}
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
                                    e.type === "header" && "font-weight-bold"
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
                            <Column
                              className="header-center"
                              header=""
                              style={{ minWidht: "10rem" }}
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
                                  {e.value.prc}
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
                                    e.type === "header"
                                      ? "font-weight-bold text-right"
                                      : e.type === "footer"
                                      ? "font-weight-bold text-right"
                                      : "text-right"
                                  }
                                >
                                  {e.value.tot}
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

export default ReportGRA;
