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

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const KartuWIP = () => {
  const [batch, setBatch] = useState(null);
  const [btch, setBtch] = useState(null);
  const [product, setProduct] = useState(null);
  const [selectedBatch, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState([new Date(), new Date()]);
  const [phj, setPhj] = useState(null);
  const [selectCus, setSelectCus] = useState(null);
  const [stCard, setStCard] = useState(null);
  const [trans, setTrans] = useState(null);
  const [cp, setCp] = useState("");
  const chunkSize = 27;

  useEffect(() => {
    var d = new Date();
    d.setDate(d.getDate() - 7);
    setFiltDate([d, new Date()]);
    getBatch();
    getBtch();
    getPhj();
  }, []);

  const getBatch = async () => {
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
          if (el.trx_type === "PR" || el.trx_type === "PM") {
            filtered.push(el);
          }
        });
        setStCard(filtered);
        let grouped = data?.filter(
          (el, i) =>
            i ===
            data.findIndex(
              (ek) =>
                el?.trx_code === ek?.trx_code &&
                (el.trx_type === "PR" || el.trx_type === "PM")
            )
        );
        setBatch(grouped);
      }
    } catch (error) {}
  };

  const getBtch = async () => {
    const config = {
      ...endpoints.batch,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setBtch(data);
      }
    } catch (error) {}
  };

  const getPhj = async () => {
    const config = {
      ...endpoints.phj,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setPhj(data);
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
    batch?.forEach((el) => {
      phj?.forEach((ek) => {
        if (ek.batch_id.bcode === el.trx_code) {
          let prd = [
            {
              btc: el.trx_code,
              type: "header",
              value: {
                prod: "Produk",
                msn: "Mesin",
                dep: "Departemen",
                qty: "",
                plan: "Planning",
                jadi: "Hasil Jadi",
                prc: "Harga",
                total: "Total",
              },
            },
          ];

          let dt = new Date(`${el?.trx_date}Z`);
          if (dt >= filtDate[0] && dt <= filtDate[1]) {
            // if (selectedBatch?.trx_code === el.trx_code) {
            btch?.forEach((ej) => {
              if (ej.bcode === ek.batch_id.bcode) {
                let msin = [];
                let qty_total = 0;
                let hpok_total = 0;
                let plan_total = 0;
                let jadi_total = 0;
                let bahan_total = 0;
                let prc_total = 0;
                let form_total = 0;
                let used_total = 0;
                let total = 0;

                ej?.plan_id?.mesin?.forEach((ei) => {
                  msin.push(ei.mch_id.msn_name);
                });

                ej?.plan_id?.product?.forEach((ei, i) => {
                  stCard?.forEach((eh) => {
                    if (
                      ej.bcode === eh.trx_code &&
                      ei.prod_id.id === eh.prod_id.id
                    ) {
                      prd.push({
                        btc: el.trx_code,
                        type: "item",
                        value: {
                          prod: ei.prod_id.name,
                          msn: msin.join(", "),
                          dep: `${ej.dep_id.ccost_code}-${ej.dep_id.ccost_name}`,
                          qty: "",
                          plan: ei.qty * ej.plan_id.total,
                          jadi: ek.product[i].qty,
                          prc: `Rp. ${formatIdr(eh.trx_hpok / eh.trx_qty)}`,
                          total: `Rp. ${formatIdr(eh.trx_hpok)}`,
                        },
                      });
                      qty_total += ei.qty;
                      plan_total += ei.qty * ej.plan_id.total;
                      jadi_total += ek.product[i].qty;
                      hpok_total += eh.trx_hpok / eh.trx_qty;
                      total += eh.trx_hpok;
                    }
                  });
                });

                prd.push({
                  btc: el.trx_code,
                  type: "footer",
                  value: {
                    prod: "Sub Total",
                    msn: "",
                    dep: "",
                    qty: "",
                    plan: plan_total,
                    jadi: jadi_total,
                    prc: `Rp. ${formatIdr(hpok_total)}`,
                    total: `Rp. ${formatIdr(total)}`,
                  },
                });

                prd.push({
                  btc: el.trx_code,
                  type: "header",
                  value: {
                    prod: "",
                    msn: "",
                    dep: "",
                    qty: "",
                    plan: "",
                    jadi: "",
                    prc: "",
                    total: "",
                  },
                });

                prd.push({
                  btc: el.trx_code,
                  type: "header",
                  value: {
                    prod: "Bahan",
                    msn: "",
                    dep: "",
                    qty: "",
                    plan: "Formula",
                    jadi: "Pemakaian",
                    prc: "Harga",
                    total: "Total",
                  },
                });

                ej.plan_id.material.forEach((ei) => {
                  stCard?.forEach((eh) => {
                    if (
                      ej.bcode === eh.trx_code &&
                      ei.prod_id.id === eh.prod_id.id
                    ) {
                      prd.push({
                        btc: el.trx_code,
                        type: "item",
                        value: {
                          prod: ei.prod_id.name,
                          msn: "",
                          dep: "",
                          qty: "",
                          plan: ei.qty,
                          jadi: ei.qty * ej.plan_id.total,
                          prc: `Rp. ${formatIdr(eh.trx_hpok / eh.trx_qty)}`,
                          total: `Rp. ${formatIdr(eh.trx_hpok)}`,
                        },
                      });
                      bahan_total += eh.trx_hpok;
                      prc_total += eh.trx_hpok / eh.trx_qty;
                      used_total += ei.qty * ej.plan_id.total;
                      form_total += ei.qty;
                    }
                  });
                });

                prd.push({
                  btc: el.trx_code,
                  type: "footer",
                  value: {
                    prod: "Sub Total",
                    msn: "",
                    dep: "",
                    qty: "",
                    plan: form_total,
                    jadi: used_total,
                    prc: `Rp. ${formatIdr(prc_total)}`,
                    total: `Rp. ${formatIdr(bahan_total)}`,
                  },
                });
              }
            });
            // }
          }
          data.push(prd);
        }
      });
    });
    console.log(data);

    let final = [
      {
        columns: [
          {
            title: "Material Usage Report",
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
            title: `Period ${formatDate(filtDate[0])} to ${formatDate(
              filtDate[1]
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
      let item_prd = [];
      let item_mtr = [];
      el.forEach((ek) => {
        item_prd.push([
          {
            value: ek.value.prod,
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
            value: ek.value.msn,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: ek.value.dep,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: ek.value.qty,
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
            value: ek.value.plan,
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
            value: ek.value.jadi,
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
            value: ek.value.prc,
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
            value: ek.value.total,
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

        item_mtr.push([
          {
            value: ek.value.prod,
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
            value: ek.value.msn,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: ek.value.dep,
            style: {
              font: { sz: "14", bold: ek.type === "header" ? true : false },
              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: ek.value.qty,
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
            value: ek.value.plan,
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
            value: ek.value.jadi,
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
            value: ek.value.prc,
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
            value: ek.value.total,
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

      item_prd.push([
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
            title: `${el[0].btc}`,
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
            width: { wch: 27 },
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
            width: { wch: 27 },
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
        ],
        data: item_prd,
        data: item_mtr,
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
            <div className="p-inputgroup col-6">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar" />
              </span>
              <Calendar
                value={filtDate}
                id="range"
                onChange={(e) => {
                  console.log(e.value);
                  setFiltDate(e.value);
                }}
                selectionMode="range"
                placeholder="Pilih Tanggal"
                readOnlyInput
                dateFormat="dd-mm-yy"
              />
            </div>
            <div className="col-4">
              <Dropdown
                value={selectedBatch ?? null}
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
            </div>
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`pemakaian_bahan_report_export_${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={stCard ? jsonForExcel(stCard, true) : null}
                name="Material Usage Report"
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
                  tittle={"Pemakaian Bahan"}
                  subTittle={`Pemakaian Bahan as of ${formatDate(
                    filtDate[0]
                  )} to ${formatDate(filtDate[1])}`}
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
                                e.props.value ? e.props?.value[0]?.btc : null
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
                                  {e.value.msn}
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
                                  {e.value.dep}
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
                                  {e.value.qty}
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
                                  {e.value.plan}
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
                                  {e.value.jadi}
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
                                  {e.value.total}
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

export default KartuWIP;