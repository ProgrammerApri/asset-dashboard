import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";
import ReactExport from "react-data-export";
import ReactToPrint from "react-to-print";
import { el } from "date-fns/locale";
import CustomeWrapper from "src/jsx/components/CustomeWrapper/CustomeWrapper";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";
import { Link } from "react-router-dom";
import { tr } from "src/data/tr";
import { MultiSelect } from "primereact/multiselect";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const KBBRincian = ({ month, year, accId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAcc, setSelected] = useState(null);
  const printPage = useRef(null);
  const [filtDate, setFiltDate] = useState([
    month && year ? new Date(year, month - 1, 1) : new Date(),
    month && year ? new Date(year, month - 1, 1) : new Date(),
  ]);
  const [account, setAcc] = useState(null);
  const [accDdb, setAccDdb] = useState(null);
  const [option, setOpAcc] = useState(null);
  const [trans, setTrans] = useState(null);
  const [saldo, setSaldo] = useState(null);
  const [cp, setCp] = useState("");
  const chunkSize = 12;

  useEffect(() => {
    if (month && year) {
      let last = getMonthlyDates(new Date(new Date().getFullYear(), 0, 31), 12);
      setFiltDate([
        filtDate[0],
        new Date(
          filtDate[0].getFullYear(),
          filtDate[0].getMonth(),
          last[filtDate[0].getMonth()].getDate()
        ),
      ]);
    } else {
      var d = new Date();
      d.setDate(d.getDate() - 31);
      setFiltDate([d, new Date()]);
    }

    getAcc(accId);
    getTrans();
    getSaldo();
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

  const getAccDdb = async () => {
    const config = {
      ...endpoints.posting,
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setAccDdb(data);
        // jsonForExcel(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTrans = async (acc) => {
    const config = {
      ...endpoints.trans,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setTrans(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAcc = async (id) => {
    const config = {
      ...endpoints.account,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        let filt = [];
        data.forEach((el) => {
          if (el.account.dou_type === "D") {
            filt.push(el);
          }
        });
        setAcc(filt);

        if (id) {
          filt.forEach((el) => {
            if (el.account.id === Number(id)) {
              setSelected([el]);
            }
          });
        }
        // getTrans(data);
      }
    } catch (error) {
      console.log(error);
    }

    getAccDdb();
  };

  const getSaldo = async (acc) => {
    const config = {
      ...endpoints.saldo_sa_gl,
      data: {},
    };
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setSaldo(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) => {
    if (typeof date === "string") {
      var d = new Date(`${date}Z`),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();
    } else {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();
    }

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  const jsonForExcel = (accDdb, excel = false) => {
    let data = [];

    let temp = [];

    let month = [];

    accDdb?.forEach((ej) => {
      if (
        filtDate[0]?.getFullYear() >= ej.acc_year &&
        filtDate[0]?.getMonth() + 1 >= ej.acc_month &&
        filtDate[1]?.getFullYear() >= ej.acc_year &&
        filtDate[1]?.getMonth() + 1 >= ej.acc_month
      ) {
        month.push(ej.acc_month);
      }
    });

    if (selectedAcc?.length) {
      selectedAcc?.forEach((slc) => {
        let dt = [];
        let db = 0;
        let kr = 0;
        let sa = 0;
        let bl = 0;
        let deb = 0;
        let kre = 0;
        let cd = [];
        let des = [];
        let sld = 0;

        let trn = [
          {
            type: "header",
            value: {
              ref: tr[localStorage.getItem("language")]?.kd_tran,
              date: tr[localStorage.getItem("language")]?.tgl,
              debe: tr[localStorage.getItem("language")]?.mut_deb,
              kred: tr[localStorage.getItem("language")]?.mut_kred,
              blce: tr[localStorage.getItem("language")]?.sldo,
              desc: tr[localStorage.getItem("language")]?.ket,
            },
          },
        ];

        accDdb?.forEach((el) => {
          if (slc?.account?.id === el?.acc_code?.id) {
            if (
              el.acc_year >= filtDate[0]?.getFullYear() &&
              el.acc_year <= filtDate[1]?.getFullYear()
            ) {
              if (Math.max(...month) == el.acc_month) {
                sa += el.acc_awal;
                db += el.acc_debit;
                kr += el.acc_kredit;
                bl += el.acc_akhir;
              }
            }
          }
        });

        trans?.forEach((element) => {
          dt = new Date(`${element?.trx_date}Z`);
          if (slc?.account?.id == element?.acc_id?.id) {
            // if (element?.acc_id?.id === el.acc_code?.id) {
            if (dt.getMonth() === filtDate[0].getMonth()) {
              if (
                dt >=
                  new Date(
                    filtDate[0].getFullYear(),
                    filtDate[0].getMonth(),
                    1
                  ) &&
                dt <=
                  new Date(
                    filtDate[0].getFullYear(),
                    filtDate[0].getMonth(),
                    filtDate[0].getDate() - 1
                  )
              ) {
                if (element?.acc_id.sld_type === "D") {
                  if (element?.trx_dbcr === "D") {
                    sld += element?.trx_amnt;
                  } else {
                    sld -= element?.trx_amnt;
                  }
                } else {
                  if (element?.trx_dbcr === "K") {
                    sld += element?.trx_amnt;
                  } else {
                    sld -= element?.trx_amnt;
                  }
                }
              }
            }
            // }
          }
        });

        let blc = sa + sld;
        let total_db = 0;
        let total_kr = 0;
        trans?.forEach((element) => {
          if (slc?.account?.id == element?.acc_id?.id) {
            // if (element?.acc_id?.id === el.acc_code?.id) {
            dt = new Date(`${element?.trx_date}Z`);
            dt?.setHours(0, 0, 0, 0);
            filtDate[0]?.setHours(0, 0, 0, 0);
            filtDate[1]?.setHours(0, 0, 0, 0);
            if (dt >= filtDate[0] && dt <= filtDate[1]) {
              deb = element.trx_dbcr === "D" ? element.trx_amnt : 0;
              kre = element.trx_dbcr === "K" ? element.trx_amnt : 0;
              cd = element.trx_code;
              des = element.trx_desc;

              if (element?.acc_id?.sld_type === "D") {
                blc += deb - kre;
              } else {
                blc += kre - deb;
              }

              // blc += deb - kre;

              trn.push({
                type: "item",
                value: {
                  ref: cd,
                  date: formatDate(dt),
                  // acco: ac,
                  debe: `${formatIdr(deb)}`,
                  kred: `${formatIdr(kre)}`,
                  desc: des,
                  blce: `${formatIdr(blc)}`,
                },
              });
              // total_bl = blc;
              total_db += deb;
              total_kr += kre;
            }
            // }
          }
        });

        trn.push({
          type: "footer",
          value: {
            ref: "Total",
            date: "",
            // acco: "",
            debe: `${formatIdr(total_db)}`,
            kred: `${formatIdr(total_kr)}`,
            blce: "",
            desc: "",
          },
        });

        data.push({
          header: [
            {
              acco:
                slc === null
                  ? "-"
                  : `${slc?.account?.acc_name} (${slc?.account?.acc_code})`,
              slda: slc === null ? "-" : `${formatIdr(sa)}`,
            },
          ],

          trn: trn,
        });
        // if (sld !== 0) {
        //   data.header = [
        //     ...data.header,
        //     {
        //       acco: `Transaksi Dari ${formatDate(
        //         new Date(filtDate[0]?.getFullYear(), filtDate[0]?.getMonth(), 1)
        //       )} - ${formatDate(
        //         new Date(
        //           filtDate[0]?.getFullYear(),
        //           filtDate[0]?.getMonth(),
        //           filtDate[0]?.getDate() - 1
        //         )
        //       )}`,
        //       slda: `Rp. ${formatIdr(sld)}`,
        //     },
        //     {
        //       acco: "Total",
        //       slda: `Rp. ${formatIdr(sa + sld)}`,
        //     },
        //   ];
        // }
      });
    }

    let final = [
      {
        columns: [
          {
            title: "General Ledger Detail",
            width: { wch: 40 },
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
            title: `Periode ${formatDate(filtDate[0])} to ${formatDate(
              filtDate[1]
            )}`,
            width: { wch: 40 },
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
    item.push([
      {
        value: ``,
        style: {
          font: {
            sz: "14",
            bold: true,
          },
          alignment: { horizontal: "left", vertical: "center" },
          fill: {
            paternType: "solid",
            fgColor: { rgb: "F3F3F3" },
          },
        },
      },
    ]);

    data?.forEach((element) => {
      item.push([
        {
          value: `Account`,
          style: {
            font: {
              sz: "14",
              bold: true,
            },
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
            font: {
              sz: "14",
              bold: false,
            },
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
            font: {
              sz: "14",
              bold: false,
            },
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
            font: {
              sz: "14",
              bold: false,
            },
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
            font: {
              sz: "14",
              bold: false,
            },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
        {
          value: `Begining Balance`,
          style: {
            font: {
              sz: "14",
              bold: true,
            },
            alignment: { horizontal: "right", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
      ]);

      element?.header?.forEach((el) => {
        item.push([
          {
            value: el.acco,
            style: {
              font: {
                sz: "14",
                bold: true,
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
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: "",
            style: {
              font: {
                sz: "14",
                bold: false,
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: "",
            style: {
              font: {
                sz: "14",
                bold: false,
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: el?.slda,
            style: {
              font: {
                sz: "14",
                bold: true,
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
        ]);
      });

      item.push([
        {
          value: "Transaction Details",
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
            height: { wch: 19 },
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
            height: { wch: 25 },
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
            height: { wch: 25 },
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
            height: { wch: 25 },
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
            height: { wch: 30 },
            font: { sz: "14", bold: true },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              paternType: "solid",
              fgColor: { rgb: "F3F3F3" },
            },
          },
        },
      ]);

      element?.trn?.forEach((ek) => {
        item.push([
          {
            value: ek.value.ref,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },

              alignment: { horizontal: "left", vertical: "center" },
            },
          },
          {
            value: ek.value.date,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "center", vertical: "center" },
            },
          },
          {
            value: ek.value.debe,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: ek.value.kred,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: ek.value.blce,
            style: {
              font: {
                sz: "14",
                bold: ek.type === "header" || ek.type === "footer",
              },
              alignment: { horizontal: "right", vertical: "center" },
            },
          },
          {
            value: ek.value.desc,
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
    });

    final.push({
      columns: [],
      data: item,
    });
    console.log(data);

    if (excel) {
      return final;
    } else {
      let page = [];

      data?.forEach((el) => {
        el?.header?.forEach((elem) => {
          el?.trn?.forEach((element) => {
            page?.push({ ...element, head: elem });
          });
        });
      });

      console.log("page", page);
      return page;
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
          ? `${option.account?.acc_name} - ${option.account?.acc_code}`
          : ""}
      </div>
    );
  };

  const valTemp = (option, props) => {
    if (option) {
      return (
        <div>
          {option !== null
            ? `${option.account?.acc_name} - ${option.account?.acc_code}`
            : ""}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-6 ml-0 mr-0 pl-0">
          <Row className="m-0">
            <div className="col-5 mr-3 p-0 mt-2">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-calendar" />
                </span>
                <Calendar
                  value={filtDate}
                  id="range"
                  onChange={(e) => {
                    console.log(filtDate[0].setHours(0, 0, 0, 0));
                    setFiltDate(e.value);
                  }}
                  selectionMode="range"
                  placeholder={tr[localStorage.getItem("language")]?.pilih_tgl}
                  readOnlyInput
                  dateFormat="dd/mm/yy"
                />
              </div>
            </div>
            <div className="p-inputgroup col-4">
              <MultiSelect
                value={selectedAcc ?? null}
                options={account}
                onChange={(e) => {
                  setSelected(e.value);
                }}
                placeholder={tr[localStorage.getItem("language")]?.pilih_acc}
                optionLabel="account.acc_name"
                itemTemplate={glTemplate}
                valueTemplate={valTemp}
                filter
                filterBy="account.acc_name"
                showClear
                display="chip"
                // className="w-full md:w-15rem"
                maxSelectedLabels={3}
              />
            </div>
          </Row>
        </div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`gl_detail_report_export_${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={accDdb ? jsonForExcel(accDdb, true) : null}
                name="GL Detail Report"
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
        {chunk(jsonForExcel(accDdb) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <div key={idx} className={"shadow p-0 mb-4 col-12"}>
              <CustomeWrapper
                horizontal
                viewOnly
                tittle={tr[localStorage.getItem("language")]?.kbb_rincian}
                subTittle={`${
                  tr[localStorage.getItem("language")]?.kbb_rincian
                } Periode ${formatDate(filtDate[0])} to ${formatDate(
                  filtDate[1]
                )}`}
                onComplete={(cp) => setCp(cp)}
                page={idx + 1}
                body={
                  <>
                    {val?.map((v) => {
                      if (v?.type == "header") {
                        return (
                          <>
                            <div className="header-report single row p-0 m-0 mt-5">
                              <div className="col-3">{"Account"}</div>
                              <div className="col-2">{""}</div>
                              <div className="col-2">{""}</div>
                              <div className="col-1">{""}</div>
                              <div className="col-1">{""}</div>
                              <div className="col-3 text-right">
                                {"Beginning Balance"}
                              </div>
                            </div>

                            <div className="item-report row m-0">
                              <div className="col-3">{v?.head.acco}</div>
                              <div className="col-2">{""}</div>
                              <div className="col-2">{""}</div>
                              <div className="col-1">{""}</div>
                              <div className="col-1">{""}</div>
                              <div className="col-3 text-right">
                                {v?.head.slda}
                              </div>
                            </div>

                            <div className="header-report single p-0 row m-0">
                              <div className="col-2">{v.value.ref}</div>
                              <div className="col-1">{v.value.date}</div>
                              <div className="col-2 text-right">
                                {v.value.debe}
                              </div>
                              <div className="col-2 text-right">
                                {v.value.kred}
                              </div>
                              <div className="col-2 text-right">
                                {v.value.blce}
                              </div>
                              <div className="col-3 text-right">
                                {v.value.desc}
                              </div>
                            </div>
                          </>
                        );
                      } else if (v.type === "item") {
                        return (
                          <>
                            <div className="item-report row m-0">
                              <div className="col-2">
                                <Link
                                  to={`/laporan/jurnal/${btoa(
                                    btoa(JSON.stringify({ trx: v.value.ref }))
                                  )}`}
                                >
                                  {v.value.ref}
                                </Link>
                              </div>

                              <div className="col-1">{v.value.date}</div>
                              <div className="col-2 text-right">
                                {v.value.debe}
                              </div>
                              <div className="col-2 text-right">
                                {v.value.kred}
                              </div>
                              <div className="col-2 text-right">
                                {v.value.blce}
                              </div>
                              <div className="col-3 text-right">
                                {v.value.desc}
                              </div>
                            </div>
                          </>
                        );
                      } else if (v?.type === "footer") {
                        return (
                          <>
                            <div className="footer-report row m-0">
                              <div className="col-2">{v.value.ref}</div>
                              <div className="col-1">{v.value.date}</div>
                              <div className="col-2 text-right">
                                {v.value.debe}
                              </div>
                              <div className="col-2 text-right">
                                {v.value.kred}
                              </div>
                              <div className="col-2 text-right">
                                {v.value.blce}
                              </div>
                              <div className="col-3 text-right">
                                {v.value.desc}
                              </div>
                            </div>
                          </>
                        );
                      }
                    })}
                  </>
                }
              />
            </div>
          );
        })}
      </Row>

      <Row className="m-0 justify-content-center d-none">
        <Card className="ml-1 mr-1 mt-2">
          <Card.Body className="p-0">
            <CustomeWrapper
              tittle={"Rincian Kartu Buku Besar"}
              subTittle={`Rincian Kartu Buku Besar Periode ${formatDate(
                filtDate[0]
              )} to ${formatDate(filtDate[1])}`}
              onComplete={(cp) => setCp(cp)}
              body={
                <>
                  <DataTable
                    responsiveLayout="none"
                    value={jsonForExcel(accDdb).header}
                    showGridlines
                    dataKey="id"
                    rowHover
                    emptyMessage={
                      tr[localStorage.getItem("language")]?.dt_tidak_ada
                    }
                  >
                    <Column
                      className="header-center"
                      header="Akun"
                      style={{ minWidth: "20rem" }}
                      field={(e) => (
                        <div className="font-weight-bold text-left">
                          {e.acco}
                        </div>
                      )}
                    />
                    <Column
                      className="header-right text-right"
                      header={(e) => (
                        <div className="ml-4 text-right">Saldo Awal</div>
                      )}
                      style={{ width: "15rem" }}
                      field={(e) => (
                        <div className="font-weight-bold text-right">
                          {e.slda}
                        </div>
                      )}
                    />
                  </DataTable>

                  <DataTable
                    responsiveLayout="none"
                    value={
                      jsonForExcel(accDdb)?.trn?.length > 2
                        ? jsonForExcel(accDdb).trn
                        : []
                    }
                    showGridlines
                    dataKey="id"
                    rowHover
                    emptyMessage="Tidak ada transaksi"
                  >
                    <Column
                      header={(e) => (
                        <div className="text-left">Detail Transaksi</div>
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
                          {e.value.ref}
                        </div>
                      )}
                    />
                    <Column
                      style={{ minWidth: "7rem" }}
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
                          {e.value.date}
                        </div>
                      )}
                    />
                    <Column
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
                          {e.value.debe}
                        </div>
                      )}
                    />
                    <Column
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
                          {e.value.kred}
                        </div>
                      )}
                    />
                    <Column
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
                          {e.value.blce}
                        </div>
                      )}
                    />
                    <Column
                      style={{ minWidth: "15rem" }}
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
                          {e.value.desc}
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

export default KBBRincian;
