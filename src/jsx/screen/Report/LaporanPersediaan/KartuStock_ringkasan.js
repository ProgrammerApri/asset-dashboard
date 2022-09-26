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
import { el } from "date-fns/locale";

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

const KartuStock_ringkasan = () => {
  const [product, setProduct] = useState(null);
  const [location, setLoc] = useState(null);
  const [selectedProduct, setSelected] = useState(null);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [stCard, setStCard] = useState(null);
  const [unit, setUnit] = useState(null);
  const [satuan, setSatuan] = useState(null);
  const printPage = useRef(null);
  const [filtersDate, setFiltersDate] = useState([new Date(), new Date()]);
  const chunkSize = 27;
  const [cp, setCp] = useState("");

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    var d = new Date();
    d.setDate(d.getDate() - 30);
    setFiltersDate([d, new Date()]);
    getSt();
    getSatuan();
  }, []);

  const getSt = async () => {
    const config = {
      ...endpoints.st_card,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setStCard(data);
        let grouped = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.prod_id?.id === ek?.prod_id?.id)
        );

        let Unit = data?.filter(
          (el, i) => i === data.findIndex((ek) => el.id === ek?.code)
        );

        let grouploc = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.loc_id?.id === ek?.loc_id?.id)
        );
        setUnit(Unit);
        setProduct(grouped);
        setLoc(grouploc);
      }
    } catch (error) {}
  };

  const getSatuan = async () => {
    const config = {
      ...endpoints.getSatuan,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSatuan(data);
      }
    } catch (error) {}
  };

  const checkUnit = (value) => {
    let selected = {};
    satuan?.forEach((element) => {
      if (value === element.id) {
        selected = element;
      }
    });

    return selected;
  };

  const jsonForExcel = (stCard, excel = false) => {
    let data = [];
    if (selectedLoc && filtersDate[0] && filtersDate[1]) {
      let saldo = 0;
     

      let trn = [
        {
          type: "header",
          value: {
            trx_code: "Kode Produk",
            prod: " Nama Produk",

            trx_type: "Unit",
            // trx_type: "Jumlah Awal",
            t: "Jumlah Awal",
            trx_debit: "Debit",
            trx_kredit: "Kredit",
            ja: "Jumlah Akhir",
            // trx_type: "Jumlah Akhir",
            // trx_type: "HPP",
            HPP: "HPP",
            sld: "Saldo",
          },
        },
      ];

      stCard?.forEach((el) => {
        // if (selectedProduct?.prod_id?.id === el?.prod_id?.id) {
        if (selectedLoc?.loc_id?.id === el?.loc_id?.id) {
          //     let dt = new Date(`${el?.trx_date}Z`);
          //     if (dt >= filtersDate[0] && dt <= filtersDate[1]) {
          if (el.trx_dbcr === "d") {
            saldo += el.trx_qty;
          } else {
            saldo -= el.trx_qty;
          }

          trn.push({
            type: "item",
            value: {
              trx_code: el.prod_id.code,
              // trx_date: formatDate(el.trx_date),
              // product: el.prod_id?.name && el.prod_id?.code,
              trx_type: checkUnit(el?.prod_id?.unit)?.code,
              prod: el.prod_id.name,
              // trx_type: el.trx_type,
              // trx_type: el.trx_qty,
              t: 0,
              trx_debit: el.trx_dbcr === "d" ? el.trx_qty : 0,
              trx_kredit: el.trx_dbcr === "k" ? el.trx_qty : 0,
              ja: 0,
              HPP: 0,
              sld: saldo,
            },
          });
          //     }
        }
        // }
      });

      trn.push({
        type: "footer",
        value: {
          trx_code: "Total",
          trx_type: "",
          trx_debit: `Rp. ${formatIdr(0)}`,
          trx_kredit: `Rp. ${formatIdr(0)}`,
          sld: "",
        },
      });

      data = {
        header: [
          {
            // prod:
            //   selectedProduct === null
            //     ? "-"
            //     : `${selectedProduct?.code} (${selectedProduct?.name})`,
            location:
              selectedProduct === null
                ? "-"
                : `${selectedLoc?.name} (${selectedLoc?.code})`,
            sld: selectedProduct === null ? "-" : `Rp. ${formatIdr(0)}`,
          },
        ],

        trn: trn,
      };
    }
    else{}

    let item = [];

    let final = [
      {
        columns: [
          {
            title: "Stock Card Summary Report",
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

    data?.header?.forEach((el) => {
      item.push([
        // {
        //   value: `${el.prod}`,
        //   style: {
        //     font: {
        //       sz: "14",
        //       bold: false,
        //     },
        //     alignment: { horizontal: "left", vertical: "center" },
        //   },
        // },
        {
          value: `${el.location}`,
          style: {
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: "",
          style: {
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: "",
          style: {
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: "",
          style: {
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: `${el.sld}`,
          style: {
            font: {
              sz: "14",
              bold: false,
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
          font: { sz: "14", bold: true },
          alignment: { horizontal: "left", vertical: "center" },
        },
      },
    ]);

    item.push([
      {
        value: "Stock",
        style: {
          height: { wch: 18 },
          font: { sz: "14", bold: true },
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
          height: { wch: 18 },
          font: { sz: "14", bold: true },
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
          height: { wch: 18 },
          font: { sz: "14", bold: true },
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
          height: { wch: 18 },
          font: { sz: "14", bold: true },
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
          height: { wch: 18 },
          font: { sz: "14", bold: true },
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
          height: { wch: 18 },
          font: { sz: "14", bold: true },
          alignment: { horizontal: "left", vertical: "center" },
          fill: {
            paternType: "solid",
            fgColor: { rgb: "F3F3F3" },
          },
        },
      },
    ]);

    data?.trn?.forEach((ek) => {
      item.push([
        {
          value: `${ek.value.trx_code}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer",
            },

            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: `${ek.value.prod}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer",
            },
            alignment: { horizontal: "center", vertical: "center" },
          },
        },

        {
          value: `${ek.value.trx_type}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer",
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: `${ek.value.trx_type}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer",
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: `${ek.value.t}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer",
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: `${ek.value.trx_debit}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer",
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek.value.trx_kredit}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer",
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek.value.ja}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer",
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek.value.HPP}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer",
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek.value.sld}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" || ek.type === "footer",
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
      ]);
    });

    final.push({
      columns: [
        {
          title: "Produk",
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
          title: "Lokasi",
          width: { wch: 15 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "center", vertical: "center" },
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
        {
          title: "Saldo",
          width: { wch: 45 },
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

    if (excel) {
      return final;
    } else {
      return data;
    }
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
                    console.log(e.value);
                    setFiltersDate(e.value);
                  }}
                  selectionMode="range"
                  placeholder="Pilih Tanggal"
                  dateFormat="dd-mm-yy"
                />
              </div>
            </div>
            {/* <div className="">
              <Dropdown
                value={selectedProduct ?? null}
                options={product}
                onChange={(e) => {
                  setSelected(e.value);
                }}
                placeholder="Pilih Produk"
                optionLabel="prod_id.name"
                filter
                filterBy="prod_id.name"
                showClear
              />
            </div> */}

            <div className="col-3 ml-3 p-0">
              <Dropdown
                value={selectedLoc ?? null}
                options={location}
                onChange={(e) => {
                  setSelectedLoc(e.value);
                }}
                placeholder="Pilih Lokasi"
                optionLabel="loc_id.name"
                filterBy="loc_id.name"
                showClear
              />
            </div>
          </Row>
        </div>
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`card_stock_report_export_${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={stCard ? jsonForExcel(stCard, true) : null}
                name="Report Stock"
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
    arr?.reduce(
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
       
        <Card className="ml-1 mr-1 mt-2">
          <Card.Body className="p-0">
            <CustomeWrapper
              tittle={"Stock Card Summary Report"}
              subTittle={`Stock Card Summary Report for Period ${formatDate(
                filtersDate[0]
              )} to ${formatDate(filtersDate[1])}`}
              onComplete={(cp) => setCp(cp)}
              // page={1}
              body={
                <>
                  <DataTable
                    responsiveLayout="scroll"
                    value={
                      jsonForExcel(stCard)?.trn?.length > 3
                        ? jsonForExcel(stCard).trn
                        : []
                    }
                    showGridlines
                    dataKey="id"
                    rowHover
                    emptyMessage="Tidak Ada Transaksi"
                    className="mt-0"
                  >
                    <Column
                      header={(e) => <div className="text-left">Stock</div>}
                      style={{ width: "8rem" }}
                      body={(e) => (
                        <div
                          className={
                            e.type === "header"
                              ? "font-weight-bold text-left"
                              : e.type === "footer"
                              ? "font-weight-bold text-left"
                              : "text-left"
                          }
                        >
                          {e.value.trx_code}
                        </div>
                      )}
                    />

                    <Column
                      // className="header-center"
                      // header=""
                      style={{ minWidth: "12rem" }}
                      body={(e) => (
                        <div
                          className={
                            e.type == "header"
                              ? "font-weight-bold text-left"
                              : e.type == "footer"
                              ? "font-weight-bold text-left"
                              : "text-left"
                          }
                        >
                          {e.value.prod}
                        </div>
                      )}
                    />

                    <Column
                      // className="header-center"
                      // header=""
                      style={{ minWidth: "3rem" }}
                      body={(e) => (
                        <div
                          className={
                            e.type == "header"
                              ? "font-weight-bold text-left"
                              : e.type == "footer"
                              ? "font-weight-bold text-left"
                              : "text-left"
                          }
                        >
                          {e.value.trx_type}
                        </div>
                      )}
                    />
                    <Column
                      // className="header-center"
                      // header=""
                      style={{ minWidth: "8rem" }}
                      body={(e) => (
                        <div
                          className={
                            e.type == "header"
                              ? "font-weight-bold text-left"
                              : e.type == "footer"
                              ? "font-weight-bold text-left"
                              : "text-left"
                          }
                        >
                          {e.value.t}
                        </div>
                      )}
                    />
                    <Column
                      // className="header-center"
                      // header=""
                      style={{ minWidth: "4rem" }}
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
                          {e.value.trx_debit}
                        </div>
                      )}
                    />
                    <Column
                      // className="header-center"
                      // header=""
                      style={{ minWidth: "4rem" }}
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
                          {e.value.trx_kredit}
                        </div>
                      )}
                    />
                    <Column
                      // className="header-center"
                      // header=""
                      style={{ minWidth: "8rem" }}
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
                          {e.value.ja}
                        </div>
                      )}
                    />
                    <Column
                      // className="header-center"
                      // header=""
                      style={{ minWidth: "4rem" }}
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
                          {e.value.HPP}
                        </div>
                      )}
                    />
                    <Column
                      // className="header-center"
                      // header=""
                      style={{ minWidth: "5rem" }}
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
                          {e.value.sld}
                        </div>
                      )}
                    />
                  </DataTable>
                </>
              }
            />
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default KartuStock_ringkasan;
