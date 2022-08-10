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

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const KartuWIP = () => {
  const [wip, setWip] = useState(null);
  const [selectedProduct, setSelected] = useState(null);
  const [stCard, setStCard] = useState(null);
  const printPage = useRef(null);
  const [filtersDate, setFiltersDate] = useState([new Date(), new Date()]);
  const chunkSize = 30;
  const [cp, setCp] = useState("");

  const dummy = Array.from({ length: 10 });

  useEffect(() => {
    var d = new Date();
    d.setDate(d.getDate() - 7);
    setFiltersDate([d, new Date()]);
    getWip();
  }, []);

  const getWip = async () => {
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
        setWip(grouped);
      }
    } catch (error) {}
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="col-6 ml-0 mr-0 pl-0">
          <Row className="m-0">
            <div className="col-5 mr-3 p-0">
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
            <div className="">
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
                name="Report WIP"
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
        {chunk(jsonForExcel(stCard) ?? [], chunkSize)?.map((val, idx) => {
          return (
            <Card className="ml-1 mr-1 mt-2">
              <Card.Body className="p-0">
                <CustomeWrapper
                  tittle={"Stock Card Report"}
                  subTittle={`WIP Card Report for Period ${formatDate(
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
                        className="mt-4"
                      >
                        <Column
                          className=""
                          header="Transaction Code"
                          style={{ width: "11rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" || e.type === "footer"
                                  ? "font-weight-bold"
                                  : ""
                              }
                            >
                              {e.value.trx_code}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          header="Transaction Date"
                          style={{ width: "11" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" && "font-weight-bold"
                              }
                            >
                              {e.value.trx_date}
                            </div>
                          )}
                        />
                        <Column
                          className=""
                          header="Product"
                          style={{ minWidht: "20rem" }}
                          body={(e) => (
                            <div
                              className={
                                e.type === "header" && "font-weight-bold"
                              }
                            >
                              {e.value.product}
                            </div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header="Type"
                          style={{ minWidht: "10rem" }}
                          body={(e) => (
                            <div className="text-center">
                              {e.value.trx_type}
                            </div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header="Debit"
                          style={{ minWidht: "10rem" }}
                          body={(e) => (
                            <div className="text-right">
                              {e.value.trx_debit}
                            </div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header="Kredit"
                          style={{ minWidht: "10rem" }}
                          body={(e) => (
                            <div className="text-right">
                              {e.value.trx_kredit}
                            </div>
                          )}
                        />
                        <Column
                          className="header-center"
                          header="Saldo"
                          style={{ minWidht: "10rem" }}
                          body={(e) => (
                            <div className={"text-right"}>{e.value.sld}</div>
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

export default KartuWIP;
