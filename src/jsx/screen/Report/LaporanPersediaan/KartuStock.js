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

// import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import { Dropdown } from "primereact/dropdown";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
// import ExcelExportHelper from "../../../components/ExportExcel/ExcelExportHelper";
import { Link } from "react-router-dom";
import formatIdr from "../../../../utils/formatIdr";
import { MultiSelect } from "primereact/multiselect";

const data = {};

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const KartuStock = ({ month, year, prod_id }) => {
  const [product, setProduct] = useState(null);
  const [location, setLoc] = useState(null);
  const [selectedProduct, setSelected] = useState(null);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [invDdb, setInvDdb] = useState(null);
  const [stCard, setStCard] = useState(null);
  const printPage = useRef(null);
  // const [filtersDate, setFiltersDate] = useState([
  //   month && year ? new Date(year, month - 1, 1) : new Date(),
  //   month && year ? new Date(year, month - 1, 1) : new Date(),
  // ]);
  const [filtDate, setFiltDate] = useState(null);
  const chunkSize = 2;
  const [cp, setCp] = useState("");

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    getSt(prod_id);
    // getInvDdb();
  }, []);

  const getMonthlyDates = (start, count) => {
    var result = [];
    var temp;
    var year = start.getFullYear();
    var month = start.getMonth();
    var startDay = start.getDate();
    for (var i = 0; i < count; i++) {
      temp = new Date(year, month + i, startDay);
      if (temp.getDate() != startDay) temp.setDate(0);
      result.push(temp);
    }
    return result;
  };

  const getInvDdb = async () => {
    const config = {
      ...endpoints.posting,
    };
    let response = null;
    try {
      response = await request(null, config);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data?.forEach((element) => {
          if (!element?.from_closing) {
            filt.push(element);
          }
        });
        setInvDdb(filt);
        let month = [];
        let date = [];
        data
          .map((v) => !v.from_closing && v)
          .forEach((ej) => {
            // if (
            //   filtDate?.getFullYear() === ej?.inv_year &&
            //   filtDate?.getMonth() + 1 >= ej?.inv_month
            // ) {
            date.push(new Date(ej.inv_year, ej.inv_month - 1));
            // month.push(ej.inv_month);
            // }
          });

        // if (date.length) {
        //   // setMaxDate(Math.max(...month));
        //   setMaxDate(new Date(Math.max(...date)).getMonth() + 1);
        //   if (!filtDate) {
        //     setFiltDate(new Date());
        //     setMonthPost(date);
        //   }
        // }
      }
    } catch (error) {}
  };

  const getSt = async (id) => {
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
        let grouploc = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.loc_id?.id === ek?.loc_id?.id)
        );
        setProduct(grouped);
        setLoc(grouploc);

        if (id) {
          grouped?.forEach((el) => {
            if (el.prod_id.id === Number(id)) {
              setSelected(el);
            }
          });
        }
      }
    } catch (error) {}
  };

  const jsonForExcel = (stCard, excel = false) => {
    let data = [];
    let month = [];

    stCard?.forEach((ej) => {
      if (
        filtDate?.getFullYear() === ej.trx_date &&
        filtDate?.getMonth() + 1 >= ej.trx_date
      ) {
        month.push(ej.trx_date);
      }
    });

    if (selectedProduct && selectedLoc) {
      selectedProduct?.forEach((prd) => {
        selectedLoc?.forEach((loc) => {
          let saldo = 0;
          let qty_awal = 0;

          invDdb?.forEach((elem) => {
            if (
              prd.prod_id.id === elem.inv_code.id &&
              loc.loc_id.id === elem.loc_code.id
            ) {
              if (
                (elem.inv_month <= filtDate.getMonth() + 1 &&
                  elem.inv_year == filtDate.getFullYear()) ||
                elem.inv_year <= filtDate.getFullYear()
              ) {
                qty_awal += elem.qty_awal;
                // amnt_akhir += el.inv_akhir;
              }
            }
          });

          let trn = [
            {
              type: "header",
              value: {
                trx_code: "Kode Trans",
                trx_date: "Tanggal",
                trx_type: "Jenis Trans",
                lok: "Lokasi",
                trx_debit: "Mutasi Debet",
                trx_kredit: "Mutasi Kredit",
                sld: "Saldo",
              },
            },
          ];

          let t_deb = 0;
          let t_kre = 0;
          let sa = 0;
          let st = 0;

          stCard?.forEach((el) => {
            if (prd?.prod_id?.id === el?.prod_id?.id) {
              if (loc?.loc_id?.id === el?.loc_id?.id) {
                let dt = new Date(`${el?.trx_date}Z`);
                if (dt.getFullYear() === filtDate.getFullYear()) {
                  if (dt.getMonth() <= filtDate?.getMonth()) {
                    if (el.trx_dbcr === "d") {
                      saldo += el.trx_qty;
                    } else {
                      saldo -= el.trx_qty;
                    }
                    trn.push({
                      type: "item",
                      value: {
                        trx_code: el.trx_code,
                        trx_date: formatDate(el.trx_date),
                        trx_type:
                          el.trx_type === "BL"
                            ? "Pembelian"
                            : el.trx_type === "JL"
                            ? "Penjualan"
                            : el.trx_type === "MK"
                            ? "Mutasi Kredit"
                            : el.trx_type === "MD"
                            ? "Mutasi Debet"
                            : el.trx_type === "SA"
                            ? "Saldo Awal"
                            : el.trx_type === "HRV"
                            ? "Panen"
                            : el.trx_type,
                        lok: `${el.loc_id?.name}`,
                        trx_debit:
                          el.trx_dbcr === "d" ? formatTh(el.trx_qty) : 0,
                        trx_kredit:
                          el.trx_dbcr === "k" ? formatTh(el.trx_qty) : 0,
                        sld: formatTh(saldo),
                      },
                    });

                    t_deb += el.trx_dbcr === "d" ? el.trx_qty : 0;
                    t_kre += el.trx_dbcr === "k" ? el.trx_qty : 0;
                    sa = t_deb - t_kre ?? "-";
                    st += el.trx_hpok ?? 0;
                  }
                }
              }
            }
          });

          trn.push({
            type: "footer",
            value: {
              trx_code: "Total",
              trx_date: "",
              trx_type: "",
              lok: "",
              trx_debit: formatTh(t_deb),
              trx_kredit: formatTh(t_kre),
              sld: "",
            },
          });

          data.push({
            header: [
              {
                prod:
                  prd === null
                    ? "-"
                    : `${prd?.prod_id?.code} (${prd?.prod_id?.name})`,
                prod_id: prd?.prod_id?.id,
                nom: prd === null ? "-" : st,
                sld: prd === null ? "-" : formatTh(qty_awal),
                akhir: prd === null ? "-" : formatTh(qty_awal + sa),
                // sld: selectedProduct === null ? "-" : `${t_deb - t_kre}`,
              },
            ],

            trn: trn,
          });
        });
      });
    }
    // else{
    //   selectedProduct?.forEach((prd) => {
    //     let saldo = 0;

    //     let trn = [
    //       {
    //         type: "header",
    //         value: {
    //           trx_code: "Kode Trans",
    //           trx_date: "Tanggal",
    //           trx_type: "Jenis Trans",
    //           lok: "Lokasi",
    //           trx_debit: "Mutasi Debet",
    //           trx_kredit: "Mutasi Kredit",
    //           sld: "Saldo",
    //         },
    //       },
    //     ];

    //     let t_deb = 0;
    //     let t_kre = 0;
    //     let sa = 0;
    //     let st = 0;
    //     stCard?.forEach((el) => {
    //       if (prd?.prod_id?.id === el?.prod_id?.id) {
    //         // if (selectedLoc?.loc_id?.id === el?.loc_id?.id) {
    //         let dt = new Date(`${el?.trx_date}Z`);
    //         if (dt.getFullYear() === filtDate.getFullYear()) {
    //           if (dt.getMonth() <= filtDate.getMonth()) {
    //             if (el.trx_dbcr === "d") {
    //               saldo += el.trx_qty;
    //             } else {
    //               saldo -= el.trx_qty;
    //             }
    //             trn.push({
    //               type: "item",
    //               value: {
    //                 trx_code: el.trx_code,
    //                 trx_date: formatDate(el.trx_date),
    //                 trx_type:
    //                   el.trx_type === "BL"
    //                     ? "Pembelian"
    //                     : el.trx_type === "JL"
    //                     ? "Penjualan"
    //                     : el.trx_type === "MK"
    //                     ? "Mutasi Kredit"
    //                     : el.trx_type === "MD"
    //                     ? "Mutasi Debet"
    //                     : el.trx_type === "SA"
    //                     ? "Saldo Awal"
    //                     : el.trx_type === "HRV"
    //                     ? "Panen"
    //                     : el.trx_type,
    //                 lok: `${el.loc_id?.name}`,
    //                 trx_debit: el.trx_dbcr === "d" ? formatTh(el.trx_qty) : 0,
    //                 trx_kredit: el.trx_dbcr === "k" ? formatTh(el.trx_qty) : 0,
    //                 sld: formatTh(saldo),
    //               },
    //             });

    //             t_deb += el.trx_dbcr === "d" ? el.trx_qty : 0;
    //             t_kre += el.trx_dbcr === "k" ? el.trx_qty : 0;
    //             sa = t_deb ?? "-";
    //             st += 0;
    //           }

    //           // }
    //         }
    //       }
    //     });

    //     trn.push({
    //       type: "footer",
    //       value: {
    //         trx_code: "Total",
    //         trx_date: "",
    //         trx_type: "",
    //         lok: "",
    //         trx_debit: formatTh(t_deb),
    //         trx_kredit: formatTh(t_kre),
    //         sld: "",
    //       },
    //     });

    //     data.push({
    //       header: [
    //         {
    //           prod:
    //             prd === null
    //               ? "-"
    //               : `${prd?.prod_id?.code} (${prd?.prod_id?.name})`,
    //           prod_id: prd?.prod_id?.id,
    //           nom: prd === null ? "-" : st,
    //           sld: prd === null ? "-" : formatTh(sa),
    //           // sld: selectedProduct === null ? "-" : `${t_deb - t_kre}`,
    //         },
    //       ],

    //       trn: trn,
    //     });
    //   });
    // }

    // data?.forEach((element) => {
    //   element?.trn.forEach((el) => {
    //   });
    //     console.log("length");
    //     console.log(element);
    // });

    let item = [];

    let final = [
      {
        columns: [
          {
            title: "Stock Card Report",
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
            title: `Per ${formatMonth(filtDate)}`,
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
        {
          value: `${el.prod}`,
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
        value: "Detail Transaksi",
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
          value: `${ek.value.trx_date}`,
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
          value: `${ek.value.lok}`,
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
          title: "",
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
          title: "Nominal",
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

    if (excel) {
      return final;
    } else {
      return data;
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-10 ml-0 mr-0 pl-0">
          <Row className="m-0">
            <div className="col-3 mr-0 mt-2 p-0">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-calendar" />
                </span>
                <Calendar
                  value={filtDate}
                  onChange={(e) => {
                    setFiltDate(e.value);
                  }}
                  view="month"
                  placeholder="Pilih Tanggal"
                  readOnlyInput
                  dateFormat="MM yy"
                />
              </div>
            </div>
            <div className="p-inputgroup col-3">
              <MultiSelect
                value={selectedLoc ?? null}
                options={location}
                onChange={(e) => {
                  setSelectedLoc(e.value);
                }}
                placeholder="Pilih Lokasi"
                optionLabel="loc_id.name"
                showClear
                filterBy="loc_id.name"
                filter
                display="chip"
                // className="w-full md:w-17rem"
                maxSelectedLabels={3}
              />
            </div>
            <div className="p-inputgroup col-3">
              <MultiSelect
                value={selectedProduct ?? null}
                options={product}
                onChange={(e) => {
                  console.log("====");
                  console.log(e.value);
                  setSelected(e.value);
                }}
                placeholder="Pilih Product"
                optionLabel="prod_id.name"
                showClear
                filterBy="prod_id.name"
                filter
                display="chip"
                // className="w-full md:w-20rem"
                maxSelectedLabels={3}
              />
            </div>
          </Row>
        </div>
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            {/* <ExcelExportHelper
              json={stCard ? jsonForExcel(stCard, true) : null}
              filename={`stock_card_detail_report_export_${new Date().getTime()}`}
              sheetname="report"
            /> */}
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

  const formatMonth = (date) => {
    const m = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    if (typeof date === "string") {
      var d = new Date(`${date}Z`),
        month = d.getMonth(),
        year = d.getFullYear();
    } else {
      var d = new Date(date),
        month = d.getMonth(),
        year = d.getFullYear();
    }

    return [m[month], year].join(" ");
  };

  const formatTh = (value) => {
    return `${value?.toFixed(2)}`
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
        {chunk(jsonForExcel(stCard) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0">
                <CustomeWrapper
                  tittle={"Stock Card Details Report"}
                  subTittle={`Stock Card Details Report Per ${formatMonth(
                    filtDate
                  )}`}
                  onComplete={(cp) => setCp(cp)}
                  page={idx + 1}
                  body={
                    <>
                      {val?.map((v) => {
                        return (
                          <>
                            <DataTable
                              className="mt-4"
                              responsiveLayout="none"
                              value={v.header}
                              showGridlines
                              dataKey="id"
                              rowHover
                              emptyMessage="Belum Ada Produk"
                            >
                              <Column
                                className="header-center"
                                header="Produk"
                                style={{ width: "30rem" }}
                                field={(e) =>
                                  e.prod !== null ? (
                                    <Link
                                      to={`/laporan/persediaan/kartu-saldo-pesediaan/${btoa(
                                        `m'${filtDate.getMonth() + 1}`
                                      )}/${btoa(
                                        `y'${filtDate.getFullYear()}`
                                      )}/${btoa(
                                        btoa(
                                          JSON.stringify({
                                            prod_id: e.prod_id,
                                          })
                                        )
                                      )}`}
                                    >
                                      {e.prod}
                                    </Link>
                                  ) : (
                                    <div className="font-weight-bold text-left">
                                      {e.prod}
                                    </div>
                                  )
                                }
                              />
                              {/* <Column
                      className="header-right text-left"
                      header={(e) => (
                        <div className="ml-5 mr-0 text-right">Nominal</div>
                      )}
                      style={{ width: "10rem" }}
                      field={(e) => (
                        <div className="font-weight-bold text-right">
                          {e.nom}
                        </div>
                      )}
                    /> */}
                              <Column
                                className="header-right text-right"
                                header={(e) => (
                                  <div className="ml-5 mr-0 text-right">
                                    Saldo Awal
                                  </div>
                                )}
                                style={{ width: "6rem" }}
                                field={(e) => (
                                  <div className="font-weight-bold text-right">
                                    {e.sld}
                                  </div>
                                )}
                              />
                              <Column
                                className="header-right text-right"
                                header={(e) => (
                                  <div className="ml-5 mr-0 text-right">
                                    Saldo Akhir
                                  </div>
                                )}
                                style={{ width: "6rem" }}
                                field={(e) => (
                                  <div className="font-weight-bold text-right">
                                    {e.akhir}
                                  </div>
                                )}
                              />
                            </DataTable>

                            <DataTable
                              responsiveLayout="scroll"
                              value={v.trn}
                              showGridlines
                              dataKey="id"
                              rowHover
                              emptyMessage="Tidak Ada Transaksi"
                              className="mt-0"
                            >
                              <Column
                                header={(e) => (
                                  <div className="text-left">
                                    Detail Transaksi
                                  </div>
                                )}
                                style={{ width: "9rem" }}
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
                                style={{ width: "9rem" }}
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
                                    {e.value.trx_date}
                                  </div>
                                )}
                              />
                              <Column
                                // className="header-center"
                                // header=""
                                style={{ width: "7rem" }}
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
                                style={{ width: "7rem" }}
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
                                    {e.value.lok}
                                  </div>
                                )}
                              />
                              <Column
                                // className="header-center"
                                // header=""
                                style={{ width: "8rem" }}
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
                                style={{ width: "8rem" }}
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
                                style={{ width: "6rem" }}
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

export default KartuStock;
