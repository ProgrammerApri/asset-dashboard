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
// import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
// import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
import { el } from "date-fns/locale";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Dropdown } from "primereact/dropdown";
import { ColumnGroup } from "primereact/columngroup";
import { Row as PRow } from "primereact/row";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const PemasukanDB = () => {
  const [order, setOrder] = useState(null);
  const [ord, setOrd] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtersDate, setFiltersDate] = useState([new Date(), new Date()]);
  const [selectCus, setSelectCus] = useState(null);
  const [stCard, setStCard] = useState(null);
  const [cp, setCp] = useState("");
  const chunkSize = 27;

 
  useEffect(() => {
    var d = new Date();
    d.setDate(d.getDate() - 7);
    setFiltersDate([d, new Date()]);
    getOrder();
    getORD();
  }, []);

  const getOrder = async () => {
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
        let filtered = [];
        data.forEach((el) => {
          if (el.trx_type === "BL") {
            filtered.push(el);
          }
        });
        setStCard(filtered);
        let grouped = data?.filter(
          (el, i) =>
            i ===
            data.findIndex(
              (ek) => el?.trx_code === ek?.trx_code && el.trx_type === "BL"
            )
        );
        setOrder(grouped);
      }
    } catch (error) {}
  };

  const getORD = async () => {
    const config = {
      ...endpoints.sale,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setOrd(data);
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

  const jsonForExcel = (stCard, excel = false) => {
    let data = [];
    ord?.forEach((el) => {
      stCard?.forEach((ek) => {
        if (ek.trx_code === el.ord_code) {
          let dt = new Date(`${el?.ord_date}Z`);
          if (dt >= filtersDate[0] && dt <= filtersDate[1]) {
          data.push({
            type: "item",
            value: {
              no: null,
              dep: `${el.slsm_id?.sales_name} - ${el.slsm_id?.sales_code}`,
              doc: el.no_doc,
              doc_dt: formatDate(el.doc_date),
              ord_code: ek.trx_code,
              ord_date: formatDate(ek.trx_date),
              pel: `${el.pel_id?.cus_name} - ${el.pel_id?.cus_code}`,
              prod_kd: ek.prod_id?.code,
              prod_nm: ek.prod_id?.name,
              unit: el.jprod.unit_id?.name,
              qty: ek.trx_qty,
              h_pok: `Rp. ${formatIdr(ek.trx_hpok)}`,
            },
          });
        }
        }
      });
    });

    let item = [];

    // data?.forEach((el) => {
    //   el?.forEach((ek) => {
    //     item.push([
    //       {
    //         value: ek.value.dep,
    //         style: {
    //           font: { sz: "14", bold: false },
    //           alignment: { horizontal: "left", vertical: "center" },
    //         },
    //       },
    //       {
    //         value: ek.value.doc,
    //         style: {
    //           font: { sz: "14", bold: false },
    //           alignment: { horizontal: "left", vertical: "center" },
    //         },
    //       },
    //       {
    //         value: ek.value.doc_dt,
    //         style: {
    //           font: { sz: "14", bold: false },
    //           alignment: { horizontal: "left", vertical: "center" },
    //         },
    //       },
    //       {
    //         value: ek.value.ord_code,
    //         style: {
    //           font: { sz: "14", bold: false },
    //           alignment: { horizontal: "center", vertical: "center" },
    //         },
    //       },
    //       {
    //         value: ek.value.ord_date,
    //         style: {
    //           font: { sz: "14", bold: false },
    //           alignment: { horizontal: "right", vertical: "center" },
    //         },
    //       },
    //       {
    //         value: ek.value.sup,
    //         style: {
    //           font: { sz: "14", bold: false },
    //           alignment: { horizontal: "right", vertical: "center" },
    //         },
    //       },
    //       {
    //         value: ek.value.prod_kd,
    //         style: {
    //           font: { sz: "14", bold: false },
    //           alignment: { horizontal: "right", vertical: "center" },
    //         },
    //       },
    //       {
    //         value: ek.value.prod_nm,
    //         style: {
    //           font: { sz: "14", bold: false },
    //           alignment: { horizontal: "right", vertical: "center" },
    //         },
    //       },
    //       {
    //         value: ek.value.unit,
    //         style: {
    //           font: { sz: "14", bold: false },
    //           alignment: { horizontal: "right", vertical: "center" },
    //         },
    //       },
    //       {
    //         value: ek.value.qty,
    //         style: {
    //           font: { sz: "14", bold: false },
    //           alignment: { horizontal: "right", vertical: "center" },
    //         },
    //       },
    //       {
    //         value: ek.value.h_pok,
    //         style: {
    //           font: { sz: "14", bold: false },
    //           alignment: { horizontal: "right", vertical: "center" },
    //         },
    //       },
    //     ]);
    //   });
    // });

    console.log(item);

    let final = [
      {
        columns: [
          {
            title: "RPBB Card Report",
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

    final.push({
      columns: [
        {
          title: "Kode Planning",
          width: { wch: 20 },
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
          title: "Kode Produk",
          width: { wch: 20 },
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
          title: "Nama Produk",
          width: { wch: 50 },
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
          title: "Saldo Produk",
          width: { wch: 17 },
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
          title: "Rencana Pemakaian",
          width: { wch: 17 },
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
          title: "Sisa Saldo",
          width: { wch: 13 },
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
          title: "Saran Pembelian",
          width: { wch: 17 },
          style: {
            font: { sz: "14", bold: true },
            alignment: { horizontal: "center", vertical: "center" },
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
            <div className="p-inputgroup col-6">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar" />
              </span>
              <Calendar
                value={filtersDate}
                id="range"
                onChange={(e) => {
                  console.log(e.value);
                  setFiltersDate(e.value);
                }}
                selectionMode="range"
                placeholder="Pilih Tanggal"
                readOnlyInput
                dateFormat="dd-mm-yy"
              />
            </div>
            {/* <div className="col-4">
              <Dropdown
                value={selectedProduct ?? null}
                options={batch}
                onChange={(e) => {
                  setSelected(e.value);
                }}
                placeholder="Pilih Batch"
                optionLabel="trx_code"
                filter
                filterBy="trx_code"
                showClear
              />
            </div> */}
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`Laporan Pemasukan Barang report export ${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={stCard ? jsonForExcel(stCard, true) : null}
                name="Laporan Pemasukan Barang"
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
      <Row>
        <Col>
          <Card>
            <Card.Body>{renderHeader()}</Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="m-0 justify-content-center" ref={printPage}>
        {chunk(jsonForExcel(stCard) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0">
                <CustomeWrapper
                  horizontal
                  tittle={"Laporan Pemasukan Barang Perdokumen Pabean"}
                  subTittle={`Periode ${formatDate(
                    filtersDate[0]
                  )} to ${formatDate(filtersDate[1])}`}
                  onComplete={(cp) => setCp(cp)}
                  page={idx + 1}
                  body={
                    <>
                      <DataTable
                        responsiveLayout="scroll"
                        value={val}
                        showGridlines
                        dataKey="id"
                        rowHover
                        emptyMessage="Data Tidak Ditemukan"
                        className="mt-4 header-white"
                        headerColumnGroup={
                          <ColumnGroup>
                            <PRow>
                              <Column
                                header={"No."}
                                rowSpan={2}
                                className="center-header border"
                              />
                              <Column
                                header={"Departement"}
                                rowSpan={2}
                                className="center-header border"
                              />
                              <Column
                                header={"Dokumen Pabean"}
                                colSpan={2}
                                className="center-header border"
                              />
                              <Column
                                header={"Dokumen Pemasukan"}
                                colSpan={2}
                                className="center-header border"
                              />
                              <Column
                                header={"Pemasok/Pengirim"}
                                rowSpan={2}
                                className="center-header border"
                              />
                              <Column
                                header={"Kode Produk"}
                                rowSpan={2}
                                className="center-header border"
                              />
                              <Column
                                header={"Nama Produk"}
                                rowSpan={2}
                                className="center-header border"
                              />
                              <Column
                                header={"Satuan"}
                                rowSpan={2}
                                className="center-header border"
                              />
                              <Column
                                header={"Kuantitas"}
                                rowSpan={2}
                                className="center-header border"
                              />
                              <Column
                                header={"Harga Pokok"}
                                rowSpan={2}
                                className="center-header border"
                              />
                            </PRow>
                            <PRow>
                              <Column
                                header={"Nomor"}
                                className="center-header border"
                              />
                              <Column
                                header={"Tanggal"}
                                className="center-header border"
                              />
                              <Column
                                header={"Nomor"}
                                className="center-header border"
                              />
                              <Column
                                header={"Tanggal"}
                                className="center-header border"
                              />
                            </PRow>
                          </ColumnGroup>
                        }
                      >
                        <Column
                          className=""
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.no}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          body={(e) => (
                            <div
                              className={`${
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }`}
                            >
                              {e.value.dep}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.doc}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          header="Bukti Dokumen Pemasukan"
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.doc_dt}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          style={{ width: "11rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.ord_code}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.ord_date}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.pel}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.prod_kd}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.prod_nm}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.unit}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.qty}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.h_pok}
                            </div>
                          )}
                        />
                      </DataTable>
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

export default PemasukanDB;
