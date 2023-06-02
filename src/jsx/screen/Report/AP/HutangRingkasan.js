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
import { MultiSelect } from "primereact/multiselect";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const ReportHutangRingkasan = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState(new Date());
  const [supplier, setSupplier] = useState(null);
  const [selectedSup, setSelected] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState([]);
  const [ap, setAp] = useState(null);
  const [acc, setAcc] = useState(null);
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
            // if (el.trx_type === "LP" && el.pay_type === "P1") {
            if (element.supplier.id === el.sup_id.id) {
              element.ap.push({ ...el, trx_amnh: 0, acq_amnh: 0 });
            }
            // }
          });
          element.ap.forEach((el) => {
            data.forEach((ek) => {
              if (el.id === ek.id) {
                el.trx_amnh = ek?.trx_amnh ?? 0;
                el.acq_amnh += ek?.acq_amnh ?? 0;
              }
            });
            //! HUTANG JIKA ADA TRANSAKSI KREDIT (K) MAKA HUTANGNYA BERTAMBAH
            //! HUTANG JIKA ADA TRANSAKSI DEBIT (D) MAKA HUTANGNYA BEERKURANG
            total +=
              el.trx_dbcr === "k"
                ? el?.trx_amnh
                : el?.trx_amnh - el?.acq_amnh ?? 0;
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
        getAcc(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAcc = async (sup) => {
    const config = {
      ...endpoints.account,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data?.forEach((elem) => {
          sup?.forEach((el) => {
            if (elem.account?.id === el.supplier?.sup_hutang) {
              filt.push(elem);
            }
            // console.log("============");
            // console.log(element);
          });
        });

        let grouped = filt?.filter(
          (el, i) =>
            i === filt.findIndex((ek) => el?.account?.id === ek?.account?.id)
        );
        setAcc(grouped);
      }
    } catch (error) {}
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

  const checkAcc = (value) => {
    let selected = {};
    acc?.forEach((element) => {
      if (value === element?.account.id) {
        selected = element;
      }
    });

    return selected;
  };

  const jsonForExcel = (ap, excel = false) => {
    let data = [];

    if (selectedSup?.length && selectedAcc?.length) {
      let total_nd = 0;
      let total_nk = 0;

      selectedSup?.forEach((p) => {
        selectedAcc?.forEach((acc) => {
          ap?.forEach((el) => {
            let amn = 0;
            let acq = 0;
            if (
              p?.sup_id?.id === el.supplier?.id &&
              acc?.account?.id === el?.supplier?.sup_hutang
            ) {
              let trx_amnh = 0;
              let acq_amnh = 0;
              let sa = 0;
              let sisa = 0;
              let sld_efektif = 0;
              let type = 0;

              el.ap.forEach((ek) => {
                let dt = new Date(`${ek.ord_date}Z`);
                if (dt <= filtDate) {
                  if (p?.sup_id?.id == ek?.sup_id?.id) {
                    if (ek.trx_dbcr == "k") {
                      trx_amnh += ek.trx_amnh;
                    } else {
                      if (ek.trx_type === "SA") {
                        acq_amnh += ek.trx_amnh;
                      } else {
                        acq_amnh += ek.acq_amnh;
                      }
                    }

                    if (ek.trx_dbcr == "d" && ek.trx_type == "DP") {
                      sa += ek.trx_amnh;
                    }

                    if (ek.trx_dbcr == "d" && ek.trx_type == "SA") {
                      sld_efektif += ek.trx_amnh;
                    }

                    type =
                      ek?.trx_type === "LP"
                        ? "Beli"
                        : ek?.trx_type === "SA"
                        ? "Saldo Awal"
                        : "Pelunasan";
                  }
                }
              });
              sisa = trx_amnh > 0 ? trx_amnh - (acq_amnh + sa) : 0;
              acq = acq_amnh + sa;

              data.push({
                type: "item",
                value: {
                  ref: `${el.supplier.sup_code} - ${el.supplier.sup_name} `,
                  sup_id: el.supplier?.id,
                  SE: `${
                    checkAcc(el.supplier?.sup_hutang)?.account?.acc_code
                  } - ${checkAcc(el.supplier?.sup_hutang)?.account?.acc_name}`,
                  typ: type,
                  value: `Rp. ${formatIdr(trx_amnh)}`,
                  lns: `Rp. ${formatIdr(acq)}`,
                  sisa: `Rp. ${formatIdr(acq >= trx_amnh ? 0 : sisa)}`,
                },
              });

              total_nd += trx_amnh;
              total_nk += acq_amnh;
            }
          });
        });
      });

      data.push({
        type: "footer",
        value: {
          ref: "Total Hutang",
          SE: "",
          typ: "",
          value: `Rp. ${formatIdr(total_nd)}`,
          lns: `Rp. ${formatIdr(total_nk)}`,
          sisa: `Rp. ${formatIdr(total_nd - total_nk)}`,
        },
      });
    } else if (selectedSup?.length) {
      let total_nd = 0;
      let total_nk = 0;

      selectedSup?.forEach((p) => {
        ap?.forEach((el) => {
          let amn = 0;
          let acq = 0;
          if (p?.sup_id?.id === el.supplier?.id) {
            let trx_amnh = 0;
            let acq_amnh = 0;
            let sa = 0;
            let sisa = 0;
            let sld_efektif = 0;
            let type = 0;

            el.ap.forEach((ek) => {
              let dt = new Date(`${ek.ord_date}Z`);
              if (dt <= filtDate) {
                if (p?.sup_id?.id == ek?.sup_id?.id) {
                  if (ek.trx_dbcr == "k") {
                    trx_amnh += ek.trx_amnh;
                  } else {
                    if (ek.trx_type === "SA") {
                      acq_amnh += ek.trx_amnh;
                    } else {
                      acq_amnh += ek.acq_amnh;
                    }
                  }

                  if (ek.trx_dbcr == "d" && ek.trx_type == "DP") {
                    sa += ek.trx_amnh;
                  }

                  if (ek.trx_dbcr == "d" && ek.trx_type == "SA") {
                    sld_efektif += ek.trx_amnh;
                  }
                }

                type =
                  ek?.trx_type === "LP"
                    ? "Beli"
                    : ek?.trx_type === "SA"
                    ? "Saldo Awal"
                    : "Pelunasan";
              }
            });
            sisa = trx_amnh > 0 ? trx_amnh - (acq_amnh + sa) : 0;
            acq = acq_amnh + sa;

            data.push({
              type: "item",
              value: {
                ref: `${el.supplier.sup_code} - ${el.supplier.sup_name} `,
                sup_id: el.supplier?.id,
                SE: `${
                  checkAcc(el.supplier?.sup_hutang)?.account?.acc_code
                } - ${checkAcc(el.supplier?.sup_hutang)?.account?.acc_name}`,
                typ: type,
                value: `Rp. ${formatIdr(trx_amnh)}`,
                lns: `Rp. ${formatIdr(acq)}`,
                sisa: `Rp. ${formatIdr(acq >= trx_amnh ? 0 : sisa)}`,
              },
            });

            total_nd += trx_amnh;
            total_nk += acq_amnh;
          }
        });
      });

      data.push({
        type: "footer",
        value: {
          ref: "Total Hutang",
          SE: "",
          typ: "",
          value: `Rp. ${formatIdr(total_nd)}`,
          lns: `Rp. ${formatIdr(total_nk)}`,
          sisa: `Rp. ${formatIdr(total_nd - total_nk)}`,
        },
      });
    } else if (selectedAcc?.length) {
      let total_nd = 0;
      let total_nk = 0;

      selectedAcc?.forEach((acc) => {
        ap?.forEach((el) => {
          let amn = 0;
          let acq = 0;
          if (acc?.account?.id === el.supplier?.sup_hutang) {
            let trx_amnh = 0;
            let acq_amnh = 0;
            let sa = 0;
            let sisa = 0;
            let sld_efektif = 0;
            let type = null;

            el.ap.forEach((ek) => {
              let dt = new Date(`${ek.ord_date}Z`);
              if (dt <= filtDate) {
                // if (p?.sup_id?.id == ek?.sup_id?.id) {
                if (ek.trx_dbcr == "k") {
                  trx_amnh += ek.trx_amnh;
                } else {
                  if (ek.trx_type === "SA") {
                    acq_amnh += ek.trx_amnh;
                  } else {
                    acq_amnh += ek.acq_amnh;
                  }
                }

                if (ek.trx_dbcr == "d" && ek.trx_type == "DP") {
                  sa += ek.trx_amnh;
                }

                if (ek.trx_dbcr == "d" && ek.trx_type == "SA") {
                  sld_efektif += ek.trx_amnh;
                }
                // }

                type =
                  ek?.trx_type === "LP"
                    ? "Beli"
                    : ek?.trx_type === "SA"
                    ? "Saldo Awal"
                    : "Pelunasan";
              }
            });
            sisa = trx_amnh > 0 ? trx_amnh - (acq_amnh + sa) : 0;
            acq = acq_amnh + sa;

            data.push({
              type: "item",
              value: {
                ref: `${el.supplier.sup_code} - ${el.supplier.sup_name} `,
                sup_id: el.supplier?.id,
                SE: `${
                  checkAcc(el.supplier?.sup_hutang)?.account?.acc_code
                } - ${checkAcc(el.supplier?.sup_hutang)?.account?.acc_name}`,
                typ: type,
                value: `Rp. ${formatIdr(trx_amnh)}`,
                lns: `Rp. ${formatIdr(acq)}`,
                sisa: `Rp. ${formatIdr(acq >= trx_amnh ? 0 : sisa)}`,
              },
            });

            total_nd += trx_amnh;
            total_nk += acq_amnh;
          }
        });
      });

      data.push({
        type: "footer",
        value: {
          ref: "Total Hutang",
          SE: "",
          typ: "",
          value: `Rp. ${formatIdr(total_nd)}`,
          lns: `Rp. ${formatIdr(total_nk)}`,
          sisa: `Rp. ${formatIdr(total_nd - total_nk)}`,
        },
      });
    } else {
      let total_nd = 0;
      let total_nk = 0;

      ap?.forEach((el) => {
        let amn = 0;
        let acq = 0;
        let trx_amnh = 0;
        let acq_amnh = 0;
        let sa = 0;
        let sisa = 0;
        let sld_efektif = 0;
        let type = null;

        el.ap.forEach((ek) => {
          let dt = new Date(`${ek.ord_date}Z`);
          if (dt <= filtDate) {
            if (ek.trx_dbcr == "k") {
              trx_amnh += ek.trx_amnh;
            } else {
              if (ek.trx_type === "SA") {
                acq_amnh += ek.trx_amnh;
              } else {
                acq_amnh += ek.acq_amnh;
              }
            }

            if (ek.trx_dbcr == "d" && ek.trx_type == "DP") {
              sa += ek.trx_amnh;
            }

            if (ek.trx_dbcr == "d" && ek.trx_type == "SA") {
              sld_efektif += ek.trx_amnh;
            }
          }

          type =
            ek?.trx_type === "LP"
              ? "Beli"
              : ek?.trx_type === "SA"
              ? "Saldo Awal"
              : "Pelunasan";
        });
        sisa = trx_amnh > 0 ? trx_amnh - (acq_amnh + sa) : 0;
        acq = acq_amnh + sa;

        data.push({
          type: "item",
          value: {
            ref: `${el.supplier.sup_code} - ${el.supplier.sup_name} `,
            sup_id: el.supplier?.id,
            SE: `${checkAcc(el.supplier?.sup_hutang)?.account?.acc_code} - ${
              checkAcc(el.supplier?.sup_hutang)?.account?.acc_name
            }`,
            typ: type,

            value: `Rp. ${formatIdr(trx_amnh)}`,
            lns: `Rp. ${formatIdr(acq)}`,
            sisa: `Rp. ${formatIdr(acq >= trx_amnh ? 0 : sisa)}`,
          },
        });

        total_nd += trx_amnh;
        total_nk += acq_amnh;
      });

      data.push({
        type: "footer",
        value: {
          ref: "Total Hutang",
          SE: "",
          typ: "",
          value: `Rp. ${formatIdr(total_nd)}`,
          lns: `Rp. ${formatIdr(total_nk)}`,
          sisa: `Rp. ${formatIdr(total_nd - total_nk)}`,
        },
      });
    }

    let final = [
      {
        columns: [
          {
            title: "Accounts Payable Summary",
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

    let item = [];
    data.forEach((ek) => {
      item.push([
        {
          value: `${ek[ek.length - 1]?.value.ref}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },

        {
          value: `${ek[ek.length - 1]?.value.SE}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },

        {
          value: `${ek[ek.length - 1]?.value.typ}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" ? true : false,
            },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },

        {
          value: `${ek[ek.length - 1]?.value.value}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },

        {
          value: `${ek[ek.length - 1]?.value.lns}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" ? true : false,
            },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: `${ek[ek.length - 1]?.value.sisa}`,
          style: {
            font: {
              sz: "14",
              bold: ek.type === "header" ? true : false,
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
          title: "Nama Supplier",
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
          title: "Account Distribution",
          width: { wch: 30 },
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
          title: "Transaction Type",
          width: { wch: 30 },
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
          title: "Nilai",
          width: { wch: 30 },
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
          title: "Pembayaran",
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
          title: "Sisa",
          width: { wch: 30 },
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

  const formatIdr = (value) => {
    return `${value?.toFixed(2)}`
      .replace(".", ",")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const glTemplate = (option) => {
    return (
      <div>
        {option !== null
          ? `${option.account.acc_code} - ${option.account.acc_name}`
          : ""}
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-9 ml-0 mr-0 pl-0 pt-0">
          <Row className="mt-0">
            <div className="p-inputgroup col-3">
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
            <div className="p-inputgroup col-3">
              <MultiSelect
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
                display="chip"
                // className="w-full md:w-20rem"
                maxSelectedLabels={3}
              />
            </div>
            <div className="p-inputgroup col-3">
              <MultiSelect
                value={selectedAcc ?? null}
                options={acc}
                onChange={(e) => {
                  setSelectedAcc(e.value);
                }}
                placeholder="Pilih Account"
                optionLabel="account.acc_name"
                itemTemplate={glTemplate}
                filter
                filterBy="account.acc_name"
                showClear
                display="chip"
                // className="w-full md:w-20rem"
                maxSelectedLabels={3}
              />
            </div>
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`payable_report_summary_${formatDate(new Date())
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

      <Row className="m-0 justify-content-center">
        {chunk(jsonForExcel(ap) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0 m-0">
                <CustomeWrapper
                  horizontal
                  tittle={"Accounts Payable Summary"}
                  subTittle={`Accounts Payable Summary as ${
                    filtDate ? formatDate(filtDate) : "-"
                  }`}
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
                      >
                        <Column
                          header="Nama Supplier"
                          style={{ width: "20rem" }}
                          field={(e) => e?.value?.ref}
                          body={
                            (e) => (
                              // e.type === "item" ? (
                              //   <Link
                              //     to={`/laporan/ap/saldo-hutang-rincian/${btoa(
                              //       `m'${filtDate?.getMonth() + 1}`
                              //     )}/${btoa(
                              //       `y'${filtDate?.getFullYear()}`
                              //     )}/${btoa(
                              //       btoa(
                              //         JSON.stringify({
                              //           sup_id: e.value?.sup_id,
                              //         })
                              //       )
                              //     )}`}
                              //   >
                              //     <div
                              //       className={
                              //         e.type === "header"
                              //           ? "font-weight-bold"
                              //           : e.type === "footer"
                              //           ? "font-weight-bold"
                              //           : ""
                              //       }
                              //     >
                              //       {e.value.ref}
                              //     </div>
                              //   </Link>
                              // ) : (
                              <div
                                className={
                                  e.type === "header"
                                    ? "font-weight-bold"
                                    : e.type === "footer"
                                    ? "font-weight-bold"
                                    : ""
                                }
                              >
                                {e.value.ref}
                              </div>
                            )
                            // )
                          }
                        />

                        <Column
                          // className="header-right text-r"
                          header="Account Distribution"
                          style={{ width: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold"
                                  : e.type === "footer"
                                  ? "font-weight-bold"
                                  : "text-left"
                              }
                            >
                              {e.value.SE}
                            </div>
                          )}
                        />

                        <Column
                          // className="header-right text-r"
                          header="Trans type"
                          style={{ width: "8rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold"
                                  : e.type === "footer"
                                  ? "font-weight-bold"
                                  : "text-left"
                              }
                            >
                              {e.value.typ}
                            </div>
                          )}
                        />

                        <Column
                          // className="header-right text-right"
                          header="Nilai Kredit"
                          style={{ width: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {e.value.value}
                            </div>
                          )}
                        />
                        <Column
                          className="header-right text-right"
                          header="Nilai Debet"
                          style={{ width: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {e.value.lns}
                            </div>
                          )}
                        />
                        <Column
                          className="header-right text-right"
                          header="Sisa"
                          style={{ width: "10rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header"
                                  ? "font-weight-bold text-right mr-2"
                                  : e.type === "footer"
                                  ? "font-weight-bold text-right mr-2"
                                  : "text-right mr-2"
                              }
                            >
                              {e.value.sisa}
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

      <Row className="m-0 justify-content-center d-none">
        <Card className="ml-1 mr-1 mt-2">
          <Card.Body className="p-0 m-0" ref={printPage}>
            {chunk(jsonForExcel(ap) ?? [], chunkSize)?.map((val, idx) => {
              return (
                <Card className="ml-1 mr-1 mt-2">
                  <Card.Body className="p-0 m-0">
                    <CustomeWrapper
                      horizontal
                      tittle={"Accounts Payable Summary"}
                      subTittle={`Accounts Payable Summary as ${
                        filtDate ? formatDate(filtDate) : "-"
                      }`}
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
                          >
                            <Column
                              header="Nama Supplier"
                              style={{ width: "20rem" }}
                              field={(e) => e?.value?.ref}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold"
                                      : e.type === "footer"
                                      ? "font-weight-bold"
                                      : ""
                                  }
                                >
                                  {e.value.ref}
                                </div>
                              )}
                            />

                            <Column
                              // className="header-right text-r"
                              header="Account Distribution"
                              style={{ width: "10rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold"
                                      : e.type === "footer"
                                      ? "font-weight-bold"
                                      : "text-left"
                                  }
                                >
                                  {e.value.SE}
                                </div>
                              )}
                            />

                            <Column
                              // className="header-right text-r"
                              header="Trans Type"
                              style={{ width: "10rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold"
                                      : e.type === "footer"
                                      ? "font-weight-bold"
                                      : "text-left"
                                  }
                                >
                                  {e.value.typ}
                                </div>
                              )}
                            />

                            <Column
                              className="header-right text-right"
                              header="Nilai Kredit"
                              style={{ width: "10rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold text-right mr-2"
                                      : e.type === "footer"
                                      ? "font-weight-bold text-right mr-2"
                                      : "text-right mr-2"
                                  }
                                >
                                  {e.value.value}
                                </div>
                              )}
                            />
                            <Column
                              className="header-right text-right"
                              header="Nilai Debet"
                              style={{ width: "10rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold text-right mr-2"
                                      : e.type === "footer"
                                      ? "font-weight-bold text-right mr-2"
                                      : "text-right mr-2"
                                  }
                                >
                                  {e.value.lns}
                                </div>
                              )}
                            />
                            <Column
                              className="header-right text-right"
                              header="Sisa"
                              style={{ width: "10rem" }}
                              body={(e) => (
                                <div
                                  className={
                                    e.type === "header"
                                      ? "font-weight-bold text-right mr-2"
                                      : e.type === "footer"
                                      ? "font-weight-bold text-right mr-2"
                                      : "text-right mr-2"
                                  }
                                >
                                  {e.value.sisa}
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
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default ReportHutangRingkasan;
