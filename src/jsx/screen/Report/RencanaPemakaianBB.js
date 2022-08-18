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
import { el } from "date-fns/locale";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const RencanaPemakaianBB = () => {
  const [wip, setWip] = useState(null);
  const [locat, setLocat] = useState(null);
  const [selectedPlan, setSelected] = useState(null);
  const [selectedLocat, setSelectedLoc] = useState(null);
  const [rpBB, setRpBB] = useState(null);
  const printPage = useRef(null);
  const [filtersDate, setFiltersDate] = useState([new Date(), new Date()]);
  const chunkSize = 30;
  const [cp, setCp] = useState("");

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    var d = new Date();
    d.setDate(d.getDate() - 7);
    setFiltersDate([d, new Date()]);
    getRencana();
    getLoc();
  }, []);

  const getRencana = async () => {
    const config = {
      ...endpoints.rpbb,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setRpBB(data);
        let grouped = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.pl_id?.id === ek?.pl_id?.id)
        );
        setWip(grouped);
      }
    } catch (error) {}
  };

  const getLoc = async () => {
    const config = {
      ...endpoints.rpbb,
      data: {},
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        const { data } = response;
        setRpBB(data);
        let grouped = data?.filter(
          (el, i) =>
            i === data.findIndex((ek) => el?.loc_id?.id === ek?.loc_id?.id)
        );
        setLocat(grouped);
      }
    } catch (error) {}
  };

  const jsonForExcel = (rpBB, excel = false) => {
    let data = [];
    // if (selectedPlan && selectedLocat && filtersDate[0] && filtersDate[1] ) {
    rpBB?.forEach((el) => {
      if (selectedPlan?.pl_id?.pcode === el?.pl_id?.pcode) {
        let dt = new Date(`${el?.date_created}Z`);
        if (dt >= filtersDate[0] && dt <= filtersDate[1]) {
          data.push({
            type: "item",
            value: {
              pl_id: el.pl_id?.pcode,
              prd_code: el.prod_id?.code,
              prd_name: el.prod_id?.name,
              sld: el.saldo,
              form: el.plan,
              sisa_sld: el.sisa,
              sugest: el.sugestion,
            },
          });
        }
      }
    });
    // }

    let item = [];

    data.forEach((el) => {
      item.push([
        {
          value: el.value.pl_id,
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: el.value.prd_code,
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: el.value.prd_name,
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "left", vertical: "center" },
          },
        },
        {
          value: el.value.sld,
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "center", vertical: "center" },
          },
        },
        {
          value: el.value.form,
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: el.value.sisa_sld,
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
        {
          value: el.value.sugest,
          style: {
            font: { sz: "14", bold: false },
            alignment: { horizontal: "right", vertical: "center" },
          },
        },
      ]);
    });

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

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-8 ml-0 mr-0 pl-0">
          <Row className="m-0">
            <div className="col-4 mr-0 p-0">
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
            <div className="col-3 p-0 ml-3">
              <div className="p-inputgroup">
                <Dropdown
                  value={selectedPlan ?? null}
                  options={wip}
                  onChange={(e) => {
                    setSelected(e.value);
                  }}
                  placeholder="Pilih Kode Planning"
                  optionLabel="pl_id.pcode"
                  filter
                  filterBy="pl_id.pcode"
                  showClear
                />
              </div>
            </div>
          </Row>
        </div>
        <div style={{ height: "1rem" }}></div>
        <Row className="mr-1 mt-2" style={{ height: "3rem" }}>
          <div className="mr-3">
            <ExcelFile
              filename={`card_rpbb_report_export_${new Date().getTime()}`}
              element={
                <PrimeSingleButton
                  label="Excel"
                  icon={<i class="pi pi-file-excel px-2"></i>}
                />
              }
            >
              <ExcelSheet
                dataSet={rpBB ? jsonForExcel(rpBB, true) : null}
                name="Laporan Rencana Pemakaian Bahan Baku"
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
        {chunk(jsonForExcel(rpBB) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0">
                <CustomeWrapper
                  tittle={"Raw Material Usage Plan Report"}
                  subTittle={`Raw Material Usage Plan Report for Date Plan ${formatDate(
                    filtersDate[0]
                  )} - ${formatDate(filtersDate[1])}`}
                  subTittle1={
                    selectedPlan
                      ? `Lokasi Gudang : ${rpBB[0].loc_id.name}`
                      : null
                  }
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
                        className="mt-4"
                      >
                        <Column
                          className=""
                          header="Planning Code"
                          style={{ width: "11rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.pl_id}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          header="Product Code"
                          style={{ width: "11" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" && "font-weight-bold"
                              }
                            >
                              {e.value.prd_code}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          header="Product Name"
                          style={{ minWidht: "20rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" && "font-weight-bold"
                              }
                            >
                              {e.value.prd_name}
                            </div>
                          )}
                          s
                        />
                        <Column
                          className="header-center"
                          header="Product Balance"
                          style={{ minWidht: "10rem" }}
                          body={(e) => (
                            <div className="text-center">{e.value.sld}</div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header="Usage Plan"
                          style={{ minWidht: "10rem" }}
                          body={(e) => (
                            <div className="text-right">{e.value.form}</div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header="Remain Balance"
                          style={{ minWidht: "10rem" }}
                          body={(e) => (
                            <div className="text-right">{e.value.sisa_sld}</div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header="Purchase Advice"
                          style={{ minWidht: "10rem" }}
                          body={(e) => (
                            <div className={"text-right"}>{e.value.sugest}</div>
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

export default RencanaPemakaianBB;
